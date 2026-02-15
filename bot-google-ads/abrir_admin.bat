@echo off
chcp 65001 > nul
title Abrir Painel Administrativo - Bot Google Ads

echo.
echo ╔══════════════════════════════════════════════════════════════════════╗
echo ║                                                                      ║
echo ║          📊 Abrindo Painel Administrativo                           ║
echo ║                                                                      ║
echo ╚══════════════════════════════════════════════════════════════════════╝
echo.

echo Verificando se os servidores estão rodando...
echo.

:: Verifica Dashboard (porta 3000)
netstat -an | find ":3000" | find "LISTENING" >nul
if %errorlevel%==0 (
    echo ✓ Dashboard está rodando na porta 3000
    set DASHBOARD_OK=1
) else (
    echo ⚠ Dashboard não está rodando na porta 3000
    set DASHBOARD_OK=0
)

:: Verifica API (porta 3001)
netstat -an | find ":3001" | find "LISTENING" >nul
if %errorlevel%==0 (
    echo ✓ API está rodando na porta 3001
    set API_OK=1
) else (
    echo ⚠ API não está rodando na porta 3001
    set API_OK=0
)

:: Verifica Bot (porta 8000)
netstat -an | find ":8000" | find "LISTENING" >nul
if %errorlevel%==0 (
    echo ✓ Bot está rodando na porta 8000
    set BOT_OK=1
) else (
    echo ⚠ Bot não está rodando na porta 8000
    set BOT_OK=0
)

echo.

if %DASHBOARD_OK%==0 (
    echo.
    echo ⚠ AVISO: Dashboard não está rodando!
    echo.
    echo Deseja iniciar os servidores agora? (S/N)
    choice /c SN /n /m "Resposta: "
    if errorlevel 2 goto :open_anyway
    if errorlevel 1 goto :start_servers
) else (
    goto :open_dashboard
)

:start_servers
echo.
echo Iniciando servidores...
start "Iniciar Sistema Completo" cmd /k "%~dp0iniciar_tudo.bat"
echo.
echo Aguardando 15 segundos para os servidores iniciarem...
timeout /t 15 /nobreak
goto :open_dashboard

:open_anyway
echo.
echo Tentando abrir mesmo assim...

:open_dashboard
echo.
echo ╔══════════════════════════════════════════════════════════════════════╗
echo ║                                                                      ║
echo ║          🌐 Abrindo Painel no Navegador                             ║
echo ║                                                                      ║
echo ╚══════════════════════════════════════════════════════════════════════╝
echo.

echo Abrindo URLs:
echo.
echo • Dashboard: http://localhost:3000
start http://localhost:3000
timeout /t 2 /nobreak >nul

if %API_OK%==1 (
    echo • API Health: http://localhost:3001/health
    start http://localhost:3001/health
    timeout /t 2 /nobreak >nul
)

if %BOT_OK%==1 (
    echo • Bot Docs: http://localhost:8000/docs
    start http://localhost:8000/docs
)

echo.
echo ✅ Painel administrativo aberto no navegador!
echo.
echo URLs disponíveis:
echo   • Dashboard: http://localhost:3000
echo   • API: http://localhost:3001
echo   • Bot: http://localhost:8000
echo   • Bot Docs: http://localhost:8000/docs
echo.

pause
