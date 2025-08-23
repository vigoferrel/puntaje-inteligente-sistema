/* eslint-disable react-refresh/only-export-components */
import { Exercise } from '@/types/ai-types';
import type { SafeString, SafeNumber, SafeBoolean, APIResponse, OperationResult } from '@/types/core';
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
      (metrics as unknown)[check.name] = score;
    }
    
    // Calcular score general ponderado
    metrics.overallScore = this.calculateWeightedScore(metrics, checks);
    
    // Agregar score de contenido visual si aplica
    if (exercise.hasVisualContent) {
      metrics.visualContentScore = this.validateVisualContent(exercise);
    }
    
    logger.info('PAESQualityAssuranceEngine', 'ValidaciÃ³n completada', {
      exerciseId: exercise.id,
      overallScore: metrics.overallScore
    });
    
    return metrics;
  }

  /**
   * Define checks de calidad especÃ­ficos por materia
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
   * Valida estructura bÃ¡sica del ejercicio
   */
  private static validateStructure(exercise: Exercise): number {
    let score = 0;
    const maxScore = 1;
    
    // Pregunta vÃ¡lida
    if (exercise.question && exercise.question.length >= 20 && exercise.question.length <= 500) {
      score += 0.3;
    }
    
    // Opciones vÃ¡lidas
    if (exercise.options && exercise.options.length === 4) {
      score += 0.3;
      
      // Opciones no vacÃ­as y de longitud apropiada
      const validOptions = exercise.options.filter(opt => 
        opt && opt.length >= 5 && opt.length <= 200
      );
      if (validOptions.length === 4) {
        score += 0.2;
      }
    }
    
    // Respuesta correcta vÃ¡lida
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
    
    // ExplicaciÃ³n presente y Ãºtil
    if (exercise.explanation && exercise.explanation.length >= 30) {
      score += 0.3;
    }
    
    return Math.min(score, maxScore);
  }

  /**
   * Valida cumplimiento de estÃ¡ndares PAES
   */
  private static validatePAESCompliance(exercise: Exercise, prueba: TPAESPrueba): number {
    let score = 0;
    const maxScore = 1;
    
    // Validaciones especÃ­ficas por materia
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
   * Valida precisiÃ³n de dificultad
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
   * Valida contenido visual cuando estÃ¡ presente
   */
  private static validateVisualContent(exercise: Exercise): number {
    if (!exercise.hasVisualContent) return 0;
    
    let score = 0;
    
    // Tipo de contenido visual apropiado
    if (exercise.visualType && ['graph', 'table', 'diagram', 'formula'].includes(exercise.visualType)) {
      score += 0.5;
    }
    
    // DescripciÃ³n del contenido visual
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
      const score = (metrics as unknown)[check.name] || 0;
      totalScore += score * check.weight;
      totalWeight += check.weight;
    }
    
    return totalWeight > 0 ? totalScore / totalWeight : 0;
  }

  // MÃ©todos de validaciÃ³n especÃ­ficos
  private static isQuestionCoherent(question: string): boolean {
    if (!question) return false;
    
    // Verificar que tenga estructura de pregunta
    const hasQuestionStructure = question.includes('Â¿') || question.includes('?') || 
                                question.toLowerCase().includes('cuÃ¡l') ||
                                question.toLowerCase().includes('quÃ©');
    
    // Verificar que no tenga patrones tÃ©cnicos inapropiados
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
    const mathPatterns = /[+\-*/=()^\âˆšâˆ‘âˆ«]/;
    return mathPatterns.test(exercise.question) || 
           exercise.options.some(opt => mathPatterns.test(opt));
  }

  private static hasMathematicalContent(exercise: Exercise): boolean {
    const mathKeywords = ['funciÃ³n', 'ecuaciÃ³n', 'grÃ¡fico', 'variable', 'nÃºmero', 'calcular'];
    const content = (exercise.question + ' ' + exercise.options.join(' ')).toLowerCase();
    return mathKeywords.some(keyword => content.includes(keyword));
  }

  private static validateScienceFormat(exercise: Exercise): boolean {
    const scienceKeywords = ['experimento', 'hipÃ³tesis', 'variable', 'datos', 'anÃ¡lisis', 'conclusiÃ³n'];
    const content = (exercise.question + ' ' + (exercise.text || '')).toLowerCase();
    return scienceKeywords.some(keyword => content.includes(keyword));
  }

  private static hasScientificContent(exercise: Exercise): boolean {
    const scientificTerms = ['proceso', 'fenÃ³meno', 'mÃ©todo', 'resultado', 'evidencia'];
    const content = (exercise.question + ' ' + exercise.options.join(' ')).toLowerCase();
    return scientificTerms.some(term => content.includes(term));
  }

  private static validateHistoryFormat(exercise: Exercise): boolean {
    const historyKeywords = ['perÃ­odo', 'proceso histÃ³rico', 'gobierno', 'Ã©poca', 'siglo'];
    const content = (exercise.question + ' ' + (exercise.text || '')).toLowerCase();
    return historyKeywords.some(keyword => content.includes(keyword));
  }

  private static hasHistoricalContext(exercise: Exercise): boolean {
    const contextIndicators = ['durante', 'entre', 'desde', 'hasta', 'en el aÃ±o'];
    const content = (exercise.question + ' ' + (exercise.text || '')).toLowerCase();
    return contextIndicators.some(indicator => content.includes(indicator));
  }

  private static analyzeDifficultyIndicators(exercise: Exercise): string {
    // AnÃ¡lisis simple de complejidad basado en longitud y vocabulario
    const questionLength = exercise.question.length;
    const complexWords = (exercise.question.match(/\b\w{8}\b/g) || []).length;
    
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
    
    return 0.3; // DesalineaciÃ³n significativa
  }
}



