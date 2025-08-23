
import { supabase } from '@/integrations/supabase/client';
import { logger } from '@/core/logging/SystemLogger';
import { TPAESPrueba, TPAESHabilidad } from '@/types/system-types';
import { Exercise } from '@/types/ai-types';

interface ToolExerciseDistribution {
  lectoguia: number;
  superpaes: number;
  diagnostic: number;
  training: number;
  qna: number;
  adaptive: number;
  general: number;
}

interface CrossToolRecommendation {
  userId: string;
  sourceTools: string[];
  targetTool: string;
  recommendedExercises: Exercise[];
  reasoning: string;
  priority: 'high' | 'medium' | 'low';
}

export class CrossToolDataBridge {
  
  private static readonly TOOL_DISTRIBUTION: ToolExerciseDistribution = {
    lectoguia: 2500,    // Chat contextualizado + ejercicios
    superpaes: 1500,    // Coordinación y síntesis
    diagnostic: 2000,   // Evaluación adaptativa
    training: 2000,     // Práctica dirigida
    qna: 1000,         // Apoyo y ejemplos
    adaptive: 1000,     // Generación en tiempo real
    general: 1000       // Ejercicios base
  };

  /**
   * Sincroniza datos entre todas las herramientas
   */
  static async syncCrossToolData(userId: string): Promise<void> {
    try {
      logger.info('CrossToolBridge', 'Iniciando sincronización cross-tool', { userId });

      // Obtener datos de todas las herramientas
      const userData = await this.gatherUserDataFromAllTools(userId);
      
      // Generar recomendaciones cross-tool
      const recommendations = await this.generateCrossToolRecommendations(userData);
      
      // Actualizar perfiles unificados
      await this.updateUnifiedUserProfile(userId, userData);
      
      // Sincronizar progreso entre herramientas
      await this.syncProgressAcrossTools(userId, userData);

      logger.info('CrossToolBridge', 'Sincronización completada', { userId });

    } catch (error) {
      logger.error('CrossToolBridge', 'Error en sincronización cross-tool', error);
    }
  }

  /**
   * Recopila datos del usuario de todas las herramientas
   */
  private static async gatherUserDataFromAllTools(userId: string): Promise<any> {
    try {
      // Datos de métricas neurales
      const { data: neuralMetrics } = await supabase
        .from('neural_metrics')
        .select('*')
        .eq('user_id', userId);

      // Datos de progreso en nodos
      const { data: nodeProgress } = await supabase
        .from('user_node_progress')
        .select('*')
        .eq('user_id', userId);

      // Datos de intentos de ejercicios
      const { data: exerciseAttempts } = await supabase
        .from('user_exercise_attempts')
        .select('*')
        .eq('user_id', userId)
        .order('created_at', { ascending: false })
        .limit(100);

      // Datos de conversaciones LectoGuía
      const { data: conversations } = await supabase
        .from('lectoguia_conversations')
        .select('*')
        .eq('user_id', userId)
        .order('created_at', { ascending: false })
        .limit(50);

      return {
        neuralMetrics: neuralMetrics || [],
        nodeProgress: nodeProgress || [],
        exerciseAttempts: exerciseAttempts || [],
        conversations: conversations || [],
        userId
      };

    } catch (error) {
      logger.error('CrossToolBridge', 'Error recopilando datos', error);
      return { neuralMetrics: [], nodeProgress: [], exerciseAttempts: [], conversations: [], userId };
    }
  }

