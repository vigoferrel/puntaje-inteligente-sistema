import { useState, useEffect, useCallback } from 'react';
import { supabase } from '@/lib/supabase';
import { useAuth } from '@/contexts/AuthContext';

export interface AIRecommendation {
  id: string;
  type: 'exercise' | 'study_plan' | 'activity' | 'content';
  title: string;
  description: string;
  difficulty: 'facil' | 'medio' | 'dificil';
  subject: string;
  estimatedTime: number; // en minutos
  priority: 'low' | 'medium' | 'high';
  confidence: number; // 0-100
  reason: string;
  createdAt: string;
  metadata?: Record<string, any>;
}

export interface StudyRecommendation {
  exerciseId: string;
  title: string;
  subject: string;
  difficulty: string;
  estimatedTime: number;
  reason: string;
  confidence: number;
}

export interface BloomRecommendation {
  level: string;
  activity: string;
  description: string;
  subject: string;
  difficulty: string;
}

export const useRealAIRecommendations = () => {
  const { user } = useAuth();
  const [recommendations, setRecommendations] = useState<AIRecommendation[]>([]);
  const [studyRecommendations, setStudyRecommendations] = useState<StudyRecommendation[]>([]);
  const [bloomRecommendations, setBloomRecommendations] = useState<BloomRecommendation[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Obtener recomendaciones principales de IA
  const fetchAIRecommendations = useCallback(async () => {
    if (!user?.id) return;

    try {
      const { data, error } = await supabase
        .from('ai_recommendations')
        .select('*')
        .eq('user_id', user.id)
        .eq('status', 'active')
        .order('created_at', { ascending: false })
        .limit(20);

      if (error) throw error;

      const transformedRecommendations: AIRecommendation[] = (data || []).map((item: any) => ({
        id: item.id,
        type: item.recommendation_type || 'exercise',
        title: item.title || 'Recomendación',
        description: item.description || '',
        difficulty: item.difficulty || 'medio',
        subject: item.subject || 'general',
        estimatedTime: item.estimated_time || 30,
        priority: item.priority || 'medium',
        confidence: item.confidence || 75,
        reason: item.reason || 'Basado en tu progreso',
        createdAt: item.created_at,
        metadata: item.metadata
      }));

      setRecommendations(transformedRecommendations);
    } catch (err) {
      console.error('Error fetching AI recommendations:', err);
      setError('Error al cargar recomendaciones de IA');
    }
  }, [user?.id]);

  // Obtener recomendaciones de estudio
  const fetchStudyRecommendations = useCallback(async () => {
    if (!user?.id) return;

    try {
      const { data, error } = await supabase.rpc('generate_study_recommendations', {
        user_id_param: user.id,
        limit_param: 10
      });

      if (error) throw error;

      const transformedStudyRecs: StudyRecommendation[] = (data || []).map((item: any) => ({
        exerciseId: item.exercise_id || item.id,
        title: item.title || item.exercise_title,
        subject: item.subject || 'General',
        difficulty: item.difficulty || 'medio',
        estimatedTime: item.estimated_time || 30,
        reason: item.reason || 'Recomendado para tu nivel',
        confidence: item.confidence || 80
      }));

      setStudyRecommendations(transformedStudyRecs);
    } catch (err) {
      console.error('Error fetching study recommendations:', err);
      // No establecer error aquí para no afectar otras recomendaciones
    }
  }, [user?.id]);

  // Obtener recomendaciones de Bloom
  const fetchBloomRecommendations = useCallback(async () => {
    if (!user?.id) return;

    try {
      const { data, error } = await supabase.rpc('get_bloom_recommendations', {
        user_id_param: user.id
      });

      if (error) throw error;

      const transformedBloomRecs: BloomRecommendation[] = (data || []).map((item: any) => ({
        level: item.bloom_level || 'Recordar',
        activity: item.activity_name || item.activity,
        description: item.description || '',
        subject: item.subject || 'General',
        difficulty: item.difficulty || 'medio'
      }));

      setBloomRecommendations(transformedBloomRecs);
    } catch (err) {
      console.error('Error fetching Bloom recommendations:', err);
      // No establecer error aquí para no afectar otras recomendaciones
    }
  }, [user?.id]);

  // Obtener ejercicios recomendados
  const fetchRecommendedExercises = useCallback(async () => {
    if (!user?.id) return;

    try {
      const { data, error } = await supabase.rpc('get_recommended_exercises', {
        user_id_param: user.id,
        limit_param: 15
      });

      if (error) throw error;

      // Convertir ejercicios a recomendaciones de IA
      const exerciseRecommendations: AIRecommendation[] = (data || []).map((item: any, index: number) => ({
        id: `exercise_${item.id || index}`,
        type: 'exercise' as const,
        title: item.title || `Ejercicio ${index + 1}`,
        description: item.description || 'Ejercicio recomendado para tu nivel',
        difficulty: item.difficulty || 'medio',
        subject: item.subject || 'General',
        estimatedTime: item.estimated_time || 20,
        priority: item.priority || 'medium',
        confidence: item.confidence || 85,
        reason: item.reason || 'Basado en tu rendimiento',
        createdAt: new Date().toISOString(),
        metadata: {
          exerciseId: item.id,
          type: 'recommended_exercise'
        }
      }));

      // Combinar con recomendaciones existentes
      setRecommendations(prev => [
        ...exerciseRecommendations,
        ...prev.filter(rec => rec.metadata?.type !== 'recommended_exercise')
      ]);
    } catch (err) {
      console.error('Error fetching recommended exercises:', err);
    }
  }, [user?.id]);

  // Generar actividad de IA personalizada
  const generateAIActivity = useCallback(async (subject: string, difficulty: string) => {
    if (!user?.id) return null;

    try {
      const { data, error } = await supabase.rpc('generate_ai_activity', {
        user_id_param: user.id,
        subject_param: subject,
        difficulty_param: difficulty
      });

      if (error) throw error;

      if (data && data.length > 0) {
        const activity = data[0];
        const newRecommendation: AIRecommendation = {
          id: `ai_activity_${Date.now()}`,
          type: 'activity',
          title: activity.title || 'Actividad Generada por IA',
          description: activity.description || '',
          difficulty: difficulty as any,
          subject: subject,
          estimatedTime: activity.estimated_time || 45,
          priority: 'high',
          confidence: activity.confidence || 90,
          reason: 'Actividad generada específicamente para ti',
          createdAt: new Date().toISOString(),
          metadata: {
            generated: true,
            activityData: activity
          }
        };

        setRecommendations(prev => [newRecommendation, ...prev]);
        return newRecommendation;
      }
    } catch (err) {
      console.error('Error generating AI activity:', err);
      setError('Error al generar actividad de IA');
    }

    return null;
  }, [user?.id]);

  // Marcar recomendación como completada
  const markRecommendationCompleted = useCallback(async (recommendationId: string) => {
    try {
      const { error } = await supabase
        .from('ai_recommendations')
        .update({ status: 'completed', completed_at: new Date().toISOString() })
        .eq('id', recommendationId);

      if (error) throw error;

      // Actualizar estado local
      setRecommendations(prev => 
        prev.filter(rec => rec.id !== recommendationId)
      );
    } catch (err) {
      console.error('Error marking recommendation as completed:', err);
    }
  }, []);

  // Refrescar todas las recomendaciones
  const refreshRecommendations = useCallback(async () => {
    setIsLoading(true);
    setError(null);

    try {
      await Promise.all([
        fetchAIRecommendations(),
        fetchStudyRecommendations(),
        fetchBloomRecommendations(),
        fetchRecommendedExercises()
      ]);
    } catch (err) {
      console.error('Error refreshing recommendations:', err);
      setError('Error al actualizar recomendaciones');
    } finally {
      setIsLoading(false);
    }
  }, [
    fetchAIRecommendations,
    fetchStudyRecommendations,
    fetchBloomRecommendations,
    fetchRecommendedExercises
  ]);

  // Obtener recomendaciones por tipo
  const getRecommendationsByType = useCallback((type: AIRecommendation['type']) => {
    return recommendations.filter(rec => rec.type === type);
  }, [recommendations]);

  // Obtener recomendaciones por prioridad
  const getRecommendationsByPriority = useCallback((priority: AIRecommendation['priority']) => {
    return recommendations.filter(rec => rec.priority === priority);
  }, [recommendations]);

  // Obtener actividades personalizadas
  const getPersonalizedActivities = useCallback(() => {
    return recommendations.filter(rec => 
      rec.type === 'activity' && rec.metadata?.generated === true
    );
  }, [recommendations]);

  // Efecto inicial para cargar datos
  useEffect(() => {
    if (user?.id) {
      refreshRecommendations();
    }
  }, [user?.id, refreshRecommendations]);

  return {
    // Datos
    recommendations,
    studyRecommendations,
    bloomRecommendations,
    isLoading,
    error,
    
    // Funciones principales
    generateAIActivity,
    markRecommendationCompleted,
    refreshRecommendations,
    
    // Utilidades
    getRecommendationsByType,
    getRecommendationsByPriority,
    getPersonalizedActivities
  };
};
