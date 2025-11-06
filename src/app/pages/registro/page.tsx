import React from "react";
import Image from "next/image";
import FormularioRegistro from "../../components/formulario-registro/FormularioRegistro";
import styles from "./page.module.css";

export default function RegistroPage() {
    const backgroundSrc = "/bg-apaaequipe.jpg"; 
    return (
        <div className={styles.container}>
            <Image
                src={backgroundSrc}
                alt="Fundo com equipe da APAE"
                fill
                priority
                className={styles.backgroundImage}
            />
            <div className={styles.overlay} />
            <div className={styles.formWrapper}>
                <FormularioRegistro />
            </div>
        </div>
    );
}