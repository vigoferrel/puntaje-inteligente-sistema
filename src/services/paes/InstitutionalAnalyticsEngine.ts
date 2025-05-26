
import { supabase } from '@/integrations/supabase/client';
import { logger } from '@/core/logging/SystemLogger';

interface InstitutionalMetrics {
  totalStudents: number;
  averageProgress: number;
  toolUsageDistribution: Record<string, number>;
  performanceBySubject: Record<string, number>;
  engagementMetrics: {
    dailyActiveUsers: number;
    weeklyActiveUsers: number;
    monthlyActiveUsers: number;
    averageSessionTime: number;
  };
  riskStudents: Array<{
    userId: string;
    riskLevel: 'high' | 'medium' | 'low';
    factors: string[];
  }>;
  recommendations: Array<{
    type: 'intervention' | 'support' | 'acceleration';
    description: string;
    affectedStudents: number;
    priority: number;
  }>;
}

interface ParentReport {
  studentId: string;
  studentName: string;
  overallProgress: number;
  strengths: string[];
  areasForImprovement: string[];
  recentActivity: {
    exercisesCompleted: number;
    timeSpent: number;
    averageAccuracy: number;
    toolsUsed: string[];
  };
  recommendations: string[];
  nextSteps: string[];
}

export class InstitutionalAnalyticsEngine {
  
  /**
   * Genera métricas institucionales completas
   */
  static async generateInstitutionalMetrics(): Promise<InstitutionalMetrics> {
    try {
      logger.info('InstitutionalAnalytics', 'Generando métricas institucionales');

      const [
        totalStudents,
        averageProgress,
        toolUsage,
        performanceBySubject,
        engagementMetrics,
        riskStudents,
        recommendations
      ] = await Promise.all([
        this.getTotalStudents(),
        this.calculateAverageProgress(),
        this.getToolUsageDistribution(),
        this.getPerformanceBySubject(),
        this.calculateEngagementMetrics(),
        this.identifyRiskStudents(),
        this.generateInstitutionalRecommendations()
      ]);

      const metrics: InstitutionalMetrics = {
        totalStudents,
        averageProgress,
        toolUsageDistribution: toolUsage,
        performanceBySubject,
        engagementMetrics,
        riskStudents,
        recommendations
      };

      // Guardar métricas para seguimiento histórico
      await this.saveInstitutionalMetrics(metrics);

      return metrics;

    } catch (error) {
      logger.error('InstitutionalAnalytics', 'Error generando métricas institucionales', error);
      throw error;
    }
  }

  /**
   * Genera reporte individual para apoderados
   */
  static async generateParentReport(studentId: string): Promise<ParentReport> {
    try {
      logger.info('InstitutionalAnalytics', 'Generando reporte para apoderados', { studentId });

      // Obtener datos del estudiante
      const { data: profile } = await supabase
        .from('profiles')
        .select('name')
        .eq('id', studentId)
        .single();

      const [
        progressData,
        recentActivity,
        strengths,
        improvements,
        recommendations
      ] = await Promise.all([
        this.getStudentProgress(studentId),
        this.getRecentActivity(studentId),
        this.getStudentStrengths(studentId),
        this.getAreasForImprovement(studentId),
        this.getPersonalizedRecommendations(studentId)
      ]);

      const report: ParentReport = {
        studentId,
        studentName: profile?.name || 'Estudiante',
        overallProgress: progressData.overall,
        strengths,
        areasForImprovement: improvements,
        recentActivity,
        recommendations,
        nextSteps: this.generateNextSteps(progressData, strengths, improvements)
      };

      // Registrar generación del reporte
      await this.logReportGeneration(studentId, 'parent_report');

      return report;

    } catch (error) {
      logger.error('InstitutionalAnalytics', 'Error generando reporte para apoderados', error);
      throw error;
    }
  }

  /**
   * Obtiene total de estudiantes activos
   */
  private static async getTotalStudents(): Promise<number> {
    const { count } = await supabase
      .from('profiles')
      .select('*', { count: 'exact', head: true })
      .not('id', 'is', null);

    return count || 0;
  }

