# ═══════════════════════════════════════════════════════════════════════════════
# LANZADOR DE MONITOR SISTEMA EDUCATIVO SUPERPAES - SEGUNDO PLANO
# ═══════════════════════════════════════════════════════════════════════════════
# 
# Este script cumple con las reglas especificadas:
# - Los procesos y servidores se lanzan SIEMPRE en segundo plano
# - Reporta métricas de desempeño y lógica
# - Facilita depuración y mantención del código
# - Usa PowerShell para Windows como se especifica en las reglas
# ═══════════════════════════════════════════════════════════════════════════════

param(
    [Parameter(Mandatory=$false)]
    [ValidateSet("start", "stop", "status", "restart", "install-service")]
    [string]$Accion = "start",
    
    [Parameter(Mandatory=$false)]
    [switch]$Verbose = $false
)

# Configuración
$SCRIPT_NAME = "Monitor Sistema Educativo SUPERPAES"
$MONITOR_SCRIPT = "monitor-sistema-educativo.js"
$SERVICE_NAME = "SuperpaesMonitor"
$LOG_DIR = "logs"
$PID_FILE = "monitor-educativo.pid"

# Colores ASCII para compatibilidad con PowerShell
function Write-ColorText {
    param($Text, $Color = "White")
    
    switch ($Color) {
        "Green" { Write-Host $Text -ForegroundColor Green }
        "Red" { Write-Host $Text -ForegroundColor Red }
        "Yellow" { Write-Host $Text -ForegroundColor Yellow }
        "Cyan" { Write-Host $Text -ForegroundColor Cyan }
        "Magenta" { Write-Host $Text -ForegroundColor Magenta }
        default { Write-Host $Text }
    }
}

# Función para mostrar banner ASCII
function Show-Banner {
    Write-Host ""
    Write-ColorText "════════════════════════════════════════════════════════════════════════════════" "Cyan"
    Write-ColorText "                    MONITOR SISTEMA EDUCATIVO SUPERPAES                        " "Cyan"
    Write-ColorText "                           Sistema de Segundo Plano                           " "Yellow"
    Write-ColorText "════════════════════════════════════════════════════════════════════════════════" "Cyan"
    Write-Host ""
}

# Función para verificar requisitos
function Test-Prerequisites {
    Write-ColorText "🔍 Verificando requisitos del sistema..." "Yellow"
    
    # Verificar Node.js
    try {
        $nodeVersion = node --version 2>$null
        Write-ColorText "✅ Node.js detectado: $nodeVersion" "Green"
    }
    catch {
        Write-ColorText "❌ Error: Node.js no está instalado o no está en el PATH" "Red"
        return $false
    }
    
    # Verificar archivo principal
    if (-not (Test-Path $MONITOR_SCRIPT)) {
        Write-ColorText "❌ Error: No se encontró $MONITOR_SCRIPT" "Red"
        return $false
    }
    Write-ColorText "✅ Script de monitoreo encontrado" "Green"
    
    # Crear directorio de logs si no existe
    if (-not (Test-Path $LOG_DIR)) {
        New-Item -ItemType Directory -Path $LOG_DIR -Force | Out-Null
        Write-ColorText "📁 Directorio de logs creado" "Green"
    }
    
    return $true
}

# Función para verificar si el monitor está ejecutándose
function Test-MonitorRunning {
    if (Test-Path $PID_FILE) {
        try {
            $pid = Get-Content $PID_FILE -ErrorAction Stop
            $process = Get-Process -Id $pid -ErrorAction Stop
            return @{ Running = $true; PID = $pid; Process = $process }
        }
        catch {
            # PID file existe pero proceso no, limpiar
            Remove-Item $PID_FILE -Force -ErrorAction SilentlyContinue
            return @{ Running = $false }
        }
    }
    
    return @{ Running = $false }
}

