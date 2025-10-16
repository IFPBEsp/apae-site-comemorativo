#!/bin/bash

# Script de restore para o projeto APAE
# Este script restaura o banco de dados e os dados do MinIO

if [ $# -eq 0 ]; then
    echo "❌ Uso: $0 <arquivo_de_backup.tar.gz>"
    echo "Exemplo: $0 backups/apae_backup_20240101_120000.tar.gz"
    exit 1
fi

BACKUP_FILE=$1

if [ ! -f "$BACKUP_FILE" ]; then
    echo "❌ Arquivo de backup não encontrado: $BACKUP_FILE"
    exit 1
fi

echo "🔄 Iniciando restore dos dados da APAE..."
echo "📁 Arquivo: $BACKUP_FILE"

# Extrair arquivo de backup
echo "📦 Extraindo arquivo de backup..."
TEMP_DIR=$(mktemp -d)
tar -xzf "$BACKUP_FILE" -C "$TEMP_DIR"

# Encontrar arquivos de backup
POSTGRES_BACKUP=$(find "$TEMP_DIR" -name "postgres_backup_*.sql" | head -1)
MINIO_BACKUP_DIR=$(find "$TEMP_DIR" -name "minio_backup_*" -type d | head -1)

if [ -z "$POSTGRES_BACKUP" ]; then
    echo "❌ Arquivo de backup do PostgreSQL não encontrado"
    exit 1
fi

if [ -z "$MINIO_BACKUP_DIR" ]; then
    echo "❌ Diretório de backup do MinIO não encontrado"
    exit 1
fi

# Restore do PostgreSQL
echo "🗄️  Restaurando PostgreSQL..."
docker-compose exec -T postgres psql -U ${POSTGRES_USER:-apae_user} -d ${POSTGRES_DB:-apae_db} < "$POSTGRES_BACKUP"

if [ $? -eq 0 ]; then
    echo "✅ Restore do PostgreSQL concluído"
else
    echo "❌ Erro no restore do PostgreSQL"
    exit 1
fi

# Restore do MinIO
echo "📦 Restaurando MinIO..."

# Configurar cliente MinIO
mc alias set local http://localhost:9000 ${MINIO_ROOT_USER:-minioadmin} ${MINIO_ROOT_PASSWORD:-minioadmin123}

# Restaurar cada bucket
for bucket_dir in "$MINIO_BACKUP_DIR"/*; do
    if [ -d "$bucket_dir" ]; then
        bucket_name=$(basename "$bucket_dir")
        echo "📁 Restaurando bucket: $bucket_name"
        
        # Criar bucket se não existir
        mc mb local/$bucket_name --ignore-existing
        
        # Restaurar dados
        mc mirror "$bucket_dir" local/$bucket_name
    fi
done

# Limpar arquivos temporários
rm -rf "$TEMP_DIR"

echo "✅ Restore do MinIO concluído"

echo "🎉 Processo de restore finalizado!"
echo "📊 PostgreSQL: http://localhost:5432"
echo "📦 MinIO Console: http://localhost:9001"
echo "🌐 Aplicação: http://localhost:3000"
