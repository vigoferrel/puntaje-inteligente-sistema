
export type NeuralDimension = 
  | 'neural_command'
  | 'educational_universe' 
  | 'superpaes_coordinator'
  | 'neural_training' 
  | 'progress_analysis'
  | 'paes_simulation'
  | 'personalized_feedback'
  | 'battle_mode'
  | 'achievement_system'
  | 'vocational_prediction'
  | 'financial_center'
  | 'calendar_management'
  | 'settings_control'
  // Backwards compatibility
  | 'universe_exploration'
  | 'matrix_diagnostics'
  | 'intelligence_hub'
  | 'holographic_analytics'
  | 'paes_universe';

export interface NeuralDimensionConfig {
  id: NeuralDimension;
  name: string;
  description: string;
  icon: any;
  color: string;
  phase: 'core' | 'navigation' | 'coordination' | 'learning' | 'gamification' | 'intelligence';
  order: number;
}

export interface NeuralCommandCenterProps {
  initialDimension?: NeuralDimension;
  onNavigateToTool?: (tool: string, context?: any) => void;
}

export interface NeuralMetrics {
  neural_efficiency: number;
  adaptive_learning_score: number;
  cross_pollination_rate: number;
  user_experience_harmony: number;
  paes_simulation_accuracy: number;
  universe_exploration_depth: number;
  superpaes_coordination_level: number;
  gamification_engagement: number;
}

export interface UnifiedDataFlow {
  paesService: any;
  universeState: any;
  superpaesMetrics: any;
  gamificationProgress: any;
  personalizedPlan: any;
  simulationResults: any;
}
