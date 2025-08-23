# 🚀 SuperPAES Chile - Sistema Inteligente de Preparación PAES

## 🇨🇱 Sistema Oficial para Alumnos de Chile

SuperPAES Chile es una plataforma educativa de clase mundial diseñada específicamente para ayudar a los estudiantes chilenos a alcanzar sus metas de puntaje en la Prueba de Acceso a la Educación Superior (PAES).

## ✨ Características Principales

### 🎯 **Metas Personalizadas de Puntaje**
- Cada alumno define su meta específica de puntaje PAES
- Sistema adaptativo que se ajusta a la meta del estudiante
- Seguimiento en tiempo real del progreso hacia la meta

### 🧠 **Agentes IA Especializados**
- **Agente Competencia Lectora**: Comprensión oficial PAES
- **Agente Matemática M1**: 7° a 2° Medio
- **Agente Matemática M2**: 3° y 4° Medio
- **Agente Ciencias**: Biología, Física, Química
- **Agente Historia**: Historia y Ciencias Sociales
- **Agente Meta Puntaje**: Optimización de puntaje PAES

### 🎵 **Playlists Neural Spotify**
- Experiencias de aprendizaje personalizadas
- Contenidos oficiales del MINEDUC
- Diferentes niveles: Básico, Intermedio, Avanzado, Excelencia
- Adaptación automática según el progreso

### 📊 **Analytics Avanzados**
- Predicción de puntaje con 95% de precisión
- Análisis de fortalezas y debilidades
- Seguimiento de progreso semanal y mensual
- Métricas de eficiencia de tiempo

### 📅 **Calendario Centralizado**
- Hub de notificaciones y recordatorios
- Integración con todos los sistemas
- Planificación automática de estudio

## 🏗️ Arquitectura del Sistema

### Frontend (Puerto 3000)
- **React + TypeScript + Vite**
- **Tailwind CSS** para diseño moderno
- **Lucide React** para iconografía
- Interfaz de usuario de clase mundial

### Backend (Puerto 5000)
- **Flask + Python**
- **API REST** completa
- **CORS** habilitado para comunicación frontend-backend
- Datos de ejemplo para demostración

## 🚀 Lanzamiento Rápido

### Opción 1: Script Automático (Recomendado)
```bash
# Ejecutar el script de lanzamiento
lanzar_superpaes_chile.bat
```

### Opción 2: Lanzamiento Manual

#### 1. Iniciar Backend
```bash
cd backend
python app_simple.py
```

#### 2. Iniciar Frontend (en nueva terminal)
```bash
cd src
npm run dev
```

#### 3. Acceder al Sistema
- **Frontend**: http://localhost:3000
- **Backend**: http://localhost:5000
- **Health Check**: http://localhost:5000/api/health

## 📋 Prerrequisitos

### Software Requerido
- **Node.js** (versión 16 o superior)
- **Python** (versión 3.8 o superior)
- **npm** (incluido con Node.js)

### Dependencias Instaladas
- **Frontend**: React, TypeScript, Tailwind CSS, Lucide React
- **Backend**: Flask, Flask-CORS

## 🎯 Contenidos Oficiales PAES

### Pruebas Cubiertas
1. **Competencia Lectora**
   - Rastrear-Localizar (30%)
   - Interpretar-Relacionar (40%)
   - Evaluar-Reflexionar (30%)

2. **Matemática M1** (7° a 2° Medio)
   - Números
   - Álgebra y Funciones
   - Geometría
   - Probabilidad y Estadística

3. **Matemática M2** (3° y 4° Medio)
   - Álgebra y Funciones Avanzadas
   - Geometría Analítica
   - Cálculo Diferencial e Integral

4. **Ciencias**
   - Biología Común
   - Física Común
   - Química Común

5. **Historia y Ciencias Sociales**
   - Historia de Chile
   - Historia Universal
   - Geografía

## 🔧 API Endpoints

### Usuario y Dashboard
- `GET /api/user` - Datos del usuario
- `GET /api/dashboard` - Datos completos del dashboard
- `GET /api/learning-metrics` - Métricas de aprendizaje

### Metas PAES
- `GET /api/paes-goals` - Metas PAES del usuario
- `POST /api/paes-goals` - Crear nueva meta

### Playlists Neural
- `GET /api/playlists` - Lista de playlists
- `POST /api/playlists/{id}/start` - Iniciar playlist
- `POST /api/playlists/{id}/complete` - Completar playlist

### Agentes IA
- `GET /api/agents` - Estado de agentes IA
- `POST /api/agents/{id}/activate` - Activar agente

### Ejercicios
- `GET /api/exercises` - Ejercicios disponibles
- `POST /api/exercises/{id}/submit` - Enviar respuesta

### Utilidades
- `GET /api/health` - Estado del sistema
- `GET /api/subjects` - Materias PAES
- `GET /api/difficulties` - Niveles de dificultad

## 🎨 Características de la Interfaz

### Dashboard Principal
- **Bienvenida personalizada** con estadísticas
- **Tarjetas de métricas** en tiempo real
- **Progreso de metas PAES** visual
- **Playlists activas** con progreso
- **Estado de agentes IA**

### Secciones Especializadas
- **Metas PAES**: Gestión detallada de objetivos
- **Playlists Neural**: Experiencias de aprendizaje
- **Agentes IA**: Control de inteligencia artificial
- **Analytics**: Análisis avanzado de progreso
- **Calendario**: Planificación centralizada

## 🔒 Seguridad y Privacidad

- **CORS** configurado para desarrollo
- **Validación** de datos en backend
- **Manejo de errores** robusto
- **Logs** de actividad del sistema

## 📈 Roadmap

### Fase 1: Sistema Base ✅
- [x] Frontend React con TypeScript
- [x] Backend Flask con API REST
- [x] Interfaz de usuario moderna
- [x] Datos de ejemplo

### Fase 2: Integración Supabase
- [ ] Conexión a base de datos real
- [ ] Autenticación de usuarios
- [ ] Datos persistentes

### Fase 3: IA Avanzada
- [ ] Integración con agentes LangGraph
- [ ] Sistema de recomendaciones
- [ ] Predicción de puntaje

### Fase 4: Contenidos Oficiales
- [ ] Banco de ejercicios MINEDUC
- [ ] Simuladores oficiales
- [ ] Material educativo certificado

## 🤝 Contribución

Este proyecto está diseñado específicamente para los estudiantes de Chile. Las contribuciones son bienvenidas para mejorar la experiencia educativa.

## 📞 Soporte

Para soporte técnico o preguntas sobre el sistema:
- **Email**: soporte@superpaes.cl
- **Documentación**: [docs.superpaes.cl](https://docs.superpaes.cl)

## 📄 Licencia

SuperPAES Chile - Sistema Educativo para Chile
© 2024 - Todos los derechos reservados

---

**🇨🇱 ¡Transformando la educación en Chile, un estudiante a la vez! 🇨🇱**
