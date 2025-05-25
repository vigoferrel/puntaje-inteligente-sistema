
import React, { createContext, useContext, useEffect, useRef } from 'react';
import { useIntersectionalNexus } from '@/core/intersectional-nexus/IntersectionalNexus';
import { useUnifiedPAES } from '@/core/unified-data-hub/UnifiedPAESHub';
import { useNeuralIntegration } from '@/hooks/use-neural-integration';
import { CirculatorySystem } from '@/core/system-vitals/CirculatorySystem';
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
  const circulatorySystemRef = useRef<CirculatorySystem | null>(null);
  const lastSynthesisRef = useRef(0);
  
  // Inicializar sistema circulatorio unificado
  useEffect(() => {
    if (!circulatorySystemRef.current) {
      circulatorySystemRef.current = new CirculatorySystem();
      console.log('🫀 SISTEMA CARDIOVASCULAR UNIFICADO v7.0 INICIADO');
    }

    return () => {
      if (circulatorySystemRef.current) {
        circulatorySystemRef.current.destroy();
        circulatorySystemRef.current = null;
      }
    };
  }, []);
  
  // Inicializar sistema anti-tracking una sola vez
  useEffect(() => {
    if (!initializationRef.current) {
      initializationRef.current = true;
      
      setTimeout(() => {
        try {
          initializeAntiTrackingSystem();
        } catch (error) {
          console.error('Error en inicialización anti-tracking:', error);
        }
      }, 3000);
    }
  }, []);
  
  // Integración neurológica cardiovascular unificada
  const neural = useNeuralIntegration('dashboard', [
    'cardiovascular_coordination',
    'unified_circulation',
    'passive_operation'
  ], {
    isInitialized,
    activeModules: nexus.active_modules.size,
    globalCoherence: nexus.global_coherence,
    cardiovascularHealth: circulatorySystemRef.current?.getSystemVitals(),
    unifiedMode: true
  });

  // Sistema con criterios optimizados
  const isIntersectionalReady = Boolean(
    isInitialized && 
    nexus.global_coherence > 20 && 
    nexus.active_modules.size >= 0 && 
    circulatorySystemRef.current
  );

  // Síntesis cardiovascular simplificada
  useEffect(() => {
    if (isIntersectionalReady) {
      const now = Date.now();
      
      if (now - lastSynthesisRef.current > 900000) { // 15 minutos
        try {
          if (circulatorySystemRef.current && circulatorySystemRef.current.canProcessSignal()) {
            const systemData = {
              nexus_state: nexus.system_health,
              active_modules: nexus.active_modules.size,
              coherence: nexus.global_coherence,
              unified_mode: true
            };

            const processed = circulatorySystemRef.current.processSignal(systemData);
            if (processed) {
              nexus.synthesizeInsights();
              lastSynthesisRef.current = now;
            }
          }
        } catch (error) {
          console.error('Error en síntesis cardiovascular:', error);
        }
      }
    }
  }, [isIntersectionalReady, nexus]);

  const emergencyReset = () => {
    try {
      if (circulatorySystemRef.current) {
        circulatorySystemRef.current.emergencyReset();
      }
      
      nexus.emergencyReset();
      neural.emergencyReset();
      
      console.log('🫀 Sistema cardiovascular unificado reiniciado v7.0');
    } catch (error) {
      console.error('Error en reset de emergencia:', error);
    }
    
    initializationRef.current = false;
    lastSynthesisRef.current = 0;
  };

  const generateIntersectionalInsights = () => {
    if (!circulatorySystemRef.current) return [];
    
    const systemVitals = circulatorySystemRef.current.getSystemVitals();
    
    const systemInsights = [
      {
        type: 'system-health',
        title: 'Sistema Cardiovascular Unificado',
        description: `Circulación al ${Math.round(systemVitals.cardiovascular.circulation)}% - Oxigenación al ${Math.round(systemVitals.cardiovascular.oxygenation)}%`,
        level: 'excellent',
        data: {
          ...nexus.system_health,
          cardiovascular: systemVitals.cardiovascular,
          respiratory: systemVitals.respiratory,
          unified: true
        }
      }
    ];

    return systemInsights;
  };

  const adaptToUser = (behavior: any) => {
    try {
      const adaptiveBehavior = {
        timestamp: Date.now(),
        user_context: 'cardiovascular_adaptation',
        unified_mode: true
      };

      if (circulatorySystemRef.current) {
        circulatorySystemRef.current.processSignal(adaptiveBehavior);
        nexus.adaptToUserBehavior(adaptiveBehavior);
      }
    } catch (error) {
      console.error('Error en adaptación:', error);
    }
  };

  const contextValue: IntersectionalContextType = {
    isIntersectionalReady,
    neuralHealth: {
      ...nexus.system_health,
      cardiovascular: circulatorySystemRef.current?.getSystemVitals() || {
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
      },
      unifiedMode: true
    },
    generateIntersectionalInsights,
    harmonizeExperience: nexus.harmonizeExperience,
    adaptToUser,
    emergencyReset,
    systemVitals: circulatorySystemRef.current?.getSystemVitals() || {
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
    }
  };

  return (
    <IntersectionalContext.Provider value={contextValue}>
      {children}
    </IntersectionalContext.Provider>
  );
};
