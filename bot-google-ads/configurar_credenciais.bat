@echo off
chcp 65001 >nul
title Configurador de Credenciais - Bot Google Ads

echo.
echo ╔══════════════════════════════════════════════════════════════════╗
echo ║                                                                  ║
echo ║     🤖 CONFIGURADOR DE CREDENCIAIS - BOT GOOGLE ADS              ║
echo ║                                                                  ║
╚══════════════════════════════════════════════════════════════════╝
echo.

cd bot

:: Verifica se Python está instalado
python --version >nul 2>&1
if errorlevel 1 (
    echo ❌ Python não encontrado! Instale Python 3.8 ou superior.
    pause
    exit /b 1
)

:: Executa o configurador
python -m src.configurar_credenciais

if errorlevel 1 (
    echo.
    echo ❌ Erro ao executar o configurador.
    echo Executando script alternativo...
    python ..\configurar_credenciais.py
)

echo.
pause
