import { Exercise } from '@/types/ai-types';
import { TPAESPrueba } from '@/types/system-types';
import { ExerciseQualityMetrics } from '@/types/exercise-quality-types';
import { logger } from '@/core/logging/SystemLogger';

interface QualityCheck {
  name: string;
  weight: number;
  check: (exercise: Exercise) => number;
}

export class PAESQualityAssuranceEngine {
  
  /**
   * Valida la calidad completa de un ejercicio PAES
   */
  static async validateExerciseQuality(exercise: Exercise): Promise<ExerciseQualityMetrics> {
    logger.info('PAESQualityAssuranceEngine', 'Validando calidad de ejercicio', {
      exerciseId: exercise.id,
      prueba: exercise.prueba
    });
    
    const checks = this.getQualityChecks(exercise.prueba as TPAESPrueba);
    const metrics: ExerciseQualityMetrics = {
      structuralValidity: 0,
      contentQuality: 0,
      paesCompliance: 0,
      difficultyAccuracy: 0,
      overallScore: 0
    };
    
    // Ejecutar todas las validaciones
    for (const check of checks) {
      const score = check.check(exercise);
      (metrics as any)[check.name] = score;
    }
    
    // Calcular score general ponderado
    metrics.overallScore = this.calculateWeightedScore(metrics, checks);
    
    // Agregar score de contenido visual si aplica
    if (exercise.hasVisualContent) {
      metrics.visualContentScore = this.validateVisualContent(exercise);
    }
    
    logger.info('PAESQualityAssuranceEngine', 'Validación completada', {
      exerciseId: exercise.id,
      overallScore: metrics.overallScore
    });
    
    return metrics;
  }

  /**
   * Define checks de calidad específicos por materia
   */
  private static getQualityChecks(prueba: TPAESPrueba): QualityCheck[] {
    const commonChecks: QualityCheck[] = [
      {
        name: 'structuralValidity',
        weight: 0.25,
        check: (exercise) => this.validateStructure(exercise)
      },
      {
        name: 'contentQuality',
        weight: 0.30,
        check: (exercise) => this.validateContent(exercise)
      },
      {
        name: 'paesCompliance',
        weight: 0.25,
        check: (exercise) => this.validatePAESCompliance(exercise, prueba)
      },
      {
        name: 'difficultyAccuracy',
        weight: 0.20,
        check: (exercise) => this.validateDifficulty(exercise)
      }
    ];

    return commonChecks;
  }

  /**
   * Valida estructura básica del ejercicio
   */
  private static validateStructure(exercise: Exercise): number {
    let score = 0;
    const maxScore = 1;
    
    // Pregunta válida
    if (exercise.question && exercise.question.length >= 20 && exercise.question.length <= 500) {
      score += 0.3;
    }
    
    // Opciones válidas
    if (exercise.options && exercise.options.length === 4) {
      score += 0.3;
      
      // Opciones no vacías y de longitud apropiada
      const validOptions = exercise.options.filter(opt => 
        opt && opt.length >= 5 && opt.length <= 200
      );
      if (validOptions.length === 4) {
        score += 0.2;
      }
    }
    
    // Respuesta correcta válida
    if (exercise.correctAnswer && exercise.options?.includes(exercise.correctAnswer)) {
      score += 0.2;
    }
    
    return Math.min(score, maxScore);
  }

  /**
   * Valida calidad del contenido
   */
  private static validateContent(exercise: Exercise): number {
    let score = 0;
    const maxScore = 1;
    
    // Pregunta coherente y bien formada
    if (this.isQuestionCoherent(exercise.question)) {
      score += 0.4;
    }
    
    // Opciones plausibles y variadas
    if (this.areOptionsPlausible(exercise.options)) {
      score += 0.3;
    }
    
    // Explicación presente y útil
    if (exercise.explanation && exercise.explanation.length >= 30) {
      score += 0.3;
    }
    
    return Math.min(score, maxScore);
  }

  /**
   * Valida cumplimiento de estándares PAES
   */
  private static validatePAESCompliance(exercise: Exercise, prueba: TPAESPrueba): number {
    let score = 0;
    const maxScore = 1;
    
    // Validaciones específicas por materia
    switch (prueba) {
      case 'COMPETENCIA_LECTORA':
        if (exercise.text && exercise.text.length >= 100) {
          score += 0.5;
        }
        if (this.validateReadingComprehensionFormat(exercise)) {
          score += 0.5;
        }
        break;
        
      case 'MATEMATICA_1':
      case 'MATEMATICA_2':
        if (this.validateMathFormat(exercise)) {
          score += 0.6;
        }
        if (this.hasMathematicalContent(exercise)) {
          score += 0.4;
        }
        break;
        
      case 'CIENCIAS':
        if (this.validateScienceFormat(exercise)) {
          score += 0.5;
        }
        if (this.hasScientificContent(exercise)) {
          score += 0.5;
        }
        break;
        
      case 'HISTORIA':
        if (this.validateHistoryFormat(exercise)) {
          score += 0.6;
        }
        if (this.hasHistoricalContext(exercise)) {
          score += 0.4;
        }
        break;
    }
    
    return Math.min(score, maxScore);
  }

  /**
   * Valida precisión de dificultad
   */
  private static validateDifficulty(exercise: Exercise): number {
    let score = 0;
    const maxScore = 1;
    
    const difficultyIndicators = this.analyzeDifficultyIndicators(exercise);
    const declaredDifficulty = exercise.difficulty;
    
    // Comparar dificultad declarada vs indicadores reales
    const alignment = this.calculateDifficultyAlignment(difficultyIndicators, declaredDifficulty);
    score = alignment;
    
    return Math.min(score, maxScore);
  }

