
import { supabase } from '@/integrations/supabase/client';
import { logger } from '@/core/logging/SystemLogger';

export interface UnifiedDashboardData {
  personalInfo: {
    userId: string;
    profile: any;
    currentPhase: string;
  };
  timeline: {
    nextCriticalDate: any;
    upcomingDates: any[];
    urgentAlerts: any[];
  };
  scholarships: {
    compatibleBenefits: any[];
    potentialSavings: number;
    applicationStatus: string;
  };
  careers: {
    recommendations: any[];
    compatibleCareers: any[];
    searchSuggestions: string[];
  };
  analytics: {
    overallProgress: number;
    subjectStrengths: string[];
    areasForImprovement: string[];
    paesReadiness: number;
  };
}

export interface OptimalPathData {
  studyPlan: {
    prioritySubjects: string[];
    weeklySchedule: any;
    milestones: any[];
  };
  financialPlan: {
    targetBenefits: any[];
    applicationDeadlines: Date[];
    estimatedCoverage: number;
  };
  careerPath: {
    primaryOptions: any[];
    alternativeOptions: any[];
    preparationRequirements: string[];
  };
}

export interface PersonalizedAlert {
  id: string;
  type: 'deadline' | 'opportunity' | 'warning' | 'achievement';
  priority: 'high' | 'medium' | 'low';
  title: string;
  message: string;
  actionRequired: boolean;
  dueDate?: Date;
  relatedData?: any;
}

/**
 * Servicio Central de Educación - Reemplaza múltiples servicios dispersos
 * Utiliza directamente la base de datos SQL real en lugar de datos mock
 */
export class CentralizedEducationService {
  private static cache = new Map<string, { data: any; timestamp: number; ttl: number }>();

  /**
   * Dashboard Unificado - Reemplaza 5+ componentes separados
   */
  static async getUnifiedDashboard(userId: string): Promise<UnifiedDashboardData> {
    const cacheKey = `unified_dashboard_${userId}`;
    
    try {
      logger.info('CentralizedEducationService', 'Generando dashboard unificado', { userId });

      // Obtener datos en paralelo de la base de datos real
      const [profile, proximasFechas, beneficiosCompatibles, carrerasCompatibles, progresoEstudiante] = await Promise.all([
        this.getUserProfile(userId),
        this.getProximasFechasImportantes(userId),
        this.getBeneficiosCompatibles(userId),
        this.getCarrerasCompatibles(userId),
        this.getProgresoEstudiante(userId)
      ]);

      const unifiedData: UnifiedDashboardData = {
        personalInfo: {
          userId,
          profile,
          currentPhase: this.determineCurrentPhase(profile, proximasFechas)
        },
        timeline: {
          nextCriticalDate: proximasFechas[0] || null,
          upcomingDates: proximasFechas.slice(1, 6),
          urgentAlerts: proximasFechas.filter((fecha: any) => fecha.dias_restantes <= 3)
        },
        scholarships: {
          compatibleBenefits: beneficiosCompatibles,
          potentialSavings: this.calculatePotentialSavings(beneficiosCompatibles),
          applicationStatus: this.getApplicationStatus(userId, beneficiosCompatibles)
        },
        careers: {
          recommendations: carrerasCompatibles.slice(0, 5),
          compatibleCareers: carrerasCompatibles,
          searchSuggestions: this.generateSearchSuggestions(profile, carrerasCompatibles)
        },
        analytics: {
          overallProgress: progresoEstudiante.overallProgress,
          subjectStrengths: progresoEstudiante.subjectStrengths,
          areasForImprovement: progresoEstudiante.areasForImprovement,
          paesReadiness: this.calculatePaesReadiness(progresoEstudiante)
        }
      };

      this.setCache(cacheKey, unifiedData, 300000); // 5 minutos cache
      return unifiedData;

    } catch (error) {
      logger.error('CentralizedEducationService', 'Error generando dashboard unificado', error);
      throw error;
    }
  }

