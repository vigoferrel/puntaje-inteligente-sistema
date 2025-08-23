import { supabase } from '@/lib/supabase'
import { 
  ExamSession, 
  ExamResults, 
  UserAnswer, 
  GeneratedExam,
  ExamQuestion,
  TestSubject,
  PAESSkill,
  DifficultyLevel
} from '@/types/exams'
import { quantumIdSync, quantumRandomSync } from '@/lib/utils/quantumRandom'

export class ExamSessionService {
  /**
   * Inicia una nueva sesión de examen
   */
  static async startExamSession(
    examId: string, 
    userId: string,
    settings?: Partial<ExamSession['settings']>
  ): Promise<ExamSession> {
    try {
      const session: Omit<ExamSession, 'id'> = {
        examId,
        userId,
        startedAt: new Date().toISOString(),
        status: 'IN_PROGRESS',
        currentQuestionIndex: 0,
        answers: [],
        allowedTimeExtensions: 0,
        breaks: [],
        settings: {
          allowReview: true,
          allowBacktrack: true,
          showTimer: true,
          enableBreaks: true,
          ...settings
        }
      }

      // Guardar en base de datos
      const { data, error } = await supabase
        .from('exam_sessions')
        .insert(session)
        .select()
        .single()

      if (error) throw error

      return { id: data.id, ...session }

    } catch (error) {
      console.error('Error starting exam session:', error)
      throw new Error('No se pudo iniciar la sesión de examen')
    }
  }

  /**
   * Obtiene una sesión de examen activa
   */
  static async getExamSession(sessionId: string): Promise<ExamSession | null> {
    try {
      const { data, error } = await supabase
        .from('exam_sessions')
        .select('*')
        .eq('id', sessionId)
        .single()

      if (error) {
        if (error.code === 'PGRST116') return null // Not found
        throw error
      }

      return data as ExamSession

    } catch (error) {
      console.error('Error getting exam session:', error)
      return null
    }
  }

  /**
   * Actualiza el progreso de la sesión
   */
  static async updateSessionProgress(
    sessionId: string,
    updates: Partial<Pick<ExamSession, 'currentQuestionIndex' | 'answers' | 'timeRemaining' | 'status'>>
  ): Promise<void> {
    try {
      const { error } = await supabase
        .from('exam_sessions')
        .update({
          ...updates,
          updated_at: new Date().toISOString()
        })
        .eq('id', sessionId)

      if (error) throw error

    } catch (error) {
      console.error('Error updating session progress:', error)
      throw new Error('No se pudo actualizar el progreso')
    }
  }

  /**
   * Guarda la respuesta de una pregunta
   */
  static async saveAnswer(
    sessionId: string,
    answer: UserAnswer
  ): Promise<void> {
    try {
      // Obtener sesión actual
      const session = await this.getExamSession(sessionId)
      if (!session) throw new Error('Sesión no encontrada')

      // Actualizar o agregar respuesta
      const existingAnswerIndex = session.answers.findIndex(
        a => a.questionId === answer.questionId
      )

      let updatedAnswers: UserAnswer[]
      if (existingAnswerIndex >= 0) {
        // Actualizar respuesta existente
        updatedAnswers = [...session.answers]
        updatedAnswers[existingAnswerIndex] = answer
      } else {
        // Agregar nueva respuesta
        updatedAnswers = [...session.answers, answer]
      }

      // Guardar en base de datos
      await this.updateSessionProgress(sessionId, {
        answers: updatedAnswers
      })

    } catch (error) {
      console.error('Error saving answer:', error)
      throw new Error('No se pudo guardar la respuesta')
    }
  }

