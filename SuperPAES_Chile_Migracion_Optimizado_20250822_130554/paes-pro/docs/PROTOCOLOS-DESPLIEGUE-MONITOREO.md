# PROTOCOLOS DE DESPLIEGUE, MONITOREO Y ACTUALIZACION - PAES PRO SYSTEM
Documentacion Version 1.0 - Enero 2025

## RESUMEN EJECUTIVO

Este documento define los protocolos estandarizados para el despliegue, monitoreo y mantenimiento del sistema PAES PRO, incluyendo la gestion de contenedores Docker, aplicacion Next.js y microservicios asociados.

---

## 1. PROTOCOLO DE DESPLIEGUE

### 1.1 DESPLIEGUE DE APLICACION NEXT.JS

#### Pre-requisitos
```powershell
# Verificar Node.js y dependencias
node --version              # >= 18.0.0
npm --version               # >= 9.0.0
Get-Location                # Confirmar directorio del proyecto
```

#### Proceso de Despliegue de Desarrollo
```ascii
DESARROLLO LOCAL - FLUJO DE DESPLIEGUE
┌─────────────────────────────────────────────────────────────┐
│ PASO 1: PREPARACION DEL ENTORNO                            │
├─────────────────────────────────────────────────────────────┤
│ ▪ Verificar variables de entorno (.env, .env.local)        │
│ ▪ Confirmar conexion Supabase                              │
│ ▪ Validar integridad de node_modules                       │
│ ▪ Ejecutar linting y verificacion de tipos                 │
└─────────────────────────────────────────────────────────────┘
                            ↓
┌─────────────────────────────────────────────────────────────┐
│ PASO 2: CONSTRUCCION Y VALIDACION                          │
├─────────────────────────────────────────────────────────────┤
│ ▪ npm run build                                            │
│ ▪ Verificar tamano de bundle (.next directory)             │
│ ▪ Ejecutar pruebas automatizadas (si disponibles)          │
│ ▪ Validar endpoint de salud /api/test-db                   │
└─────────────────────────────────────────────────────────────┘
                            ↓
┌─────────────────────────────────────────────────────────────┐
│ PASO 3: INICIO DEL SERVIDOR                                │
├─────────────────────────────────────────────────────────────┤
│ ▪ npm run dev (desarrollo) o npm run start (produccion)    │
│ ▪ Verificar puerto 3000 disponible                         │
│ ▪ Confirmar inicio de sistema de monitoreo                 │
│ ▪ Ejecutar health checks automaticos                       │
└─────────────────────────────────────────────────────────────┘
```

#### Scripts de Automatizacion
```batch
REM deploy-dev.bat
@echo off
echo [DEPLOY] Iniciando despliegue de desarrollo PAES PRO
echo [STEP 1] Verificando entorno...
node --version
npm --version

echo [STEP 2] Instalando dependencias...
npm install

echo [STEP 3] Ejecutando build...
npm run build

echo [STEP 4] Iniciando servidor...
start /B npm run dev

echo [STEP 5] Iniciando monitoreo...
cd scripts
start-all-monitoring.bat

echo [DEPLOY] Despliegue completado. Servidor disponible en http://localhost:3000
```

### 1.2 DESPLIEGUE DE CONTENEDORES DOCKER

#### Arquitectura de Contenedores
```ascii
DOCKER COMPOSE ARCHITECTURE
┌─────────────────────────────────────────────────────────────┐
│                    PAES PRO CONTAINERS                      │
├─────────────────────────────────────────────────────────────┤
│ Frontend Layer                                              │
│ ┌─────────────────────────────────────────────────────────┐ │
│ │ Next.js App Container (Port 3000)                      │ │
│ │ ▪ Built from Node.js Alpine                            │ │
│ │ ▪ Multi-stage build optimization                       │ │
│ │ ▪ Environment variables injection                      │ │
│ └─────────────────────────────────────────────────────────┘ │
├─────────────────────────────────────────────────────────────┤
│ Database Layer                                              │
│ ┌─────────────┐ ┌─────────────┐ ┌─────────────┐          │
│ │ Supabase    │ │ Redis       │ │ MinIO       │          │
│ │ PostgreSQL  │ │ Cache       │ │ Storage     │          │
│ │ Port 5432   │ │ Port 6379   │ │ Port 9000   │          │
│ └─────────────┘ └─────────────┘ └─────────────┘          │
├─────────────────────────────────────────────────────────────┤
│ Monitoring Layer                                            │
│ ┌─────────────┐ ┌─────────────┐ ┌─────────────┐          │
│ │ Prometheus  │ │ Grafana     │ │ Elasticsearch│         │
│ │ Port 9090   │ │ Port 3000   │ │ Port 9200   │          │
│ └─────────────┘ └─────────────┘ └─────────────┘          │
└─────────────────────────────────────────────────────────────┘
```

