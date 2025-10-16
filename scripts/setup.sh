#!/bin/bash

# Script de configuração inicial para o projeto APAE
# Este script configura o ambiente Docker completo

echo "🚀 Configuração Inicial do Projeto APAE"
echo "======================================"

# Verificar se Docker está instalado
if ! command -v docker &> /dev/null; then
    echo "❌ Docker não está instalado. Instale o Docker primeiro."
    exit 1
fi

# Verificar se Docker Compose está instalado
if ! command -v docker-compose &> /dev/null; then
    echo "❌ Docker Compose não está instalado. Instale o Docker Compose primeiro."
    exit 1
fi

# Verificar se Node.js está instalado
if ! command -v node &> /dev/null; then
    echo "❌ Node.js não está instalado. Instale o Node.js primeiro."
    exit 1
fi

echo "✅ Pré-requisitos verificados!"

# Criar arquivo .env se não existir
if [ ! -f .env ]; then
    echo "📝 Criando arquivo .env..."
    cp env.example .env
    echo "✅ Arquivo .env criado. Configure as variáveis conforme necessário."
else
    echo "✅ Arquivo .env já existe."
fi

# Instalar dependências do Node.js
echo "📦 Instalando dependências do Node.js..."
npm install

# Tornar scripts executáveis
echo "🔧 Configurando scripts..."
chmod +x scripts/*.sh

# Construir e iniciar serviços
echo "🐳 Construindo e iniciando serviços Docker..."
docker-compose up --build -d postgres minio

# Aguardar serviços estarem prontos
echo "⏳ Aguardando serviços estarem prontos..."
sleep 20

# Executar migrações do Prisma
echo "🗄️  Executando migrações do banco de dados..."
npx prisma migrate deploy

# Gerar cliente Prisma
echo "🔧 Gerando cliente Prisma..."
npx prisma generate

# Configurar MinIO
echo "📦 Configurando MinIO..."
./scripts/init-minio.sh

# Executar testes de integração
echo "🧪 Executando testes de integração..."
./scripts/test-integration.sh

echo ""
echo "🎉 Configuração inicial concluída!"
echo ""
echo "📊 Serviços disponíveis:"
echo "   PostgreSQL: http://localhost:5432"
echo "   MinIO Console: http://localhost:9001"
echo "   Aplicação: http://localhost:3000"
echo ""
echo "💡 Comandos úteis:"
echo "   ./scripts/dev.sh - Iniciar desenvolvimento"
echo "   ./scripts/prod.sh - Iniciar produção"
echo "   ./scripts/monitor.sh - Monitorar serviços"
echo "   ./scripts/backup.sh - Fazer backup"
echo "   ./scripts/cleanup.sh - Limpar ambiente"
echo ""
echo "📚 Documentação: DOCKER.md"