  /**
   * Calculador de Ruta Óptima - Integra estudios, finanzas y carrera
   */
  static async calculateOptimalPath(userId: string, preferences: any = {}): Promise<OptimalPathData> {
    try {
      logger.info('CentralizedEducationService', 'Calculando ruta óptima', { userId });

      const [profile, beneficios, carreras, progreso] = await Promise.all([
        this.getUserProfile(userId),
        this.getBeneficiosCompatibles(userId),
        this.getCarrerasCompatibles(userId),
        this.getProgresoEstudiante(userId)
      ]);

      // Algoritmo de optimización integrado
      const studyPlan = this.generateOptimalStudyPlan(progreso, preferences);
      const financialPlan = this.generateOptimalFinancialPlan(beneficios, carreras);
      const careerPath = this.generateOptimalCareerPath(carreras, progreso, preferences);

      return {
        studyPlan,
        financialPlan,
        careerPath
      };

    } catch (error) {
      logger.error('CentralizedEducationService', 'Error calculando ruta óptima', error);
      throw error;
    }
  }

  /**
   * Alertas Personalizadas - Sistema de notificaciones inteligente
   */
  static async getPersonalizedAlerts(userId: string): Promise<PersonalizedAlert[]> {
    try {
      const [fechas, beneficios, progreso] = await Promise.all([
        this.getProximasFechasImportantes(userId),
        this.getBeneficiosCompatibles(userId),
        this.getProgresoEstudiante(userId)
      ]);

      const alerts: PersonalizedAlert[] = [];

      // Alertas de fechas críticas
      fechas.forEach((fecha: any) => {
        if (fecha.dias_restantes <= 7) {
          alerts.push({
            id: `deadline_${fecha.fecha_id}`,
            type: 'deadline',
            priority: fecha.dias_restantes <= 3 ? 'high' : 'medium',
            title: `Fecha límite: ${fecha.proceso}`,
            message: `${fecha.descripcion} - Quedan ${fecha.dias_restantes} días`,
            actionRequired: true,
            dueDate: new Date(fecha.fecha_inicio),
            relatedData: fecha
          });
        }
      });

      // Alertas de oportunidades de becas
      beneficios.forEach((beneficio: any) => {
        if (beneficio.compatibilidad >= 80 && beneficio.estado_postulacion === 'ABIERTA') {
          alerts.push({
            id: `opportunity_${beneficio.beneficio_id}`,
            type: 'opportunity',
            priority: 'high',
            title: `Oportunidad: ${beneficio.nombre}`,
            message: `Tienes ${beneficio.compatibilidad}% de compatibilidad con esta beca`,
            actionRequired: true,
            relatedData: beneficio
          });
        }
      });

      // Alertas de progreso académico
      if (progreso.overallProgress < 40) {
        alerts.push({
          id: `progress_warning`,
          type: 'warning',
          priority: 'high',
          title: 'Progreso Bajo Detectado',
          message: 'Tu progreso actual requiere atención para alcanzar tus metas PAES',
          actionRequired: true,
          relatedData: progreso
        });
      }

      return alerts.sort((a, b) => {
        const priorityOrder = { high: 3, medium: 2, low: 1 };
        return priorityOrder[b.priority] - priorityOrder[a.priority];
      });

    } catch (error) {
      logger.error('CentralizedEducationService', 'Error generando alertas personalizadas', error);
      return [];
    }
  }

  /**
   * Exportador Completo - Reportes unificados
   */
  static async exportCompleteReport(userId: string, format: 'pdf' | 'excel' | 'json'): Promise<Blob> {
    try {
      const [dashboard, optimalPath, alerts] = await Promise.all([
        this.getUnifiedDashboard(userId),
        this.calculateOptimalPath(userId),
        this.getPersonalizedAlerts(userId)
      ]);

      const completeReport = {
        generatedAt: new Date().toISOString(),
        userId,
        dashboard,
        optimalPath,
        alerts,
        metadata: {
          version: '2.0',
          source: 'PAES Master Unified System'
        }
      };

      let content: string;
      let mimeType: string;

      switch (format) {
        case 'json':
          content = JSON.stringify(completeReport, null, 2);
          mimeType = 'application/json';
          break;
        case 'excel':
          content = this.generateExcelReport(completeReport);
          mimeType = 'application/vnd.ms-excel';
          break;
        case 'pdf':
          content = this.generatePDFReport(completeReport);
          mimeType = 'application/pdf';
          break;
        default:
          throw new Error(`Formato no soportado: ${format}`);
      }

      return new Blob([content], { type: mimeType });

    } catch (error) {
      logger.error('CentralizedEducationService', 'Error exportando reporte completo', error);
      throw error;
    }
  }

