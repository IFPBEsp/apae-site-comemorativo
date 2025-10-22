"use client";

import React, { useState } from "react";
import Image from "next/image";
import styles from "./FormularioRegistro.module.css";

const initialFormData = {
    nomeCompleto: "",
    usuario: "",
    senha: "",
    confirmarSenha: "",
    tipoUsuario: "Funcionario"
};

export default function FormularioRegistro() {
    
    const [formData, setFormData] = useState(initialFormData);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        console.log("Dados submetidos:", formData);
        alert("Cadastro em desenvolvimento!");
    };
    
    const logoSrc = "/apae-site-comemorativo/logo-apae.png";

    return (
        <div className={styles.formContainer}>
            <div className={styles.logoWrapper}>
                <Image
                    src={logoSrc}
                    alt="Logo da APAE"
                    width={250}
                    height={100}
                    priority
                />
            </div>

            <form onSubmit={handleSubmit} className={styles.form}>
                <div className={styles.inputGroup}>
                    <label htmlFor="nomeCompleto" className={styles.label}>Nome completo</label>
                    <input
                        type="text"
                        id="nomeCompleto"
                        name="nomeCompleto"
                        className={styles.input}
                        value={formData.nomeCompleto}
                        onChange={handleChange}
                        required
                    />
                </div>
                <div className={styles.inputGroup}>
                    <label htmlFor="usuario" className={styles.label}>Usuário</label>
                    <input
                        type="text"
                        id="usuario"
                        name="usuario"
                        className={styles.input}
                        value={formData.usuario}
                        onChange={handleChange}
                        required
                    />
                </div>
                <div className={styles.inputGroup}>
                    <label htmlFor="senha" className={styles.label}>Senha</label>
                    <input
                        type="password"
                        id="senha"
                        name="senha"
                        className={styles.input}
                        value={formData.senha}
                        onChange={handleChange}
                        required
                    />
                </div>
                <div className={styles.inputGroup}>
                    <label htmlFor="confirmarSenha" className={styles.label}>Confirmar Senha</label>
                    <input
                        type="password"
                        id="confirmarSenha"
                        name="confirmarSenha"
                        className={styles.input}
                        value={formData.confirmarSenha}
                        onChange={handleChange}
                        required
                    />
                </div>
                <div className={styles.inputGroup}> 
                    <p className={styles.label}>Selecione o tipo de usuário</p>    
                    <div className={styles.radioGroup}>
                        <label className={styles.radioLabel}>
                            <input
                                type="radio"
                                name="tipoUsuario"
                                value="Admin"
                                checked={formData.tipoUsuario === "Admin"}
                                onChange={handleChange}
                                className={styles.radioInput}
                            />
                            Admin
                        </label>

                        <label className={styles.radioLabel}>
                            <input
                                type="radio"
                                name="tipoUsuario"
                                value="Funcionario"
                                checked={formData.tipoUsuario === "Funcionario"}
                                onChange={handleChange}
                                className={styles.radioInput}
                            />
                            Funcionário
                        </label>
                    </div>
                </div>
                <button type="submit" className={styles.ctaButton}>
                    Cadastrar
                </button>
            </form>
        </div>
    );
}
