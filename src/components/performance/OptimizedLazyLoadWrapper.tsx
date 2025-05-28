
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
        Sistema optimizado - Prioridad {priority || 'media'}
      </p>
    </motion.div>
  </div>
));

OptimizedFallback.displayName = 'OptimizedFallback';

// Sistema de memoria simplificado
class OptimizedMemoryManager {
  private static instance: OptimizedMemoryManager;
  private loadedModules = new Set<string>();

  static getInstance() {
    if (!OptimizedMemoryManager.instance) {
      OptimizedMemoryManager.instance = new OptimizedMemoryManager();
    }
    return OptimizedMemoryManager.instance;
  }

  markModuleLoaded(moduleName: string) {
    this.loadedModules.add(moduleName);
    if (process.env.NODE_ENV === 'development') {
      console.log(`📦 Módulo cargado: ${moduleName}`);
    }
  }

  getLoadedCount() {
    return this.loadedModules.size;
  }

  cleanup() {
    this.loadedModules.clear();
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
  const memoryManager = OptimizedMemoryManager.getInstance();

  const handlePreload = useCallback(() => {
    if (priority === 'critical') {
      setIsPreloaded(true);
      setIsVisible(true);
      if (enableMemoryCleanup && moduleName) {
        memoryManager.markModuleLoaded(moduleName);
      }
      return;
    }

    const adjustedDelay = {
      high: Math.min(preloadDelay, 200),
      medium: preloadDelay || 500,
      low: Math.max(preloadDelay, 1000)
    }[priority];
    
    setTimeout(() => {
      setIsPreloaded(true);
      setTimeout(() => {
        setIsVisible(true);
        if (enableMemoryCleanup && moduleName) {
          memoryManager.markModuleLoaded(moduleName);
        }
      }, 100);
    }, adjustedDelay);
  }, [preloadDelay, priority, enableMemoryCleanup, moduleName, memoryManager]);

  useEffect(() => {
    handlePreload();
  }, [handlePreload]);

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

// Hook de preloading optimizado y menos agresivo
export const useOptimizedPreloading = (currentRoute: string) => {
  const memoryManager = OptimizedMemoryManager.getInstance();

  useEffect(() => {
    // Solo preload en rutas específicas y con delay más alto
    const preloadMap: Record<string, string[]> = {
      '/': ['lectoguia'],
      '/lectoguia': ['diagnostic'],
      '/diagnostic': ['planning'],
      '/planning': ['financial']
    };

    const modulesToPreload = preloadMap[currentRoute] || [];

    if (modulesToPreload.length > 0 && 'requestIdleCallback' in window) {
      requestIdleCallback(() => {
        const loadedCount = memoryManager.getLoadedCount();
        
        // Solo preload si no hay muchos módulos cargados
        if (loadedCount < 3) {
          if (process.env.NODE_ENV === 'development') {
            console.log(`🚀 Preloading para ${currentRoute}:`, modulesToPreload);
          }
        }
      }, { timeout: 5000 });
    }
  }, [currentRoute, memoryManager]);

  return {
    loadedModules: memoryManager.getLoadedCount(),
    cleanup: () => memoryManager.cleanup()
  };
};

export { OptimizedMemoryManager };