#### Proceso de Despliegue Docker
```powershell
# Script de despliegue docker-deploy.ps1

# PASO 1: Preparacion
Write-Host "[DEPLOY] Iniciando despliegue Docker PAES PRO"
Write-Host "[STEP 1] Verificando Docker..."
docker --version
docker-compose --version

# PASO 2: Construccion de imagenes
Write-Host "[STEP 2] Construyendo imagenes..."
docker-compose build --no-cache

# PASO 3: Verificacion de variables de entorno
Write-Host "[STEP 3] Verificando configuracion..."
if (!(Test-Path ".env")) {
    Write-Error "Archivo .env no encontrado"
    exit 1
}

# PASO 4: Inicio de servicios
Write-Host "[STEP 4] Iniciando servicios..."
docker-compose up -d

# PASO 5: Health checks
Write-Host "[STEP 5] Verificando servicios..."
$services = @("supabase", "redis", "minio", "prometheus", "grafana", "elasticsearch")
foreach ($service in $services) {
    Write-Host "Verificando $service..."
    docker-compose ps $service
}

# PASO 6: Verificacion de conectividad
Write-Host "[STEP 6] Pruebas de conectividad..."
Start-Sleep -Seconds 10
try {
    $response = Invoke-RestMethod -Uri "http://localhost:3000/api/test-db" -TimeoutSec 30
    Write-Host "API Health Check: OK"
} catch {
    Write-Warning "API Health Check: FAILED - $_"
}

Write-Host "[DEPLOY] Despliegue Docker completado"
```

#### Dockerfile para Next.js (Propuesto)
```dockerfile
# Dockerfile
FROM node:18-alpine AS base
WORKDIR /app
COPY package*.json ./
RUN npm ci --only=production

FROM base AS build
COPY . .
RUN npm run build

FROM base AS runtime
COPY --from=build /app/.next ./.next
COPY --from=build /app/public ./public
EXPOSE 3000
CMD ["npm", "start"]
```

### 1.3 DESPLIEGUE DE MICROSERVICIOS

#### Servicios Identificados
```ascii
MICROSERVICES DEPLOYMENT STRATEGY
┌─────────────────────────────────────────────────────────────┐
│ SERVICIO                 │ PUERTO │ ESTADO │ DEPENDENCIAS   │
├─────────────────────────────────────────────────────────────┤
│ Chat API Service         │  3001  │ READY  │ OpenRouter     │
│ Content Generator        │  3002  │ DEV    │ OpenRouter+DB  │
│ User Progress API        │  3003  │ READY  │ Supabase       │
│ Exam Generator Service   │  3004  │ READY  │ OpenRouter+DB  │
│ Session Manager Service  │  3005  │ READY  │ Supabase       │
│ Recommendation Engine   │  3006  │ READY  │ DB+Analytics   │
│ Central Metrics Server   │  3001  │ ACTIVE │ None           │
└─────────────────────────────────────────────────────────────┘
```

---

## 2. PROTOCOLO DE MONITOREO

### 2.1 METRICAS DE SISTEMA

#### Monitoreo Automatico
```ascii
MONITORING ARCHITECTURE v2.0
┌─────────────────────────────────────────────────────────────┐
│                 MONITORING SYSTEM LAYERS                    │
├─────────────────────────────────────────────────────────────┤
│ NIVEL 1: INFRAESTRUCTURA                                   │
│ ┌─────────────┐ ┌─────────────┐ ┌─────────────┐          │
│ │ CPU Usage   │ │ Memory      │ │ Disk Space  │          │
│ │ Threshold:  │ │ Threshold:  │ │ Threshold:  │          │
│ │ 80%         │ │ 90%         │ │ 85%         │          │
│ └─────────────┘ └─────────────┘ └─────────────┘          │
├─────────────────────────────────────────────────────────────┤
│ NIVEL 2: APLICACIONES                                      │
│ ┌─────────────┐ ┌─────────────┐ ┌─────────────┐          │
│ │ Next.js     │ │ Docker      │ │ Supabase    │          │
│ │ Port 3000   │ │ Containers  │ │ Database    │          │
│ │ Response    │ │ Health      │ │ Connection  │          │
│ │ Time < 2s   │ │ Status      │ │ < 100ms     │          │
│ └─────────────┘ └─────────────┘ └─────────────┘          │
├─────────────────────────────────────────────────────────────┤
│ NIVEL 3: METRICAS DE NEGOCIO                               │
│ ┌─────────────┐ ┌─────────────┐ ┌─────────────┐          │
│ │ User        │ │ API         │ │ AI Model    │          │
│ │ Sessions    │ │ Endpoints   │ │ Usage       │          │
│ │ Active      │ │ Success     │ │ Token       │          │
│ │ Count       │ │ Rate > 95%  │ │ Consumption │          │
│ └─────────────┘ └─────────────┘ └─────────────┘          │
└─────────────────────────────────────────────────────────────┘
```

