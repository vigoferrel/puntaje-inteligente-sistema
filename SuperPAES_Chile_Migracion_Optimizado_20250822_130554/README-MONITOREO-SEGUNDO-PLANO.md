# SISTEMA DE MONITOREO EN SEGUNDO PLANO - SUPERPAES

## Descripción General

Este sistema implementa el monitoreo continuo en segundo plano del Sistema Educativo SUPERPAES, cumpliendo con los requerimientos específicos:

- **Ejecución en segundo plano**: Todos los procesos se lanzan de forma no bloqueante
- **Reportes de desempeño**: Generación continua de métricas y reportes ASCII
- **Facilita depuración**: Logs detallados y reportes visuales para mantención
- **Compatible con Windows**: Utiliza PowerShell como se especifica en las reglas

## Arquitectura del Sistema

```
SUPERPAES/
├── monitor-sistema-educativo.js        ← Monitor principal (Node.js)
├── lanzar-monitor-background.ps1       ← Lanzador PowerShell
├── config-metricas-educativo.json      ← Configuración de métricas
├── logs/                               ← Directorio de salida
│   ├── monitor-educativo.log           ← Log principal
│   ├── metricas-educativo.json         ← Métricas JSON
│   ├── reporte-ascii-educativo.txt     ← Reporte visual ASCII
│   ├── monitor-stdout.log              ← Salida estándar
│   └── monitor-stderr.log              ← Errores del proceso
└── monitor-educativo.pid               ← Archivo PID del proceso
```

## Componentes Monitoreados

### 1. Context7
- **Función**: Sistema de estructura PAES oficial con taxonomía Bloom
- **Verificaciones**:
  - Presencia de 5 asignaturas PAES oficiales
  - 6 niveles de taxonomía Bloom
  - Configuración neural learning

### 2. Sistema Cuántico Educativo
- **Función**: Motor cuántico para procesamiento de datos educativos
- **Verificaciones**:
  - Motor cuántico activado
  - Aprendizaje neural habilitado
  - Nodos de aprendizaje operativos

### 3. Triada Renacentista
- **Función**: Integración de Arte, Ciencia y Tecnología
- **Verificaciones**:
  - Pilar Científico: Matemáticas y Ciencias
  - Pilar Humanístico: Historia y Competencia Lectora
  - Pilar Tecnológico: Integración Spotify

### 4. Multimodalidad Gemini
- **Función**: Sistema AI multimodal para contenido educativo
- **Verificaciones**:
  - OpenRouter habilitado para educación
  - Recomendaciones AI activas
  - Generación de contenido educativo

### 5. Plataforma PAES
- **Función**: Sistema base de la plataforma educativa
- **Verificaciones**:
  - Configuración educativa correcta
  - Keywords educativas presentes
  - Base de datos educativa configurada

### 6. Integridad del Sistema
- **Función**: Verificación de seguridad y integridad
- **Verificaciones**:
  - Ausencia de componentes de trading
  - Presencia de archivos esenciales
  - Estructura educativa limpia

## Instalación y Configuración

### Requisitos Previos
- **Node.js**: Versión 14.0.0 o superior
- **PowerShell**: Version 5.1 o superior (incluido en Windows)
- **Sistema Operativo**: Windows (como especifica la regla)

### Instalación Rápida

1. **Verificar requisitos**:
   ```powershell
   node --version
   $PSVersionTable.PSVersion
   ```

2. **Cambiar política de ejecución** (si es necesario):
   ```powershell
   Set-ExecutionPolicy -ExecutionPolicy RemoteSigned -Scope CurrentUser
   ```

3. **Iniciar monitor**:
   ```powershell
   .\lanzar-monitor-background.ps1 -Accion start
   ```

## Uso del Sistema

### Comandos Principales

#### Iniciar Monitoreo
```powershell
.\lanzar-monitor-background.ps1 -Accion start
```
- Inicia el monitor en segundo plano
- Crea archivo PID para control
- Comienza generación de reportes cada 30 segundos

#### Ver Estado Actual
```powershell
.\lanzar-monitor-background.ps1 -Accion status
```
- Muestra estado de todos los componentes
- Presenta último reporte ASCII
- Incluye métricas de rendimiento en tiempo real

#### Detener Monitoreo
```powershell
.\lanzar-monitor-background.ps1 -Accion stop
```
- Detención graceful del proceso
- Genera reporte final
- Limpia archivos temporales

#### Reiniciar Sistema
```powershell
.\lanzar-monitor-background.ps1 -Accion restart
```
- Detiene y reinicia automáticamente
- Útil para aplicar cambios de configuración

