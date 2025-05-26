
/**
 * Tipos de dominio para analytics institucionales
 * Separados completamente de los tipos de persistencia
 */

export interface StudentMetrics {
  studentId: string;
  engagementScore: number;
  progressScore: number;
  riskLevel: 'low' | 'medium' | 'high';
  exercisesCompleted: number;
  timeSpent: number;
}

export interface InstitutionalMetrics {
  totalStudents: number;
  activeStudents: number;
  averageEngagement: number;
  overallProgress: number;
  riskDistribution: {
    low: number;
    medium: number;
    high: number;
  };
  subjectPerformance: {
    [subject: string]: number;
  };
  toolUsage: {
    [tool: string]: number;
  };
  timestamp: string;
}

export interface ParentReportData {
  studentId: string;
  parentId: string;
  weeklyProgress: number;
  exercisesCompleted: number;
  timeSpent: number;
  strongSubjects: string[];
  improvementAreas: string[];
  recommendations: string[];
  nextGoals: string[];
}

// DTOs para persistencia (Json compatible)
export interface MetricsDTO {
  totalStudents: number;
  activeStudents: number;
  averageEngagement: number;
  overallProgress: number;
  riskDistribution: Record<string, number>;
  subjectPerformance: Record<string, number>;
  toolUsage: Record<string, number>;
  timestamp: string;
}

export interface ParentReportDTO {
  studentId: string;
  parentId: string;
  weeklyProgress: number;
  exercisesCompleted: number;
  timeSpent: number;
  strongSubjects: string[];
  improvementAreas: string[];
  recommendations: string[];
  nextGoals: string[];
}
