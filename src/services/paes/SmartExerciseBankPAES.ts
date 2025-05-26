
import { TPAESPrueba, TPAESHabilidad } from '@/types/system-types';
import { Exercise } from '@/types/ai-types';
import { ExerciseGenerationServicePAES } from './ExerciseGenerationServicePAES';
import { supabase } from '@/integrations/supabase/client';
import { logger } from '@/core/logging/SystemLogger';

interface ExerciseQualityMetrics {
  contentQuality: number;
  structuralValidity: number;
  educationalValue: number;
  paesAuthenticity: number;
  overallScore: number;
}

interface ExerciseBankStats {
  totalExercises: number;
  qualityDistribution: Record<string, number>;
  subjectDistribution: Record<TPAESPrueba, number>;
  averageQuality: number;
  lastUpdated: Date;
}

export class SmartExerciseBankPAES {
  
  /**
   * Obtiene ejercicio optimizado según criterios de calidad y variedad
   */
  static async getOptimizedExercise(
    prueba: TPAESPrueba,
    skill: TPAESHabilidad,
    difficulty: 'BASICO' | 'INTERMEDIO' | 'AVANZADO',
    userId?: string
  ): Promise<Exercise | null> {
    try {
      logger.info('SmartExerciseBankPAES', 'Obteniendo ejercicio optimizado', {
        prueba, skill, difficulty, userId
      });
      
      // 1. Intentar obtener ejercicio de alta calidad del banco
      let exercise = await this.getBankExercise(prueba, skill, difficulty, userId);
      
      // 2. Si no hay en banco o calidad insuficiente, generar nuevo
      if (!exercise || await this.shouldGenerateNew(exercise, userId)) {
        exercise = await this.generateAndStoreExercise(prueba, skill, difficulty);
      }
      
      // 3. Registrar uso para analytics
      if (exercise && userId) {
        await this.recordExerciseUsage(exercise.id!, userId);
      }
      
      return exercise;
    } catch (error) {
      logger.error('SmartExerciseBankPAES', 'Error obteniendo ejercicio optimizado', error);
      return null;
    }
  }
  
  /**
   * Obtiene ejercicio del banco con filtros de calidad
   */
  private static async getBankExercise(
    prueba: TPAESPrueba,
    skill: TPAESHabilidad,
    difficulty: string,
    userId?: string
  ): Promise<Exercise | null> {
    try {
      // Construir query con filtros de calidad
      let query = supabase
        .from('generated_exercises')
        .select('*')
        .eq('prueba_paes', prueba)
        .eq('skill_code', skill)
        .eq('difficulty_level', difficulty.toLowerCase())
        .gte('success_rate', 0.7) // Solo ejercicios con buena tasa de éxito
        .order('created_at', { ascending: false });
      
      // Excluir ejercicios recientes del usuario para variedad
      if (userId) {
        const { data: recentAttempts } = await supabase
          .from('user_exercise_attempts')
          .select('exercise_id')
          .eq('user_id', userId)
          .gte('created_at', new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString())
          .limit(20);
        
        if (recentAttempts && recentAttempts.length > 0) {
          const recentIds = recentAttempts.map(a => a.exercise_id);
          query = query.not('id', 'in', `(${recentIds.join(',')})`);
        }
      }
      
      const { data: exercises, error } = await query.limit(5);
      
      if (error) throw error;
      
      if (!exercises || exercises.length === 0) {
        return null;
      }
      
      // Seleccionar ejercicio con mejor balance calidad/variedad
      const selectedExercise = this.selectBestExercise(exercises);
      
      return this.convertToExerciseFormat(selectedExercise);
    } catch (error) {
      logger.error('SmartExerciseBankPAES', 'Error obteniendo del banco', error);
      return null;
    }
  }
  
  /**
   * Determina si se debe generar un nuevo ejercicio
   */
  private static async shouldGenerateNew(exercise: Exercise, userId?: string): Promise<boolean> {
    // Criterios para generar nuevo ejercicio:
    // 1. Ejercicio de baja calidad
    // 2. Usuario avanzado necesita más desafío
    // 3. Escasez en el banco para esta combinación
    
    const qualityScore = await this.calculateQualityScore(exercise);
    
    if (qualityScore < 0.75) {
      return true;
    }
    
    if (userId) {
      const userLevel = await this.getUserLevel(userId);
      if (userLevel === 'advanced' && exercise.difficulty !== 'AVANZADO') {
        return true;
      }
    }
    
    return false;
  }
  
