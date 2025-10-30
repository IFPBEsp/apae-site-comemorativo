#!/bin/bash

# Script para produção com Docker Compose
# Este script inicia todos os serviços em modo produção

echo "🚀 Iniciando ambiente de produção da APAE..."

# Verificar se o arquivo .env existe
if [ ! -f .env ]; then
    echo "❌ Arquivo .env não encontrado. Configure as variáveis de ambiente primeiro."
    exit 1
fi

# Parar containers existentes
echo "🛑 Parando containers existentes..."
docker-compose down

# Construir e iniciar todos os serviços
echo "🔨 Construindo e iniciando todos os serviços..."
docker-compose up --build -d

# Aguardar os serviços estarem prontos
echo "⏳ Aguardando serviços estarem prontos..."
sleep 30

# Executar migrações do Prisma
echo "🗄️  Executando migrações do banco de dados..."
docker-compose exec app npx prisma migrate deploy

echo "✅ Ambiente de produção iniciado!"
echo "📊 PostgreSQL: http://localhost:5432"
echo "📦 MinIO Console: http://localhost:9001"
echo "🌐 Aplicação: http://localhost:3000"
