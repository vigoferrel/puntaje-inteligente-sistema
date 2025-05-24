
// Re-export from existing services
export { fetchDiagnosticTests, submitDiagnosticResult } from './test-services';
export { fetchDiagnosticResults } from './results-services';
export { ensureDefaultDiagnosticsExist, createLocalFallbackDiagnostics } from './default-services';

// Export new hierarchical services
export {
  fetchPAESTests,
  fetchPAESSkills,
  fetchLearningNodes,
  fetchTier1CriticalNodes,
  calculateAdaptiveWeight,
  fetchUserNodeWeights,
  getRecommendedLearningPath,
  getSystemMetrics
} from './hierarchical-services';

// Export types
export type {
  LearningNode,
  NodeWeight,
  PAESTest,
  PAESSkill,
  TierPriority,
  BloomLevel,
  DifficultyLevel
} from '@/types/diagnostic';
