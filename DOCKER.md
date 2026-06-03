# 🐳 Deploy com Docker — Stack Integrado APAE

Este `docker-compose` sobe **todo o ecossistema APAE** atrás de um único
reverse proxy (nginx) na porta **80**:

| Caminho | Aplicação | Container(s) |
|---|---|---|
| `/site-comemorativo` | Site Comemorativo (Next.js) | `apae-site-comemorativo` + `apae-db` |
| `/apae-geral` | APAE Geral (Next.js + Spring) | `apae-geral-frontend` / `apae-geral-backend` / `apae-geral-db` |
| `/gestao-escolar` | Gestão Escolar (Next.js + Spring) | `gestao-escolar-frontend` / `gestao-escolar-backend` / `gestao-escolar-db` |
| — | Armazenamento de arquivos | `minio_docs_apae` |
| — | Reverse proxy | `apae-nginx` |

---

## Pré-requisitos

- [Docker Desktop](https://www.docker.com/products/docker-desktop/) instalado e rodando
- Os **três repositórios** clonados lado a lado:

  ```
  ~/apae/
  ├── apae-site-comemorativo/   ← este repositório (onde fica o docker-compose)
  ├── APAE/                      ← apae-geral (frontend + backend)
  └── APAE-gestao-escolar/       ← gestão escolar (frontend + backend)
  ```

  Os caminhos dos builds estão em `docker-compose.yml` como `../APAE/...` e
  `../APAE-gestao-escolar/...`. Ajuste se sua estrutura for diferente.

- **Branches recomendadas** para integração:
  - `APAE` (apae-geral) → **`dev`** (contém as correções de `basePath`/paths)
  - `APAE-gestao-escolar` → **`dev`** (a `dev-database` está com refactor incompleto e **não compila**)

---

## Configuração inicial

### 1. Arquivo `.env`

Já existe um `.env` de desenvolvimento na raiz com valores locais. Ele define,
por aplicação, as credenciais de banco, JWT, MinIO e URLs. Os principais blocos:

```env
# Site Comemorativo
DATABASE_URL_COMEMORATIVO=postgresql://postgres:postgres@db-comemorativo:5432/apae_comemorativo
NEXT_PUBLIC_BASE_PATH=/site-comemorativo

# APAE Geral
POSTGRES_URL_APAE=jdbc:postgresql://db-apae-geral:5432/apae

# Gestão Escolar
POSTGRES_URL_ESCOLAR=jdbc:postgresql://db-gestao-escolar:5432/apae_escolar

# MinIO (compartilhado)
MINIO_ROOT_USER_APAE=ROOTUSER
MINIO_ROOT_PASSWORD_APAE=CHANGEME123
```

> ⚠️ São valores **de desenvolvimento**. Troque tudo (senhas, JWT, tokens) antes de qualquer ambiente real.

---

## Subindo o projeto

### 2. Build e inicialização

Na primeira vez (builda todas as imagens a partir dos repositórios):

```bash
docker-compose up -d --build
```

Nas próximas vezes (sem rebuildar):

```bash
docker-compose up -d
```

### 3. Aguarde os containers subirem

Os backends Spring (apae-geral e gestão-escolar) levam ~30s para inicializar.
Acompanhe com:

```bash
docker-compose ps
```

Quando todos estiverem `healthy`, acesse:

- 🟢 **Site Comemorativo:** http://localhost/site-comemorativo
- 🟢 **Gestão Escolar:** http://localhost/gestao-escolar
- 🟢 **APAE Geral:** http://localhost/apae-geral
- MinIO Console: http://localhost:9001

> ℹ️ A raiz `http://localhost/` retorna 404 de propósito — cada app vive sob o seu prefixo.

---

## Banco de dados — Site Comemorativo

### 4. Aplicar migrations (apenas na primeira vez)

```bash
docker exec apae-site-comemorativo npx prisma migrate deploy
```

### 5. Criar usuário administrador

```bash
docker exec -it apae-db psql -U postgres -d apae_comemorativo
```

```sql
INSERT INTO "User" (name, username, password, "typeUser")
VALUES ('Admin', 'admin', '<hash-bcrypt-da-senha>', 'ADMIN');
\q
```

> Gere uma senha forte única e armazene **somente o hash** (bcrypt). Nunca use senha padrão compartilhada.

---

## Comandos úteis

```bash
# Logs de uma aplicação
docker logs -f apae-site-comemorativo
docker logs -f gestao-escolar-backend

# Containers em execução
docker-compose ps

# Parar tudo
docker-compose down

# Parar e apagar TODOS os bancos/volumes (cuidado!)
docker-compose down -v

# Rebuildar uma aplicação específica após alterar o código
docker-compose up -d --build gestao-escolar-backend
```

---

## Estrutura dos containers

| Container | Imagem | Porta exposta no host |
|---|---|---|
| `apae-nginx` | nginx:alpine | `80` |
| `apae-site-comemorativo` | Node 20 Alpine | (interno) |
| `apae-db` | PostgreSQL 16 Alpine | (interno) |
| `apae-geral-frontend` | Node 20 Alpine | (interno) |
| `apae-geral-backend` | Temurin 21 (Spring) | `8090` |
| `apae-geral-db` | PostgreSQL 15 | `5200` |
| `gestao-escolar-frontend` | Node 20 Alpine | (interno) |
| `gestao-escolar-backend` | Temurin 21 (Spring) | (interno) |
| `gestao-escolar-db` | PostgreSQL 15 | (interno) |
| `minio_docs_apae` | MinIO | `9000` / `9001` |

---

## Solução de problemas

### A porta 80 já está em uso
Pare o serviço que a ocupa, ou troque o mapeamento do `nginx` no `docker-compose.yml`:
```yaml
ports:
  - "8080:80"   # acesse via http://localhost:8080/...
```

### `/apae-geral` retorna 404 após redirect
Geralmente é **imagem desatualizada**: uma imagem antiga do apae-geral pode emitir
redirects sem o prefixo `/apae-geral`. O código atual da branch `dev` já trata o
`basePath` corretamente (Next 16 + `proxy.ts`). Solução: rebuildar do código atual.

```bash
docker-compose build apae-geral-frontend apae-geral-backend
docker-compose up -d --force-recreate apae-geral-frontend apae-geral-backend
```

### Backend do gestão-escolar não sobe (erro de Flyway)
As migrations da branch `dev` quebram em banco vazio: a `V3__permitir_professor_nulo_em_turmas.sql`
altera a tabela `turmas`, mas **nenhuma migration a cria** (as tabelas são geradas pelo
Hibernate, que roda *depois* do Flyway). Por isso o serviço usa `SPRING_FLYWAY_ENABLED=false`
no `docker-compose.yml` — com `ddl-auto=update`, o Hibernate cria o schema.
**Correção definitiva é no repositório do gestão-escolar** (criar as tabelas base via migration).

### Ver erros detalhados
```bash
docker logs <container> --tail 100
```
