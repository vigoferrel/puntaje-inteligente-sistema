/* eslint-disable react-refresh/only-export-components */

import { TPAESPrueba, TPAESHabilidad } from '@/types/system-types';
import type { SafeString, SafeNumber, SafeBoolean, APIResponse, OperationResult } from '@/types/core';
import { Exercise } from '@/types/ai-types';
// DISABLED: // DISABLED: import { supabase } from '@/integrations/supabase/unified-client';
import { logger } from '@/core/logging/SystemLogger';
import { supabase } from '@/integrations/supabase/leonardo-auth-client';

interface ExerciseMetadata {
  nodeId?: string;
  qualityMetrics?: {
    overallScore: number;
    [key: string]: unknown;
  };
  [key: string]: unknown;
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
   * Optimiza la distribuciÃ³n de ejercicios por nodo
   */
  static async optimizeNodeDistribution(): Promise<NodeExerciseStats[]> {
    logger.info('ExerciseDistributionOptimizer', 'Iniciando optimizaciÃ³n de distribuciÃ³n');
    
    try {
      // Obtener nodos del sistema
      const { data: nodes, error: nodesError } = await supabase
        .from('learning_nodes')
        .select('id, code, tier_priority, test_id, skill_id');
      
      if (nodesError) {
        throw new Error(`Error obteniendo nodos: ${nodesError.message}`);
      }
      
      // Analizar distribuciÃ³n actual
      const currentStats = await this.analyzeCurrentDistribution();
      
      // Identificar nodos con dÃ©ficit
      const deficitNodes = await this.identifyDeficitNodes(nodes || [], currentStats);
      
      // Balancear distribuciÃ³n
      const optimizedStats = await this.balanceDistribution(deficitNodes);
      
      logger.info('ExerciseDistributionOptimizer', 'OptimizaciÃ³n completada', {
        totalNodes: nodes?.length || 0,
        deficitNodes: deficitNodes.length,
        optimizedNodes: optimizedStats.length
      });
      
      return optimizedStats;
    } catch (error) {
      logger.error('ExerciseDistributionOptimizer', 'Error en optimizaciÃ³n', error);
      return [];
    }
  }

  /**
   * Analiza la distribuciÃ³n actual de ejercicios
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
   * Identifica nodos con dÃ©ficit de ejercicios
   */
  private static async identifyDeficitNodes(
    nodes: unknown[], 
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
   * Balancea la distribuciÃ³n de ejercicios
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
   * Genera ejercicios faltantes para un nodo especÃ­fico
   */
  private static async generateMissingExercises(nodeId: string): Promise<NodeExerciseStats | null> {
    // Esta funciÃ³n se conectarÃ­a con ExerciseMassGenerationService
    // Por ahora retornamos estadÃ­sticas simuladas
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
   * Obtiene estadÃ­sticas de distribuciÃ³n por materia
   */
  static async getDistributionBySubject(): Promise<Record<string, unknown>> {
    const { data: exercises } = await supabase
      .from('generated_exercises')
      .select('prueba_paes, difficulty_level, metadata');
    
    if (!exercises) return {};
    
    const distribution: Record<string, unknown> = {};
    
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





