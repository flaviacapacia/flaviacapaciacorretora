@echo off
cd /d "%~dp0"
set MISTRAL_API_KEY=1wnPs1Yp7PW0TI5gPHMghb5pNzXU2EQF
echo ====================================
echo  Testando Bot Google Ads
echo ====================================
echo.
echo Iniciando servidor na porta 8000...
echo Abra http://localhost:8000/docs para testar
echo.
python -m uvicorn src.main:app --reload --port 8000
pause
