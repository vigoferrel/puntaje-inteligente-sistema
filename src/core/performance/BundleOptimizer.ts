
import React, { useEffect } from 'react';
import { lazy } from 'react';

// Sistema de splitting simplificado solo para componentes con export default válido
export const ChunkedComponents = {
  // Páginas principales (tienen export default)
  PAESUniversePage: lazy(() => import('@/pages/PAESUniversePage')),
  PAESDashboard: lazy(() => import('@/pages/PAESDashboard')),
  Diagnostico: lazy(() => import('@/pages/Diagnostico')),
  Plan: lazy(() => import('@/pages/Plan')),
  Progreso: lazy(() => import('@/pages/Progreso')),
  
  // Componentes específicos que sabemos tienen export default
  ErrorBoundary: lazy(() => import('@/core/performance/ErrorRecoverySystem').then(module => ({ default: module.AdvancedErrorBoundary }))),
  
  // Utilidades admin (solo para admin)
  AdminUtils: lazy(() => import('@/pages/AdminUtils')),
};

// Preloading estratégico simplificado
export const RoutePreloadingStrategy = {
  '/': ['PAESDashboard'],
  '/diagnostico': ['Diagnostico'],
  '/paes-universe': ['PAESUniversePage'],
  '/paes-dashboard': ['PAESDashboard'],
  '/plan': ['Plan'],
  '/progreso': ['Progreso']
};

// Sistema de prioridades de carga
export const LoadingPriorities = {
  critical: ['PAESDashboard'], // Cargar inmediatamente
  high: ['Diagnostico', 'Plan'], // Cargar en idle
  medium: ['PAESUniversePage', 'Progreso'], // Cargar bajo demanda
  low: ['AdminUtils'] // Cargar solo si es necesario
};

// Hook optimizado para cargar componentes de manera segura
export const useOptimizedComponentLoading = (route: string) => {
  useEffect(() => {
    const preloadComponents = RoutePreloadingStrategy[route as keyof typeof RoutePreloadingStrategy] || [];
    
    // Preload en requestIdleCallback si está disponible
    if ('requestIdleCallback' in window) {
      requestIdleCallback(() => {
        preloadComponents.forEach(componentName => {
          const Component = ChunkedComponents[componentName as keyof typeof ChunkedComponents];
          if (Component) {
            console.log(`🚀 Preloading: ${componentName}`);
            // Trigger lazy loading de manera segura
            Component.preload?.();
          }
        });
      });
    }
  }, [route]);
};
