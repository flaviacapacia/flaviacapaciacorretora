@echo off
chcp 65001 >nul
setlocal EnableDelayedExpansion

:: ╔══════════════════════════════════════════════════════════════════════╗
:: ║                                                                      ║
:: ║     📤 Atualizar Scripts Windows no Novo Repositório               ║
:: ║                                                                      ║
:: ╚══════════════════════════════════════════════════════════════════════╝

echo.
echo ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
echo.
echo 📦 Este script vai copiar os novos scripts Windows para o
echo    repositório bot-google-ads-ia que você tem aberto no VS Code
echo.
echo ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
echo.

:: Perguntar o caminho do repositório
echo 📍 Onde está o repositório bot-google-ads-ia no seu PC?
echo.
echo Exemplos:
echo   C:\Users\SeuNome\Documents\bot-google-ads-ia
echo   C:\Users\SeuNome\Desktop\bot-google-ads-ia
echo   D:\projetos\bot-google-ads-ia
echo.
set /p REPO_PATH="Digite o caminho completo: "

:: Remover aspas se houver
set REPO_PATH=%REPO_PATH:"=%

:: Verificar se o caminho existe
if not exist "%REPO_PATH%" (
    echo.
    echo ❌ ERRO: Caminho não encontrado!
    echo    %REPO_PATH%
    echo.
    echo 💡 Dicas:
    echo    • Verifique se o caminho está correto
    echo    • Use Tab para autocompletar
    echo    • Copie e cole do Explorer
    echo.
    pause
    exit /b 1
)

:: Verificar se é um repositório
if not exist "%REPO_PATH%\.git" (
    echo.
    echo ⚠️  AVISO: Este não parece ser um repositório Git
    echo    Não encontrei a pasta .git em:
    echo    %REPO_PATH%
    echo.
    set /p CONTINUAR="Deseja continuar mesmo assim? (S/N): "
    if /i not "!CONTINUAR!"=="S" (
        echo.
        echo ❌ Operação cancelada pelo usuário
        pause
        exit /b 1
    )
)

echo.
echo ✓ Caminho confirmado: %REPO_PATH%
echo.

:: Contar arquivos a copiar
set COUNT=0

echo ▶ Preparando para copiar arquivos...
echo.

:: Lista de arquivos a copiar
set "FILES[0]=bot-google-ads\GUIA_WINDOWS.md"
set "FILES[1]=bot-google-ads\INICIAR.bat"
set "FILES[2]=bot-google-ads\MENU_WINDOWS.bat"
set "FILES[3]=bot-google-ads\abrir_admin.bat"
set "FILES[4]=bot-google-ads\botoes_windows.html"
set "FILES[5]=bot-google-ads\criar_atalhos.bat"
set "FILES[6]=bot-google-ads\remover_atalhos.bat"
set "FILES[7]=bot-google-ads\iniciar_api.bat"
set "FILES[8]=bot-google-ads\iniciar_bot.bat"
set "FILES[9]=bot-google-ads\iniciar_dashboard.bat"
set "FILES[10]=bot-google-ads\iniciar_tudo.bat"
set "FILES[11]=bot-google-ads\parar_tudo.bat"

:: Copiar arquivos
set COPIED=0
set FAILED=0

for /L %%i in (0,1,11) do (
    if defined FILES[%%i] (
        set "FILE=!FILES[%%i]!"
        set "FILENAME=!FILE:bot-google-ads\=!"
        
        if exist "!FILE!" (
            echo 📄 Copiando: !FILENAME!
            copy /Y "!FILE!" "%REPO_PATH%\" >nul 2>&1
            if !ERRORLEVEL! EQU 0 (
                set /a COPIED+=1
                echo    ✓ Copiado com sucesso
            ) else (
                set /a FAILED+=1
                echo    ❌ Falha ao copiar
            )
        ) else (
            echo ⚠️  Arquivo não encontrado: !FILENAME!
            set /a FAILED+=1
        )
        echo.
    )
)

:: Resumo
echo ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
echo.
echo 📊 RESUMO:
echo.
echo    ✓ Arquivos copiados: %COPIED%
if %FAILED% GTR 0 (
    echo    ❌ Falhas: %FAILED%
)
echo    📁 Destino: %REPO_PATH%
echo.

if %COPIED% GTR 0 (
    echo ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
    echo.
    echo ✅ SUCESSO! Arquivos copiados para o repositório!
    echo.
    echo 📋 PRÓXIMOS PASSOS:
    echo.
    echo    1. No VS Code, você verá os novos arquivos
    echo.
    echo    2. Adicione ao Git:
    echo       git add *.bat *.html GUIA_WINDOWS.md
    echo.
    echo    3. Faça commit:
    echo       git commit -m "Add Windows desktop scripts"
    echo.
    echo    4. Faça push:
    echo       git push
    echo.
    echo    5. Execute criar_atalhos.bat para criar atalhos na área de trabalho!
    echo.
    echo ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
    echo.
    
    :: Perguntar se quer abrir o repositório
    set /p ABRIR="Deseja abrir a pasta no Explorer? (S/N): "
    if /i "!ABRIR!"=="S" (
        start explorer "%REPO_PATH%"
    )
    
    :: Perguntar se quer criar atalhos agora
    echo.
    set /p CRIAR="Deseja executar criar_atalhos.bat agora? (S/N): "
    if /i "!CRIAR!"=="S" (
        cd /d "%REPO_PATH%"
        if exist "criar_atalhos.bat" (
            echo.
            echo ▶ Executando criar_atalhos.bat...
            echo.
            call criar_atalhos.bat
        ) else (
            echo ❌ Arquivo criar_atalhos.bat não encontrado!
        )
    )
) else (
    echo ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
    echo.
    echo ❌ ERRO: Nenhum arquivo foi copiado!
    echo.
    echo 💡 Verifique:
    echo    • Se você está executando do lugar correto
    echo    • Se os arquivos existem na pasta bot-google-ads
    echo    • Se tem permissão de escrita no destino
    echo.
)

echo.
pause
