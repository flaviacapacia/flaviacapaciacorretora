@echo off
chcp 65001 > nul
title Criar Atalhos na Área de Trabalho - Bot Google Ads

echo.
echo ╔══════════════════════════════════════════════════════════════════════╗
echo ║                                                                      ║
echo ║          📌 Criar Atalhos na Área de Trabalho                       ║
echo ║                                                                      ║
echo ╚══════════════════════════════════════════════════════════════════════╝
echo.

cd /d "%~dp0"

echo Este script criará atalhos na sua Área de Trabalho para:
echo.
echo   1. 🎯 Menu Principal
echo   2. 🚀 Iniciar Tudo
echo   3. 📊 Abrir Admin
echo   4. 🛑 Parar Tudo
echo   5. 📚 Documentação
echo.
echo Pressione qualquer tecla para continuar ou Ctrl+C para cancelar...
pause > nul

echo.
echo ▶ Criando atalhos...
echo.

:: Obter caminho da área de trabalho
set DESKTOP=%USERPROFILE%\Desktop

:: Criar atalho para Menu Principal
echo Set oWS = WScript.CreateObject("WScript.Shell") > "%TEMP%\CreateShortcut.vbs"
echo sLinkFile = "%DESKTOP%\🤖 Bot Google Ads - Menu.lnk" >> "%TEMP%\CreateShortcut.vbs"
echo Set oLink = oWS.CreateShortcut(sLinkFile) >> "%TEMP%\CreateShortcut.vbs"
echo oLink.TargetPath = "%~dp0MENU_WINDOWS.bat" >> "%TEMP%\CreateShortcut.vbs"
echo oLink.WorkingDirectory = "%~dp0" >> "%TEMP%\CreateShortcut.vbs"
echo oLink.Description = "Menu Principal do Bot Google Ads IA" >> "%TEMP%\CreateShortcut.vbs"
echo oLink.IconLocation = "shell32.dll,13" >> "%TEMP%\CreateShortcut.vbs"
echo oLink.Save >> "%TEMP%\CreateShortcut.vbs"
cscript /nologo "%TEMP%\CreateShortcut.vbs"
echo   ✓ Menu Principal

:: Criar atalho para Iniciar Tudo
echo Set oWS = WScript.CreateObject("WScript.Shell") > "%TEMP%\CreateShortcut.vbs"
echo sLinkFile = "%DESKTOP%\🚀 Iniciar Bot Google Ads.lnk" >> "%TEMP%\CreateShortcut.vbs"
echo Set oLink = oWS.CreateShortcut(sLinkFile) >> "%TEMP%\CreateShortcut.vbs"
echo oLink.TargetPath = "%~dp0iniciar_tudo.bat" >> "%TEMP%\CreateShortcut.vbs"
echo oLink.WorkingDirectory = "%~dp0" >> "%TEMP%\CreateShortcut.vbs"
echo oLink.Description = "Iniciar Sistema Completo do Bot Google Ads IA" >> "%TEMP%\CreateShortcut.vbs"
echo oLink.IconLocation = "shell32.dll,27" >> "%TEMP%\CreateShortcut.vbs"
echo oLink.Save >> "%TEMP%\CreateShortcut.vbs"
cscript /nologo "%TEMP%\CreateShortcut.vbs"
echo   ✓ Iniciar Tudo

:: Criar atalho para Abrir Admin
echo Set oWS = WScript.CreateObject("WScript.Shell") > "%TEMP%\CreateShortcut.vbs"
echo sLinkFile = "%DESKTOP%\📊 Painel Admin Bot.lnk" >> "%TEMP%\CreateShortcut.vbs"
echo Set oLink = oWS.CreateShortcut(sLinkFile) >> "%TEMP%\CreateShortcut.vbs"
echo oLink.TargetPath = "%~dp0abrir_admin.bat" >> "%TEMP%\CreateShortcut.vbs"
echo oLink.WorkingDirectory = "%~dp0" >> "%TEMP%\CreateShortcut.vbs"
echo oLink.Description = "Abrir Painel Administrativo no Navegador" >> "%TEMP%\CreateShortcut.vbs"
echo oLink.IconLocation = "shell32.dll,165" >> "%TEMP%\CreateShortcut.vbs"
echo oLink.Save >> "%TEMP%\CreateShortcut.vbs"
cscript /nologo "%TEMP%\CreateShortcut.vbs"
echo   ✓ Abrir Admin

