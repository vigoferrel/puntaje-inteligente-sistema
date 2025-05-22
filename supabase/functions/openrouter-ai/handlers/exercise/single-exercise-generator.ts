
import { callOpenRouter } from "../../services/model-service.ts";
import { MonitoringService } from "../../services/monitoring-service.ts";
import { CacheService } from "../../services/cache-service.ts";
import { FallbackService, FallbackOperation } from "../../services/fallback-service.ts";
import { extractJsonFromContent } from "../../utils/json-extractor.ts";

/**
 * Genera un ejercicio individual utilizando IA
 * Implementa sistemas de caché y fallback
 */
export async function generateExercise(payload: any): Promise<any> {
  const { skill, test, difficulty = "INTERMEDIATE" } = payload;
  
  // Iniciar métricas de rendimiento
  const startTime = MonitoringService.startRequest();
  MonitoringService.info(`Generando ejercicio para skill: ${skill}, test: ${test}, dificultad: ${difficulty}`);
  
  try {
    // Verificar caché primero
    const cacheKey = CacheService.generateExerciseCacheKey(skill, test, difficulty);
    const cachedExercise = CacheService.get(cacheKey);
    
    if (cachedExercise) {
      MonitoringService.info(`Ejercicio recuperado de caché: ${cacheKey}`);
      MonitoringService.endRequest(startTime, true);
      return { result: cachedExercise };
    }
    
    const systemPrompt = `Eres un asistente especializado en generar ejercicios educativos para la prueba PAES.
    Debes crear un ejercicio de dificultad ${difficulty} que evalúe la habilidad/competencia ${skill} 
    para la prueba de tipo ${test}.
    Formatea tu respuesta como un objeto JSON con esta estructura exacta:
    {
      "question": "pregunta completa",
      "options": ["opción 1", "opción 2", "opción 3", "opción 4"],
      "correctAnswer": "opción correcta (texto exacto, debe coincidir con una de las opciones)",
      "explanation": "explicación detallada de la respuesta correcta",
      "difficulty": "${difficulty}",
      "skill": "${skill}"
    }`;

    const userPrompt = `Genera un ejercicio de dificultad ${difficulty} para evaluar la habilidad ${skill} 
    en la prueba ${test}. Debe ser un ejercicio desafiante, contextualizado y que evalúe efectivamente la habilidad.`;

    const response = await callOpenRouter(systemPrompt, userPrompt);
    
    if (response.error) {
      MonitoringService.error(`Error en la generación del ejercicio:`, response.error);
      
      // Registrar fallo para modo degradado
      const failureCount = FallbackService.recordFailure(FallbackOperation.GENERATE_EXERCISE);
      if (failureCount >= 3) {
        MonitoringService.warn(`Entrando en modo degradado para generación de ejercicios después de ${failureCount} fallos`);
      }
      
      const fallbackExercise = response.fallbackResponse || 
                               FallbackService.generateFallback(
                                 FallbackOperation.GENERATE_EXERCISE, 
                                 { skillId: skill, testId: test, difficulty }
                               );
      
      MonitoringService.endRequest(startTime, false);
      return {
        error: response.error,
        result: fallbackExercise
      };
    }
    
    // Procesar la respuesta
    const exercise = processExerciseResponse(response.result);
    
    // Guardar en caché si es válido
    if (isValidExercise(exercise)) {
      CacheService.set(cacheKey, exercise);
      
      // Restablecer contador de fallos
      FallbackService.resetFailureCounter(FallbackOperation.GENERATE_EXERCISE);
    }
    
    MonitoringService.endRequest(startTime, true);
    return { result: exercise };
  } catch (error) {
    MonitoringService.logException(error, { skill, test, difficulty });
    
    // Usar fallback
    const fallbackExercise = FallbackService.generateFallback(
      FallbackOperation.GENERATE_EXERCISE, 
      { skillId: skill, testId: test, difficulty }
    );
    
    MonitoringService.endRequest(startTime, false);
    return {
      error: `Error inesperado: ${error instanceof Error ? error.message : 'Desconocido'}`,
      result: fallbackExercise
    };
  }
}

/**
 * Procesa la respuesta del modelo y extrae el ejercicio
 */
function processExerciseResponse(content: any): any {
  // Si ya es un objeto, validarlo directamente
  if (typeof content === 'object' && content !== null) {
    return validateExercise(content);
  }
  
  // Si es un string, intentar extraer JSON
  if (typeof content === 'string') {
    try {
      const extractedJson = extractJsonFromContent(content);
      if (extractedJson) {
        return validateExercise(extractedJson);
      }
    } catch (error) {
      MonitoringService.error('Error al procesar respuesta de ejercicio:', error);
    }
  }
  
  // Si llegamos aquí, la respuesta no es válida
  return null;
}

/**
 * Valida y sanitiza el ejercicio generado
 */
function validateExercise(exercise: any): any {
  if (!exercise || typeof exercise.question !== 'string') {
    return null;
  }
  
  // Asegurar que options sea un array
  const options = Array.isArray(exercise.options) ? 
    exercise.options : 
    typeof exercise.options === 'string' ? [exercise.options] : [];
  
  // Crear un ejercicio sanitizado
  return {
    id: exercise.id || `gen-${Date.now()}`,
    question: exercise.question,
    options: options.length >= 2 ? options : ['Opción A', 'Opción B'],
    correctAnswer: exercise.correctAnswer || options[0] || 'Opción A',
    explanation: exercise.explanation || 'No se proporcionó explicación para este ejercicio.',
    difficulty: exercise.difficulty || 'INTERMEDIATE',
    skill: exercise.skill || 'GENERAL'
  };
}

/**
 * Verifica si un ejercicio cumple con los requisitos mínimos
 */
function isValidExercise(exercise: any): boolean {
  return exercise &&
         typeof exercise.question === 'string' && 
         Array.isArray(exercise.options) && 
         exercise.options.length >= 2 &&
         typeof exercise.correctAnswer === 'string';
}
