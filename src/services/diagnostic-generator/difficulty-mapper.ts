
import { DifficultLevel } from "./types";

/**
 * Mapea cadenas de dificultad a valores aceptados por la base de datos
 */
export const mapDifficulty = (difficulty: string): DifficultLevel => {
  const difficultyLower = difficulty.toLowerCase();
  if (difficultyLower === 'basic' || difficultyLower === 'easy') {
    return 'basic';
  } else if (difficultyLower === 'advanced' || difficultyLower === 'hard') {
    return 'advanced';
  }
  return 'intermediate'; // valor por defecto
};
