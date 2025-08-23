
import { supabase } from '@/integrations/supabase/client';
import { PAESTest, PAESSkill, transformPAESTest, transformPAESSkill } from '@/types/unified-diagnostic';
import { TPAESPrueba, TPAESHabilidad } from '@/types/system-types';

/**
 * Pure Supabase service for diagnostic data - no React hooks
 */
export class DiagnosticSupabaseService {
  
  static async loadPAESTests(): Promise<PAESTest[]> {
    try {
      const { data, error } = await supabase
        .from('paes_tests')
        .select('*')
        .order('id');

      if (error) throw error;

      return data.map(transformPAESTest);
    } catch (error) {
      console.error('Error loading PAES tests:', error);
      throw error;
    }
  }

  static async loadPAESSkills(): Promise<PAESSkill[]> {
    try {
      const { data, error } = await supabase
        .from('paes_skills')
        .select('*')
        .order('display_order');

      if (error) throw error;

      return data.map(transformPAESSkill);
    } catch (error) {
      console.error('Error loading PAES skills:', error);
      throw error;
    }
  }

  static async loadDiagnosticResults(userId: string) {
    try {
      const { data, error } = await supabase
        .from('user_diagnostic_results')
        .select('*')
        .eq('user_id', userId)
        .order('completed_at', { ascending: false });

      if (error) throw error;
      return data || [];
    } catch (error) {
      console.error('Error loading diagnostic results:', error);
      throw error;
    }
  }

  static async loadExerciseAttempts(userId: string) {
    try {
      const { data, error } = await supabase
        .from('user_exercise_attempts')
        .select('*')
        .eq('user_id', userId)
        .order('created_at', { ascending: false });

      if (error) throw error;
      return data || [];
    } catch (error) {
      console.error('Error loading exercise attempts:', error);
      throw error;
    }
  }

  static async loadNodeProgress(userId: string) {
    try {
      const { data, error } = await supabase
        .from('user_node_progress')
        .select('*')
        .eq('user_id', userId);

      if (error) throw error;
      return data || [];
    } catch (error) {
      console.error('Error loading node progress:', error);
      throw error;
    }
  }

  static calculateProgressTrends(diagnosticResults: any[]) {
    return diagnosticResults.slice(0, 10).reverse().map((result, index) => {
      const prevResult = index > 0 ? diagnosticResults[diagnosticResults.length - index] : null;
      const improvements: Record<TPAESPrueba, number> = {} as Record<TPAESPrueba, number>;
      
      if (prevResult) {
        Object.keys(result.results).forEach(prueba => {
          const currentScore = result.results[prueba] || 0;
          const prevScore = prevResult.results[prueba] || 0;
          improvements[prueba as TPAESPrueba] = currentScore - prevScore;
        });
      }
      
      return {
        date: result.completed_at,
        scores: result.results,
        improvements
      };
    });
  }

