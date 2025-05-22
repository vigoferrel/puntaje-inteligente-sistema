
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
    case 'TRACK_LOCATE': return 1;
    case 'INTERPRET_RELATE': return 2;
    case 'EVALUATE_REFLECT': return 3;
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
    'TRACK_LOCATE': 0,
    'INTERPRET_RELATE': 0,
    'EVALUATE_REFLECT': 0,
    'ALGEBRA': 0,
    'PHYSICS': 0,
    'HISTORY': 0
  };
};

/**
 * Helper function to get skill name from code
 * @param skillCode The code of the skill
 * @returns The display name for the skill
 */
export const getSkillName = (skillCode: string): string => {
  switch (skillCode) {
    case 'TRACK_LOCATE': return 'Rastrear y Localizar';
    case 'INTERPRET_RELATE': return 'Interpretar y Relacionar';
    case 'EVALUATE_REFLECT': return 'Evaluar y Reflexionar';
    case 'ALGEBRA': return 'Álgebra';
    case 'PHYSICS': return 'Física';
    case 'HISTORY': return 'Historia';
    default: return skillCode || 'Desconocida';
  }
};

/**
 * Helper function to validate skill code
 * @param skillCode The code to validate
 * @returns Boolean indicating if the code is valid
 */
export const isValidSkillCode = (skillCode: string): boolean => {
  return ['TRACK_LOCATE', 'INTERPRET_RELATE', 'EVALUATE_REFLECT', 'ALGEBRA', 'PHYSICS', 'HISTORY'].includes(skillCode);
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
