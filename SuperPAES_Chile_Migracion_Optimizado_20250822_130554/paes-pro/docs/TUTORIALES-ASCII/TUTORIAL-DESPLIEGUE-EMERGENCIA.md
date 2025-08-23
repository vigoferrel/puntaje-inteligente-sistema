# TUTORIAL: DESPLIEGUE DE EMERGENCIA - PAES PRO SYSTEM
Tutorial ASCII Version 1.0 - Enero 2025

## SITUACION DE EMERGENCIA

Este tutorial esta disenado para situaciones criticas donde el sistema PAES PRO debe ser restaurado rapidamente debido a:
- Caida del servidor principal
- Corrupcion de datos
- Fallo de contenedores Docker
- Problemas de infraestructura

---

## PREREQUISITOS DE EMERGENCIA

```ascii
CHECKLIST DE EMERGENCIA - VERIFICACION RAPIDA
┌─────────────────────────────────────────────────────────────┐
│ [ ] Sistema Windows con PowerShell disponible              │
│ [ ] Node.js instalado (version 18+)                        │
│ [ ] Acceso a archivos .env con credenciales Supabase       │
│ [ ] Backup mas reciente disponible                         │
│ [ ] Conexion a Internet estable                            │
│ [ ] Puerto 3000 libre                                      │
└─────────────────────────────────────────────────────────────┘
```

---

## PASO 1: EVALUACION RAPIDA DEL SISTEMA

### Verificacion de Estado
```powershell
# Ejecutar en PowerShell como Administrador

Write-Host "=== EVALUACION DE EMERGENCIA PAES PRO ===" -ForegroundColor Red

# 1. Verificar procesos existentes
Write-Host "[CHECK] Verificando procesos activos..." -ForegroundColor Yellow
Get-Process -Name "node", "npm" -ErrorAction SilentlyContinue | Format-Table Name, Id, CPU, WorkingSet

# 2. Verificar puertos
Write-Host "[CHECK] Verificando puertos..." -ForegroundColor Yellow
netstat -an | findstr ":3000 :3001 :5432"

# 3. Verificar servicios de monitoreo
Write-Host "[CHECK] Verificando monitoreo..." -ForegroundColor Yellow
Get-Job | Where-Object {$_.Name -like "*PAES*"} | Format-Table Name, State

# 4. Quick health check
Write-Host "[CHECK] Prueba rapida de API..." -ForegroundColor Yellow
try {
    $response = Invoke-RestMethod -Uri "http://localhost:3000/api/health" -TimeoutSec 5
    Write-Host "API Status: ONLINE" -ForegroundColor Green
    Write-Host "Emergency deployment may not be needed" -ForegroundColor Green
    exit 0
} catch {
    Write-Host "API Status: OFFLINE - Continuando con despliegue de emergencia" -ForegroundColor Red
}
```

### Diagnostico Visual ASCII
```ascii
DIAGNOSTICO DEL SISTEMA - STATUS BOARD
┌─────────────────────────────────────────────────────────────┐
│                      SYSTEM STATUS                          │
├─────────────────────────────────────────────────────────────┤
│ API Server (Port 3000)         [ OFFLINE ]  🔴             │
│ Monitoring (Port 3001)         [ UNKNOWN ]  🟡             │
│ Database Connection            [ UNKNOWN ]  🟡             │
│ Docker Containers              [ UNKNOWN ]  🟡             │
│ PowerShell Jobs                [ UNKNOWN ]  🟡             │
│ Log Files                      [ UNKNOWN ]  🟡             │
└─────────────────────────────────────────────────────────────┘

LEYENDA:
🟢 = OPERATIONAL    🟡 = UNKNOWN    🔴 = FAILED
```

---

## PASO 2: LIMPIEZA DE PROCESOS CONFLICTIVOS

