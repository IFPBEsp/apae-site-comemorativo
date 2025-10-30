@echo off
REM Script para desenvolvimento com Docker Compose no Windows
REM Este script facilita o desenvolvimento com todos os serviços

echo 🚀 Iniciando ambiente de desenvolvimento da APAE...

REM Verificar se o arquivo .env existe
if not exist .env (
    echo ⚠️  Arquivo .env não encontrado. Copiando do env.example...
    copy env.example .env
    echo ✅ Arquivo .env criado. Configure as variáveis conforme necessário.
)

REM Parar containers existentes
echo 🛑 Parando containers existentes...
docker-compose down

REM Construir e iniciar os serviços
echo 🔨 Construindo e iniciando serviços...
docker-compose up --build -d postgres minio

REM Aguardar os serviços estarem prontos
echo ⏳ Aguardando serviços estarem prontos...
timeout /t 15 /nobreak > nul

REM Executar migrações do Prisma
echo 🗄️  Executando migrações do banco de dados...
npx prisma migrate deploy

REM Gerar cliente Prisma
echo 🔧 Gerando cliente Prisma...
npx prisma generate

REM Iniciar aplicação em modo desenvolvimento
echo 🎯 Iniciando aplicação Next.js...
npm run dev

echo ✅ Ambiente de desenvolvimento iniciado!
echo 📊 PostgreSQL: http://localhost:5432
echo 📦 MinIO Console: http://localhost:9001
echo 🌐 Aplicação: http://localhost:3000
