/**
 * NEURAL SYSTEM INDEX v4.0 - EXPORTACIONES CENTRALIZADAS
 * Punto de entrada centralizado para el sistema neural
 */

// Contexto y tipos
export { 
  NeuralSystemContext,
  defaultConfig,
  initialState,
  neuralReducer
} from './NeuralSystemContext';

export type {
  NeuralConfig,
  ComponentHealth,
  BasicNeuralState,
  BasicNeuralActions,
  NeuralAction,
  BasicNeuralContext
} from './NeuralSystemContext';

// Provider principal
export { NeuralSystemProvider } from './NeuralSystemProvider';

// Hooks optimizados
export { useNeuralActions } from './useNeuralActions';
export { 
  useNeuralSystem,
  useNeuralState,
  useNeuralActions as useNeuralActionsHook
} from './useNeuralSystem';

// Componentes del dashboard
export { NeuralDashboardWidget } from './NeuralDashboardWidget';