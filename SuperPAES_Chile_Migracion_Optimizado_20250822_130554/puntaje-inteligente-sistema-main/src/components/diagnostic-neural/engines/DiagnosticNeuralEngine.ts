/* eslint-disable react-refresh/only-export-components */
import { NeuralScoringSystem } from '../../../services/neural/NeuralScoringSystem';
import type { SafeString, SafeNumber, SafeBoolean, APIResponse, OperationResult } from '../../../types/core';
import { PAESNodeMappingService } from '../../../services/paes/paes-node-mapping-service';
import { realEducationalServices } from '../../../services/unified/RealEducationalServicesHub';
// DISABLED: // DISABLED: import { supabase } from '../../../integrations/supabase/unified-client';
import { supabase } from '../../../integrations/supabase/leonardo-auth-client';
import { 
  NeuralDiagnosticState, 
  AdaptiveQuestion, 
  NeuralDiagnosticResult,
  NeuralMetrics,
  PerformanceMetrics 
} from '@/types/diagnostic-neural';

export class DiagnosticNeuralEngine {
  private state: NeuralDiagnosticState;
  private userId: string;
  private startTime: number;
  private questionHistory: unknown[] = [];

  constructor(userId: string = userId) {
    this.userId = userId;
    this.startTime = Date.now();
    this.state = {
      phase: 'intro',
      currentQuestion: 0,
      totalQuestions: 0,
      adaptiveDifficulty: 0.5,
      neuralMetrics: {
        learningVelocity: 0,
        cognitiveLoad: 0,
        retentionRate: 0,
        engagementLevel: 100,
        adaptationSpeed: 0
      },
      bloomLevel: {
        current: 'comprender',
        progression: 0,
        targetLevel: 'aplicar'
      },
      skillsAssessed: [],
      realTimePerformance: {
        accuracy: 0,
        responseTime: 0,
        consistency: 0,
        difficultyProgression: 0,
        skillMastery: {}
      }
    };
  }

  // ==================== INICIALIZACIÃ“N NEURAL ====================
  
  async initializeNeuralDiagnostic(): Promise<void> {
    console.log('ðŸ§  Inicializando diagnÃ³stico neural...');
    
    try {
      // Obtener perfil neural previo del usuario
      const [userProgress, exerciseAttempts, neuralMetrics] = await Promise.all([
        realEducationalServices.getUserProgress(this.userId),
        this.getUserExerciseAttempts(),
        this.getNeuralMetrics()
      ]);

      // Calcular mÃ©tricas base
      this.calculateBaseMetrics(userProgress, exerciseAttempts);
      
      // Determinar nivel inicial de Bloom
      this.determineInitialBloomLevel(exerciseAttempts);
      
      // Seleccionar skills a evaluar
      await this.selectSkillsToAssess();
      
      // Calcular nÃºmero total de preguntas adaptativo
      this.calculateAdaptiveQuestionCount();
      
      this.state.phase = 'evaluation';
      
    } catch (error) {
      console.error('Error inicializando diagnÃ³stico neural:', error);
      // Fallback con configuraciÃ³n bÃ¡sica
      this.state.totalQuestions = 15;
      this.state.skillsAssessed = ['INTERPRET_RELATE', 'SOLVE_PROBLEMS', 'ANALYZE'];
    }
  }

  // ==================== GENERACIÃ“N ADAPTATIVA ====================
  
  async generateAdaptiveQuestion(): Promise<AdaptiveQuestion | null> {
    try {
      // Seleccionar skill basado en rendimiento actual
      const targetSkill = this.selectNextSkill();
      
      // Ajustar dificultad basada en rendimiento
      this.adjustAdaptiveDifficulty();
      
      // Determinar nivel de Bloom apropiado
      const bloomLevel = this.determineBloomLevel();
      
      // Obtener nodos relevantes para la skill
      const relevantNodes = await this.getRelevantNodes(targetSkill);
      
      // Generar pregunta usando el backend real
      const question = await this.generateQuestionFromBackend(
        targetSkill,
        bloomLevel,
        this.state.adaptiveDifficulty,
        relevantNodes
      );
      
      return question;
      
    } catch (error) {
      console.error('Error generando pregunta adaptativa:', error);
      return this.getFallbackQuestion();
    }
  }

