# Frontend Structure

```
src/
├── components/             # Componentes reutilizables
│   ├── common/            # Componentes comunes (botones, inputs, etc)
│   │   ├── Button.tsx
│   │   ├── Input.tsx
│   │   └── Loading.tsx
│   ├── trading/           # Componentes específicos de trading
│   │   ├── OpportunityCard.tsx
│   │   ├── MetricsDisplay.tsx
│   │   └── ValidationSteps.tsx
│   └── layout/            # Componentes de layout
│       ├── Header.tsx
│       ├── Footer.tsx
│       └── Sidebar.tsx
├── pages/                 # Páginas principales
│   ├── dashboard/         # Dashboard principal
│   │   ├── Dashboard.tsx
│   │   └── styles.css
│   └── trading/          # Vista de trading
│       ├── TradingView.tsx
│       └── styles.css
├── layouts/              # Layouts principales
│   ├── MainLayout.tsx    # Layout principal con header/footer
│   └── MinimalLayout.tsx # Layout minimalista para vistas específicas
├── styles/               # Estilos globales
│   ├── global.css       # Estilos globales
│   ├── variables.css    # Variables CSS
│   └── themes.css       # Temas
└── assets/              # Recursos estáticos
    ├── images/          # Imágenes
    └── icons/           # Iconos
```

## Estructura y Convenciones

### Componentes
- Los componentes se organizan por dominio y funcionalidad
- Cada componente tiene su propio directorio con archivos relacionados
- Los componentes comunes se mantienen en `common/`
- Los componentes específicos de trading en `trading/`

### Páginas
- Cada página tiene su propio directorio
- Incluye el componente principal y estilos relacionados
- Las páginas representan rutas principales en la aplicación

### Layouts
- Layouts reutilizables para diferentes tipos de páginas
- MainLayout: Header, Footer, y navegación principal
- MinimalLayout: Para vistas que requieren menos elementos UI

### Estilos
- Variables CSS globales en `variables.css`
- Temas y personalización en `themes.css`
- Estilos globales en `global.css`

## Beneficios de esta Estructura

1. **Organización Clara**: Cada tipo de componente tiene su lugar específico
2. **Mantenibilidad**: Fácil de encontrar y modificar componentes
3. **Escalabilidad**: Estructura preparada para crecer
4. **Reusabilidad**: Componentes organizados para máxima reutilización