### Script de Limpieza de Emergencia
```powershell
# emergency-cleanup.ps1
Write-Host "=== LIMPIEZA DE EMERGENCIA ===" -ForegroundColor Red

# 1. Terminar procesos Node.js existentes
Write-Host "[CLEANUP] Terminando procesos Node.js..." -ForegroundColor Yellow
Get-Process -Name "node" -ErrorAction SilentlyContinue | Stop-Process -Force
Start-Sleep -Seconds 3

# 2. Terminar jobs PowerShell de PAES
Write-Host "[CLEANUP] Limpiando PowerShell jobs..." -ForegroundColor Yellow
Get-Job | Where-Object {$_.Name -like "*PAES*"} | Stop-Job
Get-Job | Where-Object {$_.Name -like "*PAES*"} | Remove-Job

# 3. Liberar puertos
Write-Host "[CLEANUP] Liberando puertos..." -ForegroundColor Yellow
$ports = @(3000, 3001)
foreach ($port in $ports) {
    $process = netstat -ano | findstr ":$port "
    if ($process) {
        $pid = ($process -split "\s+")[-1]
        if ($pid -and $pid -match "^\d+$") {
            Write-Host "Terminando proceso en puerto $port (PID: $pid)"
            Stop-Process -Id $pid -Force -ErrorAction SilentlyContinue
        }
    }
}

Write-Host "[CLEANUP] Limpieza completada" -ForegroundColor Green
```

---

## PASO 3: RESTAURACION RAPIDA DE ARCHIVOS

### Verificacion de Archivos Criticos
```ascii
VERIFICACION DE ARCHIVOS - EMERGENCY CHECKLIST
┌─────────────────────────────────────────────────────────────┐
│ ARCHIVO                    │ STATUS │ ACCION               │
├─────────────────────────────────────────────────────────────┤
│ package.json              │   ?    │ Verificar            │
│ package-lock.json         │   ?    │ Verificar            │
│ .env                      │   ?    │ CRITICO - Restaurar  │
│ .env.local               │   ?    │ Verificar            │
│ next.config.js           │   ?    │ Verificar            │
│ node_modules/            │   ?    │ Reinstalar si falta  │
│ .next/                   │   ?    │ Reconstruir          │
└─────────────────────────────────────────────────────────────┘
```

### Script de Verificacion y Restauracion
```powershell
# emergency-file-check.ps1
Write-Host "=== VERIFICACION DE ARCHIVOS CRITICOS ===" -ForegroundColor Red

$criticalFiles = @(
    @{Name = "package.json"; Required = $true},
    @{Name = ".env"; Required = $true},
    @{Name = "next.config.js"; Required = $true},
    @{Name = "monitoring-config.json"; Required = $false}
)

$missingFiles = @()

foreach ($file in $criticalFiles) {
    if (Test-Path $file.Name) {
        Write-Host "[OK] $($file.Name) encontrado" -ForegroundColor Green
    } else {
        Write-Host "[ERROR] $($file.Name) faltante" -ForegroundColor Red
        if ($file.Required) {
            $missingFiles += $file.Name
        }
    }
}

if ($missingFiles.Count -gt 0) {
    Write-Host "ARCHIVOS CRITICOS FALTANTES: $($missingFiles -join ', ')" -ForegroundColor Red
    Write-Host "BUSCAR EN BACKUPS O REPOSITORIO GIT" -ForegroundColor Yellow
    
    # Intentar restaurar desde backup mas reciente
    $latestBackup = Get-ChildItem "backups" -Directory | Sort-Object Name -Descending | Select-Object -First 1
    if ($latestBackup) {
        Write-Host "Backup encontrado: $($latestBackup.Name)" -ForegroundColor Yellow
        Write-Host "Restaurar manualmente desde: $($latestBackup.FullName)" -ForegroundColor Yellow
    }
} else {
    Write-Host "Todos los archivos criticos estan presentes" -ForegroundColor Green
}
```

---

## PASO 4: INSTALACION EXPRESS DE DEPENDENCIAS

