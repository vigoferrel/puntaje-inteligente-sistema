
import React, { createContext, useContext, useEffect, useRef } from 'react';
import { useIntersectionalNexus } from '@/core/intersectional-nexus/IntersectionalNexus';
import { useUnifiedPAES } from '@/core/unified-data-hub/UnifiedPAESHub';
import { useNeuralIntegration } from '@/hooks/use-neural-integration';

interface IntersectionalContextType {
  isIntersectionalReady: boolean;
  neuralHealth: any;
  generateIntersectionalInsights: () => any[];
  harmonizeExperience: () => void;
  adaptToUser: (behavior: any) => void;
  emergencyReset: () => void;
}

const IntersectionalContext = createContext<IntersectionalContextType | undefined>(undefined);

export const useIntersectional = () => {
  const context = useContext(IntersectionalContext);
  if (!context) {
    throw new Error('useIntersectional must be used within IntersectionalProvider');
  }
  return context;
};

export const IntersectionalProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const nexus = useIntersectionalNexus();
  const { isInitialized } = useUnifiedPAES();
  const initializationRef = useRef(false);
  
  // Integración neurológica estabilizada
  const neural = useNeuralIntegration('dashboard', [
    'system_coordination',
    'cross_module_synthesis',
    'adaptive_orchestration'
  ], {
    isInitialized,
    activeModules: nexus.active_modules.size,
    globalCoherence: nexus.global_coherence
  });

  // Sistema neurológico listo con criterios más estrictos
  const isIntersectionalReady = Boolean(
    isInitialized && 
    nexus.global_coherence > 80 &&
    nexus.active_modules.size >= 1 &&
    neural.circuitBreakerState !== 'emergency_lockdown'
  );

  // Síntesis automática controlada (solo una vez cada 5 minutos)
  useEffect(() => {
    if (isIntersectionalReady && !initializationRef.current) {
      initializationRef.current = true;
      
      const interval = setInterval(() => {
        nexus.synthesizeInsights();
      }, 300000); // Cada 5 minutos

      return () => clearInterval(interval);
    }
  }, [isIntersectionalReady, nexus]);

  const generateIntersectionalInsights = () => {
    const systemInsights = [
      {
        type: 'neural-health',
        title: 'Salud del Sistema Neural',
        description: `Red neurológica funcionando al ${Math.round(nexus.system_health.neural_efficiency)}%`,
        level: nexus.system_health.neural_efficiency > 90 ? 'excellent' : 
               nexus.system_health.neural_efficiency > 75 ? 'good' : 'needs-attention',
        data: nexus.system_health
      }
    ];

    // Agregar insights limitados de cross-pollination
    nexus.cross_module_patterns.slice(0, 3).forEach(pattern => {
      systemInsights.push({
        type: 'cross-pollination',
        title: pattern.recommended_integration,
        description: `Sinergia potencial del ${pattern.synergy_potential}%`,
        level: pattern.synergy_potential > 60 ? 'high' : 'medium',
        data: pattern
      });
    });

    return systemInsights;
  };

  const adaptToUser = (behavior: any) => {
    nexus.adaptToUserBehavior(behavior);
    
    // Throttle de notificaciones neurológicas
    setTimeout(() => {
      neural.notifyEngagement({
        behavior_type: 'adaptive_learning',
        adaptation_success: true,
        user_satisfaction_estimated: nexus.system_health.user_experience_harmony
      });
    }, 3000);
  };

  const emergencyReset = () => {
    nexus.emergencyReset();
    neural.emergencyReset();
    initializationRef.current = false;
    console.log('🚨 EMERGENCY RESET: Provider interseccional reiniciado');
  };

  const contextValue: IntersectionalContextType = {
    isIntersectionalReady,
    neuralHealth: nexus.system_health,
    generateIntersectionalInsights,
    harmonizeExperience: nexus.harmonizeExperience,
    adaptToUser,
    emergencyReset
  };

  return (
    <IntersectionalContext.Provider value={contextValue}>
      {children}
    </IntersectionalContext.Provider>
  );
};