  // Métodos auxiliares privados
  private static async getUserProfile(userId: string): Promise<any> {
    const { data } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', userId)
      .single();
    return data;
  }

  private static async getProximasFechasImportantes(userId: string): Promise<any[]> {
    const { data } = await supabase
      .rpc('proximas_fechas_estudiante', { p_dias_adelante: 30 });
    return data || [];
  }

  private static async getBeneficiosCompatibles(userId: string): Promise<any[]> {
    const profile = await this.getUserProfile(userId);
    const quintil = profile?.rsh_quintil || 5;
    const puntajePaes = profile?.puntaje_paes_estimado || 500;
    const promedioNm = profile?.promedio_nm || 5.5;

    const { data } = await supabase
      .rpc('beneficios_compatibles', {
        p_quintil_rsh: quintil,
        p_puntaje_paes: puntajePaes,
        p_promedio_nm: promedioNm
      });
    return data || [];
  }

  private static async getCarrerasCompatibles(userId: string): Promise<any[]> {
    const profile = await this.getUserProfile(userId);
    const puntajes = {
      cl: profile?.puntaje_cl || 500,
      m1: profile?.puntaje_m1 || 500,
      m2: profile?.puntaje_m2 || 500,
      cs: profile?.puntaje_cs || 500,
      hcs: profile?.puntaje_hcs || 500
    };

    const { data } = await supabase
      .rpc('carreras_compatibles_paes', {
        puntaje_cl: puntajes.cl,
        puntaje_m1: puntajes.m1,
        puntaje_m2: puntajes.m2,
        puntaje_cs: puntajes.cs,
        puntaje_hcs: puntajes.hcs,
        promedio_nem: profile?.promedio_nm || 5.5,
        ranking: profile?.ranking || 60
      });
    return data || [];
  }

  private static async getProgresoEstudiante(userId: string): Promise<any> {
    const { data: nodeProgress } = await supabase
      .from('user_node_progress')
      .select('*')
      .eq('user_id', userId);

    const { data: diagnosticResults } = await supabase
      .from('user_diagnostic_results')
      .select('*')
      .eq('user_id', userId)
      .order('completed_at', { ascending: false })
      .limit(1);

    return this.analyzeStudentProgress(nodeProgress || [], diagnosticResults || []);
  }

  private static analyzeStudentProgress(nodeProgress: any[], diagnosticResults: any[]): any {
    const totalNodes = nodeProgress.length;
    const completedNodes = nodeProgress.filter(node => node.status === 'completed').length;
    const overallProgress = totalNodes > 0 ? (completedNodes / totalNodes) * 100 : 0;

    const subjectProgress = nodeProgress.reduce((acc, node) => {
      if (!acc[node.subject_area]) acc[node.subject_area] = [];
      acc[node.subject_area].push(node.progress);
      return acc;
    }, {});

    const subjectAverages = Object.entries(subjectProgress).map(([subject, progresses]: [string, any[]]) => ({
      subject,
      average: progresses.reduce((sum, p) => sum + p, 0) / progresses.length
    }));

    const sortedByPerformance = subjectAverages.sort((a, b) => b.average - a.average);

    return {
      overallProgress,
      subjectStrengths: sortedByPerformance.slice(0, 3).map(s => s.subject),
      areasForImprovement: sortedByPerformance.slice(-3).map(s => s.subject),
      totalNodes,
      completedNodes,
      diagnosticResults: diagnosticResults[0] || null
    };
  }

  private static determineCurrentPhase(profile: any, proximasFechas: any[]): string {
    if (!proximasFechas.length) return 'preparation';
    
    const nextDate = proximasFechas[0];
    if (nextDate.proceso.includes('PAES') && nextDate.tipo_fecha === 'rendicion') {
      return 'evaluation';
    }
    if (nextDate.proceso.includes('Admisión') && nextDate.tipo_fecha === 'postulacion') {
      return 'application';
    }
    if (nextDate.proceso.includes('FUAS')) {
      return 'financial_aid';
    }
    return 'preparation';
  }

