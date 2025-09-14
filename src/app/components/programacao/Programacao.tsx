"use client";

import { Modal } from "antd";
import Image from "next/image";
import { useState } from "react";
import Styles from "./Programacao.module.css";

import img01 from "/public/panfleto/01.jpg";
import img02 from "/public/panfleto/02.jpg";
import img03 from "/public/panfleto/03.jpg";
import img04 from "/public/panfleto/04.jpg";
import img05 from "/public/panfleto/05.jpg";
import img06 from "/public/panfleto/06.jpg";

interface ProgramacaoProps {
  open: boolean;
  onClose: () => void;
}

export default function Programacao({ open, onClose }: ProgramacaoProps) {
  const [paginaAtual, setPaginaAtual] = useState(1);

  const imagens = [img01, img02, img03, img04, img05, img06];
  const totalPaginas = imagens.length;
  const imagemAtual = imagens[paginaAtual - 1];

  const mudarPagina = (novaPagina: number) => {
    setPaginaAtual(Math.min(Math.max(1, novaPagina), totalPaginas));
  };

  return (
    <Modal
      title="Programação dos 30 Anos"
      open={open}
      onCancel={onClose}
      footer={null}
      width={450}
      centered
      className={Styles.modal}
    >
      <div className={Styles.navegacao}>
        <button 
          onClick={() => mudarPagina(Math.max(1, paginaAtual - 1))}
          disabled={paginaAtual === 1}
          className={Styles.botaoNavegacao}
        >
          ← Anterior
        </button>
        
        <span className={Styles.indicadorPagina}>
          {paginaAtual} de {totalPaginas}
        </span>
        
        <button 
          onClick={() => mudarPagina(Math.min(totalPaginas, paginaAtual + 1))}
          disabled={paginaAtual === totalPaginas}
          className={Styles.botaoNavegacao}
        >
          Próxima →
        </button>
      </div>

      <div className={Styles.conteudo}>
        <Image 
          src={imagemAtual}
          alt={`Programação - Página ${paginaAtual}`}
          width={1175}
          height={2480}
          className={Styles.imagem}
          priority={paginaAtual === 1}
          placeholder="blur"
        />
      </div>

      <div className={Styles.pontosNavegacao}>
        {Array.from({ length: totalPaginas }, (_, index) => (
          <button
            key={index + 1}
            onClick={() => mudarPagina(index + 1)}
            className={`${Styles.ponto} ${paginaAtual === index + 1 ? Styles.ativo : ""}`}
            title={`Ir para página ${index + 1}`}
          />
        ))}
      </div>
    </Modal>
  );
}