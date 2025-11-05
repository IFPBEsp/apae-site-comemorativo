"use client";

import React, { useState } from "react";
import Image from "next/image";
import styles from "./FormularioRegistro.module.css";
import { useAuth } from "@/app/context/AuthContext";
import { toast } from "react-hot-toast";

const initialFormData = {
    nomeCompleto: "",
    usuario: "",
    senha: "",
    confirmarSenha: "",
    tipoUsuario: "Funcionario"
};

export default function FormularioRegistro() {

    const { token } = useAuth();
    const [formData, setFormData] = useState(initialFormData);
    const [isLoading, setIsLoading] = useState(false);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsLoading(true);

        if (formData.senha !== formData.confirmarSenha) {
            toast.error("As senhas não coincidem.");
            setIsLoading(false);
            return;
        }

        const formTypeUser = formData.tipoUsuario;

        let apiTypeUser: string;
        if (formTypeUser === "Funcionario") {
            apiTypeUser = "EMPLOYEE";
        } else {
            apiTypeUser = "ADMIN";
        }

        const apiBody = {
            name: formData.nomeCompleto,
            username: formData.usuario,
            password: formData.senha,
            typeUser: apiTypeUser
        };

        try {
            const response = await fetch("/apae-site-comemorativo/api/auth/register", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${token}`
                },
                body: JSON.stringify(apiBody)
            });

            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.message || "Erro ao cadastrar usuário.");
            }

            toast.success("Usuário cadastrado com sucesso!");
            setFormData(initialFormData);

        } catch (err: unknown) {
            if (err instanceof Error) {
                toast.error(err.message);
            } else {
                toast.error("Ocorreu um erro desconhecido.");
            }
        } finally {
            setIsLoading(false);
        }
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
