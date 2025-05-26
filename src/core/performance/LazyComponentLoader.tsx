
import React, { Suspense, lazy, ComponentType } from 'react';
import { motion } from 'framer-motion';
import { CinematicSkeletonOptimized } from '@/components/unified-dashboard/CinematicSkeletonOptimized';

interface LazyLoadConfig {
  fallbackMessage?: string;
  componentName: string;
  priority?: 'critical' | 'high' | 'medium' | 'low';
  preloadDelay?: number;
}

// Sistema de fallbacks inteligentes
const IntelligentFallback: React.FC<{ config: LazyLoadConfig }> = ({ config }) => (
  <motion.div
    initial={{ opacity: 0, scale: 0.98 }}
    animate={{ opacity: 1, scale: 1 }}
    transition={{ duration: 0.2 }}
    className="min-h-96"
  >
    <CinematicSkeletonOptimized
      message={config.fallbackMessage || `Cargando ${config.componentName}...`}
      progress={config.priority === 'critical' ? 95 : 85}
      variant="component"
    />
  </motion.div>
);

// HOC para lazy loading con configuración avanzada
export const createLazyComponent = <T extends ComponentType<any>>(
  importFn: () => Promise<{ default: T }>,
  config: LazyLoadConfig
) => {
  const LazyComponent = lazy(importFn);
  
  const WrappedComponent = (props: React.ComponentProps<T>) => {
    return (
      <Suspense fallback={<IntelligentFallback config={config} />}>
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
        >
          <LazyComponent {...props} />
        </motion.div>
      </Suspense>
    );
  };
  
  WrappedComponent.displayName = `Lazy(${config.componentName})`;
  return WrappedComponent;
};

// Preloader inteligente
class ComponentPreloader {
  private static cache = new Map<string, Promise<any>>();
  private static priorities = new Map<string, number>();
  
  static preload(
    key: string, 
    importFn: () => Promise<any>, 
    priority: number = 1
  ) {
    if (!this.cache.has(key)) {
      this.cache.set(key, importFn());
      this.priorities.set(key, priority);
      console.log(`🚀 Preloading component: ${key} (priority: ${priority})`);
    }
    return this.cache.get(key);
  }
  
  static getStats() {
    return {
      cached: this.cache.size,
      priorities: Array.from(this.priorities.entries())
    };
  }
}

export { ComponentPreloader };
