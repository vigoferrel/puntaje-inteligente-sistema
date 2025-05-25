
// Exportaciones principales
export { LearningMaterialGenerator } from './LearningMaterialGenerator';

// Exportaciones del core refactorizado
export { LearningCycleOrchestrator } from './core/LearningCycleOrchestrator';
export { AdaptiveRecommendationEngine } from './core/AdaptiveRecommendationEngine';
export { UserProgressAnalyzer } from './core/UserProgressAnalyzer';

// Exportaciones de UI
export { ProgressDashboard } from './ui/ProgressDashboard';
export { PhaseNavigator } from './ui/PhaseNavigator';
export { ActionCenter } from './ui/ActionCenter';

// Exportaciones de materiales
export { MaterialGenerationHub } from './materials/MaterialGenerationHub';
export { ExerciseGenerator } from './materials/ExerciseGenerator';
export { StudyContentGenerator } from './materials/StudyContentGenerator';
export { AssessmentGenerator } from './materials/AssessmentGenerator';

// Exportaciones de componentes heredados
export { PhaseSelector } from './components/PhaseSelector';
export { MaterialTypeSelector } from './components/MaterialTypeSelector';
export { ConfigurationPanel } from './components/ConfigurationPanel';

// Exportaciones de tipos y utilidades
export type { 
  MaterialType, 
  MaterialGenerationConfig, 
  GeneratedMaterial, 
  PhaseConfig 
} from './types/learning-material-types';

export { 
  PHASE_CONFIG, 
  MATERIAL_TYPE_CONFIG, 
  getRecommendedConfigForPhase 
} from './utils/phase-material-mapping';
