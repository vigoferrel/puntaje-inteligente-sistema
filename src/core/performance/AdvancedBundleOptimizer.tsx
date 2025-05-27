
import { lazy, useMemo, ComponentType } from 'react';
import { useLocation } from 'react-router-dom';

// Lazy imports consolidados
const lazyComponents = {
  Index: lazy(() => import('@/pages/Index')),
  Auth: lazy(() => import('@/pages/auth')),
  LectoGuiaPage: lazy(() => import('@/pages/LectoGuiaPage')),
  FinancialPage: lazy(() => import('@/pages/FinancialPage')),
  DiagnosticPage: lazy(() => import('@/pages/DiagnosticPage')),
  PlanningPage: lazy(() => import('@/pages/PlanningPage')),
  UniverseVisualizationPage: lazy(() => import('@/pages/UniverseVisualizationPage')),
  AchievementsPage: lazy(() => import('@/pages/AchievementsPage')),
  EcosystemPage: lazy(() => import('@/pages/EcosystemPage')),
  ValidationDashboard: lazy(() => import('@/pages/ValidationDashboard')),
  SecurityDashboard: lazy(() => import('@/pages/SecurityDashboard'))
};

interface BundleComponents {
  [key: string]: React.LazyExoticComponent<ComponentType<any>>;
}

export const useAdvancedBundleOptimizer = (currentPath: string) => {
  const location = useLocation();

  const components: BundleComponents = useMemo(() => {
    return lazyComponents;
  }, []);

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