# Función para iniciar monitor en segundo plano
function Start-BackgroundMonitor {
    Write-ColorText "🚀 Iniciando Monitor Sistema Educativo en segundo plano..." "Yellow"
    
    # Verificar si ya está ejecutándose
    $status = Test-MonitorRunning
    if ($status.Running) {
        Write-ColorText "⚠️  Monitor ya está ejecutándose (PID: $($status.PID))" "Yellow"
        return
    }
    
    try {
        # Lanzar en segundo plano con Start-Process
        $processArgs = @{
            FilePath = "node"
            ArgumentList = @($MONITOR_SCRIPT, "start")
            WindowStyle = "Hidden"
            RedirectStandardOutput = "logs\monitor-stdout.log"
            RedirectStandardError = "logs\monitor-stderr.log"
        }
        
        $process = Start-Process @processArgs -PassThru
        
        # Esperar un momento para verificar que se inició correctamente
        Start-Sleep -Seconds 2
        
        if ($process.HasExited) {
            Write-ColorText "❌ Error: El monitor no se pudo iniciar correctamente" "Red"
            Write-ColorText "📋 Revise los logs en logs\monitor-stderr.log" "Yellow"
            return
        }
        
        Write-ColorText "✅ Monitor iniciado exitosamente" "Green"
        Write-ColorText "📊 PID: $($process.Id)" "Cyan"
        Write-ColorText "📝 Logs: logs\monitor-educativo.log" "Cyan"
        Write-ColorText "📈 Métricas: logs\metricas-educativo.json" "Cyan"
        Write-ColorText "📋 Reporte ASCII: logs\reporte-ascii-educativo.txt" "Cyan"
        
        # Mostrar información de configuración
        Show-MonitorConfiguration
        
    }
    catch {
        Write-ColorText "❌ Error iniciando monitor: $($_.Exception.Message)" "Red"
    }
}

# Función para detener monitor
function Stop-BackgroundMonitor {
    Write-ColorText "🛑 Deteniendo Monitor Sistema Educativo..." "Yellow"
    
    $status = Test-MonitorRunning
    if (-not $status.Running) {
        Write-ColorText "ℹ️  Monitor no está ejecutándose" "Yellow"
        return
    }
    
    try {
        # Intentar detención graciosa
        Stop-Process -Id $status.PID -Force
        Start-Sleep -Seconds 2
        
        # Verificar que se detuvo
        $finalStatus = Test-MonitorRunning
        if ($finalStatus.Running) {
            Write-ColorText "⚠️  Forzando detención del proceso..." "Yellow"
            Stop-Process -Id $status.PID -Force
        }
        
        Write-ColorText "✅ Monitor detenido exitosamente" "Green"
        
    }
    catch {
        Write-ColorText "❌ Error deteniendo monitor: $($_.Exception.Message)" "Red"
    }
}

# Función para mostrar estado del monitor
function Show-MonitorStatus {
    Write-ColorText "📊 ESTADO DEL MONITOR SISTEMA EDUCATIVO" "Cyan"
    Write-Host "═══════════════════════════════════════════════════════════════════════════════"
    
    $status = Test-MonitorRunning
    
    if ($status.Running) {
        Write-ColorText "🟢 Estado: EJECUTÁNDOSE" "Green"
        Write-ColorText "📊 PID: $($status.PID)" "Cyan"
        
        # Mostrar información del proceso
        $process = $status.Process
        Write-ColorText "💾 Memoria: $([Math]::Round($process.WorkingSet / 1MB, 2)) MB" "Cyan"
        Write-ColorText "⏱️  Tiempo ejecución: $($process.TotalProcessorTime)" "Cyan"
        
        # Mostrar último reporte ASCII si existe
        $reportFile = "logs\reporte-ascii-educativo.txt"
        if (Test-Path $reportFile) {
            Write-Host ""
            Write-ColorText "📋 ÚLTIMO REPORTE ASCII:" "Yellow"
            Write-Host "───────────────────────────────────────────────────────────────────────────────"
            Get-Content $reportFile | Write-Host
        }
        
        # Mostrar métricas JSON si existe
        $metricsFile = "logs\metricas-educativo.json"
        if (Test-Path $metricsFile) {
            try {
                $metrics = Get-Content $metricsFile | ConvertFrom-Json
                Write-Host ""
                Write-ColorText "📈 MÉTRICAS ACTUALES:" "Yellow"
                Write-ColorText "⏰ Último update: $($metrics.timestamp)" "Cyan"
                Write-ColorText "🔄 Uptime total: $([Math]::Round($metrics.uptime_total / (1000 * 60), 2)) minutos" "Cyan"
                
                # Mostrar estado de componentes
                Write-ColorText "🔧 Estados componentes:" "Cyan"
                foreach ($comp in $metrics.componentes.PSObject.Properties) {
                    $name = $comp.Name
                    $status = $comp.Value.status
                    $errors = $comp.Value.errores
                    $responseTime = [Math]::Round($comp.Value.tiempo_respuesta, 2)
                    
                    $statusIcon = switch ($status) {
                        "operational" { "🟢" }
                        "degraded" { "🟡" }
                        "critical" { "🔴" }
                        default { "⚪" }
                    }
                    
                    Write-Host "   $statusIcon $name - Errores: $errors - Tiempo: ${responseTime}ms"
                }
            }
            catch {
                Write-ColorText "⚠️  No se pudieron leer las métricas" "Yellow"
            }
        }
        
    } else {
        Write-ColorText "🔴 Estado: NO EJECUTÁNDOSE" "Red"
        Write-ColorText "ℹ️  Use 'start' para iniciar el monitor" "Yellow"
    }
    
    Write-Host "═══════════════════════════════════════════════════════════════════════════════"
}