#### Configuracion de Alertas
```json
{
  "alert_rules": {
    "critical": {
      "cpu_high": {
        "condition": "cpu_usage > 90",
        "duration": "5m",
        "action": "restart_process"
      },
      "memory_exhaustion": {
        "condition": "memory_usage > 95",
        "duration": "3m", 
        "action": "scale_container"
      },
      "database_down": {
        "condition": "db_connection = false",
        "duration": "30s",
        "action": "immediate_alert"
      }
    },
    "warning": {
      "slow_response": {
        "condition": "response_time > 3000ms",
        "duration": "10m",
        "action": "performance_log"
      },
      "high_disk_usage": {
        "condition": "disk_usage > 80",
        "duration": "15m",
        "action": "cleanup_logs"
      }
    }
  }
}
```

### 2.2 DASHBOARD DE MONITOREO

#### Grafana Dashboard (Configuracion)
```ascii
GRAFANA DASHBOARD LAYOUT
┌─────────────────────────────────────────────────────────────┐
│                    PAES PRO SYSTEM OVERVIEW                 │
├─────────────────────────────────────────────────────────────┤
│ Row 1: System Health                                        │
│ ┌─────────────┐ ┌─────────────┐ ┌─────────────┐          │
│ │ CPU Usage   │ │ Memory      │ │ Active      │          │
│ │ [██████░░░] │ │ 8.2/16 GB   │ │ Processes   │          │
│ │ 65%         │ │ (51%)       │ │ 12          │          │
│ └─────────────┘ └─────────────┘ └─────────────┘          │
├─────────────────────────────────────────────────────────────┤
│ Row 2: Application Metrics                                  │
│ ┌─────────────┐ ┌─────────────┐ ┌─────────────┐          │
│ │ API         │ │ Database    │ │ User        │          │
│ │ Requests    │ │ Response    │ │ Sessions    │          │
│ │ 1,234 rpm   │ │ 45ms avg    │ │ 89 active   │          │
│ └─────────────┘ └─────────────┘ └─────────────┘          │
├─────────────────────────────────────────────────────────────┤
│ Row 3: Business Intelligence                                │
│ ┌─────────────┐ ┌─────────────┐ ┌─────────────┐          │
│ │ Exam        │ │ AI Model    │ │ Success     │          │
│ │ Generation  │ │ Usage       │ │ Rate        │          │
│ │ 67 today    │ │ $12.45      │ │ 98.5%       │          │
│ └─────────────┘ └─────────────┘ └─────────────┘          │
└─────────────────────────────────────────────────────────────┘
```

### 2.3 LOGS CENTRALIZADOS

#### Estructura de Logging
```powershell
# Configuracion de logs centralizados
$LogConfig = @{
    "application" = @{
        "level" = "INFO"
        "format" = "JSON"
        "rotation" = "daily"
        "retention" = "30d"
    }
    "performance" = @{
        "level" = "METRICS"
        "format" = "STRUCTURED"
        "rotation" = "hourly"
        "retention" = "7d"
    }
    "security" = @{
        "level" = "WARN"
        "format" = "ENCRYPTED"
        "rotation" = "daily"
        "retention" = "90d"
    }
    "audit" = @{
        "level" = "ALL"
        "format" = "IMMUTABLE"
        "rotation" = "never"
        "retention" = "permanent"
    }
}
```

---

## 3. PROTOCOLO DE ACTUALIZACION

### 3.1 ACTUALIZACION DE DEPENDENCIAS

