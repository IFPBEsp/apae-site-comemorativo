// src/app/trinta-anos/page.tsx
"use client";
import { useState } from "react";
import { Timeline } from "antd";
import Styles from "./page.module.css";
import Image from "next/image";
import AudioReader from "@/app/components/reader/Reader";

import MediaCrudModal from "@/app/components/media-crud-modal/MediaCrudModal"; 

// ***************************************************************
// [Atenção] SUBSTITUA ISTO PELO SEU HOOK/CONTEXTO REAL DE AUTENTICAÇÃO
// Este é um mock para fins de desenvolvimento.
const useAuth = () => {
    // Por exemplo, seu hook deve checar o token e o perfil do usuário
    
    // VARIÁVEIS DE TESTE:
    const isLoggedIn = true; // Substitua por sua checagem de login
    const userRoleIsEmployee = true; // Substitua por sua checagem de perfil (Admin/Funcionário)
    
    // Retorna true apenas se logado E tiver a role correta
    return { 
        isLoggedIn: isLoggedIn && userRoleIsEmployee 
    };
};
// ***************************************************************

// Tipagem do item da Timeline (Necessária para o TSX)
interface TimelineItem {
    children: React.ReactNode;
    label: string | React.ReactNode;
    className: string;
}

export default function TrintaAnosPage() {
    // Usa o hook de login
    const { isLoggedIn } = useAuth();
    const [showMediaCrud, setShowMediaCrud] = useState(false); 

    // VARIÁVEL DE LOGIN REAL: Usa o resultado do hook
    const isEmployeeLoggedIn = isLoggedIn; 
    
    // O array da timeline está vazio, como solicitado.
    const timelineItems: TimelineItem[] = []; 
    const shouldRenderTimeline = timelineItems && timelineItems.length > 0;

    return (
        <div className={Styles.container}>
            <div className={Styles.titleDiv}>
                <Image src="/apae-site-comemorativo/logo-30anos.png" alt="Selo comemorativo de 30 anos da APAE Esperança-PB com o logotipo da APAE dentro do número zero" className={Styles.logo} width={150} height={150} />
                <h1 className={Styles.title}>30 Anos Fazendo a Diferença</h1>
            </div>
            <AudioReader
                src="/apae-site-comemorativo/audio-descricao/tela30Anos.wav"
                audioTitle="Descrição da Página em Áudio"
            />
            
            <p className={Styles.text}>
                A APAE (Associação de Pais e Amigos dos Excepcionais) de Esperança - PB
                celebra 30 anos de dedicação à assistência e inclusão social da
                comunidade. Ao longo dessas três décadas, a instituição tem transformado
                vidas, promovendo desenvolvimento e apoio, além de contar com a valiosa
                contribuição de voluntários e profissionais comprometidos.
            </p>

            {/* LÓGICA DO BOTÃO: Só aparece se o funcionário estiver logado */}
            {isEmployeeLoggedIn ? (
                <button 
                    className={Styles.ctaButton} 
                    onClick={() => setShowMediaCrud(true)}
                >
                    Gerenciar Mídias da Linha do Tempo
                </button>
            ) : (
                // Mantém o espaçamento se o botão não for exibido
                <div style={{ minHeight: "40px" }} /> 
            )}

            {/* Exibição Condicional da Timeline (Vazia) */}
            {shouldRenderTimeline ? (
                <Timeline
                    items={timelineItems} 
                    mode="alternate"
                    style={{ minWidth: "50%", wordWrap: "break-word", margin: "50px 0" }}
                />
            ) : (
                 !isEmployeeLoggedIn && <p style={{ textAlign: "center", marginTop: "50px" }}>Nossa história está sendo preparada!</p>
            )}

            {/* Modal de CRUD */}
            <MediaCrudModal 
                open={showMediaCrud} 
                onClose={() => setShowMediaCrud(false)} 
            />
        </div>
    );
};
