
import React, { Suspense, useEffect, useState, useCallback } from 'react';
import { motion } from 'framer-motion';
import { Brain, Loader2 } from 'lucide-react';

interface OptimizedLazyLoadWrapperProps {
  children: React.ReactNode;
  fallback?: React.ReactNode;
  preloadDelay?: number;
  priority?: 'critical' | 'high' | 'medium' | 'low';
  moduleName?: string;
}

const OptimizedFallback: React.FC<{ moduleName?: string; priority?: string }> = ({ 
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
      <p className="text-sm text-gray-400">
        Sistema neural optimizado - Prioridad {priority || 'media'}
      </p>
    </motion.div>
  </div>
);

export const OptimizedLazyLoadWrapper: React.FC<OptimizedLazyLoadWrapperProps> = ({
  children,
  fallback,
  preloadDelay = 0,
  priority = 'medium',
  moduleName
}) => {
  const [isPreloaded, setIsPreloaded] = useState(false);
  const [isVisible, setIsVisible] = useState(false);

  const handlePreload = useCallback(() => {
    if (priority === 'critical') {
      setIsPreloaded(true);
      setIsVisible(true);
      return;
    }

    const delay = priority === 'high' ? Math.min(preloadDelay, 100) : preloadDelay;
    
    if (delay > 0) {
      setTimeout(() => {
        setIsPreloaded(true);
        setTimeout(() => setIsVisible(true), 50);
      }, delay);
    } else {
      setIsPreloaded(true);
      setIsVisible(true);
    }
  }, [preloadDelay, priority]);

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
};

// Hook optimizado para preloading inteligente
export const useOptimizedPreloading = (currentRoute: string) => {
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
        console.log(`🚀 Preloading optimizado para ${currentRoute}:`, modulesToPreload);
        // Solo log, sin preload real para evitar overhead
      }, { timeout: 2000 });
    }
  }, [currentRoute]);
};
