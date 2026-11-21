# Relatório de Revisão de Dependências e Vulnerabilidades - Site Comemorativo

## 1. Mapeamento de Dependências e CVEs Resolvidas

| Pacote | Versão Afetada | Versão Corrigida | Severidade | CVEs / Identificadores | Ação / Decisão |
|---|:---:|:---:|:---:|---|---|
| `next` | 15.5.9 | ^15.5.28 | CRITICAL / HIGH | CVE-2026-75604, GHSA-2464-fhr4-w9xw, GHSA-2xp9-vwfh-vxw4, CVE-2026-44573, CVE-2026-44574, CVE-2026-44575, CVE-2026-44578, CVE-2026-44579, CVE-2026-45109, CVE-2026-64641, CVE-2026-64645, CVE-2026-64649, CVE-2026-94482, GHSA-8h8q-6873-q5fj, GHSA-h25m-26qc-wcjf, GHSA-q4gf-8mx6-v5v3 | Atualizada dependência direta no `package.json` e fixado via `overrides` |
| `nodemailer` | 7.0.13 | ^10.0.6 | HIGH | CVE-2026-82659, CVE-2026-82662, CVE-2026-90776, GHSA-2x7j-588g-ccc2, GHSA-v53p-9fqp-m79j | Atualizada dependência direta e consolidado via `overrides` |
| `nanoid` | 3.3.11 / 3.3.12 | ^3.3.18 | HIGH | CVE-2026-67213, CVE-2026-67214, CVE-2026-73086 | Adicionado ao bloco `pnpm.overrides` |
| `postcss` | 8.4.31 | ^8.5.18 | HIGH | CVE-2026-45623, CVE-2026-73646 | Adicionado ao bloco `pnpm.overrides` |
| `sharp` | 0.34.4 | ^0.35.5 | HIGH | GHSA-f88m-g3jw-g9cj, GHSA-rgj7-g3m4-5g8c, GHSA-wq5f-xc86-pv6w | Adicionado ao bloco `pnpm.overrides` |
| `source-map-js` | 1.2.1 | ^1.2.2 | HIGH | CVE-2026-93749 | Adicionado ao bloco `pnpm.overrides` |
| `undici` | 5.29.0 / 6.25.0 | ^6.29.1 | HIGH | CVE-2026-109383, CVE-2026-109869, CVE-2026-12151, CVE-2026-19534, CVE-2026-87018 | Adicionado ao bloco `pnpm.overrides` |
| `deepmerge-ts` | 7.1.5 | ^8.0.0 | HIGH | CVE-2026-40345 | Adicionado ao bloco `pnpm.overrides` |
| `browserslist` | 4.28.1 | ^4.28.7 | HIGH | CVE-2026-73088, CVE-2026-73089 | Adicionado ao bloco `pnpm.overrides` |
| `defu` | 6.1.4 | ^6.1.5 | HIGH | CVE-2026-35209 | Adicionado ao bloco `pnpm.overrides` |
| `effect` | 3.18.4 | ^3.20.0 | HIGH | CVE-2026-32887 | Adicionado ao bloco `pnpm.overrides` |
| `jws` | 3.2.2 | ^3.2.3 | HIGH | CVE-2025-65945 | Adicionado ao bloco `pnpm.overrides` |
| `@fastify/busboy` | 2.1.1 | ^3.2.1 | HIGH | CVE-2026-19481 | Adicionado ao bloco `pnpm.overrides` |

## 2. Decisão sobre Lockfiles
- **`package-lock.json`:** Removido do repositório. O projeto utiliza exclusivamente o **pnpm** no build do Dockerfile (`RUN pnpm install --frozen-lockfile --shamefully-hoist`), tornando o arquivo npm obsoleto e eliminando 34 falsos-positivos de dependências não instaladas.
