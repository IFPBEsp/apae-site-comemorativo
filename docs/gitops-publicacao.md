# Publicacao e notificacao GitOps

O caller `.github/workflows/docker-publish.yml` publica somente em pushes e execucoes
manuais na `main`. PRs que alteram o caller executam as validacoes, sem publicar
imagens nem acessar o App de notificacao.

A publicacao depende de lint, build, verificacao de tipos e dos testes
existentes do frontend.
Os testes sao bloqueantes e nao usam `continue-on-error`.
O workflow reutilizavel de publicacao usa `@main` do APAE-INFRA, que precisa
receber as correcoes da issue #106 antes do merge deste caller na `main` do
produto. Essa referencia seleciona a automacao; o codigo publicado tambem
precisa vir da `main` do produto.

As permissoes de pacotes, OIDC e atestacoes ficam somente nos jobs de
publicacao. A notificacao usa o environment `gitops-dispatch`, com a variavel
`GITOPS_DISPATCH_APP_ID` e o secret `GITOPS_DISPATCH_APP_PRIVATE_KEY` de um App
com `contents: write` somente no APAE-INFRA. O App de abertura de PRs e sua
chave permanecem exclusivamente na INFRA.

O evento `gitops-image-published` valida imagem, tag, digest e commit usando
os outputs da publicacao.
A execucao manual na `main` tambem prepara e envia a notificacao. Uma falha
nas validacoes, publicacao ou preparacao impede a notificacao.

## Configuracao dos frontends

Os argumentos de build sao fixos e iguais nos dois ambientes. Nao usar
variaveis de deploy para reconstruir a imagem durante a promocao.
`NEXT_PUBLIC_BASE_PATH=/site-comemorativo` e `NEXT_PUBLIC_URL_APAE=/apae-geral`
sao caminhos relativos ao mesmo dominio publico.
Configuracoes de servidor e segredos devem ser fornecidos no ambiente de execucao.

O receptor da INFRA verifica origem, digest e proveniencia antes do PR de
homologacao. A aprovacao, promocao e rollback reutilizam os mesmos digests,
com revisao humana e sync manual. O caller nao atualiza producao diretamente.

## Validacao

```bash
actionlint .github/workflows/docker-publish.yml
git diff --check
```

Checks de PR nao comprovam publicacao no GHCR. O aceite da #106 exige uma
execucao real na `main` e evidencias de notificacao, homologacao, promocao
sem rebuild e rollback.

## Lint e testes tipados

`npm run lint` usa o ESLint CLI. Apenas os artefatos gerados (`.next`, `out`,
`build` e `next-env.d.ts`) ficam fora do lint; o codigo e os testes continuam
sujeitos as mesmas regras. A formatacao dos testes foi corrigida, os mocks
usam tipos do Vitest e as requisicoes de teste usam `NextRequest` real.
Nenhuma regra de lint foi desabilitada para liberar a publicacao.

```bash
pnpm exec eslint .
pnpm exec vitest run
pnpm run build
pnpm exec tsc --noEmit
```

As dependencias de aplicacao e suas correcoes de CVEs continuam no PR da #137.

## Escopo das correcoes neste PR

As correcoes de lint, tipos e testes permanecem no PR #72 por decisao de
manutencao, pois o Site Comemorativo nao possui responsavel dedicado para
conduzir uma entrega separada. Elas permitem executar as validacoes
obrigatorias antes da publicacao, mantendo as regras de lint e os testes ativos.

A atualizacao com a `main` preserva o hook do Husky e o comando `eslint .`.
As atualizacoes de vulnerabilidades e suas alteracoes de dependencias seguem
no PR #75, relacionado a APAE-INFRA #137; nao foram incorporadas a este PR.
Ao integrar o #75, preservar o comando de lint e os testes corrigidos aqui.

O PR deve permanecer em Draft ate os workflows e novos outputs necessarios
dos PRs APAE-INFRA #133 e #147 estarem disponiveis na `main` da INFRA. O merge
apenas na `dev` nao atende a dependencia do caller.

## Verificacao local de 18/11/2026

A integracao com a `main` resolveu o conflito dos scripts preservando
`eslint .`, `postinstall: prisma generate` e `prepare: husky`.

- Instalacao com pnpm 10.33.4, a mesma versao do caller, usando lockfile
  congelado e `--shamefully-hoist`: aprovada, com geracao do Prisma Client.
  O Husky foi desabilitado somente nessa instalacao local, sem alterar o hook.
- Lint: sem erros.
- Vitest: sete arquivos e 41 testes aprovados.
- Build de producao com as variaveis do caller: concluido.
- `tsc --noEmit`: sem erros depois do build.
- actionlint com ShellCheck, Markdown e diff contra `origin/main`: sem erros.

Esses resultados nao comprovam publicacao no GHCR nem homologacao, promocao
ou rollback reais; essas evidencias continuam pendentes na APAE-INFRA #106.
