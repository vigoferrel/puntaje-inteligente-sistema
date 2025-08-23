# 🤝 Guía de Contribución

¡Gracias por tu interés en contribuir al **Sistema PAES Neural**! Este documento te ayudará a comenzar.

## 🚀 Cómo Contribuir

### 1. Fork y Clone
```bash
# Fork el repositorio en GitHub
# Luego clona tu fork
git clone https://github.com/TU_USUARIO/puntaje-inteligente-sistema.git
cd puntaje-inteligente-sistema
```

### 2. Configurar el Entorno
```bash
# Instalar dependencias
npm install

# Configurar variables de entorno
cp .env.example .env
# Editar .env con tus credenciales
```

### 3. Crear una Rama
```bash
# Crear y cambiar a una nueva rama
git checkout -b feature/nombre-de-tu-feature
# o
git checkout -b fix/nombre-del-fix
```

### 4. Desarrollar
- Escribe código limpio y bien documentado
- Sigue las convenciones de TypeScript
- Añade tests para nueva funcionalidad
- Actualiza la documentación si es necesario

### 5. Commit y Push
```bash
# Agregar cambios
git add .

# Commit con mensaje descriptivo
git commit -m "feat: añadir nueva funcionalidad de análisis"

# Push a tu fork
git push origin feature/nombre-de-tu-feature
```

### 6. Crear Pull Request
- Ve a tu fork en GitHub
- Crea un Pull Request hacia la rama `main`
- Describe claramente los cambios realizados

## 📋 Convenciones de Código

### Estructura de Commits
```
tipo(alcance): descripción

feat: nueva funcionalidad
fix: corrección de bug
docs: cambios en documentación
style: cambios de formato
refactor: refactorización de código
test: añadir o modificar tests
chore: cambios en build o herramientas
```

### Naming Conventions
```typescript
// Componentes: PascalCase
export const UserProfile = () => {};

// Hooks: camelCase con prefijo 'use'
export const useUserData = () => {};

// Funciones: camelCase
export const calculateScore = () => {};

// Constantes: UPPER_SNAKE_CASE
export const MAX_ATTEMPTS = 3;

// Interfaces: PascalCase con prefijo 'I'
export interface IUserProgress {
  userId: string;
  progress: number;
}
```

### Estructura de Archivos
```
src/
├── components/
│   ├── ui/           # Componentes base
│   ├── feature/      # Componentes específicos
│   └── layout/       # Componentes de layout
├── hooks/            # Custom hooks
├── services/         # Servicios y APIs
├── types/            # Definiciones TypeScript
└── utils/            # Utilidades
```

## 🧪 Testing

### Ejecutar Tests
```bash
# Tests unitarios
npm run test

# Tests con coverage
npm run test:coverage

# Tests en modo watch
npm run test:watch
```

### Escribir Tests
```typescript
import { render, screen } from '@testing-library/react';
import { UserProfile } from './UserProfile';

describe('UserProfile', () => {
  it('should render user information', () => {
    render(<UserProfile userId="123" />);
    expect(screen.getByText('Perfil de Usuario')).toBeInTheDocument();
  });
});
```

## 📝 Documentación

### Comentarios de Código
```typescript
/**
 * Calcula el puntaje ponderado del estudiante
 * @param scores - Array de puntajes por materia
 * @param weights - Array de pesos por materia
 * @returns Puntaje ponderado final
 */
export const calculateWeightedScore = (
  scores: number[],
  weights: number[]
): number => {
  // Implementation...
};
```

### README de Componentes
```markdown
# Componente UserProfile

## Propósito
Muestra el perfil completo del usuario con estadísticas de progreso.

## Props
- `userId: string` - ID del usuario
- `showStats?: boolean` - Mostrar estadísticas (opcional)

## Uso
```tsx
<UserProfile userId="123" showStats={true} />
```
```

## 🐛 Reportar Bugs

### Crear un Issue
1. Ve a la sección Issues en GitHub
2. Busca si ya existe un issue similar
3. Crea un nuevo issue con:
   - Título descriptivo
   - Descripción detallada del problema
   - Pasos para reproducir
   - Comportamiento esperado vs actual
   - Screenshots si aplica

### Template de Bug Report
```markdown
## 🐛 Descripción del Bug
Descripción clara y concisa del problema.

## 🔄 Pasos para Reproducir
1. Ve a '...'
2. Haz clic en '...'
3. Desplázate hacia abajo hasta '...'
4. Ve el error

## ✅ Comportamiento Esperado
Lo que debería suceder.

## 📱 Información Adicional
- Sistema operativo: [ej. Windows 10]
- Navegador: [ej. Chrome 91]
- Versión: [ej. 2.0.0]
```

## 💡 Solicitar Features

### Crear Feature Request
1. Ve a la sección Issues en GitHub
2. Crea un nuevo issue con etiqueta "enhancement"
3. Describe la funcionalidad deseada
4. Explica el beneficio para los usuarios

### Template de Feature Request
```markdown
## 💡 Descripción de la Feature
Descripción clara de la funcionalidad deseada.

## 🎯 Problema que Resuelve
Explicación del problema o necesidad.

## 💭 Solución Propuesta
Descripción de la solución propuesta.

## 🔄 Alternativas Consideradas
Otras soluciones que se consideraron.

## 📱 Información Adicional
Capturas de pantalla, mockups, etc.
```

## 🏷️ Etiquetas de Issues

- `bug` - Error o problema
- `enhancement` - Nueva funcionalidad
- `documentation` - Mejoras en documentación
- `good first issue` - Ideal para principiantes
- `help wanted` - Necesita ayuda
- `question` - Pregunta o duda

## 📞 Contacto

- **Discusiones**: [GitHub Discussions](https://github.com/vigoferrel/puntaje-inteligente-sistema/discussions)
- **Issues**: [GitHub Issues](https://github.com/vigoferrel/puntaje-inteligente-sistema/issues)
- **Email**: vigoferrel@github.com

## 🙏 Agradecimientos

¡Gracias por contribuir al Sistema PAES Neural! Tu trabajo ayuda a mejorar la educación en Chile.

---

**¿Necesitas ayuda?** No dudes en preguntar en las discusiones o crear un issue.
