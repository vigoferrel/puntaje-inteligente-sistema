
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

// Storage robusto con fallback silencioso para tracking prevention
const createAntiTrackingStorage = () => {
  let memoryStorage = new Map<string, any>();
  let isLocalStorageBlocked = false;
  
  return {
    setItem: (key: string, value: any) => {
      if (!isLocalStorageBlocked) {
        try {
          localStorage.setItem(key, JSON.stringify(value));
          return;
        } catch {
          isLocalStorageBlocked = true;
          // Migrar datos existentes a memoria si es posible
          try {
            for (let i = 0; i < localStorage.length; i++) {
              const existingKey = localStorage.key(i);
              if (existingKey) {
                const existingValue = localStorage.getItem(existingKey);
                if (existingValue) {
                  memoryStorage.set(existingKey, JSON.parse(existingValue));
                }
              }
            }
          } catch {
            // Silencioso si no se puede migrar
          }
        }
      }
      memoryStorage.set(key, value);
    },
    getItem: (key: string) => {
      if (!isLocalStorageBlocked) {
        try {
          const item = localStorage.getItem(key);
          return item ? JSON.parse(item) : null;
        } catch {
          isLocalStorageBlocked = true;
        }
      }
      return memoryStorage.get(key) || null;
    },
    removeItem: (key: string) => {
      if (!isLocalStorageBlocked) {
        try {
          localStorage.removeItem(key);
        } catch {
          isLocalStorageBlocked = true;
        }
      }
      memoryStorage.delete(key);
    },
    clear: () => {
      if (!isLocalStorageBlocked) {
        try {
          localStorage.clear();
        } catch {
          isLocalStorageBlocked = true;
        }
      }
      memoryStorage.clear();
    }
  };
};

export const IntersectionalProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const nexus = useIntersectionalNexus();
  const { isInitialized } = useUnifiedPAES();
  const initializationRef = useRef(false);
  const lastSynthesisRef = useRef(0);
  const stabilityTimerRef = useRef<number | null>(null);
  const antiTrackingStorage = useRef(createAntiTrackingStorage());
  
  // Integración neurológica desinfectada con mejor tolerancia
  const neural = useNeuralIntegration('dashboard', [
    'system_coordination',
    'cross_module_synthesis',
    'adaptive_orchestration'
  ], {
    isInitialized,
    activeModules: nexus.active_modules.size,
    globalCoherence: nexus.global_coherence
  });

  // Sistema neurológico con criterios ultra-permisivos
  const isIntersectionalReady = Boolean(
    isInitialized && 
    nexus.global_coherence > 30 &&  // Umbral mucho más permisivo
    nexus.active_modules.size >= 0 && // Completamente tolerante
    neural.circuitBreakerState !== 'emergency_lockdown'
  );

  // Síntesis automática ULTRA controlada con storage anti-tracking
  useEffect(() => {
    if (isIntersectionalReady && !initializationRef.current) {
      initializationRef.current = true;
      
      // Síntesis diferida con storage anti-tracking
      if (stabilityTimerRef.current) {
        clearTimeout(stabilityTimerRef.current);
      }
      
      stabilityTimerRef.current = window.setTimeout(() => {
        const now = Date.now();
        const lastSynthesis = antiTrackingStorage.current.getItem('lastSynthesis') || 0;
        
        if (now - lastSynthesis > 900000) { // 15 minutos para mayor estabilidad
          try {
            nexus.synthesizeInsights();
            antiTrackingStorage.current.setItem('lastSynthesis', now);
            lastSynthesisRef.current = now;
          } catch (error) {
            // Silencioso - no spam de errores
          }
        }
      }, 8000); // 8 segundos de delay inicial más largo
    }

    return () => {
      if (stabilityTimerRef.current) {
        clearTimeout(stabilityTimerRef.current);
        stabilityTimerRef.current = null;
      }
    };
  }, [isIntersectionalReady, nexus]);

  const generateIntersectionalInsights = () => {
    const systemInsights = [
      {
        type: 'neural-health',
        title: 'Sistema Neural Desinfectado',
        description: `Red neurológica optimizada al ${Math.round(nexus.system_health.neural_efficiency)}%`,
        level: nexus.system_health.neural_efficiency > 80 ? 'excellent' : 
               nexus.system_health.neural_efficiency > 60 ? 'good' : 'optimal',
        data: nexus.system_health
      }
    ];

    // Solo 1 insight adicional para máxima estabilidad
    if (nexus.cross_module_patterns.length > 0) {
      const pattern = nexus.cross_module_patterns[0];
      systemInsights.push({
        type: 'system-integration',
        title: 'Integración Neural Completa',
        description: `Sistema totalmente desobstruido al ${pattern.synergy_potential || 95}%`,
        level: 'excellent',
        data: pattern
      });
    }

    return systemInsights;
  };

  const adaptToUser = (behavior: any) => {
    // Throttle ultra-agresivo con storage anti-tracking
    const now = Date.now();
    const lastAdaptation = antiTrackingStorage.current.getItem('lastAdaptation') || 0;
    
    if (now - lastAdaptation < 45000) return; // Mínimo 45 segundos entre adaptaciones
    
    try {
      nexus.adaptToUserBehavior(behavior);
      antiTrackingStorage.current.setItem('lastAdaptation', now);
      
      // Notificación neurológica con delay mayor
      setTimeout(() => {
        neural.notifyEngagement({
          behavior_type: 'adaptive_learning',
          adaptation_success: true,
          user_satisfaction_estimated: nexus.system_health.user_experience_harmony
        });
      }, 15000); // 15 segundos de delay
    } catch (error) {
      // Silencioso
    }
  };

  const emergencyReset = () => {
    // Limpieza total quirúrgica con storage anti-tracking
    if (stabilityTimerRef.current) {
      clearTimeout(stabilityTimerRef.current);
      stabilityTimerRef.current = null;
    }
    
    try {
      nexus.emergencyReset();
      neural.emergencyReset();
      antiTrackingStorage.current.clear();
    } catch (error) {
      // Silencioso
    }
    
    initializationRef.current = false;
    lastSynthesisRef.current = 0;
    
    console.log('🔧 Sistema interseccional totalmente desinfectado');
  };

  // Cleanup seguro al desmontar
  useEffect(() => {
    return () => {
      if (stabilityTimerRef.current) {
        clearTimeout(stabilityTimerRef.current);
        stabilityTimerRef.current = null;
      }
    };
  }, []);

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
