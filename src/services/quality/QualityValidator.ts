import { Exercise } from '@/types/ai-types';
import { TPAESPrueba, TPAESHabilidad } from '@/types/system-types';

export interface QualityMetrics {
  contentAccuracy: number;
  paesCompliance: number;
  difficultyConsistency: number;
  subjectRelevance: number;
  overallScore: number;
}

export interface QualityValidationResult {
  isValid: boolean;
  metrics: QualityMetrics;
  issues: string[];
  recommendations: string[];
  source: 'oficial' | 'ai_generated' | 'hybrid';
}

/**
 * Sistema de Validación de Calidad para Ejercicios PAES
 */
export class QualityValidator {
  private static instance: QualityValidator;
  
  static getInstance(): QualityValidator {
    if (!QualityValidator.instance) {
      QualityValidator.instance = new QualityValidator();
    }
    return QualityValidator.instance;
  }

  /**
   * Valida un ejercicio según estándares PAES
   */
  async validateExercise(exercise: Exercise, prueba: TPAESPrueba, skill: TPAESHabilidad): Promise<QualityValidationResult> {
    console.log(`🔍 Validando ejercicio para ${prueba}/${skill}`);
    
    const metrics = await this.calculateMetrics(exercise, prueba, skill);
    const issues = this.identifyIssues(exercise, prueba, skill);
    const recommendations = this.generateRecommendations(exercise, metrics, issues);
    
    const overallScore = this.calculateOverallScore(metrics);
    const isValid = overallScore >= 0.7; // 70% mínimo para considerar válido
    
    return {
      isValid,
      metrics: { ...metrics, overallScore },
      issues,
      recommendations,
      source: this.determineSource(exercise)
    };
  }

  /**
   * Calcula métricas de calidad específicas
   */
  private async calculateMetrics(exercise: Exercise, prueba: TPAESPrueba, skill: TPAESHabilidad): Promise<Omit<QualityMetrics, 'overallScore'>> {
    return Promise.resolve({
      contentAccuracy: this.validateContentAccuracy(exercise),
      paesCompliance: this.validatePAESCompliance(exercise, prueba),
      difficultyConsistency: this.validateDifficultyConsistency(exercise),
      subjectRelevance: this.validateSubjectRelevance(exercise, prueba, skill)
    });
  }

  /**
   * Valida precisión del contenido
   */
  private validateContentAccuracy(exercise: Exercise): number {
    let score = 1.0;
    
    // Verificar estructura básica
    if (!exercise.question || exercise.question.length < 20) score -= 0.2;
    if (!exercise.options || exercise.options.length !== 4) score -= 0.3;
    if (!exercise.correctAnswer) score -= 0.3;
    if (!exercise.explanation || exercise.explanation.length < 30) score -= 0.2;
    
    // Verificar calidad del contenido
    if (exercise.question.includes('placeholder') || exercise.question.includes('ejemplo')) score -= 0.2;
    if (exercise.options.some(opt => opt.includes('opción') && opt.length < 10)) score -= 0.1;
    
    return Math.max(0, score);
  }

  /**
   * Valida cumplimiento con estándares PAES
   */
  private validatePAESCompliance(exercise: Exercise, prueba: TPAESPrueba): number {
    let score = 1.0;
    
    const subjectRequirements = this.getSubjectRequirements(prueba);
    
    // Verificar formato de alternativas
    if (!exercise.options.every(opt => /^[A-D]\)/.test(opt))) {
      score -= 0.2;
    }
    
    // Verificar longitud apropiada de pregunta
    const questionLength = exercise.question.length;
    if (questionLength < subjectRequirements.minQuestionLength || questionLength > subjectRequirements.maxQuestionLength) {
      score -= 0.1;
    }
    
    // Verificar presencia de contexto si es requerido
    if (subjectRequirements.requiresContext && !exercise.question.includes('\n\n')) {
      score -= 0.2;
    }
    
