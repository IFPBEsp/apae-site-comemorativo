#!/bin/bash

# Script de monitoramento para o projeto APAE
# Este script monitora o status dos serviços Docker

echo "📊 Monitoramento dos Serviços APAE"
echo "=================================="

# Função para verificar status de um serviço
check_service() {
    local service=$1
    local port=$2
    
    if docker-compose ps $service | grep -q "Up"; then
        if nc -z localhost $port 2>/dev/null; then
            echo "✅ $service: Funcionando (porta $port)"
            return 0
        else
            echo "⚠️  $service: Container rodando, mas porta $port não acessível"
            return 1
        fi
    else
        echo "❌ $service: Não está rodando"
        return 1
    fi
}

# Função para verificar uso de recursos
check_resources() {
    echo ""
    echo "💻 Uso de Recursos:"
    echo "-------------------"
    
    # CPU e Memória dos containers
    docker stats --no-stream --format "table {{.Container}}\t{{.CPUPerc}}\t{{.MemUsage}}\t{{.MemPerc}}"
}

# Função para verificar logs de erro
check_logs() {
    echo ""
    echo "📋 Logs Recentes (últimas 10 linhas):"
    echo "------------------------------------"
    
    for service in postgres minio app; do
        if docker-compose ps $service | grep -q "Up"; then
            echo ""
            echo "🔍 $service:"
            docker-compose logs --tail=10 $service | grep -i error || echo "   Nenhum erro encontrado"
        fi
    done
}

# Função para verificar saúde dos serviços
check_health() {
    echo ""
    echo "🏥 Health Checks:"
    echo "----------------"
    
    # PostgreSQL
    if docker-compose exec -T postgres pg_isready -U ${POSTGRES_USER:-apae_user} -d ${POSTGRES_DB:-apae_db} 2>/dev/null; then
        echo "✅ PostgreSQL: Saudável"
    else
        echo "❌ PostgreSQL: Não saudável"
    fi
    
    # MinIO
    if curl -s http://localhost:9000/minio/health/live > /dev/null; then
        echo "✅ MinIO: Saudável"
    else
        echo "❌ MinIO: Não saudável"
    fi
    
    # Next.js
    if curl -s http://localhost:3000 > /dev/null; then
        echo "✅ Next.js: Saudável"
    else
        echo "❌ Next.js: Não saudável"
    fi
}

# Função para verificar espaço em disco
check_disk() {
    echo ""
    echo "💾 Espaço em Disco:"
    echo "------------------"
    
    # Espaço usado pelos volumes Docker
    docker system df
    
    echo ""
    echo "📁 Volumes específicos:"
    docker volume ls | grep apae
}

# Executar verificações
echo "🔍 Verificando status dos serviços..."
echo ""

# Verificar serviços
check_service "postgres" 5432
check_service "minio" 9000
check_service "app" 3000

# Verificar recursos
check_resources

# Verificar saúde
check_health

# Verificar logs
check_logs

# Verificar espaço em disco
check_disk

echo ""
echo "📈 Resumo:"
echo "---------"
echo "PostgreSQL: http://localhost:5432"
echo "MinIO Console: http://localhost:9001"
echo "Aplicação: http://localhost:3000"
echo ""
echo "💡 Para ver logs em tempo real: docker-compose logs -f"
echo "💡 Para reiniciar serviços: docker-compose restart"
echo "💡 Para parar serviços: docker-compose down"