  /**
   * Calcula progreso promedio de todos los estudiantes
   */
  private static async calculateAverageProgress(): Promise<number> {
    const { data: progressData } = await supabase
      .from('user_node_progress')
      .select('progress');

    if (!progressData || progressData.length === 0) return 0;

    const totalProgress = progressData.reduce((sum, item) => sum + (item.progress || 0), 0);
    return totalProgress / progressData.length;
  }

  /**
   * Obtiene distribución de uso por herramienta
   */
  private static async getToolUsageDistribution(): Promise<Record<string, number>> {
    const { data: metrics } = await supabase
      .from('neural_metrics')
      .select('dimension_id, current_value')
      .eq('metric_type', 'exercises_completed');

    const distribution: Record<string, number> = {};

    metrics?.forEach(metric => {
      const tool = metric.dimension_id.split('_')[0];
      distribution[tool] = (distribution[tool] || 0) + metric.current_value;
    });

    return distribution;
  }

  /**
   * Calcula rendimiento por materia
   */
  private static async getPerformanceBySubject(): Promise<Record<string, number>> {
    const { data: attempts } = await supabase
      .from('user_exercise_attempts')
      .select('is_correct, exercise_id')
      .not('exercise_id', 'is', null);

    const performance: Record<string, { correct: number; total: number }> = {};

    // Aquí se podría mapear exercise_id a materia específica
    // Por ahora usamos categorías generales
    attempts?.forEach(attempt => {
      const subject = 'general'; // Se podría obtener de la metadata del ejercicio
      if (!performance[subject]) {
        performance[subject] = { correct: 0, total: 0 };
      }
      performance[subject].total++;
      if (attempt.is_correct) {
        performance[subject].correct++;
      }
    });

    const result: Record<string, number> = {};
    Object.entries(performance).forEach(([subject, data]) => {
      result[subject] = data.total > 0 ? data.correct / data.total : 0;
    });

    return result;
  }

  /**
   * Calcula métricas de engagement
   */
  private static async calculateEngagementMetrics(): Promise<any> {
    const now = new Date();
    const dayAgo = new Date(now.getTime() - 24 * 60 * 60 * 1000);
    const weekAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
    const monthAgo = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);

    const [dailyActive, weeklyActive, monthlyActive] = await Promise.all([
      this.getActiveUsersCount(dayAgo),
      this.getActiveUsersCount(weekAgo),
      this.getActiveUsersCount(monthAgo)
    ]);

    const averageSessionTime = await this.calculateAverageSessionTime();

