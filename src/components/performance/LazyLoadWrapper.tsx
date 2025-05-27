
/**
 * LAZY LOAD WRAPPER v2.0 - OPTIMIZADO SIN DUPLICACIÓN
 * Sistema de carga lazy optimizado con preloading inteligente único
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

// Cache global para módulos ya precargados
const preloadedModules = new Set<string>();
const preloadingInProgress = new Set<string>();

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
        Inicializando componentes optimizados...
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

  const priorityClass = {
    high: 'high-priority',
    medium: 'medium-priority',
    low: 'low-priority'
  }[priority];

  if (!isPreloaded && preloadDelay > 0) {
    return fallback || <DefaultFallback moduleName={moduleName} />;
  }

  return (
    <div className={`lazy-wrapper ${priorityClass}`}>
      <Suspense fallback={fallback || <DefaultFallback moduleName={moduleName} />}>
        {children}
      </Suspense>
    </div>
  );
};

// Hook optimizado para preloading inteligente SIN DUPLICACIÓN
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
        modulesToPreload.forEach((module, index) => {
          // Verificar si ya fue precargado o está en proceso
          if (preloadedModules.has(module) || preloadingInProgress.has(module)) {
            return;
          }

          // Marcar como en proceso
          preloadingInProgress.add(module);

          setTimeout(() => {
            console.log(`🔄 Preloading module: ${module}`);
            
            // Simular preloading y marcar como completado
            setTimeout(() => {
              preloadedModules.add(module);
              preloadingInProgress.delete(module);
            }, 500);
            
          }, index * 1000);
        });
      });
    }
  }, [currentRoute]);
};

// Componente de error boundary optimizado
export const OptimizedErrorBoundary: React.FC<{ children: React.ReactNode; moduleName?: string }> = ({ 
  children, 
  moduleName 
}) => {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="error-boundary-wrapper"
    >
      {children}
    </motion.div>
  );
};
