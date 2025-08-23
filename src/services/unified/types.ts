
// Tipos base para datos raw de la base de datos
export interface RawCalendarData {
  fecha_id: number;
  proceso: string;
  descripcion: string;
  fecha_inicio: string;
  fecha_fin: string;
  dias_restantes: number;
  prioridad: number;
  estado: string;
}

export interface RawScholarshipData {
  id: string;
  nombre: string;
  institucion: string;
  tipo_beca: string;
  monto_maximo: number;
  requisitos: any;
  fechas_postulacion: any;
}

// Tipos procesados para el dashboard
export interface ProcessedCalendarData {
  nextCriticalDate: string;
  upcomingDates: Array<{
    date: string;
    title: string;
    type: string;
    daysRemaining: number;
  }>;
  totalEvents: number;
}

export interface ProcessedScholarshipData {
  availableCount: number;
  totalAmount: number;
  eligibleScholarships: Array<{
    name: string;
    institution: string;
    amount: number;
    deadline: string;
  }>;
}

// Interfaces principales del sistema unificado
export interface UnifiedDashboardData {
  analytics: {
    totalStudents: number;
    activeStudents: number;
    averageEngagement: number;
    overallProgress: number;
    subjectPerformance: Record<string, number>;
    riskDistribution: {
      high: number;
      medium: number;
      low: number;
    };
  };
  calendar: ProcessedCalendarData;
  scholarships: ProcessedScholarshipData;
  lastUpdated: Date;
}

export interface OptimalPathData {
  pathId: string;
  estimatedHours: number;
  difficulty: 'easy' | 'medium' | 'hard';
  subjects: string[];
  milestones: Array<{
    week: number;
    goals: string[];
    estimatedCompletion: number;
  }>;
  adaptiveRecommendations: string[];
}

export interface PersonalizedAlert {
  id: string;
  title: string;
  description: string;
  priority: 'low' | 'medium' | 'high' | 'urgent';
  type: 'info' | 'warning' | 'success' | 'error';
  action?: () => void;
  actionLabel?: string;
  timestamp: Date;
  isRead: boolean;
}
