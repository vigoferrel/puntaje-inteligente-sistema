# 🚀 Guía de Onboarding SuperPAES

## 📁 Estructura del Proyecto (Rutas Absolutas)

```
C:\Users\Hp\Desktop\superpaes\
├── paes-master\                    # Motor cuántico principal
├── paes-pro\                       # Frontend React principal
├── paes-agente\                   # Sistema de agentes IA
├── paes-master-mvp\               # MVP del sistema maestro
├── paes-mobile\                   # Aplicación móvil
├── paes-nextjs\                   # Frontend Next.js alternativo
├── paes-vue\                      # Frontend Vue.js
├── LADRILLO-CUANTICO-MASTER.ps1   # Script maestro de orquestación
└── quantum-logs\                  # Logs del sistema cuántico
```

## 🛠️ Prerrequisitos de Sistema

### Software Requerido
- **Node.js 18+**: [Descargar aquí](https://nodejs.org/)
- **Python 3.8+**: [Descargar aquí](https://python.org/)
- **Git**: [Descargar aquí](https://git-scm.com/)
- **PowerShell 5.1+**: Incluido en Windows
- **Visual Studio Code**: [Descargar aquí](https://code.visualstudio.com/)

### Verificar Instalaciones
```powershell
# Ejecutar desde PowerShell en C:\Users\Hp\Desktop\superpaes\
node --version
python --version
git --version
$PSVersionTable.PSVersion
```

## 🔧 Configuración Inicial Paso a Paso

### Paso 1: Configurar Variables de Entorno
```powershell
# Crear archivo de variables de entorno
$envFile = "C:\Users\Hp\Desktop\superpaes\.env.global"
@"
# SuperPAES Global Configuration
SUPERPAES_ROOT=C:\Users\Hp\Desktop\superpaes
QUANTUM_ENGINE_PORT=3001
PAES_PRO_PORT=3000
PAES_AGENTE_PORT=8000
PAES_MASTER_MVP_PORT=3002
PAES_MOBILE_PORT=19006
PAES_NEXTJS_PORT=3003
PAES_VUE_PORT=8080

# Supabase Configuration (Configurar con tus credenciales)
SUPABASE_URL=your_supabase_url
SUPABASE_ANON_KEY=your_supabase_anon_key
SUPABASE_SERVICE_KEY=your_service_key

# OpenRouter API (Para IA)
OPENROUTER_API_KEY=your_openrouter_key

# Spotify Integration (Opcional)
SPOTIFY_CLIENT_ID=your_spotify_client_id
SPOTIFY_CLIENT_SECRET=your_spotify_client_secret

# Logs Configuration
LOG_LEVEL=info
LOG_ROTATION=daily
"@ | Out-File -FilePath $envFile -Encoding UTF8

Write-Host "✅ Archivo de configuración creado en: $envFile"
```

### Paso 2: Inicializar Componentes Principales

#### 2.1 Motor Cuántico (paes-master)
```powershell
# Navegar al directorio del motor cuántico
Set-Location "C:\Users\Hp\Desktop\superpaes\paes-master"

# Instalar dependencias
npm install

# Configurar variables específicas
Copy-Item "C:\Users\Hp\Desktop\superpaes\.env.global" ".env"

# Verificar configuración
npm run test:config
```

#### 2.2 Frontend Principal (paes-pro)
```powershell
# Navegar al frontend principal
Set-Location "C:\Users\Hp\Desktop\superpaes\paes-pro"

# Instalar dependencias
npm install

# Configurar Supabase
Copy-Item "C:\Users\Hp\Desktop\superpaes\.env.global" ".env.local"

# Construir assets
npm run build
```

#### 2.3 Sistema de Agentes (paes-agente)
```powershell
# Navegar al sistema de agentes
Set-Location "C:\Users\Hp\Desktop\superpaes\paes-agente"

# Crear entorno virtual Python
python -m venv venv

# Activar entorno virtual
.\venv\Scripts\Activate.ps1

# Instalar dependencias
pip install -r requirements.txt

# Configurar variables
Copy-Item "C:\Users\Hp\Desktop\superpaes\.env.global" ".env"
```

## 🚀 Scripts de Lanzamiento Automatizado

### Script Maestro de Inicio
```powershell
# Crear script de inicio completo
$launchScript = "C:\Users\Hp\Desktop\superpaes\launch-superpaes.ps1"
@"
# SuperPAES Complete Launch Script
param(
    [switch]`$Development,
    [switch]`$Production,
    [switch]`$StatusOnly
)

`$SuperPAESRoot = "C:\Users\Hp\Desktop\superpaes"

function Write-Status {
    param([string]`$Message, [string]`$Color = "Green")
    Write-Host "[SuperPAES] `$Message" -ForegroundColor `$Color
}

function Start-Component {
    param([string]`$Name, [string]`$Path, [string]`$Command)
    
    Write-Status "Iniciando `$Name..." "Yellow"
    Set-Location "`$SuperPAESRoot\`$Path"
    
    if (`$Development) {
        Start-Process powershell -ArgumentList "-Command", "`$Command; Read-Host 'Presiona Enter para cerrar'" -WindowStyle Normal
    } else {
        Start-Process powershell -ArgumentList "-Command", "`$Command" -WindowStyle Hidden
    }
    
    Start-Sleep -Seconds 2
}

if (`$StatusOnly) {
    Write-Status "Verificando estado de componentes..." "Cyan"
    
    # Verificar puertos activos
    `$ports = @(3000, 3001, 3002, 3003, 8000, 8080, 19006)
    foreach (`$port in `$ports) {
        `$connection = Test-NetConnection -ComputerName localhost -Port `$port -InformationLevel Quiet
        if (`$connection) {
            Write-Status "Puerto `$port: ACTIVO" "Green"
        } else {
            Write-Status "Puerto `$port: INACTIVO" "Red"
        }
    }
    exit
}

Write-Status "🚀 Iniciando ecosistema SuperPAES..." "Magenta"

# 1. Motor Cuántico
Start-Component "Motor Cuántico" "paes-master" "npm run dev"

# 2. Frontend Principal
Start-Component "Frontend Pro" "paes-pro" "npm run dev"

# 3. Sistema de Agentes
Start-Component "Agentes IA" "paes-agente" ".\venv\Scripts\Activate.ps1; python app.py"

# 4. MVP Master
Start-Component "Master MVP" "paes-master-mvp" "npm run dev"

# 5. Aplicación Móvil (opcional)
if (`$Development) {
    Start-Component "Mobile App" "paes-mobile" "npx expo start"
}

Write-Status "✅ Todos los componentes iniciados!" "Green"
Write-Status "Accesos principales:" "Cyan"
Write-Status "  • Frontend Pro: http://localhost:3000" "White"
Write-Status "  • Motor Cuántico: http://localhost:3001" "White"
Write-Status "  • Agentes IA: http://localhost:8000" "White"
Write-Status "  • Master MVP: http://localhost:3002" "White"

if (`$Development) {
    Write-Status "Modo desarrollo activo. Las ventanas permanecerán abiertas." "Yellow"
}
"@ | Out-File -FilePath $launchScript -Encoding UTF8

Write-Host "✅ Script de lanzamiento creado en: $launchScript"
```

### Script de Verificación de Salud
```powershell
# Crear script de health check
$healthScript = "C:\Users\Hp\Desktop\superpaes\health-check.ps1"
@"
# SuperPAES Health Check Script
`$SuperPAESRoot = "C:\Users\Hp\Desktop\superpaes"

function Test-ComponentHealth {
    param([string]`$Name, [string]`$Url, [int]`$Port)
    
    try {
        `$response = Invoke-WebRequest -Uri `$Url -TimeoutSec 5 -UseBasicParsing
        if (`$response.StatusCode -eq 200) {
            Write-Host "✅ `$Name - SALUDABLE" -ForegroundColor Green
            return `$true
        }
    } catch {
        Write-Host "❌ `$Name - ERROR: `$(`$_.Exception.Message)" -ForegroundColor Red
        return `$false
    }
}

Write-Host "🔍 SuperPAES Health Check Report" -ForegroundColor Cyan
Write-Host "=================================" -ForegroundColor Cyan

`$components = @(
    @{Name="Frontend Pro"; Url="http://localhost:3000"; Port=3000},
    @{Name="Motor Cuántico"; Url="http://localhost:3001/health"; Port=3001},
    @{Name="Agentes IA"; Url="http://localhost:8000/health"; Port=8000},
    @{Name="Master MVP"; Url="http://localhost:3002"; Port=3002}
)

`$healthyCount = 0
foreach (`$component in `$components) {
    if (Test-ComponentHealth -Name `$component.Name -Url `$component.Url -Port `$component.Port) {
        `$healthyCount++
    }
}

Write-Host ""
Write-Host "📊 Resumen: `$healthyCount/`$(`$components.Count) componentes saludables" -ForegroundColor $(if(`$healthyCount -eq `$components.Count) {"Green"} else {"Yellow"})

# Verificar logs recientes
Write-Host ""
Write-Host "📋 Logs recientes:" -ForegroundColor Cyan
if (Test-Path "`$SuperPAESRoot\quantum-logs\ladrillo-cuantico.log") {
    Get-Content "`$SuperPAESRoot\quantum-logs\ladrillo-cuantico.log" -Tail 5 | ForEach-Object {
        Write-Host "  `$_" -ForegroundColor Gray
    }
}
"@ | Out-File -FilePath $healthScript -Encoding UTF8

Write-Host "✅ Script de health check creado en: $healthScript"
```

## 🎯 Comandos de Inicio Rápido

### Desarrollo (Recomendado para principiantes)
```powershell
# Cambiar al directorio del proyecto
Set-Location "C:\Users\Hp\Desktop\superpaes"

# Lanzar en modo desarrollo (ventanas visibles)
.\launch-superpaes.ps1 -Development
```

### Producción (Segundo plano)
```powershell
# Lanzar en modo producción (ventanas ocultas)
.\launch-superpaes.ps1 -Production
```

### Verificar Estado
```powershell
# Verificar qué componentes están corriendo
.\launch-superpaes.ps1 -StatusOnly

# Health check detallado
.\health-check.ps1
```

## 📊 Monitoreo y Logs

### Ubicaciones de Logs Importantes
```
C:\Users\Hp\Desktop\superpaes\quantum-logs\ladrillo-cuantico.log    # Log maestro
C:\Users\Hp\Desktop\superpaes\paes-master\logs\quantum-engine.log    # Motor cuántico
C:\Users\Hp\Desktop\superpaes\paes-pro\logs\frontend.log             # Frontend
C:\Users\Hp\Desktop\superpaes\paes-agente\logs\agents.log            # Agentes IA
```

### Comando para Ver Logs en Tiempo Real
```powershell
# Ver log maestro
Get-Content "C:\Users\Hp\Desktop\superpaes\quantum-logs\ladrillo-cuantico.log" -Wait -Tail 20

# Ver todos los logs importantes
$logFiles = @(
    "C:\Users\Hp\Desktop\superpaes\quantum-logs\ladrillo-cuantico.log",
    "C:\Users\Hp\Desktop\superpaes\paes-master\logs\quantum-engine.log"
)

foreach ($logFile in $logFiles) {
    if (Test-Path $logFile) {
        Write-Host "=== $(Split-Path $logFile -Leaf) ===" -ForegroundColor Yellow
        Get-Content $logFile -Tail 5
        Write-Host ""
    }
}
```

## 🔧 Troubleshooting Común

### Problema: Puerto Ya en Uso
```powershell
# Encontrar proceso usando puerto 3000
netstat -ano | findstr :3000
# Terminar proceso (reemplazar PID)
taskkill /PID <PID> /F
```

### Problema: Dependencias Faltantes
```powershell
# Reinstalar todas las dependencias
Set-Location "C:\Users\Hp\Desktop\superpaes"

# Para cada componente Node.js
$nodeComponents = @("paes-master", "paes-pro", "paes-master-mvp", "paes-nextjs", "paes-vue")
foreach ($component in $nodeComponents) {
    if (Test-Path $component) {
        Set-Location $component
        Remove-Item node_modules -Recurse -Force -ErrorAction SilentlyContinue
        npm install
        Set-Location ..
    }
}

# Para componente Python
Set-Location "paes-agente"
if (Test-Path "venv") {
    Remove-Item venv -Recurse -Force
}
python -m venv venv
.\venv\Scripts\Activate.ps1
pip install -r requirements.txt
```

### Problema: Variables de Entorno
```powershell
# Verificar variables
Get-Content "C:\Users\Hp\Desktop\superpaes\.env.global"

# Recrear variables si es necesario
# (Ejecutar el Paso 1 de configuración nuevamente)
```

## 🎯 Próximos Pasos

1. **Configurar Supabase**: Crear proyecto en [supabase.com](https://supabase.com) y actualizar credenciales
2. **Configurar OpenRouter**: Obtener API key en [openrouter.ai](https://openrouter.ai)
3. **Explorar Componentes**: Comenzar con `http://localhost:3000` (Frontend Pro)
4. **Revisar Documentación**: Leer `DOCUMENTACION_TECNICA_SUPERPAES.md`
5. **Configurar Backups**: Revisar scripts en `paes-agente/backup/`

## 📞 Comandos de Ayuda Rápida

```powershell
# Estado completo del sistema
.\health-check.ps1

# Reiniciar todo el sistema
taskkill /F /IM node.exe /T; taskkill /F /IM python.exe /T
.\launch-superpaes.ps1 -Development

# Ver logs importantes
Get-Content "quantum-logs\ladrillo-cuantico.log" -Tail 20

# Acceso rápido a componentes principales
explorer "http://localhost:3000"  # Frontend
explorer "http://localhost:3001"  # Motor Cuántico
explorer "http://localhost:8000"  # Agentes IA
```

---

**¡Bienvenido al ecosistema SuperPAES! 🚀**

Para soporte adicional, revisa los logs o ejecuta los health checks incluidos en esta guía.
