/**
 * 🎯 SERVICIO ARSENAL EDUCATIVO COMPLETO
 * ======================================
 * Servicio principal que integra todas las funcionalidades del Arsenal Educativo
 * con Supabase como backend
 */

import { createClient, SupabaseClient } from '@supabase/supabase-js';
import {
  ArsenalEducativoService,
  NeuralCacheSession,
  CachePerformanceMetrics,
  RealTimeAnalyticsMetric,
  AnalyticsSummary,
  HUDRealTimeSession,
  HUDAlert,
  SmartNotification,
  ExercisePlaylist,
  PlaylistItem,
  PlaylistRecommendation,
  PAESSimulationAdvanced,
  ArsenalConfig,
  defaultArsenalConfig
} from '../types/arsenal-educativo.types';

export class ArsenalEducativoServiceImpl implements ArsenalEducativoService {
  private supabase: SupabaseClient;
  private config: ArsenalConfig;

  constructor(supabaseUrl: string, supabaseKey: string, config?: Partial<ArsenalConfig>) {
    this.supabase = createClient(supabaseUrl, supabaseKey);
    this.config = { ...defaultArsenalConfig, ...config };
  }

  // =====================================================================================
  // NEURAL CACHE METHODS
  // =====================================================================================

  async getNeuralCacheData(sessionKey: string): Promise<Record<string, any> | null> {
    try {
      const { data, error } = await this.supabase.rpc('get_neural_cache_data', {
        session_key_input: sessionKey
      });

      if (error) {
        console.error('Error getting neural cache data:', error);
        return null;
      }

      return data;
    } catch (error) {
      console.error('Neural cache retrieval failed:', error);
      return null;
    }
  }

  async updateCacheData(sessionKey: string, data: Record<string, any>): Promise<void> {
    try {
      const expiresAt = new Date();
      expiresAt.setMinutes(expiresAt.getMinutes() + this.config.cacheExpirationMinutes);

      const { error } = await this.supabase
        .from('neural_cache_sessions')
        .upsert({
          session_key: sessionKey,
          cache_data: data,
          expires_at: expiresAt.toISOString(),
          updated_at: new Date().toISOString()
        }, {
          onConflict: 'user_id,session_key'
        });

      if (error) {
        console.error('Error updating cache data:', error);
        throw error;
      }
    } catch (error) {
      console.error('Cache update failed:', error);
      throw error;
    }
  }

  async getCachePerformance(): Promise<CachePerformanceMetrics> {
    try {
      const { data, error } = await this.supabase
        .from('neural_cache_sessions')
        .select('cache_hits, cache_misses, optimization_score')
        .eq('user_id', (await this.supabase.auth.getUser()).data.user?.id);

      if (error) throw error;

      if (!data || data.length === 0) {
        return {
          hit_percentage: 0,
          total_requests: 0,
          average_response_time: 0,
          optimization_score: 0
        };
      }

      const totals = data.reduce((acc, session) => ({
        hits: acc.hits + session.cache_hits,
        misses: acc.misses + session.cache_misses,
        score: acc.score + session.optimization_score
      }), { hits: 0, misses: 0, score: 0 });

      const totalRequests = totals.hits + totals.misses;
      const hitPercentage = totalRequests > 0 ? (totals.hits / totalRequests) * 100 : 0;

      return {
        hit_percentage: hitPercentage,
        total_requests: totalRequests,
        average_response_time: 150, // Estimado
        optimization_score: data.length > 0 ? totals.score / data.length : 0
      };
    } catch (error) {
      console.error('Error getting cache performance:', error);
      throw error;
    }
  }

  // =====================================================================================
  // ANALYTICS METHODS
  // =====================================================================================

  async getRealTimeMetrics(): Promise<AnalyticsSummary> {
    try {
      const { data, error } = await this.supabase.rpc('get_real_time_metrics');

      if (error) {
        console.error('Error getting real-time metrics:', error);
        throw error;
      }

      return data || {
        current_session_metrics: [],
        engagement_score: 0
      };
    } catch (error) {
      console.error('Analytics retrieval failed:', error);
      throw error;
    }
  }

  async trackMetric(metricType: string, value: number, context?: Record<string, any>): Promise<void> {
    try {
      const { error } = await this.supabase
        .from('real_time_analytics_metrics')
        .insert({
          metric_type: metricType,
          metric_value: value,
          metric_context: context || {},
          timestamp_precise: new Date().toISOString()
        });

      if (error) {
        console.error('Error tracking metric:', error);
        throw error;
      }
    } catch (error) {
      console.error('Metric tracking failed:', error);
      throw error;
    }
  }

