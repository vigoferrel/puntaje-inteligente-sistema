import { useCallback, useEffect, useRef, useMemo } from 'react';

interface MemoryOptimizationConfig {
  enableAutoCleanup: boolean;
  maxRenderCount: number;
  cleanupInterval: number;
  enableProfiling: boolean;
}

interface ComponentMemoryMetrics {
  renderCount: number;
  averageRenderTime: number;
  lastRenderTime: number;
  memoryLeaks: number;
  optimizationLevel: 'low' | 'medium' | 'high' | 'critical';
}

// Gestor global de memoria para componentes React
class ReactMemoryManager {
  private static instance: ReactMemoryManager;
  private componentMetrics = new Map<string, ComponentMemoryMetrics>();
  private renderTimings = new Map<string, number[]>();
  private memorySnapshots = new Map<string, number>();
  private cleanupCallbacks = new Map<string, (() => void)[]>();

  static getInstance() {
    if (!ReactMemoryManager.instance) {
      ReactMemoryManager.instance = new ReactMemoryManager();
    }
    return ReactMemoryManager.instance;
  }

  registerComponent(
    componentName: string, 
    cleanupCallback?: () => void,
    config: Partial<MemoryOptimizationConfig> = {}
  ) {
    const defaultConfig: MemoryOptimizationConfig = {
      enableAutoCleanup: true,
      maxRenderCount: 100,
      cleanupInterval: 300000, // 5 minutos
      enableProfiling: true,
      ...config
    };

    // Inicializar métricas del componente
    if (!this.componentMetrics.has(componentName)) {
      this.componentMetrics.set(componentName, {
        renderCount: 0,
        averageRenderTime: 0,
        lastRenderTime: Date.now(),
        memoryLeaks: 0,
        optimizationLevel: 'medium'
      });
      this.renderTimings.set(componentName, []);
    }

    // Registrar callback de limpieza
    if (cleanupCallback) {
      const existingCallbacks = this.cleanupCallbacks.get(componentName) || [];
      this.cleanupCallbacks.set(componentName, [...existingCallbacks, cleanupCallback]);
    }

    // Auto-limpieza si está habilitada
    if (defaultConfig.enableAutoCleanup) {
      setTimeout(() => {
        this.performComponentCleanup(componentName);
      }, defaultConfig.cleanupInterval);
    }

    return componentName;
  }

  recordRender(componentName: string, renderTime: number) {
    const metrics = this.componentMetrics.get(componentName);
    if (!metrics) return;

    // Actualizar métricas
    metrics.renderCount++;
    metrics.lastRenderTime = Date.now();

    // Mantener histórico de tiempos de render
    const timings = this.renderTimings.get(componentName) || [];
    timings.push(renderTime);
    
    // Mantener solo los últimos 50 renders para evitar memory leaks
    if (timings.length > 50) {
      timings.splice(0, timings.length - 50);
    }
    
    this.renderTimings.set(componentName, timings);

    // Calcular promedio
    metrics.averageRenderTime = timings.reduce((sum, time) => sum + time, 0) / timings.length;

    // Determinar nivel de optimización necesario
    metrics.optimizationLevel = this.calculateOptimizationLevel(metrics, timings);

    // Detectar posibles memory leaks
    this.detectMemoryLeaks(componentName, metrics);

    this.componentMetrics.set(componentName, metrics);
  }

  private calculateOptimizationLevel(
    metrics: ComponentMemoryMetrics, 
    timings: number[]
  ): 'low' | 'medium' | 'high' | 'critical' {
    const recentTimings = timings.slice(-10); // Últimos 10 renders
    const avgRecent = recentTimings.reduce((sum, time) => sum + time, 0) / recentTimings.length;

    if (avgRecent > 50 || metrics.renderCount > 200) return 'critical';
    if (avgRecent > 30 || metrics.renderCount > 100) return 'high';
    if (avgRecent > 16 || metrics.renderCount > 50) return 'medium';
    return 'low';
  }

  private detectMemoryLeaks(componentName: string, metrics: ComponentMemoryMetrics) {
    const memory = (performance as any).memory;
    if (!memory) return;

    const currentMemory = memory.usedJSHeapSize;
    const lastSnapshot = this.memorySnapshots.get(componentName);
    
    if (lastSnapshot) {
      const memoryGrowth = currentMemory - lastSnapshot;
      
      // Si la memoria crece más de 5MB entre renders, posible leak
      if (memoryGrowth > 5 * 1024 * 1024) {
        metrics.memoryLeaks++;
        console.warn(`🚨 Posible memory leak en ${componentName}: +${Math.round(memoryGrowth / 1024 / 1024)}MB`);
      }
    }

    this.memorySnapshots.set(componentName, currentMemory);
  }

