"use client";

import React, { useRef, useState } from "react";
import { TextField, Button, Typography, CircularProgress } from "@mui/material";
import { z } from "zod";
import { useForm, Controller } from "react-hook-form";
import { AttachFile, Send, Delete } from "@mui/icons-material";
import { zodResolver } from "@hookform/resolvers/zod";
import styles from "./FormularioDoacao.module.css";

const esquemaFormularioDoacao = z.object({
  nome: z.string().min(1, "Nome é obrigatório"),
  email: z.string().email("Email inválido"),
  telefone: z.string().optional(),
  assunto: z.string().optional(),
  mensagem: z.string().optional(),
  arquivo: z.any().optional(),
});

type DadosFormularioDoacao = z.infer<typeof esquemaFormularioDoacao>;

const FormularioDoacao: React.FC = () => {
  const [statusEnvio, setStatusEnvio] = useState<"idle" | "sucesso" | "erro">("idle");
  const inputFileRef = useRef<HTMLInputElement>(null); // Ref para o input escondido
  const [nomeArquivo, setNomeArquivo] = useState(""); // Para mostrar o nome do arquivo selecionado

  const {
    control,
    reset,
    setValue,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<DadosFormularioDoacao>({
    resolver: zodResolver(esquemaFormularioDoacao),
    defaultValues: {
        nome: "",
        email: "",
        telefone: "",
        assunto: "",
        mensagem: "",
        arquivo: undefined,
    },
  });

  const onSubmit = async (data: DadosFormularioDoacao) => {
    setStatusEnvio("idle");

    try {
      // 2. Criar FormData (Obrigatório para envio de arquivos)
      const formData = new FormData();
      formData.append("nome", data.nome);
      formData.append("email", data.email);
      formData.append("telefone", data.telefone || "");
      formData.append("assunto", data.assunto || "");
      formData.append("mensagem", data.mensagem || "");

      // Se houver arquivo, anexa
      if (data.arquivo) {
        formData.append("arquivo", data.arquivo);
      }

      const response = await fetch("/api/sendEmail", {
        method: "POST",
        body: formData,
      });

      if (!response.ok) throw new Error("Erro no envio");

      setStatusEnvio("sucesso");
      reset();
      setNomeArquivo(""); // Limpa o nome do arquivo visualmente
      alert("E-mail enviado com sucesso!");
      console.log(statusEnvio);
    } catch (error) {
      console.error(error);
      setStatusEnvio("erro");
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setValue("arquivo", file); // Registra no react-hook-form
      setNomeArquivo(file.name); // Atualiza visualmente
    }
  };

  const handleAnexoClick = () => {
    if (nomeArquivo) {
      // LÓGICA DE REMOVER
      setNomeArquivo(""); // Limpa o nome visual
      setValue("arquivo", undefined); // Limpa do React Hook Form

      // Limpa o input HTML (obrigatório para poder selecionar o mesmo arquivo novamente se quiser)
      if (inputFileRef.current) {
        inputFileRef.current.value = "";
      }
    } else {
      // LÓGICA DE ADICIONAR
      inputFileRef.current?.click();
    }
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
        <div className={styles.wrapperAnexo}>

          <input
            type="file"
            ref={inputFileRef}
            style={{ display: "none" }}
            onChange={handleFileChange}
          />

          <Button
            variant={nomeArquivo ? "outlined" : "contained"}
            className={styles.botaoAnexo}
            startIcon={nomeArquivo ? <Delete /> : <AttachFile />}
            onClick={handleAnexoClick}
          >
            {nomeArquivo ? "Remover anexo" : "Inserir anexo"}
          </Button>

          {nomeArquivo && (
            <Typography className={styles.textoArquivo}>
              {nomeArquivo}
            </Typography>
          )}
        </div>

        <Button
          variant="contained"
          endIcon={isSubmitting ? <CircularProgress size={20} color="inherit" /> : <Send />}
          className={styles.botaoEnviar}
          type="submit"
          disabled={isSubmitting}
        >
          {isSubmitting ? "Enviando..." : "Enviar"}
        </Button>
      </div>
    </form>
  );
};

export default FormularioDoacao;