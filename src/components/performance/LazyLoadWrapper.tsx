
/**
 * LAZY LOAD WRAPPER v3.0 - SINGLETON GLOBAL ANTI-DUPLICACIÓN
 * Sistema único de preloading con control absoluto de duplicación
 */

import React, { Suspense, useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { Brain, Loader2 } from 'lucide-react';

interface LazyLoadWrapperProps {
  children: React.ReactNode;
  fallback?: React.ReactNode;
  preloadDelay?: number;
  priority?: 'high' | 'medium' | 'low';
  moduleName?: string;
}

// SINGLETON GLOBAL - Una sola instancia para toda la app
class GlobalPreloadManager {
  private static instance: GlobalPreloadManager;
  private processedModules = new Set<string>();
  private activePreloads = new Set<string>();
  private preloadQueue: string[] = [];
  private isProcessing = false;

  static getInstance(): GlobalPreloadManager {
    if (!GlobalPreloadManager.instance) {
      GlobalPreloadManager.instance = new GlobalPreloadManager();
    }
    return GlobalPreloadManager.instance;
  }

  private constructor() {
    // Configurar procesamiento con throttling
    this.setupThrottledProcessing();
  }

  private setupThrottledProcessing() {
    setInterval(() => {
      if (!this.isProcessing && this.preloadQueue.length > 0) {
        this.processNextPreload();
      }
    }, 2000); // Procesar cada 2 segundos máximo
  }

  private processNextPreload() {
    if (this.preloadQueue.length === 0) return;
    
    const module = this.preloadQueue.shift()!;
    if (this.processedModules.has(module)) return;

    this.isProcessing = true;
    this.activePreloads.add(module);
    
    console.log(`🚀 Processing preload: ${module}`);
    
    setTimeout(() => {
      this.processedModules.add(module);
      this.activePreloads.delete(module);
      this.isProcessing = false;
    }, 1000);
  }

  shouldPreload(module: string): boolean {
    return !this.processedModules.has(module) && !this.activePreloads.has(module);
  }

  requestPreload(module: string): void {
    if (this.shouldPreload(module) && !this.preloadQueue.includes(module)) {
      this.preloadQueue.push(module);
    }
  }

  getStats() {
    return {
      processed: this.processedModules.size,
      active: this.activePreloads.size,
      queued: this.preloadQueue.length
    };
  }

  reset() {
    this.processedModules.clear();
    this.activePreloads.clear();
    this.preloadQueue = [];
    this.isProcessing = false;
  }
}

const globalPreloadManager = GlobalPreloadManager.getInstance();

const DefaultFallback: React.FC<{ moduleName?: string }> = ({ moduleName }) => (
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
      <p className="text-sm text-gray-400">
        Sistema optimizado sin duplicación...
      </p>
    </motion.div>
  </div>
);

export const LazyLoadWrapper: React.FC<LazyLoadWrapperProps> = ({
  children,
  fallback,
  preloadDelay = 0,
  priority = 'medium',
  moduleName
}) => {
  const [isPreloaded, setIsPreloaded] = useState(false);

  useEffect(() => {
    if (preloadDelay > 0) {
      const timer = setTimeout(() => {
        setIsPreloaded(true);
      }, preloadDelay);

      return () => clearTimeout(timer);
    } else {
      setIsPreloaded(true);
    }
  }, [preloadDelay]);

  if (!isPreloaded && preloadDelay > 0) {
    return fallback || <DefaultFallback moduleName={moduleName} />;
  }

  return (
    <div className={`lazy-wrapper priority-${priority}`}>
      <Suspense fallback={fallback || <DefaultFallback moduleName={moduleName} />}>
        {children}
      </Suspense>
    </div>
  );
};

// Hook COMPLETAMENTE REESCRITO sin duplicación
export const useIntelligentPreloading = (currentRoute: string) => {
  useEffect(() => {
    const preloadMap: Record<string, string[]> = {
      '/': ['lectoguia', 'superpaes'],
      '/lectoguia': ['superpaes', 'dashboard'],
      '/financial': ['dashboard', 'planning'],
    };

    const modulesToPreload = preloadMap[currentRoute] || [];

    if (modulesToPreload.length > 0 && 'requestIdleCallback' in window) {
      requestIdleCallback(() => {
        modulesToPreload.forEach(module => {
          // Usar el singleton global - NO más duplicación
          globalPreloadManager.requestPreload(module);
        });

        // Log de estadísticas
        const stats = globalPreloadManager.getStats();
        console.log('📊 Preload stats:', stats);
      });
    }
  }, [currentRoute]);
};

// Reset function para testing
export const resetPreloadManager = () => {
  globalPreloadManager.reset();
  console.log('🔄 Global preload manager reset');
};
