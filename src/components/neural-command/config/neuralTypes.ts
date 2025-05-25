
export type NeuralDimension = 
  | 'neural_training' 
  | 'progress_analysis' 
  | 'battle_mode' 
  | 'vocational_prediction' 
  | 'universe_exploration'
  | 'calendar_management'
  | 'settings_control'
  | 'financial_center'
  | 'matrix_diagnostics'
  | 'intelligence_hub'
  | 'holographic_analytics'
  | 'educational_universe'
  | 'paes_universe';

export interface NeuralDimensionConfig {
  id: NeuralDimension;
  name: string;
  description: string;
  icon: any;
  color: string;
  phase: string;
  order: number;
}

export interface NeuralCommandCenterProps {
  initialDimension?: NeuralDimension;
}

export interface NeuralMetrics {
  neural_efficiency: number;
  adaptive_learning_score: number;
  cross_pollination_rate: number;
  user_experience_harmony: number;
}
