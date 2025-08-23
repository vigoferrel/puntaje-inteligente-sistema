
/**
 * NEURAL SYSTEM TYPES v3.0
 * Definiciones TypeScript centralizadas para el sistema neural
 */

export interface NeuralConfig {
  enableTelemetry: boolean;
  enablePredictions: boolean;
  enableHealing: boolean;
  enableInsights: boolean;
  debugMode: boolean;
  performanceMonitoring: boolean;
}

export interface NeuralMetrics {
  real_time_engagement: number;
  session_quality: number;
  learning_effectiveness: number;
  neural_coherence: number;
  user_satisfaction_index: number;
  adaptive_intelligence_score: number;
}

export interface NeuralPrediction {
  id: string;
  type: string;
  confidence: number;
  data: any;
  timestamp: number;
  expires_at?: number;
}

export interface NeuralRecommendation {
  id: string;
  type: string;
  content: any;
  priority: number;
  neural_basis: any;
  is_active: boolean;
}

export interface SystemHealth {
  overall_score: number;
  components: Map<string, ComponentHealth>;
  active_issues: string[];
  recovery_actions: string[];
  last_health_check: number;
  auto_healing_enabled: boolean;
}

export interface ComponentHealth {
  component_name: string;
  health_score: number;
  error_count: number;
  recovery_attempts: number;
  status: 'healthy' | 'warning' | 'critical' | 'recovering';
  performance_metrics: {
    render_time: number;
    memory_usage: number;
    error_rate: number;
  };
}

export interface NeuralInsight {
  id: string;
  type: 'pattern' | 'anomaly' | 'recommendation' | 'optimization';
  title: string;
  description: string;
  confidence: number;
  data: any;
  created_at: number;
}

export interface NeuralEvent {
  type: string;
  data: Record<string, any>;
  context?: any;
  neural_metrics?: NeuralMetrics;
  component_source?: string;
}

export interface NeuralSystemState {
  isInitialized: boolean;
  config: NeuralConfig;
  metrics: NeuralMetrics;
  predictions: NeuralPrediction[];
  recommendations: NeuralRecommendation[];
  systemHealth: SystemHealth;
  insights: NeuralInsight[];
  sessionId: string | null;
  error: string | null;
}

export interface NeuralSystemActions {
  initialize: (config?: Partial<NeuralConfig>) => Promise<void>;
  captureEvent: (event: NeuralEvent) => Promise<void>;
  updateMetrics: (metrics: Partial<NeuralMetrics>) => void;
  triggerPrediction: () => void;
  healComponent: (componentName: string) => Promise<boolean>;
  generateInsights: () => void;
  reset: () => Promise<void>;
}

export interface NeuralModule {
  name: string;
  initialize: () => Promise<void>;
  destroy: () => void;
  getState: () => any;
  isHealthy: () => boolean;
}
