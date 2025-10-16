# 🐳 Docker Setup - APAE Site Comemorativo

Este projeto inclui uma configuração completa do Docker e Docker Compose para facilitar o desenvolvimento e deploy da aplicação APAE Site Comemorativo.

## 📋 Visão Geral

O ambiente Docker inclui:
- **PostgreSQL** - Banco de dados principal
- **MinIO** - Armazenamento de objetos (S3-compatible)
- **Next.js** - Aplicação web
- **Nginx** - Proxy reverso (opcional para produção)

## 🚀 Início Rápido

### 1. Configuração Inicial

**Linux/macOS:**
```bash
./scripts/setup.sh
```

**Windows:**
```cmd
scripts\setup.bat
```

### 2. Desenvolvimento

**Linux/macOS:**
```bash
./scripts/dev.sh
```

**Windows:**
```cmd
scripts\dev.bat
```

### 3. Produção

**Linux/macOS:**
```bash
./scripts/prod.sh
```

**Windows:**
```cmd
scripts\prod.bat
```

## 📁 Estrutura de Arquivos

```
├── docker-compose.yml          # Orquestração principal
├── docker-compose.prod.yml     # Configuração para produção
├── Dockerfile                  # Imagem da aplicação
├── .dockerignore              # Arquivos ignorados no build
├── nginx.conf                  # Configuração do Nginx
├── postgresql.conf             # Configuração do PostgreSQL
├── minio-config.json           # Configuração do MinIO
├── env.example                 # Variáveis de ambiente (desenvolvimento)
├── env.prod.example            # Variáveis de ambiente (produção)
├── init-scripts/               # Scripts de inicialização do PostgreSQL
│   └── 01-init-db.sql
└── scripts/                    # Scripts de automação
    ├── setup.sh / setup.bat    # Configuração inicial
    ├── dev.sh / dev.bat        # Desenvolvimento
    ├── prod.sh / prod.bat      # Produção
    ├── monitor.sh / monitor.bat # Monitoramento
    ├── backup.sh / backup.bat  # Backup
    ├── restore.sh              # Restore
    ├── cleanup.sh / cleanup.bat # Limpeza
    ├── test-integration.sh / test-integration.bat # Testes
    └── init-minio.sh / init-minio.bat # Configuração MinIO
```

## 🔧 Scripts Disponíveis

### Scripts de Configuração
- **setup.sh/bat** - Configuração inicial completa do ambiente
- **init-minio.sh/bat** - Configuração específica do MinIO

### Scripts de Desenvolvimento
- **dev.sh/bat** - Inicia ambiente de desenvolvimento
- **prod.sh/bat** - Inicia ambiente de produção
- **test-integration.sh/bat** - Testa integração entre serviços

### Scripts de Manutenção
- **monitor.sh/bat** - Monitora status dos serviços
- **backup.sh/bat** - Faz backup dos dados
- **restore.sh** - Restaura dados de backup
- **cleanup.sh/bat** - Limpa ambiente Docker

## 🌐 Serviços Disponíveis

### PostgreSQL
- **Porta**: 5432
- **Usuário**: apae_user
- **Senha**: apae_password
- **Banco**: apae_db

### MinIO
- **API**: http://localhost:9000
- **Console**: http://localhost:9001
- **Usuário**: minioadmin
- **Senha**: minioadmin123

### Aplicação Next.js
- **URL**: http://localhost:3000

## 🔒 Segurança

### Variáveis de Ambiente Importantes
- `POSTGRES_PASSWORD` - Senha do banco de dados
- `MINIO_ROOT_PASSWORD` - Senha do MinIO
- `JWT_SECRET` - Chave secreta para JWT

### Recomendações
1. **Nunca** commite o arquivo `.env`
2. Altere as senhas padrão em produção
3. Use variáveis de ambiente seguras
4. Configure firewall adequadamente

## 📊 Monitoramento

### Health Checks
Todos os serviços incluem health checks automáticos:
- PostgreSQL: Verifica se o banco está aceitando conexões
- MinIO: Verifica se a API está respondendo
- Next.js: Verifica se a aplicação está respondendo

### Logs
```bash
# Ver logs em tempo real
docker-compose logs -f

# Ver logs de um serviço específico
docker-compose logs -f postgres
```

## 🔄 Backup e Restore

### Backup
```bash
# Backup automático
./scripts/backup.sh

# Backup manual do banco
docker-compose exec postgres pg_dump -U apae_user apae_db > backup.sql
```

### Restore
```bash
# Restore automático
./scripts/restore.sh backup.tar.gz

# Restore manual do banco
docker-compose exec -T postgres psql -U apae_user apae_db < backup.sql
```

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
   ```

3. **MinIO não acessível**
   ```bash
   # Verificar logs do MinIO
   docker-compose logs minio
   ```

### Limpeza
```bash
# Limpeza básica
./scripts/cleanup.sh

# Limpeza completa
docker system prune -a
```

## 📚 Documentação Adicional

- [DOCKER.md](./DOCKER.md) - Documentação completa
- [Docker Official Docs](https://docs.docker.com/)
- [Docker Compose Docs](https://docs.docker.com/compose/)
- [MinIO Docs](https://docs.min.io/)
- [PostgreSQL Docs](https://www.postgresql.org/docs/)

## 🤝 Contribuição

Para contribuir com melhorias no setup Docker:

1. Faça um fork do projeto
2. Crie uma branch para sua feature
3. Implemente as melhorias
4. Teste com os scripts fornecidos
5. Submeta um pull request

## 📞 Suporte

Para problemas ou dúvidas:
1. Verifique os logs dos containers
2. Execute os scripts de teste
3. Consulte a documentação
4. Abra uma issue no repositório
