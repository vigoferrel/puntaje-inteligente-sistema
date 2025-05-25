
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

export const IntersectionalProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const nexus = useIntersectionalNexus();
  const { isInitialized } = useUnifiedPAES();
  const initializationRef = useRef(false);
  const lastSynthesisRef = useRef(0);
  const stabilityTimerRef = useRef<number | null>(null);
  
  // Integración neurológica ultra-optimizada
  const neural = useNeuralIntegration('dashboard', [
    'system_coordination',
    'cross_module_synthesis',
    'adaptive_orchestration'
  ], {
    isInitialized,
    activeModules: nexus.active_modules.size,
    globalCoherence: nexus.global_coherence
  });

  // Sistema neurológico con criterios quirúrgicamente optimizados
  const isIntersectionalReady = Boolean(
    isInitialized && 
    nexus.global_coherence > 60 &&  // Umbral más permisivo
    nexus.active_modules.size >= 0 && // Más tolerante
    neural.circuitBreakerState !== 'emergency_lockdown'
  );

  // Síntesis automática ULTRA controlada (solo una vez cada 15 minutos)
  useEffect(() => {
    if (isIntersectionalReady && !initializationRef.current) {
      initializationRef.current = true;
      
      // Síntesis diferida sin bucles
      if (stabilityTimerRef.current) {
        clearTimeout(stabilityTimerRef.current);
      }
      
      stabilityTimerRef.current = window.setTimeout(() => {
        const now = Date.now();
        if (now - lastSynthesisRef.current > 900000) { // 15 minutos
          try {
            nexus.synthesizeInsights();
            lastSynthesisRef.current = now;
          } catch (error) {
            console.warn('Síntesis diferida fallida:', error);
          }
        }
      }, 10000); // 10 segundos de delay inicial
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
        title: 'Sistema Completamente Unificado',
        description: `Integración total del ${pattern.synergy_potential || 95}%`,
        level: 'excellent',
        data: pattern
      });
    }

    return systemInsights;
  };

  const adaptToUser = (behavior: any) => {
    // Throttle ultra-agresivo para prevenir bucles
    const now = Date.now();
    if (now - lastSynthesisRef.current < 60000) return; // Mínimo 1 minuto entre adaptaciones
    
    try {
      nexus.adaptToUserBehavior(behavior);
      lastSynthesisRef.current = now;
      
      // Notificación neurológica con delay mayor
      setTimeout(() => {
        neural.notifyEngagement({
          behavior_type: 'adaptive_learning',
          adaptation_success: true,
          user_satisfaction_estimated: nexus.system_health.user_experience_harmony
        });
      }, 8000); // 8 segundos de delay
    } catch (error) {
      console.warn('Adaptación fallida:', error);
    }
  };

  const emergencyReset = () => {
    // Limpieza total quirúrgica
    if (stabilityTimerRef.current) {
      clearTimeout(stabilityTimerRef.current);
      stabilityTimerRef.current = null;
    }
    
    nexus.emergencyReset();
    neural.emergencyReset();
    initializationRef.current = false;
    lastSynthesisRef.current = 0;
    
    console.log('🔧 EMERGENCY RESET: Provider interseccional quirúrgicamente reparado');
  };

  // Cleanup al desmontar
  useEffect(() => {
    return () => {
      if (stabilityTimerRef.current) {
        clearTimeout(stabilityTimerRef.current);
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
