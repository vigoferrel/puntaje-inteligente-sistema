@echo off
chcp 65001 >nul
setlocal enabledelayedexpansion

echo.
echo ========================================
echo 🚀 SUPERPAES CHILE - SISTEMA INTEGRADO
echo ========================================
echo.

:: ========================================
:: LIMPIEZA DE PUERTOS Y PROCESOS
:: ========================================
echo 🔧 Limpiando puertos y procesos anteriores...

:: Matar procesos en puerto 3000
for /f "tokens=5" %%a in ('netstat -aon ^| findstr :3000') do (
    echo Deteniendo proceso en puerto 3000: %%a
    taskkill /f /pid %%a >nul 2>&1
)

:: Matar procesos en puerto 3001
for /f "tokens=5" %%a in ('netstat -aon ^| findstr :3001') do (
    echo Deteniendo proceso en puerto 3001: %%a
    taskkill /f /pid %%a >nul 2>&1
)

:: Matar procesos en puerto 5000
for /f "tokens=5" %%a in ('netstat -aon ^| findstr :5000') do (
    echo Deteniendo proceso en puerto 5000: %%a
    taskkill /f /pid %%a >nul 2>&1
)

:: Matar procesos Python
echo Deteniendo procesos Python...
taskkill /f /im python.exe >nul 2>&1
taskkill /f /im pythonw.exe >nul 2>&1

:: Matar procesos Node
echo Deteniendo procesos Node...
taskkill /f /im node.exe >nul 2>&1

:: Esperar un momento para que se liberen los puertos
timeout /t 3 /nobreak >nul

:: ========================================
:: VERIFICACIÓN DE DEPENDENCIAS
:: ========================================
echo.
echo 📦 Verificando dependencias...

:: Verificar si existe el entorno virtual
if not exist ".venv\Scripts\activate.bat" (
    echo ❌ Entorno virtual no encontrado. Creando...
    python -m venv .venv
)

:: Activar entorno virtual
echo ✅ Activando entorno virtual...
call .venv\Scripts\activate.bat

:: Instalar dependencias Python si es necesario
if not exist "backend\requirements.txt" (
    echo ❌ requirements.txt no encontrado
    goto :error
)

echo 📥 Instalando dependencias Python...
pip install -r backend\requirements.txt

:: Verificar dependencias Node
if not exist "package.json" (
    echo ❌ package.json no encontrado
    goto :error
)

echo 📥 Instalando dependencias Node...
npm install

:: ========================================
:: DESPLIEGUE DEL SISTEMA
:: ========================================
echo.
echo 🚀 Desplegando SuperPAES Chile...

:: Iniciar backend en una nueva ventana
echo 🌐 Iniciando Backend (Puerto 5000)...
start "SuperPAES Backend" cmd /k "cd /d %CD% && call .venv\Scripts\activate.bat && cd backend && python app_simple.py"

:: Esperar a que el backend esté listo
echo ⏳ Esperando que el backend esté listo...
:wait_backend
timeout /t 2 /nobreak >nul
netstat -an | findstr :5000 >nul
if errorlevel 1 (
    echo ⏳ Backend aún iniciando...
    goto :wait_backend
)
echo ✅ Backend iniciado correctamente

:: Iniciar frontend en una nueva ventana
echo 🎨 Iniciando Frontend (Puerto 3000)...
start "SuperPAES Frontend" cmd /k "cd /d %CD% && npm run dev"

:: Esperar a que el frontend esté listo
echo ⏳ Esperando que el frontend esté listo...
:wait_frontend
timeout /t 2 /nobreak >nul
netstat -an | findstr :3000 >nul
if errorlevel 1 (
    netstat -an | findstr :3001 >nul
    if errorlevel 1 (
        echo ⏳ Frontend aún iniciando...
        goto :wait_frontend
    )
)
echo ✅ Frontend iniciado correctamente

:: ========================================
:: VERIFICACIÓN DEL SISTEMA
:: ========================================
echo.
echo 🔍 Verificando sistema...

:: Verificar backend
echo 📊 Probando API del backend...
curl -s http://localhost:5000/api/health >nul
if errorlevel 1 (
    echo ❌ Error: Backend no responde
    goto :error
)
echo ✅ Backend funcionando correctamente

:: Verificar frontend
echo 🌐 Probando frontend...
if exist "curl.exe" (
    curl -s http://localhost:3000 >nul 2>&1
    if errorlevel 1 (
        curl -s http://localhost:3001 >nul 2>&1
        if errorlevel 1 (
            echo ❌ Error: Frontend no responde
            goto :error
        )
    )
)
echo ✅ Frontend funcionando correctamente

:: ========================================
:: APERTURA DEL NAVEGADOR
:: ========================================
echo.
echo 🌍 Abriendo navegador...
timeout /t 2 /nobreak >nul

:: Intentar abrir en puerto 3000, si no funciona, en 3001
start http://localhost:3000
timeout /t 1 /nobreak >nul
netstat -an | findstr :3000 >nul
if errorlevel 1 (
    start http://localhost:3001
)

:: ========================================
:: MONITOREO DEL SISTEMA
:: ========================================
echo.
echo ========================================
echo 🎉 SUPERPAES CHILE DESPLEGADO EXITOSAMENTE
echo ========================================
echo.
echo 📍 URLs del sistema:
echo    🌐 Frontend: http://localhost:3000 (o 3001)
echo    🔧 Backend:  http://localhost:5000
echo    📊 Health:   http://localhost:5000/api/health
echo.
echo 📋 Comandos útiles:
echo    🔍 Ver logs: tasklist /fi "imagename eq python.exe"
echo    🛑 Detener:  taskkill /f /im python.exe
echo    🔄 Reiniciar: Ejecutar este script nuevamente
echo.
echo ⚠️  Para detener el sistema, cierra las ventanas de comandos
echo    o ejecuta: taskkill /f /im python.exe
echo.

:: Mantener la ventana abierta
pause
goto :end

:error
echo.
echo ❌ ERROR: No se pudo desplegar el sistema correctamente
echo.
echo 🔧 Soluciones posibles:
echo    1. Verificar que Python esté instalado
echo    2. Verificar que Node.js esté instalado
echo    3. Verificar que los puertos 3000 y 5000 estén libres
echo    4. Ejecutar como administrador si hay problemas de permisos
echo.
pause
exit /b 1

:end
echo.
echo ✅ Script completado
exit /b 0
