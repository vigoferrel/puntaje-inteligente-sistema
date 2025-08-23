
import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { intelligentCache } from './IntelligentCacheSystem';

interface CacheMetrics {
  hitRate: number;
  size: number;
  requests: number;
  savings: number;
  performance: 'excellent' | 'good' | 'poor';
}

interface OptimizedCacheContextType {
  metrics: CacheMetrics;
  clearCache: () => void;
  getCachedData: <T>(key: string) => T | null;
  setCachedData: <T>(key: string, data: T, ttl?: number, priority?: 'low' | 'medium' | 'high') => void;
  preloadData: (keys: string[], fetchers: (() => Promise<any>)[]) => Promise<void>;
}

const OptimizedCacheContext = createContext<OptimizedCacheContextType | undefined>(undefined);

export const OptimizedCacheProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [metrics, setMetrics] = useState<CacheMetrics>({
    hitRate: 0,
    size: 0,
    requests: 0,
    savings: 0,
    performance: 'excellent'
  });

  // Actualizar métricas cada 5 segundos
  useEffect(() => {
    const updateMetrics = () => {
      const stats = intelligentCache.getCacheStats();
      const totalRequests = stats.entries.reduce((sum, entry) => sum + entry.accessCount, 0);
      const hitRate = totalRequests > 0 ? (stats.size / totalRequests) * 100 : 0;
      
      setMetrics({
        hitRate: Math.round(hitRate),
        size: stats.size,
        requests: totalRequests,
        savings: totalRequests * 0.02, // Estimación de ahorro
        performance: hitRate > 70 ? 'excellent' : hitRate > 40 ? 'good' : 'poor'
      });
    };

    updateMetrics();
    const interval = setInterval(updateMetrics, 5000);
    return () => clearInterval(interval);
  }, []);

  const clearCache = useCallback(() => {
    intelligentCache.clear();
    setMetrics({
      hitRate: 0,
      size: 0,
      requests: 0,
      savings: 0,
      performance: 'excellent'
    });
  }, []);

  const getCachedData = useCallback(<T,>(key: string): T | null => {
    return intelligentCache.get<T>(key);
  }, []);

  const setCachedData = useCallback(<T,>(
    key: string, 
    data: T, 
    ttl: number = 3600000, 
    priority: 'low' | 'medium' | 'high' = 'medium'
  ) => {
    intelligentCache.set(key, data, ttl, priority);
  }, []);

  const preloadData = useCallback(async (keys: string[], fetchers: (() => Promise<any>)[]) => {
    const promises = keys.map(async (key, index) => {
      const cached = intelligentCache.get(key);
      if (!cached && fetchers[index]) {
        try {
          const data = await fetchers[index]();
          intelligentCache.set(key, data, 3600000, 'high');
          return data;
        } catch (error) {
          console.warn(`Failed to preload ${key}:`, error);
          return null;
        }
      }
      return cached;
    });

    await Promise.allSettled(promises);
  }, []);

  const value: OptimizedCacheContextType = {
    metrics,
    clearCache,
    getCachedData,
    setCachedData,
    preloadData
  };

  return (
    <OptimizedCacheContext.Provider value={value}>
      {children}
    </OptimizedCacheContext.Provider>
  );
};

export const useOptimizedCache = () => {
  const context = useContext(OptimizedCacheContext);
  if (!context) {
    throw new Error('useOptimizedCache must be used within OptimizedCacheProvider');
  }
  return context;
};

// Hook especializado para datos de LectoGuía
export const useLectoGuiaCache = () => {
  const { getCachedData, setCachedData } = useOptimizedCache();

  const getCachedExercise = useCallback((subject: string, skill: string) => {
    return getCachedData(`exercise_${subject}_${skill}`);
  }, [getCachedData]);

  const setCachedExercise = useCallback((subject: string, skill: string, exercise: any) => {
    setCachedData(`exercise_${subject}_${skill}`, exercise, 1800000, 'high'); // 30 min
  }, [setCachedData]);

  const getCachedResponse = useCallback((query: string, subject: string) => {
    return getCachedData(`response_${subject}_${query.substring(0, 50)}`);
  }, [getCachedData]);

  const setCachedResponse = useCallback((query: string, subject: string, response: string) => {
    setCachedData(`response_${subject}_${query.substring(0, 50)}`, response, 3600000, 'medium'); // 1 hour
  }, [setCachedData]);

  return {
    getCachedExercise,
    setCachedExercise,
    getCachedResponse,
    setCachedResponse
  };
};

// Componente de monitoreo de performance
export const CachePerformanceMonitor: React.FC = () => {
  const { metrics } = useOptimizedCache();

  return (
    <div className="fixed bottom-4 right-4 bg-black/80 backdrop-blur-xl border border-cyan-500/30 rounded-lg p-4 text-sm z-50">
      <div className="text-cyan-400 font-medium mb-2">Cache Performance</div>
      <div className="space-y-1 text-xs">
        <div className="flex justify-between">
          <span className="text-gray-400">Hit Rate:</span>
          <span className={`${metrics.hitRate > 70 ? 'text-green-400' : metrics.hitRate > 40 ? 'text-yellow-400' : 'text-red-400'}`}>
            {metrics.hitRate}%
          </span>
        </div>
        <div className="flex justify-between">
          <span className="text-gray-400">Entries:</span>
          <span className="text-white">{metrics.size}</span>
        </div>
        <div className="flex justify-between">
          <span className="text-gray-400">Savings:</span>
          <span className="text-green-400">${metrics.savings.toFixed(2)}</span>
        </div>
        <div className="flex justify-between">
          <span className="text-gray-400">Status:</span>
          <span className={`${
            metrics.performance === 'excellent' ? 'text-green-400' : 
            metrics.performance === 'good' ? 'text-yellow-400' : 'text-red-400'
          }`}>
            {metrics.performance}
          </span>
        </div>
      </div>
    </div>
  );
};
