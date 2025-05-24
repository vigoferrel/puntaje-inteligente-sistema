
import { TLearningNode, TPAESPrueba } from '@/types/system-types';

/**
 * Utilidades para validar la coherencia de nodos de aprendizaje - VERSIÓN ACTUALIZADA POST-MIGRACIÓN
 */

// Mapeo de palabras clave por tipo de prueba ACTUALIZADO
const THEMATIC_KEYWORDS: Record<TPAESPrueba, readonly string[]> = {
  'COMPETENCIA_LECTORA': [
    'comprensión', 'lectura', 'texto', 'interpretación', 'análisis textual', 
    'comprensión lectora', 'estrategias de lectura', 'inferencia', 'síntesis',
    'información explícita', 'información implícita', 'propósito comunicativo',
    'vocabulario', 'secuencias', 'argumentos', 'evaluar', 'localizar',
    'párrafo', 'oración', 'idea principal', 'tema central', 'contexto',
    'significado', 'intención', 'estructura textual', 'coherencia', 'cohesión',
    'narración', 'descripción', 'argumentación', 'exposición', 'diálogo'
  ] as const,
  'MATEMATICA_1': [
    'álgebra', 'geometría', 'aritmética', 'ecuación', 'números', 'operaciones',
    'fracciones', 'porcentaje', 'proporciones', 'estadística básica', 'enteros',
    'racionales', 'potencias', 'raíces', 'función lineal', 'pitágoras', 'polígonos',
    'área', 'perímetro', 'volumen', 'ángulos', 'triángulos', 'cuadriláteros',
    'círculo', 'gráficos', 'tablas', 'promedio', 'mediana', 'moda', 'razón',
    'proporción', 'regla de tres', 'interés', 'descuento', 'suma', 'resta',
    'multiplicación', 'división', 'factorización', 'múltiplos', 'divisores'
  ] as const,
  'MATEMATICA_2': [
    'función', 'cálculo', 'trigonometría', 'logaritmo', 'derivada', 'integral',
    'límite', 'probabilidad', 'estadística avanzada', 'modelamiento matemático',
    'función cuadrática', 'función exponencial', 'vectores', 'ecuación de la recta',
    'parábola', 'hipérbola', 'elipse', 'seno', 'coseno', 'tangente', 'matriz',
    'determinante', 'sistema de ecuaciones', 'inecuaciones', 'optimización',
    'análisis', 'continuidad', 'derivabilidad', 'máximos', 'mínimos',
    'concavidad', 'punto de inflexión', 'asíntota', 'dominio', 'rango'
  ] as const,
  'CIENCIAS': [
    'biología', 'química', 'física', 'célula', 'átomo', 'molécula', 'ecosistema',
    'genética', 'homeostasis', 'evolución', 'fuerza', 'energía', 'reacción química',
    'metabolismo', 'cinemática', 'estructura atómica', 'organización biológica',
    'adn', 'proteínas', 'enzimas', 'fotosíntesis', 'respiración celular',
    'mitosis', 'meiosis', 'herencia', 'mutación', 'selección natural',
    'biodiversidad', 'cadena alimentaria', 'ciclos biogeoquímicos', 'ph',
    'ácidos', 'bases', 'enlaces químicos', 'tabla periódica', 'velocidad',
    'aceleración', 'movimiento', 'ondas', 'calor', 'temperatura', 'luz'
  ] as const,
  'HISTORIA': [
    'historia', 'civilización', 'guerra', 'independencia', 'revolución', 'imperio',
    'siglo', 'época', 'cultura', 'sociedad', 'política', 'económico', 'colonial',
    'prehispánico', 'conquista', 'democracia', 'participación', 'temporal', 'multicausal',
    'cronología', 'periodización', 'fuentes históricas', 'proceso histórico',
    'cambio', 'continuidad', 'causa', 'consecuencia', 'protagonistas',
    'contexto histórico', 'patrimonio', 'memoria', 'identidad', 'territorio',
    'estado', 'nación', 'ciudadanía', 'derechos humanos', 'constitución',
    'república', 'monarquía', 'feudalismo', 'capitalismo', 'socialismo'
  ] as const
};

// Mapeo de skills válidos por tipo de prueba CORREGIDO DESPUÉS DE LA MIGRACIÓN
const VALID_SKILLS_BY_TEST: Record<number, readonly number[]> = {
  1: [1, 2, 3], // COMPETENCIA_LECTORA
  2: [4, 5, 6, 7], // MATEMATICA_1
  3: [4, 5, 6, 7], // MATEMATICA_2
  4: [12, 13, 14, 15, 16], // HISTORIA (CORREGIDO)
  5: [8, 9, 10, 11] // CIENCIAS (CORREGIDO)
} as const;

