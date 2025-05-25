import { supabase } from '@/integrations/supabase/client';
import { openRouterService } from '@/services/openrouter/core';
import { BancoEvaluacionesService } from '@/services/banco-evaluaciones/BancoEvaluacionesService';
import { intelligentCache } from '@/core/performance/IntelligentCacheSystem';

interface ContentDecision {
  useOfficial: boolean;
  source: 'banco_oficial' | 'paes_examen' | 'ai_generated' | 'hybrid';
  confidence: number;
  costEstimate: number;
}

interface OptimizationMetrics {
  officialContentUsage: number;
  aiUsage: number;
  cacheHitRate: number;
  costSavings: number;
  userSatisfaction: number;
}

/**
 * ORQUESTADOR INTELIGENTE DE CONTENIDO
 * Prioriza contenido oficial → Cache → IA como último recurso
 */
export class ContentOrchestrator {
  private static instance: ContentOrchestrator;
  private metrics: OptimizationMetrics = {
    officialContentUsage: 0,
    aiUsage: 0,
    cacheHitRate: 0,
    costSavings: 0,
    userSatisfaction: 0
  };

  static getInstance(): ContentOrchestrator {
    if (!ContentOrchestrator.instance) {
      ContentOrchestrator.instance = new ContentOrchestrator();
    }
    return ContentOrchestrator.instance;
  }

  /**
   * DECISIÓN INTELIGENTE DE CONTENIDO
   * 1. Banco oficial PAES (gratis)
   * 2. Cache (gratis)
   * 3. IA solo si es necesario (costo)
   */
  async decideContentSource(
    prueba: string,
    skill: string,
    difficulty: string,
    context?: any
  ): Promise<ContentDecision> {
    console.log(`🤖 Decidiendo fuente de contenido para ${prueba}/${skill}/${difficulty}`);

    // 1. Verificar contenido oficial disponible
    const officialAvailable = await this.checkOfficialContent(prueba, skill, difficulty);
    if (officialAvailable) {
      this.metrics.officialContentUsage++;
      return {
        useOfficial: true,
        source: 'banco_oficial',
        confidence: 0.95,
        costEstimate: 0
      };
    }

    // 2. Verificar cache
    const cacheKey = `content_${prueba}_${skill}_${difficulty}`;
    const cached = intelligentCache.get(cacheKey);
    if (cached && typeof cached === 'object' && cached !== null) {
      this.metrics.cacheHitRate++;
      return {
        useOfficial: false,
        source: 'ai_generated',
        confidence: (cached as any).confidence || 0.8,
        costEstimate: 0
      };
    }

    // 3. Decidir si usar IA (último recurso)
    const shouldUseAI = await this.shouldGenerateWithAI(context);
    this.metrics.aiUsage++;

    return {
      useOfficial: false,
      source: shouldUseAI ? 'ai_generated' : 'hybrid',
      confidence: 0.7,
      costEstimate: shouldUseAI ? 0.02 : 0.005
    };
  }

  /**
   * GENERACIÓN OPTIMIZADA DE EJERCICIOS
   */
  async generateOptimizedExercise(
    prueba: string,
    skill: string,
    difficulty: string,
    userId?: string
  ): Promise<any> {
    const decision = await this.decideContentSource(prueba, skill, difficulty);
    
    console.log(`📚 Generando ejercicio: ${decision.source} (confianza: ${decision.confidence})`);

    try {
      if (decision.source === 'banco_oficial') {
        return await this.getOfficialExercise(prueba, skill, difficulty);
      }

      if (decision.source === 'ai_generated') {
        return await this.generateAIExercise(prueba, skill, difficulty, userId);
      }

      if (decision.source === 'hybrid') {
        return await this.generateHybridExercise(prueba, skill, difficulty, userId);
      }

      // Fallback
      return await this.generateFallbackExercise(prueba, skill, difficulty);

    } catch (error) {
      console.error('Error en generación optimizada:', error);
      return await this.generateFallbackExercise(prueba, skill, difficulty);
    }
  }

