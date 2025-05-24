
import { supabase } from '@/integrations/supabase/client';
import { TPAESHabilidad, TPAESPrueba } from '@/types/system-types';

/**
 * Servicio para análisis predictivo basado en preguntas PAES oficiales
 */
export class PAESAnalyticsService {
  
  /**
   * Calcular puntaje predicho basado en rendimiento en preguntas oficiales
   */
  static async calculatePredictedScore(userId: string): Promise<{
    overall: number;
    bySkill: Record<TPAESHabilidad, number>;
    confidence: number;
    recommendation: string;
  } | null> {
    try {
      const { data: attempts, error } = await supabase
        .from('user_paes_progress')
        .select('*')
        .eq('user_id', userId);

      if (error || !attempts || attempts.length === 0) {
        return null;
      }

      // Calcular accuracy general
      const totalAttempts = attempts.length;
      const correctAttempts = attempts.filter(a => a.is_correct).length;
      const overallAccuracy = (correctAttempts / totalAttempts) * 100;

      // Mapear accuracy a puntaje PAES (escala 150-850)
      const predictedScore = Math.round(150 + (overallAccuracy / 100) * 700);

      // Calcular por habilidad
      const skillStats: Record<string, { correct: number; total: number }> = {};
      
      attempts.forEach(attempt => {
        if (!skillStats[attempt.skill]) {
          skillStats[attempt.skill] = { correct: 0, total: 0 };
        }
        skillStats[attempt.skill].total++;
        if (attempt.is_correct) {
          skillStats[attempt.skill].correct++;
        }
      });

      const bySkill: Record<TPAESHabilidad, number> = {} as any;
      Object.keys(skillStats).forEach(skill => {
        const stats = skillStats[skill];
        const accuracy = (stats.correct / stats.total) * 100;
        bySkill[skill as TPAESHabilidad] = Math.round(150 + (accuracy / 100) * 700);
      });

      // Calcular confianza basada en cantidad de intentos
      const confidence = Math.min(100, (totalAttempts / 50) * 100);

      // Generar recomendación
      let recommendation = '';
      if (overallAccuracy >= 80) {
        recommendation = 'Excelente rendimiento. Mantén la práctica con simulacros completos.';
      } else if (overallAccuracy >= 60) {
        recommendation = 'Buen progreso. Enfócate en las habilidades más débiles.';
      } else if (overallAccuracy >= 40) {
        recommendation = 'Necesitas más práctica. Revisa los contenidos teóricos.';
      } else {
        recommendation = 'Recomendamos volver a los conceptos básicos antes de continuar.';
      }

      return {
        overall: predictedScore,
        bySkill,
        confidence: Math.round(confidence),
        recommendation
      };
    } catch (error) {
      console.error('Error calculando puntaje predicho:', error);
      return null;
    }
  }

  /**
   * Obtener análisis de fortalezas y debilidades
   */
  static async getStrengthsAndWeaknesses(userId: string) {
    try {
      const { data: attempts, error } = await supabase
        .from('user_paes_progress')
        .select('*')
        .eq('user_id', userId);

      if (error || !attempts) {
        return null;
      }

      // Agrupar por habilidad
      const skillAnalysis: Record<string, {
        attempts: number;
        correct: number;
        accuracy: number;
        trend: 'improving' | 'stable' | 'declining';
      }> = {};

      attempts.forEach(attempt => {
        if (!skillAnalysis[attempt.skill]) {
          skillAnalysis[attempt.skill] = {
            attempts: 0,
            correct: 0,
            accuracy: 0,
            trend: 'stable'
          };
        }

        skillAnalysis[attempt.skill].attempts++;
        if (attempt.is_correct) {
          skillAnalysis[attempt.skill].correct++;
        }
      });

      // Calcular accuracy y determinar fortalezas/debilidades
      const strengths: string[] = [];
      const weaknesses: string[] = [];

      Object.keys(skillAnalysis).forEach(skill => {
        const analysis = skillAnalysis[skill];
        analysis.accuracy = (analysis.correct / analysis.attempts) * 100;

        if (analysis.accuracy >= 75) {
          strengths.push(skill);
        } else if (analysis.accuracy < 50) {
          weaknesses.push(skill);
        }
      });

      return {
        skillAnalysis,
        strengths,
        weaknesses,
        totalAttempts: attempts.length,
        overallAccuracy: (attempts.filter(a => a.is_correct).length / attempts.length) * 100
      };
    } catch (error) {
      console.error('Error en análisis de fortalezas/debilidades:', error);
      return null;
    }
  }

  /**
   * Generar recomendaciones de nodos basadas en análisis PAES
   */
  static async generateNodeRecommendations(userId: string) {
    try {
      const analysis = await this.getStrengthsAndWeaknesses(userId);
      
      if (!analysis) {
        return [];
      }

      const recommendations = [];

      // Recomendar nodos para debilidades
      for (const weakness of analysis.weaknesses) {
        const { data: nodes, error } = await supabase
          .from('learning_nodes')
          .select('*')
          .eq('skill_id', this.mapSkillToId(weakness as TPAESHabilidad))
          .limit(3);

        if (!error && nodes) {
          recommendations.push(...nodes.map(node => ({
            ...node,
            reason: `Reforzar habilidad débil: ${weakness}`,
            priority: 'HIGH' as const,
            estimatedImprovement: 15
          })));
        }
      }

      return recommendations.slice(0, 5); // Limitar a 5 recomendaciones
    } catch (error) {
      console.error('Error generando recomendaciones:', error);
      return [];
    }
  }

  /**
   * Mapear habilidad a ID (temporal - debería venir de base de datos)
   */
  private static mapSkillToId(skill: TPAESHabilidad): number {
    const mapping: Record<TPAESHabilidad, number> = {
      'TRACK_LOCATE': 1,
      'INTERPRET_RELATE': 2,
      'EVALUATE_REFLECT': 3,
      'SOLVE_PROBLEMS': 4,
      'REPRESENT': 5,
      'MODEL': 6,
      'ARGUE_COMMUNICATE': 7,
      'IDENTIFY_THEORIES': 8,
      'PROCESS_ANALYZE': 9,
      'APPLY_PRINCIPLES': 10,
      'SCIENTIFIC_ARGUMENT': 11,
      'TEMPORAL_THINKING': 12,
      'SOURCE_ANALYSIS': 13,
      'MULTICAUSAL_ANALYSIS': 14,
      'CRITICAL_THINKING': 15,
      'REFLECTION': 16
    };
    
    return mapping[skill] || 2;
  }
}
