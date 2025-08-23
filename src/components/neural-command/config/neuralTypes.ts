
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

// Use the same structure as NeuralDimension from neuralDimensions.ts
export interface NeuralDimensionConfig {
  id: string;
  title: string;
  description: string;
  phase: 'foundation' | 'intelligence' | 'evolution';
  color: string;
  glowColor: string;
  icon: string;
  status: 'active' | 'developing' | 'conceptual';
  complexity: number;
  dependencies: string[];
  features: string[];
  // Added for compatibility
  name?: string;
}

export type NeuralDimension = string;

// Legacy compatibility
export interface NeuralMetrics {
  neural_efficiency: number;
  adaptive_learning_rate: number;
  system_coherence: number;
  user_satisfaction: number;
  paes_simulation_accuracy: number;
  universe_exploration_depth: number;
  prediction_accuracy: number;
  gamification_engagement: number;
}
