/* eslint-disable react-refresh/only-export-components */
/**
 * NEURAL ACTIONS HOOK v4.0 - HOOK OPTIMIZADO
 * Hook personalizado para manejar acciones del sistema neural con useMemo
 */

import { useMemo, Dispatch } from 'react';
import { NeuralAction, BasicNeuralActions } from './NeuralSystemContext';

export (...args: unknown[]) => unknown useNeuralActions(dispatch: Dispatch<NeuralAction>): BasicNeuralActions {
  // Memoizar las acciones para evitar re-renders innecesarios
  const actions = useMemo<BasicNeuralActions>(() => ({
    initialize: () => {
      dispatch({ type: 'INITIALIZE' });
    },
    updateMetrics: (metrics: unknown) => {
      dispatch({ type: 'UPDATE_METRICS', payload: metrics });
    },
    captureEvent: (event: unknown) => {
      dispatch({ type: 'CAPTURE_EVENT', payload: event });
    },
    addInsight: (insight: unknown) => {
      dispatch({ type: 'ADD_INSIGHT', payload: insight });
    },
    setError: (error: string | null) => {
      dispatch({ type: 'SET_ERROR', payload: error });
    },
    reset: () => {
      dispatch({ type: 'RESET' });
    }
  }), [dispatch]);

  return actions;
}

