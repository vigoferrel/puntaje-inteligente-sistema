/* eslint-disable react-refresh/only-export-components */
/**
 * NEURAL SYSTEM HOOK v4.0 - HOOK DE CONTEXTO
 * Hook personalizado para acceder al sistema neural de manera segura
 */

import { useContext } from 'react';
import { NeuralSystemContext, BasicNeuralContext } from './NeuralSystemContext';

export (...args: unknown[]) => unknown useNeuralSystem(): BasicNeuralContext {
  const context = useContext(NeuralSystemContext);
  
  if (!context) {
    throw new Error('useNeuralSystem debe ser usado dentro de un NeuralSystemProvider');
  }
  
  return context;
}

// Hook especÃ­fico para el estado
export (...args: unknown[]) => unknown useNeuralState() {
  const { state } = useNeuralSystem();
  return state;
}

// Hook especÃ­fico para las acciones
export (...args: unknown[]) => unknown useNeuralActions() {
  const { actions } = useNeuralSystem();
  return actions;
}

