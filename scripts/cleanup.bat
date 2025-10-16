@echo off
REM Script de limpeza para o projeto APAE no Windows
REM Este script limpa containers, volumes e imagens não utilizados

echo 🧹 Limpeza do Ambiente Docker APAE
echo =================================

REM Parar e remover containers
echo 🛑 Parando containers...
docker-compose down

REM Remover containers órfãos
set /p REMOVE_ORPHANS="❓ Remover containers órfãos? (y/N): "
if /i "%REMOVE_ORPHANS%"=="y" (
    echo 🗑️  Removendo containers órfãos...
    docker container prune -f
)

REM Remover volumes
set /p REMOVE_VOLUMES="❓ Remover volumes Docker (CUIDADO: apaga dados)? (y/N): "
if /i "%REMOVE_VOLUMES%"=="y" (
    echo 🗑️  Removendo volumes...
    docker-compose down -v
    docker volume prune -f
)

REM Remover imagens não utilizadas
set /p REMOVE_IMAGES="❓ Remover imagens não utilizadas? (y/N): "
if /i "%REMOVE_IMAGES%"=="y" (
    echo 🗑️  Removendo imagens não utilizadas...
    docker image prune -f
)

REM Remover redes não utilizadas
set /p REMOVE_NETWORKS="❓ Remover redes não utilizadas? (y/N): "
if /i "%REMOVE_NETWORKS%"=="y" (
    echo 🗑️  Removendo redes não utilizadas...
    docker network prune -f
)

REM Limpeza completa do sistema Docker
set /p FULL_CLEANUP="❓ Executar limpeza completa do sistema Docker? (y/N): "
if /i "%FULL_CLEANUP%"=="y" (
    echo 🗑️  Executando limpeza completa...
    docker system prune -a -f
)

REM Mostrar espaço liberado
echo.
echo 📊 Espaço em disco após limpeza:
docker system df

echo.
echo ✅ Limpeza concluída!
echo.
echo 💡 Para iniciar novamente:
echo    scripts\dev.bat (desenvolvimento)
echo    scripts\prod.bat (produção)
pause
