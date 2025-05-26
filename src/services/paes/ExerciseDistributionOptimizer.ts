
import { supabase } from '@/integrations/supabase/client';
import { logger } from '@/core/logging/SystemLogger';
import { TPAESPrueba, TPAESHabilidad } from '@/types/system-types';

interface DistributionMetrics {
  totalExercises: number;
  distributionBySubject: Record<TPAESPrueba, number>;
  distributionByDifficulty: Record<string, number>;
  distributionByNode: Record<string, number>;
  qualityMetrics: {
    averageScore: number;
    minScore: number;
    maxScore: number;
  };
}

interface OptimizationResult {
  recommended: any[];
  metrics: DistributionMetrics;
  suggestions: string[];
}

export class ExerciseDistributionOptimizer {
  
  /**
   * Optimiza la distribución de ejercicios en el banco
   */
  static async optimizeDistribution(): Promise<OptimizationResult> {
    logger.info('ExerciseDistributionOptimizer', 'Iniciando optimización de distribución');
    
    try {
      // Analizar distribución actual
      const currentMetrics = await this.analyzeCurrentDistribution();
      
      // Identificar gaps y desequilibrios
      const gaps = this.identifyDistributionGaps(currentMetrics);
      
      // Generar recomendaciones
      const recommendations = this.generateRecommendations(gaps);
      
      // Calcular ejercicios recomendados para balance
      const recommendedExercises = await this.calculateRecommendedExercises(gaps);
      
      const result: OptimizationResult = {
        recommended: recommendedExercises,
        metrics: currentMetrics,
        suggestions: recommendations
      };
      
      logger.info('ExerciseDistributionOptimizer', 'Optimización completada', {
        totalGaps: gaps.length,
        recommendations: recommendations.length
      });
      
      return result;
      
    } catch (error) {
      logger.error('ExerciseDistributionOptimizer', 'Error en optimización', error);
      throw error;
    }
  }

  /**
   * Analiza la distribución actual de ejercicios
   */
  private static async analyzeCurrentDistribution(): Promise<DistributionMetrics> {
    // Obtener todos los ejercicios generados
    const { data: exercises, error } = await supabase
      .from('generated_exercises')
      .select('*');
    
    if (error) {
      throw new Error(`Error obteniendo ejercicios: ${error.message}`);
    }
    
    const exerciseList = exercises || [];
    
    // Analizar distribución por materia
    const distributionBySubject: Record<TPAESPrueba, number> = {
      'COMPETENCIA_LECTORA': 0,
      'MATEMATICA_1': 0,
      'MATEMATICA_2': 0,
      'CIENCIAS': 0,
      'HISTORIA': 0
    };
    
    // Analizar distribución por dificultad
    const distributionByDifficulty: Record<string, number> = {
      'BASICO': 0,
      'INTERMEDIO': 0,
      'AVANZADO': 0
    };
    
    // Analizar distribución por nodo
    const distributionByNode: Record<string, number> = {};
    
    // Métricas de calidad
    let totalQuality = 0;
    let minQuality = 1;
    let maxQuality = 0;
    let qualityCount = 0;
    
    // Procesar cada ejercicio
    for (const exercise of exerciseList) {
      // Contar por materia
      if (exercise.prueba_paes && distributionBySubject.hasOwnProperty(exercise.prueba_paes)) {
        distributionBySubject[exercise.prueba_paes as TPAESPrueba]++;
      }
      
      // Contar por dificultad
      if (exercise.difficulty_level && distributionByDifficulty.hasOwnProperty(exercise.difficulty_level)) {
        distributionByDifficulty[exercise.difficulty_level]++;
      }
      
      // Contar por nodo
      const nodeId = exercise.metadata?.nodeId || 'unknown';
      distributionByNode[nodeId] = (distributionByNode[nodeId] || 0) + 1;
      
      // Analizar calidad si está disponible
      if (exercise.metadata?.qualityMetrics?.overallScore) {
        const quality = exercise.metadata.qualityMetrics.overallScore;
        totalQuality += quality;
        minQuality = Math.min(minQuality, quality);
        maxQuality = Math.max(maxQuality, quality);
        qualityCount++;
      }
    }
    
    return {
      totalExercises: exerciseList.length,
      distributionBySubject,
      distributionByDifficulty,
      distributionByNode,
      qualityMetrics: {
        averageScore: qualityCount > 0 ? totalQuality / qualityCount : 0,
        minScore: qualityCount > 0 ? minQuality : 0,
        maxScore: qualityCount > 0 ? maxQuality : 0
      }
    };
  }

