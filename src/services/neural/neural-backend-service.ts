
import { supabase } from '@/integrations/supabase/client';

export interface BattleSession {
  id: string;
  creator_id: string;
  opponent_id?: string;
  battle_type: string;
  status: 'waiting' | 'in_progress' | 'completed' | 'cancelled';
  difficulty_level: string;
  subject_focus: string;
  max_questions: number;
  time_limit_minutes: number;
  creator_score: number;
  opponent_score: number;
  winner_id?: string;
  battle_data: any;
  started_at?: string;
  ended_at?: string;
  created_at: string;
  updated_at: string;
}

export interface Achievement {
  id: string;
  user_id: string;
  achievement_type: string;
  achievement_id: string;
  title: string;
  description?: string;
  points_awarded: number;
  rarity: 'common' | 'rare' | 'epic' | 'legendary';
  category: string;
  metadata: any;
  unlocked_at: string;
}

export interface NeuralNotification {
  id: string;
  user_id: string;
  notification_type: string;
  title: string;
  message: string;
  action_data: any;
  is_read: boolean;
  priority: 'low' | 'normal' | 'high' | 'urgent';
  expires_at?: string;
  created_at: string;
}

export class NeuralBackendService {
  
  // Battle Mode Services
  static async createBattleSession(battleData: {
    creator_id: string;
    battle_type?: string;
    difficulty_level?: string;
    subject_focus: string;
    max_questions?: number;
    time_limit_minutes?: number;
    status?: string;
  }): Promise<BattleSession> {
    const { data, error } = await supabase
      .from('battle_sessions')
      .insert({
        creator_id: battleData.creator_id,
        battle_type: battleData.battle_type || 'paes_duel',
        difficulty_level: battleData.difficulty_level || 'intermediate',
        subject_focus: battleData.subject_focus,
        max_questions: battleData.max_questions || 10,
        time_limit_minutes: battleData.time_limit_minutes || 15,
        status: battleData.status || 'waiting'
      })
      .select()
      .single();
    
    if (error) throw error;
    return data as BattleSession;
  }

  static async joinBattle(battleId: string, userId: string): Promise<BattleSession> {
    const { data, error } = await supabase
      .from('battle_sessions')
      .update({ 
        opponent_id: userId, 
        status: 'in_progress',
        started_at: new Date().toISOString()
      })
      .eq('id', battleId)
      .eq('status', 'waiting')
      .select()
      .single();
    
    if (error) throw error;
    return data as BattleSession;
  }

  static async updateBattleScore(battleId: string, userId: string, score: number): Promise<void> {
    const { data: battle } = await supabase
      .from('battle_sessions')
      .select('creator_id, opponent_id')
      .eq('id', battleId)
      .single();

    if (!battle) throw new Error('Battle not found');

    const updateField = battle.creator_id === userId ? 'creator_score' : 'opponent_score';
    
    const { error } = await supabase
      .from('battle_sessions')
      .update({ [updateField]: score })
      .eq('id', battleId);

    if (error) throw error;
  }

  static async completeBattle(battleId: string, winnerId?: string): Promise<void> {
    const { error } = await supabase
      .from('battle_sessions')
      .update({
        status: 'completed',
        winner_id: winnerId,
        ended_at: new Date().toISOString()
      })
      .eq('id', battleId);

    if (error) throw error;
  }

  static async getAvailableBattles(userId: string): Promise<BattleSession[]> {
    const { data, error } = await supabase
      .from('battle_sessions')
      .select('*')
      .eq('status', 'waiting')
      .neq('creator_id', userId)
      .order('created_at', { ascending: false });

    if (error) throw error;
    return (data || []).map(battle => ({
      ...battle,
      status: battle.status as BattleSession['status']
    }));
  }

  static async getUserBattles(userId: string): Promise<BattleSession[]> {
    const { data, error } = await supabase
      .from('battle_sessions')
      .select('*')
      .or(`creator_id.eq.${userId},opponent_id.eq.${userId}`)
      .order('created_at', { ascending: false });

    if (error) throw error;
    return (data || []).map(battle => ({
      ...battle,
      status: battle.status as BattleSession['status']
    }));
  }

  // Achievement Services
  static async unlockAchievement(
    userId: string, 
    achievementData: {
      achievement_type: string;
      achievement_id: string;
      title: string;
      description?: string;
      points_awarded: number;
      rarity: 'common' | 'rare' | 'epic' | 'legendary';
      category: string;
      metadata?: any;
    }
  ): Promise<Achievement> {
    const { data, error } = await supabase
      .from('user_achievements')
      .insert({
        ...achievementData,
        user_id: userId,
        unlocked_at: new Date().toISOString()
      })
      .select()
      .single();

    if (error) throw error;
    return {
      ...data,
      rarity: data.rarity as Achievement['rarity']
    };
  }

