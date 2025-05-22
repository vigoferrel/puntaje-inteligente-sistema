
/**
 * Helper function to map skill codes to IDs
 * @param skillCode The code of the skill 
 * @returns The ID number for the skill or null if invalid
 */
export const getSkillId = (skillCode: string): number | null => {
  if (!skillCode) {
    console.warn('Invalid skill code: empty or undefined');
    return null;
  }
  
  switch (skillCode) {
    // Comprensión Lectora
    case 'TRACK_LOCATE': return 1;
    case 'INTERPRET_RELATE': return 2;
    case 'EVALUATE_REFLECT': return 3;
    
    // Matemáticas
    case 'SOLVE_PROBLEMS': return 4;
    case 'REPRESENT': return 5;
    case 'MODEL': return 6;
    case 'ARGUE_COMMUNICATE': return 7;
    
    // Ciencias
    case 'IDENTIFY_THEORIES': return 8;
    case 'PROCESS_ANALYZE': return 9;
    case 'APPLY_PRINCIPLES': return 10;
    case 'SCIENTIFIC_ARGUMENT': return 11;
    
    // Historia
    case 'TEMPORAL_THINKING': return 12;
    case 'SOURCE_ANALYSIS': return 13;
    case 'MULTICAUSAL_ANALYSIS': return 14;
    case 'CRITICAL_THINKING': return 15;
    case 'REFLECTION': return 16;
    
    default: 
      console.warn(`Invalid skill code: ${skillCode}`);
      return null;
  }
};

/**
 * Helper function to get initial skill levels
 * @returns Object with default skill level values
 */
export const getInitialSkillLevels = () => {
  return {
    // Comprensión Lectora
    'TRACK_LOCATE': 0,
    'INTERPRET_RELATE': 0,
    'EVALUATE_REFLECT': 0,
    
    // Matemáticas
    'SOLVE_PROBLEMS': 0,
    'REPRESENT': 0,
    'MODEL': 0,
    'ARGUE_COMMUNICATE': 0,
    
    // Ciencias
    'IDENTIFY_THEORIES': 0,
    'PROCESS_ANALYZE': 0, 
    'APPLY_PRINCIPLES': 0,
    'SCIENTIFIC_ARGUMENT': 0,
    
    // Historia
    'TEMPORAL_THINKING': 0,
    'SOURCE_ANALYSIS': 0,
    'MULTICAUSAL_ANALYSIS': 0,
    'CRITICAL_THINKING': 0,
    'REFLECTION': 0
  };
};

/**
 * Helper function to get skill name from code
 * @param skillCode The code of the skill
 * @returns The display name for the skill
 */
export const getSkillName = (skillCode: string): string => {
  switch (skillCode) {
    // Comprensión Lectora
    case 'TRACK_LOCATE': return 'Rastrear y Localizar';
    case 'INTERPRET_RELATE': return 'Interpretar y Relacionar';
    case 'EVALUATE_REFLECT': return 'Evaluar y Reflexionar';
    
    // Matemáticas
    case 'SOLVE_PROBLEMS': return 'Resolver Problemas';
    case 'REPRESENT': return 'Representar';
    case 'MODEL': return 'Modelar';
    case 'ARGUE_COMMUNICATE': return 'Argumentar y Comunicar';
    
    // Ciencias
    case 'IDENTIFY_THEORIES': return 'Identificar Teorías';
    case 'PROCESS_ANALYZE': return 'Procesar y Analizar';
    case 'APPLY_PRINCIPLES': return 'Aplicar Principios';
    case 'SCIENTIFIC_ARGUMENT': return 'Argumentación Científica';
    
    // Historia
    case 'TEMPORAL_THINKING': return 'Pensamiento Temporal';
    case 'SOURCE_ANALYSIS': return 'Análisis de Fuentes';
    case 'MULTICAUSAL_ANALYSIS': return 'Análisis Multicausal';
    case 'CRITICAL_THINKING': return 'Pensamiento Crítico';
    case 'REFLECTION': return 'Reflexión';
    
    default: return skillCode || 'Desconocida';
  }
};

/**
 * Helper function to validate skill code
 * @param skillCode The code to validate
 * @returns Boolean indicating if the code is valid
 */
export const isValidSkillCode = (skillCode: string): boolean => {
  return [
    // Comprensión Lectora
    'TRACK_LOCATE', 'INTERPRET_RELATE', 'EVALUATE_REFLECT',
    
    // Matemáticas
    'SOLVE_PROBLEMS', 'REPRESENT', 'MODEL', 'ARGUE_COMMUNICATE',
    
    // Ciencias
    'IDENTIFY_THEORIES', 'PROCESS_ANALYZE', 'APPLY_PRINCIPLES', 'SCIENTIFIC_ARGUMENT',
    
    // Historia
    'TEMPORAL_THINKING', 'SOURCE_ANALYSIS', 'MULTICAUSAL_ANALYSIS', 'CRITICAL_THINKING', 'REFLECTION'
  ].includes(skillCode);
};

/**
 * Helper function to format skill level for display
 * @param level Number between 0 and 1
 * @returns Formatted percentage string
 */
export const formatSkillLevel = (level: number): string => {
  if (typeof level !== 'number' || isNaN(level)) {
    return '0%';
  }
  
  // Ensure level is between 0 and 1
  const normalized = Math.max(0, Math.min(1, level));
  return `${Math.round(normalized * 100)}%`;
};