  private static calculatePotentialSavings(beneficios: any[]): number {
    return beneficios.reduce((total, beneficio) => {
      return total + (beneficio.monto_anual || 0);
    }, 0);
  }

  private static getApplicationStatus(userId: string, beneficios: any[]): string {
    // Lógica simplificada - en producción consultaría tabla de postulaciones
    if (beneficios.some(b => b.estado_postulacion === 'ABIERTA')) {
      return 'pending_applications';
    }
    return 'no_applications';
  }

  private static generateSearchSuggestions(profile: any, carreras: any[]): string[] {
    const suggestions = [];
    if (carreras.length > 0) {
      const areas = [...new Set(carreras.map(c => c.area_conocimiento))];
      suggestions.push(...areas.slice(0, 3));
    }
    return suggestions;
  }

  private static calculatePaesReadiness(progreso: any): number {
    const progressWeight = 0.6;
    const diagnosticWeight = 0.4;
    
    const progressScore = progreso.overallProgress;
    const diagnosticScore = progreso.diagnosticResults?.results ? 
      Object.values(progreso.diagnosticResults.results).reduce((sum: number, score: any) => sum + score, 0) / 
      Object.keys(progreso.diagnosticResults.results).length : 500;
    
    const normalizedDiagnostic = Math.max(0, Math.min(100, (diagnosticScore - 150) / (850 - 150) * 100));
    
    return Math.round(progressScore * progressWeight + normalizedDiagnostic * diagnosticWeight);
  }

  private static generateOptimalStudyPlan(progreso: any, preferences: any): any {
    return {
      prioritySubjects: progreso.areasForImprovement,
      weeklySchedule: this.generateWeeklySchedule(progreso, preferences),
      milestones: this.generateMilestones(progreso)
    };
  }

  private static generateOptimalFinancialPlan(beneficios: any[], carreras: any[]): any {
    const priorityBenefits = beneficios
      .filter(b => b.compatibilidad >= 70)
      .sort((a, b) => b.monto_anual - a.monto_anual)
      .slice(0, 3);

    return {
      targetBenefits: priorityBenefits,
      applicationDeadlines: priorityBenefits.map(b => new Date(b.fecha_cierre)),
      estimatedCoverage: this.calculateCoveragePercentage(priorityBenefits, carreras)
    };
  }

  private static generateOptimalCareerPath(carreras: any[], progreso: any, preferences: any): any {
    const strongSubjects = progreso.subjectStrengths;
    const alignedCareers = carreras.filter(carrera => 
      strongSubjects.some(subject => carrera.descripcion?.includes(subject))
    );

    return {
      primaryOptions: alignedCareers.slice(0, 3),
      alternativeOptions: carreras.slice(0, 5),
      preparationRequirements: this.generatePreparationRequirements(alignedCareers, progreso)
    };
  }

  private static generateWeeklySchedule(progreso: any, preferences: any): any {
    // Algoritmo simplificado de distribución semanal
    const subjects = progreso.areasForImprovement;
    const totalHours = preferences.weeklyHours || 20;
    const hoursPerSubject = Math.floor(totalHours / subjects.length);

    return subjects.reduce((schedule: any, subject: string, index: number) => {
      schedule[subject] = {
        hours: hoursPerSubject,
        days: ['lunes', 'miércoles', 'viernes'].slice(0, Math.ceil(hoursPerSubject / 2)),
        focus: 'improvement'
      };
      return schedule;
    }, {});
  }

