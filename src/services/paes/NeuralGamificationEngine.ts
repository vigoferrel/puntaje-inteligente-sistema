
import { supabase } from '@/integrations/supabase/client';
import { logger } from '@/core/logging/SystemLogger';

interface Achievement {
  id: string;
  title: string;
  description: string;
  category: string;
  rarity: 'common' | 'rare' | 'epic' | 'legendary';
  points: number;
  condition: (userStats: any) => boolean;
}

interface GamificationMetrics {
  totalPoints: number;
  currentStreak: number;
  achievements: Achievement[];
  level: number;
  progress: number;
  nextLevelPoints: number;
}

export class NeuralGamificationEngine {
  
  /**
   * Procesa logros y puntos después de completar un ejercicio
   */
  static async processExerciseCompletion(
    userId: string, 
    exerciseResult: any
  ): Promise<GamificationMetrics> {
    logger.info('NeuralGamificationEngine', 'Procesando finalización de ejercicio', {
      userId, 
      isCorrect: exerciseResult.isCorrect
    });
    
    try {
      // Obtener estadísticas actuales del usuario
      const userStats = await this.getUserStats(userId);
      
      // Calcular puntos por este ejercicio
      const earnedPoints = this.calculateExercisePoints(exerciseResult);
      
      // Actualizar puntos totales
      await this.updateUserPoints(userId, earnedPoints);
      
      // Verificar y desbloquear logros
      const newAchievements = await this.checkAndUnlockAchievements(userId, userStats);
      
      // Actualizar racha si es correcta
      if (exerciseResult.isCorrect) {
        await this.updateStreak(userId, userStats);
      } else {
        await this.resetStreak(userId);
      }
      
      // Calcular métricas finales
      const finalMetrics = await this.calculateFinalMetrics(userId);
      
      logger.info('NeuralGamificationEngine', 'Procesamiento completado', {
        userId,
        earnedPoints,
        newAchievements: newAchievements.length
      });
      
      return finalMetrics;
      
    } catch (error) {
      logger.error('NeuralGamificationEngine', 'Error procesando gamificación', error);
      throw error;
    }
  }

  /**
   * Calcula puntos ganados por un ejercicio
   */
  private static calculateExercisePoints(result: any): number {
    let basePoints = 10;
    
    // Bonus por dificultad
    const difficultyMultiplier = {
      'BASICO': 1.0,
      'INTERMEDIO': 1.5,
      'AVANZADO': 2.0
    };
    
    basePoints *= difficultyMultiplier[result.difficulty as keyof typeof difficultyMultiplier] || 1.0;
    
    // Bonus por respuesta correcta
    if (result.isCorrect) {
      basePoints *= 1.5;
    }
    
    // Bonus por tiempo (si respondió rápido)
    if (result.timeSeconds && result.timeSeconds < 30) {
      basePoints *= 1.2;
    }
    
    // Bonus por racha
    if (result.currentStreak && result.currentStreak > 0) {
      const streakMultiplier = Math.min(1 + (result.currentStreak * 0.1), 2.0);
      basePoints *= streakMultiplier;
    }
    
    return Math.round(basePoints);
  }

  /**
   * Obtiene estadísticas actuales del usuario
   */
  private static async getUserStats(userId: string): Promise<any> {
    const { data: achievements } = await supabase
      .from('user_achievements')
      .select('*')
      .eq('user_id', userId);
    
    const { data: metrics } = await supabase
      .from('neural_metrics')
      .select('*')
      .eq('user_id', userId);
    
    return {
      achievements: achievements || [],
      metrics: metrics || [],
      totalPoints: this.getTotalPoints(metrics || []),
      currentStreak: this.getCurrentStreak(metrics || [])
    };
  }

  /**
   * Actualiza puntos del usuario
   */
  private static async updateUserPoints(userId: string, pointsToAdd: number): Promise<void> {
    const { error } = await supabase
      .from('neural_metrics')
      .upsert({
        user_id: userId,
        metric_type: 'total_points',
        dimension_id: 'gamification',
        current_value: pointsToAdd,
        last_calculated_at: new Date().toISOString()
      }, {
        onConflict: 'user_id,metric_type,dimension_id'
      });
    
    if (error) {
      throw new Error(`Error actualizando puntos: ${error.message}`);
    }
  }

  /**
   * Verifica y desbloquea nuevos logros
   */
  private static async checkAndUnlockAchievements(userId: string, userStats: any): Promise<Achievement[]> {
    const allAchievements = this.getAllAchievements();
    const userAchievementIds = new Set(userStats.achievements.map((a: any) => a.achievement_id));
    const newAchievements: Achievement[] = [];
    
    for (const achievement of allAchievements) {
      if (!userAchievementIds.has(achievement.id) && achievement.condition(userStats)) {
        // Desbloquear logro
        await this.unlockAchievement(userId, achievement);
        newAchievements.push(achievement);
      }
    }
    
    return newAchievements;
  }

