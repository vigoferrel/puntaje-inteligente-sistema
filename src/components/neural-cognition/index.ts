
/**
 * MÓDULOS COGNITIVOS NEURALES v2.0
 * Sistema neural central y funcionalidades cognitivas
 */

// Re-exportar componentes neurales existentes
export { NeuralCommandCenter } from '@/components/neural-command/NeuralCommandCenter';

// Managers y proveedores
export { NeuralNavigationManager } from '@/components/neural-command/managers/NeuralNavigationManager';
export { NeuralDataProvider, useNeuralData } from '@/components/neural-command/providers/NeuralDataProvider';

// Hooks neurales
export { useNeuralNavigation } from '@/components/neural-command/hooks/useNeuralNavigation';

// Tipos neurales
export type {
  NeuralCommandCenterProps,
  NeuralDimensionConfig,
  NeuralMetrics
} from '@/components/neural-command/config/neuralTypes';
