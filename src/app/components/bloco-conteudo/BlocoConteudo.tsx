import React from "react";
import { Typography } from "@mui/material";
import styles from "./BlocoConteudo.module.css";
import { LucideIcon } from "lucide-react";

interface BlocoConteudoProps {
  titulo: string;
  texto: string;
  icone: LucideIcon;
}

const BlocoConteudo: React.FC<BlocoConteudoProps> = ({ titulo, texto, icone: Icone }) => {
  return (
    <div className={styles.blocoContainer}>
      <div className={styles.iconeTitulo}>
        <Typography variant="h5" component="h3" className={styles.titulo}>
          {titulo}
        </Typography>
        <Icone size={24} className={styles.icone} />
      </div>
      <Typography variant="body1" className={styles.texto}>
        {texto}
      </Typography>
    </div>
  );
};

export default BlocoConteudo;