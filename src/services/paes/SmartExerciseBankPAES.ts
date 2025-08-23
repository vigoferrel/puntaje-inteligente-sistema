import { TPAESPrueba, TPAESHabilidad } from '@/types/system-types';
import { Exercise } from '@/types/ai-types';
import { supabase } from '@/integrations/supabase/client';
import { logger } from '@/core/logging/SystemLogger';
import { ExerciseQualityMetrics } from '@/types/exercise-quality-types';

interface BankStats {
  totalExercises: number;
  bySubject: Record<TPAESPrueba, number>;
  byDifficulty: Record<string, number>;
  averageQuality: number;
  lastUpdated: string;
}

interface ExerciseMetadata {
  nodeId?: string;
  qualityMetrics?: {
    overallScore: number;
    [key: string]: any;
  };
  hasVisualContent?: boolean;
  visualType?: string;
  text?: string;
  source?: string;
  [key: string]: any;
}

export class SmartExerciseBankPAES {
  private static readonly CACHE_TTL = 5 * 60 * 1000; // 5 minutos
  private static cache = new Map<string, { data: any; timestamp: number }>();

  /**
   * Obtiene un ejercicio optimizado del banco inteligente
   */
  static async getOptimizedExercise(
    prueba: TPAESPrueba,
    skill: TPAESHabilidad,
    difficulty: 'BASICO' | 'INTERMEDIO' | 'AVANZADO',
    userId?: string
  ): Promise<Exercise | null> {
    logger.info('SmartExerciseBankPAES', 'Obteniendo ejercicio optimizado', {
      prueba, skill, difficulty, userId
    });

    try {
      // Intentar obtener del banco primero
      let exercise = await this.getFromBank(prueba, skill, difficulty);
      
      if (!exercise && userId) {
        // Si no hay en banco, usar métricas del usuario para adaptación
        exercise = await this.getAdaptiveExercise(prueba, skill, difficulty, userId);
      }

      if (exercise) {
        // Marcar como usado
        await this.markExerciseAsUsed(exercise.id);
        
        // Convertir a formato Exercise si viene de la BD
        return this.convertToExerciseFormat(exercise);
      }

      return null;
    } catch (error) {
      logger.error('SmartExerciseBankPAES', 'Error obteniendo ejercicio optimizado', error);
      return null;
    }
  }

  /**
   * Obtiene ejercicio del banco basado en criterios
   */
  private static async getFromBank(
    prueba: TPAESPrueba,
    skill: TPAESHabilidad,
    difficulty: string
  ): Promise<any | null> {
    const { data: exercises, error } = await supabase
      .from('generated_exercises')
      .select('*')
      .eq('prueba_paes', prueba)
      .eq('skill_code', skill)
      .eq('difficulty_level', difficulty)
      .order('times_used', { ascending: true })
      .order('success_rate', { ascending: false })
      .limit(5);

    if (error) {
      logger.error('SmartExerciseBankPAES', 'Error consultando banco', error);
      return null;
    }

    // Seleccionar aleatoriamente entre los mejores
    if (exercises && exercises.length > 0) {
      const randomIndex = Math.floor(Math.random() * Math.min(exercises.length, 3));
      return exercises[randomIndex];
    }

    return null;
  }

  /**
   * Obtiene ejercicio adaptativo basado en el usuario
   */
  private static async getAdaptiveExercise(
    prueba: TPAESPrueba,
    skill: TPAESHabilidad,
    difficulty: string,
    userId: string
  ): Promise<any | null> {
    // Obtener métricas del usuario
    const userMetrics = await this.getUserMetrics(userId);
    
    // Ajustar dificultad basada en performance
    const adjustedDifficulty = this.adjustDifficultyForUser(difficulty, userMetrics);
    
    // Buscar con dificultad ajustada
    const { data: exercises, error } = await supabase
      .from('generated_exercises')
      .select('*')
      .eq('prueba_paes', prueba)
      .eq('skill_code', skill)
      .eq('difficulty_level', adjustedDifficulty)
      .order('times_used', { ascending: true })
      .limit(3);

    if (error || !exercises || exercises.length === 0) {
      return null;
    }

    return exercises[0];
  }

