
export { LearningMaterialGenerator } from './LearningMaterialGenerator';
export { PhaseSelector } from './components/PhaseSelector';
export { MaterialTypeSelector } from './components/MaterialTypeSelector';
export { ConfigurationPanel } from './components/ConfigurationPanel';

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
