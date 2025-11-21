"use client";

import React from "react";
import Styles from "./Footer.module.css";
import Link from "next/link";
import {
    Phone,
    MapPin,
    Instagram,
    Users,
    Copyright,
    Accessibility,
} from "lucide-react";

export default function Footer() {
    return (
        <footer className={Styles.fullFooter}>
            <div className={Styles.mainFooter}>
                <div className={`${Styles.column} ${Styles.columnRightPadding}`}>
                    <h4 className={Styles.columnTitle}>APAE Esperança</h4>
                    <div className={Styles.contactItem}>
                        <Phone size={18} className={Styles.icon} />
                        <a
                            href="https://wa.me/5583999833950"
                            target="_blank"
                            rel="noopener noreferrer"
                        >
                            (83) 9 9983-3950 (WhatsApp)
                        </a>
                    </div>
                    <div className={Styles.contactItem}>
                        <MapPin size={18} className={Styles.icon} />
                        <a
                            href="https://www.google.com/maps/search/Rua+Santo+Antonio,+491+Centro,+Esperança,+PB"
                            target="_blank"
                            rel="noopener noreferrer"
                        >
                            Rua Santo Antônio, 491 - Centro, Esperança, PB
                        </a>
                    </div>
                    <div className={Styles.contactItem}>
                        <Users size={18} className={Styles.icon} />
                        <Link href="/pages/login" className={Styles.loginLink}>
                            Login de Funcionário
                        </Link>
                    </div>
                </div>
                <div className={Styles.column}>
                    <h4 className={Styles.columnTitle}>Navegação</h4>
                    <Link href="/" className={Styles.link}>
                        Início
                    </Link>
                    <Link href="/pages/30anos" className={Styles.link}>
                        30 Anos da APAE
                    </Link>
                    <Link href="/pages/acessibilidade" className={Styles.link}>
                        Acessibilidade
                    </Link>
                    <Link href="/pages/como-ajudar" className={Styles.link}>
                        Como Ajudar / Doações
                    </Link>
                </div>
                <div className={Styles.column}>
                    <h4 className={Styles.columnTitle}>Mídias Sociais</h4>
                    <div className={Styles.socialLinks}>
                        <a
                            href="https://instagram.com/apaeesperanca_"
                            target="_blank"
                            rel="noopener noreferrer"
                            aria-label="Instagram da APAE"
                        >
                            <Instagram size={24} className={Styles.socialIcon} />
                        </a>
                        <Link href="https://www.instagram.com/apaeesperanca_/" className={Styles.link}>
                            @apaeesperanca_
                        </Link>
                    </div>
                    <h4 className={`${Styles.columnTitle} ${Styles.marginTop}`}>Apoio</h4>
                    <Link href="/pages/como-ajudar" className={Styles.link}>
                        <span className={Styles.highlight}>DOE E FAÇA A DIFERENÇA!</span>
                    </Link>
                </div>
                <div className={Styles.column}>
                    <h4 className={Styles.columnTitle}>Desenvolvimento</h4>
                    <p className={Styles.devText}>
                        Este site foi projetado em Parceria com:
                    </p>
                    <p className={Styles.devInstitute}>
                        <a
                            href="https://www.instagram.com/ifpb.esperanca/"
                            target="_blank"
                            rel="noopener noreferrer"
                            className={Styles.devInstitute}
                        >
                            IFPB - Campus Esperança
                        </a>
                    </p>
                    <p className={Styles.devText}>
                        Pelos alunos do curso de Análise e Desenvolvimento de Sistemas (Nas
                        disciplinas de Projeto de Software I e Projeto de Software II).
                    </p>
                    <a
                        href="https://github.com/IFPBEsp/apae-site-comemorativo"
                        target="_blank"
                        rel="noopener noreferrer"
                        className={Styles.link}
                    >
                        Ver Código-Fonte (GitHub)
                    </a>
                </div>
            </div>
            <div className={Styles.bottomBar}>
                <div className={Styles.bottomContent}>
                    <p>
                        <Copyright size={14} className={Styles.icon} />
                        2025 APAE Esperança & IFPB Esperança. Todos os direitos reservados.
                    </p>
                    <p className={Styles.copyrightNotice}>
                        *O código é aberto no GitHub, mas o uso não autorizado de conteúdo
                        (fotos, textos) é proibido.
                    </p>
                </div>
                <Link href="/pages/acessibilidade" className={Styles.accessLink}>
                    <Accessibility size={20} className={Styles.accessIcon} />
                    Acessibilidade
                </Link>
            </div>
        </footer>
    );
}
