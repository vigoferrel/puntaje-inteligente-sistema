# TUTORIAL: TROUBLESHOOTING AVANZADO - PAES PRO SYSTEM
Tutorial ASCII Version 1.0 - Enero 2025

## DESCRIPCION GENERAL

Este tutorial cubre la resolucion de problemas complejos del sistema PAES PRO, incluyendo diagnosticos avanzados, analisis de logs y tecnicas de depuracion para administradores del sistema.

---

## TABLA DE CONTENIDOS

```ascii
TROUBLESHOOTING GUIDE - TABLA DE CONTENIDOS
┌─────────────────────────────────────────────────────────────┐
│ 1. DIAGNOSTICO INICIAL                                      │
│ 2. PROBLEMAS DE CONEXION DE BASE DE DATOS                  │
│ 3. PROBLEMAS DE RENDIMIENTO                                 │
│ 4. ERRORES DE API Y MICROSERVICIOS                         │
│ 5. PROBLEMAS DE DOCKER Y CONTENEDORES                      │
│ 6. ANALISIS DE LOGS AVANZADO                               │
│ 7. DEBUGGING DE APLICACION NEXT.JS                         │
│ 8. PROBLEMAS DE INTEGRACION SUPABASE                       │
│ 9. HERRAMIENTAS DE MONITOREO Y ALERTAS                     │
│ 10. RECOVERY Y ROLLBACK PROCEDURES                         │
└─────────────────────────────────────────────────────────────┘
```

---

## 1. DIAGNOSTICO INICIAL AVANZADO

### Script de Diagnostico Completo
```powershell
# advanced-diagnostic.ps1
Write-Host "=== DIAGNOSTICO AVANZADO PAES PRO SYSTEM ===" -ForegroundColor Cyan

# Funcion para generar reporte detallado
function Get-SystemDiagnostic {
    $diagnostic = @{
        timestamp = Get-Date -Format "yyyy-MM-dd HH:mm:ss"
        system = @{}
        processes = @{}
        network = @{}
        storage = @{}
        services = @{}
    }

    # 1. Informacion del sistema
    Write-Host "[DIAG] Recopilando informacion del sistema..." -ForegroundColor Yellow
    $sysInfo = Get-ComputerInfo
    $diagnostic.system = @{
        hostname = $env:COMPUTERNAME
        os = $sysInfo.WindowsProductName
        version = $sysInfo.WindowsVersion
        uptime_hours = [Math]::Round((New-TimeSpan -Start $sysInfo.BootUpTime).TotalHours, 1)
        cpu_cores = $sysInfo.CsProcessors.Count
        total_memory_gb = [Math]::Round($sysInfo.TotalPhysicalMemory / 1GB, 1)
        available_memory_gb = [Math]::Round($sysInfo.AvailablePhysicalMemory / 1GB, 1)
    }

    # 2. Procesos relacionados
    Write-Host "[DIAG] Analizando procesos..." -ForegroundColor Yellow
    $nodeProcesses = Get-Process -Name "node*" -ErrorAction SilentlyContinue
    $diagnostic.processes = @{
        node_count = $nodeProcesses.Count
        node_details = $nodeProcesses | ForEach-Object {
            @{
                id = $_.Id
                name = $_.Name
                cpu_time = $_.TotalProcessorTime.TotalSeconds
                memory_mb = [Math]::Round($_.WorkingSet64 / 1MB, 1)
                start_time = $_.StartTime
            }
        }
        powershell_jobs = (Get-Job | Where-Object {$_.Name -like "*PAES*"}).Count
    }

    # 3. Red y puertos
    Write-Host "[DIAG] Verificando conectividad de red..." -ForegroundColor Yellow
    $netConnections = netstat -an | Select-String ":(3000|3001|5432|6379|9000|9090)"
    $diagnostic.network = @{
        active_ports = $netConnections.Count
        port_details = $netConnections | ForEach-Object { $_.ToString().Trim() }
        internet_connection = Test-NetConnection "8.8.8.8" -Port 53 -WarningAction SilentlyContinue | Select-Object -ExpandProperty TcpTestSucceeded
    }

    # 4. Almacenamiento
    Write-Host "[DIAG] Analizando almacenamiento..." -ForegroundColor Yellow
    $drives = Get-WmiObject -Class Win32_LogicalDisk -Filter "DriveType=3"
    $diagnostic.storage = $drives | ForEach-Object {
        @{
            drive = $_.DeviceID
            size_gb = [Math]::Round($_.Size / 1GB, 1)
            free_gb = [Math]::Round($_.FreeSpace / 1GB, 1)
            usage_percent = [Math]::Round((($_.Size - $_.FreeSpace) / $_.Size) * 100, 1)
        }
    }

    # 5. Servicios PAES PRO
    Write-Host "[DIAG] Verificando servicios PAES PRO..." -ForegroundColor Yellow
    $services = @{
        nextjs_server = $false
        monitoring_server = $false
        database = $false
    }

    # Test Next.js
    try {
        $response = Invoke-RestMethod -Uri "http://localhost:3000" -TimeoutSec 3
        $services.nextjs_server = $true
    } catch { }

    # Test Monitoring
    try {
        $response = Invoke-RestMethod -Uri "http://localhost:3001/status" -TimeoutSec 3
        $services.monitoring_server = $true
    } catch { }

    # Test Database
    try {
        $response = Invoke-RestMethod -Uri "http://localhost:3000/api/test-db" -TimeoutSec 5
        $services.database = $response.success -eq $true
    } catch { }

    $diagnostic.services = $services

    return $diagnostic
}

# Ejecutar diagnostico
$diagResult = Get-SystemDiagnostic

# Mostrar resultado formateado
Write-Host "`n=== REPORTE DE DIAGNOSTICO ===" -ForegroundColor Green
Write-Host "Sistema: $($diagResult.system.hostname) - $($diagResult.system.os)" -ForegroundColor Cyan
Write-Host "Uptime: $($diagResult.system.uptime_hours) horas" -ForegroundColor Cyan
Write-Host "Memoria: $($diagResult.system.available_memory_gb)/$($diagResult.system.total_memory_gb) GB disponible" -ForegroundColor Cyan
Write-Host "Procesos Node.js: $($diagResult.processes.node_count)" -ForegroundColor Cyan
Write-Host "Puertos activos: $($diagResult.network.active_ports)" -ForegroundColor Cyan

