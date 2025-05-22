
import { callOpenRouter } from "../services/model-service.ts";
import { CacheService } from "../services/cache-service.ts";
import { MonitoringService } from "../services/monitoring-service.ts";
import { FallbackService, FallbackOperation } from "../services/fallback-service.ts";
import { createDiagnosticFallback } from "../utils/fallback-generators.ts";
import { extractJsonFromContent } from "../utils/json-extractor.ts";
import { CONTENT_CATEGORIES, MODEL_CONFIGS } from "../config.ts";
import { storeOptimizedPrompt, updatePromptEffectiveness, storeGenerationMetrics } from "../services/usage-tracking-service.ts";

// Modelo preferido para generación de diagnósticos
const DIAGNOSTIC_PREFERRED_MODEL = 'google/gemini-2.5-flash-preview';

/**
 * Optimiza el prompt del sistema para Gemini 2.5
 */
function generateSystemPrompt(testId: number, skills: string[], exercisesPerSkill: number, difficulty: string): string {
  return `Eres un asistente especializado en crear diagnósticos educativos para la prueba PAES, con enfoque en pedagogía chilena.
Tu tarea es generar un diagnóstico completo y estructurado con exactamente ${exercisesPerSkill} ejercicios de alta calidad para cada una de estas habilidades: ${skills.join(', ')}.
La dificultad general debe ser: ${difficulty}.

REGLAS IMPORTANTES:
1. Todos los ejercicios deben estar diseñados específicamente para medir habilidades PAES.
2. Incluye SIEMPRE explicaciones detalladas de cada respuesta correcta.
3. Cada pregunta debe tener EXACTAMENTE 4 opciones.
4. La dificultad debe ser consistente con el nivel solicitado (BASIC/INTERMEDIATE/ADVANCED).

Formatea tu respuesta como un objeto JSON con la siguiente estructura exacta:
{
  "title": "Título descriptivo del diagnóstico",
  "description": "Descripción clara explicando el propósito y habilidades evaluadas",
  "exercises": [
    {
      "question": "Pregunta completa y clara",
      "options": ["Opción A", "Opción B", "Opción C", "Opción D"],
      "correctAnswer": "Texto exacto de la opción correcta",
      "explanation": "Explicación detallada de por qué esta es la respuesta correcta",
      "skill": "Habilidad específica evaluada",
      "difficulty": "${difficulty}"
    },
    ... más ejercicios ...
  ]
}

Cada ejercicio debe ser original, desafiante y evaluativo según el nivel solicitado.`;
}

/**
 * Optimiza el prompt del usuario para Gemini 2.5
 */
function generateUserPrompt(testId: number, skills: string[], exercisesPerSkill: number, difficulty: string): string {
  return `Genera un diagnóstico completo para el test ${testId} que evalúe estas habilidades específicas: ${skills.join(', ')}.
Incluye exactamente ${exercisesPerSkill} ejercicios por habilidad con nivel de dificultad ${difficulty}.
Asegúrate que:
1. El diagnóstico sea coherente y enfocado en las habilidades solicitadas
2. Los ejercicios sean variados y representen situaciones reales de evaluación
3. Las preguntas sean claras y las opciones plausibles
4. Las explicaciones sean didácticas y ayuden a comprender conceptos clave
5. El contenido esté adaptado al contexto educativo chileno

Responde ÚNICAMENTE con el objeto JSON solicitado, sin comentarios adicionales.`;
}

/**
 * Manejador para la acción de generación de diagnósticos con caché y fallback
 */
