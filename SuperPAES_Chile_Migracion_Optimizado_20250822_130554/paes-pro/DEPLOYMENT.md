# 🚀 Guía de Instalación y Despliegue - PAES PRO

## 📋 Prerrequisitos

Antes de comenzar, asegúrate de tener instalado:
- **Node.js** (versión 18 o superior)
- **npm** o **yarn**
- **Git**
- Una cuenta en **Supabase**
- Una cuenta en **OpenRouter**

## 🛠️ Instalación Local

### 1. Clonar el Repositorio
```bash
# Navegar a la carpeta donde quieres el proyecto
cd C:\Users\Hp\Desktop

# El proyecto ya está en paes-pro, pero si lo subes a GitHub:
# git clone https://github.com/tu-usuario/paes-pro.git
# cd paes-pro
```

### 2. Instalar Dependencias
```bash
cd paes-pro
npm install
```

### 3. Configurar Variables de Entorno
El archivo `.env.local` ya está creado con tus credenciales:
```env
NEXT_PUBLIC_SUPABASE_URL=https://settifboilityelprvjd.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
OPENROUTER_API_KEY=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
```

### 4. Configurar Base de Datos Supabase

#### Opción A: Usando la interfaz web de Supabase
1. Ve a [supabase.com](https://supabase.com)
2. Accede a tu proyecto: `settifboilityelprvjd`
3. Ve a la sección "SQL Editor"
4. Copia y ejecuta el contenido del archivo `sql/schema.sql`

#### Opción B: Usando psql (si tienes PostgreSQL instalado)
```bash
# Reemplaza PASSWORD con tu contraseña de Supabase
psql -h db.settifboilityelprvjd.supabase.co -U postgres -d postgres -f sql/schema.sql
```

### 5. Ejecutar el Proyecto
```bash
npm run dev
```

El proyecto estará disponible en: http://localhost:3000

## 🌐 Despliegue en Vercel

### 1. Preparar el Repositorio en GitHub
```bash
# Inicializar Git (si no está ya)
git init

# Agregar archivos
git add .

# Crear primer commit
git commit -m "Initial commit: PAES PRO proyecto base"

# Agregar remote (reemplaza con tu repositorio)
git remote add origin https://github.com/tu-usuario/paes-pro.git

# Subir código
git push -u origin main
```

### 2. Desplegar en Vercel
1. Ve a [vercel.com](https://vercel.com)
2. Conecta tu cuenta de GitHub
3. Importa el repositorio `paes-pro`
4. Configura las variables de entorno:
   - `NEXT_PUBLIC_SUPABASE_URL`
   - `NEXT_PUBLIC_SUPABASE_ANON_KEY`  
   - `OPENROUTER_API_KEY`
5. Haz clic en "Deploy"

### 3. Configurar Dominio (Opcional)
Si tienes un dominio personalizado:
1. En Vercel, ve a Settings > Domains
2. Agrega tu dominio personalizado
3. Configura los DNS según las instrucciones

## 🔧 Configuración Adicional

### Habilitar Autenticación en Supabase
1. Ve a Authentication > Settings en tu proyecto Supabase
2. Configura los providers que desees (Email, Google, etc.)
3. Agrega tu URL de producción a "Site URL"

### Configurar CORS en Supabase
1. Ve a Settings > API
2. En "CORS origins", agrega:
   - `http://localhost:3000` (para desarrollo)
   - Tu dominio de producción

### Configurar Row Level Security (RLS)
El script SQL ya configura las políticas básicas de RLS, pero puedes ajustarlas según tus necesidades en la sección Authentication > Policies.

## 📊 Monitoreo y Analytics

### Vercel Analytics (Recomendado)
```bash
npm install @vercel/analytics
```

Luego agrega en `app/layout.tsx`:
```tsx
import { Analytics } from '@vercel/analytics/react'

export default function RootLayout({ children }) {
  return (
    <html>
      <body>
        {children}
        <Analytics />
      </body>
    </html>
  )
}
```

## 🐛 Troubleshooting

### Error de conexión a Supabase
- Verifica que las URLs y claves estén correctas
- Asegúrate de que el proyecto Supabase esté activo
- Revisa que las políticas RLS permitan las operaciones

### Error con OpenRouter
- Verifica que la API key sea válida
- Asegúrate de tener créditos disponibles
- Revisa los logs de la consola para errores específicos

### Problemas de build en Vercel
- Asegúrate de que todas las dependencias estén en `package.json`
- Verifica que los tipos de TypeScript sean correctos
- Revisa los logs de build en Vercel

## 📈 Siguientes Pasos

Una vez desplegado, considera:

1. **Configurar dominio personalizado**
2. **Implementar Google Analytics**
3. **Configurar Sentry para monitoreo de errores**
4. **Optimizar SEO con metadata**
5. **Implementar PWA para móviles**
6. **Configurar CI/CD con GitHub Actions**

## 🆘 Soporte

Si encuentras problemas:
1. Revisa los logs en la consola del navegador
2. Verifica los logs en Vercel (si está desplegado)
3. Consulta la documentación de [Next.js](https://nextjs.org/docs)
4. Revisa la documentación de [Supabase](https://supabase.io/docs)

¡Tu proyecto PAES PRO está listo para ayudar a estudiantes a prepararse para la PAES! 🎓