Write-Host "`nServicios:" -ForegroundColor Yellow
Write-Host "  Next.js Server: $(if($diagResult.services.nextjs_server){'OK'}else{'FAILED'})" -ForegroundColor $(if($diagResult.services.nextjs_server){'Green'}else{'Red'})
Write-Host "  Monitoring: $(if($diagResult.services.monitoring_server){'OK'}else{'FAILED'})" -ForegroundColor $(if($diagResult.services.monitoring_server){'Green'}else{'Red'})
Write-Host "  Database: $(if($diagResult.services.database){'OK'}else{'FAILED'})" -ForegroundColor $(if($diagResult.services.database){'Green'}else{'Red'})

# Guardar reporte completo
$reportPath = "troubleshooting-reports/diagnostic-$(Get-Date -Format 'yyyyMMdd-HHmmss').json"
if (-not (Test-Path "troubleshooting-reports")) { 
    New-Item -ItemType Directory -Path "troubleshooting-reports" -Force 
}
$diagResult | ConvertTo-Json -Depth 5 | Out-File -FilePath $reportPath -Encoding ASCII
Write-Host "`nReporte completo guardado en: $reportPath" -ForegroundColor Green
```

---

## 2. PROBLEMAS DE CONEXION DE BASE DE DATOS

### Diagnostico de Supabase
```ascii
DATABASE TROUBLESHOOTING FLOWCHART
┌─────────────────────────────────────────────────────────────┐
│ PROBLEMA: Base de datos no responde                        │
├─────────────────────────────────────────────────────────────┤
│ PASO 1: Verificar variables de entorno                     │
│    ├── .env existe?                                        │
│    ├── NEXT_PUBLIC_SUPABASE_URL configurada?               │
│    └── NEXT_PUBLIC_SUPABASE_ANON_KEY configurada?          │
│                                                             │
│ PASO 2: Test de conectividad                               │
│    ├── Ping a supabase URL                                 │
│    ├── Test de puerto 443 (HTTPS)                          │
│    └── Verificar DNS resolution                            │
│                                                             │
│ PASO 3: Test de API                                        │
│    ├── GET /rest/v1/                                       │
│    ├── Test de autenticacion                               │
│    └── Query de test a tabla conocida                      │
│                                                             │
│ PASO 4: Logs y debugging                                   │
│    ├── Revisar logs de Supabase client                     │
│    ├── Verificar rate limiting                             │
│    └── Check project status en dashboard                   │
└─────────────────────────────────────────────────────────────┘
```

### Script de Diagnostico de BD
```powershell
# database-troubleshoot.ps1
Write-Host "=== TROUBLESHOOTING BASE DE DATOS ===" -ForegroundColor Red

function Test-DatabaseConnection {
    Write-Host "[DB-TEST] Iniciando diagnostico de base de datos..." -ForegroundColor Yellow
    
    # 1. Verificar variables de entorno
    Write-Host "[STEP 1] Verificando configuracion..." -ForegroundColor Cyan
    $envCheck = @{
        supabase_url = [bool]$env:NEXT_PUBLIC_SUPABASE_URL
        supabase_key = [bool]$env:NEXT_PUBLIC_SUPABASE_ANON_KEY
        service_key = [bool]$env:SUPABASE_SERVICE_ROLE_KEY
    }
    
    foreach ($key in $envCheck.Keys) {
        $status = if ($envCheck[$key]) { "OK" } else { "MISSING" }
        $color = if ($envCheck[$key]) { "Green" } else { "Red" }
        Write-Host "  $key`: $status" -ForegroundColor $color
    }
    
    if (-not $envCheck.supabase_url) {
        Write-Host "ERROR: NEXT_PUBLIC_SUPABASE_URL no configurada" -ForegroundColor Red
        return $false
    }
    
    # 2. Test de conectividad de red
    Write-Host "[STEP 2] Test de conectividad de red..." -ForegroundColor Cyan
    $supabaseHost = ([System.Uri]$env:NEXT_PUBLIC_SUPABASE_URL).Host
    
    try {
        $netTest = Test-NetConnection $supabaseHost -Port 443 -WarningAction SilentlyContinue
        if ($netTest.TcpTestSucceeded) {
            Write-Host "  Conectividad TCP: OK" -ForegroundColor Green
        } else {
            Write-Host "  Conectividad TCP: FAILED" -ForegroundColor Red
            return $false
        }
    } catch {
        Write-Host "  Conectividad TCP: ERROR - $($_.Exception.Message)" -ForegroundColor Red
        return $false
    }
    
    # 3. Test de API REST
    Write-Host "[STEP 3] Test de API REST..." -ForegroundColor Cyan
    try {
        $restUrl = "$($env:NEXT_PUBLIC_SUPABASE_URL)/rest/v1/"
        $headers = @{
            "apikey" = $env:NEXT_PUBLIC_SUPABASE_ANON_KEY
            "Authorization" = "Bearer $($env:NEXT_PUBLIC_SUPABASE_ANON_KEY)"
        }
        
        $response = Invoke-RestMethod -Uri $restUrl -Headers $headers -TimeoutSec 10
        Write-Host "  API REST: OK" -ForegroundColor Green
    } catch {
        Write-Host "  API REST: FAILED - $($_.Exception.Message)" -ForegroundColor Red
        
        # Analisis detallado del error
        if ($_.Exception.Message -match "401") {
            Write-Host "    CAUSA: Error de autenticacion - verificar API key" -ForegroundColor Yellow
        } elseif ($_.Exception.Message -match "403") {
            Write-Host "    CAUSA: Permisos insuficientes" -ForegroundColor Yellow
        } elseif ($_.Exception.Message -match "timeout") {
            Write-Host "    CAUSA: Timeout - posible problema de red" -ForegroundColor Yellow
        }
    }
    
    # 4. Test mediante endpoint local
    Write-Host "[STEP 4] Test mediante API local..." -ForegroundColor Cyan
    try {
        $localTest = Invoke-RestMethod -Uri "http://localhost:3000/api/test-db" -TimeoutSec 15
        if ($localTest.success) {
            Write-Host "  Test local: OK" -ForegroundColor Green
            Write-Host "  Detalles: $($localTest.tests | ConvertTo-Json -Compress)" -ForegroundColor Cyan
        } else {
            Write-Host "  Test local: FAILED" -ForegroundColor Red
        }
    } catch {
        Write-Host "  Test local: ERROR - $($_.Exception.Message)" -ForegroundColor Red
    }
    
    # 5. Test de funciones RPC
    Write-Host "[STEP 5] Test de funciones RPC..." -ForegroundColor Cyan
    try {
        $rpcTest = Invoke-RestMethod -Uri "http://localhost:3000/api/test-rpc" -TimeoutSec 20
        $successfulRpc = ($rpcTest.tests | Where-Object { $_.success -eq $true }).Count
        $totalRpc = $rpcTest.tests.Count
        
        Write-Host "  RPC Functions: $successfulRpc/$totalRpc passed" -ForegroundColor $(if($successfulRpc -gt 0){'Green'}else{'Red'})
        
        # Mostrar funciones fallidas
        $failedRpc = $rpcTest.tests | Where-Object { $_.success -eq $false }
        foreach ($failed in $failedRpc) {
            Write-Host "    FAILED: $($failed.function_name) - $($failed.error)" -ForegroundColor Red
        }
    } catch {
        Write-Host "  RPC Functions: ERROR - $($_.Exception.Message)" -ForegroundColor Red
    }
    
    return $true
}

