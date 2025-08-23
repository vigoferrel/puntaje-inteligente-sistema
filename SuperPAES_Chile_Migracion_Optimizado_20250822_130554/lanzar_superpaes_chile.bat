@echo off
echo ========================================
echo    SUPERPAES CHILE - SISTEMA COMPLETO
echo ========================================
echo.
echo Iniciando servicios...
echo.

REM Verificar si los puertos están libres
echo Verificando puertos...
netstat -ano | findstr ":3000" >nul
if %errorlevel% equ 0 (
    echo [ERROR] Puerto 3000 ya está en uso
    pause
    exit /b 1
)

netstat -ano | findstr ":5000" >nul
if %errorlevel% equ 0 (
    echo [ERROR] Puerto 5000 ya está en uso
    pause
    exit /b 1
)

echo [OK] Puertos libres
echo.

REM Iniciar backend en una nueva ventana
echo Iniciando Backend (Puerto 5000)...
start "SuperPAES Backend" cmd /k "cd /d %~dp0backend && python app_simple.py"

REM Esperar un momento para que el backend inicie
timeout /t 3 /nobreak >nul

REM Iniciar frontend en una nueva ventana
echo Iniciando Frontend (Puerto 3000)...
start "SuperPAES Frontend" cmd /k "cd /d %~dp0src && npm run dev"

REM Esperar un momento para que el frontend inicie
timeout /t 5 /nobreak >nul

echo.
echo ========================================
echo    SUPERPAES CHILE - LISTO
echo ========================================
echo.
echo Frontend: http://localhost:3000
echo Backend:  http://localhost:5000
echo Health:   http://localhost:5000/api/health
echo.
echo Presiona cualquier tecla para abrir el navegador...
pause >nul

REM Abrir navegador
start http://localhost:3000

echo.
echo Sistema iniciado correctamente!
echo Para detener los servicios, cierra las ventanas de comandos.
echo.
pause
