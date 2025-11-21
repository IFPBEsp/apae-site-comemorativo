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

    const handleSubmit = (event: FormEvent) => {
        event.preventDefault();
        setIsLoading(true);
        setError("");

        // Validação básica
        if (!username.trim()) {
            setError("Por favor, digite seu usuário.");
            setIsLoading(false);
            return;
        }

        // Simula o envio (sem backend)
        setTimeout(() => {
            // Gera um token simulado para demonstração
            const simulatedToken = Math.random().toString(36).substring(2, 15) +
                Math.random().toString(36).substring(2, 15);

            setSuccess(true);
            setResetToken(simulatedToken);
            setIsLoading(false);
            toast.success("Token de recuperação gerado com sucesso!");
        }, 1000);
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

