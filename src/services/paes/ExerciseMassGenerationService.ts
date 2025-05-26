
import { TPAESPrueba, TPAESHabilidad } from '@/types/system-types';
import { Exercise } from '@/types/ai-types';
import { ExerciseGenerationServicePAES } from './ExerciseGenerationServicePAES';
import { PAESQualityAssuranceEngine } from './PAESQualityAssuranceEngine';
import { logger } from '@/core/logging/SystemLogger';
import { supabase } from '@/integrations/supabase/client';

interface MassGenerationConfig {
  exercisesPerNode: number;
  targetQualityScore: number;
  maxRetries: number;
  batchSize: number;
}

interface GenerationStats {
  generated: number;
  approved: number;
  rejected: number;
  totalNodes: number;
  estimatedTime: number;
}

export class ExerciseMassGenerationService {
  private static readonly DEFAULT_CONFIG: MassGenerationConfig = {
    exercisesPerNode: 50,
    targetQualityScore: 0.75,
    maxRetries: 3,
    batchSize: 5
  };

  /**
   * Ejecuta la precarga masiva completa del sistema
   */
  static async executeFullPreload(): Promise<GenerationStats> {
    logger.info('ExerciseMassGenerationService', 'Iniciando precarga masiva completa');
    
    try {
      // 1. Limpiar ejercicios generados previamente
      await this.performSurgicalCleanup();
      
      // 2. Obtener todos los nodos del sistema
      const nodes = await this.fetchAllLearningNodes();
      
      // 3. Generar ejercicios estratificados
      const stats = await this.generateStratifiedExercises(nodes);
      
      // 4. Actualizar métricas del sistema
      await this.updateSystemMetrics(stats);
      
      logger.info('ExerciseMassGenerationService', 'Precarga masiva completada', stats);
      return stats;
      
    } catch (error) {
      logger.error('ExerciseMassGenerationService', 'Error en precarga masiva', error);
      throw error;
    }
  }

  /**
   * Limpieza quirúrgica: elimina ejercicios generados, preserva oficiales
   */
  private static async performSurgicalCleanup(): Promise<void> {
    logger.info('ExerciseMassGenerationService', 'Ejecutando limpieza quirúrgica');
    
    try {
      // Eliminar ejercicios generados por AI (preservar oficiales)
      const { error: deleteError } = await supabase
        .from('generated_exercises')
        .delete()
        .neq('source', 'official_paes');
      
      if (deleteError) {
        throw new Error(`Error limpiando ejercicios: ${deleteError.message}`);
      }
      
      // Limpiar caché del banco inteligente
      const { error: cacheError } = await supabase
        .from('system_metrics')
        .delete()
        .eq('metric_type', 'exercise_cache');
        
      if (cacheError) {
        logger.warn('ExerciseMassGenerationService', 'Error limpiando caché', cacheError);
      }
      
      logger.info('ExerciseMassGenerationService', 'Limpieza quirúrgica completada');
    } catch (error) {
      logger.error('ExerciseMassGenerationService', 'Error en limpieza quirúrgica', error);
      throw error;
    }
  }

  /**
   * Obtiene todos los nodos de aprendizaje del sistema
   */
  private static async fetchAllLearningNodes(): Promise<any[]> {
    const { data: nodes, error } = await supabase
      .from('learning_nodes')
      .select('*')
      .order('tier_priority', { ascending: true });
    
    if (error) {
      throw new Error(`Error obteniendo nodos: ${error.message}`);
    }
    
    return nodes || [];
  }

  /**
   * Genera ejercicios estratificados por tier de nodo
   */
  private static async generateStratifiedExercises(nodes: any[]): Promise<GenerationStats> {
    const stats: GenerationStats = {
      generated: 0,
      approved: 0,
      rejected: 0,
      totalNodes: nodes.length,
      estimatedTime: 0
    };
    
    const startTime = Date.now();
    
    for (const node of nodes) {
      const exerciseCount = this.getExerciseCountByTier(node.tier_priority);
      const nodeStats = await this.generateExercisesForNode(node, exerciseCount);
      
      stats.generated += nodeStats.generated;
      stats.approved += nodeStats.approved;
      stats.rejected += nodeStats.rejected;
      
      // Log progreso
      logger.info('ExerciseMassGenerationService', `Nodo ${node.code} completado`, {
        nodeId: node.id,
        generated: nodeStats.generated,
        approved: nodeStats.approved
      });
      
      // Pausa entre nodos para no sobrecargar APIs
      await new Promise(resolve => setTimeout(resolve, 500));
    }
    
    stats.estimatedTime = Date.now() - startTime;
    return stats;
  }

