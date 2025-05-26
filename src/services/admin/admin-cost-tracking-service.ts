
import { supabase } from '@/integrations/supabase/client';

export interface CostTrackingData {
  userId?: string;
  modelName: string;
  actionType: string;
  tokenCount?: number;
  responseTimeMs?: number;
  success: boolean;
  moduleSource: string;
  qualityScore?: number;
  metadata?: Record<string, any>;
}

export interface UsageMetrics {
  totalCost: number;
  totalRequests: number;
  avgResponseTime: number;
  successRate: number;
  topUsers: Array<{ userId: string; cost: number; requests: number }>;
  moduleBreakdown: Record<string, { cost: number; requests: number }>;
}

export class AdminCostTrackingService {
  /**
   * Calcula el costo estimado basado en tokens para Gemini Flash 1.5
   */
  private calculateGeminiCost(tokens: number): number {
    // Gemini Flash 1.5: $0.075 per 1M input tokens, $0.30 per 1M output tokens
    // Estimamos 70% input, 30% output
    const inputCost = (tokens * 0.7 * 0.075) / 1000000;
    const outputCost = (tokens * 0.3 * 0.30) / 1000000;
    return inputCost + outputCost;
  }

  /**
   * Registra el uso de un modelo AI
   */
  async trackModelUsage(data: CostTrackingData): Promise<void> {
    try {
      const estimatedCost = data.tokenCount ? this.calculateGeminiCost(data.tokenCount) : 0;

      const { error } = await supabase
        .from('ai_model_usage')
        .insert({
          user_id: data.userId,
          model_name: data.modelName,
          action_type: data.actionType,
          token_count: data.tokenCount,
          estimated_cost: estimatedCost,
          response_time_ms: data.responseTimeMs,
          success: data.success,
          module_source: data.moduleSource,
          quality_score: data.qualityScore,
          metadata: data.metadata || {}
        });

      if (error) {
        console.error('Error tracking model usage:', error);
      }

      // Verificar límites y generar alertas si es necesario
      if (data.userId) {
        await this.checkUserLimits(data.userId, estimatedCost, data.moduleSource);
      }
    } catch (error) {
      console.error('Error in trackModelUsage:', error);
    }
  }

  /**
   * Verifica los límites de costo del usuario
   */
  private async checkUserLimits(userId: string, cost: number, moduleSource: string): Promise<void> {
    try {
      // Obtener límites del usuario
      const { data: limits } = await supabase
        .from('user_cost_limits')
        .select('*')
        .eq('user_id', userId)
        .single();

      if (!limits) return;

      // Calcular uso actual del día
      const today = new Date().toISOString().split('T')[0];
      const { data: todayUsage } = await supabase
        .from('ai_model_usage')
        .select('estimated_cost')
        .eq('user_id', userId)
        .gte('created_at', `${today}T00:00:00Z`)
        .lt('created_at', `${today}T23:59:59Z`);

      const todayCost = todayUsage?.reduce((sum, usage) => sum + (usage.estimated_cost || 0), 0) || 0;

      // Verificar si excede límite diario
      if (todayCost > limits.daily_limit) {
        await this.createAlert({
          alertType: 'budget_exceeded',
          thresholdValue: limits.daily_limit,
          currentValue: todayCost,
          userId,
          moduleSource,
          message: `Usuario ha excedido el límite diario de $${limits.daily_limit}`,
          severity: 'high'
        });
      }
    } catch (error) {
      console.error('Error checking user limits:', error);
    }
  }

  /**
   * Crea una alerta administrativa
   */
  private async createAlert(alertData: {
    alertType: string;
    thresholdValue: number;
    currentValue: number;
    userId?: string;
    moduleSource?: string;
    message: string;
    severity: string;
  }): Promise<void> {
    try {
      const { error } = await supabase
        .from('admin_cost_alerts')
        .insert({
          alert_type: alertData.alertType,
          threshold_value: alertData.thresholdValue,
          current_value: alertData.currentValue,
          user_id: alertData.userId,
          module_source: alertData.moduleSource,
          message: alertData.message,
          severity: alertData.severity
        });

      if (error) {
        console.error('Error creating alert:', error);
      }
    } catch (error) {
      console.error('Error in createAlert:', error);
    }
  }

