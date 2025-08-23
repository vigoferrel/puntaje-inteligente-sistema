import { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';
import { useAuth } from './use-auth';

export interface AIRecommendation {
  id: string;
  type: 'activity' | 'study_plan' | 'exercise' | 'topic';
  title: string;
  description: string;
  difficulty: 'basic' | 'intermediate' | 'advanced';
  bloomLevel: string;
  subject: string;
  estimatedTime: number;
  priority: 'high' | 'medium' | 'low';
  reasoning: string;
  aiConfidence: number;
}

export interface StudyRecommendations {
  personalizedActivities: AIRecommendation[];
  bloomProgression: AIRecommendation[];
  exerciseRecommendations: AIRecommendation[];
  improvementAreas: string[];
  studyPlan: {
    shortTerm: AIRecommendation[];
    longTerm: AIRecommendation[];
    estimatedCompletionDays: number;
  };
}

export const useAIRecommendations = () => {
  const { user } = useAuth();
  const [recommendations, setRecommendations] = useState<StudyRecommendations | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Obtener recomendaciones de Bloom personalizadas
  const getBloomRecommendations = async () => {
    if (!user?.id) return null;
    
    try {
      const { data, error } = await supabase.rpc('get_bloom_recommendations', {
        p_user_id: user.id
      });
      
      if (error) throw error;
      return data;
    } catch (err) {
      console.error('Error getting Bloom recommendations:', err);
      return null;
    }
  };

  // Obtener ejercicios recomendados
  const getRecommendedExercises = async (subjects?: string[], limit = 10) => {
    if (!user?.id) return null;

    try {
      const { data, error } = await supabase.rpc('get_recommended_exercises', {
        p_user_id: user.id,
        p_subject_areas: subjects || [],
        p_limit: limit
      });

      if (error) throw error;
      return data;
    } catch (err) {
      console.error('Error getting recommended exercises:', err);
      return null;
    }
  };

  // Generar plan de estudios con IA
  const generateStudyRecommendations = async (
    currentLevel: string,
    subject: string,
    strengths: string[] = [],
    weaknesses: string[] = []
  ) => {
    if (!user?.id) return null;

    try {
      const { data, error } = await supabase.rpc('generate_study_recommendations', {
        p_user_id: user.id,
        p_current_level: currentLevel,
        p_subject: subject,
        p_strengths: strengths,
        p_weaknesses: weaknesses
      });

      if (error) throw error;
      return data;
    } catch (err) {
      console.error('Error generating study recommendations:', err);
      return null;
    }
  };

  // Generar actividad con IA
  const generateAIActivity = async (
    bloomLevel: string,
    subject: string,
    topic: string,
    difficulty = 'medio'
  ) => {
    if (!user?.id) return null;

    try {
      const { data, error } = await supabase.rpc('generate_ai_activity', {
        p_user_id: user.id,
        p_level_id: bloomLevel,
        p_subject: subject,
        p_topic: topic,
        p_difficulty: difficulty
      });

      if (error) throw error;
      return data;
    } catch (err) {
      console.error('Error generating AI activity:', err);
      return null;
    }
  };

  // Calcular trayectoria de mejora
  const calculateImprovementTrajectory = async (targetScores: Record<string, number>) => {
    if (!user?.id) return null;

    try {
      const { data, error } = await supabase.rpc('calculate_improvement_trajectory', {
        p_user_id: user.id,
        p_target_scores: targetScores
      });

      if (error) throw error;
      return data;
    } catch (err) {
      console.error('Error calculating improvement trajectory:', err);
      return null;
    }
  };

  // Obtener todas las recomendaciones
  const fetchAllRecommendations = async () => {
    if (!user?.id) return;

    setIsLoading(true);
    setError(null);

    try {
      // Ejecutar todas las llamadas en paralelo
      const [
        bloomRecs,
        exerciseRecs,
        studyRecs,
        improvementTrajectory
      ] = await Promise.all([
        getBloomRecommendations(),
        getRecommendedExercises(['matematica', 'ciencias', 'competencia_lectora']),
        generateStudyRecommendations('L3', 'matematica', [], []),
        calculateImprovementTrajectory({ matematica: 800, ciencias: 750, lectura: 700 })
      ]);

      // Procesar y estructurar las recomendaciones
      const processedRecommendations: StudyRecommendations = {
        personalizedActivities: exerciseRecs?.exercises?.map((exercise: any) => ({
          id: exercise.id,
          type: 'exercise',
          title: exercise.title,
          description: exercise.description,
          difficulty: exercise.difficulty_level,
          bloomLevel: exercise.bloom_level,
          subject: exercise.subject,
          estimatedTime: exercise.estimated_duration || 15,
          priority: exercise.priority || 'medium',
          reasoning: exercise.ai_reasoning || 'Recomendado basado en tu progreso',
          aiConfidence: exercise.confidence_score || 0.8
        })) || [],

        bloomProgression: bloomRecs?.map((rec: any) => ({
          id: `bloom-${rec.bloom_level}`,
          type: 'study_plan',
          title: `Desarrollar ${rec.bloom_level}`,
          description: rec.recommended_focus,
          difficulty: rec.current_average > 0.7 ? 'advanced' : rec.current_average > 0.4 ? 'intermediate' : 'basic',
          bloomLevel: rec.bloom_level,
          subject: 'general',
          estimatedTime: 30,
          priority: rec.current_average < 0.5 ? 'high' : 'medium',
          reasoning: `Nivel actual: ${(rec.current_average * 100).toFixed(1)}%`,
          aiConfidence: 0.9
        })) || [],

        exerciseRecommendations: exerciseRecs?.recommendations || [],

        improvementAreas: studyRecs?.[0]?.priority_areas || [],

        studyPlan: {
          shortTerm: studyRecs?.[0]?.recommendations?.slice(0, 5)?.map((rec: any) => ({
            id: rec.id || Math.random().toString(36),
            type: 'activity',
            title: rec.title,
            description: rec.description,
            difficulty: rec.difficulty,
            bloomLevel: rec.bloom_level,
            subject: rec.subject,
            estimatedTime: rec.estimated_time || 20,
            priority: rec.priority,
            reasoning: rec.reasoning,
            aiConfidence: rec.confidence || 0.85
          })) || [],
          longTerm: studyRecs?.[0]?.study_plan?.activities?.slice(0, 10) || [],
          estimatedCompletionDays: studyRecs?.[0]?.estimated_completion_days || 30
        }
      };

      setRecommendations(processedRecommendations);
    } catch (err) {
      console.error('Error fetching recommendations:', err);
      setError('Error al obtener recomendaciones. Intenta nuevamente.');
    } finally {
      setIsLoading(false);
    }
  };

  // Refrescar recomendaciones
  const refreshRecommendations = () => {
    fetchAllRecommendations();
  };

  useEffect(() => {
    if (user?.id) {
      fetchAllRecommendations();
    }
  }, [user?.id]);

  return {
    recommendations,
    isLoading,
    error,
    refreshRecommendations,
    generateAIActivity,
    calculateImprovementTrajectory,
    getRecommendedExercises,
    generateStudyRecommendations
  };
};