### Instalacion Rapida
```ascii
INSTALACION EXPRESS - EMERGENCY MODE
┌─────────────────────────────────────────────────────────────┐
│ TIEMPO ESTIMADO: 2-5 minutos                               │
│ MODO: Instalacion rapida sin cache                         │
│ VERIFICACION: Automatica con health checks                 │
└─────────────────────────────────────────────────────────────┘
```

```powershell
# emergency-install.ps1
Write-Host "=== INSTALACION EXPRESS DE DEPENDENCIAS ===" -ForegroundColor Red

# 1. Limpiar cache npm
Write-Host "[STEP 1] Limpiando cache npm..." -ForegroundColor Yellow
npm cache clean --force

# 2. Eliminar node_modules si existe
Write-Host "[STEP 2] Limpiando node_modules..." -ForegroundColor Yellow
if (Test-Path "node_modules") {
    Remove-Item "node_modules" -Recurse -Force
}

# 3. Instalacion express
Write-Host "[STEP 3] Instalacion rapida de dependencias..." -ForegroundColor Yellow
$installStart = Get-Date
npm install --production --no-optional --no-audit
$installEnd = Get-Date
$installTime = ($installEnd - $installStart).TotalSeconds

Write-Host "Dependencias instaladas en $([Math]::Round($installTime, 1)) segundos" -ForegroundColor Green

# 4. Verificacion rapida
Write-Host "[STEP 4] Verificacion de instalacion..." -ForegroundColor Yellow
if (Test-Path "node_modules") {
    $moduleCount = (Get-ChildItem "node_modules" -Directory).Count
    Write-Host "Modulos instalados: $moduleCount" -ForegroundColor Green
} else {
    Write-Host "ERROR: node_modules no creado" -ForegroundColor Red
    exit 1
}
```

---

## PASO 5: BUILD DE EMERGENCIA

### Construccion Rapida
```powershell
# emergency-build.ps1
Write-Host "=== BUILD DE EMERGENCIA ===" -ForegroundColor Red

# 1. Eliminar build anterior
Write-Host "[BUILD] Limpiando build anterior..." -ForegroundColor Yellow
if (Test-Path ".next") {
    Remove-Item ".next" -Recurse -Force
}

# 2. Build con modo de desarrollo rapido
Write-Host "[BUILD] Ejecutando build de emergencia..." -ForegroundColor Yellow
$buildStart = Get-Date

# Usar variable de entorno para build rapido
$env:NODE_ENV = "development"
$env:NEXT_BUILD_MODE = "development"

npm run build
$buildExitCode = $LASTEXITCODE

$buildEnd = Get-Date
$buildTime = ($buildEnd - $buildStart).TotalSeconds

if ($buildExitCode -eq 0) {
    Write-Host "Build completado en $([Math]::Round($buildTime, 1)) segundos" -ForegroundColor Green
    
    # Verificar tamano del build
    if (Test-Path ".next") {
        $buildSize = (Get-ChildItem ".next" -Recurse | Measure-Object Length -Sum).Sum / 1MB
        Write-Host "Tamano del build: $([Math]::Round($buildSize, 1)) MB" -ForegroundColor Cyan
    }
} else {
    Write-Host "ERROR: Build fallo (Exit Code: $buildExitCode)" -ForegroundColor Red
    Write-Host "Continuando con modo development sin build..." -ForegroundColor Yellow
}
```

---

## PASO 6: INICIO DEL SERVIDOR DE EMERGENCIA

### Servidor Express
```ascii
SERVIDOR DE EMERGENCIA - STARTUP SEQUENCE
┌─────────────────────────────────────────────────────────────┐
│ MODO: Development Server (npm run dev)                     │
│ PUERTO: 3000                                               │
│ TIMEOUT: 30 segundos para inicio                          │
│ HEALTH CHECK: Automatico cada 10 segundos                 │
└─────────────────────────────────────────────────────────────┘
```

