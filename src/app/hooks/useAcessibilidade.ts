"use client";

import { useState, useEffect } from "react";

interface ConfiguracoesAcessibilidade {
  contraste: "altoContraste" | "contrasteNormal";
  escalaCinza: "escalaCinzaAtiva" | "escalaCinzaInativa";
  fonte: number;
}

const defaultAcessibilidade: ConfiguracoesAcessibilidade = {
  contraste: "contrasteNormal",
  escalaCinza: "escalaCinzaInativa",
  fonte: 16,
};

export function useAcessibilidade() {
  const [configuracoes, setConfiguracoes] = useState<ConfiguracoesAcessibilidade>(defaultAcessibilidade);

  useEffect(() => {
    const savedConfiguracoes = localStorage.getItem("acessibilidade");
    if (savedConfiguracoes) {
      try {
        setConfiguracoes(JSON.parse(savedConfiguracoes));
      } catch (error) {
        console.error("Erro ao carregar configurações de acessibilidade do localStorage:", error);
      }
    }
  }, []);

  const alternarContraste = () => {
    setConfiguracoes((prev) => ({
      ...prev,
      contraste:
        prev.contraste === "contrasteNormal"
          ? "altoContraste"
          : "contrasteNormal",
      escalaCinza: prev.contraste === "contrasteNormal" 
        ? "escalaCinzaInativa" 
        : prev.escalaCinza
    }));
  };

  const alternarEscalaCinza = () => {
    setConfiguracoes((prev) => ({
      ...prev,
      escalaCinza:
        prev.escalaCinza === "escalaCinzaInativa"
          ? "escalaCinzaAtiva"
          : "escalaCinzaInativa",
      contraste: prev.escalaCinza === "escalaCinzaInativa" 
        ? "contrasteNormal" 
        : prev.contraste
    }));
  };

  const diminuirFonte = () => {
    setConfiguracoes((prev) => ({
      ...prev,
      fonte: Math.max(14, prev.fonte - 1),
    }));
  };

  const aumentarFonte = () => {
    setConfiguracoes((prev) => ({
      ...prev,
      fonte: Math.min(24, prev.fonte + 1),
    }));
  };

  const resetConfiguracoes = () => {
    setConfiguracoes(defaultAcessibilidade);
    localStorage.removeItem("acessibilidade");
  };

  useEffect(() => {
    localStorage.setItem("acessibilidade", JSON.stringify(configuracoes));
  }, [configuracoes]);

  return {
    configuracoes,
    alternarContraste,
    alternarEscalaCinza,
    diminuirFonte,
    aumentarFonte,
    resetConfiguracoes,
  };
}