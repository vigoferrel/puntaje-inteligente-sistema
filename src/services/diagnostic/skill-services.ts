
import { supabase } from "@/integrations/supabase/client";
import { toast } from "@/components/ui/use-toast";

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
