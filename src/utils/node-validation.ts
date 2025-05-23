
import { TLearningNode, TPAESPrueba } from '@/types/system-types';

/**
 * Utilidades para validar la coherencia de nodos de aprendizaje
 */

// Mapeo de palabras clave por tipo de prueba
const THEMATIC_KEYWORDS = {
  'COMPETENCIA_LECTORA': [
    'comprensión', 'lectura', 'texto', 'interpretación', 'análisis textual', 
    'comprensión lectora', 'estrategias de lectura', 'inferencia', 'síntesis'
  ],
  'MATEMATICA_1': [
    'álgebra', 'geometría', 'aritmética', 'ecuación', 'números', 'operaciones',
    'fracciones', 'porcentaje', 'proporciones', 'estadística básica'
  ],
  'MATEMATICA_2': [
    'función', 'cálculo', 'trigonometría', 'logaritmo', 'derivada', 'integral',
    'límite', 'probabilidad', 'estadística avanzada', 'modelamiento matemático'
  ],
  'CIENCIAS': [
    'biología', 'química', 'física', 'célula', 'átomo', 'molécula', 'ecosistema',
    'genética', 'homeostasis', 'evolución', 'fuerza', 'energía', 'reacción química'
  ],
  'HISTORIA': [
    'historia', 'civilización', 'guerra', 'independencia', 'revolución', 'imperio',
    'siglo', 'época', 'cultura', 'sociedad', 'política', 'económico', 'colonial'
  ]
} as const;

// Mapeo de skills válidos por tipo de prueba
const VALID_SKILLS_BY_TEST = {
  1: [1, 2, 3], // COMPETENCIA_LECTORA: TRACK_LOCATE, INTERPRET_RELATE, EVALUATE_REFLECT
  2: [4, 5, 6, 7], // MATEMATICA_1: SOLVE_PROBLEMS, REPRESENT, MODEL, ARGUE_COMMUNICATE
  3: [4, 5, 6, 7], // MATEMATICA_2: SOLVE_PROBLEMS, REPRESENT, MODEL, ARGUE_COMMUNICATE
  4: [8, 9, 10, 11], // CIENCIAS: IDENTIFY_THEORIES, PROCESS_ANALYZE, APPLY_PRINCIPLES, SCIENTIFIC_ARGUMENT
  5: [12, 13, 14, 15, 16] // HISTORIA: TEMPORAL_THINKING, SOURCE_ANALYSIS, MULTICAUSAL_ANALYSIS, CRITICAL_THINKING, REFLECTION
} as const;

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
    const score = (keywords as readonly string[]).reduce((acc: number, keyword: string) => {
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
  
  if (currentTestScore === 0 && maxScore > 0) {
    issues.push(`Contenido temático no coincide con ${node.prueba}. Sugiere: ${suggestedTest}`);
  }
  
  // Verificar skill_id coherencia usando test_id del nodo
  const testIdToNumber = {
    'COMPETENCIA_LECTORA': 1,
    'MATEMATICA_1': 2,
    'MATEMATICA_2': 3,
    'CIENCIAS': 4,
    'HISTORIA': 5
  };
  
  const testId = testIdToNumber[node.prueba];
  const validSkills = VALID_SKILLS_BY_TEST[testId as keyof typeof VALID_SKILLS_BY_TEST];
  
  if (node.skillId && !validSkills?.includes(node.skillId)) {
    issues.push(`Skill ID ${node.skillId} no es válido para ${node.prueba}`);
  }
  
  const confidence = maxScore > 0 ? Math.min(currentTestScore / maxScore, 1) : 1;
  
  return {
    isValid: issues.length === 0 && confidence > 0.3,
    suggestedTest,
    confidence,
    issues
  };
}

/**
 * Filtra nodos con validación de coherencia temática y logs de debugging
 */
export function filterNodesWithValidation(
  nodes: TLearningNode[], 
  selectedPrueba: TPAESPrueba,
  enableLogging = true
): TLearningNode[] {
  const filtered = nodes.filter(node => node.prueba === selectedPrueba);
  
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
      console.warn(`⚠️ Nodos con problemas de coherencia:`, invalidNodes);
    }
    
    // Buscar nodos que podrían pertenecer a esta prueba pero están en otras
    const potentialNodes = nodes.filter(node => {
      if (node.prueba === selectedPrueba) return false;
      const validation = validateNodeThematicCoherence({
        ...node,
        prueba: selectedPrueba
      });
      return validation.confidence > 0.7;
    });
    
    if (potentialNodes.length > 0) {
      console.warn(`🔄 Nodos que podrían pertenecer a ${selectedPrueba}:`, 
        potentialNodes.map(n => `${n.title} (actualmente en ${n.prueba})`));
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
    type: 'thematic_mismatch' | 'skill_mismatch' | 'missing_content';
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
    type: 'thematic_mismatch' | 'skill_mismatch' | 'missing_content';
    nodeId: string;
    description: string;
    suggestion?: string;
  }> = [];
  
  nodes.forEach(node => {
    const validation = validateNodeThematicCoherence(node);
    
    if (!validation.isValid) {
      validation.issues.forEach(issue => {
        issues.push({
          type: issue.includes('Skill ID') ? 'skill_mismatch' : 'thematic_mismatch',
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
      validNodes: nodes.length - issues.length,
      issuesCount: issues.length
    }
  };
}
