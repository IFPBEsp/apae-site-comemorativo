"use client";

import { useState, FormEvent, useEffect, Suspense } from "react";
import Image from "next/image";
import { useRouter, useSearchParams } from "next/navigation";
import styles from "./page.module.css";
import { toast } from "react-hot-toast";
import { Lock, Eye, EyeOff } from "lucide-react";

function ResetarSenhaForm() {
    const router = useRouter();
    const searchParams = useSearchParams();
    const token = searchParams.get("token");

    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState("");

    useEffect(() => {
        if (!token) {
            toast.error("Token não fornecido. Por favor, solicite um novo token.");
            router.push("/pages/esqueceu-senha");
        }
    }, [token, router]);

    const handleSubmit = async (event: FormEvent) => {
        event.preventDefault();
        setIsLoading(true);
        setError("");

        // Validações front-end
        if (password !== confirmPassword) {
            setError("As senhas não coincidem.");
            setIsLoading(false);
            return;
        }

        if (password.length < 6) {
            setError("A senha deve ter pelo menos 6 caracteres.");
            setIsLoading(false);
            return;
        }

        if (!token) {
            setError("Token inválido. Solicite um novo token.");
            setIsLoading(false);
            return;
        }

        try {
            const response = await fetch("/api/auth/reset-password", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    token,
                    newPassword: password,
                }),
            });

            if (!response.ok) {
                const text = await response.text();
                let errorMessage = "Erro ao redefinir senha";

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
            toast.success(data.message || "Senha redefinida com sucesso!");
            setTimeout(() => {
                router.push("/pages/login");
            }, 1000);
        } catch (error) {
            console.error("Erro ao resetar senha:", error);
            setError("Erro ao conectar com o servidor. Tente novamente.");
            setIsLoading(false);
        }
    };

    if (!token) {
        return null;
    }

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
                    <h1 className={styles.title}>Redefinir Senha</h1>
                    <p className={styles.subtitle}>
                        Digite sua nova senha
                    </p>

                    <form className={styles.form} onSubmit={handleSubmit}>
                        <div className={styles.inputGroup}>
                            <label htmlFor="password" className={styles.label}>
                                Nova Senha
                            </label>
                            <div className={styles.inputWrapper}>
                                <Lock className={styles.inputIcon} strokeWidth={2.0} />
                                <input
                                    type={showPassword ? "text" : "password"}
                                    id="password"
                                    name="password"
                                    className={styles.input}
                                    placeholder="Digite sua nova senha"
                                    required
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    minLength={6}
                                />
                                <button
                                    type="button"
                                    className={styles.passwordToggleIcon}
                                    onClick={() => setShowPassword(!showPassword)}
                                >
                                    {showPassword ? (
                                        <EyeOff strokeWidth={2.0} />
                                    ) : (
                                        <Eye strokeWidth={2.0} />
                                    )}
                                </button>
                            </div>
                        </div>
                        <div className={styles.inputGroup}>
                            <label htmlFor="confirmPassword" className={styles.label}>
                                Confirmar Nova Senha
                            </label>
                            <div className={styles.inputWrapper}>
                                <Lock className={styles.inputIcon} strokeWidth={2.0} />
                                <input
                                    type={showConfirmPassword ? "text" : "password"}
                                    id="confirmPassword"
                                    name="confirmPassword"
                                    className={styles.input}
                                    placeholder="Confirme sua nova senha"
                                    required
                                    value={confirmPassword}
                                    onChange={(e) => setConfirmPassword(e.target.value)}
                                    minLength={6}
                                />
                                <button
                                    type="button"
                                    className={styles.passwordToggleIcon}
                                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                                >
                                    {showConfirmPassword ? (
                                        <EyeOff strokeWidth={2.0} />
                                    ) : (
                                        <Eye strokeWidth={2.0} />
                                    )}
                                </button>
                            </div>
                        </div>
                        {error && <p className={styles.errorMessage}>{error}</p>}
                        <button
                            type="submit"
                            className={styles.submitButton}
                            disabled={isLoading}
                        >
                            {isLoading ? "Redefinindo..." : "Redefinir Senha"}
                        </button>
                    </form>

                    <a href="/pages/login" className={styles.backLink}>
                        Voltar para o login
                    </a>
                </div>
            </div>
        </main>
    );
}

export default function ResetarSenhaPage() {
    return (
        <Suspense fallback={
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
                        <p>Carregando...</p>
                    </div>
                </div>
            </main>
        }>
            <ResetarSenhaForm />
        </Suspense>
    );
}