```powershell
# emergency-server-start.ps1
Write-Host "=== INICIO DEL SERVIDOR DE EMERGENCIA ===" -ForegroundColor Red

# 1. Configurar variables de entorno de emergencia
Write-Host "[SERVER] Configurando variables de emergencia..." -ForegroundColor Yellow
$env:NODE_ENV = "development"
$env:PORT = "3000"

# 2. Iniciar servidor en background
Write-Host "[SERVER] Iniciando servidor Next.js..." -ForegroundColor Yellow
$serverJob = Start-Job -Name "PAES-EMERGENCY-SERVER" -ScriptBlock {
    Set-Location $using:PWD
    npm run dev
}

# 3. Monitoreo de inicio
Write-Host "[SERVER] Monitoreando inicio del servidor..." -ForegroundColor Yellow
$maxWaitTime = 30
$checkInterval = 2
$elapsed = 0

while ($elapsed -lt $maxWaitTime) {
    Start-Sleep -Seconds $checkInterval
    $elapsed += $checkInterval
    
    try {
        $response = Invoke-RestMethod -Uri "http://localhost:3000" -TimeoutSec 3 -ErrorAction Stop
        Write-Host "SERVIDOR INICIADO EXITOSAMENTE!" -ForegroundColor Green
        Write-Host "URL: http://localhost:3000" -ForegroundColor Cyan
        break
    } catch {
        Write-Host "Esperando servidor... ($elapsed/$maxWaitTime segundos)" -ForegroundColor Yellow
    }
}

if ($elapsed -ge $maxWaitTime) {
    Write-Host "TIMEOUT: Servidor no inicio en $maxWaitTime segundos" -ForegroundColor Red
    Write-Host "Verificar logs manualmente:" -ForegroundColor Yellow
    Write-Host "Get-Job -Name 'PAES-EMERGENCY-SERVER' | Receive-Job" -ForegroundColor Cyan
} else {
    # 4. Health check de API
    Write-Host "[SERVER] Verificando APIs..." -ForegroundColor Yellow
    $endpoints = @("/api/health", "/api/test-db")
    
    foreach ($endpoint in $endpoints) {
        try {
            $apiResponse = Invoke-RestMethod -Uri "http://localhost:3000$endpoint" -TimeoutSec 5
            Write-Host "API $endpoint: OK" -ForegroundColor Green
        } catch {
            Write-Host "API $endpoint: FAILED" -ForegroundColor Red
        }
    }
}
```

---

## PASO 7: MONITOREO BASICO DE EMERGENCIA

### Monitoreo Simplificado
```powershell
# emergency-monitoring.ps1
Write-Host "=== MONITOREO DE EMERGENCIA ===" -ForegroundColor Red

# 1. Crear job de monitoreo basico
Write-Host "[MONITOR] Iniciando monitoreo basico..." -ForegroundColor Yellow

$monitoringJob = Start-Job -Name "PAES-EMERGENCY-MONITOR" -ScriptBlock {
    while ($true) {
        $timestamp = Get-Date -Format "yyyy-MM-dd HH:mm:ss"
        
        # CPU y memoria
        $cpu = (Get-Counter "\Processor(_Total)\% Processor Time").CounterSamples.CookedValue
        $memory = Get-WmiObject -Class Win32_OperatingSystem
        $memoryUsed = [Math]::Round(($memory.TotalVisibleMemorySize - $memory.FreePhysicalMemory) / 1MB, 1)
        
        # Estado del servidor
        try {
            $serverCheck = Invoke-RestMethod -Uri "http://localhost:3000/api/health" -TimeoutSec 3
            $serverStatus = "OK"
        } catch {
            $serverStatus = "FAILED"
        }
        
        # Log basico
        $logEntry = "$timestamp | CPU: $([Math]::Round($cpu, 1))% | Memory: ${memoryUsed}GB | Server: $serverStatus"
        Write-Host $logEntry
        
        # Guardar en archivo
        Add-Content -Path "logs/emergency-monitor.log" -Value $logEntry
        
        Start-Sleep -Seconds 30
    }
}

Write-Host "Monitoreo de emergencia iniciado (Job ID: $($monitoringJob.Id))" -ForegroundColor Green
```

