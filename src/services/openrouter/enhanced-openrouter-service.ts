
import { openRouterService } from './core';
import { subjectPromptSpecializer } from '../prompts/SubjectPromptSpecializer';
import { qualityValidator } from '../quality/QualityValidator';
import { TPAESPrueba, TPAESHabilidad } from '@/types/system-types';
import { Exercise } from '@/types/ai-types';

export interface EnhancedExerciseRequest {
  prueba: TPAESPrueba;
  skill: TPAESHabilidad;
  difficulty: 'BASIC' | 'INTERMEDIATE' | 'ADVANCED';
  userContext?: any;
  qualityThreshold?: number;
  maxRetries?: number;
}

export interface EnhancedExerciseResponse {
  exercise: Exercise;
  qualityReport: any;
  generationMetadata: {
    model: string;
    attempts: number;
    processingTime: number;
    source: 'ai_generated';
    validated: boolean;
  };
}

/**
 * Servicio Mejorado de OpenRouter con Validación de Calidad
 */
export class EnhancedOpenRouterService {
  private static instance: EnhancedOpenRouterService;
  
  static getInstance(): EnhancedOpenRouterService {
    if (!EnhancedOpenRouterService.instance) {
      EnhancedOpenRouterService.instance = new EnhancedOpenRouterService();
    }
    return EnhancedOpenRouterService.instance;
  }

  /**
   * Genera ejercicio con validación de calidad garantizada
   */
  async generateQualityExercise(request: EnhancedExerciseRequest): Promise<EnhancedExerciseResponse> {
    const startTime = Date.now();
    const maxRetries = request.maxRetries || 3;
    const qualityThreshold = request.qualityThreshold || 0.7;
    
    console.log(`🎯 Generando ejercicio de calidad: ${request.prueba}/${request.skill} (${request.difficulty})`);
    
    let attempts = 0;
    let bestExercise: Exercise | null = null;
    let bestQuality = 0;
    let finalQualityReport = null;

    while (attempts < maxRetries) {
      attempts++;
      
      try {
        console.log(`🔄 Intento ${attempts}/${maxRetries}`);
        
        // Generar prompt especializado
        const promptTemplate = subjectPromptSpecializer.generateSpecializedPrompt(
          request.prueba,
          request.skill,
          request.difficulty,
          request.userContext
        );
        
        // Llamar a OpenRouter con prompt optimizado
        const response = await this.callOpenRouterWithRetry(promptTemplate);
        
        // Parsear respuesta
        const exercise = this.parseExerciseResponse(response, request);
        
        if (!exercise) {
          console.warn(`❌ Intento ${attempts}: No se pudo parsear la respuesta`);
          continue;
        }
        
        // Validar calidad
        const qualityReport = await qualityValidator.validateExercise(
          exercise,
          request.prueba,
          request.skill
        );
        
        console.log(`📊 Intento ${attempts}: Calidad = ${(qualityReport.metrics.overallScore * 100).toFixed(1)}%`);
        
        // Si cumple el threshold, devolver inmediatamente
        if (qualityReport.metrics.overallScore >= qualityThreshold) {
          const processingTime = Date.now() - startTime;
          
          console.log(`✅ Ejercicio de calidad generado en ${attempts} intentos (${processingTime}ms)`);
          
          return {
            exercise,
            qualityReport,
            generationMetadata: {
              model: 'anthropic/claude-3.5-sonnet',
              attempts,
              processingTime,
              source: 'ai_generated',
              validated: true
            }
          };
        }
        
        // Guardar el mejor intento
        if (qualityReport.metrics.overallScore > bestQuality) {
          bestQuality = qualityReport.metrics.overallScore;
          bestExercise = exercise;
          finalQualityReport = qualityReport;
        }
        
      } catch (error) {
        console.error(`❌ Error en intento ${attempts}:`, error);
      }
    }
    
    // Si no se alcanzó el threshold, devolver el mejor intento
    if (bestExercise && finalQualityReport) {
      console.warn(`⚠️ Usando mejor intento con calidad ${(bestQuality * 100).toFixed(1)}%`);
      
      const processingTime = Date.now() - startTime;
      
      return {
        exercise: bestExercise,
        qualityReport: finalQualityReport,
        generationMetadata: {
          model: 'anthropic/claude-3.5-sonnet',
          attempts,
          processingTime,
          source: 'ai_generated',
          validated: false
        }
      };
    }
    
    // Fallback: generar ejercicio básico
    console.error('❌ No se pudo generar ejercicio de calidad, usando fallback');
    return this.generateFallbackExercise(request, attempts, Date.now() - startTime);
  }

  /**
   * Llama a OpenRouter con reintentos automáticos
   */
  private async callOpenRouterWithRetry(promptTemplate: any, retries: number = 2): Promise<any> {
    for (let i = 0; i <= retries; i++) {
      try {
        const response = await openRouterService({
          action: 'generate_exercise',
          payload: {
            systemPrompt: promptTemplate.systemPrompt,
            userPrompt: promptTemplate.userPrompt,
            model: 'anthropic/claude-3.5-sonnet',
            temperature: 0.7,
            max_tokens: 1500
          }
        });
        
        if (response) {
          return response;
        }
      } catch (error) {
        console.error(`Error en llamada OpenRouter (intento ${i + 1}):`, error);
        if (i === retries) throw error;
        
        // Esperar antes del siguiente intento
        await new Promise(resolve => setTimeout(resolve, 1000 * (i + 1)));
      }
    }
    
    throw new Error('No se pudo conectar con OpenRouter después de varios intentos');
  }