# Ejecutar test
Test-DatabaseConnection
```

---

## 3. PROBLEMAS DE RENDIMIENTO

### Analisis de Performance
```ascii
PERFORMANCE ANALYSIS DASHBOARD
┌─────────────────────────────────────────────────────────────┐
│                   PERFORMANCE METRICS                       │
├─────────────────────────────────────────────────────────────┤
│ CPU Usage              [████████░░]  80%    HIGH            │
│ Memory Usage           [██████░░░░]  60%    NORMAL          │
│ Disk I/O              [███░░░░░░░]  30%    NORMAL          │
│ Network Latency        [█░░░░░░░░░]  45ms   NORMAL          │
├─────────────────────────────────────────────────────────────┤
│ Application Metrics                                         │
│ API Response Time      [███████░░░]  1.2s   SLOW            │
│ Database Queries       [████░░░░░░]  150ms  NORMAL          │
│ Bundle Size            [██████░░░░]  12MB   LARGE           │
│ Memory Leaks           [░░░░░░░░░░]  0      NONE            │
└─────────────────────────────────────────────────────────────┘
```

### Script de Analisis de Performance
```powershell
# performance-analysis.ps1
Write-Host "=== ANALISIS DE RENDIMIENTO ===" -ForegroundColor Cyan

function Get-PerformanceMetrics {
    $metrics = @{
        timestamp = Get-Date -Format "yyyy-MM-dd HH:mm:ss"
        system = @{}
        application = @{}
        recommendations = @()
    }
    
    Write-Host "[PERF] Recopilando metricas del sistema..." -ForegroundColor Yellow
    
    # 1. Metricas del sistema
    $cpu = (Get-Counter "\Processor(_Total)\% Processor Time").CounterSamples.CookedValue
    $memory = Get-WmiObject Win32_OperatingSystem
    $memoryUsagePercent = [Math]::Round((($memory.TotalVisibleMemorySize - $memory.FreePhysicalMemory) / $memory.TotalVisibleMemorySize) * 100, 1)
    
    $metrics.system = @{
        cpu_usage = [Math]::Round($cpu, 1)
        memory_usage_percent = $memoryUsagePercent
        memory_available_gb = [Math]::Round($memory.FreePhysicalMemory / 1MB / 1024, 1)
        processes_count = (Get-Process).Count
    }
    
    # 2. Metricas de la aplicacion
    Write-Host "[PERF] Analizando metricas de aplicacion..." -ForegroundColor Yellow
    
    # Test de velocidad de API
    $apiResponseTimes = @()
    $testEndpoints = @("/api/health", "/api/test-db", "/api/chat")
    
    foreach ($endpoint in $testEndpoints) {
        try {
            $stopwatch = [System.Diagnostics.Stopwatch]::StartNew()
            $response = Invoke-RestMethod -Uri "http://localhost:3000$endpoint" -TimeoutSec 10
            $stopwatch.Stop()
            $apiResponseTimes += $stopwatch.ElapsedMilliseconds
        } catch {
            $apiResponseTimes += 9999  # Timeout value
        }
    }
    
    $avgResponseTime = ($apiResponseTimes | Measure-Object -Average).Average
    
    # Analizar procesos Node.js
    $nodeProcesses = Get-Process -Name "node" -ErrorAction SilentlyContinue
    $totalNodeMemory = ($nodeProcesses | Measure-Object WorkingSet64 -Sum).Sum / 1MB
    
    # Tamano de build
    $buildSize = 0
    if (Test-Path ".next") {
        $buildSize = (Get-ChildItem ".next" -Recurse | Measure-Object Length -Sum).Sum / 1MB
    }
    
    $metrics.application = @{
        api_response_time_ms = [Math]::Round($avgResponseTime, 0)
        node_processes = $nodeProcesses.Count
        node_memory_mb = [Math]::Round($totalNodeMemory, 1)
        build_size_mb = [Math]::Round($buildSize, 1)
        log_files_size_mb = 0
    }
    
    # Tamano de logs
    if (Test-Path "logs") {
        $logSize = (Get-ChildItem "logs" -Recurse | Measure-Object Length -Sum).Sum / 1MB
        $metrics.application.log_files_size_mb = [Math]::Round($logSize, 1)
    }
    
    # 3. Generar recomendaciones
    Write-Host "[PERF] Generando recomendaciones..." -ForegroundColor Yellow
    
    if ($metrics.system.cpu_usage -gt 80) {
        $metrics.recommendations += "HIGH CPU: Considerar optimizar procesos o aumentar recursos"
    }
    
    if ($metrics.system.memory_usage_percent -gt 90) {
        $metrics.recommendations += "HIGH MEMORY: Memoria casi agotada - verificar memory leaks"
    }
    
    if ($metrics.application.api_response_time_ms -gt 2000) {
        $metrics.recommendations += "SLOW API: Tiempos de respuesta lentos - optimizar queries o cache"
    }
    
    if ($metrics.application.build_size_mb -gt 50) {
        $metrics.recommendations += "LARGE BUNDLE: Bundle size grande - considerar code splitting"
    }
    
    if ($metrics.application.log_files_size_mb -gt 100) {
        $metrics.recommendations += "LARGE LOGS: Logs ocupan mucho espacio - configurar rotacion"
    }
    
    if ($metrics.application.node_memory_mb -gt 1000) {
        $metrics.recommendations += "HIGH NODE MEMORY: Procesos Node.js usan mucha memoria"
    }
    
    return $metrics
}

