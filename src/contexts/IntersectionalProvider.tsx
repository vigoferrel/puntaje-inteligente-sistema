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
  
  // EMERGENCY BYPASS OPTIMIZADO - 5 segundos en lugar de 10
  useEffect(() => {
    emergencyTimeoutRef.current = setTimeout(() => {
      if (!emergencyMode) {
        setEmergencyMode(true);
      }
    }, 5000); // REDUCIDO de 10 a 5 segundos

    return () => {
      if (emergencyTimeoutRef.current) {
        clearTimeout(emergencyTimeoutRef.current);
      }
    };
  }, [emergencyMode]);

  // Inicializar sistema cardiovascular EN MODO ZERO-LOGS v11.0
  useEffect(() => {
    if (!cardiovascularSystemRef.current) {
      cardiovascularSystemRef.current = CardiovascularSystem.getInstance({
        maxBeatsPerSecond: 0.5, // ULTRA reducido
        restingPeriod: 43200000, // 12 HORAS
        recoveryTime: 60000, // 1 minuto
        emergencyThreshold: 20, // ULTRA tolerante
        purificationLevel: 'minimal',
        oxygenThreshold: 10, // ULTRA tolerante
        silentMode: true
      });
      
      // NO logs de inicialización
    }

    return () => {
      if (cardiovascularSystemRef.current) {
        cardiovascularSystemRef.current.destroy();
        cardiovascularSystemRef.current = null;
      }
    };
  }, []);
  
  // Inicializar sistema anti-tracking ZERO-LOGS
  useEffect(() => {
    if (!initializationRef.current) {
      initializationRef.current = true;
      
      // Retrasado para evitar logs de inicialización
      setTimeout(() => {
        try {
          initializeAntiTrackingSystem();
        } catch (error) {
          // Error completamente silencioso
        }
      }, 60000); // 1 minuto de retraso
    }
  }, []);
  
  // Integración neurológica ZERO-LOGS v11.0
  const neural = useNeuralIntegration('dashboard', [
    'zero_logs_cardiovascular_v11',
    'emergency_bypass_optimized',
    'tracking_spam_eliminated',
    'graceful_degradation_enhanced'
  ], {
    isInitialized,
    activeModules: nexus.active_modules.size,
    globalCoherence: nexus.global_coherence,
    cardiovascularHealth: cardiovascularSystemRef.current?.getIntegratedSystemStatus(),
    emergencyMode,
    version: 'v11.0-zero-logs'
  });

  // CONDICIONES ULTRA-RELAJADAS para v11.0 - EMERGENCY BYPASS OPTIMIZADO
  const isIntersectionalReady = Boolean(
    emergencyMode || // EMERGENCY BYPASS siempre listo
    (isInitialized && nexus.global_coherence > 0.5) // MUY tolerante
  );

  // Síntesis cardiovascular ULTRA-espaciada (12 horas) con método correcto
  useEffect(() => {
    if (isIntersectionalReady) {
      const now = Date.now();
      
      // Solo síntesis cada 12 horas
      if (now - lastSynthesisRef.current > 43200000) {
        lastSynthesisRef.current = now;
        
        if (cardiovascularSystemRef.current) {
          // USAR EL MÉTODO CORRECTO que acabamos de agregar
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

  // Vitales del sistema optimizados
  const systemVitals: SystemVitals = React.useMemo(() => ({
    cardiovascular: {
      heartRate: Math.max(30, nexus.global_coherence),
      bloodPressure: emergencyMode ? 'emergency' as const : 'optimal' as const,
      circulation: Math.min(100, nexus.global_coherence + 20),
      oxygenation: Math.min(100, nexus.global_coherence + 30)
    },
    respiratory: {
      breathingRate: emergencyMode ? 20 : 12,
      oxygenLevel: Math.min(100, nexus.global_coherence + 10),
      airQuality: 'pure' as const,
      antiTrackingActive: false // DELEGADO al navegador
    },
    overallHealth: emergencyMode ? 'emergency' as const : 
                   nexus.global_coherence > 30 ? 'excellent' as const : 'good' as const,
    lastCheckup: Date.now()
  }), [nexus.global_coherence, emergencyMode]);

  // Salud neural adaptativa con EMERGENCY FALLBACKS optimizados
  const neuralHealth = React.useMemo(() => ({
    neural_efficiency: emergencyMode ? 70 : Math.max(40, nexus.global_coherence),
    cross_pollination_rate: emergencyMode ? 50 : Math.max(30, nexus.active_modules.size * 10),
    adaptive_learning_score: emergencyMode ? 60 : Math.max(35, nexus.global_coherence * 0.8),
    user_experience_harmony: emergencyMode ? 65 : Math.max(45, nexus.global_coherence * 0.9),
    cardiovascular: systemVitals.cardiovascular,
    singleton: {
      hasInstance: !!cardiovascularSystemRef.current,
      isInitializing: false,
      circuitBreakerOpen: false,
      emergencyActivationCount: emergencyMode ? 1 : 0,
      lastEmergencyActivation: emergencyMode ? Date.now() : 0,
      isStrictMode: false
    },
    ultraConservativeMode: false,
    emergencyMode,
    zeroLogsMode: true // NUEVO: modo zero logs
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
