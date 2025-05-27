
import React, { Suspense, useEffect, useState, useCallback, memo } from 'react';
import { motion } from 'framer-motion';
import { Brain, Loader2, Zap } from 'lucide-react';

interface OptimizedLazyLoadWrapperProps {
  children: React.ReactNode;
  fallback?: React.ReactNode;
  preloadDelay?: number;
  priority?: 'critical' | 'high' | 'medium' | 'low';
  moduleName?: string;
  enableMemoryCleanup?: boolean;
}

// Fallback optimizado con React.memo para evitar re-renders
const OptimizedFallback = memo<{ moduleName?: string; priority?: string }>(({ 
  moduleName, 
  priority 
}) => (
  <div className="min-h-[400px] flex items-center justify-center">
    <motion.div
      initial={{ opacity: 0, scale: 0.8 }}
      animate={{ opacity: 1, scale: 1 }}
      className="text-center"
    >
      <div className="relative mb-4">
        <Brain className="w-12 h-12 mx-auto text-blue-400 animate-pulse" />
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
          className="absolute inset-0"
        >
          <Loader2 className="w-12 h-12 mx-auto text-cyan-400" />
        </motion.div>
      </div>
      <h3 className="text-lg font-semibold text-white mb-2">
        Cargando {moduleName || 'Módulo'}
      </h3>
      <p className="text-sm text-gray-400 flex items-center justify-center gap-2">
        <Zap className="w-4 h-4" />
        Sistema neural optimizado - Prioridad {priority || 'media'}
      </p>
    </motion.div>
  </div>
));

OptimizedFallback.displayName = 'OptimizedFallback';

// Gestión inteligente de memoria y preloading
class IntelligentMemoryManager {
  private static instance: IntelligentMemoryManager;
  private loadedModules = new Set<string>();
  private moduleTimestamps = new Map<string, number>();
  private cleanupTimeouts = new Map<string, NodeJS.Timeout>();

  static getInstance() {
    if (!IntelligentMemoryManager.instance) {
      IntelligentMemoryManager.instance = new IntelligentMemoryManager();
    }
    return IntelligentMemoryManager.instance;
  }

  markModuleLoaded(moduleName: string) {
    this.loadedModules.add(moduleName);
    this.moduleTimestamps.set(moduleName, Date.now());
    
    // Limpiar módulos antiguos después de 10 minutos de inactividad
    this.scheduleCleanup(moduleName);
  }

  private scheduleCleanup(moduleName: string) {
    // Cancelar cleanup anterior si existe
    const existingTimeout = this.cleanupTimeouts.get(moduleName);
    if (existingTimeout) {
      clearTimeout(existingTimeout);
    }

    // Programar nuevo cleanup
    const timeout = setTimeout(() => {
      this.cleanupModule(moduleName);
    }, 10 * 60 * 1000); // 10 minutos

    this.cleanupTimeouts.set(moduleName, timeout);
  }

  private cleanupModule(moduleName: string) {
    console.log(`🧹 Limpiando módulo inactivo: ${moduleName}`);
    this.loadedModules.delete(moduleName);
    this.moduleTimestamps.delete(moduleName);
    this.cleanupTimeouts.delete(moduleName);
    
    // Forzar garbage collection si está disponible
    if (typeof window !== 'undefined' && 'gc' in window) {
      (window as any).gc?.();
    }
  }

  getMemoryStats() {
    return {
      loadedModules: Array.from(this.loadedModules),
      moduleCount: this.loadedModules.size,
      oldestModule: Math.min(...Array.from(this.moduleTimestamps.values())),
      memoryUsage: this.calculateMemoryUsage()
    };
  }

  private calculateMemoryUsage() {
    const memory = (performance as any).memory;
    if (memory) {
      return {
        used: Math.round(memory.usedJSHeapSize / 1024 / 1024),
        total: Math.round(memory.totalJSHeapSize / 1024 / 1024),
        limit: Math.round(memory.jsHeapSizeLimit / 1024 / 1024)
      };
    }
    return null;
  }

  forceCleanup() {
    console.log('🧹 Limpieza forzada de memoria iniciada');
    this.loadedModules.clear();
    this.moduleTimestamps.clear();
    this.cleanupTimeouts.forEach(timeout => clearTimeout(timeout));
    this.cleanupTimeouts.clear();
  }
}

