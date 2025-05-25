
import { useMemo } from 'react';
import { useSimplifiedIntersectional } from '@/hooks/useSimplifiedIntersectional';
import { NeuralMetrics } from '../config/neuralTypes';

export const useNeuralMetrics = () => {
  const { neuralHealth, systemVitals } = useSimplifiedIntersectional();

  const metrics = useMemo<NeuralMetrics>(() => ({
    neural_efficiency: neuralHealth.neural_efficiency,
    adaptive_learning_score: neuralHealth.adaptive_learning_score,
    cross_pollination_rate: neuralHealth.cross_pollination_rate,
    user_experience_harmony: neuralHealth.user_experience_harmony
  }), [neuralHealth]);

  const getMetricForDimension = (dimensionId: string): number => {
    switch (dimensionId) {
      case 'matrix_diagnostics':
      case 'paes_universe':
        return Math.round(metrics.neural_efficiency);
      case 'intelligence_hub':
      case 'neural_training':
        return Math.round(metrics.adaptive_learning_score);
      case 'vocational_prediction':
        return Math.round((metrics.neural_efficiency + metrics.adaptive_learning_score) / 2);
      case 'financial_center':
        return Math.round(systemVitals.cardiovascular.oxygenation);
      case 'educational_universe':
      case 'progress_analysis':
        return Math.round(metrics.cross_pollination_rate);
      case 'battle_mode':
        return Math.round(metrics.user_experience_harmony);
      case 'calendar_management':
        return Math.round(systemVitals.cardiovascular.circulation);
      case 'holographic_analytics':
      case 'settings_control':
        return Math.round(systemVitals.respiratory.oxygenLevel);
      default:
        return Math.round(metrics.neural_efficiency);
    }
  };

  return {
    metrics,
    systemVitals,
    getMetricForDimension
  };
};
