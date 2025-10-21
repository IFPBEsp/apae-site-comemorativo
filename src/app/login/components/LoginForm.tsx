'use client'; 

import { useState, FormEvent } from 'react';
import Image from 'next/image';
import { useRouter } from 'next/navigation'; 
import styles from './LoginForm.module.css';

import { Mail, Lock, Eye, EyeOff, HelpCircle } from 'lucide-react'; 

export default function LoginForm() {
  const router = useRouter(); 

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showHelp, setShowHelp] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (event: FormEvent) => {
    event.preventDefault(); 
    setIsLoading(true);
    setError('');

    try {
      const response = await fetch('/apae-site-comemorativo/api/auth/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ 
          username: email,
          password: password,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Ocorreu um erro ao tentar fazer login.');
      }

      console.log('Login bem-sucedido! Token:', data.token);

      router.push('/'); 

    } catch (err: any) {
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  };

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

        {error && (
          <p className={styles.errorMessage}>{error}</p>
        )}

        <button 
          type="submit" 
          className={styles.submitButton}
          disabled={isLoading}
        >
          {isLoading ? 'Entrando...' : 'Entrar'}
        </button>
      </form>

      <a href="#" className={styles.forgotPasswordLink}>
        Esqueceu sua senha?
      </a>
    </div>
  );
}