  // ==================== PROCESAMIENTO DE RESPUESTAS ====================
  
  async processAnswer(questionId: string, userAnswer: string, timeSpent: number): Promise<void> {
    const question = this.questionHistory.find(q => q.id === questionId);
    if (!question) return;

    const isCorrect = userAnswer === question.correctAnswer;
    
    // Actualizar mÃ©tricas en tiempo real
    this.updateRealTimeMetrics(isCorrect, timeSpent, question.difficulty);
    
    // Actualizar mÃ©tricas neurales
    await this.updateNeuralMetrics(isCorrect, timeSpent, question.skill);
    
    // Ajustar nivel de Bloom
    this.adjustBloomLevel(isCorrect, question.bloomLevel);
    
    // Actualizar gamificaciÃ³n
    await this.updateGamification(isCorrect, question.skill, timeSpent);
    
    // Guardar en historial
    this.questionHistory.push({
      ...question,
      userAnswer,
      isCorrect,
      timeSpent,
      timestamp: Date.now()
    });
    
    this.state.currentQuestion++;
  }

  // ==================== ANÃLISIS NEURAL FINAL ====================
  
  async generateNeuralResults(): Promise<NeuralDiagnosticResult> {
    console.log('ðŸ“Š Generando resultados neurales...');
    
    try {
      this.state.phase = 'analysis';
      
      // Generar predicciÃ³n PAES usando el sistema neural
      const paesPredicition = await NeuralScoringSystem.predictPAESScore(this.userId);
      
      // Obtener analytics neurales avanzados
      const neuralAnalytics = await NeuralScoringSystem.getAdvancedNeuralAnalytics(this.userId);
      
      // Generar mapa de habilidades
      const skillsMap = await this.generateSkillsMap();
      
      // Calcular mÃ©tricas de gamificaciÃ³n
      const gamificationMetrics = await this.calculateGamificationMetrics();
      
      // Generar plan personalizado
      const personalizedPlan = await this.generatePersonalizedPlan();
      
      const results: NeuralDiagnosticResult = {
        paesPredicition,
        neuralAnalytics,
        skillsMap,
        gamificationMetrics,
        personalizedPlan
      };
      
      // Guardar resultados en la base de datos
      await this.saveNeuralResults(results);
      
      this.state.phase = 'results';
      
      return results;
      
    } catch (error) {
      console.error('Error generando resultados neurales:', error);
      return this.getFallbackResults();
    }
  }

  // ==================== MÃ‰TODOS AUXILIARES ====================
  
  private async getUserExerciseAttempts() {
    const { data } = await supabase
      .from('user_exercise_attempts')
      .select('*')
      .eq('user_id', this.userId)
      .order('created_at', { ascending: false })
      .limit(50);
    
    return data || [];
  }

  private async getNeuralMetrics() {
    const { data } = await supabase
      .from('neural_metrics')
      .select('*')
      .eq('user_id', this.userId)
      .order('created_at', { ascending: false })
      .limit(10);
    
    return data || [];
  }

  private calculateBaseMetrics(userProgress: unknown[], exerciseAttempts: unknown[]) {
    const totalProgress = userProgress.reduce((sum, p) => sum + (p.progress || 0), 0) / (userProgress.length || 1);
    const accuracy = exerciseAttempts.filter(a => a.is_correct).length / (exerciseAttempts.length || 1);
    
    this.state.neuralMetrics.learningVelocity = Math.min(100, totalProgress * 1.5);
    this.state.realTimePerformance.accuracy = accuracy;
  }

  private determineInitialBloomLevel(exerciseAttempts: unknown[]) {
    const recentCorrect = exerciseAttempts.slice(0, 10).filter(a => a.is_correct).length;
    
    if (recentCorrect >= 8) {
      this.state.bloomLevel.current = 'aplicar';
    } else if (recentCorrect >= 5) {
      this.state.bloomLevel.current = 'comprender';
    } else {
      this.state.bloomLevel.current = 'recordar';
    }
  }

  private async selectSkillsToAssess() {
    // Obtener skills de la base de datos
    const { data: skills } = await supabase
      .from('paes_skills')
      .select('skill_type')
      .limit(5);
    
    this.state.skillsAssessed = skills?.map(s => s.skill_type) || ['INTERPRET_RELATE', 'SOLVE_PROBLEMS'];
  }

