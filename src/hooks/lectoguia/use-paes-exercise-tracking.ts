
import { useState, useCallback } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { TPAESHabilidad } from '@/types/system-types';

/**
 * Hook para tracking de ejercicios PAES
 */
export function usePAESExerciseTracking() {
  const { user } = useAuth();
  const [submitting, setSubmitting] = useState(false);

  /**
   * Registrar intento de ejercicio PAES
   */
  const trackPAESExercise = useCallback(async (
    questionId: number,
    isCorrect: boolean,
    skill: TPAESHabilidad,
    phase?: string
  ) => {
    if (!user?.id) {
      console.warn('Usuario no autenticado para tracking PAES');
      return false;
    }

    setSubmitting(true);
    try {
      // Usar user_exercise_attempts en lugar de user_paes_progress
      const { error } = await supabase
        .from('user_exercise_attempts')
        .insert({
          user_id: user.id,
          exercise_id: `paes-q-${questionId}`,
          answer: isCorrect ? 'correct' : 'incorrect',
          is_correct: isCorrect,
          skill_demonstrated: skill,
          created_at: new Date().toISOString()
        });

      if (error) {
        console.error('Error guardando progreso PAES:', error);
        return false;
      }

      console.log(`✅ Progreso PAES guardado: Q${questionId} - ${isCorrect ? 'Correcto' : 'Incorrecto'} - ${skill}`);
      return true;
    } catch (error) {
      console.error('Error en trackPAESExercise:', error);
      return false;
    } finally {
      setSubmitting(false);
    }
  }, [user?.id]);

  /**
   * Obtener estadísticas recientes del usuario
   */
  const getRecentStats = useCallback(async (limit: number = 10) => {
    if (!user?.id) return null;

    try {
      const { data, error } = await supabase
        .from('user_exercise_attempts')
        .select('*')
        .eq('user_id', user.id)
        .eq('skill_demonstrated', 'TRACK_LOCATE') // Filter by a PAES skill
        .order('created_at', { ascending: false })
        .limit(limit);

      if (error) {
        console.error('Error obteniendo estadísticas recientes:', error);
        return null;
      }

      const totalQuestions = data?.length || 0;
      const correctAnswers = data?.filter(q => q.is_correct).length || 0;
      const accuracy = totalQuestions > 0 ? (correctAnswers / totalQuestions) * 100 : 0;

      return {
        totalQuestions,
        correctAnswers,
        accuracy,
        questions: data || []
      };
    } catch (error) {
      console.error('Error en getRecentStats:', error);
      return null;
    }
  }, [user?.id]);

  /**
   * Obtener progreso por habilidad
   */
  const getProgressBySkill = useCallback(async () => {
    if (!user?.id) return null;

    try {
      const { data, error } = await supabase
        .from('user_exercise_attempts')
        .select('*')
        .eq('user_id', user.id);

      if (error) {
        console.error('Error obteniendo progreso por habilidad:', error);
        return null;
      }

      // Agrupar por habilidad
      const skillProgress = (data || []).reduce((acc, record) => {
        const skill = record.skill_demonstrated;
        if (!skill) return acc;
        
        if (!acc[skill]) {
          acc[skill] = { total: 0, correct: 0, accuracy: 0 };
        }
        acc[skill].total++;
        if (record.is_correct) acc[skill].correct++;
        return acc;
      }, {} as Record<string, { total: number; correct: number; accuracy: number }>);

      // Calcular accuracy
      Object.keys(skillProgress).forEach(skill => {
        const stats = skillProgress[skill];
        stats.accuracy = stats.total > 0 ? (stats.correct / stats.total) * 100 : 0;
      });

      return skillProgress;
    } catch (error) {
      console.error('Error en getProgressBySkill:', error);
      return null;
    }
  }, [user?.id]);

  return {
    trackPAESExercise,
    getRecentStats,
    getProgressBySkill,
    submitting
  };
}
