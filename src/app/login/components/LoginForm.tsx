'use client'; 

import Image from 'next/image';
import styles from './LoginForm.module.css';

import { Mail, Lock, Eye, HelpCircle } from 'lucide-react'; 

export default function LoginForm() {

  return (
    <div className={styles.card}>
      <div className={styles.logoContainer}>
        <Image 
          src="/apae-site-comemorativo/logo-apae.png"
          alt="Logo da APAE"
          width={150}
          height={50}
          style={{ objectFit: 'contain' }}
        />
      </div>

      <form className={styles.form}>
        <div className={styles.inputGroup}>
          <label htmlFor="email" className={styles.label}>Email</label>
          <div className={styles.inputWrapper}>
            <Mail className={styles.inputIcon} strokeWidth={2.0} />
            <input
              type="email"
              id="email"
              name="email"
              className={styles.input}
              placeholder="Digite seu e-mail"
              required
            />
            <button type="button" className={styles.passwordToggleIcon}>
              <HelpCircle strokeWidth={2.0} />
            </button>
          </div>
        </div>

        <div className={styles.inputGroup}>
          <label htmlFor="password" className={styles.label}>Password</label>
          <div className={styles.inputWrapper}>
            <Lock className={styles.inputIcon} strokeWidth={2.0} />
            <input
              type="password" 
              id="password"
              name="password"
              className={styles.input}
              placeholder="Digite sua senha"
              required
            />
            <button type="button" className={styles.passwordToggleIcon}>
              <Eye strokeWidth={2.0} />
            </button>
          </div>
        </div>

        <button type="submit" className={styles.submitButton}>
          Entrar
        </button>
      </form>

      <a href="#" className={styles.forgotPasswordLink}>
        Esqueceu sua senha?
      </a>
    </div>
  );
}