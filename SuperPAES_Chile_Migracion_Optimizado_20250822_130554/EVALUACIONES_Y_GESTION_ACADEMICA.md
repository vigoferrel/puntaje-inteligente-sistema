
# 📚 Módulo de Evaluaciones y Gestión Académica - SuperPaes

## 1. Resumen Ejecutivo

Este documento detalla el funcionamiento del módulo de evaluaciones dentro del ecosistema SuperPaes. El sistema está diseñado para ser dinámico y adaptable, utilizando un enfoque cuántico y la Taxonomía de Bloom para personalizar la experiencia de aprendizaje y evaluación de cada estudiante.

## 2. Creación de Evaluaciones

Las evaluaciones en SuperPaes se pueden generar de dos maneras principales:

### 2.1. Exámenes Cuánticos (`createQuantumExam`)

-   **Archivo Principal**: `paes-master/quantum-core/paes-agent.ts`
-   **Descripción**: Este método genera un examen dinámico basado en las preferencias del usuario y su progreso histórico.
-   **Proceso**:
    1.  El `PaesAgent` recibe una solicitud para crear un examen con ciertas preferencias (tipo de prueba, duración, etc.).
    2.  Filtra los `LearningNode` (nodos de aprendizaje) que coinciden con las preferencias del usuario.
    3.  Selecciona una cantidad de preguntas (definida por `totalQuestions`) de los nodos filtrados.
    4.  Crea una estructura de examen con título, secciones y preguntas.
    5.  Retorna el examen generado en formato JSON.

### 2.2. Sesiones de Práctica (`createPracticeSession`)

-   **Archivo Principal**: `paes-pro/lib/supabase.ts` (invocado desde el frontend)
-   **Descripción**: Permite a los usuarios iniciar una sesión de práctica más simple y directa.
-   **Proceso**:
    1.  El usuario inicia una sesión de práctica desde la interfaz de `paes-pro`.
    2.  Se crea un registro en la tabla `practice_sessions` de Supabase con los detalles de la sesión (tipo de prueba, número de preguntas, etc.).
    3.  El frontend presenta las preguntas al usuario.

## 3. Administración y Corrección

### 3.1. Estructura de las Pruebas

-   **Archivo Principal**: `paes-master/quantum-core/paes-structure.js`
-   **Descripción**: Define la estructura jerárquica de todas las pruebas PAES, utilizando la Taxonomía de Bloom para clasificar las habilidades y sub-habilidades.
-   **Componentes**:
    -   **`PaesTestType`**: Tipos de pruebas disponibles (e.g., `COMPETENCIA_LECTORA`, `MATEMATICA_M1`, `MATEMATICA_M2`).
    -   **Habilidades y Sub-habilidades**: Cada tipo de prueba tiene un conjunto de habilidades (e.g., "Álgebra y Funciones") y sub-habilidades (e.g., "Ecuaciones").
    -   **Niveles de Bloom**: Cada sub-habilidad está mapeada a un nivel de la Taxonomía de Bloom (L1 a L6), lo que permite una jerarquización del contenido.

### 3.2. Corrección y Calificación

-   **Archivos Principales**: `paes-master/quantum-core/paes-agent.ts`, `paes-master/quantum-core/supabase-integration.js`
-   **Proceso**:
    1.  Después de que un usuario completa una evaluación, las respuestas se envían al backend.
    2.  El sistema calcula el puntaje (`score`).
    3.  Se actualiza el progreso del usuario en la tabla `user_progress` de Supabase, incluyendo:
        -   `best_score`: El mejor puntaje obtenido en ese nodo.
        -   `average_score`: El puntaje promedio.
        -   `status`: El estado del nodo (e.g., `completed`, `needs_review`).
    4.  El `PaesAgent` puede agregar los puntajes por habilidad (`aggregateSkillScores`) para proporcionar un análisis más detallado.

## 4. Tipos de Pruebas y Retroalimentación

### 4.1. Tipos de Pruebas

El sistema soporta múltiples tipos de pruebas, definidos en `paes-master/quantum-core/paes-types.ts` como `PaesTestType`. Los tipos de prueba actuales incluyen:

-   Competencia Lectora
-   Matemática M1
-   Matemática M2
-   Ciencias
-   Historia y Ciencias Sociales

### 4.2. Métodos de Retroalimentación

La retroalimentación se proporciona a los usuarios de varias maneras:

-   **Puntaje Inmediato**: Al finalizar una evaluación, el usuario recibe su puntaje.
-   **Historial de Exámenes (`examHistory`)**: Los usuarios pueden ver un historial de sus exámenes anteriores, incluyendo el puntaje y el tipo de prueba.
-   **Análisis de Habilidades**: El sistema proporciona un desglose de los puntajes por habilidad, permitiendo a los usuarios identificar sus fortalezas y debilidades.
-   **Progreso Visual**: El frontend (`paes-pro`) debería incluir componentes visuales (gráficos, barras de progreso) para mostrar el progreso del usuario a lo largo del tiempo.

## 5. Reportes y Trazabilidad

