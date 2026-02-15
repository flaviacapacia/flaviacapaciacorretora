@echo off
chcp 65001 > nul
title Iniciando Dashboard React - Bot Google Ads

echo.
echo ╔══════════════════════════════════════════════════════════════════════╗
echo ║                                                                      ║
echo ║          ⚛️  Iniciando Dashboard React                              ║
echo ║                                                                      ║
echo ╚══════════════════════════════════════════════════════════════════════╝
echo.

cd /d "%~dp0dashboard"

echo ▶ Verificando Node.js...
where node >nul 2>&1
if errorlevel 1 (
    echo ❌ Node.js não encontrado!
    echo.
    echo Por favor, instale Node.js:
    echo https://nodejs.org/
    echo.
    pause
    exit /b 1
)

echo ✓ Node.js encontrado
echo.

echo ▶ Verificando dependências...
if not exist "node_modules\" (
    echo ℹ Instalando dependências...
    call npm install
    if errorlevel 1 (
        echo ❌ Erro ao instalar dependências!
        pause
        exit /b 1
    )
)

echo ✓ Dependências OK
echo.

echo ▶ Verificando arquivo .env...
if not exist ".env" (
    echo ⚠ Arquivo .env não encontrado!
    echo.
    echo Copiando .env.example para .env...
    copy .env.example .env >nul
    echo ✓ Arquivo .env criado
)

echo.
echo ╔══════════════════════════════════════════════════════════════════════╗
echo ║                                                                      ║
echo ║          🚀 Iniciando Dashboard na porta 3000...                    ║
echo ║                                                                      ║
echo ║          Acesse: http://localhost:3000                              ║
echo ║                                                                      ║
echo ║          O navegador abrirá automaticamente                         ║
echo ║                                                                      ║
echo ║          Pressione Ctrl+C para parar                                ║
echo ║                                                                      ║
echo ╚══════════════════════════════════════════════════════════════════════╝
echo.

start http://localhost:3000

npm run dev

pause