  /**
   * Genera recomendaciones entre herramientas
   */
  private static async generateCrossToolRecommendations(userData: any): Promise<CrossToolRecommendation[]> {
    const recommendations: CrossToolRecommendation[] = [];

    try {
      // Analizar patrones de uso
      const toolUsage = this.analyzeToolUsagePatterns(userData);
      
      // Identificar gaps de aprendizaje
      const learningGaps = this.identifyLearningGaps(userData);
      
      // Generar recomendaciones específicas
      if (toolUsage.lectoguia > 0 && toolUsage.diagnostic === 0) {
        recommendations.push({
          userId: userData.userId,
          sourceTools: ['lectoguia'],
          targetTool: 'diagnostic',
          recommendedExercises: [],
          reasoning: 'Usuario activo en LectoGuía pero sin evaluación diagnóstica',
          priority: 'high'
        });
      }

      if (learningGaps.weakAreas.length > 0 && toolUsage.training === 0) {
        recommendations.push({
          userId: userData.userId,
          sourceTools: ['diagnostic'],
          targetTool: 'training',
          recommendedExercises: [],
          reasoning: `Áreas débiles identificadas: ${learningGaps.weakAreas.join(', ')}`,
          priority: 'high'
        });
      }

      if (toolUsage.qna === 0 && learningGaps.needsSupport) {
        recommendations.push({
          userId: userData.userId,
          sourceTools: ['lectoguia', 'training'],
          targetTool: 'qna',
          recommendedExercises: [],
          reasoning: 'Usuario podría beneficiarse del centro de ayuda',
          priority: 'medium'
        });
      }

      // Guardar recomendaciones
      for (const rec of recommendations) {
        await this.saveRecommendation(rec);
      }

      return recommendations;

    } catch (error) {
      logger.error('CrossToolBridge', 'Error generando recomendaciones', error);
      return [];
    }
  }

  /**
   * Analiza patrones de uso de herramientas
   */
  private static analyzeToolUsagePatterns(userData: any): any {
    const usage = {
      lectoguia: 0,
      superpaes: 0,
      diagnostic: 0,
      training: 0,
      qna: 0,
      adaptive: 0
    };

    // Contar métricas por herramienta
    userData.neuralMetrics.forEach((metric: any) => {
      const tool = metric.dimension_id.split('_')[0];
      if (usage.hasOwnProperty(tool)) {
        usage[tool as keyof typeof usage]++;
      }
    });

    // Contar conversaciones
    usage.lectoguia += userData.conversations.length;

    return usage;
  }

  /**
   * Identifica gaps de aprendizaje
   */
  private static identifyLearningGaps(userData: any): any {
    const gaps = {
      weakAreas: [] as string[],
      strongAreas: [] as string[],
      needsSupport: false,
      overallProgress: 0
    };

    // Analizar progreso en nodos
    const nodeProgressData = userData.nodeProgress;
    let totalProgress = 0;
    let weakCount = 0;

    nodeProgressData.forEach((progress: any) => {
      totalProgress += progress.progress || 0;
      
      if (progress.progress < 30) {
        weakCount++;
        gaps.weakAreas.push(progress.node_id);
      } else if (progress.progress > 80) {
        gaps.strongAreas.push(progress.node_id);
      }
    });

    gaps.overallProgress = nodeProgressData.length > 0 ? totalProgress / nodeProgressData.length : 0;
    gaps.needsSupport = weakCount > nodeProgressData.length * 0.3; // Más del 30% de áreas débiles

    return gaps;
  }

  /**
   * Actualiza perfil unificado del usuario
   */
  private static async updateUnifiedUserProfile(userId: string, userData: any): Promise<void> {
    try {
      const profileData = {
        userId,
        totalInteractions: userData.exerciseAttempts.length + userData.conversations.length,
        averageAccuracy: this.calculateAverageAccuracy(userData.exerciseAttempts),
        toolsUsed: this.getUniqueToolsUsed(userData),
        lastActivity: new Date().toISOString(),
        learningStyle: this.inferLearningStyle(userData),
        strengths: this.identifyStrengths(userData),
        weaknesses: this.identifyWeaknesses(userData)
      };

      // Guardar en métricas del sistema
      await supabase
        .from('system_metrics')
        .insert({
          user_id: userId,
          metric_type: 'unified_profile',
          metric_value: profileData.totalInteractions,
          context: profileData
        });

    } catch (error) {
      logger.error('CrossToolBridge', 'Error actualizando perfil unificado', error);
    }
  }

