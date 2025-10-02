"use client";
import React, { useState } from "react";
import { Typography, Box, Button } from "@mui/material";
import { ChevronDown, ChevronUp } from "lucide-react";
import styles from "./BlocoExpansivel.module.css"; 

interface BlocoExpansivelProps {
    icone: React.ElementType;
    titulo: string;
    textoCurto: string;
    textoExpandido: React.ReactNode;
}

const BlocoExpansivel: React.FC<BlocoExpansivelProps> = ({ icone: Icone, titulo, textoCurto, textoExpandido }) => {
    const [isExpanded, setIsExpanded] = useState(false);

    return (
        <Box className={styles.blocoRecurso}>
            <div className={styles.iconeWrapper}>
                <Icone className={styles.icone} size={48} />
            </div>
            
            <Typography variant="h5" component="h3" align="center" className={styles.blocoTitulo}>
                {titulo}
            </Typography>
            
            <Typography variant="body1" align="center" sx={{ mb: 2 }}>
                {textoCurto}
            </Typography>

            {isExpanded && (
                <Box className={styles.detalhesTecnicos}>
                    <Typography variant="h6" component="h4" sx={{ mt: 2, mb: 1, color: "#1a4f93" }}>
                        Detalhes Técnicos
                    </Typography>
                    {textoExpandido}
                </Box>
            )}

            <Button
                onClick={() => setIsExpanded(!isExpanded)}
                className={styles.saibaMaisButton}
                endIcon={isExpanded ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
            >
                {isExpanded ? "Mostrar Menos" : "Saiba Mais"}
            </Button>
        </Box>
    );
};

export default BlocoExpansivel;