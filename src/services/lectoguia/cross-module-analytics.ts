
import { IntersectionalState, IntersectionalRecommendation } from '@/types/intersectional-types';

/**
 * Servicio de análisis interseccional
 * Genera insights y recomendaciones basadas en datos de múltiples módulos
 */
export class CrossModuleAnalyticsService {
  private static instance: CrossModuleAnalyticsService;
  
  static getInstance(): CrossModuleAnalyticsService {
    if (!CrossModuleAnalyticsService.instance) {
      CrossModuleAnalyticsService.instance = new CrossModuleAnalyticsService();
    }
    return CrossModuleAnalyticsService.instance;
  }

  /**
   * Analiza el estado interseccional y genera recomendaciones
   */
  generateRecommendations(state: IntersectionalState): IntersectionalRecommendation[] {
    const recommendations: IntersectionalRecommendation[] = [];
    
    // Análisis de rendimiento académico vs objetivos financieros
    if (state.context.financialGoals && state.modules.exercise.performance < 70) {
      recommendations.push({
        id: 'improve-for-career',
        type: 'exercise',
        title: 'Mejorar rendimiento para carrera objetivo',
        description: `Tu rendimiento actual (${state.modules.exercise.performance}%) puede afectar el acceso a ${state.context.financialGoals.targetCareer}`,
        priority: 90,
        estimatedTime: 30,
        module: 'exercise',
        action: () => this.triggerIntensiveTraining(state.context.currentSubject)
      });
    }
    
    // Análisis de coherencia entre plan de estudio y progreso
    if (state.ecosystem.planning.alignment < 60) {
      recommendations.push({
        id: 'align-study-plan',
        type: 'study_plan',
        title: 'Alinear plan de estudio',
        description: 'Tu progreso no está alineado con tu plan de estudio actual',
        priority: 75,
        estimatedTime: 15,
        module: 'planning',
        action: () => this.adjustStudyPlan(state)
      });
    }
    
    // Análisis de necesidad de diagnóstico
    if (!state.ecosystem.diagnostic.lastAssessment || 
        this.daysSince(state.ecosystem.diagnostic.lastAssessment) > 14) {
      recommendations.push({
        id: 'diagnostic-assessment',
        type: 'diagnostic_test',
        title: 'Realizar evaluación diagnóstica',
        description: 'Es momento de evaluar tu progreso con un diagnóstico actualizado',
        priority: 60,
        estimatedTime: 45,
        module: 'diagnostic',
        action: () => this.scheduleDiagnostic()
      });
    }
    
    // Análisis financiero basado en rendimiento
    if (state.context.crossModuleMetrics.averagePerformance > 85 && 
        !state.context.financialGoals?.scholarshipNeeds) {
      recommendations.push({
        id: 'explore-scholarships',
        type: 'financial_action',
        title: 'Explorar becas de excelencia',
        description: 'Tu alto rendimiento te califica para becas adicionales',
        priority: 55,
        estimatedTime: 20,
        module: 'financial',
        action: () => this.exploreScholarships(state.context.crossModuleMetrics.averagePerformance)
      });
    }
    
    return recommendations.sort((a, b) => b.priority - a.priority);
  }

  /**
   * Calcula métricas de sincronización entre módulos
   */
  calculateSyncMetrics(state: IntersectionalState) {
    const now = new Date().getTime();
    
    const moduleSyncScores = Object.entries(state.modules).map(([key, module]) => {
      const timeSinceUpdate = now - module.lastUpdated.getTime();
      const syncScore = Math.max(0, 100 - (timeSinceUpdate / 60000)); // Decay por minuto
      
      return {
        module: key,
        syncScore,
        performance: module.performance,
        needsAttention: module.needsAttention
      };
    });
    
    const overallSync = moduleSyncScores.reduce((acc, m) => acc + m.syncScore, 0) / moduleSyncScores.length;
    
    return {
      overallSync,
      moduleScores: moduleSyncScores,
      ecosystemHealth: this.calculateEcosystemHealth(state),
      recommendations: this.generateRecommendations(state)
    };
  }

  /**
   * Evalúa la salud del ecosistema completo
   */
  private calculateEcosystemHealth(state: IntersectionalState): number {
    const connections = Object.values(state.ecosystem);
    const connectedCount = connections.filter(c => c.connected).length;
    const connectionHealth = (connectedCount / connections.length) * 100;
    
    const moduleHealth = Object.values(state.modules)
      .reduce((acc, m) => acc + m.performance, 0) / Object.keys(state.modules).length;
    
    return (connectionHealth + moduleHealth) / 2;
  }

  /**
   * Detecta patrones interseccionales en el comportamiento del usuario
   */
  detectIntersectionalPatterns(state: IntersectionalState) {
    const patterns = [];
    
    // Patrón: Alto rendimiento en ejercicios pero baja participación en chat
    if (state.modules.exercise.performance > 80 && state.modules.chat.messageCount < 5) {
      patterns.push({
        type: 'engagement_mismatch',
        description: 'Usuario prefiere ejercicios sobre conversación',
        recommendation: 'Sugerir ejercicios con más feedback conversacional'
      });
    }
    
    // Patrón: Progreso estancado en múltiples módulos
    const stagnantModules = Object.values(state.modules).filter(m => m.needsAttention);
    if (stagnantModules.length >= 2) {
      patterns.push({
        type: 'multi_module_stagnation',
        description: 'Estancamiento en múltiples áreas',
        recommendation: 'Implementar estrategia de motivación interseccional'
      });
    }
    
    return patterns;
  }

  // Métodos de acción
  private triggerIntensiveTraining(subject: string) {
    console.log(`🎯 Activando entrenamiento intensivo para ${subject}`);
  }

  private adjustStudyPlan(state: IntersectionalState) {
    console.log('📚 Ajustando plan de estudio basado en progreso actual');
  }

  private scheduleDiagnostic() {
    console.log('📊 Programando evaluación diagnóstica');
  }

  private exploreScholarships(performance: number) {
    console.log(`💰 Explorando becas para rendimiento ${performance}%`);
  }

  private daysSince(date: Date | null): number {
    if (!date) return Infinity;
    return Math.floor((Date.now() - date.getTime()) / (1000 * 60 * 60 * 24));
  }
}

export const crossModuleAnalytics = CrossModuleAnalyticsService.getInstance();
