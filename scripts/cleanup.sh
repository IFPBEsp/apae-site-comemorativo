#!/bin/bash

# Script de limpeza para o projeto APAE
# Este script limpa containers, volumes e imagens não utilizados

echo "🧹 Limpeza do Ambiente Docker APAE"
echo "================================="

# Função para confirmar ação
confirm() {
    read -p "❓ $1 (y/N): " -n 1 -r
    echo
    if [[ $REPLY =~ ^[Yy]$ ]]; then
        return 0
    else
        return 1
    fi
}

# Parar e remover containers
echo "🛑 Parando containers..."
docker-compose down

# Remover containers órfãos
if confirm "Remover containers órfãos?"; then
    echo "🗑️  Removendo containers órfãos..."
    docker container prune -f
fi

# Remover volumes
if confirm "Remover volumes Docker (CUIDADO: apaga dados)?"; then
    echo "🗑️  Removendo volumes..."
    docker-compose down -v
    docker volume prune -f
fi

# Remover imagens não utilizadas
if confirm "Remover imagens não utilizadas?"; then
    echo "🗑️  Removendo imagens não utilizadas..."
    docker image prune -f
fi

# Remover redes não utilizadas
if confirm "Remover redes não utilizadas?"; then
    echo "🗑️  Removendo redes não utilizadas..."
    docker network prune -f
fi

# Limpeza completa do sistema Docker
if confirm "Executar limpeza completa do sistema Docker?"; then
    echo "🗑️  Executando limpeza completa..."
    docker system prune -a -f
fi

# Mostrar espaço liberado
echo ""
echo "📊 Espaço em disco após limpeza:"
docker system df

echo ""
echo "✅ Limpeza concluída!"
echo ""
echo "💡 Para iniciar novamente:"
echo "   ./scripts/dev.sh (desenvolvimento)"
echo "   ./scripts/prod.sh (produção)"
