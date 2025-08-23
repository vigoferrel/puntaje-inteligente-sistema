# ========================================
# SCRIPT PARA INICIAR BACKEND SUPERPAES
# ========================================

Write-Host "🚀 Iniciando Backend SuperPAES..." -ForegroundColor Green

# Activar entorno virtual
Write-Host "📦 Activando entorno virtual..." -ForegroundColor Yellow
& "C:\Users\Hp\Desktop\superpaes\.venv\Scripts\Activate.ps1"

# Cambiar al directorio backend
Write-Host "📁 Cambiando al directorio backend..." -ForegroundColor Yellow
Set-Location "C:\Users\Hp\Desktop\superpaes\backend"

# Verificar que el archivo existe
if (Test-Path "app_simple.py") {
    Write-Host "✅ Archivo app_simple.py encontrado" -ForegroundColor Green
    
    # Iniciar el servidor Flask
    Write-Host "🔥 Iniciando servidor Flask..." -ForegroundColor Cyan
    python app_simple.py
} else {
    Write-Host "❌ Error: No se encontró app_simple.py" -ForegroundColor Red
    Write-Host "📂 Directorio actual: $(Get-Location)" -ForegroundColor Yellow
    Write-Host "📋 Archivos en el directorio:" -ForegroundColor Yellow
    Get-ChildItem | ForEach-Object { Write-Host "   - $($_.Name)" -ForegroundColor Gray }
}

Write-Host "🏁 Script completado" -ForegroundColor Green
