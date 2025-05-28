
import { useState, useCallback } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/integrations/supabase/client';

interface TrainingStats {
  totalSessions: number;
  averageAccuracy: number;
  recentTrend: 'improving' | 'stable' | 'declining';
  bestStreak: number;
  currentStreak: number;
  weeklyGoalProgress: number;
}

export const useTrainingEnhanced = () => {
  const { user } = useAuth();
  const [trainingStats, setTrainingStats] = useState<TrainingStats>({
    totalSessions: 0,
    averageAccuracy: 0,
    recentTrend: 'stable',
    bestStreak: 0,
    currentStreak: 0,
    weeklyGoalProgress: 0
  });
  const [isLoading, setIsLoading] = useState(false);

  const loadTrainingStats = useCallback(async () => {
    if (!user?.id) return;

    setIsLoading(true);
    try {
      console.log('📊 Cargando estadísticas reales de entrenamiento');

      // Obtener intentos de ejercicios usando solo columnas existentes
      const { data: attemptsData, error } = await supabase
        .from('user_exercise_attempts')
        .select('is_correct, created_at, answer') // Usar solo columnas que existen
        .eq('user_id', user.id)
        .order('created_at', { ascending: false })
        .limit(100);

      if (error) throw error;

      const attempts = attemptsData || [];
      
      // Calcular estadísticas reales
      const totalSessions = attempts.length;
      const correctAttempts = attempts.filter(a => a.is_correct).length;
      const averageAccuracy = totalSessions > 0 ? (correctAttempts / totalSessions) * 100 : 0;

      // Calcular tendencia reciente comparando últimos 10 vs 10 anteriores
      const recent10 = attempts.slice(0, 10);
      const previous10 = attempts.slice(10, 20);
      
      const recentAccuracy = recent10.length > 0 ? 
        (recent10.filter(a => a.is_correct).length / recent10.length) * 100 : 0;
      const previousAccuracy = previous10.length > 0 ? 
        (previous10.filter(a => a.is_correct).length / previous10.length) * 100 : 0;

      let recentTrend: 'improving' | 'stable' | 'declining' = 'stable';
      if (recentAccuracy > previousAccuracy + 10) recentTrend = 'improving';
      else if (recentAccuracy < previousAccuracy - 10) recentTrend = 'declining';

      // Calcular rachas basadas en días únicos con actividad
      const dailyActivity = [...new Set(attempts.map(a => 
        new Date(a.created_at).toDateString()
      ))].sort();

      let currentStreak = 0;
      let bestStreak = 0;
      let tempStreak = 0;

      const today = new Date().toDateString();
      const yesterday = new Date(Date.now() - 24 * 60 * 60 * 1000).toDateString();

      // Verificar si hay actividad hoy o ayer para iniciar racha
      if (dailyActivity.includes(today) || dailyActivity.includes(yesterday)) {
        currentStreak = 1;
        
        // Calcular racha actual hacia atrás
        for (let i = dailyActivity.length - 2; i >= 0; i--) {
          const currentDate = new Date(dailyActivity[i + 1]);
          const prevDate = new Date(dailyActivity[i]);
          const diffDays = Math.floor((currentDate.getTime() - prevDate.getTime()) / (24 * 60 * 60 * 1000));
          
          if (diffDays === 1) {
            currentStreak++;
          } else {
            break;
          }
        }
      }

      // Calcular mejor racha histórica
      tempStreak = 1;
      for (let i = 1; i < dailyActivity.length; i++) {
        const currentDate = new Date(dailyActivity[i]);
        const prevDate = new Date(dailyActivity[i - 1]);
        const diffDays = Math.floor((currentDate.getTime() - prevDate.getTime()) / (24 * 60 * 60 * 1000));
        
        if (diffDays === 1) {
          tempStreak++;
          bestStreak = Math.max(bestStreak, tempStreak);
        } else {
          tempStreak = 1;
        }
      }

      // Progreso semanal (ejercicios esta semana vs meta de 20)
      const weekStart = new Date();
      weekStart.setDate(weekStart.getDate() - weekStart.getDay());
      weekStart.setHours(0, 0, 0, 0);
      
      const weeklyAttempts = attempts.filter(a => 
        new Date(a.created_at) >= weekStart
      ).length;
      
      const weeklyGoalProgress = Math.min((weeklyAttempts / 20) * 100, 100);

      const stats = {
        totalSessions,
        averageAccuracy: Math.round(averageAccuracy),
        recentTrend,
        bestStreak: Math.max(bestStreak, currentStreak),
        currentStreak,
        weeklyGoalProgress: Math.round(weeklyGoalProgress)
      };

      setTrainingStats(stats);
      console.log('✅ Estadísticas reales de entrenamiento cargadas:', stats);

    } catch (error) {
      console.error('❌ Error cargando estadísticas de entrenamiento:', error);
    } finally {
      setIsLoading(false);
    }
  }, [user?.id]);

  return {
    trainingStats,
    isLoading,
    loadTrainingStats
  };
};
