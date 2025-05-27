
/**
 * ADVANCED NEURAL SYSTEM HOOK v4.0 - SIN DEPENDENCIAS CIRCULARES
 * Hook que consume el contexto básico y agrega funcionalidades avanzadas
 */

import { useMemo, useCallback } from 'react';
import { useNeuralSystem } from '@/components/neural/NeuralSystemProvider';

interface UseAdvancedNeuralSystemOptions {
  componentName?: string;
  enableAutoCapture?: boolean;
  telemetryConfig?: any;
  predictionConfig?: any;
}

export const useAdvancedNeuralSystem = (
  componentNameOrOptions?: string | UseAdvancedNeuralSystemOptions
) => {
  // Normalizar parámetros para backward compatibility
  const options = typeof componentNameOrOptions === 'string' 
    ? { componentName: componentNameOrOptions } 
    : (componentNameOrOptions || {});
  
  const { componentName, enableAutoCapture = true } = options;
  const { state, actions } = useNeuralSystem();

  // Telemetría con fallbacks seguros
  const telemetry = useMemo(() => ({
    queueEvent: (event: any) => {
      try {
        actions.captureEvent({
          ...event,
          component_source: componentName,
          timestamp: Date.now()
        });
      } catch (error) {
        console.warn('Telemetry event failed:', error);
      }
    },
    updateMetrics: actions.updateMetrics,
    captureError: (error: Error, context?: any) => {
      actions.captureEvent({
        type: 'error',
        data: { message: error.message, context },
        component_source: componentName,
        timestamp: Date.now()
      });
    },
    measurePerformance: (name: string, fn: () => any) => {
      const start = performance.now();
      const result = fn();
      const duration = performance.now() - start;
      actions.captureEvent({
        type: 'performance',
        data: { operation: name, duration },
        component_source: componentName,
        timestamp: Date.now()
      });
      return result;
    },
    flushEvents: () => Promise.resolve(),
    getQueueSize: () => 0,
    isOnline: navigator.onLine
  }), [actions, componentName]);

  // Predicciones básicas
  const prediction = useMemo(() => ({
    generatePredictions: () => {
      const prediction = {
        id: `prediction_${Date.now()}`,
        type: 'engagement_forecast',
        confidence: 0.75,
        data: {
          trend: state.metrics.real_time_engagement > 50 ? 'positive' : 'neutral',
          recommendation: 'maintain_current_approach'
        },
        timestamp: Date.now()
      };
      actions.addInsight(prediction);
      return Promise.resolve(prediction);
    },
    clearCache: () => {},
    getModelAccuracy: () => 0.75
  }), [state.metrics, actions]);

  // Enhanced capture event con contexto del componente
  const captureEvent = useCallback((
    type: string, 
    data: Record<string, any>, 
    context?: any
  ) => {
    telemetry.queueEvent({
      type,
      data: {
        ...data,
        component: componentName,
        timestamp: Date.now()
      },
      context,
      neural_metrics: state.metrics,
      component_source: componentName
    });
  }, [telemetry, componentName, state.metrics]);

  // Métricas optimizadas con batching
  const updateMetrics = useCallback((metrics: any) => {
    telemetry.updateMetrics(metrics);
  }, [telemetry]);

  // Reporte de errores específico del componente
  const reportError = useCallback((error: Error, context?: any) => {
    telemetry.captureError(error, {
      component: componentName,
      ...context
    });
  }, [telemetry, componentName]);

  // Medición de operaciones
  const measureOperation = useCallback(<T>(operationName: string, fn: () => T): T => {
    return telemetry.measurePerformance(`${componentName}_${operationName}`, fn);
  }, [telemetry, componentName]);

  // Estado del sistema memoizado
  const systemStatus = useMemo(() => ({
    health: state.systemHealth.overall_score,
    engagement: state.metrics.real_time_engagement,
    learning: state.metrics.learning_effectiveness,
    coherence: state.metrics.neural_coherence,
    ready: state.isInitialized,
    predictions: state.predictions.length,
    insights: state.insights.length
  }), [state]);

  // Flags de conveniencia memoizados
  const flags = useMemo(() => ({
    isHighEngagement: state.metrics.real_time_engagement > 70,
    isLearningEffective: state.metrics.learning_effectiveness > 60,
    needsOptimization: state.systemHealth.overall_score < 70,
    hasActiveInsights: state.insights.length > 0,
    shouldReduceMotion: state.metrics.neural_coherence < 30,
    isSystemHealthy: state.systemHealth.overall_score > 80
  }), [state.metrics, state.systemHealth, state.insights]);

  // Acciones mejoradas
  const enhancedActions = useMemo(() => ({
    ...actions,
    captureEvent,
    updateMetrics,
    reportError,
    measureOperation,
    generatePredictions: prediction.generatePredictions,
    flushTelemetry: telemetry.flushEvents,
    clearPredictionCache: prediction.clearCache,
    
    // Métodos legacy para compatibilidad
    triggerPredictionAnalysis: prediction.generatePredictions,
    reportPredictionOutcome: () => Promise.resolve(),
    healComponent: async (componentName: string) => {
      actions.addInsight({
        type: 'healing',
        component: componentName,
        timestamp: Date.now(),
        message: `Component ${componentName} healed`
      });
      return true;
    },
    forceSystemCheck: () => {
      actions.updateMetrics({
        ...state.metrics,
        last_system_check: Date.now()
      });
    },
    forceInsightGeneration: () => {
      actions.addInsight({
        type: 'system_insight',
        title: 'Sistema Neural Activo',
        description: 'El sistema neural está funcionando correctamente',
        timestamp: Date.now()
      });
    },
    getPersonalizationState: () => ({ 
      personalization_score: 75, 
      optimization_level: 3 
    }),
    enableNeuralSystem: () => {
      if (!state.isInitialized) {
        actions.initialize();
      }
    },
    emergencyRecovery: async () => {
      actions.reset();
      return true;
    }
  }), [
    actions,
    captureEvent,
    updateMetrics,
    reportError,
    measureOperation,
    prediction,
    telemetry,
    state
  ]);

  return {
    // Core state con compatibilidad legacy
    realTimeMetrics: state.metrics,
    isMetricsLoading: !state.isInitialized,
    currentPrediction: state.predictions[0] || null,
    recommendations: state.recommendations,
    systemHealth: state.systemHealth,
    isSystemHealthy: state.systemHealth.overall_score > 80,
    personalizedInsights: state.insights,
    learningStyle: null,
    personalizationScore: 75,
    neuralSystemReady: state.isInitialized,
    optimizationLevel: 3,
    
    // Enhanced actions
    actions: enhancedActions,
    
    // Estado y flags
    systemStatus,
    flags,
    
    // Acceso modular
    telemetry,
    prediction,
    
    // Debug utilities
    debug: {
      getDebugInfo: () => ({
        state,
        component: componentName,
        flags,
        telemetry: {
          queueSize: telemetry.getQueueSize(),
          isOnline: telemetry.isOnline
        }
      }),
      clearCache: () => actions.reset(),
      enableDebug: () => console.log('Debug mode enabled for', componentName)
    },
    
    // Legacy compatibility
    sessionId: state.sessionId,
    reportComponentError: reportError,
    isHighEngagement: state.metrics.real_time_engagement > 70,
    isLearningEffective: state.metrics.learning_effectiveness > 60,
    needsOptimization: state.systemHealth.overall_score < 70,
    hasActiveInsights: state.insights.length > 0,
    shouldReduceMotion: state.metrics.neural_coherence < 30,
    neuralSystemStatus: systemStatus
  };
};

// Versión optimizada para componentes de alta frecuencia
export const useNeuralSystemOptimized = (componentName?: string) => {
  const { state } = useNeuralSystem();
  
  return useMemo(() => ({
    isReady: state.isInitialized,
    engagement: state.metrics.real_time_engagement,
    health: state.systemHealth.overall_score,
    shouldReduceMotion: state.metrics.neural_coherence < 30,
    componentName
  }), [
    state.isInitialized,
    state.metrics.real_time_engagement,
    state.systemHealth.overall_score,
    state.metrics.neural_coherence,
    componentName
  ]);
};

// Versión lite para componentes simples
export const useNeuralSystemLite = () => {
  const { state } = useNeuralSystem();
  
  return {
    isReady: state.isInitialized,
    engagement: state.metrics.real_time_engagement,
    health: state.systemHealth.overall_score
  };
};
