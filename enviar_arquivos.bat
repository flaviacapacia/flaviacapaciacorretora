@echo off
chcp 65001 >nul
setlocal enabledelayedexpansion

REM =============================================================================
REM Script: Enviar Arquivos para Novo Repositório
REM Descrição: Copia arquivos do bot-google-ads para o novo repositório
REM Uso: enviar_arquivos.bat
REM =============================================================================

cls
echo.
echo ╔══════════════════════════════════════════════════════════════════════╗
echo ║                                                                      ║
echo ║          📤 Enviar Arquivos para Novo Repositório                   ║
echo ║                                                                      ║
echo ╚══════════════════════════════════════════════════════════════════════╝
echo.

REM Configurações
set "REPO_ATUAL=%CD%"
set "NOVO_REPO_URL=https://github.com/flaviacapacia/bot-google-ads-ia.git"
set "PASTA_BOT=bot-google-ads"
set "DESTINO=%TEMP%\bot-google-ads-ia-temp"

REM Verificar se a pasta bot-google-ads existe
echo ▶ Verificando pasta bot-google-ads...
if not exist "%PASTA_BOT%" (
    echo ✗ Pasta bot-google-ads não encontrada!
    echo ℹ Certifique-se de executar este script na raiz do repositório.
    pause
    exit /b 1
)
echo ✓ Pasta encontrada!
echo.

REM Verificar se Git está instalado
echo ▶ Verificando Git...
where git >nul 2>nul
if errorlevel 1 (
    echo ✗ Git não está instalado!
    echo ℹ Baixe em: https://git-scm.com/download/win
    pause
    exit /b 1
)
echo ✓ Git instalado!
echo.

REM Exibir informações
echo Configurações:
echo   Repositório atual: %REPO_ATUAL%
echo   Pasta origem: %PASTA_BOT%
echo   Novo repositório: %NOVO_REPO_URL%
echo   Destino temporário: %DESTINO%
echo.

REM Perguntar confirmação
set /p "confirma=Deseja continuar? (s/N): "
if /i not "%confirma%"=="s" if /i not "%confirma%"=="S" (
    echo ⚠ Operação cancelada.
    pause
    exit /b 0
)

echo.
echo ▶ Iniciando processo...
echo.

REM Passo 1: Limpar diretório temporário se existir
echo ▶ Passo 1: Limpando diretório temporário...
if exist "%DESTINO%" (
    rmdir /s /q "%DESTINO%"
    echo ✓ Diretório temporário removido
)

REM Passo 2: Clonar o novo repositório
echo ▶ Passo 2: Clonando novo repositório...
echo ℹ Isso pode levar alguns segundos...
git clone "%NOVO_REPO_URL%" "%DESTINO%" 2>nul
if errorlevel 1 (
    echo ✗ Erro ao clonar repositório.
    echo ℹ Verifique se você tem acesso ao repositório: %NOVO_REPO_URL%
    echo ℹ Você pode precisar configurar suas credenciais Git.
    pause
    exit /b 1
)
echo ✓ Repositório clonado com sucesso!

REM Passo 3: Copiar arquivos
echo ▶ Passo 3: Copiando arquivos do bot-google-ads...
xcopy /E /I /Y "%PASTA_BOT%\*" "%DESTINO%\" >nul 2>nul
if exist "%PASTA_BOT%\.env.example" copy /Y "%PASTA_BOT%\.env.example" "%DESTINO%\" >nul 2>nul
if exist "%PASTA_BOT%\.gitignore" copy /Y "%PASTA_BOT%\.gitignore" "%DESTINO%\" >nul 2>nul
echo ✓ Arquivos copiados!

REM Contar arquivos
for /f %%a in ('dir /b /s /a-d "%DESTINO%" ^| find /c /v ""') do set NUM_ARQUIVOS=%%a
echo ℹ Total de arquivos: %NUM_ARQUIVOS%

