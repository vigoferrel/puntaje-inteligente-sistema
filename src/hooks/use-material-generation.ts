
// DEPRECATED: Hook simulado reemplazado por useMaterialGenerationReal
// Este archivo se mantiene solo para compatibilidad durante la migración

import { useMaterialGenerationReal } from './use-material-generation-real';

export const useMaterialGeneration = () => {
  // Redirigir al hook real
  return useMaterialGenerationReal();
};

// Re-export types for compatibility
export type { MaterialGenerationConfig, GeneratedMaterial, AdaptiveRecommendation, UserProgressData } from '@/types/material-generation';