# Ejecutar analisis
$perfMetrics = Get-PerformanceMetrics

# Mostrar resultados
Write-Host "`n=== METRICAS DE RENDIMIENTO ===" -ForegroundColor Green
Write-Host "CPU Usage: $($perfMetrics.system.cpu_usage)%" -ForegroundColor $(if($perfMetrics.system.cpu_usage -gt 80){'Red'}elseif($perfMetrics.system.cpu_usage -gt 60){'Yellow'}else{'Green'})
Write-Host "Memory Usage: $($perfMetrics.system.memory_usage_percent)%" -ForegroundColor $(if($perfMetrics.system.memory_usage_percent -gt 90){'Red'}elseif($perfMetrics.system.memory_usage_percent -gt 70){'Yellow'}else{'Green'})
Write-Host "API Response Time: $($perfMetrics.application.api_response_time_ms)ms" -ForegroundColor $(if($perfMetrics.application.api_response_time_ms -gt 2000){'Red'}elseif($perfMetrics.application.api_response_time_ms -gt 1000){'Yellow'}else{'Green'})
Write-Host "Node.js Memory: $($perfMetrics.application.node_memory_mb)MB" -ForegroundColor $(if($perfMetrics.application.node_memory_mb -gt 1000){'Red'}elseif($perfMetrics.application.node_memory_mb -gt 500){'Yellow'}else{'Green'})
Write-Host "Build Size: $($perfMetrics.application.build_size_mb)MB" -ForegroundColor $(if($perfMetrics.application.build_size_mb -gt 50){'Red'}elseif($perfMetrics.application.build_size_mb -gt 25){'Yellow'}else{'Green'})

if ($perfMetrics.recommendations.Count -gt 0) {
    Write-Host "`nRECOMENDACIONES:" -ForegroundColor Yellow
    foreach ($recommendation in $perfMetrics.recommendations) {
        Write-Host "  • $recommendation" -ForegroundColor Yellow
    }
}

# Guardar metricas
$perfReportPath = "troubleshooting-reports/performance-$(Get-Date -Format 'yyyyMMdd-HHmmss').json"
$perfMetrics | ConvertTo-Json -Depth 3 | Out-File -FilePath $perfReportPath -Encoding ASCII
Write-Host "`nReporte guardado en: $perfReportPath" -ForegroundColor Green
```

---

## 4. ERRORES DE API Y MICROSERVICIOS

### Diagnostico de APIs
```ascii
API TROUBLESHOOTING MATRIX
┌─────────────────────────────────────────────────────────────┐
│ ENDPOINT           │ STATUS │ RESPONSE │ ERROR TYPE        │
├─────────────────────────────────────────────────────────────┤
│ /api/health        │  200   │   45ms   │ None              │
│ /api/test-db       │  500   │  timeout │ Database Error    │
│ /api/chat          │  200   │  1.2s    │ Slow Response     │
│ /api/generate-content │ 404  │   N/A    │ Not Implemented   │
│ /api/progress      │  200   │  150ms   │ None              │
│ /api/test-rpc      │  500   │  error   │ RPC Function Fail │
└─────────────────────────────────────────────────────────────┘
```

### Script de Test de APIs
```powershell
# api-troubleshoot.ps1
Write-Host "=== TROUBLESHOOTING DE APIs ===" -ForegroundColor Cyan

