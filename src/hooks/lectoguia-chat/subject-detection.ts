
import { SUBJECT_TO_PRUEBA_MAP } from '@/hooks/lectoguia/use-subjects';

/**
 * Utility functions for subject detection and handling
 */

// Re-export subject names from a central place
export const subjectNames: Record<string, string> = {
  general: 'modo general',
  lectura: 'Comprensión Lectora',
  'matematicas-basica': 'Matemáticas 7° a 2° medio',
  'matematicas-avanzada': 'Matemáticas 3° y 4° medio',
  ciencias: 'Ciencias',
  historia: 'Historia'
};

/**
 * Detect subject from user message
 */
export function detectSubjectFromMessage(message: string): string | null {
  const lowerMessage = message.toLowerCase();
  
  if (lowerMessage.includes('leer') || lowerMessage.includes('texto') || lowerMessage.includes('lectura') || 
      lowerMessage.includes('comprensión') || lowerMessage.includes('comprender')) {
    return 'lectura';
  } else if (lowerMessage.includes('mate') || lowerMessage.includes('álgebra') || 
             lowerMessage.includes('número') || lowerMessage.includes('geometría') ||
             lowerMessage.includes('matemática')) {
    // Detectar nivel específico de matemáticas
    if (lowerMessage.includes('7') || 
        lowerMessage.includes('octavo') || 
        lowerMessage.includes('primero medio') || 
        lowerMessage.includes('segundo medio') ||
        lowerMessage.includes('básico') ||
        lowerMessage.includes('básica')) {
      return 'matematicas-basica';
    } else if (lowerMessage.includes('tercero medio') || 
               lowerMessage.includes('cuarto medio') || 
               lowerMessage.includes('avanzado') ||
               lowerMessage.includes('avanzada')) {
      return 'matematicas-avanzada';
    } else {
      // Por defecto usar matemáticas básicas si no se especifica
      return 'matematicas-basica';
    }
  } else if (lowerMessage.includes('ciencia') || lowerMessage.includes('física') || 
             lowerMessage.includes('química') || lowerMessage.includes('biología')) {
    return 'ciencias';
  } else if (lowerMessage.includes('historia') || lowerMessage.includes('geografía') || 
             lowerMessage.includes('social')) {
    return 'historia';
  }
  
  return null;
}

