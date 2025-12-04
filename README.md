<p align="center">
  <img src="https://github.com/user-attachments/assets/be92f146-a67b-42bd-8d77-e4e1c02e581a" alt="Logo APAE Esperança" width="200" />
</p>

<h1 align="center">Website Institucional & Comemorativo - APAE Esperança</h1>

<p align="center">
  <img src="https://img.shields.io/badge/Next.js-15-black?style=for-the-badge&logo=next.js" />
  <img src="https://img.shields.io/badge/React-19-blue?style=for-the-badge&logo=react" />
  <img src="https://img.shields.io/badge/TypeScript-007ACC?style=for-the-badge&logo=typescript" />
  <img src="https://img.shields.io/badge/Prisma-2D3748?style=for-the-badge&logo=prisma" />
  <img src="https://img.shields.io/badge/Material%20UI-007FFF?style=for-the-badge&logo=mui" />
</p>

---

## Menu

1. [Sobre o Projeto](#-sobre-o-projeto)
2. [Acessibilidade](#-acessibilidade)
3. [Equipe de Desenvolvimento](#-equipe-de-desenvolvimento)
4. [Tecnologias e Ferramentas](#%EF%B8%8F-tecnologias-e-ferramentas)
5. [Como Rodar o Projeto](#-como-rodar-o-projeto)
6. [Rotas](#-rotas)
7. [Contribuição](#-contribuição)
8. [Infraestrutura e Deploy](#%EF%B8%8F-infraestrutura-e-deploy)
9. [Fluxo de Trabalho e Padrões](#-fluxo-de-trabalho-e-padrões)

---


---

## 📖 Sobre o Projeto

Este projeto é fruto de uma parceria de Extensão Tecnológica entre o **IFPB (Campus Esperança)** e a **APAE (Associação de Pais e Amigos dos Excepcionais)** de Esperança-PB.

Desenvolvido pelos alunos do Curso de Análise e Desenvolvimento de Sistemas (turma do 5° e 6º período - 2025), sob orientação dos professores **Hugo Feitosa de Figueiredo** (Projeto de Software 1), **Renata Franca de Pontes** e **Anner Karine De Queiroz Alves** (Projeto de Software 2).

### 🎯 Objetivo
Inicialmente concebido para celebrar os **30 anos da APAE Esperança**, o projeto evoluiu para se tornar o **site institucional oficial** da associação. Ele visa:
- Divulgar a história e o impacto da APAE na cidade.
- Centralizar informações sobre eventos e cronogramas.
- Facilitar processos de doação e contato.
- Oferecer uma área administrativa para gestão de conteúdo (mídias, calendário, linha do tempo).

---

## ♿ Acessibilidade

A acessibilidade não é um recurso extra neste projeto, é um **requisito fundamental**. O site foi projetado para ser inclusivo, seguindo diretrizes WCAG.

### Recursos Implementados:
1.  **VLibras:** Widget para tradução automática de texto para LIBRAS (Avatar 3D).
2.  **AudioReader (Resumo de Página):** Player de áudio presente nas páginas principais.
    * *Nota Técnica:* Os áudios foram gerados via [Vidnoz AI](https://pt.vidnoz.com/text-to-speech.html) (Voz: Donato). O objetivo é oferecer um resumo rápido e humanizado para quem tem dificuldade de leitura, complementando (e não substituindo) leitores de tela nativos.
3.  **Ajuste de Fonte:** Controle direto (A+ / A-) utilizando unidades relativas (`rem`) para escalabilidade fluida.
4.  **Alto Contraste & Dark Mode:** Inversão de cores para facilitar leitura por pessoas com baixa visão.
5.  **Escala de Cinza:** Filtro acromático para auxiliar daltônicos e reduzir distrações (TDAH).
6.  **Semântica & SEO:** Uso rigoroso de HTML5 semântico (`<main>`, `<section>`, `<nav>`) e atributos `ALT` descritivos em todas as imagens.

---

## 👥 Equipe de Desenvolvimento

| Papel | Nome | GitHub |
| :--- | :--- | :--- |
| **Product Owner** | Patricia Santos | [@Patricia-Santos](https://github.com/Patricia-Santos) |
| **Scrum Master** | Richard Salviano | [@RickFerreira](https://github.com/RickFerreira) |
| **Dev Team** | Raykkoner Dujhkkovick | [@RaykkonerD](https://github.com/RaykkonerD) |
| **Dev Team** | Isaac Oliveira | [@isaacoliveeira](https://github.com/isaacoliveeira) |
| **Dev Team** | Lucas Matheus Gomes | [@lucasgomes14](https://github.com/lucasgomes14) |
| **Dev Team** | Vinicius de Lucena | [@viniciusdelucena](https://github.com/viniciusdelucena) |
| **Dev Team** | Mateus Tomaz | [@mateustomaz1](https://github.com/mateustomaz1) |

---

## 🛠️ Tecnologias e Ferramentas

- **Frontend:** Next.js 15 (App Router), React 19.
- **Linguagem:** TypeScript.
- **Estilização:** CSS Modules (`.module.css`) + Material UI (MUI v7).
- **Animações:** Framer Motion.
- **Backend:** Next.js API Routes (Serverless).
- **Banco de Dados:** PostgreSQL (via Prisma ORM).
- **Armazenamento:** Vercel Blob (para imagens e arquivos).
- **Gerenciador de Pacotes:** `pnpm`.

---

## 🚀 Como Rodar o Projeto

### Pré-requisitos
- Node.js (versão LTS recomendada, ex: v18 ou v20).
- pnpm instalado globalmente (`npm install -g pnpm`).

### Passo a Passo

1. **Clone o repositório:**
   ```bash
   git clone https://github.com/IFPBEsp/apae-site-comemorativo.git
   cd apae-site-comemorativo

2. Instale as dependências:
   ```bash
   pnpm install

3. Rode o projeto:
   ```bash
   pnpm run dev
Acesse http://localhost:3000.

## 🌐 Rotas

As rotas são definidas automaticamente com base na estrutura de arquivos dentro da pasta src. Por exemplo:

- `/` - Página inicial
- `/pages/30anos` - Página de 30 anos
- `/pages/datas-comemorativas` - Página de Calendário
- `/pages/contato` - Página de Contatos
- `/pages/como-ajudar` - Página de Doações
- `/pages/acessibilidade` - Página de Acessibilidade no site
- `/pages/login` - Página de Login
- `/pages/esqueceu-senha` - Página de esqueceu sua senha


---
## 🙏 Contribuição 

Para contribuir com o projeto, siga estas etapas:

1. **Clone o repositório**:
  ```bash
   git clone https://github.com/IFPBEsp/apae-site-comemorativo.git
  ```

2. **Crie uma nova branch**
  ```bash
  git checkout -b numero-titulo-nova-feature
  ```

3. **Faça suas alterações e crie o commit**
  ```bash
  git commit -m "tipo: Descrição da sua alteração"
  ```

4. **Envie suas alterações para o repositório remoto**
  ```bash
  git push -u origin numero-titulo-nova-feature
  ```

5. **Abra um Pull Request**: Vá até o repositório remoto e crie um novo Pull Request.

---
## ☁️ Infraestrutura e Deploy

Atualmente, o projeto está hospedado na Vercel (Plano Hobby/Gratuito).

URL de Produção: https://apae-site-comemorativo.vercel.app/

Conta Vercel: Vinculada ao GitHub do aluno Lucas Gomes, utilizando um e-mail de gerenciamento da APAE.

### ⚠️ Importante para Próximas Turmas: 
É necessário planejar a migração da hospedagem para uma conta institucional do IFPB ou uma conta Pro da APAE para facilitar a manutenção e evitar dependência de contas pessoais de ex-alunos.

### 📞 Contatos Importantes:
Para acesso a credenciais (Vercel, Banco de Dados), Área Administrativa ou dúvidas sobre o legado:

- Scrum Master (Richard Salviano): +55 83 99677-9977

- Product Owner (Patricia Santos): +55 83 99668-5639

- Deploy/Vercel (Lucas Gomes): +55 83 99154-6906

---
## 🔄 Fluxo de Trabalho e Padrões

GitFlow & Branches

main: Código em produção.
### 📚 Convenção de Commits

Ao fazer um commit, siga o seguinte padrão:

    <tipo>[escopo]: <descrição>

    <Corpo Opcional>

Exemplo:

    feat[service]: adiciona login de usuário

**⚠️ Observações:** 
  - A descrição deve iniciar com um verbo no presente do indicativo. Dica: Complete a frase "Esse commit ..." (ex: "adiciona", "corrige", "atualiza").
  - Adicione o corpo do commit somente quando necessário para fornecer um contexto adicional para a alteração. Para adicionar uma quebra de linha na mensagem do commit pelo terminal, use "\n".

#### 📂 Dicionário de Tipos

- **feat**: Adição de uma nova funcionalidade ou recurso no projeto.
- **fix**: Correção de um bug ou problema.
- **chore**: Pequenas alterações de manutenção e ajustes.
- **refactor**: Refatoração de código sem adicionar novas funcionalidades ou corrigir bugs.
- **style**: Alterações na formatação do código, lint e outros (não afeta a funcionalidade).
- **docs**: Mudanças na documentação (exemplo: README).
- **test**: Modificações ou adição de testes.
- **perf**: Melhoria de desempenho.
- **ci**: Alterações relacionadas a CI/CD (GitHub Actions, Jenkins, etc.).
- **build**: Mudanças relacionadas a build e dependências.
- **revert**: Reversão de um commit anterior.
- **cleanup**: Remoção de códigos comentados ou trechos desnecessários.
- **remove**: Exclusão de arquivos ou funcionalidades obsoletas.

#### 📙 Dicionário de Escopo

- **ui**: Alterações na interface do usuário.
- **componentes**: Modificações em componentes reutilizáveis.
- **layout**: Alterações no layout geral.
- **styles**: Ajustes de CSS, Tailwind, etc.
- **state**: Alterações no gerenciamento de estado.
- **router**: Alterações nas rotas da aplicação.
- **form**: Alterações em formulários.

---

### 🌿 Criação de Branches

Ao criar uma branch, siga a estrutura abaixo:

    <número da issue>-<descrição>

Exemplo:

    9999-corrige-bug-tela12x

---

### 🏊🏼 Raia do Kanban

O Kanban é usado para organizar as **issues** no processo de desenvolvimento. As issues são movidas entre as seguintes raias:

- **Backlog**: Issues que estão sendo especificadas e preparadas para desenvolvimento.
- **Disp. para Desenvolvimento**: Issues prontas para os desenvolvedores pegarem e começarem a trabalhar.
- **Em Processo**: Issues que estão sendo trabalhadas pelos desenvolvedores.
- **Represado**: Issues que estão bloqueadas ou dependendo de outras tarefas para avançar.
- **Aguardando PR**: Issues concluídas, aguardando revisão e aprovação via Pull Request (PR).
- **Disponível para Deploy**: Issues prontas para produção, após revisão e testes.

---
### 🏊🏼 Labels do Kanban

1. 🌊 GitFlow

  - **feature** – Para novas funcionalidades.
  - **bug** – Para correções de erros.
  - **hotfix** – Correções urgentes diretamente na produção.
  - **release** – Preparação para lançar uma nova versão.
  - **chore** – Tarefas gerais de manutenção, ajustes de infraestrutura, etc.

2. 🏷️ Outras Labels Úteis

  - **enhancement** – Melhoria de funcionalidades existentes.
  - **documentation** – Relacionado à documentação.
  - **blocked** – Issue bloqueada por algum motivo.
  - **alta** – Para issues de alta prioridade.
  - **baixa** – Para issues de baixa prioridade.
  - **database** - Para issues realcionadas ao banco.
  - **web** - Para issues relacionadas ao site.
  - **1,2,3,5,8** - Peso das issues relacionadas a dificuldade/tempo para desenvolver.

---


<p align="center">Feito com 💙 para a APAE Esperança</p>
