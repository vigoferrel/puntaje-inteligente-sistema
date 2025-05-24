
import { supabase } from "@/integrations/supabase/client";

export const DEFAULT_LEARNING_NODES = [
  {
    code: "CL_001",
    title: "Comprensión Lectora Básica",
    description: "Fundamentos de la comprensión de textos escritos",
    subject_area: "Competencia Lectora",
    domain_category: "Lectura",
    difficulty: "basic" as const,
    cognitive_level: "comprender" as const,
    tier_priority: "tier1_critico" as const,
    position: 1,
    skill_id: 2,
    test_id: 1
  },
  {
    code: "CL_002", 
    title: "Análisis de Textos",
    description: "Análisis crítico de diferentes tipos de textos",
    subject_area: "Competencia Lectora",
    domain_category: "Análisis",
    difficulty: "intermediate" as const,
    cognitive_level: "analizar" as const,
    tier_priority: "tier1_critico" as const,
    position: 2,
    skill_id: 3,
    test_id: 1
  },
  {
    code: "M1_001",
    title: "Álgebra Básica",
    description: "Conceptos fundamentales de álgebra",
    subject_area: "Matemática",
    domain_category: "Álgebra",
    difficulty: "basic" as const,
    cognitive_level: "aplicar" as const,
    tier_priority: "tier1_critico" as const,
    position: 3,
    skill_id: 4,
    test_id: 2
  },
  {
    code: "M1_002",
    title: "Geometría Analítica",
    description: "Geometría en el plano cartesiano",
    subject_area: "Matemática",
    domain_category: "Geometría",
    difficulty: "intermediate" as const,
    cognitive_level: "aplicar" as const,
    tier_priority: "tier2_importante" as const,
    position: 4,
    skill_id: 5,
    test_id: 2
  },
  {
    code: "CN_001",
    title: "Método Científico",
    description: "Fundamentos del método científico",
    subject_area: "Ciencias",
    domain_category: "Metodología",
    difficulty: "basic" as const,
    cognitive_level: "comprender" as const,
    tier_priority: "tier1_critico" as const,
    position: 5,
    skill_id: 8,
    test_id: 5
  }
];

export async function createDefaultLearningNodes(): Promise<boolean> {
  try {
    const { error } = await supabase
      .from('learning_nodes')
      .insert(DEFAULT_LEARNING_NODES);
    
    if (error) {
      console.error('Error creating default learning nodes:', error);
      return false;
    }
    
    console.log('✅ Default learning nodes created successfully');
    return true;
  } catch (error) {
    console.error('Error in createDefaultLearningNodes:', error);
    return false;
  }
}
