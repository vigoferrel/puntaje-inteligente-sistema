
import { TLearningNode, TPAESPrueba } from '@/types/system-types';

/**
 * Utilidades para validar la coherencia de nodos de aprendizaje
 */

// Mapeo de palabras clave por tipo de prueba actualizado
const THEMATIC_KEYWORDS: Record<TPAESPrueba, readonly string[]> = {
  'COMPETENCIA_LECTORA': [
    'comprensión', 'lectura', 'texto', 'interpretación', 'análisis textual', 
    'comprensión lectora', 'estrategias de lectura', 'inferencia', 'síntesis',
    'información explícita', 'información implícita', 'propósito comunicativo',
    'vocabulario', 'secuencias', 'argumentos', 'evaluar', 'localizar'
  ] as const,
  'MATEMATICA_1': [
    'álgebra', 'geometría', 'aritmética', 'ecuación', 'números', 'operaciones',
    'fracciones', 'porcentaje', 'proporciones', 'estadística básica', 'enteros',
    'racionales', 'potencias', 'raíces', 'función lineal', 'pitágoras', 'polígonos'
  ] as const,
  'MATEMATICA_2': [
    'función', 'cálculo', 'trigonometría', 'logaritmo', 'derivada', 'integral',
    'límite', 'probabilidad', 'estadística avanzada', 'modelamiento matemático',
    'función cuadrática', 'función exponencial', 'vectores', 'ecuación de la recta'
  ] as const,
  'CIENCIAS': [
    'biología', 'química', 'física', 'célula', 'átomo', 'molécula', 'ecosistema',
    'genética', 'homeostasis', 'evolución', 'fuerza', 'energía', 'reacción química',
    'metabolismo', 'cinemática', 'estructura atómica', 'organización biológica'
  ] as const,
  'HISTORIA': [
    'historia', 'civilización', 'guerra', 'independencia', 'revolución', 'imperio',
    'siglo', 'época', 'cultura', 'sociedad', 'política', 'económico', 'colonial',
    'prehispánico', 'conquista', 'democracia', 'participación', 'temporal', 'multicausal'
  ] as const
};

// Mapeo de skills válidos por tipo de prueba
const VALID_SKILLS_BY_TEST: Record<number, readonly number[]> = {
  1: [1, 2, 3], // COMPETENCIA_LECTORA: TRACK_LOCATE, INTERPRET_RELATE, EVALUATE_REFLECT
  2: [4, 5, 6, 7], // MATEMATICA_1: SOLVE_PROBLEMS, REPRESENT, MODEL, ARGUE_COMMUNICATE
  3: [4, 5, 6, 7], // MATEMATICA_2: SOLVE_PROBLEMS, REPRESENT, MODEL, ARGUE_COMMUNICATE
  4: [8, 9, 10, 11], // CIENCIAS: IDENTIFY_THEORIES, PROCESS_ANALYZE, APPLY_PRINCIPLES, SCIENTIFIC_ARGUMENT
  5: [12, 13, 14, 15, 16] // HISTORIA: TEMPORAL_THINKING, SOURCE_ANALYSIS, MULTICAUSAL_ANALYSIS, CRITICAL_THINKING, REFLECTION
} as const;

// Validación de niveles cognitivos válidos
const VALID_COGNITIVE_LEVELS = [
  'RECORDAR', 'COMPRENDER', 'APLICAR', 'ANALIZAR', 'EVALUAR', 'CREAR'
] as const;

/**
 * Valida si un nodo es temáticamente coherente con su tipo de prueba asignado
 */
export function validateNodeThematicCoherence(node: TLearningNode): {
  isValid: boolean;
  suggestedTest?: TPAESPrueba;
  confidence: number;
  issues: string[];
} {
  const issues: string[] = [];
  let suggestedTest: TPAESPrueba | undefined;
  let maxScore = 0;
  
  const nodeText = `${node.title} ${node.description || ''}`.toLowerCase();
  
  // Verificar coherencia temática
  for (const [testType, keywords] of Object.entries(THEMATIC_KEYWORDS)) {
    const score = keywords.reduce((acc: number, keyword: string) => {
      return acc + (nodeText.includes(keyword.toLowerCase()) ? 1 : 0);
    }, 0);
    
    if (score > maxScore) {
      maxScore = score;
      suggestedTest = testType as TPAESPrueba;
    }
  }
  
  // Verificar si el test_id coincide con el contenido temático
  const currentTestKeywords = THEMATIC_KEYWORDS[node.prueba] || [];
  const currentTestScore = currentTestKeywords.reduce((acc: number, keyword: string) => {
    return acc + (nodeText.includes(keyword.toLowerCase()) ? 1 : 0);
  }, 0);
  
  // Validar coherencia entre subject_area y prueba
  const subjectArea = (node as any).subject_area || node.prueba;
  if (subjectArea && subjectArea !== node.prueba) {
    issues.push(`Subject area (${subjectArea}) no coincide con prueba (${node.prueba})`);
  }
  
  // Validar cognitive_level
  const cognitiveLevel = (node as any).cognitive_level;
  if (cognitiveLevel && !VALID_COGNITIVE_LEVELS.includes(cognitiveLevel)) {
    issues.push(`Nivel cognitivo inválido: ${cognitiveLevel}`);
  }
  
  if (currentTestScore === 0 && maxScore > 0) {
    issues.push(`Contenido temático no coincide con ${node.prueba}. Sugiere: ${suggestedTest}`);
  }
  
  // Verificar skill_id coherencia usando test_id del nodo
  const testIdToNumber: Record<TPAESPrueba, number> = {
    'COMPETENCIA_LECTORA': 1,
    'MATEMATICA_1': 2,
    'MATEMATICA_2': 3,
    'CIENCIAS': 4,
    'HISTORIA': 5
  };
  
  const testId = testIdToNumber[node.prueba];
  const validSkills = VALID_SKILLS_BY_TEST[testId];
  
  // Check if node has skillId property (from database) or derive from skill property
  const nodeSkillId = (node as any).skillId || (node.skill ? getSkillIdFromCode(node.skill) : null);
  
  if (nodeSkillId && !validSkills?.includes(nodeSkillId)) {
    issues.push(`Skill ID ${nodeSkillId} no es válido para ${node.prueba}`);
  }
  
  const confidence = maxScore > 0 ? Math.min(currentTestScore / maxScore, 1) : 1;
  
  return {
    isValid: issues.length === 0 && confidence > 0.3,
    suggestedTest,
    confidence,
    issues
  };
}