  static analyzeSkillsFromExercises(exerciseAttempts: any[]) {
    const skillStats: Record<string, any> = {};

    exerciseAttempts.forEach(attempt => {
      const skill = attempt.skill_demonstrated;
      if (!skillStats[skill]) {
        skillStats[skill] = {
          total: 0,
          correct: 0,
          timeSpent: 0,
          recent: []
        };
      }

      skillStats[skill].total++;
      if (attempt.is_correct) skillStats[skill].correct++;
      skillStats[skill].recent.push({
        date: attempt.created_at,
        correct: attempt.is_correct
      });
    });

    // Convert to final format
    const analysis: Record<TPAESHabilidad, any> = {
      'TRACK_LOCATE': { level: 0, trend: 'stable', exercises_completed: 0, accuracy_rate: 0, time_spent_minutes: 0, recommendations: [] },
      'INTERPRET_RELATE': { level: 0, trend: 'stable', exercises_completed: 0, accuracy_rate: 0, time_spent_minutes: 0, recommendations: [] },
      'EVALUATE_REFLECT': { level: 0, trend: 'stable', exercises_completed: 0, accuracy_rate: 0, time_spent_minutes: 0, recommendations: [] },
      'SOLVE_PROBLEMS': { level: 0, trend: 'stable', exercises_completed: 0, accuracy_rate: 0, time_spent_minutes: 0, recommendations: [] },
      'REPRESENT': { level: 0, trend: 'stable', exercises_completed: 0, accuracy_rate: 0, time_spent_minutes: 0, recommendations: [] },
      'MODEL': { level: 0, trend: 'stable', exercises_completed: 0, accuracy_rate: 0, time_spent_minutes: 0, recommendations: [] },
      'ARGUE_COMMUNICATE': { level: 0, trend: 'stable', exercises_completed: 0, accuracy_rate: 0, time_spent_minutes: 0, recommendations: [] },
      'IDENTIFY_THEORIES': { level: 0, trend: 'stable', exercises_completed: 0, accuracy_rate: 0, time_spent_minutes: 0, recommendations: [] },
      'PROCESS_ANALYZE': { level: 0, trend: 'stable', exercises_completed: 0, accuracy_rate: 0, time_spent_minutes: 0, recommendations: [] },
      'APPLY_PRINCIPLES': { level: 0, trend: 'stable', exercises_completed: 0, accuracy_rate: 0, time_spent_minutes: 0, recommendations: [] },
      'SCIENTIFIC_ARGUMENT': { level: 0, trend: 'stable', exercises_completed: 0, accuracy_rate: 0, time_spent_minutes: 0, recommendations: [] },
      'TEMPORAL_THINKING': { level: 0, trend: 'stable', exercises_completed: 0, accuracy_rate: 0, time_spent_minutes: 0, recommendations: [] },
      'SOURCE_ANALYSIS': { level: 0, trend: 'stable', exercises_completed: 0, accuracy_rate: 0, time_spent_minutes: 0, recommendations: [] },
      'MULTICAUSAL_ANALYSIS': { level: 0, trend: 'stable', exercises_completed: 0, accuracy_rate: 0, time_spent_minutes: 0, recommendations: [] },
      'CRITICAL_THINKING': { level: 0, trend: 'stable', exercises_completed: 0, accuracy_rate: 0, time_spent_minutes: 0, recommendations: [] },
      'REFLECTION': { level: 0, trend: 'stable', exercises_completed: 0, accuracy_rate: 0, time_spent_minutes: 0, recommendations: [] }
    };

    Object.entries(skillStats).forEach(([skill, stats]) => {
      if (skill in analysis) {
        const accuracyRate = stats.total > 0 ? stats.correct / stats.total : 0;
        const recentTrend = this.calculateTrend(stats.recent);
        
        analysis[skill as TPAESHabilidad] = {
          level: accuracyRate,
          trend: recentTrend,
          exercises_completed: stats.total,
          accuracy_rate: accuracyRate,
          time_spent_minutes: Math.round(stats.timeSpent / 60000),
          recommendations: this.generateSkillRecommendations(skill as TPAESHabilidad, accuracyRate, recentTrend)
        };
      }
    });

    return analysis;
  }

  private static calculateTrend(recent: any[]) {
    if (recent.length < 3) return 'stable';
    const recentAccuracy = recent.slice(-5).filter(r => r.correct).length / Math.min(5, recent.length);
    const olderAccuracy = recent.slice(-10, -5).filter(r => r.correct).length / Math.min(5, recent.slice(-10, -5).length);
    
    if (recentAccuracy > olderAccuracy + 0.1) return 'improving';
    if (recentAccuracy < olderAccuracy - 0.1) return 'declining';
    return 'stable';
  }

  private static generateSkillRecommendations(skill: TPAESHabilidad, accuracy: number, trend: string) {
    const recommendations = [];
    
    if (accuracy < 0.6) {
      recommendations.push(`Enfócate en ejercicios básicos de ${skill}`);
      recommendations.push('Revisa conceptos fundamentales');
    }
    
    if (trend === 'declining') {
      recommendations.push('Necesitas práctica adicional en esta habilidad');
    }
    
    if (accuracy > 0.8) {
      recommendations.push('Prueba ejercicios de mayor dificultad');
    }

    return recommendations;
  }
}
