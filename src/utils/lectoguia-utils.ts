
import { TPAESHabilidad } from '@/types/system-types';

export const getInitialSkillLevels = (): Record<string, number> => {
  const skills: TPAESHabilidad[] = [
    'TRACK_LOCATE',
    'INTERPRET_RELATE', 
    'EVALUATE_REFLECT',
    'SOLVE_PROBLEMS',
    'REPRESENT',
    'MODEL',
    'ARGUE_COMMUNICATE',
    'IDENTIFY_THEORIES',
    'PROCESS_ANALYZE',
    'APPLY_PRINCIPLES',
    'SCIENTIFIC_ARGUMENT',
    'TEMPORAL_THINKING',
    'SOURCE_ANALYSIS',
    'MULTICAUSAL_ANALYSIS',
    'CRITICAL_THINKING',
    'REFLECTION'
  ];

  const initialLevels: Record<string, number> = {};
  skills.forEach(skill => {
    initialLevels[skill] = 0.3; // Default starting level
  });

  return initialLevels;
};

export const getSkillId = (skillCode: string): number | null => {
  const skillMapping: Record<string, number> = {
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

  return skillMapping[skillCode] || null;
};

export const getSkillDisplayName = (skillCode: string): string => {
  const displayNames: Record<string, string> = {
    'TRACK_LOCATE': 'Rastrear y Localizar',
    'INTERPRET_RELATE': 'Interpretar y Relacionar',
    'EVALUATE_REFLECT': 'Evaluar y Reflexionar',
    'SOLVE_PROBLEMS': 'Resolver Problemas',
    'REPRESENT': 'Representar',
    'MODEL': 'Modelar',
    'ARGUE_COMMUNICATE': 'Argumentar y Comunicar',
    'IDENTIFY_THEORIES': 'Identificar Teorías',
    'PROCESS_ANALYZE': 'Procesar y Analizar',
    'APPLY_PRINCIPLES': 'Aplicar Principios',
    'SCIENTIFIC_ARGUMENT': 'Argumentación Científica',
    'TEMPORAL_THINKING': 'Pensamiento Temporal',
    'SOURCE_ANALYSIS': 'Análisis de Fuentes',
    'MULTICAUSAL_ANALYSIS': 'Análisis Multicausal',
    'CRITICAL_THINKING': 'Pensamiento Crítico',
    'REFLECTION': 'Reflexión'
  };

  return displayNames[skillCode] || skillCode;
};
