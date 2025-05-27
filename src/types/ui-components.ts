
/**
 * TIPOS DE COMPONENTES UI v2.0
 * Interfaces y tipos para componentes de interfaz
 */

// Tipos de layout
export type LayoutType = 'dashboard' | 'immersive' | 'sidebar' | 'fullscreen' | 'modal';

// Configuración de tema
export interface ThemeConfig {
  mode: 'light' | 'dark' | 'auto';
  primaryColor: string;
  accentColor: string;
  backgroundColor: string;
  textColor: string;
  borderRadius: 'none' | 'sm' | 'md' | 'lg' | 'xl';
  animations: boolean;
  transitions: boolean;
}

// Propiedades de componentes cinematográficos
export interface CinematicProps {
  enableParallax?: boolean;
  enableGlow?: boolean;
  enableTransitions?: boolean;
  intensity?: 'subtle' | 'moderate' | 'dramatic';
  variant?: 'elegant' | 'dynamic' | 'immersive';
}

// Configuración de navegación
export interface NavigationConfig {
  enableBreadcrumbs: boolean;
  enableBackButton: boolean;
  enableKeyboardNavigation: boolean;
  transitionDuration: number;
  defaultRoute: string;
}

// Props base para componentes educativos
export interface BaseEducationalComponentProps {
  className?: string;
  children?: React.ReactNode;
  loading?: boolean;
  error?: string | null;
  onInteraction?: (event: AnalyticsEvent) => void;
  cinematicProps?: CinematicProps;
}

// Configuración de visualización de datos
export interface DataVisualizationConfig {
  chartType: 'line' | 'bar' | 'pie' | 'radar' | 'scatter' | 'area';
  colorScheme: 'default' | 'educational' | 'performance' | 'neural';
  animations: boolean;
  interactivity: boolean;
  responsive: boolean;
}