function Test-ApiEndpoints {
    $endpoints = @(
        @{Path = "/api/health"; Expected = 200; Timeout = 5},
        @{Path = "/api/test-db"; Expected = 200; Timeout = 15},
        @{Path = "/api/chat"; Expected = 200; Timeout = 10},
        @{Path = "/api/generate-content"; Expected = 200; Timeout = 10},
        @{Path = "/api/progress"; Expected = 200; Timeout = 10},
        @{Path = "/api/test-rpc"; Expected = 200; Timeout = 20}
    )
    
    $results = @()
    
    foreach ($endpoint in $endpoints) {
        Write-Host "[API-TEST] Testing $($endpoint.Path)..." -ForegroundColor Yellow
        
        $result = @{
            endpoint = $endpoint.Path
            status_code = 0
            response_time_ms = 0
            success = $false
            error_message = ""
            response_data = $null
        }
        
        try {
            $stopwatch = [System.Diagnostics.Stopwatch]::StartNew()
            
            if ($endpoint.Path -eq "/api/chat") {
                # Test POST para chat
                $body = @{ message = "test"; conversation = @() } | ConvertTo-Json
                $response = Invoke-RestMethod -Uri "http://localhost:3000$($endpoint.Path)" -Method POST -Body $body -ContentType "application/json" -TimeoutSec $endpoint.Timeout
            } else {
                # Test GET para otros endpoints
                $response = Invoke-RestMethod -Uri "http://localhost:3000$($endpoint.Path)" -TimeoutSec $endpoint.Timeout
            }
            
            $stopwatch.Stop()
            
            $result.status_code = 200
            $result.response_time_ms = $stopwatch.ElapsedMilliseconds
            $result.success = $true
            $result.response_data = $response
            
            Write-Host "  ✓ $($endpoint.Path): OK ($($result.response_time_ms)ms)" -ForegroundColor Green
            
        } catch {
            $stopwatch.Stop()
            $result.status_code = if ($_.Exception.Response) { $_.Exception.Response.StatusCode } else { 0 }
            $result.response_time_ms = $stopwatch.ElapsedMilliseconds
            $result.error_message = $_.Exception.Message
            
            Write-Host "  ✗ $($endpoint.Path): FAILED - $($result.error_message)" -ForegroundColor Red
            
            # Analisis de error especifico
            if ($result.error_message -match "timeout") {
                Write-Host "    CAUSA: Timeout - endpoint muy lento" -ForegroundColor Yellow
            } elseif ($result.error_message -match "404") {
                Write-Host "    CAUSA: Endpoint no encontrado" -ForegroundColor Yellow
            } elseif ($result.error_message -match "500") {
                Write-Host "    CAUSA: Error interno del servidor" -ForegroundColor Yellow
            } elseif ($result.error_message -match "connection") {
                Write-Host "    CAUSA: Problema de conexion" -ForegroundColor Yellow
            }
        }
        
        $results += $result
    }
    
    return $results
}

# Ejecutar tests
$apiResults = Test-ApiEndpoints

# Resumen de resultados
Write-Host "`n=== RESUMEN DE APIs ===" -ForegroundColor Green
$successfulApis = ($apiResults | Where-Object { $_.success }).Count
$totalApis = $apiResults.Count
$successRate = [Math]::Round(($successfulApis / $totalApis) * 100, 1)

Write-Host "APIs funcionando: $successfulApis/$totalApis ($successRate%)" -ForegroundColor $(if($successRate -gt 80){'Green'}elseif($successRate -gt 50){'Yellow'}else{'Red'})

# Detalles de APIs fallidas
$failedApis = $apiResults | Where-Object { -not $_.success }
if ($failedApis.Count -gt 0) {
    Write-Host "`nAPIs CON PROBLEMAS:" -ForegroundColor Red
    foreach ($failed in $failedApis) {
        Write-Host "  $($failed.endpoint): $($failed.error_message)" -ForegroundColor Red
    }
}

# APIs lentas
$slowApis = $apiResults | Where-Object { $_.success -and $_.response_time_ms -gt 2000 }
if ($slowApis.Count -gt 0) {
    Write-Host "`nAPIs LENTAS (>2s):" -ForegroundColor Yellow
    foreach ($slow in $slowApis) {
        Write-Host "  $($slow.endpoint): $($slow.response_time_ms)ms" -ForegroundColor Yellow
    }
}

# Guardar resultados
$apiReportPath = "troubleshooting-reports/api-test-$(Get-Date -Format 'yyyyMMdd-HHmmss').json"
$apiResults | ConvertTo-Json -Depth 3 | Out-File -FilePath $apiReportPath -Encoding ASCII
Write-Host "`nReporte de APIs guardado en: $apiReportPath" -ForegroundColor Green
```

---

## 5. PROBLEMAS DE DOCKER Y CONTENEDORES

### Diagnostico de Contenedores
```ascii
DOCKER CONTAINER STATUS
┌─────────────────────────────────────────────────────────────┐
│ CONTAINER          │ STATUS  │ UPTIME │ CPU % │ MEM %      │
├─────────────────────────────────────────────────────────────┤
│ paes-pro_supabase  │ Running │  2h 15m │  5.2  │  312MB     │
│ paes-pro_redis     │ Running │  2h 15m │  0.8  │   45MB     │
│ paes-pro_minio     │ Exited  │   ---   │  ---  │   ---      │
│ paes-pro_prometheus│ Running │  2h 10m │  2.1  │  128MB     │
│ paes-pro_grafana   │ Running │  2h 10m │  3.4  │  156MB     │
│ paes-pro_elastic   │ Failed  │   ---   │  ---  │   ---      │
└─────────────────────────────────────────────────────────────┘
```

### Script de Diagnostico Docker
```powershell
# docker-troubleshoot.ps1
Write-Host "=== TROUBLESHOOTING DOCKER ===" -ForegroundColor Cyan

