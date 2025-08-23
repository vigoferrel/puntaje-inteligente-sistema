
import { supabase } from '@/integrations/supabase/client';

export interface NeuralEvent {
  event_type: string;
  event_data: any;
  neural_metrics: any;
  component_source?: string;
  session_id?: string;
}

export interface AIConversation {
  session_type: string;
  context: any;
}

export interface BattleSession {
  id: string;
  battle_type: string;
  difficulty_level: string;
  subject_focus: string;
  status: 'waiting' | 'in_progress' | 'completed';
  creator_id: string;
  opponent_id?: string;
  creator_score?: number;
  opponent_score?: number;
  winner_id?: string;
  max_questions?: number;
  time_limit_minutes?: number;
  created_at: string;
  started_at?: string;
  ended_at?: string;
}

export interface NeuralNotification {
  id: string;
  user_id: string;
  title: string;
  message: string;
  type: string;
  priority: 'low' | 'medium' | 'high' | 'urgent';
  is_read: boolean;
  created_at: string;
}

export class NeuralBackendService {
  
  // Analytics Neural
  static async trackNeuralEvent(event: NeuralEvent): Promise<string> {
    const { data, error } = await supabase.functions.invoke('neural-analytics', {
      body: {
        action: 'track_event',
        data: event
      }
    });

    if (error) throw error;
    return data.session_id;
  }

  static async getNeuralAnalytics(days: number = 7): Promise<any> {
    const { data, error } = await supabase.functions.invoke('neural-analytics', {
      body: {
        action: 'get_analytics',
        data: { days }
      }
    });

    if (error) throw error;
    return data;
  }

  static async generateRecommendations(): Promise<any> {
    const { data, error } = await supabase.functions.invoke('neural-analytics', {
      body: {
        action: 'generate_recommendations',
        data: {}
      }
    });

    if (error) throw error;
    return data;
  }

  // IA Conversacional
  static async startAIConversation(conversation: AIConversation): Promise<any> {
    const { data, error } = await supabase.functions.invoke('intelligent-chat', {
      body: {
        action: 'start_conversation',
        data: conversation
      }
    });

    if (error) throw error;
    return data;
  }

  static async sendMessage(sessionId: string, message: string, neuralContext: any): Promise<any> {
    const { data, error } = await supabase.functions.invoke('intelligent-chat', {
      body: {
        action: 'send_message',
        data: {
          session_id: sessionId,
          message,
          neural_context: neuralContext
        }
      }
    });

    if (error) throw error;
    return data;
  }

  static async getConversationHistory(sessionId: string): Promise<any> {
    const { data, error } = await supabase.functions.invoke('intelligent-chat', {
      body: {
        action: 'get_conversation_history',
        data: { session_id: sessionId }
      }
    });

    if (error) throw error;
    return data;
  }

  // Sistema de Logros
  static async triggerAchievementCheck(trigger: {
    user_id: string;
    action_type: string;
    action_data: any;
  }): Promise<any> {
    const { data, error } = await supabase.functions.invoke('achievement-engine', {
      body: trigger
    });

    if (error) throw error;
    return data;
  }

  static async getUserAchievements(userId: string): Promise<any> {
    const { data, error } = await supabase
      .from('user_achievement_unlocks')
      .select(`
        *,
        intelligent_achievements (*)
      `)
      .eq('user_id', userId)
      .order('unlocked_at', { ascending: false });

    if (error) throw error;
    return data;
  }

  // Recomendaciones
  static async getUserRecommendations(userId: string): Promise<any> {
    const { data, error } = await supabase
      .from('ai_recommendations')
      .select('*')
      .eq('user_id', userId)
      .eq('is_active', true)
      .order('priority', { ascending: false })
      .limit(10);

    if (error) throw error;
    return data;
  }

  // Métricas en tiempo real
  static async updateNeuralMetrics(userId: string, metrics: any): Promise<void> {
    const { error } = await supabase
      .from('neural_metrics')
      .upsert({
        user_id: userId,
        metric_type: 'real_time',
        dimension_id: 'global',
        current_value: metrics.engagement || 0,
        metadata: metrics
      });

    if (error) throw error;
  }

