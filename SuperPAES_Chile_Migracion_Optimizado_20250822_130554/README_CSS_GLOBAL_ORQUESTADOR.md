# 🎨 CSS Global y Orquestador SuperPAES Chile

## 📋 **Resumen**

Este documento describe el sistema de CSS global jerárquico y los scripts orquestadores que gestionan todo el sistema SuperPAES Chile, evitando duplicaciones y proporcionando una gestión centralizada.

## 🎯 **Objetivos**

1. **Jerarquización CSS**: Sistema de estilos organizado y escalable
2. **Evitar Duplicaciones**: Reutilización de componentes y estilos
3. **Gestión Centralizada**: Scripts orquestadores para todo el sistema
4. **Profesionalismo**: Diseño consistente y moderno

---

## 🎨 **CSS Global Jerárquico**

### 📁 **Estructura del Archivo**

```
src/styles/global.css
├── 1. Variables CSS (Design System)
├── 2. Reset y Base
├── 3. Tipografía Base
├── 4. Componentes Base
├── 5. Layout y Grid
├── 6. Utilidades
├── 7. Responsive Design
├── 8. Animaciones
├── 9. Accesibilidad
├── 10. Componentes Específicos SuperPAES
├── 11. Modos Temáticos
└── 12. Print Styles
```

### 🎨 **Design System**

#### **Colores Principales**
```css
--color-primary: #2563eb;      /* Azul principal */
--color-secondary: #7c3aed;    /* Púrpura secundario */
--color-accent: #f59e0b;       /* Naranja acento */
--color-success: #10b981;      /* Verde éxito */
--color-warning: #f59e0b;      /* Amarillo advertencia */
--color-error: #ef4444;        /* Rojo error */
```

#### **Tipografía**
```css
--font-family-primary: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
--font-size-base: 1rem;        /* 16px */
--font-weight-medium: 500;
--line-height-normal: 1.5;
```

#### **Espaciado**
```css
--spacing-1: 0.25rem;          /* 4px */
--spacing-4: 1rem;             /* 16px */
--spacing-6: 1.5rem;           /* 24px */
--spacing-8: 2rem;             /* 32px */
```

### 🧩 **Componentes Base**

#### **Botones**
```css
.btn {
  display: inline-flex;
  align-items: center;
  padding: var(--spacing-3) var(--spacing-6);
  border-radius: var(--border-radius-lg);
  transition: all var(--transition-fast);
}

.btn-primary {
  background-color: var(--color-primary);
  color: var(--color-white);
}
```

#### **Tarjetas**
```css
.card {
  background-color: var(--color-white);
  border: var(--border-width-thin) solid var(--color-gray-200);
  border-radius: var(--border-radius-xl);
  box-shadow: var(--shadow-sm);
}
```

#### **Barras de Progreso**
```css
.progress {
  width: 100%;
  height: var(--spacing-2);
  background-color: var(--color-gray-200);
  border-radius: var(--border-radius-full);
}

.progress-bar {
  height: 100%;
  background-color: var(--color-primary);
  transition: width var(--transition-normal);
}
```

### 📱 **Responsive Design**

```css
/* Mobile First */
.grid-cols-1 { grid-template-columns: repeat(1, minmax(0, 1fr)); }

/* Tablet */
@media (min-width: 768px) {
  .md\:grid-cols-2 { grid-template-columns: repeat(2, minmax(0, 1fr)); }
}

/* Desktop */
@media (min-width: 1024px) {
  .lg\:grid-cols-3 { grid-template-columns: repeat(3, minmax(0, 1fr)); }
}
```

### ♿ **Accesibilidad**

```css
.sr-only {
  position: absolute;
  width: 1px;
  height: 1px;
  padding: 0;
  margin: -1px;
  overflow: hidden;
  clip: rect(0, 0, 0, 0);
  white-space: nowrap;
  border: 0;
}

.focus\:ring:focus {
  outline: 2px solid var(--color-primary);
  outline-offset: 2px;
}
```

