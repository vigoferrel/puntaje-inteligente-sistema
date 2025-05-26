
import React from 'react';
import { createLazyComponent, ComponentPreloader } from '@/core/performance/LazyComponentLoader';

// Componentes principales con lazy loading
export const LazyOptimizedDashboard = createLazyComponent(
  () => import('@/components/dashboard/OptimizedDashboard').then(m => ({ default: m.OptimizedDashboard })),
  {
    componentName: 'Dashboard Optimizado',
    fallbackMessage: 'Inicializando Dashboard Neural...',
    priority: 'critical',
    preloadDelay: 0
  }
);

export const LazyLectoGuiaUnified = createLazyComponent(
  () => import('@/components/lectoguia/LectoGuiaUnified').then(m => ({ default: m.LectoGuiaUnified })),
  {
    componentName: 'LectoGuía IA',
    fallbackMessage: 'Cargando LectoGuía Inteligente...',
    priority: 'high',
    preloadDelay: 500
  }
);

export const LazyStudyCalendar = createLazyComponent(
  () => import('@/components/calendar/StudyCalendarIntegration').then(m => ({ default: m.StudyCalendarIntegration })),
  {
    componentName: 'Calendario de Estudio',
    fallbackMessage: 'Preparando Calendario...',
    priority: 'medium',
    preloadDelay: 1000
  }
);

export const LazyFinancialCalculator = createLazyComponent(
  () => import('@/components/financial/PAESFinancialCalculator').then(m => ({ default: m.PAESFinancialCalculator })),
  {
    componentName: 'Calculadora Financiera',
    fallbackMessage: 'Cargando Centro Financiero...',
    priority: 'medium',
    preloadDelay: 1500
  }
);

export const LazyNeuralCommandCenter = createLazyComponent(
  () => import('@/components/neural-command/NeuralCommandCenter').then(m => ({ default: m.NeuralCommandCenter })),
  {
    componentName: 'Centro de Comando Neural',
    fallbackMessage: 'Inicializando Sistema Neural...',
    priority: 'high',
    preloadDelay: 800
  }
);

// Sistema de preloading estratégico
export const preloadCriticalComponents = () => {
  if (typeof window !== 'undefined' && 'requestIdleCallback' in window) {
    requestIdleCallback(() => {
      // Precargar componentes críticos con rutas específicas
      ComponentPreloader.preload(
        'dashboard',
        () => import('@/components/dashboard/OptimizedDashboard'),
        10
      );
      
      ComponentPreloader.preload(
        'lectoguia',
        () => import('@/components/lectoguia/LectoGuiaUnified'),
        9
      );
      
      ComponentPreloader.preload(
        'neural-command',
        () => import('@/components/neural-command/NeuralCommandCenter'),
        8
      );
    });
  }
};

// Hook para preloading inteligente con rutas específicas
export const useIntelligentPreloading = (currentRoute: string) => {
  React.useEffect(() => {
    const preloadMap: Record<string, Array<{ key: string; path: string }>> = {
      '/': [
        { key: 'lectoguia', path: '@/components/lectoguia/LectoGuiaUnified' },
        { key: 'calendar', path: '@/components/calendar/StudyCalendarIntegration' }
      ],
      '/lectoguia': [
        { key: 'dashboard', path: '@/components/dashboard/OptimizedDashboard' },
        { key: 'neural-command', path: '@/components/neural-command/NeuralCommandCenter' }
      ],
      '/calendar': [
        { key: 'dashboard', path: '@/components/dashboard/OptimizedDashboard' },
        { key: 'financial', path: '@/components/financial/PAESFinancialCalculator' }
      ],
      '/financial': [
        { key: 'dashboard', path: '@/components/dashboard/OptimizedDashboard' },
        { key: 'calendar', path: '@/components/calendar/StudyCalendarIntegration' }
      ]
    };
    
    const componentsToPreload = preloadMap[currentRoute] || [];
    
    if (componentsToPreload.length > 0) {
      const timer = setTimeout(() => {
        componentsToPreload.forEach((component, index) => {
          ComponentPreloader.preload(
            component.key,
            () => import(component.path),
            5 - index
          );
        });
      }, 2000); // Precargar después de 2 segundos
      
      return () => clearTimeout(timer);
    }
  }, [currentRoute]);
};
