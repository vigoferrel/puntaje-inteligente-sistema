import { useState, useEffect, useCallback } from 'react';
import { supabase } from '@/lib/supabase';
import { useAuth } from '@/contexts/AuthContext';

export interface RealTimeMetrics {
  activeUsers: number;
  totalSessions: number;
  averageSessionTime: number;
  completionRate: number;
  engagementScore: number;
  lastUpdated: string;
}

export interface UserAnalytics {
  userId: string;
  totalStudyTime: number;
  exercisesCompleted: number;
  averageScore: number;
  streakDays: number;
  subjectProgress: Record<string, number>;
  weakAreas: string[];
  strongAreas: string[];
  improvementTrend: 'improving' | 'stable' | 'declining';
}

export interface PredictiveInsight {
  id: string;
  type: 'performance' | 'engagement' | 'completion' | 'difficulty';
  title: string;
  description: string;
  prediction: string;
  confidence: number;
  actionable: boolean;
  recommendations: string[];
  createdAt: string;
}

export interface EngagementData {
  timestamp: string;
  score: number;
  activity: string;
  duration: number;
  subject: string;
}

export const useRealTimeAnalytics = () => {
  const { user } = useAuth();
  const [metrics, setMetrics] = useState<RealTimeMetrics | null>(null);
  const [userAnalytics, setUserAnalytics] = useState<UserAnalytics | null>(null);
  const [predictions, setPredictions] = useState<PredictiveInsight[]>([]);
  const [engagementData, setEngagementData] = useState<EngagementData[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Obtener métricas en tiempo real
  const fetchRealTimeMetrics = useCallback(async () => {
    try {
      const { data, error } = await supabase.rpc('get_real_time_analytics');

      if (error) throw error;

      if (data && data.length > 0) {
        const metricsData = data[0];
        const transformedMetrics: RealTimeMetrics = {
          activeUsers: metricsData.active_users || 0,
          totalSessions: metricsData.total_sessions || 0,
          averageSessionTime: metricsData.average_session_time || 0,
          completionRate: metricsData.completion_rate || 0,
          engagementScore: metricsData.engagement_score || 0,
          lastUpdated: new Date().toISOString()
        };

        setMetrics(transformedMetrics);
      }
    } catch (err) {
      console.error('Error fetching real-time metrics:', err);
      // Usar métricas por defecto si hay error
      setMetrics({
        activeUsers: 0,
        totalSessions: 0,
        averageSessionTime: 0,
        completionRate: 0,
        engagementScore: 0,
        lastUpdated: new Date().toISOString()
      });
    }
  }, []);

  // Obtener métricas mejoradas
  const fetchEnhancedMetrics = useCallback(async () => {
    try {
      const { data, error } = await supabase.rpc('get_enhanced_real_time_metrics');

      if (error) throw error;

      if (data && data.length > 0) {
        const enhancedData = data[0];
        setMetrics(prev => ({
          ...prev!,
          activeUsers: enhancedData.current_active_users || prev?.activeUsers || 0,
          totalSessions: enhancedData.daily_sessions || prev?.totalSessions || 0,
          averageSessionTime: enhancedData.avg_session_duration || prev?.averageSessionTime || 0,
          completionRate: enhancedData.completion_rate || prev?.completionRate || 0,
          engagementScore: enhancedData.engagement_score || prev?.engagementScore || 0,
          lastUpdated: new Date().toISOString()
        }));
      }
    } catch (err) {
      console.error('Error fetching enhanced metrics:', err);
    }
  }, []);

  // Obtener analytics del usuario
  const fetchUserAnalytics = useCallback(async () => {
    if (!user?.id) return;

    try {
      const { data, error } = await supabase.rpc('get_analytics_data', {
        user_id_param: user.id
      });

      if (error) throw error;

      if (data && data.length > 0) {
        const analyticsData = data[0];
        const transformedAnalytics: UserAnalytics = {
          userId: user.id,
          totalStudyTime: analyticsData.total_study_time || 0,
          exercisesCompleted: analyticsData.exercises_completed || 0,
          averageScore: analyticsData.average_score || 0,
          streakDays: analyticsData.streak_days || 0,
          subjectProgress: analyticsData.subject_progress || {},
          weakAreas: analyticsData.weak_areas || [],
          strongAreas: analyticsData.strong_areas || [],
          improvementTrend: analyticsData.improvement_trend || 'stable'
        };

        setUserAnalytics(transformedAnalytics);
      }
    } catch (err) {
      console.error('Error fetching user analytics:', err);
      setError('Error al cargar analytics del usuario');
    }
  }, [user?.id]);

  // Calcular trayectoria de mejora
  const calculateImprovementTrajectory = useCallback(async () => {
    if (!user?.id) return;

    try {
      const { data, error } = await supabase.rpc('calculate_improvement_trajectory', {
        user_id_param: user.id
      });

      if (error) throw error;

      if (data && data.length > 0) {
        const trajectory = data[0];
        
        // Crear insight predictivo basado en la trayectoria
        const trajectoryInsight: PredictiveInsight = {
          id: `trajectory_${Date.now()}`,
          type: 'performance',
          title: 'Trayectoria de Mejora',
          description: trajectory.description || 'Análisis de tu progreso',
          prediction: trajectory.prediction || 'Continúa con el ritmo actual',
          confidence: trajectory.confidence || 75,
          actionable: true,
          recommendations: trajectory.recommendations || [],
          createdAt: new Date().toISOString()
        };

        setPredictions(prev => [trajectoryInsight, ...prev.filter(p => p.type !== 'performance')]);
      }
    } catch (err) {
      console.error('Error calculating improvement trajectory:', err);
    }
  }, [user?.id]);

  // Calcular puntuación de engagement
  const calculateEngagementScore = useCallback(async () => {
    if (!user?.id) return;

    try {
      const { data, error } = await supabase.rpc('calculate_engagement_score', {
        user_id_param: user.id
      });

      if (error) throw error;

      if (data && data.length > 0) {
        const engagementInfo = data[0];
        
        // Actualizar métricas con nuevo engagement score
        setMetrics(prev => prev ? {
          ...prev,
          engagementScore: engagementInfo.engagement_score || prev.engagementScore,
          lastUpdated: new Date().toISOString()
        } : null);

        // Crear insight de engagement
        const engagementInsight: PredictiveInsight = {
          id: `engagement_${Date.now()}`,
          type: 'engagement',
          title: 'Análisis de Engagement',
          description: `Tu nivel de engagement es ${engagementInfo.engagement_level || 'moderado'}`,
          prediction: engagementInfo.prediction || 'Mantén la consistencia en el estudio',
          confidence: engagementInfo.confidence || 80,
          actionable: true,
          recommendations: engagementInfo.recommendations || [],
          createdAt: new Date().toISOString()
        };

        setPredictions(prev => [engagementInsight, ...prev.filter(p => p.type !== 'engagement')]);
      }
    } catch (err) {
      console.error('Error calculating engagement score:', err);
    }
  }, [user?.id]);

  // Generar reporte de insights
  const generateInsightsReport = useCallback(async () => {
    if (!user?.id) return;

    try {
      const { data, error } = await supabase.rpc('generate_insights_report', {
        user_id_param: user.id
      });

      if (error) throw error;

      if (data && data.length > 0) {
        const insights: PredictiveInsight[] = data.map((insight: any, index: number) => ({
          id: `insight_${index}_${Date.now()}`,
          type: insight.type || 'performance',
          title: insight.title || 'Insight',
          description: insight.description || '',
          prediction: insight.prediction || '',
          confidence: insight.confidence || 70,
          actionable: insight.actionable || true,
          recommendations: insight.recommendations || [],
          createdAt: new Date().toISOString()
        }));

        setPredictions(insights);
      }
    } catch (err) {
      console.error('Error generating insights report:', err);
    }
  }, [user?.id]);

  // Obtener datos de engagement históricos
  const fetchEngagementHistory = useCallback(async () => {
    if (!user?.id) return;

    try {
      const { data, error } = await supabase
        .from('real_time_analytics_metrics')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false })
        .limit(50);

      if (error) throw error;

      const engagementHistory: EngagementData[] = (data || []).map((item: any) => ({
        timestamp: item.created_at,
        score: item.engagement_score || 0,
        activity: item.activity_type || 'study',
        duration: item.session_duration || 0,
        subject: item.subject || 'general'
      }));

      setEngagementData(engagementHistory);
    } catch (err) {
      console.error('Error fetching engagement history:', err);
    }
  }, [user?.id]);

  // Registrar actividad en tiempo real
  const trackActivity = useCallback(async (
    activity: string,
    subject: string,
    duration: number
  ) => {
    if (!user?.id) return;

    try {
      const { error } = await supabase
        .from('real_time_analytics_metrics')
        .insert({
          user_id: user.id,
          activity_type: activity,
          subject: subject,
          session_duration: duration,
          engagement_score: Math.floor(Math.random() * 100), // Calcular score real
          created_at: new Date().toISOString()
        });

      if (error) throw error;

      // Actualizar datos locales
      const newEngagementData: EngagementData = {
        timestamp: new Date().toISOString(),
        score: Math.floor(Math.random() * 100),
        activity,
        duration,
        subject
      };

      setEngagementData(prev => [newEngagementData, ...prev.slice(0, 49)]);
    } catch (err) {
      console.error('Error tracking activity:', err);
    }
  }, [user?.id]);

  // Refrescar todos los datos de analytics
  const refreshAnalytics = useCallback(async () => {
    setIsLoading(true);
    setError(null);

    try {
      await Promise.all([
        fetchRealTimeMetrics(),
        fetchEnhancedMetrics(),
        fetchUserAnalytics(),
        calculateImprovementTrajectory(),
        calculateEngagementScore(),
        generateInsightsReport(),
        fetchEngagementHistory()
      ]);
    } catch (err) {
      console.error('Error refreshing analytics:', err);
      setError('Error al actualizar analytics');
    } finally {
      setIsLoading(false);
    }
  }, [
    fetchRealTimeMetrics,
    fetchEnhancedMetrics,
    fetchUserAnalytics,
    calculateImprovementTrajectory,
    calculateEngagementScore,
    generateInsightsReport,
    fetchEngagementHistory
  ]);

  // Obtener insights por tipo
  const getInsightsByType = useCallback((type: PredictiveInsight['type']) => {
    return predictions.filter(insight => insight.type === type);
  }, [predictions]);

  // Obtener insights accionables
  const getActionableInsights = useCallback(() => {
    return predictions.filter(insight => insight.actionable);
  }, [predictions]);

  // Efecto inicial para cargar datos
  useEffect(() => {
    if (user?.id) {
      refreshAnalytics();
    }
  }, [user?.id, refreshAnalytics]);

  // Actualización automática cada 30 segundos
  useEffect(() => {
    const interval = setInterval(() => {
      if (user?.id) {
        fetchRealTimeMetrics();
        fetchEnhancedMetrics();
      }
    }, 30000);

    return () => clearInterval(interval);
  }, [user?.id, fetchRealTimeMetrics, fetchEnhancedMetrics]);

  return {
    // Datos
    metrics,
    userAnalytics,
    predictions,
    engagementData,
    isLoading,
    error,
    
    // Funciones principales
    refreshAnalytics,
    trackActivity,
    calculateImprovementTrajectory,
    calculateEngagementScore,
    generateInsightsReport,
    
    // Utilidades
    getInsightsByType,
    getActionableInsights
  };
};