    return Math.max(0, score);
  }

  /**
   * Valida consistencia de dificultad
   */
  private validateDifficultyConsistency(exercise: Exercise): number {
    const difficulty = exercise.difficulty;
    let score = 1.0;
    
    // Verificar que la dificultad coincida con la complejidad del contenido
    const complexity = this.assessContentComplexity(exercise);
    const expectedComplexity = this.mapDifficultyToComplexity(difficulty);
    
    const complexityDiff = Math.abs(complexity - expectedComplexity);
    if (complexityDiff > 0.3) score -= 0.4;
    
    return Math.max(0, score);
  }

  /**
   * Valida relevancia por materia
   */
  private validateSubjectRelevance(exercise: Exercise, prueba: TPAESPrueba, skill: TPAESHabilidad): number {
    let score = 1.0;
    
    const subjectKeywords = this.getSubjectKeywords(prueba);
    const skillKeywords = this.getSkillKeywords(skill);
    
    const content = (exercise.question + ' ' + exercise.options.join(' ')).toLowerCase();
    
    // Verificar presencia de palabras clave de la materia
    const subjectMatches = subjectKeywords.filter(keyword => content.includes(keyword.toLowerCase()));
    if (subjectMatches.length === 0) score -= 0.3;
    
    // Verificar presencia de palabras clave de la habilidad
    const skillMatches = skillKeywords.filter(keyword => content.includes(keyword.toLowerCase()));
    if (skillMatches.length === 0) score -= 0.2;
    
    return Math.max(0, score);
  }

  /**
   * Identifica problemas específicos
   */
  private identifyIssues(exercise: Exercise, prueba: TPAESPrueba, skill: TPAESHabilidad): string[] {
    const issues: string[] = [];
    
    // Verificar estructura
    if (exercise.options.length !== 4) {
      issues.push('El ejercicio debe tener exactamente 4 alternativas');
    }
    
    if (!exercise.options.every(opt => /^[A-D]\)/.test(opt))) {
      issues.push('Las alternativas deben seguir el formato A), B), C), D)');
    }
    
    // Verificar contenido específico por materia
    const subjectIssues = this.checkSubjectSpecificIssues(exercise, prueba);
    issues.push(...subjectIssues);
    
    // Verificar habilidad específica
    const skillIssues = this.checkSkillSpecificIssues(exercise, skill);
    issues.push(...skillIssues);
    
    return issues;
  }

  /**
   * Genera recomendaciones de mejora
   */
  private generateRecommendations(exercise: Exercise, metrics: Omit<QualityMetrics, 'overallScore'>, issues: string[]): string[] {
    const recommendations: string[] = [];
    
    if (metrics.contentAccuracy < 0.7) {
      recommendations.push('Mejorar la estructura y completitud del contenido');
    }
    
    if (metrics.paesCompliance < 0.7) {
      recommendations.push('Ajustar el formato para cumplir estándares PAES');
    }
    
    if (metrics.difficultyConsistency < 0.7) {
      recommendations.push('Revisar la consistencia entre dificultad declarada y contenido');
    }
    
    if (metrics.subjectRelevance < 0.7) {
      recommendations.push('Incluir más contenido específico de la materia y habilidad');
    }
    
    if (issues.length > 0) {
      recommendations.push('Corregir los problemas estructurales identificados');
    }
    
    return recommendations;
  }

  // Métodos auxiliares
  private calculateOverallScore(metrics: Omit<QualityMetrics, 'overallScore'>): number {
    const weights = {
      contentAccuracy: 0.3,
      paesCompliance: 0.25,
      difficultyConsistency: 0.25,
      subjectRelevance: 0.2
    };
    
    return (
      metrics.contentAccuracy * weights.contentAccuracy +
      metrics.paesCompliance * weights.paesCompliance +
      metrics.difficultyConsistency * weights.difficultyConsistency +
      metrics.subjectRelevance * weights.subjectRelevance
    );
  }

  private determineSource(exercise: Exercise): 'oficial' | 'ai_generated' | 'hybrid' {
    const exerciseId = exercise.id;
    
    // Convertir a string si es number para poder usar startsWith
    const idString = exerciseId ? String(exerciseId) : '';
    
    if (idString.startsWith('paes-') || idString.startsWith('oficial-')) {
      return 'oficial';
    }
    if (exercise.explanation?.includes('Esta pregunta fue generada')) {
      return 'ai_generated';
    }
    return 'hybrid';
  }

  private getSubjectRequirements(prueba: TPAESPrueba) {
    const requirements = {
      'COMPETENCIA_LECTORA': {
        minQuestionLength: 100,
        maxQuestionLength: 800,
        requiresContext: true
      },
      'MATEMATICA_1': {
        minQuestionLength: 50,
        maxQuestionLength: 400,
        requiresContext: false
      },
      'MATEMATICA_2': {
        minQuestionLength: 50,
        maxQuestionLength: 400,
        requiresContext: false
      },
      'CIENCIAS': {
        minQuestionLength: 80,
        maxQuestionLength: 600,
        requiresContext: true
      },
      'HISTORIA': {
        minQuestionLength: 80,
        maxQuestionLength: 600,
        requiresContext: true
      }
    };
    
    return requirements[prueba] || requirements['COMPETENCIA_LECTORA'];
  }

  private getSubjectKeywords(prueba: TPAESPrueba): string[] {
    const keywords = {
      'COMPETENCIA_LECTORA': ['texto', 'lectura', 'comprensión', 'interpretación', 'análisis'],
      'MATEMATICA_1': ['número', 'operación', 'ecuación', 'geometría', 'álgebra'],
      'MATEMATICA_2': ['función', 'derivada', 'integral', 'límite', 'probabilidad'],
      'CIENCIAS': ['célula', 'átomo', 'energía', 'fuerza', 'reacción', 'experimento'],
      'HISTORIA': ['siglo', 'período', 'sociedad', 'política', 'cultura', 'proceso']
    };
    
    return keywords[prueba] || [];
  }

  private getSkillKeywords(skill: TPAESHabilidad): string[] {
    const keywords = {
      'TRACK_LOCATE': ['localizar', 'encontrar', 'identificar', 'ubicar'],
      'INTERPRET_RELATE': ['interpretar', 'relacionar', 'comparar', 'analizar'],
      'EVALUATE_REFLECT': ['evaluar', 'reflexionar', 'valorar', 'juzgar'],
      'SOLVE_PROBLEMS': ['resolver', 'calcular', 'determinar', 'hallar'],
      'REPRESENT': ['representar', 'graficar', 'expresar', 'mostrar'],
      'MODEL': ['modelar', 'simular', 'formular', 'construir'],
      'ARGUE_COMMUNICATE': ['argumentar', 'explicar', 'justificar', 'comunicar']
    };
    
    return keywords[skill as keyof typeof keywords] || [];
  }

  private assessContentComplexity(exercise: Exercise): number {
    // Algoritmo simple para evaluar complejidad del contenido
    let complexity = 0.5; // Base
    
    // Longitud de la pregunta
    if (exercise.question.length > 200) complexity += 0.2;
    if (exercise.question.length > 400) complexity += 0.2;
    
    // Presencia de contexto
    if (exercise.question.includes('\n\n')) complexity += 0.1;
    
    // Complejidad de las opciones
    const avgOptionLength = exercise.options.reduce((sum, opt) => sum + opt.length, 0) / exercise.options.length;
    if (avgOptionLength > 30) complexity += 0.1;
    
    return Math.min(1.0, complexity);
  }

  private mapDifficultyToComplexity(difficulty: string): number {
    const mapping = {
      'BASIC': 0.3,
      'INTERMEDIATE': 0.6,
      'ADVANCED': 0.9
    };
    
    return mapping[difficulty as keyof typeof mapping] || 0.5;
  }

  private checkSubjectSpecificIssues(exercise: Exercise, prueba: TPAESPrueba): string[] {
    const issues: string[] = [];
    
    if (prueba === 'COMPETENCIA_LECTORA' && !exercise.question.includes('\n\n')) {
      issues.push('Ejercicios de Competencia Lectora requieren texto de contexto');
    }
    
    if ((prueba === 'MATEMATICA_1' || prueba === 'MATEMATICA_2') && 
        !exercise.question.match(/[0-9+\-*/=()]/)) {
      issues.push('Ejercicios de Matemática deben incluir elementos numéricos o algebraicos');
    }
    
    return issues;
  }

  private checkSkillSpecificIssues(exercise: Exercise, skill: TPAESHabilidad): string[] {
    const issues: string[] = [];
    
    if (skill === 'SOLVE_PROBLEMS' && !exercise.question.includes('?')) {
      issues.push('Ejercicios de resolución de problemas deben plantear una pregunta clara');
    }
    
    return issues;
  }
}

export const qualityValidator = QualityValidator.getInstance();
