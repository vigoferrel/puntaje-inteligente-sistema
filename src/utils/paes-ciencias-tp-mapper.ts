
import { TPAESPrueba, TPAESHabilidad } from "@/types/system-types";

/**
 * Mapea las áreas científicas del examen PAES Ciencias TP a códigos de prueba
 */
export const mapCienciasTPAreaToPrueba = (area: string): TPAESPrueba => {
  switch (area.toUpperCase()) {
    case 'BIOLOGIA':
    case 'FISICA':
    case 'QUIMICA':
      return 'CIENCIAS';
    default:
      return 'CIENCIAS';
  }
};

/**
 * Mapea preguntas de Ciencias TP a habilidades PAES según número y área
 */
export const mapCienciasTPQuestionToSkill = (
  questionNumber: number, 
  areaCientifica: string
): TPAESHabilidad => {
  // Biología (1-28) - Módulo Común
  if (questionNumber >= 1 && questionNumber <= 28) {
    if (questionNumber <= 10) {
      return 'REPRESENT'; // Representar y comunicar
    } else if (questionNumber <= 20) {
      return 'MODEL'; // Modelar
    } else {
      return 'SOLVE_PROBLEMS'; // Resolver problemas
    }
  }
  
  // Física (29-54) - Módulo Común
  if (questionNumber >= 29 && questionNumber <= 54) {
    if (questionNumber <= 40) {
      return 'SOLVE_PROBLEMS'; // Resolver problemas
    } else {
      return 'MODEL'; // Modelar
    }
  }
  
  // Química (55-80) - Módulo Técnico Profesional
  if (questionNumber >= 55 && questionNumber <= 80) {
    if (questionNumber <= 65) {
      return 'REPRESENT'; // Representar y comunicar
    } else if (questionNumber <= 75) {
      return 'SOLVE_PROBLEMS'; // Resolver problemas
    } else {
      return 'ARGUE_COMMUNICATE'; // Argumentar y comunicar
    }
  }
  
  return 'SOLVE_PROBLEMS'; // Por defecto
};

/**
 * Obtiene el nombre del área científica según el número de pregunta
 */
export const getCienciasTPAreaName = (questionNumber: number): string => {
  if (questionNumber >= 1 && questionNumber <= 28) {
    return 'Biología';
  }
  
  if (questionNumber >= 29 && questionNumber <= 54) {
    return 'Física';
  }
  
  if (questionNumber >= 55 && questionNumber <= 80) {
    return 'Química';
  }
  
  return 'Ciencias';
};

/**
 * Obtiene el módulo según el número de pregunta
 */
export const getCienciasTPModuleName = (questionNumber: number): string => {
  if (questionNumber <= 54) {
    return 'Módulo Común';
  }
  
  return 'Módulo Técnico Profesional';
};

/**
 * Obtiene la dificultad estimada según el número de pregunta y área
 */
export const getCienciasTPQuestionDifficulty = (
  questionNumber: number, 
  areaCientifica: string
): 'basic' | 'intermediate' | 'advanced' => {
  // Biología: progresión de básico a avanzado
  if (questionNumber >= 1 && questionNumber <= 28) {
    if (questionNumber <= 10) return 'basic';
    if (questionNumber <= 20) return 'intermediate';
    return 'advanced';
  }
  
  // Física: mayormente intermedio y avanzado
  if (questionNumber >= 29 && questionNumber <= 54) {
    if (questionNumber <= 35) return 'intermediate';
    return 'advanced';
  }
  
  // Química (Técnico Profesional): avanzado
  if (questionNumber >= 55 && questionNumber <= 80) {
    return 'advanced';
  }
  
  return 'intermediate';
};

/**
 * Obtiene el peso/importancia de una pregunta según su área y módulo
 */
export const getCienciasTPQuestionWeight = (questionNumber: number): number => {
  const area = getCienciasTPAreaName(questionNumber);
  const modulo = getCienciasTPModuleName(questionNumber);
  
  // Módulo Técnico Profesional tiene mayor peso
  if (modulo === 'Módulo Técnico Profesional') {
    return 1.3;
  }
  
  // Área específica en módulo común
  switch (area) {
    case 'Biología':
      return 1.1; // Peso estándar alto
    case 'Física':
      return 1.2; // Peso alto por complejidad
    case 'Química':
      return 1.0; // Peso estándar
    default:
      return 1.0;
  }
};

/**
 * Determina si una pregunta es del módulo técnico profesional
 */
export const isTecnicoProfesionalQuestion = (questionNumber: number): boolean => {
  return questionNumber > 54;
};

/**
 * Obtiene el tipo de contenido predominante en una pregunta
 */
export const getCienciasTPContentType = (questionNumber: number): string => {
  if (questionNumber >= 1 && questionNumber <= 10) {
    return 'Biología Celular y Molecular';
  }
  
  if (questionNumber >= 11 && questionNumber <= 20) {
    return 'Biología de Organismos y Ecosistemas';
  }
  
  if (questionNumber >= 21 && questionNumber <= 28) {
    return 'Biología Aplicada y Genética';
  }
  
  if (questionNumber >= 29 && questionNumber <= 40) {
    return 'Física Mecánica y Ondas';
  }
  
  if (questionNumber >= 41 && questionNumber <= 54) {
    return 'Física Eléctrica y Térmica';
  }
  
  if (questionNumber >= 55 && questionNumber <= 65) {
    return 'Química Inorgánica Industrial';
  }
  
  if (questionNumber >= 66 && questionNumber <= 75) {
    return 'Química Orgánica y Procesos';
  }
  
  if (questionNumber >= 76 && questionNumber <= 80) {
    return 'Química Analítica y Control de Calidad';
  }
  
  return 'Ciencias Aplicadas';
};

/**
 * Verifica si una pregunta es piloto (excluida del puntaje)
 */
export const isPilotQuestion = (questionNumber: number): boolean => {
  // Preguntas piloto identificadas: 11, 16, 35, 52, 80
  return [11, 16, 35, 52, 80].includes(questionNumber);
};

/**
 * Obtiene estadísticas de distribución del examen
 */
export const getCienciasTPDistributionStats = () => {
  return {
    total: 80,
    biologia: 28, // Preguntas 1-28
    fisica: 26,   // Preguntas 29-54
    quimica: 26,  // Preguntas 55-80
    moduloComun: 54,              // Preguntas 1-54
    moduloTecnicoProfesional: 26, // Preguntas 55-80
    preguntasPiloto: 5,           // 11, 16, 35, 52, 80
    preguntasValidas: 75,         // 80 - 5 piloto
    duracionMinutos: 160,
    porcentajeBiologia: 35.0,     // 28/80
    porcentajeFisica: 32.5,       // 26/80
    porcentajeQuimica: 32.5       // 26/80
  };
};