  /**
   * Identifica gaps en la distribución
   */
  private static identifyDistributionGaps(metrics: DistributionMetrics): any[] {
    const gaps: any[] = [];
    
    // Verificar balance entre materias
    const totalExercises = metrics.totalExercises;
    const expectedPerSubject = totalExercises / 5; // 5 materias
    const tolerance = 0.3; // 30% de tolerancia
    
    for (const [subject, count] of Object.entries(metrics.distributionBySubject)) {
      const ratio = count / expectedPerSubject;
      if (ratio < (1 - tolerance)) {
        gaps.push({
          type: 'subject_underrepresented',
          subject,
          current: count,
          expected: Math.round(expectedPerSubject),
          deficit: Math.round(expectedPerSubject - count)
        });
      } else if (ratio > (1 + tolerance)) {
        gaps.push({
          type: 'subject_overrepresented',
          subject,
          current: count,
          expected: Math.round(expectedPerSubject),
          excess: Math.round(count - expectedPerSubject)
        });
      }
    }
    
    // Verificar balance de dificultad (40% básico, 45% intermedio, 15% avanzado)
    const difficultyTargets = {
      'BASICO': 0.40,
      'INTERMEDIO': 0.45,
      'AVANZADO': 0.15
    };
    
    for (const [difficulty, target] of Object.entries(difficultyTargets)) {
      const current = metrics.distributionByDifficulty[difficulty] || 0;
      const expected = totalExercises * target;
      const ratio = current / expected;
      
      if (ratio < 0.8) {
        gaps.push({
          type: 'difficulty_underrepresented',
          difficulty,
          current,
          expected: Math.round(expected),
          deficit: Math.round(expected - current)
        });
      }
    }
    
    // Verificar nodos sin ejercicios o con muy pocos
    const minExercisesPerNode = 10;
    for (const [nodeId, count] of Object.entries(metrics.distributionByNode)) {
      if (count < minExercisesPerNode && nodeId !== 'unknown') {
        gaps.push({
          type: 'node_insufficient',
          nodeId,
          current: count,
          expected: minExercisesPerNode,
          deficit: minExercisesPerNode - count
        });
      }
    }
    
    return gaps;
  }

  /**
   * Genera recomendaciones basadas en los gaps
   */
  private static generateRecommendations(gaps: any[]): string[] {
    const recommendations: string[] = [];
    
    const subjectGaps = gaps.filter(g => g.type.includes('subject'));
    const difficultyGaps = gaps.filter(g => g.type.includes('difficulty'));
    const nodeGaps = gaps.filter(g => g.type === 'node_insufficient');
    
    if (subjectGaps.length > 0) {
      recommendations.push(`Se detectaron ${subjectGaps.length} desequilibrios en la distribución por materias`);
      
      const underrepresented = subjectGaps.filter(g => g.type === 'subject_underrepresented');
      if (underrepresented.length > 0) {
        const subjects = underrepresented.map(g => g.subject).join(', ');
        recommendations.push(`Generar más ejercicios para: ${subjects}`);
      }
    }
    
    if (difficultyGaps.length > 0) {
      recommendations.push(`Se requiere balancear la distribución de dificultad`);
      
      const underrepresented = difficultyGaps.filter(g => g.type === 'difficulty_underrepresented');
      if (underrepresented.length > 0) {
        const difficulties = underrepresented.map(g => g.difficulty).join(', ');
        recommendations.push(`Incrementar ejercicios de dificultad: ${difficulties}`);
      }
    }
    
    if (nodeGaps.length > 0) {
      recommendations.push(`${nodeGaps.length} nodos tienen ejercicios insuficientes`);
      recommendations.push('Priorizar generación para nodos con déficit');
    }
    
    if (recommendations.length === 0) {
      recommendations.push('La distribución actual está bien balanceada');
    }
    
    return recommendations;
  }

