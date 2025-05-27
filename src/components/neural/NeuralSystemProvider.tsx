
/**
 * NEURAL SYSTEM PROVIDER v4.0 - SIN DEPENDENCIAS CIRCULARES
 * Proveedor base del sistema neural sin hooks complejos
 */

import React, { createContext, useContext, useReducer, useEffect } from 'react';
import { NeuralDashboardWidget } from './NeuralDashboardWidget';

// Tipos básicos para el contexto
interface BasicNeuralState {
  isInitialized: boolean;
  sessionId: string | null;
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
    active_issues: string[];
    last_health_check: number;
  };
  insights: any[];
  predictions: any[];
  recommendations: any[];
  error: string | null;
}

interface BasicNeuralActions {
  initialize: () => void;
  updateMetrics: (metrics: any) => void;
  captureEvent: (event: any) => void;
  addInsight: (insight: any) => void;
  setError: (error: string | null) => void;
  reset: () => void;
}

interface BasicNeuralContext {
  state: BasicNeuralState;
  actions: BasicNeuralActions;
}

const NeuralSystemContext = createContext<BasicNeuralContext | null>(null);

const initialState: BasicNeuralState = {
  isInitialized: false,
  sessionId: null,
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
    active_issues: [],
    last_health_check: Date.now()
  },
  insights: [],
  predictions: [],
  recommendations: [],
  error: null
};

function neuralReducer(state: BasicNeuralState, action: any): BasicNeuralState {
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
        metrics: { ...state.metrics, ...action.payload }
      };

    case 'CAPTURE_EVENT':
      // Procesamiento básico de eventos
      return state;

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
        sessionId: `neural_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`
      };

    default:
      return state;
  }
}

interface NeuralSystemProviderProps {
  children: React.ReactNode;
  showDashboard?: boolean;
  enableAutoCapture?: boolean;
}

export const NeuralSystemProvider: React.FC<NeuralSystemProviderProps> = ({
  children,
  showDashboard = true,
  enableAutoCapture = true
}) => {
  const [state, dispatch] = useReducer(neuralReducer, initialState);
  const [showWidget, setShowWidget] = React.useState(false);
  const [widgetMinimized, setWidgetMinimized] = React.useState(true);

  // Acciones básicas sin dependencias circulares
  const actions: BasicNeuralActions = {
    initialize: () => {
      dispatch({ type: 'INITIALIZE' });
    },
    updateMetrics: (metrics: any) => {
      dispatch({ type: 'UPDATE_METRICS', payload: metrics });
    },
    captureEvent: (event: any) => {
      dispatch({ type: 'CAPTURE_EVENT', payload: event });
    },
    addInsight: (insight: any) => {
      dispatch({ type: 'ADD_INSIGHT', payload: insight });
    },
    setError: (error: string | null) => {
      dispatch({ type: 'SET_ERROR', payload: error });
    },
    reset: () => {
      dispatch({ type: 'RESET' });
    }
  };

  // Auto-inicialización
  useEffect(() => {
    if (!state.isInitialized) {
      actions.initialize();
    }
  }, [state.isInitialized]);

  // Auto-mostrar widget después de inicialización
  useEffect(() => {
    if (state.isInitialized && showDashboard) {
      setTimeout(() => setShowWidget(true), 2000);
    }
  }, [state.isInitialized, showDashboard]);

  // Auto-captura de errores globales
  useEffect(() => {
    if (!enableAutoCapture || !state.isInitialized) return;

    const handleError = (event: ErrorEvent) => {
      actions.captureEvent({
        type: 'error',
        message: event.message,
        filename: event.filename,
        timestamp: Date.now()
      });
    };

    const handleUnhandledRejection = (event: PromiseRejectionEvent) => {
      actions.captureEvent({
        type: 'promise_rejection',
        reason: event.reason?.toString() || 'Unknown promise rejection',
        timestamp: Date.now()
      });
    };

    window.addEventListener('error', handleError);
    window.addEventListener('unhandledrejection', handleUnhandledRejection);

    return () => {
      window.removeEventListener('error', handleError);
      window.removeEventListener('unhandledrejection', handleUnhandledRejection);
    };
  }, [state.isInitialized, enableAutoCapture]);

  const contextValue: BasicNeuralContext = {
    state,
    actions
  };

  return (
    <NeuralSystemContext.Provider value={contextValue}>
      {children}
      
      {/* Widget de Dashboard Neural */}
      {showWidget && showDashboard && (
        <NeuralDashboardWidget
          isMinimized={widgetMinimized}
          onToggleMinimize={() => setWidgetMinimized(!widgetMinimized)}
          showAdvancedMetrics={true}
        />
      )}
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
