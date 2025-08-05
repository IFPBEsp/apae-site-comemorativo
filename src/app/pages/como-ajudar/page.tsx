import React from 'react';
import { Container, Typography } from '@mui/material';
import Image from 'next/image';
import styles from './page.module.css';
import BlocoConteudo from '@/app/components/bloco-conteudo/BlocoConteudo';
import { UsersRound, BriefcaseBusiness, Archive, HeartHandshake, Handshake } from 'lucide-react';

const PaginaComoAjudar: React.FC = () => {
  return (
    <div className={styles.pageContainer}>
      <div className={styles.heroBanner}>
        <Image
          src="/apae-site-comemorativo/banner-doacao.png"
          alt="Faça a sua doação!"
          layout="fill"
          objectFit="cover"
          priority
        />
      </div>
      <Container maxWidth="lg" sx={{ my: 4 }}>
        <Typography variant="h2" component="h1" align="center" className={styles.tituloPrincipal}>
          Como Ajudar
        </Typography>
        <Typography variant="h4" component="h2" align="center" className={styles.subtitulo}>
          Saiba Como Ajudar
        </Typography>

        <BlocoConteudo
          icone={UsersRound}
          titulo="Se Torne Um Voluntário"
          texto="Sua ajuda é essencial para a continuidade dos importantes projetos realizados pela APAE de Esperança. Ao se tornar voluntário, você estará fazendo a diferença de maneira direta na vida de muitas pessoas. Com seu apoio, poderemos oferecer um atendimento de qualidade, melhorar os recursos disponíveis e expandir nossos programas. O tempo e o esforço que você dedica à nossa causa são valiosos para que possamos continuar levando amor, cuidado e oportunidades para aqueles que mais precisam. Junte-se a nós e seja uma parte fundamental dessa transformação!"
        />

        <BlocoConteudo
          icone={BriefcaseBusiness}
          titulo="Trabalhe Conosco"
          texto="Venha fazer parte da APAE de Esperança. Ao trabalhar conosco, você estará fazendo a diferença de maneira direta na vida de muitas pessoas. Com seu trabalho, poderemos oferecer um atendimento de qualidade. O tempo e o esforço que você dedica à nossa causa são valiosos para que possamos continuar levando amor, cuidado e oportunidades para aqueles que mais precisam. Junte-se a nós e seja uma parte fundamental dessa transformação!
Precisamos de profissionais de saúde capacitados. Para se candidatar, basta anexar o seu currículo com informações de contato no email."
        />

        <BlocoConteudo
          icone={Archive}
          titulo="Faça Uma Doação Material"
          texto="Você pode fazer uma doação material para ser destinada a quem mais precisa, como material escolar, equipamentos terapêuticos, mobiliário, roupas, brinquedos, etc."
        />

        <BlocoConteudo
          icone={HeartHandshake}
          titulo="Faça Uma Doação Financeira"
          texto="A sua doação é fundamental para continuidade dos trabalhos desenvolvidos pela APAE. Sua doações financeiras irão contribuir de maneira direta e eficaz em apoiar a APAE de Esperança. Esses fundos podem ser usados para cobrir despesas operacionais, adquirir equipamentos, oferecer programas terapêuticos e nós ajudará a poder ajudar ainda mais pessoas."
        />

        <BlocoConteudo
          icone={Handshake}
          titulo="Se Torne um Parceiro"
          texto="Sua empresa pode fazer a diferença, invista em Responsabilidade Social associando a sua marca a um trabalho que proporciona melhor qualidade de vida e venha fazer a diferença! Entre em contanto através de email ou nós faça uma visita."
        />

      </Container>
    </div>
  );
};

export default PaginaComoAjudar;