  private static generateMilestones(progreso: any): any[] {
    return [
      {
        id: 'diagnostic_improvement',
        title: 'Mejorar áreas débiles',
        target: 'Aumentar 10% progreso en materias con menor rendimiento',
        deadline: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000), // 30 días
        priority: 'high'
      },
      {
        id: 'paes_preparation',
        title: 'Preparación PAES completa',
        target: 'Alcanzar 80% de preparación general',
        deadline: new Date('2024-11-01'),
        priority: 'medium'
      }
    ];
  }

  private static calculateCoveragePercentage(beneficios: any[], carreras: any[]): number {
    if (!carreras.length) return 0;
    
    const avgArancel = carreras.reduce((sum, c) => sum + (c.arancel_anual || 3000000), 0) / carreras.length;
    const totalBeneficios = beneficios.reduce((sum, b) => sum + (b.monto_anual || 0), 0);
    
    return Math.min(100, Math.round((totalBeneficios / avgArancel) * 100));
  }

  private static generatePreparationRequirements(carreras: any[], progreso: any): string[] {
    const requirements = [];
    
    if (progreso.overallProgress < 60) {
      requirements.push('Completar diagnóstico académico');
    }
    
    if (carreras.some((c: any) => c.puntaje_corte_2024 > 600)) {
      requirements.push('Intensificar preparación PAES');
    }
    
    requirements.push('Revisar requisitos específicos de postulación');
    
    return requirements;
  }

  private static generateExcelReport(data: any): string {
    // Implementación simplificada - generar CSV
    const lines = [
      'Sección,Métrica,Valor',
      `Dashboard,Progreso General,${data.dashboard.analytics.overallProgress}%`,
      `Dashboard,Preparación PAES,${data.dashboard.analytics.paesReadiness}%`,
      `Becas,Beneficios Compatibles,${data.dashboard.scholarships.compatibleBenefits.length}`,
      `Becas,Ahorro Potencial,$${data.dashboard.scholarships.potentialSavings.toLocaleString()}`,
      `Carreras,Recomendaciones,${data.dashboard.careers.recommendations.length}`,
      `Alertas,Total Alertas,${data.alerts.length}`,
      `Alertas,Alertas Urgentes,${data.alerts.filter((a: any) => a.priority === 'high').length}`
    ];
    
    return lines.join('\n');
  }

  private static generatePDFReport(data: any): string {
    // Implementación simplificada - generar texto plano
    return `
REPORTE UNIFICADO PAES MASTER
==============================

INFORMACIÓN PERSONAL
Usuario: ${data.userId}
Fase Actual: ${data.dashboard.personalInfo.currentPhase}
Generado: ${data.generatedAt}

MÉTRICAS ACADÉMICAS
Progreso General: ${data.dashboard.analytics.overallProgress}%
Preparación PAES: ${data.dashboard.analytics.paesReadiness}%
Fortalezas: ${data.dashboard.analytics.subjectStrengths.join(', ')}
Áreas de Mejora: ${data.dashboard.analytics.areasForImprovement.join(', ')}

BENEFICIOS DISPONIBLES
Beneficios Compatibles: ${data.dashboard.scholarships.compatibleBenefits.length}
Ahorro Potencial: $${data.dashboard.scholarships.potentialSavings.toLocaleString()}

RECOMENDACIONES DE CARRERA
Total Carreras Compatibles: ${data.dashboard.careers.compatibleCareers.length}
Principales Recomendaciones: ${data.dashboard.careers.recommendations.slice(0, 3).map((c: any) => c.nombre).join(', ')}

ALERTAS IMPORTANTES
Total Alertas: ${data.alerts.length}
Alertas Urgentes: ${data.alerts.filter((a: any) => a.priority === 'high').length}

PRÓXIMAS FECHAS CRÍTICAS
${data.dashboard.timeline.upcomingDates.map((f: any) => `- ${f.proceso}: ${f.fecha_inicio} (${f.dias_restantes} días)`).join('\n')}
`;
  }

  private static setCache(key: string, data: any, ttl: number): void {
    this.cache.set(key, {
      data,
      timestamp: Date.now(),
      ttl
    });
  }

  private static getCache(key: string): any | null {
    const cached = this.cache.get(key);
    if (cached && Date.now() - cached.timestamp < cached.ttl) {
      return cached.data;
    }
    this.cache.delete(key);
    return null;
  }

  /**
   * Limpieza de cache
   */
  static clearCache(): void {
    this.cache.clear();
    logger.info('CentralizedEducationService', 'Cache limpiado');
  }
}