---

## 🚀 **Scripts Orquestadores**

### 📜 **PowerShell Orquestador**

**Archivo**: `orquestador-superpaes.ps1`

#### **Funcionalidades**
- ✅ Gestión de procesos (Node.js, Python)
- ✅ Verificación de dependencias
- ✅ Activación automática de CSS global
- ✅ Monitoreo en tiempo real
- ✅ Limpieza de sistema
- ✅ Logging detallado

#### **Comandos Disponibles**

```powershell
# Iniciar sistema
.\orquestador-superpaes.ps1 -Action start

# Iniciar con limpieza
.\orquestador-superpaes.ps1 -Action start -Clean

# Detener sistema
.\orquestador-superpaes.ps1 -Action stop

# Reiniciar sistema
.\orquestador-superpaes.ps1 -Action restart

# Mostrar estado
.\orquestador-superpaes.ps1 -Action status

# Monitorear en tiempo real
.\orquestador-superpaes.ps1 -Monitor

# Instalar dependencias
.\orquestador-superpaes.ps1 -Action install

# Limpiar sistema
.\orquestador-superpaes.ps1 -Action clean

# Actualizar sistema
.\orquestador-superpaes.ps1 -Action update
```

### 📜 **Batch Orquestador**

**Archivo**: `orquestador-superpaes.bat`

#### **Comandos Disponibles**

```batch
# Iniciar sistema
orquestador-superpaes.bat start

# Iniciar con limpieza
orquestador-superpaes.bat start clean

# Detener sistema
orquestador-superpaes.bat stop

# Reiniciar sistema
orquestador-superpaes.bat restart

# Mostrar estado
orquestador-superpaes.bat status

# Instalar dependencias
orquestador-superpaes.bat install

# Limpiar sistema
orquestador-superpaes.bat clean
```

---

## 🔧 **Funciones del Orquestador**

### 🔍 **Verificación de Dependencias**
```powershell
function Test-Dependencies {
    $Dependencies = @{
        "Node.js" = "node"
        "npm" = "npm"
        "Python" = "python"
        "pip" = "pip"
    }
    # Verifica que todas las dependencias estén instaladas
}
```

### 🎨 **Activación CSS Global**
```powershell
function Enable-GlobalCSS {
    # Verifica que el archivo CSS global existe
    # Agrega importación automática si es necesario
    # Actualiza variables CSS dinámicamente
}
```

### 📊 **Monitoreo del Sistema**
```powershell
function Show-SystemStatus {
    # Verifica procesos Node.js y Python
    # Muestra estado de puertos
    # Calcula uso de memoria
    # Muestra logs en tiempo real
}
```

### 🧹 **Limpieza del Sistema**
```powershell
function Clean-System {
    # Elimina logs antiguos (>7 días)
    # Limpia archivos temporales
    # Limpia cache de node_modules
    # Limpia directorios de build
}
```

---

## 📁 **Estructura de Archivos**

```
superpaes/
├── src/
│   ├── styles/
│   │   ├── global.css              # CSS Global Jerárquico
│   │   ├── exercise-system.css     # Estilos específicos
│   │   └── paes-nodes-dashboard.css
│   └── App.css                     # Importa CSS global
├── orquestador-superpaes.ps1       # Orquestador PowerShell
├── orquestador-superpaes.bat       # Orquestador Batch
├── logs/
│   ├── orquestador.log             # Logs del sistema
│   └── processes.pid               # Información de procesos
└── README_CSS_GLOBAL_ORQUESTADOR.md
```

---

## 🚀 **Guía de Uso Rápido**

### **1. Primera Instalación**
```powershell
# Instalar dependencias
.\orquestador-superpaes.ps1 -Action install

# Iniciar sistema con limpieza
.\orquestador-superpaes.ps1 -Action start -Clean
```

