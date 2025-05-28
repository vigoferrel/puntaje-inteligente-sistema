
import { AdaptiveRecommendation, UserProgressData, MaterialGenerationConfig } from '@/types/material-generation';
import { TPAESHabilidad, TLearningCyclePhase } from '@/types/system-types';

export class AdaptiveRecommendationEngine {
  
  static generateRecommendations(
    userProgress: UserProgressData,
    subject: string
  ): AdaptiveRecommendation[] {
    const recommendations: AdaptiveRecommendation[] = [];

    // Recomendaciones basadas en áreas débiles
    if (userProgress.weakAreas.length > 0) {
      recommendations.push(...this.createWeakAreaRecommendations(userProgress, subject));
    }

    // Recomendaciones basadas en la fase actual
    recommendations.push(...this.createPhaseBasedRecommendations(userProgress, subject));

    // Recomendaciones de evaluación periódica
    if (this.shouldRecommendAssessment(userProgress)) {
      recommendations.push(this.createAssessmentRecommendation(subject));
    }

    return recommendations.sort((a, b) => this.getPriorityWeight(a.priority) - this.getPriorityWeight(b.priority));
  }

  private static createWeakAreaRecommendations(
    userProgress: UserProgressData,
    subject: string
  ): AdaptiveRecommendation[] {
    return userProgress.weakAreas.slice(0, 2).map(skillCode => {
      const skill = this.mapSkillCodeToHabilidad(skillCode);
      return {
        id: `weak-${skillCode}-${Date.now()}`,
        type: 'exercises' as const,
        title: `Refuerzo en ${this.getSkillName(skill)}`,
        description: `Ejercicios específicos para mejorar tu desempeño en ${this.getSkillName(skill)}`,
        priority: 'high' as const,
        estimatedTime: 15,
        config: {
          materialType: 'exercises',
          subject,
          skill,
          phase: userProgress.currentPhase,
          count: 5,
          difficulty: 'INTERMEDIO',
          mode: 'hybrid',
          useOfficialContent: true,
          includeContext: true,
          prueba: subject as any
        },
        reasoning: `Detectamos que necesitas reforzar esta habilidad basado en tu progreso actual`
      };
    });
  }

  private static createPhaseBasedRecommendations(
    userProgress: UserProgressData,
    subject: string
  ): AdaptiveRecommendation[] => {
    const phaseRecommendations: Partial<Record<TLearningCyclePhase, AdaptiveRecommendation>> = {
      'EXPERIENCIA_CONCRETA': {
        id: `phase-ec-${Date.now()}`,
        type: 'exercises',
        title: 'Práctica Inicial',
        description: 'Ejercicios básicos para familiarizarte con los conceptos',
        priority: 'medium',
        estimatedTime: 20,
        config: {
          materialType: 'exercises',
          subject,
          phase: userProgress.currentPhase,
          count: 3,
          difficulty: 'BASICO',
          mode: 'official',
          useOfficialContent: true,
          includeContext: true,
          prueba: subject as any
        },
        reasoning: 'Fase de experiencia concreta: enfoque en práctica básica'
      },
      'OBSERVACION_REFLEXIVA': {
        id: `phase-or-${Date.now()}`,
        type: 'study_content',
        title: 'Material de Reflexión',
        description: 'Contenido teórico para analizar patrones y estrategias',
        priority: 'medium',
        estimatedTime: 25,
        config: {
          materialType: 'study_content',
          subject,
          phase: userProgress.currentPhase,
          count: 2,
          difficulty: 'INTERMEDIO',
          mode: 'hybrid',
          useOfficialContent: true,
          includeContext: true,
          prueba: subject as any
        },
        reasoning: 'Fase de observación reflexiva: análisis de patrones'
      },
      'CONCEPTUALIZACION_ABSTRACTA': {
        id: `phase-ca-${Date.now()}`,
        type: 'study_content',
        title: 'Conceptos Avanzados',
        description: 'Material teórico profundo para consolidar conocimientos',
        priority: 'medium',
        estimatedTime: 30,
        config: {
          materialType: 'study_content',
          subject,
          phase: userProgress.currentPhase,
          count: 3,
          difficulty: 'AVANZADO',
          mode: 'official',
          useOfficialContent: true,
          includeContext: true,
          prueba: subject as any
        },
        reasoning: 'Fase de conceptualización abstracta: teoría profunda'
      },
      'EXPERIMENTACION_ACTIVA': {
        id: `phase-ea-${Date.now()}`,
        type: 'practice_test',
        title: 'Simulacro de Examen',
        description: 'Práctica intensiva con condiciones de examen real',
        priority: 'high',
        estimatedTime: 45,
        config: {
          materialType: 'assessment',
          subject,
          phase: userProgress.currentPhase,
          count: 10,
          difficulty: 'INTERMEDIO',
          mode: 'official',
          useOfficialContent: true,
          includeContext: false,
          prueba: subject as any
        },
        reasoning: 'Fase de experimentación activa: aplicación práctica'
      },
      'DIAGNOSIS': {
        id: `phase-diag-${Date.now()}`,
        type: 'assessment',
        title: 'Diagnóstico Inicial',
        description: 'Evaluación para identificar tu nivel actual',
        priority: 'high',
        estimatedTime: 30,
        config: {
          materialType: 'assessment',
          subject,
          phase: userProgress.currentPhase,
          count: 10,
          difficulty: 'INTERMEDIO',
          mode: 'official',
          useOfficialContent: true,
          includeContext: true,
          prueba: subject as any
        },
        reasoning: 'Fase de diagnóstico: evaluación inicial'
      }
    };

    const recommendation = phaseRecommendations[userProgress.currentPhase];
    return recommendation ? [recommendation] : [];
  }

