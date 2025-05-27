
/**
 * NEURAL SYSTEM PROVIDER v3.0
 * Context provider global para el sistema neural refactorizado
 */

import React, { createContext, useContext, useReducer, useEffect, useCallback } from 'react';
import { NeuralSystemState, NeuralSystemActions, NeuralConfig } from '@/types/neural-system-types';

interface NeuralSystemContextType {
  state: NeuralSystemState;
  actions: NeuralSystemActions;
  debug: {
    getDebugInfo: () => any;
    clearCache: () => void;
    enableDebug: () => void;
  };
}

const NeuralSystemContext = createContext<NeuralSystemContextType | null>(null);

const initialState: NeuralSystemState = {
  isInitialized: false,
  config: {
    enableTelemetry: true,
    enablePredictions: true,
    enableHealing: true,
    enableInsights: true,
    debugMode: false,
    performanceMonitoring: true
  },
  metrics: {
    real_time_engagement: 0,
    session_quality: 0,
    learning_effectiveness: 0,
    neural_coherence: 0,
    user_satisfaction_index: 0,
    adaptive_intelligence_score: 0
  },
  predictions: [],
  recommendations: [],
  systemHealth: {
    overall_score: 100,
    components: new Map(),
    active_issues: [],
    recovery_actions: [],
    last_health_check: Date.now(),
    auto_healing_enabled: true
  },
  insights: [],
  sessionId: null,
  error: null
};

function neuralSystemReducer(state: NeuralSystemState, action: any): NeuralSystemState {
  switch (action.type) {
    case 'INITIALIZE':
      return {
        ...state,
        isInitialized: true,
        config: { ...state.config, ...action.payload.config },
        sessionId: action.payload.sessionId,
        error: null
      };

    case 'UPDATE_METRICS':
      return {
        ...state,
        metrics: { ...state.metrics, ...action.payload }
      };

    case 'ADD_PREDICTION':
      return {
        ...state,
        predictions: [action.payload, ...state.predictions.slice(0, 9)]
      };

    case 'ADD_RECOMMENDATION':
      return {
        ...state,
        recommendations: [action.payload, ...state.recommendations.slice(0, 4)]
      };

    case 'UPDATE_HEALTH':
      return {
        ...state,
        systemHealth: { ...state.systemHealth, ...action.payload }
      };

    case 'ADD_INSIGHT':
      return {
        ...state,
        insights: [action.payload, ...state.insights.slice(0, 9)]
      };

    case 'SET_ERROR':
      return {
        ...state,
        error: action.payload
      };

    case 'RESET':
      return {
        ...initialState,
        config: state.config
      };

    default:
      return state;
  }
}

interface NeuralSystemProviderProps {
  children: React.ReactNode;
  config?: Partial<NeuralConfig>;
}

export const NeuralSystemProvider: React.FC<NeuralSystemProviderProps> = ({ 
  children, 
  config = {} 
}) => {
  const [state, dispatch] = useReducer(neuralSystemReducer, {
    ...initialState,
    config: { ...initialState.config, ...config }
  });

  const generateSessionId = useCallback(() => {
    return `neural_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  }, []);

  const initialize = useCallback(async (userConfig?: Partial<NeuralConfig>) => {
    try {
      const sessionId = generateSessionId();
      
      dispatch({
        type: 'INITIALIZE',
        payload: {
          config: userConfig,
          sessionId
        }
      });

      if (state.config.debugMode) {
        console.log('🧠 Neural System v3.0 initialized', { sessionId, config: state.config });
      }
    } catch (error) {
      dispatch({ type: 'SET_ERROR', payload: error.message });
    }
  }, [generateSessionId, state.config]);

  const captureEvent = useCallback(async (event: any) => {
    if (!state.isInitialized || !state.config.enableTelemetry) return;

    try {
      // Lazy load telemetry module
      const { processTelemetryEvent } = await import('@/hooks/neural/useNeuralTelemetry');
      await processTelemetryEvent(event, state.sessionId);
    } catch (error) {
      if (state.config.debugMode) {
        console.error('Telemetry capture failed:', error);
      }
    }
  }, [state.isInitialized, state.config.enableTelemetry, state.sessionId, state.config.debugMode]);

  const updateMetrics = useCallback((metrics: any) => {
    dispatch({ type: 'UPDATE_METRICS', payload: metrics });
  }, []);

  const triggerPrediction = useCallback(async () => {
    if (!state.config.enablePredictions) return;

    try {
      // Lazy load prediction module
      const { generatePrediction } = await import('@/hooks/neural/useNeuralPrediction');
      const prediction = await generatePrediction(state.metrics);
      
      if (prediction) {
        dispatch({ type: 'ADD_PREDICTION', payload: prediction });
      }
    } catch (error) {
      if (state.config.debugMode) {
        console.error('Prediction generation failed:', error);
      }
    }
  }, [state.config.enablePredictions, state.metrics, state.config.debugMode]);

  const healComponent = useCallback(async (componentName: string): Promise<boolean> => {
    if (!state.config.enableHealing) return false;

    try {
      // Lazy load healing module
      const { healComponentModule } = await import('@/hooks/neural/useNeuralHealing');
      return await healComponentModule(componentName, state.systemHealth);
    } catch (error) {
      if (state.config.debugMode) {
        console.error('Component healing failed:', error);
      }
      return false;
    }
  }, [state.config.enableHealing, state.systemHealth, state.config.debugMode]);

  const generateInsights = useCallback(async () => {
    if (!state.config.enableInsights) return;

    try {
      // Lazy load insights module
      const { detectPatterns } = await import('@/hooks/neural/useNeuralInsights');
      const insights = await detectPatterns(state.metrics, state.predictions);
      
      insights.forEach(insight => {
        dispatch({ type: 'ADD_INSIGHT', payload: insight });
      });
    } catch (error) {
      if (state.config.debugMode) {
        console.error('Insight generation failed:', error);
      }
    }
  }, [state.config.enableInsights, state.metrics, state.predictions, state.config.debugMode]);

  const reset = useCallback(async () => {
    dispatch({ type: 'RESET' });
    await initialize();
  }, [initialize]);

  const actions: NeuralSystemActions = {
    initialize,
    captureEvent,
    updateMetrics,
    triggerPrediction,
    healComponent,
    generateInsights,
    reset
  };

  const debug = {
    getDebugInfo: () => ({
      state,
      performance: {
        memoryUsage: (performance as any).memory?.usedJSHeapSize || 0,
        timing: performance.now()
      },
      version: '3.0'
    }),
    clearCache: () => {
      // Clear any cached data
      dispatch({ type: 'RESET' });
    },
    enableDebug: () => {
      dispatch({
        type: 'INITIALIZE',
        payload: {
          config: { ...state.config, debugMode: true }
        }
      });
    }
  };

  // Auto-initialize on mount
  useEffect(() => {
    if (!state.isInitialized) {
      initialize();
    }
  }, [state.isInitialized, initialize]);

  const contextValue: NeuralSystemContextType = {
    state,
    actions,
    debug
  };

  return (
    <NeuralSystemContext.Provider value={contextValue}>
      {children}
    </NeuralSystemContext.Provider>
  );
};

export const useNeuralSystem = () => {
  const context = useContext(NeuralSystemContext);
  if (!context) {
    throw new Error('useNeuralSystem must be used within NeuralSystemProvider');
  }
  return context;
};
