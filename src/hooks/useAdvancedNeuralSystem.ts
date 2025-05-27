/**
 * ADVANCED NEURAL SYSTEM HOOK v2.0
 * Hook principal para acceder a toda la funcionalidad neural
 */

import { useState, useEffect, useCallback } from 'react';
import { neuralTelemetryService, TelemetryMetrics } from '@/core/neural/NeuralTelemetryService';
import { predictiveAnalyticsEngine, UserIntentPrediction, AdaptiveRecommendation } from '@/core/neural/PredictiveAnalyticsEngine';
import { autoHealingSystem, SystemHealth } from '@/core/neural/AutoHealingSystem';
import { neuralInsightsEngine, LearningPattern, NeuralInsight } from '@/core/neural/NeuralInsightsEngine';

interface AdvancedNeuralState {
  // Telemetría
  realTimeMetrics: TelemetryMetrics;
  isMetricsLoading: boolean;
  
  // Predicciones
  currentPrediction: UserIntentPrediction | null;
  recommendations: AdaptiveRecommendation[];
  
  // Auto-healing
  systemHealth: SystemHealth;
  isSystemHealthy: boolean;
  
  // Insights
  personalizedInsights: NeuralInsight[];
  learningStyle: LearningPattern | null;
  personalizationScore: number;
  
  // Estado general
  neuralSystemReady: boolean;
  optimizationLevel: number;
}

interface AdvancedNeuralActions {
  // Telemetría
  captureEvent: (type: string, data: Record<string, any>, context?: any) => void;
  
  // Predicciones
  triggerPredictionAnalysis: () => void;
  reportPredictionOutcome: (prediction: string, wasCorrect: boolean) => void;
  
  // Auto-healing
  healComponent: (componentName: string) => Promise<boolean>;
  forceSystemCheck: () => void;
  
  // Insights
  forceInsightGeneration: () => void;
  getPersonalizationState: () => any;
  
  // Control general
  enableNeuralSystem: (enabled: boolean) => void;
  emergencyRecovery: () => Promise<boolean>;
}

