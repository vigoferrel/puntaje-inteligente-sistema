/**
 * =====================================================================================
 * 🔗 TIPOS INTEGRADOS ARSENAL EDUCATIVO + LEONARDO
 * =====================================================================================
 * Tipos TypeScript para la integración completa del Arsenal Educativo 
 * con el sistema Leonardo/VLR existente y funcionalidades cuánticas
 */

// Re-exportar tipos base del Arsenal
export type {
  NeuralCacheSession,
  RealTimeMetric,
  HUDSession,
  SmartNotification,
  ExercisePlaylist,
  PlaylistItem,
  SuperPAESSimulation,
  ArsenalConfig
} from './ArsenalEducativo'

// =====================================================================================
// TIPOS DE INTEGRACIÓN LEONARDO
// =====================================================================================

/**
 * Estado del sistema integrado Arsenal + Leonardo
 */
export interface IntegratedSystemStatus {
  arsenal_educativo: {
    cache_sessions: number
    metrics_count: number
    user_playlists: number
    simulations: number
    active_hud_sessions: number
    status: 'operational' | 'degraded' | 'offline'
  }
  leonardo_integration: {
    enhanced_leonardo_available: boolean
    vigoleonrocks_base_available: boolean
    leonardo_integrated_tables: number
    quantum_features_active: boolean
  }
  integration_status: {
    schema_integrated: boolean
    rls_policies_active: boolean
    indexes_optimized: boolean
    functions_available: boolean
  }
  system_health: 'excellent' | 'good' | 'fair' | 'poor'
  timestamp: string
  version: string
}

/**
 * Cache neural mejorado con Leonardo
 */
export interface EnhancedNeuralCacheData {
  cache_data: Record<string, any>
  neural_patterns: Record<string, any>
  performance_metrics: Record<string, any>
  leonardo_enhancement?: {
    leonardo_response?: any
    arsenal_metrics: Record<string, any>
    integration_version: string
    unified_system: boolean
  }
  enhanced_at?: string
  integration_active: boolean
}

/**
 * Métricas en tiempo real con correlación Leonardo
 */
export interface EnhancedRealTimeMetrics {
  base_metrics: {
    current_session_metrics: Array<{
      metric_type: string
      metric_value: number
      timestamp: string
    }>
    engagement_score: number
    total_metrics: number
  }
  leonardo_integration?: {
    leonardo_correlations: any[]
    vigoleonrocks_metrics: any[]
    quantum_coherence: number
    neural_insights_available: boolean
  }
  enhanced_analytics: boolean
  timestamp: string
}

/**
 * Playlists curadas por Leonardo
 */
export interface LeonardoCuratedPlaylists {
  recommended_playlists: Array<{
    id: string
    title: string
    description: string
    playlist_type: string
    engagement_score: number
    total_exercises: number
    leonardo_optimization: Record<string, any>
    quantum_alignment: number
    composite_score: number
  }>
  leonardo_recommendations: {
    leonardo_insights: string
    quantum_recommendations: string
    personalization_active: boolean
    next_suggestion?: string
  }
  timestamp: string
  total_available: number
}

// =====================================================================================
// TIPOS CUÁNTICOS EXTENDIDOS
// =====================================================================================

/**
 * Estado cuántico para HUD
 */
export interface QuantumState {
  coherence: number
  entanglement: number
  superposition: number
  dimensional_stability: number
  neural_resonance?: number
  leonardo_correlation?: number
}

/**
 * Simulación PAES con procesamiento cuántico
 */
export interface QuantumPAESSimulation {
  id: string
  user_id: string
  simulation_type: 'predictive' | 'vocational' | 'improvement_trajectory' | 'stress_test' | 'quantum_monte_carlo'
  current_scores: Record<string, number>
  predicted_scores: Record<string, number>
  leonardo_analysis?: Record<string, any>
  quantum_factors?: QuantumState
  vigoleonrocks_correlation?: Record<string, any>
  quantum_coherence: number
  monte_carlo_iterations: number
  accuracy_score: number
  reliability_index: number
  status: 'pending' | 'running' | 'completed' | 'failed' | 'quantum_processing'
  results_summary: Record<string, any>
  created_at: string
  completed_at?: string
}

/**
 * Notificación inteligente con generación Leonardo
 */
export interface LeonardoNotification {
  id: string
  user_id: string
  notification_type: 'achievement' | 'warning' | 'insight' | 'recommendation' | 'system' | 'leonardo_insight'
  title: string
  message: string
  priority: 'low' | 'medium' | 'high' | 'critical' | 'quantum'
  category: string
  metadata: Record<string, any>
  leonardo_generated: boolean
  quantum_coherence: number
  is_read: boolean
  is_dismissed: boolean
  expires_at?: string
  created_at: string
}

/**
 * Playlist optimizada por Leonardo
 */
export interface LeonardoOptimizedPlaylist {
  id: string
  user_id: string
  title: string
  description?: string
  playlist_type: 'custom' | 'recommended' | 'adaptive' | 'daily_mix' | 'discovery' | 'leonardo_curated'
  difficulty_level: 'beginner' | 'intermediate' | 'advanced' | 'mixed' | 'quantum'
  subject_focus: string[]
  total_exercises: number
  estimated_duration: number
  completion_rate: number
  engagement_score: number
  leonardo_optimization: {
    optimized_by?: string
    optimization_level?: string
    neural_patterns_analyzed?: boolean
    personalization_active?: boolean
    quantum_enhanced?: boolean
  }
  quantum_alignment: number
  is_public: boolean
  is_featured: boolean
  play_count: number
  like_count: number
  created_at: string
  updated_at: string
}

