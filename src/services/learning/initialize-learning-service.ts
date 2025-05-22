
import { supabase } from "@/integrations/supabase/client";
import { TLearningNode, TPAESPrueba, TPAESHabilidad } from "@/types/system-types";
import { toast } from "@/components/ui/use-toast";
import { mapDatabaseNodeToLearningNode } from "@/services/node/node-base-service";
import { createGetPoliciesFunction, initializeRLSPolicies } from "@/services/database/rls-service";

/**
 * Verifica si existen nodos de aprendizaje en la base de datos
 */
export const checkLearningNodesExist = async (): Promise<boolean> => {
  try {
    const { count, error } = await supabase
      .from('learning_nodes')
      .select('*', { count: 'exact', head: true });
    
    if (error) {
      console.error('Error checking for learning nodes:', error);
      return false;
    }
    
    return (count !== null && count > 0);
  } catch (error) {
    console.error('Error in checkLearningNodesExist:', error);
    return false;
  }
};

/**
 * Crea nodos de aprendizaje predeterminados si no existen
 */
export const ensureLearningNodesExist = async (): Promise<boolean> => {
  try {
    // Ensure we have RLS functions created
    await createGetPoliciesFunction();
    
    // Check current RLS policies
    const { data: policies, error: policiesError } = await supabase.rpc('get_policies_for_table', { 
      table_name: 'learning_nodes' 
    } as { table_name: string });
    
    // If there are RLS issues, try to fix them
    if (policiesError || !policies || (policies as any[]).length === 0) {
      console.warn('RLS policies issue detected, attempting to initialize policies');
      await initializeRLSPolicies();
    }
    
    const nodesExist = await checkLearningNodesExist();
    
    if (!nodesExist) {
      console.log('No se encontraron nodos de aprendizaje. Creando nodos predeterminados...');
      return await createDefaultLearningNodes();
    }
    
    return true;
  } catch (error) {
    console.error('Error in ensureLearningNodesExist:', error);
    return false;
  }
};

/**
 * Crea nodos de aprendizaje predeterminados para Competencia Lectora
 */
const createCompetenciaLectoraNodes = async (): Promise<boolean> => {
  const testId = 1; // ID para Competencia Lectora
  const nodes = [
    {
      title: "Comprensión global del texto",
      description: "Identificación de ideas principales, temas centrales y propósito comunicativo",
      skill_id: mapSkillEnumToId("INTERPRET_RELATE"),
      test_id: testId,
      difficulty: "basic",
      position: 1,
      code: "CL-01",
      depends_on: [],
      estimated_time_minutes: 45
    },
    {
      title: "Localización de información explícita",
      description: "Ubicación de datos, hechos e información literal presente en el texto",
      skill_id: mapSkillEnumToId("TRACK_LOCATE"),
      test_id: testId,
      difficulty: "basic",
      position: 2,
      code: "CL-02",
      depends_on: [],
      estimated_time_minutes: 30
    },
    {
      title: "Interpretación de información implícita",
      description: "Inferencia de significados, intenciones y elementos no explícitos",
      skill_id: mapSkillEnumToId("INTERPRET_RELATE"),
      test_id: testId,
      difficulty: "intermediate",
      position: 3,
      code: "CL-03",
      depends_on: ["CL-01", "CL-02"],
      estimated_time_minutes: 60
    },
    {
      title: "Evaluación crítica de textos",
      description: "Análisis de perspectivas, sesgos, validez argumentativa y recursos retóricos",
      skill_id: mapSkillEnumToId("EVALUATE_REFLECT"),
      test_id: testId,
      difficulty: "advanced",
      position: 4,
      code: "CL-04",
      depends_on: ["CL-03"],
      estimated_time_minutes: 75
    },
    {
      title: "Análisis de relaciones intertextuales",
      description: "Comparación de textos, identificación de diálogos entre obras, influencias y referencias",
      skill_id: mapSkillEnumToId("INTERPRET_RELATE"),
      test_id: testId,
      difficulty: "advanced",
      position: 5,
      code: "CL-05",
      depends_on: ["CL-03", "CL-04"],
      estimated_time_minutes: 90
    },
    {
      title: "Vocabulario en contexto",
      description: "Determinación del significado de palabras según su contexto de uso",
      skill_id: mapSkillEnumToId("INTERPRET_RELATE"),
      test_id: testId,
      difficulty: "intermediate",
      position: 6,
      code: "CL-06",
      depends_on: ["CL-01"],
      estimated_time_minutes: 45
    },
    {
      title: "Análisis de recursos textuales",
      description: "Identificación de recursos estilísticos, narrativos y retóricos",
      skill_id: mapSkillEnumToId("INTERPRET_RELATE"),
      test_id: testId,
      difficulty: "intermediate",
      position: 7,
      code: "CL-07",
      depends_on: ["CL-06"],
      estimated_time_minutes: 60
    },
    {
      title: "Síntesis de información",
      description: "Capacidad para resumir y condensar información relevante",
      skill_id: mapSkillEnumToId("EVALUATE_REFLECT"),
      test_id: testId,
      difficulty: "advanced",
      position: 8,
      code: "CL-08",
      depends_on: ["CL-04", "CL-07"],
      estimated_time_minutes: 60
    }
  ];

  return await insertLearningNodes(nodes);
};

/**
 * Crea nodos de aprendizaje predeterminados para Matemática 1
 */
