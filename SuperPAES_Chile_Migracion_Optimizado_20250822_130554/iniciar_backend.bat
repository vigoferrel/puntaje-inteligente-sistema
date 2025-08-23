@echo off
REM ========================================
REM SCRIPT PARA INICIAR BACKEND SUPERPAES
REM ========================================

echo 🚀 Iniciando Backend SuperPAES...

REM Activar entorno virtual
echo 📦 Activando entorno virtual...
call "C:\Users\Hp\Desktop\superpaes\.venv\Scripts\activate.bat"

REM Cambiar al directorio backend
echo 📁 Cambiando al directorio backend...
cd /d "C:\Users\Hp\Desktop\superpaes\backend"

REM Verificar que el archivo existe
if exist "app_simple.py" (
    echo ✅ Archivo app_simple.py encontrado
    
    REM Iniciar el servidor Flask
    echo 🔥 Iniciando servidor Flask...
    python app_simple.py
) else (
    echo ❌ Error: No se encontró app_simple.py
    echo 📂 Directorio actual: %CD%
    echo 📋 Archivos en el directorio:
    dir
)

echo 🏁 Script completado
pause