  /**
   * Genera y almacena nuevo ejercicio de alta calidad
   */
  private static async generateAndStoreExercise(
    prueba: TPAESPrueba,
    skill: TPAESHabilidad,
    difficulty: 'BASICO' | 'INTERMEDIO' | 'AVANZADO'
  ): Promise<Exercise | null> {
    try {
      const config = {
        prueba,
        skill,
        difficulty,
        includeVisuals: this.shouldIncludeVisuals(prueba)
      };
      
      const exercise = await ExerciseGenerationServicePAES.generatePAESExercise(config);
      
      if (!exercise) {
        logger.warn('SmartExerciseBankPAES', 'No se pudo generar ejercicio');
        return null;
      }
      
      // Evaluar calidad antes de almacenar
      const qualityMetrics = await this.evaluateExerciseQuality(exercise);
      
      if (qualityMetrics.overallScore < 0.7) {
        logger.warn('SmartExerciseBankPAES', 'Ejercicio generado con calidad insuficiente', qualityMetrics);
        return exercise; // Devolver pero no almacenar
      }
      
      // Almacenar en banco con métricas
      await this.storeExerciseInBank(exercise, qualityMetrics);
      
      logger.info('SmartExerciseBankPAES', 'Ejercicio generado y almacenado', {
        id: exercise.id,
        quality: qualityMetrics.overallScore,
        prueba,
        skill
      });
      
      return exercise;
    } catch (error) {
      logger.error('SmartExerciseBankPAES', 'Error generando y almacenando ejercicio', error);
      return null;
    }
  }
  
  /**
   * Evalúa la calidad integral del ejercicio
   */
  private static async evaluateExerciseQuality(exercise: Exercise): Promise<ExerciseQualityMetrics> {
    const metrics: ExerciseQualityMetrics = {
      contentQuality: this.evaluateContentQuality(exercise),
      structuralValidity: this.evaluateStructuralValidity(exercise),
      educationalValue: this.evaluateEducationalValue(exercise),
      paesAuthenticity: this.evaluatePAESAuthenticity(exercise),
      overallScore: 0
    };
    
    // Calcular puntaje general ponderado
    metrics.overallScore = (
      metrics.contentQuality * 0.3 +
      metrics.structuralValidity * 0.25 +
      metrics.educationalValue * 0.25 +
      metrics.paesAuthenticity * 0.2
    );
    
    return metrics;
  }
  
  /**
   * Evalúa la calidad del contenido
   */
  private static evaluateContentQuality(exercise: Exercise): number {
    let score = 0;
    
    // Longitud apropiada de pregunta
    if (exercise.question.length > 20 && exercise.question.length < 500) {
      score += 0.2;
    }
    
    // Presencia de texto base cuando es necesario
    if (exercise.prueba === 'COMPETENCIA_LECTORA' && exercise.text && exercise.text.length > 100) {
      score += 0.3;
    }
    
    // Calidad de alternativas
    const optionsQuality = this.evaluateOptionsQuality(exercise.options);
    score += optionsQuality * 0.3;
    
    // Explicación detallada
    if (exercise.explanation && exercise.explanation.length > 50) {
      score += 0.2;
    }
    
    return Math.min(score, 1.0);
  }
  
  /**
   * Evalúa la validez estructural
   */
  private static evaluateStructuralValidity(exercise: Exercise): number {
    let score = 0;
    
    // 4 opciones requeridas
    if (exercise.options.length === 4) {
      score += 0.3;
    }
    
    // Respuesta correcta válida
    if (exercise.correctAnswer && exercise.options.includes(exercise.correctAnswer)) {
      score += 0.3;
    }
    
    // Formato de opciones correcto
    const hasProperFormat = exercise.options.every(option => 
      /^[A-D]\)/.test(option.trim())
    );
    if (hasProperFormat) {
      score += 0.2;
    }
    
    // Estructura específica por materia
    const subjectStructure = this.validateSubjectStructure(exercise);
    score += subjectStructure * 0.2;
    
