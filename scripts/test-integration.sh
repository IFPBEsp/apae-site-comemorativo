#!/bin/bash

# Script para testar a integração entre os serviços Docker
# Este script valida se todos os serviços estão funcionando corretamente

echo "🧪 Testando integração dos serviços Docker..."

# Função para testar conectividade
test_connection() {
    local service=$1
    local port=$2
    local timeout=${3:-10}
    
    echo "🔍 Testando $service na porta $port..."
    
    for i in $(seq 1 $timeout); do
        if nc -z localhost $port 2>/dev/null; then
            echo "✅ $service está respondendo na porta $port"
            return 0
        fi
        echo "⏳ Aguardando $service... ($i/$timeout)"
        sleep 1
    done
    
    echo "❌ $service não está respondendo na porta $port"
    return 1
}

# Função para testar banco de dados
test_database() {
    echo "🗄️  Testando conexão com PostgreSQL..."
    
    # Testar se o banco está aceitando conexões
    if docker-compose exec -T postgres pg_isready -U apae_user -d apae_db; then
        echo "✅ PostgreSQL está funcionando corretamente"
        
        # Testar se as tabelas existem
        if docker-compose exec -T postgres psql -U apae_user -d apae_db -c "\dt" | grep -q "user\|testimonial"; then
            echo "✅ Tabelas do banco de dados estão criadas"
        else
            echo "⚠️  Tabelas não encontradas. Execute as migrações: npx prisma migrate deploy"
        fi
    else
        echo "❌ PostgreSQL não está funcionando"
        return 1
    fi
}

# Função para testar MinIO
test_minio() {
    echo "📦 Testando MinIO..."
    
    # Testar se a API está respondendo
    if curl -s http://localhost:9000/minio/health/live > /dev/null; then
        echo "✅ MinIO API está funcionando"
    else
        echo "❌ MinIO API não está respondendo"
        return 1
    fi
    
    # Testar se o console está acessível
    if curl -s http://localhost:9001 > /dev/null; then
        echo "✅ MinIO Console está acessível"
    else
        echo "❌ MinIO Console não está acessível"
        return 1
    fi
}

# Função para testar aplicação
test_application() {
    echo "🌐 Testando aplicação Next.js..."
    
    if curl -s http://localhost:3000 > /dev/null; then
        echo "✅ Aplicação Next.js está funcionando"
    else
        echo "❌ Aplicação Next.js não está respondendo"
        return 1
    fi
}

# Executar testes
echo "🚀 Iniciando testes de integração..."

# Verificar se os containers estão rodando
echo "📋 Verificando status dos containers..."
docker-compose ps

# Testar conectividade
test_connection "PostgreSQL" 5432
test_connection "MinIO API" 9000
test_connection "MinIO Console" 9001
test_connection "Next.js" 3000

# Testar funcionalidades específicas
test_database
test_minio
test_application

echo "🎉 Testes de integração concluídos!"
echo ""
echo "📊 Resumo dos serviços:"
echo "   PostgreSQL: http://localhost:5432"
echo "   MinIO Console: http://localhost:9001"
echo "   Aplicação: http://localhost:3000"