export async function generateDiagnostic(payload: any): Promise<any> {
  const { testId, skills, exercisesPerSkill = 3, difficulty = 'MIXED' } = payload;
  
  // Iniciar métricas de rendimiento
  const startTime = MonitoringService.startRequest();
  MonitoringService.info(`Generando diagnóstico para test ${testId}, habilidades: ${skills.join(', ')}`);
  
  try {
    // Buscar en caché primero - intentar primero memoria, luego BD
    const cacheKey = CacheService.generateDiagnosticCacheKey(testId, skills, exercisesPerSkill, difficulty);
    const cachedResult = await CacheService.get(cacheKey, true);
    
    if (cachedResult) {
      MonitoringService.info(`Diagnóstico recuperado de caché para test ${testId}`);
      MonitoringService.endRequest(startTime, true);
      return { result: cachedResult };
    }
    
    // Si no está en caché, generar nuevo diagnóstico
    const systemPrompt = generateSystemPrompt(testId, skills, exercisesPerSkill, difficulty);
    const userPrompt = generateUserPrompt(testId, skills, exercisesPerSkill, difficulty);

    // Registrar el prompt optimizado en BD para análisis
    const promptId = await storeOptimizedPrompt(
      `Diagnóstico Test ${testId}`,
      `Generación de diagnóstico para test ${testId} con habilidades ${skills.join(', ')}`,
      systemPrompt,
      DIAGNOSTIC_PREFERRED_MODEL,
      CONTENT_CATEGORIES.DIAGNOSTIC,
      { testId, skills, exercisesPerSkill, difficulty }
    );

    // Llamar al modelo preferido para diagnósticos
    const response = await callOpenRouter(systemPrompt, userPrompt, DIAGNOSTIC_PREFERRED_MODEL);
    
    if (response.error) {
      MonitoringService.error('Error en la generación del diagnóstico:', response.error);
      
      // Registrar el fallo para determinar si entramos en modo degradado
      const failureCount = FallbackService.recordFailure(FallbackOperation.GENERATE_DIAGNOSTIC);
      if (failureCount >= 3) {
        MonitoringService.warn(`Entrando en modo degradado para generación de diagnósticos después de ${failureCount} fallos`);
      }
      
      // Actualizar el prompt como inefectivo
      if (promptId) {
        await updatePromptEffectiveness(promptId, 0.0, "Error en respuesta de AI");
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
    
    // Evaluar calidad de la respuesta y actualizar efectividad del prompt
    const contentQuality = evaluateContentQuality(processedResult);
    if (promptId) {
      await updatePromptEffectiveness(promptId, contentQuality.score, contentQuality.feedback);
    }
    
    // Registrar métricas de generación
    await storeGenerationMetrics({
      accuracy_score: contentQuality.accuracy,
      relevance_score: contentQuality.relevance,
      creativity_score: contentQuality.creativity
    });
    
    // Guardar en caché el resultado exitoso con persistencia en BD
    if (processedResult && processedResult.exercises && processedResult.exercises.length > 0) {
      await CacheService.set(cacheKey, processedResult, DEFAULT_CACHE_TTL, true);
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

/**
 * Evalúa la calidad del contenido generado
 */
function evaluateContentQuality(content: any): { 
  score: number;
  accuracy: number;
  relevance: number; 
  creativity: number;
  feedback: string;
} {
  if (!content || !content.exercises || content.exercises.length === 0) {
    return {
      score: 0,
      accuracy: 0,
      relevance: 0,
      creativity: 0,
      feedback: "Contenido inválido o vacío"
    };
  }
  
  // Contar ejercicios con los elementos requeridos
  const totalExercises = content.exercises.length;
  const exercisesWithAllElements = content.exercises.filter((ex: any) => 
    ex.question && 
    ex.options && 
    ex.options.length === 4 &&
    ex.correctAnswer && 
    ex.explanation &&
    ex.skill &&
    ex.difficulty
  ).length;
  
  // Calcular puntuaciones
  const accuracy = exercisesWithAllElements / totalExercises;
  const relevance = content.title && content.description ? 1.0 : 0.7;
  
  // Calcular creatividad basada en la longitud y diversidad de explicaciones
  let totalExplanationLength = 0;
  const uniqueWords = new Set<string>();
  
  content.exercises.forEach((ex: any) => {
    if (ex.explanation) {
      totalExplanationLength += ex.explanation.length;
      ex.explanation.split(/\s+/).forEach((word: string) => uniqueWords.add(word.toLowerCase()));
    }
  });
  
  const avgExplanationLength = totalExercises > 0 ? totalExplanationLength / totalExercises : 0;
  const creativity = Math.min(uniqueWords.size / 200, 1.0) * (Math.min(avgExplanationLength / 150, 1.0));
  
  // Puntuación global (ponderada)
  const score = (accuracy * 0.5) + (relevance * 0.3) + (creativity * 0.2);
  
  // Generar retroalimentación
  let feedback = "";
  if (score >= 0.8) {
    feedback = "Excelente calidad de contenido con explicaciones detalladas y ejercicios bien estructurados";
  } else if (score >= 0.6) {
    feedback = "Buena calidad pero puede mejorar en consistencia y detalle de explicaciones";
  } else {
    feedback = "Calidad insuficiente, faltan elementos importantes o el contenido no es adecuado";
  }
  
  return {
    score,
    accuracy,
    relevance,
    creativity,
    feedback
  };
}
