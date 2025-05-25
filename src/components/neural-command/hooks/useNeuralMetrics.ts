
import { useMemo } from 'react';
import { useSimplifiedIntersectional } from '@/hooks/useSimplifiedIntersectional';
import { NeuralMetrics } from '../config/neuralTypes';

export const useNeuralMetrics = () => {
  const { neuralHealth, systemVitals } = useSimplifiedIntersectional();

  const metrics = useMemo<NeuralMetrics>(() => ({
    neural_efficiency: neuralHealth.neural_efficiency,
    adaptive_learning_score: neuralHealth.adaptive_learning_score,
    cross_pollination_rate: neuralHealth.cross_pollination_rate,
    user_experience_harmony: neuralHealth.user_experience_harmony,
    paes_simulation_accuracy: Math.round((neuralHealth.neural_efficiency + neuralHealth.adaptive_learning_score) / 2),
    universe_exploration_depth: Math.round(neuralHealth.cross_pollination_rate * 0.9),
    superpaes_coordination_level: Math.round((neuralHealth.neural_efficiency + neuralHealth.user_experience_harmony) / 2),
    gamification_engagement: Math.round(neuralHealth.user_experience_harmony * 0.95)
  }), [neuralHealth]);

  const getMetricForDimension = (dimensionId: string): number => {
    switch (dimensionId) {
      case 'neural_command':
        return Math.round(metrics.neural_efficiency);
      case 'educational_universe':
      case 'universe_exploration':
      case 'paes_universe':
        return Math.round(metrics.universe_exploration_depth);
      case 'superpaes_coordinator':
      case 'intelligence_hub':
        return Math.round(metrics.superpaes_coordination_level);
      case 'neural_training':
        return Math.round(metrics.adaptive_learning_score);
      case 'progress_analysis':
      case 'matrix_diagnostics':
        return Math.round(metrics.cross_pollination_rate);
      case 'paes_simulation':
        return Math.round(metrics.paes_simulation_accuracy);
      case 'personalized_feedback':
      case 'holographic_analytics':
        return Math.round((metrics.adaptive_learning_score + metrics.neural_efficiency) / 2);
      case 'battle_mode':
      case 'achievement_system':
        return Math.round(metrics.gamification_engagement);
      case 'vocational_prediction':
        return Math.round(metrics.superpaes_coordination_level);
      case 'financial_center':
        return Math.round(systemVitals.cardiovascular.oxygenation);
      case 'calendar_management':
        return Math.round(systemVitals.cardiovascular.circulation);
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
