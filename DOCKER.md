# 🐳 Documentação de Deploy com Docker

## Pré-requisitos

- [Docker Desktop](https://www.docker.com/products/docker-desktop/) instalado e rodando
- Git com o projeto clonado
- Arquivo `.env` configurado na raiz

---

## Configuração inicial

### 1. Configure o arquivo `.env`

Crie um arquivo `.env` na raiz do projeto:

```env
    DATABASE_URL = postgresql:// <usuário>:<senha>` @db` : 5432/ <banco de dados>
    BLOB_READ_WRITE_TOKEN = <substitua-me>
    JWT_SECRET = <substitua-me>
```
---

## Subindo o projeto

### 2. Build e inicialização

Na primeira vez, rode com o build:

```bash
docker-compose up --build
```

Nas próximas vezes, apenas:

```bash
docker-compose up
```

Para rodar em background (sem travar o terminal):

```bash
docker-compose up -d
```

### 3. Aguarde os containers subirem

Você verá no terminal:
✓ Ready in 838ms

O site estará disponível em:
http://localhost:3001

---

## Banco de dados

### 4. Aplicar migrations (apenas na primeira vez)

```bash
docker exec -e DATABASE_URL="postgresql://postgres:postgres@db:5432/apae_comemorativo" apae-site-comemorativo npx prisma migrate deploy
```

### 5. Criar usuário administrador

Acesse o terminal do banco:

```bash
docker exec -it apae-db psql -U postgres -d apae_comemorativo
```

Crie o usuário admin:

```sql
  Gere uma senha forte única para o ambiente antes da inserção
  e armazene somente o hash (nunca senha padrão compartilhada no repositório).
```

Saia do terminal:

```sql
\q
```

Credenciais de acesso inicial:
- **Usuário:** `admin`
- **Senha:** `password`

> ⚠️ Troque a senha após o primeiro acesso!

---

## Comandos úteis

### Ver logs da aplicação

```bash
docker logs apae-site-comemorativo --tail 50
```

### Ver logs em tempo real

```bash
docker logs -f apae-site-comemorativo
```

### Verificar containers rodando

```bash
docker ps
```

### Parar os containers

```bash
docker-compose down
```

### Parar e remover o banco de dados

```bash
docker-compose down -v
```

> ⚠️ O `-v` apaga todos os dados do banco. Use com cuidado!

### Reconstruir após alterações no código

```bash
docker-compose down
docker-compose up --build
```

---

## Estrutura dos containers

| Container | Imagem | Porta |
|---|---|---|
| `apae-site-comemorativo` | Node 20 Alpine | `3001` |
| `apae-db` | PostgreSQL 16 Alpine | Interno |

---

## Solução de problemas

### Docker não inicia
Abra o Docker Desktop e aguarde o status **"Engine running"** na barra inferior antes de rodar os comandos.

### Porta já está em uso
Altere no `docker-compose.yml`:
```yaml
ports:
  - "3002:3000"  # troque 3001 por outra porta livre
```

### Erro de autenticação no banco
Verifique se a senha no `docker-compose.yml` bate com a do `POSTGRES_PASSWORD`:
```yaml
DATABASE_URL=postgresql://postgres:postgres@db:5432/apae_comemorativo
POSTGRES_PASSWORD=postgres
```

### Ver erros detalhados
```bash
docker logs apae-site-comemorativo --tail 100
```