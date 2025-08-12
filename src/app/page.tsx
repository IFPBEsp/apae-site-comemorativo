import styles from "./page.module.css";
import Link from "next/link";
import Image from "next/image";

import AudioReader from "@/app/components/reader/Reader";

export default function HomePage() {
  return (
    <>
      <div className={styles.hero}>
        <div className={styles.overlay}>
          <h1>Associação de Pais e Amigos dos <br /> Excepcionais de Esperança</h1>
          <Image
            src="/apae-site-comemorativo/logo-30anos.png"
            alt="Selo comemorativo de 30 anos da APAE Esperança-PB com o logotipo da APAE dentro do número zero"
            width={200}
            height={200}
          />
        </div>
      </div>

      <main className={styles.content}>
        <AudioReader
          src="/apae-site-comemorativo/audio-descricao/telaPrincipal.wav"
          audioTitle="Descrição da Página em Áudio"
        />
        <section className={styles.intro}>
          <h2>30 Anos Fazendo a Diferença</h2>
          <h3>APAE Esperança</h3>
          <p>
            A Associação de Pais e Amigos dos Excepcionais de Esperança (APAE) é
            uma instituição filantrópica, sem fins lucrativos criada em outubro de
            1995, que tem a finalidade de prestar assistência integral às pessoas
            com deficiência intelectual. Para manter as suas atividades, a
            instituição oferece diversos serviços à comunidade que propiciam a sua
            viabilidade econômica.
            Os recursos arrecadados com os serviços são revertidos para o atendimento
            a pessoas com deficiências.
          </p>
        </section>

        <section className={styles.ctaSection}>
          <h4>Conheça Mais Sobre a Nossa Trajetória</h4>
          <div className={styles.ctaBox}>
            <p>
              Na seção de 30 anos da APAE, celebramos e relembrando momentos marcantes
              por meio de uma linha do tempo, depoimentos emocionantes e eventos comemorativos.
              Mais do que uma celebração, essa data simboliza o compromisso contínuo com a
              inclusão, o respeito e a construção de uma sociedade mais justa para todos.
            </p>
            <Link href="/pages/30anos">
              <button className={styles.ctaButton}>30 Anos da APAE</button>
            </Link>
          </div>
        </section>

        <section className={styles.partners}>
          <h4>Parceiros</h4>
          <Image
            src="/apae-site-comemorativo/parceiro-escudo.png"
            alt="Brasão oficial do município de Esperança - PB, nas cores verde e branco, com uma torre em formato de coroa no topo, uma pomba branca na parte verde, flores na parte branca e o ano 1925 em baixo"
            width={70}
            height={100}
          />
        </section>
      </main>
    </>
  );
}
