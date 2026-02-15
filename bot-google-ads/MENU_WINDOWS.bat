@echo off
chcp 65001 > nul
title Menu Principal - Bot Google Ads IA

:menu
cls
echo.
echo ╔══════════════════════════════════════════════════════════════════════╗
echo ║                                                                      ║
echo ║          🤖 BOT GOOGLE ADS COM IA - MENU PRINCIPAL                  ║
echo ║                                                                      ║
echo ╚══════════════════════════════════════════════════════════════════════╝
echo.
echo   Escolha uma opção:
echo.
echo   ╔═══════════════════════════════════════════════════════════════════╗
echo   ║                                                                   ║
echo   ║   1. 🚀 Iniciar Sistema Completo (Tudo de uma vez)               ║
echo   ║                                                                   ║
echo   ║   2. 📊 Abrir Painel Administrativo (Dashboard)                  ║
echo   ║                                                                   ║
echo   ║   3. 🤖 Iniciar apenas Bot Python                                ║
echo   ║                                                                   ║
echo   ║   4. 🌐 Iniciar apenas API Node.js                               ║
echo   ║                                                                   ║
echo   ║   5. ⚛️  Iniciar apenas Dashboard React                          ║
echo   ║                                                                   ║
echo   ║   6. 🛑 Parar Todos os Servidores                                ║
echo   ║                                                                   ║
echo   ║   7. 📚 Abrir Documentação                                       ║
echo   ║                                                                   ║
echo   ║   8. ⚙️  Configurações (editar .env)                             ║
echo   ║                                                                   ║
echo   ║   9. ℹ️  Informações do Sistema                                  ║
echo   ║                                                                   ║
echo   ║   0. ❌ Sair                                                      ║
echo   ║                                                                   ║
echo   ╚═══════════════════════════════════════════════════════════════════╝
echo.
choice /c 1234567890 /n /m "Digite sua escolha: "

if errorlevel 10 goto :exit
if errorlevel 9 goto :info
if errorlevel 8 goto :config
if errorlevel 7 goto :docs
if errorlevel 6 goto :stop
if errorlevel 5 goto :dashboard
if errorlevel 4 goto :api
if errorlevel 3 goto :bot
if errorlevel 2 goto :admin
if errorlevel 1 goto :all

:all
cls
echo.
echo Iniciando sistema completo...
call "%~dp0iniciar_tudo.bat"
goto :menu

:admin
cls
echo.
echo Abrindo painel administrativo...
call "%~dp0abrir_admin.bat"
goto :menu

:bot
cls
echo.
echo Iniciando Bot Python...
call "%~dp0iniciar_bot.bat"
goto :menu

:api
cls
echo.
echo Iniciando API Node.js...
call "%~dp0iniciar_api.bat"
goto :menu

:dashboard
cls
echo.
echo Iniciando Dashboard React...
call "%~dp0iniciar_dashboard.bat"
goto :menu

:stop
cls
echo.
echo Parando todos os servidores...
call "%~dp0parar_tudo.bat"
goto :menu

:docs
cls
echo.
echo ╔══════════════════════════════════════════════════════════════════════╗
echo ║                                                                      ║
echo ║          📚 Documentação Disponível                                 ║
echo ║                                                                      ║
echo ╚══════════════════════════════════════════════════════════════════════╝
echo.
echo Abrindo documentação no navegador...
echo.
start README.md
start GUIA_DE_USO.md
start ARQUITETURA.md
echo.
echo ✓ Arquivos de documentação abertos
echo.
pause
goto :menu

:config
cls
echo.
echo ╔══════════════════════════════════════════════════════════════════════╗
echo ║                                                                      ║
echo ║          ⚙️  Configurações                                          ║
echo ║                                                                      ║
echo ╚══════════════════════════════════════════════════════════════════════╝
echo.
echo Escolha qual configuração editar:
echo.
echo   1. API (.env)
echo   2. Bot (.env)
echo   3. Dashboard (.env)
echo   4. Voltar ao menu
echo.
choice /c 1234 /n /m "Escolha: "

if errorlevel 4 goto :menu
if errorlevel 3 (
    if exist "%~dp0dashboard\.env" (
        notepad "%~dp0dashboard\.env"
    ) else (
        echo Arquivo não existe. Criando...
        copy "%~dp0dashboard\.env.example" "%~dp0dashboard\.env"
        notepad "%~dp0dashboard\.env"
    )
    goto :config
)
if errorlevel 2 (
    if exist "%~dp0bot\.env" (
        notepad "%~dp0bot\.env"
    ) else (
        echo Arquivo não existe. Criando...
        copy "%~dp0bot\.env.example" "%~dp0bot\.env"
        notepad "%~dp0bot\.env"
    )
    goto :config
)
if errorlevel 1 (
    if exist "%~dp0api\.env" (
        notepad "%~dp0api\.env"
    ) else (
        echo Arquivo não existe. Criando...
        copy "%~dp0api\.env.example" "%~dp0api\.env"
        notepad "%~dp0api\.env"
    )
    goto :config
)

:info
cls
echo.
echo ╔══════════════════════════════════════════════════════════════════════╗
echo ║                                                                      ║
echo ║          ℹ️  Informações do Sistema                                 ║
echo ║                                                                      ║
echo ╚══════════════════════════════════════════════════════════════════════╝
echo.

echo ▶ Versões Instaladas:
echo.
where node >nul 2>&1
if %errorlevel%==0 (
    echo   Node.js:
    node --version
) else (
    echo   Node.js: ❌ Não instalado
)

where python >nul 2>&1
if %errorlevel%==0 (
    echo   Python:
    python --version
) else (
    echo   Python: ❌ Não instalado
)

where docker >nul 2>&1
if %errorlevel%==0 (
    echo   Docker:
    docker --version
) else (
    echo   Docker: ❌ Não instalado
)

echo.
echo ▶ Status dos Servidores:
echo.

netstat -an | find ":3000" | find "LISTENING" >nul
if %errorlevel%==0 (
    echo   • Dashboard (3000): 🟢 Rodando
) else (
    echo   • Dashboard (3000): 🔴 Parado
)

netstat -an | find ":3001" | find "LISTENING" >nul
if %errorlevel%==0 (
    echo   • API (3001): 🟢 Rodando
) else (
    echo   • API (3001): 🔴 Parado
)

netstat -an | find ":8000" | find "LISTENING" >nul
if %errorlevel%==0 (
    echo   • Bot (8000): 🟢 Rodando
) else (
    echo   • Bot (8000): 🔴 Parado
)

echo.
echo ▶ URLs:
echo.
echo   • Dashboard: http://localhost:3000
echo   • API: http://localhost:3001
echo   • Bot: http://localhost:8000
echo   • Bot Docs: http://localhost:8000/docs
echo.
echo ▶ Repositório:
echo   https://github.com/flaviacapacia/bot-google-ads-ia
echo.

pause
goto :menu

:exit
cls
echo.
echo ╔══════════════════════════════════════════════════════════════════════╗
echo ║                                                                      ║
echo ║          👋 Obrigado por usar o Bot Google Ads IA!                  ║
echo ║                                                                      ║
echo ╚══════════════════════════════════════════════════════════════════════╝
echo.
timeout /t 2 /nobreak >nul
exit
