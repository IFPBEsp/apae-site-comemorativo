import { Timeline } from "antd";
import Styles from "./page.module.css";
import Image from "next/image";

import Dot from "@/app/components/dot/Dot";

export default function TrintaAnosPage() {
	const timelineItems = [
		{
			children: (
				<Dot
					title="1995 - Construção da APAE em Esperança"
					image="/apae-site-comemorativo/placeholder-image.jpg"
					imageDescription="img1 descrição"
				/>
			),
			label: "Descrição 1",
		},
		{
			children: (
				<Dot
					title="2000 - Início do atendimento na cidade"
					image="/apae-site-comemorativo/placeholder-image.jpg"
					imageDescription="img2 descrição"
				/>
			),
			label: "Descrição 2",
		},
		{
			children: (
				<Dot
					title="2018 - Ampliação de serviços para distritos"
					image="/apae-site-comemorativo/placeholder-image.jpg"
					imageDescription="img3 descrição"
				/>
			),
			label: "Descrição 3",
		},
		{
			children: (
				<Dot
					title="2025 - Comemoração dos 30 anos da APAE"
					image="/apae-site-comemorativo/placeholder-image.jpg"
					imageDescription="img4 descrição"
				/>
			),
			label: "Descrição 4",
		},
	];

	return (
		<div className={Styles.container}>
			<div className={Styles.titleDiv}>
				<Image src="/apae-site-comemorativo/logo-30anos.png" alt="APAE Logo" className={Styles.logo} width={150} height={150} />
				<h1 className={Styles.title}>30 Anos Fazendo a Diferença</h1>
			</div>
			<p className={Styles.text}>
				A APAE (Associação de Pais e Amigos dos Excepcionais) de Esperança - PB
				celebra 30 anos de dedicação à assistência e inclusão social da
				comunidade. Ao longo dessas três décadas, a instituição tem transformado
				vidas, promovendo desenvolvimento e apoio, além de contar com a valiosa
				contribuição de voluntários e profissionais comprometidos.
			</p>
			<Timeline
				items={timelineItems}
				mode="alternate"
				style={{ minWidth: "50%", wordWrap: "break-word", margin: "50px 0" }}
			/>
		</div>
	);
};