  // Battle System - Métodos implementados
  static async getAvailableBattles(userId: string): Promise<BattleSession[]> {
    // Mock implementation - en producción conectaría con Supabase
    return [];
  }

  static async getUserBattles(userId: string): Promise<BattleSession[]> {
    // Mock implementation - en producción conectaría con Supabase
    return [];
  }

  static async createBattleSession(battleData: Partial<BattleSession>): Promise<BattleSession> {
    // Mock implementation - en producción conectaría con Supabase
    return {
      id: `battle_${Date.now()}`,
      battle_type: battleData.battle_type || 'quick',
      difficulty_level: battleData.difficulty_level || 'medium',
      subject_focus: battleData.subject_focus || 'general',
      status: 'waiting',
      creator_id: battleData.creator_id || '',
      created_at: new Date().toISOString()
    };
  }

  static async joinBattle(battleId: string, userId: string): Promise<BattleSession> {
    // Mock implementation - en producción conectaría con Supabase
    return {
      id: battleId,
      battle_type: 'quick',
      difficulty_level: 'medium',
      subject_focus: 'general',
      status: 'in_progress',
      creator_id: 'creator',
      opponent_id: userId,
      created_at: new Date().toISOString(),
      started_at: new Date().toISOString()
    };
  }

  static async updateBattleScore(battleId: string, userId: string, score: number): Promise<void> {
    // Mock implementation - en producción conectaría con Supabase
    console.log(`Battle ${battleId}: User ${userId} scored ${score}`);
  }

  static async completeBattle(battleId: string, winnerId?: string): Promise<void> {
    // Mock implementation - en producción conectaría con Supabase
    console.log(`Battle ${battleId} completed. Winner: ${winnerId}`);
  }

  static async updateUserRanking(userId: string, rankingType: string, scoreChange: number, metadata: any): Promise<void> {
    // Mock implementation - en producción conectaría con Supabase
    console.log(`User ${userId} ranking updated: ${rankingType} +${scoreChange}`);
  }

  static subscribeToBattleUpdates(battleId: string, callback: (battle: BattleSession) => void) {
    // Mock implementation - en producción usaría Supabase realtime
    return {
      unsubscribe: () => console.log(`Unsubscribed from battle ${battleId}`)
    };
  }

  // Notifications - Métodos implementados
  static async getUserNotifications(userId: string): Promise<NeuralNotification[]> {
    // Mock implementation - en producción conectaría con Supabase
    return [];
  }

  static async markNotificationAsRead(notificationId: string): Promise<void> {
    // Mock implementation - en producción conectaría con Supabase
    console.log(`Notification ${notificationId} marked as read`);
  }

  static async createNotification(notificationData: Omit<NeuralNotification, 'id' | 'created_at'>): Promise<NeuralNotification> {
    // Mock implementation - en producción conectaría con Supabase
    return {
      id: `notification_${Date.now()}`,
      created_at: new Date().toISOString(),
      ...notificationData
    };
  }

  static subscribeToUserNotifications(userId: string, callback: (notification: NeuralNotification) => void) {
    // Mock implementation - en producción usaría Supabase realtime
    return {
      unsubscribe: () => console.log(`Unsubscribed from notifications for user ${userId}`)
    };
  }

  // Suscripciones en tiempo real
  static subscribeToUserAchievements(userId: string, callback: (achievement: any) => void) {
    return supabase
      .channel(`user-achievements-${userId}`)
      .on(
        'postgres_changes',
        {
          event: 'INSERT',
          schema: 'public',
          table: 'user_achievement_unlocks',
          filter: `user_id=eq.${userId}`
        },
        (payload) => callback(payload.new)
      )
      .subscribe();
  }

  static subscribeToRecommendations(userId: string, callback: (recommendation: any) => void) {
    return supabase
      .channel(`user-recommendations-${userId}`)
      .on(
        'postgres_changes',
        {
          event: 'INSERT',
          schema: 'public',
          table: 'ai_recommendations',
          filter: `user_id=eq.${userId}`
        },
        (payload) => callback(payload.new)
      )
      .subscribe();
  }
}