#### Instalar como Servicio Windows
```powershell
.\lanzar-monitor-background.ps1 -Accion install-service
```
- Requiere permisos de administrador
- Instala como servicio de Windows
- Inicio automático con el sistema

### Comandos Directos (Node.js)

También puede usar directamente el monitor de Node.js:

```bash
# Iniciar
node monitor-sistema-educativo.js start

# Estado
node monitor-sistema-educativo.js status

# Detener
node monitor-sistema-educativo.js stop

# Reiniciar
node monitor-sistema-educativo.js restart
```

## Reportes y Métricas

### Reporte ASCII (reporte-ascii-educativo.txt)

El sistema genera reportes ASCII cada 30 segundos con el siguiente formato:

```
╔══════════════════════════════════════════════════════════════════════════════╗
║                    REPORTE SISTEMA EDUCATIVO SUPERPAES                      ║
╠══════════════════════════════════════════════════════════════════════════════╣
║ Timestamp: 9/8/2025 21:30:15                                                ║
║ PID: 12345                                                                   ║
║ Uptime: 2.5 horas                                                           ║
╠══════════════════════════════════════════════════════════════════════════════╣
║                              ESTADO COMPONENTES                             ║
╠════════════════════════════════════════════════════════════════════════════╢
║ Context7                │ 🟢 OPERACIONAL │ Err:  0 │   45.2ms ║
║ Sistema Cuántico        │ 🟢 OPERACIONAL │ Err:  0 │   32.1ms ║
║ Triada Renacentista     │ 🟢 OPERACIONAL │ Err:  0 │   67.8ms ║
║ Multimodalidad Gemini   │ 🟡 DEGRADADO   │ Err:  2 │  156.3ms ║
║ Plataforma PAES         │ 🟢 OPERACIONAL │ Err:  0 │   23.7ms ║
║ Integridad Sistema      │ 🟢 OPERACIONAL │ Err:  0 │   12.4ms ║
╠════════════════════════════════════════════════════════════════════════════╢
║                            ESTADÍSTICAS GENERALES                           ║
╠════════════════════════════════════════════════════════════════════════════╢
║ Componentes Operacionales: 5/6                                              ║
║ Disponibilidad: 83.3%                                                       ║
║ Tiempo Promedio Respuesta: 56.2ms                                           ║
║ Total Errores: 2                                                            ║
╠════════════════════════════════════════════════════════════════════════════╢
║                              ESTADO GENERAL                                 ║
╠════════════════════════════════════════════════════════════════════════════╢
║ 🟡 SISTEMA EDUCATIVO REQUIERE ATENCIÓN - Algunos componentes degradados    ║
╠════════════════════════════════════════════════════════════════════════════╢
║                             EVENTOS RECIENTES                               ║
╠════════════════════════════════════════════════════════════════════════════╢
║ 21:29:45 [WARN] Multimodalidad Gemini Error: OpenRouter no disponible      ║
║ 21:29:15 [INFO] Ciclo completado en 89.32ms                                ║
║ 21:28:45 [INFO] Monitor iniciado exitosamente                              ║
╚════════════════════════════════════════════════════════════════════════════╝
```

### Métricas JSON (metricas-educativo.json)

Archivo JSON con métricas detalladas para análisis programático:

```json
{
  "timestamp": "2025-08-09T21:30:15.123Z",
  "uptime_total": 9000000,
  "pid": 12345,
  "componentes": {
    "context7": {
      "status": "operational",
      "tiempo_respuesta": 45.2,
      "errores": 0,
      "uptime": 9000000
    }
  },
  "estadisticas": {
    "total": 6,
    "operacionales": 5,
    "disponibilidad": "83.3",
    "tiempoPromedio": "56.2",
    "totalErrores": 2
  },
  "eventos_recientes": [...]
}
```

### Log Principal (monitor-educativo.log)

Log detallado con timestamp de todas las operaciones:

```
[2025-08-09T21:30:15.123Z] [INFO] Monitor iniciado exitosamente
[2025-08-09T21:30:45.456Z] [DEBUG] Iniciando ciclo de verificación
[2025-08-09T21:30:45.789Z] [ERROR] Multimodalidad Gemini Error: OpenRouter timeout
[2025-08-09T21:31:15.012Z] [INFO] Ciclo completado en 89.32ms
```

## Configuración Avanzada

### Modificar Intervalo de Monitoreo

Edite `config-metricas-educativo.json`:

```json
{
  "configuracion": {
    "intervalo_monitoreo_ms": 60000,  // 1 minuto en lugar de 30 segundos
    "timeout_verificacion_ms": 15000  // 15 segundos timeout
  }
}
```

