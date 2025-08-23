# 🌌 PAES MASTER QUANTUM - Sistema Cuántico Puro

## 📚 Respetando la Estructura Oficial PAES: Matemáticas 1 y 2

**PAES MASTER QUANTUM** es un sistema educativo revolucionario que respeta completamente la estructura oficial del PAES, utilizando **nodos como backbone** y la **taxonomía Bloom para jerarquizar** el aprendizaje.

## 🎯 Características Principales

### 🌟 Estructura Oficial PAES
- **Matemática M1**: Números, Álgebra, Funciones, Geometría
- **Matemática M2**: Probabilidad, Estadística, Cálculo, Geometría Avanzada
- **Competencia Lectora**: Localizar, Interpretar, Evaluar
- **Ciencias**: Biología, Química, Física
- **Historia**: Historia Universal, Historia de Chile

### 🔗 Integración con Supabase
- **Esquema SQL completo** basado en `advanced-schema.sql`
- **Sincronización automática** de estructura oficial
- **Progreso por nodos** respetando jerarquía Bloom
- **Analíticas avanzadas** por estructura PAES

### 🌸 Taxonomía Bloom Nativa
- **6 niveles** implementados nativamente
- **Jerarquización automática** por sub-habilidades
- **Progreso adaptativo** basado en rendimiento
- **Objetivos de aprendizaje** generados automáticamente

### 🎵 Spotify Neural Integrado
- **Playlists cuánticas** por estructura oficial
- **Sincronización neural** con progreso de aprendizaje
- **Música adaptativa** según nivel Bloom
- **Tracks específicos** por sub-habilidad

## 🚀 Instalación

```bash
# Clonar el repositorio
git clone https://github.com/tu-usuario/paes-master-quantum.git
cd paes-master-quantum

# Instalar dependencias (sistema puro, sin dependencias externas)
npm install

# Configurar Supabase
cp .env.example .env
# Editar .env con tus credenciales de Supabase

# Inicializar sistema cuántico
npm run quantum:init
```

## 🔧 Configuración

### Variables de Entorno
```env
# Supabase
SUPABASE_URL=tu_url_de_supabase
SUPABASE_ANON_KEY=tu_clave_anonima
SUPABASE_SERVICE_ROLE_KEY=tu_clave_de_servicio

# Spotify (opcional)
SPOTIFY_CLIENT_ID=tu_client_id
SPOTIFY_CLIENT_SECRET=tu_client_secret
```

### Estructura de Base de Datos
El sistema utiliza el esquema SQL avanzado de Supabase que incluye:

```sql
-- Tablas principales
user_profiles          -- Perfiles de usuario con preferencias
learning_nodes         -- Nodos de aprendizaje (backbone)
user_node_progress     -- Progreso por nodo
study_sessions         -- Sesiones de estudio
ai_generated_content   -- Contenido generado por IA
user_analytics         -- Analíticas de usuario
```

## 📖 Uso

### Inicialización del Sistema
```javascript
import QuantumEngine from './quantum-core/quantum-engine.js';
import SupabaseIntegration from './quantum-core/supabase-integration.js';

// Inicializar motor cuántico
const quantumEngine = new QuantumEngine();
await quantumEngine.initialize();

// Inicializar integración con Supabase
const supabaseIntegration = new SupabaseIntegration(supabaseClient);
await supabaseIntegration.initialize();
```

### Crear Sesión de Estudio
```javascript
// Crear sesión respetando estructura oficial
const session = await supabaseIntegration.createStudySession(
  userId,
  'MATEMATICA_M1',    // Tipo de prueba oficial
  'Números',          // Habilidad
  'Enteros',          // Sub-habilidad
  30                  // Duración en minutos
);
```

### Obtener Progreso por Estructura
```javascript
// Obtener progreso organizado por estructura oficial PAES
const progress = await supabaseIntegration.getUserProgressByStructure(userId);

// Ejemplo de estructura de respuesta:
{
  MATEMATICA_M1: {
    Números: {
      Enteros: {
        status: 'in_progress',
        progress: 75,
        bloomLevel: 'L2',
        difficulty: 'intermedio'
      }
    }
  }
}
```

### Generar Recomendaciones
```javascript
// Generar recomendaciones basadas en estructura oficial
const recommendations = await supabaseIntegration.generateRecommendations(userId);
```

