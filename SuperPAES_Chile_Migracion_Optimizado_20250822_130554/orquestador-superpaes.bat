@echo off
setlocal enabledelayedexpansion

REM ========================================
REM SUPERPAES CHILE - ORQUESTADOR BATCH
REM ========================================
REM Script orquestador para gestionar todo el sistema SuperPAES
REM Versión batch para usuarios que prefieren CMD

set "SCRIPT_DIR=%~dp0"
set "PROJECT_ROOT=%SCRIPT_DIR%"
set "LOG_FILE=%PROJECT_ROOT%logs\orquestador.log"
set "PID_FILE=%PROJECT_ROOT%logs\processes.pid"

REM Crear directorio de logs si no existe
if not exist "%PROJECT_ROOT%logs" mkdir "%PROJECT_ROOT%logs"

REM Función para logging
:log
echo [%date% %time%] %~1
echo [%date% %time%] %~1 >> "%LOG_FILE%"
goto :eof

REM Función para éxito
:success
call :log "SUCCESS: %~1"
echo %~1
goto :eof

REM Función para error
:error
call :log "ERROR: %~1"
echo ERROR: %~1
goto :eof

REM Función para advertencia
:warning
call :log "WARNING: %~1"
echo WARNING: %~1
goto :eof

REM Verificar dependencias
:check_dependencies
call :log "Verificando dependencias..."
node --version >nul 2>&1
if errorlevel 1 (
    call :error "Node.js no encontrado"
    exit /b 1
)
call :log "✓ Node.js encontrado"

npm --version >nul 2>&1
if errorlevel 1 (
    call :error "npm no encontrado"
    exit /b 1
)
call :log "✓ npm encontrado"

python --version >nul 2>&1
if errorlevel 1 (
    call :error "Python no encontrado"
    exit /b 1
)
call :log "✓ Python encontrado"

call :success "Todas las dependencias están instaladas"
exit /b 0

REM Activar CSS Global
:enable_global_css
call :log "Activando CSS Global..."
if not exist "%PROJECT_ROOT%src\styles\global.css" (
    call :error "Archivo CSS global no encontrado"
    exit /b 1
)
call :success "CSS Global activado correctamente"
exit /b 0

REM Verificar puertos
:check_ports
call :log "Verificando puertos disponibles..."
set "AVAILABLE_PORTS="
for %%p in (3000 3001 3002 5000 5001) do (
    netstat -an | find "%%p" | find "LISTENING" >nul
    if errorlevel 1 (
        set "AVAILABLE_PORTS=!AVAILABLE_PORTS! %%p"
        call :log "✓ Puerto %%p disponible"
    ) else (
        call :warning "✗ Puerto %%p ocupado"
    )
)
exit /b 0

REM Iniciar backend
:start_backend
call :log "Iniciando backend..."
cd /d "%PROJECT_ROOT%backend"
if not exist "app_simple.py" (
    if not exist "app.py" (
        if not exist "main.py" (
            call :error "No se encontró archivo principal del backend"
            exit /b 1
        ) else (
            set "BACKEND_FILE=main.py"
        )
    ) else (
        set "BACKEND_FILE=app.py"
    )
) else (
    set "BACKEND_FILE=app_simple.py"
)

start "SuperPAES Backend" cmd /c "python %BACKEND_FILE%"
call :log "Backend iniciado"
exit /b 0

REM Iniciar frontend
:start_frontend
call :log "Iniciando frontend..."
cd /d "%PROJECT_ROOT%"
if not exist "package.json" (
    call :error "package.json no encontrado"
    exit /b 1
)

start "SuperPAES Frontend" cmd /c "npm run dev"
call :log "Frontend iniciado"
exit /b 0

REM Detener todos los procesos
:stop_all
call :log "Deteniendo todos los procesos..."
taskkill /f /im node.exe >nul 2>&1
taskkill /f /im python.exe >nul 2>&1
call :success "Todos los procesos detenidos"
exit /b 0