  /**
   * Finaliza una sesión de examen y calcula resultados
   */
  static async finishExamSession(
    sessionId: string,
    exam: GeneratedExam
  ): Promise<ExamResults> {
    try {
      const session = await this.getExamSession(sessionId)
      if (!session) throw new Error('Sesión no encontrada')

      // Marcar sesión como completada
      await this.updateSessionProgress(sessionId, {
        status: 'COMPLETED',
        finishedAt: new Date().toISOString()
      })

      // Calcular resultados
      const results = await this.calculateResults(session, exam)

      // Guardar resultados en base de datos
      await this.saveResults(results)

      // Actualizar progreso del usuario
      await this.updateUserProgress(session.userId, results)

      return results

    } catch (error) {
      console.error('Error finishing exam session:', error)
      throw new Error('No se pudo finalizar el examen')
    }
  }

  /**
   * Calcula los resultados detallados del examen
   */
  private static async calculateResults(
    session: ExamSession,
    exam: GeneratedExam
  ): Promise<ExamResults> {
    const finishedAt = new Date().toISOString()
    const startTime = new Date(session.startedAt).getTime()
    const finishTime = new Date(finishedAt).getTime()
    const totalTimeSpent = Math.floor((finishTime - startTime) / 1000)

    // Calcular puntajes básicos
    let correctAnswers = 0
    const incorrectQuestions: ExamResults['incorrectQuestions'] = []
    const timeDistribution: number[] = []

    exam.questions.forEach((question, index) => {
      const userAnswer = session.answers.find(a => a.questionId === question.id)
      const timeSpent = userAnswer?.timeSpent || 0
      timeDistribution.push(timeSpent)

      if (userAnswer && this.isAnswerCorrect(userAnswer, question)) {
        correctAnswers++
      } else {
        incorrectQuestions.push({
          questionId: question.id,
          userAnswer: userAnswer?.selectedAnswer || null,
          correctAnswer: question.correctAnswer,
          explanation: question.explanation,
          subject: question.subject,
          skill: question.skill,
          difficultyLevel: question.difficultyLevel
        })
      }
    })

    const totalQuestions = exam.questions.length
    const percentage = Math.round((correctAnswers / totalQuestions) * 100)

    // Calcular puntajes por materia
    const subjectScores = this.calculateSubjectScores(session, exam)

    // Calcular puntajes por habilidad
    const skillScores = this.calculateSkillScores(session, exam)

    // Calcular análisis por dificultad
    const difficultyAnalysis = this.calculateDifficultyAnalysis(session, exam)

    // Análisis temporal
    const averageTimePerQuestion = timeDistribution.length > 0 
      ? timeDistribution.reduce((sum, time) => sum + time, 0) / timeDistribution.length 
      : 0

    const timeAnalysis = {
      averageTimePerQuestion,
      timeDistribution,
      rushPeriods: this.identifyRushPeriods(timeDistribution),
      slowPeriods: this.identifySlowPeriods(timeDistribution)
    }

    // Generar recomendaciones
    const recommendations = this.generateRecommendations(
      subjectScores,
      skillScores,
      difficultyAnalysis,
      timeAnalysis
    )

    const results: ExamResults = {
      id: this.generateId(),
      sessionId: session.id,
      userId: session.userId,
      examId: exam.id,
      completedAt: finishedAt,
      timeSpent: totalTimeSpent,
      totalScore: correctAnswers,
      correctAnswers,
      totalQuestions,
      percentage,
      subjectScores,
      skillScores,
      difficultyAnalysis,
      incorrectQuestions,
      timeAnalysis,
      recommendations
    }

    return results
  }

  /**
   * Verifica si una respuesta es correcta
   */
  private static isAnswerCorrect(answer: UserAnswer, question: ExamQuestion): boolean {
    if (answer.selectedAnswer === null || answer.selectedAnswer === undefined) {
      return false
    }

    if (Array.isArray(question.correctAnswer)) {
      // Preguntas de selección múltiple
      if (!Array.isArray(answer.selectedAnswer)) return false
      
      const userAnswers = answer.selectedAnswer.sort()
      const correctAnswers = question.correctAnswer.sort()
      
      return userAnswers.length === correctAnswers.length &&
             userAnswers.every((ans, idx) => ans === correctAnswers[idx])
    } else {
      // Pregunta de una sola respuesta
      return answer.selectedAnswer === question.correctAnswer
    }
  }

