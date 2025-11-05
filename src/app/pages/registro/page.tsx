"use client";
import React, { useEffect, useState } from "react";
import Image from "next/image";
import { useAuth } from "../../context/AuthContext";
import FormularioRegistro from "../../components/formulario-registro/FormularioRegistro";
import styles from "./page.module.css";
import { useRouter } from "next/navigation";
import { toast } from "react-hot-toast";

interface JwtPayload {
  typeUser: string;
  username: string;
}

export default function RegistroPage() {
    const backgroundSrc = "/apae-site-comemorativo/bg-apaaequipe.jpg";
    const router = useRouter();
    const { isAuthenticated, isLoading: isAuthLoading, user } = useAuth();
    const [isAuthorized, setIsAuthorized] = useState(false);

  useEffect(() => {
    if (isAuthLoading) {
      return;
    }

    if (!isAuthenticated || !user) {
      toast.error("Você precisa estar logado para acessar esta página.");
      router.push("/pages/login");
      return;
    }

    if (user.typeUser === "ADMIN") {
      setIsAuthorized(true);
    } else {
      toast.error("Acesso negado. Você não é um administrador.");
      router.push("/");
    }
  }, [isAuthenticated, isAuthLoading, user, router]);

  if (isAuthLoading || !isAuthorized) {
    return (
      <p style={{ textAlign: "center", marginTop: "50px" }}>
        Verificando autorização...
      </p>
    );
  }

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