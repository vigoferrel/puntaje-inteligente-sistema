
import { Exercise } from '@/types/ai-types';
import { TPAESHabilidad, TPAESPrueba } from '@/types/system-types';

/**
 * Patrones que indican contenido inapropiado o sin sentido
 */
const INAPPROPRIATE_PATTERNS = [
  /\b[a-f0-9]{8}-[a-f0-9]{4}-[a-f0-9]{4}-[a-f0-9]{4}-[a-f0-9]{12}\b/i, // UUIDs
  /^[a-z0-9_-]+$/i, // Solo códigos/IDs
  /^\w+\.\w+\.\w+/i, // Paths de archivos
  /^[A-Z_]+$/i, // Solo constantes
  /\bid\b.*\bnode\b/i, // Referencias a IDs de nodos
  /\bobject\b.*\barray\b/i, // Referencias técnicas
  /\bfunction\b.*\breturn\b/i, // Código de programación
  /^\s*\{\s*".*"\s*:\s*".*"\s*\}\s*$/i, // JSON crudo
  /\bundefined\b|\bnull\b/i, // Valores técnicos
  /\bconsole\.log\b|\bconsole\.error\b/i // Código debug
];

/**
 * Palabras clave que debe contener un ejercicio educativo válido
 */
const EDUCATIONAL_KEYWORDS = [
  'pregunta', 'respuesta', 'análisis', 'comprensión', 'interpretación',
  'texto', 'párrafo', 'información', 'datos', 'contexto', 'situación',
  'problema', 'solución', 'razonamiento', 'explicación', 'ejemplo',
  'lectura', 'matemática', 'ciencia', 'historia', 'conocimiento'
];

/**
 * Validador principal de contenido de ejercicios
 */
export class ExerciseContentValidator {
  /**
   * Valida si un ejercicio tiene contenido apropiado para estudiantes
   */
  static validateExercise(exercise: Exercise): {
    isValid: boolean;
    errors: string[];
    warnings: string[];
  } {
    const errors: string[] = [];
    const warnings: string[] = [];

    // Validar que el ejercicio tenga estructura básica
    if (!exercise) {
      errors.push('Ejercicio es nulo o indefinido');
      return { isValid: false, errors, warnings };
    }

    // Validar pregunta
    if (!exercise.question || typeof exercise.question !== 'string') {
      errors.push('Pregunta faltante o inválida');
    } else {
      const questionValidation = this.validateText(exercise.question, 'pregunta');
      errors.push(...questionValidation.errors);
      warnings.push(...questionValidation.warnings);
    }

    // Validar opciones
    if (!Array.isArray(exercise.options) || exercise.options.length < 2) {
      errors.push('Opciones faltantes o insuficientes (mínimo 2)');
    } else {
      exercise.options.forEach((option, index) => {
        if (!option || typeof option !== 'string') {
          errors.push(`Opción ${index + 1} es inválida`);
        } else {
          const optionValidation = this.validateText(option, `opción ${index + 1}`);
          errors.push(...optionValidation.errors);
          warnings.push(...optionValidation.warnings);
        }
      });
    }

    // Validar respuesta correcta
    if (!exercise.correctAnswer) {
      errors.push('Respuesta correcta faltante');
    } else if (!exercise.options.includes(exercise.correctAnswer)) {
      errors.push('Respuesta correcta no coincide con ninguna opción');
    }

    // Validar explicación
    if (exercise.explanation) {
      const explanationValidation = this.validateText(exercise.explanation, 'explicación');
      warnings.push(...explanationValidation.warnings);
    }

    // Validar contexto educativo
    const hasEducationalContent = this.hasEducationalContent(exercise);
    if (!hasEducationalContent) {
      errors.push('El ejercicio no contiene contenido educativo apropiado');
    }

    return {
      isValid: errors.length === 0,
      errors,
      warnings
    };
  }

  /**
   * Valida texto individual por patrones inapropiados
   */
  private static validateText(text: string, fieldName: string): {
    errors: string[];
    warnings: string[];
  } {
    const errors: string[] = [];
    const warnings: string[] = [];

    if (!text || text.trim().length < 5) {
      errors.push(`${fieldName} es demasiado corta`);
      return { errors, warnings };
    }

    // Verificar patrones inapropiados
    for (const pattern of INAPPROPRIATE_PATTERNS) {
      if (pattern.test(text)) {
        errors.push(`${fieldName} contiene contenido técnico inapropiado`);
        break;
      }
    }

    // Verificar longitud mínima apropiada
    if (text.length < 10) {
      warnings.push(`${fieldName} podría ser demasiado breve para ser educativa`);
    }

    // Verificar que no sea solo números o códigos
    if (/^[\d\s\-_\.]+$/.test(text)) {
      errors.push(`${fieldName} contiene solo números o códigos`);
    }

    return { errors, warnings };
  }

  /**
   * Verifica si el ejercicio contiene contenido educativo apropiado
   */
  private static hasEducationalContent(exercise: Exercise): boolean {
    const allText = [
      exercise.question,
      ...(exercise.options || []),
      exercise.explanation || '',
      exercise.text || '',
      exercise.context || ''
    ].join(' ').toLowerCase();

    // Debe tener al menos una palabra clave educativa
    const hasKeyword = EDUCATIONAL_KEYWORDS.some(keyword => 
      allText.includes(keyword.toLowerCase())
    );

    // Debe tener longitud mínima total
    const hasMinLength = allText.length > 50;

    // No debe ser principalmente técnico
    const notMainlyTechnical = !INAPPROPRIATE_PATTERNS.some(pattern => 
      pattern.test(allText)
    );

    return hasKeyword && hasMinLength && notMainlyTechnical;
  }

  /**
   * Sanitiza un ejercicio removiendo contenido problemático
   */
  static sanitizeExercise(exercise: Exercise): Exercise | null {
    if (!exercise) return null;

    try {
      const sanitized = { ...exercise };

      // Limpiar pregunta
      if (sanitized.question) {
        sanitized.question = this.sanitizeText(sanitized.question);
      }

      // Limpiar opciones
      if (sanitized.options) {
        sanitized.options = sanitized.options
          .map(option => this.sanitizeText(option))
          .filter(option => option && option.length > 2);
      }

      // Limpiar explicación
      if (sanitized.explanation) {
        sanitized.explanation = this.sanitizeText(sanitized.explanation);
      }

      // Verificar que sigue siendo válido después de la sanitización
      const validation = this.validateExercise(sanitized);
      
      return validation.isValid ? sanitized : null;
    } catch (error) {
      console.error('Error sanitizando ejercicio:', error);
      return null;
    }
  }

  /**
   * Sanitiza texto individual
   */
  private static sanitizeText(text: string): string {
    if (!text) return '';

    // Remover patrones problemáticos comunes
    let cleaned = text
      .replace(/\b[a-f0-9]{8}-[a-f0-9]{4}-[a-f0-9]{4}-[a-f0-9]{4}-[a-f0-9]{12}\b/gi, '')
      .replace(/\bid\s*:\s*["']?[^"'\s]+["']?/gi, '')
      .replace(/\bobject\s*\[.*?\]/gi, '')
      .replace(/\bundefined\b|\bnull\b/gi, '')
      .trim();

    return cleaned;
  }
}
