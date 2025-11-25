"use client";

import { useState, useEffect } from "react";
import styles from "./page.module.css";
import Link from "next/link";
import Image from "next/image";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";

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

export default function HomePage() {
	const { isAuthenticated, user } = useAuth();
	const [testimonials, setTestimonials] = useState<Testimonial[]>([]);
	const [showTestimonialCrud, setShowTestimonialCrud] = useState(false);

	const ALLOWED_ROLES = ["ADMIN", "EMPLOYEE"];
	const isEmployeeLoggedIn = isAuthenticated && user && ALLOWED_ROLES.includes(user.typeUser);

	useEffect(() => {
		fetchTestimonials();
	}, []);

	const fetchTestimonials = async () => {
		try {
			const res = await fetch('/api/testimonials?limit=20');
			if (!res.ok) {
				console.error("Falha ao buscar depoimentos:", res.statusText);
				// Se falhar, usa dados vazios
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
		fetchTestimonials(); // Recarrega os depoimentos após fechar o modal
	};

	return (
		<>
			<div className={styles.hero}>
				<div className={styles.overlay}>
					<h1>
						Associação de Pais e Amigos dos <br /> Excepcionais de Esperança
					</h1>
					<Image
						src="/logo-30anos.png"
						alt="Selo comemorativo de 30 anos da APAE Esperança-PB com o logotipo da APAE dentro do número zero"
						width={200}
						height={200}
					/>
				</div>
			</div>

			<main className={styles.content}>
				<AudioReader
					src="/audio-descricao/telaPrincipal.wav"
					audioTitle="Resumo da Página em Áudio"
				/>
				<section className={styles.intro}>
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
				</section>

				<section className={styles.testimonialsSection}>
					<div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "20px" }}>
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
					<TestimonialCarousel testimonials={testimonials} />
				</section>

				<section className={styles.ctaSection}>
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
				</section>

				<section className={styles.partners}>
					<h3>Parceiros</h3>
					<PartnersCarousel />
				</section>
			</main>

			<TestimonialCrudModal
				open={showTestimonialCrud}
				onClose={handleTestimonialCrudClose}
			/>
		</>
	);
}
