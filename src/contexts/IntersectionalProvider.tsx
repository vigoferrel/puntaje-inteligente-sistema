
import React, { createContext, useContext, useEffect, useRef } from 'react';
import { useIntersectionalNexus } from '@/core/intersectional-nexus/IntersectionalNexus';
import { useUnifiedPAES } from '@/core/unified-data-hub/UnifiedPAESHub';
import { useNeuralIntegration } from '@/hooks/use-neural-integration';
import { RespiratorySystem } from '@/core/system-vitals/RespiratorySystem';
import { SystemVitals } from '@/core/system-vitals/types';

interface IntersectionalContextType {
  isIntersectionalReady: boolean;
  neuralHealth: any;
  generateIntersectionalInsights: () => any[];
  harmonizeExperience: () => void;
  adaptToUser: (behavior: any) => void;
  emergencyReset: () => void;
  systemVitals: SystemVitals;
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
  const lastSynthesisRef = useRef(0);
  const stabilityTimerRef = useRef<number | null>(null);
  const respiratorySystem = useRef(new RespiratorySystem({
    breathsPerMinute: 12,
    oxygenThreshold: 85,
    purificationLevel: 'maximum',
    antiTrackingMode: true
  }));
  
  // Integración neurológica cardiovascular-respiratoria
  const neural = useNeuralIntegration('dashboard', [
    'respiratory_coordination',
    'oxygen_distribution',
    'purification_control'
  ], {
    isInitialized,
    activeModules: nexus.active_modules.size,
    globalCoherence: nexus.global_coherence,
    respiratoryHealth: respiratorySystem.current.getHealth()
  });

  // Sistema con criterios respiratorios optimizados
  const isIntersectionalReady = Boolean(
    isInitialized && 
    nexus.global_coherence > 30 &&
    nexus.active_modules.size >= 0 && 
    respiratorySystem.current.getHealth().oxygenLevel > 60
  );

  // Síntesis respiratoria con purificación avanzada
  useEffect(() => {
    if (isIntersectionalReady && !initializationRef.current) {
      initializationRef.current = true;
      
      if (stabilityTimerRef.current) {
        clearTimeout(stabilityTimerRef.current);
      }
      
      stabilityTimerRef.current = window.setTimeout(() => {
        const now = Date.now();
        
        if (now - lastSynthesisRef.current > 900000) { // 15 minutos
          try {
            // Respirar datos del sistema
            const systemData = {
              nexus_state: nexus.system_health,
              active_modules: nexus.active_modules.size,
              coherence: nexus.global_coherence
            };

            const inhaled = respiratorySystem.current.breatheIn(systemData);
            if (inhaled) {
              nexus.synthesizeInsights();
              lastSynthesisRef.current = now;
            }
          } catch (error) {
            // Respiración silenciosa en caso de error
          }
        }
      }, 8000); // Respiración profunda de 8 segundos
    }

    return () => {
      if (stabilityTimerRef.current) {
        clearTimeout(stabilityTimerRef.current);
        stabilityTimerRef.current = null;
      }
    };
  }, [isIntersectionalReady, nexus]);

  const generateIntersectionalInsights = () => {
    const respiratoryHealth = respiratorySystem.current.getHealth();
    
    const systemInsights = [
      {
        type: 'respiratory-health',
        title: 'Sistema Respiratorio Cardiovascular',
        description: `Oxigenación óptima al ${Math.round(respiratoryHealth.oxygenLevel)}%`,
        level: respiratoryHealth.oxygenLevel > 85 ? 'excellent' : 'good',
        data: {
          ...nexus.system_health,
          respiratory: respiratoryHealth
        }
      }
    ];

    if (nexus.cross_module_patterns.length > 0) {
      const pattern = nexus.cross_module_patterns[0];
      systemInsights.push({
        type: 'cardiovascular-integration',
        title: 'Integración Cardiovascular Completa',
        description: `Sistema circulatorio optimizado al ${pattern.synergy_potential || 95}%`,
        level: 'excellent',
        data: pattern
      });
    }

    return systemInsights;
  };

  const adaptToUser = (behavior: any) => {
    const now = Date.now();
    
    try {
      // Respirar comportamiento del usuario
      const breathed = respiratorySystem.current.breatheIn({
        behavior,
        timestamp: now,
        user_context: 'adaptation'
      });

      if (breathed) {
        nexus.adaptToUserBehavior(behavior);
        
        setTimeout(() => {
          neural.notifyEngagement({
            behavior_type: 'cardiovascular_adaptation',
            adaptation_success: true,
            respiratory_health: respiratorySystem.current.getHealth()
          });
        }, 15000); // Respiración lenta para adaptación
      }
    } catch (error) {
      // Respiración silenciosa
    }
  };

  const emergencyReset = () => {
    if (stabilityTimerRef.current) {
      clearTimeout(stabilityTimerRef.current);
      stabilityTimerRef.current = null;
    }
    
    try {
      nexus.emergencyReset();
      neural.emergencyReset();
      respiratorySystem.current.emergencyPurge();
    } catch (error) {
      // Reset silencioso
    }
    
    initializationRef.current = false;
    lastSynthesisRef.current = 0;
    
    console.log('🫁 Sistema interseccional cardiovascular-respiratorio reiniciado');
  };

  // Cleanup respiratorio
  useEffect(() => {
    return () => {
      if (stabilityTimerRef.current) {
        clearTimeout(stabilityTimerRef.current);
        stabilityTimerRef.current = null;
      }
      respiratorySystem.current.destroy();
    };
  }, []);

  const contextValue: IntersectionalContextType = {
    isIntersectionalReady,
    neuralHealth: {
      ...nexus.system_health,
      respiratory: respiratorySystem.current.getHealth()
    },
    generateIntersectionalInsights,
    harmonizeExperience: nexus.harmonizeExperience,
    adaptToUser,
    emergencyReset,
    systemVitals: {
      cardiovascular: neural.systemHealth.cardiovascular?.cardiovascular || {
        heartRate: 0,
        bloodPressure: 'optimal' as const,
        circulation: 100,
        oxygenation: 95
      },
      respiratory: respiratorySystem.current.getHealth(),
      overallHealth: 'excellent' as const,
      lastCheckup: Date.now()
    }
  };

  return (
    <IntersectionalContext.Provider value={contextValue}>
      {children}
    </IntersectionalContext.Provider>
  );
};