export const useAdvancedNeuralSystem = (componentName?: string) => {
  const [state, setState] = useState<AdvancedNeuralState>({
    realTimeMetrics: {
      real_time_engagement: 0,
      session_quality: 0,
      learning_effectiveness: 0,
      neural_coherence: 0,
      user_satisfaction_index: 0,
      adaptive_intelligence_score: 0
    },
    isMetricsLoading: true,
    currentPrediction: null,
    recommendations: [],
    systemHealth: {
      overall_score: 100,
      components: new Map(),
      active_issues: [],
      recovery_actions: [],
      last_health_check: Date.now(),
      auto_healing_enabled: true
    },
    isSystemHealthy: true,
    personalizedInsights: [],
    learningStyle: null,
    personalizationScore: 0,
    neuralSystemReady: false,
    optimizationLevel: 0
  });

  // Inicialización del sistema neural
  useEffect(() => {
    const initializeNeuralSystem = async () => {
      console.log('🧠 Initializing Advanced Neural System...');
      
      try {
        // Registrar componente en auto-healing si se proporciona nombre
        if (componentName) {
          autoHealingSystem.getSystemHealth().components.set(componentName, {
            component_name: componentName,
            health_score: 100,
            error_count: 0,
            recovery_attempts: 0,
            status: 'healthy',
            performance_metrics: {
              render_time: 0,
              memory_usage: 0,
              error_rate: 0
            }
          });
        }

        // Esperar un momento para que todos los servicios se inicialicen
        await new Promise(resolve => setTimeout(resolve, 1000));
        
        setState(prev => ({ 
          ...prev, 
          neuralSystemReady: true,
          isMetricsLoading: false
        }));
        
        console.log('✅ Advanced Neural System ready');
      } catch (error) {
        console.error('❌ Failed to initialize Neural System:', error);
        setState(prev => ({ 
          ...prev, 
          isMetricsLoading: false
        }));
      }
    };

    initializeNeuralSystem();
  }, [componentName]);

  // Suscripción a métricas de telemetría
  useEffect(() => {
    const unsubscribe = neuralTelemetryService.subscribe((metrics) => {
      setState(prev => ({
        ...prev,
        realTimeMetrics: metrics,
        isMetricsLoading: false
      }));
    });

    return unsubscribe;
  }, []);

  // Monitoreo continuo de predicciones y sistema
  useEffect(() => {
    if (!state.neuralSystemReady) return;

    const updateInterval = setInterval(() => {
      // Actualizar predicciones
      const currentPrediction = predictiveAnalyticsEngine.getCurrentPrediction();
      const recommendations = predictiveAnalyticsEngine.getRecommendations();
      
      // Actualizar salud del sistema
      const systemHealth = autoHealingSystem.getSystemHealth();
      const isSystemHealthy = systemHealth.overall_score > 70;
      
      // Actualizar insights
      const personalizedInsights = neuralInsightsEngine.getCurrentInsights();
      const learningStyle = neuralInsightsEngine.getLearningStyle();
      const personalizationState = neuralInsightsEngine.getPersonalizationState();
      
      setState(prev => ({
        ...prev,
        currentPrediction,
        recommendations,
        systemHealth,
        isSystemHealthy,
        personalizedInsights,
        learningStyle,
        personalizationScore: personalizationState.personalization_score,
        optimizationLevel: personalizationState.optimization_level
      }));
    }, 5000); // Cada 5 segundos

    return () => clearInterval(updateInterval);
  }, [state.neuralSystemReady]);

  // Capturar evento neural
  const captureEvent = useCallback((
    type: string, 
    data: Record<string, any>, 
    context?: any
  ) => {
    neuralTelemetryService.captureNeuralEvent(type as any, data, context);
  }, []);

  // Trigger análisis de predicciones
  const triggerPredictionAnalysis = useCallback(() => {
    predictiveAnalyticsEngine.triggerManualAnalysis();
  }, []);

  // Reportar resultado de predicción
  const reportPredictionOutcome = useCallback((
    prediction: string, 
    wasCorrect: boolean
  ) => {
    predictiveAnalyticsEngine.reportPredictionOutcome(prediction, wasCorrect);
  }, []);

  // Curar componente específico
  const healComponent = useCallback(async (componentName: string): Promise<boolean> => {
    return autoHealingSystem.healComponent(componentName);
  }, []);

  // Forzar chequeo de sistema
  const forceSystemCheck = useCallback(() => {
    autoHealingSystem.forceHealthCheck();
  }, []);

  // Forzar generación de insights
  const forceInsightGeneration = useCallback(() => {
    neuralInsightsEngine.forcePatternDetection();
  }, []);

  // Obtener estado de personalización
  const getPersonalizationState = useCallback(() => {
    return neuralInsightsEngine.getPersonalizationState();
  }, []);

  // Habilitar/deshabilitar sistema neural
  const enableNeuralSystem = useCallback((enabled: boolean) => {
    autoHealingSystem.toggleAutoHealing(enabled);
    console.log(`🧠 Neural System ${enabled ? 'enabled' : 'disabled'}`);
  }, []);

  // Recuperación de emergencia
  const emergencyRecovery = useCallback(async (): Promise<boolean> => {
    return autoHealingSystem.emergencyRecovery();
  }, []);

  // Reportar error de componente (si se proporciona nombre de componente)
  const reportComponentError = useCallback((error: Error) => {
    if (componentName) {
      autoHealingSystem.handleComponentError(componentName, error);
    }
  }, [componentName]);

  // Auto-captura de eventos de interacción
  useEffect(() => {
    if (!state.neuralSystemReady) return;

    const handleInteraction = (event: Event) => {
      captureEvent('interaction', {
        type: event.type,
        target: (event.target as Element)?.tagName || 'unknown',
        timestamp: Date.now()
      });
    };

    const events = ['click', 'scroll', 'keydown'];
    events.forEach(eventType => {
      document.addEventListener(eventType, handleInteraction, { passive: true });
    });

    return () => {
      events.forEach(eventType => {
        document.removeEventListener(eventType, handleInteraction);
      });
    };
  }, [state.neuralSystemReady, captureEvent]);

  // Auto-captura de navegación
  useEffect(() => {
    if (!state.neuralSystemReady) return;

    captureEvent('navigation', {
      route: window.location.pathname,
      component: componentName || 'unknown'
    });
  }, [window.location.pathname, state.neuralSystemReady, captureEvent, componentName]);

  const actions: AdvancedNeuralActions = {
    captureEvent,
    triggerPredictionAnalysis,
    reportPredictionOutcome,
    healComponent,
    forceSystemCheck,
    forceInsightGeneration,
    getPersonalizationState,
    enableNeuralSystem,
    emergencyRecovery
  };

  return {
    ...state,
    actions,
    reportComponentError, // Método adicional para reportar errores
    
    // Métricas de conveniencia
    isHighEngagement: state.realTimeMetrics.real_time_engagement > 70,
    isLearningEffective: state.realTimeMetrics.learning_effectiveness > 60,
    needsOptimization: state.optimizationLevel < 5,
    hasActiveInsights: state.personalizedInsights.length > 0,
    
    // AGREGADO: shouldReduceMotion basado en métricas neurales
    shouldReduceMotion: state.realTimeMetrics.neural_coherence < 30 || state.realTimeMetrics.real_time_engagement < 20,
    
    // Estado resumido
    neuralSystemStatus: {
      health: state.systemHealth.overall_score,
      engagement: state.realTimeMetrics.real_time_engagement,
      learning: state.realTimeMetrics.learning_effectiveness,
      personalization: state.personalizationScore,
      ready: state.neuralSystemReady
    }
  };
};

export type { AdvancedNeuralState, AdvancedNeuralActions };
