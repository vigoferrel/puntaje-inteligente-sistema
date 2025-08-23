# 🚀 SuperPAES Chile - Despliegue Robusto

Este documento describe cómo desplegar el sistema SuperPAES Chile de manera robusta y automatizada.

## 📋 Prerrequisitos

- **Python 3.8+** instalado y en PATH
- **Node.js 16+** instalado y en PATH
- **npm** (incluido con Node.js)
- **Windows 10/11** (para los scripts .bat y .ps1)

## 🛠️ Scripts de Despliegue

### 1. Script Batch (Recomendado para usuarios básicos)

```bash
# Ejecutar como administrador (recomendado)
lanzar_superpaes_robusto.bat
```

**Características:**
- ✅ Limpieza automática de puertos ocupados
- ✅ Verificación de dependencias
- ✅ Instalación automática de paquetes
- ✅ Despliegue en ventanas separadas
- ✅ Verificación de conectividad
- ✅ Apertura automática del navegador

### 2. Script PowerShell (Recomendado para usuarios avanzados)

```powershell
# Ejecutar como administrador (recomendado)
.\lanzar_superpaes_robusto.ps1

# Opciones disponibles:
.\lanzar_superpaes_robusto.ps1 -Force           # Forzar despliegue
.\lanzar_superpaes_robusto.ps1 -SkipCleanup     # Saltar limpieza
.\lanzar_superpaes_robusto.ps1 -SkipDependencies # Saltar verificación de dependencias
```

**Características adicionales:**
- ✅ Monitoreo en tiempo real
- ✅ Jobs de PowerShell para mejor control
- ✅ Logs detallados con timestamps
- ✅ Manejo de errores avanzado
- ✅ Limpieza automática al salir

## 🔧 Proceso de Despliegue

### Fase 1: Limpieza
1. **Detener procesos** en puertos 3000, 3001, 5000
2. **Terminar procesos** Python y Node.js
3. **Esperar liberación** de puertos

### Fase 2: Verificación
1. **Verificar Python** 3.8+
2. **Verificar Node.js** 16+
3. **Verificar npm**

### Fase 3: Configuración
1. **Crear entorno virtual** (si no existe)
2. **Activar entorno virtual**
3. **Instalar dependencias Python**
4. **Instalar dependencias Node.js**

### Fase 4: Despliegue
1. **Iniciar Backend** (Puerto 5000)
2. **Esperar backend** esté listo
3. **Iniciar Frontend** (Puerto 3000/3001)
4. **Esperar frontend** esté listo

### Fase 5: Verificación
1. **Probar API** del backend
2. **Probar frontend**
3. **Abrir navegador** automáticamente

## 🌐 URLs del Sistema

Una vez desplegado, el sistema estará disponible en:

- **Frontend:** http://localhost:3000 (o 3001 si 3000 está ocupado)
- **Backend:** http://localhost:5000
- **Health Check:** http://localhost:5000/api/health

## 📊 Monitoreo y Control

### Script Batch
```bash
# Ver procesos
tasklist /fi "imagename eq python.exe"
tasklist /fi "imagename eq node.exe"

# Detener sistema
taskkill /f /im python.exe
taskkill /f /im node.exe
```

### Script PowerShell
```powershell
# Ver jobs
Get-Job

# Ver logs del backend
Receive-Job -Job $backendJob

# Ver logs del frontend
Receive-Job -Job $frontendJob

# Detener sistema
Stop-Job -Job $backendJob, $frontendJob
```

## 🚨 Solución de Problemas

### Error: "Puerto ya en uso"
```bash
# Verificar qué proceso usa el puerto
netstat -ano | findstr :5000
netstat -ano | findstr :3000

# Terminar proceso específico
taskkill /f /pid <PID>
```

### Error: "Python no encontrado"
1. Verificar que Python esté instalado
2. Verificar que esté en PATH
3. Reiniciar terminal después de instalar Python

### Error: "Node.js no encontrado"
1. Verificar que Node.js esté instalado
2. Verificar que esté en PATH
3. Reiniciar terminal después de instalar Node.js

### Error: "Permisos insuficientes"
1. Ejecutar como administrador
2. Verificar políticas de ejecución de PowerShell:
   ```powershell
   Set-ExecutionPolicy -ExecutionPolicy RemoteSigned -Scope CurrentUser
   ```

### Error: "Backend no responde"
1. Verificar que el archivo `backend/app_simple.py` existe
2. Verificar que las dependencias estén instaladas
3. Revisar logs del backend

### Error: "Frontend no responde"
1. Verificar que `package.json` existe
2. Verificar que las dependencias estén instaladas
3. Revisar logs del frontend

## 🔄 Reinicio del Sistema

Para reiniciar completamente el sistema:

1. **Detener procesos actuales:**
   ```bash
   taskkill /f /im python.exe
   taskkill /f /im node.exe
   ```

2. **Ejecutar script nuevamente:**
   ```bash
   lanzar_superpaes_robusto.bat
   # o
   .\lanzar_superpaes_robusto.ps1
   ```

## 📝 Logs y Debugging

### Logs del Backend
- Se muestran en la ventana "SuperPAES Backend"
- Incluyen errores de Flask y la aplicación

### Logs del Frontend
- Se muestran en la ventana "SuperPAES Frontend"
- Incluyen errores de Vite y React

### Logs del Sistema
- El script PowerShell muestra logs detallados
- Incluye timestamps y estados de cada fase

## 🎯 Características del Sistema Integrado

Una vez desplegado, tendrás acceso a:

- ✅ **Dashboard** con métricas en tiempo real
- ✅ **Sistema de Ejercicios** con taxonomía Bloom
- ✅ **Agentes IA** especializados
- ✅ **Playlists Neural** de Spotify
- ✅ **Calendario** integrado
- ✅ **Sistema de Notificaciones**
- ✅ **Analytics** avanzados
- ✅ **Sistema Integrado** con todas las funcionalidades

## 🚀 Próximos Pasos

1. **Ejecutar el script** de despliegue
2. **Verificar** que todos los servicios estén funcionando
3. **Explorar** las diferentes secciones del sistema
4. **Probar** los ejercicios PAES
5. **Configurar** metas personalizadas

¡El sistema SuperPAES Chile está listo para ayudarte a alcanzar tus metas académicas! 🎓