// Validación de niveles cognitivos válidos
const VALID_COGNITIVE_LEVELS = [
  'RECORDAR', 'COMPRENDER', 'APLICAR', 'ANALIZAR', 'EVALUAR', 'CREAR'
] as const;

// Mapeo de test_id a prueba CORREGIDO DESPUÉS DE LA MIGRACIÓN
const TEST_ID_TO_PRUEBA: Record<number, TPAESPrueba> = {
  1: 'COMPETENCIA_LECTORA',
  2: 'MATEMATICA_1',
  3: 'MATEMATICA_2',
  4: 'HISTORIA', // CORREGIDO
  5: 'CIENCIAS' // CORREGIDO
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
  
  // Verificar coherencia temática con algoritmo mejorado
  const testScores: Record<TPAESPrueba, number> = {} as Record<TPAESPrueba, number>;
  
  for (const [testType, keywords] of Object.entries(THEMATIC_KEYWORDS)) {
    const score = keywords.reduce((acc: number, keyword: string) => {
      const keywordLower = keyword.toLowerCase();
      const exactMatches = (nodeText.match(new RegExp(`\\b${keywordLower}\\b`, 'g')) || []).length;
      const partialMatches = (nodeText.match(new RegExp(keywordLower, 'g')) || []).length - exactMatches;
      return acc + (exactMatches * 2) + (partialMatches * 0.5);
    }, 0);
    
    testScores[testType as TPAESPrueba] = score;
    
    if (score > maxScore) {
      maxScore = score;
      suggestedTest = testType as TPAESPrueba;
    }
  }
  
  // Verificar coherencia entre test_id y subject_area
  const expectedSubjectArea = TEST_ID_TO_PRUEBA[node.testId];
  if (expectedSubjectArea && node.subject_area !== expectedSubjectArea) {
    issues.push(`Subject area (${node.subject_area}) no coincide con test_id ${node.testId} (esperado: ${expectedSubjectArea})`);
  }
  
  // Verificar coherencia entre prueba y subject_area
  if (node.subject_area !== node.prueba) {
    issues.push(`Subject area (${node.subject_area}) no coincide con prueba (${node.prueba})`);
  }
  
  // Validar cognitive_level
  if (node.cognitive_level && !VALID_COGNITIVE_LEVELS.includes(node.cognitive_level as any)) {
    issues.push(`Nivel cognitivo inválido: ${node.cognitive_level}`);
  }
  
  // Verificar skill_id coherencia con mapeo actualizado
  const validSkills = VALID_SKILLS_BY_TEST[node.testId];
  if (node.skillId && validSkills && !validSkills.includes(node.skillId)) {
    issues.push(`Skill ID ${node.skillId} no es válido para test_id ${node.testId} (válidos: ${validSkills.join(', ')})`);
  }
  
  // Calcular confianza
  const currentTestScore = testScores[node.prueba] || 0;
  const hasThematicContent = maxScore > 0;
  const confidence = hasThematicContent 
    ? Math.min(currentTestScore / Math.max(maxScore, 1), 1) 
    : 1;
  
  const isValid = issues.length === 0 && (confidence > 0.5 || maxScore < 2);
  
  return {
    isValid,
    suggestedTest,
    confidence,
    issues
  };
}

/**
 * Filtra nodos con validación de coherencia temática
 */
