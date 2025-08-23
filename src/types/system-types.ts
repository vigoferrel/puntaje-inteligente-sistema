
/**
 * Main module exporting all system types from their respective modules
 */

// Import types for local use
import { TPAESPrueba } from './paes-types';

// Export types from paes-types.ts
export {
  getPruebaDisplayName,
  getHabilidadDisplayName,
  testIdToPrueba,
  pruebaToTestId
} from './paes-types';
export type { TPAESPrueba, TPAESHabilidad } from './paes-types';

// Export types from learning-cycle-types.ts
export {
  LEARNING_CYCLE_PHASES_ORDER,
  getLearningCyclePhaseDisplayName,
  getLearningCyclePhaseDescription
} from './learning-cycle-types';
export type { TLearningCyclePhase } from './learning-cycle-types';

// Export types from learning-node-types.ts
export type { TLearningNode } from './learning-node-types';

// Export types from learning-material-types.ts
export type { 
  MaterialType, 
  MaterialGenerationConfig, 
  GeneratedMaterial, 
  PhaseConfig 
} from '../components/learning-material-generator/types/learning-material-types';

// Define TPAESTest type for PAES Universe
export interface TPAESTest {
  id: number;
  code: TPAESPrueba;
  name: string;
  description?: string;
  skillsCount: number;
  nodesCount: number;
  userProgress: number;
}
