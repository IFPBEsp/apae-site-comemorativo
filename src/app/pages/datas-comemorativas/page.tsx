"use client";

import React, { useState, useEffect, useCallback, useRef } from "react";
import FullCalendar from "@fullcalendar/react";
import dayGridPlugin from "@fullcalendar/daygrid";
import interactionPlugin, { DateClickArg } from "@fullcalendar/interaction";
import listPlugin from "@fullcalendar/list"; 
import { EventClickArg } from "@fullcalendar/core";
import ptBrLocale from "@fullcalendar/core/locales/pt-br";
import { ModalEvento } from "../../components/calendario/ModalEvento";
import { ViewDropdown } from "../../components/calendario/ViewDropdown";
import { useAuth } from "../../context/AuthContext";
import styles from "./page.module.css";

import { VisualizarEventoModal } from "../../components/calendario/VisualizarEventoModal";

interface DataComemorativa { id: number; name: string; description: string; date: string; }
interface EventoCalendario { id: string; title: string; start: string; extendedProps: { description: string; }; allDay: boolean; }

export default function PaginaDatasComemorativas() {
    const [eventos, setEventos] = useState<EventoCalendario[]>([]);
    
    const [modalFormularioAberto, setModalFormularioAberto] = useState(false);
    const [modalVisualizacaoAberto, setModalVisualizacaoAberto] = useState(false);
    
    const [eventoSelecionado, setEventoSelecionado] = useState<EventoCalendario | null>(null);
    const [dataSelecionada, setDataSelecionada] = useState<string | null>(null);
    const calendarRef = useRef<FullCalendar>(null);
    const [currentView, setCurrentView] = useState("dayGridMonth");
    const [currentTitle, setCurrentTitle] = useState("");

    const { user, isAuthenticated } = useAuth();

    const buscarEventos = useCallback(async () => {
        try {
            const response = await fetch("/api/commemorativeDate"); 
            if (!response.ok) throw new Error("Falha ao buscar eventos.");
            
            const data: DataComemorativa[] = await response.json();
            
            const eventosFormatados = data.map(evento => ({
                id: evento.id.toString(),
                title: evento.name,
                start: evento.date.split("T")[0], 
                allDay: true,
                extendedProps: { description: evento.description }
            }));
            
            setEventos(eventosFormatados);
        } catch (error) {
            console.error(error);
        }
    }, []);

    useEffect(() => {
        buscarEventos();
    }, [buscarEventos]);

    const aoClicarNaData = (arg: DateClickArg) => {
        if (!isAuthenticated || !user || (user.typeUser !== "ADMIN" && user.typeUser !== "EMPLOYEE")) {
            return; 
        }
        setEventoSelecionado(null);
        setDataSelecionada(arg.dateStr);
        setModalFormularioAberto(true); 
    };
    
    const aoClicarNoEvento = (arg: EventClickArg) => {
        const evento = {
            id: arg.event.id,
            title: arg.event.title,
            start: arg.event.startStr,
            allDay: arg.event.allDay,
            extendedProps: { description: arg.event.extendedProps.description }
        };
        setEventoSelecionado(evento);

        if (isAuthenticated && user && user.typeUser === "ADMIN") {
            setModalFormularioAberto(true); 
        } else {
            setModalVisualizacaoAberto(true); 
        }
    };
    
    const fecharModalFormulario = () => {
        setModalFormularioAberto(false);
        setEventoSelecionado(null);
        setDataSelecionada(null);
    };

    const fecharModalVisualizacao = () => {
        setModalVisualizacaoAberto(false);
        setEventoSelecionado(null);
    };

    const aoSalvar = () => {
        buscarEventos();
        fecharModalFormulario();
    };

    const handleViewChange = useCallback((view: string) => {
        if (calendarRef.current) {
            calendarRef.current.getApi().changeView(view);
        }
    }, []);

    const handlePrev = () => calendarRef.current?.getApi().prev();
    const handleNext = () => calendarRef.current?.getApi().next();
    const handleToday = () => {
        const calendarApi = calendarRef.current?.getApi();
        if (calendarApi) {
            calendarApi.today();
            calendarApi.changeView("dayGridMonth");
        }
    };

    return (
        <div className={styles.container}>
            <h1 className={styles.titulo}>
                Calendário de Datas Comemorativas
            </h1>
            <div className={styles.calendarioWrapper}>
                <div className={styles.customHeader}>
                    <div className={styles.headerLeft}>
                        <div className={styles.buttonGroup}>
                            <button onClick={handlePrev} className={styles.navButton}>&lt;</button>
                            <button onClick={handleNext} className={styles.navButton}>&gt;</button>
                        </div>
                        <button onClick={handleToday} className={styles.todayButton}>Hoje</button>
                    </div>
                    <h2 className={styles.headerTitle}>{currentTitle}</h2>
                    <div className={styles.headerRight}>
                        <ViewDropdown onChangeView={handleViewChange} currentView={currentView} />
                    </div>
                </div>

                <FullCalendar
                    ref={calendarRef}
                    plugins={[dayGridPlugin, interactionPlugin, listPlugin]} 
                    initialView="dayGridMonth"
                    locale={ptBrLocale}
                    headerToolbar={false} 
                    viewDidMount={(info) => {
                        setCurrentView(info.view.type);
                        setCurrentTitle(info.view.title);
                    }}
                    datesSet={(info) => {
                        setCurrentView(info.view.type);
                        setCurrentTitle(info.view.title);
                    }}
                    expandRows={true}
                    
                    
                    events={eventos}
                    dateClick={aoClicarNaData}
                    eventClick={aoClicarNoEvento}
                    dayMaxEvents={true}
                    navLinks={false} 
                />
            </div>

            <ModalEvento
                isOpen={modalFormularioAberto}
                onClose={fecharModalFormulario}
                onSave={aoSalvar}
                evento={eventoSelecionado}
                dataSelecionada={dataSelecionada}
            />

            <VisualizarEventoModal
                isOpen={modalVisualizacaoAberto}
                onClose={fecharModalVisualizacao}
                evento={eventoSelecionado}
            />
        </div>
    );
}