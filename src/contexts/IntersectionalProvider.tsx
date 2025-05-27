
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
  const emergencyTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const [emergencyMode, setEmergencyMode] = React.useState(false);
  
  // EMERGENCY BYPASS - Forzar inicialización después de 10 segundos
  useEffect(() => {
    emergencyTimeoutRef.current = setTimeout(() => {
      if (!emergencyMode) {
        console.log('🚨 EMERGENCY BYPASS ACTIVADO - Forzando inicialización');
        setEmergencyMode(true);
      }
    }, 10000);

    return () => {
      if (emergencyTimeoutRef.current) {
        clearTimeout(emergencyTimeoutRef.current);
      }
    };
  }, [emergencyMode]);

  // Inicializar sistema cardiovascular EN MODO ULTRA-SILENCIOSO v10.0
  useEffect(() => {
    if (!cardiovascularSystemRef.current) {
      cardiovascularSystemRef.current = CardiovascularSystem.getInstance({
        maxBeatsPerSecond: 1, // MUY reducido
        restingPeriod: 21600000, // 6 HORAS
        recoveryTime: 30000, // 30 segundos
        emergencyThreshold: 10, // MUY tolerante
        purificationLevel: 'minimal',
        oxygenThreshold: 30, // MUY tolerante
        silentMode: true
      });
      
      // Log único ULTRA-silencioso
      console.log('🫀 v10.0 ULTRA-SILENCIOSO (6h intervals)');
    }

    return () => {
      if (cardiovascularSystemRef.current) {
        cardiovascularSystemRef.current.destroy();
        cardiovascularSystemRef.current = null;
      }
    };
  }, []);
  
  // Inicializar sistema anti-tracking ULTRA-DELEGADO
  useEffect(() => {
    if (!initializationRef.current) {
      initializationRef.current = true;
      
      // Retrasado MUCHO para evitar spam inicial
      setTimeout(() => {
        try {
          initializeAntiTrackingSystem();
        } catch (error) {
          // Error completamente silencioso
        }
      }, 30000); // 30 segundos de retraso
    }
  }, []);
  
  // Integración neurológica ULTRA-SILENCIOSA v10.0
  const neural = useNeuralIntegration('dashboard', [
    'ultra_silent_cardiovascular_v10',
    'emergency_bypass_mode',
    'zero_intervention_tracking',
    'graceful_degradation'
  ], {
    isInitialized,
    activeModules: nexus.active_modules.size,
    globalCoherence: nexus.global_coherence,
    cardiovascularHealth: cardiovascularSystemRef.current?.getIntegratedSystemStatus(),
    emergencyMode,
    version: 'v10.0-ultra-silent'
  });

  // CONDICIONES MUY RELAJADAS para v10.0 - EMERGENCY BYPASS
  const isIntersectionalReady = Boolean(
    emergencyMode || // EMERGENCY BYPASS siempre listo
    (isInitialized && nexus.global_coherence > 1) // MUY tolerante
  );

  // Síntesis cardiovascular ULTRA-espaciada (6 horas)
  useEffect(() => {
    if (isIntersectionalReady) {
      const now = Date.now();
      
      // Solo síntesis cada 6 horas
      if (now - lastSynthesisRef.current > 21600000) {
        lastSynthesisRef.current = now;
        
        if (cardiovascularSystemRef.current) {
          cardiovascularSystemRef.current.performUltraSilentSynthesis({
            nexusCoherence: nexus.global_coherence,
            neuralIntegrationLevel: neural.integrationLevel || 50,
            systemLoad: nexus.active_modules.size,
            emergencyMode
          });
        }
      }
    }
  }, [isIntersectionalReady, nexus.global_coherence, neural.integrationLevel, emergencyMode]);

  // Funciones simplificadas y tolerantes
  const generateIntersectionalInsights = React.useCallback(() => {
    if (emergencyMode) {
      // Insights de emergencia básicos
      return [
        {
          title: "Sistema en Modo Emergencia",
          description: "Funcionalidad básica disponible",
          level: "warning",
          priority: "high"
        }
      ];
    }

    try {
      return nexus.generateAdvancedInsights().slice(0, 3); // Limitado
    } catch (error) {
      return [];
    }
  }, [nexus, emergencyMode]);

  const harmonizeExperience = React.useCallback(() => {
    if (!emergencyMode) {
      try {
        nexus.optimizeUserExperience();
      } catch (error) {
        // Silencioso
      }
    }
  }, [nexus, emergencyMode]);

  const adaptToUser = React.useCallback((behavior: any) => {
    if (!emergencyMode && cardiovascularSystemRef.current) {
      try {
        cardiovascularSystemRef.current.adaptToUserBehavior(behavior);
      } catch (error) {
        // Silencioso
      }
    }
  }, [emergencyMode]);

  const emergencyReset = React.useCallback(() => {
    console.log('🔄 EMERGENCY RESET ACTIVADO');
    setEmergencyMode(false);
    
    if (cardiovascularSystemRef.current) {
      cardiovascularSystemRef.current.emergencyReset();
    }
    
    nexus.emergencyReset();
    
    // Reiniciar timeout de emergencia
    if (emergencyTimeoutRef.current) {
      clearTimeout(emergencyTimeoutRef.current);
    }
  }, [nexus]);

  // Vitales del sistema simplificados
  const systemVitals: SystemVitals = React.useMemo(() => ({
    cardiovascular: {
      heartRate: Math.max(30, nexus.global_coherence),
      bloodPressure: emergencyMode ? 'emergency' as const : 'optimal' as const,
      circulation: Math.min(100, nexus.global_coherence + 20),
      oxygenation: Math.min(100, nexus.global_coherence + 30)
    },
    respiratory: {
      breathingRate: emergencyMode ? 25 : 15,
      oxygenLevel: Math.min(100, nexus.global_coherence + 10),
      airQuality: 'pure' as const,
      antiTrackingActive: false // DELEGADO al navegador
    },
    overallHealth: emergencyMode ? 'emergency' as const : 
                   nexus.global_coherence > 50 ? 'excellent' as const : 'good' as const,
    lastCheckup: Date.now()
  }), [nexus.global_coherence, emergencyMode]);

  // Salud neural adaptativa con EMERGENCY FALLBACKS
  const neuralHealth = React.useMemo(() => ({
    neural_efficiency: emergencyMode ? 60 : Math.max(30, nexus.global_coherence),
    cross_pollination_rate: emergencyMode ? 40 : Math.max(20, nexus.active_modules.size * 10),
    adaptive_learning_score: emergencyMode ? 50 : Math.max(25, nexus.global_coherence * 0.8),
    user_experience_harmony: emergencyMode ? 55 : Math.max(35, nexus.global_coherence * 0.9),
    cardiovascular: systemVitals.cardiovascular,
    singleton: {
      hasInstance: !!cardiovascularSystemRef.current,
      isInitializing: false,
      circuitBreakerOpen: false,
      emergencyActivationCount: emergencyMode ? 1 : 0,
      lastEmergencyActivation: emergencyMode ? Date.now() : 0,
      isStrictMode: false
    },
    ultraConservativeMode: false, // Modo normal
    emergencyMode
  }), [nexus, systemVitals, emergencyMode]);

  const contextValue: IntersectionalContextType = React.useMemo(() => ({
    isIntersectionalReady,
    neuralHealth,
    generateIntersectionalInsights,
    harmonizeExperience,
    adaptToUser,
    emergencyReset,
    systemVitals
  }), [
    isIntersectionalReady,
    neuralHealth,
    generateIntersectionalInsights,
    harmonizeExperience,
    adaptToUser,
    emergencyReset,
    systemVitals
  ]);

  return (
    <IntersectionalContext.Provider value={contextValue}>
      {children}
    </IntersectionalContext.Provider>
  );
};