#### Process de Actualizacion Segura
```ascii
DEPENDENCY UPDATE WORKFLOW
┌─────────────────────────────────────────────────────────────┐
│ FASE 1: ANALISIS DE DEPENDENCIAS                           │
├─────────────────────────────────────────────────────────────┤
│ ▪ npm audit                # Security vulnerabilities       │
│ ▪ npm outdated             # Available updates              │
│ ▪ npx npm-check-updates    # Major version updates          │
│ ▪ Check breaking changes   # Review changelogs              │
└─────────────────────────────────────────────────────────────┘
                            ↓
┌─────────────────────────────────────────────────────────────┐
│ FASE 2: BACKUP Y PREPARACION                               │
├─────────────────────────────────────────────────────────────┤
│ ▪ git stash                # Save current state             │
│ ▪ git checkout -b updates  # Create update branch           │
│ ▪ cp package.json backup/  # Backup package files          │
│ ▪ npm ci                   # Clean install                  │
└─────────────────────────────────────────────────────────────┘
                            ↓
┌─────────────────────────────────────────────────────────────┐
│ FASE 3: ACTUALIZACION INCREMENTAL                          │
├─────────────────────────────────────────────────────────────┤
│ ▪ Update patch versions first (1.0.1 -> 1.0.2)            │
│ ▪ Test and validate       # Run npm test                   │
│ ▪ Update minor versions   # (1.0.x -> 1.1.x)              │
│ ▪ Test and validate       # Verify functionality           │
│ ▪ Update major versions   # (1.x.x -> 2.x.x) CAREFULLY     │
│ ▪ Extensive testing       # Full regression tests          │
└─────────────────────────────────────────────────────────────┘
                            ↓
┌─────────────────────────────────────────────────────────────┐
│ FASE 4: VALIDACION Y DEPLOYMENT                            │
├─────────────────────────────────────────────────────────────┤
│ ▪ npm run build           # Build verification             │
│ ▪ npm run start           # Production mode test           │
│ ▪ Health check APIs       # /api/test-db, /api/test-rpc   │
│ ▪ Load testing            # Performance validation         │
│ ▪ git merge main          # Merge to main branch           │
└─────────────────────────────────────────────────────────────┘
```

#### Script de Actualizacion Automatizada
```powershell
# update-dependencies.ps1
Write-Host "[UPDATE] Iniciando actualizacion de dependencias PAES PRO"

# Paso 1: Backup
Write-Host "[STEP 1] Creando backup..."
git stash push -m "Pre-update backup $(Get-Date)"
Copy-Item "package.json" "package.json.backup.$(Get-Date -Format 'yyyyMMdd-HHmmss')"

# Paso 2: Audit de seguridad
Write-Host "[STEP 2] Auditoria de seguridad..."
npm audit --audit-level=moderate

# Paso 3: Verificar actualizaciones disponibles
Write-Host "[STEP 3] Verificando actualizaciones..."
npm outdated

# Paso 4: Actualizacion conservadora (patch only)
Write-Host "[STEP 4] Actualizando versiones patch..."
npm update

# Paso 5: Build y test
Write-Host "[STEP 5] Verificando build..."
npm run build
if ($LASTEXITCODE -ne 0) {
    Write-Error "Build failed. Restaurando backup..."
    git stash pop
    exit 1
}

# Paso 6: Health checks
Write-Host "[STEP 6] Ejecutando health checks..."
npm run dev &
Start-Sleep -Seconds 15
try {
    $healthResponse = Invoke-RestMethod -Uri "http://localhost:3000/api/test-db"
    Write-Host "Health check: PASSED"
} catch {
    Write-Error "Health check: FAILED - $_"
    git stash pop
    exit 1
}

Write-Host "[UPDATE] Actualizacion completada exitosamente"
```

### 3.2 ACTUALIZACION DE CONTENEDORES DOCKER

#### Rolling Update para Docker Compose
```yaml
# docker-compose.prod.yml
version: '3.8'
services:
  app:
    image: paes-pro:${VERSION:-latest}
    deploy:
      replicas: 2
      update_config:
        parallelism: 1
        delay: 10s
        failure_action: rollback
      restart_policy:
        condition: on-failure
        delay: 5s
        max_attempts: 3
    healthcheck:
      test: ["CMD", "curl", "-f", "http://localhost:3000/api/health"]
      interval: 30s
      timeout: 10s
      retries: 3
```

#### Script de Actualizacion Docker
```powershell
# docker-update.ps1
param(
    [string]$Version = "latest",
    [switch]$RollbackOnFailure = $true
)

Write-Host "[DOCKER-UPDATE] Actualizando contenedores a version $Version"

# Paso 1: Build nueva imagen
Write-Host "[STEP 1] Construyendo nueva imagen..."
docker build -t paes-pro:$Version .

# Paso 2: Tag como latest
Write-Host "[STEP 2] Taggeando imagen..."
docker tag paes-pro:$Version paes-pro:latest

# Paso 3: Rolling update
Write-Host "[STEP 3] Ejecutando rolling update..."
$env:VERSION = $Version
docker-compose -f docker-compose.prod.yml up -d

# Paso 4: Health check
Write-Host "[STEP 4] Verificando salud de contenedores..."
Start-Sleep -Seconds 30
$healthyContainers = docker-compose ps --filter "health=healthy" -q
if ($healthyContainers.Count -eq 0 -and $RollbackOnFailure) {
    Write-Error "Contenedores no saludables. Ejecutando rollback..."
    docker-compose -f docker-compose.prod.yml down
    $env:VERSION = "previous"
    docker-compose -f docker-compose.prod.yml up -d
    exit 1
}

Write-Host "[DOCKER-UPDATE] Actualizacion completada"
```

---

## 4. PROTOCOLO DE AUDITORIA

### 4.1 AUDITORIA DE SISTEMA

