
import { supabase } from '@/integrations/supabase/client';
import { NeuralBackendService } from './neural-backend-service';

export interface AchievementTrigger {
  user_id: string;
  action_type: string;
  action_data: any;
}

export class AchievementService {
  
  static async triggerAchievementCheck(trigger: AchievementTrigger): Promise<void> {
    try {
      const { data, error } = await supabase.functions.invoke('achievement-engine', {
        body: trigger
      });

      if (error) {
        console.error('Error triggering achievement check:', error);
        return;
      }

      if (data?.achievements_unlocked > 0) {
        console.log(`${data.achievements_unlocked} achievements unlocked for user ${trigger.user_id}`);
        
        // Actualizar rankings si se desbloquearon logros
        for (const achievement of data.new_achievements) {
          await NeuralBackendService.updateUserRanking(
            trigger.user_id,
            'achievement_ranking',
            achievement.points_awarded,
            {
              total_achievements: 1,
              points_earned: achievement.points_awarded
            }
          );
        }
      }
    } catch (error) {
      console.error('Error in achievement service:', error);
    }
  }

  // Triggers específicos para diferentes acciones
  static async onNodeCompleted(userId: string, nodeId: string, performance: any): Promise<void> {
    await this.triggerAchievementCheck({
      user_id: userId,
      action_type: 'node_completed',
      action_data: { node_id: nodeId, performance }
    });
  }

  static async onBattleWon(userId: string, battleId: string, battleData: any): Promise<void> {
    await this.triggerAchievementCheck({
      user_id: userId,
      action_type: 'battle_won',
      action_data: { battle_id: battleId, battle_data: battleData }
    });
  }

  static async onStudyStreak(userId: string, streakDays: number): Promise<void> {
    await this.triggerAchievementCheck({
      user_id: userId,
      action_type: 'study_streak',
      action_data: { streak_days: streakDays }
    });
  }

  static async onPAESSimulationCompleted(userId: string, simulationData: any): Promise<void> {
    await this.triggerAchievementCheck({
      user_id: userId,
      action_type: 'paes_simulation_completed',
      action_data: simulationData
    });
  }

  static async onNeuralMetricImprovement(userId: string, metricType: string, newValue: number): Promise<void> {
    await this.triggerAchievementCheck({
      user_id: userId,
      action_type: 'neural_metric_improved',
      action_data: { metric_type: metricType, value: newValue }
    });
  }

  static async onUniverseExploration(userId: string, explorationData: any): Promise<void> {
    await this.triggerAchievementCheck({
      user_id: userId,
      action_type: 'universe_explored',
      action_data: explorationData
    });
  }

  // Función para verificar logros periódicamente
  static async performPeriodicCheck(userId: string): Promise<void> {
    await this.triggerAchievementCheck({
      user_id: userId,
      action_type: 'periodic_check',
      action_data: { timestamp: new Date().toISOString() }
    });
  }
}
