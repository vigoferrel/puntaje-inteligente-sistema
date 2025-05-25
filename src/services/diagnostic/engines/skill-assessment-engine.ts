
import { supabase } from "@/integrations/supabase/client";
import { TPAESHabilidad, TPAESPrueba } from "@/types/system-types";

export interface SkillAssessment {
  skill: TPAESHabilidad;
  currentLevel: number;
  recommendedFocus: 'critical' | 'important' | 'moderate';
  exerciseCount: number;
  lastActivity: string | null;
}

export class SkillAssessmentEngine {
  static async assessUserSkills(userId: string, prueba: TPAESPrueba): Promise<SkillAssessment[]> {
    try {
      const { data: skillData } = await supabase
        .from('paes_skills')
        .select(`
          id,
          skill_type,
          name,
          impact_weight,
          user_exercise_attempts!left(
            is_correct,
            created_at,
            skill_demonstrated
          )
        `)
        .eq('test_id', this.getTestIdFromPrueba(prueba));

      return (skillData || []).map(skill => {
        const attempts = skill.user_exercise_attempts || [];
        const correctAttempts = attempts.filter(a => a.is_correct).length;
        const totalAttempts = attempts.length;
        const currentLevel = totalAttempts > 0 ? (correctAttempts / totalAttempts) * 100 : 0;
        
        return {
          skill: skill.skill_type,
          currentLevel,
          recommendedFocus: this.calculateFocusPriority(currentLevel, skill.impact_weight),
          exerciseCount: totalAttempts,
          lastActivity: attempts.length > 0 ? attempts[attempts.length - 1].created_at : null
        };
      });
    } catch (error) {
      console.error('Error assessing user skills:', error);
      return [];
    }
  }

  private static getTestIdFromPrueba(prueba: TPAESPrueba): number {
    const testMap: Record<TPAESPrueba, number> = {
      'COMPETENCIA_LECTORA': 1,
      'MATEMATICA_1': 2,
      'MATEMATICA_2': 3,
      'HISTORIA': 4,
      'CIENCIAS': 5
    };
    return testMap[prueba] || 1;
  }

  private static calculateFocusPriority(level: number, weight: number): 'critical' | 'important' | 'moderate' {
    const weightedScore = level * weight;
    
    if (weightedScore < 30) return 'critical';
    if (weightedScore < 60) return 'important';
    return 'moderate';
  }
}
