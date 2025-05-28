
import { lazy, useMemo, ComponentType } from 'react';
import { useLocation } from 'react-router-dom';

// Lazy imports consolidados con manejo de errores robusto
const createSafeLazyComponent = (importFn: () => Promise<any>, componentName: string) => {
  return lazy(async () => {
    try {
      const module = await importFn();
      console.log(`✅ Componente cargado exitosamente: ${componentName}`);
      return module;
    } catch (error) {
      console.error(`❌ Error cargando componente ${componentName}:`, error);
      // Retornar un componente de fallback
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

// Componentes lazy consolidados con todos los componentes necesarios
const lazyComponents = {
  // Páginas principales
  Index: createSafeLazyComponent(() => import('@/pages/Index'), 'Index'),
  Auth: createSafeLazyComponent(() => import('@/pages/auth'), 'Auth'),
  
  // Módulos educativos
  LectoGuiaPage: createSafeLazyComponent(() => import('@/pages/LectoGuiaPage'), 'LectoGuiaPage'),
  DiagnosticPage: createSafeLazyComponent(() => import('@/pages/DiagnosticPage'), 'DiagnosticPage'),
  PlanningPage: createSafeLazyComponent(() => import('@/pages/PlanningPage'), 'PlanningPage'),
  
  // Módulos especializados
  FinancialPage: createSafeLazyComponent(() => import('@/pages/FinancialPage'), 'FinancialPage'),
  UniverseVisualizationPage: createSafeLazyComponent(() => import('@/pages/UniverseVisualizationPage'), 'UniverseVisualizationPage'),
  AchievementsPage: createSafeLazyComponent(() => import('@/pages/AchievementsPage'), 'AchievementsPage'),
  EcosystemPage: createSafeLazyComponent(() => import('@/pages/EcosystemPage'), 'EcosystemPage'),
  
  // Dashboards de seguridad y validación
  ValidationDashboard: createSafeLazyComponent(() => import('@/pages/ValidationDashboard'), 'ValidationDashboard'),
  SecurityDashboard: createSafeLazyComponent(() => import('@/pages/SecurityDashboard'), 'SecurityDashboard')
};

export const useAdvancedBundleOptimizer = (currentPath: string) => {
  const location = useLocation();

  // Retornar directamente los componentes lazy para uso inmediato en JSX
  const components = useMemo(() => lazyComponents, []);

  const preloadComponents = useMemo(() => {
    const pathMap: { [key: string]: (keyof typeof lazyComponents)[] } = {
      '/': ['Index', 'LectoGuiaPage', 'DiagnosticPage'],
      '/auth': ['Auth'],
      '/lectoguia': ['LectoGuiaPage', 'DiagnosticPage'],
      '/financial': ['FinancialPage'],
      '/diagnostic': ['DiagnosticPage', 'PlanningPage'],
      '/planning': ['PlanningPage', 'DiagnosticPage'],
      '/universe': ['UniverseVisualizationPage'],
      '/achievements': ['AchievementsPage'],
      '/ecosystem': ['EcosystemPage'],
      '/validation-dashboard': ['ValidationDashboard'],
      '/security-dashboard': ['SecurityDashboard']
    };

    return pathMap[currentPath] || [];
  }, [currentPath]);

  const bundleMetrics = useMemo(() => ({
    totalComponents: Object.keys(lazyComponents).length,
    preloadedComponents: preloadComponents.length,
    currentRoute: currentPath,
    optimization: 'active'
  }), [preloadComponents.length, currentPath]);

  return {
    components,
    preloadComponents,
    bundleMetrics
  };
};