    return {
      dailyActiveUsers: dailyActive,
      weeklyActiveUsers: weeklyActive,
      monthlyActiveUsers: monthlyActive,
      averageSessionTime
    };
  }

  /**
   * Identifica estudiantes en riesgo
   */
  private static async identifyRiskStudents(): Promise<Array<any>> {
    const { data: progressData } = await supabase
      .from('user_node_progress')
      .select('user_id, progress, success_rate, last_activity_at');

    const riskStudents: Array<any> = [];

    progressData?.forEach(progress => {
      const factors: string[] = [];
      let riskLevel: 'high' | 'medium' | 'low' = 'low';

      // Factores de riesgo
      if (progress.progress < 20) {
        factors.push('Progreso muy bajo');
        riskLevel = 'high';
      } else if (progress.progress < 40) {
        factors.push('Progreso bajo');
        riskLevel = riskLevel === 'high' ? 'high' : 'medium';
      }

      if (progress.success_rate < 0.3) {
        factors.push('Tasa de éxito baja');
        riskLevel = 'high';
      }

      const lastActivity = new Date(progress.last_activity_at);
      const daysSinceActivity = (Date.now() - lastActivity.getTime()) / (1000 * 60 * 60 * 24);
      
      if (daysSinceActivity > 7) {
        factors.push('Inactividad prolongada');
        riskLevel = riskLevel === 'low' ? 'medium' : 'high';
      }

      if (factors.length > 0) {
        riskStudents.push({
          userId: progress.user_id,
          riskLevel,
          factors
        });
      }
    });

    return riskStudents;
  }

  /**
   * Genera recomendaciones institucionales
   */
  private static async generateInstitutionalRecommendations(): Promise<Array<any>> {
    const recommendations: Array<any> = [];

    // Obtener datos para análisis
    const [avgProgress, riskStudents, toolUsage] = await Promise.all([
      this.calculateAverageProgress(),
      this.identifyRiskStudents(),
      this.getToolUsageDistribution()
    ]);

    // Recomendaciones basadas en progreso
    if (avgProgress < 30) {
      recommendations.push({
        type: 'intervention',
        description: 'Implementar programa de refuerzo general - progreso promedio bajo',
        affectedStudents: await this.getTotalStudents(),
        priority: 3
      });
    }

    // Recomendaciones basadas en estudiantes en riesgo
    const highRiskCount = riskStudents.filter(s => s.riskLevel === 'high').length;
    if (highRiskCount > 0) {
      recommendations.push({
        type: 'intervention',
        description: `Intervención urgente para ${highRiskCount} estudiantes en alto riesgo`,
        affectedStudents: highRiskCount,
        priority: 5
      });
    }

    // Recomendaciones basadas en uso de herramientas
    const totalUsage = Object.values(toolUsage).reduce((sum, val) => sum + val, 0);
    const underusedTools = Object.entries(toolUsage)
      .filter(([tool, usage]) => usage < totalUsage * 0.1)
      .map(([tool]) => tool);

    if (underusedTools.length > 0) {
      recommendations.push({
        type: 'support',
        description: `Promover uso de herramientas infrautilizadas: ${underusedTools.join(', ')}`,
        affectedStudents: await this.getTotalStudents(),
        priority: 2
      });
    }

    return recommendations.sort((a, b) => b.priority - a.priority);
  }

  // Métodos auxiliares para reportes de apoderados

  private static async getStudentProgress(studentId: string): Promise<any> {
    const { data: progress } = await supabase
      .from('user_node_progress')
      .select('progress')
      .eq('user_id', studentId);

    if (!progress || progress.length === 0) {
      return { overall: 0 };
    }

    const overall = progress.reduce((sum, item) => sum + (item.progress || 0), 0) / progress.length;
    return { overall };
  }

  private static async getRecentActivity(studentId: string): Promise<any> {
    const weekAgo = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000);

    const { data: attempts } = await supabase
      .from('user_exercise_attempts')
      .select('is_correct, time_taken_seconds, created_at')
      .eq('user_id', studentId)
      .gte('created_at', weekAgo.toISOString());

    const exercisesCompleted = attempts?.length || 0;
    const timeSpent = attempts?.reduce((sum, attempt) => sum + (attempt.time_taken_seconds || 0), 0) || 0;
    const correctAnswers = attempts?.filter(a => a.is_correct).length || 0;
    const averageAccuracy = exercisesCompleted > 0 ? correctAnswers / exercisesCompleted : 0;

    return {
      exercisesCompleted,
      timeSpent: Math.round(timeSpent / 60), // en minutos
      averageAccuracy,
      toolsUsed: ['lectoguia', 'diagnostic', 'training'] // Se podría obtener de metadata
    };
  }

  private static async getStudentStrengths(studentId: string): Promise<string[]> {
    // Análisis basado en performance por skill
    const { data: attempts } = await supabase
      .from('user_exercise_attempts')
      .select('skill_demonstrated, is_correct')
      .eq('user_id', studentId);

    const skillPerformance: Record<string, { correct: number; total: number }> = {};

    attempts?.forEach(attempt => {
      const skill = attempt.skill_demonstrated || 'general';
      if (!skillPerformance[skill]) {
        skillPerformance[skill] = { correct: 0, total: 0 };
      }
      skillPerformance[skill].total++;
      if (attempt.is_correct) {
        skillPerformance[skill].correct++;
      }
    });

    const strengths: string[] = [];
    Object.entries(skillPerformance).forEach(([skill, performance]) => {
      if (performance.total >= 5 && performance.correct / performance.total >= 0.8) {
        strengths.push(skill);
      }
    });

    return strengths.length > 0 ? strengths : ['Comprometido con el aprendizaje'];
  }

  private static async getAreasForImprovement(studentId: string): Promise<string[]> {
    // Similar al método anterior pero para áreas débiles
    const { data: attempts } = await supabase
      .from('user_exercise_attempts')
      .select('skill_demonstrated, is_correct')
      .eq('user_id', studentId);

    const skillPerformance: Record<string, { correct: number; total: number }> = {};

    attempts?.forEach(attempt => {
      const skill = attempt.skill_demonstrated || 'general';
      if (!skillPerformance[skill]) {
        skillPerformance[skill] = { correct: 0, total: 0 };
      }
      skillPerformance[skill].total++;
      if (attempt.is_correct) {
        skillPerformance[skill].correct++;
      }
    });

    const improvements: string[] = [];
    Object.entries(skillPerformance).forEach(([skill, performance]) => {
      if (performance.total >= 5 && performance.correct / performance.total <= 0.4) {
        improvements.push(skill);
      }
    });

    return improvements.length > 0 ? improvements : ['Mantener práctica constante'];
  }

  private static async getPersonalizedRecommendations(studentId: string): Promise<string[]> {
    // Generar recomendaciones basadas en el análisis del estudiante
    const [progress, recentActivity, strengths, improvements] = await Promise.all([
      this.getStudentProgress(studentId),
      this.getRecentActivity(studentId),
      this.getStudentStrengths(studentId),
      this.getAreasForImprovement(studentId)
    ]);

    const recommendations: string[] = [];

    if (progress.overall < 50) {
      recommendations.push('Aumentar tiempo de estudio diario');
    }

    if (recentActivity.averageAccuracy < 0.6) {
      recommendations.push('Revisar conceptos fundamentales antes de continuar');
    }

    if (improvements.length > 0) {
      recommendations.push(`Enfocarse especialmente en: ${improvements.slice(0, 2).join(', ')}`);
    }

    if (recentActivity.exercisesCompleted < 10) {
      recommendations.push('Aumentar frecuencia de práctica con ejercicios');
    }

    return recommendations.length > 0 ? recommendations : ['Continuar con el ritmo actual de estudio'];
  }

  private static generateNextSteps(progress: any, strengths: string[], improvements: string[]): string[] {
    const nextSteps: string[] = [];

    if (progress.overall < 30) {
      nextSteps.push('Completar evaluación diagnóstica');
      nextSteps.push('Establecer rutina de estudio diaria');
    } else if (progress.overall < 70) {
      nextSteps.push('Reforzar áreas identificadas como débiles');
      nextSteps.push('Practicar ejercicios de dificultad intermedia');
    } else {
      nextSteps.push('Avanzar a ejercicios de mayor complejidad');
      nextSteps.push('Prepararse para simulacros PAES');
    }

    return nextSteps;
  }

  // Métodos auxiliares generales

  private static async getActiveUsersCount(since: Date): Promise<number> {
    const { count } = await supabase
      .from('neural_metrics')
      .select('user_id', { count: 'exact', head: true })
      .gte('last_calculated_at', since.toISOString());

    return count || 0;
  }

  private static async calculateAverageSessionTime(): Promise<number> {
    // Estimación basada en tiempo de ejercicios
    const { data: attempts } = await supabase
      .from('user_exercise_attempts')
      .select('time_taken_seconds')
      .not('time_taken_seconds', 'is', null);

    if (!attempts || attempts.length === 0) return 0;

    const totalTime = attempts.reduce((sum, attempt) => sum + (attempt.time_taken_seconds || 0), 0);
    return Math.round(totalTime / attempts.length / 60); // en minutos
  }

  private static async saveInstitutionalMetrics(metrics: InstitutionalMetrics): Promise<void> {
    try {
      await supabase
        .from('system_metrics')
        .insert({
          metric_type: 'institutional_analytics',
          metric_value: metrics.totalStudents,
          context: metrics,
          recorded_at: new Date().toISOString()
        });
    } catch (error) {
      logger.error('InstitutionalAnalytics', 'Error guardando métricas institucionales', error);
    }
  }

  private static async logReportGeneration(studentId: string, reportType: string): Promise<void> {
    try {
      await supabase
        .from('system_metrics')
        .insert({
          user_id: studentId,
          metric_type: 'report_generated',
          metric_value: 1,
          context: {
            reportType,
            generatedAt: new Date().toISOString()
          }
        });
    } catch (error) {
      logger.error('InstitutionalAnalytics', 'Error registrando generación de reporte', error);
    }
  }
}
