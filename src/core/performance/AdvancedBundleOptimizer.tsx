
import React, { lazy } from 'react';

// Lazy loading optimizado para todos los componentes
const Index = lazy(() => import('@/pages/Index').then(module => ({ default: module.default })));
const Auth = lazy(() => import('@/pages/Auth').then(module => ({ default: module.default })));
const LectoGuiaPage = lazy(() => import('@/pages/LectoGuiaPage').then(module => ({ default: module.default })));
const FinancialPage = lazy(() => import('@/pages/FinancialPage').then(module => ({ default: module.default })));
const DiagnosticPage = lazy(() => import('@/pages/DiagnosticPage').then(module => ({ default: module.default })));
const PlanningPage = lazy(() => import('@/pages/PlanningPage').then(module => ({ default: module.default })));
const UniverseVisualizationPage = lazy(() => import('@/pages/UniverseVisualizationPage').then(module => ({ default: module.default })));
const AchievementsPage = lazy(() => import('@/pages/AchievementsPage').then(module => ({ default: module.default })));
const EcosystemPage = lazy(() => import('@/pages/EcosystemPage').then(module => ({ default: module.default })));
const ValidationDashboard = lazy(() => import('@/pages/ValidationDashboard').then(module => ({ default: module.ValidationDashboard })));
const SecurityDashboard = lazy(() => import('@/pages/SecurityDashboard').then(module => ({ default: module.SecurityDashboard })));

interface ComponentMap {
  [key: string]: React.LazyExoticComponent<React.ComponentType<any>>;
}

// Mapa de componentes optimizado
const componentMap: ComponentMap = {
  Index,
  Auth,
  LectoGuiaPage,
  FinancialPage,
  DiagnosticPage,
  PlanningPage,
  UniverseVisualizationPage,
  AchievementsPage,
  EcosystemPage,
  ValidationDashboard,
  SecurityDashboard
};

export const useAdvancedBundleOptimizer = (currentPath: string) => {
  // Determinar componentes a precargar basado en la ruta actual
  const getPreloadComponents = (path: string): string[] => {
    switch (path) {
      case '/':
        return ['LectoGuiaPage', 'DiagnosticPage', 'ValidationDashboard', 'SecurityDashboard'];
      case '/lectoguia':
        return ['DiagnosticPage', 'PlanningPage'];
      case '/diagnostic':
        return ['PlanningPage', 'LectoGuiaPage'];
      case '/validation-dashboard':
        return ['SecurityDashboard', 'Index', 'DiagnosticPage'];
      case '/security-dashboard':
        return ['ValidationDashboard', 'Index', 'DiagnosticPage'];
      default:
        return ['Index'];
    }
  };

  const preloadComponents = getPreloadComponents(currentPath);

  // Precargar componentes relevantes
  React.useEffect(() => {
    const preloadTimer = setTimeout(() => {
      preloadComponents.forEach(componentName => {
        if (componentMap[componentName]) {
          // Forzar la carga del componente
          componentMap[componentName];
        }
      });
    }, 1000);

    return () => clearTimeout(preloadTimer);
  }, [currentPath]);

  return {
    components: componentMap,
    preloadComponents,
    currentPath
  };
};
