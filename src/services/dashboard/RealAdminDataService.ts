
import { supabase } from '@/integrations/supabase/client';
import { logger } from '@/core/logging/SystemLogger';

interface AdminCostData {
  monthlySpent: number;
  monthlyBudget: number;
  dailyAverage: number;
  topModels: Array<{ name: string; cost: number; usage: number }>;
  alerts: Array<{ type: string; message: string }>;
}

interface AdminSystemData {
  uptime: number;
  activeUsers: number;
  requestsToday: number;
  errorRate: number;
  services: Array<{ name: string; status: string; latency: number }>;
}

interface AdminUserData {
  totalUsers: number;
  activeToday: number;
  newThisWeek: number;
  retention: number;
  topActivities: Array<{ activity: string; users: number }>;
}

export class RealAdminDataService {
  static async getCostData(): Promise<AdminCostData> {
    try {
      const currentMonth = new Date();
      const firstDayOfMonth = new Date(currentMonth.getFullYear(), currentMonth.getMonth(), 1);

      // Obtener gastos del mes actual
      const { data: monthlyUsage, error: monthlyError } = await supabase
        .from('ai_model_usage')
        .select('estimated_cost, model_name, token_count')
        .gte('created_at', firstDayOfMonth.toISOString());

      if (monthlyError) throw monthlyError;

      const monthlySpent = monthlyUsage?.reduce((acc, usage) => 
        acc + (usage.estimated_cost || 0), 0) || 0;

      // Calcular promedio diario
      const daysInMonth = new Date().getDate();
      const dailyAverage = daysInMonth > 0 ? monthlySpent / daysInMonth : 0;

      // Obtener top modelos
      const modelStats = monthlyUsage?.reduce((acc, usage) => {
        const model = usage.model_name;
        if (!acc[model]) {
          acc[model] = { cost: 0, usage: 0 };
        }
        acc[model].cost += usage.estimated_cost || 0;
        acc[model].usage += usage.token_count || 0;
        return acc;
      }, {} as { [key: string]: { cost: number; usage: number } }) || {};

      const topModels = Object.entries(modelStats)
        .map(([name, stats]) => ({ name, ...stats }))
        .sort((a, b) => b.cost - a.cost)
        .slice(0, 3);

      // Obtener alertas de costos
      const { data: alerts, error: alertsError } = await supabase
        .from('admin_cost_alerts')
        .select('alert_type, message')
        .eq('is_active', true)
        .order('triggered_at', { ascending: false })
        .limit(5);

      const alertsList = alerts?.map(alert => ({
        type: alert.alert_type === 'high_usage' ? 'warning' : 'info',
        message: alert.message || 'Alert sin mensaje'
      })) || [];

      return {
        monthlySpent: Number(monthlySpent.toFixed(2)),
        monthlyBudget: 1200, // Configurar desde settings
        dailyAverage: Number(dailyAverage.toFixed(2)),
        topModels,
        alerts: alertsList
      };
    } catch (error) {
      logger.error('RealAdminDataService', 'Error fetching cost data', error);
      return {
        monthlySpent: 0,
        monthlyBudget: 1200,
        dailyAverage: 0,
        topModels: [],
        alerts: []
      };
    }
  }

