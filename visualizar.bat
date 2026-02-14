@echo off
chcp 65001 > nul
setlocal enabledelayedexpansion

REM Script para visualizar interfaces do projeto
REM Flávia Capacia Corretora

echo ╔══════════════════════════════════════════════════════════════════════╗
echo ║                                                                      ║
echo ║          📱 Visualizar Interfaces - Flávia Capacia                  ║
echo ║                                                                      ║
echo ╚══════════════════════════════════════════════════════════════════════╝
echo.

REM Menu principal
echo Escolha qual interface você quer visualizar:
echo.
echo 1. 🏠 Site Principal (Imobiliária)
echo 2. 🤖 Dashboard React (Bot Google Ads)
echo 3. 🐳 Sistema Completo (Docker)
echo 4. ❌ Cancelar
echo.
set /p choice="Digite sua escolha (1-4): "

if "%choice%"=="1" goto site_principal
if "%choice%"=="2" goto dashboard_react
if "%choice%"=="3" goto docker_completo
if "%choice%"=="4" goto cancelar
goto opcao_invalida

:site_principal
echo.
echo ═══════════════════════════════════════════════════════════════════════
echo 🏠 Iniciando Site Principal
echo ═══════════════════════════════════════════════════════════════════════
echo.

REM Verificar se Python está instalado
python --version >nul 2>&1
if %errorlevel% equ 0 (
    set PYTHON_CMD=python
) else (
    python3 --version >nul 2>&1
    if %errorlevel% equ 0 (
        set PYTHON_CMD=python3
    ) else (
        echo ❌ Python não encontrado!
        echo.
        echo Instale Python ou abra index.html diretamente no navegador
        echo Baixe em: https://www.python.org/downloads/
        pause
        exit /b 1
    )
)

echo ✅ Python encontrado: !PYTHON_CMD!
echo.
echo 🚀 Iniciando servidor HTTP na porta 8080...
echo.
echo Páginas disponíveis:
echo   • Home: http://localhost:8080/index.html
echo   • Sobre: http://localhost:8080/sobre.html
echo   • Imóveis: http://localhost:8080/imoveis-cadastrados.html
echo   • Blog: http://localhost:8080/blog.html
echo   • Contato: http://localhost:8080/contato.html
echo.
echo 💡 Pressione Ctrl+C para parar o servidor
echo.

REM Aguardar 2 segundos e abrir navegador
timeout /t 2 /nobreak >nul
start http://localhost:8080/index.html

REM Iniciar servidor
!PYTHON_CMD! -m http.server 8080
goto :eof

:dashboard_react
echo.
echo ═══════════════════════════════════════════════════════════════════════
echo 🤖 Iniciando Dashboard React
echo ═══════════════════════════════════════════════════════════════════════
echo.

REM Verificar se Node.js está instalado
node --version >nul 2>&1
if %errorlevel% neq 0 (
    echo ❌ Node.js não encontrado!
    echo.
    echo Instale Node.js em: https://nodejs.org
    pause
    exit /b 1
)

for /f "tokens=*" %%i in ('node --version') do set NODE_VERSION=%%i
echo ✅ Node.js encontrado: !NODE_VERSION!
echo.

REM Ir para pasta do dashboard
cd bot-google-ads\dashboard
if %errorlevel% neq 0 (
    echo ❌ Erro: Pasta bot-google-ads\dashboard não encontrada
    pause
    exit /b 1
)

REM Verificar se node_modules existe
if not exist "node_modules\" (
    echo 📦 Instalando dependências...
    echo.
    call npm install
    if %errorlevel% neq 0 (
        echo ❌ Erro ao instalar dependências
        pause
        exit /b 1
    )
    echo.
    echo ✅ Dependências instaladas
    echo.
)

echo 🚀 Iniciando servidor Vite...
echo.
echo Dashboard será aberto em: http://localhost:3000
echo.
echo Páginas disponíveis:
echo   • Imóveis: http://localhost:3000/
echo   • Anúncios: http://localhost:3000/anuncios
echo.
echo 💡 Pressione Ctrl+C para parar o servidor
echo.

REM Aguardar 3 segundos e abrir navegador
timeout /t 3 /nobreak >nul
start http://localhost:3000

REM Iniciar Vite
call npm run dev
goto :eof

:docker_completo
echo.
echo ═══════════════════════════════════════════════════════════════════════
echo 🐳 Iniciando Sistema Completo com Docker
echo ═══════════════════════════════════════════════════════════════════════
echo.

REM Verificar se Docker está instalado
docker --version >nul 2>&1
if %errorlevel% neq 0 (
    echo ❌ Docker não encontrado!
    echo.
    echo Instale Docker em: https://www.docker.com
    pause
    exit /b 1
)

for /f "tokens=*" %%i in ('docker --version') do set DOCKER_VERSION=%%i
echo ✅ Docker encontrado: !DOCKER_VERSION!
echo.

REM Ir para pasta bot-google-ads
cd bot-google-ads
if %errorlevel% neq 0 (
    echo ❌ Erro: Pasta bot-google-ads não encontrada
    pause
    exit /b 1
)

REM Verificar se .env existe
if not exist ".env" (
    echo ⚠️  Arquivo .env não encontrado
    echo.
    echo Copiando .env.example para .env...
    copy .env.example .env
    echo.
    echo 📝 IMPORTANTE: Edite o arquivo .env com suas configurações:
    echo   • MISTRAL_API_KEY (obrigatório)
    echo   • Credenciais do banco de dados
    echo.
    pause
)

echo 🐳 Iniciando containers Docker...
echo.
docker-compose up -d

if %errorlevel% equ 0 (
    echo.
    echo ✅ Containers iniciados com sucesso!
    echo.
    echo ═══════════════════════════════════════════════════════════════════════
    echo 🎉 Sistema Completo Rodando!
    echo ═══════════════════════════════════════════════════════════════════════
    echo.
    echo Acesse:
    echo   • Dashboard: http://localhost:3000
    echo   • API: http://localhost:3001
    echo   • Bot: http://localhost:8000
    echo.
    echo Comandos úteis:
    echo   • Ver logs: docker-compose logs -f
    echo   • Parar: docker-compose stop
    echo   • Parar e remover: docker-compose down
    echo.
    
    timeout /t 3 /nobreak >nul
    start http://localhost:3000
) else (
    echo ❌ Erro ao iniciar containers
    echo.
    echo Verifique:
    echo   • Docker está rodando
    echo   • Arquivo .env está configurado
    echo   • Portas 3000, 3001, 8000 estão livres
)

pause
goto :eof

:cancelar
echo.
echo ❌ Cancelado
exit /b 0

:opcao_invalida
echo.
echo ❌ Opção inválida!
pause
exit /b 1
