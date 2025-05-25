
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
 * Actualizado con base en el contenido real del examen 2024
 */
export const mapHistoriaQuestionToSkill = (questionNumber: number): TPAESHabilidad => {
  // Formación Ciudadana (1-12) - Pensamiento crítico y reflexión
  if (questionNumber >= 1 && questionNumber <= 12) {
    return 'CRITICAL_THINKING';
  }
  
  // Historia: Mundo, América y Chile (13-57)
  if (questionNumber >= 13 && questionNumber <= 57) {
    // Preguntas de contexto histórico y análisis temporal (13-30)
    if (questionNumber <= 30) {
      return 'TEMPORAL_THINKING';
    }
    // Preguntas de análisis de fuentes y procesos (31-45)
    else if (questionNumber <= 45) {
      return 'SOURCE_ANALYSIS';
    }
    // Preguntas de análisis multicausal y procesos complejos (46-57)
    else {
      return 'MULTICAUSAL_ANALYSIS';
    }
  }
  
  // Sistema Económico (58-65) - Análisis multicausal
  if (questionNumber >= 58 && questionNumber <= 65) {
    return 'MULTICAUSAL_ANALYSIS';
  }
  
  return 'TEMPORAL_THINKING';
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
 * Obtiene la dificultad estimada según el número de pregunta y contenido
 */
export const getHistoriaQuestionDifficulty = (questionNumber: number): 'basic' | 'intermediate' | 'advanced' => {
  // Formación Ciudadana: generalmente intermedia
  if (questionNumber >= 1 && questionNumber <= 12) {
    return 'intermediate';
  }
  
  // Historia temprana: básica a intermedia
  if (questionNumber >= 13 && questionNumber <= 25) {
    return 'basic';
  }
  
  // Historia media: intermedia
  if (questionNumber >= 26 && questionNumber <= 45) {
    return 'intermediate';
  }
  
  // Historia avanzada y sistema económico: avanzada
  if (questionNumber >= 46) {
    return 'advanced';
  }
  
  return 'intermediate';
};

/**
 * Obtiene el peso/importancia de una pregunta según su posición y sección
 */
export const getHistoriaQuestionWeight = (questionNumber: number): number => {
  const section = getHistoriaSectionName(questionNumber);
  
  switch (section) {
    case 'Formación Ciudadana':
      return 1.3; // Mayor peso por relevancia ciudadana
    case 'Historia: Mundo, América y Chile':
      return 1.0; // Peso estándar
    case 'Sistema Económico':
      return 1.2; // Peso mayor por complejidad
    default:
      return 1.0;
  }
};

/**
 * Determina si una pregunta requiere análisis de texto/contexto
 */
export const requiresContextAnalysis = (questionNumber: number): boolean => {
  // Preguntas que típicamente incluyen textos o contextos para analizar
  return questionNumber >= 23 && questionNumber <= 45;
};

/**
 * Obtiene el tipo de contenido predominante en una pregunta
 */
export const getHistoriaContentType = (questionNumber: number): string => {
  if (questionNumber >= 1 && questionNumber <= 12) {
    return 'Educación Cívica y Formación Ciudadana';
  }
  
  if (questionNumber >= 13 && questionNumber <= 30) {
    return 'Historia de Chile Siglo XIX';
  }
  
  if (questionNumber >= 31 && questionNumber <= 45) {
    return 'Historia Contemporánea y Mundial';
  }
  
  if (questionNumber >= 46 && questionNumber <= 57) {
    return 'Historia de América Latina';
  }
  
  if (questionNumber >= 58 && questionNumber <= 65) {
    return 'Economía y Sistemas Económicos';
  }
  
  return 'Historia General';
};