### 5.1. Reportes para Alumnos

Los alumnos tienen acceso a un dashboard personal donde pueden ver:

-   Su progreso general en cada tipo de prueba.
-   Un historial detallado de todas las evaluaciones realizadas.
-   Un análisis de su rendimiento por habilidad y nivel de Bloom.
-   Recomendaciones personalizadas basadas en su rendimiento.

### 5.2. Reportes para Docentes (Futura Implementación)

Aunque no está explícitamente implementado, la estructura de la base de datos permite la futura creación de reportes para docentes, que podrían incluir:

-   El progreso de un grupo de estudiantes.
-   Identificación de las áreas más difíciles para el grupo.
-   Comparativas de rendimiento entre estudiantes.
-   Seguimiento del tiempo dedicado por los estudiantes.

### 5.3. Trazabilidad

La trazabilidad se logra a través de la base de datos de Supabase, que almacena:

-   **`user_progress`**: Registros detallados del progreso de cada usuario en cada nodo de aprendizaje.
-   **`practice_sessions`**: Un historial de todas las sesiones de práctica.
-   **`diagnostic_assessments`**: Registros de las evaluaciones de diagnóstico.

Esto permite un seguimiento completo del viaje de aprendizaje de cada estudiante, desde su primera evaluación hasta su preparación final para la PAES.

## 6. Flujos de Usuario Detallados

### 6.1. Flujo de Evaluación Completa

```
1. Usuario inicia sesión → PAES-PRO (Frontend)
2. Selecciona tipo de prueba → getTestTypeStructure(testType)
3. Sistema genera examen cuántico → createQuantumExam(preferences)
4. Usuario responde preguntas → Frontend presenta interfaz de examen
5. Al finalizar → updateUserProgress(userId, nodeId, progress)
6. Sistema calcula analytics → calculateBloomProgress(), calculateMasteryLevel()
7. Muestra resultados → Dashboard con retroalimentación
8. Sincroniza con Spotify Neural → syncSpotifyNeural() [opcional]
```

### 6.2. Flujo de Sesión de Práctica

```
1. Usuario elige práctica rápida → PAES-PRO
2. Selecciona parámetros básicos → createPracticeSession()
3. Sistema crea sesión en BD → Supabase practice_sessions
4. Presenta preguntas → Interfaz simplificada
5. Califica respuestas → Actualiza best_score, average_score
6. Muestra feedback inmediato → Puntaje y estadísticas básicas
```

## 7. Integración con Motor Cuántico

### 7.1. Procesamiento Cuántico de Evaluaciones

- **Archivo**: `paes-master/quantum-core/quantum-engine.js`
- **Funcionalidad**: El sistema utiliza "entrelazamiento cuántico" para:
  - Conectar conceptos relacionados entre diferentes áreas de conocimiento
  - Adaptar la dificultad basándose en el rendimiento histórico
  - Generar rutas de aprendizaje personalizadas

### 7.2. Nodos de Aprendizaje Cuánticos

Cada pregunta está asociada a un `LearningNode` con propiedades cuánticas:

```javascript
{
  id: "node-MATEMATICA_M1-algebra-ecuaciones",
  testType: "MATEMATICA_M1",
  skill: "Álgebra y Funciones",
  subSkill: "Ecuaciones",
  bloomLevel: "L3", // Aplicar
  quantumState: {
    coherence: 0.85,
    entropy: 0.23,
    entanglement: [...]
  }
}
```

## 8. API Endpoints y Comunicación

### 8.1. PAES-Master APIs (Puerto 3001)

- `GET /api/quantum/status` - Estado del sistema cuántico
- `GET /api/quantum/structure` - Estructura PAES completa
- `POST /api/quantum/session` - Procesar sesión de estudio/evaluación
- `GET /api/quantum/progress` - Progreso del usuario

### 8.2. PAES-Agente APIs (Puerto 5000)

- `POST /chat` - Chat con IA para asistencia durante evaluaciones
- `GET /health` - Estado del sistema de IA
- `POST /analyze` - Análisis educativo de resultados

### 8.3. Supabase Integration

```javascript
// Tablas principales
user_progress: {
  user_id: string,
  node_id: string,
  best_score: number,
  average_score: number,
  status: 'completed' | 'in_progress' | 'needs_review',
  bloom_progress: number,
  mastery_level: number,
  confidence_level: number
}

practice_sessions: {
  user_id: string,
  test_type: string,
  total_questions: number,
  correct_answers: number,
  total_score: number,
  time_spent_minutes: number
}

diagnostic_assessments: {
  user_id: string,
  assessment_type: 'practice' | 'diagnostic' | 'final',
  overall_score: number,
  detailed_scores: json
}
```

## 9. Configuración de Segundo Plano y Métricas

### 9.1. Ejecución en Background

Todos los servicios están configurados para ejecutarse en segundo plano:

```powershell
# PAES-Master (Motor Cuántico)
npm run quantum:test  # Auto-background execution

# PAES-Agente (Sistema IA)
docker run -d -p 3000:3000 -p 5000:5000 paes-agente

# PAES-Master MVP (Python optimizado)
nohup python main.py > logs/paes-mvp.log 2>&1 &
```

