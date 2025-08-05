'use client';

import React, { useState } from 'react';
import {
  TextField,
  Button,
  Typography,
  CircularProgress,
} from '@mui/material';
import { z } from 'zod';
import { useForm, Controller } from 'react-hook-form';
import styles from './FormularioDoacao.module.css';

const esquemaFormularioDoacao = z.object({
  nome: z.string().min(1, 'Nome é obrigatório'),
  email: z.string().email('Email inválido'),
  telefone: z.string().optional(),
  mensagem: z.string().optional(),
});

type DadosFormularioDoacao = z.infer<typeof esquemaFormularioDoacao>;

const FormularioDoacao: React.FC = () => {
  const [carregando, setCarregando] = useState(false);
  const [sucesso, setSucesso] = useState(false);
  const [erro, setErro] = useState('');

  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm<DadosFormularioDoacao>({
    resolver: async (data) => {
      try {
        esquemaFormularioDoacao.parse(data);
        return { values: data, errors: {} };
      } catch (e: any) {
        return { values: {}, errors: e.formErrors.fieldErrors };
      }
    },
  });

  const aoSubmeter = async (data: DadosFormularioDoacao) => {
    setCarregando(true);
    setErro('');
    setSucesso(false);

    try {
      await new Promise(resolve => setTimeout(resolve, 2000));
      setSucesso(true);
    } catch (err: any) {
      setErro(err.message || 'Ocorreu um erro. Tente novamente.');
    } finally {
      setCarregando(false);
    }
  };

  if (sucesso) {
    return (
      <div className={styles.successMessage}>
        <Typography variant="h6">
          Obrigado! Sua mensagem foi enviada com sucesso. Em breve, entraremos em contato.
        </Typography>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit(aoSubmeter)} className={styles.formContainer}>
      <Typography variant="h4" component="h2" gutterBottom>
        Formulário de Contato para Doação
      </Typography>
      <Controller
        name="nome"
        control={control}
        render={({ field }) => (
          <TextField
            {...field}
            label="Nome Completo"
            fullWidth
            error={!!errors.nome}
            helperText={errors.nome?.message}
          />
        )}
      />
      <Controller
        name="email"
        control={control}
        render={({ field }) => (
          <TextField
            {...field}
            label="Email"
            type="email"
            fullWidth
            error={!!errors.email}
            helperText={errors.email?.message}
          />
        )}
      />
      <Controller
        name="telefone"
        control={control}
        render={({ field }) => (
          <TextField
            {...field}
            label="Telefone (opcional)"
            fullWidth
            error={!!errors.telefone}
            helperText={errors.telefone?.message}
          />
        )}
      />
      <Controller
        name="mensagem"
        control={control}
        render={({ field }) => (
          <TextField
            {...field}
            label="Mensagem (opcional)"
            multiline
            rows={4}
            fullWidth
            error={!!errors.mensagem}
            helperText={errors.mensagem?.message}
          />
        )}
      />
      {erro && (
        <Typography color="error" variant="body2">
          {erro}
        </Typography>
      )}
      <Button
        type="submit"
        variant="contained"
        color="primary"
        disabled={carregando}
        endIcon={carregando && <CircularProgress size={20} />}
      >
        Enviar
      </Button>
    </form>
  );
};

export default FormularioDoacao;