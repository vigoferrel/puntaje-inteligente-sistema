
import React, { createContext, useContext, useEffect } from 'react';
import { useIntersectionalNexus } from '@/core/intersectional-nexus/IntersectionalNexus';
import { useUnifiedPAES } from '@/core/unified-data-hub/UnifiedPAESHub';
import { useNeuralIntegration } from '@/hooks/use-neural-integration';

interface IntersectionalContextType {
  isIntersectionalReady: boolean;
  neuralHealth: any;
  generateIntersectionalInsights: () => any[];
  harmonizeExperience: () => void;
  adaptToUser: (behavior: any) => void;
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
  
  // Integración neurológica del provider
  const neural = useNeuralIntegration('dashboard', [
    'system_coordination',
    'cross_module_synthesis',
    'adaptive_orchestration'
  ], {
    isInitialized,
    activeModules: nexus.active_modules.size,
    globalCoherence: nexus.global_coherence
  });

  // Sistema neurológico listo cuando hay coherencia y módulos activos
  const isIntersectionalReady = Boolean(
    isInitialized && 
    nexus.global_coherence > 75 &&
    nexus.active_modules.size >= 2
  );

  // Síntesis automática de insights cada vez que cambia el estado
  useEffect(() => {
    if (isIntersectionalReady) {
      const interval = setInterval(() => {
        nexus.synthesizeInsights();
      }, 120000); // Cada 2 minutos

      return () => clearInterval(interval);
    }
  }, [isIntersectionalReady, nexus]);

  // Auto-armonización cuando hay cambios significativos
  useEffect(() => {
    if (nexus.active_modules.size >= 3) {
      nexus.harmonizeExperience();
    }
  }, [nexus.active_modules.size]);

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

    // Agregar insights de cross-pollination
    nexus.cross_module_patterns.forEach(pattern => {
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
    neural.notifyEngagement({
      behavior_type: 'adaptive_learning',
      adaptation_success: true,
      user_satisfaction_estimated: nexus.system_health.user_experience_harmony
    });
  };

  const contextValue: IntersectionalContextType = {
    isIntersectionalReady,
    neuralHealth: nexus.system_health,
    generateIntersectionalInsights,
    harmonizeExperience: nexus.harmonizeExperience,
    adaptToUser
  };

  return (
    <IntersectionalContext.Provider value={contextValue}>
      {children}
    </IntersectionalContext.Provider>
  );
};
