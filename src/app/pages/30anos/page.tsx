"use client";

import { useState, useEffect, useCallback } from "react";
import { Timeline, Spin } from "antd";
import Styles from "./page.module.css";
import Image from "next/image";
import AudioReader from "@/app/components/reader/Reader";
import MediaCrudModal from "@/app/components/media-crud-modal/MediaCrudModal";
import { useAuth } from "@/app/context/AuthContext";

interface TimelinePost {
	id: string;
	title: string;
	description: string;
	imageUrl: string;
	postDate: string;
}

interface TimelineItem {
	children: React.ReactNode;
	label: string | React.ReactNode;
	className?: string;
}

export default function TrintaAnosPage() {
	const { isAuthenticated, user } = useAuth();

	const ALLOWED_ROLES = ["ADMIN", "EMPLOYEE"];

	const isEmployeeLoggedIn = isAuthenticated && user && ALLOWED_ROLES.includes(user.typeUser);

	const [showMediaCrud, setShowMediaCrud] = useState(false);
	const [timelinePosts, setTimelinePosts] = useState<TimelinePost[]>([]);
	const [isLoadingTimeline, setIsLoadingTimeline] = useState(false);

	const fetchTimelinePosts = useCallback(async () => {
		setIsLoadingTimeline(true);
		try {
			const response = await fetch("/api/timeline-posts?page=1&limit=100");

			if (!response.ok) {
				throw new Error(`Falha ao carregar a linha do tempo: ${response.status}`);
			}

			const data = await response.json();
			setTimelinePosts(data.data || []);

		} catch (error) {
			console.error("Erro ao carregar a linha do tempo:", error);
		} finally {
			setIsLoadingTimeline(false);
		}
	}, []);

	useEffect(() => {
		fetchTimelinePosts();
	}, [fetchTimelinePosts]);

	const mapPostsToTimelineItems = (posts: TimelinePost[]): TimelineItem[] => {

		const sortedPosts = [...posts].sort((a, b) =>
			new Date(b.postDate).getTime() - new Date(a.postDate).getTime()
		);

		return sortedPosts.map((post, index) => {
			const date = new Date(post.postDate).toLocaleDateString('pt-BR', {
				year: 'numeric',
				month: 'long',
				day: 'numeric'
			});

			return {
				label: <span style={{ fontWeight: 'bold' }}>{date}</span>,
				children: (
					<div className={Styles.timelineItemContent}>
						<h3 style={{ marginBottom: 5 }}>{post.title}</h3>
						<p>{post.description}</p>
						{post.imageUrl && (
							<Image
								src={post.imageUrl}
								alt={post.title}
								width={300}
								height={200}
								style={{
									maxWidth: '100%',
									height: 'auto',
									borderRadius: '8px',
									marginTop: '10px'
								}}
							/>
						)}
					</div>
				),
				className: index % 2 === 0 ? Styles.left : Styles.right,
			};
		});
	};

	const timelineItems: TimelineItem[] = mapPostsToTimelineItems(timelinePosts);
	const shouldRenderTimeline = timelineItems && timelineItems.length > 0;

	const handleMediaCrudClose = () => {
		setShowMediaCrud(false);
		fetchTimelinePosts();
	};

	return (
		<div className={Styles.container}>
			<div className={Styles.titleDiv}>
				<Image src="/logo-30anos.png" alt="Selo comemorativo de 30 anos da APAE Esperança-PB com o logotipo da APAE dentro do número zero" className={Styles.logo} width={150} height={150} />
				<h1 className={Styles.title}>30 Anos Fazendo a Diferença</h1>
			</div>
			<AudioReader
				src="/audio-descricao/tela30Anos.wav"
				audioTitle="Descrição da Página em Áudio"
			/>

			<p className={Styles.text}>
				A APAE (Associação de Pais e Amigos dos Excepcionais) de Esperança - PB
				celebra 30 anos de dedicação à assistência e inclusão social da
				comunidade. Ao longo dessas três décadas, a instituição tem transformado
				vidas, promovendo desenvolvimento e apoio, além de contar com a valiosa
				contribuição de voluntários e profissionais comprometidos.
			</p>

			{isEmployeeLoggedIn ? (
				<button
					className={Styles.ctaButton}
					onClick={() => setShowMediaCrud(true)}
				>
					Gerenciar Mídias da Linha do Tempo
				</button>
			) : (
				<div style={{ minHeight: "40px" }} />
			)}

			<Spin spinning={isLoadingTimeline} tip="Carregando História..." style={{ width: "100%", minHeight: "200px" }}>
				{shouldRenderTimeline ? (
					<Timeline
						items={timelineItems}
						mode="alternate"
						style={{ minWidth: "50%", wordWrap: "break-word", margin: "50px 0" }}
					/>
				) : (
					!isLoadingTimeline && <p style={{ textAlign: "center", marginTop: "50px" }}>Nossa história está sendo preparada!</p>
				)}
			</Spin>

			<MediaCrudModal
				open={showMediaCrud}
				onClose={handleMediaCrudClose}
			/>
		</div>
	);
};