#### Checklist de Auditoria Mensual
```ascii
MONTHLY SYSTEM AUDIT CHECKLIST
┌─────────────────────────────────────────────────────────────┐
│ CATEGORIA: SEGURIDAD                                        │
├─────────────────────────────────────────────────────────────┤
│ [ ] Actualizaciones de seguridad aplicadas                 │
│ [ ] Vulnerabilidades escaneadas (npm audit)                │
│ [ ] Certificados SSL verificados                           │
│ [ ] Acceso a base de datos auditado                        │
│ [ ] Logs de seguridad revisados                            │
│ [ ] Variables de entorno rotadas                           │
└─────────────────────────────────────────────────────────────┘
┌─────────────────────────────────────────────────────────────┐
│ CATEGORIA: PERFORMANCE                                      │
├─────────────────────────────────────────────────────────────┤
│ [ ] Metricas de CPU analizadas                             │
│ [ ] Uso de memoria optimizado                              │
│ [ ] Tiempos de respuesta API < 2s                          │
│ [ ] Base de datos optimizada                               │
│ [ ] Logs rotados y archivados                              │
│ [ ] Espacio en disco gestionado                            │
└─────────────────────────────────────────────────────────────┘
┌─────────────────────────────────────────────────────────────┐
│ CATEGORIA: FUNCIONALIDAD                                    │
├─────────────────────────────────────────────────────────────┤
│ [ ] Todos los endpoints funcionan                          │
│ [ ] Integracion Supabase estable                           │
│ [ ] Servicios de IA operativos                             │
│ [ ] Sistema de monitoreo activo                            │
│ [ ] Backups verificados                                    │
│ [ ] Documentacion actualizada                              │
└─────────────────────────────────────────────────────────────┘
```

#### Script de Auditoria Automatizada
```powershell
# system-audit.ps1
Write-Host "[AUDIT] Iniciando auditoria del sistema PAES PRO"
$AuditResults = @{}
$AuditDate = Get-Date -Format "yyyy-MM-dd HH:mm:ss"

# Auditoria de Seguridad
Write-Host "[AUDIT] Verificando seguridad..."
$AuditResults.Security = @{
    "npm_vulnerabilities" = (npm audit --json | ConvertFrom-Json).vulnerabilities.Count
    "env_files_secure" = (Test-Path ".env" -and (Get-Content ".env" | Select-String "password|key|secret").Count -gt 0)
    "ssl_certificates" = "Not implemented"
}

# Auditoria de Performance  
Write-Host "[AUDIT] Analizando performance..."
$SystemInfo = Get-ComputerInfo
$AuditResults.Performance = @{
    "cpu_usage" = (Get-Counter "\Processor(_Total)\% Processor Time").CounterSamples.CookedValue
    "memory_usage_gb" = [Math]::Round(($SystemInfo.TotalPhysicalMemory - $SystemInfo.AvailablePhysicalMemory) / 1GB, 2)
    "disk_space_free_gb" = [Math]::Round((Get-WmiObject -Class Win32_LogicalDisk -Filter "DriveType=3").FreeSpace / 1GB, 2)
}

# Auditoria de Funcionalidad
Write-Host "[AUDIT] Verificando funcionalidad..."
try {
    $ApiResponse = Invoke-RestMethod -Uri "http://localhost:3000/api/test-db" -TimeoutSec 10
    $ApiHealthy = $true
} catch {
    $ApiHealthy = $false
}

$AuditResults.Functionality = @{
    "api_endpoints" = $ApiHealthy
    "monitoring_system" = (Get-Process -Name "node" -ErrorAction SilentlyContinue).Count -gt 0
    "database_connection" = $ApiResponse.success -eq $true
    "log_files_size_mb" = [Math]::Round((Get-ChildItem "logs" -Recurse | Measure-Object Length -Sum).Sum / 1MB, 2)
}

# Generar reporte
$AuditReport = @{
    "audit_date" = $AuditDate
    "system_info" = @{
        "os" = $SystemInfo.WindowsProductName
        "version" = $SystemInfo.WindowsVersion  
        "hostname" = $env:COMPUTERNAME
    }
    "results" = $AuditResults
    "recommendations" = @()
}

# Generar recomendaciones
if ($AuditResults.Security.npm_vulnerabilities -gt 0) {
    $AuditReport.recommendations += "SECURITY: Resolver $($AuditResults.Security.npm_vulnerabilities) vulnerabilidades NPM"
}
if ($AuditResults.Performance.cpu_usage -gt 80) {
    $AuditReport.recommendations += "PERFORMANCE: CPU usage alto ($($AuditResults.Performance.cpu_usage)%)"
}
if (-not $AuditResults.Functionality.api_endpoints) {
    $AuditReport.recommendations += "FUNCTIONALITY: API endpoints no responden"
}

# Guardar reporte
$ReportPath = "audit-reports/system-audit-$((Get-Date).ToString('yyyyMMdd-HHmmss')).json"
$AuditReport | ConvertTo-Json -Depth 4 | Out-File -FilePath $ReportPath -Encoding ASCII

Write-Host "[AUDIT] Reporte generado: $ReportPath"
Write-Host "[AUDIT] Auditoria completada"
```

