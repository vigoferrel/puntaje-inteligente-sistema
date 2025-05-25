
import { useMemo } from 'react';
import { useRealNeuralMetrics } from '@/hooks/useRealNeuralMetrics';
import { NeuralMetrics } from '../config/neuralTypes';

export const useNeuralMetrics = () => {
  // Now redirects to real data hook
  const { metrics, isLoading, error, getMetricForDimension, calculateMetrics } = useRealNeuralMetrics();

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

  // Legacy metrics format
  const legacyMetrics: NeuralMetrics = useMemo(() => ({
    neural_efficiency: metrics?.neural_efficiency || 0,
    adaptive_learning_score: metrics?.adaptive_learning_rate || 0,
    cross_pollination_rate: metrics?.system_coherence || 0,
    user_experience_harmony: metrics?.user_satisfaction || 0,
    paes_simulation_accuracy: metrics?.paes_simulation_accuracy || 0,
    universe_exploration_depth: metrics?.universe_exploration_depth || 0,
    superpaes_coordination_level: metrics?.prediction_accuracy || 0,
    gamification_engagement: metrics?.gamification_engagement || 0
  }), [metrics]);

  return {
    metrics: legacyMetrics,
    systemVitals,
    getMetricForDimension,
    isLoading,
    error,
    refetch: calculateMetrics
  };
};
