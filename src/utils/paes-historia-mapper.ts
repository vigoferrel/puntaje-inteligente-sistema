
import { TPAESPrueba, TPAESHabilidad } from "@/types/system-types";

/**
 * Mapea las secciones del examen PAES Historia a códigos de prueba
 */
export const mapHistoriaSectionToPrueba = (section: string): TPAESPrueba => {
  switch (section.toLowerCase()) {
    case 'formacion_ciudadana':
    case 'historia':
    case 'sistema_economico':
      return 'HISTORIA';
    default:
      return 'HISTORIA';
  }
};

/**
 * Mapea tipos de preguntas de Historia a habilidades PAES
 */
export const mapHistoriaQuestionToSkill = (questionNumber: number): TPAESHabilidad => {
  // Formación Ciudadana (1-12) - Análisis y evaluación
  if (questionNumber >= 1 && questionNumber <= 12) {
    return 'ANALYZE_EVALUATE';
  }
  
  // Historia (13-57) - Interpretación y relación
  if (questionNumber >= 13 && questionNumber <= 57) {
    if (questionNumber <= 30) {
      return 'INTERPRET_RELATE';
    } else {
      return 'ANALYZE_EVALUATE';
    }
  }
  
  // Sistema Económico (58-65) - Análisis y evaluación
  if (questionNumber >= 58 && questionNumber <= 65) {
    return 'ANALYZE_EVALUATE';
  }
  
  return 'INTERPRET_RELATE';
};

/**
 * Obtiene el nombre de la sección según el número de pregunta
 */
export const getHistoriaSectionName = (questionNumber: number): string => {
  if (questionNumber >= 1 && questionNumber <= 12) {
    return 'Formación Ciudadana';
  }
  
  if (questionNumber >= 13 && questionNumber <= 57) {
    return 'Historia: Mundo, América y Chile';
  }
  
  if (questionNumber >= 58 && questionNumber <= 65) {
    return 'Sistema Económico';
  }
  
  return 'Historia';
};

/**
 * Obtiene la dificultad estimada según el número de pregunta
 */
export const getHistoriaQuestionDifficulty = (questionNumber: number): 'basic' | 'intermediate' | 'advanced' => {
  // Primeras preguntas tienden a ser más básicas
  if (questionNumber <= 20) {
    return 'basic';
  }
  
  // Preguntas medias son intermedias
  if (questionNumber <= 50) {
    return 'intermediate';
  }
  
  // Últimas preguntas son más avanzadas
  return 'advanced';
};

/**
 * Obtiene el peso/importancia de una pregunta según su posición y sección
 */
export const getHistoriaQuestionWeight = (questionNumber: number): number => {
  const section = getHistoriaSectionName(questionNumber);
  
  switch (section) {
    case 'Formación Ciudadana':
      return 1.2; // Mayor peso por relevancia ciudadana
    case 'Historia: Mundo, América y Chile':
      return 1.0; // Peso estándar
    case 'Sistema Económico':
      return 1.1; // Peso ligeramente mayor
    default:
      return 1.0;
  }
};