// =====================================================================================
// TIPOS DE CONFIGURACIÓN INTEGRADA
// =====================================================================================

/**
 * Configuración extendida para integración
 */
export interface IntegratedArsenalConfig {
  // Configuración base del Arsenal
  enableCache: boolean
  enableAnalytics: boolean
  enableHUD: boolean
  enableNotifications: boolean
  enablePlaylists: boolean
  enableSimulations: boolean
  
  // Configuración de integración
  schema: string
  leonardoIntegration: boolean
  quantumProcessing: boolean
  vigoleonrocksCompatible: boolean
  
  // Parámetros de rendimiento
  cacheExpiration: number
  metricsRetention: number
  hudRefreshRate: number
  notificationBatchSize: number
  playlistMaxItems: number
  simulationTimeout: number
  
  // Configuración cuántica
  quantumThreshold: number
  quantumCoherenceMin: number
  neuralResonanceTarget: number
}

/**
 * Estadísticas de rendimiento integrado
 */
export interface IntegratedPerformanceStats {
  totalCacheSessions: number
  totalMetrics: number
  activeHUDSessions: number
  leonardoNotifications: number
  quantumPlaylists: number
  enhancedSimulations: number
  systemHealth: 'excellent' | 'good' | 'fair' | 'poor'
  integrationScore: number
  quantumReadiness: boolean
}

/**
 * Compatibilidad Leonardo/VLR
 */
export interface LeonardoCompatibility {
  vigoleonrocksAvailable: boolean
  enhancedFunctionsReady: boolean
  quantumFeaturesActive: boolean
  integrationVersion: string
  lastCompatibilityCheck: string
}

// =====================================================================================
// TIPOS DE RESPUESTA RPC INTEGRADA
// =====================================================================================

/**
 * Respuesta de función RPC mejorada
 */
export interface EnhancedRPCResponse<T = any> {
  data: T
  leonardo_metadata?: {
    processed_by: 'vigoleonrocks' | 'enhanced_leonardo' | 'arsenal_only'
    quantum_coherence: number
    neural_insights: boolean
    processing_time_ms: number
  }
  integration_status: {
    schema: string
    functions_used: string[]
    policies_applied: string[]
  }
  timestamp: string
  success: boolean
}

/**
 * Contexto Leonardo para operaciones
 */
export interface LeonardoContext {
  user_context?: string
  session_type?: string
  optimization_level?: 'basic' | 'advanced' | 'quantum'
  neural_patterns?: Record<string, any>
  quantum_state?: Partial<QuantumState>
  correlation_data?: Record<string, any>
}

// =====================================================================================
// TIPOS DE EVENTOS INTEGRADOS
// =====================================================================================

/**
 * Evento del Arsenal con Leonardo
 */
export interface ArsenalLeonardoEvent {
  type: 'cache_hit' | 'metric_recorded' | 'notification_generated' | 'simulation_completed' | 'quantum_state_changed'
  source: 'arsenal' | 'leonardo' | 'quantum_system'
  data: Record<string, any>
  leonardo_correlation?: Record<string, any>
  quantum_metrics?: Partial<QuantumState>
  timestamp: string
  user_id?: string
  session_id?: string
}

/**
 * Estado de suscripción en tiempo real
 */
export interface RealtimeSubscription {
  channel: string
  event: string
  table?: string
  schema?: string
  leonardo_enhanced: boolean
  quantum_filtered: boolean
  active: boolean
  created_at: string
}

// =====================================================================================
// TIPOS DE ERROR INTEGRADO
// =====================================================================================

/**
 * Error del sistema integrado
 */
export interface IntegratedSystemError {
  code: string
  message: string
  context: {
    arsenal_component?: string
    leonardo_function?: string
    quantum_operation?: string
    schema: string
  }
  leonardo_analysis?: {
    error_category: string
    suggested_resolution: string
    quantum_impact: boolean
  }
  timestamp: string
  severity: 'low' | 'medium' | 'high' | 'critical'
}

// =====================================================================================
// TIPOS DE VALIDACIÓN
// =====================================================================================

/**
 * Validación de esquema integrado
 */
export interface IntegratedSchemaValidation {
  arsenal_tables_valid: boolean
  leonardo_functions_valid: boolean
  quantum_features_valid: boolean
  rls_policies_active: boolean
  indexes_optimized: boolean
  integration_complete: boolean
  validation_errors: string[]
  validation_warnings: string[]
  last_validated: string
}

/**
 * Métricas de calidad cuántica
 */
export interface QuantumQualityMetrics {
  coherence_score: number
  entanglement_stability: number
  superposition_clarity: number
  leonardo_correlation_strength: number
  neural_resonance_quality: number
  overall_quantum_grade: 'A+' | 'A' | 'B+' | 'B' | 'C+' | 'C' | 'D' | 'F'
}

// =====================================================================================
// EXPORTACIONES POR DEFECTO
// =====================================================================================

export default {
  IntegratedSystemStatus,
  EnhancedNeuralCacheData,
  EnhancedRealTimeMetrics,
  LeonardoCuratedPlaylists,
  QuantumState,
  QuantumPAESSimulation,
  LeonardoNotification,
  LeonardoOptimizedPlaylist,
  IntegratedArsenalConfig,
  IntegratedPerformanceStats,
  LeonardoCompatibility,
  EnhancedRPCResponse,
  LeonardoContext,
  ArsenalLeonardoEvent,
  RealtimeSubscription,
  IntegratedSystemError,
  IntegratedSchemaValidation,
  QuantumQualityMetrics
}
