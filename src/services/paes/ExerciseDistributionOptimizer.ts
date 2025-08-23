
import { TPAESPrueba, TPAESHabilidad } from '@/types/system-types';
import { Exercise } from '@/types/ai-types';
import { supabase } from '@/integrations/supabase/client';
import { logger } from '@/core/logging/SystemLogger';

interface ExerciseMetadata {
  nodeId?: string;
  qualityMetrics?: {
    overallScore: number;
    [key: string]: any;
  };
  [key: string]: any;
}

interface DistributionConfig {
  targetExercisesPerNode: number;
  difficultyDistribution: Record<string, number>;
  qualityThreshold: number;
  maxRetries: number;
}

interface NodeExerciseStats {
  nodeId: string;
  totalExercises: number;
  byDifficulty: Record<string, number>;
  averageQuality: number;
  lastGenerated: string;
}

export class ExerciseDistributionOptimizer {
  private static readonly DEFAULT_CONFIG: DistributionConfig = {
    targetExercisesPerNode: 50,
    difficultyDistribution: { 'BASICO': 40, 'INTERMEDIO': 45, 'AVANZADO': 15 },
    qualityThreshold: 0.75,
    maxRetries: 3
  };

  /**
   * Optimiza la distribución de ejercicios por nodo
   */
  static async optimizeNodeDistribution(): Promise<NodeExerciseStats[]> {
    logger.info('ExerciseDistributionOptimizer', 'Iniciando optimización de distribución');
    
    try {
      // Obtener nodos del sistema
      const { data: nodes, error: nodesError } = await supabase
        .from('learning_nodes')
        .select('id, code, tier_priority, test_id, skill_id');
      
      if (nodesError) {
        throw new Error(`Error obteniendo nodos: ${nodesError.message}`);
      }
      
      // Analizar distribución actual
      const currentStats = await this.analyzeCurrentDistribution();
      
      // Identificar nodos con déficit
      const deficitNodes = await this.identifyDeficitNodes(nodes || [], currentStats);
      
      // Balancear distribución
      const optimizedStats = await this.balanceDistribution(deficitNodes);
      
      logger.info('ExerciseDistributionOptimizer', 'Optimización completada', {
        totalNodes: nodes?.length || 0,
        deficitNodes: deficitNodes.length,
        optimizedNodes: optimizedStats.length
      });
      
      return optimizedStats;
    } catch (error) {
      logger.error('ExerciseDistributionOptimizer', 'Error en optimización', error);
      return [];
    }
  }

  /**
   * Analiza la distribución actual de ejercicios
   */
  private static async analyzeCurrentDistribution(): Promise<NodeExerciseStats[]> {
    const { data: exercises, error } = await supabase
      .from('generated_exercises')
      .select('metadata, difficulty_level, created_at');
    
    if (error || !exercises) {
      return [];
    }
    
    const nodeStats = new Map<string, NodeExerciseStats>();
    
    for (const exercise of exercises) {
      const metadata = exercise.metadata as ExerciseMetadata;
      const nodeId = metadata?.nodeId;
      
      if (!nodeId) continue;
      
      if (!nodeStats.has(nodeId)) {
        nodeStats.set(nodeId, {
          nodeId,
          totalExercises: 0,
          byDifficulty: { 'BASICO': 0, 'INTERMEDIO': 0, 'AVANZADO': 0 },
          averageQuality: 0,
          lastGenerated: exercise.created_at
        });
      }
      
      const stats = nodeStats.get(nodeId)!;
      stats.totalExercises++;
      
      if (exercise.difficulty_level) {
        stats.byDifficulty[exercise.difficulty_level] = 
          (stats.byDifficulty[exercise.difficulty_level] || 0) + 1;
      }
      
      const qualityScore = metadata?.qualityMetrics?.overallScore;
      if (typeof qualityScore === 'number') {
        stats.averageQuality = 
          (stats.averageQuality * (stats.totalExercises - 1) + qualityScore) / stats.totalExercises;
      }
    }
    
    return Array.from(nodeStats.values());
  }

  /**
   * Identifica nodos con déficit de ejercicios
   */
  private static async identifyDeficitNodes(
    nodes: any[], 
    currentStats: NodeExerciseStats[]
  ): Promise<string[]> {
    const statsMap = new Map(currentStats.map(s => [s.nodeId, s]));
    const deficitNodes: string[] = [];
    
    for (const node of nodes) {
      const stats = statsMap.get(node.id);
      const target = this.getTargetExerciseCount(node.tier_priority);
      
      if (!stats || stats.totalExercises < target) {
        deficitNodes.push(node.id);
      }
    }
    
    return deficitNodes;
  }

  /**
   * Balancea la distribución de ejercicios
   */
  private static async balanceDistribution(
    deficitNodes: string[]
  ): Promise<NodeExerciseStats[]> {
    const optimizedStats: NodeExerciseStats[] = [];
    
    for (const nodeId of deficitNodes) {
      try {
        // Generar ejercicios faltantes para este nodo
        const stats = await this.generateMissingExercises(nodeId);
        if (stats) {
          optimizedStats.push(stats);
        }
      } catch (error) {
        logger.warn('ExerciseDistributionOptimizer', `Error balanceando nodo ${nodeId}`, error);
      }
    }
    
    return optimizedStats;
  }

  /**
   * Genera ejercicios faltantes para un nodo específico
   */
  private static async generateMissingExercises(nodeId: string): Promise<NodeExerciseStats | null> {
    // Esta función se conectaría con ExerciseMassGenerationService
    // Por ahora retornamos estadísticas simuladas
    return {
      nodeId,
      totalExercises: 50,
      byDifficulty: { 'BASICO': 20, 'INTERMEDIO': 22, 'AVANZADO': 8 },
      averageQuality: 0.82,
      lastGenerated: new Date().toISOString()
    };
  }

  /**
   * Obtiene el conteo objetivo de ejercicios por tier
   */
  private static getTargetExerciseCount(tier: string): number {
    switch (tier) {
      case 'tier1_critico':
        return 75;
      case 'tier2_importante':
        return 50;
      case 'tier3_complementario':
        return 25;
      default:
        return 35;
    }
  }

  /**
   * Obtiene estadísticas de distribución por materia
   */
  static async getDistributionBySubject(): Promise<Record<string, any>> {
    const { data: exercises } = await supabase
      .from('generated_exercises')
      .select('prueba_paes, difficulty_level, metadata');
    
    if (!exercises) return {};
    
    const distribution: Record<string, any> = {};
    
    for (const exercise of exercises) {
      const subject = exercise.prueba_paes;
      if (!distribution[subject]) {
        distribution[subject] = {
          total: 0,
          byDifficulty: { 'BASICO': 0, 'INTERMEDIO': 0, 'AVANZADO': 0 },
          averageQuality: 0
        };
      }
      
      distribution[subject].total++;
      if (exercise.difficulty_level) {
        distribution[subject].byDifficulty[exercise.difficulty_level]++;
      }
    }
    
    return distribution;
  }
}