### 4.2 AUDITORIA DE BASE DE DATOS

#### Verificacion de Integridad Supabase
```sql
-- queries/database-audit.sql
-- Auditoria de integridad de base de datos

-- 1. Verificar tablas principales
SELECT 
    schemaname,
    tablename,
    n_tup_ins as inserts,
    n_tup_upd as updates,
    n_tup_del as deletes
FROM pg_stat_user_tables
WHERE schemaname = 'public'
ORDER BY tablename;

-- 2. Verificar funciones RPC
SELECT 
    routine_name,
    routine_type,
    created,
    last_altered
FROM information_schema.routines
WHERE routine_schema = 'public'
ORDER BY routine_name;

-- 3. Verificar índices
SELECT 
    schemaname,
    tablename,
    indexname,
    idx_tup_read,
    idx_tup_fetch
FROM pg_stat_user_indexes
WHERE schemaname = 'public'
ORDER BY tablename, indexname;

-- 4. Verificar conexiones activas
SELECT 
    count(*) as active_connections,
    state,
    client_addr
FROM pg_stat_activity
WHERE state = 'active'
GROUP BY state, client_addr;
```

#### Script de Auditoria de Base de Datos
```powershell
# database-audit.ps1
Write-Host "[DB-AUDIT] Iniciando auditoria de base de datos"

# Verificar variables de entorno
if (-not $env:NEXT_PUBLIC_SUPABASE_URL) {
    Write-Error "Variable NEXT_PUBLIC_SUPABASE_URL no definida"
    exit 1
}

# Test de conectividad
Write-Host "[DB-AUDIT] Verificando conectividad..."
try {
    $ConnTest = Invoke-RestMethod -Uri "http://localhost:3000/api/test-db"
    Write-Host "Conectividad: OK"
} catch {
    Write-Error "Conectividad: FAILED - $_"
    exit 1
}

# Test de funciones RPC
Write-Host "[DB-AUDIT] Verificando funciones RPC..."
try {
    $RpcTest = Invoke-RestMethod -Uri "http://localhost:3000/api/test-rpc"
    $PassedTests = $RpcTest.tests | Where-Object { $_.success -eq $true }
    Write-Host "RPC Functions: $($PassedTests.Count)/$($RpcTest.tests.Count) passed"
} catch {
    Write-Error "RPC Tests: FAILED - $_"
}

# Generar reporte de auditoria
$DbAuditReport = @{
    "audit_date" = (Get-Date -Format "yyyy-MM-dd HH:mm:ss")
    "connectivity" = $ConnTest.success
    "rpc_functions" = @{
        "total" = $RpcTest.tests.Count
        "passed" = $PassedTests.Count
        "success_rate" = [Math]::Round(($PassedTests.Count / $RpcTest.tests.Count) * 100, 2)
    }
    "performance" = @{
        "connection_time_ms" = $ConnTest.connection_time
        "avg_query_time_ms" = ($RpcTest.tests | Measure-Object execution_time -Average).Average
    }
}

# Guardar reporte
$DbReportPath = "audit-reports/database-audit-$((Get-Date).ToString('yyyyMMdd-HHmmss')).json"
$DbAuditReport | ConvertTo-Json -Depth 3 | Out-File -FilePath $DbReportPath -Encoding ASCII

Write-Host "[DB-AUDIT] Reporte generado: $DbReportPath"
```

---

## 5. SCRIPTS DE AUTOMATIZACION