  /**
   * Obtiene métricas de uso por período
   */
  async getUsageMetrics(
    startDate: string,
    endDate: string,
    moduleSource?: string
  ): Promise<UsageMetrics> {
    try {
      let query = supabase
        .from('ai_model_usage')
        .select('*')
        .gte('created_at', startDate)
        .lte('created_at', endDate);

      if (moduleSource) {
        query = query.eq('module_source', moduleSource);
      }

      const { data: usage, error } = await query;

      if (error) throw error;

      const totalCost = usage?.reduce((sum, record) => sum + (record.estimated_cost || 0), 0) || 0;
      const totalRequests = usage?.length || 0;
      const avgResponseTime = usage?.reduce((sum, record) => sum + (record.response_time_ms || 0), 0) / totalRequests || 0;
      const successCount = usage?.filter(record => record.success).length || 0;
      const successRate = totalRequests > 0 ? (successCount / totalRequests) * 100 : 0;

      // Calcular top usuarios
      const userStats = new Map();
      usage?.forEach(record => {
        if (record.user_id) {
          const current = userStats.get(record.user_id) || { cost: 0, requests: 0 };
          current.cost += record.estimated_cost || 0;
          current.requests += 1;
          userStats.set(record.user_id, current);
        }
      });

      const topUsers = Array.from(userStats.entries())
        .map(([userId, stats]) => ({ userId, ...stats }))
        .sort((a, b) => b.cost - a.cost)
        .slice(0, 10);

      // Calcular breakdown por módulo
      const moduleStats = new Map();
      usage?.forEach(record => {
        const current = moduleStats.get(record.module_source) || { cost: 0, requests: 0 };
        current.cost += record.estimated_cost || 0;
        current.requests += 1;
        moduleStats.set(record.module_source, current);
      });

      const moduleBreakdown = Object.fromEntries(moduleStats);

      return {
        totalCost,
        totalRequests,
        avgResponseTime,
        successRate,
        topUsers,
        moduleBreakdown
      };
    } catch (error) {
      console.error('Error getting usage metrics:', error);
      return {
        totalCost: 0,
        totalRequests: 0,
        avgResponseTime: 0,
        successRate: 0,
        topUsers: [],
        moduleBreakdown: {}
      };
    }
  }

  /**
   * Obtiene alertas activas
   */
  async getActiveAlerts(): Promise<any[]> {
    try {
      const { data, error } = await supabase
        .from('admin_cost_alerts')
        .select(`
          *,
          profiles!admin_cost_alerts_user_id_fkey(name, email)
        `)
        .eq('is_active', true)
        .order('triggered_at', { ascending: false });

      if (error) throw error;
      return data || [];
    } catch (error) {
      console.error('Error getting active alerts:', error);
      return [];
    }
  }

  /**
   * Resuelve una alerta
   */
  async resolveAlert(alertId: string, resolvedBy: string): Promise<void> {
    try {
      const { error } = await supabase
        .from('admin_cost_alerts')
        .update({
          is_active: false,
          resolved_at: new Date().toISOString(),
          resolved_by: resolvedBy
        })
        .eq('id', alertId);

      if (error) throw error;
    } catch (error) {
      console.error('Error resolving alert:', error);
    }
  }

  /**
   * Configura límites para un usuario
   */
  async setUserLimits(
    userId: string,
    limits: {
      dailyLimit?: number;
      weeklyLimit?: number;
      monthlyLimit?: number;
      moduleLimits?: Record<string, number>;
    }
  ): Promise<void> {
    try {
      const { error } = await supabase
        .from('user_cost_limits')
        .upsert({
          user_id: userId,
          daily_limit: limits.dailyLimit,
          weekly_limit: limits.weeklyLimit,
          monthly_limit: limits.monthlyLimit,
          module_limits: limits.moduleLimits || {}
        });

      if (error) throw error;
    } catch (error) {
      console.error('Error setting user limits:', error);
    }
  }
}

export const adminCostTrackingService = new AdminCostTrackingService();