REM Limpiar sistema
:clean_system
call :log "Limpiando sistema..."
if exist "%PROJECT_ROOT%node_modules\.cache" rmdir /s /q "%PROJECT_ROOT%node_modules\.cache"
if exist "%PROJECT_ROOT%dist" rmdir /s /q "%PROJECT_ROOT%dist"
if exist "%PROJECT_ROOT%build" rmdir /s /q "%PROJECT_ROOT%build"
if exist "%PROJECT_ROOT%.vite-quantum" rmdir /s /q "%PROJECT_ROOT%.vite-quantum"
call :success "Sistema limpiado"
exit /b 0

REM Mostrar estado
:show_status
call :log "Estado del sistema SuperPAES:"
echo.
echo === ESTADO DEL SISTEMA ===
echo.

REM Verificar procesos
tasklist /fi "imagename eq node.exe" 2>nul | find "node.exe" >nul
if errorlevel 1 (
    echo Node.js: No ejecutándose
) else (
    echo Node.js: Ejecutándose
)

tasklist /fi "imagename eq python.exe" 2>nul | find "python.exe" >nul
if errorlevel 1 (
    echo Python: No ejecutándose
) else (
    echo Python: Ejecutándose
)

echo.
echo === PUERTOS ===
for %%p in (3000 3001 3002 5000 5001) do (
    netstat -an | find "%%p" | find "LISTENING" >nul
    if errorlevel 1 (
        echo Puerto %%p: Libre
    ) else (
        echo Puerto %%p: Ocupado
    )
)

echo.
echo === FIN ESTADO ===
exit /b 0

REM Instalar dependencias
:install_deps
call :log "Instalando dependencias..."
cd /d "%PROJECT_ROOT%"
call npm install
if exist "backend\requirements.txt" (
    cd /d "%PROJECT_ROOT%backend"
    pip install -r requirements.txt
)
call :success "Dependencias instaladas correctamente"
exit /b 0

REM Función principal
:main
echo.
echo ╔══════════════════════════════════════════════════════════════╗
echo ║                    SUPERPAES CHILE                          ║
echo ║                   ORQUESTADOR BATCH                         ║
echo ╚══════════════════════════════════════════════════════════════╝
echo.

if "%1"=="" (
    set "ACTION=start"
) else (
    set "ACTION=%1"
)

call :log "Iniciando orquestador con acción: %ACTION%"

if /i "%ACTION%"=="start" (
    call :check_dependencies
    if errorlevel 1 exit /b 1
    
    if "%2"=="clean" call :clean_system
    
    call :enable_global_css
    if errorlevel 1 exit /b 1
    
    call :check_ports
    call :start_backend
    if errorlevel 1 exit /b 1
    
    timeout /t 3 /nobreak >nul
    
    call :start_frontend
    if errorlevel 1 exit /b 1
    
    call :success "Sistema SuperPAES iniciado correctamente"
    echo.
    echo 🌐 Frontend: http://localhost:3000 (o puerto disponible)
    echo 🔧 Backend: http://localhost:5000
    echo 📊 Estado: %0 status
    echo 🛑 Detener: %0 stop
    echo.
    
) else if /i "%ACTION%"=="stop" (
    call :stop_all
    
) else if /i "%ACTION%"=="restart" (
    call :stop_all
    timeout /t 2 /nobreak >nul
    call %0 start
    
) else if /i "%ACTION%"=="status" (
    call :show_status
    
) else if /i "%ACTION%"=="install" (
    call :install_deps
    
) else if /i "%ACTION%"=="clean" (
    call :clean_system
    
) else (
    call :error "Acción no válida: %ACTION%"
    echo.
    echo Acciones disponibles:
    echo   start    - Iniciar sistema
    echo   stop     - Detener sistema
    echo   restart  - Reiniciar sistema
    echo   status   - Mostrar estado
    echo   install  - Instalar dependencias
    echo   clean    - Limpiar sistema
    echo.
    echo Ejemplos:
    echo   %0 start
    echo   %0 start clean
    echo   %0 status
    echo.
)

call :log "Orquestador finalizado"
exit /b 0

REM Ejecutar función principal
call :main %*