  static async getSystemData(): Promise<AdminSystemData> {
    try {
      // Calcular uptime basado en métricas del sistema
      const { data: systemMetrics, error: metricsError } = await supabase
        .from('system_metrics')
        .select('metric_value')
        .eq('metric_type', 'uptime')
        .order('recorded_at', { ascending: false })
        .limit(1)
        .single();

      const uptime = systemMetrics?.metric_value || 99.8;

      // Obtener usuarios activos (últimas 24 horas)
      const dayAgo = new Date();
      dayAgo.setDate(dayAgo.getDate() - 1);

      const { data: activeUsers, error: usersError } = await supabase
        .from('profiles')
        .select('id')
        .gte('last_active_at', dayAgo.toISOString());

      // Obtener requests de hoy
      const today = new Date();
      today.setHours(0, 0, 0, 0);

      const { data: todayRequests, error: requestsError } = await supabase
        .from('ai_model_usage')
        .select('id')
        .gte('created_at', today.toISOString());

      // Calcular error rate
      const { data: errorRequests, error: errorsError } = await supabase
        .from('ai_model_usage')
        .select('id')
        .eq('success', false)
        .gte('created_at', today.toISOString());

      const totalRequests = todayRequests?.length || 1;
      const errorCount = errorRequests?.length || 0;
      const errorRate = (errorCount / totalRequests) * 100;

      // Estado de servicios (simulado basado en respuestas de la DB)
      const services = [
        { 
          name: 'OpenRouter API', 
          status: metricsError ? 'warning' : 'active',
          latency: Math.floor(Math.random() * 100) + 100
        },
        { 
          name: 'Supabase', 
          status: 'active',
          latency: Math.floor(Math.random() * 50) + 50
        },
        { 
          name: 'Neural Engine', 
          status: errorRate > 5 ? 'warning' : 'active',
          latency: Math.floor(Math.random() * 200) + 150
        }
      ];

      return {
        uptime: Number(uptime.toFixed(1)),
        activeUsers: activeUsers?.length || 0,
        requestsToday: totalRequests,
        errorRate: Number(errorRate.toFixed(2)),
        services
      };
    } catch (error) {
      logger.error('RealAdminDataService', 'Error fetching system data', error);
      return {
        uptime: 99.8,
        activeUsers: 0,
        requestsToday: 0,
        errorRate: 0,
        services: []
      };
    }
  }

  static async getUserData(): Promise<AdminUserData> {
    try {
      // Total de usuarios
      const { data: allUsers, error: usersError } = await supabase
        .from('profiles')
        .select('id, created_at, last_active_at');

      if (usersError) throw usersError;

      const totalUsers = allUsers?.length || 0;

      // Usuarios activos hoy
      const today = new Date();
      today.setHours(0, 0, 0, 0);

      const activeToday = allUsers?.filter(user => 
        user.last_active_at && new Date(user.last_active_at) >= today
      ).length || 0;

      // Nuevos usuarios esta semana
      const weekAgo = new Date();
      weekAgo.setDate(weekAgo.getDate() - 7);

      const newThisWeek = allUsers?.filter(user => 
        user.created_at && new Date(user.created_at) >= weekAgo
      ).length || 0;

      // Calcular retención (usuarios activos en los últimos 7 días)
      const activeWeek = allUsers?.filter(user => 
        user.last_active_at && new Date(user.last_active_at) >= weekAgo
      ).length || 0;

      const retention = totalUsers > 0 ? (activeWeek / totalUsers) * 100 : 0;

      // Top actividades basadas en uso de la plataforma
      const { data: lectoguiaUsage, error: lectoError } = await supabase
        .from('lectoguia_conversations')
        .select('user_id')
        .gte('created_at', weekAgo.toISOString());

      const { data: diagnosticUsage, error: diagError } = await supabase
        .from('user_diagnostic_results')
        .select('user_id')
        .gte('completed_at', weekAgo.toISOString());

      const { data: planUsage, error: planError } = await supabase
        .from('generated_study_plans')
        .select('user_id')
        .gte('created_at', weekAgo.toISOString());

      const topActivities = [
        { 
          activity: 'LectoGuía Chat', 
          users: new Set(lectoguiaUsage?.map(u => u.user_id) || []).size
        },
        { 
          activity: 'Diagnósticos', 
          users: new Set(diagnosticUsage?.map(u => u.user_id) || []).size
        },
        { 
          activity: 'Plan Estudios', 
          users: new Set(planUsage?.map(u => u.user_id) || []).size
        }
      ].sort((a, b) => b.users - a.users);

      return {
        totalUsers,
        activeToday,
        newThisWeek,
        retention: Number(retention.toFixed(1)),
        topActivities
      };
    } catch (error) {
      logger.error('RealAdminDataService', 'Error fetching user data', error);
      return {
        totalUsers: 0,
        activeToday: 0,
        newThisWeek: 0,
        retention: 0,
        topActivities: []
      };
    }
  }
}