---

## PASO 8: VERIFICACION FINAL DEL SISTEMA

### Dashboard de Estado
```ascii
VERIFICACION FINAL - EMERGENCY DEPLOYMENT STATUS
┌─────────────────────────────────────────────────────────────┐
│                    DEPLOYMENT STATUS                        │
├─────────────────────────────────────────────────────────────┤
│ Next.js Server             [ CHECKING... ]                 │
│ API Endpoints              [ CHECKING... ]                 │
│ Database Connection        [ CHECKING... ]                 │
│ Emergency Monitoring       [ CHECKING... ]                 │
│ Log Files                  [ CHECKING... ]                 │
└─────────────────────────────────────────────────────────────┘
```

### Script de Verificacion Completa
```powershell
# emergency-final-check.ps1
Write-Host "=== VERIFICACION FINAL DEL SISTEMA ===" -ForegroundColor Red

$checks = @()

# 1. Verificar servidor Next.js
Write-Host "[CHECK] Verificando servidor Next.js..." -ForegroundColor Yellow
try {
    $serverResponse = Invoke-RestMethod -Uri "http://localhost:3000" -TimeoutSec 5
    $checks += @{Component = "Next.js Server"; Status = "OK"; Details = "Responde correctamente"}
    Write-Host "✓ Next.js Server: OK" -ForegroundColor Green
} catch {
    $checks += @{Component = "Next.js Server"; Status = "FAILED"; Details = $_.Exception.Message}
    Write-Host "✗ Next.js Server: FAILED" -ForegroundColor Red
}

# 2. Verificar APIs criticas
Write-Host "[CHECK] Verificando APIs criticas..." -ForegroundColor Yellow
$criticalApis = @("/api/health", "/api/test-db", "/api/chat")

foreach ($api in $criticalApis) {
    try {
        $apiResponse = Invoke-RestMethod -Uri "http://localhost:3000$api" -TimeoutSec 5
        $checks += @{Component = "API $api"; Status = "OK"; Details = "Responde correctamente"}
        Write-Host "✓ API $api: OK" -ForegroundColor Green
    } catch {
        $checks += @{Component = "API $api"; Status = "FAILED"; Details = $_.Exception.Message}
        Write-Host "✗ API $api: FAILED" -ForegroundColor Red
    }
}

# 3. Verificar jobs de monitoreo
Write-Host "[CHECK] Verificando jobs de monitoreo..." -ForegroundColor Yellow
$emergencyJobs = Get-Job | Where-Object {$_.Name -like "*EMERGENCY*"}
if ($emergencyJobs.Count -gt 0) {
    $checks += @{Component = "Emergency Monitoring"; Status = "OK"; Details = "$($emergencyJobs.Count) jobs activos"}
    Write-Host "✓ Emergency Monitoring: OK ($($emergencyJobs.Count) jobs)" -ForegroundColor Green
} else {
    $checks += @{Component = "Emergency Monitoring"; Status = "WARNING"; Details = "No hay jobs activos"}
    Write-Host "⚠ Emergency Monitoring: WARNING" -ForegroundColor Yellow
}

# 4. Verificar logs
Write-Host "[CHECK] Verificando logs..." -ForegroundColor Yellow
if (Test-Path "logs/emergency-monitor.log") {
    $logSize = (Get-Item "logs/emergency-monitor.log").Length
    $checks += @{Component = "Emergency Logs"; Status = "OK"; Details = "Log activo ($logSize bytes)"}
    Write-Host "✓ Emergency Logs: OK" -ForegroundColor Green
} else {
    $checks += @{Component = "Emergency Logs"; Status = "WARNING"; Details = "Log no encontrado"}
    Write-Host "⚠ Emergency Logs: WARNING" -ForegroundColor Yellow
}

# Generar reporte final
Write-Host "`n=== REPORTE FINAL DE EMERGENCIA ===" -ForegroundColor Cyan
$successCount = ($checks | Where-Object {$_.Status -eq "OK"}).Count
$totalChecks = $checks.Count
$successRate = [Math]::Round(($successCount / $totalChecks) * 100, 1)

