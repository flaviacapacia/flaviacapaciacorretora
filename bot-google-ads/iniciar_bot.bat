@echo off
chcp 65001 > nul
title Iniciando Bot Python - Bot Google Ads

echo.
echo ╔══════════════════════════════════════════════════════════════════════╗
echo ║                                                                      ║
echo ║          🤖 Iniciando Bot Python + IA                               ║
echo ║                                                                      ║
echo ╚══════════════════════════════════════════════════════════════════════╝
echo.

cd /d "%~dp0bot"

echo ▶ Verificando Python...
where python >nul 2>&1
if errorlevel 1 (
    echo ❌ Python não encontrado!
    echo.
    echo Por favor, instale Python 3.8+:
    echo https://www.python.org/downloads/
    echo.
    pause
    exit /b 1
)

python --version
echo.

echo ▶ Verificando ambiente virtual...
if not exist "venv\" (
    echo ℹ Criando ambiente virtual...
    python -m venv venv
    if errorlevel 1 (
        echo ❌ Erro ao criar ambiente virtual!
        pause
        exit /b 1
    )
    echo ✓ Ambiente virtual criado
)

echo ▶ Ativando ambiente virtual...
call venv\Scripts\activate.bat

echo.
echo ▶ Verificando dependências...
if not exist "venv\Lib\site-packages\fastapi\" (
    echo ℹ Instalando dependências...
    pip install -r requirements.txt
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
    echo.
    echo ⚠ IMPORTANTE: Configure as variáveis em .env antes de continuar
    echo.
    notepad .env
)

echo.
echo ╔══════════════════════════════════════════════════════════════════════╗
echo ║                                                                      ║
echo ║          🚀 Iniciando Bot na porta 8000...                          ║
echo ║                                                                      ║
echo ║          Acesse: http://localhost:8000                              ║
echo ║          Docs: http://localhost:8000/docs                           ║
echo ║                                                                      ║
echo ║          Pressione Ctrl+C para parar                                ║
echo ║                                                                      ║
echo ╚══════════════════════════════════════════════════════════════════════╝
echo.

python src/main.py

pause