  performComponentCleanup(componentName: string) {
    console.log(`🧹 Limpieza de memoria para componente: ${componentName}`);

    // Ejecutar callbacks de limpieza
    const callbacks = this.cleanupCallbacks.get(componentName) || [];
    callbacks.forEach(callback => {
      try {
        callback();
      } catch (error) {
        console.error(`Error en cleanup de ${componentName}:`, error);
      }
    });

    // Limpiar datos antiguos
    const timings = this.renderTimings.get(componentName);
    if (timings && timings.length > 20) {
      timings.splice(0, timings.length - 20);
      this.renderTimings.set(componentName, timings);
    }

    // Reset métricas si hay demasiados renders
    const metrics = this.componentMetrics.get(componentName);
    if (metrics && metrics.renderCount > 500) {
      metrics.renderCount = 0;
      metrics.memoryLeaks = 0;
      this.componentMetrics.set(componentName, metrics);
    }
  }

  getComponentMetrics(componentName: string): ComponentMemoryMetrics | undefined {
    return this.componentMetrics.get(componentName);
  }

  getAllMetrics() {
    return {
      components: Object.fromEntries(this.componentMetrics),
      totalComponents: this.componentMetrics.size,
      criticalComponents: Array.from(this.componentMetrics.entries())
        .filter(([, metrics]) => metrics.optimizationLevel === 'critical')
        .map(([name]) => name),
      memoryUsage: this.getTotalMemoryUsage()
    };
  }

  getTotalMemoryUsage() {
    const memory = (performance as any).memory;
    if (memory) {
      return {
        used: Math.round(memory.usedJSHeapSize / 1024 / 1024),
        total: Math.round(memory.totalJSHeapSize / 1024 / 1024),
        limit: Math.round(memory.jsHeapSizeLimit / 1024 / 1024),
        percentage: Math.round((memory.usedJSHeapSize / memory.jsHeapSizeLimit) * 100)
      };
    }
    return null;
  }

  forceGlobalCleanup() {
    console.log('🧹 Limpieza global de memoria iniciada');
    
    this.componentMetrics.forEach((_, componentName) => {
      this.performComponentCleanup(componentName);
    });

    // Forzar garbage collection si está disponible
    if (typeof window !== 'undefined' && 'gc' in window) {
      (window as any).gc?.();
    }
  }
}

// Hook principal para optimización de memoria
export const useMemoryOptimization = (
  componentName: string,
  config: Partial<MemoryOptimizationConfig> = {}
) => {
  const memoryManager = ReactMemoryManager.getInstance();
  const renderStartTime = useRef<number>(0);
  const cleanupCallbacks = useRef<(() => void)[]>([]);

  // Registrar componente al montar
  useEffect(() => {
    const cleanup = () => {
      cleanupCallbacks.current.forEach(callback => callback());
      cleanupCallbacks.current = [];
    };

    memoryManager.registerComponent(componentName, cleanup, config);

    return cleanup;
  }, [componentName, memoryManager]);

  // Medir tiempo de render
  useEffect(() => {
    if (renderStartTime.current > 0) {
      const renderTime = performance.now() - renderStartTime.current;
      memoryManager.recordRender(componentName, renderTime);
    }
    renderStartTime.current = performance.now();
  });

  // Callback optimizado que previene re-renders innecesarios
  const optimizedCallback = useCallback((fn: Function) => {
    return useCallback(fn, []);
  }, []);

  // Memo optimizado con limpieza automática
  const optimizedMemo = useCallback((factory: () => any, deps: any[]) => {
    return useMemo(() => {
      const result = factory();
      
      // Registrar callback de limpieza si el resultado tiene cleanup
      if (typeof result === 'object' && result?.cleanup) {
        cleanupCallbacks.current.push(result.cleanup);
      }
      
      return result;
    }, deps);
  }, []);

  // Registrar callback de limpieza personalizado
  const addCleanupCallback = useCallback((callback: () => void) => {
    cleanupCallbacks.current.push(callback);
  }, []);

  // Métricas del componente actual
  const componentMetrics = memoryManager.getComponentMetrics(componentName);

  return {
    optimizedCallback,
    optimizedMemo,
    addCleanupCallback,
    componentMetrics,
    isOptimizationNeeded: componentMetrics?.optimizationLevel === 'critical' || componentMetrics?.optimizationLevel === 'high',
    memoryUsage: memoryManager.getTotalMemoryUsage(),
    forceCleanup: () => memoryManager.performComponentCleanup(componentName)
  };
};

// Hook para monitoreo global de memoria
export const useGlobalMemoryMonitor = () => {
  const memoryManager = ReactMemoryManager.getInstance();

  useEffect(() => {
    // Monitoreo cada 30 segundos
    const interval = setInterval(() => {
      const metrics = memoryManager.getAllMetrics();
      
      // Alertar si hay componentes críticos
      if (metrics.criticalComponents.length > 0) {
        console.warn('🚨 Componentes con optimización crítica necesaria:', metrics.criticalComponents);
      }

      // Alertar si la memoria está alta
      if (metrics.memoryUsage && metrics.memoryUsage.percentage > 85) {
        console.warn('🚨 Memoria alta detectada:', metrics.memoryUsage);
        memoryManager.forceGlobalCleanup();
      }
    }, 30000);

    return () => clearInterval(interval);
  }, [memoryManager]);

  return {
    getAllMetrics: () => memoryManager.getAllMetrics(),
    forceGlobalCleanup: () => memoryManager.forceGlobalCleanup()
  };
};

export { ReactMemoryManager };