  /**
   * CONTENIDO OFICIAL DEL BANCO
   */
  private async getOfficialExercise(prueba: string, skill: string, difficulty: string): Promise<any> {
    const evaluacion = await BancoEvaluacionesService.generarEvaluacionOptimizada({
      tipo_evaluacion: 'diagnostica',
      prueba_paes: prueba,
      total_preguntas: 1,
      duracion_minutos: 5,
      distribucion_dificultad: { 
        basico: difficulty.toLowerCase() === 'basico' ? 100 : 0,
        intermedio: difficulty.toLowerCase() === 'intermedio' ? 100 : 0,
        avanzado: difficulty.toLowerCase() === 'avanzado' ? 100 : 0
      }
    });

    if (evaluacion.preguntas && evaluacion.preguntas.length > 0) {
      const pregunta = evaluacion.preguntas[0];
      return {
        id: `oficial-${pregunta.id}`,
        question: pregunta.enunciado,
        context: pregunta.contexto_situacional || '',
        options: pregunta.alternativas?.map((alt: any) => alt.contenido) || [],
        correctAnswer: pregunta.alternativas?.find((alt: any) => alt.es_correcta)?.contenido || '',
        explanation: `Pregunta oficial de PAES ${prueba}. Esta pregunta evalúa ${skill} en nivel ${difficulty}.`,
        source: 'oficial',
        metadata: {
          difficulty,
          skill,
          prueba,
          costSaving: 0.02
        }
      };
    }

    throw new Error('No se encontró contenido oficial');
  }

  /**
   * GENERACIÓN IA CONTEXTUAL
   */
  private async generateAIExercise(
    prueba: string, 
    skill: string, 
    difficulty: string, 
    userId?: string
  ): Promise<any> {
    const userContext = userId ? await this.getUserContext(userId) : null;
    
    const prompt = this.buildContextualPrompt(prueba, skill, difficulty, userContext);
    
    const response = await openRouterService({
      action: 'generate_exercise',
      payload: {
        prompt,
        model: 'anthropic/claude-3.5-sonnet',
        contextualData: userContext
      }
    });

    const exercise = typeof response === 'string' ? JSON.parse(response) : response;
    
    // Cache para futuro uso
    const cacheKey = `content_${prueba}_${skill}_${difficulty}`;
    intelligentCache.set(cacheKey, exercise, 7200000, 'high');

    return {
      ...exercise,
      source: 'ai_contextual',
      metadata: {
        difficulty,
        skill,
        prueba,
        costUsed: 0.02,
        generatedAt: new Date().toISOString()
      }
    };
  }

  /**
   * CONTENIDO HÍBRIDO: Oficial + IA personalizada
   */
  private async generateHybridExercise(
    prueba: string,
    skill: string, 
    difficulty: string,
    userId?: string
  ): Promise<any> {
    // Buscar pregunta oficial similar
    const officialBase = await this.findSimilarOfficialQuestion(prueba, skill);
    
    if (officialBase) {
      // Usar estructura oficial + explicación personalizada IA
      const personalizedExplanation = await this.generatePersonalizedExplanation(
        officialBase,
        userId
      );

      return {
        ...officialBase,
        explanation: personalizedExplanation,
        source: 'hibrido',
        metadata: {
          baseOfficial: true,
          aiEnhanced: true,
          costUsed: 0.005
        }
      };
    }

    // Si no hay base oficial, generar con IA pero con plantilla optimizada
    return await this.generateAIExercise(prueba, skill, difficulty, userId);
  }

  /**
   * FALLBACK SEGURO
   */
  private async generateFallbackExercise(prueba: string, skill: string, difficulty: string): Promise<any> {
    return {
      id: `fallback-${Date.now()}`,
      question: `Ejercicio de ${prueba} - ${skill} (nivel ${difficulty})`,
      options: [
        'A) Primera opción',
        'B) Segunda opción', 
        'C) Tercera opción',
        'D) Cuarta opción'
      ],
      correctAnswer: 'A) Primera opción',
      explanation: `Ejercicio de práctica para ${skill} en ${prueba}. Nivel: ${difficulty}`,
      source: 'fallback',
      metadata: {
        difficulty,
        skill,
        prueba,
        costUsed: 0
      }
    };
  }

  // Métodos auxiliares
  private async checkOfficialContent(prueba: string, skill: string, difficulty: string): Promise<boolean> {
    try {
      const { data } = await supabase
        .from('banco_preguntas')
        .select('id')
        .eq('prueba_paes', prueba.toUpperCase())
        .eq('nivel_dificultad', difficulty.toUpperCase())
        .limit(1);

      return data && data.length > 0;
    } catch {
      return false;
    }
  }