  /**
   * Marca ejercicio como usado y actualiza estadísticas
   */
  private static async markExerciseAsUsed(exerciseId: string): Promise<void> {
    // Usar UPDATE directo en lugar de función RPC que no existe
    const { error } = await supabase
      .from('generated_exercises')
      .update({ 
        times_used: 1
      })
      .eq('id', exerciseId);

    if (error) {
      logger.warn('SmartExerciseBankPAES', 'Error actualizando uso de ejercicio', error);
    }
  }

  /**
   * Convierte ejercicio de BD al formato Exercise
   */
  private static convertToExerciseFormat(dbExercise: any): Exercise {
    const metadata = dbExercise.metadata as ExerciseMetadata || {};
    
    return {
      id: dbExercise.id,
      question: dbExercise.question,
      options: dbExercise.options || [],
      correctAnswer: dbExercise.correct_answer,
      explanation: dbExercise.explanation || '',
      skill: dbExercise.skill_code,
      prueba: dbExercise.prueba_paes,
      difficulty: dbExercise.difficulty_level,
      hasVisualContent: metadata.hasVisualContent || false,
      visualType: metadata.visualType,
      text: metadata.text || '',
      nodeId: metadata.nodeId || '',
      nodeName: '', // Se puede mapear desde nodes si es necesario
      metadata: {
        source: dbExercise.source || 'smart_bank',
        timesUsed: dbExercise.times_used || 0,
        successRate: dbExercise.success_rate || 0,
        qualityScore: metadata.qualityMetrics?.overallScore || 0
      }
    };
  }

  /**
   * Obtiene métricas del usuario para adaptación
   */
  private static async getUserMetrics(userId: string): Promise<any> {
    const { data: metrics } = await supabase
      .from('neural_metrics')
      .select('*')
      .eq('user_id', userId);

    return {
      averageScore: this.getMetricValue(metrics, 'average_score') || 0.5,
      currentStreak: this.getMetricValue(metrics, 'current_streak') || 0,
      totalExercises: this.getMetricValue(metrics, 'exercises_completed') || 0
    };
  }

  /**
   * Ajusta dificultad basada en performance del usuario
   */
  private static adjustDifficultyForUser(
    requestedDifficulty: string, 
    userMetrics: any
  ): string {
    const averageScore = userMetrics.averageScore;
    
    // Si el usuario tiene buen rendimiento, mantener o aumentar dificultad
    if (averageScore > 0.8) {
      if (requestedDifficulty === 'BASICO') return 'INTERMEDIO';
      if (requestedDifficulty === 'INTERMEDIO') return 'AVANZADO';
    }
    
    // Si tiene bajo rendimiento, reducir dificultad
    if (averageScore < 0.4) {
      if (requestedDifficulty === 'AVANZADO') return 'INTERMEDIO';
      if (requestedDifficulty === 'INTERMEDIO') return 'BASICO';
    }
    
    return requestedDifficulty;
  }

