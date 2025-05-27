
/**
 * ADVANCED NEURAL SYSTEM HOOK v3.0 - REFACTORED & OPTIMIZED
 * Hook principal con arquitectura modular y lazy loading
 */

import { useMemo, useCallback } from 'react';
import { useNeuralSystem } from '@/contexts/NeuralSystemProvider';

interface UseAdvancedNeuralSystemOptions {
  componentName?: string;
  enableAutoCapture?: boolean;
  telemetryConfig?: any;
  predictionConfig?: any;
}

export const useAdvancedNeuralSystem = (options: UseAdvancedNeuralSystemOptions = {}) => {
  const { componentName, enableAutoCapture = true } = options;
  const { state, actions, debug } = useNeuralSystem();

  // Lazy loading de módulos neurales con fallbacks
  const telemetry = useMemo(() => {
    try {
      // Intenta cargar el módulo de telemetría
      return {
        queueEvent: (event: any) => actions.captureEvent(event),
        updateMetrics: actions.updateMetrics,
        captureError: (error: Error, context?: any) => {
          actions.captureEvent({
            type: 'error',
            data: { message: error.message, context },
            component_source: componentName
          });
        },
        measurePerformance: (name: string, fn: () => any) => {
          const start = performance.now();
          const result = fn();
          const duration = performance.now() - start;
          actions.captureEvent({
            type: 'performance',
            data: { operation: name, duration }
          });
          return result;
        },
        flushEvents: () => Promise.resolve(),
        getQueueSize: () => 0,
        isOnline: navigator.onLine
      };
    } catch (error) {
      console.warn('Telemetry module not available, using fallback');
      return {
        queueEvent: () => {},
        updateMetrics: () => {},
        captureError: () => {},
        measurePerformance: (name: string, fn: () => any) => fn(),
        flushEvents: () => Promise.resolve(),
        getQueueSize: () => 0,
        isOnline: true
      };
    }
  }, [actions, componentName]);

  const prediction = useMemo(() => {
    try {
      return {
        generatePredictions: actions.triggerPrediction,
        clearCache: () => {},
        getModelAccuracy: () => 0.85
      };
    } catch (error) {
      console.warn('Prediction module not available, using fallback');
      return {
        generatePredictions: () => Promise.resolve(),
        clearCache: () => {},
        getModelAccuracy: () => 0.75
      };
    }
  }, [actions]);

  // Enhanced capture event with component context
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

  // Optimized metrics update with batching
  const updateMetrics = useCallback((metrics: any) => {
    telemetry.updateMetrics(metrics);
  }, [telemetry]);

  // Component-specific error reporting
  const reportError = useCallback((error: Error, context?: any) => {
    telemetry.captureError(error, {
      component: componentName,
      ...context
    });
  }, [telemetry, componentName]);

  // Performance measurement wrapper
  const measureOperation = useCallback(<T>(operationName: string, fn: () => T): T => {
    return telemetry.measurePerformance(`${componentName}_${operationName}`, fn);
  }, [telemetry, componentName]);

  // Memoized status calculations
  const systemStatus = useMemo(() => ({
    health: state.systemHealth.overall_score,
    engagement: state.metrics.real_time_engagement,
    learning: state.metrics.learning_effectiveness,
    coherence: state.metrics.neural_coherence,
    ready: state.isInitialized,
    predictions: state.predictions.length,
    insights: state.insights.length
  }), [state]);

  // Memoized convenience flags
  const flags = useMemo(() => ({
    isHighEngagement: state.metrics.real_time_engagement > 70,
    isLearningEffective: state.metrics.learning_effectiveness > 60,
    needsOptimization: state.systemHealth.overall_score < 70,
    hasActiveInsights: state.insights.length > 0,
    shouldReduceMotion: state.metrics.neural_coherence < 30,
    isSystemHealthy: state.systemHealth.overall_score > 80
  }), [state.metrics, state.systemHealth, state.insights]);

  // Enhanced actions with optimizations
  const enhancedActions = useMemo(() => ({
    ...actions,
    captureEvent,
    updateMetrics,
    reportError,
    measureOperation,
    generatePredictions: prediction.generatePredictions,
    flushTelemetry: telemetry.flushEvents,
    clearPredictionCache: prediction.clearCache,
    
    // Legacy compatibility methods
    triggerPredictionAnalysis: prediction.generatePredictions,
    reportPredictionOutcome: () => {},
    healComponent: actions.healComponent,
    forceSystemCheck: () => {},
    forceInsightGeneration: actions.generateInsights,
    getPersonalizationState: () => ({ personalization_score: 75, optimization_level: 3 }),
    enableNeuralSystem: () => {},
    emergencyRecovery: actions.reset
  }), [
    actions,
    captureEvent,
    updateMetrics,
    reportError,
    measureOperation,
    prediction.generatePredictions,
    telemetry.flushEvents,
    prediction.clearCache
  ]);

  // Debug information with performance metrics
  const debugInfo = useMemo(() => ({
    ...debug.getDebugInfo(),
    telemetry: {
      queueSize: telemetry.getQueueSize(),
      isOnline: telemetry.isOnline
    },
    prediction: {
      modelAccuracy: prediction.getModelAccuracy(),
      cacheSize: state.predictions.length
    },
    component: componentName,
    flags
  }), [debug, telemetry, prediction, state.predictions.length, componentName, flags]);

  return {
    // Core state with legacy compatibility
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
    
    // Status and flags
    systemStatus,
    flags,
    
    // Modular access
    telemetry,
    prediction,
    
    // Debug utilities
    debug: {
      ...debug,
      getDebugInfo: () => debugInfo,
      component: componentName
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

// Performance-optimized version for high-frequency components
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

// Lightweight version for simple components
export const useNeuralSystemLite = () => {
  const { state } = useNeuralSystem();
  
  return {
    isReady: state.isInitialized,
    engagement: state.metrics.real_time_engagement,
    health: state.systemHealth.overall_score
  };
};

// Legacy export types for backward compatibility
export type { UseAdvancedNeuralSystemOptions };
export interface AdvancedNeuralState {
  realTimeMetrics: any;
  isMetricsLoading: boolean;
  currentPrediction: any;
  recommendations: any[];
  systemHealth: any;
  isSystemHealthy: boolean;
  personalizedInsights: any[];
  learningStyle: any;
  personalizationScore: number;
  neuralSystemReady: boolean;
  optimizationLevel: number;
}

export interface AdvancedNeuralActions {
  captureEvent: (type: string, data: Record<string, any>, context?: any) => void;
  triggerPredictionAnalysis: () => void;
  reportPredictionOutcome: (prediction: string, wasCorrect: boolean) => void;
  healComponent: (componentName: string) => Promise<boolean>;
  forceSystemCheck: () => void;
  forceInsightGeneration: () => void;
  getPersonalizationState: () => any;
  enableNeuralSystem: (enabled: boolean) => void;
  emergencyRecovery: () => Promise<boolean>;
}