// Helper function to map skill codes to IDs
function getSkillIdFromCode(skillCode: string): number | null {
  const skillMap: Record<string, number> = {
    'TRACK_LOCATE': 1,
    'INTERPRET_RELATE': 2,
    'EVALUATE_REFLECT': 3,
    'SOLVE_PROBLEMS': 4,
    'REPRESENT': 5,
    'MODEL': 6,
    'ARGUE_COMMUNICATE': 7,
    'IDENTIFY_THEORIES': 8,
    'PROCESS_ANALYZE': 9,
    'APPLY_PRINCIPLES': 10,
    'SCIENTIFIC_ARGUMENT': 11,
    'TEMPORAL_THINKING': 12,
    'SOURCE_ANALYSIS': 13,
    'MULTICAUSAL_ANALYSIS': 14,
    'CRITICAL_THINKING': 15,
    'REFLECTION': 16
  };
  return skillMap[skillCode] || null;
}

/**
 * Filtra nodos con validación de coherencia temática y logs de debugging
 */
export function filterNodesWithValidation(
  nodes: TLearningNode[], 
  selectedPrueba: TPAESPrueba,
  enableLogging = true
): TLearningNode[] {
  const filtered = nodes.filter(node => {
    // Verificar tanto por prueba como por subject_area
    const subjectArea = (node as any).subject_area;
    return node.prueba === selectedPrueba || subjectArea === selectedPrueba;
  });
  
  if (enableLogging) {
    console.group(`🔍 Filtrado de nodos para ${selectedPrueba}`);
    console.log(`📊 Total de nodos disponibles: ${nodes.length}`);
    console.log(`✅ Nodos filtrados: ${filtered.length}`);
    
    // Verificar coherencia temática de nodos filtrados
    const validationResults = filtered.map(node => ({
      node: node.title,
      validation: validateNodeThematicCoherence(node)
    }));
    
    const invalidNodes = validationResults.filter(r => !r.validation.isValid);
    
    if (invalidNodes.length > 0) {
      console.warn(`⚠️ Nodos con problemas de coherencia: ${invalidNodes.length}/${filtered.length}`);
      invalidNodes.forEach(invalid => {
        console.warn(`- ${invalid.node}: ${invalid.validation.issues.join(', ')}`);
      });
    } else {
      console.log(`✅ Todos los nodos son coherentes temáticamente`);
    }
    
    console.groupEnd();
  }
  
  return filtered;
}

/**
 * Valida la integridad completa del conjunto de nodos
 */
export function validateNodesIntegrity(nodes: TLearningNode[]): {
  isValid: boolean;
  issues: Array<{
    type: 'thematic_mismatch' | 'skill_mismatch' | 'missing_content' | 'cognitive_level_mismatch' | 'subject_area_mismatch';
    nodeId: string;
    description: string;
    suggestion?: string;
  }>;
  summary: {
    totalNodes: number;
    validNodes: number;
    issuesCount: number;
  };
} {
  const issues: Array<{
    type: 'thematic_mismatch' | 'skill_mismatch' | 'missing_content' | 'cognitive_level_mismatch' | 'subject_area_mismatch';
    nodeId: string;
    description: string;
    suggestion?: string;
  }> = [];
  
  nodes.forEach(node => {
    const validation = validateNodeThematicCoherence(node);
    
    if (!validation.isValid) {
      validation.issues.forEach(issue => {
        let type: 'thematic_mismatch' | 'skill_mismatch' | 'missing_content' | 'cognitive_level_mismatch' | 'subject_area_mismatch';
        
        if (issue.includes('Skill ID')) {
          type = 'skill_mismatch';
        } else if (issue.includes('Subject area')) {
          type = 'subject_area_mismatch';
        } else if (issue.includes('Nivel cognitivo')) {
          type = 'cognitive_level_mismatch';
        } else {
          type = 'thematic_mismatch';
        }
        
        issues.push({
          type,
          nodeId: node.id,
          description: `${node.title}: ${issue}`,
          suggestion: validation.suggestedTest
        });
      });
    }
    
    if (!node.description || node.description.trim().length < 10) {
      issues.push({
        type: 'missing_content',
        nodeId: node.id,
        description: `${node.title}: Descripción insuficiente o faltante`
      });
    }
  });
  
  return {
    isValid: issues.length === 0,
    issues,
    summary: {
      totalNodes: nodes.length,
      validNodes: nodes.length - issues.filter((issue, index, arr) => 
        arr.findIndex(i => i.nodeId === issue.nodeId) === index
      ).length,
      issuesCount: issues.length
    }
  };
}