  /**
   * Obtiene estadísticas del banco
   */
  static async getBankStats(): Promise<BankStats> {
    const cacheKey = 'bank_stats';
    const cached = this.getCachedData(cacheKey);
    
    if (cached) {
      return cached;
    }

    try {
      // Estadísticas generales
      const { data: exercises, error } = await supabase
        .from('generated_exercises')
        .select('prueba_paes, difficulty_level, metadata');

      if (error) {
        throw new Error(`Error obteniendo estadísticas: ${error.message}`);
      }

      const exerciseList = exercises || [];
      
      // Inicializar contadores
      const bySubject: Record<TPAESPrueba, number> = {
        'COMPETENCIA_LECTORA': 0,
        'MATEMATICA_1': 0,
        'MATEMATICA_2': 0,
        'CIENCIAS': 0,
        'HISTORIA': 0
      };

      const byDifficulty: Record<string, number> = {
        'BASICO': 0,
        'INTERMEDIO': 0,
        'AVANZADO': 0
      };

      let totalQuality = 0;
      let qualityCount = 0;

      // Procesar ejercicios
      for (const exercise of exerciseList) {
        // Contar por materia
        if (exercise.prueba_paes && bySubject.hasOwnProperty(exercise.prueba_paes)) {
          bySubject[exercise.prueba_paes as TPAESPrueba]++;
        }

        // Contar por dificultad
        if (exercise.difficulty_level && byDifficulty.hasOwnProperty(exercise.difficulty_level)) {
          byDifficulty[exercise.difficulty_level]++;
        }

        // Calidad promedio
        const metadata = exercise.metadata as ExerciseMetadata;
        const qualityScore = metadata?.qualityMetrics?.overallScore;
        if (typeof qualityScore === 'number') {
          totalQuality += qualityScore;
          qualityCount++;
        }
      }

      const stats: BankStats = {
        totalExercises: exerciseList.length,
        bySubject,
        byDifficulty,
        averageQuality: qualityCount > 0 ? totalQuality / qualityCount : 0,
        lastUpdated: new Date().toISOString()
      };

      // Cachear resultado
      this.setCachedData(cacheKey, stats);
      
      return stats;
    } catch (error) {
      logger.error('SmartExerciseBankPAES', 'Error obteniendo estadísticas del banco', error);
      
      // Retornar estadísticas vacías en caso de error
      return {
        totalExercises: 0,
        bySubject: {
          'COMPETENCIA_LECTORA': 0,
          'MATEMATICA_1': 0,
          'MATEMATICA_2': 0,
          'CIENCIAS': 0,
          'HISTORIA': 0
        },
        byDifficulty: {
          'BASICO': 0,
          'INTERMEDIO': 0,
          'AVANZADO': 0
        },
        averageQuality: 0,
        lastUpdated: new Date().toISOString()
      };
    }
  }

  /**
   * Almacena ejercicio en el banco con validación de calidad
   */
  static async storeExercise(
    exercise: Exercise, 
    qualityMetrics: ExerciseQualityMetrics
  ): Promise<boolean> {
    try {
      const { error } = await supabase
        .from('generated_exercises')
        .insert({
          question: exercise.question,
          options: exercise.options as any,
          correct_answer: exercise.correctAnswer,
          explanation: exercise.explanation || '',
          prueba_paes: exercise.prueba,
          skill_code: exercise.skill,
          difficulty_level: exercise.difficulty,
          source: 'smart_bank_paes',
          metadata: {
            qualityMetrics,
            hasVisualContent: exercise.hasVisualContent || false,
            visualType: exercise.visualType,
            text: exercise.text,
            source: exercise.metadata?.source,
            generatedAt: new Date().toISOString(),
            prueba: exercise.prueba,
            skill: exercise.skill,
            difficulty: exercise.difficulty
          } as any
        });

      if (error) {
        logger.error('SmartExerciseBankPAES', 'Error almacenando ejercicio', error);
        return false;
      }

      // Limpiar cache de estadísticas
      this.cache.delete('bank_stats');
      
      return true;
    } catch (error) {
      logger.error('SmartExerciseBankPAES', 'Error almacenando ejercicio', error);
      return false;
    }
  }

  // Métodos de cache
  private static getCachedData(key: string): any {
    const cached = this.cache.get(key);
    if (cached && (Date.now() - cached.timestamp) < this.CACHE_TTL) {
      return cached.data;
    }
    return null;
  }

  private static setCachedData(key: string, data: any): void {
    this.cache.set(key, {
      data,
      timestamp: Date.now()
    });
  }

  private static getMetricValue(metrics: any[], metricType: string): number | null {
    const metric = metrics?.find(m => m.metric_type === metricType);
    return metric ? metric.current_value : null;
  }
}
