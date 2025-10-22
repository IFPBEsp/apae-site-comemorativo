import LoginForm from './components/LoginForm';
import styles from './page.module.css'; 

export default function LoginPage() {
  return (
    <main className={styles.main}>
      <div className={styles.content}>
        <LoginForm />
      </div>
    </main>
  );
}