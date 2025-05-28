
// DEPRECATED: Hook simulado reemplazado por useSimulationReal
// Este archivo se mantiene solo para compatibilidad durante la migración

import { useSimulationReal } from './use-simulation-real';

export const useSimulation = () => {
  // Redirigir al hook real
  return useSimulationReal();
};

// Re-export types for compatibility
export type { SimulationOption, SimulationResult } from './use-simulation-real';
