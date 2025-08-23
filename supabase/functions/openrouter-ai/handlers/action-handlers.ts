
/**
 * Este archivo ahora re-exporta todas las funcionalidades desde la nueva estructura modular
 * para mantener compatibilidad con el código existente
 */

// Re-exportar todas las funciones de manejo desde sus respectivos módulos
export { generateExercise, generateExercisesBatch } from './exercise/index.ts';
export { generateDiagnostic } from './diagnostic/index.ts';
export { analyzePerformance, analyzePerformanceML } from './performance-handlers.ts';
export { provideFeedback } from './feedback-handlers.ts';
export { processImage } from './image-handlers.ts';

// Nuevas funciones de optimización
export { optimizeStudyPlan } from './optimization/study-plan-optimizer.ts';
export { generatePersonalizedContent } from './optimization/content-personalizer.ts';
export { predictLearningOutcomes } from './optimization/learning-predictor.ts';