:: Criar atalho para Parar Tudo
echo Set oWS = WScript.CreateObject("WScript.Shell") > "%TEMP%\CreateShortcut.vbs"
echo sLinkFile = "%DESKTOP%\🛑 Parar Bot Google Ads.lnk" >> "%TEMP%\CreateShortcut.vbs"
echo Set oLink = oWS.CreateShortcut(sLinkFile) >> "%TEMP%\CreateShortcut.vbs"
echo oLink.TargetPath = "%~dp0parar_tudo.bat" >> "%TEMP%\CreateShortcut.vbs"
echo oLink.WorkingDirectory = "%~dp0" >> "%TEMP%\CreateShortcut.vbs"
echo oLink.Description = "Parar Todos os Servidores do Bot" >> "%TEMP%\CreateShortcut.vbs"
echo oLink.IconLocation = "shell32.dll,131" >> "%TEMP%\CreateShortcut.vbs"
echo oLink.Save >> "%TEMP%\CreateShortcut.vbs"
cscript /nologo "%TEMP%\CreateShortcut.vbs"
echo   ✓ Parar Tudo

:: Criar atalho para Documentação
echo Set oWS = WScript.CreateObject("WScript.Shell") > "%TEMP%\CreateShortcut.vbs"
echo sLinkFile = "%DESKTOP%\📚 Documentação Bot.lnk" >> "%TEMP%\CreateShortcut.vbs"
echo Set oLink = oWS.CreateShortcut(sLinkFile) >> "%TEMP%\CreateShortcut.vbs"
echo oLink.TargetPath = "%~dp0README.md" >> "%TEMP%\CreateShortcut.vbs"
echo oLink.WorkingDirectory = "%~dp0" >> "%TEMP%\CreateShortcut.vbs"
echo oLink.Description = "Abrir Documentação do Bot Google Ads IA" >> "%TEMP%\CreateShortcut.vbs"
echo oLink.IconLocation = "shell32.dll,71" >> "%TEMP%\CreateShortcut.vbs"
echo oLink.Save >> "%TEMP%\CreateShortcut.vbs"
cscript /nologo "%TEMP%\CreateShortcut.vbs"
echo   ✓ Documentação

:: Criar atalho para Botões HTML
echo Set oWS = WScript.CreateObject("WScript.Shell") > "%TEMP%\CreateShortcut.vbs"
echo sLinkFile = "%DESKTOP%\🎨 Botões Bot Google Ads.lnk" >> "%TEMP%\CreateShortcut.vbs"
echo Set oLink = oWS.CreateShortcut(sLinkFile) >> "%TEMP%\CreateShortcut.vbs"
echo oLink.TargetPath = "%~dp0botoes_windows.html" >> "%TEMP%\CreateShortcut.vbs"
echo oLink.WorkingDirectory = "%~dp0" >> "%TEMP%\CreateShortcut.vbs"
echo oLink.Description = "Interface Visual com Botões" >> "%TEMP%\CreateShortcut.vbs"
echo oLink.IconLocation = "shell32.dll,14" >> "%TEMP%\CreateShortcut.vbs"
echo oLink.Save >> "%TEMP%\CreateShortcut.vbs"
cscript /nologo "%TEMP%\CreateShortcut.vbs"
echo   ✓ Botões HTML

:: Limpar arquivo temporário
del "%TEMP%\CreateShortcut.vbs" > nul 2>&1

echo.
echo ╔══════════════════════════════════════════════════════════════════════╗
echo ║                                                                      ║
echo ║          ✅ Atalhos criados com sucesso!                            ║
echo ║                                                                      ║
echo ╚══════════════════════════════════════════════════════════════════════╝
echo.

echo Os seguintes atalhos foram criados na sua Área de Trabalho:
echo.
echo   🤖 Bot Google Ads - Menu
echo   🚀 Iniciar Bot Google Ads
echo   📊 Painel Admin Bot
echo   🛑 Parar Bot Google Ads
echo   📚 Documentação Bot
echo   🎨 Botões Bot Google Ads
echo.
echo Agora você pode iniciar o bot diretamente da Área de Trabalho!
echo.
echo Deseja abrir a Área de Trabalho agora? (S/N)
choice /c SN /n /m "Resposta: "
if errorlevel 2 goto :end
if errorlevel 1 (
    start "" "%DESKTOP%"
)

:end
echo.
pause
