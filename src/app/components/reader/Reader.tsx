"use client";

import React, { useEffect, useState } from "react";
import styles from "./Reader.module.css";
import { Play, Pause, CircleStop, AudioLines } from "lucide-react";

interface TextReaderProps {
	text: string;
}

export default function TextReader({ text }: TextReaderProps) {
	const [firstVoice, setFirstVoice] = useState(true);
	const [reading, setReading] = useState(false);
	const [paused, setPaused] = useState(false);

	const read = () => {
		if ("speechSynthesis" in window) {
			window.speechSynthesis.cancel();

			const utterance = new SpeechSynthesisUtterance(text);
			utterance.lang = "pt-BR";
			const voices = speechSynthesis.getVoices();
			const voice = voices[firstVoice ? 0 : 1];
			utterance.voice = voice;

			utterance.onstart = () => {
				setReading(true);
				setPaused(false);
			};
			utterance.onend = () => {
				setReading(false);
				setPaused(false);
			};
			utterance.onerror = () => {
				setReading(false);
				setPaused(false);
			};

			window.speechSynthesis.speak(utterance);
		} else {
			alert("Seu navegador não suporta leitura de texto em voz alta.");
		}
	};

	const stopReading = () => {
		window.speechSynthesis.cancel();
		setReading(false);
		setPaused(false);
	};

	const stop = () => {
		if (window.speechSynthesis.speaking && !window.speechSynthesis.paused) {
			window.speechSynthesis.pause();
			setPaused(true);
		}
	};

	const resume = () => {
		if (window.speechSynthesis.paused) {
			window.speechSynthesis.resume();
			setPaused(false);
		}
	};

	useEffect(() => {
		return () => {
			window.speechSynthesis.cancel();
		};
	}, []);

	return (
		<div className={styles.container}>
			<div className={styles.buttonGroup}>
				<button
					onClick={() => setFirstVoice(true)}
					className={`${styles.button} ${styles.buttonVoice} ${
						firstVoice ? styles.buttonVoiceActive : ""
					}`}
				>
					<AudioLines className={styles.icon} />
					Primeira voz
				</button>
				<button
					onClick={() => setFirstVoice(false)}
					className={`${styles.button} ${styles.buttonVoice} ${
						!firstVoice ? styles.buttonVoiceActive : ""
					}`}
				>
					<AudioLines />
					Voz alternativa
				</button>
			</div>

			<div className={styles.buttonGroup}>
				{!reading ? (
					<button
						onClick={read}
						className={`${styles.button} ${styles.buttonActive}`}
					>
						<Play />
						Iniciar
					</button>
				) : (
					<button
						onClick={stopReading}
						className={`${styles.button} ${styles.buttonStop}`}
					>
						<CircleStop />
						Parar
					</button>
				)}

				{reading && !paused && (
					<button
						onClick={stop}
						className={`${styles.button} ${styles.buttonPause}`}
					>
						<Pause />
						Pausar
					</button>
				)}

				{paused && (
					<button
						onClick={resume}
						className={`${styles.button} ${styles.buttonResume}`}
					>
						<Play />
						Retomar
					</button>
				)}
			</div>
		</div>
	);
}