  async getEngagementTrends(): Promise<RealTimeAnalyticsMetric[]> {
    try {
      const { data, error } = await this.supabase
        .from('real_time_analytics_metrics')
        .select('*')
        .eq('user_id', (await this.supabase.auth.getUser()).data.user?.id)
        .gte('timestamp_precise', new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString())
        .order('timestamp_precise', { ascending: false })
        .limit(100);

      if (error) throw error;
      return data || [];
    } catch (error) {
      console.error('Error getting engagement trends:', error);
      return [];
    }
  }

  // =====================================================================================
  // HUD METHODS
  // =====================================================================================

  async startHUDSession(config?: Record<string, any>): Promise<HUDRealTimeSession> {
    try {
      // Cerrar sesión activa si existe
      await this.supabase
        .from('hud_real_time_sessions')
        .update({ 
          is_active: false, 
          session_end: new Date().toISOString() 
        })
        .eq('user_id', (await this.supabase.auth.getUser()).data.user?.id)
        .eq('is_active', true);

      // Crear nueva sesión
      const { data, error } = await this.supabase
        .from('hud_real_time_sessions')
        .insert({
          hud_config: config || {},
          is_active: true
        })
        .select()
        .single();

      if (error) throw error;
      return data;
    } catch (error) {
      console.error('Error starting HUD session:', error);
      throw error;
    }
  }

  async getActiveHUDSession(): Promise<HUDRealTimeSession | null> {
    try {
      const { data, error } = await this.supabase
        .from('hud_real_time_sessions')
        .select('*')
        .eq('user_id', (await this.supabase.auth.getUser()).data.user?.id)
        .eq('is_active', true)
        .single();

      if (error && error.code !== 'PGRST116') throw error;
      return data || null;
    } catch (error) {
      console.error('Error getting active HUD session:', error);
      return null;
    }
  }

  async updateHUDMetrics(metrics: Record<string, any>): Promise<void> {
    try {
      const session = await this.getActiveHUDSession();
      if (!session) return;

      const { error } = await this.supabase
        .from('hud_real_time_sessions')
        .update({
          performance_metrics: metrics,
          optimization_score: metrics.optimization_score || session.optimization_score
        })
        .eq('id', session.id);

      if (error) throw error;
    } catch (error) {
      console.error('Error updating HUD metrics:', error);
      throw error;
    }
  }

  async getHUDAlerts(): Promise<HUDAlert[]> {
    try {
      const session = await this.getActiveHUDSession();
      if (!session) return [];

      // Convertir alerts_generated a formato HUDAlert
      return session.alerts_generated.map((alert: any) => ({
        type: alert.type || 'info',
        title: alert.title || 'Alert',
        message: alert.message || '',
        timestamp: alert.timestamp || new Date().toISOString(),
        priority: alert.priority || 1
      }));
    } catch (error) {
      console.error('Error getting HUD alerts:', error);
      return [];
    }
  }

  // =====================================================================================
  // NOTIFICATIONS METHODS
  // =====================================================================================

  async getNotifications(unreadOnly: boolean = false): Promise<SmartNotification[]> {
    try {
      let query = this.supabase
        .from('smart_notifications')
        .select('*')
        .eq('user_id', (await this.supabase.auth.getUser()).data.user?.id)
        .order('created_at', { ascending: false })
        .limit(this.config.maxNotifications);

      if (unreadOnly) {
        query = query.eq('is_read', false);
      }

      const { data, error } = await query;

      if (error) throw error;
      return data || [];
    } catch (error) {
      console.error('Error getting notifications:', error);
      return [];
    }
  }

  async markAsRead(notificationId: string): Promise<void> {
    try {
      const { error } = await this.supabase
        .from('smart_notifications')
        .update({ is_read: true })
        .eq('id', notificationId)
        .eq('user_id', (await this.supabase.auth.getUser()).data.user?.id);

      if (error) throw error;
    } catch (error) {
      console.error('Error marking notification as read:', error);
      throw error;
    }
  }

