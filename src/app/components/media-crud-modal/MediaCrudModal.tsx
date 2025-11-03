"use client";

import { Modal, Form, Input, Button, Upload, List, message, Spin, Typography, UploadFile } from "antd";
import { UploadOutlined, DeleteOutlined, EditOutlined, LoadingOutlined } from "@ant-design/icons";
import { useState, useEffect } from "react";

const { Title, Text } = Typography;

interface MediaCrudModalProps {
  open: boolean;
  onClose: () => void;
}

interface TimelineMedia {
  id: number;
  title: string;
  description: string;
  imageUrl: string;
}

interface MediaFormValues {
    id?: number;
    title: string;
    description: string;
    mediaFile?: { fileList: UploadFile[] } | UploadFile[] | null; 
}

const mockMediaList: TimelineMedia[] = [
    { id: 1, title: "Visita 2023", description: "Dia de fotos na APAE. (Mock)", imageUrl: "/mock/apae.jpg" },
    { id: 2, title: "Campanha", description: "Campanha de Arrecadação. (Mock)", imageUrl: "/mock/campanha.jpg" },
    { id: 3, title: "Festa Junina", description: "Arraiá da APAE 2023. (Mock)", imageUrl: "/mock/festa.jpg" },
    { id: 4, title: "Formatura", description: "Formatura dos alunos. (Mock)", imageUrl: "/mock/formatura.jpg" },
    { id: 5, title: "Doação", description: "Dia de recebimento de doações. (Mock)", imageUrl: "/mock/doacao.jpg" },
    { id: 6, title: "Visita da Escola", description: "Alunos de escola parceira. (Mock)", imageUrl: "/mock/visita2.jpg" },
    { id: 7, title: "Eventos", description: "Evento de Conscientização. (Mock)", imageUrl: "/mock/evento.jpg" },
];


export default function MediaCrudModal({ open, onClose }: MediaCrudModalProps) {
    const [form] = Form.useForm<MediaFormValues>();
    const [mediaList, setMediaList] = useState<TimelineMedia[]>(mockMediaList);
    const [isEditing, setIsEditing] = useState<boolean>(false);
    const [currentEditItem, setCurrentEditItem] = useState<TimelineMedia | null>(null);
    const [isLoading, setIsLoading] = useState<boolean>(false);

    const [currentPage, setCurrentPage] = useState<number>(1);
    const [pageSize, setPageSize] = useState<number>(5); // 5 itens por página
    const [totalItems, setTotalItems] = useState<number>(mockMediaList.length);


    const resetForm = () => {
        form.resetFields();
        setIsEditing(false);
        setCurrentEditItem(null);
    };

    const handleCloseModal = () => {
        resetForm();
        onClose();
    };

    const fetchMedia = async (page = currentPage, limit = pageSize) => {
        if (!open) return;
        setIsLoading(true);
        
        try {
            await new Promise(resolve => setTimeout(resolve, 500)); 

            const startIndex = (page - 1) * limit;
            const endIndex = startIndex + limit;
            const pagedList = mockMediaList.slice(startIndex, endIndex);

            setMediaList(pagedList);
            setTotalItems(mockMediaList.length);
            setCurrentPage(page);

            message.success("Lista de mídias carregada.");
        } catch (error) { 
            console.error("Erro ao buscar mídias:", error);
            message.error("Não foi possível carregar a lista de mídias.");
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        if (open) {
            fetchMedia(1, pageSize);
        }
    }, [open]);

    const handlePageChange = (page: number, newPageSize: number) => {
        if (newPageSize !== pageSize || page !== currentPage) {
            setPageSize(newPageSize);
            fetchMedia(page, newPageSize);
        }
    };

    const handleFormSubmit = async (values: MediaFormValues) => {
        setIsLoading(true);
        
        const method = isEditing ? "PUT" : "POST";
        const endpoint = isEditing && currentEditItem 
                         ? `/api/timeline/media/${currentEditItem.id}` 
                         : "/api/timeline/media";

        try {
            const formData = new FormData();
            formData.append("title", values.title);
            formData.append("description", values.description);
            
            const fileList = (values.mediaFile as { fileList: UploadFile[] } | undefined)?.fileList || (values.mediaFile as UploadFile[] | undefined);

            if (fileList && fileList.length > 0) {
                formData.append("mediaFile", fileList[0].originFileObj as File); 
            }

            // ***************************************************************
            // [API POST/PUT] BOILERPLATE DA CHAMADA REAL: DESCOMENTE QUANDO PRONTO
            /*
            const response = await fetch(endpoint, { 
                method: method, 
                body: formData,
                // headers: { 'Authorization': 'Bearer SEU_TOKEN_AQUI' } 
            });

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.message || `Falha na operação: ${response.status}`);
            }
            */
            // ***************************************************************

            await new Promise(resolve => setTimeout(resolve, 500)); 

            message.success(`Mídia ${isEditing ? "atualizada" : "adicionada"} com sucesso!`);
            resetForm();
            await fetchMedia(1, pageSize); 
            
        } catch (error) { 
            console.error("Erro ao salvar os dados da mídia:", error);
            message.error(`Erro ao salvar os dados da mídia: ${(error as Error).message || "Tente novamente."}`); 
        } finally {
            setIsLoading(false);
        }
    };


    const handleDelete = async (id: number) => { 
        if (!window.confirm("Tem certeza que deseja remover este item?")) return;
        
        setIsLoading(true);

        try {
            console.log(`Deletando item com ID: ${id}`);
            
            message.success("Mídia excluída com sucesso!");
            await fetchMedia(currentPage, pageSize); 
        } catch (error) {
            console.error("Erro ao deletar a mídia:", error);
            message.error("Erro ao deletar a mídia.");
        } finally {
            setIsLoading(false);
        }
    };

    const handleEdit = (item: TimelineMedia) => {
        setIsEditing(true);
        setCurrentEditItem(item);
        form.setFieldsValue(item);
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
                    initialValues={currentEditItem || undefined}
                    style={{ marginBottom: "30px" }}
                >
                    <Form.Item label="Título" name="title" rules={[{ required: true, message: "Obrigatório." }]}>
                        <Input />
                    </Form.Item>
                    <Form.Item label="Descrição" name="description" rules={[{ required: true, message: "Obrigatório." }]}>
                        <Input.TextArea rows={3} />
                    </Form.Item>
                
                    <Form.Item 
                        label="Foto" 
                        name="mediaFile"
                        valuePropName="fileList"
                        getValueFromEvent={(e: { fileList: UploadFile[] } | null | undefined) => e?.fileList}
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
                        <Text type="secondary">Mídia atual: {currentEditItem.imageUrl || "Nenhuma"}</Text>
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
