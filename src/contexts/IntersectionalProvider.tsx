
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
  
  // Inicializar sistema cardiovascular EN MODO SILENCIOSO v9.0
  useEffect(() => {
    if (!cardiovascularSystemRef.current) {
      cardiovascularSystemRef.current = CardiovascularSystem.getInstance({
        maxBeatsPerSecond: 2,
        restingPeriod: 8000,
        recoveryTime: 15000,
        emergencyThreshold: 5,
        purificationLevel: 'minimal',
        oxygenThreshold: 60,
        silentMode: true // MODO SILENCIOSO
      });
      
      // Log único de inicialización
      console.log('🫀 SISTEMA CARDIOVASCULAR v9.0 SILENCIOSO (Provider)');
    }

    return () => {
      if (cardiovascularSystemRef.current) {
        cardiovascularSystemRef.current.destroy();
        cardiovascularSystemRef.current = null;
      }
    };
  }, []);
  
  // Inicializar sistema anti-tracking DELEGADO al navegador
  useEffect(() => {
    if (!initializationRef.current) {
      initializationRef.current = true;
      
      setTimeout(() => {
        try {
          initializeAntiTrackingSystem(); // DELEGADO, no agresivo
        } catch (error) {
          // Error silencioso
        }
      }, 10000); // Retrasado para evitar spam inicial
    }
  }, []);
  
  // Integración neurológica SILENCIOSA v9.0
  const neural = useNeuralIntegration('dashboard', [
    'cardiovascular_silencioso_v9',
    'browser_delegated_tracking',
    'minimal_intervention',
    'silent_operation'
  ], {
    isInitialized,
    activeModules: nexus.active_modules.size,
    globalCoherence: nexus.global_coherence,
    cardiovascularHealth: cardiovascularSystemRef.current?.getIntegratedSystemStatus(),
    silentMode: true,
    version: 'v9.0'
  });

  // Sistema con criterios MUY relajados para v9.0
  const isIntersectionalReady = Boolean(
    isInitialized && 
    nexus.global_coherence > 5 && // MUY tolerante
    cardiovascularSystemRef.current
  );

  // Síntesis cardiovascular MUY espaciada (2 horas)
  useEffect(() => {
    if (isIntersectionalReady) {
      const now = Date.now();
      
      if (now - lastSynthesisRef.current > 7200000) { // 2 HORAS
        try {
          if (cardiovascularSystemRef.current && cardiovascularSystemRef.current.canPump()) {
            const systemData = {
              nexus_state: nexus.system_health,
              active_modules: nexus.active_modules.size,
              coherence: nexus.global_coherence,
              silent_mode: true,
              version: 'v9.0'
            };

            const processed = cardiovascularSystemRef.current.processSignal(systemData);
            if (processed) {
              nexus.synthesizeInsights();
              lastSynthesisRef.current = now;
            }
          }
        } catch (error) {
          // Error completamente silencioso
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
      
      // Log mínimo
      console.log('🫀 Sistema cardiovascular v9.0 reiniciado (silencioso)');
    } catch (error) {
      // Error silencioso
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
        title: 'Sistema Cardiovascular v9.0 Silencioso',
        description: `Operación silenciosa al ${Math.round(integristaStatus.cardiovascular.circulation)}%`,
        level: 'excellent',
        data: {
          ...nexus.system_health,
          cardiovascular: integristaStatus.cardiovascular,
          detox: integristaStatus.detox,
          silentMode: true,
          version: 'v9.0'
        }
      }
    ];

    return systemInsights;
  };

  const adaptToUser = (behavior: any) => {
    try {
      const adaptiveBehavior = {
        timestamp: Date.now(),
        user_context: 'cardiovascular_v9_silent',
        silent_mode: true
      };

      if (cardiovascularSystemRef.current) {
        cardiovascularSystemRef.current.processSignal(adaptiveBehavior);
        nexus.adaptToUserBehavior(adaptiveBehavior);
      }
    } catch (error) {
      // Error silencioso
    }
  };

  // Función auxiliar para obtener system vitals silenciosos
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
        breathingRate: 12, // Más lento para modo silencioso
        oxygenLevel: 85,
        airQuality: 'pure' as const,
        antiTrackingActive: false // NO ACTIVO
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
      silentMode: true,
      version: 'v9.0'
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
