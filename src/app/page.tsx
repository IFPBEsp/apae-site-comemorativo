import styles from "./page.module.css";
import Link from "next/link";
import Image from "next/image";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";

import AudioReader from "@/app/components/reader/Reader";
import PartnersCarousel from "@/app/components/partners-carousel/PartnersCarousel";
import TestimonialCarousel from "./components/testimonials-carousel/TestimonialCarousel";

interface Testimonial {
	id: string;
	name: string;
	content: string;
	date: string;
}

async function fetchTestimonials(): Promise<Testimonial[]> {
	// const apiUrl = 'http://localhost:3000/api/testimonials?limit=20';
	// Descomente a linha acima quando o backend estiver funcional e remova o bloco de placeholder abaixo.
	const PLACEHOLDER_DATA: Testimonial[] = [
		{
			id: "1",
			name: "Maria da Silva",
			content:
				"A APAE mudou a vida da minha família com seu carinho e profissionalismo. Um verdadeiro lar!",
			date: "2024-01-15",
		},
		{
			id: "2",
			name: "João Batista",
			content:
				"O acolhimento que recebemos aqui é incomparável. Sou muito grato aos professores.",
			date: "2024-02-20",
		},
		{
			id: "3",
			name: "Ana Oliveira",
			content:
				"Ver o desenvolvimento do meu filho me enche de esperança. Recomendo a todos!",
			date: "2024-03-10",
		},
		{
			id: "4",
			name: "Pedro Souza",
			content:
				"Excelente trabalho de inclusão social e educacional. Uma instituição vital para a comunidade.",
			date: "2024-04-05",
		},
		{
			id: "5",
			name: "Juliana Lira",
			content:
				"Os terapeutas são incríveis. O apoio da APAE vai além do esperado.",
			date: "2024-05-01",
		},
	];
	return PLACEHOLDER_DATA;

	/* // Código real (Descomente quando for para produção/integração completa):
    try {
        const res = await fetch(apiUrl, { next: { revalidate: 3600 } }); 
        if (!res.ok) {
            console.error("Falha ao buscar depoimentos:", res.statusText);
            return [];
        }
        const data = await res.json();
        return data.data as Testimonial[]; 
    } catch (error) {
        console.error("Erro no fetch de depoimentos:", error);
        return [];
    }
    */
}

export default async function HomePage() {
	const testimonials = await fetchTestimonials();

	return (
		<>
			<div className={styles.hero}>
				<div className={styles.overlay}>
					<h1>
						Associação de Pais e Amigos dos <br /> Excepcionais de Esperança
					</h1>
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
						uma instituição filantrópica, sem fins lucrativos criada em outubro
						de 1995, que tem a finalidade de prestar assistência integral às
						pessoas com deficiência intelectual. Para manter as suas atividades,
						a instituição oferece diversos serviços à comunidade que propiciam a
						sua viabilidade econômica. Os recursos arrecadados com os serviços
						são revertidos para o atendimento a pessoas com deficiências.
					</p>
				</section>

				<section className={styles.testimonialsSection}>
					<h3 className={styles.sectionTitle}>Depoimentos</h3>
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
		</>
	);
}
