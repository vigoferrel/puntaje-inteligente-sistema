
/**
 * SISTEMAS DE RENDIMIENTO v2.0
 * Optimización, caching y sistemas adaptativos
 */

// Lazy loading y carga optimizada
export { LazyLoadWrapper, useIntelligentPreloading, resetPreloadManager } from '@/components/performance/LazyLoadWrapper';

// Sistemas de carga por componentes
export { createLazyComponent, ComponentPreloader } from '@/core/performance/LazyComponentLoader';
export { withLazyLoading } from '@/core/performance/LazyLoadingSystem';

// Optimización de bundles
export { 
  ChunkedComponents, 
  RoutePreloadingStrategy, 
  LoadingPriorities,
  useOptimizedComponentLoading 
} from '@/core/performance/BundleOptimizer';

// Storage unificado
export { unifiedStorageSystem } from '@/core/storage/UnifiedStorageSystem';

// Tipos de performance (sin AnalyticsEvent para evitar conflicto)
export type {
  SystemPerformanceMetrics,
  OptimizationConfig,
  CircuitBreakerState,
  StorageMetrics,
  AdaptiveSystemConfig
} from '@/types/performance-systems';
