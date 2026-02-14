@echo off
chcp 65001 > nul
setlocal enabledelayedexpansion

REM ═══════════════════════════════════════════════════════════════
REM  Script para Separar Bot Google Ads em Repositório Próprio
REM ═══════════════════════════════════════════════════════════════

echo.
echo ╔══════════════════════════════════════════════════════════════════════╗
echo ║                                                                      ║
echo ║          📦 Separar Bot Google Ads - Novo Repositório               ║
echo ║                                                                      ║
echo ╚══════════════════════════════════════════════════════════════════════╝
echo.

REM Verificar se estamos no diretório correto
echo ▶ Verificando diretório atual...
if not exist "bot-google-ads" (
    echo ✗ Pasta 'bot-google-ads' não encontrada!
    echo Execute este script a partir da raiz do repositório flaviacapaciacorretora
    pause
    exit /b 1
)
echo ✓ Pasta bot-google-ads encontrada!

REM Definir caminhos
set "TEMP_DIR=%TEMP%\bot-google-ads-separado"
set "SOURCE_DIR=%CD%\bot-google-ads"

echo.
echo ▶ Configurações:
echo   Fonte: %SOURCE_DIR%
echo   Destino: %TEMP_DIR%
echo.

REM Confirmar com usuário
set /p "confirm=Deseja continuar? (s/N) "
if /i not "%confirm%"=="s" (
    echo ⚠ Operação cancelada pelo usuário
    pause
    exit /b 0
)

REM Passo 1: Criar/Limpar diretório temporário
echo.
echo ▶ Passo 1: Preparando diretório temporário...
if exist "%TEMP_DIR%" (
    echo ⚠ Diretório temporário já existe. Removendo...
    rmdir /s /q "%TEMP_DIR%"
)
mkdir "%TEMP_DIR%"
echo ✓ Diretório temporário criado: %TEMP_DIR%

REM Passo 2: Copiar arquivos
echo.
echo ▶ Passo 2: Copiando arquivos do bot-google-ads...
xcopy "%SOURCE_DIR%\*" "%TEMP_DIR%\" /E /I /H /Y > nul
echo ✓ Arquivos copiados com sucesso!

REM Passo 3: Entrar no diretório
cd /d "%TEMP_DIR%"
echo ✓ Mudou para: %CD%

REM Passo 4: Remover .git antigo se existir
echo.
echo ▶ Passo 3: Limpando histórico Git antigo...
if exist ".git" (
    rmdir /s /q ".git"
    echo ✓ Histórico Git removido
) else (
    echo ⚠ Nenhum histórico Git para remover
)

REM Passo 5: Inicializar novo repositório
echo.
echo ▶ Passo 4: Inicializando novo repositório Git...
git init
if %errorlevel% neq 0 (
    echo ✗ Erro ao inicializar Git. Certifique-se de que o Git está instalado.
    pause
    exit /b 1
)
echo ✓ Repositório Git inicializado!

REM Passo 6: Configurar Git
echo.
echo ▶ Passo 5: Configurando Git...
git config user.name > nul 2>&1
if %errorlevel% neq 0 (
    echo ⚠ Git user.name não configurado
    set /p "git_name=Digite seu nome: "
    git config user.name "!git_name!"
)
git config user.email > nul 2>&1
if %errorlevel% neq 0 (
    echo ⚠ Git user.email não configurado
    set /p "git_email=Digite seu email: "
    git config user.email "!git_email!"
)
echo ✓ Git configurado!
for /f "delims=" %%i in ('git config user.name') do set git_user_name=%%i
for /f "delims=" %%i in ('git config user.email') do set git_user_email=%%i
echo   Nome: !git_user_name!
echo   Email: !git_user_email!

REM Passo 7: Verificar estrutura
echo.
echo ▶ Passo 6: Verificando estrutura de arquivos...
echo.
echo Estrutura do novo repositório:
dir /b
echo.

REM Passo 8: Adicionar arquivos
echo.
echo ▶ Passo 7: Adicionando arquivos ao Git...
git add .
echo ✓ Arquivos adicionados!

REM Passo 9: Mostrar status
echo.
echo ▶ Status do Git:
git status --short

REM Passo 10: Fazer commit inicial
echo.
echo ▶ Passo 8: Criando commit inicial...
git commit -m "Initial commit: Bot Google Ads com IA" -m "Sistema completo de geração automática de anúncios para Google Ads usando IA." -m "Componentes:" -m "- API Node.js + Express" -m "- Bot Python + FastAPI + Mistral AI" -m "- Dashboard React + Vite + Tailwind" -m "- Scripts SQL Server" -m "- Docker Compose" -m "Separado do repositório principal flaviacapaciacorretora para desenvolvimento independente."
echo ✓ Commit inicial criado!

REM Passo 11: Renomear branch para main
echo.
echo ▶ Passo 9: Renomeando branch para 'main'...
git branch -M main
echo ✓ Branch renomeada para 'main'

REM Passo 12: Mostrar log
echo.
echo ▶ Histórico do Git:
git log --oneline --decorate -1

REM Passo 13: Instruções finais
echo.
echo ╔══════════════════════════════════════════════════════════════════════╗
echo ║                                                                      ║
echo ║                    ✓ PREPARAÇÃO CONCLUÍDA!                          ║
echo ║                                                                      ║
echo ╚══════════════════════════════════════════════════════════════════════╝
echo.
echo 📋 PRÓXIMOS PASSOS:
echo.
echo 1. Criar o repositório no GitHub:
echo    • Vá para: https://github.com/new
echo    • Owner: flaviacapacia
echo    • Repository name: bot-google-ads-ia
echo    • Description: Sistema de Geração Automática de Anúncios Google Ads com IA
echo    • Visibility: Public
echo    • NÃO adicione README, .gitignore ou license
echo    • Clique em 'Create repository'
echo.
echo 2. Conectar e fazer push:
echo.
echo    cd %TEMP_DIR%
echo    git remote add origin https://github.com/flaviacapacia/bot-google-ads-ia.git
echo    git push -u origin main
echo.
echo 3. Verificar:
echo    • Acesse: https://github.com/flaviacapacia/bot-google-ads-ia
echo    • Verifique se todos os arquivos estão lá
echo.
echo ⚠️  LEMBRETE:
echo    • Os arquivos estão em: %TEMP_DIR%
echo    • Você pode deletar após fazer push com sucesso
echo.
echo ✨ Boa sorte!
echo.

REM Criar arquivo com comandos
echo cd %TEMP_DIR% > "%TEMP_DIR%\comandos-push.txt"
echo git remote add origin https://github.com/flaviacapacia/bot-google-ads-ia.git >> "%TEMP_DIR%\comandos-push.txt"
echo git push -u origin main >> "%TEMP_DIR%\comandos-push.txt"
echo ✓ Comandos salvos em: %TEMP_DIR%\comandos-push.txt

REM Perguntar se quer abrir GitHub
echo.
set /p "open_github=Quer abrir o GitHub para criar o repositório? (s/N) "
if /i "%open_github%"=="s" (
    start https://github.com/new
)

REM Perguntar se quer abrir o diretório
echo.
set /p "open_dir=Quer abrir o diretório temporário? (s/N) "
if /i "%open_dir%"=="s" (
    explorer "%TEMP_DIR%"
)

echo.
echo ✓ Script concluído!
echo.
pause