### 5.1 Script Master de Despliegue
```batch
REM deploy-master.bat
@echo off
setlocal EnableDelayedExpansion

echo ========================================
echo    PAES PRO DEPLOYMENT MASTER SCRIPT
echo ========================================
echo.

set DEPLOY_MODE=%1
if "%DEPLOY_MODE%"=="" set DEPLOY_MODE=development

echo [DEPLOY] Modo: %DEPLOY_MODE%
echo [DEPLOY] Timestamp: %date% %time%
echo.

REM Verificar prerequisitos
echo [STEP 1] Verificando prerequisitos...
node --version >nul 2>&1
if errorlevel 1 (
    echo ERROR: Node.js no instalado
    exit /b 1
)

docker --version >nul 2>&1
if errorlevel 1 (
    echo WARNING: Docker no disponible
    set DOCKER_AVAILABLE=false
) else (
    set DOCKER_AVAILABLE=true
)

echo [STEP 2] Backup de configuracion...
if not exist "backups" mkdir backups
copy ".env" "backups\.env.%date:~-4,4%%date:~-10,2%%date:~-7,2%" >nul

echo [STEP 3] Instalando dependencias...
npm install

echo [STEP 4] Ejecutando build...
npm run build
if errorlevel 1 (
    echo ERROR: Build failed
    exit /b 1
)

if "%DEPLOY_MODE%"=="docker" (
    if "%DOCKER_AVAILABLE%"=="true" (
        echo [STEP 5] Despliegue Docker...
        docker-compose up -d
    ) else (
        echo ERROR: Docker requerido para deploy mode docker
        exit /b 1
    )
) else (
    echo [STEP 5] Iniciando servidor desarrollo...
    start /B npm run dev
)

echo [STEP 6] Iniciando monitoreo...
cd scripts
call start-all-monitoring.bat
cd ..

echo [STEP 7] Health checks...
timeout /t 15 /nobreak >nul
powershell -Command "try { $r = Invoke-RestMethod 'http://localhost:3000/api/test-db'; if($r.success) { Write-Host 'Health Check: PASSED' } else { Write-Host 'Health Check: FAILED' } } catch { Write-Host 'Health Check: ERROR' }"

echo.
echo ========================================
echo   DESPLIEGUE COMPLETADO EXITOSAMENTE
echo ========================================
echo   URL: http://localhost:3000
echo   Monitoreo: http://localhost:3001/status
echo   Logs: .\logs\
echo ========================================
```

### 5.2 Script de Mantenimiento Automatico
```powershell
# maintenance-automation.ps1
param(
    [switch]$FullMaintenance,
    [switch]$SecurityOnly,
    [switch]$PerformanceOnly,
    [switch]$DryRun
)

Write-Host "[MAINTENANCE] Iniciando rutina de mantenimiento automatico"
$MaintenanceLog = @()

function Log-Action {
    param([string]$Action, [string]$Result, [string]$Details = "")
    $LogEntry = @{
        "timestamp" = (Get-Date -Format "yyyy-MM-dd HH:mm:ss")
        "action" = $Action
        "result" = $Result
        "details" = $Details
    }
    $MaintenanceLog += $LogEntry
    Write-Host "[$Result] $Action - $Details"
}

# 1. Limpieza de logs antiguos
if ($FullMaintenance -or $PerformanceOnly) {
    Write-Host "[TASK] Limpieza de logs..."
    if (-not $DryRun) {
        $OldLogs = Get-ChildItem "logs" -Recurse | Where-Object { $_.LastWriteTime -lt (Get-Date).AddDays(-7) }
        $OldLogs | Remove-Item -Force
        Log-Action "Log Cleanup" "SUCCESS" "Removed $($OldLogs.Count) old log files"
    } else {
        Log-Action "Log Cleanup" "SIMULATED" "Would remove old log files"
    }
}

# 2. Verificacion de seguridad
if ($FullMaintenance -or $SecurityOnly) {
    Write-Host "[TASK] Auditoria de seguridad..."
    if (-not $DryRun) {
        $AuditResult = npm audit --json | ConvertFrom-Json
        if ($AuditResult.vulnerabilities.Count -gt 0) {
            Log-Action "Security Audit" "WARNING" "$($AuditResult.vulnerabilities.Count) vulnerabilities found"
        } else {
            Log-Action "Security Audit" "SUCCESS" "No vulnerabilities found"
        }
    } else {
        Log-Action "Security Audit" "SIMULATED" "Would check for vulnerabilities"
    }
}

# 3. Optimizacion de base de datos
if ($FullMaintenance -or $PerformanceOnly) {
    Write-Host "[TASK] Verificacion de base de datos..."
    if (-not $DryRun) {
        try {
            $DbStatus = Invoke-RestMethod -Uri "http://localhost:3000/api/test-db"
            if ($DbStatus.success) {
                Log-Action "Database Check" "SUCCESS" "All database tests passed"
            } else {
                Log-Action "Database Check" "FAILED" "Database tests failed"
            }
        } catch {
            Log-Action "Database Check" "ERROR" $_.Exception.Message
        }
    } else {
        Log-Action "Database Check" "SIMULATED" "Would check database status"
    }
}

# 4. Backup automatico
if ($FullMaintenance) {
    Write-Host "[TASK] Creando backup..."
    if (-not $DryRun) {
        $BackupDir = "backups/auto-backup-$((Get-Date).ToString('yyyyMMdd-HHmmss'))"
        New-Item -ItemType Directory -Path $BackupDir -Force
        Copy-Item ".env*" $BackupDir
        Copy-Item "package*.json" $BackupDir
        git stash push -m "Auto-backup $((Get-Date).ToString('yyyy-MM-dd HH:mm:ss'))"
        Log-Action "Backup Creation" "SUCCESS" "Backup created at $BackupDir"
    } else {
        Log-Action "Backup Creation" "SIMULATED" "Would create backup"
    }
}

# 5. Reinicio de servicios de monitoreo
if ($FullMaintenance -or $PerformanceOnly) {
    Write-Host "[TASK] Reiniciando servicios de monitoreo..."
    if (-not $DryRun) {
        & "scripts\stop-all-monitoring.bat"
        Start-Sleep -Seconds 5
        & "scripts\start-all-monitoring.bat"
        Log-Action "Monitoring Restart" "SUCCESS" "Monitoring services restarted"
    } else {
        Log-Action "Monitoring Restart" "SIMULATED" "Would restart monitoring services"
    }
}

# Generar reporte de mantenimiento
$MaintenanceReport = @{
    "maintenance_date" = (Get-Date -Format "yyyy-MM-dd HH:mm:ss")
    "maintenance_type" = if ($FullMaintenance) { "FULL" } elseif ($SecurityOnly) { "SECURITY" } elseif ($PerformanceOnly) { "PERFORMANCE" } else { "DEFAULT" }
    "dry_run" = $DryRun
    "actions" = $MaintenanceLog
    "summary" = @{
        "total_actions" = $MaintenanceLog.Count
        "successful" = ($MaintenanceLog | Where-Object { $_.result -eq "SUCCESS" }).Count
        "failed" = ($MaintenanceLog | Where-Object { $_.result -eq "FAILED" -or $_.result -eq "ERROR" }).Count
        "warnings" = ($MaintenanceLog | Where-Object { $_.result -eq "WARNING" }).Count
    }
}

# Guardar reporte
$ReportPath = "maintenance-reports/maintenance-$((Get-Date).ToString('yyyyMMdd-HHmmss')).json"
if (-not (Test-Path "maintenance-reports")) { New-Item -ItemType Directory -Path "maintenance-reports" -Force }
$MaintenanceReport | ConvertTo-Json -Depth 4 | Out-File -FilePath $ReportPath -Encoding ASCII

Write-Host "[MAINTENANCE] Reporte generado: $ReportPath"
Write-Host "[MAINTENANCE] Mantenimiento completado"
```

