# PAES PRO - Plataforma de Preparación Inteligente

Una plataforma moderna de preparación para la Prueba de Acceso a la Educación Superior (PAES) de Chile, con tecnología de inteligencia artificial adaptativa.

## 🚀 Funcionalidades

### ✅ Implementado
- **Dashboard interactivo** con progreso personalizado
- **Sistema de nodos de aprendizaje** organizados por habilidades
- **Mapa de aprendizaje visual** con progreso por tracks
- **Simulaciones configurables** con diferentes niveles
- **Generación de contenido con IA** (OpenRouter + GPT-4.1-mini)
- **Base de datos simplificada** con Supabase
- **Interfaz responsive** con Tailwind CSS

### 🔄 En desarrollo
- Autenticación completa con Supabase Auth
- Sistema de recomendaciones de carrera
- Análisis detallado de resultados
- Contenido multimedia (videos, audio)

## 🛠️ Tecnologías

- **Frontend**: Next.js 14, React, TypeScript
- **Estilos**: Tailwind CSS
- **Base de datos**: Supabase (PostgreSQL)
- **IA**: OpenRouter (GPT-4.1-mini)
- **Iconos**: Lucide React
- **Gráficos**: Recharts

## 📦 Instalación

1. **Clonar el repositorio**
```bash
git clone https://github.com/tu-usuario/paes-pro.git
cd paes-pro
```

2. **Instalar dependencias**
```bash
npm install
```

3. **Configurar variables de entorno**
Crea un archivo `.env.local`:
```env
NEXT_PUBLIC_SUPABASE_URL=https://settifboilityelprvjd.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InNldHRpZmJvaWxpdHllbHBydmpkIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDc4NTgyMjIsImV4cCI6MjA2MzQzNDIyMn0.11lCgmBNnZeAmxG1pEc6JAdZMAS5J5hUhw5TF6-JvrQ
OPENROUTER_API_KEY=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
```

4. **Configurar la base de datos**
Ejecuta el script SQL en tu proyecto de Supabase:
```bash
psql -h db.settifboilityelprvjd.supabase.co -U postgres -d postgres < sql/schema.sql
```

5. **Iniciar el servidor de desarrollo**
```bash
npm run dev
```

## 🗂️ Estructura del Proyecto

```
paes-pro/
├── app/                    # Rutas de Next.js 14
│   ├── dashboard/         # Dashboard principal
│   ├── lectoguia/        # Guías de lectura con IA
│   ├── api/              # API Routes
│   └── globals.css       # Estilos globales
├── components/           # Componentes React
│   ├── Sidebar.tsx       # Navegación lateral
│   ├── ProgressCard.tsx  # Tarjetas de progreso
│   ├── LearningMap.tsx   # Mapa de aprendizaje
│   └── SimulationButton.tsx # Botón de simulación
├── lib/                  # Utilidades y configuración
│   ├── supabase.ts       # Cliente de Supabase
│   ├── openrouter.ts     # Cliente de OpenRouter
│   └── utils.ts          # Funciones auxiliares
├── types/                # Tipos de TypeScript
├── sql/                  # Scripts de base de datos
└── README.md
```

## 🎯 Características del Sistema

### Sistema de Nodos de Aprendizaje
- Organización por habilidades PAES (Localizar, Interpretar, Evaluar)
- Progreso granular por cada nodo de aprendizaje
- Desbloqueo progresivo basado en prerrequisitos

### Generación de Contenido con IA
- Preguntas adaptativas por dificultad
- Explicaciones personalizadas
- Ejercicios de práctica contextualizados

### Dashboard Inteligente
- Visualización de progreso en tiempo real
- Estadísticas de estudio personalizadas
- Recomendaciones de áreas de mejora

## 🔌 APIs Disponibles

### `/api/generate-content`
Genera contenido educativo personalizado:
```javascript
POST /api/generate-content
{
  "type": "question", // question, explanation, practice
  "topic": "Comprensión lectora",
  "difficulty": "intermedio",
  "testType": "COMPETENCIA_LECTORA"
}
```

### `/api/progress`
Maneja el progreso del usuario:
```javascript
GET /api/progress?userId=123
POST /api/progress
{
  "userId": "123",
  "nodeId": "456",
  "status": "completed",
  "progressPercentage": 85
}
```

## 🎨 Diseño UI/UX

El diseño está inspirado en la imagen de referencia proporcionada:
- **Sidebar de navegación** con secciones organizadas
- **Tarjetas de progreso** con barras visuales
- **Mapa de aprendizaje** interactivo
- **Diseño responsive** para todas las pantallas
- **Tema consistente** con colores morado/azul

## 🚦 Roadmap

### Fase 1 (Actual)
- [x] Dashboard básico
- [x] Sistema de progreso
- [x] Integración con IA
- [x] Base de datos simplificada

### Fase 2 (Próximo)
- [ ] Autenticación completa
- [ ] Sistema de simulacros completos
- [ ] Análisis avanzado de resultados
- [ ] Recomendaciones de carrera

### Fase 3 (Futuro)
- [ ] App móvil
- [ ] Sistema de gamificación
- [ ] Integración con instituciones educativas
- [ ] Análisis predictivo con ML

## 🤝 Contribuir

1. Fork el proyecto
2. Crea una rama para tu feature (`git checkout -b feature/AmazingFeature`)
3. Commit tus cambios (`git commit -m 'Add some AmazingFeature'`)
4. Push a la rama (`git push origin feature/AmazingFeature`)
5. Abre un Pull Request

## 📄 Licencia

Este proyecto está bajo la Licencia MIT - ver el archivo [LICENSE](LICENSE) para detalles.

## 📞 Contacto

**Desarrollado para la comunidad estudiantil chilena** 🇨🇱

- GitHub: [@tu-usuario](https://github.com/tu-usuario)
- Email: contacto@paes-pro.cl

---

### 🎓 Sobre PAES

La Prueba de Acceso a la Educación Superior (PAES) es el examen estandarizado que deben rendir los estudiantes chilenos para acceder a la educación superior. Esta plataforma busca democratizar el acceso a herramientas de preparación de calidad.

**¡Prepárate para tu futuro con PAES PRO!** 🚀
