@echo off
REM Script para produção com Docker Compose no Windows
REM Este script inicia todos os serviços em modo produção

echo 🚀 Iniciando ambiente de produção da APAE...

REM Verificar se o arquivo .env existe
if not exist .env (
    echo ❌ Arquivo .env não encontrado. Configure as variáveis de ambiente primeiro.
    pause
    exit /b 1
)

REM Parar containers existentes
echo 🛑 Parando containers existentes...
docker-compose down

REM Construir e iniciar todos os serviços
echo 🔨 Construindo e iniciando todos os serviços...
docker-compose up --build -d

REM Aguardar os serviços estarem prontos
echo ⏳ Aguardando serviços estarem prontos...
timeout /t 30 /nobreak > nul

REM Executar migrações do Prisma
echo 🗄️  Executando migrações do banco de dados...
docker-compose exec app npx prisma migrate deploy

echo ✅ Ambiente de produção iniciado!
echo 📊 PostgreSQL: http://localhost:5432
echo 📦 MinIO Console: http://localhost:9001
echo 🌐 Aplicação: http://localhost:3000
