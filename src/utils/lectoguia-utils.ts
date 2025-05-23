
import { TPAESHabilidad, TPAESPrueba, getHabilidadDisplayName } from '@/types/system-types';
import { SUBJECT_TO_PRUEBA_MAP } from '@/contexts/lectoguia/types';

// Helper para obtener un nombre amigable para cada habilidad
export function getSkillName(skillCode: string): string {
  return getHabilidadDisplayName(skillCode as TPAESHabilidad);
}

// Helper para formatear el nivel de habilidad
export function formatSkillLevel(level: number): string {
  const percentage = Math.round(level * 100);
  return `${percentage}%`;
}

// Función para obtener los niveles de habilidades iniciales
export function getInitialSkillLevels(): Record<string, number> {
  return {
    // Competencia lectora
    'TRACK_LOCATE': 0,
    'INTERPRET_RELATE': 0,
    'EVALUATE_REFLECT': 0,
    
    // Matemáticas 1 y 2 (comparten habilidades)
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
}

// Función para agrupar habilidades por tipo de prueba
export function getSkillsByPrueba(): Record<TPAESPrueba, TPAESHabilidad[]> {
  return {
    'COMPETENCIA_LECTORA': ['TRACK_LOCATE', 'INTERPRET_RELATE', 'EVALUATE_REFLECT'],
    'MATEMATICA_1': ['SOLVE_PROBLEMS', 'REPRESENT', 'MODEL', 'ARGUE_COMMUNICATE'],
    'MATEMATICA_2': ['SOLVE_PROBLEMS', 'REPRESENT', 'MODEL', 'ARGUE_COMMUNICATE'],
    'CIENCIAS': ['IDENTIFY_THEORIES', 'PROCESS_ANALYZE', 'APPLY_PRINCIPLES', 'SCIENTIFIC_ARGUMENT'],
    'HISTORIA': ['TEMPORAL_THINKING', 'SOURCE_ANALYSIS', 'MULTICAUSAL_ANALYSIS', 'CRITICAL_THINKING', 'REFLECTION']
  };
}

// Función para obtener el ID de una habilidad a partir de su código
export function getSkillId(skillCode: string): number | null {
  const skillIds: Record<string, number> = {
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
  
  return skillIds[skillCode] || null;
}

// Función para convertir una materia en su prueba PAES correspondiente
export function subjectToPrueba(subject: string): TPAESPrueba {
  return SUBJECT_TO_PRUEBA_MAP[subject] as TPAESPrueba || 'COMPETENCIA_LECTORA';
}

// Función para obtener las habilidades de una prueba PAES
export function getSkillsForPrueba(prueba: TPAESPrueba): TPAESHabilidad[] {
  const skillsByPrueba = getSkillsByPrueba();
  return skillsByPrueba[prueba] || [];
}
