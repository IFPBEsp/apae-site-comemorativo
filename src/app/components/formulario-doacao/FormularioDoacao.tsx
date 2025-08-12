'use client';

import React, { useState } from 'react';
import { TextField, Button, CircularProgress, Box, MenuItem, Typography } from '@mui/material';
import { z } from 'zod';
import { useForm, Controller } from 'react-hook-form';
import { AttachFile, Send } from '@mui/icons-material';
import { zodResolver } from '@hookform/resolvers/zod';
import styles from './FormularioDoacao.module.css';

const esquemaFormularioDoacao = z.object({
  nome: z.string().min(1, 'Nome é obrigatório'),
  email: z.string().email('Email inválido'),
  telefone: z.string().optional(),
  assunto: z.string().optional(),
  mensagem: z.string().optional(),
});

type DadosFormularioDoacao = z.infer<typeof esquemaFormularioDoacao>;

const FormularioDoacao: React.FC = () => {


  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm<DadosFormularioDoacao>({
    resolver: zodResolver(esquemaFormularioDoacao),
    defaultValues: {
        nome: '',
        email: '',
        telefone: '',
        assunto: '',
        mensagem: '',
    },
  });

  const onSubmit = (data: DadosFormularioDoacao) => {
    // Lógica de envio do formulário será adicionada aqui
  };

  return (
    <form className={styles.form} onSubmit={handleSubmit(onSubmit)}>
      <div className={styles.campo}>
        <Typography className={styles.campoTitulo}>Nome</Typography>
        <Controller
          name="nome"
          control={control}
          render={({ field }) => (
            <TextField
              {...field}
              variant="outlined"
              fullWidth
              error={!!errors.nome}
              helperText={errors.nome?.message}
              placeholder="Digite seu nome"
              className={styles.inputWrapper}
            />
          )}
        />
      </div>
      <div className={styles.campo}>
        <Typography className={styles.campoTitulo}>Email</Typography>
        <Controller
          name="email"
          control={control}
          render={({ field }) => (
            <TextField
              {...field}
              variant="outlined"
              fullWidth
              error={!!errors.email}
              helperText={errors.email?.message}
              placeholder="Digite seu email"
              className={styles.inputWrapper}
            />
          )}
        />
      </div>
      <div className={styles.campo}>
        <Typography className={styles.campoTitulo}>Telefone</Typography>
        <Controller
          name="telefone"
          control={control}
          render={({ field }) => (
            <TextField
              {...field}
              variant="outlined"
              fullWidth
              placeholder="Digite seu telefone"
              className={styles.inputWrapper}
            />
          )}
        />
      </div>
      <div className={styles.campo}>
        <Typography className={styles.campoTitulo}>Assunto</Typography>
        <Controller
          name="assunto"
          control={control}
          render={({ field }) => (
              <TextField
                  {...field}
                  variant="outlined"
                  fullWidth
                  select
                  SelectProps={{ native: true }}
                  className={styles.inputWrapper}
              >
                  <option value="">Selecione seu assunto</option>
                  <option value="duvida">Dúvida</option>
                  <option value="sugestao">Sugestão</option>
                  <option value="parceria">Parceria</option>
              </TextField>
          )}
          />
      </div>
      <div className={styles.campo}>
        <Typography className={styles.campoTitulo}>Mensagem</Typography>
        <Controller
          name="mensagem"
          control={control}
          render={({ field }) => (
            <TextField
              {...field}
              variant="outlined"
              fullWidth
              multiline
              rows={4}
              placeholder="Deixe sua mensagem"
              className={styles.inputWrapper}
            />
          )}
        />
      </div>
      <div className={styles.botoes}>
        <Button
          variant="contained"
          startIcon={<AttachFile />}
          className={styles.botaoAnexo}
        >
          Inserir anexo
        </Button>
        <Button
          variant="contained"
          endIcon={<Send />}
          className={styles.botaoEnviar}
          type="submit"
        >
          Enviar
        </Button>
      </div>
    </form>
  );
};

export default FormularioDoacao;