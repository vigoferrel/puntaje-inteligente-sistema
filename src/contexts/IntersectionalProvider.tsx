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
  
  // Inicializar sistema cardiovascular calibrado v8.2
  useEffect(() => {
    if (!cardiovascularSystemRef.current) {
      cardiovascularSystemRef.current = CardiovascularSystem.getInstance({
        maxBeatsPerSecond: 4,
        restingPeriod: 4000,
        recoveryTime: 10000,
        emergencyThreshold: 8,
        purificationLevel: 'safe_mode',
        oxygenThreshold: 70
      });
      // Log único y silencioso
      console.log('🫀 SISTEMA CARDIOVASCULAR v8.2 CALIBRADO (Provider)');
    }

    return () => {
      if (cardiovascularSystemRef.current) {
        cardiovascularSystemRef.current.destroy();
        cardiovascularSystemRef.current = null;
      }
    };
  }, []);
  
  // Inicializar sistema anti-tracking calibrado una sola vez
  useEffect(() => {
    if (!initializationRef.current) {
      initializationRef.current = true;
      
      setTimeout(() => {
        try {
          initializeAntiTrackingSystem();
        } catch (error) {
          console.error('Error en inicialización anti-tracking v8.2:', error);
        }
      }, 8000); // Retrasado para v8.2
    }
  }, []);
  
  // Integración neurológica calibrada v8.2
  const neural = useNeuralIntegration('dashboard', [
    'cardiovascular_integrista_v8_2',
    'detox_integration_calibrated',
    'unified_circulation_silent',
    'passive_operation_optimized'
  ], {
    isInitialized,
    activeModules: nexus.active_modules.size,
    globalCoherence: nexus.global_coherence,
    cardiovascularHealth: cardiovascularSystemRef.current?.getIntegratedSystemStatus(),
    integristaMode: true,
    calibratedMode: 'v8.2'
  });

  // Sistema con criterios más relajados para v8.2
  const isIntersectionalReady = Boolean(
    isInitialized && 
    nexus.global_coherence > 10 && // Más tolerante
    nexus.active_modules.size >= 0 && 
    cardiovascularSystemRef.current
  );

  // Síntesis cardiovascular calibrada (menos frecuente)
  useEffect(() => {
    if (isIntersectionalReady) {
      const now = Date.now();
      
      if (now - lastSynthesisRef.current > 1800000) { // 30 minutos para v8.2
        try {
          if (cardiovascularSystemRef.current && cardiovascularSystemRef.current.canPump()) {
            const systemData = {
              nexus_state: nexus.system_health,
              active_modules: nexus.active_modules.size,
              coherence: nexus.global_coherence,
              integrista_mode: true,
              calibrated_version: 'v8.2'
            };

            const processed = cardiovascularSystemRef.current.processSignal(systemData);
            if (processed) {
              nexus.synthesizeInsights();
              lastSynthesisRef.current = now;
            }
          }
        } catch (error) {
          console.error('Error en síntesis cardiovascular v8.2:', error);
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
      
      console.log('🫀 Sistema cardiovascular v8.2 reiniciado');
    } catch (error) {
      console.error('Error en reset de emergencia v8.2:', error);
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
        title: 'Sistema Cardiovascular v8.2 Calibrado',
        description: `Circulación al ${Math.round(integristaStatus.cardiovascular.circulation)}% - O2: ${Math.round(integristaStatus.cardiovascular.oxygenation)}%`,
        level: 'excellent',
        data: {
          ...nexus.system_health,
          cardiovascular: integristaStatus.cardiovascular,
          detox: integristaStatus.detox,
          integrista: true,
          calibrated: 'v8.2'
        }
      }
    ];

    return systemInsights;
  };

  const adaptToUser = (behavior: any) => {
    try {
      const adaptiveBehavior = {
        timestamp: Date.now(),
        user_context: 'cardiovascular_v8_2_adaptation',
        integrista_mode: true,
        calibrated: true
      };

      if (cardiovascularSystemRef.current) {
        cardiovascularSystemRef.current.processSignal(adaptiveBehavior);
        nexus.adaptToUserBehavior(adaptiveBehavior);
      }
    } catch (error) {
      console.error('Error en adaptación v8.2:', error);
    }
  };

  // Función auxiliar para obtener system vitals calibrados
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
      integristaMode: true,
      calibratedVersion: 'v8.2'
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
