import Link from 'next/link';
import styles from './BotaoDoacao.module.css';
import { HeartHandshake } from 'lucide-react'; 

const BotaoDoacao = () => {
  return (
    <Link href="/pages/como-ajudar" passHref>
      <div className={styles.botaoDoacao}>
        <HeartHandshake className={styles.icone} />
      </div>
    </Link>
  );
};

export default BotaoDoacao;
