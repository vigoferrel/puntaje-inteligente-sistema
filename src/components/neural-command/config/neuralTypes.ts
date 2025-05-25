
export interface NeuralCommandCenterProps {
  initialDimension?: string;
  onNavigateToTool?: (tool: string, context?: any) => void;
}

export interface DimensionActivationEvent {
  dimensionId: string;
  timestamp: Date;
  userId?: string;
  context?: any;
}

export interface NeuralMetric {
  id: string;
  label: string;
  value: number;
  max: number;
  unit: string;
  trend: 'up' | 'down' | 'stable';
  color: string;
  description: string;
}

export interface NeuralInsight {
  id: string;
  type: 'achievement' | 'warning' | 'recommendation' | 'milestone';
  title: string;
  description: string;
  priority: 'low' | 'medium' | 'high';
  actionable: boolean;
  metadata?: any;
}

export interface SystemStatus {
  overall: 'excellent' | 'good' | 'warning' | 'critical';
  subsystems: {
    neural: 'online' | 'degraded' | 'offline';
    data: 'connected' | 'syncing' | 'disconnected';
    ai: 'active' | 'limited' | 'unavailable';
    performance: 'optimal' | 'good' | 'slow';
  };
  uptime: number;
  lastUpdate: Date;
}

export interface NavigationAnalytics {
  totalInteractions: number;
  averageSessionTime: number;
  mostUsedDimensions: string[];
  userPreferences: Record<string, any>;
  performanceMetrics: {
    loadTime: number;
    renderTime: number;
    interactionLatency: number;
  };
}

// Nuevos tipos exportados necesarios
export type NeuralDimension = 
  | 'neural_command'
  | 'educational_universe'
  | 'neural_training'
  | 'progress_analysis'
  | 'paes_simulation'
  | 'personalized_feedback'
  | 'battle_mode'
  | 'achievement_system'
  | 'vocational_prediction'
  | 'financial_center'
  | 'calendar_management'
  | 'settings_control';

export interface NeuralDimensionConfig {
  id: NeuralDimension;
  name: string;
  description: string;
  color: string;
  icon: any;
  status: 'active' | 'developing' | 'conceptual';
  phase: 'foundation' | 'intelligence' | 'evolution';
}

// Legacy compatibility
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
