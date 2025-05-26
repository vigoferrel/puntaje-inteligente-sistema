
import { useState, useEffect, useCallback, useMemo, useRef } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { useUnifiedContextCache } from '@/providers/UnifiedContextCache';
import { useOptimizedRealNeuralMetrics, OptimizedNeuralMetrics } from './useOptimizedRealNeuralMetrics';

// Type alias for backward compatibility
export type RealNeuralMetrics = OptimizedNeuralMetrics;

interface OptimizedMetricsConfig {
  enableCache: boolean;
  updateInterval: number;
  debounceTime: number;
}

export const useOptimizedNeuralMetrics = (config: Partial<OptimizedMetricsConfig> = {}) => {
  const { user } = useAuth();
  const cache = useUnifiedContextCache();
  
  const finalConfig = useMemo(() => ({
    enableCache: true,
    updateInterval: 30000, // 30 segundos
    debounceTime: 1000, // 1 segundo
    ...config
  }), [config]);
  
  // Use the optimized hook directly
  const { 
    metrics, 
    isLoading, 
    error, 
    getMetricForDimension, 
    refetch 
  } = useOptimizedRealNeuralMetrics();
  
  // Cache key optimizado
  const cacheKey = useMemo(() => 
    user?.id ? `neural_metrics_${user.id}` : null
  , [user?.id]);
  
  // Cache metrics when they change
  useEffect(() => {
    if (finalConfig.enableCache && cacheKey && metrics && !isLoading) {
      cache.set(cacheKey, metrics, 300000); // Cache for 5 minutes
    }
  }, [metrics, isLoading, cacheKey, cache, finalConfig.enableCache]);
  
  // Invalidar cache manualmente
  const invalidateCache = useCallback(() => {
    if (cacheKey) {
      cache.invalidate(cacheKey);
      refetch();
    }
  }, [cacheKey, cache, refetch]);
  
  return {
    metrics,
    isLoading,
    error,
    refetch,
    getMetricForDimension,
    invalidateCache,
    cacheStats: cache.getStats()
  };
};
