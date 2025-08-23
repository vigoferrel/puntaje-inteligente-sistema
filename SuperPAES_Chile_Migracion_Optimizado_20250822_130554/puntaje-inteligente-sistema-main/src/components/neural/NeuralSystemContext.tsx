/* eslint-disable react-refresh/only-export-components */
/**
 * NEURAL SYSTEM CONTEXT v4.0 - CONTEXTO SEPARADO
 * DefiniciÃ³n del contexto neural separado para cumplir con Fast Refresh
 */

import { createContext } from 'react';

// Tipos completos para el contexto neural
export interface NeuralConfig {
  enableTelemetry: boolean;
  enablePredictions: boolean;
  enableHealing: boolean;
  enableInsights: boolean;
  debugMode: boolean;
  performanceMonitoring: boolean;
}

export interface ComponentHealth {
  component_name: string;
  health_score: number;
  error_count: number;
  recovery_attempts: number;
  status: 'healthy' | 'warning' | 'critical' | 'recovering';
  performance_metrics: {
    render_time: number;
    memory_usage: number;
    error_rate: number;
  };
}

export interface BasicNeuralState {
  isInitialized: boolean;
  sessionId: string | null;
  config: NeuralConfig;
  metrics: {
    real_time_engagement: number;
    session_quality: number;
    learning_effectiveness: number;
    neural_coherence: number;
    user_satisfaction_index: number;
    adaptive_intelligence_score: number;
  };
  systemHealth: {
    overall_score: number;
    components: Map<string, ComponentHealth>;
    active_issues: string[];
    last_health_check: number;
    auto_healing_enabled: boolean;
  };
  insights: unknown[];
  predictions: unknown[];
  recommendations: unknown[];
  error: string | null;
}

export interface BasicNeuralActions {
  initialize: () => void;
  updateMetrics: (metrics: unknown) => void;
  captureEvent: (event: unknown) => void;
  addInsight: (insight: unknown) => void;
  setError: (error: string | null) => void;
  reset: () => void;
}

export interface NeuralAction {
  type: string;
  payload?: unknown;
}

export interface BasicNeuralContext {
  state: BasicNeuralState;
  actions: BasicNeuralActions;
}

// Contexto exportado
export const NeuralSystemContext = createContext<BasicNeuralContext | null>(null);

// ConfiguraciÃ³n por defecto
export const defaultConfig: NeuralConfig = {
  enableTelemetry: true,
  enablePredictions: true,
  enableHealing: true,
  enableInsights: true,
  debugMode: false,
  performanceMonitoring: true
};

// Estado inicial
export const initialState: BasicNeuralState = {
  isInitialized: false,
  sessionId: null,
  config: defaultConfig,
  metrics: {
    real_time_engagement: 0,
    session_quality: 0,
    learning_effectiveness: 0,
    neural_coherence: 0,
    user_satisfaction_index: 0,
    adaptive_intelligence_score: 0
  },
  systemHealth: {
    overall_score: 100,
    components: new Map<string, ComponentHealth>(),
    active_issues: [],
    last_health_check: Date.now(),
    auto_healing_enabled: true
  },
  insights: [],
  predictions: [],
  recommendations: [],
  error: null
};

// Reducer del sistema neural
export (...args: unknown[]) => unknown neuralReducer(state: BasicNeuralState, action: NeuralAction): BasicNeuralState {
  switch (action.type) {
    case 'INITIALIZE':
      return {
        ...state,
        isInitialized: true,
        sessionId: `neural_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
        error: null
      };

    case 'UPDATE_METRICS':
      return {
        ...state,
        metrics: {
          ...state.metrics,
          ...(typeof action.payload === 'object' && action.payload !== null ? action.payload : {})
        }
      };

    case 'CAPTURE_EVENT':
      return state;

    case 'ADD_INSIGHT':
      return {
        ...state,
        insights: [action.payload, ...state.insights.slice(0, 9)]
      };

    case 'SET_ERROR':
      return {
        ...state,
        error: typeof action.payload === 'string' ? action.payload : null
      };

    case 'RESET':
      return {
        ...initialState,
        sessionId: `neural_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`
      };

    default:
      return state;
  }
}

