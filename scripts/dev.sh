#!/bin/bash

# Script para desenvolvimento com Docker Compose
# Este script facilita o desenvolvimento com todos os serviços

echo "🚀 Iniciando ambiente de desenvolvimento da APAE..."

# Verificar se o arquivo .env existe
if [ ! -f .env ]; then
    echo "⚠️  Arquivo .env não encontrado. Copiando do env.example..."
    cp env.example .env
    echo "✅ Arquivo .env criado. Configure as variáveis conforme necessário."
fi

# Parar containers existentes
echo "🛑 Parando containers existentes..."
docker-compose down

# Construir e iniciar os serviços
echo "🔨 Construindo e iniciando serviços..."
docker-compose up --build -d postgres minio

# Aguardar os serviços estarem prontos
echo "⏳ Aguardando serviços estarem prontos..."
sleep 15

# Executar migrações do Prisma
echo "🗄️  Executando migrações do banco de dados..."
npx prisma migrate deploy

# Gerar cliente Prisma
echo "🔧 Gerando cliente Prisma..."
npx prisma generate

# Iniciar aplicação em modo desenvolvimento
echo "🎯 Iniciando aplicação Next.js..."
npm run dev

echo "✅ Ambiente de desenvolvimento iniciado!"
echo "📊 PostgreSQL: http://localhost:5432"
echo "📦 MinIO Console: http://localhost:9001"
echo "🌐 Aplicação: http://localhost:3000"