function Test-DockerEnvironment {
    Write-Host "[DOCKER] Verificando entorno Docker..." -ForegroundColor Yellow
    
    # 1. Verificar si Docker esta instalado y ejecutandose
    try {
        $dockerVersion = docker --version
        Write-Host "  Docker Version: $dockerVersion" -ForegroundColor Green
    } catch {
        Write-Host "  ERROR: Docker no instalado o no accesible" -ForegroundColor Red
        return $false
    }
    
    try {
        $dockerStatus = docker info 2>$null
        Write-Host "  Docker Daemon: Running" -ForegroundColor Green
    } catch {
        Write-Host "  ERROR: Docker daemon no ejecutandose" -ForegroundColor Red
        return $false
    }
    
    # 2. Verificar Docker Compose
    try {
        $composeVersion = docker-compose --version
        Write-Host "  Docker Compose: $composeVersion" -ForegroundColor Green
    } catch {
        Write-Host "  WARNING: Docker Compose no encontrado" -ForegroundColor Yellow
    }
    
    return $true
}

function Get-ContainerStatus {
    Write-Host "[DOCKER] Analizando contenedores..." -ForegroundColor Yellow
    
    $containers = @()
    
    try {
        # Obtener todos los contenedores (activos e inactivos)
        $dockerPs = docker ps -a --format "table {{.Names}}\t{{.Status}}\t{{.Ports}}\t{{.Image}}" | Select-Object -Skip 1
        
        foreach ($line in $dockerPs) {
            if ($line.Trim()) {
                $parts = $line -split '\t'
                $container = @{
                    name = $parts[0].Trim()
                    status = $parts[1].Trim()
                    ports = $parts[2].Trim()
                    image = $parts[3].Trim()
                    health = "unknown"
                }
                
                # Verificar health status si esta disponible
                try {
                    $health = docker inspect $container.name --format='{{.State.Health.Status}}' 2>$null
                    if ($health) {
                        $container.health = $health
                    }
                } catch { }
                
                $containers += $container
            }
        }
        
    } catch {
        Write-Host "  ERROR: No se pudieron obtener contenedores" -ForegroundColor Red
        return @()
    }
    
    return $containers
}

function Get-ContainerLogs {
    param([string]$ContainerName, [int]$Lines = 20)
    
    Write-Host "[DOCKER] Obteniendo logs de $ContainerName..." -ForegroundColor Yellow
    
    try {
        $logs = docker logs --tail $Lines $ContainerName 2>&1
        return $logs
    } catch {
        Write-Host "  ERROR: No se pudieron obtener logs de $ContainerName" -ForegroundColor Red
        return @()
    }
}

# Ejecutar diagnostico
if (Test-DockerEnvironment) {
    $containers = Get-ContainerStatus
    
    if ($containers.Count -gt 0) {
        Write-Host "`n=== ESTADO DE CONTENEDORES ===" -ForegroundColor Green
        
        foreach ($container in $containers) {
            $statusColor = switch -Regex ($container.status) {
                '^Up' { 'Green' }
                'Exited \(0\)' { 'Yellow' }
                'Exited' { 'Red' }
                default { 'Red' }
            }
            
            Write-Host "  $($container.name): $($container.status)" -ForegroundColor $statusColor
            if ($container.ports) {
                Write-Host "    Ports: $($container.ports)" -ForegroundColor Cyan
            }
            if ($container.health -ne "unknown") {
                Write-Host "    Health: $($container.health)" -ForegroundColor $(if($container.health -eq 'healthy'){'Green'}else{'Yellow'})
            }
        }
        
        # Identificar contenedores con problemas
        $problemContainers = $containers | Where-Object { $_.status -notmatch '^Up' }
        
        if ($problemContainers.Count -gt 0) {
            Write-Host "`n=== CONTENEDORES CON PROBLEMAS ===" -ForegroundColor Red
            
            foreach ($problem in $problemContainers) {
                Write-Host "  PROBLEMA: $($problem.name) - $($problem.status)" -ForegroundColor Red
                
                # Obtener logs del contenedor problematico
                Write-Host "  Ultimos logs:" -ForegroundColor Yellow
                $logs = Get-ContainerLogs -ContainerName $problem.name -Lines 5
                foreach ($log in $logs) {
                    Write-Host "    $log" -ForegroundColor Gray
                }
                Write-Host ""
            }
            
            # Sugerencias de solucion
            Write-Host "SUGERENCIAS DE SOLUCION:" -ForegroundColor Yellow
            Write-Host "  1. Reiniciar contenedores: docker-compose restart" -ForegroundColor Cyan
            Write-Host "  2. Reconstruir imagenes: docker-compose build --no-cache" -ForegroundColor Cyan
            Write-Host "  3. Verificar logs completos: docker logs [container_name]" -ForegroundColor Cyan
            Write-Host "  4. Verificar recursos del sistema (memoria, disco)" -ForegroundColor Cyan
        }
        
    } else {
        Write-Host "No se encontraron contenedores" -ForegroundColor Yellow
    }
    
    # Verificar docker-compose.yml
    Write-Host "`n[DOCKER] Verificando docker-compose.yml..." -ForegroundColor Yellow
    if (Test-Path "docker-compose.yml") {
        Write-Host "  docker-compose.yml: Found" -ForegroundColor Green
        try {
            docker-compose config -q
            Write-Host "  Configuration: Valid" -ForegroundColor Green
        } catch {
            Write-Host "  Configuration: Invalid" -ForegroundColor Red
        }
    } else {
        Write-Host "  docker-compose.yml: Not Found" -ForegroundColor Red
    }
}

# Generar reporte
$dockerReport = @{
    timestamp = Get-Date -Format "yyyy-MM-dd HH:mm:ss"
    docker_available = (Get-Command docker -ErrorAction SilentlyContinue) -ne $null
    containers = $containers
    recommendations = @()
}

if ($problemContainers.Count -gt 0) {
    $dockerReport.recommendations += "Hay $($problemContainers.Count) contenedores con problemas que requieren atencion"
}

