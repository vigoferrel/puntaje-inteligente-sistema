/**
 * Funciones de utilidad para la LectoGuía
 */

import { ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

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
 * Obtiene los niveles de habilidad iniciales
 * @returns Niveles de habilidad iniciales
 */
export function getInitialSkillLevels() {
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
 * Obtiene el nombre para mostrar de una habilidad PAES
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