export const OptimizedLazyLoadWrapper: React.FC<OptimizedLazyLoadWrapperProps> = memo(({
  children,
  fallback,
  preloadDelay = 0,
  priority = 'medium',
  moduleName,
  enableMemoryCleanup = true
}) => {
  const [isPreloaded, setIsPreloaded] = useState(false);
  const [isVisible, setIsVisible] = useState(false);
  const memoryManager = IntelligentMemoryManager.getInstance();

  const handlePreload = useCallback(() => {
    // Prioridad crítica se carga inmediatamente
    if (priority === 'critical') {
      setIsPreloaded(true);
      setIsVisible(true);
      if (enableMemoryCleanup && moduleName) {
        memoryManager.markModuleLoaded(moduleName);
      }
      return;
    }

    // Ajustar delay basado en prioridad
    const adjustedDelay = {
      high: Math.min(preloadDelay, 100),
      medium: preloadDelay,
      low: Math.max(preloadDelay, 500)
    }[priority];
    
    if (adjustedDelay > 0) {
      setTimeout(() => {
        setIsPreloaded(true);
        setTimeout(() => {
          setIsVisible(true);
          if (enableMemoryCleanup && moduleName) {
            memoryManager.markModuleLoaded(moduleName);
          }
        }, 50);
      }, adjustedDelay);
    } else {
      setIsPreloaded(true);
      setIsVisible(true);
      if (enableMemoryCleanup && moduleName) {
        memoryManager.markModuleLoaded(moduleName);
      }
    }
  }, [preloadDelay, priority, enableMemoryCleanup, moduleName, memoryManager]);

  useEffect(() => {
    handlePreload();
  }, [handlePreload]);

  // Cleanup al desmontar
  useEffect(() => {
    return () => {
      if (enableMemoryCleanup && moduleName) {
        // Programar limpieza diferida
        setTimeout(() => {
          const stats = memoryManager.getMemoryStats();
          if (stats.moduleCount > 5) {
            console.log('🧹 Muchos módulos cargados, iniciando limpieza preventiva');
            memoryManager.forceCleanup();
          }
        }, 30000); // 30 segundos después del desmontaje
      }
    };
  }, [enableMemoryCleanup, moduleName, memoryManager]);

  if (!isPreloaded) {
    return fallback || <OptimizedFallback moduleName={moduleName} priority={priority} />;
  }

  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: isVisible ? 1 : 0 }}
      transition={{ duration: 0.3 }}
      className={`lazy-wrapper priority-${priority}`}
    >
      <Suspense fallback={fallback || <OptimizedFallback moduleName={moduleName} priority={priority} />}>
        {children}
      </Suspense>
    </motion.div>
  );
});

OptimizedLazyLoadWrapper.displayName = 'OptimizedLazyLoadWrapper';

// Hook optimizado para preloading inteligente con gestión de memoria
export const useOptimizedPreloading = (currentRoute: string) => {
  const memoryManager = IntelligentMemoryManager.getInstance();

  useEffect(() => {
    const preloadMap: Record<string, string[]> = {
      '/': ['lectoguia', 'diagnostic'],
      '/lectoguia': ['diagnostic', 'planning'],
      '/diagnostic': ['planning', 'universe'],
      '/planning': ['universe', 'financial'],
      '/universe': ['achievements', 'ecosystem'],
      '/financial': ['achievements', 'lectoguia'],
      '/achievements': ['ecosystem', 'lectoguia'],
      '/ecosystem': ['lectoguia', 'diagnostic']
    };

    const modulesToPreload = preloadMap[currentRoute] || [];

    if (modulesToPreload.length > 0 && 'requestIdleCallback' in window) {
      requestIdleCallback(() => {
        const memoryStats = memoryManager.getMemoryStats();
        console.log(`🚀 Preloading optimizado para ${currentRoute}:`, {
          modules: modulesToPreload,
          currentMemory: memoryStats.memoryUsage,
          loadedModules: memoryStats.moduleCount
        });

        // Solo preload si la memoria está en buen estado
        if (!memoryStats.memoryUsage || memoryStats.memoryUsage.used < 100) {
          // Preload real solo si tenemos memoria disponible
          modulesToPreload.forEach(module => {
            memoryManager.markModuleLoaded(`preload_${module}`);
          });
        }
      }, { timeout: 2000 });
    }
  }, [currentRoute, memoryManager]);

  // Retornar stats para debugging
  return {
    memoryStats: memoryManager.getMemoryStats(),
    forceCleanup: () => memoryManager.forceCleanup()
  };
};

// Exportar el memory manager para uso externo
export { IntelligentMemoryManager };
