@echo off
REM Script para inicializar o MinIO com buckets e configurações no Windows
REM Este script é executado após o MinIO estar disponível

echo 🔧 Configurando MinIO...

REM Aguardar MinIO estar disponível
echo ⏳ Aguardando MinIO estar disponível...
:wait_minio
curl -s http://localhost:9000/minio/health/live > nul 2>&1
if %errorlevel% neq 0 (
    echo Aguardando MinIO...
    timeout /t 2 /nobreak > nul
    goto wait_minio
)

echo ✅ MinIO está disponível!

REM Baixar MinIO client se não estiver instalado
if not exist mc.exe (
    echo 📦 Baixando MinIO client...
    powershell -Command "Invoke-WebRequest -Uri 'https://dl.min.io/client/mc/release/windows-amd64/mc.exe' -OutFile 'mc.exe'"
)

REM Configurar alias
echo 🔗 Configurando alias do MinIO...
mc.exe alias set local http://localhost:9000 %MINIO_ROOT_USER% %MINIO_ROOT_PASSWORD%

REM Criar buckets
echo 📁 Criando buckets...
mc.exe mb local/apae-files --ignore-existing
mc.exe mb local/apae-images --ignore-existing
mc.exe mb local/apae-documents --ignore-existing

REM Listar buckets criados
echo 📋 Buckets criados:
mc.exe ls local

echo ✅ Configuração do MinIO concluída!
echo 🌐 Console: http://localhost:9001
echo 🔑 Usuário: %MINIO_ROOT_USER%
echo 🔑 Senha: %MINIO_ROOT_PASSWORD%