  async createNotification(notification: Partial<SmartNotification>): Promise<SmartNotification> {
    try {
      const { data, error } = await this.supabase
        .from('smart_notifications')
        .insert({
          notification_type: notification.notification_type || 'insight',
          title: notification.title || '',
          message: notification.message || '',
          priority: notification.priority || 'medium',
          category: notification.category || 'general',
          metadata: notification.metadata || {}
        })
        .select()
        .single();

      if (error) throw error;
      return data;
    } catch (error) {
      console.error('Error creating notification:', error);
      throw error;
    }
  }

  // =====================================================================================
  // PLAYLISTS METHODS (Sistema Spotify)
  // =====================================================================================

  async getRecommendedPlaylists(): Promise<PlaylistRecommendation[]> {
    try {
      const { data, error } = await this.supabase.rpc('get_recommended_playlists');

      if (error) throw error;
      return data || [];
    } catch (error) {
      console.error('Error getting recommended playlists:', error);
      return [];
    }
  }

  async createPlaylist(playlist: Partial<ExercisePlaylist>): Promise<ExercisePlaylist> {
    try {
      const { data, error } = await this.supabase
        .from('exercise_playlists')
        .insert({
          title: playlist.title || '',
          description: playlist.description,
          playlist_type: playlist.playlist_type || 'custom',
          difficulty_level: playlist.difficulty_level || 'mixed',
          subject_focus: playlist.subject_focus || []
        })
        .select()
        .single();

      if (error) throw error;
      return data;
    } catch (error) {
      console.error('Error creating playlist:', error);
      throw error;
    }
  }

  async getPlaylistItems(playlistId: string): Promise<PlaylistItem[]> {
    try {
      const { data, error } = await this.supabase
        .from('playlist_items')
        .select('*')
        .eq('playlist_id', playlistId)
        .order('position');

      if (error) throw error;
      return data || [];
    } catch (error) {
      console.error('Error getting playlist items:', error);
      return [];
    }
  }

  async addToPlaylist(playlistId: string, exerciseId: string): Promise<PlaylistItem> {
    try {
      // Obtener siguiente posición
      const { data: lastItem } = await this.supabase
        .from('playlist_items')
        .select('position')
        .eq('playlist_id', playlistId)
        .order('position', { ascending: false })
        .limit(1)
        .single();

      const nextPosition = (lastItem?.position || 0) + 1;

      const { data, error } = await this.supabase
        .from('playlist_items')
        .insert({
          playlist_id: playlistId,
          exercise_id: exerciseId,
          position: nextPosition
        })
        .select()
        .single();

      if (error) throw error;
      return data;
    } catch (error) {
      console.error('Error adding to playlist:', error);
      throw error;
    }
  }

  // =====================================================================================
  // SUPERPAES METHODS
  // =====================================================================================

  async createSimulation(data: Partial<PAESSimulationAdvanced>): Promise<string> {
    try {
      const simulationData = {
        simulation_type: data.simulation_type || 'predictive',
        current_scores: data.current_scores || {},
        parameters: data.simulation_parameters || {}
      };

      const { data: result, error } = await this.supabase.rpc('create_paes_simulation', {
        simulation_data: simulationData
      });

      if (error) throw error;
      return result;
    } catch (error) {
      console.error('Error creating simulation:', error);
      throw error;
    }
  }

  async getSimulationResults(simulationId: string): Promise<PAESSimulationAdvanced> {
    try {
      const { data, error } = await this.supabase
        .from('paes_simulations_advanced')
        .select('*')
        .eq('id', simulationId)
        .eq('user_id', (await this.supabase.auth.getUser()).data.user?.id)
        .single();

      if (error) throw error;
      return data;
    } catch (error) {
      console.error('Error getting simulation results:', error);
      throw error;
    }
  }

  async getSimulationHistory(): Promise<PAESSimulationAdvanced[]> {
    try {
      const { data, error } = await this.supabase
        .from('paes_simulations_advanced')
        .select('*')
        .eq('user_id', (await this.supabase.auth.getUser()).data.user?.id)
        .order('created_at', { ascending: false })
        .limit(20);

      if (error) throw error;
      return data || [];
    } catch (error) {
      console.error('Error getting simulation history:', error);
      return [];
    }
  }
}

// =====================================================================================
// FACTORY FUNCTION
// =====================================================================================

export function createArsenalEducativoService(
  supabaseUrl: string, 
  supabaseKey: string, 
  config?: Partial<ArsenalConfig>
): ArsenalEducativoService {
  return new ArsenalEducativoServiceImpl(supabaseUrl, supabaseKey, config);
}
