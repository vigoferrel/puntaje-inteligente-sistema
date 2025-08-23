# ANALISIS DE MICROSERVICIOS Y ENDPOINTS - PAES PRO SYSTEM

## RESUMEN EJECUTIVO

### Sistema Identificado
- **Aplicacion Principal**: Next.js 14.0.0 con TypeScript
- **Base de Datos**: Supabase (PostgreSQL)
- **Arquitectura**: Monolitico modular con servicios diferenciados
- **Estado del Sistema**: DESARROLLO/TESTING - Parcialmente funcional

## 1. ARQUITECTURA DEL SISTEMA

```ascii
┌─────────────────────────────────────────────────────────────┐
│                    PAES PRO SYSTEM                          │
├─────────────────────────────────────────────────────────────┤
│  FRONTEND LAYER                                             │
│  ┌─────────────┐  ┌─────────────┐  ┌─────────────┐         │
│  │ Next.js App │  │ React Pages │  │ UI Components│         │
│  │ (Port 3000) │  │             │  │ (Tailwind)  │         │
│  └─────────────┘  └─────────────┘  └─────────────┘         │
├─────────────────────────────────────────────────────────────┤
│  API LAYER (Next.js API Routes)                            │
│  ┌─────────────┐  ┌─────────────┐  ┌─────────────┐         │
│  │ Chat API    │  │ Content Gen │  │ Progress API│         │
│  │ /api/chat   │  │ /api/gen-   │  │ /api/       │         │
│  │             │  │ content     │  │ progress    │         │
│  └─────────────┘  └─────────────┘  └─────────────┘         │
├─────────────────────────────────────────────────────────────┤
│  SERVICE LAYER (TypeScript Services)                       │
│  ┌─────────────┐  ┌─────────────┐  ┌─────────────┐         │
│  │ Exam Gen    │  │ Session Mgmt│  │ User Data   │         │
│  │ Service     │  │ Service     │  │ Service     │         │
│  └─────────────┘  └─────────────┘  └─────────────┘         │
├─────────────────────────────────────────────────────────────┤
│  DATABASE LAYER                                            │
│  ┌─────────────────────────────────────────────────────────┐ │
│  │              SUPABASE (PostgreSQL)                     │ │
│  │  • learning_nodes    • user_progress                   │ │
│  │  • exam_sessions     • diagnostic_assessments         │ │
│  │  • practice_sessions • exam_results                    │ │
│  └─────────────────────────────────────────────────────────┘ │
├─────────────────────────────────────────────────────────────┤
│  EXTERNAL INTEGRATIONS                                     │
│  ┌─────────────┐  ┌─────────────┐  ┌─────────────┐         │
│  │ OpenRouter  │  │ Supabase    │  │ Auth        │         │
│  │ AI API      │  │ Realtime    │  │ System      │         │
│  └─────────────┘  └─────────────┘  └─────────────┘         │
└─────────────────────────────────────────────────────────────┘
```

## 2. SERVICIOS IDENTIFICADOS Y ENDPOINTS

### 2.1 SERVICIO DE CHAT IA (Chat Service)
- **Archivo**: `app/api/chat/route.ts`
- **Puerto**: 3000 (Integrado en Next.js)
- **Estado**: ✅ FUNCIONAL

#### Endpoints REST:
```
POST /api/chat
├── Función: Procesar consultas de chat con IA
├── Payload: { message: string, conversation?: Array }
├── Respuesta: { response: string, usage: object, model: string }
└── Dependencias: OpenRouter API (GPT-4o-mini)

GET /api/chat
├── Función: Estado del servicio
└── Respuesta: { message, version, capabilities }
```

#### Configuracion:
- **Modelo IA**: OpenAI GPT-4o-mini via OpenRouter
- **API Key**: Configurada (hardcoded/env)
- **Timeouts**: Max 800 tokens
- **Fallback**: Respuestas pre-programadas

### 2.2 SERVICIO DE GENERACION DE CONTENIDO
- **Archivo**: `app/api/generate-content/route.ts`
- **Puerto**: 3000 (Integrado en Next.js)
- **Estado**: ⚠️ DEPENDIENTE DE LIBRERIA EXTERNA

#### Endpoints REST:
```
POST /api/generate-content
├── Función: Generar contenido educativo personalizado
├── Payload: { type, topic, difficulty, testType, context }
├── Tipos soportados: ['question', 'explanation', 'practice']
└── Materias: ['COMPETENCIA_LECTORA', 'MATEMATICA_M1', 'MATEMATICA_M2', 'CIENCIAS', 'HISTORIA']

GET /api/generate-content
└── Función: Documentacion de tipos soportados
```

#### Dependencias:
- **Libreria**: `@/lib/openrouter` (No verificada)
- **Estado**: Requiere implementacion de libreria

