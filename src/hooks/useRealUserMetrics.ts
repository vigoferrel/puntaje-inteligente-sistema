
import { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/integrations/supabase/client';

interface RealUserMetrics {
  totalStudyTime: number;
  exercisesCompleted: number;
  averageScore: number;
  currentStreak: number;
  level: number;
  recentActivity: Array<{
    type: string;
    score: number;
    timestamp: string;
  }>;
}

export const useRealUserMetrics = () => {
  const { user } = useAuth();
  const [metrics, setMetrics] = useState<RealUserMetrics>({
    totalStudyTime: 0,
    exercisesCompleted: 0,
    averageScore: 0,
    currentStreak: 0,
    level: 1,
    recentActivity: []
  });
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const loadRealMetrics = async () => {
      if (!user?.id) return;

      try {
        setIsLoading(true);
        setError(null);

        // Obtener progreso de nodos del usuario
        const { data: nodeProgress } = await supabase
          .from('user_node_progress')
          .select('*')
          .eq('user_id', user.id);

        // Obtener análisis de evaluaciones
        const { data: analysisData } = await supabase
          .from('analisis_evaluacion')
          .select('*')
          .eq('user_id', user.id)
          .order('created_at', { ascending: false })
          .limit(10);

        // Obtener métricas neurales
        const { data: neuralMetrics } = await supabase
          .from('neural_metrics')
          .select('*')
          .eq('user_id', user.id);

        // Calcular métricas reales
        const totalProgress = nodeProgress?.length || 0;
        const completedNodes = nodeProgress?.filter(p => p.status === 'completed').length || 0;
        const avgScore = analysisData?.length 
          ? analysisData.reduce((acc, analysis) => acc + (analysis.nivel_habilidad_estimado || 0), 0) / analysisData.length
          : 0;

        // Calcular tiempo total de estudio
        const totalTime = nodeProgress?.reduce((acc, p) => acc + (p.time_spent_minutes || 0), 0) || 0;

        // Calcular racha actual basada en actividad reciente
        const recentActivity = analysisData?.slice(0, 5).map(analysis => ({
          type: 'diagnostic',
          score: Math.round((analysis.nivel_habilidad_estimado || 0) * 100),
          timestamp: analysis.created_at
        })) || [];

        setMetrics({
          totalStudyTime: totalTime,
          exercisesCompleted: totalProgress,
          averageScore: Math.round(avgScore * 100),
          currentStreak: completedNodes,
          level: Math.floor(completedNodes / 5) + 1,
          recentActivity
        });

      } catch (error) {
        console.error('Error loading real user metrics:', error);
        setError('Error al cargar métricas del usuario');
      } finally {
        setIsLoading(false);
      }
    };

    loadRealMetrics();
    
    // Actualizar cada 30 segundos
    const interval = setInterval(loadRealMetrics, 30000);
    return () => clearInterval(interval);
  }, [user?.id]);

  return { metrics, isLoading, error };
};