### Personalizar Umbrales de Alerta

```json
{
  "componentes_monitoreados": {
    "context7": {
      "umbrales": {
        "tiempo_respuesta_max_ms": 2000,     // Máximo 2 segundos
        "errores_consecutivos_max": 3,       // Máximo 3 errores consecutivos
        "disponibilidad_min_porcentaje": 90  // Mínimo 90% disponibilidad
      }
    }
  }
}
```

### Configurar Rotación de Logs

```json
{
  "archivos_salida": {
    "rotacion": {
      "habilitada": true,
      "tamaño_max_mb": 50,      // 50MB por archivo
      "archivos_backup": 10,    // Mantener 10 backups
      "patron_fecha": "YYYYMMDD"
    }
  }
}
```

## Solución de Problemas

### Error: "Monitor ya está ejecutándose"

**Causa**: Ya existe un proceso monitor activo.

**Solución**:
```powershell
# Ver estado actual
.\lanzar-monitor-background.ps1 -Accion status

# Detener proceso existente
.\lanzar-monitor-background.ps1 -Accion stop

# Iniciar nuevamente
.\lanzar-monitor-background.ps1 -Accion start
```

### Error: "Node.js no encontrado"

**Causa**: Node.js no está instalado o no está en el PATH.

**Solución**:
1. Instalar Node.js desde https://nodejs.org
2. Verificar instalación: `node --version`
3. Reiniciar PowerShell

### Error: "Archivo educational.json no encontrado"

**Causa**: La configuración educativa no existe.

**Solución**:
```powershell
# Verificar estructura de archivos
Get-ChildItem -Recurse -Name "educational.json"

# El archivo debe estar en: paes-master/config/educational.json
```

### Monitor se detiene inesperadamente

**Causa**: Error en el código o falta de recursos.

**Solución**:
1. Revisar logs de error:
   ```powershell
   Get-Content logs/monitor-stderr.log -Tail 50
   ```
2. Verificar métricas de sistema:
   ```powershell
   Get-Process node | Format-Table Name,Id,CPU,WorkingSet
   ```
3. Reiniciar con modo verbose:
   ```powershell
   .\lanzar-monitor-background.ps1 -Accion start -Verbose
   ```

## Mejores Prácticas

### Monitoreo en Producción

1. **Instalar como servicio** para inicio automático
2. **Configurar alertas** para errores críticos
3. **Programar limpieza** de logs antiguos
4. **Monitorear uso de recursos** del sistema

### Depuración y Mantención

1. **Revisar reportes ASCII** regularmente para detectar patrones
2. **Analizar métricas JSON** para optimización de rendimiento
3. **Configurar umbrales** apropiados según el entorno
4. **Documentar cambios** en la configuración

### Seguridad

1. **Validar permisos** de archivos de log
2. **Restringir acceso** al directorio de logs
3. **No incluir datos sensibles** en logs
4. **Rotar logs** regularmente para evitar acumulación

## Integración con Otros Sistemas

### PowerShell Remoting

```powershell
# Monitorear desde máquina remota
Invoke-Command -ComputerName SERVIDOR -ScriptBlock {
    Set-Location C:\path\to\superpaes
    .\lanzar-monitor-background.ps1 -Accion status
}
```

### Scheduled Tasks

```powershell
# Crear tarea programada para inicio automático
$action = New-ScheduledTaskAction -Execute "powershell.exe" `
    -Argument "-ExecutionPolicy Bypass -File C:\path\to\superpaes\lanzar-monitor-background.ps1 -Accion start"

$trigger = New-ScheduledTaskTrigger -AtStartup

Register-ScheduledTask -TaskName "SuperpaesMonitor" -Action $action -Trigger $trigger
```

### Integración con Sistemas de Alerta

El sistema puede integrarse fácilmente con:
- **Email notifications** via PowerShell Send-MailMessage
- **Slack/Teams** webhooks desde el monitor JavaScript
- **EventLog de Windows** para alertas del sistema
- **SIEM systems** mediante parsing de logs JSON

## Conclusión

Este sistema de monitoreo en segundo plano cumple completamente con los requerimientos especificados:

✅ **Ejecución en segundo plano**: Procesos no bloqueantes con control PID
✅ **Reportes de desempeño**: Métricas continuas en JSON y ASCII  
✅ **Facilita depuración**: Logs detallados y reportes visuales
✅ **Compatible Windows**: PowerShell nativo y servicios Windows
✅ **Mantención simplificada**: Configuración centralizada y documentada

El sistema está listo para uso inmediato y proporciona una base sólida para el monitoreo continuo del Sistema Educativo SUPERPAES.