  /**
   * Define todos los logros disponibles
   */
  private static getAllAchievements(): Achievement[] {
    return [
      {
        id: 'first_exercise',
        title: 'Primer Paso',
        description: 'Completa tu primer ejercicio',
        category: 'inicio',
        rarity: 'common',
        points: 50,
        condition: (stats) => stats.metrics.some((m: any) => 
          m.metric_type === 'exercises_completed' && m.current_value >= 1
        )
      },
      {
        id: 'streak_5',
        title: 'En Racha',
        description: 'Mantén una racha de 5 ejercicios correctos',
        category: 'racha',
        rarity: 'rare',
        points: 100,
        condition: (stats) => stats.currentStreak >= 5
      },
      {
        id: 'streak_10',
        title: 'Imparable',
        description: 'Mantén una racha de 10 ejercicios correctos',
        category: 'racha',
        rarity: 'epic',
        points: 250,
        condition: (stats) => stats.currentStreak >= 10
      },
      {
        id: 'math_master',
        title: 'Maestro Matemático',
        description: 'Completa 50 ejercicios de matemáticas',
        category: 'materia',
        rarity: 'epic',
        points: 300,
        condition: (stats) => stats.metrics.some((m: any) => 
          m.metric_type === 'math_exercises_completed' && m.current_value >= 50
        )
      },
      {
        id: 'reading_expert',
        title: 'Experto en Lectura',
        description: 'Completa 50 ejercicios de comprensión lectora',
        category: 'materia',
        rarity: 'epic',
        points: 300,
        condition: (stats) => stats.metrics.some((m: any) => 
          m.metric_type === 'reading_exercises_completed' && m.current_value >= 50
        )
      },
      {
        id: 'speed_demon',
        title: 'Velocidad Demonio',
        description: 'Responde 10 ejercicios en menos de 15 segundos cada uno',
        category: 'velocidad',
        rarity: 'rare',
        points: 200,
        condition: (stats) => stats.metrics.some((m: any) => 
          m.metric_type === 'fast_responses' && m.current_value >= 10
        )
      },
      {
        id: 'perfectionist',
        title: 'Perfeccionista',
        description: 'Obtén 100% de aciertos en 20 ejercicios consecutivos',
        category: 'precision',
        rarity: 'legendary',
        points: 500,
        condition: (stats) => stats.metrics.some((m: any) => 
          m.metric_type === 'perfect_streak' && m.current_value >= 20
        )
      },
      {
        id: 'knowledge_seeker',
        title: 'Buscador del Conocimiento',
        description: 'Completa ejercicios de todas las materias PAES',
        category: 'diversidad',
        rarity: 'epic',
        points: 400,
        condition: (stats) => {
          const subjects = ['math', 'reading', 'science', 'history'];
          return subjects.every(subject => 
            stats.metrics.some((m: any) => 
              m.metric_type === `${subject}_exercises_completed` && m.current_value >= 5
            )
          );
        }
      }
    ];
  }

  /**
   * Desbloquea un logro específico
   */
  private static async unlockAchievement(userId: string, achievement: Achievement): Promise<void> {
    const { error } = await supabase
      .from('user_achievements')
      .insert({
        user_id: userId,
        achievement_id: achievement.id,
        title: achievement.title,
        description: achievement.description,
        category: achievement.category,
        rarity: achievement.rarity,
        points_awarded: achievement.points,
        achievement_type: 'exercise_completion'
      });
    
    if (error) {
      throw new Error(`Error desbloqueando logro: ${error.message}`);
    }
    
    logger.info('NeuralGamificationEngine', 'Logro desbloqueado', {
      userId,
      achievementId: achievement.id,
      points: achievement.points
    });
  }

  /**
   * Actualiza la racha del usuario
   */
  private static async updateStreak(userId: string, userStats: any): Promise<void> {
    const newStreak = userStats.currentStreak + 1;
    
    const { error } = await supabase
      .from('neural_metrics')
      .upsert({
        user_id: userId,
        metric_type: 'current_streak',
        dimension_id: 'gamification',
        current_value: newStreak,
        last_calculated_at: new Date().toISOString()
      }, {
        onConflict: 'user_id,metric_type,dimension_id'
      });
    
    if (error) {
      throw new Error(`Error actualizando racha: ${error.message}`);
    }
  }

  /**
   * Reinicia la racha del usuario
   */
  private static async resetStreak(userId: string): Promise<void> {
    const { error } = await supabase
      .from('neural_metrics')
      .upsert({
        user_id: userId,
        metric_type: 'current_streak',
        dimension_id: 'gamification',
        current_value: 0,
        last_calculated_at: new Date().toISOString()
      }, {
        onConflict: 'user_id,metric_type,dimension_id'
      });
    
    if (error) {
      throw new Error(`Error reiniciando racha: ${error.message}`);
    }
  }

  /**
   * Calcula métricas finales de gamificación
   */
  private static async calculateFinalMetrics(userId: string): Promise<GamificationMetrics> {
    const userStats = await this.getUserStats(userId);
    const totalPoints = userStats.totalPoints;
    const level = this.calculateLevel(totalPoints);
    const progress = this.calculateLevelProgress(totalPoints, level);
    const nextLevelPoints = this.getPointsForLevel(level + 1);
    
    return {
      totalPoints,
      currentStreak: userStats.currentStreak,
      achievements: userStats.achievements,
      level,
      progress,
      nextLevelPoints
    };
  }

  // Métodos auxiliares
  private static getTotalPoints(metrics: any[]): number {
    const pointsMetric = metrics.find(m => m.metric_type === 'total_points');
    return pointsMetric ? pointsMetric.current_value : 0;
  }

  private static getCurrentStreak(metrics: any[]): number {
    const streakMetric = metrics.find(m => m.metric_type === 'current_streak');
    return streakMetric ? streakMetric.current_value : 0;
  }

  private static calculateLevel(totalPoints: number): number {
    // Sistema de niveles exponencial: nivel N requiere N^2 * 100 puntos
    return Math.floor(Math.sqrt(totalPoints / 100)) + 1;
  }

  private static calculateLevelProgress(totalPoints: number, level: number): number {
    const currentLevelPoints = this.getPointsForLevel(level);
    const nextLevelPoints = this.getPointsForLevel(level + 1);
    const progressPoints = totalPoints - currentLevelPoints;
    const levelRange = nextLevelPoints - currentLevelPoints;
    
    return Math.min(Math.max(progressPoints / levelRange, 0), 1);
  }

  private static getPointsForLevel(level: number): number {
    return Math.max(0, (level - 1) ** 2 * 100);
  }
}
