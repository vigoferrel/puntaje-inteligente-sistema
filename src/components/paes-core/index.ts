
/**
 * FUNCIONALIDADES PAES CENTRALES v2.0
 * Herramientas especializadas para preparación PAES
 */

// Selectores de test
export { TestTypeSelector } from '@/components/lectoguia/test-selector';

// Estadísticas de test
export { TestSpecificStats } from '@/components/lectoguia/test-stats';

// Utilidades de storage para tests
export {
  saveTestProgress,
  getTestProgress,
  clearTestProgress,
  hasSavedProgress
} from '@/utils/test-storage';

// Tipos relacionados
export type {
  StoredTestProgress
} from '@/utils/test-storage';
