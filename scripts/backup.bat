@echo off
REM Script de backup para o projeto APAE no Windows
REM Este script faz backup do banco de dados e dos dados do MinIO

echo 💾 Iniciando backup dos dados da APAE...

REM Configurações
set BACKUP_DIR=.\backups
set DATE=%date:~6,4%%date:~3,2%%date:~0,2%_%time:~0,2%%time:~3,2%%time:~6,2%
set POSTGRES_BACKUP_FILE=postgres_backup_%DATE%.sql
set MINIO_BACKUP_DIR=minio_backup_%DATE%

REM Criar diretório de backup
if not exist %BACKUP_DIR% mkdir %BACKUP_DIR%

REM Backup do PostgreSQL
echo 🗄️  Fazendo backup do PostgreSQL...
docker-compose exec -T postgres pg_dump -U %POSTGRES_USER% %POSTGRES_DB% > %BACKUP_DIR%\%POSTGRES_BACKUP_FILE%

if %errorlevel% equ 0 (
    echo ✅ Backup do PostgreSQL concluído: %POSTGRES_BACKUP_FILE%
) else (
    echo ❌ Erro no backup do PostgreSQL
    pause
    exit /b 1
)

REM Backup do MinIO
echo 📦 Fazendo backup do MinIO...
mkdir %BACKUP_DIR%\%MINIO_BACKUP_DIR%

REM Configurar cliente MinIO
mc.exe alias set local http://localhost:9000 %MINIO_ROOT_USER% %MINIO_ROOT_PASSWORD%

REM Fazer backup de cada bucket
for /f "tokens=*" %%i in ('mc.exe ls local --json ^| jq -r ".key" ^| sed "s|/||g"') do (
    echo 📁 Fazendo backup do bucket: %%i
    mc.exe mirror local/%%i %BACKUP_DIR%\%MINIO_BACKUP_DIR%\%%i
)

REM Comprimir backups
echo 🗜️  Comprimindo backups...
cd %BACKUP_DIR%
tar -czf apae_backup_%DATE%.tar.gz %POSTGRES_BACKUP_FILE% %MINIO_BACKUP_DIR%
cd ..

REM Limpar arquivos temporários
del %BACKUP_DIR%\%POSTGRES_BACKUP_FILE%
rmdir /s /q %BACKUP_DIR%\%MINIO_BACKUP_DIR%

REM Mostrar informações do backup
for %%i in (%BACKUP_DIR%\apae_backup_%DATE%.tar.gz) do set BACKUP_SIZE=%%~zi
echo ✅ Backup concluído!
echo 📁 Arquivo: %BACKUP_DIR%\apae_backup_%DATE%.tar.gz
echo 📊 Tamanho: %BACKUP_SIZE% bytes

REM Limpeza de backups antigos (manter apenas os últimos 7 dias)
echo 🧹 Limpando backups antigos...
forfiles /p %BACKUP_DIR% /m apae_backup_*.tar.gz /d -7 /c "cmd /c del @path" 2>nul

echo 🎉 Processo de backup finalizado!
pause
