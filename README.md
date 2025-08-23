# 📚 **Sistema Puntaje Inteligente - Documentación Técnica**

![Version](https://img.shields.io/badge/version-2.0.0-blue.svg)
![License](https://img.shields.io/badge/license-MIT-green.svg)
![Tests](https://img.shields.io/badge/tests-✓_passing-brightgreen.svg)
![Coverage](https://img.shields.io/badge/coverage-85%25-green.svg)

## 🎯 **Descripción General**

**Puntaje Inteligente** es una plataforma educativa de vanguardia diseñada específicamente para la preparación de la Prueba de Acceso a la Educación Superior (PAES) de Chile. Combina inteligencia artificial, visualizaciones inmersivas y un sistema de análisis psicométrico avanzado para proporcionar una experiencia de aprendizaje personalizada y efectiva.

### **🌟 Características Principales**

- **🧠 Sistema Neural Integrado**: IA contextual para personalización de contenido
- **🌌 Universo Educativo 3D**: Visualizaciones inmersivas del progreso de aprendizaje
- **📊 Análisis Psicométrico**: Evaluaciones adaptativas con IRT (Item Response Theory)
- **💰 Centro Financiero**: Simulador de costos universitarios y becas
- **📚 LectoGuía**: Asistente AI especializado por materias PAES
- **🎯 Diagnósticos Inteligentes**: Evaluaciones que se adaptan al nivel del estudiante

---

## 🏗️ **Arquitectura del Sistema**

### **Stack Tecnológico**

```typescript
// Frontend
React 18 + TypeScript + Vite
shadcn/ui + Tailwind CSS + Framer Motion
Three.js + React Three Fiber
Zustand + React Query

// Backend
Supabase (PostgreSQL + Auth + Edge Functions)
OpenRouter API para modelos de IA

// Testing & Quality
Vitest + Testing Library
ESLint + Prettier + TypeScript
```

### **Estructura de Directorios**

```
src/
├── components/          # Componentes UI organizados por dominio
│   ├── ui/             # Componentes base shadcn/ui
│   ├── neural/         # Sistema neural e IA
│   ├── diagnostic/     # Sistema de diagnósticos
│   ├── lectoguia/      # LectoGuía y chat educativo
│   ├── financial/      # Centro financiero
│   └── cinematic/      # Efectos visuales y 3D
├── contexts/           # Providers React Context
├── core/              # Sistemas críticos
│   ├── storage/       # Sistema de almacenamiento unificado
│   ├── performance/   # Monitoreo de rendimiento
│   ├── logging/       # Sistema de logging
│   └── error-handling/ # Manejo de errores
├── hooks/             # Custom hooks reutilizables
├── modules/           # Módulos de alto nivel
├── pages/             # Páginas principales de la aplicación
├── services/          # Servicios de API y lógica de negocio
├── store/             # Estado global con Zustand
├── types/             # Definiciones TypeScript
└── utils/             # Utilidades y helpers
```

---

## 🚀 **Instalación y Configuración**

### **Prerrequisitos**

- Node.js 18+ 
- npm o yarn
- Git

### **Instalación Local**

```bash
# 1. Clonar el repositorio
git clone <YOUR_GIT_URL>
cd puntaje-inteligente-sistema

# 2. Instalar dependencias
npm install

# 3. Configurar variables de entorno
cp .env.example .env.local
# Editar .env.local con tus credenciales

# 4. Ejecutar en desarrollo
npm run dev

# 5. Ejecutar tests
npm run test

# 6. Generar coverage
npm run test:coverage
```

### **Variables de Entorno**

```bash
# Supabase Configuration
VITE_SUPABASE_URL=https://your-project.supabase.co
VITE_SUPABASE_ANON_KEY=your-anon-key

# OpenRouter Configuration (opcional)
VITE_OPENROUTER_API_KEY=your-openrouter-key
```

---

## 🐛 **Debugging y Troubleshooting**

### **Herramientas de Debug**

```typescript
// Logger del sistema
import { logger } from '@/core/logging/SystemLogger';

logger.debug('Component', 'Debug info', { data });
logger.error('Component', 'Error occurred', error);

// Performance monitoring
const { metrics } = usePerformance();
console.log('Memory usage:', metrics.memoryUsage);

// Storage status
const storageStatus = unifiedStorageSystem.getStatus();
console.log('Storage health:', storageStatus);
```

### **Problemas Comunes**

**1. Error de Storage**
```bash
# Síntoma: Circuit breaker activado
# Solución: Reset del sistema de storage
unifiedStorageSystem.forceReset();
```

**2. Performance Issues**
```typescript
// Verificar métricas
const { isHealthy, metrics } = usePerformance();
if (!isHealthy) {
  console.log('Performance degraded:', metrics);
}
```

**3. Supabase Connection**
```typescript
// Test de conexión
const { data, error } = await supabase.from('learning_nodes').select('count');
if (error) console.error('DB connection failed:', error);
```

---

## 🤝 **Contribución**

### **Guía para Contribuidores**

1. **Fork del repositorio**
2. **Crear feature branch**: `git checkout -b feature/amazing-feature`
3. **Seguir convenciones de código**
4. **Escribir tests para nueva funcionalidad**
5. **Ejecutar tests**: `npm run test`
6. **Commit changes**: `git commit -m 'feat: add amazing feature'`
7. **Push to branch**: `git push origin feature/amazing-feature`
8. **Crear Pull Request**

### **Standards de Código**

```typescript
// ✅ Bueno
export const useUserProgress = (userId: string): UserProgress => {
  const [progress, setProgress] = useState<UserProgress | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  
  // Implementation...
  
  return { progress, isLoading };
};

// ❌ Malo
export const getUserProgress = (userId) => {
  // Sin tipos, sin naming convention
};
```

---

## 📄 **Licencia**

MIT License - ver [LICENSE](LICENSE) para detalles.

---

## 📞 **Soporte y Contacto**

- **Issues**: [GitHub Issues](link-to-issues)
- **Documentación**: [Wiki](link-to-wiki)
- **Email**: team@puntajeinteligente.cl

---

## 🗺️ **Roadmap**

### **V2.1 - Q1 2024**
- [ ] PWA Implementation
- [ ] Offline mode
- [ ] Push notifications
- [ ] Mobile app (React Native)

### **V2.2 - Q2 2024**
- [ ] Microservices architecture
- [ ] Advanced analytics
- [ ] A/B testing framework
- [ ] Internationalization

### **V3.0 - Q3 2024**
- [ ] Machine Learning models propios
- [ ] Real-time collaboration
- [ ] Advanced AI tutoring
- [ ] Blockchain certificates

---

*Última actualización: Agosto 2025*