### 9.2. Métricas de Evaluaciones

```json
{
  "evaluation_metrics": {
    "total_sessions_today": 45,
    "average_completion_time": "18.5 min",
    "average_score": 73.2,
    "success_rate": 0.89,
    "active_users": 127
  },
  "performance_by_test_type": {
    "COMPETENCIA_LECTORA": {
      "avg_score": 76.5,
      "completion_rate": 0.92
    },
    "MATEMATICA_M1": {
      "avg_score": 69.8,
      "completion_rate": 0.85
    }
  }
}
```

## 10. Definición de Tipos de Pruebas

### 10.1. Estructura Completa de PaesTestType

Basado en `paes-master/quantum-core/paes-structure.js`:

```javascript
export type PaesTestType = 
  | 'COMPETENCIA_LECTORA'
  | 'MATEMATICA_M1' 
  | 'MATEMATICA_M2'
  | 'CIENCIAS'
  | 'HISTORIA_CS';

// Cada tipo tiene su estructura específica:
structure: {
  COMPETENCIA_LECTORA: {
    name: "Competencia Lectora",
    skills: ["Comprensión", "Interpretación", "Análisis"],
    subSkills: {
      "Comprensión": ["Literal", "Inferencial", "Crítica"],
      // ...
    },
    bloomMapping: {
      "Literal": "L1",
      "Inferencial": "L2",
      "Crítica": "L5"
    }
  }
}
```

### 10.2. Taxonomía de Bloom Implementada

```javascript
bloomTaxonomy: {
  L1: { // Recordar
    verbs: ['recordar', 'reconocer', 'listar', 'describir'],
    examples: ['Definir conceptos básicos', 'Identificar elementos']
  },
  L2: { // Comprender
    verbs: ['explicar', 'interpretar', 'resumir', 'parafrasear'],
    examples: ['Explicar procesos', 'Interpretar datos']
  },
  L3: { // Aplicar
    verbs: ['aplicar', 'resolver', 'usar', 'calcular'],
    examples: ['Resolver problemas', 'Aplicar fórmulas']
  },
  L4: { // Analizar
    verbs: ['analizar', 'comparar', 'contrastar', 'examinar'],
    examples: ['Analizar estructuras', 'Examinar relaciones']
  },
  L5: { // Evaluar
    verbs: ['evaluar', 'juzgar', 'criticar', 'valorar'],
    examples: ['Evaluar argumentos', 'Valorar resultados']
  },
  L6: { // Crear
    verbs: ['crear', 'diseñar', 'desarrollar', 'innovar'],
    examples: ['Crear soluciones', 'Diseñar modelos']
  }
}
```

## 11. Sistema de Recomendaciones Inteligentes

### 11.1. Análisis de Progreso

El sistema `PaesAgent` proporciona recomendaciones basadas en:

```javascript
// Lógica de recomendaciones en paes-agent.ts
getRecommendations() {
  return {
    // Tiempo de estudio recomendado
    examDuration: userNode?.preferences?.duration || 120,
    
    // Áreas que necesitan refuerzo
    needsImprovement: progress
      .filter(p => p.score && p.score < 70)
      .map(p => ({
        area: p.testType,
        currentScore: p.score,
        targetScore: 85
      })),
    
    // Fortalezas del usuario
    strengths: progress
      .filter(p => p.score && p.score >= 85)
      .map(p => p.testType)
  }
}
```

### 11.2. Integración con Spotify Neural

El sistema tiene una característica única de sincronización con playlists de Spotify para optimización neural:

```javascript
// spotify-neural.ts
createNeuralPlaylist(testType, skill, subSkill, bloomLevel) {
  return {
    id: `adaptive-${testType}-${skill}-${subSkill}-${bloomLevel}`,
    name: `Playlist Adaptativa ${testType} - ${skill} - ${subSkill} Nivel ${bloomLevel}`,
    tracks: optimizedTracks,
    neuralFrequency: calculateOptimalFrequency(bloomLevel),
    syncDuration: estimatedStudyTime
  }
}
```

## 12. Configuración para Docentes (Roadmap)

### 12.1. Dashboard Docente (Planificado)

- Vista consolidada del progreso de múltiples estudiantes
- Identificación de patrones de dificultad por tema
- Generación automática de reportes de clase
- Configuración de evaluaciones grupales

### 12.2. Herramientas de Análisis

- Comparativas de rendimiento entre grupos
- Detección automática de estudiantes en riesgo
- Sugerencias de intervención pedagógica
- Exportación de datos para análisis externo

---

**Ubicación de Archivos Clave:**
- Motor de evaluaciones: `paes-master/quantum-core/`
- Frontend de evaluaciones: `paes-pro/`
- Base de datos: Supabase (configurada en `paes-pro/lib/supabase.ts`)
- Logs y métricas: `logs/` en cada servicio

**Estado de Implementación:** ✅ Producción activa con capacidades cuánticas avanzadas

