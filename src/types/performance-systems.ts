
/**
 * TIPOS DE SISTEMAS DE RENDIMIENTO v2.0
 * Optimización, métricas y sistemas adaptativos
 */

// Métricas de rendimiento del sistema
export interface SystemPerformanceMetrics {
  loadTime: number;
  renderTime: number;
  interactionLatency: number;
  memoryUsage: number;
  cacheHitRate: number;
  errorRate: number;
  throughput: number;
}

// Configuración de optimización
export interface OptimizationConfig {
  enableLazyLoading: boolean;
  enablePrefetching: boolean;
  enableCaching: boolean;
  enableCompression: boolean;
  cacheStrategy: 'aggressive' | 'balanced' | 'conservative';
  loadingStrategy: 'immediate' | 'deferred' | 'adaptive';
}

// Estado del circuit breaker
export interface CircuitBreakerState {
  isOpen: boolean;
  failureCount: number;
  lastFailureTime: Date | null;
  nextAttemptTime: Date | null;
  status: 'closed' | 'open' | 'half-open';
}

// Métricas de storage
export interface StorageMetrics {
  isAvailable: boolean;
  quota: number;
  usage: number;
  cacheSize: number;
  hitRate: number;
  errorCount: number;
  lastSyncTime: Date | null;
}

// Configuración adaptativa
export interface AdaptiveSystemConfig {
  learningRate: number;
  adaptationThreshold: number;
  feedbackSensitivity: number;
  optimizationLevel: 'low' | 'medium' | 'high' | 'aggressive';
  personalizeExperience: boolean;
}

// AnalyticsEvent movido a ui-components.ts