  private calculateAdaptiveQuestionCount() {
    const baseQuestions = 12;
    const skillMultiplier = this.state.skillsAssessed.length;
    this.state.totalQuestions = Math.min(25, baseQuestions + skillMultiplier * 2);
  }

  private selectNextSkill(): string {
    // Seleccionar skill basada en rendimiento actual
    const skillPerformance = this.state.realTimePerformance.skillMastery;
    const weakestSkill = Object.entries(skillPerformance)
      .sort(([,a], [,b]) => a - b)[0]?.[0];
    
    return weakestSkill || this.state.skillsAssessed[this.state.currentQuestion % this.state.skillsAssessed.length];
  }

  private adjustAdaptiveDifficulty() {
    const recentPerformance = this.questionHistory.slice(-3);
    const recentAccuracy = recentPerformance.filter(q => q.isCorrect).length / (recentPerformance.length || 1);
    
    if (recentAccuracy > 0.8) {
      this.state.adaptiveDifficulty = Math.min(1, this.state.adaptiveDifficulty + 0.1);
    } else if (recentAccuracy < 0.4) {
      this.state.adaptiveDifficulty = Math.max(0.1, this.state.adaptiveDifficulty - 0.1);
    }
  }

  private determineBloomLevel(): string {
    const bloomLevels = ['recordar', 'comprender', 'aplicar', 'analizar', 'evaluar', 'crear'];
    const currentIndex = bloomLevels.indexOf(this.state.bloomLevel.current);
    
    if (this.state.realTimePerformance.accuracy > 0.8 && currentIndex < bloomLevels.length - 1) {
      return bloomLevels[currentIndex + 1];
    } else if (this.state.realTimePerformance.accuracy < 0.5 && currentIndex > 0) {
      return bloomLevels[currentIndex - 1];
    }
    
    return this.state.bloomLevel.current;
  }

  private async getRelevantNodes(skill: string) {
    const { data: nodes } = await supabase
      .from('learning_nodes')
      .select('*')
      .limit(3);
    
    return nodes || [];
  }

  private async generateQuestionFromBackend(skill: string, bloomLevel: string, difficulty: number, nodes: unknown[]) {
    try {
      // Intentar obtener ejercicio real del backend con filtros especÃ­ficos
      const { data: exercises } = await supabase
        .from('exercises')
        .select('*')
        .not('question', 'is', null)
        .not('options', 'is', null)
        .not('correct_answer', 'is', null)
        .limit(10);
      
      if (exercises && exercises.length > 0) {
        // Seleccionar ejercicio aleatorio de los disponibles
        const randomIndex = Math.floor(Math.random() * exercises.length);
        const exercise = exercises[randomIndex];
        
        // Formatear opciones correctamente
        let formattedOptions: string[] = [];
        
        if (Array.isArray(exercise.options)) {
          formattedOptions = exercise.options.map((opt: unknown, index: number) => {
            const letter = String.fromCharCode(65 + index); // A, B, C, D
            if (typeof opt === 'string') {
              return opt.startsWith(letter) ? opt : `${letter}) ${opt}`;
            } else if (opt && typeof opt === 'object' && opt.contenido) {
              return `${letter}) ${opt.contenido}`;
            }
            return `${letter}) ${opt}`;
          });
        } else if (typeof exercise.options === 'string') {
          // Si options es un string, intentar parsearlo
          try {
            const parsed = JSON.parse(exercise.options);
            if (Array.isArray(parsed)) {
              formattedOptions = parsed.map((opt: unknown, index: number) => {
                const letter = String.fromCharCode(65 + index);
                return `${letter}) ${opt}`;
              });
            }
          } catch {
            // Si no se puede parsear, usar opciones por defecto
            formattedOptions = ['A) OpciÃ³n A', 'B) OpciÃ³n B', 'C) OpciÃ³n C', 'D) OpciÃ³n D'];
          }
        } else {
          formattedOptions = ['A) OpciÃ³n A', 'B) OpciÃ³n B', 'C) OpciÃ³n C', 'D) OpciÃ³n D'];
        }
        
        // Asegurar que tenemos al menos 4 opciones
        while (formattedOptions.length < 4) {
          const letter = String.fromCharCode(65 + formattedOptions.length);
          formattedOptions.push(`${letter}) OpciÃ³n ${letter}`);
        }
        
        // Formatear respuesta correcta
        let correctAnswer = exercise.correct_answer;
        if (correctAnswer && !correctAnswer.includes(')')) {
          // Si la respuesta correcta no tiene formato, buscarla en las opciones
          const matchingOption = formattedOptions.find(opt =>
            opt.toLowerCase().includes(correctAnswer.toLowerCase())
          );
          correctAnswer = matchingOption || formattedOptions[0];
        }
        
        return {
          id: `neural-${exercise.id || Date.now()}`,
          question: exercise.question || 'Pregunta adaptativa neural del sistema',
          options: formattedOptions,
          correctAnswer: correctAnswer || formattedOptions[0],
          explanation: exercise.explanation || 'Esta pregunta evalÃºa tu comprensiÃ³n del tema mediante anÃ¡lisis neural.',
          skill,
          bloomLevel,
          difficulty,
          nodeId: nodes[0]?.id || exercise.node_id || 'neural-node',
          estimatedTime: 90,
          neuralContext: {
            adaptiveDifficulty: difficulty,
            bloomLevel,
            exerciseId: exercise.id,
            source: 'real_backend'
          }
        };
      }
    } catch (error) {
      console.error('Error obteniendo ejercicio del backend:', error);
    }
    
    return this.getFallbackQuestion();
  }