  private async shouldGenerateWithAI(context?: any): Promise<boolean> {
    // Lógica de decisión: usar IA solo si realmente aporta valor
    if (context?.userLevel === 'advanced') return true;
    if (context?.specificNeed) return true;
    
    // Para usuarios básicos, preferir contenido oficial
    return Math.random() > 0.7; // 30% de probabilidad
  }

  private buildContextualPrompt(
    prueba: string,
    skill: string, 
    difficulty: string,
    userContext: any
  ): string {
    const basePrompt = `Genera un ejercicio de ${prueba} para evaluar ${skill} en nivel ${difficulty}.`;
    
    if (userContext) {
      return `${basePrompt}\n\nContexto del estudiante:\n- Nivel: ${userContext.level}\n- Fortalezas: ${userContext.strengths?.join(', ')}\n- Áreas de mejora: ${userContext.improvements?.join(', ')}\n\nAdapta la pregunta a este perfil.`;
    }

    return basePrompt;
  }

  private async getUserContext(userId: string): Promise<any> {
    try {
      const { data } = await supabase
        .from('user_node_progress')
        .select('*')
        .eq('user_id', userId)
        .limit(10);

      if (data && data.length > 0) {
        const avgMastery = data.reduce((sum, item) => sum + item.mastery_level, 0) / data.length;
        return {
          level: avgMastery > 0.8 ? 'advanced' : avgMastery > 0.5 ? 'intermediate' : 'beginner',
          strengths: data.filter(item => item.mastery_level > 0.8).map(item => item.node_id),
          improvements: data.filter(item => item.mastery_level < 0.5).map(item => item.node_id)
        };
      }
    } catch (error) {
      console.warn('No se pudo obtener contexto del usuario:', error);
    }

    return null;
  }

  private async findSimilarOfficialQuestion(prueba: string, skill: string): Promise<any> {
    try {
      const { data } = await supabase
        .from('banco_preguntas')
        .select('*')
        .eq('prueba_paes', prueba.toUpperCase())
        .limit(1);

      return data?.[0] || null;
    } catch {
      return null;
    }
  }

  private async generatePersonalizedExplanation(question: any, userId?: string): Promise<string> {
    if (!userId) return question.explanation || 'Explicación estándar de la pregunta.';

    try {
      const userContext = await this.getUserContext(userId);
      const prompt = `Explica esta pregunta PAES de manera personalizada:\n\nPregunta: ${question.enunciado}\n\nRespuesta correcta: ${question.alternativas?.find((alt: any) => alt.es_correcta)?.contenido}\n\nPerfil del estudiante: ${JSON.stringify(userContext)}\n\nGenera una explicación pedagógica adaptada a este estudiante.`;

      const response = await openRouterService({
        action: 'generate_explanation',
        payload: {
          prompt,
          model: 'anthropic/claude-3.5-haiku'
        }
      });

      if (typeof response === 'string') {
        return response;
      } else if (response && typeof response === 'object' && 'explanation' in response) {
        return (response as any).explanation || question.explanation;
      }
      
      return question.explanation || 'Explicación estándar de la pregunta.';
    } catch (error) {
      console.warn('Error generando explicación personalizada:', error);
      return question.explanation || 'Explicación estándar de la pregunta.';
    }
  }

  /**
   * MÉTRICAS Y OPTIMIZACIÓN
   */
  getOptimizationMetrics(): OptimizationMetrics & { costSavingsProjected: number } {
    const totalRequests = this.metrics.officialContentUsage + this.metrics.aiUsage;
    const costSavingsProjected = this.metrics.officialContentUsage * 0.02;

    return {
      ...this.metrics,
      cacheHitRate: totalRequests > 0 ? (this.metrics.cacheHitRate / totalRequests) * 100 : 0,
      costSavingsProjected
    };
  }

  resetMetrics(): void {
    this.metrics = {
      officialContentUsage: 0,
      aiUsage: 0,
      cacheHitRate: 0,
      costSavings: 0,
      userSatisfaction: 0
    };
  }
}

export const contentOrchestrator = ContentOrchestrator.getInstance();
