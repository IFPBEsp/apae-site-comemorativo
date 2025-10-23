#!/bin/bash

# Script para configurar o MinIO após a inicialização
# Este script cria buckets e configura permissões

echo "Aguardando MinIO estar disponível..."
sleep 10

# Configurar cliente MinIO
mc alias set local http://minio:9000 $MINIO_ROOT_USER $MINIO_ROOT_PASSWORD

# Criar bucket para arquivos da APAE
mc mb local/apae-files --ignore-existing

# Configurar política de acesso público para leitura (opcional)
mc anonymous set download local/apae-files

# Listar buckets criados
echo "Buckets criados:"
mc ls local

echo "Configuração do MinIO concluída!"
