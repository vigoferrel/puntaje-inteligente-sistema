
import { supabase } from '@/integrations/supabase/client';
import { logger } from '@/core/logging/SystemLogger';

interface UnifiedDashboardMetrics {
  completedNodes: number;
  weeklyProgress: number;
  totalStudyTime: number;
  currentStreak: number;
  overallProgress: number;
  neuralEfficiency: number;
  adaptiveLearning: number;
  systemHealth: number;
  activeModules: string[];
  recentActivity: any[];
}

interface ModuleStatus {
  lectoguia: { active: boolean; sessionCount: number; lastActivity?: Date };
  diagnostic: { active: boolean; completedTests: number; nextRecommended?: string };
  planning: { active: boolean; activePlans: number; nextDeadline?: Date };
  universe: { active: boolean; explorationLevel: number; unlockedAreas: number };
  financial: { active: boolean; simulationsCount: number; scholarshipMatches: number };
  achievements: { active: boolean; totalPoints: number; unlockedBadges: number };
}

export class UnifiedDashboardService {
  static async getUserMetrics(userId: string): Promise<UnifiedDashboardMetrics> {
    try {
      logger.info('UnifiedDashboardService', 'Fetching user metrics', { userId });

      // Obtener progreso de nodos
      const { data: nodeProgress } = await supabase
        .from('user_node_progress')
        .select('*')
        .eq('user_id', userId);

      // Obtener intentos de ejercicios para calcular tiempo de estudio - CORREGIDO: usar created_at
      const { data: exerciseAttempts } = await supabase
        .from('user_exercise_attempts')
        .select('*')
        .eq('user_id', userId);

      // Obtener conversaciones de LectoGuía
      const { data: conversations } = await supabase
        .from('lectoguia_conversations')
        .select('*')
        .eq('user_id', userId);

      // Obtener planes generados
      const { data: studyPlans } = await supabase
        .from('generated_study_plans')
        .select('*')
        .eq('user_id', userId)
        .eq('is_active', true);

      // Calcular métricas
      const completedNodes = nodeProgress?.filter(p => p.status === 'completed').length || 0;
      const totalExercises = exerciseAttempts?.length || 0;
      const correctExercises = exerciseAttempts?.filter(e => e.is_correct).length || 0;
      const totalStudyTime = exerciseAttempts?.reduce((sum, e) => sum + (e.time_taken_seconds || 0), 0) || 0;
      
      // Calcular progreso semanal (actividad en los últimos 7 días) - CORREGIDO: usar created_at
      const oneWeekAgo = new Date();
      oneWeekAgo.setDate(oneWeekAgo.getDate() - 7);
      const weeklyActivity = exerciseAttempts?.filter(e => 
        new Date(e.created_at) > oneWeekAgo
      ).length || 0;

      // Calcular racha actual
      const currentStreak = await this.calculateCurrentStreak(userId);

      // Métricas neurales calculadas
      const overallProgress = completedNodes > 0 ? Math.min(100, (completedNodes / 50) * 100) : 0;
      const neuralEfficiency = totalExercises > 0 ? (correctExercises / totalExercises) * 100 : 0;
      const adaptiveLearning = Math.min(100, (conversations?.length || 0) * 5);
      const systemHealth = Math.round((overallProgress + neuralEfficiency + adaptiveLearning) / 3);

      const recentActivity = [
        ...exerciseAttempts?.slice(-5).map(e => ({
          type: 'exercise',
          timestamp: e.created_at, // CORREGIDO: usar created_at
          success: e.is_correct
        })) || [],
        ...conversations?.slice(-3).map(c => ({
          type: 'conversation',
          timestamp: c.created_at,
          subject: c.subject_context
        })) || []
      ].sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime()).slice(0, 10);

      return {
        completedNodes,
        weeklyProgress: Math.min(100, weeklyActivity * 10),
        totalStudyTime: Math.round(totalStudyTime / 60), // en minutos
        currentStreak,
        overallProgress: Math.round(overallProgress),
        neuralEfficiency: Math.round(neuralEfficiency),
        adaptiveLearning: Math.round(adaptiveLearning),
        systemHealth: Math.round(systemHealth),
        activeModules: ['lectoguia', 'diagnostic', 'planning'],
        recentActivity
      };
    } catch (error) {
      logger.error('UnifiedDashboardService', 'Error fetching user metrics', error);
      return {
        completedNodes: 0,
        weeklyProgress: 0,
        totalStudyTime: 0,
        currentStreak: 0,
        overallProgress: 0,
        neuralEfficiency: 0,
        adaptiveLearning: 0,
        systemHealth: 0,
        activeModules: [],
        recentActivity: []
      };
    }
  }

  static async getModuleStatus(userId: string): Promise<ModuleStatus> {
    try {
      const [conversations, diagnosticResults, studyPlans, financialSims] = await Promise.all([
        supabase.from('lectoguia_conversations').select('*').eq('user_id', userId),
        supabase.from('user_diagnostic_results').select('*').eq('user_id', userId),
        supabase.from('generated_study_plans').select('*').eq('user_id', userId).eq('is_active', true),
        supabase.from('financial_simulations').select('*').eq('user_id', userId)
      ]);

      return {
        lectoguia: {
          active: (conversations.data?.length || 0) > 0,
          sessionCount: conversations.data?.length || 0,
          lastActivity: conversations.data?.[0]?.created_at ? new Date(conversations.data[0].created_at) : undefined
        },
        diagnostic: {
          active: (diagnosticResults.data?.length || 0) > 0,
          completedTests: diagnosticResults.data?.length || 0,
          nextRecommended: 'Evaluación de Matemáticas'
        },
        planning: {
          active: (studyPlans.data?.length || 0) > 0,
          activePlans: studyPlans.data?.length || 0,
          nextDeadline: studyPlans.data?.[0] ? new Date() : undefined
        },
        universe: {
          active: true,
          explorationLevel: Math.min(100, (conversations.data?.length || 0) * 10),
          unlockedAreas: Math.min(8, Math.floor((conversations.data?.length || 0) / 5))
        },
        financial: {
          active: (financialSims.data?.length || 0) > 0,
          simulationsCount: financialSims.data?.length || 0,
          scholarshipMatches: 12 // Simulado por ahora
        },
        achievements: {
          active: true,
          totalPoints: (conversations.data?.length || 0) * 50 + (diagnosticResults.data?.length || 0) * 100,
          unlockedBadges: Math.floor(((conversations.data?.length || 0) + (diagnosticResults.data?.length || 0)) / 3)
        }
      };
    } catch (error) {
      logger.error('UnifiedDashboardService', 'Error fetching module status', error);
      return {
        lectoguia: { active: false, sessionCount: 0 },
        diagnostic: { active: false, completedTests: 0 },
        planning: { active: false, activePlans: 0 },
        universe: { active: false, explorationLevel: 0, unlockedAreas: 0 },
        financial: { active: false, simulationsCount: 0, scholarshipMatches: 0 },
        achievements: { active: false, totalPoints: 0, unlockedBadges: 0 }
      };
    }
  }

  private static async calculateCurrentStreak(userId: string): Promise<number> {
    try {
      // CORREGIDO: usar created_at en lugar de attempted_at
      const { data: attempts } = await supabase
        .from('user_exercise_attempts')
        .select('created_at')
        .eq('user_id', userId)
        .order('created_at', { ascending: false })
        .limit(30);

      if (!attempts || attempts.length === 0) return 0;

      let streak = 0;
      let currentDate = new Date();
      currentDate.setHours(0, 0, 0, 0);

      for (let i = 0; i < attempts.length; i++) {
        const attemptDate = new Date(attempts[i].created_at); // CORREGIDO: usar created_at
        attemptDate.setHours(0, 0, 0, 0);

        const diffDays = Math.floor((currentDate.getTime() - attemptDate.getTime()) / (1000 * 60 * 60 * 24));

        if (diffDays === streak) {
          streak++;
          currentDate.setDate(currentDate.getDate() - 1);
        } else if (diffDays > streak) {
          break;
        }
      }

      return streak;
    } catch (error) {
      return 0;
    }
  }
}
