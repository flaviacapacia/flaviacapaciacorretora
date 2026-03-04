@echo off
setlocal
set "FOUND=0"
for /f "tokens=5" %%P in ('netstat -ano ^| findstr /R /C:":8080 .*LISTENING"') do (
	set "FOUND=1"
	taskkill /F /PID %%P >nul 2>&1
	echo Processo %%P encerrado (porta 8080).
)

if "%FOUND%"=="0" (
	echo Nenhum CRM em execucao na porta 8080.
) else (
	echo CRM parado com sucesso.
)

exit /b 0
