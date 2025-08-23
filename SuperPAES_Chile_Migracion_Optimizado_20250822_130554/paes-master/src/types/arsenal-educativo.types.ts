/**
 * 🎯 TYPES - ARSENAL EDUCATIVO COMPLETO
 * =====================================
 * Definiciones de tipos para el sistema completo del Arsenal Educativo
 */

// =====================================================================================
// NEURAL CACHE TYPES
// =====================================================================================

export interface NeuralCacheSession {
  id: string;
  user_id: string;
  session_key: string;
  cache_data: Record<string, any>;
  neural_patterns?: Record<string, any>;
  performance_metrics?: Record<string, any>;
  cache_hits: number;
  cache_misses: number;
  optimization_score: number;
  expires_at?: string;
  created_at: string;
  updated_at: string;
}

export interface CachePerformanceMetrics {
  hit_percentage: number;
  total_requests: number;
  average_response_time: number;
  optimization_score: number;
}

// =====================================================================================
// ANALYTICS TYPES
// =====================================================================================

export interface RealTimeAnalyticsMetric {
  id: string;
  user_id: string;
  metric_type: string;
  metric_value: number;
  metric_context?: Record<string, any>;
  neural_patterns?: Record<string, any>;
  engagement_data?: Record<string, any>;
  performance_indicators?: Record<string, any>;
  trend_analysis?: Record<string, any>;
  anomaly_detection?: Record<string, any>;
  real_time_score: number;
  session_id?: string;
  timestamp_precise: string;
  created_at: string;
}

export interface AnalyticsSummary {
  current_session_metrics: Array<{
    metric_type: string;
    metric_value: number;
    timestamp: string;
  }>;
  engagement_score: number;
}

// =====================================================================================
// HUD TYPES
// =====================================================================================

export interface HUDRealTimeSession {
  id: string;
  user_id: string;
  session_start: string;
  session_end?: string;
  hud_config: Record<string, any>;
  performance_metrics: Record<string, any>;
  neural_patterns: Record<string, any>;
  alerts_generated: any[];
  optimization_score: number;
  is_active: boolean;
  created_at: string;
}

export interface HUDAlert {
  type: 'success' | 'warning' | 'error' | 'info';
  title: string;
  message: string;
  timestamp: string;
  priority: number;
}

// =====================================================================================
// NOTIFICATIONS TYPES
// =====================================================================================

export type NotificationType = 'achievement' | 'warning' | 'insight' | 'recommendation' | 'system';
export type NotificationPriority = 'low' | 'medium' | 'high' | 'critical';

export interface SmartNotification {
  id: string;
  user_id: string;
  notification_type: NotificationType;
  title: string;
  message: string;
  priority: NotificationPriority;
  category: string;
  metadata: Record<string, any>;
  is_read: boolean;
  is_dismissed: boolean;
  expires_at?: string;
  created_at: string;
}

// =====================================================================================
// PLAYLISTS TYPES (Sistema Spotify)
// =====================================================================================

export type PlaylistType = 'custom' | 'recommended' | 'adaptive' | 'daily_mix' | 'discovery';
export type DifficultyLevel = 'beginner' | 'intermediate' | 'advanced' | 'mixed';

export interface ExercisePlaylist {
  id: string;
  user_id: string;
  title: string;
  description?: string;
  playlist_type: PlaylistType;
  difficulty_level: DifficultyLevel;
  subject_focus: string[];
  total_exercises: number;
  estimated_duration: number;
  completion_rate: number;
  engagement_score: number;
  is_public: boolean;
  is_featured: boolean;
  play_count: number;
  like_count: number;
  created_at: string;
  updated_at: string;
}

export interface PlaylistItem {
  id: string;
  playlist_id: string;
  exercise_id: string;
  position: number;
  is_completed: boolean;
  completion_time?: number;
  score_achieved?: number;
  attempts_count: number;
  adaptive_difficulty: number;
  neural_feedback: Record<string, any>;
  created_at: string;
}

export interface PlaylistRecommendation {
  id: string;
  title: string;
  description?: string;
  playlist_type: PlaylistType;
  engagement_score: number;
  total_exercises: number;
}

// =====================================================================================
// SUPERPAES TYPES
// =====================================================================================

export type SimulationType = 'predictive' | 'vocational' | 'improvement_trajectory' | 'stress_test';
export type SimulationStatus = 'pending' | 'running' | 'completed' | 'failed';

export interface PAESSimulationAdvanced {
  id: string;
  user_id: string;
  simulation_type: SimulationType;
  current_scores: Record<string, any>;
  predicted_scores?: Record<string, any>;
  vocational_alignment?: Record<string, any>;
  improvement_trajectory?: Record<string, any>;
  confidence_intervals?: Record<string, any>;
  simulation_parameters: Record<string, any>;
  monte_carlo_iterations: number;
  accuracy_score: number;
  reliability_index: number;
  execution_time_ms?: number;
  status: SimulationStatus;
  results_summary: Record<string, any>;
  created_at: string;
  completed_at?: string;
}

