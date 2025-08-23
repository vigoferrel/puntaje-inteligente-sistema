
import { callOpenRouter } from "../services/openrouter-service.ts";
import { createSuccessResponse, createErrorResponse } from "../utils/response-utils.ts";
import { MonitoringService } from "../services/monitoring-service.ts";
import { CacheService } from "../services/cache-service.ts";

// ML Predictivo para análisis de rendimiento
interface NeuralMetrics {
  engagement: number;
  coherence: number;
  consistency: number;
  improvement_rate: number;
  retention_score: number;
}

interface PredictiveAnalysis {
  predicted_mastery: number;
  risk_factors: string[];
  success_probability: number;
  optimal_study_time: number;
  recommended_frequency: string;
  neural_pattern: string;
}

/**
 * Manejador para la acción de análisis de rendimiento
 */
/**
 * Análisis predictivo avanzado con Machine Learning
 */
export async function analyzePerformanceML(payload: any): Promise<any> {
  const startTime = Date.now();
  
  try {
    const { answers, user_history, neural_metrics } = payload;
    
    // Cache key para resultados ML
    const cacheKey = `ml_analysis_${JSON.stringify(payload).slice(0, 100)}`;
    
    // Intentar obtener del cache primero
    const cached = await CacheService.get(cacheKey);
    if (cached) {
      MonitoringService.info('ML Analysis cache hit');
      return createSuccessResponse(cached);
    }
    
    // Calcular métricas neurales avanzadas
    const metrics = calculateNeuralMetrics(answers, neural_metrics);
    const prediction = generatePredictiveAnalysis(answers, user_history, metrics);
    
    // Generar análisis con IA
    const enhancedPrompt = `Analiza este estudiante con las siguientes métricas neurales y predictivas:
    
    Métricas Neurales:
    - Engagement: ${metrics.engagement}%
    - Coherencia: ${metrics.coherence}%
    - Consistencia: ${metrics.consistency}%
    - Tasa de mejora: ${metrics.improvement_rate}%
    - Score de retención: ${metrics.retention_score}%
    
    Predicción ML:
    - Dominio previsto: ${prediction.predicted_mastery}%
    - Probabilidad de éxito: ${prediction.success_probability}%
    - Tiempo óptimo de estudio: ${prediction.optimal_study_time} min
    - Patrón neural: ${prediction.neural_pattern}
    
    Respuestas del estudiante: ${JSON.stringify(answers)}
    
    Genera un análisis JSON completo con:
    {
      "ml_predictions": {
        "mastery_forecast": number,
        "success_probability": number,
        "risk_level": "low|medium|high",
        "optimal_schedule": string
      },
      "neural_insights": {
        "engagement_pattern": string,
        "learning_style": string,
        "cognitive_load": string
      },
      "strengths": [string],
      "areasForImprovement": [string],
      "personalized_recommendations": [string],
      "adaptive_steps": [string]
    }`;
    
    const result = await callOpenRouter(
      "Eres un especialista en neuroeducación y machine learning educativo. Genera análisis JSON precisos.",
      enhancedPrompt
    );
    
    if (result.error) {
      return createErrorResponse(result.error, 500, result.fallbackResponse);
    }
    
    // Enriquecer con datos calculados
    const analysisResult = {
      ...result.result,
      neural_metrics: metrics,
      predictions: prediction,
      processing_time: Date.now() - startTime,
      confidence_score: calculateConfidenceScore(answers, metrics)
    };
    
    // Guardar en cache por 30 minutos
    await CacheService.set(cacheKey, analysisResult, { ttl: 1800000 });
    
    MonitoringService.info(`ML Analysis completed in ${Date.now() - startTime}ms`);
    return createSuccessResponse(analysisResult);
    
  } catch (error) {
    MonitoringService.error('Error in ML performance analysis:', error);
    return createErrorResponse(`Error en análisis ML: ${error.message}`, 500);
  }
}

/**
 * Calcular métricas neurales avanzadas
 */
function calculateNeuralMetrics(answers: any[], neural_metrics?: any): NeuralMetrics {
  const baseMetrics = neural_metrics || {};
  
  // Cálculos basados en patrones de respuesta
  const correctAnswers = answers.filter(a => a.correct).length;
  const accuracy = (correctAnswers / answers.length) * 100;
  const responseVariance = calculateResponseVariance(answers);
  const timingConsistency = calculateTimingConsistency(answers);
  
  return {
    engagement: baseMetrics.engagement || Math.min(95, accuracy + (timingConsistency * 0.3)),
    coherence: baseMetrics.coherence || Math.min(95, 100 - (responseVariance * 20)),
    consistency: timingConsistency,
    improvement_rate: calculateImprovementRate(answers),
    retention_score: calculateRetentionScore(answers)
  };
}

/**
 * Generar análisis predictivo con ML
 */
function generatePredictiveAnalysis(answers: any[], history: any[], metrics: NeuralMetrics): PredictiveAnalysis {
  const accuracy = answers.filter(a => a.correct).length / answers.length;
  
  // Algoritmo predictivo simplificado (en producción usaría ML real)
  const predicted_mastery = Math.min(95, (accuracy * 70) + (metrics.engagement * 0.2) + (metrics.coherence * 0.1));
  const success_probability = Math.min(95, predicted_mastery * 0.9 + metrics.consistency * 0.1);
  
  return {
    predicted_mastery,
    risk_factors: identifyRiskFactors(metrics, accuracy),
    success_probability,
    optimal_study_time: calculateOptimalStudyTime(metrics),
    recommended_frequency: determineStudyFrequency(metrics),
    neural_pattern: classifyNeuralPattern(metrics)
  };
}

/**
 * Funciones auxiliares para ML
 */
