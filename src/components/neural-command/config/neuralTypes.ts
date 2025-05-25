
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