  /**
   * Calcula puntajes por materia
   */
  private static calculateSubjectScores(
    session: ExamSession,
    exam: GeneratedExam
  ): Record<TestSubject, { score: number; total: number; percentage: number; timeSpent: number }> {
    const subjects: TestSubject[] = ['COMPETENCIA_LECTORA', 'MATEMATICA_M1', 'MATEMATICA_M2', 'HISTORIA', 'CIENCIAS']
    const scores: Record<TestSubject, { score: number; total: number; percentage: number; timeSpent: number }> = {} as any

    subjects.forEach(subject => {
      const subjectQuestions = exam.questions.filter(q => q.subject === subject)
      let correct = 0
      let totalTime = 0

      subjectQuestions.forEach(question => {
        const userAnswer = session.answers.find(a => a.questionId === question.id)
        if (userAnswer) {
          totalTime += userAnswer.timeSpent || 0
          if (this.isAnswerCorrect(userAnswer, question)) {
            correct++
          }
        }
      })

      scores[subject] = {
        score: correct,
        total: subjectQuestions.length,
        percentage: subjectQuestions.length > 0 ? Math.round((correct / subjectQuestions.length) * 100) : 0,
        timeSpent: totalTime
      }
    })

    return scores
  }

  /**
   * Calcula puntajes por habilidad
   */
  private static calculateSkillScores(
    session: ExamSession,
    exam: GeneratedExam
  ): Record<PAESSkill, { score: number; total: number; percentage: number; averageTime: number }> {
    const skills: PAESSkill[] = ['TRACK_LOCATE', 'INTERPRET_RELATE', 'EVALUATE_REFLECT', 'SOLVE_PROBLEMS', 'REPRESENT', 'MODEL', 'ARGUE_COMMUNICATE']
    const scores: Record<PAESSkill, { score: number; total: number; percentage: number; averageTime: number }> = {} as any

    skills.forEach(skill => {
      const skillQuestions = exam.questions.filter(q => q.skill === skill)
      let correct = 0
      let totalTime = 0

      skillQuestions.forEach(question => {
        const userAnswer = session.answers.find(a => a.questionId === question.id)
        if (userAnswer) {
          totalTime += userAnswer.timeSpent || 0
          if (this.isAnswerCorrect(userAnswer, question)) {
            correct++
          }
        }
      })

      scores[skill] = {
        score: correct,
        total: skillQuestions.length,
        percentage: skillQuestions.length > 0 ? Math.round((correct / skillQuestions.length) * 100) : 0,
        averageTime: skillQuestions.length > 0 ? Math.round(totalTime / skillQuestions.length) : 0
      }
    })

    return scores
  }

  /**
   * Calcula análisis por dificultad
   */
  private static calculateDifficultyAnalysis(
    session: ExamSession,
    exam: GeneratedExam
  ): Record<DifficultyLevel, { score: number; total: number; percentage: number; averageTime: number }> {
    const difficulties: DifficultyLevel[] = ['BASICO', 'INTERMEDIO', 'AVANZADO']
    const analysis: Record<DifficultyLevel, { score: number; total: number; percentage: number; averageTime: number }> = {} as any

    difficulties.forEach(difficulty => {
      const difficultyQuestions = exam.questions.filter(q => q.difficultyLevel === difficulty)
      let correct = 0
      let totalTime = 0

      difficultyQuestions.forEach(question => {
        const userAnswer = session.answers.find(a => a.questionId === question.id)
        if (userAnswer) {
          totalTime += userAnswer.timeSpent || 0
          if (this.isAnswerCorrect(userAnswer, question)) {
            correct++
          }
        }
      })

      analysis[difficulty] = {
        score: correct,
        total: difficultyQuestions.length,
        percentage: difficultyQuestions.length > 0 ? Math.round((correct / difficultyQuestions.length) * 100) : 0,
        averageTime: difficultyQuestions.length > 0 ? Math.round(totalTime / difficultyQuestions.length) : 0
      }
    })

    return analysis
  }