  /**
   * Determina cantidad de ejercicios según tier del nodo
   */
  private static getExerciseCountByTier(tier: string): number {
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
   * Genera ejercicios para un nodo específico
   */
  private static async generateExercisesForNode(
    node: any, 
    targetCount: number
  ): Promise<{ generated: number; approved: number; rejected: number }> {
    const stats = { generated: 0, approved: 0, rejected: 0 };
    const config = this.DEFAULT_CONFIG;
    
    // Determinar prueba y habilidad del nodo
    const prueba = this.mapTestIdToPrueba(node.test_id);
    const skill = this.mapSkillIdToHabilidad(node.skill_id);
    
    // Distribuir ejercicios por dificultad: 40% básico, 45% intermedio, 15% avanzado
    const difficulties = [
      ...Array(Math.floor(targetCount * 0.4)).fill('BASICO'),
      ...Array(Math.floor(targetCount * 0.45)).fill('INTERMEDIO'),
      ...Array(Math.floor(targetCount * 0.15)).fill('AVANZADO')
    ];
    
    // Completar hasta targetCount si hay diferencia por redondeo
    while (difficulties.length < targetCount) {
      difficulties.push('INTERMEDIO');
    }
    
    // Generar ejercicios en lotes
    for (let i = 0; i < difficulties.length; i += config.batchSize) {
      const batch = difficulties.slice(i, i + config.batchSize);
      
      for (const difficulty of batch) {
        let exercise: Exercise | null = null;
        let attempts = 0;
        
        while (!exercise && attempts < config.maxRetries) {
          try {
            exercise = await ExerciseGenerationServicePAES.generatePAESExercise({
              prueba,
              skill,
              difficulty: difficulty as 'BASICO' | 'INTERMEDIO' | 'AVANZADO',
              includeVisuals: this.shouldIncludeVisuals(prueba)
            });
            
            if (exercise) {
              // Validar calidad
              const quality = await PAESQualityAssuranceEngine.validateExerciseQuality(exercise);
              
              if (quality.overallScore >= config.targetQualityScore) {
                // Guardar ejercicio aprobado
                await this.saveExerciseToDatabase(exercise, node, quality);
                stats.approved++;
              } else {
                stats.rejected++;
                exercise = null; // Rechazar y reintentar
              }
            }
            
            stats.generated++;
            attempts++;
          } catch (error) {
            logger.error('ExerciseMassGenerationService', 'Error generando ejercicio', error);
            attempts++;
          }
        }
      }
      
      // Pausa entre lotes
      await new Promise(resolve => setTimeout(resolve, 200));
    }
    
    return stats;
  }

  /**
   * Guarda ejercicio en la base de datos
   */
  private static async saveExerciseToDatabase(
    exercise: Exercise, 
    node: any, 
    quality: any
  ): Promise<void> {
    const { error } = await supabase
      .from('generated_exercises')
      .insert({
        question: exercise.question,
        options: exercise.options,
        correct_answer: exercise.correctAnswer,
        explanation: exercise.explanation || 'Explicación generada automáticamente',
        prueba_paes: exercise.prueba,
        skill_code: exercise.skill,
        difficulty_level: exercise.difficulty,
        source: 'ai_mass_generated',
        metadata: {
          nodeId: node.id,
          nodeCode: node.code,
          qualityMetrics: quality,
          hasVisualContent: exercise.hasVisualContent || false,
          visualType: exercise.visualType,
          text: exercise.text,
          generatedAt: new Date().toISOString()
        }
      });
    
    if (error) {
      throw new Error(`Error guardando ejercicio: ${error.message}`);
    }
  }

  /**
   * Mapea test_id a TPAESPrueba
   */
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

  /**
   * Mapea skill_id a TPAESHabilidad
   */
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

  /**
   * Determina si incluir contenido visual
   */
  private static shouldIncludeVisuals(prueba: TPAESPrueba): boolean {
    return ['MATEMATICA_1', 'MATEMATICA_2', 'CIENCIAS'].includes(prueba);
  }

  /**
   * Actualiza métricas del sistema
   */
  private static async updateSystemMetrics(stats: GenerationStats): Promise<void> {
    const { error } = await supabase
      .from('system_metrics')
      .insert({
        metric_type: 'mass_generation_completed',
        metric_value: stats.approved,
        context: {
          stats: {
            generated: stats.generated,
            approved: stats.approved,
            rejected: stats.rejected,
            totalNodes: stats.totalNodes,
            estimatedTime: stats.estimatedTime
          },
          completedAt: new Date().toISOString()
        } as any
      });
    
    if (error) {
      logger.warn('ExerciseMassGenerationService', 'Error actualizando métricas', error);
    }
  }
}
