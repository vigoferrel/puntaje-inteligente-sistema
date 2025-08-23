import type { SafeString, SafeNumber, SafeBoolean, APIResponse, OperationResult } from '@/types/core';


/**
 * Tipos de dominio para analytics institucionales
 * Completamente compatibles con Supabase Json type
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

// DTOs para persistencia (Json compatible con Supabase)
export interface MetricsDTO {
  totalStudents: number;
  activeStudents: number;
  averageEngagement: number;
  overallProgress: number;
  riskDistribution: { [key: string]: number };
  subjectPerformance: { [key: string]: number };
  toolUsage: { [key: string]: number };
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

// Nuevos tipos para funcionalidades incrementadas
export interface PredictiveMetrics {
  performanceTrend: 'increasing' | 'stable' | 'decreasing';
  riskPrediction: {
    highRiskStudents: number;
    predictedDropouts: number;
    interventionRecommended: boolean;
  };
  goalProjection: {
    projectedPAESScore: number;
    timeToGoal: number;
    successProbability: number;
  };
  nextRecommendedActions: string[];
}

export interface EnhancedInstitutionalMetrics extends InstitutionalMetrics {
  predictive?: PredictiveMetrics;
}

export interface StudentTrends {
  progressTrend: number[];
  activityTrend: number;
  improvementRate: number;
}

export interface EnhancedParentReportData extends ParentReportData {
  trends?: StudentTrends;
  personalizedRecommendations?: string[];
  riskLevel?: 'low' | 'medium' | 'high';
  projectedOutcome?: {
    paesScore: number;
    improvementNeeded: number;
    timeFrame: string;
  };
}

export interface InstitutionAnalyticsConfig {
  enableRealtime: boolean;
  enablePredictive: boolean;
  cacheTimeout: number;
  batchSize: number;
  reportFrequency: 'daily' | 'weekly' | 'monthly';
  notificationThresholds: {
    riskLevel: number;
    engagementDrop: number;
    progressStagnation: number;
  };
}

// Tipos para exportación
export interface ExportOptions {
  format: 'pdf' | 'excel' | 'csv' | 'json';
  includeCharts: boolean;
  includePredictive: boolean;
  dateRange?: {
    start: string;
    end: string;
  };
}

// Tipos para API REST
export interface AnalyticsAPIResponse<T = unknown> {
  success: boolean;
  data?: T;
  error?: string;
  timestamp: string;
  cached: boolean;
}

export interface AnalyticsQuery {
  institutionId: string;
  dateRange?: {
    start: string;
    end: string;
  };
  filters?: {
    gradeLevel?: string[];
    riskLevel?: ('low' | 'medium' | 'high')[];
    subjects?: string[];
  };
  pagination?: {
    page: number;
    limit: number;
  };
}

