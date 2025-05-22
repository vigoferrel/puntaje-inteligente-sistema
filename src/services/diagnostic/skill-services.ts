
import { supabase } from "@/integrations/supabase/client";
import { toast } from "@/components/ui/use-toast";
import { TPAESHabilidad } from "@/types/system-types";

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
 * Map skill code to display name
 */
export const getSkillDisplayName = (skillCode: string) => {
  const skillMap: Record<string, string> = {
    // Comprensión Lectora
    "ER": "Extraer información",
    "IR": "Interpretar información",
    "RL": "Relacionar e interpretar",
    
    // Matemáticas M1
    "RP1": "Resolver problemas M1",
    "RE1": "Representar M1",
    "MO1": "Modelar M1",
    "AC1": "Argumentar y comunicar M1",
    
    // Matemáticas M2
    "RP2": "Resolver problemas M2",
    "RE2": "Representar M2",
    "MO2": "Modelar M2",
    "AC2": "Argumentar y comunicar M2",
    
    // Ciencias
    "PC": "Pensamiento científico",
    "AC": "Análisis científico",
    "TE": "Teorías científicas",
    
    // Historia
    "TH": "Temporalidad histórica",
    "PH": "Pensamiento histórico",
    "EH": "Espacialidad histórica"
  };
  
  return skillMap[skillCode] || skillCode;
};

/**
 * Calculate penalty for a question based on time spent and correctness
 */
export const calculateQuestionPenalty = (timeSpentSeconds: number, isCorrect: boolean): number => {
  // Sin penalización si la respuesta es correcta
  if (isCorrect) return 0;
  
  // Penalización base por respuesta incorrecta
  let penalty = 0.1;
  
  // Si el tiempo es muy corto (menos de 10 segundos), aumentar penalización
  // Esto podría indicar que el usuario está adivinando
  if (timeSpentSeconds < 10) {
    penalty += 0.05;
  }
  // Si el tiempo es muy largo (más de 2 minutos), aumentar ligeramente la penalización
  // Esto podría indicar dificultad extrema con el concepto
  else if (timeSpentSeconds > 120) {
    penalty += 0.03;
  }
  
  return penalty;
};

/**
 * Calculate skill level change based on correctness and penalty
 */
export const calculateSkillLevelChange = (isCorrect: boolean, penalty: number): number => {
  // Respuesta correcta: aumentar nivel
  if (isCorrect) {
    return 0.05; // Incremento estándar por respuesta correcta
  }
  
  // Respuesta incorrecta: disminuir nivel según penalización
  return -penalty;
};

/**
 * Update user skill levels based on diagnostic results
 */
export const updateUserSkillLevels = async (
  userId: string,
  results: Record<TPAESHabilidad, number>
): Promise<boolean> => {
  try {
    // Importar la función necesaria para la conversión
    const { mapEnumToSkillId } = await import('@/utils/supabase-mappers');
    
    // Procesar cada habilidad en los resultados
    for (const [skill, level] of Object.entries(results)) {
      try {
        const skillId = mapEnumToSkillId(skill as TPAESHabilidad);
        
        // Actualizar el nivel de la habilidad
        const { error } = await supabase
          .from('user_skill_levels')
          .upsert({
            user_id: userId,
            skill_id: skillId,
            level: Math.max(0.1, Math.min(0.99, level)) // Asegurar que el nivel esté entre 0.1 y 0.99
          });
          
        if (error) {
          console.error(`Error actualizando nivel para habilidad ${skill}:`, error);
        }
      } catch (skillError) {
        console.error(`Error procesando habilidad ${skill}:`, skillError);
      }
    }
    
    return true;
  } catch (error) {
    console.error('Error actualizando niveles de habilidades:', error);
    return false;
  }
};

