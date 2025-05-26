
import { useState, useEffect, useCallback, useMemo, useRef } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { useUnifiedContextCache } from '@/providers/UnifiedContextCache';
import { RealNeuralMetrics } from './useRealNeuralMetrics';
import { supabase } from '@/integrations/supabase/client';

interface OptimizedMetricsConfig {
  enableCache: boolean;
  updateInterval: number;
  debounceTime: number;
}

const DEFAULT_METRICS: RealNeuralMetrics = {
  neural_efficiency: 75,
  cognitive_load: 45,
  learning_velocity: 70,
  pattern_recognition: 68,
  adaptive_intelligence: 72,
  creative_synthesis: 65,
  strategic_thinking: 70,
  emotional_intelligence: 75,
  leadership_potential: 60,
  innovation_index: 58,
  universe_exploration_depth: 80,
  paes_simulation_accuracy: 82,
  gamification_engagement: 85,
  achievement_momentum: 88,
  battle_readiness: 70,
  vocational_alignment: 65,
  user_satisfaction: 75,
  adaptive_learning_rate: 70,
  system_coherence: 72,
  prediction_accuracy: 82
};

export const useOptimizedNeuralMetrics = (config: Partial<OptimizedMetricsConfig> = {}) => {
  const { user } = useAuth();
  const cache = useUnifiedContextCache();
  
  const finalConfig = useMemo(() => ({
    enableCache: true,
    updateInterval: 30000, // 30 segundos
    debounceTime: 1000, // 1 segundo
    ...config
  }), [config]);
  
  const [metrics, setMetrics] = useState<RealNeuralMetrics>(DEFAULT_METRICS);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  
  const lastFetchRef = useRef<number>(0);
  const debounceRef = useRef<NodeJS.Timeout>();
  
  // Cache key optimizado
  const cacheKey = useMemo(() => 
    user?.id ? `neural_metrics_${user.id}` : null
  , [user?.id]);
  
  // Función de cálculo optimizada con memoización
  const calculateOptimizedMetrics = useCallback(async () => {
    if (!user?.id || !cacheKey) return DEFAULT_METRICS;
    
    // Verificar cache primero
    if (finalConfig.enableCache) {
      const cached = cache.get<RealNeuralMetrics>(cacheKey);
      if (cached) {
        console.log('📊 Using cached neural metrics');
        return cached;
      }
    }
    
    try {
      // Cargar datos con Promise.allSettled para mejor rendimiento
      const [progressResult, achievementsResult, battlesResult] = await Promise.allSettled([
        supabase.from('user_node_progress').select('status, progress, mastery_level').eq('user_id', user.id).limit(50),
        supabase.from('user_achievements').select('rarity, category, unlocked_at').eq('user_id', user.id).limit(30),
        supabase.from('battle_sessions').select('winner_id, status, created_at').or(`creator_id.eq.${user.id},opponent_id.eq.${user.id}`).limit(20)
      ]);
      
      const progressData = progressResult.status === 'fulfilled' ? progressResult.value.data || [] : [];
      const achievementsData = achievementsResult.status === 'fulfilled' ? achievementsResult.value.data || [] : [];
      const battlesData = battlesResult.status === 'fulfilled' ? battlesResult.value.data || [] : [];
      
      // Cálculos optimizados
      const completedNodes = progressData.filter(p => p.status === 'completed').length;
      const avgProgress = progressData.reduce((sum, p) => sum + (p.progress || 0), 0) / Math.max(progressData.length, 1);
      const avgMastery = progressData.reduce((sum, p) => sum + (p.mastery_level || 0), 0) / Math.max(progressData.length, 1);
      
      const recentAchievements = achievementsData.filter(a => {
        const unlocked = new Date(a.unlocked_at);
        const weekAgo = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000);
        return unlocked > weekAgo;
      });
      
      const battleWins = battlesData.filter(b => b.winner_id === user.id).length;
      const battleRate = battlesData.length > 0 ? battleWins / battlesData.length : 0;
      
      // Métricas calculadas con mejor algoritmo
      const calculatedMetrics: RealNeuralMetrics = {
        neural_efficiency: Math.min(100, Math.max(30, 50 + (avgProgress * 30) + (completedNodes * 2))),
        cognitive_load: Math.min(100, Math.max(20, 70 - (avgMastery * 50))),
        learning_velocity: Math.min(100, Math.max(40, 60 + (recentAchievements.length * 8))),
        pattern_recognition: Math.min(100, Math.max(35, 45 + (avgMastery * 40) + (battleRate * 15))),
        adaptive_intelligence: Math.min(100, Math.max(30, 50 + (avgProgress * 35) + (completedNodes * 1.5))),
        creative_synthesis: Math.min(100, Math.max(25, 40 + (achievementsData.filter(a => a.category === 'creative').length * 12))),
        strategic_thinking: Math.min(100, Math.max(35, 50 + (battleRate * 30) + (completedNodes * 1.8))),
        emotional_intelligence: Math.min(100, Math.max(40, 60 + (achievementsData.filter(a => a.category === 'social').length * 10))),
        leadership_potential: Math.min(100, Math.max(30, 45 + (battlesData.filter(b => b.status === 'completed').length * 5))),
        innovation_index: Math.min(100, Math.max(25, 35 + (achievementsData.filter(a => a.rarity === 'epic' || a.rarity === 'legendary').length * 15))),
        universe_exploration_depth: Math.min(100, Math.max(50, 60 + (avgProgress * 25))),
        paes_simulation_accuracy: Math.min(100, Math.max(60, 70 + (avgMastery * 25))),
        gamification_engagement: Math.min(100, Math.max(60, 75 + (achievementsData.length * 1.5))),
        achievement_momentum: Math.min(100, Math.max(50, 70 + (recentAchievements.length * 12))),
        battle_readiness: Math.min(100, Math.max(40, 55 + (battleRate * 35))),
        vocational_alignment: Math.min(100, Math.max(35, 50 + (avgProgress * 20) + (completedNodes * 2.5))),
        
        // Legacy compatibility
        user_satisfaction: Math.min(100, Math.max(50, 65 + (avgProgress * 20))),
        adaptive_learning_rate: Math.min(100, Math.max(40, 60 + (recentAchievements.length * 8))),
        system_coherence: Math.min(100, Math.max(45, 60 + (avgMastery * 25))),
        prediction_accuracy: Math.min(100, Math.max(60, 70 + (avgMastery * 25)))
      };
      
      // Cache con TTL de 5 minutos
      if (finalConfig.enableCache) {
        cache.set(cacheKey, calculatedMetrics, 300000);
      }
      
      return calculatedMetrics;
      
    } catch (error) {
      console.error('Error calculating optimized neural metrics:', error);
      return DEFAULT_METRICS;
    }
  }, [user?.id, cacheKey, cache, finalConfig.enableCache]);
  
  // Fetch optimizado con debouncing
  const fetchMetrics = useCallback(async () => {
    const now = Date.now();
    
    // Evitar fetches muy frecuentes
    if (now - lastFetchRef.current < finalConfig.debounceTime) {
      return;
    }
    
    setIsLoading(true);
    setError(null);
    
    try {
      const newMetrics = await calculateOptimizedMetrics();
      setMetrics(newMetrics);
      lastFetchRef.current = now;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error calculating metrics');
      setMetrics(DEFAULT_METRICS);
    } finally {
      setIsLoading(false);
    }
  }, [calculateOptimizedMetrics, finalConfig.debounceTime]);
  
  // Auto-refresh optimizado
  useEffect(() => {
    if (!user?.id) {
      setMetrics(DEFAULT_METRICS);
      return;
    }
    
    // Fetch inicial
    fetchMetrics();
    
    // Interval de actualización
    const interval = setInterval(fetchMetrics, finalConfig.updateInterval);
    
    return () => clearInterval(interval);
  }, [user?.id, fetchMetrics, finalConfig.updateInterval]);
  
  // Función para obtener métrica específica
  const getMetricForDimension = useCallback((dimensionId: string): number => {
    return metrics[dimensionId as keyof RealNeuralMetrics] || 0;
  }, [metrics]);
  
  // Invalidar cache manualmente
  const invalidateCache = useCallback(() => {
    if (cacheKey) {
      cache.invalidate(cacheKey);
      fetchMetrics();
    }
  }, [cacheKey, cache, fetchMetrics]);
  
  return {
    metrics,
    isLoading,
    error,
    refetch: fetchMetrics,
    getMetricForDimension,
    invalidateCache,
    cacheStats: cache.getStats()
  };
};
