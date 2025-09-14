'use client';
import { useState } from 'react';
import { Timeline } from "antd";
import Styles from "./page.module.css";
import Image from "next/image";

import Dot from "@/app/components/dot/Dot";
import AudioReader from "@/app/components/reader/Reader";
import Programacao from "@/app/components/programacao/Programacao"

export default function TrintaAnosPage() {
	const [showProgramacao, setShowProgramacao] = useState(false);

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
			className: "timelineDot"
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
			className: "timelineDot"
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
			className: "timelineDot"
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
			className: "timelineDot"
		},
	];

	return (
		<div className={Styles.container}>
			<div className={Styles.titleDiv}>
				<Image src="/apae-site-comemorativo/logo-30anos.png" alt="Selo comemorativo de 30 anos da APAE Esperança-PB com o logotipo da APAE dentro do número zero" className={Styles.logo} width={150} height={150} />
				<h1 className={Styles.title}>30 Anos Fazendo a Diferença</h1>
			</div>
			<AudioReader
				src="/apae-site-comemorativo/audio-descricao/tela30Anos.wav"
				audioTitle="Descrição da Página em Áudio"
			/>
			<p className={Styles.text}>
				A APAE (Associação de Pais e Amigos dos Excepcionais) de Esperança - PB
				celebra 30 anos de dedicação à assistência e inclusão social da
				comunidade. Ao longo dessas três décadas, a instituição tem transformado
				vidas, promovendo desenvolvimento e apoio, além de contar com a valiosa
				contribuição de voluntários e profissionais comprometidos.
			</p>
			<button className={Styles.ctaButton} onClick={() => setShowProgramacao(true)}>
  				Acesse nossa programação
			</button>
			<Timeline
				items={timelineItems}
				mode="alternate"
				style={{ minWidth: "50%", wordWrap: "break-word", margin: "50px 0" }}
			/>
			<Programacao open={showProgramacao} onClose={() => setShowProgramacao(false)} />
		</div>
	);
};
