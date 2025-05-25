
import { useMemo } from 'react';
import { useRealNeuralMetrics } from '@/hooks/useRealNeuralMetrics';
import { NeuralMetrics } from '../config/neuralTypes';

export const useNeuralMetrics = () => {
  // Now redirects to real data hook
  const { metrics, isLoading, error, getMetricForDimension, refetch } = useRealNeuralMetrics();

  // Legacy compatibility wrapper
  const systemVitals = useMemo(() => ({
    cardiovascular: {
      oxygenation: metrics?.user_experience_harmony || 0,
      circulation: metrics?.neural_efficiency || 0
    },
    respiratory: {
      oxygenLevel: metrics?.adaptive_learning_score || 0
    }
  }), [metrics]);

  return {
    metrics: metrics || {
      neural_efficiency: 0,
      adaptive_learning_score: 0,
      cross_pollination_rate: 0,
      user_experience_harmony: 0,
      paes_simulation_accuracy: 0,
      universe_exploration_depth: 0,
      superpaes_coordination_level: 0,
      gamification_engagement: 0
    },
    systemVitals,
    getMetricForDimension,
    isLoading,
    error,
    refetch
  };
};