  /**
   * Identifica períodos de prisa (respuestas muy rápidas)
   */
  private static identifyRushPeriods(timeDistribution: number[]): Array<{ start: number; end: number }> {
    const rushPeriods: Array<{ start: number; end: number }> = []
    const avgTime = timeDistribution.reduce((sum, time) => sum + time, 0) / timeDistribution.length
    const rushThreshold = avgTime * 0.5 // 50% del tiempo promedio

    let rushStart = -1
    timeDistribution.forEach((time, index) => {
      if (time < rushThreshold) {
        if (rushStart === -1) {
          rushStart = index
        }
      } else {
        if (rushStart !== -1) {
          rushPeriods.push({ start: rushStart, end: index - 1 })
          rushStart = -1
        }
      }
    })

    if (rushStart !== -1) {
      rushPeriods.push({ start: rushStart, end: timeDistribution.length - 1 })
    }

    return rushPeriods
  }

  /**
   * Identifica períodos lentos (respuestas muy lentas)
   */
  private static identifySlowPeriods(timeDistribution: number[]): Array<{ start: number; end: number }> {
    const slowPeriods: Array<{ start: number; end: number }> = []
    const avgTime = timeDistribution.reduce((sum, time) => sum + time, 0) / timeDistribution.length
    const slowThreshold = avgTime * 2 // 200% del tiempo promedio

    let slowStart = -1
    timeDistribution.forEach((time, index) => {
      if (time > slowThreshold) {
        if (slowStart === -1) {
          slowStart = index
        }
      } else {
        if (slowStart !== -1) {
          slowPeriods.push({ start: slowStart, end: index - 1 })
          slowStart = -1
        }
      }
    })

    if (slowStart !== -1) {
      slowPeriods.push({ start: slowStart, end: timeDistribution.length - 1 })
    }

    return slowPeriods
  }

  /**
   * Genera recomendaciones basadas en los resultados
   */
  private static generateRecommendations(
    subjectScores: ExamResults['subjectScores'],
    skillScores: ExamResults['skillScores'],
    difficultyAnalysis: ExamResults['difficultyAnalysis'],
    timeAnalysis: ExamResults['timeAnalysis']
  ): ExamResults['recommendations'] {
    const recommendations: ExamResults['recommendations'] = []

    // Recomendaciones por materia
    Object.entries(subjectScores).forEach(([subject, score]) => {
      if (score.percentage < 60 && score.total > 0) {
        recommendations.push({
          type: 'STUDY_MORE',
          priority: score.percentage < 40 ? 'HIGH' : 'MEDIUM',
          description: `Necesitas reforzar ${this.getSubjectName(subject as TestSubject)}`,
          actionItems: [
            `Revisar conceptos básicos de ${this.getSubjectName(subject as TestSubject)}`,
            'Realizar ejercicios de práctica adicionales',
            'Consultar material de apoyo'
          ]
        })
      }
    })

    // Recomendaciones por habilidad
    Object.entries(skillScores).forEach(([skill, score]) => {
      if (score.percentage < 60 && score.total > 0) {
        recommendations.push({
          type: 'PRACTICE_SKILL',
          priority: score.percentage < 40 ? 'HIGH' : 'MEDIUM',
          description: `Mejorar habilidad: ${this.getSkillName(skill as PAESSkill)}`,
          actionItems: [
            `Practicar ejercicios específicos de ${this.getSkillName(skill as PAESSkill)}`,
            'Estudiar técnicas y estrategias para esta habilidad'
          ]
        })
      }
    })

    // Recomendaciones de gestión del tiempo
    if (timeAnalysis.rushPeriods.length > 0) {
      recommendations.push({
        type: 'TIME_MANAGEMENT',
        priority: 'MEDIUM',
        description: 'Mejora tu gestión del tiempo durante el examen',
        actionItems: [
          'Practica con cronómetro para mejorar tu ritmo',
          'Lee cuidadosamente antes de responder',
          'No te apresures en las primeras preguntas'
        ]
      })
    }

    if (timeAnalysis.slowPeriods.length > 0) {
      recommendations.push({
        type: 'TIME_MANAGEMENT',
        priority: 'MEDIUM',
        description: 'Optimiza tu velocidad de respuesta',
        actionItems: [
          'Practica técnicas de lectura rápida',
          'Aprende a identificar respuestas obvias',
          'No te detengas demasiado en preguntas difíciles'
        ]
      })
    }

    return recommendations
  }

