
import { supabase } from '@/integrations/supabase/client';
import { TPAESPrueba, TPAESHabilidad } from '@/types/system-types';

export interface PAESAnalytics {
  userId: string;
  prueba: TPAESPrueba;
  totalAttempts: number;
  correctAttempts: number;
  accuracy: number;
  skillBreakdown: Record<TPAESHabilidad, {
    attempts: number;
    correct: number;
    accuracy: number;
  }>;
  averageTime?: number;
  lastActivity: string;
}

export async function getUserPAESAnalytics(userId: string, prueba?: TPAESPrueba): Promise<PAESAnalytics[]> {
  try {
    let query = supabase
      .from('user_exercise_attempts')
      .select('*')
      .eq('user_id', userId);

    if (prueba) {
      // Since we don't have a prueba field directly, we'll work with all data
      // and filter based on skill_demonstrated patterns
    }

    const { data: attempts, error } = await query;
    
    if (error) {
      console.error('Error fetching PAES analytics:', error);
      return [];
    }

    if (!attempts || attempts.length === 0) {
      return [];
    }

    // Group attempts by skill to create analytics
    const skillGroups: Record<string, any[]> = {};
    attempts.forEach(attempt => {
      const skill = attempt.skill_demonstrated || 'UNKNOWN';
      if (!skillGroups[skill]) {
        skillGroups[skill] = [];
      }
      skillGroups[skill].push(attempt);
    });

    // Create analytics for each skill group (treating as different pruebas)
    const analyticsResults: PAESAnalytics[] = [];
    
    // Create a general analytics entry
    const totalAttempts = attempts.length;
    const correctAttempts = attempts.filter(a => a.is_correct).length;
    const accuracy = totalAttempts > 0 ? correctAttempts / totalAttempts : 0;

    const skillBreakdown: Record<string, any> = {};
    Object.entries(skillGroups).forEach(([skill, skillAttempts]) => {
      const skillCorrect = skillAttempts.filter(a => a.is_correct).length;
      skillBreakdown[skill] = {
        attempts: skillAttempts.length,
        correct: skillCorrect,
        accuracy: skillAttempts.length > 0 ? skillCorrect / skillAttempts.length : 0
      };
    });

    const analytics: PAESAnalytics = {
      userId,
      prueba: prueba || 'COMPETENCIA_LECTORA',
      totalAttempts,
      correctAttempts,
      accuracy,
      skillBreakdown,
      lastActivity: attempts[attempts.length - 1]?.created_at || new Date().toISOString()
    };

    analyticsResults.push(analytics);
    
    return analyticsResults;
  } catch (error) {
    console.error('Error in getUserPAESAnalytics:', error);
    return [];
  }
}

export async function getSkillPerformanceAnalytics(userId: string, skill: TPAESHabilidad): Promise<{
  totalAttempts: number;
  correctAttempts: number;
  accuracy: number;
  recentTrend: 'improving' | 'declining' | 'stable';
  lastFiveResults: boolean[];
}> {
  try {
    const { data: attempts, error } = await supabase
      .from('user_exercise_attempts')
      .select('*')
      .eq('user_id', userId)
      .eq('skill_demonstrated', skill)
      .order('created_at', { ascending: false })
      .limit(50);

    if (error) {
      console.error('Error fetching skill performance:', error);
      return {
        totalAttempts: 0,
        correctAttempts: 0,
        accuracy: 0,
        recentTrend: 'stable',
        lastFiveResults: []
      };
    }

    if (!attempts || attempts.length === 0) {
      return {
        totalAttempts: 0,
        correctAttempts: 0,
        accuracy: 0,
        recentTrend: 'stable',
        lastFiveResults: []
      };
    }

    const totalAttempts = attempts.length;
    const correctAttempts = attempts.filter(a => a.is_correct).length;
    const accuracy = totalAttempts > 0 ? correctAttempts / totalAttempts : 0;

    // Get last 5 results for trend analysis
    const lastFive = attempts.slice(0, 5);
    const lastFiveResults = lastFive.map(a => a.is_correct);

    // Calculate trend
    let trend: 'improving' | 'declining' | 'stable' = 'stable';
    if (lastFive.length >= 3) {
      const firstHalf = lastFive.slice(Math.ceil(lastFive.length / 2));
      const secondHalf = lastFive.slice(0, Math.floor(lastFive.length / 2));
      
      const firstHalfAccuracy = firstHalf.filter(a => a.is_correct).length / firstHalf.length;
      const secondHalfAccuracy = secondHalf.filter(a => a.is_correct).length / secondHalf.length;
      
      if (secondHalfAccuracy > firstHalfAccuracy + 0.1) {
        trend = 'improving';
      } else if (firstHalfAccuracy > secondHalfAccuracy + 0.1) {
        trend = 'declining';
      }
    }

    return {
      totalAttempts,
      correctAttempts,
      accuracy,
      recentTrend: trend,
      lastFiveResults
    };
  } catch (error) {
    console.error('Error in getSkillPerformanceAnalytics:', error);
    return {
      totalAttempts: 0,
      correctAttempts: 0,
      accuracy: 0,
      recentTrend: 'stable',
      lastFiveResults: []
    };
  }
}
