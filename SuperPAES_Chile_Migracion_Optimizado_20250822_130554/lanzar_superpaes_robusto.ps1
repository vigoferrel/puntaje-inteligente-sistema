# ========================================
# SUPERPAES CHILE - SISTEMA INTEGRADO
# Script de despliegue robusto en PowerShell
# ========================================

param(
    [switch]$Force,
    [switch]$SkipCleanup,
    [switch]$SkipDependencies
)

# Configurar codificación para caracteres especiales
[Console]::OutputEncoding = [System.Text.Encoding]::UTF8

Write-Host ""
Write-Host "========================================" -ForegroundColor Cyan
Write-Host "🚀 SUPERPAES CHILE - SISTEMA INTEGRADO" -ForegroundColor Yellow
Write-Host "========================================" -ForegroundColor Cyan
Write-Host ""

# ========================================
# FUNCIONES AUXILIARES
# ========================================

function Write-Status {
    param([string]$Message, [string]$Type = "INFO")
    
    $timestamp = Get-Date -Format "HH:mm:ss"
    switch ($Type) {
        "SUCCESS" { Write-Host "[$timestamp] ✅ $Message" -ForegroundColor Green }
        "ERROR"   { Write-Host "[$timestamp] ❌ $Message" -ForegroundColor Red }
        "WARNING" { Write-Host "[$timestamp] ⚠️  $Message" -ForegroundColor Yellow }
        "INFO"    { Write-Host "[$timestamp] ℹ️  $Message" -ForegroundColor Blue }
        default   { Write-Host "[$timestamp] ℹ️  $Message" -ForegroundColor White }
    }
}

function Test-Port {
    param([int]$Port)
    
    try {
        $connection = New-Object System.Net.Sockets.TcpClient
        $connection.Connect("localhost", $Port)
        $connection.Close()
        return $true
    }
    catch {
        return $false
    }
}

function Stop-ProcessOnPort {
    param([int]$Port)
    
    try {
        $processes = Get-NetTCPConnection -LocalPort $Port -ErrorAction SilentlyContinue | 
                    Where-Object { $_.State -eq "Listen" } | 
                    Select-Object -ExpandProperty OwningProcess
        
        foreach ($processId in $processes) {
            $process = Get-Process -Id $processId -ErrorAction SilentlyContinue
            if ($process) {
                Write-Status "Deteniendo proceso en puerto $Port`: $($process.ProcessName) (PID: $processId)"
                Stop-Process -Id $processId -Force -ErrorAction SilentlyContinue
            }
        }
    }
    catch {
        Write-Status "No se encontraron procesos en puerto $Port" "WARNING"
    }
}

# ========================================
# LIMPIEZA DE PUERTOS Y PROCESOS
# ========================================

if (-not $SkipCleanup) {
    Write-Status "🔧 Limpiando puertos y procesos anteriores..."
    
    # Detener procesos en puertos específicos
    @(3000, 3001, 5000) | ForEach-Object {
        Stop-ProcessOnPort $_
    }
    
    # Detener procesos Python y Node
    $processesToKill = @("python.exe", "pythonw.exe", "node.exe")
    foreach ($process in $processesToKill) {
        try {
            $running = Get-Process -Name $process -ErrorAction SilentlyContinue
            if ($running) {
                Write-Status "Deteniendo procesos $process..."
                Stop-Process -Name $process -Force -ErrorAction SilentlyContinue
            }
        }
        catch {
            # Proceso no encontrado, continuar
        }
    }
    
    # Esperar a que se liberen los puertos
    Write-Status "⏳ Esperando liberación de puertos..."
    Start-Sleep -Seconds 3
}

# ========================================
# VERIFICACIÓN DE DEPENDENCIAS
# ========================================

