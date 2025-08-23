
import { supabase } from "@/integrations/supabase/client";
import { toast } from "@/components/ui/use-toast";
import { TPAESHabilidad } from "@/types/system-types";
import { mapEnumToSkillId } from "@/utils/supabase-mappers";

/**
 * Fetch skills for a specific test
 */
export const fetchSkillsForTest = async (testId: number) => {
  try {
    const { data, error } = await supabase
      .from('paes_skills')
      .select('*')
      .eq('test_id', testId);
    
    if (error) {
      throw error;
    }
    
    return data || [];
  } catch (error) {
    console.error('Error al obtener habilidades para el test:', error);
    toast({
      title: "Error",
      description: "No se pudieron cargar las habilidades para el test",
      variant: "destructive"
    });
    return [];
  }
};

/**
 * Calculate skill levels based on user exercise attempts
 */
export const calculateSkillLevelsFromAttempts = async (userId: string): Promise<Record<TPAESHabilidad, number>> => {
  try {
    const { data: attempts, error } = await supabase
      .from('user_exercise_attempts')
      .select('skill_demonstrated, is_correct')
      .eq('user_id', userId);

    if (error) throw error;

    // Initialize default skill levels
    const skillLevels: Record<TPAESHabilidad, number> = {
      SOLVE_PROBLEMS: 0.3,
      REPRESENT: 0.4,
      MODEL: 0.5,
      INTERPRET_RELATE: 0.35,
      EVALUATE_REFLECT: 0.45,
      TRACK_LOCATE: 0.6,
      ARGUE_COMMUNICATE: 0.4,
      IDENTIFY_THEORIES: 0.3,
      PROCESS_ANALYZE: 0.5,
      APPLY_PRINCIPLES: 0.45,
      SCIENTIFIC_ARGUMENT: 0.3,
      TEMPORAL_THINKING: 0.5,
      SOURCE_ANALYSIS: 0.6,
      MULTICAUSAL_ANALYSIS: 0.4,
      CRITICAL_THINKING: 0.5,
      REFLECTION: 0.45
    };

    if (!attempts || attempts.length === 0) {
      return skillLevels;
    }

    // Calculate skill stats from attempts
    const skillStats: Record<string, { total: number; correct: number }> = {};
    
    attempts.forEach(attempt => {
      if (attempt.skill_demonstrated) {
        if (!skillStats[attempt.skill_demonstrated]) {
          skillStats[attempt.skill_demonstrated] = { total: 0, correct: 0 };
        }
        skillStats[attempt.skill_demonstrated].total++;
        if (attempt.is_correct) {
          skillStats[attempt.skill_demonstrated].correct++;
        }
      }
    });

    // Update skill levels based on performance
    Object.entries(skillStats).forEach(([skill, stats]) => {
      if (stats.total > 0 && skill in skillLevels) {
        const accuracy = stats.correct / stats.total;
        skillLevels[skill as TPAESHabilidad] = Math.min(1, accuracy);
      }
    });

    return skillLevels;
  } catch (error) {
    console.error('Error calculating skill levels:', error);
    // Return default levels on error
    return {
      SOLVE_PROBLEMS: 0.3,
      REPRESENT: 0.4,
      MODEL: 0.5,
      INTERPRET_RELATE: 0.35,
      EVALUATE_REFLECT: 0.45,
      TRACK_LOCATE: 0.6,
      ARGUE_COMMUNICATE: 0.4,
      IDENTIFY_THEORIES: 0.3,
      PROCESS_ANALYZE: 0.5,
      APPLY_PRINCIPLES: 0.45,
      SCIENTIFIC_ARGUMENT: 0.3,
      TEMPORAL_THINKING: 0.5,
      SOURCE_ANALYSIS: 0.6,
      MULTICAUSAL_ANALYSIS: 0.4,
      CRITICAL_THINKING: 0.5,
      REFLECTION: 0.45
    };
  }
};

/**
 * Map skill code to display name
 */
export const getSkillDisplayName = (skillCode: string) => {
  const skillMap: Record<string, string> = {
    // Comprensión Lectora
    "TRACK_LOCATE": "Rastrear y localizar",
    "INTERPRET_RELATE": "Interpretar y relacionar",
    "EVALUATE_REFLECT": "Evaluar y reflexionar",
    
    // Matemáticas
    "SOLVE_PROBLEMS": "Resolver problemas",
    "REPRESENT": "Representar",
    "MODEL": "Modelar",
    "ARGUE_COMMUNICATE": "Argumentar y comunicar",
    
    // Ciencias
    "IDENTIFY_THEORIES": "Identificar teorías",
    "PROCESS_ANALYZE": "Procesar y analizar",
    "APPLY_PRINCIPLES": "Aplicar principios",
    "SCIENTIFIC_ARGUMENT": "Argumentación científica",
    
    // Historia
    "TEMPORAL_THINKING": "Pensamiento temporal",
    "SOURCE_ANALYSIS": "Análisis de fuentes",
    "MULTICAUSAL_ANALYSIS": "Análisis multicausal",
    "CRITICAL_THINKING": "Pensamiento crítico",
    "REFLECTION": "Reflexión"
  };
  
  return skillMap[skillCode] || skillCode;
};

/**
 * Calculate penalty for a question based on time spent and correctness
 */
export const calculateQuestionPenalty = (timeSpentSeconds: number, isCorrect: boolean): number => {
  if (isCorrect) return 0;
  
  let penalty = 0.1;
  
  if (timeSpentSeconds < 10) {
    penalty += 0.05;
  } else if (timeSpentSeconds > 120) {
    penalty += 0.03;
  }
  
  return penalty;
};

/**
 * Calculate skill level change based on correctness and penalty
 */
export const calculateSkillLevelChange = (isCorrect: boolean, penalty: number): number => {
  if (isCorrect) {
    return 0.05;
  }
  return -penalty;
};

/**
 * Update user skill levels - now tracks via exercise attempts only
 */
export const updateUserSkillLevels = async (
  userId: string,
  results: Record<TPAESHabilidad, number>
): Promise<boolean> => {
  try {
    console.log('Skill level results calculated:', results);
    // Since we don't have user_skill_levels table, we rely on exercise attempts
    // for skill level calculation. This function now serves as a logging mechanism.
    return true;
  } catch (error) {
    console.error('Error in skill level update process:', error);
    return false;
  }
};