  /**
   * Guarda los resultados en la base de datos
   */
  private static async saveResults(results: ExamResults): Promise<void> {
    try {
      const { error } = await supabase
        .from('exam_results')
        .insert({
          id: results.id,
          session_id: results.sessionId,
          user_id: results.userId,
          exam_id: results.examId,
          completed_at: results.completedAt,
          time_spent: results.timeSpent,
          total_score: results.totalScore,
          correct_answers: results.correctAnswers,
          total_questions: results.totalQuestions,
          percentage: results.percentage,
          subject_scores: results.subjectScores,
          skill_scores: results.skillScores,
          difficulty_analysis: results.difficultyAnalysis,
          incorrect_questions: results.incorrectQuestions,
          time_analysis: results.timeAnalysis,
          recommendations: results.recommendations
        })

      if (error) throw error

    } catch (error) {
      console.error('Error saving results:', error)
      throw new Error('No se pudieron guardar los resultados')
    }
  }

  /**
   * Actualiza el progreso del usuario basado en los resultados
   */
  private static async updateUserProgress(
    userId: string,
    results: ExamResults
  ): Promise<void> {
    try {
      // Actualizar estadísticas generales del usuario
      const { error: userError } = await supabase
        .from('users')
        .update({
          total_study_minutes: supabase.sql`total_study_minutes + ${Math.ceil(results.timeSpent / 60)}`,
          last_login: new Date().toISOString(),
          updated_at: new Date().toISOString()
        })
        .eq('id', userId)

      if (userError) throw userError

      // Actualizar progreso en nodos relacionados si es aplicable
      // (esto se puede implementar según la estructura específica de learning_nodes)

    } catch (error) {
      console.error('Error updating user progress:', error)
      // No lanzar error aquí para no afectar el flujo principal
    }
  }

  // Métodos auxiliares

  private static getSubjectName(subject: TestSubject): string {
    const names: Record<TestSubject, string> = {
      'COMPETENCIA_LECTORA': 'Competencia Lectora',
      'MATEMATICA_M1': 'Matemática M1',
      'MATEMATICA_M2': 'Matemática M2',
      'HISTORIA': 'Historia y Ciencias Sociales',
      'CIENCIAS': 'Ciencias'
    }
    return names[subject]
  }

  private static getSkillName(skill: PAESSkill): string {
    const names: Record<PAESSkill, string> = {
      'TRACK_LOCATE': 'Rastrear y Localizar',
      'INTERPRET_RELATE': 'Interpretar y Relacionar',
      'EVALUATE_REFLECT': 'Evaluar y Reflexionar',
      'SOLVE_PROBLEMS': 'Resolver Problemas',
      'REPRESENT': 'Representar',
      'MODEL': 'Modelar',
      'ARGUE_COMMUNICATE': 'Argumentar y Comunicar'
    }
    return names[skill]
  }

  private static generateId(): string {
    return quantumIdSync('session-')
  }
}
