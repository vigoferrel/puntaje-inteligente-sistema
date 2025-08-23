# 🔧 **Guía de Instalación y Desarrollo**

## 📋 **Prerrequisitos del Sistema**

### **Requisitos Mínimos**
- **Node.js**: v18.0.0 o superior
- **npm**: v8.0.0 o superior (o yarn v1.22.0+)
- **Git**: v2.25.0 o superior
- **RAM**: 8GB mínimo (16GB recomendado)
- **Almacenamiento**: 10GB libres

### **Sistemas Operativos Soportados**
- Windows 10/11
- macOS 10.15+
- Ubuntu 20.04+ / Debian 11+
- Fedora 35+

---

## 🚀 **Instalación Rápida**

### **1. Clonar el Repositorio**

```bash
# Opción 1: HTTPS
git clone https://github.com/tu-organizacion/puntaje-inteligente-sistema.git

# Opción 2: SSH (recomendado para contribuidores)
git clone git@github.com:tu-organizacion/puntaje-inteligente-sistema.git

cd puntaje-inteligente-sistema
```

### **2. Verificar Versiones**

```bash
# Verificar Node.js
node --version  # Debe ser v18+

# Verificar npm
npm --version   # Debe ser v8+

# Verificar Git
git --version   # Debe ser v2.25+
```

### **3. Instalación de Dependencias**

```bash
# Usando npm (recomendado)
npm install

# O usando yarn
yarn install

# O usando pnpm (más rápido)
pnpm install
```

**Tiempo estimado**: 3-5 minutos dependiendo de la conexión.

### **4. Configuración de Variables de Entorno**

```bash
# Copiar archivo de ejemplo
cp .env.example .env.local

# Editar con tus credenciales
nano .env.local  # o tu editor preferido
```

**Contenido mínimo de .env.local:**
```bash
# Supabase (Obligatorio)
VITE_SUPABASE_URL=https://settifboilityelprvjd.supabase.co
VITE_SUPABASE_ANON_KEY=tu_clave_anon_aqui

# OpenRouter (Opcional - para funciones de IA)
VITE_OPENROUTER_API_KEY=tu_clave_openrouter_aqui

# Modo de desarrollo
VITE_NODE_ENV=development
```

### **5. Primer Arranque**

```bash
# Iniciar servidor de desarrollo
npm run dev

# O con yarn
yarn dev

# O con pnpm
pnpm dev
```

**La aplicación estará disponible en:** `http://localhost:8080`

---

## 🔧 **Configuración Avanzada**

### **Base de Datos Local (Opcional)**

Si quieres ejecutar Supabase localmente:

```bash
# Instalar Supabase CLI
npm install -g @supabase/cli

# Inicializar proyecto local
supabase init

# Iniciar servicios locales
supabase start

# Aplicar migraciones
supabase db reset
```

### **Configuración IDE**

#### **VSCode (Recomendado)**

Instalar extensiones recomendadas:
```json
{
  "recommendations": [
    "bradlc.vscode-tailwindcss",
    "esbenp.prettier-vscode",
    "dbaeumer.vscode-eslint",
    "ms-vscode.vscode-typescript-next",
    "bradlc.vscode-tailwindcss",
    "usernamehw.errorlens"
  ]
}
```

#### **Configuración de Prettier**

```json
// .prettierrc
{
  "semi": true,
  "trailingComma": "es5",
  "singleQuote": true,
  "printWidth": 80,
  "tabWidth": 2,
  "useTabs": false
}
```

### **Configuración de TypeScript Estricta**

Para desarrollo con máxima seguridad de tipos:

```json
// tsconfig.json (configuración estricta)
{
  "compilerOptions": {
    "strict": true,
    "noImplicitAny": true,
    "noImplicitReturns": true,
    "noUnusedLocals": true,
    "noUnusedParameters": true,
    "exactOptionalPropertyTypes": true
  }
}
```

---

## 🧪 **Configuración de Testing**

### **Configuración Automática**

Los tests ya están configurados con Vitest. Para ejecutar:

```bash
# Tests en modo watch
npm run test

# Tests una sola vez
npm run test:run

# Tests con UI visual
npm run test:ui

# Coverage completo
npm run test:coverage
```

### **Configuración Manual de Testing**

Si necesitas reconfigurar:

```bash
# Instalar dependencias de testing
npm install -D vitest @vitest/ui @vitest/coverage-v8 jsdom
npm install -D @testing-library/react @testing-library/jest-dom
npm install -D @testing-library/user-event
```

---

## 🚀 **Scripts de Desarrollo**

```bash
# Desarrollo
npm run dev                # Servidor de desarrollo
npm run dev:host          # Servidor accesible desde red local

# Building
npm run build             # Build para producción
npm run build:dev         # Build para desarrollo
npm run preview           # Preview del build

# Testing
npm run test              # Tests en modo watch
npm run test:run          # Tests una sola vez
npm run test:coverage     # Tests con coverage
npm run test:ui           # UI visual para tests

# Calidad de código
npm run lint              # ESLint
npm run lint:fix          # ESLint con auto-fix
npm run type-check        # Verificación de tipos
npm run format            # Prettier
npm run format:check      # Verificar formato
```

