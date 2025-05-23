
/**
 * Funciones de utilidad para la LectoGuía
 */

import { ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";
import { TPAESHabilidad, TPAESPrueba } from "@/types/system-types";

/**
 * Función para combinar clases con tailwind-merge y clsx
 * @param inputs Lista de clases a combinar
 * @returns Clase combinada
 */
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

/**
 * Genera un identificador único
 * @returns Identificador único
 */
export function generateId() {
  return Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15);
}

/**
 * Obtiene el nombre para mostrar de una materia
 * @param subjectCode Código de materia
 * @returns Nombre para mostrar
 */
export function getSubjectName(subjectCode: string): string {
  const subjectNames: Record<string, string> = {
    'lectura': 'Competencia Lectora',
    'matematicas-basica': 'Matemática 1',
    'matematicas-avanzada': 'Matemática 2',
    'ciencias': 'Ciencias',
    'historia': 'Historia'
  };

  return subjectNames[subjectCode] || subjectCode;
}

/**
 * Obtiene los niveles de habilidad iniciales - Solo para las 6 habilidades principales
 * @returns Niveles de habilidad iniciales
 */
export function getInitialSkillLevels(): Record<TPAESHabilidad, number> {
  return {
    'TRACK_LOCATE': 0,
    'INTERPRET_RELATE': 0,
    'EVALUATE_REFLECT': 0,
    'SOLVE_PROBLEMS': 0,
    'REPRESENT': 0,
    'MODEL': 0,
    'ARGUE_COMMUNICATE': 0,
    'IDENTIFY_THEORIES': 0,
    'PROCESS_ANALYZE': 0,
    'APPLY_PRINCIPLES': 0,
    'SCIENTIFIC_ARGUMENT': 0,
    'TEMPORAL_THINKING': 0,
    'SOURCE_ANALYSIS': 0,
    'MULTICAUSAL_ANALYSIS': 0,
    'CRITICAL_THINKING': 0,
    'REFLECTION': 0
  };
}

/**
 * Formatea el tiempo restante en formato mm:ss
 * @param timeInSeconds Tiempo en segundos
 * @returns Tiempo formateado como string
 */
