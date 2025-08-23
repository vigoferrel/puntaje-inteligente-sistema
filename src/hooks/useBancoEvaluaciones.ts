
// DEPRECATED: Hook simulado reemplazado por useBancoEvaluacionesReal
// Este archivo se mantiene solo para compatibilidad durante la migración

import { useBancoEvaluacionesReal } from './use-banco-evaluaciones-real';

export const useBancoEvaluaciones = () => {
  // Redirigir al hook real
  return useBancoEvaluacionesReal();
};

// Re-export types for compatibility
export type { EvaluacionConfig, BancoStats } from './use-banco-evaluaciones-real';
