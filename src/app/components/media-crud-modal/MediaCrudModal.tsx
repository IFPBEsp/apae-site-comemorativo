"use client";

import { Modal, Form, Input, Button, Upload, List, message, Spin, Typography, UploadFile, Pagination } from "antd";
import { UploadOutlined, DeleteOutlined, EditOutlined, LoadingOutlined } from "@ant-design/icons";
import { useState, useEffect, useCallback } from "react";

const { Title, Text } = Typography;

const getAuthToken = (): string | null => {
	if (typeof window !== 'undefined') {
		return localStorage.getItem('authToken');
	}
	return null;
};

interface MediaCrudModalProps {
	open: boolean;
	onClose: () => void;
}

interface TimelineMedia {
	id: string;
	title: string;
	description: string;
	imageUrl: string;
	postDate: string;
}

interface MediaFormValues {
	id?: string;
	title: string;
	description: string;
	mediaFile?: { fileList: UploadFile[] } | UploadFile[] | null;
}

interface Meta {
	totalItems: number;
	totalPages: number;
	currentPage: number;
	itemsPerPage: number;
}

export default function MediaCrudModal({ open, onClose }: MediaCrudModalProps) {
	const [form] = Form.useForm<MediaFormValues>();
	const [mediaList, setMediaList] = useState<TimelineMedia[]>([]);
	const [isEditing, setIsEditing] = useState<boolean>(false);
	const [currentEditItem, setCurrentEditItem] = useState<TimelineMedia | null>(null);
	const [isLoading, setIsLoading] = useState<boolean>(false);

	const [currentPage, setCurrentPage] = useState<number>(1);
	const [pageSize, setPageSize] = useState<number>(5);
	const [totalItems, setTotalItems] = useState<number>(0);

	const resetForm = () => {
		form.resetFields();
		setIsEditing(false);
		setCurrentEditItem(null);
	};

	const handleCloseModal = () => {
		resetForm();
		onClose();
	};

	const fetchMedia = useCallback(async (page = currentPage, limit = pageSize) => {
		if (!open) return;
		setIsLoading(true);

		try {
			const token = getAuthToken();
			if (!token) {
				setMediaList([]);
				setTotalItems(0);
				message.warning("Token de autenticação ausente. Faça login.");
				return;
			}

			const response = await fetch(`/api/TimelinePost?page=${page}&limit=${limit}`, {
				method: 'GET',
				headers: { 'Authorization': `Bearer ${token}` }
			});

			if (!response.ok) {
				const errorData = await response.json();
				throw new Error(errorData.message || `Falha ao carregar a lista: ${response.status}`);
			}

			const data = await response.json();
			const { data: posts, meta } = data as { data: TimelineMedia[], meta: Meta };

			setMediaList(posts);
			setTotalItems(meta.totalItems);
			setCurrentPage(meta.currentPage);
			setPageSize(meta.itemsPerPage);

		} catch (error) {
			console.error("Erro ao buscar mídias:", error);
			message.error(`Não foi possível carregar a lista: ${(error as Error).message || "Erro desconhecido"}`);
		} finally {
			setIsLoading(false);
		}
	}, [open, currentPage, pageSize]);

	useEffect(() => {
		if (open) {
			fetchMedia(1, pageSize);
		}
	}, [open, fetchMedia, pageSize]);

	const handlePageChange = (page: number, newPageSize: number) => {
		if (newPageSize !== pageSize || page !== currentPage) {
			fetchMedia(page, newPageSize);
		}
	};

	const handleFormSubmit = async (values: MediaFormValues) => {
		setIsLoading(true);

		const needsFile = !isEditing;

		const endpoint = isEditing && currentEditItem
			? `/api/TimelinePost/${currentEditItem.id}`
			: "/api/TimelinePost";

		const method = isEditing ? "PUT" : "POST";

		try {
			const token = getAuthToken();
			if (!token) {
				throw new Error("Usuário não autenticado. Faça login novamente.");
			}

			const formData = new FormData();
			formData.append("title", values.title);
			formData.append("description", values.description);

			const fileList = (values.mediaFile as { fileList: UploadFile[] } | undefined)?.fileList || (values.mediaFile as UploadFile[] | undefined);

			if (fileList && fileList.length > 0) {
				formData.append("image", fileList[0].originFileObj as File);
			} else if (needsFile) {
				message.error("É obrigatório selecionar uma foto para um novo item.");
				setIsLoading(false);
				return;
			}

			const response = await fetch(endpoint, {
				method: method,
				body: formData,
				headers: {
					'Authorization': `Bearer ${token}`
				}
			});

			if (!response.ok) {
				const errorData = await response.json();
				throw new Error(errorData.message || `Falha na operação: ${response.status}`);
			}

			message.success(`Mídia ${isEditing ? "atualizada" : "adicionada"} com sucesso!`);
			resetForm();
			await fetchMedia(1, pageSize);

		} catch (error) {
			console.error("Erro ao salvar os dados da mídia:", error);
			message.error(`Erro ao salvar os dados da mídia: ${(error as Error).message || "Verifique o console para mais detalhes."}`);
		} finally {
			setIsLoading(false);
		}
	};

	const handleDelete = async (id: string) => {
		if (!window.confirm("Tem certeza que deseja remover este item? Esta ação é irreversível e deletará o arquivo de imagem.")) return;

		setIsLoading(true);

		try {
			const token = getAuthToken();
			if (!token) {
				throw new Error("Usuário não autenticado. Faça login novamente.");
			}

			const response = await fetch(`/api/TimelinePost/${id}`, {
				method: 'DELETE',
				headers: {
					'Authorization': `Bearer ${token}`
				}
			});

			if (response.status !== 204) {
				const errorData = await response.json();
				throw new Error(errorData.message || `Falha ao excluir. Status: ${response.status}`);
			}

			message.success("Mídia excluída com sucesso!");

			await fetchMedia(currentPage, pageSize);

		} catch (error) {
			console.error("Erro ao deletar a mídia:", error);
			message.error(`Erro ao deletar a mídia: ${(error as Error).message || "Tente novamente."}`);
		} finally {
			setIsLoading(false);
		}
	};

	const handleEdit = (item: TimelineMedia) => {
		setIsEditing(true);
		setCurrentEditItem(item);
		form.setFieldsValue({
			title: item.title,
			description: item.description,
			mediaFile: null
		});
	};

	return (
		<Modal
			title={<Title level={4}>{isEditing ? "Editar Mídia" : "Cadastro de Mídias da Linha do Tempo"}</Title>}
			open={open}
			onCancel={handleCloseModal}
			footer={null}
			width={750}
			centered
		>
			<Spin spinning={isLoading} indicator={<LoadingOutlined style={{ fontSize: 24 }} spin />}>

				<Title level={5} style={{ marginTop: 0 }}>{isEditing ? `Atualizando: ${currentEditItem?.title}` : "Adicionar Nova Mídia"}</Title>

				<Form
					form={form}
					layout="vertical"
					onFinish={handleFormSubmit}
					style={{ marginBottom: "30px" }}
				>
					<Form.Item
						label="Título"
						name="title"
						rules={[{ required: true, message: "Obrigatório." }, { min: 5, message: "Mínimo 5 caracteres." }]}
					>
						<Input />
					</Form.Item>
					<Form.Item
						label="Descrição"
						name="description"
						rules={[{ required: true, message: "Obrigatório." }, { min: 10, message: "Mínimo 10 caracteres." }]}
					>
						<Input.TextArea rows={3} />
					</Form.Item>

					<Form.Item
						label="Foto"
						name="mediaFile"
						valuePropName="fileList"
						getValueFromEvent={(e: { fileList: UploadFile[] } | null | undefined) => e?.fileList}
						rules={[{ required: !isEditing, message: "A foto é obrigatória para novos itens." }]}
					>
						<Upload
							beforeUpload={() => false}
							maxCount={1}
							listType="picture"
							accept=".jpg, .jpeg, .png, .gif"
						>
							<Button icon={<UploadOutlined />}>Selecionar Foto</Button>
						</Upload>
					</Form.Item>

					{currentEditItem && (
						<Text type="secondary" style={{ display: "block", marginBottom: 15 }}>
							Mídia atual: **{currentEditItem.imageUrl}**
						</Text>
					)}

					<Form.Item style={{ marginTop: 15 }}>
						<Button type="primary" htmlType="submit" style={{ marginRight: "10px" }} loading={isLoading} disabled={isLoading}>
							{isEditing ? "Salvar Edição" : "Adicionar Item"}
						</Button>
						{isEditing && (
							<Button onClick={resetForm} disabled={isLoading}>
								Cancelar Edição
							</Button>
						)}
					</Form.Item>
				</Form>

				<Title level={5}>Itens Cadastrados ({totalItems})</Title>
				<List
					bordered
					dataSource={mediaList}
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
								title={item.title}
								description={item.description}
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
