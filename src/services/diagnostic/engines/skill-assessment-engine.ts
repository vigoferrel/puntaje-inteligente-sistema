
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
      // Primero obtenemos las habilidades PAES
      const { data: skillData, error: skillError } = await supabase
        .from('paes_skills')
        .select('id, skill_type, name, impact_weight')
        .eq('test_id', this.getTestIdFromPrueba(prueba));

      if (skillError) {
        console.error('Error obteniendo habilidades PAES:', skillError);
        return [];
      }

      if (!skillData || skillData.length === 0) {
        console.warn(`No se encontraron habilidades para la prueba ${prueba}`);
        return [];
      }

      // Luego obtenemos los intentos de ejercicios del usuario
      const { data: attemptData, error: attemptError } = await supabase
        .from('user_exercise_attempts')
        .select('is_correct, created_at, skill_demonstrated')
        .eq('user_id', userId);

      if (attemptError) {
        console.error('Error obteniendo intentos de ejercicios:', attemptError);
        return [];
      }

      const attempts = attemptData || [];

      return skillData.map(skill => {
        // Filtrar intentos relacionados con esta habilidad
        const skillAttempts = attempts.filter(attempt => 
          attempt.skill_demonstrated === skill.skill_type
        );
        
        const correctAttempts = skillAttempts.filter(a => a.is_correct).length;
        const totalAttempts = skillAttempts.length;
        const currentLevel = totalAttempts > 0 ? (correctAttempts / totalAttempts) * 100 : 0;
        
        return {
          skill: skill.skill_type,
          currentLevel,
          recommendedFocus: this.calculateFocusPriority(currentLevel, skill.impact_weight),
          exerciseCount: totalAttempts,
          lastActivity: skillAttempts.length > 0 ? 
            skillAttempts[skillAttempts.length - 1].created_at : null
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
