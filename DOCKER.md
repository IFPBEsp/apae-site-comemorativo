# Docker Setup - APAE Site Comemorativo

Este documento descreve como configurar e usar o ambiente Docker para o projeto APAE Site Comemorativo.

## 📋 Pré-requisitos

- Docker (versão 20.10 ou superior)
- Docker Compose (versão 2.0 ou superior)
- Node.js (versão 18 ou superior) - para desenvolvimento local

## 🚀 Início Rápido

### 1. Configuração Inicial

**Linux/macOS:**
```bash
# Clonar o repositório (se ainda não foi feito)
git clone <repository-url>
cd apae-site-comemorativo

# Executar configuração inicial
./scripts/setup.sh
```

**Windows:**
```cmd
# Clonar o repositório (se ainda não foi feito)
git clone <repository-url>
cd apae-site-comemorativo

# Executar configuração inicial
scripts\setup.bat
```

### 2. Desenvolvimento

**Linux/macOS:**
```bash
# Iniciar ambiente de desenvolvimento
./scripts/dev.sh
```

**Windows:**
```cmd
# Iniciar ambiente de desenvolvimento
scripts\dev.bat
```

### 3. Produção

**Linux/macOS:**
```bash
# Iniciar ambiente de produção
./scripts/prod.sh
```

**Windows:**
```cmd
# Iniciar ambiente de produção
scripts\prod.bat
```

## 🐳 Serviços Disponíveis

### PostgreSQL
- **Porta**: 5432
- **Usuário**: apae_user (padrão)
- **Senha**: apae_password (padrão)
- **Banco**: apae_db (padrão)

### MinIO
- **API**: http://localhost:9000
- **Console**: http://localhost:9001
- **Usuário**: minioadmin (padrão)
- **Senha**: minioadmin123 (padrão)

### Aplicação Next.js
- **URL**: http://localhost:3000

## 🔧 Scripts Disponíveis

### Scripts de Configuração
- `setup.sh` / `setup.bat` - Configuração inicial completa
- `init-minio.sh` / `init-minio.bat` - Configuração do MinIO

### Scripts de Desenvolvimento
- `dev.sh` / `dev.bat` - Ambiente de desenvolvimento
- `prod.sh` / `prod.bat` - Ambiente de produção
- `test-integration.sh` / `test-integration.bat` - Testes de integração

### Scripts de Manutenção
- `monitor.sh` / `monitor.bat` - Monitoramento dos serviços
- `backup.sh` / `backup.bat` - Backup dos dados
- `restore.sh` - Restore dos dados
- `cleanup.sh` / `cleanup.bat` - Limpeza do ambiente

## 🔧 Comandos Úteis

### Gerenciamento de Containers

```bash
# Iniciar todos os serviços
docker-compose up -d

# Parar todos os serviços
docker-compose down

# Ver logs dos serviços
docker-compose logs -f

# Ver logs de um serviço específico
docker-compose logs -f postgres
docker-compose logs -f minio
docker-compose logs -f app
```

### Banco de Dados

```bash
# Conectar ao banco de dados
docker-compose exec postgres psql -U apae_user -d apae_db

# Executar migrações
docker-compose exec app npx prisma migrate deploy

# Reset do banco de dados
docker-compose exec app npx prisma migrate reset
```

### MinIO

```bash
# Acessar console do MinIO
# Abra http://localhost:9001 no navegador
# Use as credenciais: minioadmin / minioadmin123

# Usar cliente MinIO (mc)
docker-compose exec minio mc alias set local http://localhost:9000 minioadmin minioadmin123
docker-compose exec minio mc ls local
```

## 📁 Estrutura de Arquivos

```
├── docker-compose.yml          # Orquestração dos serviços
├── Dockerfile                  # Imagem da aplicação
├── .dockerignore              # Arquivos ignorados no build
├── env.example                # Exemplo de variáveis de ambiente
├── init-scripts/              # Scripts de inicialização do PostgreSQL
│   └── 01-init-db.sql
├── scripts/                   # Scripts de automação
│   ├── dev.sh                 # Script de desenvolvimento
│   ├── prod.sh                # Script de produção
│   └── setup-minio.sh         # Configuração do MinIO
└── DOCKER.md                  # Esta documentação
```

## 🔒 Segurança

### Variáveis de Ambiente Importantes

- `POSTGRES_PASSWORD`: Senha do banco de dados
- `MINIO_ROOT_PASSWORD`: Senha do MinIO
- `JWT_SECRET`: Chave secreta para JWT

### Recomendações

1. **Nunca** commite o arquivo `.env` no repositório
2. Altere as senhas padrão em produção
3. Use variáveis de ambiente seguras em produção
4. Configure firewall adequadamente

## 🐛 Solução de Problemas

### Problemas Comuns

1. **Porta já em uso**
   ```bash
   # Verificar processos usando as portas
   lsof -i :5432
   lsof -i :9000
   lsof -i :3000
   ```

2. **Banco de dados não conecta**
   ```bash
   # Verificar logs do PostgreSQL
   docker-compose logs postgres
   
   # Verificar se o container está rodando
   docker-compose ps
   ```

3. **MinIO não acessível**
   ```bash
   # Verificar logs do MinIO
   docker-compose logs minio
   
   # Verificar se o serviço está saudável
   docker-compose exec minio mc admin info
   ```

### Limpeza

```bash
# Parar e remover containers
docker-compose down

# Remover volumes (CUIDADO: apaga dados)
docker-compose down -v

# Limpeza completa
docker system prune -a
```

## 📊 Monitoramento

### Health Checks

Os serviços incluem health checks automáticos:
- PostgreSQL: Verifica se o banco está aceitando conexões
- MinIO: Verifica se a API está respondendo

### Logs

```bash
# Ver logs em tempo real
docker-compose logs -f

# Ver logs de um serviço específico
docker-compose logs -f postgres
```

## 🔄 Backup e Restore

### Backup do Banco de Dados

```bash
# Backup
docker-compose exec postgres pg_dump -U apae_user apae_db > backup.sql

# Restore
docker-compose exec -T postgres psql -U apae_user apae_db < backup.sql
```

### Backup do MinIO

```bash
# Listar buckets
docker-compose exec minio mc ls local

# Backup de um bucket
docker-compose exec minio mc mirror local/apae-files /backup/
```

## 📞 Suporte

Para problemas ou dúvidas:
1. Verifique os logs dos containers
2. Consulte a documentação oficial do Docker
3. Abra uma issue no repositório