---

## ANEXOS

### Anexo A: Comandos de Referencia Rapida
```ascii
COMANDOS DE REFERENCIA RAPIDA - PAES PRO SYSTEM
┌─────────────────────────────────────────────────────────────┐
│ DESPLIEGUE                                                  │
├─────────────────────────────────────────────────────────────┤
│ deploy-master.bat                     # Despliegue completo │
│ deploy-master.bat docker              # Despliegue Docker   │
│ npm run dev                           # Desarrollo local    │
│ docker-compose up -d                  # Contenedores        │
└─────────────────────────────────────────────────────────────┘
┌─────────────────────────────────────────────────────────────┐
│ MONITOREO                                                   │
├─────────────────────────────────────────────────────────────┤
│ scripts\start-all-monitoring.bat      # Iniciar monitoreo  │
│ scripts\check-monitoring-status.bat   # Ver estado         │
│ http://localhost:3001/status          # Dashboard API      │
│ http://localhost:3000/api/test-db     # Health check       │
└─────────────────────────────────────────────────────────────┘
┌─────────────────────────────────────────────────────────────┐
│ MANTENIMIENTO                                               │
├─────────────────────────────────────────────────────────────┤
│ powershell .\maintenance-automation.ps1 -FullMaintenance   │
│ powershell .\system-audit.ps1                              │
│ powershell .\database-audit.ps1                            │
│ powershell .\update-dependencies.ps1                       │
└─────────────────────────────────────────────────────────────┘
```

### Anexo B: Estructura de Directorios
```ascii
paes-pro/
├── docs/                          # Documentacion
│   ├── PROTOCOLOS-DESPLIEGUE-MONITOREO.md
│   └── TUTORIALES-ASCII/
├── scripts/                       # Scripts de automatizacion
│   ├── deploy-master.bat
│   ├── maintenance-automation.ps1
│   ├── system-audit.ps1
│   └── database-audit.ps1
├── logs/                          # Logs del sistema
│   ├── performance/
│   ├── server/
│   └── database/
├── backups/                       # Backups automaticos
├── audit-reports/                 # Reportes de auditoria
├── maintenance-reports/           # Reportes de mantenimiento
└── monitoring-config.json         # Configuracion de monitoreo
```

---

**Documento Version**: 1.0  
**Fecha de Creacion**: Enero 2025  
**Autor**: Sistema PAES PRO  
**Estado**: IMPLEMENTADO  

Este protocolo establece las bases para el despliegue, monitoreo y mantenimiento continuo del sistema PAES PRO, asegurando operaciones estables y auditables.