    return Math.min(score, 1.0);
  }
  
  /**
   * Evalúa el valor educativo
   */
  private static evaluateEducationalValue(exercise: Exercise): number {
    let score = 0;
    
    // Presencia de conceptos clave
    const hasEducationalTerms = this.hasEducationalTerms(exercise);
    score += hasEducationalTerms ? 0.3 : 0;
    
    // Nivel de dificultad apropiado
    const difficultyMatch = this.validateDifficultyLevel(exercise);
    score += difficultyMatch * 0.4;
    
    // Evaluación de habilidad específica
    const skillAlignment = this.validateSkillAlignment(exercise);
    score += skillAlignment * 0.3;
    
    return Math.min(score, 1.0);
  }
  
  /**
   * Evalúa la autenticidad PAES
   */
  private static evaluatePAESAuthenticity(exercise: Exercise): number {
    let score = 0;
    
    // Formato PAES estándar
    if (this.followsPAESFormat(exercise)) {
      score += 0.4;
    }
    
    // Tiempo estimado apropiado
    if (exercise.estimatedTime && exercise.estimatedTime > 60 && exercise.estimatedTime < 300) {
      score += 0.2;
    }
    
    // Complejidad apropiada para la prueba
    const complexityScore = this.evaluateComplexityLevel(exercise);
    score += complexityScore * 0.4;
    
    return Math.min(score, 1.0);
  }
  
  /**
   * Almacena ejercicio en el banco con métricas
   */
  private static async storeExerciseInBank(exercise: Exercise, quality: ExerciseQualityMetrics): Promise<void> {
    try {
      const { error } = await supabase
        .from('generated_exercises')
        .insert({
          question: exercise.question,
          options: exercise.options,
          correct_answer: exercise.correctAnswer,
          explanation: exercise.explanation,
          prueba_paes: exercise.prueba,
          skill_code: exercise.skill,
          difficulty_level: exercise.difficulty?.toLowerCase(),
          metadata: {
            ...exercise.metadata,
            qualityMetrics: quality,
            hasVisualContent: exercise.hasVisualContent,
            visualType: exercise.visualType,
            text: exercise.text
          },
          success_rate: quality.overallScore
        });
      
      if (error) throw error;
    } catch (error) {
      logger.error('SmartExerciseBankPAES', 'Error almacenando en banco', error);
      throw error;
    }
  }
  
  /**
   * Registra uso del ejercicio para analytics
   */
  private static async recordExerciseUsage(exerciseId: string, userId: string): Promise<void> {
    try {
      await supabase
        .from('generated_exercises')
        .update({ 
          times_used: supabase.rpc('increment_times_used', { exercise_id: exerciseId })
        })
        .eq('id', exerciseId);
    } catch (error) {
      logger.error('SmartExerciseBankPAES', 'Error registrando uso', error);
    }
  }
  
  /**
   * Utilidades de evaluación
   */
  private static evaluateOptionsQuality(options: string[]): number {
    if (!options || options.length !== 4) return 0;
    
    let score = 0;
    
    // Longitud similar de opciones
    const lengths = options.map(opt => opt.length);
    const avgLength = lengths.reduce((a, b) => a + b, 0) / lengths.length;
    const variance = lengths.reduce((acc, len) => acc + Math.pow(len - avgLength, 2), 0) / lengths.length;
    
    if (variance < 100) { // Baja varianza en longitud
      score += 0.3;
    }
    
    // No hay opciones obviamente incorrectas
    const hasObviousWrong = options.some(opt => 
      opt.toLowerCase().includes('ninguna') || 
      opt.toLowerCase().includes('todas las anteriores')
    );
    
    if (!hasObviousWrong) {
      score += 0.4;
    }
    
    // Diversidad en contenido
    const uniqueWords = new Set();
    options.forEach(opt => {
      opt.split(' ').forEach(word => uniqueWords.add(word.toLowerCase()));
    });
    
    if (uniqueWords.size > 15) {
      score += 0.3;
    }
    
    return Math.min(score, 1.0);
  }
  
  private static validateSubjectStructure(exercise: Exercise): number {
    // Implementar validaciones específicas por materia
    return 0.8; // Placeholder
  }
  
  private static hasEducationalTerms(exercise: Exercise): boolean {
    const educationalTerms = [
      'analizar', 'interpretar', 'evaluar', 'comparar', 'explicar',
      'determinar', 'calcular', 'resolver', 'identificar', 'clasificar'
    ];
    
    const text = (exercise.question + ' ' + (exercise.text || '')).toLowerCase();
    return educationalTerms.some(term => text.includes(term));
  }
  
  private static validateDifficultyLevel(exercise: Exercise): number {
    // Implementar análisis de complejidad textual y conceptual
    return 0.75; // Placeholder
  }
  
  private static validateSkillAlignment(exercise: Exercise): number {
    // Implementar verificación de alineación con habilidad específica
    return 0.8; // Placeholder
  }
  
  private static followsPAESFormat(exercise: Exercise): boolean {
    return exercise.options.every(opt => /^[A-D]\)/.test(opt)) &&
           exercise.options.length === 4;
  }
  
  private static evaluateComplexityLevel(exercise: Exercise): number {
    // Análisis de complejidad conceptual y lingüística
    return 0.7; // Placeholder
  }
  
  private static shouldIncludeVisuals(prueba: TPAESPrueba): boolean {
    return ['MATEMATICA_1', 'MATEMATICA_2', 'CIENCIAS'].includes(prueba);
  }
  
  private static selectBestExercise(exercises: any[]): any {
    // Seleccionar basado en calidad, variedad y uso reciente
    return exercises[Math.floor(Math.random() * Math.min(exercises.length, 3))];
  }
  
  private static convertToExerciseFormat(dbExercise: any): Exercise {
    return {
      id: dbExercise.id,
      question: dbExercise.question,
      options: dbExercise.options,
      correctAnswer: dbExercise.correct_answer,
      explanation: dbExercise.explanation,
      skill: dbExercise.skill_code,
      prueba: dbExercise.prueba_paes,
      difficulty: dbExercise.difficulty_level?.toUpperCase(),
      text: dbExercise.metadata?.text,
      hasVisualContent: dbExercise.metadata?.hasVisualContent,
      visualType: dbExercise.metadata?.visualType,
      estimatedTime: dbExercise.metadata?.estimatedTime || 120,
      metadata: dbExercise.metadata
    };
  }
  
  private static async calculateQualityScore(exercise: Exercise): Promise<number> {
    const metrics = await this.evaluateExerciseQuality(exercise);
    return metrics.overallScore;
  }
  
  private static async getUserLevel(userId: string): Promise<string> {
    // Implementar análisis de nivel del usuario
    return 'intermediate'; // Placeholder
  }
  
  /**
   * Obtiene estadísticas del banco de ejercicios
   */
  static async getBankStats(): Promise<ExerciseBankStats> {
    try {
      const { data, error } = await supabase
        .from('generated_exercises')
        .select('prueba_paes, difficulty_level, success_rate, created_at')
        .order('created_at', { ascending: false });
      
      if (error) throw error;
      
      const stats: ExerciseBankStats = {
        totalExercises: data?.length || 0,
        qualityDistribution: {},
        subjectDistribution: {},
        averageQuality: 0,
        lastUpdated: new Date()
      };
      
      if (data && data.length > 0) {
        // Calcular distribuciones
        const qualitySum = data.reduce((sum, ex) => sum + (ex.success_rate || 0), 0);
        stats.averageQuality = qualitySum / data.length;
        
        // Distribución por calidad
        data.forEach(ex => {
          const qualityRange = ex.success_rate >= 0.8 ? 'high' : 
                              ex.success_rate >= 0.6 ? 'medium' : 'low';
          stats.qualityDistribution[qualityRange] = (stats.qualityDistribution[qualityRange] || 0) + 1;
        });
        
        // Distribución por materia
        data.forEach(ex => {
          const subject = ex.prueba_paes;
          stats.subjectDistribution[subject] = (stats.subjectDistribution[subject] || 0) + 1;
        });
      }
      
      return stats;
    } catch (error) {
      logger.error('SmartExerciseBankPAES', 'Error obteniendo estadísticas', error);
      return {
        totalExercises: 0,
        qualityDistribution: {},
        subjectDistribution: {},
        averageQuality: 0,
        lastUpdated: new Date()
      };
    }
  }
}