export interface SimulationResults {
  predicted_scores: {
    lenguaje: number;
    matematicas: number;
    ciencias: number;
    historia: number;
  };
  confidence_intervals: {
    lower: Record<string, number>;
    upper: Record<string, number>;
  };
  vocational_alignment: {
    area: string;
    confidence: number;
    recommendations: string[];
  };
  improvement_strategy: {
    priority_subjects: string[];
    estimated_improvement: Record<string, number>;
    timeline: string;
  };
}

// =====================================================================================
// SERVICE INTERFACES
// =====================================================================================

export interface ArsenalEducativoService {
  // Cache Neural
  getNeuralCacheData(sessionKey: string): Promise<Record<string, any> | null>;
  updateCacheData(sessionKey: string, data: Record<string, any>): Promise<void>;
  getCachePerformance(): Promise<CachePerformanceMetrics>;

  // Analytics
  getRealTimeMetrics(): Promise<AnalyticsSummary>;
  trackMetric(metricType: string, value: number, context?: Record<string, any>): Promise<void>;
  getEngagementTrends(): Promise<RealTimeAnalyticsMetric[]>;

  // HUD
  startHUDSession(config?: Record<string, any>): Promise<HUDRealTimeSession>;
  getActiveHUDSession(): Promise<HUDRealTimeSession | null>;
  updateHUDMetrics(metrics: Record<string, any>): Promise<void>;
  getHUDAlerts(): Promise<HUDAlert[]>;

  // Notificaciones
  getNotifications(unreadOnly?: boolean): Promise<SmartNotification[]>;
  markAsRead(notificationId: string): Promise<void>;
  createNotification(notification: Partial<SmartNotification>): Promise<SmartNotification>;

  // Playlists (Sistema Spotify)
  getRecommendedPlaylists(): Promise<PlaylistRecommendation[]>;
  createPlaylist(playlist: Partial<ExercisePlaylist>): Promise<ExercisePlaylist>;
  getPlaylistItems(playlistId: string): Promise<PlaylistItem[]>;
  addToPlaylist(playlistId: string, exerciseId: string): Promise<PlaylistItem>;

  // SuperPAES
  createSimulation(data: Partial<PAESSimulationAdvanced>): Promise<string>;
  getSimulationResults(simulationId: string): Promise<PAESSimulationAdvanced>;
  getSimulationHistory(): Promise<PAESSimulationAdvanced[]>;
}

// =====================================================================================
// HOOK RETURN TYPES
// =====================================================================================

export interface UseArsenalEducativoReturn {
  // Estados
  isLoading: boolean;
  error: string | null;
  
  // Cache Neural
  cacheData: Record<string, any>;
  cachePerformance: CachePerformanceMetrics | null;
  getCacheData: (sessionKey: string) => Promise<void>;
  updateCache: (sessionKey: string, data: Record<string, any>) => Promise<void>;

  // Analytics
  analytics: AnalyticsSummary | null;
  engagementTrends: RealTimeAnalyticsMetric[];
  trackUserMetric: (type: string, value: number, context?: Record<string, any>) => Promise<void>;

  // HUD
  hudSession: HUDRealTimeSession | null;
  hudAlerts: HUDAlert[];
  startHUD: (config?: Record<string, any>) => Promise<void>;
  updateHUDData: (metrics: Record<string, any>) => Promise<void>;

  // Notificaciones
  notifications: SmartNotification[];
  unreadCount: number;
  markNotificationRead: (id: string) => Promise<void>;
  sendNotification: (notification: Partial<SmartNotification>) => Promise<void>;

  // Playlists
  recommendedPlaylists: PlaylistRecommendation[];
  myPlaylists: ExercisePlaylist[];
  currentPlaylist: ExercisePlaylist | null;
  playlistItems: PlaylistItem[];
  loadRecommendations: () => Promise<void>;
  createNewPlaylist: (playlist: Partial<ExercisePlaylist>) => Promise<void>;

  // SuperPAES
  simulations: PAESSimulationAdvanced[];
  currentSimulation: PAESSimulationAdvanced | null;
  runSimulation: (type: SimulationType, data: any) => Promise<string>;
  getResults: (simulationId: string) => Promise<void>;
}

// =====================================================================================
// CONFIGURATION TYPES
// =====================================================================================

export interface ArsenalConfig {
  enableNeuralCache: boolean;
  enableRealTimeAnalytics: boolean;
  enableHUD: boolean;
  enableNotifications: boolean;
  enablePlaylists: boolean;
  enableSuperPAES: boolean;
  cacheExpirationMinutes: number;
  analyticsUpdateInterval: number;
  hudRefreshRate: number;
  maxNotifications: number;
  playlistRecommendationLimit: number;
  simulationTimeout: number;
}

export const defaultArsenalConfig: ArsenalConfig = {
  enableNeuralCache: true,
  enableRealTimeAnalytics: true,
  enableHUD: true,
  enableNotifications: true,
  enablePlaylists: true,
  enableSuperPAES: true,
  cacheExpirationMinutes: 60,
  analyticsUpdateInterval: 5000,
  hudRefreshRate: 1000,
  maxNotifications: 50,
  playlistRecommendationLimit: 10,
  simulationTimeout: 30000
};
