@echo off
chcp 65001 > nul
title Iniciando Sistema Completo - Bot Google Ads

echo.
echo ╔══════════════════════════════════════════════════════════════════════╗
echo ║                                                                      ║
echo ║          🚀 Iniciando Sistema Completo                              ║
echo ║          Bot Google Ads com IA                                      ║
echo ║                                                                      ║
echo ╚══════════════════════════════════════════════════════════════════════╝
echo.

cd /d "%~dp0"

echo Este script iniciará:
echo.
echo   1. 🤖 Bot Python (FastAPI) - porta 8000
echo   2. 🌐 API Node.js - porta 3001
echo   3. ⚛️  Dashboard React - porta 3000
echo.
echo Cada componente abrirá em uma janela separada.
echo.
pause

echo.
echo ▶ Iniciando Bot Python...
start "Bot Python - Porta 8000" cmd /k "%~dp0iniciar_bot.bat"
timeout /t 3 /nobreak >nul

echo ▶ Iniciando API Node.js...
start "API Node.js - Porta 3001" cmd /k "%~dp0iniciar_api.bat"
timeout /t 3 /nobreak >nul

echo ▶ Iniciando Dashboard React...
start "Dashboard React - Porta 3000" cmd /k "%~dp0iniciar_dashboard.bat"
timeout /t 3 /nobreak >nul

echo.
echo ╔══════════════════════════════════════════════════════════════════════╗
echo ║                                                                      ║
echo ║          ✅ Todos os componentes foram iniciados!                   ║
echo ║                                                                      ║
echo ║          Aguarde alguns segundos para carregamento...               ║
echo ║                                                                      ║
echo ║          URLs:                                                      ║
echo ║          • Dashboard: http://localhost:3000                         ║
echo ║          • API: http://localhost:3001                               ║
echo ║          • Bot: http://localhost:8000                               ║
echo ║                                                                      ║
echo ║          O dashboard abrirá automaticamente no navegador            ║
echo ║                                                                      ║
echo ╚══════════════════════════════════════════════════════════════════════╝
echo.

echo Aguardando 10 segundos para os servidores iniciarem...
timeout /t 10 /nobreak >nul

echo.
echo Abrindo dashboard no navegador...
start http://localhost:3000

echo.
echo ℹ Para parar todos os serviços, feche todas as janelas
echo   ou execute: parar_tudo.bat
echo.

pause
