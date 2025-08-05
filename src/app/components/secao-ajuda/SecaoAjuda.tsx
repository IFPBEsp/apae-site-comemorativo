import React from 'react';
import { Typography } from '@mui/material';
import styles from './SecaoAjuda.module.css';

const SecaoAjuda: React.FC = () => {
  return (
    <div className={styles.secaoContainer}>
      <Typography variant="h4" component="h2">
        Seja um doador
      </Typography>
      <Typography variant="body1" paragraph>
        Sua doação é fundamental para a APAE continuar oferecendo suporte e serviços essenciais. Ao doar, você contribui para a melhoria da qualidade de vida de muitas pessoas e suas famílias.
      </Typography>
      <Typography variant="h5" component="h3">
        Como Doar?
      </Typography>
      <Typography variant="body1" paragraph>
        Você pode fazer uma doação através do formulário ao lado. Basta preencher seus dados e entraremos em contato para finalizar o processo.
      </Typography>
    </div>
  );
};

export default SecaoAjuda;