if (-not $SkipDependencies) {
    Write-Status "📦 Verificando dependencias..."
    
    # Verificar Python
    try {
        $pythonVersion = python --version 2>&1
        Write-Status "✅ Python encontrado: $pythonVersion"
    }
    catch {
        Write-Status "❌ Python no encontrado. Instale Python 3.8+ y vuelva a intentar." "ERROR"
        exit 1
    }
    
    # Verificar Node.js
    try {
        $nodeVersion = node --version 2>&1
        Write-Status "✅ Node.js encontrado: $nodeVersion"
    }
    catch {
        Write-Status "❌ Node.js no encontrado. Instale Node.js 16+ y vuelva a intentar." "ERROR"
        exit 1
    }
    
    # Verificar npm
    try {
        $npmVersion = npm --version 2>&1
        Write-Status "✅ npm encontrado: $npmVersion"
    }
    catch {
        Write-Status "❌ npm no encontrado." "ERROR"
        exit 1
    }
}

# ========================================
# CONFIGURACIÓN DEL ENTORNO
# ========================================

Write-Status "🔧 Configurando entorno..."

# Verificar y crear entorno virtual
if (-not (Test-Path ".venv\Scripts\Activate.ps1")) {
    Write-Status "📦 Creando entorno virtual..."
    python -m venv .venv
    if ($LASTEXITCODE -ne 0) {
        Write-Status "❌ Error creando entorno virtual" "ERROR"
        exit 1
    }
}

# Activar entorno virtual
Write-Status "✅ Activando entorno virtual..."
& ".venv\Scripts\Activate.ps1"

# Instalar dependencias Python
if (Test-Path "backend\requirements.txt") {
    Write-Status "📥 Instalando dependencias Python..."
    pip install -r backend\requirements.txt
    if ($LASTEXITCODE -ne 0) {
        Write-Status "❌ Error instalando dependencias Python" "ERROR"
        exit 1
    }
}

# Instalar dependencias Node
if (Test-Path "package.json") {
    Write-Status "📥 Instalando dependencias Node..."
    npm install
    if ($LASTEXITCODE -ne 0) {
        Write-Status "❌ Error instalando dependencias Node" "ERROR"
        exit 1
    }
}

# ========================================
# DESPLIEGUE DEL SISTEMA
# ========================================

Write-Status "🚀 Desplegando SuperPAES Chile..."

# Iniciar backend
Write-Status "🌐 Iniciando Backend (Puerto 5000)..."
$backendJob = Start-Job -ScriptBlock {
    Set-Location $using:PWD
    & ".venv\Scripts\Activate.ps1"
    Set-Location "backend"
    python app_simple.py
}

# Esperar a que el backend esté listo
Write-Status "⏳ Esperando que el backend esté listo..."
$backendReady = $false
$attempts = 0
while (-not $backendReady -and $attempts -lt 30) {
    Start-Sleep -Seconds 2
    $attempts++
    if (Test-Port 5000) {
        $backendReady = $true
        Write-Status "✅ Backend iniciado correctamente" "SUCCESS"
    }
    else {
        Write-Status "⏳ Backend aún iniciando... (intento $attempts/30)"
    }
}

if (-not $backendReady) {
    Write-Status "❌ Backend no pudo iniciarse en 60 segundos" "ERROR"
    Stop-Job $backendJob -ErrorAction SilentlyContinue
    exit 1
}

# Iniciar frontend
Write-Status "🎨 Iniciando Frontend..."
$frontendJob = Start-Job -ScriptBlock {
    Set-Location $using:PWD
    npm run dev
}

# Esperar a que el frontend esté listo
Write-Status "⏳ Esperando que el frontend esté listo..."
$frontendReady = $false
$attempts = 0
while (-not $frontendReady -and $attempts -lt 30) {
    Start-Sleep -Seconds 2
    $attempts++
    if (Test-Port 3000) {
        $frontendReady = $true
        $frontendPort = 3000
        Write-Status "✅ Frontend iniciado en puerto 3000" "SUCCESS"
    }
    elseif (Test-Port 3001) {
        $frontendReady = $true
        $frontendPort = 3001
        Write-Status "✅ Frontend iniciado en puerto 3001" "SUCCESS"
    }
    else {
        Write-Status "⏳ Frontend aún iniciando... (intento $attempts/30)"
    }
}

