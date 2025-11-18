"use client";

import { useState, FormEvent, useEffect } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import styles from "./page.module.css";
import { toast } from "react-hot-toast";
import { useAuth } from "../../context/AuthContext";

import { User, Lock, Eye, EyeOff } from "lucide-react";

export default function LoginPage() {
	const router = useRouter();
	const { login, isAuthenticated, isLoading: isAuthLoading } = useAuth();

	const [username, setUsername] = useState("");
	const [password, setPassword] = useState("");
	const [showPassword, setShowPassword] = useState(false);
	const [isLoading, setIsLoading] = useState(false);
	const [error, setError] = useState("");

	useEffect(() => {
		if (!isAuthLoading && isAuthenticated) {
			router.push("/");
		}
	}, [isAuthenticated, isAuthLoading, router]);

	const handleSubmit = async (event: FormEvent) => {
		event.preventDefault();
		setIsLoading(true);
		setError("");

		try {
			const response = await fetch("/api/auth/login", {
				method: "POST",
				headers: { "Content-Type": "application/json" },
				body: JSON.stringify({ username: username, password: password }),
			});

			const data = await response.json();

			if (!response.ok) {
				throw new Error(data.message || "Ocorreu um erro.");
			}

			toast.success("Login realizado com sucesso!");

			login(data.token);
		} catch (err: unknown) {
			if (err instanceof Error) {
				setError(err.message);
			}
			else {
				setError("Ocorreu um erro desconhecido.");
			}
		} finally {
			setIsLoading(false);
		}
	};

	if (isAuthLoading || isAuthenticated) {
		return (
			<p style={{ textAlign: "center", marginTop: "50px" }}>
				Verificando sessão...
			</p>
		);
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
						<div className={styles.inputGroup}>
							<label htmlFor="password" className={styles.label}>
								Senha
							</label>
							<div className={styles.inputWrapper}>
								<Lock className={styles.inputIcon} strokeWidth={2.0} />
								<input
									type={showPassword ? "text" : "password"}
									id="password"
									name="password"
									className={styles.input}
									placeholder="Digite sua senha"
									required
									value={password}
									onChange={(e) => setPassword(e.target.value)}
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
						{error && <p className={styles.errorMessage}>{error}</p>}
						<button
							type="submit"
							className={styles.submitButton}
							disabled={isLoading}
						>
							{isLoading ? "Entrando..." : "Entrar"}
						</button>
					</form>
					<a href="/pages/esqueceu-senha" className={styles.forgotPasswordLink}>
						Esqueceu sua senha?
					</a>
				</div>
			</div>
		</main>
	);
}
