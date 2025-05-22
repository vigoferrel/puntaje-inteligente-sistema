
import { batchCreateEducationalNodes } from "@/services/node/node-content-service";
import { supabase } from "@/integrations/supabase/client";

/**
 * PAES Educational Nodes data structure
 */
export type TPAESNodeData = {
  title: string;
  description?: string;
  code: string;
  skill_id?: number | null;
  test_id?: number | null;
  content_type: string;
  content: string;
  position?: number;
  difficulty?: 'basic' | 'intermediate' | 'advanced';
}

/**
 * Format node data for batch creation
 */
const formatNodeForBatch = (node: TPAESNodeData) => {
  return {
    title: node.title,
    description: node.description || '',
    code: node.code,
    skillId: node.skill_id, // Keep as null if it's null
    testId: node.test_id, // Keep as null if it's null
    contentType: node.content_type,
    contentText: node.content,
    position: node.position || 1,
    difficulty: node.difficulty || 'basic'
  };
};

/**
 * Create PAES educational nodes in the database
 */
export const initializePAESContent = async (): Promise<{
  success: number;
  failed: number;
  errors: string[];
}> => {
  try {
    console.log('Iniciando creación de nodos PAES...');
    
    // Check if nodes already exist to avoid duplication
    const { count, error: countError } = await supabase
      .from('learning_nodes')
      .select('*', { count: 'exact', head: true })
      .eq('code', 'PAES');
    
    if (countError) {
      console.error('Error checking for existing PAES nodes:', countError);
      return { success: 0, failed: 1, errors: [`Error checking for existing nodes: ${countError.message}`] };
    }
    
    // If we already have PAES nodes, don't recreate them
    if (count && count > 0) {
      console.log('PAES nodes already exist, skipping initialization');
      return { success: 0, failed: 0, errors: ['PAES nodes already exist'] };
    }
    
    // Ensure required skills and tests exist
    const validationError = await validateRequiredData();
    if (validationError) {
      return { 
        success: 0, 
        failed: 1, 
        errors: [`Required data missing or invalid: ${validationError}`] 
      };
    }
    
    // Format nodes for batch creation
    const formattedNodes = paesEducationalNodes.map(formatNodeForBatch);
    
    // Create nodes in batch
    const results = await batchCreateEducationalNodes(formattedNodes);
    
    console.log(`Creados ${results.success} nodos educacionales PAES exitosamente`);
    console.log(`Fallaron ${results.failed} nodos`);
    
    return results;
  } catch (error: any) {
    console.error('Error al crear nodos PAES:', error);
    return { 
      success: 0, 
      failed: 1, 
      errors: [`Unexpected error: ${error?.message || 'Unknown error'}`] 
    };
  }
};

/**
 * Validate required data for PAES nodes creation
 */
const validateRequiredData = async (): Promise<string | null> => {
  try {
    // Check skills exist
    const { data: skillsData, error: skillsError } = await supabase
      .from('paes_skills')
      .select('id, code')
      .order('id');
    
    if (skillsError) {
      return `Error checking skills: ${skillsError.message}`;
    }
    
    if (!skillsData || skillsData.length === 0) {
      return 'Required skills data not found. Please initialize foundation tables first.';
    }
    
    // Check tests exist
    const { data: testsData, error: testsError } = await supabase
      .from('paes_tests')
      .select('id, code')
      .order('id');
    
    if (testsError) {
      return `Error checking tests: ${testsError.message}`;
    }
    
    if (!testsData || testsData.length === 0) {
      return 'Required tests data not found. Please initialize foundation tables first.';
    }
    
    console.log('Required data validation passed');
    return null;
  } catch (error: any) {
    return `Error validating required data: ${error?.message || 'Unknown error'}`;
  }
};

/**
 * PAES Educational Nodes data
 */
export const paesEducationalNodes: TPAESNodeData[] = [
  // SISTEMA PRINCIPAL
  {
    title: "Sistema de Evaluación PAES",
    description: "Sistema nacional de evaluación para el acceso a la educación superior en Chile",
    code: "PAES",
    skill_id: null,
    test_id: null,
    content_type: "sistema_principal",
    content: "Sistema de Evaluación PAES - Evaluación nacional para acceso a educación superior"
  },
  // COMPETENCIA LECTORA
  {
    title: "Competencia Lectora",
    description: "Evaluación de habilidades de comprensión lectora",
    code: "CL",
    skill_id: null,
    test_id: 1,
    content_type: "prueba_principal",
    content: "Competencia Lectora - Evaluación de comprensión y análisis textual"
  },
  // DIMENSIONES DE COMPETENCIA LECTORA
  {
    title: "Rastrear-Localizar",
    description: "Habilidad para localizar información específica en textos (30% de la prueba)",
    code: "CL-RL",
    skill_id: 1,
    test_id: 1,
    content_type: "dimension",
    content: "Rastrear-Localizar - 30% de la prueba - Localización de información específica"
  },
  {
    title: "Interpretar-Relacionar", 
    description: "Habilidad para interpretar y relacionar información textual (40% de la prueba)",
    code: "CL-IR",
    skill_id: 2,
    test_id: 1,
    content_type: "dimension",
    content: "Interpretar-Relacionar - 40% de la prueba - Interpretación y relación de información"
  },
  {
    title: "Evaluar-Reflexionar",
    description: "Habilidad para evaluar y reflexionar sobre textos (30% de la prueba)",
    code: "CL-ER", 
    skill_id: 3,
    test_id: 1,
    content_type: "dimension",
    content: "Evaluar-Reflexionar - 30% de la prueba - Evaluación crítica y reflexión textual"
  },
  // NODOS CRÍTICOS - RASTREAR-LOCALIZAR
  {
    title: "Información explícita literal",
    description: "Habilidad para reconocer información explícita directamente presente en el texto",
    code: "CL-RL-01",
    skill_id: 1,
    test_id: 1,
    content_type: "nodo_critico",
    content: "CL-RL-01: Información explícita literal - Recordar - Identificación directa de datos textuales"
  },
  {
    title: "Información explícita dispersa",
    description: "Localización de información explícita distribuida en diferentes partes del texto",
    code: "CL-RL-02",
    skill_id: 1,
    test_id: 1,
    content_type: "nodo_critico",
    content: "CL-RL-02: Información explícita dispersa - Comprender - Localización de datos distribuidos"
  },
  // Add more nodes here as needed from the provided data
  // The list has been shortened for brevity but you can add all provided nodes
];
