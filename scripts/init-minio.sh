#!/bin/bash

# Script para inicializar o MinIO com buckets e configurações
# Este script é executado após o MinIO estar disponível

echo "🔧 Configurando MinIO..."

# Aguardar MinIO estar disponível
echo "⏳ Aguardando MinIO estar disponível..."
until curl -s http://minio:9000/minio/health/live > /dev/null; do
    echo "Aguardando MinIO..."
    sleep 2
done

echo "✅ MinIO está disponível!"

# Instalar MinIO client se não estiver instalado
if ! command -v mc &> /dev/null; then
    echo "📦 Instalando MinIO client..."
    wget -O mc https://dl.min.io/client/mc/release/linux-amd64/mc
    chmod +x mc
    sudo mv mc /usr/local/bin/
fi

# Configurar alias
echo "🔗 Configurando alias do MinIO..."
mc alias set local http://minio:9000 $MINIO_ROOT_USER $MINIO_ROOT_PASSWORD

# Criar buckets
echo "📁 Criando buckets..."
mc mb local/apae-files --ignore-existing
mc mb local/apae-images --ignore-existing
mc mb local/apae-documents --ignore-existing

# Configurar políticas de acesso
echo "🔒 Configurando políticas de acesso..."

# Política para leitura pública de imagens
cat > /tmp/apae-images-policy.json << EOF
{
  "Version": "2012-10-17",
  "Statement": [
    {
      "Effect": "Allow",
      "Principal": "*",
      "Action": "s3:GetObject",
      "Resource": "arn:aws:s3:::apae-images/*"
    }
  ]
}
EOF

# Aplicar política
mc anonymous set-json /tmp/apae-images-policy.json local/apae-images

# Listar buckets criados
echo "📋 Buckets criados:"
mc ls local

# Limpar arquivos temporários
rm -f /tmp/apae-images-policy.json

echo "✅ Configuração do MinIO concluída!"
echo "🌐 Console: http://localhost:9001"
echo "🔑 Usuário: $MINIO_ROOT_USER"
echo "🔑 Senha: $MINIO_ROOT_PASSWORD"
