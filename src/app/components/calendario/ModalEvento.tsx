"use client";

import { useState, useEffect, useRef } from "react";
import styles from "./ModalEvento.module.css";
import { toast } from "react-hot-toast";

interface EventoCalendario { id: string; title: string; start: string; extendedProps: { description: string; }; allDay: boolean; }
interface ModalEventoProps { isOpen: boolean; onClose: () => void; onSave: () => void; evento: EventoCalendario | null; dataSelecionada: string | null; }

export function ModalEvento({ isOpen, onClose, onSave, evento, dataSelecionada }: ModalEventoProps) {
    const [titulo, setTitulo] = useState("");
    const [descricao, setDescricao] = useState("");
    const [data, setData] = useState("");
    const [carregando, setCarregando] = useState(false);
    
    const [erroApi, setErroApi] = useState<string | null>(null);
    const [confirmandoExclusao, setConfirmandoExclusao] = useState(false); 
    const modalRef = useRef<HTMLDivElement>(null);
    const estaEditando = evento !== null;

    useEffect(() => {
        if (isOpen) {
            setErroApi(null);
            setConfirmandoExclusao(false); 
            if (evento) {
                const dataFormatada = evento.start.split("T")[0];
                setTitulo(evento.title);
                setDescricao(evento.extendedProps.description);
                setData(dataFormatada);
            } else if (dataSelecionada) {
                setTitulo("");
                setDescricao("");
                setData(dataSelecionada);
            }
        }
    }, [evento, dataSelecionada, isOpen]);

    useEffect(() => {
        if (isOpen && modalRef.current) {
            modalRef.current.scrollIntoView({ behavior: "smooth", block: "center" });
        }
    }, [isOpen]);

    if (!isOpen) return null;
    
    const getToken = () => localStorage.getItem("authToken");

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setCarregando(true);
        setErroApi(null);
        const token = getToken();
        if (!token) {
            setErroApi("Sessão expirada. Faça o login novamente.");
            setCarregando(false);
            return;
        }

        const body = {
            name: titulo,
            description: descricao,
            date: `${data}T00:00:00.000Z`,
        };

        const url = estaEditando ? `/api/commemorativeDate/${evento?.id}` : "/api/commemorativeDate";
        const method = estaEditando ? "PUT" : "POST";

        try {
            const response = await fetch(url, {
                method,
                headers: { "Content-Type": "application/json", "Authorization": `Bearer ${token}` },
                body: JSON.stringify(body)
            });
            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.message || "Falha ao salvar o evento.");
            }
            toast.success(`Evento ${estaEditando ? "atualizado" : "criado"} com sucesso!`);
            onSave();
        } catch (error: unknown) { 
            if (error instanceof Error) {
                setErroApi(error.message);
            } else {
                setErroApi("Ocorreu um erro desconhecido ao salvar.");
            }
        } finally {
            setCarregando(false);
        }
    };
    
    const solicitarExclusao = () => {
        setConfirmandoExclusao(true);
        setErroApi(null);
    };
    const cancelarExclusao = () => {
        setConfirmandoExclusao(false);
    };
    const confirmarExclusao = async () => {
        if (!evento) return;
        setCarregando(true);
        setErroApi(null);
        const token = getToken();
        if (!token) {
            setErroApi("Sessão expirada. Faça o login novamente.");
            setCarregando(false);
            return;
        }

        try {
            const response = await fetch(`/api/commemorativeDate/${evento.id}`, {
                method: "DELETE",
                headers: { "Authorization": `Bearer ${token}` }
            });

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.message || "Falha ao excluir o evento.");
            }

            toast.success("Evento excluído com sucesso!");
            onSave();
        } catch (error: unknown) { 
            if (error instanceof Error) {
                setErroApi(error.message);
            } else {
                setErroApi("Ocorreu um erro desconhecido ao excluir.");
            }
            setConfirmandoExclusao(false);
        } finally {
            setCarregando(false);
        }
    };

    return (
        <div ref={modalRef} className={styles.modalBackdrop} onClick={onClose}>
            <div className={styles.modalContent} onClick={(e) => e.stopPropagation()}>
                <div className={styles.modalHeader}>
                    <h2 className={styles.modalTitle}>{estaEditando ? "Editar Data" : "Criar Nova Data"}</h2>
                    <button onClick={onClose} className={styles.closeButton}>&times;</button>
                </div>
                <form onSubmit={handleSubmit} className={styles.form}>
                    <div className={styles.formGroup}>
                        <label htmlFor="title">Título</label>
                        <input id="title" value={titulo} onChange={(e) => setTitulo(e.target.value)} required disabled={confirmandoExclusao} />
                    </div>
                    <div className={styles.formGroup}>
                        <label htmlFor="date">Data</label>
                        <input id="date" type="date" value={data} onChange={(e) => setData(e.target.value)} required disabled={confirmandoExclusao} />
                    </div>
                    <div className={styles.formGroup}>
                        <label htmlFor="description">Descrição</label>
                        <textarea id="description" value={descricao} onChange={(e) => setDescricao(e.target.value)} rows={4} required disabled={confirmandoExclusao} />
                    </div>

                    {erroApi && (
                        <div className={styles.errorContainer}>
                             {erroApi}
                        </div>
                    )}
                    <div className={styles.modalFooter}>
                        {confirmandoExclusao ? (
                            <div className={styles.confirmationBox}>
                                <span className={styles.confirmText}>Tem certeza que deseja excluir?</span>
                                <div className={styles.confirmActions}>
                                    <button 
                                        type="button" 
                                        onClick={confirmarExclusao} 
                                        disabled={carregando}
                                        className={styles.buttonDestructive}
                                    >
                                        {carregando ? "Excluindo..." : "Sim, excluir"}
                                    </button>
                                    <button 
                                        type="button" 
                                        onClick={cancelarExclusao} 
                                        disabled={carregando}
                                        className={styles.buttonSecondary}
                                    >
                                        Não, manter
                                    </button>
                                </div>
                            </div>
                        ) : (
                            <>
                                <div>
                                    {estaEditando && (
                                        <button 
                                            type="button" 
                                            onClick={solicitarExclusao} 
                                            disabled={carregando} 
                                            className={styles.buttonDestructive}
                                        >
                                            Excluir
                                        </button>
                                    )}
                                </div>
                                <div className={styles.footerActions}>
                                    <button type="button" onClick={onClose} disabled={carregando} className={styles.buttonSecondary}>Cancelar</button>
                                    <button type="submit" disabled={carregando} className={styles.button}>{carregando ? "Salvando..." : "Salvar"}</button>
                                </div>
                            </>
                        )}
                    </div>
                </form>
            </div>
        </div>
    );
}