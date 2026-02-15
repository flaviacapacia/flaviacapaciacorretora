@echo off
chcp 65001 > nul
title Remover Atalhos da Área de Trabalho - Bot Google Ads

echo.
echo ╔══════════════════════════════════════════════════════════════════════╗
echo ║                                                                      ║
echo ║          🗑️  Remover Atalhos da Área de Trabalho                    ║
echo ║                                                                      ║
echo ╚══════════════════════════════════════════════════════════════════════╝
echo.

set DESKTOP=%USERPROFILE%\Desktop

echo Este script removerá os atalhos do Bot Google Ads da sua Área de Trabalho.
echo.
echo Atalhos que serão removidos:
echo   • 🤖 Bot Google Ads - Menu.lnk
echo   • 🚀 Iniciar Bot Google Ads.lnk
echo   • 📊 Painel Admin Bot.lnk
echo   • 🛑 Parar Bot Google Ads.lnk
echo   • 📚 Documentação Bot.lnk
echo   • 🎨 Botões Bot Google Ads.lnk
echo.
echo Deseja continuar? (S/N)
choice /c SN /n /m "Resposta: "
if errorlevel 2 goto :cancel
if errorlevel 1 goto :remove

:remove
echo.
echo ▶ Removendo atalhos...
echo.

del "%DESKTOP%\🤖 Bot Google Ads - Menu.lnk" 2>nul
if exist "%DESKTOP%\Bot Google Ads - Menu.lnk" del "%DESKTOP%\Bot Google Ads - Menu.lnk" 2>nul
echo   ✓ Menu removido

del "%DESKTOP%\🚀 Iniciar Bot Google Ads.lnk" 2>nul
if exist "%DESKTOP%\Iniciar Bot Google Ads.lnk" del "%DESKTOP%\Iniciar Bot Google Ads.lnk" 2>nul
echo   ✓ Iniciar removido

del "%DESKTOP%\📊 Painel Admin Bot.lnk" 2>nul
if exist "%DESKTOP%\Painel Admin Bot.lnk" del "%DESKTOP%\Painel Admin Bot.lnk" 2>nul
echo   ✓ Admin removido

del "%DESKTOP%\🛑 Parar Bot Google Ads.lnk" 2>nul
if exist "%DESKTOP%\Parar Bot Google Ads.lnk" del "%DESKTOP%\Parar Bot Google Ads.lnk" 2>nul
echo   ✓ Parar removido

del "%DESKTOP%\📚 Documentação Bot.lnk" 2>nul
if exist "%DESKTOP%\Documentação Bot.lnk" del "%DESKTOP%\Documentação Bot.lnk" 2>nul
echo   ✓ Documentação removida

del "%DESKTOP%\🎨 Botões Bot Google Ads.lnk" 2>nul
if exist "%DESKTOP%\Botões Bot Google Ads.lnk" del "%DESKTOP%\Botões Bot Google Ads.lnk" 2>nul
echo   ✓ Botões removidos

echo.
echo ✅ Atalhos removidos com sucesso!
echo.
goto :end

:cancel
echo.
echo ❌ Operação cancelada.
echo.

:end
pause
