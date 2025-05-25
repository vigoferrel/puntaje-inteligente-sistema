
import { TPAESPrueba, TPAESHabilidad } from "@/types/system-types";

/**
 * Mapea las secciones del examen PAES Matemática 2 a códigos de prueba
 */
export const mapMatematica2SectionToPrueba = (section: string): TPAESPrueba => {
  switch (section.toLowerCase()) {
    case 'algebra':
    case 'geometria':
    case 'probabilidad':
    case 'calculo':
      return 'MATEMATICA_2';
    default:
      return 'MATEMATICA_2';
  }
};

/**
 * Mapea tipos de preguntas de Matemática 2 a habilidades PAES
 * Actualizado con base en el contenido real del examen 2024
 */
export const mapMatematica2QuestionToSkill = (questionNumber: number): TPAESHabilidad => {
  // Álgebra y funciones (1-20) - Resolver problemas y modelar
  if (questionNumber >= 1 && questionNumber <= 20) {
    if (questionNumber <= 10) {
      return 'SOLVE_PROBLEMS';
    } else {
      return 'MODEL';
    }
  }
  
  // Geometría (21-35) - Representar y resolver problemas
  if (questionNumber >= 21 && questionNumber <= 35) {
    if (questionNumber <= 28) {
      return 'REPRESENT';
    } else {
      return 'SOLVE_PROBLEMS';
    }
  }
  
  // Probabilidad y estadística (36-45) - Modelar y argumentar
  if (questionNumber >= 36 && questionNumber <= 45) {
    if (questionNumber <= 40) {
      return 'MODEL';
    } else {
      return 'ARGUE_COMMUNICATE';
    }
  }
  
  // Cálculo y límites (46-55) - Resolver problemas avanzados
  if (questionNumber >= 46 && questionNumber <= 55) {
    return 'SOLVE_PROBLEMS';
  }
  
  return 'SOLVE_PROBLEMS';
};

/**
 * Obtiene el nombre del eje temático según el número de pregunta
 */
export const getMatematica2EjeName = (questionNumber: number): string => {
  if (questionNumber >= 1 && questionNumber <= 20) {
    return 'Álgebra y Funciones';
  }
  
  if (questionNumber >= 21 && questionNumber <= 35) {
    return 'Geometría';
  }
  
  if (questionNumber >= 36 && questionNumber <= 45) {
    return 'Probabilidad y Estadística';
  }
  
  if (questionNumber >= 46 && questionNumber <= 55) {
    return 'Cálculo y Límites';
  }
  
  return 'Matemática 2';
};

/**
 * Obtiene la dificultad estimada según el número de pregunta y contenido
 */
export const getMatematica2QuestionDifficulty = (questionNumber: number): 'basic' | 'intermediate' | 'advanced' => {
  // Álgebra básica: intermedia
  if (questionNumber >= 1 && questionNumber <= 10) {
    return 'intermediate';
  }
  
  // Álgebra avanzada y funciones: avanzada
  if (questionNumber >= 11 && questionNumber <= 20) {
    return 'advanced';
  }
  
  // Geometría básica: intermedia
  if (questionNumber >= 21 && questionNumber <= 28) {
    return 'intermediate';
  }
  
  // Geometría avanzada: avanzada
  if (questionNumber >= 29 && questionNumber <= 35) {
    return 'advanced';
  }
  
  // Probabilidad: avanzada
  if (questionNumber >= 36 && questionNumber <= 45) {
    return 'advanced';
  }
  
  // Cálculo: avanzada
  if (questionNumber >= 46) {
    return 'advanced';
  }
  
  return 'intermediate';
};

/**
 * Obtiene el peso/importancia de una pregunta según su posición y eje
 */
export const getMatematica2QuestionWeight = (questionNumber: number): number => {
  const eje = getMatematica2EjeName(questionNumber);
  
  switch (eje) {
    case 'Álgebra y Funciones':
      return 1.2; // Mayor peso por ser fundamental
    case 'Geometría':
      return 1.0; // Peso estándar
    case 'Probabilidad y Estadística':
      return 1.1; // Peso ligeramente mayor
    case 'Cálculo y Límites':
      return 1.3; // Mayor peso por complejidad
    default:
      return 1.0;
  }
};

/**
 * Determina si una pregunta requiere cálculo avanzado
 */
export const requiresAdvancedCalculation = (questionNumber: number): boolean => {
  // Preguntas que típicamente requieren cálculo más avanzado
  return questionNumber >= 46 || (questionNumber >= 36 && questionNumber <= 45);
};

/**
 * Obtiene el tipo de contenido predominante en una pregunta
 */
export const getMatematica2ContentType = (questionNumber: number): string => {
  if (questionNumber >= 1 && questionNumber <= 10) {
    return 'Álgebra Básica y Ecuaciones';
  }
  
  if (questionNumber >= 11 && questionNumber <= 20) {
    return 'Funciones y Modelamiento';
  }
  
  if (questionNumber >= 21 && questionNumber <= 28) {
    return 'Geometría Plana';
  }
  
  if (questionNumber >= 29 && questionNumber <= 35) {
    return 'Geometría Espacial y Analítica';
  }
  
  if (questionNumber >= 36 && questionNumber <= 40) {
    return 'Probabilidad';
  }
  
  if (questionNumber >= 41 && questionNumber <= 45) {
    return 'Estadística';
  }
  
  if (questionNumber >= 46 && questionNumber <= 55) {
    return 'Cálculo Diferencial e Integral';
  }
  
  return 'Matemática Avanzada';
};

/**
 * Verifica si una pregunta es de suficiencia de datos
 */
export const isSuficiencyQuestion = (questionNumber: number): boolean => {
  // Las preguntas de suficiencia de datos suelen estar al final
  return questionNumber >= 50;
};
