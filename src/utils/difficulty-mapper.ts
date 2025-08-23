
/**
 * Utility functions for mapping difficulty levels between different formats
 */

export type DifficultyLevel = 'BASICO' | 'INTERMEDIO' | 'AVANZADO';
export type EnglishDifficulty = 'basic' | 'intermediate' | 'advanced';

/**
 * Maps English difficulty levels to Spanish ones
 */
export const mapDifficultyToSpanish = (difficulty: EnglishDifficulty | string): DifficultyLevel => {
  const difficultyLower = difficulty.toLowerCase();
  
  switch (difficultyLower) {
    case 'basic':
    case 'easy':
    case 'basico':
      return 'BASICO';
    case 'advanced':
    case 'hard':
    case 'avanzado':
      return 'AVANZADO';
    case 'intermediate':
    case 'medium':
    case 'intermedio':
    default:
      return 'INTERMEDIO';
  }
};

/**
 * Maps Spanish difficulty levels to English ones
 */
export const mapDifficultyToEnglish = (difficulty: DifficultyLevel | string): EnglishDifficulty => {
  const difficultyUpper = difficulty.toUpperCase();
  
  switch (difficultyUpper) {
    case 'BASICO':
      return 'basic';
    case 'AVANZADO':
      return 'advanced';
    case 'INTERMEDIO':
    default:
      return 'intermediate';
  }
};