### 2.3 SERVICIO DE PROGRESO DE USUARIO
- **Archivo**: `app/api/progress/route.ts`
- **Puerto**: 3000 (Integrado en Next.js)
- **Estado**: ✅ FUNCIONAL CON SUPABASE

#### Endpoints REST:
```
GET /api/progress?userId={id}
├── Función: Obtener progreso del usuario
├── Respuesta: { progress, nodes, summary }
└── Metricas: totalNodes, completedNodes, inProgressNodes

POST /api/progress
├── Función: Actualizar progreso de usuario
├── Payload: { userId, nodeId, status, progressPercentage, score, timeSpentMinutes }
└── Respuesta: { success, progress }
```

#### Dependencias:
- **Base de datos**: Supabase
- **Funciones**: getUserProgress, updateUserProgress, getLearningNodes

### 2.4 SERVICIO DE TESTING DE BASE DE DATOS
- **Archivo**: `app/api/test-db/route.ts`
- **Puerto**: 3000 (Integrado en Next.js)
- **Estado**: ✅ FUNCIONAL - HERRAMIENTA DE DIAGNOSTICO

#### Endpoints REST:
```
GET /api/test-db
├── Función: Probar conexiones a Supabase
├── Tests:
│   ├── Connection test
│   ├── Learning nodes query
│   └── RPC functions test
└── Respuesta: { success, tests: { connection, nodes_count, rpc_test } }
```

### 2.5 SERVICIO DE TESTING RPC
- **Archivo**: `app/api/test-rpc/route.ts`
- **Puerto**: 3000 (Integrado en Next.js)
- **Estado**: ✅ FUNCIONAL - HERRAMIENTA DE DIAGNOSTICO

#### Endpoints REST:
```
GET /api/test-rpc
├── Función: Probar funciones RPC de Supabase
├── Tests ejecutados:
│   ├── generate_automatic_recommendations(p_user_id)
│   ├── get_user_statistics(p_user_id)
│   ├── get_realtime_analytics(p_user_id)
│   ├── generate_quantum_number(precision_digits)
│   └── create_practice_session_quantum(params)
└── Respuesta: { success, tests, summary: { total_tests, passed, failed, success_rate } }
```

## 3. SERVICIOS DE LOGICA DE NEGOCIO (TypeScript Services)

### 3.1 SERVICIO DE GENERACION DE EXAMENES
- **Archivo**: `lib/services/examGeneratorService.ts`
- **Clase**: `PAESExamGenerator`
- **Estado**: ✅ COMPLETO Y FUNCIONAL

#### Métodos públicos:
```typescript
generateExam(examConfig: ExamConfig): Promise<GeneratedExam>
├── Función: Genera exámenes completos usando IA
├── Distribución por materias y habilidades
├── Configuración personalizable
└── Fallbacks en caso de errores

generateSingleQuestion(prompt: QuestionGenerationPrompt): Promise<ExamQuestion>
├── Función: Genera pregunta individual
├── Integración con OpenRouter API
└── Validación y parsing de respuestas
```

#### Dependencias y configuración:
- **IA Provider**: OpenRouter (Claude-3-sonnet o GPT-4o-mini)
- **Configuración**: `AIExamGeneratorConfig`
- **Materias soportadas**: 5 materias PAES
- **Tipos de pregunta**: Opción múltiple (expandible)

#### Métricas reportadas:
- Tiempo estimado por pregunta
- Distribución por materia/habilidad/dificultad
- Metadata de generación

### 3.2 SERVICIO DE SESIONES DE EXAMEN
- **Archivo**: `lib/services/examSessionService.ts`
- **Clase**: `ExamSessionService`
- **Estado**: ✅ COMPLETO Y FUNCIONAL

#### Métodos principales:
```typescript
startExamSession(examId, userId, settings?): Promise<ExamSession>
├── Crear nueva sesión
└── Configuración de tiempo, pausas, revisión

getExamSession(sessionId): Promise<ExamSession | null>
├── Recuperar sesión activa
└── Manejo de errores

updateSessionProgress(sessionId, updates): Promise<void>
├── Actualizar progreso en tiempo real
└── Tracking de tiempo y respuestas

finishExamSession(sessionId, exam): Promise<ExamResults>
├── Finalizar y calcular resultados
├── Análisis detallado por materia/habilidad/dificultad
├── Análisis temporal y recomendaciones
└── Persistencia en base de datos
```

#### Métricas generadas:
- Puntajes por materia y habilidad
- Análisis temporal (períodos de prisa/lentitud)
- Recomendaciones personalizadas
- Distribución de tiempo por pregunta

### 3.3 SERVICIO DE DATOS DE USUARIO
- **Archivo**: `lib/services/userDataService.ts`
- **Clase**: `UserDataService`
- **Estado**: ✅ FUNCIONAL CON MOCK DATA