---

## 🐛 **Troubleshooting**

### **Problemas Comunes**

#### **1. Error de Node.js Version**
```bash
# Error: Node.js version not supported
nvm install 18
nvm use 18
```

#### **2. Error de Permisos (npm)**
```bash
# Error: EACCES permission denied
npm config set prefix ~/.npm-global
export PATH=~/.npm-global/bin:$PATH
```

#### **3. Error de Puerto Ocupado**
```bash
# Error: Port 8080 is already in use
npm run dev -- --port 3001
```

#### **4. Error de Memoria (Building)**
```bash
# Error: JavaScript heap out of memory
export NODE_OPTIONS="--max-old-space-size=8192"
npm run build
```

#### **5. Error de SSL/Certificados**
```bash
# Error: unable to verify the first certificate
npm config set strict-ssl false
# O mejor: usar certificados corporativos válidos
```

### **Verificación de Salud del Sistema**

```bash
# Verificar instalación completa
npm run health-check  # (script personalizado)

# O manualmente:
node -v && npm -v && git --version
npm list --depth=0
npm run type-check
npm run test:run
```

### **Logs de Debug**

```bash
# Habilitar logs detallados
DEBUG=* npm run dev

# Logs específicos de Vite
DEBUG=vite:* npm run dev

# Logs del sistema storage
localStorage.setItem('debug', 'storage,neural,api')
```

---

## 🔧 **Configuración por Entorno**

### **Desarrollo Local**
```bash
# .env.development
VITE_NODE_ENV=development
VITE_DEBUG_MODE=true
VITE_API_TIMEOUT=10000
VITE_CACHE_TTL=300000
```

### **Testing**
```bash
# .env.test
VITE_NODE_ENV=test
VITE_SUPABASE_URL=http://localhost:54321
VITE_MOCK_API=true
```

### **Staging**
```bash
# .env.staging
VITE_NODE_ENV=staging
VITE_SUPABASE_URL=https://staging-project.supabase.co
VITE_DEBUG_MODE=false
```

### **Producción**
```bash
# .env.production
VITE_NODE_ENV=production
VITE_DEBUG_MODE=false
VITE_COMPRESSION=true
VITE_ANALYTICS=true
```

---

## 📊 **Monitoreo de Performance**

### **Métricas de Desarrollo**

```bash
# Bundle analyzer
npm run build:analyze

# Performance audit
npm run audit

# Lighthouse CI
npm run lighthouse
```

### **Configuración de Webpack Bundle Analyzer**

```javascript
// vite.config.ts
import { defineConfig } from 'vite'
import { visualizer } from 'rollup-plugin-visualizer'

export default defineConfig({
  plugins: [
    visualizer({
      filename: 'dist/stats.html',
      open: true,
      gzipSize: true,
    })
  ]
})
```

---

## 🤝 **Configuración para Contribuidores**

### **Git Hooks (Husky)**

```bash
# Instalar Husky
npm install -D husky lint-staged

# Configurar pre-commit
npx husky add .husky/pre-commit "npm run lint-staged"

# Configurar commit-msg
npx husky add .husky/commit-msg "npm run commitlint"
```

### **Lint Staged Configuration**

```json
// package.json
{
  "lint-staged": {
    "*.{ts,tsx}": [
      "eslint --fix",
      "prettier --write",
      "vitest related --run"
    ],
    "*.{json,css,md}": [
      "prettier --write"
    ]
  }
}
```

### **Conventional Commits**

```bash
# Ejemplos de commits válidos
git commit -m "feat: add neural system integration"
git commit -m "fix: resolve storage circuit breaker issue"
git commit -m "docs: update installation guide"
git commit -m "test: add coverage for auth context"
git commit -m "perf: optimize bundle size"
```

---

## 🚢 **Deployment**

### **Build para Producción**

```bash
# Build optimizado
npm run build

# Verificar build
npm run preview

# Test del build
npm run test:e2e  # Si tienes E2E tests
```

### **Docker (Opcional)**

```dockerfile
# Dockerfile
FROM node:18-alpine

WORKDIR /app
COPY package*.json ./
RUN npm ci --only=production

COPY . .
RUN npm run build

EXPOSE 8080
CMD ["npm", "run", "preview"]
```

```bash
# Build imagen
docker build -t puntaje-inteligente .

# Ejecutar contenedor
docker run -p 8080:8080 puntaje-inteligente
```

---

## 📞 **Soporte**

### **Canales de Soporte**

- **Issues**: [GitHub Issues](https://github.com/tu-org/repo/issues)
- **Discussions**: [GitHub Discussions](https://github.com/tu-org/repo/discussions)
- **Email**: dev-support@puntajeinteligente.cl
- **Discord**: [Servidor Discord](link-to-discord)

### **Información para Reportar Bugs**

Incluir siempre:
1. Versión de Node.js (`node -v`)
2. Sistema operativo
3. Pasos para reproducir
4. Logs de error completos
5. Screenshot si aplica

```bash
# Script para recopilar info del sistema
npm run system-info
```

---

*Guía actualizada: Agosto 2025*
