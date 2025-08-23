
import { lazy, useMemo } from 'react';
import { useLocation } from 'react-router-dom';

// Sistema de lazy loading simplificado y estable
const createSafeLazyComponent = (importFn: () => Promise<any>, componentName: string) => {
  return lazy(async () => {
    try {
      const module = await importFn();
      if (process.env.NODE_ENV === 'development') {
        console.log(`✅ Componente cargado: ${componentName}`);
      }
      return module;
    } catch (error) {
      console.error(`❌ Error cargando ${componentName}:`, error);
      return {
        default: () => (
          <div className="min-h-screen flex items-center justify-center bg-gray-900 text-white">
            <div className="text-center">
              <h2 className="text-xl font-bold mb-2">Error cargando {componentName}</h2>
              <p className="text-gray-400">Por favor, recarga la página</p>
            </div>
          </div>
        )
      };
    }
  });
};

// Componentes lazy simplificados
const lazyComponents = {
  Index: createSafeLazyComponent(() => import('@/pages/Index'), 'Index'),
  Auth: createSafeLazyComponent(() => import('@/pages/Auth'), 'Auth'),
  LectoGuiaPage: createSafeLazyComponent(() => import('@/pages/LectoGuiaPage'), 'LectoGuiaPage'),
  DiagnosticPage: createSafeLazyComponent(() => import('@/pages/DiagnosticPage'), 'DiagnosticPage'),
  PlanningPage: createSafeLazyComponent(() => import('@/pages/PlanningPage'), 'PlanningPage'),
  FinancialCenterPage: createSafeLazyComponent(() => import('@/pages/FinancialCenterPage'), 'FinancialCenterPage'),
  UniverseVisualizationPage: createSafeLazyComponent(() => import('@/pages/UniverseVisualizationPage'), 'UniverseVisualizationPage'),
  AchievementsPage: createSafeLazyComponent(() => import('@/pages/AchievementsPage'), 'AchievementsPage'),
  EcosystemPage: createSafeLazyComponent(() => import('@/pages/EcosystemPage'), 'EcosystemPage'),
  ValidationDashboard: createSafeLazyComponent(() => import('@/pages/ValidationDashboard'), 'ValidationDashboard'),
  SecurityDashboard: createSafeLazyComponent(() => import('@/pages/SecurityDashboard'), 'SecurityDashboard')
};

export const useAdvancedBundleOptimizer = (currentPath: string) => {
  const location = useLocation();

  const components = useMemo(() => lazyComponents, []);

  // Preloading optimizado y no agresivo
  const preloadComponents = useMemo(() => {
    const pathMap: { [key: string]: (keyof typeof lazyComponents)[] } = {
      '/': ['LectoGuiaPage'],
      '/lectoguia': ['DiagnosticPage'],
      '/diagnostic': ['PlanningPage'],
      '/planning': ['FinancialCenterPage'],
      '/financial': ['UniverseVisualizationPage'],
      '/universe': ['AchievementsPage'],
      '/achievements': ['EcosystemPage'],
      '/ecosystem': ['ValidationDashboard'],
      '/validation-dashboard': ['SecurityDashboard'],
      '/security-dashboard': ['Index']
    };

    return pathMap[currentPath] || [];
  }, [currentPath]);

  const bundleMetrics = useMemo(() => ({
    totalComponents: Object.keys(lazyComponents).length,
    preloadedComponents: preloadComponents.length,
    currentRoute: currentPath,
    optimization: 'stable' as const
  }), [preloadComponents.length, currentPath]);

  return {
    components,
    preloadComponents,
    bundleMetrics
  };
};
