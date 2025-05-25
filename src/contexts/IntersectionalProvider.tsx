
import React, { createContext, useContext, useEffect, useRef } from 'react';
import { useIntersectionalNexus } from '@/core/intersectional-nexus/IntersectionalNexus';
import { useUnifiedPAES } from '@/core/unified-data-hub/UnifiedPAESHub';
import { useNeuralIntegration } from '@/hooks/use-neural-integration';
import { CardiovascularSystem } from '@/core/system-vitals/CardiovascularSystem';
import { SystemVitals } from '@/core/system-vitals/types';
import { initializeAntiTrackingSystem } from '@/core/anti-tracking';

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
  const cardiovascularSystemRef = useRef<CardiovascularSystem | null>(null);
  const lastSynthesisRef = useRef(0);
  
  // Inicializar sistema cardiovascular integrista v8.0
  useEffect(() => {
    if (!cardiovascularSystemRef.current) {
      cardiovascularSystemRef.current = CardiovascularSystem.getInstance({
        maxBeatsPerSecond: 5,
        restingPeriod: 3000,
        recoveryTime: 8000,
        emergencyThreshold: 8,
        purificationLevel: 'maximum',
        oxygenThreshold: 80
      });
      console.log('🫀 SISTEMA CARDIOVASCULAR INTEGRISTA v8.0 INICIADO (Detox incluido)');
    }

    return () => {
      if (cardiovascularSystemRef.current) {
        cardiovascularSystemRef.current.destroy();
        cardiovascularSystemRef.current = null;
      }
    };
  }, []);
  
  // Inicializar sistema anti-tracking integrista una sola vez
  useEffect(() => {
    if (!initializationRef.current) {
      initializationRef.current = true;
      
      setTimeout(() => {
        try {
          initializeAntiTrackingSystem();
        } catch (error) {
          console.error('Error en inicialización anti-tracking integrista:', error);
        }
      }, 5000);
    }
  }, []);
  
  // Integración neurológica cardiovascular integrista
  const neural = useNeuralIntegration('dashboard', [
    'cardiovascular_integrista',
    'detox_integration',
    'unified_circulation',
    'passive_operation'
  ], {
    isInitialized,
    activeModules: nexus.active_modules.size,
    globalCoherence: nexus.global_coherence,
    cardiovascularHealth: cardiovascularSystemRef.current?.getIntegratedSystemStatus(),
    integristaMode: true
  });

  // Sistema con criterios optimizados para v8.0
  const isIntersectionalReady = Boolean(
    isInitialized && 
    nexus.global_coherence > 15 && 
    nexus.active_modules.size >= 0 && 
    cardiovascularSystemRef.current
  );

  // Síntesis cardiovascular integrista simplificada
  useEffect(() => {
    if (isIntersectionalReady) {
      const now = Date.now();
      
      if (now - lastSynthesisRef.current > 1200000) { // 20 minutos para v8.0
        try {
          if (cardiovascularSystemRef.current && cardiovascularSystemRef.current.canPump()) {
            const systemData = {
              nexus_state: nexus.system_health,
              active_modules: nexus.active_modules.size,
              coherence: nexus.global_coherence,
              integrista_mode: true
            };

            const processed = cardiovascularSystemRef.current.processSignal(systemData);
            if (processed) {
              nexus.synthesizeInsights();
              lastSynthesisRef.current = now;
            }
          }
        } catch (error) {
          console.error('Error en síntesis cardiovascular integrista:', error);
        }
      }
    }
  }, [isIntersectionalReady, nexus]);

  const emergencyReset = () => {
    try {
      if (cardiovascularSystemRef.current) {
        cardiovascularSystemRef.current.emergencyReset();
      }
      
      nexus.emergencyReset();
      neural.emergencyReset();
      
      console.log('🫀 Sistema cardiovascular integrista reiniciado v8.0');
    } catch (error) {
      console.error('Error en reset de emergencia integrista:', error);
    }
    
    initializationRef.current = false;
    lastSynthesisRef.current = 0;
  };

  const generateIntersectionalInsights = () => {
    if (!cardiovascularSystemRef.current) return [];
    
    const integristaStatus = cardiovascularSystemRef.current.getIntegratedSystemStatus();
    
    const systemInsights = [
      {
        type: 'system-health',
        title: 'Sistema Cardiovascular Integrista v8.0',
        description: `Circulación al ${Math.round(integristaStatus.cardiovascular.circulation)}% - O2: ${Math.round(integristaStatus.cardiovascular.oxygenation)}% - Detox: ${integristaStatus.detox.detoxLevel}`,
        level: 'excellent',
        data: {
          ...nexus.system_health,
          cardiovascular: integristaStatus.cardiovascular,
          detox: integristaStatus.detox,
          integrista: true
        }
      }
    ];

    return systemInsights;
  };

  const adaptToUser = (behavior: any) => {
    try {
      const adaptiveBehavior = {
        timestamp: Date.now(),
        user_context: 'cardiovascular_integrista_adaptation',
        integrista_mode: true
      };

      if (cardiovascularSystemRef.current) {
        cardiovascularSystemRef.current.processSignal(adaptiveBehavior);
        nexus.adaptToUserBehavior(adaptiveBehavior);
      }
    } catch (error) {
      console.error('Error en adaptación integrista:', error);
    }
  };

  // Función auxiliar para obtener system vitals con fallback
  const getSystemVitals = (): SystemVitals => {
    if (cardiovascularSystemRef.current) {
      const integristaStatus = cardiovascularSystemRef.current.getIntegratedSystemStatus();
      const respiratoryHealth = cardiovascularSystemRef.current.getRespiratoryHealth();
      
      return {
        cardiovascular: integristaStatus.cardiovascular,
        respiratory: respiratoryHealth,
        overallHealth: 'good' as const,
        lastCheckup: integristaStatus.timestamp
      };
    }
    
    return {
      cardiovascular: {
        heartRate: 60,
        bloodPressure: 'optimal' as const,
        circulation: 85,
        oxygenation: 95
      },
      respiratory: {
        breathingRate: 15,
        oxygenLevel: 85,
        airQuality: 'pure' as const,
        antiTrackingActive: false
      },
      overallHealth: 'good' as const,
      lastCheckup: Date.now()
    };
  };

  const contextValue: IntersectionalContextType = {
    isIntersectionalReady,
    neuralHealth: {
      ...nexus.system_health,
      cardiovascular: cardiovascularSystemRef.current?.getIntegratedSystemStatus() || {
        cardiovascular: {
          heartRate: 60,
          bloodPressure: 'optimal' as const,
          circulation: 85,
          oxygenation: 95
        },
        detox: {
          isSafeMode: false,
          isEmergencyActive: false,
          detoxLevel: 'minimal' as const,
          lastDetoxTime: Date.now(),
          interventionCount: 0,
          systemStability: 'stable' as const
        }
      },
      integristaMode: true
    },
    generateIntersectionalInsights,
    harmonizeExperience: nexus.harmonizeExperience,
    adaptToUser,
    emergencyReset,
    systemVitals: getSystemVitals()
  };

  return (
    <IntersectionalContext.Provider value={contextValue}>
      {children}
    </IntersectionalContext.Provider>
  );
};
