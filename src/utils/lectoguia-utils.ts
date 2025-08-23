
import { TPAESHabilidad, TPAESPrueba } from '@/types/system-types';

// Re-export cn from lib/utils for convenience
export { cn } from '@/lib/utils';

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

// Alias for compatibility
export const getSkillName = getSkillDisplayName;

export const getSkillColor = (skillCode: string): string => {
  const colors: Record<string, string> = {
    'TRACK_LOCATE': '#3B82F6', // blue-500
    'INTERPRET_RELATE': '#10B981', // emerald-500
    'EVALUATE_REFLECT': '#8B5CF6', // violet-500
    'SOLVE_PROBLEMS': '#F59E0B', // amber-500
    'REPRESENT': '#EF4444', // red-500
    'MODEL': '#06B6D4', // cyan-500
    'ARGUE_COMMUNICATE': '#84CC16', // lime-500
    'IDENTIFY_THEORIES': '#EC4899', // pink-500
    'PROCESS_ANALYZE': '#6366F1', // indigo-500
    'APPLY_PRINCIPLES': '#14B8A6', // teal-500
    'SCIENTIFIC_ARGUMENT': '#F97316', // orange-500
    'TEMPORAL_THINKING': '#A855F7', // purple-500
    'SOURCE_ANALYSIS': '#059669', // emerald-600
    'MULTICAUSAL_ANALYSIS': '#DC2626', // red-600
    'CRITICAL_THINKING': '#7C3AED', // violet-600
    'REFLECTION': '#0891B2' // cyan-600
  };

  return colors[skillCode] || '#6B7280'; // gray-500 default
};

export const formatSkillLevel = (level: number): string => {
  const percentage = Math.round(level * 100);
  return `${percentage}%`;
};

export const getSkillsByPrueba = (prueba: TPAESPrueba): TPAESHabilidad[] => {
  const skillsByPrueba: Record<TPAESPrueba, TPAESHabilidad[]> = {
    'COMPETENCIA_LECTORA': [
      'TRACK_LOCATE',
      'INTERPRET_RELATE',
      'EVALUATE_REFLECT'
    ],
    'MATEMATICA_1': [
      'SOLVE_PROBLEMS',
      'REPRESENT',
      'MODEL'
    ],
    'MATEMATICA_2': [
      'SOLVE_PROBLEMS',
      'REPRESENT',
      'MODEL',
      'ARGUE_COMMUNICATE'
    ],
    'CIENCIAS': [
      'IDENTIFY_THEORIES',
      'PROCESS_ANALYZE',
      'APPLY_PRINCIPLES',
      'SCIENTIFIC_ARGUMENT'
    ],
    'HISTORIA': [
      'TEMPORAL_THINKING',
      'SOURCE_ANALYSIS',
      'MULTICAUSAL_ANALYSIS',
      'CRITICAL_THINKING',
      'REFLECTION'
    ]
  };

  return skillsByPrueba[prueba] || [];
};

export const formatTimeRemaining = (seconds: number): string => {
  const hours = Math.floor(seconds / 3600);
  const minutes = Math.floor((seconds % 3600) / 60);
  const remainingSeconds = seconds % 60;

  if (hours > 0) {
    return `${hours}:${minutes.toString().padStart(2, '0')}:${remainingSeconds.toString().padStart(2, '0')}`;
  } else {
    return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`;
  }
};
