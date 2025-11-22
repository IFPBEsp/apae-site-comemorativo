"use client"; 

import React, { useState } from "react";
import styles from "./page.module.css";

const LockIcon = () => <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="11" width="18" height="11" rx="2" ry="2"/><path d="M7 11V7a5 5 0 0 1 10 0v4"/></svg>;
const UserPlusIcon = () => <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M16 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="8.5" cy="7" r="4"/><line x1="20" y1="8" x2="20" y2="14"/><line x1="23" y1="11" x2="17" y2="11"/></svg>;
const ImageIcon = () => <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="3" width="18" height="18" rx="2" ry="2"/><circle cx="8.5" cy="8.5" r="1.5"/><polyline points="21 15 16 10 5 21"/></svg>;
const CalendarIcon = () => <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="4" width="18" height="18" rx="2" ry="2"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/></svg>;
const MailIcon = () => <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="5" width="18" height="14" rx="2"/><path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7"/></svg>;
const BriefcaseIcon = () => <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="2" y="7" width="20" height="14" rx="2" ry="2"/><path d="M16 21V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16"/></svg>;
const ClockIcon = () => <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>;


const ChangePasswordModal = ({ onClose }: { onClose: () => void }) => {
  return (
    <div className={styles.modalOverlay}>
      <div className={styles.modalContent}>
        <div className={styles.modalHeader}>
          <h3>Alterar Senha</h3>
          <button className={styles.closeButton} onClick={onClose}>&times;</button>
        </div>
        <p className={styles.modalDescription}>Digite sua senha atual e a nova senha para alterar</p>
        
        <label htmlFor="senhaAtual" className={styles.modalLabel}>Senha Atual</label>
        <input type="password" id="senhaAtual" className={styles.modalInput} />

        <label htmlFor="novaSenha" className={styles.modalLabel}>Nova Senha</label>
        <input type="password" id="novaSenha" className={styles.modalInput} />

        <label htmlFor="confirmarNovaSenha" className={styles.modalLabel}>Confirmar Nova Senha</label>
        <input type="password" id="confirmarNovaSenha" className={styles.modalInput} />

        <div className={styles.modalActions}>
          <button className={styles.cancelButton} onClick={onClose}>Cancelar</button>
          <button className={styles.saveButton}>Salvar Alterações</button>
        </div>
      </div>
    </div>
  );
};

export default function Perfil() {
  const [isModalOpen, setIsModalOpen] = useState(false);

  return (
    <div className={styles.container}>
      
      <div className={styles.profileCard}>
        <div className={styles.profileInfo}>
          <div className={styles.avatar}>MS</div>
          <div>
            <div className={styles.nameRow}>
              <h2 className={styles.name}>Maria Silva</h2>
              <span className={styles.adminTag}>Administrador</span>
            </div>
            <p className={styles.detailItem}><MailIcon /> maria.silva@empresa.com.br</p>
            <p className={styles.detailItem}><BriefcaseIcon /> Gerente de Projetos</p>
            <p className={styles.detailItem}><ClockIcon /> Desde Janeiro 2022</p>
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
          
          <div className={`${styles.actionItem} ${styles.highlightedAction}`}>
            <UserPlusIcon />
            <div>
              <h4>Cadastrar Novo Usuário</h4>
              <p>Adicione novos colaboradores ao sistema</p>
            </div>
          </div>
          
          <div className={styles.actionItem}>
            <ImageIcon />
            <div>
              <h4>Adicionar Foto à Linha do Tempo</h4>
              <p>Publique momentos do colaborador</p>
            </div>
          </div>

          <div className={styles.actionItem}>
            <CalendarIcon />
            <div>
              <h4>Adicionar Data Comemorativa</h4>
              <p>Registre aniversários e datas importantes</p>
            </div>
          </div>
          
        </div>
      </div>

      {isModalOpen && <ChangePasswordModal onClose={() => setIsModalOpen(false)} />}
    </div>
  );
}