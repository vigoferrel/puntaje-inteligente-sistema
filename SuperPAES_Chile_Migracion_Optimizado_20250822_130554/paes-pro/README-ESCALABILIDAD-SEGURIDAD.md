# Sistema de Escalabilidad, Seguridad y Tolerancia a Fallos - PAES-PRO

Este documento describe cómo utilizar el sistema completo implementado para escalabilidad vertical y horizontal, protección de credenciales, tolerancia a fallos, auto-restart y balanceo de carga.

## Arquitectura del Sistema

```
┌─────────────────────────────────────────────────────────────────┐
│                    PAES-PRO Architecture                         │
├─────────────────────────────────────────────────────────────────┤
│                                                                 │
│  ┌─────────────┐    ┌──────────────┐    ┌─────────────┐        │
│  │   Nginx     │────│ Load Balancer │────│  App (x2+)  │        │
│  │ :80, :443   │    │ PowerShell    │    │  :3000      │        │
│  └─────────────┘    │ :8080         │    └─────────────┘        │
│         │            └──────────────┘            │               │
│         │                    │                  │               │
│  ┌─────────────┐    ┌──────────────┐    ┌─────────────┐        │
│  │ Monitoring  │    │   Security   │    │  Database   │        │
│  │  & Alerts   │    │   Secrets    │    │ PostgreSQL  │        │
│  └─────────────┘    │   Manager    │    │ :5432       │        │
│         │            └──────────────┘    └─────────────┘        │
│         │                    │                  │               │
│  ┌─────────────┐    ┌──────────────┐    ┌─────────────┐        │
│  │ Prometheus  │    │    Redis     │    │    MinIO    │        │
│  │ :9090       │    │    :6379     │    │ :9000-9001  │        │
│  └─────────────┘    └──────────────┘    └─────────────┘        │
│                                                                 │
└─────────────────────────────────────────────────────────────────┘
```

## Inicio Rápido

### 1. Verificar Prerequisitos

```powershell
# Verificar Docker
docker --version

# Verificar PowerShell 5+
$PSVersionTable.PSVersion

# Verificar Node.js (opcional)
node --version
```

### 2. Inicializar Sistema Completo

```powershell
# Iniciar todo el sistema
.\scripts\orchestrator.ps1 -Action start -Component all

# Verificar estado
.\scripts\orchestrator.ps1 -Action status

# Modo dry-run para probar sin ejecutar
.\scripts\orchestrator.ps1 -Action start -DryRun
```

### 3. Acceder a los Servicios

- **Aplicación**: http://localhost:3000 (directo) o http://localhost:80 (load balancer)
- **Load Balancer PowerShell**: http://localhost:8080
- **Grafana**: http://localhost:3000 (métricas)
- **Prometheus**: http://localhost:9090 (métricas raw)
- **MinIO Console**: http://localhost:9001

## Escalabilidad

### Escalado Vertical

```powershell
# Escalado manual vertical (aumentar recursos)
.\scripts\scaling\vertical-scale.ps1 -ServiceName "paes-pro" -MaxCpuPercent 70 -MaxMemoryMB 1024

# Monitoreo automático con escalado
.\scripts\scaling\vertical-scale.ps1 -ServiceName "paes-pro" -MaxCpuPercent 80 -MaxMemoryMB 2048 -DryRun:$false
```

**Características del Escalado Vertical:**
- Monitoreo de CPU y memoria en tiempo real
- Ajuste automático de límites de Docker Compose
- Backup automático de configuraciones
- Restart inteligente de servicios

### Escalado Horizontal

```powershell
# Inicializar Docker Swarm (primera vez)
.\scripts\scaling\horizontal-scale.ps1 -ServiceName "paes-pro_app" -InitSwarm

# Escalado automático
.\scripts\scaling\horizontal-scale.ps1 -ServiceName "paes-pro_app" -MinReplicas 2 -MaxReplicas 5 -CpuThreshold 70

# Escalado manual usando orquestador
.\scripts\orchestrator.ps1 -Action scale-up -Replicas 4
.\scripts\orchestrator.ps1 -Action scale-down -Replicas 2
```

**Características del Escalado Horizontal:**
- Balanceo automático de carga entre réplicas
- Health checks inteligentes
- Failover automático
- Métricas de performance por contenedor

## Gestión de Credenciales

### Gestor de Secretos