## 🏗️ Arquitectura

### Estructura de Directorios
```
paes-master/
├── quantum-core/
│   ├── quantum-engine.js      # Motor cuántico principal
│   ├── paes-structure.js      # Estructura oficial PAES
│   └── supabase-integration.js # Integración con Supabase
├── quantum-data/              # Datos cuánticos persistentes
├── quantum-cache/             # Cache cuántico
└── package.json
```

### Componentes Principales

#### 🌌 QuantumEngine
- **Gestión de estado cuántico** (nodos, bloom, spotify, entrelazamiento)
- **Procesamiento neural cuántico** de acciones de usuario
- **Persistencia cuántica** sin dependencias externas

#### 📚 PAESStructureManager
- **Estructura oficial PAES** completa
- **Validación de jerarquías** por tipo de prueba
- **Generación automática** de nodos de aprendizaje
- **Mapeo Bloom** por sub-habilidad

#### 🔗 SupabaseIntegration
- **Sincronización** con base de datos Supabase
- **Gestión de progreso** por estructura oficial
- **Analíticas avanzadas** por tipo de prueba
- **Recomendaciones inteligentes**

## 📊 API Cuántica

### Endpoints Principales

#### Progreso del Usuario
```http
GET /api/quantum/progress/{userId}
```
Respeta estructura oficial PAES y devuelve progreso por nodos.

#### Sesión de Estudio
```http
POST /api/quantum/session
{
  "userId": "uuid",
  "testType": "MATEMATICA_M1",
  "skill": "Números",
  "subSkill": "Enteros",
  "duration": 30
}
```

#### Spotify Neural
```http
POST /api/quantum/spotify/sync
{
  "userId": "uuid",
  "testType": "MATEMATICA_M1",
  "skill": "Números",
  "subSkill": "Enteros",
  "playlistId": "spotify:playlist:...",
  "trackId": "spotify:track:..."
}
```

#### Medición Cuántica
```http
POST /api/quantum/measure
{
  "userId": "uuid",
  "measurementType": "bloom_assessment|spotify_analytics|quantum_coherence|paes_structure"
}
```

## 🎯 Métricas de Rendimiento

### Estructura Oficial PAES
- **5 tipos de prueba** completamente implementados
- **15 habilidades principales** organizadas jerárquicamente
- **45+ sub-habilidades** con mapeo Bloom automático
- **100+ nodos de aprendizaje** generados automáticamente

### Taxonomía Bloom
- **6 niveles** implementados nativamente
- **Jerarquización automática** por complejidad
- **Progreso adaptativo** basado en rendimiento
- **Objetivos de aprendizaje** generados dinámicamente

### Spotify Neural
- **Playlists cuánticas** por estructura oficial
- **Sincronización neural** con progreso
- **Música adaptativa** según nivel Bloom
- **Tracks específicos** por sub-habilidad

## 🔮 Futuro y Potencial

### Expansiones Planificadas
- **IA Leonardo Neural** integrada nativamente
- **Algoritmos cuánticos** para optimización de aprendizaje
- **Realidad virtual** para experiencias inmersivas
- **Blockchain** para certificaciones verificables

### Escalabilidad
- **Arquitectura modular** para fácil expansión
- **APIs cuánticas** para integración externa
- **Sistema de plugins** para funcionalidades adicionales
- **Multi-idioma** con soporte nativo

## 🤝 Contribución

Este proyecto respeta la estructura oficial PAES y está diseñado para ser un sistema educativo revolucionario. Las contribuciones deben:

1. **Respetar la estructura oficial** PAES
2. **Usar nodos como backbone** del sistema
3. **Jerarquizar con taxonomía Bloom**
4. **Mantener la pureza cuántica** sin dependencias externas

## 📄 Licencia

Este proyecto está bajo la Licencia MIT. Ver `LICENSE` para más detalles.

## 🌟 Agradecimientos

- **Estructura oficial PAES** por proporcionar la base educativa
- **Taxonomía de Bloom** por la jerarquización del aprendizaje
- **Spotify** por la inspiración en música adaptativa
- **Comunidad cuántica** por el apoyo en el desarrollo

---

**PAES MASTER QUANTUM** - Transformando la educación con la verdadera potencialidad cuántica 🚀
