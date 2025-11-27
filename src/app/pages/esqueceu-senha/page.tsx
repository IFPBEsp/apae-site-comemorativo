"use client";

import { useState, FormEvent } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import styles from "./page.module.css";
import { toast } from "react-hot-toast";
import { User } from "lucide-react";

export default function EsqueceuSenhaPage() {
    const router = useRouter();
    const [username, setUsername] = useState("");
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState("");
    const [success, setSuccess] = useState(false);
    const [resetToken, setResetToken] = useState("");

    const handleSubmit = async (event: FormEvent) => {
        event.preventDefault();
        setIsLoading(true);
        setError("");

        // Validação básica
        if (!username.trim()) {
            setError("Por favor, digite seu usuário.");
            setIsLoading(false);
            return;
        }

        try {
            const response = await fetch("/api/auth/forgot-password", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({ username: username.trim() }),
            });

            if (!response.ok) {
                const text = await response.text();
                let errorMessage = "Erro ao gerar token de recuperação";

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

            // Em desenvolvimento, o token vem na resposta
            // Em produção, seria enviado por email
            if (data.token) {
                setResetToken(data.token);
                setSuccess(true);
                toast.success("Token de recuperação gerado com sucesso!");
            } else {
                toast.success(data.message || "Se o usuário existir, um token será gerado.");
            }
            setIsLoading(false);
        } catch (error) {
            console.error("Erro ao solicitar recuperação:", error);
            setError("Erro ao conectar com o servidor. Tente novamente.");
            setIsLoading(false);
        }
    };

    const handleGoToReset = () => {
        router.push(`/pages/resetar-senha?token=${resetToken}`);
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
                        Digite seu usuário para receber um token de recuperação
                    </p>

                    {!success ? (
                        <form className={styles.form} onSubmit={handleSubmit}>
                            <div className={styles.inputGroup}>
                                <label htmlFor="username" className={styles.label}>
                                    Usuário
                                </label>
                                <div className={styles.inputWrapper}>
                                    <User className={styles.inputIcon} strokeWidth={2.0} />
                                    <input
                                        type="text"
                                        id="username"
                                        name="username"
                                        className={styles.input}
                                        placeholder="Digite seu usuário"
                                        required
                                        value={username}
                                        onChange={(e) => setUsername(e.target.value)}
                                    />
                                </div>
                            </div>
                            {error && <p className={styles.errorMessage}>{error}</p>}
                            <button
                                type="submit"
                                className={styles.submitButton}
                                disabled={isLoading}
                            >
                                {isLoading ? "Enviando..." : "Enviar"}
                            </button>
                        </form>
                    ) : (
                        <div className={styles.successContainer}>
                            <div className={styles.tokenContainer}>
                                <p className={styles.tokenLabel}>Seu token de recuperação:</p>
                                <div className={styles.tokenBox}>
                                    <code className={styles.token}>{resetToken}</code>
                                </div>
                                <p className={styles.tokenHint}>
                                    Copie este token e use na página de resetar senha
                                </p>
                            </div>
                            <button
                                type="button"
                                onClick={handleGoToReset}
                                className={styles.submitButton}
                            >
                                Ir para Resetar Senha
                            </button>
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