### **2. Uso Diario**
```powershell
# Iniciar sistema
.\orquestador-superpaes.ps1 -Action start

# Verificar estado
.\orquestador-superpaes.ps1 -Action status

# Detener sistema
.\orquestador-superpaes.ps1 -Action stop
```

### **3. Monitoreo**
```powershell
# Monitoreo en tiempo real
.\orquestador-superpaes.ps1 -Monitor

# Ver estado actual
.\orquestador-superpaes.ps1 -Action status
```

### **4. Mantenimiento**
```powershell
# Limpiar sistema
.\orquestador-superpaes.ps1 -Action clean

# Actualizar sistema
.\orquestador-superpaes.ps1 -Action update

# Reiniciar sistema
.\orquestador-superpaes.ps1 -Action restart
```

---

## 🎯 **Beneficios del Sistema**

### ✅ **Jerarquización**
- Estructura clara y organizada
- Fácil mantenimiento
- Escalabilidad

### ✅ **Evitar Duplicaciones**
- Componentes reutilizables
- Variables CSS centralizadas
- Estilos consistentes

### ✅ **Gestión Centralizada**
- Un solo comando para todo
- Monitoreo automático
- Logs detallados

### ✅ **Profesionalismo**
- Diseño moderno y consistente
- Accesibilidad integrada
- Responsive design

---

## 🔧 **Troubleshooting**

### **Error: "Dependencias faltantes"**
```powershell
# Solución: Instalar dependencias
.\orquestador-superpaes.ps1 -Action install
```

### **Error: "Puertos ocupados"**
```powershell
# Solución: Detener procesos y reiniciar
.\orquestador-superpaes.ps1 -Action stop
.\orquestador-superpaes.ps1 -Action start
```

### **Error: "CSS Global no encontrado"**
```powershell
# Solución: Verificar que el archivo existe
# El orquestador debería crearlo automáticamente
```

### **Problemas de Rendimiento**
```powershell
# Solución: Limpiar sistema
.\orquestador-superpaes.ps1 -Action clean
.\orquestador-superpaes.ps1 -Action start
```

---

## 📈 **Métricas y Monitoreo**

### **Métricas Recolectadas**
- ✅ Procesos activos (Node.js, Python)
- ✅ Uso de memoria
- ✅ Estado de puertos
- ✅ Tiempo de respuesta
- ✅ Errores del sistema

### **Logs Disponibles**
- 📄 `logs/orquestador.log` - Logs del orquestador
- 📄 `logs/processes.pid` - Información de procesos
- 📄 Logs de aplicación (frontend/backend)

---

## 🎨 **Personalización CSS**

### **Cambiar Tema**
```css
/* En global.css */
[data-theme="dark"] {
  --color-gray-50: #111827;
  --color-gray-100: #1f2937;
  /* ... más variables */
}
```

### **Agregar Componentes**
```css
/* En global.css - Sección 10 */
.my-custom-component {
  background: var(--color-primary);
  padding: var(--spacing-4);
  border-radius: var(--border-radius-lg);
}
```

### **Modificar Variables**
```css
/* En global.css - Sección 1 */
:root {
  --color-primary: #your-color;
  --font-size-base: 1.125rem;
  --spacing-4: 1.25rem;
}
```

---

## 🚀 **Próximos Pasos**

1. **Implementar más componentes base**
2. **Agregar temas adicionales**
3. **Mejorar monitoreo de performance**
4. **Integrar con CI/CD**
5. **Agregar tests automatizados**

---

## 📞 **Soporte**

Para problemas o preguntas:
1. Revisar logs en `logs/orquestador.log`
2. Ejecutar `.\orquestador-superpaes.ps1 -Action status`
3. Verificar dependencias con `.\orquestador-superpaes.ps1 -Action install`

---

**¡El sistema CSS Global y Orquestador está listo para proporcionar una experiencia profesional y consistente en SuperPAES Chile!** 🎓✨
