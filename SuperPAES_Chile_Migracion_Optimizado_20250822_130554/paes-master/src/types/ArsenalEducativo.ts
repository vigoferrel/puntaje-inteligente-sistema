/**
 * =====================================================================================
 * 🎯 TIPOS BASE DEL ARSENAL EDUCATIVO
 * =====================================================================================
 * Tipos fundamentales utilizados en todo el sistema Arsenal Educativo
 */

// =====================================================================================
// TIPOS BÁSICOS DEL SISTEMA
// =====================================================================================

export interface NeuralCacheData {
  id: string
  session_key: string
  cache_data: any
  neural_patterns: Record<string, any>
  cache_hits: number
  created_at: string
  updated_at: string
}

export interface RealTimeMetric {
  id: string
  metric_type: string
  value: number
  metadata: Record<string, any>
  timestamp: string
}

export interface HUDSession {
  id: string
  session_id: string
  quantum_state: Record<string, any>
  performance_metrics: Record<string, any>
  is_active: boolean
  started_at: string
}

export interface LeonardoNotification {
  id: string
  notification_type: 'achievement' | 'reminder' | 'insight' | 'challenge'
  title: string
  message: string
  metadata: Record<string, any>
  is_read: boolean
  priority: 'low' | 'medium' | 'high' | 'urgent'
  created_at: string
}

export interface ExercisePlaylist {
  id: string
  name: string
  description: string
  exercise_ids: string[]
  difficulty_level: number
  estimated_duration: number
  leonardo_optimization: Record<string, any>
  created_at: string
}

export interface PlaylistItem {
  id: string
  playlist_id: string
  exercise_id: string
  order_index: number
  adaptive_parameters: Record<string, any>
}

export interface SuperPAESSimulation {
  id: string
  simulation_type: string
  configuration: Record<string, any>
  results: Record<string, any>
  monte_carlo_iterations: number
  confidence_level: number
  created_at: string
  completed_at?: string
}

export interface ArsenalConfig {
  enableCache: boolean
  enableAnalytics: boolean
  enableHUD: boolean
  enableNotifications: boolean
  enablePlaylists: boolean
  enableSimulations: boolean
  schema: string
  supabaseUrl?: string
  supabaseKey?: string
}

// =====================================================================================
// TIPOS DE RESPUESTA RPC
// =====================================================================================

export interface RPCResponse<T = any> {
  success: boolean
  data: T
  error?: string
  metadata?: Record<string, any>
}

// =====================================================================================
// CONFIGURACIÓN DEL SISTEMA
// =====================================================================================

export const DEFAULT_ARSENAL_CONFIG: ArsenalConfig = {
  enableCache: true,
  enableAnalytics: true,
  enableHUD: true,
  enableNotifications: true,
  enablePlaylists: true,
  enableSimulations: true,
  schema: 'arsenal_educativo'
}

// =====================================================================================
// EXPORTACIÓN DE TIPOS
// =====================================================================================

export default {
  NeuralCacheData,
  RealTimeMetric,
  HUDSession,
  LeonardoNotification,
  ExercisePlaylist,
  PlaylistItem,
  SuperPAESSimulation,
  ArsenalConfig,
  RPCResponse,
  DEFAULT_ARSENAL_CONFIG
}
