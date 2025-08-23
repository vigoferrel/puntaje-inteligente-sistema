import React, { Suspense, lazy, useState, useEffect, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Loader2, 
  Zap, 
  Activity, 
  Clock, 
  AlertCircle, 
  CheckCircle,
  TrendingUp,
  Eye,
  Brain,
  Trophy
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';

// Lazy load de componentes pesados con prioridad
const HeavyComponents = {
  // Componentes 3D y visualizaciones pesadas
  Holographic3DDashboard: lazy(() => 
    import('@/components/3d/Holographic3DDashboard').then(module => ({
      default: module.Holographic3DDashboard || module.default
    }))
  ),
  
  // Componentes de IA avanzada
  AIRecommendationDashboard: lazy(() => 
    import('@/components/ai/AIRecommendationDashboard').then(module => ({
      default: module.AIRecommendationDashboard || module.default
    }))
  ),
  
  // Componentes de analytics complejos
  RealTimeAnalyticsDashboard: lazy(() => 
    import('@/components/analytics/RealTimeAnalyticsDashboard').then(module => ({
      default: module.RealTimeAnalyticsDashboard || module.default
    }))
  ),
  
  // Gamificación con animaciones complejas
  GamificationDashboard: lazy(() => 
    import('@/components/gamification/SimpleGamificationDashboard').then(module => ({
      default: module.default
    }))
  ),
  
  // Spotify PAES con media handling
  SpotifyPAESDashboard: lazy(() => 
    import('@/components/spotify/SpotifyPAESDashboard').then(module => ({
      default: module.SpotifyPAESDashboard || module.default
    }))
  ),
  
  // Sistema cinematic avanzado
  CinematicSystemWrapper: lazy(() => 
    import('@/components/cinematic/CinematicSystemWrapper').then(module => ({
      default: module.CinematicSystemWrapper || module.default
    }))
  ),
  
  // Sistema de diagnóstico complejo
  DiagnosticControllerCinematic: lazy(() => 
    import('@/components/diagnostic/DiagnosticControllerCinematic').then(module => ({
      default: module.DiagnosticControllerCinematic || module.default
    }))
  ),
  
  // Centro de inteligencia con visualizaciones
  CinematicIntelligenceCenter: lazy(() => 
    import('@/components/diagnostic/CinematicIntelligenceCenter').then(module => ({
      default: module.CinematicIntelligenceCenter || module.default
    }))
  )
} as const;

type ComponentName = keyof typeof HeavyComponents;

interface ComponentMetrics {
  name: ComponentName;
  loadTime: number;
  memoryUsage: number;
  priority: 'low' | 'medium' | 'high' | 'critical';
  isVisible: boolean;
  shouldPreload: boolean;
  lastUsed: Date;
  errorCount: number;
  successfulLoads: number;
}

interface LoadingState {
  isLoading: boolean;
  progress: number;
  error: string | null;
  startTime: number;
}

interface PerformanceMetrics {
  totalComponents: number;
  loadedComponents: number;
  failedComponents: number;
  averageLoadTime: number;
  memoryUsage: number;
  networkUsage: number;
}

const LoadingSkeletons = {
  Holographic3DDashboard: () => (
    <div className="space-y-4">
      <div className="flex items-center gap-4 mb-6">
        <div className="w-12 h-12 bg-gradient-to-br from-purple-600 to-blue-600 rounded-xl animate-pulse" />
        <div className="space-y-2">
          <div className="h-4 bg-gray-700 rounded w-32 animate-pulse" />
          <div className="h-3 bg-gray-800 rounded w-24 animate-pulse" />
        </div>
      </div>
      <div className="grid grid-cols-3 gap-4 mb-6">
        {[...Array(3)].map((_, i) => (
          <div key={i} className="p-4 bg-gray-800/50 rounded-lg">
            <div className="h-8 bg-gray-700 rounded mb-2 animate-pulse" />
            <div className="h-3 bg-gray-800 rounded w-16 animate-pulse" />
          </div>
        ))}
      </div>
      <div className="h-64 bg-gradient-to-br from-gray-800 to-gray-900 rounded-lg animate-pulse flex items-center justify-center">
        <Eye className="h-16 w-16 text-gray-600 animate-pulse" />
      </div>
    </div>
  ),

  AIRecommendationDashboard: () => (
    <div className="space-y-6">
      <div className="flex items-center gap-3 mb-4">
        <Brain className="h-8 w-8 text-purple-500 animate-pulse" />
        <div className="space-y-1">
          <div className="h-4 bg-gray-700 rounded w-40 animate-pulse" />
          <div className="h-3 bg-gray-800 rounded w-24 animate-pulse" />
        </div>
      </div>
      <div className="grid grid-cols-2 gap-4">
        {[...Array(4)].map((_, i) => (
          <div key={i} className="p-4 bg-gray-800/30 rounded-lg border border-gray-700">
            <div className="h-4 bg-gray-700 rounded mb-3 animate-pulse" />
            <div className="space-y-2">
              <div className="h-3 bg-gray-800 rounded animate-pulse" />
              <div className="h-3 bg-gray-800 rounded w-3/4 animate-pulse" />
            </div>
            <div className="mt-3 flex gap-2">
              <div className="h-6 bg-purple-600/30 rounded px-2 w-16 animate-pulse" />
              <div className="h-6 bg-blue-600/30 rounded px-2 w-12 animate-pulse" />
            </div>
          </div>
        ))}
      </div>
    </div>
  ),

  GamificationDashboard: () => (
    <div className="space-y-6">
      <div className="flex items-center gap-3 mb-4">
        <Trophy className="h-8 w-8 text-yellow-500 animate-pulse" />
        <div className="space-y-1">
          <div className="h-4 bg-gray-700 rounded w-36 animate-pulse" />
          <div className="h-3 bg-gray-800 rounded w-20 animate-pulse" />
        </div>
      </div>
      <div className="grid grid-cols-4 gap-4 mb-6">
        {[...Array(4)].map((_, i) => (
          <div key={i} className="text-center">
            <div className="w-16 h-16 bg-gradient-to-br from-yellow-600 to-orange-600 rounded-full mx-auto mb-2 animate-pulse" />
            <div className="h-3 bg-gray-700 rounded mb-1 animate-pulse" />
            <div className="h-2 bg-gray-800 rounded w-12 mx-auto animate-pulse" />
          </div>
        ))}
      </div>
      <div className="grid grid-cols-3 gap-4">
        {[...Array(6)].map((_, i) => (
          <div key={i} className="p-3 bg-gray-800/30 rounded-lg">
            <div className="h-3 bg-gray-700 rounded mb-2 animate-pulse" />
            <div className="h-2 bg-gray-800 rounded animate-pulse" />
          </div>
        ))}
      </div>
    </div>
  )
};

const DefaultSkeleton = ({ componentName }: { componentName: ComponentName }) => (
  <div className="space-y-4 p-6">
    <div className="flex items-center gap-3 mb-4">
      <div className="w-8 h-8 bg-gradient-to-br from-blue-600 to-purple-600 rounded-lg animate-pulse" />
      <div className="space-y-1">
        <div className="h-4 bg-gray-700 rounded w-32 animate-pulse" />
        <div className="h-3 bg-gray-800 rounded w-20 animate-pulse" />
      </div>
    </div>
    <div className="grid grid-cols-2 gap-4">
      {[...Array(4)].map((_, i) => (
        <div key={i} className="h-24 bg-gray-800/30 rounded-lg animate-pulse" />
      ))}
    </div>
    <div className="text-center text-gray-400 text-sm mt-4">
      Cargando {componentName}...
    </div>
  </div>
);

export const LazyComponentLoader: React.FC<{
  componentName: ComponentName;
  props?: any;
  priority?: 'low' | 'medium' | 'high' | 'critical';
  onLoad?: (metrics: ComponentMetrics) => void;
  onError?: (error: Error, componentName: ComponentName) => void;
}> = ({ 
  componentName, 
  props = {}, 
  priority = 'medium',
  onLoad,
  onError 
}) => {
  const [loadingState, setLoadingState] = useState<LoadingState>({
    isLoading: false,
    progress: 0,
    error: null,
    startTime: Date.now()
  });

  const [metrics, setMetrics] = useState<ComponentMetrics>({
    name: componentName,
    loadTime: 0,
    memoryUsage: 0,
    priority,
    isVisible: false,
    shouldPreload: priority === 'critical' || priority === 'high',
    lastUsed: new Date(),
    errorCount: 0,
    successfulLoads: 0
  });

  const LazyComponent = HeavyComponents[componentName];
  const SkeletonComponent = LoadingSkeletons[componentName] || DefaultSkeleton;

  // Monitoreo de performance
  useEffect(() => {
    if ('performance' in window) {
      const observer = new PerformanceObserver((list) => {
        const entries = list.getEntries();
        entries.forEach((entry) => {
          if (entry.name.includes(componentName)) {
            setMetrics(prev => ({
              ...prev,
              loadTime: entry.duration,
              successfulLoads: prev.successfulLoads + 1
            }));
          }
        });
      });

      observer.observe({ entryTypes: ['navigation', 'resource'] });
      return () => observer.disconnect();
    }
  }, [componentName]);

  // Preload inteligente basado en prioridad
  useEffect(() => {
    if (metrics.shouldPreload) {
      const timer = setTimeout(() => {
        // Preload del componente
        import(`@/components/${componentName.toLowerCase()}/${componentName}`)
          .catch(() => {
            // Silenciar errores de preload
          });
      }, priority === 'critical' ? 0 : priority === 'high' ? 1000 : 3000);

      return () => clearTimeout(timer);
    }
  }, [componentName, priority, metrics.shouldPreload]);

  const EnhancedLoadingFallback = () => (
    <Card className="bg-gray-900/50 border-gray-700/50">
      <CardHeader className="pb-3">
        <CardTitle className="text-white flex items-center gap-2">
          <Loader2 className="h-5 w-5 animate-spin text-blue-400" />
          Cargando {componentName}
          <Badge variant="secondary" className="ml-2">
            {priority.toUpperCase()}
          </Badge>
        </CardTitle>
      </CardHeader>
      <CardContent>
        {/* Skeleton personalizado o genérico */}
        <SkeletonComponent componentName={componentName} />
        
        {/* Indicadores de progreso */}
        <div className="mt-4 space-y-3">
          <div className="flex items-center justify-between text-sm text-gray-400">
            <span>Cargando módulo...</span>
            <span>{Math.round(loadingState.progress)}%</span>
          </div>
          <Progress 
            value={loadingState.progress} 
            className="h-1 bg-gray-800"
          />
          {loadingState.error && (
            <div className="flex items-center gap-2 text-red-400 text-sm">
              <AlertCircle className="h-4 w-4" />
              {loadingState.error}
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );

  const ErrorBoundary = ({ children }: { children: React.ReactNode }) => {
    const [hasError, setHasError] = useState(false);

    useEffect(() => {
      const handleError = (error: ErrorEvent) => {
        if (error.filename?.includes(componentName)) {
          setHasError(true);
          setMetrics(prev => ({
            ...prev,
            errorCount: prev.errorCount + 1
          }));
          onError?.(new Error(error.message), componentName);
        }
      };

      window.addEventListener('error', handleError);
      return () => window.removeEventListener('error', handleError);
    }, []);

    if (hasError) {
      return (
        <Card className="bg-red-900/20 border-red-500/30">
          <CardContent className="p-6 text-center">
            <AlertCircle className="h-12 w-12 text-red-400 mx-auto mb-4" />
            <h3 className="text-white font-medium mb-2">Error al cargar componente</h3>
            <p className="text-red-300 text-sm mb-4">
              No se pudo cargar {componentName}
            </p>
            <button
              onClick={() => {
                setHasError(false);
                window.location.reload();
              }}
              className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg text-sm transition-colors"
            >
              Reintentar
            </button>
          </CardContent>
        </Card>
      );
    }

    return <>{children}</>;
  };

  return (
    <ErrorBoundary>
      <Suspense fallback={<EnhancedLoadingFallback />}>
        <LazyComponent 
          {...props} 
          onComponentMount={() => {
            setMetrics(prev => ({
              ...prev,
              isVisible: true,
              lastUsed: new Date()
            }));
            onLoad?.(metrics);
          }}
        />
      </Suspense>
    </ErrorBoundary>
  );
};

export const PerformanceMonitor: React.FC<{
  components: ComponentMetrics[];
}> = ({ components }) => {
  const [performanceMetrics, setPerformanceMetrics] = useState<PerformanceMetrics>({
    totalComponents: 0,
    loadedComponents: 0,
    failedComponents: 0,
    averageLoadTime: 0,
    memoryUsage: 0,
    networkUsage: 0
  });

  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const metrics: PerformanceMetrics = {
      totalComponents: components.length,
      loadedComponents: components.filter(c => c.successfulLoads > 0).length,
      failedComponents: components.filter(c => c.errorCount > 0).length,
      averageLoadTime: components.reduce((acc, c) => acc + c.loadTime, 0) / components.length || 0,
      memoryUsage: components.reduce((acc, c) => acc + c.memoryUsage, 0),
      networkUsage: 0 // Calculado por el browser
    };

    setPerformanceMetrics(metrics);
  }, [components]);

  if (!isVisible) {
    return (
      <button
        onClick={() => setIsVisible(true)}
        className="fixed bottom-4 right-4 p-2 bg-gray-800 hover:bg-gray-700 text-gray-300 rounded-lg border border-gray-600 transition-colors"
      >
        <Activity className="h-4 w-4" />
      </button>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="fixed bottom-4 right-4 w-80 bg-gray-900 border border-gray-700 rounded-lg shadow-2xl z-50"
    >
      <div className="p-4 border-b border-gray-700">
        <div className="flex items-center justify-between">
          <h3 className="font-semibold text-white flex items-center gap-2">
            <TrendingUp className="h-4 w-4 text-green-400" />
            Performance Monitor
          </h3>
          <button
            onClick={() => setIsVisible(false)}
            className="text-gray-400 hover:text-white"
          >
            ×
          </button>
        </div>
      </div>

      <div className="p-4 space-y-4">
        <div className="grid grid-cols-2 gap-4">
          <div className="text-center">
            <div className="text-2xl font-bold text-green-400">
              {performanceMetrics.loadedComponents}
            </div>
            <div className="text-xs text-gray-400">Componentes Cargados</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-blue-400">
              {performanceMetrics.averageLoadTime.toFixed(0)}ms
            </div>
            <div className="text-xs text-gray-400">Tiempo Promedio</div>
          </div>
        </div>

        <div className="space-y-2">
          <div className="flex justify-between text-sm">
            <span className="text-gray-300">Éxito</span>
            <span className="text-green-400">
              {Math.round((performanceMetrics.loadedComponents / performanceMetrics.totalComponents) * 100)}%
            </span>
          </div>
          <Progress 
            value={(performanceMetrics.loadedComponents / performanceMetrics.totalComponents) * 100}
            className="h-2"
          />
        </div>

        <div className="space-y-1">
          {components.slice(0, 5).map((component) => (
            <div key={component.name} className="flex items-center justify-between text-xs">
              <span className="text-gray-300 truncate">{component.name}</span>
              <div className="flex items-center gap-2">
                {component.successfulLoads > 0 ? (
                  <CheckCircle className="h-3 w-3 text-green-400" />
                ) : component.errorCount > 0 ? (
                  <AlertCircle className="h-3 w-3 text-red-400" />
                ) : (
                  <Clock className="h-3 w-3 text-yellow-400" />
                )}
                <span className="text-gray-400 w-12 text-right">
                  {component.loadTime.toFixed(0)}ms
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </motion.div>
  );
};

export default LazyComponentLoader;