function calculateResponseVariance(answers: any[]): number {
  const times = answers.map(a => a.response_time || 30000).filter(t => t > 0);
  if (times.length < 2) return 0;
  
  const mean = times.reduce((sum, time) => sum + time, 0) / times.length;
  const variance = times.reduce((sum, time) => sum + Math.pow(time - mean, 2), 0) / times.length;
  return Math.sqrt(variance) / mean; // Coeficiente de variación
}

function calculateTimingConsistency(answers: any[]): number {
  const variance = calculateResponseVariance(answers);
  return Math.max(0, Math.min(100, (1 - variance) * 100));
}

function calculateImprovementRate(answers: any[]): number {
  if (answers.length < 3) return 50;
  
  const firstHalf = answers.slice(0, Math.floor(answers.length / 2));
  const secondHalf = answers.slice(Math.floor(answers.length / 2));
  
  const firstAccuracy = firstHalf.filter(a => a.correct).length / firstHalf.length;
  const secondAccuracy = secondHalf.filter(a => a.correct).length / secondHalf.length;
  
  const improvement = (secondAccuracy - firstAccuracy) * 100;
  return Math.max(0, Math.min(100, 50 + improvement));
}

function calculateRetentionScore(answers: any[]): number {
  // Simulación de score de retención basado en patrones
  const consistency = calculateTimingConsistency(answers);
  const accuracy = answers.filter(a => a.correct).length / answers.length * 100;
  return (consistency * 0.4) + (accuracy * 0.6);
}

function identifyRiskFactors(metrics: NeuralMetrics, accuracy: number): string[] {
  const factors = [];
  
  if (metrics.engagement < 60) factors.push("Bajo engagement - riesgo de desatención");
  if (metrics.coherence < 50) factors.push("Baja coherencia - dificultad para mantener el hilo");
  if (metrics.consistency < 40) factors.push("Inconsistencia en tiempos - posible fatiga");
  if (accuracy < 0.6) factors.push("Precisión baja - necesita refuerzo conceptual");
  if (metrics.improvement_rate < 30) factors.push("Tasa de mejora lenta - revisar metodología");
  
  return factors.length > 0 ? factors : ["Perfil de bajo riesgo - mantener ritmo actual"];
}

function calculateOptimalStudyTime(metrics: NeuralMetrics): number {
  const baseTime = 45; // minutos base
  const engagementFactor = metrics.engagement / 100;
  const coherenceFactor = metrics.coherence / 100;
  
  return Math.round(baseTime * engagementFactor * coherenceFactor * 1.2);
}

function determineStudyFrequency(metrics: NeuralMetrics): string {
  const avgScore = (metrics.engagement + metrics.coherence + metrics.consistency) / 3;
  
  if (avgScore > 80) return "2-3 sesiones intensivas por semana";
  if (avgScore > 60) return "3-4 sesiones moderadas por semana";
  return "5-6 sesiones cortas y frecuentes por semana";
}

function classifyNeuralPattern(metrics: NeuralMetrics): string {
  if (metrics.engagement > 80 && metrics.coherence > 80) return "Patrón óptimo - alta concentración";
  if (metrics.engagement > 70 && metrics.consistency > 70) return "Patrón estable - buen ritmo";
  if (metrics.coherence < 50) return "Patrón disperso - necesita enfoque";
  return "Patrón en desarrollo - requiere seguimiento";
}

function calculateConfidenceScore(answers: any[], metrics: NeuralMetrics): number {
  const dataQuality = Math.min(answers.length / 10, 1); // Más datos = mayor confianza
  const metricConsistency = (metrics.consistency / 100);
  const sampleSize = Math.min(answers.length / 20, 1);
  
  return Math.round((dataQuality * 0.4 + metricConsistency * 0.4 + sampleSize * 0.2) * 100);
}

export async function analyzePerformance(payload: any): Promise<any> {
  try {
    const { answers } = payload;

    if (!answers || !Array.isArray(answers) || answers.length === 0) {
      return createErrorResponse('Se requiere una lista de respuestas para analizar el rendimiento');
    }

    const systemPrompt = `Eres un asistente educativo especializado en analizar el rendimiento de los estudiantes en pruebas de comprensión lectora para la PAES.
    Tu única tarea es generar un objeto JSON válido con la estructura exacta solicitada.
    No debes incluir explicaciones, comentarios ni texto adicional en tu respuesta.`;

    const userPrompt = `Analiza el rendimiento del estudiante basándote en las siguientes respuestas:
    ${JSON.stringify(answers)}
    
    Proporciona:
    1. Una lista de las fortalezas del estudiante
    2. Una lista de las áreas en las que el estudiante necesita mejorar
    3. Recomendaciones específicas para mejorar su rendimiento
    4. Pasos a seguir para implementar esas recomendaciones
    
    Responde SOLO con este formato JSON exacto:
    { 
      "strengths": ["fortaleza 1", "fortaleza 2", "fortaleza 3"], 
      "areasForImprovement": ["área de mejora 1", "área de mejora 2", "área de mejora 3"], 
      "recommendations": ["recomendación 1", "recomendación 2", "recomendación 3"], 
      "nextSteps": ["paso 1", "paso 2", "paso 3"] 
    }
    
    No incluyas backticks, comentarios, ni texto explicativo adicional.`;

    console.log('Analyzing performance with improved JSON prompt format');
    const result = await callOpenRouter(systemPrompt, userPrompt);

    if (result.error) {
      console.error('Error analyzing performance:', result.error);
      return createErrorResponse(result.error, 500, result.fallbackResponse);
    }

    return createSuccessResponse(result.result);
  } catch (error) {
    console.error('Error in analyzePerformance handler:', error);
    return createErrorResponse(`Error al analizar el rendimiento: ${error.message}`, 500);
  }
}