```powershell
# Listar secretos
.\scripts\security\secret-manager.ps1 -Action list

# Crear nuevo secreto
.\scripts\security\secret-manager.ps1 -Action set -SecretName "api_key" -SecretValue "mi_clave_secreta"

# Obtener secreto
.\scripts\security\secret-manager.ps1 -Action get -SecretName "api_key"

# Rotar secreto automáticamente
.\scripts\security\secret-manager.ps1 -Action rotate -SecretName "database_password"

# Hacer backup de todos los secretos
.\scripts\security\secret-manager.ps1 -Action backup
```

**Características de Seguridad:**
- Cifrado AES256 local
- Metadatos con fechas de expiración
- Rotación automática de credenciales
- Auditoría completa de accesos
- Backup automático

### Variables de Entorno Seguras

```powershell
# En scripts, usar variables de entorno
$DB_PASSWORD = & ".\scripts\security\secret-manager.ps1" -Action get -SecretName "database_password"

# En Docker Compose
environment:
  - POSTGRES_PASSWORD_FILE=/run/secrets/db_password
```

## Tolerancia a Fallos y Auto-Restart

### Sistema de Auto-Restart

```powershell
# Iniciar monitoreo con auto-restart
.\scripts\monitoring\auto-restart-services.ps1 -Services @("paes-pro-nextjs", "paes-pro-database", "paes-pro-redis")

# Configurar circuit breaker
.\scripts\monitoring\auto-restart-services.ps1 -EnableCircuitBreaker -CheckInterval 30 -MaxRestartAttempts 3
```

**Características de Tolerancia a Fallos:**
- **Circuit Breaker Pattern**: Previene cascada de fallos
- **Exponential Backoff**: Reintentos progresivos
- **Health Checks**: Verificación constante de servicios
- **Fallback Mechanisms**: Servicios de respaldo
- **Alertas Automáticas**: Notificaciones en tiempo real

### Health Checks

```yaml
# En docker-compose.yml
healthcheck:
  test: ["CMD", "wget", "--no-verbose", "--tries=1", "--spider", "http://localhost:3000/health"]
  interval: 30s
  timeout: 10s
  retries: 3
  start_period: 40s
```

## Balanceo de Carga

### Nginx Load Balancer (Recomendado)

El archivo `config/nginx/nginx.conf` incluye:
- Rate limiting por IP
- SSL/TLS termination
- Gzip compression
- Security headers
- Health checks
- Failover automático

### PowerShell Load Balancer (Desarrollo)

```powershell
# Balanceador simple
.\scripts\load-balancer\powershell-lb.ps1 -ListenPort 8080 -BackendServers @("localhost:3000", "localhost:3001")

# Con sticky sessions
.\scripts\load-balancer\powershell-lb.ps1 -EnableStickySessions -Algorithm "leastconn" -MaxConnections 200

# Diferentes algoritmos
.\scripts\load-balancer\powershell-lb.ps1 -Algorithm "roundrobin"    # Round robin
.\scripts\load-balancer\powershell-lb.ps1 -Algorithm "leastconn"    # Least connections
.\scripts\load-balancer\powershell-lb.ps1 -Algorithm "weighted"     # Weighted round robin
.\scripts\load-balancer\powershell-lb.ps1 -Algorithm "healthbased"  # Based on response time
```

## Monitoreo y Métricas

### Stack de Observabilidad

1. **Prometheus** (localhost:9090)
   - Recolección de métricas
   - Alerting rules
   - Service discovery

2. **Grafana** (localhost:3000)
   - Dashboards interactivos
   - Visualización de tendencias
   - Alertas visuales

3. **Logs Centralizados**
   - Todos los scripts logean en `logs/`
   - Formato ASCII para compatibilidad
   - Rotación automática

### Métricas Clave

- **Availability**: > 99.9% uptime
- **Response Time**: < 200ms (p95)
- **Error Rate**: < 0.1%
- **MTTR**: < 15 minutos
- **Resource Usage**: CPU, Memory, Disk

## Configuración Avanzada

### Docker Swarm para Producción

```powershell
# Inicializar Swarm
docker swarm init

# Desplegar stack
docker stack deploy -c docker-compose.swarm.yml paes-pro-stack

# Escalar servicios
docker service scale paes-pro-stack_app=5

# Monitorear servicios
docker service ls
docker service ps paes-pro-stack_app
```

### Configuración de Alertas

