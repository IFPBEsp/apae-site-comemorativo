"use client";

import React from "react";
import styles from "./Reader.module.css";

interface AudioReaderProps {
    src: string;
    audioTitle: string;
}

export default function AudioReader({ src, audioTitle }: AudioReaderProps) {
    return (
        <div className={styles.container}>
            <h3 className={styles.audioTitle}>{audioTitle}</h3>
            <audio controls src={src} className={styles.audioPlayer}>
                Seu navegador não suporta o elemento de áudio.
            </audio>
        </div>
    );
}