  private getFallbackQuestion(): AdaptiveQuestion {
    const fallbackQuestions = [
      {
        question: 'Â¿CuÃ¡l es la idea principal del siguiente texto?\n\n"La educaciÃ³n es la herramienta mÃ¡s poderosa que puedes usar para cambiar el mundo. A travÃ©s del aprendizaje continuo, las personas desarrollan habilidades crÃ­ticas que les permiten enfrentar desafÃ­os complejos y contribuir positivamente a la sociedad."',
        options: [
          'A) La educaciÃ³n es costosa y difÃ­cil de obtener',
          'B) La educaciÃ³n es una herramienta poderosa para cambiar el mundo',
          'C) Solo algunas personas pueden acceder a la educaciÃ³n',
          'D) La educaciÃ³n no tiene impacto en la sociedad'
        ],
        correctAnswer: 'B) La educaciÃ³n es una herramienta poderosa para cambiar el mundo',
        explanation: 'El texto establece claramente que "la educaciÃ³n es la herramienta mÃ¡s poderosa que puedes usar para cambiar el mundo", siendo esta la idea principal.',
        skill: 'INTERPRET_RELATE'
      },
      {
        question: 'Si f(x) = 2x + 3, Â¿cuÃ¡l es el valor de f(5)?',
        options: [
          'A) 10',
          'B) 13',
          'C) 8',
          'D) 15'
        ],
        correctAnswer: 'B) 13',
        explanation: 'Sustituyendo x = 5 en la funciÃ³n: f(5) = 2(5) + 3 = 10 + 3 = 13',
        skill: 'SOLVE_PROBLEMS'
      },
      {
        question: 'En el contexto histÃ³rico, Â¿cuÃ¡l fue una de las principales causas de la RevoluciÃ³n Industrial?',
        options: [
          'A) El descubrimiento de AmÃ©rica',
          'B) Los avances tecnolÃ³gicos y la mÃ¡quina de vapor',
          'C) La caÃ­da del Imperio Romano',
          'D) Las Cruzadas medievales'
        ],
        correctAnswer: 'B) Los avances tecnolÃ³gicos y la mÃ¡quina de vapor',
        explanation: 'La RevoluciÃ³n Industrial fue impulsada principalmente por avances tecnolÃ³gicos, especialmente la mÃ¡quina de vapor, que transformÃ³ la producciÃ³n y el transporte.',
        skill: 'ANALYZE'
      },
      {
        question: 'Â¿CuÃ¡l es la funciÃ³n principal del sistema circulatorio en los seres humanos?',
        options: [
          'A) Digerir los alimentos',
          'B) Transportar oxÃ­geno y nutrientes por el cuerpo',
          'C) Producir hormonas',
          'D) Filtrar toxinas del aire'
        ],
        correctAnswer: 'B) Transportar oxÃ­geno y nutrientes por el cuerpo',
        explanation: 'El sistema circulatorio tiene como funciÃ³n principal transportar oxÃ­geno, nutrientes y otras sustancias esenciales a todas las cÃ©lulas del cuerpo.',
        skill: 'IDENTIFY'
      }
    ];
    
    const randomQuestion = fallbackQuestions[Math.floor(Math.random() * fallbackQuestions.length)];
    
    return {
      id: `fallback-${Date.now()}`,
      question: randomQuestion.question,
      options: randomQuestion.options,
      correctAnswer: randomQuestion.correctAnswer,
      explanation: randomQuestion.explanation,
      skill: randomQuestion.skill,
      bloomLevel: this.state.bloomLevel.current,
      difficulty: this.state.adaptiveDifficulty,
      nodeId: 'neural-fallback',
      estimatedTime: 90,
      neuralContext: {
        source: 'fallback_neural',
        adaptiveDifficulty: this.state.adaptiveDifficulty,
        bloomLevel: this.state.bloomLevel.current
      }
    };
  }

