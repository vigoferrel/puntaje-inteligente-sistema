# Scripts de Automatización de Pruebas E2E - Sistema CIO

## Descripción General

Este conjunto de scripts de PowerShell proporciona una suite completa de automatización para pruebas de integración end-to-end del sistema CIO. Los scripts están diseñados para ejecutarse en Windows usando PowerShell y proporcionan verificaciones automatizadas de:

- ✅ Stack completo de servicios Docker
- ✅ Aplicación Next.js y endpoints de API
- ✅ Conectividad y funcionalidad de Supabase
- ✅ Sistema de métricas y logs (Prometheus, Grafana, Elasticsearch)
- ✅ Monitoreo continuo de salud del sistema
- ✅ Reportes detallados con formato ASCII

## Estructura de Archivos

```
scripts/integration-tests/
├── master-test-orchestrator.ps1    # 🎯 Script principal - Dashboard interactivo
├── run-e2e-tests.ps1               # 🔄 Suite completa de pruebas E2E
├── docker-health-monitor.ps1       # 🐳 Monitor de contenedores Docker
├── supabase-connection-tester.ps1  # 🔗 Pruebas específicas de Supabase
├── README.md                       # 📚 Este archivo
└── logs/                           # 📊 Directorio de logs y reportes
```

## Scripts Principales

### 1. 🎯 Master Test Orchestrator
**Archivo:** `master-test-orchestrator.ps1`

Dashboard central interactivo que orquesta todas las pruebas y proporciona un control centralizado.

**Características:**
- Dashboard ASCII interactivo
- Verificación automática de prerequisitos
- Ejecución de pruebas en segundo plano
- Métricas del sistema en tiempo real
- Modo monitoreo continuo
- Gestión de logs y reportes

**Uso básico:**
```powershell
# Modo interactivo (recomendado)
.\master-test-orchestrator.ps1

# Modo batch (todas las pruebas automáticamente)
.\master-test-orchestrator.ps1 -Mode batch

# Modo monitoreo continuo
.\master-test-orchestrator.ps1 -Mode monitoring
```

### 2. 🔄 Suite Completa E2E
**Archivo:** `run-e2e-tests.ps1`

Ejecuta la suite completa de pruebas end-to-end verificando todos los componentes del sistema.

**Características:**
- Verificación de servicios Docker
- Tests de endpoints de API
- Conexión a Supabase
- Sistema de métricas
- Reportes detallados con ASCII art
- Códigos de salida estándar

**Uso:**
```powershell
# Ejecución completa
.\run-e2e-tests.ps1

# Omitir verificaciones de Docker
.\run-e2e-tests.ps1 -SkipDocker

# Omitir verificaciones de Supabase
.\run-e2e-tests.ps1 -SkipSupabase

# Modo verbose con más detalles
.\run-e2e-tests.ps1 -Verbose
```

### 3. 🐳 Monitor de Contenedores Docker
**Archivo:** `docker-health-monitor.ps1`

Monitor continuo de salud de contenedores Docker con alertas inteligentes.

**Características:**
- Monitoreo en tiempo real
- Métricas de recursos (CPU, memoria)
- Verificación de puertos
- Alertas automáticas
- Dashboard ASCII actualizable
- Detección de reinicios y problemas

**Uso:**
```powershell
# Monitor continuo (recomendado)
.\docker-health-monitor.ps1 -ContinuousMode -IntervalSeconds 30

# Verificación única
.\docker-health-monitor.ps1

# Con notificaciones habilitadas
.\docker-health-monitor.ps1 -ContinuousMode -EnableNotifications
```

### 4. 🔗 Tester de Conexión Supabase
**Archivo:** `supabase-connection-tester.ps1`

Verificación exhaustiva de la conectividad y funcionalidad de Supabase.

**Características:**
- Tests de variables de entorno
- Conexión básica y funciones RPC
- Sistema de números cuánticos
- Pruebas de rendimiento
- API directa de Supabase
- Reportes detallados

**Uso:**
```powershell
# Test básico
.\supabase-connection-tester.ps1

# Con reporte detallado
.\supabase-connection-tester.ps1 -DetailedReport

# Incluyendo pruebas de rendimiento
.\supabase-connection-tester.ps1 -DetailedReport -PerformanceTest
```

## Prerequisitos del Sistema

### Software Requerido
- ✅ Windows 10/11 con PowerShell 5.1+
- ✅ Docker Desktop para Windows
- ✅ Docker Compose
- ✅ Node.js (para la aplicación Next.js)
- ✅ Variables de entorno de Supabase configuradas

### Variables de Entorno
Asegúrate de tener estas variables configuradas:

```powershell
$env:NEXT_PUBLIC_SUPABASE_URL = "https://your-project.supabase.co"
$env:NEXT_PUBLIC_SUPABASE_ANON_KEY = "your-anon-key"
$env:SUPABASE_SERVICE_ROLE_KEY = "your-service-role-key"  # Opcional
```

### Servicios Docker
El sistema requiere los siguientes servicios corriendo:

```yaml
# docker-compose.yml debe incluir:
- supabase (PostgreSQL)
- redis
- minio
- prometheus
- grafana
- elasticsearch
```

## Guía de Inicio Rápido