  /**
   * Calcula ejercicios recomendados para equilibrar
   */
  private static async calculateRecommendedExercises(gaps: any[]): Promise<any[]> {
    const recommendations: any[] = [];
    
    // Obtener información de nodos
    const { data: nodes } = await supabase
      .from('learning_nodes')
      .select('*');
    
    const nodeMap = new Map((nodes || []).map(node => [node.id, node]));
    
    // Procesar gaps de materias
    const subjectDeficits = gaps.filter(g => g.type === 'subject_underrepresented');
    for (const gap of subjectDeficits) {
      recommendations.push({
        type: 'generate_for_subject',
        subject: gap.subject,
        quantity: gap.deficit,
        priority: 'high',
        distribution: {
          'BASICO': Math.round(gap.deficit * 0.4),
          'INTERMEDIO': Math.round(gap.deficit * 0.45),
          'AVANZADO': Math.round(gap.deficit * 0.15)
        }
      });
    }
    
    // Procesar gaps de dificultad
    const difficultyDeficits = gaps.filter(g => g.type === 'difficulty_underrepresented');
    for (const gap of difficultyDeficits) {
      recommendations.push({
        type: 'generate_for_difficulty',
        difficulty: gap.difficulty,
        quantity: gap.deficit,
        priority: 'medium'
      });
    }
    
    // Procesar gaps de nodos
    const nodeDeficits = gaps.filter(g => g.type === 'node_insufficient');
    for (const gap of nodeDeficits) {
      const node = nodeMap.get(gap.nodeId);
      if (node) {
        recommendations.push({
          type: 'generate_for_node',
          nodeId: gap.nodeId,
          nodeCode: node.code,
          subject: this.mapTestIdToPrueba(node.test_id),
          skill: this.mapSkillIdToHabilidad(node.skill_id),
          quantity: gap.deficit,
          priority: this.getNodePriority(node.tier_priority)
        });
      }
    }
    
    // Ordenar por prioridad
    recommendations.sort((a, b) => {
      const priorityOrder = { 'high': 3, 'medium': 2, 'low': 1 };
      return (priorityOrder[b.priority as keyof typeof priorityOrder] || 0) - 
             (priorityOrder[a.priority as keyof typeof priorityOrder] || 0);
    });
    
    return recommendations;
  }

  /**
   * Ejecuta las recomendaciones de optimización
   */
  static async executeOptimizationRecommendations(recommendations: any[]): Promise<void> {
    logger.info('ExerciseDistributionOptimizer', 'Ejecutando recomendaciones', {
      count: recommendations.length
    });
    
    for (const rec of recommendations) {
      try {
        await this.executeRecommendation(rec);
        
        // Pausa entre ejecuciones
        await new Promise(resolve => setTimeout(resolve, 1000));
      } catch (error) {
        logger.error('ExerciseDistributionOptimizer', 'Error ejecutando recomendación', {
          recommendation: rec,
          error
        });
      }
    }
  }

  /**
   * Ejecuta una recomendación específica
   */
  private static async executeRecommendation(rec: any): Promise<void> {
    // Este método integraría con ExerciseMassGenerationService
    // para generar ejercicios específicos según la recomendación
    
    switch (rec.type) {
      case 'generate_for_subject':
        // Generar ejercicios para una materia específica
        logger.info('ExerciseDistributionOptimizer', 'Generando para materia', rec);
        break;
        
      case 'generate_for_difficulty':
        // Generar ejercicios de dificultad específica
        logger.info('ExerciseDistributionOptimizer', 'Generando para dificultad', rec);
        break;
        
      case 'generate_for_node':
        // Generar ejercicios para nodo específico
        logger.info('ExerciseDistributionOptimizer', 'Generando para nodo', rec);
        break;
    }
  }

  // Métodos auxiliares
  private static mapTestIdToPrueba(testId: number): TPAESPrueba {
    const mapping: Record<number, TPAESPrueba> = {
      1: 'COMPETENCIA_LECTORA',
      2: 'MATEMATICA_1',
      3: 'MATEMATICA_2',
      4: 'HISTORIA',
      5: 'CIENCIAS'
    };
    return mapping[testId] || 'COMPETENCIA_LECTORA';
  }

  private static mapSkillIdToHabilidad(skillId: number): TPAESHabilidad {
    const mapping: Record<number, TPAESHabilidad> = {
      1: 'TRACK_LOCATE',
      2: 'INTERPRET_RELATE',
      3: 'EVALUATE_REFLECT',
      4: 'SOLVE_PROBLEMS',
      5: 'REPRESENT',
      6: 'MODEL',
      7: 'ARGUE_COMMUNICATE',
      8: 'IDENTIFY_THEORIES',
      9: 'PROCESS_ANALYZE',
      10: 'APPLY_PRINCIPLES',
      11: 'SCIENTIFIC_ARGUMENT',
      12: 'TEMPORAL_THINKING',
      13: 'SOURCE_ANALYSIS',
      14: 'MULTICAUSAL_ANALYSIS',
      15: 'CRITICAL_THINKING',
      16: 'REFLECTION'
    };
    return mapping[skillId] || 'INTERPRET_RELATE';
  }

  private static getNodePriority(tier: string): string {
    switch (tier) {
      case 'tier1_critico':
        return 'high';
      case 'tier2_importante':
        return 'medium';
      case 'tier3_complementario':
        return 'low';
      default:
        return 'medium';
    }
  }
}