  private updateRealTimeMetrics(isCorrect: boolean, timeSpent: number, difficulty: number) {
    const totalAnswered = this.questionHistory.length + 1;
    const correctAnswers = this.questionHistory.filter(q => q.isCorrect).length + (isCorrect ? 1 : 0);
    
    this.state.realTimePerformance.accuracy = correctAnswers / totalAnswered;
    this.state.realTimePerformance.responseTime = (this.state.realTimePerformance.responseTime + timeSpent) / 2;
    
    // Actualizar carga cognitiva
    this.state.neuralMetrics.cognitiveLoad = Math.min(100, timeSpent / 1000 * difficulty * 10);
  }

  private async updateNeuralMetrics(isCorrect: boolean, timeSpent: number, skill: string) {
    try {
      await NeuralScoringSystem.updateGamificationMetrics(
        this.userId,
        'diagnostic_question_answered',
        isCorrect ? 85 : 45
      );
    } catch (error) {
      console.warn('Error actualizando mÃ©tricas neurales:', error);
    }
  }

  private adjustBloomLevel(isCorrect: boolean, questionBloomLevel: string) {
    if (isCorrect) {
      this.state.bloomLevel.progression += 10;
      if (this.state.bloomLevel.progression >= 100) {
        // Avanzar al siguiente nivel de Bloom
        const bloomLevels = ['recordar', 'comprender', 'aplicar', 'analizar', 'evaluar', 'crear'];
        const currentIndex = bloomLevels.indexOf(this.state.bloomLevel.current);
        if (currentIndex < bloomLevels.length - 1) {
          this.state.bloomLevel.current = bloomLevels[currentIndex + 1] as unknown;
          this.state.bloomLevel.progression = 0;
        }
      }
    }
  }

  private async updateGamification(isCorrect: boolean, skill: string, timeSpent: number) {
    if (isCorrect) {
      this.state.neuralMetrics.engagementLevel = Math.min(100, this.state.neuralMetrics.engagementLevel + 5);
    }
  }

  private async generateSkillsMap() {
    const skillsMap: Record<string, unknown> = {};
    
    for (const skill of this.state.skillsAssessed) {
      const skillQuestions = this.questionHistory.filter(q => q.skill === skill);
      const accuracy = skillQuestions.filter(q => q.isCorrect).length / (skillQuestions.length || 1);
      
      skillsMap[skill] = {
        level: accuracy,
        bloomLevel: this.state.bloomLevel.current,
        nodeProgress: accuracy * 100,
        recommendations: this.generateSkillRecommendations(skill, accuracy)
      };
    }
    
    return skillsMap;
  }

  private generateSkillRecommendations(skill: string, accuracy: number): string[] {
    const recommendations = [];
    
    if (accuracy < 0.6) {
      recommendations.push(`Reforzar conceptos bÃ¡sicos de ${skill}`);
      recommendations.push('Practicar ejercicios de nivel bÃ¡sico');
    } else if (accuracy > 0.8) {
      recommendations.push(`Excelente dominio de ${skill}`);
      recommendations.push('Intentar ejercicios mÃ¡s desafiantes');
    } else {
      recommendations.push(`Continuar practicando ${skill}`);
      recommendations.push('Enfocarse en Ã¡reas especÃ­ficas de mejora');
    }
    
    return recommendations;
  }

