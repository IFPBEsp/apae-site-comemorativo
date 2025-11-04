@echo off
REM Script de monitoramento para o projeto APAE no Windows
REM Este script monitora o status dos serviços Docker

echo 📊 Monitoramento dos Serviços APAE
echo ==================================

REM Verificar status dos containers
echo 🔍 Verificando status dos containers...
docker-compose ps

echo.
echo 💻 Uso de Recursos:
echo -------------------
docker stats --no-stream --format "table {{.Container}}\t{{.CPUPerc}}\t{{.MemUsage}}\t{{.MemPerc}}"

echo.
echo 🏥 Health Checks:
echo ----------------

REM PostgreSQL
docker-compose exec -T postgres pg_isready -U %POSTGRES_USER% -d %POSTGRES_DB% > nul 2>&1
if %errorlevel% equ 0 (
    echo ✅ PostgreSQL: Saudável
) else (
    echo ❌ PostgreSQL: Não saudável
)

REM MinIO
curl -s http://localhost:9000/minio/health/live > nul 2>&1
if %errorlevel% equ 0 (
    echo ✅ MinIO: Saudável
) else (
    echo ❌ MinIO: Não saudável
)

REM Next.js
curl -s http://localhost:3000 > nul 2>&1
if %errorlevel% equ 0 (
    echo ✅ Next.js: Saudável
) else (
    echo ❌ Next.js: Não saudável
)

echo.
echo 💾 Espaço em Disco:
echo -------------------
docker system df

echo.
echo 📁 Volumes específicos:
docker volume ls | findstr apae

echo.
echo 📈 Resumo:
echo ---------
echo PostgreSQL: http://localhost:5432
echo MinIO Console: http://localhost:9001
echo Aplicação: http://localhost:3000
echo.
echo 💡 Para ver logs em tempo real: docker-compose logs -f
echo 💡 Para reiniciar serviços: docker-compose restart
echo 💡 Para parar serviços: docker-compose down
pause
