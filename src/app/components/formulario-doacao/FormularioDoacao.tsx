"use client";

import React from "react";
import { useState } from "react";
import { TextField, Button, Typography } from "@mui/material";
import { z } from "zod";
import { useForm, Controller } from "react-hook-form";
import { AttachFile, Send } from "@mui/icons-material";
import { zodResolver } from "@hookform/resolvers/zod";
import styles from "./FormularioDoacao.module.css";

const esquemaFormularioDoacao = z.object({
  nome: z.string().min(1, "Nome é obrigatório"),
  email: z.string().email("Email inválido"),
  telefone: z.string().optional(),
  assunto: z.string().optional(),
  mensagem: z.string().optional(),
});

type DadosFormularioDoacao = z.infer<typeof esquemaFormularioDoacao>;

const FormularioDoacao: React.FC = () => {

  const [files, setFiles] = useState<File[]>([]);

  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm<DadosFormularioDoacao>({
    resolver: zodResolver(esquemaFormularioDoacao),
    defaultValues: {
        nome: "",
        email: "",
        telefone: "",
        assunto: "",
        mensagem: "",
    },
  });

  const onSubmit = async (data: DadosFormularioDoacao) => {
    try {
      const formData = new FormData();

      formData.append("nome", data.nome);
      formData.append("email", data.email);
      if (data.telefone) formData.append("telefone", data.telefone);
      if (data.assunto) formData.append("assunto", data.assunto);
      if (data.mensagem) formData.append("mensagem", data.mensagem);

      files.forEach((file, index) => {
        formData.append(`file${index}`, file);
      });

      const res = await fetch("/apae-site-comemorativo/api/sendEmail", {
        method: "POST",
        body: formData,
      });

      if (res.ok) {
        alert("Formulário enviado com sucesso!");
      } else {
        alert("Erro ao enviar formulário.");
      }
    } catch (err) {
      console.error(err);
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const newFiles = Array.from(e.target.files);
      setFiles(prevFiles => [...prevFiles, ...newFiles]);
      e.target.value = '';
    }
  };

  const removerArquivo = (index: number) => {
    setFiles(prevFiles => prevFiles.filter((_, i) => i !== index));
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
          component="label"
        >
          Inserir anexo
          <input
            type="file"
            hidden
            multiple
            onChange={handleFileChange}
          />
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
      {files.length > 0 && (
        <div className={styles.listaArquivos}>
          {files.map((file, index) => (
            <div key={index} className={styles.arquivoAnexado}>
              <div className={styles.arquivoInfo}>
                <AttachFile className={styles.arquivoIcone} />
                <span className={styles.arquivoNome}>{file.name}</span>
                <span className={styles.arquivoTamanho}>
                  ({(file.size / 1024).toFixed(1)} KB)
                </span>
              </div>
              <button
                type="button"
                className={styles.removerArquivo}
                onClick={() => removerArquivo(index)}
                aria-label="Remover arquivo"
              >
                ✕
              </button>
            </div>
          ))}
        </div>
      )}
    </form>
  );
};

export default FormularioDoacao;