REM Passo 4: Adicionar arquivos ao Git
echo ▶ Passo 4: Adicionando arquivos ao Git...
cd /d "%DESTINO%"
git add .
echo ✓ Arquivos adicionados ao staging!
echo.
echo ℹ Arquivos a serem commitados:
git status --short
echo.

REM Passo 5: Criar commit
echo ▶ Passo 5: Criando commit...
git commit -m "Add complete bot-google-ads project files" -m "- Node.js API with Express" -m "- Python bot with FastAPI and Mistral AI" -m "- React dashboard with Tailwind CSS" -m "- SQL Server database scripts" -m "- Docker Compose setup" -m "- Complete documentation in Portuguese" -m "- All configuration files and examples"
echo ✓ Commit criado!
echo.

REM Instruções finais
echo ╔══════════════════════════════════════════════════════════════════════╗
echo ║                                                                      ║
echo ║                    ✓ PREPARAÇÃO CONCLUÍDA!                          ║
echo ║                                                                      ║
echo ╚══════════════════════════════════════════════════════════════════════╝
echo.
echo ✓ Todos os arquivos foram preparados e commitados localmente!
echo.
echo ⚠ PRÓXIMO PASSO FINAL:
echo.
echo Execute os comandos abaixo para enviar ao GitHub:
echo.
echo cd %DESTINO%
echo git push -u origin main
echo.
echo ℹ Ou, se você estiver usando 'master' como branch principal:
echo git push -u origin master
echo.
echo ⚠ IMPORTANTE:
echo   • Você precisará das suas credenciais GitHub
echo   • Se for repositório privado, configure um Personal Access Token
echo   • Depois do push, os arquivos estarão no GitHub!
echo.

REM Perguntar se quer fazer push agora
set /p "push_agora=Deseja tentar fazer o push agora? (s/N): "
if /i "%push_agora%"=="s" (
    echo.
    echo ▶ Tentando fazer push...
    
    REM Verificar branch
    for /f "tokens=*" %%b in ('git branch --show-current') do set BRANCH=%%b
    echo ℹ Branch atual: !BRANCH!
    
    git push -u origin !BRANCH!
    if errorlevel 1 (
        echo.
        echo ✗ Erro ao fazer push.
        echo ℹ Você pode tentar manualmente com:
        echo cd %DESTINO%
        echo git push -u origin !BRANCH!
    ) else (
        echo.
        echo ✓ 🎉 Push realizado com sucesso!
        echo ✓ Arquivos enviados para: %NOVO_REPO_URL%
        echo.
        echo ℹ Acesse: https://github.com/flaviacapacia/bot-google-ads-ia
    )
) else (
    echo ℹ Você pode fazer o push manualmente quando quiser.
)

echo.
echo ▶ Localização dos arquivos preparados:
echo   %DESTINO%
echo.

REM Perguntar se quer abrir o diretório
set /p "abrir_dir=Deseja abrir o diretório no Explorer? (s/N): "
if /i "%abrir_dir%"=="s" (
    explorer "%DESTINO%"
)

REM Salvar comandos em arquivo
echo.
echo ▶ Salvando comandos em arquivo de texto...
set "COMANDOS_FILE=%DESTINO%\COMANDOS_PUSH.txt"
(
    echo COMANDOS PARA FAZER PUSH
    echo ========================
    echo.
    echo 1. Abra o terminal/prompt neste diretório:
    echo    %DESTINO%
    echo.
    echo 2. Execute o comando:
    echo    git push -u origin main
    echo.
    echo    Ou se usar master:
    echo    git push -u origin master
    echo.
    echo 3. Digite suas credenciais do GitHub quando solicitado
    echo.
    echo 4. Pronto! Acesse: https://github.com/flaviacapacia/bot-google-ads-ia
) > "%COMANDOS_FILE%"
echo ✓ Comandos salvos em: COMANDOS_PUSH.txt
echo.

echo ✓ ✨ Processo concluído!
echo.
pause
