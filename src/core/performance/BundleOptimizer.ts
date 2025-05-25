
import { lazy } from 'react';

// Estrategia de splitting por funcionalidad específica
export const ChunkedComponents = {
  // Componentes de diagnóstico
  DiagnosticCore: lazy(() => import('@/components/diagnostic/DiagnosticController')),
  DiagnosticResults: lazy(() => import('@/components/diagnostic/DiagnosticResults')),
  DiagnosticExecution: lazy(() => import('@/components/diagnostic/DiagnosticExecution')),
  
  // Componentes PAES específicos
  PAESUniverse: lazy(() => import('@/components/paes-universe/PAESUniverseDashboard')),
  PAESMetrics: lazy(() => import('@/components/paes-unified/PAESGlobalMetrics')),
  PAESNavigation: lazy(() => import('@/components/paes-unified/PAESTestNavigation')),
  
  // Componentes de ejercicios
  ExerciseGenerator: lazy(() => import('@/components/exercise-generator/ExerciseGeneratorCore')),
  ExerciseResults: lazy(() => import('@/components/exercise-generator/ExerciseResults')),
  
  // Componentes cinematográficos (pesados)
  CinematicUniverse: lazy(() => import('@/components/paes-learning-universe/PAESLearningUniverse')),
  CinematicDashboard: lazy(() => import('@/components/dashboard/CinematicUnifiedDashboard')),
  CinematicFinances: lazy(() => import('@/components/financial-center/CinematicFinancialCenter')),
  
  // Utilidades admin (solo para admin)
  AdminUtils: lazy(() => import('@/pages/AdminUtils')),
  AdminDiagnostic: lazy(() => import('@/pages/admin/GeneradorDiagnostico'))
};

// Preloading estratégico basado en rutas
export const RoutePreloadingStrategy = {
  '/': ['DiagnosticCore', 'PAESMetrics'],
  '/diagnostico': ['DiagnosticExecution', 'DiagnosticResults'],
  '/paes-universe': ['PAESUniverse', 'CinematicUniverse'],
  '/paes-dashboard': ['PAESMetrics', 'PAESNavigation'],
  '/ejercicios': ['ExerciseGenerator', 'ExerciseResults'],
  '/plan': ['DiagnosticResults', 'ExerciseGenerator'],
  '/finanzas': ['CinematicFinances'],
  '/dashboard': ['CinematicDashboard', 'PAESMetrics']
};

// Sistema de prioridades de carga
export const LoadingPriorities = {
  critical: ['DiagnosticCore', 'PAESMetrics'], // Cargar inmediatamente
  high: ['DiagnosticExecution', 'ExerciseGenerator'], // Cargar en idle
  medium: ['PAESUniverse', 'CinematicDashboard'], // Cargar bajo demanda
  low: ['AdminUtils', 'CinematicFinances'] // Cargar solo si es necesario
};

// Hook para cargar componentes de manera optimizada
export const useOptimizedComponentLoading = (route: string) => {
  React.useEffect(() => {
    const preloadComponents = RoutePreloadingStrategy[route as keyof typeof RoutePreloadingStrategy] || [];
    
    // Preload en requestIdleCallback si está disponible
    if ('requestIdleCallback' in window) {
      requestIdleCallback(() => {
        preloadComponents.forEach(componentName => {
          const Component = ChunkedComponents[componentName as keyof typeof ChunkedComponents];
          if (Component) {
            // Trigger lazy loading
            import('@/components/lazy-trigger').then(() => {
              console.log(`🚀 Preloaded: ${componentName}`);
            }).catch(() => {
              console.warn(`❌ Failed to preload: ${componentName}`);
            });
          }
        });
      });
    }
  }, [route]);
};