const createMatematica1Nodes = async (): Promise<boolean> => {
  const testId = 2; // ID para Matemática 1
  const nodes = [
    {
      title: "Números y operaciones",
      description: "Operaciones con números reales, racionalización, potencias y raíces",
      skill_id: mapSkillEnumToId("SOLVE_PROBLEMS"),
      test_id: testId,
      difficulty: "basic",
      position: 1,
      code: "MAT-01",
      depends_on: [],
      estimated_time_minutes: 45
    },
    {
      title: "Álgebra y funciones",
      description: "Ecuaciones, inecuaciones, funciones y sus propiedades",
      skill_id: mapSkillEnumToId("MODEL"),
      test_id: testId,
      difficulty: "intermediate",
      position: 2,
      code: "MAT-02",
      depends_on: ["MAT-01"],
      estimated_time_minutes: 60
    },
    {
      title: "Geometría",
      description: "Figuras geométricas, teoremas, transformaciones isométricas y homotéticas",
      skill_id: mapSkillEnumToId("REPRESENT"),
      test_id: testId,
      difficulty: "intermediate",
      position: 3,
      code: "MAT-03",
      depends_on: ["MAT-01"],
      estimated_time_minutes: 60
    },
    {
      title: "Estadística y probabilidad",
      description: "Análisis de datos, medidas de tendencia central y dispersión, probabilidades",
      skill_id: mapSkillEnumToId("SOLVE_PROBLEMS"),
      test_id: testId,
      difficulty: "intermediate",
      position: 4,
      code: "MAT-04",
      depends_on: ["MAT-01"],
      estimated_time_minutes: 60
    },
    {
      title: "Patrones y sucesiones",
      description: "Identificación de patrones, progresiones aritméticas y geométricas",
      skill_id: mapSkillEnumToId("MODEL"),
      test_id: testId,
      difficulty: "intermediate",
      position: 5,
      code: "MAT-05",
      depends_on: ["MAT-02"],
      estimated_time_minutes: 45
    },
    {
      title: "Resolución de problemas contextualizados",
      description: "Problemas de aplicación en contextos reales",
      skill_id: mapSkillEnumToId("SOLVE_PROBLEMS"),
      test_id: testId,
      difficulty: "advanced",
      position: 6,
      code: "MAT-06",
      depends_on: ["MAT-01", "MAT-02", "MAT-03", "MAT-04"],
      estimated_time_minutes: 90
    },
    {
      title: "Modelación matemática",
      description: "Representación matemática de situaciones reales",
      skill_id: mapSkillEnumToId("MODEL"),
      test_id: testId,
      difficulty: "advanced",
      position: 7,
      code: "MAT-07",
      depends_on: ["MAT-02", "MAT-05"],
      estimated_time_minutes: 75
    },
    {
      title: "Razonamiento lógico-matemático",
      description: "Validación de procedimientos y soluciones, demostración de propiedades",
      skill_id: mapSkillEnumToId("ARGUE_COMMUNICATE"),
      test_id: testId,
      difficulty: "advanced",
      position: 8,
      code: "MAT-08",
      depends_on: ["MAT-06", "MAT-07"],
      estimated_time_minutes: 60
    }
  ];

  return await insertLearningNodes(nodes);
};

/**
 * Crea nodos de aprendizaje predeterminados para todas las pruebas
 */
const createDefaultLearningNodes = async (): Promise<boolean> => {
  try {
    // Crear nodos para Competencia Lectora
    const clSuccess = await createCompetenciaLectoraNodes();
    
    // Crear nodos para Matemática 1
    const mat1Success = await createMatematica1Nodes();
    
    // Aquí podríamos añadir más nodos para otras pruebas
    // (Matemática 2, Historia, Ciencias, etc.)
    
    return clSuccess && mat1Success;
  } catch (error) {
    console.error('Error creating default learning nodes:', error);
    return false;
  }
};

/**
 * Inserta nodos de aprendizaje en la base de datos
 */
const insertLearningNodes = async (nodes: any[]): Promise<boolean> => {
  try {
    const { error } = await supabase
      .from('learning_nodes')
      .upsert(nodes);
    
    if (error) {
      console.error('Error inserting learning nodes:', error);
      return false;
    }
    
    return true;
  } catch (error) {
    console.error('Error in insertLearningNodes:', error);
    return false;
  }
};

/**
 * Utilidad para mapear enum de habilidad a ID
 * (Simplificación para este ejemplo, idealmente usar mapEnumToSkillId de supabase-mappers)
 */
const mapSkillEnumToId = (skillEnum: TPAESHabilidad): number => {
  const skillMap: Record<TPAESHabilidad, number> = {
    TRACK_LOCATE: 1,
    INTERPRET_RELATE: 2,
    EVALUATE_REFLECT: 3,
    SOLVE_PROBLEMS: 4,
    REPRESENT: 5,
    MODEL: 6,
    ARGUE_COMMUNICATE: 7,
    IDENTIFY_THEORIES: 8,
    PROCESS_ANALYZE: 9,
    APPLY_PRINCIPLES: 10,
    SCIENTIFIC_ARGUMENT: 11,
    TEMPORAL_THINKING: 12,
    SOURCE_ANALYSIS: 13,
    MULTICAUSAL_ANALYSIS: 14,
    CRITICAL_THINKING: 15,
    REFLECTION: 16
  };
  
  return skillMap[skillEnum] || 4; // Default a SOLVE_PROBLEMS
};
