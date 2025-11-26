"use client";

import React, { useState, useEffect, FormEvent } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "../../context/AuthContext";
import styles from "./page.module.css";
import { toast } from "react-hot-toast";
import Link from "next/link";

const LockIcon = () => <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="11" width="18" height="11" rx="2" ry="2"/><path d="M7 11V7a5 5 0 0 1 10 0v4"/></svg>;
const UserPlusIcon = () => <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M16 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="8.5" cy="7" r="4"/><line x1="20" y1="8" x2="20" y2="14"/><line x1="23" y1="11" x2="17" y2="11"/></svg>;
const ImageIcon = () => <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="3" width="18" height="18" rx="2" ry="2"/><circle cx="8.5" cy="8.5" r="1.5"/><polyline points="21 15 16 10 5 21"/></svg>;
const CalendarIcon = () => <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="4" width="18" height="18" rx="2" ry="2"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/></svg>;
const UserIcon = () => <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12.1992 12C14.9606 12 17.1992 9.76142 17.1992 7C17.1992 4.23858 14.9606 2 12.1992 2C9.43779 2 7.19922 4.23858 7.19922 7C7.19922 9.76142 9.43779 12 12.1992 12Z"/><path d="M3 22C3.57038 20.0332 4.74796 18.2971 6.3644 17.0399C7.98083 15.7827 9.95335 15.0687 12 15C16.12 15 19.63 17.91 21 22"/></svg>;

interface UserProfile {
  id: number;
  username: string;
  name: string | null;
  typeUser: "ADMIN" | "EMPLOYEE";
}

