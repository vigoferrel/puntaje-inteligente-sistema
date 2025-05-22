
/**
 * Main module exporting all system types from their respective modules
 */

// Export types from paes-types.ts
export {
  TPAESPrueba,
  TPAESHabilidad,
  getPruebaDisplayName,
  getHabilidadDisplayName
} from './paes-types';

// Export types from learning-cycle-types.ts
export {
  TLearningCyclePhase,
  LEARNING_CYCLE_PHASES_ORDER,
  getLearningCyclePhaseDisplayName,
  getLearningCyclePhaseDescription
} from './learning-cycle-types';

// Export types from learning-node-types.ts
export { TLearningNode } from './learning-node-types';
