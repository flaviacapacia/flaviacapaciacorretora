@echo off
chcp 65001 > nul
title Parando Todos os Servidores - Bot Google Ads

echo.
echo ╔══════════════════════════════════════════════════════════════════════╗
echo ║                                                                      ║
echo ║          🛑 Parando Todos os Servidores                             ║
echo ║                                                                      ║
echo ╚══════════════════════════════════════════════════════════════════════╝
echo.

echo Procurando processos Node.js e Python nas portas 3000, 3001 e 8000...
echo.

:: Parar processo na porta 3000 (Dashboard)
echo ▶ Parando Dashboard (porta 3000)...
for /f "tokens=5" %%a in ('netstat -ano ^| find ":3000" ^| find "LISTENING"') do (
    echo   Matando processo %%a
    taskkill /PID %%a /F >nul 2>&1
)

:: Parar processo na porta 3001 (API)
echo ▶ Parando API (porta 3001)...
for /f "tokens=5" %%a in ('netstat -ano ^| find ":3001" ^| find "LISTENING"') do (
    echo   Matando processo %%a
    taskkill /PID %%a /F >nul 2>&1
)

:: Parar processo na porta 8000 (Bot)
echo ▶ Parando Bot (porta 8000)...
for /f "tokens=5" %%a in ('netstat -ano ^| find ":8000" ^| find "LISTENING"') do (
    echo   Matando processo %%a
    taskkill /PID %%a /F >nul 2>&1
)

echo.
echo ▶ Parando processos Node.js restantes...
taskkill /IM node.exe /F >nul 2>&1

echo ▶ Parando processos Python restantes...
taskkill /IM python.exe /F >nul 2>&1
taskkill /IM pythonw.exe /F >nul 2>&1

echo.
echo ╔══════════════════════════════════════════════════════════════════════╗
echo ║                                                                      ║
echo ║          ✅ Todos os servidores foram parados!                      ║
echo ║                                                                      ║
echo ╚══════════════════════════════════════════════════════════════════════╝
echo.

echo Verificando portas...
echo.

netstat -an | find ":3000" | find "LISTENING" >nul
if %errorlevel%==0 (
    echo ⚠ Porta 3000 ainda está em uso
) else (
    echo ✓ Porta 3000 liberada
)

netstat -an | find ":3001" | find "LISTENING" >nul
if %errorlevel%==0 (
    echo ⚠ Porta 3001 ainda está em uso
) else (
    echo ✓ Porta 3001 liberada
)

netstat -an | find ":8000" | find "LISTENING" >nul
if %errorlevel%==0 (
    echo ⚠ Porta 8000 ainda está em uso
) else (
    echo ✓ Porta 8000 liberada
)

echo.
pause
