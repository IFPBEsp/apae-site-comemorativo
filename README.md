<p align="center">
  <img src="https://github.com/user-attachments/assets/be92f146-a67b-42bd-8d77-e4e1c02e581a" />
</p>

# APAE

Projeto em desenvolvimento, fruto de uma parceria entre o IFPB (Campus Esperança) e a APAE.

---

## Índice

1. [Introdução](#introdução)
2. [Fluxo de Trabalho](#fluxo-de-trabalho)
   - [Convenção de Commits](#convenção-de-commits)
   - [Criação de Branches](#criação-de-branches)
   - [Raia do Kanban](#raia-do-kanban)
3. [Configuração do Projeto](#configuração-do-projeto)

---

## Introdução

Este projeto tem como objetivo o desenvolvimento de dois sistemas para a APAE, o primeiro focado no gerenciamento de pacientes e o outros na exibição de informações. O projeto está sendo desenvolvido em colaboração com o IFPB (Campus Esperança).

---

## Fluxo de Trabalho

### Convenção de Commits

Ao fazer um commit, siga o seguinte padrão:

    <tipo>[escopo]: <descrição>

    <Corpo Opcional>

Exemplo:

    feat[service]: adiciona login de usuário

**Observações:** Adicione o corpo do commit somente quando necessário para fornecer um contexto adicional para a alteração. Para adicionar uma quebra de linha na mensagem do commit pelo terminal, use "\n".

#### Dicionário de Tipos

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

#### Dicionário de Escopo

- **ui**: Alterações na interface do usuário.
- **componentes**: Modificações em componentes reutilizáveis.
- **layout**: Alterações no layout geral.
- **styles**: Ajustes de CSS, Tailwind, etc.
- **state**: Alterações no gerenciamento de estado.
- **router**: Alterações nas rotas da aplicação.
- **form**: Alterações em formulários.

---

### Criação de Branches

Ao criar uma branch, siga a estrutura abaixo:

    <número da issue>-<descrição>

Exemplo:

    9999-corrige-bug-tela12x

---

#### GitFlow

- **feature** – Para novas funcionalidades.
- **bug** – Para correções de erros.
- **hotfix** – Correções urgentes diretamente na produção.
- **release** – Preparação para lançar uma nova versão.
- **chore** – Tarefas gerais de manutenção, ajustes de infraestrutura, etc.

#### Outras Labels Úteis

- **enhancement** – Melhoria de funcionalidades existentes.
- **documentation** – Relacionado à documentação.
- **blocked** – Issue bloqueada por algum motivo.
- **high** – Para issues de alta prioridade.
- **low** – Para issues de baixa prioridade.

---

### Raia do Kanban

O Kanban é usado para organizar as **issues** no processo de desenvolvimento. As issues são movidas entre as seguintes raias:

- **Backlog**: Issues que estão sendo especificadas e preparadas para desenvolvimento.
- **Disponível para Desenvolvimento**: Issues prontas para os desenvolvedores pegarem e começarem a trabalhar.
- **Em Processo**: Issues que estão sendo trabalhadas pelos desenvolvedores.
- **Review**: Issues concluídas e aguardando revisão antes de avançar.
- **Represado**: Issues que estão bloqueadas ou dependendo de outras tarefas para avançar.
- **Aguardando PR**: Issues concluídas, aguardando revisão e aprovação via Pull Request (PR).
- **Homologação**: Issues em testes no ambiente de homologação.
- **Disponível para Deploy**: Issues prontas para produção, após revisão e testes.

---

## Tecnologias Utilizadas

- [Next.js](https://nextjs.org/) - Framework React para desenvolvimento de aplicações web
- [TypeScript](https://www.typescriptlang.org/) - Superset do JavaScript que adiciona tipagem estática

## Instalação

Para instalar e configurar o projeto, siga os passos abaixo:

1. **Clone o repositório**:
  ```bash
   git clone https://github.com/IFPBEsp/APAE.git
  ```

2. **Navegue até o diretório do projeto**:
  ```bash
   cd APAE
  ```

3. **Instale as dependências**:
  ```bash
   npm install
  ```

## Uso

Para iniciar a aplicação em modo de desenvolvimento, execute:

  ```bash
   npm run dev
  ```

A aplicação estará disponível em [http://localhost:3000](http://localhost:3000).

## Rotas

As rotas são definidas automaticamente com base na estrutura de arquivos dentro da pasta src. Por exemplo:

- `/` - Página inicial
- `/sobre` - Página sobre
- `/contato` - Página de contato

##  Contribuição 

Para contribuir com o projeto, siga estas etapas:

1. **Clone o repositório**:
  ```bash
   git clone https://github.com/IFPBEsp/APAE.git
  ```

2. **Crie uma nova branch**
  ```bash
  git checkout -b minha-nova-feature
  ```

3. **Faça suas alterações e crie o commit**
  ```bash
  git commit -m "Descrição da sua alteração"
  ```

4. **Envie suas alterações para o repositório remoto**
  ```bash
  git push -u origin minha-nova-feature
  ```

5. **Abra um Pull Request**: Vá até o repositório remoto e crie um novo Pull Request.