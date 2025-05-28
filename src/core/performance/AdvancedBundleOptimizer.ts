
import React from 'react';
import { lazy } from 'react';

// Sistema avanzado de code splitting con prioridades dinámicas
export class AdvancedBundleOptimizer {
  private static instance: AdvancedBundleOptimizer;
  private chunkLoadTimes = new Map<string, number>();
  private chunkPriorities = new Map<string, number>();
  private loadingChunks = new Set<string>();

  static getInstance() {
    if (!AdvancedBundleOptimizer.instance) {
      AdvancedBundleOptimizer.instance = new AdvancedBundleOptimizer();
    }
    return AdvancedBundleOptimizer.instance;
  }

  // Componentes lazy con seguimiento de performance
  private createTrackedLazyComponent(importFn: () => Promise<any>, chunkName: string) {
    return lazy(async () => {
      const startTime = performance.now();
      this.loadingChunks.add(chunkName);
      
      try {
        const module = await importFn();
        const loadTime = performance.now() - startTime;
        
        this.chunkLoadTimes.set(chunkName, loadTime);
        this.loadingChunks.delete(chunkName);
        
        console.log(`📦 Chunk cargado: ${chunkName} en ${loadTime.toFixed(2)}ms`);
        
        // Ajustar prioridad basado en tiempo de carga
        this.adjustChunkPriority(chunkName, loadTime);
        
        return module;
      } catch (error) {
        this.loadingChunks.delete(chunkName);
        console.error(`❌ Error cargando chunk ${chunkName}:`, error);
        throw error;
      }
    });
  }

  private adjustChunkPriority(chunkName: string, loadTime: number) {
    // Prioridad basada en tiempo de carga (menor tiempo = mayor prioridad)
    let priority = 5; // prioridad media por defecto
    
    if (loadTime < 100) priority = 10; // muy rápido
    else if (loadTime < 300) priority = 8; // rápido
    else if (loadTime < 600) priority = 6; // normal
    else if (loadTime < 1000) priority = 4; // lento
    else priority = 2; // muy lento
    
    this.chunkPriorities.set(chunkName, priority);
  }

  // Componentes principales con tracking
  readonly OptimizedComponents = {
    // Páginas críticas
    Index: this.createTrackedLazyComponent(
      () => import('@/pages/Index'), 
      'page-index'
    ),
    Auth: this.createTrackedLazyComponent(
      () => import('@/pages/Auth'), 
      'page-auth'
    ),
    
    // Módulos educativos
    LectoGuiaPage: this.createTrackedLazyComponent(
      () => import('@/pages/LectoGuiaPage'), 
      'module-lectoguia'
    ),
    DiagnosticPage: this.createTrackedLazyComponent(
      () => import('@/pages/DiagnosticPage'), 
      'module-diagnostic'
    ),
    PlanningPage: this.createTrackedLazyComponent(
      () => import('@/pages/PlanningPage'), 
      'module-planning'
    ),
    
    // Módulos avanzados
    UniverseVisualizationPage: this.createTrackedLazyComponent(
      () => import('@/pages/UniverseVisualizationPage'), 
      'module-universe'
    ),
    FinancialPage: this.createTrackedLazyComponent(
      () => import('@/pages/FinancialPage'), 
      'module-financial'
    ),
    AchievementsPage: this.createTrackedLazyComponent(
      () => import('@/pages/AchievementsPage'), 
      'module-achievements'
    ),
    EcosystemPage: this.createTrackedLazyComponent(
      () => import('@/pages/EcosystemPage'), 
      'module-ecosystem'
    ),

    // Dashboards de seguridad y validación
    ValidationDashboard: this.createTrackedLazyComponent(
      () => import('@/pages/ValidationDashboard'),
      'page-validation-dashboard'
    ),
    SecurityDashboard: this.createTrackedLazyComponent(
      () => import('@/pages/SecurityDashboard'),
      'page-security-dashboard'
    ),

    // Componentes de dashboard
    SuperPAESUnifiedHub: this.createTrackedLazyComponent(
      () => import('@/components/super-paes/SuperPAESUnifiedHub').then(m => ({ default: m.SuperPAESUnifiedHub })),
      'component-hub'
    ),
    SimplifiedDashboard: this.createTrackedLazyComponent(
      () => import('@/components/dashboard/SimplifiedDashboard').then(m => ({ default: m.SimplifiedDashboard })),
      'component-dashboard'
    ),
    NeuralNavigationOptimized: this.createTrackedLazyComponent(
      () => import('@/components/neural/NeuralNavigationOptimized').then(m => ({ default: m.NeuralNavigationOptimized })),
      'component-navigation'
    )
  };

