# 🧠 Sistema PAES Neural - Plataforma Educativa Inteligente

[![React](https://img.shields.io/badge/React-18.0-blue.svg)](https://reactjs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.0-blue.svg)](https://www.typescriptlang.org/)
[![Supabase](https://img.shields.io/badge/Supabase-Database-green.svg)](https://supabase.com/)
[![Vite](https://img.shields.io/badge/Vite-Build%20Tool-yellow.svg)](https://vitejs.dev/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind-CSS-38B2AC.svg)](https://tailwindcss.com/)

## 🎯 Descripción

**Sistema PAES Neural** es una plataforma educativa revolucionaria diseñada para la preparación integral de la Prueba de Acceso a la Educación Superior (PAES) de Chile. Combina inteligencia artificial, gamificación y análisis de datos para crear una experiencia de aprendizaje personalizada y efectiva.

## ✨ Características Principales

### 🧠 Inteligencia Artificial Integrada
- **Asistente IA Personalizado**: LectoGuía con análisis contextual
- **Generación Automática de Ejercicios**: Basada en el nivel del estudiante
- **Recomendaciones Inteligentes**: Adaptadas al progreso individual
- **Análisis de Imágenes**: Reconocimiento inteligente de contenido visual

### 📊 Sistema de Diagnósticos Avanzado
- **Evaluaciones Personalizadas**: Por materia y nivel de dificultad
- **Análisis de Competencias**: Mapeo de habilidades según taxonomía de Bloom
- **Progreso en Tiempo Real**: Seguimiento detallado del aprendizaje
- **Reportes Detallados**: Con recomendaciones específicas

### 🎮 Gamificación Educativa
- **Sistema de Logros**: Desbloqueo de badges y recompensas
- **Competencia Saludable**: Rankings y desafíos entre estudiantes
- **Progresión Visual**: Mapas de habilidades interactivos
- **Motivación Continua**: Sistema de puntos y niveles

### 📚 Contenido PAES Oficial
- **5 Materias Principales**: Matemática M1/M2, Comprensión Lectora, Ciencias, Historia
- **Ejercicios Validados**: Basados en exámenes oficiales
- **Contenido Actualizado**: Según las últimas modificaciones PAES
- **Múltiples Formatos**: Preguntas, simulaciones, material multimedia

## 🚀 Tecnologías Utilizadas

### Frontend
- **React 18** - Biblioteca de interfaz de usuario
- **TypeScript** - Tipado estático para mayor robustez
- **Vite** - Herramienta de construcción rápida
- **Tailwind CSS** - Framework CSS utilitario
- **Framer Motion** - Animaciones fluidas
- **Three.js** - Visualizaciones 3D
- **Zustand** - Gestión de estado

### Backend & Base de Datos
- **Supabase** - Backend-as-a-Service
- **PostgreSQL** - Base de datos relacional
- **Edge Functions** - Funciones serverless
- **Real-time Subscriptions** - Actualizaciones en tiempo real

### IA & Machine Learning
- **OpenRouter API** - Acceso a modelos de IA avanzados
- **Análisis de Sentimientos** - Evaluación emocional del aprendizaje
- **Recomendaciones Personalizadas** - Algoritmos de recomendación

## 📦 Instalación

### Prerrequisitos
- Node.js 18+ 
- npm o yarn
- Cuenta de Supabase
- Claves de API de OpenRouter

### Pasos de Instalación

1. **Clonar el repositorio**
```bash
git clone https://github.com/vigoferrel/puntaje-inteligente-sistema.git
cd puntaje-inteligente-sistema
```

2. **Instalar dependencias**
```bash
npm install
```

3. **Configurar variables de entorno**
```bash
cp .env.example .env
```

Editar `.env` con tus credenciales:
```env
VITE_SUPABASE_URL=tu_url_de_supabase
VITE_SUPABASE_ANON_KEY=tu_clave_anonima
OPENROUTER_API_KEY=tu_clave_de_openrouter
```

4. **Configurar base de datos**
```bash
# Ejecutar script de configuración
node setup-paes-db.js
```

5. **Iniciar desarrollo**
```bash
npm run dev
```

El sistema estará disponible en `http://localhost:8080`

## 🗄️ Estructura de Base de Datos

### Tablas Principales
- **users** - Información de usuarios
- **user_progress** - Progreso individual
- **user_preferences** - Preferencias personalizadas
- **learning_nodes** - Nodos de aprendizaje
- **exercises** - Banco de ejercicios
- **diagnostic_results** - Resultados de evaluaciones
- **achievements** - Sistema de logros

### Funciones RPC
- 18 funciones especializadas para análisis y procesamiento
- Optimización de consultas y rendimiento
- Seguridad con Row Level Security (RLS)

## 🎨 Características de UI/UX

### Diseño Responsivo
- **Mobile-First**: Optimizado para dispositivos móviles
- **Adaptativo**: Se adapta a diferentes tamaños de pantalla
- **Accesible**: Cumple estándares de accesibilidad

### Temas y Personalización
- **Modo Oscuro/Claro**: Cambio automático según preferencias
- **Temas Personalizables**: Colores y estilos adaptables
- **Interfaz Intuitiva**: Navegación clara y fácil de usar

### Animaciones y Transiciones
- **Transiciones Suaves**: Mejora la experiencia de usuario
- **Feedback Visual**: Respuestas inmediatas a acciones
- **Carga Optimizada**: Lazy loading y preloading inteligente

## 📈 Funcionalidades Avanzadas

### Análisis de Rendimiento
- **Métricas en Tiempo Real**: Seguimiento de progreso
- **Gráficos Interactivos**: Visualización de datos
- **Reportes Detallados**: Análisis completo del aprendizaje

### Integración de Herramientas
- **Calendario Inteligente**: Planificación de estudio
- **Notificaciones**: Recordatorios personalizados
- **Exportación de Datos**: Reportes en múltiples formatos

### Colaboración
- **Compartir Progreso**: Con padres y tutores
- **Foros de Discusión**: Comunidad de estudiantes
- **Tutores Virtuales**: Asistencia 24/7

## 🔧 Configuración Avanzada

### Desarrollo
```bash
# Ejecutar tests
npm run test

# Build de producción
npm run build

# Análisis de código
npm run lint
```

### Despliegue
```bash
# Build optimizado
npm run build

# Servir archivos estáticos
npm run preview
```

## 🤝 Contribuir

1. Fork el proyecto
2. Crea una rama para tu feature (`git checkout -b feature/AmazingFeature`)
3. Commit tus cambios (`git commit -m 'Add some AmazingFeature'`)
4. Push a la rama (`git push origin feature/AmazingFeature`)
5. Abre un Pull Request

## 📄 Licencia

Este proyecto está bajo la Licencia MIT. Ver el archivo `LICENSE` para más detalles.

## 👥 Autores

- **vigoferrel** - *Desarrollo inicial* - [GitHub](https://github.com/vigoferrel)

## 🙏 Agradecimientos

- Comunidad educativa chilena
- Desarrolladores de las librerías utilizadas
- Estudiantes que han probado y mejorado el sistema

## 📞 Contacto

- **GitHub**: [@vigoferrel](https://github.com/vigoferrel)
- **Proyecto**: [Sistema PAES Neural](https://github.com/vigoferrel/puntaje-inteligente-sistema)

## 🚀 Roadmap

- [ ] Integración con más modelos de IA
- [ ] Aplicación móvil nativa
- [ ] Análisis predictivo avanzado
- [ ] Integración con sistemas educativos
- [ ] Soporte multiidioma
- [ ] Realidad aumentada para ejercicios

---

⭐ **¡Dale una estrella al proyecto si te ha sido útil!**

🔗 **Comparte este proyecto con otros educadores y estudiantes**
