
/**
 * Calculadora de métricas institucionales
 * Responsabilidad única: cálculos de métricas
 */
import { InstitutionalMetrics, StudentMetrics } from './types';
import { logger } from '@/core/logging/SystemLogger';

export class MetricsCalculator {
  /**
   * Calcula métricas institucionales basadas en datos de estudiantes
   */
  static calculateInstitutionalMetrics(
    students: any[],
    exercises: any[],
    progress: any[]
  ): InstitutionalMetrics {
    try {
      const studentMetrics = this.calculateStudentMetrics(students, exercises, progress);
      
      return {
        totalStudents: students.length,
        activeStudents: studentMetrics.filter(s => s.engagementScore > 0.3).length,
        averageEngagement: this.calculateAverageEngagement(studentMetrics),
        overallProgress: this.calculateOverallProgress(studentMetrics),
        riskDistribution: this.calculateRiskDistribution(studentMetrics),
        subjectPerformance: this.calculateSubjectPerformance(progress),
        toolUsage: this.calculateToolUsage(exercises),
        timestamp: new Date().toISOString()
      };
    } catch (error) {
      logger.error('MetricsCalculator', 'Error calculando métricas institucionales', error);
      throw error;
    }
  }

  private static calculateStudentMetrics(
    students: any[],
    exercises: any[],
    progress: any[]
  ): StudentMetrics[] {
    return students.map(student => {
      const studentExercises = exercises.filter(e => e.user_id === student.id);
      const studentProgress = progress.filter(p => p.user_id === student.id);
      
      const engagementScore = this.calculateEngagement(studentExercises);
      const progressScore = this.calculateProgress(studentProgress);
      
      return {
        studentId: student.id,
        engagementScore,
        progressScore,
        riskLevel: this.calculateRiskLevel(engagementScore, progressScore),
        exercisesCompleted: studentExercises.length,
        timeSpent: studentExercises.reduce((total, e) => total + (e.time_taken_seconds || 0), 0)
      };
    });
  }

  private static calculateEngagement(exercises: any[]): number {
    if (exercises.length === 0) return 0;
    const recentExercises = exercises.filter(e => 
      new Date(e.created_at) > new Date(Date.now() - 7 * 24 * 60 * 60 * 1000)
    );
    return Math.min(recentExercises.length / 10, 1);
  }

  private static calculateProgress(progress: any[]): number {
    if (progress.length === 0) return 0;
    return progress.reduce((sum, p) => sum + (p.progress || 0), 0) / progress.length / 100;
  }

  private static calculateRiskLevel(engagement: number, progress: number): 'low' | 'medium' | 'high' {
    const combinedScore = (engagement + progress) / 2;
    if (combinedScore > 0.7) return 'low';
    if (combinedScore > 0.4) return 'medium';
    return 'high';
  }

  private static calculateAverageEngagement(metrics: StudentMetrics[]): number {
    if (metrics.length === 0) return 0;
    return metrics.reduce((sum, m) => sum + m.engagementScore, 0) / metrics.length;
  }

  private static calculateOverallProgress(metrics: StudentMetrics[]): number {
    if (metrics.length === 0) return 0;
    return metrics.reduce((sum, m) => sum + m.progressScore, 0) / metrics.length;
  }

  private static calculateRiskDistribution(metrics: StudentMetrics[]) {
    const distribution = { low: 0, medium: 0, high: 0 };
    metrics.forEach(m => distribution[m.riskLevel]++);
    return distribution;
  }

  private static calculateSubjectPerformance(progress: any[]): Record<string, number> {
    const subjectScores: Record<string, number[]> = {};
    
    progress.forEach(p => {
      const subject = p.subject_area || 'general';
      if (!subjectScores[subject]) {
        subjectScores[subject] = [];
      }
      subjectScores[subject].push(p.progress || 0);
    });

    const performance: Record<string, number> = {};
    Object.entries(subjectScores).forEach(([subject, scores]) => {
      performance[subject] = scores.reduce((sum, score) => sum + score, 0) / scores.length / 100;
    });

    return performance;
  }

  private static calculateToolUsage(exercises: any[]): Record<string, number> {
    const usage: Record<string, number> = {};
    
    exercises.forEach(e => {
      const tool = e.source || 'unknown';
      usage[tool] = (usage[tool] || 0) + 1;
    });

    return usage;
  }
}
