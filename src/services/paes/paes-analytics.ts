
import { supabase } from '@/integrations/supabase/client';
import { TPAESHabilidad } from '@/types/system-types';

/**
 * Servicio para análisis avanzado de rendimiento PAES
 */
export class PAESAnalyticsService {
  
  /**
   * Obtener análisis de fortalezas y debilidades por habilidad
   */
  static async getStrengthsAndWeaknesses(userId: string) {
    try {
      const { data: progressData, error } = await supabase
        .from('user_paes_progress')
        .select('*')
        .eq('user_id', userId);

      if (error) {
        console.error('Error obteniendo progreso PAES:', error);
        return null;
      }

      if (!progressData || progressData.length === 0) {
        return {
          strengths: [],
          weaknesses: [],
          overallAccuracy: 0,
          skillAccuracy: {}
        };
      }

      // Agrupar por habilidad y calcular accuracy
      const skillStats: Record<string, { correct: number; total: number; accuracy: number }> = {};
      
      progressData.forEach(record => {
        const skill = record.skill as TPAESHabilidad;
        if (!skillStats[skill]) {
          skillStats[skill] = { correct: 0, total: 0, accuracy: 0 };
        }
        skillStats[skill].total++;
        if (record.is_correct) {
          skillStats[skill].correct++;
        }
      });

      // Calcular accuracy por habilidad
      Object.keys(skillStats).forEach(skill => {
        const stats = skillStats[skill];
        stats.accuracy = stats.total > 0 ? (stats.correct / stats.total) * 100 : 0;
      });

      // Identificar fortalezas (>70%) y debilidades (<50%)
      const strengths = Object.entries(skillStats)
        .filter(([_, stats]) => stats.accuracy >= 70)
        .map(([skill]) => skill);
      
      const weaknesses = Object.entries(skillStats)
        .filter(([_, stats]) => stats.accuracy < 50)
        .map(([skill]) => skill);

      // Calcular accuracy general
      const totalCorrect = progressData.filter(p => p.is_correct).length;
      const overallAccuracy = (totalCorrect / progressData.length) * 100;

      return {
        strengths,
        weaknesses,
        overallAccuracy,
        skillAccuracy: Object.fromEntries(
          Object.entries(skillStats).map(([skill, stats]) => [skill, stats.accuracy])
        )
      };
    } catch (error) {
      console.error('Error en análisis de fortalezas y debilidades:', error);
      return null;
    }
  }

  /**
   * Calcular puntaje predicho basado en rendimiento
   */
  static async calculatePredictedScore(userId: string) {
    try {
      const { data: progressData, error } = await supabase
        .from('user_paes_progress')
        .select('*')
        .eq('user_id', userId)
        .order('completed_at', { ascending: false })
        .limit(50); // Últimas 50 preguntas para predicción

      if (error) {
        console.error('Error obteniendo datos para predicción:', error);
        return null;
      }

      if (!progressData || progressData.length === 0) {
        return { overall: null, bySkill: {} };
      }

      // Calcular accuracy general reciente
      const recentCorrect = progressData.filter(p => p.is_correct).length;
      const recentAccuracy = (recentCorrect / progressData.length) * 100;

      // Estimar puntaje PAES (escala 150-850)
      const baseScore = 150;
      const maxScore = 850;
      const scoreRange = maxScore - baseScore;
      
      // Función de predicción basada en accuracy
      const predictedScore = Math.round(baseScore + (scoreRange * (recentAccuracy / 100)));

      // Calcular por habilidad
      const skillPredictions: Record<string, number> = {};
      const skillGroups = progressData.reduce((acc, record) => {
        const skill = record.skill;
        if (!acc[skill]) acc[skill] = [];
        acc[skill].push(record);
        return acc;
      }, {} as Record<string, any[]>);

      Object.entries(skillGroups).forEach(([skill, records]) => {
        const skillCorrect = records.filter(r => r.is_correct).length;
        const skillAccuracy = (skillCorrect / records.length) * 100;
        skillPredictions[skill] = Math.round(baseScore + (scoreRange * (skillAccuracy / 100)));
      });

      return {
        overall: predictedScore,
        bySkill: skillPredictions,
        basedOnQuestions: progressData.length,
        accuracy: recentAccuracy
      };
    } catch (error) {
      console.error('Error calculando puntaje predicho:', error);
      return null;
    }
  }