  /**
   * Parsea la respuesta de OpenRouter a formato Exercise
   */
  private parseExerciseResponse(response: any, request: EnhancedExerciseRequest): Exercise | null {
    try {
      let exerciseData;
      
      if (typeof response === 'string') {
        // Intentar extraer JSON de la respuesta
        const jsonMatch = response.match(/\{[\s\S]*\}/);
        if (jsonMatch) {
          exerciseData = JSON.parse(jsonMatch[0]);
        } else {
          console.error('No se encontró JSON válido en la respuesta');
          return null;
        }
      } else if (typeof response === 'object') {
        exerciseData = response;
      } else {
        console.error('Formato de respuesta no reconocido');
        return null;
      }
      
      // Validar estructura básica
      if (!exerciseData.question || !exerciseData.options || !exerciseData.correctAnswer) {
        console.error('Respuesta no tiene estructura básica requerida');
        return null;
      }
      
      // Convertir a formato Exercise
      const exercise: Exercise = {
        id: `ai-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
        nodeId: '',
        nodeName: '',
        prueba: request.prueba,
        skill: request.skill,
        difficulty: request.difficulty,
        question: exerciseData.question,
        options: Array.isArray(exerciseData.options) ? exerciseData.options : [],
        correctAnswer: exerciseData.correctAnswer,
        explanation: exerciseData.explanation || 'Explicación generada por IA.',
        metadata: {
          ...exerciseData.metadata,
          source: 'ai_generated',
          generatedAt: new Date().toISOString(),
          prueba: request.prueba,
          skill: request.skill,
          difficulty: request.difficulty
        }
      };
      
      return exercise;
      
    } catch (error) {
      console.error('Error parseando respuesta de OpenRouter:', error);
      return null;
    }
  }

  /**
   * Genera ejercicio de fallback cuando todo falla
   */
  private generateFallbackExercise(
    request: EnhancedExerciseRequest, 
    attempts: number, 
    processingTime: number
  ): EnhancedExerciseResponse {
    const fallbackExercise: Exercise = {
      id: `fallback-${Date.now()}`,
      nodeId: '',
      nodeName: '',
      prueba: request.prueba,
      skill: request.skill,
      difficulty: request.difficulty,
      question: `Ejercicio de ${request.prueba} - ${request.skill} (Nivel ${request.difficulty})`,
      options: [
        'A) Primera alternativa',
        'B) Segunda alternativa',
        'C) Tercera alternativa',
        'D) Cuarta alternativa'
      ],
      correctAnswer: 'A) Primera alternativa',
      explanation: `Este es un ejercicio de fallback para ${request.skill} en ${request.prueba}. Nivel: ${request.difficulty}`,
      metadata: {
        source: 'fallback',
        generatedAt: new Date().toISOString(),
        prueba: request.prueba,
        skill: request.skill,
        difficulty: request.difficulty
      }
    };
    
    const fallbackQualityReport = {
      isValid: false,
      metrics: {
        contentAccuracy: 0.3,
        paesCompliance: 0.3,
        difficultyConsistency: 0.3,
        subjectRelevance: 0.3,
        overallScore: 0.3
      },
      issues: ['Ejercicio de fallback - calidad no garantizada'],
      recommendations: ['Revisar conectividad con OpenRouter'],
      source: 'fallback' as const
    };
    
    return {
      exercise: fallbackExercise,
      qualityReport: fallbackQualityReport,
      generationMetadata: {
        model: 'fallback',
        attempts,
        processingTime,
        source: 'ai_generated',
        validated: false
      }
    };
  }

  /**
   * Prueba la conectividad con OpenRouter
   */
  async testConnection(): Promise<{ connected: boolean; latency: number; error?: string }> {
    const startTime = Date.now();
    
    try {
      const response = await openRouterService({
        action: 'test_connection',
        payload: {
          systemPrompt: 'Eres un asistente de prueba.',
          userPrompt: 'Responde solo con "OK" si me puedes escuchar.',
          model: 'anthropic/claude-3.5-haiku',
          max_tokens: 50
        }
      });
      
      const latency = Date.now() - startTime;
      
      if (response && typeof response === 'string' && response.toLowerCase().includes('ok')) {
        return { connected: true, latency };
      } else {
        return { connected: false, latency, error: 'Respuesta inesperada de OpenRouter' };
      }
      
    } catch (error) {
      const latency = Date.now() - startTime;
      return { 
        connected: false, 
        latency, 
        error: error instanceof Error ? error.message : 'Error desconocido' 
      };
    }
  }

  /**
   * Obtiene métricas de rendimiento del servicio
   */
  getPerformanceMetrics() {
    return {
      totalRequests: 0, // Implementar tracking si es necesario
      successRate: 0,
      averageLatency: 0,
      qualityScore: 0
    };
  }
}

export const enhancedOpenRouterService = EnhancedOpenRouterService.getInstance();