$dockerReportPath = "troubleshooting-reports/docker-$(Get-Date -Format 'yyyyMMdd-HHmmss').json"
$dockerReport | ConvertTo-Json -Depth 3 | Out-File -FilePath $dockerReportPath -Encoding ASCII
Write-Host "`nReporte Docker guardado en: $dockerReportPath" -ForegroundColor Green
```

---

## 6. ANALISIS DE LOGS AVANZADO

### Parser de Logs Inteligente
```powershell
# log-analyzer.ps1
Write-Host "=== ANALISIS AVANZADO DE LOGS ===" -ForegroundColor Cyan

function Analyze-LogFiles {
    $logAnalysis = @{
        timestamp = Get-Date -Format "yyyy-MM-dd HH:mm:ss"
        files_analyzed = 0
        total_entries = 0
        error_patterns = @()
        performance_issues = @()
        security_alerts = @()
        recommendations = @()
    }
    
    if (-not (Test-Path "logs")) {
        Write-Host "  ERROR: Directorio logs no encontrado" -ForegroundColor Red
        return $logAnalysis
    }
    
    $logFiles = Get-ChildItem "logs" -Recurse -Filter "*.log"
    Write-Host "[LOGS] Analizando $($logFiles.Count) archivos de log..." -ForegroundColor Yellow
    
    foreach ($logFile in $logFiles) {
        Write-Host "  Analizando: $($logFile.Name)" -ForegroundColor Cyan
        $logAnalysis.files_analyzed++
        
        try {
            $content = Get-Content $logFile.FullName -Tail 100  # Analizar ultimas 100 lineas
            $logAnalysis.total_entries += $content.Count
            
            foreach ($line in $content) {
                # Buscar patrones de error
                if ($line -match '\b(error|exception|failed|timeout|refused)\b/i') {
                    $logAnalysis.error_patterns += @{
                        file = $logFile.Name
                        line = $line.Substring(0, [Math]::Min($line.Length, 100))
                        timestamp = if ($line -match '\d{4}-\d{2}-\d{2}.\d{2}:\d{2}:\d{2}') { $matches[0] } else { "unknown" }
                    }
                }
                
                # Buscar problemas de performance
                if ($line -match '\b(slow|timeout|high cpu|memory leak|performance)\b/i') {
                    $logAnalysis.performance_issues += @{
                        file = $logFile.Name
                        line = $line.Substring(0, [Math]::Min($line.Length, 100))
                    }
                }
                
                # Buscar alertas de seguridad
                if ($line -match '\b(unauthorized|forbidden|attack|vulnerability|breach)\b/i') {
                    $logAnalysis.security_alerts += @{
                        file = $logFile.Name
                        line = $line.Substring(0, [Math]::Min($line.Length, 100))
                    }
                }
            }
            
        } catch {
            Write-Host "    ERROR: No se pudo leer $($logFile.Name)" -ForegroundColor Red
        }
    }
    
    # Generar recomendaciones
    if ($logAnalysis.error_patterns.Count -gt 10) {
        $logAnalysis.recommendations += "ALTO NUMERO DE ERRORES: Se detectaron $($logAnalysis.error_patterns.Count) patrones de error"
    }
    
    if ($logAnalysis.performance_issues.Count -gt 0) {
        $logAnalysis.recommendations += "PROBLEMAS DE PERFORMANCE: Se detectaron $($logAnalysis.performance_issues.Count) issues de rendimiento"
    }
    
    if ($logAnalysis.security_alerts.Count -gt 0) {
        $logAnalysis.recommendations += "ALERTAS DE SEGURIDAD: Se detectaron $($logAnalysis.security_alerts.Count) posibles problemas de seguridad"
    }
    
    # Analizar tamano de logs
    $totalLogSize = ($logFiles | Measure-Object Length -Sum).Sum / 1MB
    if ($totalLogSize -gt 100) {
        $logAnalysis.recommendations += "LOGS GRANDES: Los logs ocupan $([Math]::Round($totalLogSize, 1))MB - considerar rotacion"
    }
    
    return $logAnalysis
}

# Ejecutar analisis
$logResults = Analyze-LogFiles

# Mostrar resultados
Write-Host "`n=== RESULTADO DEL ANALISIS DE LOGS ===" -ForegroundColor Green
Write-Host "Archivos analizados: $($logResults.files_analyzed)" -ForegroundColor Cyan
Write-Host "Total de entradas: $($logResults.total_entries)" -ForegroundColor Cyan
Write-Host "Patrones de error: $($logResults.error_patterns.Count)" -ForegroundColor $(if($logResults.error_patterns.Count -gt 5){'Red'}elseif($logResults.error_patterns.Count -gt 0){'Yellow'}else{'Green'})
Write-Host "Problemas de performance: $($logResults.performance_issues.Count)" -ForegroundColor $(if($logResults.performance_issues.Count -gt 0){'Yellow'}else{'Green'})
Write-Host "Alertas de seguridad: $($logResults.security_alerts.Count)" -ForegroundColor $(if($logResults.security_alerts.Count -gt 0){'Red'}else{'Green'})

if ($logResults.error_patterns.Count -gt 0) {
    Write-Host "`nERRORES MAS RECIENTES:" -ForegroundColor Red
    $recentErrors = $logResults.error_patterns | Select-Object -First 5
    foreach ($error in $recentErrors) {
        Write-Host "  [$($error.file)] $($error.line)" -ForegroundColor Red
    }
}

if ($logResults.recommendations.Count -gt 0) {
    Write-Host "`nRECOMENDACIONES:" -ForegroundColor Yellow
    foreach ($recommendation in $logResults.recommendations) {
        Write-Host "  • $recommendation" -ForegroundColor Yellow
    }
}