# Función para reiniciar monitor
function Restart-BackgroundMonitor {
    Write-ColorText "🔄 Reiniciando Monitor Sistema Educativo..." "Yellow"
    
    Stop-BackgroundMonitor
    Start-Sleep -Seconds 3
    Start-BackgroundMonitor
}

# Función para mostrar configuración del monitor
function Show-MonitorConfiguration {
    Write-Host ""
    Write-ColorText "⚙️  CONFIGURACIÓN DEL MONITOR" "Yellow"
    Write-Host "───────────────────────────────────────────────────────────────────────────────"
    Write-ColorText "📅 Intervalo de monitoreo: 30 segundos" "Cyan"
    Write-ColorText "⏱️  Timeout por verificación: 10 segundos" "Cyan"
    Write-ColorText "📝 Máximo logs en memoria: 1000 entradas" "Cyan"
    Write-ColorText "🗂️  Retención de logs: 7 días" "Cyan"
    Write-Host ""
    Write-ColorText "🔍 Componentes monitoreados:" "Yellow"
    Write-ColorText "  • Context7 - Estructura PAES oficial" "Cyan"
    Write-ColorText "  • Sistema Cuántico - Motor cuántico educativo" "Cyan"
    Write-ColorText "  • Triada Renacentista - Arte, Ciencia, Tecnología" "Cyan"
    Write-ColorText "  • Multimodalidad Gemini - AI y OpenRouter" "Cyan"
    Write-ColorText "  • Plataforma PAES - Configuración educativa" "Cyan"
    Write-ColorText "  • Integridad Sistema - Verificación de archivos" "Cyan"
    Write-Host ""
}

# Función para instalar como servicio de Windows (opcional)
function Install-WindowsService {
    Write-ColorText "🔧 Instalando como servicio de Windows..." "Yellow"
    
    # Verificar permisos de administrador
    $isAdmin = ([Security.Principal.WindowsPrincipal] [Security.Principal.WindowsIdentity]::GetCurrent()).IsInRole([Security.Principal.WindowsBuiltInRole] "Administrator")
    
    if (-not $isAdmin) {
        Write-ColorText "❌ Error: Se requieren permisos de administrador para instalar servicios" "Red"
        Write-ColorText "💡 Ejecute PowerShell como administrador" "Yellow"
        return
    }
    
    # Crear script wrapper para el servicio
    $serviceScript = @"
# Wrapper para servicio de Windows
Set-Location "$PWD"
while (`$true) {
    try {
        node $MONITOR_SCRIPT start
        Start-Sleep -Seconds 5
    }
    catch {
        Write-EventLog -LogName Application -Source "$SERVICE_NAME" -EventID 1001 -EntryType Error -Message `$_.Exception.Message
        Start-Sleep -Seconds 30
    }
}
"@
    
    $serviceScriptPath = "service-wrapper.ps1"
    Set-Content -Path $serviceScriptPath -Value $serviceScript
    
    try {
        # Crear servicio con nssm si está disponible, sino usar sc.exe
        $nssmPath = Get-Command nssm -ErrorAction SilentlyContinue
        
        if ($nssmPath) {
            Write-ColorText "🔧 Usando NSSM para crear el servicio..." "Yellow"
            & nssm install $SERVICE_NAME powershell.exe "-ExecutionPolicy Bypass -File `"$PWD\$serviceScriptPath`""
            & nssm set $SERVICE_NAME DisplayName "$SCRIPT_NAME"
            & nssm set $SERVICE_NAME Description "Monitor de sistema educativo SUPERPAES que ejecuta en segundo plano"
            & nssm set $SERVICE_NAME Start SERVICE_AUTO_START
        } else {
            Write-ColorText "⚠️  NSSM no encontrado. Instalando con sc.exe..." "Yellow"
            sc.exe create $SERVICE_NAME binpath= "powershell.exe -ExecutionPolicy Bypass -File `"$PWD\$serviceScriptPath`"" start= auto
            sc.exe config $SERVICE_NAME DisplayName= "$SCRIPT_NAME"
        }
        
        Write-ColorText "✅ Servicio instalado exitosamente" "Green"
        Write-ColorText "🎯 Nombre del servicio: $SERVICE_NAME" "Cyan"
        Write-ColorText "💡 Use 'services.msc' para administrar el servicio" "Yellow"
        
    }
    catch {
        Write-ColorText "❌ Error instalando servicio: $($_.Exception.Message)" "Red"
    }
}

