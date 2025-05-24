
import { supabase } from '@/integrations/supabase/client';
import { PAESService, PAESQuestion } from './paes-service';
import { TPAESHabilidad, TPAESPrueba } from '@/types/system-types';
import { TLearningCyclePhase } from '@/types/system-types';

/**
 * Servicio para integrar preguntas PAES con el ciclo de aprendizaje
 */
export class PAESCycleIntegrationService {
  
  /**
   * Mapeo de fases del ciclo a configuración de preguntas PAES
   */
  private static phaseConfig: Record<TLearningCyclePhase, {
    questionCount: number;
    difficultyRange: { min: number; max: number };
    priority: 'PAES' | 'AI' | 'MIXED';
  }> = {
    'DIAGNOSIS': {
      questionCount: 10,
      difficultyRange: { min: 1, max: 65 },
      priority: 'PAES'
    },
    'PERSONALIZED_PLAN': {
      questionCount: 0,
      difficultyRange: { min: 1, max: 35 },
      priority: 'MIXED'
    },
    'SKILL_TRAINING': {
      questionCount: 5,
      difficultyRange: { min: 1, max: 45 },
      priority: 'MIXED'
    },
    'CONTENT_STUDY': {
      questionCount: 3,
      difficultyRange: { min: 1, max: 25 },
      priority: 'AI'
    },
    'PERIODIC_TESTS': {
      questionCount: 15,
      difficultyRange: { min: 15, max: 55 },
      priority: 'PAES'
    },
    'FEEDBACK_ANALYSIS': {
      questionCount: 0,
      difficultyRange: { min: 1, max: 65 },
      priority: 'PAES'
    },
    'REINFORCEMENT': {
      questionCount: 8,
      difficultyRange: { min: 1, max: 40 },
      priority: 'MIXED'
    },
    'FINAL_SIMULATIONS': {
      questionCount: 65,
      difficultyRange: { min: 1, max: 65 },
      priority: 'PAES'
    },
    'diagnostic': {
      questionCount: 10,
      difficultyRange: { min: 1, max: 35 },
      priority: 'PAES'
    },
    'exploration': {
      questionCount: 3,
      difficultyRange: { min: 1, max: 25 },
      priority: 'AI'
    },
    'practice': {
      questionCount: 5,
      difficultyRange: { min: 15, max: 45 },
      priority: 'MIXED'
    },
    'application': {
      questionCount: 8,
      difficultyRange: { min: 25, max: 65 },
      priority: 'PAES'
    }
  };

  /**
   * Obtener configuración de preguntas para una fase específica
   */
  static getPhaseConfig(phase: TLearningCyclePhase) {
    return this.phaseConfig[phase] || this.phaseConfig['SKILL_TRAINING'];
  }

  /**
   * Generar ejercicios para una fase específica del ciclo
   */
  static async generatePhaseExercises(
    phase: TLearningCyclePhase,
    skill: TPAESHabilidad,
    prueba: TPAESPrueba,
    userId?: string
  ) {
    const config = this.getPhaseConfig(phase);
    
    console.log(`🎯 Generando ejercicios para fase ${phase}:`, config);

    const exercises = [];
    let paesCount = 0;
    let aiCount = 0;

    // Determinar cuántos ejercicios PAES vs AI necesitamos
    const totalExercises = config.questionCount;
    let paesTarget = 0;
    
    if (config.priority === 'PAES') {
      paesTarget = Math.floor(totalExercises * 0.8);
    } else if (config.priority === 'MIXED') {
      paesTarget = Math.floor(totalExercises * 0.5);
    } else {
      paesTarget = Math.floor(totalExercises * 0.2);
    }

    // Generar ejercicios PAES
    for (let i = 0; i < paesTarget; i++) {
      try {
        const paesQuestion = await PAESService.getRandomQuestion(
          'FORMA_113_2024',
          config.difficultyRange
        );
        
        if (paesQuestion) {
          exercises.push({
            ...paesQuestion,
            source: 'PAES',
            phase,
            skill,
            prueba
          });
          paesCount++;
        }
      } catch (error) {
        console.error('Error obteniendo pregunta PAES:', error);
      }
    }

    // Completar con ejercicios AI si es necesario
    const remainingCount = totalExercises - paesCount;
    aiCount = remainingCount;

    console.log(`✅ Fase ${phase}: ${paesCount} PAES + ${aiCount} AI = ${paesCount + aiCount} total`);

    return {
      exercises,
      stats: {
        total: paesCount + aiCount,
        paes: paesCount,
        ai: aiCount,
        phase,
        skill,
        prueba
      }
    };
  }

  /**
   * Actualizar progreso del usuario en ejercicios oficiales
   */
  static async updatePAESProgress(
    userId: string,
    questionId: number,
    isCorrect: boolean,
    skill: TPAESHabilidad,
    phase: TLearningCyclePhase
  ) {
    try {
      const { error } = await supabase
        .from('user_paes_progress')
        .upsert({
          user_id: userId,
          question_id: questionId,
          is_correct: isCorrect,
          skill,
          phase,
          completed_at: new Date().toISOString()
        });

      if (error) {
        console.error('Error actualizando progreso PAES:', error);
        return false;
      }

      console.log(`📊 Progreso PAES actualizado: Q${questionId} - ${isCorrect ? 'Correcto' : 'Incorrecto'}`);
      return true;
    } catch (error) {
      console.error('Error en updatePAESProgress:', error);
      return false;
    }
  }

  /**
   * Obtener estadísticas de progreso PAES por fase
   */
  static async getPAESProgressByPhase(userId: string) {
    try {
      const { data, error } = await supabase
        .from('user_paes_progress')
        .select('*')
        .eq('user_id', userId);

      if (error) {
        console.error('Error obteniendo progreso PAES:', error);
        return null;
      }

      // Agrupar por fase
      const progressByPhase: Record<string, {
        total: number;
        correct: number;
        accuracy: number;
      }> = {};

      data?.forEach(record => {
        if (!progressByPhase[record.phase]) {
          progressByPhase[record.phase] = {
            total: 0,
            correct: 0,
            accuracy: 0
          };
        }

        progressByPhase[record.phase].total++;
        if (record.is_correct) {
          progressByPhase[record.phase].correct++;
        }
      });

      // Calcular accuracy
      Object.keys(progressByPhase).forEach(phase => {
        const stats = progressByPhase[phase];
        stats.accuracy = stats.total > 0 ? (stats.correct / stats.total) * 100 : 0;
      });

      return progressByPhase;
    } catch (error) {
      console.error('Error en getPAESProgressByPhase:', error);
      return null;
    }
  }
}
