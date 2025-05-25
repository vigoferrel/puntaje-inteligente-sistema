
import { useContext } from 'react';
import { useIntersectional } from '@/contexts/IntersectionalProvider';

export const useIntersectionalGuard = () => {
  try {
    const context = useIntersectional();
    return {
      ...context,
      isContextReady: true,
      contextError: null
    };
  } catch (error) {
    console.warn('🛡️ IntersectionalProvider no disponible, usando fallback');
    return {
      isIntersectionalReady: false,
      neuralHealth: {
        neural_efficiency: 0,
        cross_pollination_rate: 0,
        adaptive_learning_score: 0,
        user_experience_harmony: 0,
        respiratory: {
          breathingRate: 0,
          oxygenLevel: 50,
          airQuality: 'pure' as const,
          antiTrackingActive: false
        },
        singleton: {
          hasInstance: false,
          isInitializing: false,
          circuitBreakerOpen: false,
          emergencyActivationCount: 0,
          lastEmergencyActivation: 0,
          isStrictMode: false
        },
        ultraConservativeMode: true
      },
      generateIntersectionalInsights: () => [],
      harmonizeExperience: () => {},
      adaptToUser: () => {},
      emergencyReset: () => {},
      systemVitals: {
        cardiovascular: {
          heartRate: 60,
          bloodPressure: 'optimal' as const,
          circulation: 85,
          oxygenation: 95
        },
        respiratory: {
          breathingRate: 0,
          oxygenLevel: 50,
          airQuality: 'pure' as const,
          antiTrackingActive: false
        },
        overallHealth: 'good' as const,
        lastCheckup: Date.now()
      },
      isContextReady: false,
      contextError: error
    };
  }
};