# ═══════════════════════════════════════════════════════════════════════════════
# FUNCIÓN PRINCIPAL
# ═══════════════════════════════════════════════════════════════════════════════

function Main {
    Show-Banner
    
    # Verificar requisitos
    if (-not (Test-Prerequisites)) {
        Write-ColorText "❌ Requisitos no cumplidos. Abortando." "Red"
        exit 1
    }
    
    # Ejecutar acción solicitada
    switch ($Accion.ToLower()) {
        "start" {
            Start-BackgroundMonitor
        }
        "stop" {
            Stop-BackgroundMonitor
        }
        "status" {
            Show-MonitorStatus
        }
        "restart" {
            Restart-BackgroundMonitor
        }
        "install-service" {
            Install-WindowsService
        }
        default {
            Write-ColorText "❌ Acción no válida: $Accion" "Red"
            Show-Help
        }
    }
}

# Función de ayuda
function Show-Help {
    Write-Host ""
    Write-ColorText "🔧 MONITOR SISTEMA EDUCATIVO SUPERPAES - SEGUNDO PLANO" "Cyan"
    Write-Host ""
    Write-ColorText "Uso:" "Yellow"
    Write-Host "  .\lanzar-monitor-background.ps1 -Accion [start|stop|status|restart|install-service]"
    Write-Host ""
    Write-ColorText "Acciones disponibles:" "Yellow"
    Write-ColorText "  start           - Iniciar monitoreo en segundo plano" "Cyan"
    Write-ColorText "  stop            - Detener monitoreo" "Cyan"
    Write-ColorText "  status          - Ver estado actual y reportes" "Cyan"
    Write-ColorText "  restart         - Reiniciar monitoreo" "Cyan"
    Write-ColorText "  install-service - Instalar como servicio de Windows (requiere admin)" "Cyan"
    Write-Host ""
    Write-ColorText "Parámetros opcionales:" "Yellow"
    Write-ColorText "  -Verbose        - Mostrar información detallada" "Cyan"
    Write-Host ""
    Write-ColorText "Archivos generados:" "Yellow"
    Write-ColorText "  logs\monitor-educativo.log          - Log completo del sistema" "Cyan"
    Write-ColorText "  logs\metricas-educativo.json        - Métricas en formato JSON" "Cyan"
    Write-ColorText "  logs\reporte-ascii-educativo.txt    - Reporte visual ASCII" "Cyan"
    Write-ColorText "  monitor-educativo.pid               - Archivo PID del proceso" "Cyan"
    Write-Host ""
    Write-ColorText "Ejemplos:" "Yellow"
    Write-Host "  .\lanzar-monitor-background.ps1 -Accion start"
    Write-Host "  .\lanzar-monitor-background.ps1 -Accion status -Verbose"
    Write-Host "  .\lanzar-monitor-background.ps1 -Accion restart"
    Write-Host ""
}

# Ejecutar función principal si el parámetro Acción es válido
if ($Accion -in @("start", "stop", "status", "restart", "install-service")) {
    Main
} else {
    Show-Help
}
