
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
        Sistema neural optimizado...
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

// Hook simplificado sin singleton problemático
export const useIntelligentPreloading = (currentRoute: string) => {
  useEffect(() => {
    const preloadMap: Record<string, string[]> = {
      '/': ['lectoguia', 'diagnostic'],
      '/lectoguia': ['diagnostic', 'planning'],
      '/diagnostic': ['planning', 'universe'],
      '/planning': ['universe', 'financial'],
      '/universe': ['financial', 'achievements'],
      '/financial': ['achievements', 'ecosystem'],
      '/achievements': ['ecosystem', 'lectoguia'],
      '/ecosystem': ['lectoguia', 'diagnostic']
    };

    const modulesToPreload = preloadMap[currentRoute] || [];

    if (modulesToPreload.length > 0 && 'requestIdleCallback' in window) {
      requestIdleCallback(() => {
        console.log(`🚀 Preloading modules for ${currentRoute}:`, modulesToPreload);
      });
    }
  }, [currentRoute]);
};
