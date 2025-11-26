"use client";

import { useState, useEffect } from "react";
import styles from "./page.module.css";
import Link from "next/link";
import Image from "next/image";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import { motion, Variants } from "framer-motion";

import AudioReader from "@/app/components/reader/Reader";
import PartnersCarousel from "@/app/components/partners-carousel/PartnersCarousel";
import TestimonialCarousel from "./components/testimonials-carousel/TestimonialCarousel";
import TestimonialCrudModal from "@/app/components/testimonial-crud-modal/TestimonialCrudModal";
import { useAuth } from "@/app/context/AuthContext";

interface Testimonial {
  id: string;
  name: string;
  content: string;
  date: string;
  role?: string;
}

const sectionVariants: Variants = {
  hidden: { opacity: 0, y: 50 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.6,
      ease: "easeOut",
    },
  },
};

export default function HomePage() {
  const { isAuthenticated, user } = useAuth();
  const [testimonials, setTestimonials] = useState<Testimonial[]>([]);
  const [showTestimonialCrud, setShowTestimonialCrud] = useState(false);

  const ALLOWED_ROLES = ["ADMIN", "EMPLOYEE"];
  const isEmployeeLoggedIn =
    isAuthenticated && user && ALLOWED_ROLES.includes(user.typeUser);

  useEffect(() => {
    fetchTestimonials();
  }, []);

  const fetchTestimonials = async () => {
    try {
      const timestamp = new Date().getTime();
      const res = await fetch(`/api/testimonials?limit=20&_t=${timestamp}`);
      if (!res.ok) {
        console.error("Falha ao buscar depoimentos:", res.statusText);
        setTestimonials([]);
        return;
      }
      const data = await res.json();
      setTestimonials(data.data as Testimonial[]);
    } catch (error) {
      console.error("Erro no fetch de depoimentos:", error);
      setTestimonials([]);
    }
  };

  const handleTestimonialCrudClose = () => {
    setShowTestimonialCrud(false);
    fetchTestimonials();
  };

  return (
    <>
      <motion.div
        className={styles.hero}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 1 }}
      >
        <div className={styles.overlay}>
          <motion.h1
            initial={{ y: -20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.8, delay: 0.5 }}
          >
            Associação de Pais e Amigos dos <br /> Excepcionais de Esperança
          </motion.h1>
          <motion.div
            initial={{ scale: 0.5, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ duration: 0.5, delay: 1 }}
          >
						<Link href="/">
              <Image
                src="/logo-30anos.png"
                alt="Selo comemorativo de 30 anos da APAE Esperança-PB com o logotipo da APAE dentro do número zero"
                width={200}
                height={200}
                style={{ cursor: 'pointer' }} 
              />
            </Link>
          </motion.div>
        </div>
      </motion.div>

      <main className={styles.content}>
        <AudioReader
          src="/audio-descricao/telaPrincipal.wav"
          audioTitle="Resumo da Página em Áudio"
        />

        <motion.section
          className={styles.intro}
          variants={sectionVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.4 }}
        >
          <h2>30 Anos Fazendo a Diferença</h2>
          <h3>APAE Esperança</h3>
          <p>
            A Associação de Pais e Amigos dos Excepcionais de Esperança (APAE) é
            uma instituição filantrópica, sem fins lucrativos criada em outubro
            de 1995, que tem a finalidade de prestar assistência integral às
            pessoas com deficiência intelectual. Para manter as suas atividades,
            a instituição oferece diversos serviços à comunidade que propiciam a
            sua viabilidade econômica. Os recursos arrecadados com os serviços
            são revertidos para o atendimento a pessoas com deficiências.
          </p>
        </motion.section>

        <motion.section
          className={styles.testimonialsSection}
          variants={sectionVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.4 }}
        >
          {(testimonials.length > 0 || isEmployeeLoggedIn) && (
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                marginBottom: "20px",
              }}
            >
              <h3 className={styles.sectionTitle}>Depoimentos</h3>
              {isEmployeeLoggedIn && (
                <button
                  className={styles.ctaButton}
                  onClick={() => setShowTestimonialCrud(true)}
                  style={{ fontSize: "14px", padding: "8px 16px" }}
                >
                  Gerenciar Depoimentos
                </button>
              )}
            </div>
          )}
          {testimonials.length > 0 && (
            <TestimonialCarousel testimonials={testimonials} />
          )}
        </motion.section>

        <motion.section
          className={styles.ctaSection}
          variants={sectionVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.4 }}
        >
          <h3>Conheça Mais Sobre a Nossa Trajetória</h3>
          <div className={styles.ctaBox}>
            <p>
              Na seção de 30 anos da APAE, celebramos e relembrando momentos
              marcantes por meio de uma linha do tempo, depoimentos emocionantes
              e eventos comemorativos. Mais do que uma celebração, essa data
              simboliza o compromisso contínuo com a inclusão, o respeito e a
              construção de uma sociedade mais justa para todos.
            </p>
            <Link href="/pages/30anos">
              <button className={styles.ctaButton}>30 Anos da APAE</button>
            </Link>
          </div>
        </motion.section>

        <motion.section
          className={styles.partners}
          variants={sectionVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.4 }}
        >
          <h3>Parceiros</h3>
          <PartnersCarousel />
        </motion.section>
      </main>

      <TestimonialCrudModal
        open={showTestimonialCrud}
        onClose={handleTestimonialCrudClose}
      />
    </>
  );
}