const ChangePasswordModal = ({ onClose }: { onClose: () => void }) => {
  const { token, logout } = useAuth();

  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmNewPassword, setConfirmNewPassword] = useState("");

  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (event: FormEvent) => {
    event.preventDefault();
    setError(null);
    setIsLoading(true);

    if (newPassword.length < 6) {
      setError("A nova senha deve ter pelo menos 6 caracteres.");
      setIsLoading(false);
      return;
    }
    if (newPassword !== confirmNewPassword) {
      setError("A nova senha e a confirmação não coincidem.");
      setIsLoading(false);
      return;
    }
    if (!token) {
      setError("Sessão inválida. Faça login novamente.");
      logout();
      return;
    }

    try {
      const response = await fetch("/api/changePassword", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`,
        },
        body: JSON.stringify({
          currentPassword,
          newPassword,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Erro ao trocar a senha.");
      }

      toast.success("Senha alterada com sucesso!");
      onClose();
    } catch (err) {
      if (err instanceof Error) {
        setError(err.message);
      } else {
        setError("Ocorreu um erro desconhecido.");
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className={styles.modalOverlay}>
      <form className={styles.modalContent} onSubmit={handleSubmit}>
        <div className={styles.modalHeader}>
          <h3>Alterar Senha</h3>
          <button type="button" className={styles.closeButton} onClick={onClose}>&times;</button>
        </div>
        <p className={styles.modalDescription}>Digite sua senha atual e a nova senha para alterar</p>

        <label htmlFor="senhaAtual" className={styles.modalLabel}>Senha Atual</label>
        <input
          type="password"
          id="senhaAtual"
          className={styles.modalInput}
          value={currentPassword}
          onChange={(e) => setCurrentPassword(e.target.value)}
          required
        />

        <label htmlFor="novaSenha" className={styles.modalLabel}>Nova Senha</label>
        <input
          type="password"
          id="novaSenha"
          className={styles.modalInput}
          value={newPassword}
          onChange={(e) => setNewPassword(e.target.value)}
          required
        />

        <label htmlFor="confirmarNovaSenha" className={styles.modalLabel}>Confirmar Nova Senha</label>
        <input
          type="password"
          id="confirmarNovaSenha"
          className={styles.modalInput}
          value={confirmNewPassword}
          onChange={(e) => setConfirmNewPassword(e.target.value)}
          required
        />

        {error && <p style={{ color: 'red', marginTop: '10px' }}>{error}</p>}

        <div className={styles.modalActions}>
          <button type="button" className={styles.cancelButton} onClick={onClose} disabled={isLoading}>
            Cancelar
          </button>
          <button type="submit" className={styles.saveButton} disabled={isLoading}>
            {isLoading ? "Salvando..." : "Salvar Alterações"}
          </button>
        </div>
      </form>
    </div>
  );
};

export default function Perfil() {
  const router = useRouter();
  const { isAuthenticated, isLoading: isAuthLoading, token } = useAuth();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [userData, setUserData] = useState<UserProfile | null>(null);
  const [isDataLoading, setIsDataLoading] = useState(true);

  useEffect(() => {
    if (!isAuthLoading && !isAuthenticated) {
      router.push("/pages/login");
    }
  }, [isAuthenticated, isAuthLoading, router]);

  useEffect(() => {
    if (!isAuthLoading && isAuthenticated) {
      const fetchUserData = async () => {
        if (!token) {
          router.push("/pages/login");
          return;
        }

        try {
          const response = await fetch("/api/user", {
            method: "GET",
            headers: {
              "Content-Type": "application/json",
              "Authorization": `Bearer ${token}`,
            },
          });

          if (!response.ok) {
            throw new Error("Falha ao carregar dados do usuário.");
          }

          const data = await response.json();
          setUserData(data);
        } catch (error) {
          console.error("Erro ao buscar dados do perfil:", error);
          toast.error("Erro ao carregar seu perfil.");
        } finally {
          setIsDataLoading(false);
        }
      };

      fetchUserData();
    } else if (!isAuthLoading && !isAuthenticated) {
      setIsDataLoading(false);
    }
  }, [isAuthenticated, isAuthLoading, router, token]);
  if (isAuthLoading || isDataLoading || !isAuthenticated || userData === null) {
    return (
      <div className={styles.container} style={{ textAlign: "center", paddingTop: "50px" }}>
        <p>Verificando acesso...</p>
      </div>
    );
  }

  return (
    <div className={styles.container}>

      <div className={styles.profileCard}>
        <div className={styles.profileInfo}>
          <div className={styles.avatar}>{userData.name ? userData.name.slice(0, 2).toUpperCase() : userData.username.slice(0, 2).toUpperCase()}</div>
          <div>
            <div className={styles.nameRow}>
              <h2 className={styles.name}>{userData.name}</h2>
              {
                userData.typeUser == "ADMIN" ?
                  <span className={styles.adminTag}>Administrador</span> :
                  <span className={styles.employeeTag}>Funcionário</span>
              }
            </div>
            <p className={styles.detailItem}><UserIcon />{userData.username}</p>
          </div>
        </div>
      </div>

      <div className={styles.sectionCard}>
        <div className={styles.securityHeader}>
          <LockIcon />
          <h3>Segurança</h3>
        </div>
        <div className={styles.securityContent}>
          <p>Gerencie sua senha de acesso</p>
          <button className={styles.changePasswordButton} onClick={() => setIsModalOpen(true)}>Trocar Senha</button>
        </div>
      </div>

      <div className={styles.sectionCard}>
        <h3>Ações Administrativas</h3>
        <div className={styles.adminActions}>
          {userData.typeUser === "ADMIN" ? (
            <Link
              href="/pages/registro"
              className={`${styles.actionItem} ${styles.highlightedAction} ${styles.linkAsButton}`}
            >
              <UserPlusIcon />
              <div>
                <h4>Cadastrar Novo Usuário</h4>
                <p>Adicione novos colaboradores ao sistema</p>
              </div>
            </Link>
            ) : null
          }

          <Link
            href="/pages/30anos"
            className={styles.actionItem}>
            <ImageIcon />
            <div>
              <h4>Adicionar Foto à Linha do Tempo</h4>
              <p>Publique momentos do colaborador</p>
            </div>
          </Link>

          <Link
            href="/pages/datas-comemorativas"
            className={styles.actionItem}>
            <CalendarIcon />
            <div>
              <h4>Adicionar Data Comemorativa</h4>
              <p>Registre aniversários e datas importantes</p>
            </div>
          </Link>

        </div>
      </div>

      {isModalOpen && <ChangePasswordModal onClose={() => setIsModalOpen(false)} />}
    </div>
  );
}