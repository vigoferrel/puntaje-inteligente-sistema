
import { supabase } from "@/integrations/supabase/client";
import { TPAESHabilidad } from "@/types/system-types";
import { toast } from "@/components/ui/use-toast";
import { mapEnumToSkillId, mapSkillIdToEnum } from "@/utils/supabase-mappers";

/**
 * Obtiene los niveles de habilidad de un usuario
 */
export const fetchUserSkillLevels = async (userId: string): Promise<Record<TPAESHabilidad, number>> => {
  try {
    // Inicializar todas las habilidades con un nivel predeterminado de 0.5
    const defaultLevels: Record<TPAESHabilidad, number> = {
      SOLVE_PROBLEMS: 0.5,
      REPRESENT: 0.5,
      MODEL: 0.5,
      INTERPRET_RELATE: 0.5,
      EVALUATE_REFLECT: 0.5,
      TRACK_LOCATE: 0.5,
      ARGUE_COMMUNICATE: 0.5,
      IDENTIFY_THEORIES: 0.5,
      PROCESS_ANALYZE: 0.5,
      APPLY_PRINCIPLES: 0.5,
      SCIENTIFIC_ARGUMENT: 0.5,
      TEMPORAL_THINKING: 0.5,
      SOURCE_ANALYSIS: 0.5,
      MULTICAUSAL_ANALYSIS: 0.5,
      CRITICAL_THINKING: 0.5,
      REFLECTION: 0.5
    };

    // Obtener niveles de habilidad de la base de datos
    const { data, error } = await supabase
      .from('user_skill_levels')
      .select('skill_id, level')
      .eq('user_id', userId);

    if (error) {
      console.error('Error fetching skill levels:', error);
      return defaultLevels;
    }

    // Si hay datos, actualizar los niveles predeterminados
    if (data && data.length > 0) {
      data.forEach(item => {
        const skillEnum = mapSkillIdToEnum(item.skill_id);
        defaultLevels[skillEnum] = item.level;
      });
    }

    return defaultLevels;
  } catch (error) {
    console.error('Error in fetchUserSkillLevels:', error);
    return {
      SOLVE_PROBLEMS: 0.5,
      REPRESENT: 0.5,
      MODEL: 0.5,
      INTERPRET_RELATE: 0.5,
      EVALUATE_REFLECT: 0.5,
      TRACK_LOCATE: 0.5,
      ARGUE_COMMUNICATE: 0.5,
      IDENTIFY_THEORIES: 0.5,
      PROCESS_ANALYZE: 0.5,
      APPLY_PRINCIPLES: 0.5,
      SCIENTIFIC_ARGUMENT: 0.5,
      TEMPORAL_THINKING: 0.5,
      SOURCE_ANALYSIS: 0.5,
      MULTICAUSAL_ANALYSIS: 0.5,
      CRITICAL_THINKING: 0.5,
      REFLECTION: 0.5
    };
  }
};

/**
 * Actualiza el nivel de una habilidad específica para un usuario
 */
export const updateUserSkillLevel = async (
  userId: string,
  skill: TPAESHabilidad,
  newLevel: number
): Promise<boolean> => {
  try {
    // Asegurarse de que el nivel esté entre 0.1 y 0.99
    const normalizedLevel = Math.max(0.1, Math.min(0.99, newLevel));
    
    // Obtener el ID de la habilidad desde el enum
    const skillId = mapEnumToSkillId(skill);
    
    // Actualizar el nivel en la base de datos
    const { error } = await supabase
      .from('user_skill_levels')
      .upsert({
        user_id: userId,
        skill_id: skillId,
        level: normalizedLevel
      });
    
    if (error) {
      console.error('Error updating skill level:', error);
      return false;
    }
    
    return true;
  } catch (error) {
    console.error('Error in updateUserSkillLevel:', error);
    return false;
  }
};

/**
 * Actualiza múltiples niveles de habilidad para un usuario
 */
export const updateMultipleSkillLevels = async (
  userId: string,
  skillLevels: Partial<Record<TPAESHabilidad, number>>
): Promise<boolean> => {
  try {
    // Crear array de registros para inserción masiva
    const records = Object.entries(skillLevels).map(([skill, level]) => ({
      user_id: userId,
      skill_id: mapEnumToSkillId(skill as TPAESHabilidad),
      level: Math.max(0.1, Math.min(0.99, level || 0.5))
    }));
    
    // Insertar/actualizar todos los registros
    const { error } = await supabase
      .from('user_skill_levels')
      .upsert(records);
    
    if (error) {
      console.error('Error updating multiple skill levels:', error);
      return false;
    }
    
    return true;
  } catch (error) {
    console.error('Error in updateMultipleSkillLevels:', error);
    return false;
  }
};

/**
 * Obtiene las principales habilidades de un usuario (las de mayor nivel)
 */
export const getTopSkills = async (
  userId: string, 
  limit: number = 3
): Promise<TPAESHabilidad[]> => {
  try {
    const skillLevels = await fetchUserSkillLevels(userId);
    
    // Ordenar habilidades por nivel y obtener las principales
    const sortedSkills = Object.entries(skillLevels)
      .sort(([, levelA], [, levelB]) => levelB - levelA)
      .slice(0, limit)
      .map(([skill]) => skill as TPAESHabilidad);
    
    return sortedSkills;
  } catch (error) {
    console.error('Error in getTopSkills:', error);
    return ['INTERPRET_RELATE', 'SOLVE_PROBLEMS', 'MODEL']; // Valores predeterminados
  }
};

/**
 * Obtiene las habilidades que necesitan mejora (las de menor nivel)
 */
export const getSkillsToImprove = async (
  userId: string, 
  limit: number = 3
): Promise<TPAESHabilidad[]> => {
  try {
    const skillLevels = await fetchUserSkillLevels(userId);
    
    // Ordenar habilidades por nivel y obtener las que necesitan mejora
    const sortedSkills = Object.entries(skillLevels)
      .sort(([, levelA], [, levelB]) => levelA - levelB)
      .slice(0, limit)
      .map(([skill]) => skill as TPAESHabilidad);
    
    return sortedSkills;
  } catch (error) {
    console.error('Error in getSkillsToImprove:', error);
    return ['SCIENTIFIC_ARGUMENT', 'REFLECTION', 'PROCESS_ANALYZE']; // Valores predeterminados
  }
};

/**
 * Calcula el nivel promedio de todas las habilidades
 */
export const getAverageSkillLevel = async (userId: string): Promise<number> => {
  try {
    const skillLevels = await fetchUserSkillLevels(userId);
    
    // Calcular promedio
    const sum = Object.values(skillLevels).reduce((acc, level) => acc + level, 0);
    const average = sum / Object.values(skillLevels).length;
    
    return average;
  } catch (error) {
    console.error('Error in getAverageSkillLevel:', error);
    return 0.5; // Valor predeterminado
  }
};