  /**
   * Valida contenido visual cuando está presente
   */
  private static validateVisualContent(exercise: Exercise): number {
    if (!exercise.hasVisualContent) return 0;
    
    let score = 0;
    
    // Tipo de contenido visual apropiado
    if (exercise.visualType && ['graph', 'table', 'diagram', 'formula'].includes(exercise.visualType)) {
      score += 0.5;
    }
    
    // Descripción del contenido visual
    if (exercise.graphData?.description && exercise.graphData.description.length >= 20) {
      score += 0.5;
    }
    
    return score;
  }

  /**
   * Calcula score ponderado final
   */
  private static calculateWeightedScore(metrics: ExerciseQualityMetrics, checks: QualityCheck[]): number {
    let totalScore = 0;
    let totalWeight = 0;
    
    for (const check of checks) {
      const score = (metrics as any)[check.name] || 0;
      totalScore += score * check.weight;
      totalWeight += check.weight;
    }
    
    return totalWeight > 0 ? totalScore / totalWeight : 0;
  }

  // Métodos de validación específicos
  private static isQuestionCoherent(question: string): boolean {
    if (!question) return false;
    
    // Verificar que tenga estructura de pregunta
    const hasQuestionStructure = question.includes('¿') || question.includes('?') || 
                                question.toLowerCase().includes('cuál') ||
                                question.toLowerCase().includes('qué');
    
    // Verificar que no tenga patrones técnicos inapropiados
    const hasInappropriatePatterns = /\b[a-f0-9]{8}-[a-f0-9]{4}-[a-f0-9]{4}-[a-f0-9]{4}-[a-f0-9]{12}\b/i.test(question);
    
    return hasQuestionStructure && !hasInappropriatePatterns;
  }

  private static areOptionsPlausible(options: string[]): boolean {
    if (!options || options.length !== 4) return false;
    
    // Verificar que las opciones sean diferentes
    const uniqueOptions = new Set(options);
    if (uniqueOptions.size !== 4) return false;
    
    // Verificar longitudes similares (no muy desproporcionadas)
    const lengths = options.map(opt => opt.length);
    const maxLength = Math.max(...lengths);
    const minLength = Math.min(...lengths);
    
    return maxLength / minLength <= 3; // Ratio razonable
  }

  private static validateReadingComprehensionFormat(exercise: Exercise): boolean {
    return !!(exercise.text && exercise.text.length >= 100 && 
             exercise.question.toLowerCase().includes('texto'));
  }

  private static validateMathFormat(exercise: Exercise): boolean {
    const mathPatterns = /[\+\-\*\/\=\(\)\^\√∑∫]/;
    return mathPatterns.test(exercise.question) || 
           exercise.options.some(opt => mathPatterns.test(opt));
  }

  private static hasMathematicalContent(exercise: Exercise): boolean {
    const mathKeywords = ['función', 'ecuación', 'gráfico', 'variable', 'número', 'calcular'];
    const content = (exercise.question + ' ' + exercise.options.join(' ')).toLowerCase();
    return mathKeywords.some(keyword => content.includes(keyword));
  }

  private static validateScienceFormat(exercise: Exercise): boolean {
    const scienceKeywords = ['experimento', 'hipótesis', 'variable', 'datos', 'análisis', 'conclusión'];
    const content = (exercise.question + ' ' + (exercise.text || '')).toLowerCase();
    return scienceKeywords.some(keyword => content.includes(keyword));
  }

  private static hasScientificContent(exercise: Exercise): boolean {
    const scientificTerms = ['proceso', 'fenómeno', 'método', 'resultado', 'evidencia'];
    const content = (exercise.question + ' ' + exercise.options.join(' ')).toLowerCase();
    return scientificTerms.some(term => content.includes(term));
  }

  private static validateHistoryFormat(exercise: Exercise): boolean {
    const historyKeywords = ['período', 'proceso histórico', 'gobierno', 'época', 'siglo'];
    const content = (exercise.question + ' ' + (exercise.text || '')).toLowerCase();
    return historyKeywords.some(keyword => content.includes(keyword));
  }

  private static hasHistoricalContext(exercise: Exercise): boolean {
    const contextIndicators = ['durante', 'entre', 'desde', 'hasta', 'en el año'];
    const content = (exercise.question + ' ' + (exercise.text || '')).toLowerCase();
    return contextIndicators.some(indicator => content.includes(indicator));
  }

  private static analyzeDifficultyIndicators(exercise: Exercise): string {
    // Análisis simple de complejidad basado en longitud y vocabulario
    const questionLength = exercise.question.length;
    const complexWords = (exercise.question.match(/\b\w{8,}\b/g) || []).length;
    
    if (questionLength < 50 && complexWords < 2) return 'BASICO';
    if (questionLength > 150 || complexWords > 5) return 'AVANZADO';
    return 'INTERMEDIO';
  }

  private static calculateDifficultyAlignment(analyzed: string, declared: string): number {
    if (analyzed === declared) return 1.0;
    
    // Permitir cierta flexibilidad entre niveles adyacentes
    const adjacentPairs = [
      ['BASICO', 'INTERMEDIO'],
      ['INTERMEDIO', 'AVANZADO']
    ];
    
    for (const [a, b] of adjacentPairs) {
      if ((analyzed === a && declared === b) || (analyzed === b && declared === a)) {
        return 0.7;
      }
    }
    
    return 0.3; // Desalineación significativa
  }
}