### 1. Verificación Inicial
```powershell
# Navegar al directorio de scripts
cd scripts/integration-tests/

# Verificar que PowerShell puede ejecutar scripts
Set-ExecutionPolicy -ExecutionPolicy RemoteSigned -Scope CurrentUser

# Iniciar el orquestador maestro
.\master-test-orchestrator.ps1
```

### 2. Primera Ejecución
El dashboard mostrará el estado de los servicios. Si algún servicio no está disponible:

1. ✅ Iniciar Docker Desktop
2. ✅ Ejecutar `docker-compose up -d` en el directorio raíz
3. ✅ Iniciar la aplicación Next.js con `npm run dev`
4. ✅ Verificar variables de entorno de Supabase

### 3. Ejecución de Pruebas
Desde el dashboard interactivo:
- **Opción 1:** Suite completa E2E (recomendado para verificación completa)
- **Opción 2:** Monitor Docker (para verificación continua de contenedores)
- **Opción 3:** Tester Supabase (para problemas específicos de base de datos)

## Interpretación de Resultados

### Códigos de Salida
- `0` - Éxito (80%+ de pruebas pasaron)
- `1` - Advertencias (50-79% de pruebas pasaron)
- `2` - Fallas críticas (<50% de pruebas pasaron)
- `3` - Error de ejecución

### Estados del Sistema
- 🟢 **OPTIMAL/HEALTHY** - Todo funcionando correctamente
- 🟡 **GOOD/WARNING** - Sistema funcional con algunas limitaciones
- 🔴 **CRITICAL/FAILED** - Problemas graves que requieren atención

### Métricas Reportadas
- **Tiempo de respuesta:** Latencia de endpoints en milisegundos
- **Tasa de éxito:** Porcentaje de pruebas exitosas
- **Salud de contenedores:** Estado de servicios Docker
- **Conectividad:** Estado de conexiones a servicios externos

## Logs y Reportes

### Ubicación de Logs
- **Directorio:** `logs/`
- **Formato de nombres:** `{tipo}-{fecha}-{hora}.log`
- **Reportes JSON:** `{tipo}-report-{fecha}-{hora}.json`

### Tipos de Archivos de Log
- `e2e-test-*.log` - Suite completa de pruebas
- `docker-health-*.log` - Monitor de Docker
- `supabase-tests-*.log` - Pruebas de Supabase

### Análisis de Logs
Los logs incluyen:
- 📅 Timestamp de cada operación
- 🏷️ Nivel de log (INFO, SUCCESS, WARNING, ERROR, CRITICAL)
- 🔍 Detalles específicos de cada prueba
- 📊 Métricas de rendimiento
- 🎯 Recomendaciones para resolver problemas

## Troubleshooting

### Problemas Comunes

#### 1. "Docker no está corriendo"
```powershell
# Verificar estado de Docker
docker --version
docker-compose --version

# Iniciar Docker Desktop si no está corriendo
```

#### 2. "Next.js app not accessible"
```powershell
# Verificar que la aplicación está corriendo
curl http://localhost:3000/api/health-check

# Si no responde, iniciar la aplicación
npm run dev
```

#### 3. "Supabase connection failed"
```powershell
# Verificar variables de entorno
echo $env:NEXT_PUBLIC_SUPABASE_URL
echo $env:NEXT_PUBLIC_SUPABASE_ANON_KEY

# Verificar conectividad directa
curl $env:NEXT_PUBLIC_SUPABASE_URL/rest/v1/
```

#### 4. "PowerShell execution policy"
```powershell
# Permitir ejecución de scripts locales
Set-ExecutionPolicy -ExecutionPolicy RemoteSigned -Scope CurrentUser
```

### Obtener Ayuda
Para obtener ayuda de cualquier script:
```powershell
Get-Help .\script-name.ps1 -Detailed
```

## Configuración Avanzada

### Personalizar Timeouts
```powershell
# Aumentar timeouts para conexiones lentas
.\run-e2e-tests.ps1 -TimeoutSeconds 60
```

### Configurar Intervalos de Monitoreo
```powershell
# Monitor cada 60 segundos
.\docker-health-monitor.ps1 -ContinuousMode -IntervalSeconds 60
```

### Habilitar Notificaciones
```powershell
# Habilitar alertas (requiere configuración adicional)
.\docker-health-monitor.ps1 -ContinuousMode -EnableNotifications
```

## Integración con CI/CD

### Azure DevOps
```yaml
- task: PowerShell@2
  displayName: 'Run E2E Tests'
  inputs:
    targetType: 'filePath'
    filePath: 'scripts/integration-tests/run-e2e-tests.ps1'
    arguments: '-Environment production'
```

### GitHub Actions
```yaml
- name: Run E2E Tests
  shell: pwsh
  run: |
    scripts/integration-tests/run-e2e-tests.ps1 -Environment production
```

## Licencia y Contribuciones

Este conjunto de scripts es parte del Sistema CIO y está diseñado específicamente para automatizar las pruebas de integración del stack tecnológico implementado.

### Contribuir
Para contribuir mejoras o reportar problemas:
1. Documentar el problema o mejora propuesta
2. Seguir las convenciones de nomenclatura ASCII existentes
3. Mantener compatibilidad con Windows PowerShell
4. Incluir tests para nuevas funcionalidades

---

**🎯 ¡Automatización completa de pruebas E2E para el Sistema CIO!**

**Última actualización:** $(Get-Date -Format 'yyyy-MM-dd')
