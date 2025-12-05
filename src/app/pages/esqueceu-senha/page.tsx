"use client";

import { useState, FormEvent } from "react";
import Image from "next/image";
import styles from "./page.module.css";
import { toast } from "react-hot-toast";
import { Mail } from "lucide-react";

export default function EsqueceuSenhaPage() {
    const [email, setEmail] = useState("");
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState("");
    const [success, setSuccess] = useState(false);

    const handleSubmit = async (event: FormEvent) => {
        event.preventDefault();
        setIsLoading(true);
        setError("");

        // Validação básica
        if (!email.trim()) {
            setError("Por favor, digite seu email.");
            setIsLoading(false);
            return;
        }

        // Validação de formato de email
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(email.trim())) {
            setError("Por favor, digite um email válido.");
            setIsLoading(false);
            return;
        }

        try {
            const response = await fetch("/api/auth/forgot-password", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({ email: email.trim() }),
            });

            if (!response.ok) {
                const text = await response.text();
                let errorMessage = "Erro ao solicitar recuperação de senha";

                try {
                    const data = JSON.parse(text);
                    errorMessage = data.message || errorMessage;
                } catch {
                    // Se não for JSON, usa a mensagem padrão
                }

                setError(errorMessage);
                setIsLoading(false);
                return;
            }

            const data = await response.json();
            setSuccess(true);
            toast.success(data.message || "Se o email existir, um link de recuperação será enviado.");
            setIsLoading(false);
        } catch (error) {
            console.error("Erro ao solicitar recuperação:", error);
            setError("Erro ao conectar com o servidor. Tente novamente.");
            setIsLoading(false);
        }
    };

    return (
        <main className={styles.main}>
            <div className={styles.content}>
                <div className={styles.card}>
                    <div className={styles.logoContainer}>
                        <Image
                            src="/logo-apae.png"
                            alt="Logo da APAE"
                            width={150}
                            height={50}
                            style={{ objectFit: "contain" }}
                        />
                    </div>
                    <h1 className={styles.title}>Recuperar Senha</h1>
                    <p className={styles.subtitle}>
                        Digite seu email para receber um link de recuperação
                    </p>

                    {!success ? (
                        <form className={styles.form} onSubmit={handleSubmit}>
                            <div className={styles.inputGroup}>
                                <label htmlFor="email" className={styles.label}>
                                    Email
                                </label>
                                <div className={styles.inputWrapper}>
                                    <Mail className={styles.inputIcon} strokeWidth={2.0} />
                                    <input
                                        type="email"
                                        id="email"
                                        name="email"
                                        className={styles.input}
                                        placeholder="Digite seu email"
                                        required
                                        value={email}
                                        onChange={(e) => setEmail(e.target.value)}
                                    />
                                </div>
                            </div>
                            {error && <p className={styles.errorMessage}>{error}</p>}
                            <button
                                type="submit"
                                className={styles.submitButton}
                                disabled={isLoading}
                            >
                                {isLoading ? "Enviando..." : "Enviar Link"}
                            </button>
                        </form>
                    ) : (
                        <div className={styles.successContainer}>
                            <div className={styles.tokenContainer}>
                                <p className={styles.tokenLabel}>
                                    Link de recuperação enviado!
                                </p>
                                <p className={styles.tokenHint}>
                                    Verifique sua caixa de entrada e clique no link recebido por email para redefinir sua senha.
                                </p>
                                <p className={styles.tokenHint}>
                                    O link expira em 1 hora.
                                </p>
                            </div>
                        </div>
                    )}

                    <a href="/pages/login" className={styles.backLink}>
                        Voltar para o login
                    </a>
                </div>
            </div>
        </main>
    );
}

