
import { useIntersectionalGuard } from '@/hooks/useIntersectionalGuard';
import { useMemo } from 'react';

export const useSimplifiedIntersectional = () => {
  const intersectionalData = useIntersectionalGuard();

  const neuralHealth = useMemo(() => ({
    neural_efficiency: intersectionalData.neuralHealth.neural_efficiency || 85,
    adaptive_learning_score: intersectionalData.neuralHealth.adaptive_learning_score || 78,
    cross_pollination_rate: intersectionalData.neuralHealth.cross_pollination_rate || 92,
    user_experience_harmony: intersectionalData.neuralHealth.user_experience_harmony || 88,
    cardiovascular: intersectionalData.neuralHealth.cardiovascular || {
      heartRate: 72,
      bloodPressure: 'optimal' as const,
      circulation: 85,
      oxygenation: 95
    },
    singleton: intersectionalData.neuralHealth.singleton || {
      hasInstance: true,
      isInitializing: false,
      circuitBreakerOpen: false,
      emergencyActivationCount: 0,
      lastEmergencyActivation: 0,
      isStrictMode: false
    },
    ultraConservativeMode: intersectionalData.neuralHealth.ultraConservativeMode || false
  }), [intersectionalData.neuralHealth]);

  const systemVitals = useMemo(() => ({
    cardiovascular: intersectionalData.systemVitals.cardiovascular,
    respiratory: intersectionalData.systemVitals.respiratory,
    overallHealth: intersectionalData.systemVitals.overallHealth,
    lastCheckup: intersectionalData.systemVitals.lastCheckup
  }), [intersectionalData.systemVitals]);

  return {
    isIntersectionalReady: intersectionalData.isIntersectionalReady,
    neuralHealth,
    systemVitals,
    generateIntersectionalInsights: intersectionalData.generateIntersectionalInsights,
    harmonizeExperience: intersectionalData.harmonizeExperience,
    adaptToUser: intersectionalData.adaptToUser,
    emergencyReset: intersectionalData.emergencyReset,
    isContextReady: intersectionalData.isContextReady,
    contextError: intersectionalData.contextError
  };
};
