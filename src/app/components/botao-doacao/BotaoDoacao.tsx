import Link from 'next/link';
import styles from './BotaoDoacao.module.css';
import { HeartHandshake } from 'lucide-react'; 

const BotaoDoacao = () => {
  return (
    <Link
      href="/pages/como-ajudar"
      className={styles.botaoDoacao}
      aria-label="Faça uma doação"
      title="Faça uma doação"
    >
      <HeartHandshake className={styles.icone} aria-hidden="true" focusable="false" />
    </Link>
  );
};

export default BotaoDoacao;