  // Preloading inteligente basado en prioridades
  async preloadByPriority(routeContext: string) {
    const preloadStrategies = {
      '/': [
        { chunk: 'module-lectoguia', priority: 9 },
        { chunk: 'module-diagnostic', priority: 8 },
        { chunk: 'component-dashboard', priority: 7 }
      ],
      '/lectoguia': [
        { chunk: 'module-diagnostic', priority: 9 },
        { chunk: 'module-planning', priority: 7 },
        { chunk: 'component-navigation', priority: 6 }
      ],
      '/diagnostic': [
        { chunk: 'module-planning', priority: 9 },
        { chunk: 'module-universe', priority: 6 },
        { chunk: 'component-hub', priority: 5 }
      ],
      '/planning': [
        { chunk: 'module-universe', priority: 8 },
        { chunk: 'module-financial', priority: 6 }
      ]
    };

    const strategy = preloadStrategies[routeContext as keyof typeof preloadStrategies] || [];
    
    // Preload solo si no hay muchos chunks cargándose ya
    if (this.loadingChunks.size < 3) {
      for (const { chunk, priority } of strategy) {
        if (!this.chunkLoadTimes.has(chunk) && !this.loadingChunks.has(chunk)) {
          // Usar requestIdleCallback para preloading no bloqueante
          if ('requestIdleCallback' in window) {
            requestIdleCallback(() => {
              console.log(`🚀 Preloading chunk: ${chunk} (prioridad: ${priority})`);
              // El preloading real se hará cuando el componente se use
            }, { timeout: 1000 });
          }
        }
      }
    }
  }

  // Métricas de performance de chunks
  getChunkMetrics() {
    const totalChunks = this.chunkLoadTimes.size;
    const loadTimes = Array.from(this.chunkLoadTimes.values());
    const averageLoadTime = loadTimes.reduce((sum, time) => sum + time, 0) / totalChunks;
    
    return {
      totalChunks,
      averageLoadTime: Math.round(averageLoadTime),
      fastestChunk: Math.min(...loadTimes),
      slowestChunk: Math.max(...loadTimes),
      currentlyLoading: Array.from(this.loadingChunks),
      chunkPriorities: Object.fromEntries(this.chunkPriorities),
      detailedTimes: Object.fromEntries(this.chunkLoadTimes)
    };
  }

  // Optimización automática basada en métricas
  optimizeChunkLoading() {
    const metrics = this.getChunkMetrics();
    
    // Si hay chunks muy lentos, ajustar estrategia
    if (metrics.slowestChunk > 2000) {
      console.warn('⚠️ Chunks lentos detectados, ajustando estrategia de carga');
      
      // Reducir preloading agresivo
      this.chunkPriorities.forEach((priority, chunkName) => {
        if (this.chunkLoadTimes.get(chunkName)! > 1000) {
          this.chunkPriorities.set(chunkName, Math.max(1, priority - 2));
        }
      });
    }

    // Si la memoria está alta, ser más conservador
    const memory = (performance as any).memory;
    if (memory && memory.usedJSHeapSize > memory.jsHeapSizeLimit * 0.8) {
      console.warn('⚠️ Memoria alta, reduciendo preloading');
      return false; // No hacer más preloading
    }

    return true; // OK para preloading
  }

  // Limpiar chunks no utilizados
  cleanupUnusedChunks() {
    const now = Date.now();
    const maxAge = 15 * 60 * 1000; // 15 minutos
    
    this.chunkLoadTimes.forEach((loadTime, chunkName) => {
      if (now - loadTime > maxAge) {
        console.log(`🧹 Limpiando chunk antiguo: ${chunkName}`);
        this.chunkLoadTimes.delete(chunkName);
        this.chunkPriorities.delete(chunkName);
      }
    });
  }
}

// Hook para usar el optimizador
export const useAdvancedBundleOptimizer = (currentRoute: string) => {
  const optimizer = AdvancedBundleOptimizer.getInstance();

  React.useEffect(() => {
    // Preload inteligente basado en ruta
    optimizer.preloadByPriority(currentRoute);
    
    // Optimización automática cada 5 minutos
    const interval = setInterval(() => {
      optimizer.optimizeChunkLoading();
      optimizer.cleanupUnusedChunks();
    }, 5 * 60 * 1000);

    return () => clearInterval(interval);
  }, [currentRoute, optimizer]);

  return {
    components: optimizer.OptimizedComponents,
    metrics: optimizer.getChunkMetrics(),
    cleanup: () => optimizer.cleanupUnusedChunks()
  };
};

export default AdvancedBundleOptimizer;
