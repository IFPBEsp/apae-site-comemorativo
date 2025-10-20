'use client'; 

import { useState, FormEvent } from 'react';
import Image from 'next/image';
import styles from './LoginForm.module.css';

import { Mail, Lock, Eye, EyeOff, HelpCircle } from 'lucide-react'; 

export default function LoginForm() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showHelp, setShowHelp] = useState(false);

  const handleSubmit = (event: FormEvent) => {
    event.preventDefault(); 
    console.log('Dados do formulário:', { email, password });
  };

  return (
    <div className={styles.card}>
      <div className={styles.logoContainer}>
      </div>

      <form className={styles.form} onSubmit={handleSubmit}>
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
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
            
            <button 
              type="button" 
              className={styles.passwordToggleIcon}
              onClick={() => setShowHelp(!showHelp)}
            >
              <HelpCircle strokeWidth={2.0} />

              <span className={`${styles.tooltip} ${showHelp ? styles.tooltipVisible : ''}`}>
                Digite um e-mail válido, como exemplo@dominio.com
              </span>
            </button>
          </div>
        </div>

        <div className={styles.inputGroup}>
          <label htmlFor="password" className={styles.label}>Password</label>
          <div className={styles.inputWrapper}>
            <Lock className={styles.inputIcon} strokeWidth={2.0} />
            <input
              type={showPassword ? 'text' : 'password'} 
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
              {showPassword ? <EyeOff strokeWidth={2.0} /> : <Eye strokeWidth={2.0} />}
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