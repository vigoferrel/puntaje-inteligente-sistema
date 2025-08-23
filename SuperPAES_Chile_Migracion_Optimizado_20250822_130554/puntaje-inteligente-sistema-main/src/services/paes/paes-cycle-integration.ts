/* eslint-disable react-refresh/only-export-components */

// DISABLED: // DISABLED: import { supabase } from '@/integrations/supabase/unified-client';
import type { SafeString, SafeNumber, SafeBoolean, APIResponse, OperationResult } from '@/types/core';
import { PAESService, PAESQuestion } from './paes-service';
import { TPAESHabilidad, TPAESPrueba } from '@/types/system-types';
import { TLearningCyclePhase } from '@/types/system-types';
import { supabase } from '@/integrations/supabase/leonardo-auth-client';

/**
 * Servicio para integrar preguntas PAES con el ciclo de aprendizaje
 */
export class PAESCycleIntegrationService {
  
  /**
   * Mapeo de fases del ciclo a configuraciÃ³n de preguntas PAES
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
    // Fases del Ciclo de Kolb
    'EXPERIENCIA_CONCRETA': {
      questionCount: 5,
      difficultyRange: { min: 1, max: 30 },
      priority: 'MIXED'
    },
    'OBSERVACION_REFLEXIVA': {
      questionCount: 4,
      difficultyRange: { min: 10, max: 40 },
      priority: 'AI'
    },
    'CONCEPTUALIZACION_ABSTRACTA': {
      questionCount: 6,
      difficultyRange: { min: 25, max: 55 },
      priority: 'AI'
    },
    'EXPERIMENTACION_ACTIVA': {
      questionCount: 8,
      difficultyRange: { min: 30, max: 65 },
      priority: 'PAES'
    },
    // Fases tradicionales
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
   * Obtener configuraciÃ³n de preguntas para una fase especÃ­fica
   */
  static getPhaseConfig(phase: TLearningCyclePhase) {
    return this.phaseConfig[phase] || this.phaseConfig['SKILL_TRAINING'];
  }

  /**
   * Generar ejercicios para una fase especÃ­fica del ciclo
   */
  static async generatePhaseExercises(
    phase: TLearningCyclePhase,
    skill: TPAESHabilidad,
    prueba: TPAESPrueba,
    userId?: string
  ) {
    const config = this.getPhaseConfig(phase);
    
    console.log(`ðŸŽ¯ Generando ejercicios para fase ${phase}:`, config);

    const exercises = [];
    let paesCount = 0;
    let aiCount = 0;

    // Determinar cuÃ¡ntos ejercicios PAES vs AI necesitamos
    const totalExercises = config.questionCount;
    let paesTarget = 0;
    
    if (config.priority === 'PAES') {
      paesTarget = Math.floor(totalExercises * 0.8);
    } else if (config.priority === 'MIXED') {
      paesTarget = Math.floor(totalExercises * 0.5);
    } else {
      paesTarget = Math.floor(totalExercises * 0.2);
    }

    // Generate mock PAES exercises since we don't have the actual PAES tables
    for (let i = 0; i < paesTarget; i++) {
      try {
        const mockQuestion = this.generateMockPAESQuestion(config.difficultyRange);
        
        if (mockQuestion) {
          exercises.push({
            ...mockQuestion,
            source: 'PAES',
            phase,
            skill,
            prueba
          });
          paesCount++;
        }
      } catch (error) {
        console.error('Error generating mock PAES question:', error);
      }
    }

    // Completar con ejercicios AI si es necesario
    const remainingCount = totalExercises - paesCount;
    aiCount = remainingCount;

    console.log(`âœ… Fase ${phase}: ${paesCount} PAES + ${aiCount} AI = ${paesCount + aiCount} total`);

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
   * Generate a mock PAES question since we don't have the actual tables
   */
  private static generateMockPAESQuestion(difficultyRange: { min: number; max: number }) {
    const questionNumber = Math.floor(Math.random() * (difficultyRange.max - difficultyRange.min + 1)) + difficultyRange.min;
    
    return {
      id: `mock-paes-${Date.now()}-${Math.random()}`,
      numero: questionNumber,
      enunciado: `Pregunta PAES de ejemplo #${questionNumber}`,
      contexto: 'Contexto de pregunta PAES',
      tipo_pregunta: 'multiple_choice',
      opciones: [
        { letra: 'A', contenido: 'OpciÃ³n A', es_correcta: true },
        { letra: 'B', contenido: 'OpciÃ³n B', es_correcta: false },
        { letra: 'C', contenido: 'OpciÃ³n C', es_correcta: false },
        { letra: 'D', contenido: 'OpciÃ³n D', es_correcta: false },
        { letra: 'E', contenido: 'OpciÃ³n E', es_correcta: false }
      ]
    };
  }

  /**
   * Actualizar progreso del usuario en ejercicios usando user_exercise_attempts
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
        .from('user_exercise_attempts')
        .insert({
          user_id: userId,
          exercise_id: `paes-q-${questionId}`,
          answer: isCorrect ? 'correct' : 'incorrect',
          is_correct: isCorrect,
          skill_demonstrated: skill
        });

      if (error) {
        console.error('Error actualizando progreso PAES:', error);
        return false;
      }

      console.log(`ðŸ“Š Progreso PAES actualizado: Q${questionId} - ${isCorrect ? 'Correcto' : 'Incorrecto'}`);
      return true;
    } catch (error) {
      console.error('Error en updatePAESProgress:', error);
      return false;
    }
  }

  /**
   * Obtener estadÃ­sticas de progreso PAES por fase usando user_exercise_attempts
   */
  static async getPAESProgressByPhase(userId: string) {
    try {
      const { data, error } = await supabase
        .from('user_exercise_attempts')
        .select('*')
        .eq('user_id', userId)
        .like('exercise_id', 'paes-%');

      if (error) {
        console.error('Error obteniendo progreso PAES:', error);
        return null;
      }

      // Since we don't have phase data in user_exercise_attempts, 
      // we'll create a simple progress structure
      const progressByPhase: Record<string, {
        total: number;
        correct: number;
        accuracy: number;
      }> = {};

      // Group by skill as a proxy for phases
      const skillGroups: Record<string, unknown[]> = {};
      data?.forEach(record => {
        const skill = record.skill_demonstrated || 'UNKNOWN';
        if (!skillGroups[skill]) {
          skillGroups[skill] = [];
        }
        skillGroups[skill].push(record);
      });

      // Convert skill groups to phase-like structure
      Object.entries(skillGroups).forEach(([skill, records]) => {
        progressByPhase[skill] = {
          total: records.length,
          correct: records.filter(r => r.is_correct).length,
          accuracy: records.length > 0 ? (records.filter(r => r.is_correct).length / records.length) * 100 : 0
        };
      });

      return progressByPhase;
    } catch (error) {
      console.error('Error en getPAESProgressByPhase:', error);
      return null;
    }
  }
}