```json
{
  "alerts": {
    "high_cpu": {
      "threshold": 80,
      "duration": "5m",
      "severity": "warning",
      "action": "scale-up"
    },
    "service_down": {
      "threshold": 1,
      "duration": "30s",
      "severity": "critical",
      "action": "restart"
    },
    "high_error_rate": {
      "threshold": 5,
      "duration": "2m",
      "severity": "warning",
      "action": "alert-only"
    }
  }
}
```

## Casos de Uso Comunes

### Despliegue de Emergencia

```powershell
# Despliegue rápido en modo emergencia
.\scripts\orchestrator.ps1 -Action start -Component all -Force

# Verificar que todo funciona
.\scripts\orchestrator.ps1 -Action status

# Escalar inmediatamente si hay alta carga
.\scripts\orchestrator.ps1 -Action scale-up -Replicas 5
```

### Mantenimiento Programado

```powershell
# 1. Backup de secretos
.\scripts\security\secret-manager.ps1 -Action backup

# 2. Escalar a más instancias antes del mantenimiento
.\scripts\orchestrator.ps1 -Action scale-up -Replicas 4

# 3. Actualizar una réplica a la vez (rolling update)
# Docker Compose maneja esto automáticamente con la configuración deploy

# 4. Verificar salud después del mantenimiento
.\scripts\orchestrator.ps1 -Action status
```

### Recuperación de Desastres

```powershell
# 1. Detener todo
.\scripts\orchestrator.ps1 -Action stop

# 2. Restaurar secretos desde backup
# (manual desde vault/backups/)

# 3. Reiniciar con verificaciones forzadas
.\scripts\orchestrator.ps1 -Action start -Force

# 4. Verificar integridad
.\scripts\orchestrator.ps1 -Action status
```

## Troubleshooting

### Problemas Comunes

1. **Docker no responde**
   ```powershell
   # Reiniciar Docker Desktop
   Stop-Service Docker
   Start-Service Docker
   ```

2. **Puertos ocupados**
   ```powershell
   # Verificar puertos en uso
   netstat -an | findstr ":3000"
   
   # Matar procesos si es necesario
   Stop-Process -Name "node" -Force
   ```

3. **Secretos corrompidos**
   ```powershell
   # Restaurar desde backup
   .\scripts\security\secret-manager.ps1 -Action backup
   ```

4. **Servicios no responden a health checks**
   ```powershell
   # Verificar logs
   Get-Content logs/monitoring/auto-restart.log -Tail 50
   
   # Reinicio manual
   docker-compose restart app
   ```

### Logs Importantes

- `logs/orchestrator/orchestrator.log` - Sistema principal
- `logs/monitoring/auto-restart.log` - Auto-restart y health checks
- `logs/security/security.log` - Gestión de secretos
- `logs/load-balancer/load-balancer.log` - Balanceador de carga
- `logs/scaling/vertical-scaling.log` - Escalado vertical
- `logs/scaling/horizontal-scaling.log` - Escalado horizontal

## Scripts de Referencia

### Comandos de Uso Diario

```powershell
# Estado general
.\scripts\orchestrator.ps1 -Action status

# Escalado según demanda
.\scripts\orchestrator.ps1 -Action scale-up -Replicas 3

# Verificar secretos
.\scripts\security\secret-manager.ps1 -Action list

# Ver logs en tiempo real
Get-Content logs/orchestrator/orchestrator.log -Wait -Tail 10
```

### Scripts de Automatización

```powershell
# Script diario de mantenimiento
$Jobs = @(
    { .\scripts\security\secret-manager.ps1 -Action backup },
    { .\scripts\orchestrator.ps1 -Action status },
    { Get-Content logs/monitoring/alerts.json | ConvertFrom-Json | Where-Object { $_.Timestamp -gt (Get-Date).AddHours(-24) } }
)

foreach ($Job in $Jobs) {
    Start-Job -ScriptBlock $Job
}
```

## Seguridad y Mejores Prácticas

### Configuración de Producción

1. **Cambiar credenciales por defecto**
2. **Configurar SSL/TLS en Nginx**
3. **Limitar acceso por IP en rate limiting**
4. **Configurar backup automático de secretos**
5. **Monitorear logs de auditoría**

### Política de Acceso

- Secretos rotan cada 90 días automáticamente
- Logs de auditoría conservados por 30 días
- Backups de configuración retenidos por 7 días
- Health checks cada 30 segundos

---

**Versión**: 1.0.0
**Fecha**: 2025-01-08
**Sistema Operativo**: Windows + PowerShell
**Encoding**: ASCII para compatibilidad

Para soporte y actualizaciones, revisar los logs y la documentación en `/docs/`.