  /**
   * Sincroniza progreso entre herramientas
   */
  private static async syncProgressAcrossTools(userId: string, userData: any): Promise<void> {
    try {
      // Crear métricas consolidadas por prueba
      const pruebaProgress = this.consolidateProgressByPrueba(userData);
      
      // Sincronizar con cada herramienta
      for (const [prueba, progress] of Object.entries(pruebaProgress)) {
        await supabase
          .from('neural_metrics')
          .upsert({
            user_id: userId,
            metric_type: 'cross_tool_progress',
            dimension_id: prueba,
            current_value: progress as number,
            trend: 'stable',
            metadata: {
              lastSync: new Date().toISOString(),
              sourceTools: this.getUniqueToolsUsed(userData)
            }
          }, { 
            onConflict: 'user_id,metric_type,dimension_id' 
          });
      }

    } catch (error) {
      logger.error('CrossToolBridge', 'Error sincronizando progreso', error);
    }
  }

  /**
   * Guarda recomendación en la base de datos
   */
  private static async saveRecommendation(recommendation: CrossToolRecommendation): Promise<void> {
    try {
      await supabase
        .from('user_notifications')
        .insert({
          user_id: recommendation.userId,
          notification_type: 'cross_tool_recommendation',
          title: `Recomendación: ${recommendation.targetTool}`,
          message: recommendation.reasoning,
          priority: recommendation.priority,
          action_data: {
            targetTool: recommendation.targetTool,
            sourceTools: recommendation.sourceTools
          }
        });

    } catch (error) {
      logger.error('CrossToolBridge', 'Error guardando recomendación', error);
    }
  }

  // Métodos auxiliares
  private static calculateAverageAccuracy(attempts: any[]): number {
    if (attempts.length === 0) return 0;
    const correct = attempts.filter(a => a.is_correct).length;
    return correct / attempts.length;
  }

  private static getUniqueToolsUsed(userData: any): string[] {
    const tools = new Set<string>();
    
    userData.neuralMetrics.forEach((metric: any) => {
      const tool = metric.dimension_id.split('_')[0];
      tools.add(tool);
    });

    if (userData.conversations.length > 0) {
      tools.add('lectoguia');
    }

    return Array.from(tools);
  }

  private static inferLearningStyle(userData: any): string {
    const conversationCount = userData.conversations.length;
    const exerciseCount = userData.exerciseAttempts.length;
    
    if (conversationCount > exerciseCount * 2) {
      return 'conversational';
    } else if (exerciseCount > conversationCount * 2) {
      return 'practice_oriented';
    }
    return 'balanced';
  }

  private static identifyStrengths(userData: any): string[] {
    const strengths: string[] = [];
    const accuracyBySkill: Record<string, number[]> = {};
    
    userData.exerciseAttempts.forEach((attempt: any) => {
      const skill = attempt.skill_demonstrated || 'general';
      if (!accuracyBySkill[skill]) {
        accuracyBySkill[skill] = [];
      }
      accuracyBySkill[skill].push(attempt.is_correct ? 1 : 0);
    });

    Object.entries(accuracyBySkill).forEach(([skill, scores]) => {
      const accuracy = scores.reduce((a, b) => a + b, 0) / scores.length;
      if (accuracy > 0.8) {
        strengths.push(skill);
      }
    });

    return strengths;
  }

  private static identifyWeaknesses(userData: any): string[] {
    const weaknesses: string[] = [];
    const accuracyBySkill: Record<string, number[]> = {};
    
    userData.exerciseAttempts.forEach((attempt: any) => {
      const skill = attempt.skill_demonstrated || 'general';
      if (!accuracyBySkill[skill]) {
        accuracyBySkill[skill] = [];
      }
      accuracyBySkill[skill].push(attempt.is_correct ? 1 : 0);
    });

    Object.entries(accuracyBySkill).forEach(([skill, scores]) => {
      const accuracy = scores.reduce((a, b) => a + b, 0) / scores.length;
      if (accuracy < 0.4) {
        weaknesses.push(skill);
      }
    });

    return weaknesses;
  }

  private static consolidateProgressByPrueba(userData: any): Record<string, number> {
    const progress: Record<string, number> = {};
    
    userData.nodeProgress.forEach((node: any) => {
      // Aquí se podría mapear nodeId a prueba específica
      // Por ahora, usamos un progreso general
      progress['general'] = (progress['general'] || 0) + (node.progress || 0);
    });

    // Normalizar por cantidad de nodos
    Object.keys(progress).forEach(key => {
      progress[key] = progress[key] / userData.nodeProgress.length;
    });

    return progress;
  }
}
