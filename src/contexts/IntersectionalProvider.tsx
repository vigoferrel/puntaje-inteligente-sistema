
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
  
  // Sistema respiratorio con singleton robusto
  const respiratorySystem = useRef<RespiratorySystem | null>(null);
  
  // Inicializar sistema respiratorio con control de instancias
  useEffect(() => {
    if (!respiratorySystem.current) {
      try {
        // Usar el singleton para evitar instancias múltiples
        respiratorySystem.current = RespiratorySystem.getInstance({
          breathsPerMinute: 8, // Más lento y seguro
          oxygenThreshold: 85,
          purificationLevel: emergencyDetox.isSafeMode() ? 'safe_mode' : 'observation',
          antiTrackingMode: false, // Deshabilitado por defecto
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
      
      // Inicialización diferida y segura
      setTimeout(() => {
        try {
          initializeAntiTrackingSystem();
        } catch (error) {
          console.error('Error en inicialización anti-tracking:', error);
        }
      }, 2000);
    }
  }, []);
  
  // Integración neurológica cardiovascular-respiratoria CONSERVADORA
  const neural = useNeuralIntegration('dashboard', [
    'respiratory_coordination',
    'oxygen_distribution',
    'safe_mode_operation'
  ], {
    isInitialized,
    activeModules: nexus.active_modules.size,
    globalCoherence: nexus.global_coherence,
    respiratoryHealth: respiratorySystem.current?.getHealth(),
    conservativeMode: true
  });

  // Sistema con criterios respiratorios ultraconservativos
  const isIntersectionalReady = Boolean(
    isInitialized && 
    nexus.global_coherence > 20 && // Umbral más bajo
    nexus.active_modules.size >= 0 && 
    respiratorySystem.current && 
    respiratorySystem.current.getHealth().oxygenLevel > 50 // Umbral más bajo
  );

  // Síntesis respiratoria ULTRACONSERVADORA
  useEffect(() => {
    if (isIntersectionalReady && !emergencyDetox.isSafeMode()) {
      if (stabilityTimerRef.current) {
        clearTimeout(stabilityTimerRef.current);
      }
      
      stabilityTimerRef.current = window.setTimeout(() => {
        const now = Date.now();
        
        // Síntesis muy espaciada - cada 20 minutos
        if (now - lastSynthesisRef.current > 1200000) {
          try {
            if (respiratorySystem.current) {
              const systemData = {
                nexus_state: nexus.system_health,
                active_modules: nexus.active_modules.size,
                coherence: nexus.global_coherence,
                detox_status: emergencyDetox.getDetoxStatus(),
                conservative_mode: true
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
      }, 15000); // 15 segundos de espera
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
        title: detoxStatus.safeMode ? 'Sistema en Modo Seguro' : 'Sistema en Modo Observación',
        description: `Estabilidad al ${Math.round(respiratoryHealth.oxygenLevel)}% - ${detoxStatus.safeMode ? 'Modo Seguro Activo' : 'Modo Observación Activo'}`,
        level: respiratoryHealth.oxygenLevel > 80 ? 'excellent' : 'good',
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
        title: 'Integración Cardiovascular Conservadora',
        description: `Sistema circulatorio estable al ${pattern.synergy_potential || 85}%`,
        level: 'good',
        data: { ...pattern, conservativeMode: true }
      });
    }

    return systemInsights;
  };

  const adaptToUser = (behavior: any) => {
    const now = Date.now();
    
    try {
      // Adaptación ultraconservadora
      const ultraSanitizedBehavior = {
        timestamp: now,
        user_context: 'safe_adaptation',
        safe_mode: true,
        conservative_mode: true
      };

      if (respiratorySystem.current) {
        const breathed = respiratorySystem.current.breatheIn(ultraSanitizedBehavior);
        if (breathed) {
          nexus.adaptToUserBehavior(ultraSanitizedBehavior);
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
      // Reset ultraconservador
      nexus.emergencyReset();
      neural.emergencyReset();
      
      // Destruir todas las instancias respiratorias y crear una nueva
      RespiratorySystem.destroyAllInstances();
      respiratorySystem.current = null;
      
      // Recrear instancia única
      setTimeout(() => {
        respiratorySystem.current = RespiratorySystem.getInstance({
          purificationLevel: 'safe_mode',
          antiTrackingMode: false,
          emergencyMode: false
        });
      }, 1000);
      
      emergencyDetox.activateEmergencyMode();
    } catch (error) {
      console.error('Error en reset de emergencia:', error);
    }
    
    initializationRef.current = false;
    lastSynthesisRef.current = 0;
    
    console.log('🫁 Sistema interseccional reiniciado de forma conservadora');
  };

  // Cleanup seguro y conservador
  useEffect(() => {
    return () => {
      if (stabilityTimerRef.current) {
        clearTimeout(stabilityTimerRef.current);
        stabilityTimerRef.current = null;
      }
      
      // No destruir instancia aquí - el singleton se encarga
      respiratorySystem.current = null;
    };
  }, []);

  const contextValue: IntersectionalContextType = {
    isIntersectionalReady,
    neuralHealth: {
      ...nexus.system_health,
      respiratory: respiratorySystem.current?.getHealth() || {
        breathingRate: 0,
        oxygenLevel: 50,
        airQuality: 'filtered' as const,
        antiTrackingActive: false
      },
      detoxStatus: emergencyDetox.getDetoxStatus(),
      conservativeMode: true
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
      respiratory: respiratorySystem.current?.getHealth() || {
        breathingRate: 0,
        oxygenLevel: 50,
        airQuality: 'filtered' as const,
        antiTrackingActive: false
      },
      overallHealth: emergencyDetox.isSafeMode() ? 'good' as const : 'excellent' as const,
      lastCheckup: Date.now()
    }
  };

  return (
    <IntersectionalContext.Provider value={contextValue}>
      {children}
    </IntersectionalContext.Provider>
  );
};
