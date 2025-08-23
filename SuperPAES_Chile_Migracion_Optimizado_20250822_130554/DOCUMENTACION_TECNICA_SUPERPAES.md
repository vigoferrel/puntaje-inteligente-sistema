# DOCUMENTACION TECNICA SISTEMA SUPERPAES

## Indice de Contenidos

1. [Introduccion](#1-introduccion)
2. [Arquitectura General](#2-arquitectura-general)
3. [Componentes Principales](#3-componentes-principales)
4. [Flujos de Datos](#4-flujos-de-datos)
5. [Configuracion y Despliegue](#5-configuracion-y-despliegue)
6. [Mantenimiento y Debugging](#6-mantenimiento-y-debugging)
7. [Apendices](#7-apendices)

## 1. Introduccion

### 1.1 Proposito del Sistema

El sistema SuperPaes es una plataforma educativa avanzada diseñada para la preparacion y evaluacion de estudiantes para las pruebas PAES (Prueba de Acceso a la Educacion Superior). Incorpora procesamiento "cuantico" y analisis basado en la Taxonomia de Bloom para personalizar la experiencia de aprendizaje.

### 1.2 Alcance del Sistema

El sistema permite:
- Creacion y administracion de evaluaciones personalizadas
- Analisis detallado del progreso del estudiante
- Recomendaciones adaptativas de estudio
- Integracion con servicios externos (Spotify, OpenRouter)
- Visualizacion avanzada del rendimiento

## 2. Arquitectura General

### 2.1 Diagrama de Arquitectura

```
+-----------------------------------------------------------------------+
|                           CAPA DE USUARIO                             |
|                                                                       |
|  +-------------+  +----------------+  +------------+  +-----------+   |
|  | PAES-PRO    |  | Puntaje        |  | Reading    |  | PAES      |   |
|  | Next.js     |  | Inteligente    |  | Competence |  | Agente UI |   |
|  +-------------+  +----------------+  +------------+  +-----------+   |
+-----------------------------------------------------------------------+
                                |
+-----------------------------------------------------------------------+
|                       CAPA DE COMUNICACION                            |
|                                                                       |
|          +------------------+        +------------------+             |
|          |  WebSocket       |        |  REST API        |             |
|          |  Server          |        |  Gateway         |             |
|          +------------------+        +------------------+             |
+-----------------------------------------------------------------------+
                                |
+-----------------------------------------------------------------------+
|                    CAPA DE PROCESAMIENTO CORE                         |
|                                                                       |
|  +-----------------------+     +------------------------+             |
|  |   PAES-MASTER (Node)  |     |   PAES-AGENTE (Flask) |             |
|  |                       |     |                        |             |
|  | * Motor Cuantico      |     | * Procesamiento IA    |             |
|  | * Sesiones Estudio    |<--->| * OpenRouter          |             |
|  | * Evaluaciones        |     | * Analisis            |             |
|  | * Taxonomia Bloom     |     | * Recomendaciones     |             |
|  | * Spotify Neural      |     |                        |             |
|  +-----------------------+     +------------------------+             |
+-----------------------------------------------------------------------+
                                |
+-----------------------------------------------------------------------+
|                        CAPA DE DATOS                                  |
|                                                                       |
|  +------------------+  +------------------+  +------------------+     |
|  | Supabase         |  | SQLite           |  | File System      |     |
|  | PostgreSQL       |  | Cache Local      |  | Logs & Metricas  |     |
|  +------------------+  +------------------+  +------------------+     |
+-----------------------------------------------------------------------+
                                |
+---------------------------+   |   +---------------------------+
|  SERVICIOS EXTERNOS       |   |   |     COMPONENTES BACKUP    |
|                           |   |   |                           |
| * Spotify API            |<--|-->| * PAES-Master-MVP         |
| * OpenRouter API         |       | * Reading Competence      |
+---------------------------+       +---------------------------+
```

### 2.2 Inventario de Aplicaciones

El sistema SuperPaes esta compuesto por 7 subproyectos principales:

```
C:\Users\Hp\Desktop\superpaes\
├── paes-agente/                    # React + Flask (IA Agent)
├── paes-master/                    # Node.js Motor Cuantico
├── paes-master-mvp/                # Python Flask Optimizado
├── paes-pro/                       # Next.js Web App
├── puntaje-inteligente-sistema/    # React + Vite + TypeScript
├── reading-competence-backup/      # Vue.js (Backup)
├── reading-competence-temp/        # Vue.js (Temporal)
└── Documentacion de configuracion
```

## 3. Componentes Principales

### 3.1 PAES-MASTER (Motor Cuantico)

#### Descripcion
Motor cuantico educativo implementado en Node.js que procesa sesiones de aprendizaje usando algoritmos de "entrelazamiento cuantico" y analisis basado en la Taxonomia de Bloom.

#### Tecnologias
- Node.js + ES Modules + TypeScript
- Puerto: 3001
- APIs REST

#### Estructura Interna
```
paes-master/
├── quantum-core/
│   ├── quantum-engine.js      # Motor cuantico principal
│   ├── paes-agent.ts          # Agente educativo
│   ├── paes-structure.js      # Estructura PAES
│   ├── spotify-neural.ts      # Integracion con Spotify
│   └── supabase-integration.js # Integracion con DB
├── api/
│   ├── routes/                # Rutas API
│   └── controllers/           # Controladores
├── utils/
│   ├── logging.js             # Logging rotativo
│   └── metrics.js             # Metricas
└── server.js                  # Punto de entrada
```

#### API Endpoints
```
GET  /api/quantum/status          # Estado del sistema
GET  /api/quantum/structure       # Estructura PAES
GET  /api/quantum/progress        # Progreso de usuario
POST /api/quantum/session         # Sesion de aprendizaje
POST /api/quantum/measure         # Medicion cuantica
```

#### Metricas Reportadas
```
{
  "quantumState": {
    "nodes": 150,
    "bloom": 42,
    "spotify": 8,
    "entanglement": 67,
    "coherence": 0.85,
    "entropy": 0.23
  },
  "performance": {
    "memory": "45MB",
    "cpu": "12%",
    "uptime": "3h 45m"
  }
}
```

### 3.2 PAES-PRO (Frontend Principal)

#### Descripcion
Interfaz principal del estudiante implementada con Next.js 14, proporcionando una experiencia de usuario optimizada e integracion directa con el motor cuantico.

#### Tecnologias
- Next.js 14 + TypeScript + Tailwind CSS
- Puerto: 3000 (desarrollo)
- SSR con App Router

#### Estructura Interna
```
paes-pro/
├── app/
│   ├── layout.tsx            # Layout principal
│   ├── page.tsx              # Pagina principal
│   └── routes/               # Rutas de la app
├── components/
│   ├── ui/                   # Componentes de UI
│   └── dashboard/            # Componentes dashboard
├── lib/
│   ├── supabase/             # Cliente Supabase
│   └── api/                  # Clientes API
└── public/                   # Archivos estaticos
```

#### Flujos Principales
```
1. Login -> Supabase Auth -> JWT Token -> Estado global (Zustand)
2. Dashboard -> Seleccionar area -> Configurar parametros
3. Sesion estudio -> Enviar a PAES-Master -> Recibir analisis
4. Visualizacion -> WebSocket -> Updates en tiempo real
```

### 3.3 PAES-AGENTE (Sistema IA)

#### Descripcion
Agente de inteligencia artificial para asistencia educativa personalizada implementado con Flask y React.

#### Tecnologias
- Backend: Python Flask + OpenRouter
- Frontend: React + Webpack
- Puertos: 5000 (Backend), 3000 (Frontend)

#### Estructura Interna
```
paes-agente/
├── backend/
│   ├── main.py               # Aplicacion Flask
│   ├── routes/               # Rutas API
│   ├── services/             # Servicios
│   └── utils/                # Utilidades
├── frontend/
│   ├── src/
│   │   ├── components/       # Componentes React
│   │   ├── pages/            # Paginas
│   │   └── index.jsx         # Punto de entrada
│   └── public/
└── Dockerfile                # Configuracion Docker
```

#### API Endpoints
```
POST /chat           # Chat con IA
GET  /health         # Estado del sistema
POST /analyze        # Analisis educativo
```

#### Metricas Reportadas
```
{
  "ai_metrics": {
    "requests_processed": 234,
    "average_response_time": "1.2s",
    "model_accuracy": 0.94,
    "token_usage": 15420
  },
  "system_metrics": {
    "memory": "128MB",
    "cpu": "18%",
    "disk_io": "2.1MB/s"
  }
}
```

### 3.4 Puntaje Inteligente (Analisis Avanzado)

#### Descripcion
Sistema de analisis avanzado del rendimiento estudiantil con algoritmos de machine learning y visualizaciones interactivas.

#### Tecnologias
- React + Vite + TypeScript
- Altamente optimizado para rendimiento

#### Caracteristicas Principales
- Analisis de rendimiento en tiempo real
- Prediccion de resultados
- Cache inteligente de metricas
- Visualizaciones D3.js

## 4. Flujos de Datos

### 4.1 Flujo de Sesion de Estudio

```
+--------+    +-----------+    +------------+    +-------------+
| INICIO |    | PAES-PRO  |    | PAES-MASTER|    | PAES-AGENTE |
+--------+    +-----------+    +------------+    +-------------+
    |               |                |                  |
    | 1. Inicia     |                |                  |
    | sesion        |                |                  |
    +-------------->|                |                  |
    |               |                |                  |
    |               | 2. Autentica   |                  |
    |               | con Supabase   |                  |
    |               |--------------->|                  |
    |               |                |                  |
    |               | 3. POST /api/quantum/session      |
    |               |--------------->|                  |
    |               |                |                  |
    |               |                | 4. Procesa      |
    |               |                | quantum neural   |
    |               |                |                  |
    |               |                | 5. Guarda en    |
    |               |                | Supabase         |
    |               |                |                  |
    |               |                | 6. Solicita     |
    |               |                | analisis IA      |
    |               |                |----------------->|
    |               |                |                  |
    |               |                |                  | 7. Procesa
    |               |                |                  | con OpenRouter
    |               |                |                  |
    |               |                | 8. Devuelve     |
    |               |                | recomendaciones  |
    |               |                |<-----------------|
    |               |                |                  |
    |               | 9. Estado y    |                  |
    |               | recomendaciones|                  |
    |               |<---------------|                  |
    |               |                |                  |
    | 10. Visualiza |                |                  |
    | resultados    |                |                  |
    |<--------------|                |                  |
    |               |                |                  |
+--------+    +-----------+    +------------+    +-------------+
| USUARIO|    | PAES-PRO  |    | PAES-MASTER|    | PAES-AGENTE |
+--------+    +-----------+    +------------+    +-------------+
```

### 4.2 Flujo de Evaluaciones

```
+--------+    +-----------+    +------------+    +-------------+
| USUARIO|    | PAES-PRO  |    | PAES-MASTER|    | SUPABASE    |
+--------+    +-----------+    +------------+    +-------------+
    |               |                |                  |
    | 1. Solicita   |                |                  |
    | evaluacion    |                |                  |
    +-------------->|                |                  |
    |               |                |                  |
    |               | 2. Obtiene     |                  |
    |               | estructura PAES|                  |
    |               |--------------->|                  |
    |               |                |                  |
    |               | 3. Crea examen |                  |
    |               | cuantico       |                  |
    |               |--------------->|                  |
    |               |                |                  |
    |               | 4. Retorna     |                  |
    |               | evaluacion     |                  |
    |               |<---------------|                  |
    |               |                |                  |
    | 5. Presenta   |                |                  |
    | examen        |                |                  |
    |<--------------|                |                  |
    |               |                |                  |
    | 6. Completa   |                |                  |
    | respuestas    |                |                  |
    +-------------->|                |                  |
    |               |                |                  |
    |               | 7. Envia       |                  |
    |               | respuestas     |                  |
    |               |--------------->|                  |
    |               |                |                  |
    |               |                | 8. Calcula      |
    |               |                | resultados       |
    |               |                |                  |
    |               |                | 9. Actualiza    |
    |               |                | progreso usuario |
    |               |                |----------------->|
    |               |                |                  |
    |               | 10. Retorna    |                  |
    |               | resultados     |                  |
    |               |<---------------|                  |
    |               |                |                  |
    | 11. Muestra   |                |                  |
    | feedback      |                |                  |
    |<--------------|                |                  |
    |               |                |                  |
+--------+    +-----------+    +------------+    +-------------+
| USUARIO|    | PAES-PRO  |    | PAES-MASTER|    | SUPABASE    |
+--------+    +-----------+    +------------+    +-------------+
```

### 4.3 Integracion de Motor Cuantico

```
+------------------+          +-----------------+
| PAES-MASTER      |          | SPOTIFY API     |
| Quantum Engine   |          |                 |
+------------------+          +-----------------+
         |                              |
         |   1. Inicializacion          |
         |   Cuantica                   |
         |                              |
         |   2. Creacion de nodos       |
         |   LearningNode               |
         |                              |
         |   3. Entrelazamiento         |
         |   de conceptos               |
         |                              |
         |   4. Solicitud de            |
         |   playlists                  |
         |----------------------------->|
         |                              |
         |   5. Obtencion de            |
         |   frecuencias neurales       |
         |<-----------------------------|
         |                              |
         |   6. Calculo de              |
         |   coherencia cuantica        |
         |                              |
         |   7. Optimizacion de         |
         |   aprendizaje                |
         |                              |
+------------------+          +-----------------+
| PAES-MASTER      |          | SPOTIFY API     |
| Quantum Engine   |          |                 |
+------------------+          +-----------------+
```

## 5. Configuracion y Despliegue

### 5.1 Requisitos del Sistema

- Node.js v18+
- Python 3.9+
- Docker (recomendado para PAES-Agente)
- Supabase (cuenta y proyecto configurado)

### 5.2 Variables de Entorno

```
# PAES-MASTER
QUANTUM_PORT=3001
SUPABASE_URL=https://your-project.supabase.co
SUPABASE_KEY=your-supabase-key
SPOTIFY_CLIENT_ID=your-spotify-client-id
SPOTIFY_CLIENT_SECRET=your-spotify-client-secret
LOG_LEVEL=info

# PAES-AGENTE
FLASK_APP=main.py
FLASK_ENV=production
OPENROUTER_API_KEY=your-openrouter-key
REACT_APP_API_URL=http://localhost:5000
```

### 5.3 Comandos de Despliegue

#### 5.3.1 PAES-MASTER (Motor Cuantico)

```powershell
# Iniciar en segundo plano con metricas
cd C:\Users\Hp\Desktop\superpaes\paes-master
npm run quantum:test

# Verificar estado
npm run quantum:status

# Detener proceso
npm run quantum:stop
```

#### 5.3.2 PAES-AGENTE (Sistema IA)

```powershell
# Con Docker (recomendado)
cd C:\Users\Hp\Desktop\superpaes\paes-agente
docker build -t paes-agente .
docker run -d -p 3000:3000 -p 5000:5000 paes-agente

# Sin Docker
Start-Process -NoNewWindow npm "start"
```

#### 5.3.3 PAES-PRO (Frontend)

```powershell
# Desarrollo con logging
cd C:\Users\Hp\Desktop\superpaes\paes-pro
$env:NODE_ENV="production"
Start-Process -NoNewWindow npm "run dev"
```

### 5.4 Configuracion de Bases de Datos

#### 5.4.1 Esquema Supabase

```sql
-- Tablas principales
CREATE TABLE user_progress (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL,
  node_id TEXT NOT NULL,
  best_score DECIMAL(5,2),
  average_score DECIMAL(5,2),
  status TEXT,
  bloom_progress DECIMAL(5,2),
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

CREATE TABLE practice_sessions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL,
  test_type TEXT NOT NULL,
  total_questions INTEGER,
  correct_answers INTEGER,
  total_score DECIMAL(5,2),
  time_spent_minutes INTEGER,
  created_at TIMESTAMP DEFAULT NOW()
);

CREATE TABLE diagnostic_assessments (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL,
  assessment_type TEXT NOT NULL,
  overall_score DECIMAL(5,2),
  detailed_scores JSONB,
  created_at TIMESTAMP DEFAULT NOW()
);
```

## 6. Mantenimiento y Debugging

### 6.1 Estructura de Logs

```
C:\Users\Hp\Desktop\superpaes\logs\
├── quantum-engine.log      # Rotativo 10MB, 5 backups
├── ai-agent.log           # Rotativo con timestamps
├── paes-pro.log           # Next.js development/production
├── performance.log        # Metricas de sistema
└── errors.log             # Errores centralizados
```

### 6.2 Monitoreo del Sistema

#### 6.2.1 Script de Verificacion Automatica

```powershell
# Health Check Automatico (health-check.ps1)
while ($true) {
    Write-Host "=== SuperPaes Health Check - $(Get-Date) ==="
    
    # Verificar Quantum Server
    try {
        $quantum = Invoke-RestMethod -Uri "http://localhost:3001/api/quantum/status"
        Write-Host "Quantum Engine: $($quantum.status) - Nodos: $($quantum.quantumState.nodes)"
    } catch {
        Write-Host "ERROR: Quantum Engine no responde"
    }
    
    # Verificar AI Agent
    try {
        $ai = Invoke-RestMethod -Uri "http://localhost:5000/health"
        Write-Host "AI Agent: $($ai.status) - Procesados: $($ai.ai_metrics.requests_processed)"
    } catch {
        Write-Host "ERROR: AI Agent no responde"
    }
    
    # Verificar PAES-PRO
    try {
        $response = Invoke-WebRequest -Uri "http://localhost:3000" -Method Head
        Write-Host "PAES-PRO: Online ($($response.StatusCode))"
    } catch {
        Write-Host "ERROR: PAES-PRO no responde"
    }
    
    Start-Sleep -Seconds 300  # Verificar cada 5 minutos
}
```

#### 6.2.2 Alertas de Rendimiento

- **CPU > 80%**: Alerta high CPU usage
- **Memory > 500MB**: Alerta high memory usage  
- **Response Time > 5s**: Alerta slow response
- **Error Rate > 5%**: Alerta high error rate

### 6.3 Comandos Utiles de Debugging

```powershell
# Ver logs en tiempo real
Get-Content -Path "C:\Users\Hp\Desktop\superpaes\logs\quantum-engine.log" -Wait

# Verificar procesos activos
Get-Process | Where-Object { $_.ProcessName -like "*node*" -or $_.ProcessName -like "*python*" }

# Verificar puertos en uso
netstat -ano | findstr "3001 5000 3000"

# Reiniciar todos los servicios
.\restart-services.ps1
```

### 6.4 Troubleshooting Comun

#### 6.4.1 PAES-MASTER no inicia

**Problema**: El Motor Cuantico no inicia o no responde.

**Solucion**:
1. Verificar logs: `Get-Content -Path "logs\quantum-engine.log" -Tail 20`
2. Verificar puerto: `netstat -ano | findstr "3001"`
3. Matar proceso si esta colgado: `taskkill /F /PID <PID>`
4. Reiniciar servicio: `npm run quantum:stop` seguido de `npm run quantum:test`

#### 6.4.2 PAES-AGENTE Error de Conexion

**Problema**: El sistema de IA muestra errores de conexion.

**Solucion**:
1. Verificar estado del contenedor: `docker ps -a`
2. Reiniciar el contenedor: `docker restart <container_id>`
3. Verificar logs: `docker logs <container_id>`
4. Si persiste, reconstruir: `docker build -t paes-agente . && docker run -d -p 3000:3000 -p 5000:5000 paes-agente`

#### 6.4.3 PAES-PRO No Carga

**Problema**: La interfaz web no carga correctamente.

**Solucion**:
1. Verificar dependencias: `cd paes-pro && npm install`
2. Limpiar cache: `npm run clean`
3. Verificar conexion a Supabase en `.env`
4. Reiniciar en modo desarrollo: `npm run dev`

## 7. Apendices

### 7.1 Taxonomia de Bloom Implementada

```
L1 (Recordar):
- Verbos: recordar, reconocer, listar, describir
- Ejemplos: Definir conceptos basicos, Identificar elementos

L2 (Comprender):
- Verbos: explicar, interpretar, resumir, parafrasear
- Ejemplos: Explicar procesos, Interpretar datos

L3 (Aplicar):
- Verbos: aplicar, resolver, usar, calcular
- Ejemplos: Resolver problemas, Aplicar formulas

L4 (Analizar):
- Verbos: analizar, comparar, contrastar, examinar
- Ejemplos: Analizar estructuras, Examinar relaciones

L5 (Evaluar):
- Verbos: evaluar, juzgar, criticar, valorar
- Ejemplos: Evaluar argumentos, Valorar resultados

L6 (Crear):
- Verbos: crear, diseñar, desarrollar, innovar
- Ejemplos: Crear soluciones, Diseñar modelos
```

### 7.2 Estructura PAES

```javascript
PaesTestType: {
  COMPETENCIA_LECTORA: {
    name: "Competencia Lectora",
    skills: ["Comprension", "Interpretacion", "Analisis"],
    subSkills: {
      "Comprension": ["Literal", "Inferencial", "Critica"],
      // ...
    },
    bloomMapping: {
      "Literal": "L1",
      "Inferencial": "L2",
      "Critica": "L5"
    }
  },
  MATEMATICA_M1: {
    // Estructura similar...
  },
  // Otros tipos de prueba...
}
```

### 7.3 Roadmap de Mejoras

#### Prioridad Alta
1. Estandarizar logging en paes-pro y reading-competence
2. Implementar metricas en sistemas Vue.js
3. Configurar supervision con PM2 o similar
4. Centralizar configuracion de entorno

#### Prioridad Media
1. API Gateway unificada para routing centralizado
2. Cache distribuido con Redis
3. Load balancing para escalabilidad
4. CI/CD pipeline automatizado
