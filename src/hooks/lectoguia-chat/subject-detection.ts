
/**
 * Utility functions for subject detection and handling
 */

// Map of subject display names
export const subjectNames: Record<string, string> = {
  general: 'modo general',
  lectura: 'Comprensión Lectora',
  matematicas: 'Matemáticas',
  ciencias: 'Ciencias',
  historia: 'Historia'
};

/**
 * Detect subject from user message
 */
export function detectSubjectFromMessage(message: string): string | null {
  const lowerMessage = message.toLowerCase();
  
  if (lowerMessage.includes('leer') || lowerMessage.includes('texto') || lowerMessage.includes('lectura')) {
    return 'lectura';
  } else if (lowerMessage.includes('mate') || lowerMessage.includes('álgebra') || lowerMessage.includes('número')) {
    return 'matematicas';
  } else if (lowerMessage.includes('ciencia') || lowerMessage.includes('física') || lowerMessage.includes('química') || lowerMessage.includes('biología')) {
    return 'ciencias';
  } else if (lowerMessage.includes('historia') || lowerMessage.includes('geografía') || lowerMessage.includes('social')) {
    return 'historia';
  }
  
  return null;
}
