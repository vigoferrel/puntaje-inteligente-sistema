import React, { createContext, useContext, useEffect, useRef } from 'react';
import { useIntersectionalNexus } from '@/core/intersectional-nexus/IntersectionalNexus';
import { useUnifiedPAES } from '@/core/unified-data-hub/UnifiedPAESHub';
import { useNeuralIntegration } from '@/hooks/use-neural-integration';
import { RespiratorySystem } from '@/core/system-vitals/RespiratorySystem';
import { SystemVitals } from '@/core/system-vitals/types';
import { initializeAntiTrackingSystem, emergencyDetox } from '@/core/anti-tracking';

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
  
  // Sistema respiratorio con protección anti-autodestrucción
  const respiratorySystem = useRef<RespiratorySystem | null>(null);
  
  // Inicializar sistema respiratorio de forma segura
  useEffect(() => {
    if (!respiratorySystem.current) {
      try {
        respiratorySystem.current = new RespiratorySystem({
          breathsPerMinute: 12,
          oxygenThreshold: 85,
          purificationLevel: emergencyDetox.isSafeMode() ? 'safe_mode' : 'advanced',
          antiTrackingMode: !emergencyDetox.isSafeMode(),
          emergencyMode: false
        });
      } catch (error) {
        console.error('Error inicializando sistema respiratorio:', error);
        emergencyDetox.activateEmergencyMode();
      }
    }
  }, []);
  
  // Inicializar sistema anti-tracking una sola vez
  useEffect(() => {
    if (!initializationRef.current) {
      initializationRef.current = true;
      initializeAntiTrackingSystem();
    }
  }, []);
  
  // Integración neurológica cardiovascular-respiratoria
  const neural = useNeuralIntegration('dashboard', [
    'respiratory_coordination',
    'oxygen_distribution',
    'purification_control',
    'anti_tracking_protection'
  ], {
    isInitialized,
    activeModules: nexus.active_modules.size,
    globalCoherence: nexus.global_coherence,
    respiratoryHealth: respiratorySystem.current?.getHealth()
  });

  // Sistema con criterios respiratorios seguros
  const isIntersectionalReady = Boolean(
    isInitialized && 
    nexus.global_coherence > 30 &&
    nexus.active_modules.size >= 0 && 
    respiratorySystem.current && 
    respiratorySystem.current.getHealth().oxygenLevel > 60
  );

  // Síntesis respiratoria protegida
  useEffect(() => {
    if (isIntersectionalReady && !emergencyDetox.isSafeMode()) {
      if (stabilityTimerRef.current) {
        clearTimeout(stabilityTimerRef.current);
      }
      
      stabilityTimerRef.current = window.setTimeout(() => {
        const now = Date.now();
        
        if (now - lastSynthesisRef.current > 900000) { // 15 minutos
          try {
            if (respiratorySystem.current) {
              const systemData = {
                nexus_state: nexus.system_health,
                active_modules: nexus.active_modules.size,
                coherence: nexus.global_coherence,
                detox_status: emergencyDetox.getDetoxStatus()
              };

              const inhaled = respiratorySystem.current.breatheIn(systemData);
              if (inhaled) {
                nexus.synthesizeInsights();
                lastSynthesisRef.current = now;
              }
            }
          } catch (error) {
            console.error('Error en síntesis respiratoria:', error);
            emergencyDetox.activateEmergencyMode();
          }
        }
      }, 8000);
    }

    return () => {
      if (stabilityTimerRef.current) {
        clearTimeout(stabilityTimerRef.current);
        stabilityTimerRef.current = null;
      }
    };
  }, [isIntersectionalReady, nexus]);

  const generateIntersectionalInsights = () => {
    if (!respiratorySystem.current) return [];
    
    const respiratoryHealth = respiratorySystem.current.getHealth();
    const detoxStatus = emergencyDetox.getDetoxStatus();
    
    const systemInsights = [
      {
        type: 'system-health',
        title: detoxStatus.safeMode ? 'Sistema en Modo Seguro' : 'Sistema Anti-Tracking Blindado',
        description: `Protección al ${Math.round(respiratoryHealth.oxygenLevel)}% - ${detoxStatus.safeMode ? 'Modo Seguro Activo' : 'Tracking 100% bloqueado'}`,
        level: respiratoryHealth.oxygenLevel > 85 ? 'excellent' : 'good',
        data: {
          ...nexus.system_health,
          respiratory: respiratoryHealth,
          detoxStatus
        }
      }
    ];

    if (nexus.cross_module_patterns.length > 0) {
      const pattern = nexus.cross_module_patterns[0];
      systemInsights.push({
        type: 'cardiovascular-integration',
        title: 'Integración Cardiovascular Anti-Tracking',
        description: `Sistema circulatorio blindado al ${pattern.synergy_potential || 95}%`,
        level: 'excellent',
        data: { ...pattern, antiTrackingProtected: true }
      });
    }

    return systemInsights;
  };

  const adaptToUser = (behavior: any) => {
    const now = Date.now();
    
    try {
      const sanitizedBehavior = {
        ...behavior,
        tracking_data: undefined,
        analytics_data: undefined,
        fingerprint_data: undefined
      };

      if (respiratorySystem.current) {
        const breathed = respiratorySystem.current.breatheIn({
          behavior: sanitizedBehavior,
          timestamp: now,
          user_context: 'adaptation',
          safe_mode: emergencyDetox.isSafeMode()
        });

        if (breathed) {
          nexus.adaptToUserBehavior(sanitizedBehavior);
        }
      }
    } catch (error) {
      console.error('Error en adaptación:', error);
      emergencyDetox.activateEmergencyMode();
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
      if (respiratorySystem.current) {
        respiratorySystem.current.emergencyPurge();
      }
      emergencyDetox.activateEmergencyMode();
    } catch (error) {
      console.error('Error en reset de emergencia:', error);
    }
    
    initializationRef.current = false;
    lastSynthesisRef.current = 0;
    
    console.log('🫁 Sistema interseccional reiniciado con detoxificación');
  };

  // Cleanup seguro
  useEffect(() => {
    return () => {
      if (stabilityTimerRef.current) {
        clearTimeout(stabilityTimerRef.current);
        stabilityTimerRef.current = null;
      }
      if (respiratorySystem.current) {
        respiratorySystem.current.destroy();
        respiratorySystem.current = null;
      }
    };
  }, []);

  const contextValue: IntersectionalContextType = {
    isIntersectionalReady,
    neuralHealth: {
      ...nexus.system_health,
      respiratory: respiratorySystem.current?.getHealth() || {
        breathingRate: 0,
        oxygenLevel: 0,
        airQuality: 'contaminated' as const,
        antiTrackingActive: false
      },
      detoxStatus: emergencyDetox.getDetoxStatus()
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
      respiratory: respiratorySystem.current?.getHealth() || {
        breathingRate: 0,
        oxygenLevel: 0,
        airQuality: 'contaminated' as const,
        antiTrackingActive: false
      },
      overallHealth: emergencyDetox.isSafeMode() ? 'fair' as const : 'excellent' as const,
      lastCheckup: Date.now()
    }
  };

  return (
    <IntersectionalContext.Provider value={contextValue}>
      {children}
    </IntersectionalContext.Provider>
  );
};
