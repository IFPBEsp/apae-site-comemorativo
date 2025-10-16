#!/bin/bash

# Script de backup para o projeto APAE
# Este script faz backup do banco de dados e dos dados do MinIO

echo "💾 Iniciando backup dos dados da APAE..."

# Configurações
BACKUP_DIR="./backups"
DATE=$(date +%Y%m%d_%H%M%S)
POSTGRES_BACKUP_FILE="postgres_backup_$DATE.sql"
MINIO_BACKUP_DIR="minio_backup_$DATE"

# Criar diretório de backup
mkdir -p $BACKUP_DIR

# Backup do PostgreSQL
echo "🗄️  Fazendo backup do PostgreSQL..."
docker-compose exec -T postgres pg_dump -U ${POSTGRES_USER:-apae_user} ${POSTGRES_DB:-apae_db} > $BACKUP_DIR/$POSTGRES_BACKUP_FILE

if [ $? -eq 0 ]; then
    echo "✅ Backup do PostgreSQL concluído: $POSTGRES_BACKUP_FILE"
else
    echo "❌ Erro no backup do PostgreSQL"
    exit 1
fi

# Backup do MinIO
echo "📦 Fazendo backup do MinIO..."
mkdir -p $BACKUP_DIR/$MINIO_BACKUP_DIR

# Configurar cliente MinIO
mc alias set local http://localhost:9000 ${MINIO_ROOT_USER:-minioadmin} ${MINIO_ROOT_PASSWORD:-minioadmin123}

# Fazer backup de cada bucket
for bucket in $(mc ls local --json | jq -r '.key' | sed 's|/||g'); do
    echo "📁 Fazendo backup do bucket: $bucket"
    mc mirror local/$bucket $BACKUP_DIR/$MINIO_BACKUP_DIR/$bucket
done

# Comprimir backups
echo "🗜️  Comprimindo backups..."
cd $BACKUP_DIR
tar -czf "apae_backup_$DATE.tar.gz" $POSTGRES_BACKUP_FILE $MINIO_BACKUP_DIR
cd ..

# Limpar arquivos temporários
rm -f $BACKUP_DIR/$POSTGRES_BACKUP_FILE
rm -rf $BACKUP_DIR/$MINIO_BACKUP_DIR

# Mostrar informações do backup
BACKUP_SIZE=$(du -h $BACKUP_DIR/apae_backup_$DATE.tar.gz | cut -f1)
echo "✅ Backup concluído!"
echo "📁 Arquivo: $BACKUP_DIR/apae_backup_$DATE.tar.gz"
echo "📊 Tamanho: $BACKUP_SIZE"

# Limpeza de backups antigos (manter apenas os últimos 7 dias)
echo "🧹 Limpando backups antigos..."
find $BACKUP_DIR -name "apae_backup_*.tar.gz" -mtime +7 -delete

echo "🎉 Processo de backup finalizado!"