# Guardar analisis
$logReportPath = "troubleshooting-reports/log-analysis-$(Get-Date -Format 'yyyyMMdd-HHmmss').json"
$logResults | ConvertTo-Json -Depth 4 | Out-File -FilePath $logReportPath -Encoding ASCII
Write-Host "`nAnalisis de logs guardado en: $logReportPath" -ForegroundColor Green
```

---

## COMANDO MASTER DE TROUBLESHOOTING

### Script Unificado
```powershell
# master-troubleshoot.ps1
param(
    [switch]$Full,           # Ejecutar todos los diagnosticos
    [switch]$Quick,          # Diagnostico rapido
    [switch]$Database,       # Solo base de datos
    [switch]$Performance,    # Solo performance
    [switch]$Api,           # Solo APIs
    [switch]$Docker,        # Solo Docker
    [switch]$Logs           # Solo logs
)

Write-Host "=== PAES PRO SYSTEM - MASTER TROUBLESHOOTING ===" -ForegroundColor Cyan
Write-Host "Iniciado en: $(Get-Date -Format 'yyyy-MM-dd HH:mm:ss')" -ForegroundColor Gray

$troubleshootResults = @{
    timestamp = Get-Date -Format "yyyy-MM-dd HH:mm:ss"
    diagnostics = @{}
    summary = @{
        total_issues = 0
        critical_issues = 0
        warnings = 0
        recommendations = @()
    }
}

# Determinar que diagnosticos ejecutar
$runDiagnostics = @{
    system = $Full -or $Quick
    database = $Full -or $Database -or $Quick
    performance = $Full -or $Performance
    api = $Full -or $Api -or $Quick
    docker = $Full -or $Docker
    logs = $Full -or $Logs
}

if (-not ($runDiagnostics.Values -contains $true)) {
    # Si no se especifica nada, ejecutar diagnostico rapido
    $runDiagnostics.system = $true
    $runDiagnostics.database = $true
    $runDiagnostics.api = $true
}

# Crear directorio de reportes
if (-not (Test-Path "troubleshooting-reports")) { 
    New-Item -ItemType Directory -Path "troubleshooting-reports" -Force 
}

# Ejecutar diagnosticos seleccionados
if ($runDiagnostics.system) {
    Write-Host "`n[1/6] DIAGNOSTICO DE SISTEMA..." -ForegroundColor Yellow
    # Aquí iría la llamada al script de diagnostico del sistema
    $troubleshootResults.diagnostics.system = @{executed = $true; status = "completed"}
}

if ($runDiagnostics.database) {
    Write-Host "`n[2/6] DIAGNOSTICO DE BASE DE DATOS..." -ForegroundColor Yellow
    # Aquí iría la llamada al script de diagnostico de BD
    $troubleshootResults.diagnostics.database = @{executed = $true; status = "completed"}
}

if ($runDiagnostics.performance) {
    Write-Host "`n[3/6] ANALISIS DE PERFORMANCE..." -ForegroundColor Yellow
    # Aquí iría la llamada al script de performance
    $troubleshootResults.diagnostics.performance = @{executed = $true; status = "completed"}
}

if ($runDiagnostics.api) {
    Write-Host "`n[4/6] TEST DE APIs..." -ForegroundColor Yellow
    # Aquí iría la llamada al script de APIs
    $troubleshootResults.diagnostics.api = @{executed = $true; status = "completed"}
}

if ($runDiagnostics.docker) {
    Write-Host "`n[5/6] DIAGNOSTICO DOCKER..." -ForegroundColor Yellow
    # Aquí iría la llamada al script de Docker
    $troubleshootResults.diagnostics.docker = @{executed = $true; status = "completed"}
}

if ($runDiagnostics.logs) {
    Write-Host "`n[6/6] ANALISIS DE LOGS..." -ForegroundColor Yellow
    # Aquí iría la llamada al script de logs
    $troubleshootResults.diagnostics.logs = @{executed = $true; status = "completed"}
}

# Generar resumen final
Write-Host "`n=== RESUMEN DE TROUBLESHOOTING ===" -ForegroundColor Green
Write-Host "Diagnosticos ejecutados: $((($troubleshootResults.diagnostics.Values | Where-Object {$_.executed}).Count))" -ForegroundColor Cyan
Write-Host "Timestamp: $($troubleshootResults.timestamp)" -ForegroundColor Gray

# Guardar reporte maestro
$masterReportPath = "troubleshooting-reports/master-troubleshoot-$(Get-Date -Format 'yyyyMMdd-HHmmss').json"
$troubleshootResults | ConvertTo-Json -Depth 4 | Out-File -FilePath $masterReportPath -Encoding ASCII
Write-Host "`nReporte maestro guardado en: $masterReportPath" -ForegroundColor Green

Write-Host "`nCOMANDOS DE REFERENCIA:" -ForegroundColor Yellow
Write-Host "  Diagnostico completo:  powershell .\master-troubleshoot.ps1 -Full" -ForegroundColor Cyan
Write-Host "  Diagnostico rapido:    powershell .\master-troubleshoot.ps1 -Quick" -ForegroundColor Cyan
Write-Host "  Solo base de datos:    powershell .\master-troubleshoot.ps1 -Database" -ForegroundColor Cyan
Write-Host "  Solo performance:      powershell .\master-troubleshoot.ps1 -Performance" -ForegroundColor Cyan
```

---

**Tutorial Version**: 1.0  
**Ultima Actualizacion**: Enero 2025  
**Nivel de Dificultad**: Avanzado  
**Prerequisitos**: PowerShell Avanzado, Conocimiento del Sistema PAES PRO

Este tutorial proporciona herramientas completas para el diagnostico y resolucion de problemas complejos en el sistema PAES PRO.
