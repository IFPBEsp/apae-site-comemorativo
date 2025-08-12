import { useState, useEffect } from 'react';

export type ConfiguracoesAcessibilidade = {
  contraste: 'padrao' | 'altoContraste';
  fonte: number; 
  escalaCinza: 'padrao' | 'escalaCinzaAtiva';
};

export function useAcessibilidade() {
  const [configuracoes, setConfiguracoes] = useState<ConfiguracoesAcessibilidade>({
    contraste: 'padrao',
    fonte: 18,
    escalaCinza: 'padrao',
  });

  useEffect(() => {
    try {
      const configuracoesSalvas = localStorage.getItem('acessibilidade');
      if (configuracoesSalvas) {
        setConfiguracoes(JSON.parse(configuracoesSalvas));
      }
    } catch (error) {
      console.error("Erro ao carregar configurações do localStorage: ", error);
    }
  }, []);

  useEffect(() => {
    try {
      localStorage.setItem('acessibilidade', JSON.stringify(configuracoes));
    } catch (error) {
      console.error("Erro ao salvar configurações no localStorage: ", error);
    }
  }, [configuracoes]);

  const alternarContraste = () => {
    setConfiguracoes(prev => ({
      ...prev,
      contraste: prev.contraste === 'padrao' ? 'altoContraste' : 'padrao',
    }));
  };

  const alternarEscalaCinza = () => {
    setConfiguracoes(prev => ({
      ...prev,
      escalaCinza: prev.escalaCinza === 'padrao' ? 'escalaCinzaAtiva' : 'padrao',
    }));
  };

  const diminuirFonte = () => {
    setConfiguracoes(prev => ({
        ...prev,
        fonte: Math.max(6, prev.fonte - 2)
    }));
  };
  
  const aumentarFonte = () => {
    setConfiguracoes(prev => ({
        ...prev,
        fonte: Math.min(50, prev.fonte + 2) 
    }));
  };

  const resetConfiguracoes = () => {
    localStorage.removeItem('acessibilidade');
    setConfiguracoes({
        contraste: 'padrao',
        fonte: 18,
        escalaCinza: 'padrao',
    });
  };

  return {
    configuracoes,
    alternarContraste,
    alternarEscalaCinza,
    diminuirFonte,
    aumentarFonte,
    resetConfiguracoes, 
  };
}