export function formatTimeRemaining(timeInSeconds: number): string {
  const minutes = Math.floor(timeInSeconds / 60);
  const seconds = timeInSeconds % 60;
  
  return `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
}

/**
 * Obtiene el nombre para mostrar de una habilidad PAES - Solo las 6 principales en uso
 * @param skillCode Código de habilidad PAES
 * @returns Nombre para mostrar
 */
export function getSkillName(skillCode: string): string {
  const skillNames: Record<string, string> = {
    'TRACK_LOCATE': 'Localizar información',
    'INTERPRET_RELATE': 'Interpretar y relacionar',
    'EVALUATE_REFLECT': 'Evaluar y reflexionar',
    'SOLVE_PROBLEMS': 'Resolución de problemas',
    'REPRESENT': 'Representación',
    'MODEL': 'Modelamiento',
    'ARGUE_COMMUNICATE': 'Argumentación y comunicación',
    'IDENTIFY_THEORIES': 'Identificación de teorías',
    'PROCESS_ANALYZE': 'Procesar y analizar',
    'APPLY_PRINCIPLES': 'Aplicar principios',
    'SCIENTIFIC_ARGUMENT': 'Argumentación científica',
    'TEMPORAL_THINKING': 'Pensamiento temporal',
    'SOURCE_ANALYSIS': 'Análisis de fuentes',
    'MULTICAUSAL_ANALYSIS': 'Análisis multicausal',
    'CRITICAL_THINKING': 'Pensamiento crítico',
    'REFLECTION': 'Reflexión'
  };
  
  return skillNames[skillCode] || skillCode;
}

/**
 * Formatea el nivel de habilidad para mostrar
 * @param level Nivel de habilidad
 * @returns Nivel formateado
 */
export function formatSkillLevel(level: number): string {
  if (level < 0.25) return 'Inicial';
  if (level < 0.5) return 'Básico';
  if (level < 0.75) return 'Intermedio';
  return 'Avanzado';
}

/**
 * Obtiene el ID de una habilidad - Solo las 6 principales
 * @param skillCode Código de habilidad
 * @returns ID de la habilidad
 */
export function getSkillId(skillCode: string): number {
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
  
  return skillIds[skillCode] || 1;
}

/**
 * Obtiene las habilidades por prueba PAES - Solo las 6 principales en uso
 * @param prueba Tipo de prueba PAES
 * @returns Array de habilidades
 */
export function getSkillsByPrueba(prueba: TPAESPrueba): TPAESHabilidad[] {
  const skillsByPrueba: Record<TPAESPrueba, TPAESHabilidad[]> = {
    'COMPETENCIA_LECTORA': ['TRACK_LOCATE', 'INTERPRET_RELATE', 'EVALUATE_REFLECT'],
    'MATEMATICA_1': ['SOLVE_PROBLEMS', 'REPRESENT'],
    'MATEMATICA_2': ['MODEL', 'SOLVE_PROBLEMS'],
    'CIENCIAS': ['INTERPRET_RELATE', 'EVALUATE_REFLECT', 'MODEL'],
    'HISTORIA': ['TRACK_LOCATE', 'INTERPRET_RELATE', 'EVALUATE_REFLECT']
  };
  
  return skillsByPrueba[prueba] || ['INTERPRET_RELATE'];
}

/**
 * Mapea código de habilidad al nombre de prueba PAES - Solo las 6 principales en uso
 * @param skill Código de habilidad
 * @returns Pruebas donde se evalúa esta habilidad
 */
export function getSkillTestMapping(skill: TPAESHabilidad): TPAESPrueba[] {
  const skillToTests: Record<TPAESHabilidad, TPAESPrueba[]> = {
    'TRACK_LOCATE': ['COMPETENCIA_LECTORA', 'HISTORIA'],
    'INTERPRET_RELATE': ['COMPETENCIA_LECTORA', 'CIENCIAS', 'HISTORIA'],
    'EVALUATE_REFLECT': ['COMPETENCIA_LECTORA', 'CIENCIAS', 'HISTORIA'],
    'SOLVE_PROBLEMS': ['MATEMATICA_1', 'MATEMATICA_2'],
    'REPRESENT': ['MATEMATICA_1'],
    'MODEL': ['MATEMATICA_2', 'CIENCIAS'],
    'ARGUE_COMMUNICATE': [],
    'IDENTIFY_THEORIES': [],
    'PROCESS_ANALYZE': [],
    'APPLY_PRINCIPLES': [],
    'SCIENTIFIC_ARGUMENT': [],
    'TEMPORAL_THINKING': [],
    'SOURCE_ANALYSIS': [],
    'MULTICAUSAL_ANALYSIS': [],
    'CRITICAL_THINKING': [],
    'REFLECTION': []
  };
  
  return skillToTests[skill] || [];
}

/**
 * Obtiene el color asociado a una habilidad - Solo las 6 principales
 * @param skill Código de habilidad
 * @returns Color en formato hexadecimal
 */
export function getSkillColor(skill: TPAESHabilidad): string {
  const skillColors: Record<TPAESHabilidad, string> = {
    'TRACK_LOCATE': '#8B5CF6',
    'INTERPRET_RELATE': '#3B82F6', 
    'EVALUATE_REFLECT': '#EF4444',
    'SOLVE_PROBLEMS': '#4F46E5',
    'REPRESENT': '#10B981',
    'MODEL': '#F59E0B',
    'ARGUE_COMMUNICATE': '#6B7280',
    'IDENTIFY_THEORIES': '#6B7280',
    'PROCESS_ANALYZE': '#6B7280',
    'APPLY_PRINCIPLES': '#6B7280',
    'SCIENTIFIC_ARGUMENT': '#6B7280',
    'TEMPORAL_THINKING': '#6B7280',
    'SOURCE_ANALYSIS': '#6B7280',
    'MULTICAUSAL_ANALYSIS': '#6B7280',
    'CRITICAL_THINKING': '#6B7280',
    'REFLECTION': '#6B7280'
  };
  
  return skillColors[skill] || '#6B7280';
}