  private static createAssessmentRecommendation(subject: string): AdaptiveRecommendation {
    return {
      id: `assessment-${Date.now()}`,
      type: 'assessment',
      title: 'Evaluación de Progreso',
      description: 'Test diagnóstico para medir tu avance actual',
      priority: 'medium',
      estimatedTime: 20,
      config: {
        materialType: 'assessment',
        subject,
        count: 8,
        difficulty: 'INTERMEDIO',
        mode: 'official',
        useOfficialContent: true,
        includeContext: true,
        prueba: subject as any,
        phase: 'DIAGNOSIS' as const
      },
      reasoning: 'Es momento de evaluar tu progreso actual'
    };
  }

  private static shouldRecommendAssessment(userProgress: UserProgressData): boolean {
    const daysSinceLastActivity = Math.floor(
      (Date.now() - userProgress.lastActivity.getTime()) / (1000 * 60 * 60 * 24)
    );
    return daysSinceLastActivity >= 3 || userProgress.completedNodes.length % 5 === 0;
  }

  private static mapSkillCodeToHabilidad(skillCode: string): TPAESHabilidad {
    // Map skill codes to TPAESHabilidad enum values
    const mapping: Record<string, TPAESHabilidad> = {
      'TRACK_LOCATE': 'TRACK_LOCATE',
      'INTERPRET_RELATE': 'INTERPRET_RELATE',
      'EVALUATE_REFLECT': 'EVALUATE_REFLECT',
      // Add more mappings as needed
    };
    return mapping[skillCode] || 'INTERPRET_RELATE';
  }

  private static getSkillName(skill: TPAESHabilidad): string {
    const skillNames: Record<TPAESHabilidad, string> = {
      'TRACK_LOCATE': 'Localizar Información',
      'INTERPRET_RELATE': 'Interpretar y Relacionar',
      'EVALUATE_REFLECT': 'Evaluar y Reflexionar',
      'SOLVE_PROBLEMS': 'Resolución de Problemas',
      'REPRESENT': 'Representación',
      'MODEL': 'Modelamiento',
      'ARGUE_COMMUNICATE': 'Argumentación',
      'IDENTIFY_THEORIES': 'Identificación de Teorías',
      'PROCESS_ANALYZE': 'Procesar y Analizar',
      'APPLY_PRINCIPLES': 'Aplicar Principios',
      'SCIENTIFIC_ARGUMENT': 'Argumentación Científica',
      'TEMPORAL_THINKING': 'Pensamiento Temporal',
      'SOURCE_ANALYSIS': 'Análisis de Fuentes',
      'MULTICAUSAL_ANALYSIS': 'Análisis Multicausal',
      'CRITICAL_THINKING': 'Pensamiento Crítico',
      'REFLECTION': 'Reflexión'
    };
    return skillNames[skill] || skill;
  }

  private static getPriorityWeight(priority: string): number {
    const weights = { 'high': 1, 'medium': 2, 'low': 3 };
    return weights[priority as keyof typeof weights] || 2;
  }
}
