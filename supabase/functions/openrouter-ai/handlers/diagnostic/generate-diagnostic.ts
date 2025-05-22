
/**
 * Primary handler for diagnostic generation
 */
import { CacheService } from "../../services/cache-service.ts";
import { callOpenRouter } from "../../services/model-service.ts";
import { MonitoringService } from "../../services/monitoring-service.ts";
import { storeOptimizedPrompt, updatePromptEffectiveness, storeGenerationMetrics } from "../../services/usage-tracking-service.ts";
import { CONTENT_CATEGORIES } from "../../config.ts";

import { generateSystemPrompt, generateUserPrompt } from "./prompt-generation.ts";
import { processAIResponse, evaluateContentQuality } from "./response-evaluation.ts";
import { generateFallbackResponse, cacheDiagnosticResult } from "./fallback-handling.ts";

// Modelo preferido para generación de diagnósticos
const DIAGNOSTIC_PREFERRED_MODEL = 'google/gemini-2.5-flash-preview';

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
      
      // Actualizar el prompt como inefectivo
      if (promptId) {
        await updatePromptEffectiveness(promptId, 0.0, "Error en respuesta de AI");
      }
      
      const fallbackResponse = response.fallbackResponse || 
                               generateFallbackResponse(response.error, testId, skills);
      
      MonitoringService.endRequest(startTime, false);
      return fallbackResponse;
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
    await cacheDiagnosticResult(cacheKey, processedResult);
    
    MonitoringService.endRequest(startTime, true);
    return { result: processedResult };
  } catch (error) {
    MonitoringService.logException(error, { testId, skills });
    return generateFallbackResponse(error instanceof Error ? error.message : 'Desconocido', testId, skills);
  }
}
