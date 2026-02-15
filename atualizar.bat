@echo off
chcp 65001 > nul
setlocal enabledelayedexpansion

REM Script para baixar/atualizar o projeto Bot Google Ads
REM Execute este script no Windows para atualizar o projeto automaticamente

echo ╔══════════════════════════════════════════════════════════════════════╗
echo ║                                                                      ║
echo ║           📥 Atualizando Projeto - Flávia Capacia                   ║
echo ║                                                                      ║
echo ╚══════════════════════════════════════════════════════════════════════╝
echo.

REM Verificar se estamos em um repositório git
if not exist .git (
    echo ❌ Erro: Esta pasta não é um repositório git
    echo.
    echo Se é a primeira vez, clone o repositório:
    echo git clone https://github.com/flaviacapacia/flaviacapaciacorretora.git
    pause
    exit /b 1
)

echo 📍 Pasta atual: %CD%
echo.

REM Verificar branch atual
for /f "tokens=*" %%i in ('git branch --show-current') do set current_branch=%%i
echo 📌 Branch atual: %current_branch%
echo.

REM Verificar se está na branch correta
if not "%current_branch%"=="copilot/create-ads-generation-bot" (
    echo ⚠️  Você não está na branch do Bot Google Ads
    echo.
    set /p change_branch="Deseja mudar para copilot/create-ads-generation-bot? (S/N): "
    if /i "!change_branch!"=="S" (
        echo 🔄 Mudando para branch copilot/create-ads-generation-bot...
        git checkout copilot/create-ads-generation-bot
        if errorlevel 1 (
            echo ❌ Erro ao mudar de branch
            pause
            exit /b 1
        )
        echo ✅ Branch alterada com sucesso
        echo.
    )
)

REM Verificar se há mudanças locais
git status --porcelain > nul 2>&1
if errorlevel 1 (
    echo ⚠️  Você tem mudanças locais não commitadas
    echo.
    git status --short
    echo.
    set /p save_changes="Deseja salvar suas mudanças temporariamente? (S/N): "
    if /i "!save_changes!"=="S" (
        echo 💾 Salvando mudanças locais...
        git stash
        if errorlevel 1 (
            echo ❌ Erro ao salvar mudanças
            pause
            exit /b 1
        )
        echo ✅ Mudanças salvas temporariamente
        echo.
        set stashed=true
    ) else (
        set /p discard_changes="Deseja descartar suas mudanças? (S/N): "
        if /i "!discard_changes!"=="S" (
            echo 🗑️  Descartando mudanças locais...
            git reset --hard
            git clean -fd
            echo ✅ Mudanças descartadas
            echo.
        ) else (
            echo ❌ Operação cancelada
            echo Resolva as mudanças locais antes de continuar
            pause
            exit /b 1
        )
    )
)

REM Fazer fetch
echo 🔄 Buscando atualizações do GitHub...
git fetch origin
if errorlevel 1 (
    echo ❌ Erro ao buscar atualizações
    pause
    exit /b 1
)
echo ✅ Atualizações buscadas
echo.

REM Fazer pull
echo ⬇️  Baixando atualizações...
git pull origin copilot/create-ads-generation-bot
if errorlevel 1 (
    echo ❌ Erro ao fazer pull
    pause
    exit /b 1
)
echo ✅ Projeto atualizado com sucesso!
echo.

REM Restaurar mudanças se foram salvas
if "!stashed!"=="true" (
    echo ♻️  Restaurando suas mudanças locais...
    git stash pop
    if errorlevel 1 (
        echo ⚠️  Houve conflitos ao restaurar suas mudanças
        echo Resolva os conflitos manualmente
    ) else (
        echo ✅ Mudanças restauradas
    )
    echo.
)

REM Mostrar últimos commits
echo 📝 Últimas atualizações:
echo.
git log --oneline -5
echo.

REM Informações adicionais
echo ══════════════════════════════════════════════════════════════════════
echo.
echo 🎉 Projeto atualizado com sucesso!
echo.
echo 📂 Arquivos importantes:
echo    • bot-google-ads\README.md         - Documentação principal
echo    • bot-google-ads\GUIA_DE_USO.md   - Tutorial completo
echo    • bot-google-ads\ARQUITETURA.md   - Detalhes técnicos
echo.
echo 🚀 Para iniciar o Bot Google Ads:
echo    cd bot-google-ads
echo    start.sh (ou docker-compose up -d)
echo.
echo ══════════════════════════════════════════════════════════════════════
echo.
pause
