import React, { createContext, useContext, useEffect, useRef } from 'react';
import { useIntersectionalNexus } from '@/core/intersectional-nexus/IntersectionalNexus';
import { useUnifiedPAES } from '@/core/unified-data-hub/UnifiedPAESHub';
import { useNeuralIntegration } from '@/hooks/use-neural-integration';
import { RespiratorySystemManager } from '@/core/system-vitals/RespiratorySystemManager';
import { RespiratorySystem } from '@/core/system-vitals/RespiratorySystem';
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
  const respiratorySystemRef = useRef<RespiratorySystem | null>(null);
  const lastSynthesisRef = useRef(0);
  
  // Inicializar sistema respiratorio con singleton manager
  useEffect(() => {
    let mounted = true;
    
    const initializeRespiratory = async () => {
      try {
        if (!respiratorySystemRef.current) {
          const instance = await RespiratorySystemManager.getInstance({
            breathsPerMinute: 6, // Ultra-conservador
            oxygenThreshold: 50,
            purificationLevel: 'observation', // Solo observación
            antiTrackingMode: false,
            emergencyMode: false
          });
          
          if (mounted) {
            respiratorySystemRef.current = instance;
          }
        }
      } catch (error) {
        console.error('Error inicializando sistema respiratorio:', error);
        // Activar emergencia solo si no está en cooldown
        RespiratorySystemManager.activateEmergencyMode();
      }
    };

    initializeRespiratory();

    return () => {
      mounted = false;
      // No destruir aquí - el singleton se encarga
      respiratorySystemRef.current = null;
    };
  }, []);
  
  // Inicializar sistema anti-tracking una sola vez
  useEffect(() => {
    if (!initializationRef.current) {
      initializationRef.current = true;
      
      // Inicialización diferida y segura
      setTimeout(() => {
        try {
          initializeAntiTrackingSystem();
        } catch (error) {
          console.error('Error en inicialización anti-tracking:', error);
        }
      }, 3000); // 3 segundos para evitar conflictos
    }
  }, []);
  
  // Integración neurológica cardiovascular-respiratoria ULTRA-CONSERVADORA
  const neural = useNeuralIntegration('dashboard', [
    'respiratory_coordination',
    'oxygen_distribution',
    'passive_operation'
  ], {
    isInitialized,
    activeModules: nexus.active_modules.size,
    globalCoherence: nexus.global_coherence,
    respiratoryHealth: respiratorySystemRef.current?.getHealth(),
    ultraConservativeMode: true
  });

  // Sistema con criterios ultra-bajos
  const isIntersectionalReady = Boolean(
    isInitialized && 
    nexus.global_coherence > 10 && // Umbral muy bajo
    nexus.active_modules.size >= 0 && 
    respiratorySystemRef.current
  );

  // Síntesis respiratoria PASIVA
  useEffect(() => {
    if (isIntersectionalReady) {
      const now = Date.now();
      
      // Síntesis muy espaciada - cada 30 minutos
      if (now - lastSynthesisRef.current > 1800000) {
        try {
          if (respiratorySystemRef.current) {
            const systemData = {
              nexus_state: nexus.system_health,
              active_modules: nexus.active_modules.size,
              coherence: nexus.global_coherence,
              passive_mode: true
            };

            const breathed = respiratorySystemRef.current.breatheIn(systemData);
            if (breathed) {
              nexus.synthesizeInsights();
              lastSynthesisRef.current = now;
            }
          }
        } catch (error) {
          console.error('Error en síntesis pasiva:', error);
        }
      }
    }
  }, [isIntersectionalReady, nexus]);

  const emergencyReset = () => {
    try {
      // Reset con singleton manager
      RespiratorySystemManager.destroyAllInstances();
      
      nexus.emergencyReset();
      neural.emergencyReset();
      
      // Recrear después de delay
      setTimeout(async () => {
        try {
          respiratorySystemRef.current = await RespiratorySystemManager.getInstance({
            purificationLevel: 'observation',
            antiTrackingMode: false,
            emergencyMode: false
          });
        } catch (error) {
          console.error('Error recreando sistema:', error);
        }
      }, 2000);
      
    } catch (error) {
      console.error('Error en reset de emergencia:', error);
    }
    
    initializationRef.current = false;
    lastSynthesisRef.current = 0;
    
    console.log('🫁 Sistema interseccional reiniciado con singleton manager');
  };

  const generateIntersectionalInsights = () => {
    if (!respiratorySystemRef.current) return [];
    
    const respiratoryHealth = respiratorySystemRef.current.getHealth();
    const systemStatus = RespiratorySystemManager.getSystemStatus();
    
    const systemInsights = [
      {
        type: 'system-health',
        title: 'Sistema Singleton Activo',
        description: `Modo observación al ${Math.round(respiratoryHealth.oxygenLevel)}% - Singleton controlado`,
        level: 'excellent',
        data: {
          ...nexus.system_health,
          respiratory: respiratoryHealth,
          singleton: systemStatus
        }
      }
    ];

    return systemInsights;
  };

  const adaptToUser = (behavior: any) => {
    try {
      // Adaptación ultra-pasiva
      const passiveBehavior = {
        timestamp: Date.now(),
        user_context: 'passive_observation',
        singleton_mode: true
      };

      if (respiratorySystemRef.current) {
        respiratorySystemRef.current.breatheIn(passiveBehavior);
        nexus.adaptToUserBehavior(passiveBehavior);
      }
    } catch (error) {
      console.error('Error en adaptación:', error);
    }
  };

  // Cleanup seguro y conservador
  useEffect(() => {
    return () => {
      // No destruir instancia aquí - el singleton se encarga
      respiratorySystemRef.current = null;
    };
  }, []);

  const contextValue: IntersectionalContextType = {
    isIntersectionalReady,
    neuralHealth: {
      ...nexus.system_health,
      respiratory: respiratorySystemRef.current?.getHealth() || {
        breathingRate: 0,
        oxygenLevel: 50,
        airQuality: 'pure' as const,
        antiTrackingActive: false
      },
      singleton: RespiratorySystemManager.getSystemStatus(),
      ultraConservativeMode: true
    },
    generateIntersectionalInsights,
    harmonizeExperience: nexus.harmonizeExperience,
    adaptToUser,
    emergencyReset,
    systemVitals: {
      cardiovascular: neural.systemHealth.cardiovascular?.cardiovascular || {
        heartRate: 60,
        bloodPressure: 'optimal' as const,
        circulation: 85,
        oxygenation: 95
      },
      respiratory: respiratorySystemRef.current?.getHealth() || {
        breathingRate: 0,
        oxygenLevel: 50,
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