#### Métodos principales:
```typescript
getUserStats(userId): Promise<UserStats>
├── Estadísticas generales del usuario
├── Racha de estudios, tiempo total, progreso
└── Conexión con Supabase

getSubjectProgress(userId): Promise<SubjectProgress[]>
├── Progreso por materia PAES
├── Análisis de fortalezas/debilidades
└── Recomendaciones por materia

getLearningMetrics(userId): Promise<LearningMetrics>
├── Métricas detalladas de aprendizaje
├── Actividad diaria, progreso semanal
└── Habilidades y evolución (datos mock)

updateUserActivity(userId, activityData): Promise<void>
├── Actualizar actividad del usuario
└── Tracking de tiempo y progreso en nodos
```

#### Integración con base de datos:
- Tablas: `users`, `user_progress`, `learning_nodes`, `diagnostic_assessments`
- RPC Functions: Preparado para funciones avanzadas
- Fallbacks: Datos mock si fallan las consultas

### 3.4 SERVICIO DE RECOMENDACIONES
- **Archivo**: `lib/services/recommendationService.ts`
- **Clase**: `RecommendationService`
- **Estado**: ✅ ALGORITMOS COMPLETOS

#### Métodos principales:
```typescript
generateRecommendations(user, stats, metrics): Promise<Recommendation[]>
├── Recomendaciones personalizadas basadas en:
│   ├── Actividad reciente
│   ├── Progreso por materia
│   ├── Habilidades PAES
│   ├── Objetivos del usuario
│   └── Motivación

generateStudyPlan(user, stats, metrics): StudyPlan
├── Plan de estudio personalizado
├── Distribución diaria/semanal
├── Metas y milestones
└── Horarios óptimos
```

#### Tipos de recomendaciones:
- **study**: Reforzar materias débiles
- **practice**: Práctica de habilidades específicas  
- **review**: Mantenimiento de fortalezas
- **goal**: Enfoque en objetivos PAES
- **motivation**: Motivación y logros

## 4. INTEGRACIONES EXTERNAS

### 4.1 SUPABASE (Base de Datos Principal)
- **Tipo**: PostgreSQL en la nube
- **Estado**: ✅ CONECTADO Y FUNCIONAL
- **Configuración**: Variables de entorno

#### Tablas principales identificadas:
```sql
learning_nodes          -- Nodos de aprendizaje
user_progress          -- Progreso individual
exam_sessions          -- Sesiones de examen  
exam_results          -- Resultados de exámenes
diagnostic_assessments -- Evaluaciones diagnósticas
practice_sessions      -- Sesiones de práctica
users                 -- Datos de usuarios
```

#### RPC Functions (Funciones almacenadas):
```sql
generate_automatic_recommendations(p_user_id)
get_user_statistics(p_user_id)
get_realtime_analytics(p_user_id)
generate_quantum_number(precision_digits)
create_practice_session_quantum(parametros)
```

#### Métricas de conexión:
- Test básico: ✅ Funcional
- Queries complejas: ✅ Funcional
- RPC Functions: ⚠️ Algunas pendientes de implementación

### 4.2 OPENROUTER (Servicios de IA)
- **Función**: Gateway para modelos de IA
- **Estado**: ✅ CONFIGURADO Y FUNCIONAL
- **Modelos**: GPT-4o-mini, Claude-3-sonnet

#### Configuración:
```javascript
API_KEY: Configurada (variable de entorno)
ENDPOINT: https://openrouter.ai/api/v1/chat/completions
MODELS: openai/gpt-4o-mini, anthropic/claude-3-sonnet
RATE_LIMITS: Configurados (100ms delay entre requests)
```

#### Métricas reportadas:
- Token usage (prompt + completion)
- Response time
- Model utilizado
- Error handling con fallbacks

### 4.3 NEXT.JS AUTH (Sistema de Autenticación)
- **Provider**: Supabase Auth
- **Estado**: ⚠️ CONFIGURADO NO VERIFICADO
- **Integración**: `@supabase/auth-helpers-nextjs`

## 5. CONFIGURACION DEL SISTEMA

### 5.1 Dependencias principales (package.json):
```json
{
  "next": "14.0.0",
  "@supabase/supabase-js": "^2.38.0", 
  "@supabase/auth-helpers-nextjs": "^0.8.7",
  "@supabase/realtime-js": "^2.11.8",
  "react": "^18",
  "typescript": "^5",
  "zod": "^3.22.4",
  "zustand": "^5.0.5"
}
```

### 5.2 Scripts de ejecución:
```json
{
  "dev": "next dev",         // Puerto 3000
  "build": "next build", 
  "start": "next start",     // Puerto 3000 (producción)
  "lint": "next lint"
}
```