export function filterNodesWithValidation(
  nodes: TLearningNode[], 
  selectedPrueba: TPAESPrueba,
  enableLogging = true
): TLearningNode[] {
  const filtered = nodes.filter(node => {
    const pruebaMatch = node.prueba === selectedPrueba;
    const subjectAreaMatch = node.subject_area === selectedPrueba;
    const testIdMatch = TEST_ID_TO_PRUEBA[node.testId] === selectedPrueba;
    
    const matchCount = [pruebaMatch, subjectAreaMatch, testIdMatch].filter(Boolean).length;
    return matchCount >= 2;
  });
  
  if (enableLogging) {
    console.group(`🔍 Filtrado actualizado de nodos para ${selectedPrueba}`);
    console.log(`📊 Total de nodos disponibles: ${nodes.length}`);
    console.log(`✅ Nodos filtrados: ${filtered.length}`);
    
    if (filtered.length === 0 && nodes.length > 0) {
      console.warn(`⚠️ No se encontraron nodos coherentes para ${selectedPrueba}`);
      
      // Análisis de qué nodos existen por test_id
      const nodesByTestId = nodes.reduce((acc, node) => {
        const testKey = `test_id_${node.testId}`;
        const prueba = TEST_ID_TO_PRUEBA[node.testId];
        acc[testKey] = {
          count: (acc[testKey]?.count || 0) + 1,
          prueba: prueba || 'UNKNOWN'
        };
        return acc;
      }, {} as Record<string, { count: number; prueba: string }>);
      
      console.log('📈 Nodos disponibles por test_id:', nodesByTestId);
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
    type: 'thematic_mismatch' | 'skill_mismatch' | 'missing_content' | 'cognitive_level_mismatch' | 'subject_area_mismatch' | 'test_id_mismatch';
    nodeId: string;
    description: string;
    suggestion?: string;
  }>;
  summary: {
    totalNodes: number;
    validNodes: number;
    issuesCount: number;
    issuesByType: Record<string, number>;
  };
} {
  const issues: Array<{
    type: 'thematic_mismatch' | 'skill_mismatch' | 'missing_content' | 'cognitive_level_mismatch' | 'subject_area_mismatch' | 'test_id_mismatch';
    nodeId: string;
    description: string;
    suggestion?: string;
  }> = [];
  
  const issuesByType: Record<string, number> = {};
  
  nodes.forEach(node => {
    const validation = validateNodeThematicCoherence(node);
    
    if (!validation.isValid) {
      validation.issues.forEach(issue => {
        let type: 'thematic_mismatch' | 'skill_mismatch' | 'missing_content' | 'cognitive_level_mismatch' | 'subject_area_mismatch' | 'test_id_mismatch';
        
        if (issue.includes('Skill ID')) {
          type = 'skill_mismatch';
        } else if (issue.includes('Subject area') && issue.includes('test_id')) {
          type = 'test_id_mismatch';
        } else if (issue.includes('Subject area')) {
          type = 'subject_area_mismatch';
        } else if (issue.includes('Nivel cognitivo')) {
          type = 'cognitive_level_mismatch';
        } else {
          type = 'thematic_mismatch';
        }
        
        issuesByType[type] = (issuesByType[type] || 0) + 1;
        
        issues.push({
          type,
          nodeId: node.id,
          description: `${node.title}: ${issue}`,
          suggestion: validation.suggestedTest
        });
      });
    }
    
    if (!node.description || node.description.trim().length < 20) {
      const type = 'missing_content';
      issuesByType[type] = (issuesByType[type] || 0) + 1;
      issues.push({
        type,
        nodeId: node.id,
        description: `${node.title}: Descripción insuficiente (mínimo 20 caracteres)`
      });
    }
  });
  
  const uniqueNodesWithIssues = new Set(issues.map(issue => issue.nodeId));
  
  return {
    isValid: issues.length === 0,
    issues,
    summary: {
      totalNodes: nodes.length,
      validNodes: nodes.length - uniqueNodesWithIssues.size,
      issuesCount: issues.length,
      issuesByType
    }
  };
}

/**
 * Función de auto-corrección para nodos con problemas menores
 */
export function autoCorrectNodeIssues(node: TLearningNode): TLearningNode {
  const correctedNode = { ...node };
  
  // Auto-corregir subject_area basado en test_id
  const expectedSubjectArea = TEST_ID_TO_PRUEBA[node.testId];
  if (expectedSubjectArea && node.subject_area !== expectedSubjectArea) {
    correctedNode.subject_area = expectedSubjectArea;
    console.log(`🔧 Auto-corregido subject_area para ${node.title}: ${node.subject_area} → ${expectedSubjectArea}`);
  }
  
  // Auto-corregir cognitive_level si es inválido
  if (!node.cognitive_level || !VALID_COGNITIVE_LEVELS.includes(node.cognitive_level as any)) {
    correctedNode.cognitive_level = 'COMPRENDER';
    console.log(`🔧 Auto-corregido cognitive_level para ${node.title}: ${node.cognitive_level} → COMPRENDER`);
  }
  
  // Auto-corregir skill_id si no es válido para el test
  const validSkills = VALID_SKILLS_BY_TEST[node.testId];
  if (validSkills && node.skillId && !validSkills.includes(node.skillId)) {
    correctedNode.skillId = validSkills[0];
    console.log(`🔧 Auto-corregido skill_id para ${node.title}: ${node.skillId} → ${validSkills[0]}`);
  }
  
  return correctedNode;
}
