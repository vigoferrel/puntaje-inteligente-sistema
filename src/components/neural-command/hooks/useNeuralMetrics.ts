
import { useMemo } from 'react';
import { useOptimizedRealNeuralMetrics } from '@/hooks/useOptimizedRealNeuralMetrics';

// Legacy interface para compatibilidad
interface NeuralMetrics {
  neural_efficiency: number;
  adaptive_learning_rate: number;
  system_coherence: number;
  user_satisfaction: number;
  paes_simulation_accuracy: number;
  universe_exploration_depth: number;
  prediction_accuracy: number;
  gamification_engagement: number;
}

export const useNeuralMetrics = () => {
  const { metrics, isLoading, error, getMetricForDimension, refetch } = useOptimizedRealNeuralMetrics();

  // Legacy compatibility wrapper
  const systemVitals = useMemo(() => ({
    cardiovascular: {
      oxygenation: metrics?.user_satisfaction || 0,
      circulation: metrics?.neural_efficiency || 0
    },
    respiratory: {
      oxygenLevel: metrics?.adaptive_learning_rate || 0
    }
  }), [metrics]);

  // Legacy metrics format - properly mapped
  const legacyMetrics: NeuralMetrics = useMemo(() => ({
    neural_efficiency: metrics?.neural_efficiency || 0,
    adaptive_learning_rate: metrics?.adaptive_learning_rate || 0,
    system_coherence: metrics?.system_coherence || 0,
    user_satisfaction: metrics?.user_satisfaction || 0,
    paes_simulation_accuracy: metrics?.paes_simulation_accuracy || 0,
    universe_exploration_depth: metrics?.universe_exploration_depth || 0,
    prediction_accuracy: metrics?.prediction_accuracy || 0,
    gamification_engagement: metrics?.gamification_engagement || 0
  }), [metrics]);

  return {
    metrics: legacyMetrics,
    systemVitals,
    getMetricForDimension,
    isLoading,
    error,
    refetch
  };
};
