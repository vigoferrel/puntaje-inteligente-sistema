# 🚀 Comandos Útiles - PAES PRO

## 📦 Comandos de Desarrollo

### Desarrollo Local
```bash
# Instalar dependencias
npm install

# Ejecutar en modo desarrollo
npm run dev

# Ejecutar en producción local
npm run build
npm start

# Linting y formateo
npm run lint
```

### Base de Datos
```bash
# Aplicar migraciones (usando Supabase CLI si está instalado)
supabase db push

# Reset completo de la base de datos
supabase db reset

# Generar tipos TypeScript desde Supabase
supabase gen types typescript --project-id settifboilityelprvjd > types/supabase.ts
```

## 🔧 Comandos de Construcción

### Build para Producción
```bash
# Build completo
npm run build

# Verificar build localmente
npm start

# Analizar bundle
npm run build && npx @next/bundle-analyzer
```

## 🧪 Testing (para futuro)
```bash
# Instalar dependencias de testing
npm install --save-dev jest @testing-library/react @testing-library/jest-dom

# Ejecutar tests
npm test

# Ejecutar tests en modo watch
npm run test:watch

# Coverage report
npm run test:coverage
```

## 📊 Análisis y Optimización
```bash
# Analizar bundle size
npx @next/bundle-analyzer

# Auditoría de seguridad
npm audit

# Actualizar dependencias
npm update

# Verificar dependencias obsoletas
npm outdated
```

## 🚀 Despliegue

### Vercel
```bash
# Instalar Vercel CLI
npm i -g vercel

# Deploy
vercel

# Deploy a producción
vercel --prod

# Ver logs
vercel logs
```

### Docker (opcional)
```bash
# Build imagen Docker
docker build -t paes-pro .

# Ejecutar contenedor
docker run -p 3000:3000 paes-pro
```

## 🔍 Debug y Monitoreo
```bash
# Ejecutar con debug de Next.js
DEBUG=* npm run dev

# Ver métricas de performance
npm run build && npm start -- --experimental-profiler

# Analizar tiempo de build
npm run build -- --profile
```

## 📝 Comandos de Git
```bash
# Setup inicial
git init
git add .
git commit -m "Initial commit"
git remote add origin https://github.com/tu-usuario/paes-pro.git
git push -u origin main

# Workflow habitual
git add .
git commit -m "feat: nueva funcionalidad"
git push

# Crear nueva rama
git checkout -b feature/nueva-funcionalidad
git push -u origin feature/nueva-funcionalidad
```

## 🛠️ Herramientas de Desarrollo

### Extensiones de VS Code Recomendadas
- ES7+ React/Redux/React-Native snippets
- Tailwind CSS IntelliSense
- TypeScript Importer
- Auto Rename Tag
- Prettier - Code formatter
- ESLint

### Configuración de Prettier (crear .prettierrc)
```json
{
  "semi": false,
  "trailingComma": "es5",
  "singleQuote": true,
  "tabWidth": 2,
  "useTabs": false
}
```

### Configuración de ESLint (crear .eslintrc.json)
```json
{
  "extends": ["next/core-web-vitals"],
  "rules": {
    "no-unused-vars": "warn",
    "no-console": "warn"
  }
}
```

## 🌟 Comandos Específicos del Proyecto

### Generar Contenido con IA
```bash
# Probar API de generación de contenido
curl -X POST http://localhost:3000/api/generate-content \
  -H "Content-Type: application/json" \
  -d '{"type":"question","topic":"comprension lectora","testType":"COMPETENCIA_LECTORA"}'
```

### Gestión de Datos
```bash
# Backup de base de datos (usando pg_dump si tienes acceso)
pg_dump -h db.settifboilityelprvjd.supabase.co -U postgres -d postgres > backup.sql

# Restaurar backup
psql -h db.settifboilityelprvjd.supabase.co -U postgres -d postgres < backup.sql
```

¡Estos comandos te ayudarán a mantener y desarrollar PAES PRO de manera eficiente! 🚀