## 6. FLUJO DE DATOS Y INTEGRACION

### 6.1 Flujo de generación de exámenes:
```ascii
Frontend Request
    ↓
/api/generate-content (REST)
    ↓
examGeneratorService.generateExam()
    ↓
OpenRouter API (IA Generation)
    ↓
Question validation & processing
    ↓
Supabase (persist exam)
    ↓
Response to Frontend
```

### 6.2 Flujo de sesión de examen:
```ascii
Start Session Request
    ↓
examSessionService.startExamSession()
    ↓
Supabase (create session record)
    ↓
Real-time updates via WebSocket
    ↓
examSessionService.updateSessionProgress()
    ↓
examSessionService.finishExamSession()
    ↓
Calculate results & recommendations
    ↓
Supabase (persist results)
```

### 6.3 Flujo de recomendaciones:
```ascii
User Activity Data
    ↓
userDataService.getUserStats()
    ↓
userDataService.getSubjectProgress()
    ↓
recommendationService.generateRecommendations()
    ↓
Algorithm processing (subjects, skills, goals)
    ↓
Personalized recommendations
    ↓
Frontend display
```

## 7. METRICAS Y MONITORIZACION

### 7.1 Métricas de rendimiento reportadas:
- **Response time**: Por endpoint y servicio
- **Token usage**: Consumo de IA por request
- **Database queries**: Tiempo de consulta y errores
- **Success rate**: % de requests exitosos por servicio
- **User engagement**: Tiempo de estudio, sesiones completadas

### 7.2 Health checks implementados:
- `/api/test-db`: Estado de conexión a Supabase
- `/api/test-rpc`: Estado de funciones RPC
- Cada servicio REST incluye endpoint GET para status

### 7.3 Error handling:
- Fallbacks para servicios de IA
- Datos mock si falla la base de datos
- Respuestas de error estandarizadas
- Logging detallado en servicios

## 8. ESTADO ACTUAL Y RECOMENDACIONES

### 8.1 Servicios completamente funcionales:
✅ **Chat Service** - API REST funcional con IA
✅ **Exam Generator Service** - Generación completa de exámenes
✅ **Session Management Service** - Gestión completa de sesiones
✅ **User Data Service** - Estadísticas y progreso (con fallbacks)
✅ **Recommendation Service** - Algoritmos de recomendación
✅ **Database Integration** - Supabase conectado y funcional

### 8.2 Servicios parcialmente funcionales:
⚠️ **Content Generation Service** - Falta librería de integración
⚠️ **Authentication System** - Configurado pero no verificado
⚠️ **Realtime Features** - Supabase realtime configurado pero no implementado

### 8.3 Oportunidades de mejora:
1. **Containerización**: Considerar Docker para desarrollo
2. **Microservicios reales**: Separar servicios en containers independientes
3. **API Gateway**: Implementar gateway para routing centralizado
4. **Caching**: Redis para mejorar performance
5. **Load balancing**: Para alta disponibilidad
6. **Monitoring**: Prometheus/Grafana para métricas avanzadas

### 8.4 Arquitectura recomendada para escalabilidad:
```ascii
┌─────────────────────────────────────────────────────────────┐
│                   PRODUCTION ARCHITECTURE                   │
├─────────────────────────────────────────────────────────────┤
│  LOAD BALANCER (Nginx/HAProxy)                            │
├─────────────────────────────────────────────────────────────┤
│  API GATEWAY (Kong/AWS API Gateway)                       │
├─────────────────────────────────────────────────────────────┤
│  MICROSERVICES (Docker Containers)                         │
│  ┌─────────────┐  ┌─────────────┐  ┌─────────────┐         │
│  │ Frontend    │  │ Chat Service│  │ Exam Service│         │
│  │ Service     │  │ (Port 3001) │  │ (Port 3002) │         │
│  │ (Port 3000) │  └─────────────┘  └─────────────┘         │
│  └─────────────┘  ┌─────────────┐  ┌─────────────┐         │
│                   │ User Service│  │ Content Gen │         │
│                   │ (Port 3003) │  │ (Port 3004) │         │
│                   └─────────────┘  └─────────────┘         │
├─────────────────────────────────────────────────────────────┤
│  CACHING LAYER (Redis Cluster)                            │
├─────────────────────────────────────────────────────────────┤
│  DATABASE LAYER (Supabase + Read Replicas)                │
└─────────────────────────────────────────────────────────────┘
```

---

**Documento generado**: 2025-01-30  
**Análisis realizado por**: Kilo Code (Architect Mode)  
**Sistema analizado**: PAES PRO - Plataforma de preparación para la Prueba de Acceso a la Educación Superior  
**Estado del sistema**: DESARROLLO ACTIVO - Funcionalidades core implementadas

