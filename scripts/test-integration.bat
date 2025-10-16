@echo off
REM Script para testar a integração entre os serviços Docker no Windows
REM Este script valida se todos os serviços estão funcionando corretamente

echo 🧪 Testando integração dos serviços Docker...

REM Verificar se os containers estão rodando
echo 📋 Verificando status dos containers...
docker-compose ps

REM Testar PostgreSQL
echo 🗄️  Testando PostgreSQL...
docker-compose exec -T postgres pg_isready -U apae_user -d apae_db
if %errorlevel% equ 0 (
    echo ✅ PostgreSQL está funcionando corretamente
) else (
    echo ❌ PostgreSQL não está funcionando
)

REM Testar MinIO API
echo 📦 Testando MinIO API...
curl -s http://localhost:9000/minio/health/live > nul
if %errorlevel% equ 0 (
    echo ✅ MinIO API está funcionando
) else (
    echo ❌ MinIO API não está respondendo
)

REM Testar MinIO Console
echo 📦 Testando MinIO Console...
curl -s http://localhost:9001 > nul
if %errorlevel% equ 0 (
    echo ✅ MinIO Console está acessível
) else (
    echo ❌ MinIO Console não está acessível
)

REM Testar aplicação Next.js
echo 🌐 Testando aplicação Next.js...
curl -s http://localhost:3000 > nul
if %errorlevel% equ 0 (
    echo ✅ Aplicação Next.js está funcionando
) else (
    echo ❌ Aplicação Next.js não está respondendo
)

echo 🎉 Testes de integração concluídos!
echo.
echo 📊 Resumo dos serviços:
echo    PostgreSQL: http://localhost:5432
echo    MinIO Console: http://localhost:9001
echo    Aplicação: http://localhost:3000
