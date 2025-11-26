"use client";

import { usePathname } from "next/navigation";
import Image from "next/image";
import styles from "./Header.module.css";
import {
    AlignJustify,
    Accessibility,
    Contrast,
    EyeOff,
    Text,
} from "lucide-react";
import { useState, useEffect } from "react";
import SwipeableDrawer from "@mui/material/SwipeableDrawer";
import Link from "next/link";
import Popover from "@mui/material/Popover";
import Typography from "@mui/material/Typography";
import Button from "@mui/material/Button";
import Switch from "@mui/material/Switch";
import { useAcessibilidade } from "../../hooks/useAcessibilidade";

export default function Header() {
    const pathname = usePathname();

    const [isMenuOpen, setIsMenuOpen] = useState<boolean>(false);
    const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);

    const {
        configuracoes,
        alternarContraste,
        alternarEscalaCinza,
        diminuirFonte,
        aumentarFonte,
        resetConfiguracoes,
    } = useAcessibilidade();

    const toggleMenu = () => setIsMenuOpen(!isMenuOpen);
    const handleLinkClick = () => setIsMenuOpen(false);

    const handleAccessibilityClick = (event: React.MouseEvent<HTMLElement>) =>
        setAnchorEl(event.currentTarget);
    const handleCloseAccessibility = () => setAnchorEl(null);

    const openAccessibility = Boolean(anchorEl);
    const id = openAccessibility ? "accessibility-popover" : undefined;

    const handleLogoClick = () => {
        resetConfiguracoes();
        window.location.href = "/"; 
    };

    useEffect(() => {
        if (typeof window === 'undefined') return;
        const body = document.body;
        const darkMode = configuracoes.contraste === "altoContraste";
        const [mainColor, secondaryColor] = darkMode ? ["white", "black"] : ["black", "white"];
        const grayscaleActive = configuracoes.escalaCinza === "escalaCinzaAtiva";

        body.style.background = secondaryColor;
        body.style.color = mainColor; 
        body.style.filter = `grayscale(${grayscaleActive ? 1 : 0})`;
        body.style.fontSize = `${configuracoes.fonte}px`;

        document.querySelectorAll("img").forEach(image => 
            (image as HTMLElement).style.filter = `invert(${darkMode ? 1 : 0})`
        );

        const ctaBoxes = document.querySelectorAll(".ctaBox");

        const allElements = document.querySelectorAll(
            "h1, h2, h3, h4, h5, h6, a, button, p, span, li, input, textarea"
        );

        allElements.forEach(el => {
            const element = el as HTMLElement;
            const tagName = el.tagName.toLowerCase();
            
            if (darkMode) {
                element.style.color = (tagName === 'a' || tagName.startsWith('h')) ? 'yellow' : 'white';
                
                if (tagName === 'button' || tagName === 'input' || tagName === 'textarea') {
                    if (!element.classList.contains(styles.accessibilityButton)) {
                        element.style.backgroundColor = '#222';
                    }
                    element.style.border = '1px solid yellow';
                    element.style.color = (tagName === 'button' || tagName === 'input' || tagName === 'textarea') ? 'yellow' : element.style.color;
                }
                
            } else {
                element.style.color = '';
                element.style.backgroundColor = '';
                element.style.border = '';
            }
            
            let newSize = configuracoes.fonte;

            if (tagName === "h1") newSize = configuracoes.fonte + 24;
            else if (tagName === "h2") newSize = configuracoes.fonte + 20;
            else if (tagName === "h3") newSize = configuracoes.fonte + 10;
            else if (tagName === "h4") newSize = configuracoes.fonte + 6;
            else if (tagName === "h5" || tagName === "h6") newSize = configuracoes.fonte + 4;
            
            if (!element.closest('.MuiPopover-root') && !element.closest('.MuiDrawer-root')) {
                element.style.fontSize = `${newSize}px`;
            }
        });
        
        const headerElement = document.querySelector(`.${styles.header}`) as HTMLElement;
        if (headerElement) {
            headerElement.style.backgroundColor = darkMode ? "black" : "white";
        }
        
        const linksTelasElement = document.querySelector(`.${styles.linksTelas}`) as HTMLElement;
        if (linksTelasElement) {
            linksTelasElement.style.color = darkMode ? "white" : "";
        }


    }, [configuracoes, pathname]);

    return (
        <>
            <div 
                className={styles.header} 
                style={{ backgroundColor: configuracoes.contraste === "altoContraste" ? "black" : "white" }}
            >
                <div onClick={handleLogoClick} style={{ cursor: "pointer" }}>
                    <Image
                        src="/logo-apae.png"
                        alt="Logotipo da APAE com duas mãos cinzas envolvendo uma flor amarela de pétalas abertas sobre um ramo verde"
                        width={120}
                        height={50}
                    />
                </div>
                <span className={styles.rightSideSpan}>
                    <button
                        className={styles.accessibilityButton}
                        onClick={handleAccessibilityClick}
                        aria-describedby={id}
                        aria-label="Acessibilidade"
                        type="button"
                        style={{ color: configuracoes.contraste === "altoContraste" ? "yellow" : "" }}
                    >
                        <Accessibility size={20} />
                    </button>
                    <div className={styles.linksTelas}>
                        <Link
                            href="/"
                            className={pathname === "/" ? styles.linkAtivo : styles.link}
                        >
                            Página Inicial
                        </Link>
                        <Link
                            href="/pages/30anos"
                            className={
                                pathname === "/pages/30anos" ? styles.linkAtivo : styles.link
                            }
                        >
                            30 Anos
                        </Link>
                        <Link
                            href="/pages/datas-comemorativas"
                            className={
                                pathname === "/pages/datas-comemorativas" ? styles.linkAtivo : styles.link
                            }
                        >
                            Calendário
                        </Link>
                        <Link
                            href="/pages/contato"
                            className={
                                pathname === "/pages/contato" ? styles.linkAtivo : styles.link
                            }
                        >
                            Contato
                        </Link>
                        <Link
                            href="/pages/como-ajudar"
                            className={
                                pathname === "/pages/como-ajudar" ? styles.linkAtivo : styles.link
                            }
                        >
                            Como Ajudar
                        </Link>
                    </div>

                    <button className={styles.hamburguer} onClick={toggleMenu} type="button">
                        <AlignJustify color="#0D4F97" />
                    </button>
                </span>
            </div>

            <Popover
                id={id}
                open={openAccessibility}
                anchorEl={anchorEl}
                onClose={handleCloseAccessibility}
                container={typeof window !== "undefined" ? document.body : undefined}
                anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
                transformOrigin={{ vertical: "top", horizontal: "right" }}
                PaperProps={{ sx: { position: "fixed", zIndex: 1400, mt: 1, backgroundColor: configuracoes.contraste === "altoContraste" ? "black" : "white" } }}
                disableScrollLock
                disableRestoreFocus
            >
                <div className={styles.accessibilityBox} onMouseLeave={handleCloseAccessibility}>
                    <Typography 
                        variant="subtitle1" 
                        fontWeight={600} 
                        mb={1}
                        style={{ color: configuracoes.contraste === "altoContraste" ? "white" : "black" }}
                    >
                        Acessibilidade
                    </Typography>

                    <div className={styles.accessibilityOption}>
                        <div className={styles.accessibilityIconText}><Contrast size={18} /><span>Modo Alto Contraste</span></div>
                        <Switch 
                            checked={configuracoes.contraste === "altoContraste"} 
                            onChange={alternarContraste} 
                            sx={{ '& .MuiSwitch-thumb': { backgroundColor: configuracoes.contraste === "altoContraste" ? 'yellow' : undefined } }}
                        />
                    </div>

                    <div className={styles.accessibilityOption}>
                        <div className={styles.accessibilityIconText}><EyeOff size={18} /><span>Escala de Cinza</span></div>
                        <Switch 
                            checked={configuracoes.escalaCinza === "escalaCinzaAtiva"} 
                            onChange={alternarEscalaCinza} 
                            sx={{ '& .MuiSwitch-thumb': { backgroundColor: configuracoes.contraste === "altoContraste" ? 'yellow' : undefined } }}
                        />
                    </div>

                    <div className={styles.accessibilityOption}>
                        <div className={styles.accessibilityIconText}><Text size={18} /><span>Tamanho da Fonte</span></div>
                        <div>
                            <Button size="small" onClick={diminuirFonte} style={{ color: configuracoes.contraste === "altoContraste" ? "yellow" : "" }}>A-</Button>
                            <Button size="small" onClick={aumentarFonte} style={{ color: configuracoes.contraste === "altoContraste" ? "yellow" : "" }}>A+</Button>
                        </div>
                    </div>
                    <Link 
                        href="/pages/acessibilidade" 
                        className={styles.accessibilityLink} 
                        target="_blank" 
                        rel="noopener noreferrer"
                        style={{ color: configuracoes.contraste === "altoContraste" ? "yellow" : "" }}
                    >
                        Acessibilidade neste site
                    </Link>
                </div>
            </Popover>

            <SwipeableDrawer 
                anchor="right" 
                open={isMenuOpen} 
                onClose={toggleMenu} 
                onOpen={() => {}} 
                disableSwipeToOpen
                PaperProps={{ sx: { backgroundColor: configuracoes.contraste === "altoContraste" ? "black" : "white" } }}
            >
                <ul className={styles.menu}>
                    <li>
                        <Link href="/" onClick={handleLinkClick}>
                            Página Inicial
                        </Link>
                    </li>
                    <li>
                        <Link href="/pages/30anos" onClick={handleLinkClick}>
                            30 Anos
                        </Link>
                    </li>
                    <li>
                        <Link href="/pages/datas-comemorativas" onClick={handleLinkClick}>
                            Calendário
                        </Link>
                    </li>
                    <li>
                        <Link href="/pages/contato" onClick={handleLinkClick}>
                            Contato
                        </Link>
                    </li>
                    <li>
                        <Link href="/pages/como-ajudar" onClick={handleLinkClick}>
                            Como Ajudar
                        </Link>
                    </li>
                </ul>
            </SwipeableDrawer>
        </>
    );
}