if (-not $frontendReady) {
    Write-Status "❌ Frontend no pudo iniciarse en 60 segundos" "ERROR"
    Stop-Job $backendJob -ErrorAction SilentlyContinue
    Stop-Job $frontendJob -ErrorAction SilentlyContinue
    exit 1
}

# ========================================
# VERIFICACIÓN DEL SISTEMA
# ========================================

Write-Status "🔍 Verificando sistema..."

# Verificar backend
try {
    $response = Invoke-WebRequest -Uri "http://localhost:5000/api/health" -TimeoutSec 10
    if ($response.StatusCode -eq 200) {
        Write-Status "✅ Backend funcionando correctamente" "SUCCESS"
    }
    else {
        Write-Status "❌ Backend responde pero con error" "ERROR"
    }
}
catch {
    Write-Status "❌ Backend no responde correctamente" "ERROR"
}

# Verificar frontend
try {
    $response = Invoke-WebRequest -Uri "http://localhost:$frontendPort" -TimeoutSec 10
    if ($response.StatusCode -eq 200) {
        Write-Status "✅ Frontend funcionando correctamente" "SUCCESS"
    }
    else {
        Write-Status "❌ Frontend responde pero con error" "ERROR"
    }
}
catch {
    Write-Status "❌ Frontend no responde correctamente" "ERROR"
}

# ========================================
# APERTURA DEL NAVEGADOR
# ========================================

Write-Status "🌍 Abriendo navegador..."
Start-Sleep -Seconds 2

try {
    Start-Process "http://localhost:$frontendPort"
    Write-Status "✅ Navegador abierto" "SUCCESS"
}
catch {
    Write-Status "❌ No se pudo abrir el navegador automáticamente" "WARNING"
    Write-Status "🌐 Abra manualmente: http://localhost:$frontendPort"
}

# ========================================
# MONITOREO DEL SISTEMA
# ========================================

Write-Host ""
Write-Host "========================================" -ForegroundColor Green
Write-Host "🎉 SUPERPAES CHILE DESPLEGADO EXITOSAMENTE" -ForegroundColor Yellow
Write-Host "========================================" -ForegroundColor Green
Write-Host ""
Write-Host "📍 URLs del sistema:" -ForegroundColor Cyan
Write-Host "   🌐 Frontend: http://localhost:$frontendPort" -ForegroundColor White
Write-Host "   🔧 Backend:  http://localhost:5000" -ForegroundColor White
Write-Host "   📊 Health:   http://localhost:5000/api/health" -ForegroundColor White
Write-Host ""
Write-Host "📋 Comandos útiles:" -ForegroundColor Cyan
Write-Host "   🔍 Ver jobs: Get-Job" -ForegroundColor White
Write-Host "   📊 Ver logs: Receive-Job -Job `$backendJob" -ForegroundColor White
Write-Host "   🛑 Detener:  Stop-Job -Job `$backendJob, `$frontendJob" -ForegroundColor White
Write-Host "   🔄 Reiniciar: Ejecutar este script nuevamente" -ForegroundColor White
Write-Host ""
Write-Host "⚠️  Para detener el sistema, presione Ctrl+C" -ForegroundColor Yellow
Write-Host ""

# Mantener el script ejecutándose y mostrar logs
try {
    while ($true) {
        Start-Sleep -Seconds 10
        
        # Verificar que los jobs sigan ejecutándose
        if ($backendJob.State -eq "Failed" -or $frontendJob.State -eq "Failed") {
            Write-Status "❌ Uno de los servicios ha fallado" "ERROR"
            break
        }
        
        # Mostrar estado cada minuto
        $currentTime = Get-Date -Format "HH:mm:ss"
        Write-Host "[$currentTime] Sistema funcionando correctamente..." -ForegroundColor Green
    }
}
catch {
    Write-Status "Deteniendo sistema..." "WARNING"
}
finally {
    # Limpieza al salir
    Write-Status "🧹 Limpiando recursos..."
    Stop-Job -Job $backendJob, $frontendJob -ErrorAction SilentlyContinue
    Remove-Job -Job $backendJob, $frontendJob -ErrorAction SilentlyContinue
    Write-Status "✅ Sistema detenido correctamente" "SUCCESS"
}
