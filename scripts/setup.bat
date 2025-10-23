@echo off
REM Script de configuração inicial para o projeto APAE no Windows
REM Este script configura o ambiente Docker completo

echo 🚀 Configuração Inicial do Projeto APAE
echo ======================================

REM Verificar se Docker está instalado
docker --version > nul 2>&1
if %errorlevel% neq 0 (
    echo ❌ Docker não está instalado. Instale o Docker primeiro.
    pause
    exit /b 1
)

REM Verificar se Docker Compose está instalado
docker-compose --version > nul 2>&1
if %errorlevel% neq 0 (
    echo ❌ Docker Compose não está instalado. Instale o Docker Compose primeiro.
    pause
    exit /b 1
)

REM Verificar se Node.js está instalado
node --version > nul 2>&1
if %errorlevel% neq 0 (
    echo ❌ Node.js não está instalado. Instale o Node.js primeiro.
    pause
    exit /b 1
)

echo ✅ Pré-requisitos verificados!

REM Criar arquivo .env se não existir
if not exist .env (
    echo 📝 Criando arquivo .env...
    copy env.example .env
    echo ✅ Arquivo .env criado. Configure as variáveis conforme necessário.
) else (
    echo ✅ Arquivo .env já existe.
)

REM Instalar dependências do Node.js
echo 📦 Instalando dependências do Node.js...
npm install

REM Construir e iniciar serviços
echo 🐳 Construindo e iniciando serviços Docker...
docker-compose up --build -d postgres minio

REM Aguardar serviços estarem prontos
echo ⏳ Aguardando serviços estarem prontos...
timeout /t 20 /nobreak > nul

REM Executar migrações do Prisma
echo 🗄️  Executando migrações do banco de dados...
npx prisma migrate deploy

REM Gerar cliente Prisma
echo 🔧 Gerando cliente Prisma...
npx prisma generate

REM Configurar MinIO
echo 📦 Configurando MinIO...
call scripts\init-minio.bat

REM Executar testes de integração
echo 🧪 Executando testes de integração...
call scripts\test-integration.bat

echo.
echo 🎉 Configuração inicial concluída!
echo.
echo 📊 Serviços disponíveis:
echo    PostgreSQL: http://localhost:5432
echo    MinIO Console: http://localhost:9001
echo    Aplicação: http://localhost:3000
echo.
echo 💡 Comandos úteis:
echo    scripts\dev.bat - Iniciar desenvolvimento
echo    scripts\prod.bat - Iniciar produção
echo    scripts\monitor.bat - Monitorar serviços
echo    scripts\backup.bat - Fazer backup
echo    scripts\cleanup.bat - Limpar ambiente
echo.
echo 📚 Documentação: DOCKER.md
pause