  /**
   * Generar recomendaciones de nodos basadas en análisis
   */
  static async generateNodeRecommendations(userId: string) {
    try {
      const analysis = await this.getStrengthsAndWeaknesses(userId);
      if (!analysis) return [];

      // Obtener nodos relacionados con las debilidades identificadas
      const { data: nodes, error } = await supabase
        .from('learning_nodes')
        .select('*')
        .in('skill_id', [1, 2, 3, 4, 5]) // IDs de habilidades principales
        .order('position');

      if (error) {
        console.error('Error obteniendo nodos:', error);
        return [];
      }

      // Filtrar y priorizar nodos basados en debilidades
      const recommendations = nodes?.filter(node => {
        // Lógica para determinar relevancia del nodo
        return analysis.weaknesses.length === 0 || 
               analysis.overallAccuracy < 60; // Recomendar todos si hay debilidades generales
      }).slice(0, 5) || [];

      return recommendations.map(node => ({
        ...node,
        recommendationReason: analysis.weaknesses.length > 0 
          ? 'Refuerzo en área de oportunidad identificada'
          : 'Consolidación de conocimientos'
      }));
    } catch (error) {
      console.error('Error generando recomendaciones:', error);
      return [];
    }
  }

  /**
   * Obtener estadísticas detalladas de progreso
   */
  static async getDetailedStats(userId: string) {
    try {
      const { data: progressData, error } = await supabase
        .from('user_paes_progress')
        .select('*')
        .eq('user_id', userId)
        .order('completed_at', { ascending: false });

      if (error) {
        console.error('Error obteniendo estadísticas detalladas:', error);
        return null;
      }

      if (!progressData || progressData.length === 0) {
        return {
          totalQuestions: 0,
          correctAnswers: 0,
          accuracy: 0,
          byPhase: {},
          bySkill: {},
          recentTrend: []
        };
      }

      // Estadísticas generales
      const totalQuestions = progressData.length;
      const correctAnswers = progressData.filter(p => p.is_correct).length;
      const accuracy = (correctAnswers / totalQuestions) * 100;

      // Por fase
      const byPhase = progressData.reduce((acc, record) => {
        const phase = record.phase || 'general';
        if (!acc[phase]) {
          acc[phase] = { total: 0, correct: 0, accuracy: 0 };
        }
        acc[phase].total++;
        if (record.is_correct) acc[phase].correct++;
        acc[phase].accuracy = (acc[phase].correct / acc[phase].total) * 100;
        return acc;
      }, {} as Record<string, any>);

      // Por habilidad
      const bySkill = progressData.reduce((acc, record) => {
        const skill = record.skill;
        if (!acc[skill]) {
          acc[skill] = { total: 0, correct: 0, accuracy: 0 };
        }
        acc[skill].total++;
        if (record.is_correct) acc[skill].correct++;
        acc[skill].accuracy = (acc[skill].correct / acc[skill].total) * 100;
        return acc;
      }, {} as Record<string, any>);

      // Tendencia reciente (últimas 10 preguntas)
      const recentTrend = progressData
        .slice(0, 10)
        .reverse()
        .map((record, index) => ({
          questionNumber: index + 1,
          isCorrect: record.is_correct,
          skill: record.skill,
          completedAt: record.completed_at
        }));

      return {
        totalQuestions,
        correctAnswers,
        accuracy,
        byPhase,
        bySkill,
        recentTrend
      };
    } catch (error) {
      console.error('Error obteniendo estadísticas detalladas:', error);
      return null;
    }
  }
}
