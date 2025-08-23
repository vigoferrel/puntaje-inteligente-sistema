# 🤝 **Guía de Contribución**

¡Gracias por tu interés en contribuir al Sistema Puntaje Inteligente! Esta guía te ayudará a empezar y contribuir de manera efectiva.

## 📋 **Tabla de Contenidos**

- [Código de Conducta](#código-de-conducta)
- [¿Cómo puedo contribuir?](#cómo-puedo-contribuir)
- [Configuración del Entorno](#configuración-del-entorno)
- [Proceso de Desarrollo](#proceso-de-desarrollo)
- [Standards de Código](#standards-de-código)
- [Proceso de Pull Request](#proceso-de-pull-request)
- [Reporte de Bugs](#reporte-de-bugs)
- [Solicitud de Features](#solicitud-de-features)

---

## 📜 **Código de Conducta**

Este proyecto adhiere al [Contributor Covenant](https://www.contributor-covenant.org/). Al participar, se espera que mantengas este código. Por favor reporta comportamientos inaceptables a [conduct@puntajeinteligente.cl](mailto:conduct@puntajeinteligente.cl).

### **Nuestros Estándares**

- Usar lenguaje inclusivo y respetuoso
- Respetar diferentes puntos de vista y experiencias
- Aceptar críticas constructivas con gracia
- Enfocarse en lo que es mejor para la comunidad
- Mostrar empatía hacia otros miembros de la comunidad

---

## 🛠️ **¿Cómo puedo contribuir?**

### **Reportar Bugs**
- Busca primero en [Issues existentes](https://github.com/tu-org/repo/issues)
- Usa la plantilla de bug report
- Incluye pasos para reproducir
- Agrega screenshots si es visual

### **Sugerir Features**
- Busca en issues existentes
- Usa la plantilla de feature request
- Explica el caso de uso
- Considera la implementación

### **Contribuciones de Código**
- Correcciones de bugs
- Nuevas features
- Mejoras de performance
- Tests adicionales
- Documentación

### **Contribuciones de Documentación**
- Mejoras al README
- Guías de usuario
- Documentación técnica
- Comentarios en código
- Traducciones

---

## 🚀 **Configuración del Entorno**

### **Prerequisitos**
- Node.js 18+
- npm 8+ (o yarn/pnpm)
- Git 2.25+

### **Setup Inicial**

```bash
# 1. Fork del repositorio en GitHub

# 2. Clonar tu fork
git clone https://github.com/TU-USERNAME/puntaje-inteligente-sistema.git
cd puntaje-inteligente-sistema

# 3. Agregar upstream
git remote add upstream https://github.com/ORIGINAL-OWNER/puntaje-inteligente-sistema.git

# 4. Instalar dependencias
npm install

# 5. Copiar variables de entorno
cp .env.example .env.local
# Editar .env.local con tus valores

# 6. Ejecutar tests
npm run test

# 7. Iniciar desarrollo
npm run dev
```

### **Verificación de Setup**

```bash
# Verificar que todo funciona
npm run type-check
npm run lint
npm run test:run
npm run build
```

---

## 🔄 **Proceso de Desarrollo**

### **Workflow Git**

```bash
# 1. Sincronizar con upstream
git fetch upstream
git checkout main
git merge upstream/main

# 2. Crear feature branch
git checkout -b feature/nombre-descriptivo

# 3. Desarrollar con commits frecuentes
git add .
git commit -m "feat: descripción de la funcionalidad"

# 4. Push a tu fork
git push origin feature/nombre-descriptivo

# 5. Crear Pull Request en GitHub
```

### **Naming Conventions**

#### **Branches**
- `feature/descripcion-feature` - Nueva funcionalidad
- `bugfix/descripcion-bug` - Corrección de bug
- `hotfix/descripcion-hotfix` - Corrección urgente
- `docs/descripcion-docs` - Documentación
- `refactor/descripcion-refactor` - Refactoring
- `test/descripcion-test` - Tests

#### **Commits (Conventional Commits)**
```bash
# Tipos de commit
feat: nueva funcionalidad
fix: corrección de bug
docs: documentación
style: formato, punto y coma, etc.
refactor: cambio de código que no agrega funcionalidad ni corrige bugs
test: agregar tests
chore: cambios en el build, herramientas auxiliares, etc.

# Ejemplos
git commit -m "feat: agregar sistema de notificaciones push"
git commit -m "fix: corregir cálculo de puntaje PAES"
git commit -m "docs: actualizar guía de instalación"
git commit -m "test: agregar tests para AuthContext"
```

---

## 📏 **Standards de Código**

### **TypeScript**

```typescript
// ✅ Bueno
interface UserProgress {
  readonly nodeId: string;
  readonly masteryLevel: number;
  readonly completedAt: string;
}

export const calculateProgress = (
  progress: UserProgress[]
): number => {
  return progress.reduce((acc, p) => acc + p.masteryLevel, 0) / progress.length;
};

// ❌ Malo
const calculateProgress = (progress: any) => {
  return progress.reduce((acc, p) => acc + p.masteryLevel, 0) / progress.length;
};
```

### **React Components**

```typescript
// ✅ Bueno
interface ButtonProps {
  readonly children: React.ReactNode;
  readonly variant?: 'primary' | 'secondary';
  readonly disabled?: boolean;
  readonly onClick?: () => void;
}

export const Button: React.FC<ButtonProps> = ({ 
  children, 
  variant = 'primary', 
  disabled = false,
  onClick 
}) => {
  return (
    <button
      className={`btn btn-${variant}`}
      disabled={disabled}
      onClick={onClick}
      type="button"
    >
      {children}
    </button>
  );
};

// ❌ Malo
export const Button = ({ children, variant, disabled, onClick }) => {
  return (
    <button 
      className={`btn btn-${variant || 'primary'}`}
      disabled={disabled}
      onClick={onClick}
    >
      {children}
    </button>
  );
};
```

### **Custom Hooks**

```typescript
// ✅ Bueno
interface UseUserProgressOptions {
  readonly userId: string;
  readonly autoRefresh?: boolean;
}

interface UseUserProgressReturn {
  readonly progress: UserProgress[];
  readonly isLoading: boolean;
  readonly error: string | null;
  readonly refreshProgress: () => Promise<void>;
}

export const useUserProgress = ({
  userId,
  autoRefresh = false
}: UseUserProgressOptions): UseUserProgressReturn => {
  // Implementation...
};
```

### **File Organization**

```typescript
// Orden de imports
import React from 'react';                    // React
import { useState, useEffect } from 'react';  // React hooks
import { motion } from 'framer-motion';       // Third party
import { Button } from '@/components/ui';     // UI components
import { useAuth } from '@/contexts/AuthContext'; // Contexts
import { UserProgress } from '@/types';       // Types
import { logger } from '@/core/logging';      // Core systems
import { cn } from '@/lib/utils';            // Utils

// Orden dentro del archivo
// 1. Interfaces/Types
// 2. Constants
// 3. Main component
// 4. Sub-components (if any)
// 5. Default export
```

### **Testing Standards**

```typescript
// ✅ Bueno
describe('UserProgress Component', () => {
  const mockProps = {
    userId: 'test-user-id',
    onProgressUpdate: vi.fn(),
  };

  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('should render progress correctly', () => {
    render(<UserProgress {...mockProps} />);
    
    expect(screen.getByText('Progress')).toBeInTheDocument();
  });

  it('should call onProgressUpdate when progress changes', async () => {
    render(<UserProgress {...mockProps} />);
    
    const updateButton = screen.getByRole('button', { name: /update/i });
    await user.click(updateButton);
    
    expect(mockProps.onProgressUpdate).toHaveBeenCalledTimes(1);
  });
});
```

---

## 🔍 **Proceso de Pull Request**

### **Antes de crear el PR**

```bash
# 1. Asegúrate de que todos los tests pasen
npm run test:run

# 2. Verifica el linting
npm run lint

# 3. Verifica tipos
npm run type-check

# 4. Verifica el build
npm run build

# 5. Actualiza documentación si es necesario
```

### **Plantilla de PR**

```markdown
## 📝 Descripción
Descripción clara y concisa de los cambios realizados.

## 🔧 Tipo de Cambio
- [ ] Bug fix (cambio que corrige un issue)
- [ ] Nueva feature (cambio que agrega funcionalidad)
- [ ] Breaking change (fix o feature que causa que funcionalidad existente no funcione como antes)
- [ ] Documentación

## 🧪 ¿Cómo se ha probado?
Describe las pruebas que ejecutaste para verificar tus cambios.

## 📋 Checklist
- [ ] Mi código sigue las guías de estilo del proyecto
- [ ] He realizado una auto-revisión de mi código
- [ ] He comentado mi código, particularmente en áreas difíciles de entender
- [ ] He realizado los cambios correspondientes a la documentación
- [ ] Mis cambios no generan nuevas advertencias
- [ ] He agregado tests que prueban que mi fix es efectivo o que mi feature funciona
- [ ] Tests unitarios nuevos y existentes pasan localmente con mis cambios

## 📸 Screenshots (si aplica)
Agrega screenshots para ayudar a explicar tu cambio.
```

### **Revisión de Código**

Los maintainers revisarán tu PR considerando:

- **Funcionalidad**: ¿Funciona como se espera?
- **Tests**: ¿Está bien probado?
- **Performance**: ¿Impacta la performance?
- **Security**: ¿Introduce vulnerabilidades?
- **Style**: ¿Sigue los standards del proyecto?
- **Documentation**: ¿Está bien documentado?

---

## 🐛 **Reporte de Bugs**

### **Antes de reportar**
1. Actualiza a la última versión
2. Busca en issues existentes
3. Verifica que no sea un problema de configuración

### **Información a incluir**

```markdown
**Describe el bug**
Descripción clara y concisa del bug.

**Para Reproducir**
Pasos para reproducir el comportamiento:
1. Ve a '...'
2. Haz click en '....'
3. Scroll hacia abajo hasta '....'
4. Ve el error

**Comportamiento Esperado**
Descripción clara de lo que esperabas que pasara.

**Screenshots**
Si aplica, agrega screenshots para ayudar a explicar tu problema.

**Información del Sistema:**
 - OS: [e.g. iOS]
 - Browser [e.g. chrome, safari]
 - Version [e.g. 22]
 - Node.js version
 - npm/yarn version

**Contexto Adicional**
Agrega cualquier otro contexto sobre el problema aquí.
```

---

## ✨ **Solicitud de Features**

### **Plantilla de Feature Request**

```markdown
**¿Tu feature request está relacionado a un problema? Describe.**
Descripción clara y concisa del problema. Ej. Me frustra cuando [...]

**Describe la solución que te gustaría**
Descripción clara y concisa de lo que quieres que pase.

**Describe alternativas que has considerado**
Descripción clara y concisa de cualquier solución o feature alternativa que hayas considerado.

**Contexto adicional**
Agrega cualquier otro contexto o screenshots sobre el feature request aquí.
```

---

## 🏷️ **Labels y Prioridades**

### **Labels de Tipo**
- `bug` - Algo no está funcionando
- `enhancement` - Nueva feature o request
- `documentation` - Mejoras o adiciones a documentación
- `good first issue` - Bueno para newcomers
- `help wanted` - Se necesita ayuda extra
- `question` - Información adicional es requerida

### **Labels de Prioridad**
- `priority: critical` - Debe ser arreglado inmediatamente
- `priority: high` - Debe ser arreglado pronto
- `priority: medium` - Debe ser arreglado eventualmente
- `priority: low` - Sería bueno arreglarlo

### **Labels de Área**
- `area: neural` - Sistema neural/IA
- `area: lectoguia` - LectoGuía
- `area: diagnostic` - Sistema de diagnósticos
- `area: financial` - Centro financiero
- `area: ui` - Interfaz de usuario
- `area: performance` - Performance
- `area: security` - Seguridad

---

## 📞 **Obtener Ayuda**

### **Canales de Comunicación**
- **GitHub Issues**: Para bugs y feature requests
- **GitHub Discussions**: Para preguntas generales
- **Discord**: [Servidor de la comunidad](link)
- **Email**: [dev@puntajeinteligente.cl](mailto:dev@puntajeinteligente.cl)

### **Recursos Útiles**
- [Documentación del Proyecto](README.md)
- [Guía de Instalación](INSTALLATION.md)
- [Arquitectura del Sistema](ARCHITECTURE.md)
- [API Reference](API.md)

---

## 🎉 **Reconocimiento**

Todos los contribuidores serán agregados al README y recibirán reconocimiento por sus contribuciones. Las contribuciones significativas serán destacadas en releases.

### **Tipos de Contribución**
- 💻 Código
- 📖 Documentación
- 🐛 Reporte de bugs
- 💡 Ideas
- 🤔 Answering Questions
- ⚠️ Tests
- 🌍 Traducciones

---

**¡Gracias por contribuir al Sistema Puntaje Inteligente! 🚀**

---

*Guía actualizada: Agosto 2025*
