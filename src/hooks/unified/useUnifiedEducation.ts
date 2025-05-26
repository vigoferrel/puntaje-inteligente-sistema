
import { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';

interface UnifiedDashboardData {
  analytics: {
    totalStudents: number;
    activeStudents: number;
    averageEngagement: number;
    overallProgress: number;
  };
  calendar?: {
    nextCriticalDate: string;
    totalEvents: number;
  };
  scholarships?: {
    availableCount: number;
    totalAmount: number;
  };
}

interface PersonalizedAlert {
  id: string;
  title: string;
  description: string;
  priority: 'urgent' | 'normal' | 'low';
}

interface UseUnifiedEducationReturn {
  dashboard: UnifiedDashboardData | null;
  optimalPath: any | null;
  alerts: PersonalizedAlert[];
  isLoading: boolean;
  error: string | null;
  loadDashboard: () => Promise<void>;
  calculateOptimalPath: (preferences?: any) => Promise<void>;
  refreshAlerts: () => Promise<void>;
  exportReport: (format: 'pdf' | 'excel' | 'json') => Promise<Blob | null>;
  clearCache: () => void;
  stats: {
    lastUpdated: Date | null;
    totalRequests: number;
  };
}

export const useUnifiedEducation = (userId?: string): UseUnifiedEducationReturn => {
  const { user } = useAuth();
  const [optimalPath, setOptimalPath] = useState<any | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [stats, setStats] = useState({
    lastUpdated: null as Date | null,
    totalRequests: 0
  });

  // Cargar datos reales del dashboard
  const { data: dashboard, isLoading, refetch: refetchDashboard } = useQuery({
    queryKey: ['unified-dashboard', userId || user?.id],
    queryFn: async () => {
      const currentUserId = userId || user?.id;
      if (!currentUserId) return null;

      // Cargar datos reales de progreso
      const { data: progressData, error: progressError } = await supabase
        .from('user_node_progress')
        .select('*')
        .eq('user_id', currentUserId);

      if (progressError) throw progressError;

      // Cargar eventos del calendario
      const { data: calendarData } = await supabase
        .from('calendar_events')
        .select('*')
        .eq('user_id', currentUserId)
        .gte('start_date', new Date().toISOString())
        .order('start_date')
        .limit(5);

      // Cargar becas disponibles
      const { data: scholarshipsData } = await supabase
        .from('becas_financiamiento')
        .select('*')
        .eq('estado', 'activa')
        .limit(10);

      const completedNodes = progressData?.filter(p => p.status === 'completed').length || 0;
      const totalNodes = progressData?.length || 0;
      const averageEngagement = totalNodes > 0 
        ? progressData.reduce((sum, p) => sum + (p.success_rate || 0), 0) / totalNodes
        : 0;

      return {
        analytics: {
          totalStudents: 1, // Para usuario individual
          activeStudents: 1,
          averageEngagement: Math.round(averageEngagement * 100) / 100,
          overallProgress: totalNodes > 0 ? Math.round((completedNodes / totalNodes) * 100) : 0
        },
        calendar: {
          nextCriticalDate: calendarData?.[0]?.start_date || new Date().toISOString(),
          totalEvents: calendarData?.length || 0
        },
        scholarships: {
          availableCount: scholarshipsData?.length || 0,
          totalAmount: scholarshipsData?.reduce((sum, s) => sum + (s.monto_maximo || 0), 0) || 0
        }
      };
    },
    enabled: !!(userId || user?.id),
    staleTime: 5 * 60 * 1000 // 5 minutos
  });

  // Cargar alertas reales
  const { data: alerts = [] } = useQuery({
    queryKey: ['user-alerts', userId || user?.id],
    queryFn: async () => {
      const currentUserId = userId || user?.id;
      if (!currentUserId) return [];

      const { data, error } = await supabase
        .from('user_notifications')
        .select('*')
        .eq('user_id', currentUserId)
        .eq('is_read', false)
        .order('created_at', { ascending: false })
        .limit(10);

      if (error) return [];

      return data.map(notification => ({
        id: notification.id,
        title: notification.title,
        description: notification.message,
        priority: notification.priority as 'urgent' | 'normal' | 'low'
      }));
    },
    enabled: !!(userId || user?.id)
  });

  const loadDashboard = async () => {
    setStats(prev => ({
      lastUpdated: new Date(),
      totalRequests: prev.totalRequests + 1
    }));
    await refetchDashboard();
  };

  const calculateOptimalPath = async (preferences: any = {}) => {
    if (!user?.id) return;
    
    try {
      // Cargar plan de estudio generado
      const { data: studyPlan } = await supabase
        .from('generated_study_plans')
        .select('*')
        .eq('user_id', user.id)
        .eq('is_active', true)
        .order('created_at', { ascending: false })
        .limit(1)
        .single();

      if (studyPlan) {
        setOptimalPath({
          generated: true,
          preferences,
          plan: studyPlan,
          steps: ['Diagnóstico', 'Ejercicios', 'Evaluación', 'Mejora']
        });
      } else {
        // Crear un nuevo plan si no existe
        setOptimalPath({
          generated: true,
          preferences,
          steps: ['Diagnóstico Pendiente', 'Plan por Generar']
        });
      }
    } catch (err) {
      setError('Error calculando ruta óptima');
      setOptimalPath({ generated: false, error: true });
    }
  };

  const refreshAlerts = async () => {
    // Las alertas se actualizan automáticamente con React Query
    console.log('Alertas actualizadas automáticamente');
  };

  const exportReport = async (format: 'pdf' | 'excel' | 'json'): Promise<Blob | null> => {
    try {
      const data = JSON.stringify({ 
        dashboard, 
        alerts, 
        optimalPath,
        format, 
        exportedAt: new Date(),
        userId: user?.id 
      });
      return new Blob([data], { type: 'application/json' });
    } catch (err) {
      console.error('Error exportando reporte:', err);
      return null;
    }
  };

  const clearCache = () => {
    setOptimalPath(null);
    setError(null);
    console.log('Cache limpiado');
  };

  return {
    dashboard,
    optimalPath,
    alerts,
    isLoading,
    error,
    loadDashboard,
    calculateOptimalPath,
    refreshAlerts,
    exportReport,
    clearCache,
    stats
  };
};
