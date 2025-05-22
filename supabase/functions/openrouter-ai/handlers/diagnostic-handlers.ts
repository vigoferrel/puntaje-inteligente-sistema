
import { callOpenRouter } from "../services/model-service.ts";
import { CacheService } from "../services/cache-service.ts";
import { MonitoringService } from "../services/monitoring-service.ts";
import { FallbackService, FallbackOperation } from "../services/fallback-service.ts";
import { createDiagnosticFallback } from "../utils/fallback-generators.ts";
import { extractJsonFromContent } from "../utils/json-extractor.ts";

/**
 * Manejador para la acción de generación de diagnósticos con caché y fallback
 */
export async function generateDiagnostic(payload: any): Promise<any> {
  const { testId, skills, exercisesPerSkill = 3, difficulty = 'MIXED' } = payload;
  
  // Iniciar métricas de rendimiento
  const startTime = MonitoringService.startRequest();
  MonitoringService.info(`Generando diagnóstico para test ${testId}, habilidades: ${skills.join(', ')}`);
  
  try {
    // Buscar en caché primero
    const cacheKey = CacheService.generateDiagnosticCacheKey(testId, skills, exercisesPerSkill, difficulty);
    const cachedResult = CacheService.get(cacheKey);
    
    if (cachedResult) {
      MonitoringService.info(`Diagnóstico recuperado de caché para test ${testId}`);
      MonitoringService.endRequest(startTime, true);
      return { result: cachedResult };
    }
    
    // Si no está en caché, generar nuevo diagnóstico
    const systemPrompt = `Eres un asistente especializado en crear diagnósticos educativos para la prueba PAES.
    Debes generar un diagnóstico completo con ${exercisesPerSkill} ejercicios para cada una de estas habilidades: ${skills.join(', ')}.
    La dificultad general debe ser: ${difficulty}.
    Formatea tu respuesta como un objeto JSON con la siguiente estructura:
    {
      "title": "Título del diagnóstico",
      "description": "Descripción del diagnóstico",
      "exercises": [
        {
          "question": "pregunta completa",
          "options": ["opción 1", "opción 2", "opción 3", "opción 4"],
          "correctAnswer": "opción correcta (texto exacto)",
          "explanation": "explicación detallada",
          "skill": "habilidad específica",
          "difficulty": "BASIC|INTERMEDIATE|ADVANCED"
        },
        // Más ejercicios...
      ]
    }`;

    const userPrompt = `Genera un diagnóstico completo para el test ${testId} que evalúe estas habilidades: ${skills.join(', ')}.
    Incluye ${exercisesPerSkill} ejercicios por habilidad con una dificultad general ${difficulty}.
    Asegúrate de que los ejercicios sean variados y midan efectivamente cada habilidad.`;

    const response = await callOpenRouter(systemPrompt, userPrompt);
    
    if (response.error) {
      MonitoringService.error('Error en la generación del diagnóstico:', response.error);
      
      // Registrar el fallo para determinar si entramos en modo degradado
      const failureCount = FallbackService.recordFailure(FallbackOperation.GENERATE_DIAGNOSTIC);
      if (failureCount >= 3) {
        MonitoringService.warn(`Entrando en modo degradado para generación de diagnósticos después de ${failureCount} fallos`);
      }
      
      const fallbackResponse = response.fallbackResponse || 
                               FallbackService.generateFallback(
                                 FallbackOperation.GENERATE_DIAGNOSTIC, 
                                 { testId, title: `Diagnóstico para Test ${testId}` }
                               );
      
      MonitoringService.endRequest(startTime, false);
      return {
        error: response.error,
        result: fallbackResponse
      };
    }
    
    // Procesar y validar la respuesta
    const processedResult = processAIResponse(response.result);
    
    // Guardar en caché el resultado exitoso
    if (processedResult && processedResult.exercises && processedResult.exercises.length > 0) {
      CacheService.set(cacheKey, processedResult);
    }
    
    // Resetear contador de fallos si la operación fue exitosa
    FallbackService.resetFailureCounter(FallbackOperation.GENERATE_DIAGNOSTIC);
    
    MonitoringService.endRequest(startTime, true);
    return { result: processedResult };
  } catch (error) {
    MonitoringService.logException(error, { testId, skills });
    
    // Usar el servicio de fallback en caso de error
    const fallbackDiagnostic = FallbackService.generateFallback(
      FallbackOperation.GENERATE_DIAGNOSTIC,
      { testId, skills }
    );
    
    MonitoringService.endRequest(startTime, false);
    return { 
      error: `Error inesperado: ${error instanceof Error ? error.message : 'Desconocido'}`,
      result: fallbackDiagnostic
    };
  }
}

/**
 * Procesa y valida la respuesta de la IA
 */
function processAIResponse(content: any): any {
  // Si el contenido ya es un objeto, usarlo directamente
  if (typeof content === 'object' && content !== null) {
    return validateDiagnostic(content);
  }
  
  // Si es texto, intentar extraer JSON
  if (typeof content === 'string') {
    try {
      const parsedContent = extractJsonFromContent(content);
      if (parsedContent) {
        return validateDiagnostic(parsedContent);
      }
    } catch (error) {
      MonitoringService.error('Error al procesar respuesta de IA:', error);
    }
  }
  
  // Si llegamos aquí, la respuesta no es válida
  return null;
}

/**
 * Valida y sanitiza el diagnóstico generado
 */
function validateDiagnostic(diagnostic: any): any {
  if (!diagnostic || !diagnostic.exercises || !Array.isArray(diagnostic.exercises)) {
    MonitoringService.warn('Diagnóstico inválido recibido', diagnostic);
    return null;
  }
  
  // Validar y filtrar ejercicios
  const validExercises = diagnostic.exercises.filter((exercise: any) => {
    return exercise &&
           typeof exercise.question === 'string' &&
           Array.isArray(exercise.options) &&
           exercise.options.length >= 2 &&
           typeof exercise.correctAnswer === 'string';
  });
  
  if (validExercises.length === 0) {
    MonitoringService.warn('No hay ejercicios válidos en el diagnóstico', diagnostic);
    return null;
  }
  
  return {
    title: diagnostic.title || 'Diagnóstico PAES',
    description: diagnostic.description || 'Evaluación de habilidades para la prueba PAES',
    exercises: validExercises
  };
}