  static async getUserAchievements(userId: string): Promise<Achievement[]> {
    const { data, error } = await supabase
      .from('user_achievements')
      .select('*')
      .eq('user_id', userId)
      .order('unlocked_at', { ascending: false });

    if (error) throw error;
    return (data || []).map(achievement => ({
      ...achievement,
      rarity: achievement.rarity as Achievement['rarity']
    }));
  }

  // Notification Services
  static async createNotification(notificationData: {
    user_id: string;
    notification_type: string;
    title: string;
    message: string;
    action_data?: any;
    is_read?: boolean;
    priority?: 'low' | 'normal' | 'high' | 'urgent';
    expires_at?: string;
  }): Promise<NeuralNotification> {
    const { data, error } = await supabase
      .from('user_notifications')
      .insert({
        ...notificationData,
        created_at: new Date().toISOString()
      })
      .select()
      .single();

    if (error) throw error;
    return {
      ...data,
      priority: data.priority as NeuralNotification['priority']
    };
  }

  static async getUserNotifications(userId: string, unreadOnly = false): Promise<NeuralNotification[]> {
    let query = supabase
      .from('user_notifications')
      .select('*')
      .eq('user_id', userId);

    if (unreadOnly) {
      query = query.eq('is_read', false);
    }

    const { data, error } = await query.order('created_at', { ascending: false });

    if (error) throw error;
    return (data || []).map(notification => ({
      ...notification,
      priority: notification.priority as NeuralNotification['priority']
    }));
  }

  static async markNotificationAsRead(notificationId: string): Promise<void> {
    const { error } = await supabase
      .from('user_notifications')
      .update({ is_read: true })
      .eq('id', notificationId);

    if (error) throw error;
  }

  // Rankings Services
  static async updateUserRanking(
    userId: string, 
    rankingType: string, 
    score: number,
    additionalData: any = {}
  ): Promise<void> {
    const { error } = await supabase
      .from('user_rankings')
      .upsert({
        user_id: userId,
        ranking_type: rankingType,
        score: score,
        updated_at: new Date().toISOString(),
        ...additionalData
      }, { onConflict: 'user_id,ranking_type,season' });

    if (error) throw error;
  }

  static async getLeaderboard(rankingType: string, limit = 100): Promise<any[]> {
    const { data, error } = await supabase
      .from('user_rankings')
      .select(`
        *,
        profiles!inner(name, email)
      `)
      .eq('ranking_type', rankingType)
      .order('score', { ascending: false })
      .limit(limit);

    if (error) throw error;
    return data || [];
  }

  // Neural Metrics Services
  static async updateNeuralMetric(
    userId: string,
    metricType: string,
    dimensionId: string,
    value: number,
    metadata: any = {}
  ): Promise<void> {
    // Obtener valor anterior
    const { data: existing } = await supabase
      .from('neural_metrics')
      .select('current_value')
      .eq('user_id', userId)
      .eq('metric_type', metricType)
      .eq('dimension_id', dimensionId)
      .single();

    const previousValue = existing?.current_value || 0;
    const changeRate = value - previousValue;
    const trend = changeRate > 0 ? 'improving' : changeRate < 0 ? 'declining' : 'stable';

    const { error } = await supabase
      .from('neural_metrics')
      .upsert({
        user_id: userId,
        metric_type: metricType,
        dimension_id: dimensionId,
        current_value: value,
        previous_value: previousValue,
        change_rate: changeRate,
        trend: trend,
        last_calculated_at: new Date().toISOString(),
        metadata: metadata
      }, { onConflict: 'user_id,metric_type,dimension_id' });

    if (error) throw error;
  }

  static async getNeuralMetrics(userId: string): Promise<any[]> {
    const { data, error } = await supabase
      .from('neural_metrics')
      .select('*')
      .eq('user_id', userId)
      .order('last_calculated_at', { ascending: false });

    if (error) throw error;
    return data || [];
  }

  // Real-time subscriptions
  static subscribeToUserNotifications(userId: string, callback: (notification: NeuralNotification) => void) {
    return supabase
      .channel(`user-notifications-${userId}`)
      .on(
        'postgres_changes',
        {
          event: 'INSERT',
          schema: 'public',
          table: 'user_notifications',
          filter: `user_id=eq.${userId}`
        },
        (payload) => callback({
          ...payload.new,
          priority: payload.new.priority as NeuralNotification['priority']
        } as NeuralNotification)
      )
      .subscribe();
  }

  static subscribeToBattleUpdates(battleId: string, callback: (battle: BattleSession) => void) {
    return supabase
      .channel(`battle-${battleId}`)
      .on(
        'postgres_changes',
        {
          event: 'UPDATE',
          schema: 'public',
          table: 'battle_sessions',
          filter: `id=eq.${battleId}`
        },
        (payload) => callback({
          ...payload.new,
          status: payload.new.status as BattleSession['status']
        } as BattleSession)
      )
      .subscribe();
  }
}
