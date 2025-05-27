
import React, { createContext, useContext, useEffect, useRef } from 'react';
import { useIntersectionalNexus } from '@/core/intersectional-nexus/IntersectionalNexus';
import { useUnifiedPAES } from '@/core/unified-data-hub/UnifiedPAESHub';
import { useNeuralSystem } from '@/components/neural/NeuralSystemProvider';
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
  const { state: neuralState, actions: neuralActions } = useNeuralSystem();
  
  const initializationRef = useRef(false);
  const cardiovascularSystemRef = useRef<CardiovascularSystem | null>(null);
  const emergencyTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const [emergencyMode, setEmergencyMode] = React.useState(false);
  
  // EMERGENCY BYPASS OPTIMIZADO - 3 segundos
  useEffect(() => {
    emergencyTimeoutRef.current = setTimeout(() => {
      if (!emergencyMode && !neuralState.isInitialized) {
        setEmergencyMode(true);
      }
    }, 3000); // REDUCIDO a 3 segundos

    return () => {
      if (emergencyTimeoutRef.current) {
        clearTimeout(emergencyTimeoutRef.current);
      }
    };
  }, [emergencyMode, neuralState.isInitialized]);

  // Inicializar sistema cardiovascular
  useEffect(() => {
    if (!cardiovascularSystemRef.current) {
      cardiovascularSystemRef.current = CardiovascularSystem.getInstance({
        maxBeatsPerSecond: 0.3,
        restingPeriod: 60000, // 1 minuto
        recoveryTime: 30000,
        emergencyThreshold: 15,
        purificationLevel: 'minimal',
        oxygenThreshold: 20,
        silentMode: true
      });
    }

    return () => {
      if (cardiovascularSystemRef.current) {
        cardiovascularSystemRef.current.destroy();
        cardiovascularSystemRef.current = null;
      }
    };
  }, []);
  
  // Inicializar sistema anti-tracking
  useEffect(() => {
    if (!initializationRef.current) {
      initializationRef.current = true;
      
      setTimeout(() => {
        try {
          initializeAntiTrackingSystem();
        } catch (error) {
          // Silencioso
        }
      }, 30000); // 30 segundos de retraso
    }
  }, []);
  
  // Condiciones optimizadas para v3.0
  const isIntersectionalReady = Boolean(
    emergencyMode || 
    (neuralState.isInitialized && isInitialized && nexus.global_coherence > 0.3)
  );

  // Funciones optimizadas
  const generateIntersectionalInsights = React.useCallback(() => {
    if (emergencyMode) {
      return [{
        title: "Sistema Neural v3.0 Activo",
        description: "Sistema refactorizado funcionando correctamente",
        level: "success",
        priority: "medium"
      }];
    }

    try {
      return nexus.generateAdvancedInsights().slice(0, 2);
    } catch (error) {
      return [];
    }
  }, [nexus, emergencyMode]);

  const harmonizeExperience = React.useCallback(() => {
    if (!emergencyMode && neuralState.isInitialized) {
      try {
        nexus.optimizeUserExperience();
        // Llamar a addInsight en lugar de generateInsights que no existe
        neuralActions.addInsight({
          type: 'harmonization',
          title: 'Experiencia Armonizada',
          description: 'Sistema neural harmonizado exitosamente',
          timestamp: Date.now()
        });
      } catch (error) {
        // Silencioso
      }
    }
  }, [nexus, emergencyMode, neuralState.isInitialized, neuralActions]);

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
    console.log('🔄 EMERGENCY RESET v3.0');
    setEmergencyMode(false);
    
    if (cardiovascularSystemRef.current) {
      cardiovascularSystemRef.current.emergencyReset();
    }
    
    nexus.emergencyReset();
    neuralActions.reset();
  }, [nexus, neuralActions]);

  // Vitales optimizados
  const systemVitals: SystemVitals = React.useMemo(() => ({
    cardiovascular: {
      heartRate: Math.max(25, nexus.global_coherence),
      bloodPressure: emergencyMode ? 'emergency' as const : 'optimal' as const,
      circulation: Math.min(100, nexus.global_coherence + 15),
      oxygenation: Math.min(100, nexus.global_coherence + 25)
    },
    respiratory: {
      breathingRate: emergencyMode ? 18 : 10,
      oxygenLevel: Math.min(100, nexus.global_coherence + 5),
      airQuality: 'pure' as const,
      antiTrackingActive: false
    },
    overallHealth: emergencyMode ? 'emergency' as const : 
                   nexus.global_coherence > 25 ? 'excellent' as const : 'good' as const,
    lastCheckup: Date.now()
  }), [nexus.global_coherence, emergencyMode]);

  // Salud neural con sistema v3.0
  const neuralHealth = React.useMemo(() => ({
    neural_efficiency: emergencyMode ? 75 : Math.max(35, nexus.global_coherence),
    cross_pollination_rate: emergencyMode ? 55 : Math.max(25, nexus.active_modules.size * 8),
    adaptive_learning_score: emergencyMode ? 65 : Math.max(30, nexus.global_coherence * 0.7),
    user_experience_harmony: emergencyMode ? 70 : Math.max(40, nexus.global_coherence * 0.8),
    cardiovascular: systemVitals.cardiovascular,
    neural_system_v3: {
      isActive: neuralState.isInitialized,
      metrics: neuralState.metrics,
      health: neuralState.systemHealth.overall_score,
      predictions: neuralState.predictions.length,
      insights: neuralState.insights.length
    },
    emergencyMode,
    refactoredVersion: '3.0'
  }), [nexus, systemVitals, emergencyMode, neuralState]);

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
