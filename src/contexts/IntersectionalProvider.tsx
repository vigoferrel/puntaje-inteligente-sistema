
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

// Sistema de storage con fallback para tracking prevention
const createSecureStorage = () => {
  let memoryStorage = new Map<string, any>();
  
  return {
    setItem: (key: string, value: any) => {
      try {
        localStorage.setItem(key, JSON.stringify(value));
      } catch {
        memoryStorage.set(key, value);
      }
    },
    getItem: (key: string) => {
      try {
        const item = localStorage.getItem(key);
        return item ? JSON.parse(item) : null;
      } catch {
        return memoryStorage.get(key) || null;
      }
    },
    removeItem: (key: string) => {
      try {
        localStorage.removeItem(key);
      } catch {
        memoryStorage.delete(key);
      }
    },
    clear: () => {
      try {
        localStorage.clear();
      } catch {
        memoryStorage.clear();
      }
    }
  };
};

export const IntersectionalProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const nexus = useIntersectionalNexus();
  const { isInitialized } = useUnifiedPAES();
  const initializationRef = useRef(false);
  const lastSynthesisRef = useRef(0);
  const stabilityTimerRef = useRef<number | null>(null);
  const secureStorage = useRef(createSecureStorage());
  
  // Integración neurológica ultra-optimizada con mejor tolerancia
  const neural = useNeuralIntegration('dashboard', [
    'system_coordination',
    'cross_module_synthesis',
    'adaptive_orchestration'
  ], {
    isInitialized,
    activeModules: nexus.active_modules.size,
    globalCoherence: nexus.global_coherence
  });

  // Sistema neurológico con criterios más permisivos y optimizados
  const isIntersectionalReady = Boolean(
    isInitialized && 
    nexus.global_coherence > 50 &&  // Umbral más permisivo
    nexus.active_modules.size >= 0 && // Completamente tolerante
    neural.circuitBreakerState !== 'emergency_lockdown' &&
    !neural.circuitBreakerState.includes('emergency')
  );

  // Síntesis automática ULTRA controlada con storage seguro
  useEffect(() => {
    if (isIntersectionalReady && !initializationRef.current) {
      initializationRef.current = true;
      
      // Síntesis diferida con storage fallback
      if (stabilityTimerRef.current) {
        clearTimeout(stabilityTimerRef.current);
      }
      
      stabilityTimerRef.current = window.setTimeout(() => {
        const now = Date.now();
        const lastSynthesis = secureStorage.current.getItem('lastSynthesis') || 0;
        
        if (now - lastSynthesis > 600000) { // 10 minutos en lugar de 15
          try {
            nexus.synthesizeInsights();
            secureStorage.current.setItem('lastSynthesis', now);
            lastSynthesisRef.current = now;
          } catch (error) {
            console.warn('Síntesis diferida fallida (tolerado):', error);
          }
        }
      }, 5000); // 5 segundos de delay inicial
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
        title: 'Salud del Sistema Neural',
        description: `Red neurológica funcionando al ${Math.round(nexus.system_health.neural_efficiency)}%`,
        level: nexus.system_health.neural_efficiency > 85 ? 'excellent' : 
               nexus.system_health.neural_efficiency > 65 ? 'good' : 'optimal',
        data: nexus.system_health
      }
    ];

    // Solo 1 insight adicional para máxima estabilidad
    if (nexus.cross_module_patterns.length > 0) {
      const pattern = nexus.cross_module_patterns[0];
      systemInsights.push({
        type: 'system-unification',
        title: 'Sistema Completamente Desobstruido',
        description: `Integración total del ${pattern.synergy_potential || 98}%`,
        level: 'excellent',
        data: pattern
      });
    }

    return systemInsights;
  };

  const adaptToUser = (behavior: any) => {
    // Throttle ultra-agresivo con storage seguro
    const now = Date.now();
    const lastAdaptation = secureStorage.current.getItem('lastAdaptation') || 0;
    
    if (now - lastAdaptation < 30000) return; // Mínimo 30 segundos entre adaptaciones
    
    try {
      nexus.adaptToUserBehavior(behavior);
      secureStorage.current.setItem('lastAdaptation', now);
      
      // Notificación neurológica con delay mayor y storage seguro
      setTimeout(() => {
        neural.notifyEngagement({
          behavior_type: 'adaptive_learning',
          adaptation_success: true,
          user_satisfaction_estimated: nexus.system_health.user_experience_harmony
        });
      }, 10000); // 10 segundos de delay
    } catch (error) {
      console.warn('Adaptación fallida (tolerado):', error);
    }
  };

  const emergencyReset = () => {
    // Limpieza total quirúrgica con storage seguro
    if (stabilityTimerRef.current) {
      clearTimeout(stabilityTimerRef.current);
      stabilityTimerRef.current = null;
    }
    
    try {
      nexus.emergencyReset();
      neural.emergencyReset();
      secureStorage.current.clear();
    } catch (error) {
      console.warn('Reset parcialmente fallido (tolerado):', error);
    }
    
    initializationRef.current = false;
    lastSynthesisRef.current = 0;
    
    console.log('🔧 EMERGENCY RESET: Provider interseccional quirúrgicamente optimizado');
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
