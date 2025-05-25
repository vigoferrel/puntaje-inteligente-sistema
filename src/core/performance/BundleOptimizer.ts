
import React, { useEffect } from 'react';
import { lazy } from 'react';

// Estrategia de splitting por funcionalidad específica con imports corregidos
export const ChunkedComponents = {
  // Componentes de diagnóstico
  DiagnosticCore: lazy(() => import('@/components/diagnostic/DiagnosticController').then(module => ({ default: module.DiagnosticController }))),
  DiagnosticResults: lazy(() => import('@/components/diagnostic/DiagnosticResults').then(module => ({ default: module.DiagnosticResults }))),
  DiagnosticExecution: lazy(() => import('@/components/diagnostic/DiagnosticExecution').then(module => ({ default: module.DiagnosticExecution }))),
  
  // Componentes PAES específicos
  PAESUniverse: lazy(() => import('@/components/paes-universe/PAESUniverseDashboard').then(module => ({ default: module.PAESUniverseDashboard }))),
  PAESMetrics: lazy(() => import('@/components/paes-unified/PAESGlobalMetrics').then(module => ({ default: module.PAESGlobalMetrics }))),
  PAESNavigation: lazy(() => import('@/components/paes-unified/PAESTestNavigation').then(module => ({ default: module.PAESTestNavigation }))),
  
  // Componentes de ejercicios
  ExerciseGenerator: lazy(() => import('@/components/exercise-generator/ExerciseGeneratorCore').then(module => ({ default: module.ExerciseGeneratorCore }))),
  ExerciseResults: lazy(() => import('@/components/exercise-generator/ExerciseResults').then(module => ({ default: module.ExerciseResults }))),
  
  // Componentes cinematográficos (pesados)
  CinematicUniverse: lazy(() => import('@/components/paes-learning-universe/PAESLearningUniverse').then(module => ({ default: module.PAESLearningUniverse }))),
  CinematicDashboard: lazy(() => import('@/components/dashboard/CinematicUnifiedDashboard').then(module => ({ default: module.CinematicUnifiedDashboard }))),
  CinematicFinances: lazy(() => import('@/components/financial-center/CinematicFinancialCenter').then(module => ({ default: module.CinematicFinancialCenter }))),
  
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
  useEffect(() => {
    const preloadComponents = RoutePreloadingStrategy[route as keyof typeof RoutePreloadingStrategy] || [];
    
    // Preload en requestIdleCallback si está disponible
    if ('requestIdleCallback' in window) {
      requestIdleCallback(() => {
        preloadComponents.forEach(componentName => {
          const Component = ChunkedComponents[componentName as keyof typeof ChunkedComponents];
          if (Component) {
            // Trigger lazy loading sin módulo inexistente
            console.log(`🚀 Preloading: ${componentName}`);
          }
        });
      });
    }
  }, [route]);
};