Write-Host "Verificaciones exitosas: $successCount/$totalChecks ($successRate%)" -ForegroundColor Cyan

foreach ($check in $checks) {
    $color = switch ($check.Status) {
        "OK" { "Green" }
        "WARNING" { "Yellow" }
        "FAILED" { "Red" }
    }
    Write-Host "$($check.Component): $($check.Status) - $($check.Details)" -ForegroundColor $color
}

if ($successRate -gt 70) {
    Write-Host "`nDESPLIEGUE DE EMERGENCIA COMPLETADO CON EXITO" -ForegroundColor Green
    Write-Host "El sistema esta operacional en modo de emergencia" -ForegroundColor Green
} else {
    Write-Host "`nDESPLIEGUE DE EMERGENCIA REQUIERE ATENCION" -ForegroundColor Yellow
    Write-Host "Revisar componentes fallidos antes de uso en produccion" -ForegroundColor Yellow
}
```

---

## COMANDOS DE REFERENCIA RAPIDA

```ascii
COMANDOS DE EMERGENCIA - REFERENCIA RAPIDA
┌─────────────────────────────────────────────────────────────┐
│ EVALUACION                                                  │
│ powershell .\emergency-evaluation.ps1                      │
│                                                             │
│ LIMPIEZA                                                    │
│ powershell .\emergency-cleanup.ps1                         │
│                                                             │
│ INSTALACION                                                 │
│ powershell .\emergency-install.ps1                         │
│                                                             │
│ SERVIDOR                                                    │
│ powershell .\emergency-server-start.ps1                    │
│                                                             │
│ VERIFICACION                                                │
│ powershell .\emergency-final-check.ps1                     │
│                                                             │
│ MONITOREO                                                   │
│ Get-Job -Name "*EMERGENCY*" | Receive-Job                  │
└─────────────────────────────────────────────────────────────┘
```

---

## TIEMPOS ESTIMADOS

```ascii
TIEMPO DE RECUPERACION ESTIMADO
┌─────────────────────────────────────────────────────────────┐
│ Evaluacion del sistema         1-2 minutos                 │
│ Limpieza de procesos          30 segundos                  │
│ Verificacion de archivos      1 minuto                     │
│ Instalacion de dependencias   3-5 minutos                  │
│ Build de emergencia           2-3 minutos                  │
│ Inicio del servidor           30 segundos                  │
│ Verificacion final            1 minuto                     │
├─────────────────────────────────────────────────────────────┤
│ TIEMPO TOTAL ESTIMADO:        8-12 minutos                 │
└─────────────────────────────────────────────────────────────┘
```

---

## CONTACTOS DE EMERGENCIA

```ascii
ESCALACION EN CASO DE FALLO
┌─────────────────────────────────────────────────────────────┐
│ Administrador del Sistema:     [CONTACTO INTERNO]          │
│ Proveedor Supabase:           support@supabase.io          │
│ Hosting Provider:             [CONTACTO DEL PROVEEDOR]     │
│ Backup Repository:            [URL DEL REPOSITORIO GIT]    │
└─────────────────────────────────────────────────────────────┘
```

---

**Tutorial Version**: 1.0  
**Ultima Actualizacion**: Enero 2025  
**Tiempo de Ejecucion**: 8-12 minutos  
**Nivel de Dificultad**: Intermedio  
**Prerequisitos**: PowerShell, Node.js, Credenciales Supabase

Este tutorial garantiza la restauracion rapida del sistema PAES PRO en situaciones criticas, minimizando el tiempo de inactividad y asegurando la continuidad del servicio.
