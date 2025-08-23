// Exportaciones principales del sistema de universos
export { UniverseExerciseProvider, useUniverseExerciseContext, UniverseExerciseLoader, UniverseInfo } from './UniverseExerciseProvider';
export { UniverseIntegration, useUniverseDetection, ExerciseBankStats, UniverseNavigator, SkillExercises } from './UniverseIntegration';
export { UniverseExerciseConnector } from '../../services/UniverseExerciseConnector'; // Conector exportado normalmente
export type { UniverseExercise, UniverseConfig } from '../../services/UniverseExerciseConnector'; // Tipos exportados con 'export type'
export { useUniverseExercises, useUniverseStats, useUniverseConfigs } from '../../hooks/useUniverseExercises'; 

export type { UseUniverseExercisesResult } from '../../hooks/useUniverseExercises';