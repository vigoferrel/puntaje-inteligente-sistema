# Script de Monitoreo Continuo de Performance
# Ejecuta en segundo plano para reportar métricas según reglas del usuario

param(
    [int]$IntervalSeconds = 30
)

$logFile = "performance-metrics.log"
$processName = "node"

Write-Host "🚀 Iniciando monitoreo de performance en segundo plano..."
Write-Host "📊 Métricas se guardarán en: $logFile"
Write-Host "⏱️ Intervalo: $IntervalSeconds segundos"

while ($true) {
    $timestamp = Get-Date -Format "yyyy-MM-dd HH:mm:ss"
    
    try {
        # Obtener procesos de Node.js relacionados con el proyecto
        $nodeProcesses = Get-Process -Name $processName -ErrorAction SilentlyContinue
        
        # Métricas de memoria y CPU
        $totalMemoryMB = 0
        $totalCPU = 0
        $processCount = 0
        
        foreach ($proc in $nodeProcesses) {
            if ($proc.Path -like "*puntaje-inteligente-sistema*" -or $proc.CommandLine -like "*vite*") {
                $totalMemoryMB += [math]::Round($proc.WorkingSet / 1MB, 2)
                $totalCPU += $proc.CPU
                $processCount++
            }
        }
        
        # Verificar estado del servidor
        try {
            $response = Invoke-WebRequest -Uri "http://localhost:8080" -UseBasicParsing -TimeoutSec 5
            $serverStatus = "ONLINE ($($response.StatusCode))"
        } catch {
            $serverStatus = "OFFLINE"
        }
        
        # Métricas del sistema
        $systemMemory = Get-Counter "\Memory\Available MBytes" -ErrorAction SilentlyContinue
        $availableMemoryMB = if ($systemMemory) { [math]::Round($systemMemory.CounterSamples.CookedValue, 0) } else { "N/A" }
        
        # Crear reporte de métricas
        $metricsReport = @{
            timestamp = $timestamp
            server_status = $serverStatus
            node_processes = $processCount
            total_memory_mb = $totalMemoryMB
            total_cpu_time = $totalCPU
            system_available_memory_mb = $availableMemoryMB
            evaluation_endpoint = "http://192.168.100.7:8080/evaluations"
        }
        
        # Guardar métricas en log
        $logEntry = "[$timestamp] SERVER: $serverStatus | PROCS: $processCount | MEM: ${totalMemoryMB}MB | SYSMEM: ${availableMemoryMB}MB | EVAL_ENDPOINT: CONFIGURED"
        Add-Content -Path $logFile -Value $logEntry
        
        # Mostrar en consola (silencioso para background)
        Write-Host "[$timestamp] ✅ $serverStatus | 💾 ${totalMemoryMB}MB | 🖥️ ${availableMemoryMB}MB disponible"
        
    } catch {
        $errorEntry = "[$timestamp] ERROR: $($_.Exception.Message)"
        Add-Content -Path $logFile -Value $errorEntry
        Write-Host "[$timestamp] ❌ Error en monitoreo: $($_.Exception.Message)" -ForegroundColor Red
    }
    
    Start-Sleep -Seconds $IntervalSeconds
}
