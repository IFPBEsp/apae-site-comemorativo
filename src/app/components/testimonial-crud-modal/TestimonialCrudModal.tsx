"use client";

import { Modal, Form, Input, Button, List, message, Spin, Typography, DatePicker, Select } from "antd";
import { DeleteOutlined, EditOutlined, LoadingOutlined } from "@ant-design/icons";
import { useState, useEffect, useCallback } from "react";
import dayjs from "dayjs";

const { Title } = Typography;

const getAuthToken = (): string | null => {
	if (typeof window !== "undefined") {
		return localStorage.getItem("authToken");
	}
	return null;
};

interface TestimonialCrudModalProps {
	open: boolean;
	onClose: () => void;
}

interface Testimonial {
	id: string;
	name: string;
	content: string;
	date: string;
	role?: string;
}

interface TestimonialFormValues {
	id?: string;
	name: string;
	content: string;
	date: dayjs.Dayjs;
	role: string;
}

interface Meta {
	totalItems: number;
	totalPages: number;
	currentPage: number;
	itemsPerPage: number;
}

export default function TestimonialCrudModal({ open, onClose }: TestimonialCrudModalProps) {
	const [form] = Form.useForm<TestimonialFormValues>();
	const [testimonialList, setTestimonialList] = useState<Testimonial[]>([]);
	const [isEditing, setIsEditing] = useState<boolean>(false);
	const [currentEditItem, setCurrentEditItem] = useState<Testimonial | null>(null);
	const [isLoading, setIsLoading] = useState<boolean>(false);

	const [currentPage, setCurrentPage] = useState<number>(1);
	const [pageSize, setPageSize] = useState<number>(5);
	const [totalItems, setTotalItems] = useState<number>(0);

	const resetForm = () => {
		form.resetFields();
		form.setFieldsValue({ role: "Pai de Aluno" });
		setIsEditing(false);
		setCurrentEditItem(null);
	};

	const handleCloseModal = () => {
		resetForm();
		onClose();
	};

	const fetchTestimonials = useCallback(async (page = currentPage, limit = pageSize) => {
		if (!open) return;
		setIsLoading(true);

		try {
			const token = getAuthToken();
			if (!token) {
				setTestimonialList([]);
				setTotalItems(0);
				message.warning("Token de autenticação ausente. Faça login.");
				return;
			}

			const response = await fetch(`/api/testimonials?page=${page}&limit=${limit}`, {
				method: "GET",
				headers: { "Authorization": `Bearer ${token}` }
			});

			if (!response.ok) {
				const errorData = await response.json();
				throw new Error(errorData.message || `Falha ao carregar a lista: ${response.status}`);
			}

			const data = await response.json();
			const { data: testimonials, meta } = data as { data: Testimonial[], meta: Meta };

			setTestimonialList(testimonials);
			setTotalItems(meta.totalItems);
			setCurrentPage(meta.currentPage);
			setPageSize(meta.itemsPerPage);

		} catch (error) {
			console.error("Erro ao buscar depoimentos:", error);
			message.error(`Não foi possível carregar a lista: ${(error as Error).message || "Erro desconhecido"}`);
		} finally {
			setIsLoading(false);
		}
	}, [open, currentPage, pageSize]);

	useEffect(() => {
		if (open) {
			fetchTestimonials(1, pageSize);
		}
	}, [open, fetchTestimonials, pageSize]);

	const handlePageChange = (page: number, newPageSize: number) => {
		if (newPageSize !== pageSize || page !== currentPage) {
			fetchTestimonials(page, newPageSize);
		}
	};

	const handleFormSubmit = async (values: TestimonialFormValues) => {
		setIsLoading(true);

		const endpoint = isEditing && currentEditItem
			? `/api/testimonials/${currentEditItem.id}`
			: "/api/testimonials";

		const method = isEditing ? "PUT" : "POST";

		console.log("🔍 DEBUG - Dados do formulário:", values);

		try {
			const token = getAuthToken();
			if (!token) {
				throw new Error("Usuário não autenticado. Faça login novamente.");
			}

			const payload = {
				name: values.name,
				content: values.content,
				date: values.date.toISOString(),
				role: values.role,
				isPublished: true
			};

			console.log("📤 DEBUG - Payload enviado:", payload);

			const response = await fetch(endpoint, {
				method: method,
				body: JSON.stringify(payload),
				headers: {
					"Authorization": `Bearer ${token}`,
					"Content-Type": "application/json"
				}
			});

			if (!response.ok) {
				const errorData = await response.json();
				throw new Error(errorData.message || `Falha na operação: ${response.status}`);
			}

			message.success(`Depoimento ${isEditing ? "atualizado" : "adicionado"} com sucesso!`);
			resetForm();
			await fetchTestimonials(1, pageSize);

		} catch (error) {
			console.error("Erro ao salvar depoimento:", error);
			message.error(`Erro ao salvar depoimento: ${(error as Error).message || "Verifique o console para mais detalhes."}`);
		} finally {
			setIsLoading(false);
		}
	};

	const handleDelete = async (id: string) => {
		if (!window.confirm("Tem certeza que deseja remover este depoimento? Esta ação é irreversível.")) return;

		setIsLoading(true);

		try {
			const token = getAuthToken();
			if (!token) {
				throw new Error("Usuário não autenticado. Faça login novamente.");
			}

			const response = await fetch(`/api/testimonials/${id}`, {
				method: "DELETE",
				headers: {
					"Authorization": `Bearer ${token}`
				}
			});

			if (response.status !== 204) {
				const errorData = await response.json();
				throw new Error(errorData.message || `Falha ao excluir. Status: ${response.status}`);
			}

			message.success("Depoimento excluído com sucesso!");

			await fetchTestimonials(currentPage, pageSize);

		} catch (error) {
			console.error("Erro ao deletar depoimento:", error);
			message.error(`Erro ao deletar depoimento: ${(error as Error).message || "Tente novamente."}`);
		} finally {
			setIsLoading(false);
		}
	};

	const handleEdit = (item: Testimonial) => {
		setIsEditing(true);
		setCurrentEditItem(item);
		form.setFieldsValue({
			name: item.name,
			content: item.content,
			date: dayjs(item.date),
			role: item.role || "Pai de Aluno"
		});
	};

	return (
		<Modal
			title={<Title level={4}>{isEditing ? "Editar Depoimento" : "Gerenciar Depoimentos"}</Title>}
			open={open}
			onCancel={handleCloseModal}
			footer={null}
			width={750}
			centered
		>
			<Spin spinning={isLoading} indicator={<LoadingOutlined style={{ fontSize: 24 }} spin />}>

				<Title level={5} style={{ marginTop: 0 }}>{isEditing ? `Atualizando: ${currentEditItem?.name}` : "Adicionar Novo Depoimento"}</Title>

				<Form
					form={form}
					layout="vertical"
					onFinish={handleFormSubmit}
					style={{ marginBottom: "30px" }}
				>
					<Form.Item
						label="Nome"
						name="name"
						rules={[{ required: true, message: "Obrigatório." }, { min: 3, message: "Mínimo 3 caracteres." }]}
					>
						<Input placeholder="Nome da pessoa" />
					</Form.Item>

					<Form.Item
						label="Tipo de Relacionamento"
						name="role"
						rules={[{ required: true, message: "Obrigatório." }]}
					>
						<Select placeholder="Selecione o tipo">
							<Select.Option value="Pai de Aluno">Pai de Aluno</Select.Option>
							<Select.Option value="Mãe de Aluno">Mãe de Aluno</Select.Option>
							<Select.Option value="Responsável">Responsável</Select.Option>
							<Select.Option value="Ex-Aluno">Ex-Aluno</Select.Option>
							<Select.Option value="Voluntário">Voluntário</Select.Option>
							<Select.Option value="Funcionário">Funcionário</Select.Option>
							<Select.Option value="Parceiro">Parceiro</Select.Option>
							<Select.Option value="Comunidade">Membro da Comunidade</Select.Option>
						</Select>
					</Form.Item>

					<Form.Item
						label="Depoimento"
						name="content"
						rules={[{ required: true, message: "Obrigatório." }, { min: 10, message: "Mínimo 10 caracteres." }]}
					>
						<Input.TextArea rows={4} placeholder="Escreva o depoimento aqui..." />
					</Form.Item>

					<Form.Item
						label="Data"
						name="date"
						rules={[{ required: true, message: "Obrigatório." }]}
					>
						<DatePicker
							format="DD/MM/YYYY"
							placeholder="Selecione a data"
							style={{ width: "100%" }}
						/>
					</Form.Item>

					<Form.Item style={{ marginTop: 15 }}>
						<Button type="primary" htmlType="submit" style={{ marginRight: "10px" }} loading={isLoading} disabled={isLoading}>
							{isEditing ? "Salvar Edição" : "Adicionar Depoimento"}
						</Button>
						{isEditing && (
							<Button onClick={resetForm} disabled={isLoading}>
								Cancelar Edição
							</Button>
						)}
					</Form.Item>
				</Form>

				<Title level={5}>Depoimentos Cadastrados ({totalItems})</Title>
				<List
					bordered
					dataSource={testimonialList}
					renderItem={(item) => (
						<List.Item
							actions={[
								<Button
									key="list-edit"
									type="link"
									icon={<EditOutlined />}
									onClick={() => handleEdit(item)}
									disabled={isLoading}
								/>,
								<Button
									key="list-delete"
									type="link"
									danger
									icon={<DeleteOutlined />}
									onClick={() => handleDelete(item.id)}
									disabled={isLoading}
								/>
							]}
						>
							<List.Item.Meta
								title={item.name}
								description={
									<>
										<div style={{ fontStyle: "italic", color: "#1890ff", marginBottom: "8px" }}>
											{item.role || "Pai de Aluno"}
										</div>
										<div>{item.content}</div>
										<small style={{ color: "#999", display: "block", marginTop: "8px" }}>
											{new Date(item.date).toLocaleDateString("pt-BR")}
										</small>
									</>
								}
							/>
						</List.Item>
					)}
					pagination={{
						position: "bottom",
						current: currentPage,
						pageSize: pageSize,
						total: totalItems,
						onChange: handlePageChange,
						showSizeChanger: true,
						pageSizeOptions: ["5", "10", "20"],
						disabled: isLoading,
					}}
				/>
			</Spin>
		</Modal>
	);
}
