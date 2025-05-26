
/**
 * Mappers para convertir entre tipos de dominio y DTOs
 */
import { InstitutionalMetrics, ParentReportData, MetricsDTO, ParentReportDTO } from './types';

export class AnalyticsMappers {
  /**
   * Convierte métricas institucionales a DTO para persistencia
   */
  static metricsToDTO(metrics: InstitutionalMetrics): MetricsDTO {
    return {
      totalStudents: metrics.totalStudents,
      activeStudents: metrics.activeStudents,
      averageEngagement: metrics.averageEngagement,
      overallProgress: metrics.overallProgress,
      riskDistribution: {
        low: metrics.riskDistribution.low,
        medium: metrics.riskDistribution.medium,
        high: metrics.riskDistribution.high
      },
      subjectPerformance: { ...metrics.subjectPerformance },
      toolUsage: { ...metrics.toolUsage },
      timestamp: metrics.timestamp
    };
  }

  /**
   * Convierte reporte de padres a DTO para persistencia
   */
  static parentReportToDTO(report: ParentReportData): ParentReportDTO {
    return {
      studentId: report.studentId,
      parentId: report.parentId,
      weeklyProgress: report.weeklyProgress,
      exercisesCompleted: report.exercisesCompleted,
      timeSpent: report.timeSpent,
      strongSubjects: [...report.strongSubjects],
      improvementAreas: [...report.improvementAreas],
      recommendations: [...report.recommendations],
      nextGoals: [...report.nextGoals]
    };
  }
}
