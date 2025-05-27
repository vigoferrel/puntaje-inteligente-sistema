
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
