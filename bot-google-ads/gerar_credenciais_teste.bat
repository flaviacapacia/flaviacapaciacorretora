@echo off
chcp 65001 >nul
title Gerar Credenciais de Teste - Bot Google Ads

echo.
echo ╔══════════════════════════════════════════════════════════════════╗
echo ║                                                                  ║
echo ║     🔧 GERADOR DE CREDENCIAIS DE TESTE/SIMULAÇÃO                ║
echo ║                                                                  ║
echo ╚══════════════════════════════════════════════════════════════════╝
echo.
echo Este script cria credenciais FAKE para você TESTAR o bot agora,
echo sem precisar esperar pelas credenciais reais do Google.
echo.
echo ⚠️  IMPORTANTE: Estas credenciais NÃO publicam anúncios de verdade!
echo.
echo Pressione qualquer tecla para continuar...
pause >nul

echo.
echo Gerando credenciais de teste...
echo.

python gerar_credenciais_teste.py

if errorlevel 1 (
    echo.
    echo ❌ Erro ao gerar credenciais.
    echo Certifique-se de que Python está instalado.
    pause
    exit /b 1
)

echo.
echo ✅ Credenciais de simulação criadas com sucesso!
echo.
echo 📄 Leia o arquivo: CREDENCIAIS_SIMULACAO.txt
echo.
echo 🚀 Próximo passo:
echo    Inicie o bot para testar em modo simulação!
echo.
pause