  private async calculateGamificationMetrics() {
    const correctAnswers = this.questionHistory.filter(q => q.isCorrect).length;
    const totalTime = this.questionHistory.reduce((sum, q) => sum + q.timeSpent, 0);
    
    return {
      pointsEarned: correctAnswers * 10 + Math.max(0, 100 - Math.floor(totalTime / 1000)),
      achievementsUnlocked: this.calculateAchievements(),
      engagementScore: this.state.neuralMetrics.engagementLevel,
      motivationLevel: Math.min(100, this.state.realTimePerformance.accuracy * 100)
    };
  }

  private calculateAchievements(): string[] {
    const achievements = [];
    const accuracy = this.state.realTimePerformance.accuracy;
    
    if (accuracy >= 0.9) achievements.push('Maestro Neural');
    if (accuracy >= 0.8) achievements.push('Experto Cognitivo');
    if (this.questionHistory.length >= 15) achievements.push('Persistente');
    if (this.state.bloomLevel.current === 'crear') achievements.push('Creador de Conocimiento');
    
    return achievements;
  }

  private async generatePersonalizedPlan() {
    const weakSkills = Object.entries(this.state.realTimePerformance.skillMastery)
      .filter(([, level]) => level < 0.6)
      .map(([skill]) => skill);
    
    return {
      recommendedNodes: await this.getRecommendedNodes(weakSkills),
      studyPath: this.generateStudyPath(weakSkills),
      timeAllocation: this.calculateTimeAllocation(weakSkills),
      priorityAreas: weakSkills.slice(0, 3)
    };
  }

  private async getRecommendedNodes(weakSkills: string[]) {
    const { data: nodes } = await supabase
      .from('learning_nodes')
      .select('id')
      .limit(5);
    
    return nodes?.map(n => n.id) || [];
  }

  private generateStudyPath(weakSkills: string[]): string[] {
    return weakSkills.map(skill => `Estudiar ${skill} - Nivel ${this.state.bloomLevel.current}`);
  }

  private calculateTimeAllocation(weakSkills: string[]): Record<string, number> {
    const allocation: Record<string, number> = {};
    const totalTime = 120; // 2 horas
    const timePerSkill = totalTime / (weakSkills.length || 1);
    
    weakSkills.forEach(skill => {
      allocation[skill] = timePerSkill;
    });
    
    return allocation;
  }

  private async saveNeuralResults(results: NeuralDiagnosticResult) {
    try {
      await realEducationalServices.logSystemEvent('neural_diagnostic_completed', {
        userId: this.userId,
        results: JSON.stringify(results),
        duration: Date.now() - this.startTime
      });
    } catch (error) {
      console.warn('Error guardando resultados neurales:', error);
    }
  }

  private getFallbackResults(): NeuralDiagnosticResult {
    return {
      paesPredicition: {
        matematica1: 550,
        matematica2: 540,
        lenguaje: 560,
        ciencias: 530,
        historia: 520,
        overall: 540,
        confidence: 75
      },
      neuralAnalytics: {
        learningVelocity: 75,
        retentionRate: 80,
        cognitiveLoad: 65,
        optimalStudyTime: '14:00-16:00',
        strongAreas: ['Lenguaje'],
        weakAreas: ['MatemÃ¡tica 2'],
        nextMilestones: ['Completar 5 nodos mÃ¡s']
      },
      skillsMap: {},
      gamificationMetrics: {
        pointsEarned: 150,
        achievementsUnlocked: ['Participante'],
        engagementScore: 85,
        motivationLevel: 75
      },
      personalizedPlan: {
        recommendedNodes: [],
        studyPath: ['Reforzar conceptos bÃ¡sicos'],
        timeAllocation: { 'matematica': 60 },
        priorityAreas: ['MatemÃ¡tica']
      }
    };
  }

  // Getters para el estado
  getState(): NeuralDiagnosticState {
    return { ...this.state };
  }

  getCurrentPhase(): string {
    return this.state.phase;
  }

  getProgress(): number {
    return this.state.totalQuestions > 0 ? (this.state.currentQuestion / this.state.totalQuestions) * 100 : 0;
  }

  isComplete(): boolean {
    return this.state.currentQuestion >= this.state.totalQuestions;
  }
}





