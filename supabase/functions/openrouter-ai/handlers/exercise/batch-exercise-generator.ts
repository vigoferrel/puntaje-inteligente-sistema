
import { callOpenRouter } from "../../services/model-service.ts";
import { MonitoringService } from "../../services/monitoring-service.ts";
import { CacheService } from "../../services/cache-service.ts";
import { FallbackService, FallbackOperation } from "../../services/fallback-service.ts";
import { extractJsonFromContent } from "../../utils/json-extractor.ts";

/**
 * Genera un lote de ejercicios utilizando IA
 * Implementa sistemas de caché y proceso por lotes para optimizar rendimiento
 */
export async function generateExercisesBatch(payload: any): Promise<any> {
  const { skill, test, count = 3, difficulty = "MIXED" } = payload;
  
  // Iniciar métricas de rendimiento
  const startTime = MonitoringService.startRequest();
  MonitoringService.info(`Generando lote de ${count} ejercicios para skill: ${skill}, test: ${test}, dificultad: ${difficulty}`);
  
  try {
    // Si la cantidad solicitada es pequeña (<=2), intentar usar ejercicios en caché
    if (count <= 2) {
      const cacheKey = CacheService.generateExerciseCacheKey(skill, test, difficulty);
      const cachedExercises = CacheService.get(cacheKey);
      
      if (cachedExercises) {
        MonitoringService.info(`Ejercicios recuperados de caché: ${cacheKey}`);
        MonitoringService.endRequest(startTime, true);
        return { result: Array.isArray(cachedExercises) ? cachedExercises : [cachedExercises] };
      }
    }
    
    const systemPrompt = `Eres un asistente especializado en generar ejercicios educativos para la prueba PAES.
    Debes crear ${count} ejercicios de dificultad ${difficulty} que evalúen la habilidad/competencia ${skill} 
    para la prueba de tipo ${test}.
    
    Formatea tu respuesta como un array de objetos JSON con esta estructura exacta:
    [
      {
        "question": "pregunta completa del primer ejercicio",
        "options": ["opción 1", "opción 2", "opción 3", "opción 4"],
        "correctAnswer": "opción correcta (texto exacto)",
        "explanation": "explicación detallada",
        "difficulty": "BASIC|INTERMEDIATE|ADVANCED",
        "skill": "${skill}"
      },
      // Más ejercicios...
    ]`;

    const userPrompt = `Genera ${count} ejercicios diferentes de dificultad ${difficulty} para evaluar la habilidad ${skill} 
    en la prueba ${test}. Asegúrate de que sean ejercicios variados, contextualizados y que evalúen efectivamente la habilidad.
    Si la dificultad es MIXED, crea ejercicios de diferentes niveles de dificultad.`;

    const response = await callOpenRouter(systemPrompt, userPrompt);
    
    if (response.error) {
      MonitoringService.error(`Error en la generación del lote de ejercicios:`, response.error);
      
      // Registrar fallo para modo degradado
      const failureCount = FallbackService.recordFailure(FallbackOperation.GENERATE_EXERCISE);
      if (failureCount >= 3) {
        MonitoringService.warn(`Entrando en modo degradado para generación de ejercicios después de ${failureCount} fallos`);
      }
      
      // Generar ejercicios de fallback
      const fallbackExercises = generateFallbackExercises(count, skill, test, difficulty);
      
      MonitoringService.endRequest(startTime, false);
      return {
        error: response.error,
        result: fallbackExercises
      };
    }
    
    // Procesar la respuesta
    const exercises = processExercisesBatchResponse(response.result);
    
    // Guardar en caché si son válidos y son pocos (<=3)
    if (exercises.length > 0 && exercises.length <= 3) {
      const cacheKey = CacheService.generateExerciseCacheKey(skill, test, difficulty);
      CacheService.set(cacheKey, exercises);
      
      // Restablecer contador de fallos
      FallbackService.resetFailureCounter(FallbackOperation.GENERATE_EXERCISE);
    }
    
    MonitoringService.endRequest(startTime, true);
    return { result: exercises };
  } catch (error) {
    MonitoringService.logException(error, { skill, test, count, difficulty });
    
    // Generar ejercicios de fallback
    const fallbackExercises = generateFallbackExercises(count, skill, test, difficulty);
    
    MonitoringService.endRequest(startTime, false);
    return {
      error: `Error inesperado: ${error instanceof Error ? error.message : 'Desconocido'}`,
      result: fallbackExercises
    };
  }
}

/**
 * Procesa la respuesta del modelo y extrae los ejercicios
 */
function processExercisesBatchResponse(content: any): any[] {
  // Si ya es un array, validarlo directamente
  if (Array.isArray(content)) {
    return content.map(validateExercise).filter(isValidExercise);
  }
  
  // Si es un objeto pero no un array (un solo ejercicio)
  if (typeof content === 'object' && content !== null) {
    const validatedExercise = validateExercise(content);
    return isValidExercise(validatedExercise) ? [validatedExercise] : [];
  }
  
  // Si es un string, intentar extraer JSON
  if (typeof content === 'string') {
    try {
      const extractedJson = extractJsonFromContent(content);
      if (extractedJson) {
        if (Array.isArray(extractedJson)) {
          return extractedJson.map(validateExercise).filter(isValidExercise);
        } else {
          const validatedExercise = validateExercise(extractedJson);
          return isValidExercise(validatedExercise) ? [validatedExercise] : [];
        }
      }
    } catch (error) {
      MonitoringService.error('Error al procesar respuesta de lote de ejercicios:', error);
    }
  }
  
  // Si llegamos aquí, la respuesta no es válida
  return [];
}

/**
 * Valida y sanitiza un ejercicio generado
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
    id: exercise.id || `gen-${Date.now()}-${Math.floor(Math.random() * 1000)}`,
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

/**
 * Genera ejercicios de fallback cuando el servicio AI falla
 */
function generateFallbackExercises(count: number, skill: any, test: any, difficulty: string): any[] {
  const exercises = [];
  
  for (let i = 0; i < count; i++) {
    const fallbackExercise = FallbackService.generateFallback(
      FallbackOperation.GENERATE_EXERCISE, 
      { 
        skillId: skill, 
        testId: test, 
        difficulty,
        index: i 
      }
    );
    
    // Asegurarse de que cada ejercicio tenga un ID único
    fallbackExercise.id = `fallback-${Date.now()}-${i}`;
    
    exercises.push(fallbackExercise);
  }
  
  return exercises;
}
