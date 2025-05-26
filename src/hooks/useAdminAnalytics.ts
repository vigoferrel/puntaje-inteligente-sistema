
import { useState, useEffect, useCallback } from 'react';
import { adminCostTrackingService, UsageMetrics } from '@/services/admin/admin-cost-tracking-service';
import { supabase } from '@/integrations/supabase/client';

export interface AdminAnalytics {
  dailyMetrics: UsageMetrics;
  weeklyMetrics: UsageMetrics;
  monthlyMetrics: UsageMetrics;
  alerts: any[];
  topUsers: Array<{
    userId: string;
    name?: string;
    email?: string;
    totalCost: number;
    totalRequests: number;
    avgQuality: number;
  }>;
  modulePerformance: Array<{
    module: string;
    cost: number;
    requests: number;
    avgResponseTime: number;
    successRate: number;
  }>;
  costTrends: Array<{
    date: string;
    cost: number;
    requests: number;
  }>;
}

export const useAdminAnalytics = () => {
  const [analytics, setAnalytics] = useState<AdminAnalytics | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchAnalytics = useCallback(async () => {
    try {
      setIsLoading(true);
      setError(null);

      const now = new Date();
      const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
      const weekAgo = new Date(today.getTime() - 7 * 24 * 60 * 60 * 1000);
      const monthAgo = new Date(today.getTime() - 30 * 24 * 60 * 60 * 1000);

      // Obtener métricas por período
      const [dailyMetrics, weeklyMetrics, monthlyMetrics, alerts] = await Promise.all([
        adminCostTrackingService.getUsageMetrics(
          today.toISOString(),
          now.toISOString()
        ),
        adminCostTrackingService.getUsageMetrics(
          weekAgo.toISOString(),
          now.toISOString()
        ),
        adminCostTrackingService.getUsageMetrics(
          monthAgo.toISOString(),
          now.toISOString()
        ),
        adminCostTrackingService.getActiveAlerts()
      ]);

      // Obtener datos detallados de usuarios top
      const topUsers = await Promise.all(
        monthlyMetrics.topUsers.slice(0, 10).map(async (user) => {
          const { data: profile } = await supabase
            .from('profiles')
            .select('name, email')
            .eq('id', user.userId)
            .single();

          // Calcular calidad promedio del usuario
          const { data: userUsage } = await supabase
            .from('ai_model_usage')
            .select('quality_score')
            .eq('user_id', user.userId)
            .gte('created_at', monthAgo.toISOString())
            .not('quality_score', 'is', null);

          const avgQuality = userUsage?.length 
            ? userUsage.reduce((sum, usage) => sum + (usage.quality_score || 0), 0) / userUsage.length
            : 0;

          return {
            userId: user.userId,
            name: profile?.name || 'Usuario desconocido',
            email: profile?.email || '',
            totalCost: user.cost,
            totalRequests: user.requests,
            avgQuality: Math.round(avgQuality * 100) / 100
          };
        })
      );

      // Obtener rendimiento por módulo
      const modulePerformance = await Promise.all(
        Object.entries(monthlyMetrics.moduleBreakdown).map(async ([module, stats]) => {
          const { data: moduleUsage } = await supabase
            .from('ai_model_usage')
            .select('response_time_ms, success')
            .eq('module_source', module)
            .gte('created_at', monthAgo.toISOString());

          const avgResponseTime = moduleUsage?.length
            ? moduleUsage.reduce((sum, usage) => sum + (usage.response_time_ms || 0), 0) / moduleUsage.length
            : 0;

          const successRate = moduleUsage?.length
            ? (moduleUsage.filter(usage => usage.success).length / moduleUsage.length) * 100
            : 0;

          return {
            module,
            cost: stats.cost,
            requests: stats.requests,
            avgResponseTime: Math.round(avgResponseTime),
            successRate: Math.round(successRate * 100) / 100
          };
        })
      );

      // Obtener tendencias de costo (últimos 30 días)
      const { data: dailyTrends } = await supabase
        .from('ai_model_usage')
        .select('created_at, estimated_cost')
        .gte('created_at', monthAgo.toISOString())
        .order('created_at', { ascending: true });

      // Agrupar por día
      const trendsMap = new Map();
      dailyTrends?.forEach(record => {
        const date = record.created_at.split('T')[0];
        const current = trendsMap.get(date) || { cost: 0, requests: 0 };
        current.cost += record.estimated_cost || 0;
        current.requests += 1;
        trendsMap.set(date, current);
      });

      const costTrends = Array.from(trendsMap.entries()).map(([date, stats]) => ({
        date,
        cost: Math.round(stats.cost * 100000) / 100000, // 5 decimales
        requests: stats.requests
      }));

      setAnalytics({
        dailyMetrics,
        weeklyMetrics,
        monthlyMetrics,
        alerts,
        topUsers,
        modulePerformance,
        costTrends
      });
    } catch (err) {
      console.error('Error fetching admin analytics:', err);
      setError('Error al cargar analytics');
    } finally {
      setIsLoading(false);
    }
  }, []);

  const resolveAlert = useCallback(async (alertId: string) => {
    try {
      // Obtener el usuario actual (asumiendo que es admin)
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      await adminCostTrackingService.resolveAlert(alertId, user.id);
      await fetchAnalytics(); // Refrescar datos
    } catch (error) {
      console.error('Error resolving alert:', error);
    }
  }, [fetchAnalytics]);

  const setUserLimits = useCallback(async (
    userId: string,
    limits: {
      dailyLimit?: number;
      weeklyLimit?: number;
      monthlyLimit?: number;
      moduleLimits?: Record<string, number>;
    }
  ) => {
    try {
      await adminCostTrackingService.setUserLimits(userId, limits);
      await fetchAnalytics(); // Refrescar datos
    } catch (error) {
      console.error('Error setting user limits:', error);
    }
  }, [fetchAnalytics]);

  useEffect(() => {
    fetchAnalytics();
  }, [fetchAnalytics]);

  return {
    analytics,
    isLoading,
    error,
    refetch: fetchAnalytics,
    resolveAlert,
    setUserLimits
  };
};
