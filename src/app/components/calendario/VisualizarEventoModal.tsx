"use client";

import { useEffect, useRef } from "react"; 
import styles from "./VisualizarEventoModal.module.css";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";

interface EventoCalendario { 
    id: string; 
    title: string; 
    start: string; 
    extendedProps: { 
        description: string; 
    }; 
    allDay: boolean;
}

interface ModalProps {
    isOpen: boolean;
    onClose: () => void;
    evento: EventoCalendario | null;
}

export function VisualizarEventoModal({ isOpen, onClose, evento }: ModalProps) {
    const modalRef = useRef<HTMLDivElement>(null); 

    useEffect(() => {
        if (isOpen && modalRef.current) {
            modalRef.current.scrollIntoView({
                behavior: "smooth",
                block: "center"
            });
        }
    }, [isOpen]); 

    if (!isOpen || !evento) {
        return null;
    }
    
    const dataObj = new Date(evento.start + "T00:00:00"); 
    const dataFormatada = format(dataObj, "dd 'de' MMMM 'de' yyyy", {
        locale: ptBR,
    });

    return (
        <div ref={modalRef} className={styles.modalBackdrop} onClick={onClose}> 
            <div className={styles.modalContent} onClick={(e) => e.stopPropagation()}>
                <div className={styles.modalHeader}>
                    <h2 className={styles.modalTitle}>{evento.title}</h2>
                    <button onClick={onClose} className={styles.closeButton}>&times;</button>
                </div>
                
                <div className={styles.modalBody}>
                    <p className={styles.dataEvento}>{dataFormatada}</p>
                    <p className={styles.descricaoEvento}>
                        {evento.extendedProps.description}
                    </p>
                </div>

                <div className={styles.modalFooter}>
                    <button 
                        onClick={onClose} 
                        className={styles.buttonSecondary}
                    >
                        Fechar
                    </button>
                </div>
            </div>
        </div>
    );
}