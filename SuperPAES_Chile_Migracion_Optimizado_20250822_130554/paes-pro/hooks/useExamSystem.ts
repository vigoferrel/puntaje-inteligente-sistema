'use client'

import { useState, useEffect, useCallback } from 'react'
import { useAuth } from '@/contexts/AuthContext'
import { supabase } from '@/lib/supabase'
import { 
  GeneratedExam,
  ExamConfig,
  ExamSession,
  ExamResults,
  UserAnswer,
  ExamQuestion,
  PAESSkill,
  TestSubject,
  DifficultyLevel
} from '@/types/exams'
import { PAESExamGenerator, AIExamGeneratorConfig } from '@/lib/services/examGeneratorService'
import { ExamSessionService } from '@/lib/services/examSessionService'

// Hook para la generación de exámenes
export function useExamGenerator() {
  const [isGenerating, setIsGenerating] = useState(false)
  const [generatedExam, setGeneratedExam] = useState<GeneratedExam | null>(null)
  const [error, setError] = useState<string | null>(null)

  const generateExam = useCallback(async (config: ExamConfig) => {
    try {
      setIsGenerating(true)
      setError(null)

      const generatorConfig: AIExamGeneratorConfig = {
        openRouterApiKey: process.env.NEXT_PUBLIC_OPENROUTER_API_KEY || '',
        model: 'anthropic/claude-3-sonnet-20240229',
        temperature: 0.7,
        maxTokens: 1000,
        systemPrompt: '',
        enableQualityCheck: true,
        enableDuplicateDetection: true,
        retryAttempts: 3
      }

      const generator = new PAESExamGenerator(generatorConfig)
      const exam = await generator.generateExam(config)
      
      setGeneratedExam(exam)
      return exam

    } catch (err) {
      console.error('Error generating exam:', err)
      const errorMessage = err instanceof Error ? err.message : 'Error al generar el examen'
      setError(errorMessage)
      throw new Error(errorMessage)
    } finally {
      setIsGenerating(false)
    }
  }, [])

  const clearExam = useCallback(() => {
    setGeneratedExam(null)
    setError(null)
  }, [])

  return {
    generateExam,
    clearExam,
    generatedExam,
    isGenerating,
    error
  }
}

// Hook para manejar sesiones de examen
export function useExamSession(examId?: string) {
  const { user } = useAuth()
  const [session, setSession] = useState<ExamSession | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const startSession = useCallback(async (
    targetExamId: string,
    settings?: Partial<ExamSession['settings']>
  ) => {
    if (!user) throw new Error('Usuario no autenticado')

    try {
      setIsLoading(true)
      setError(null)

      const newSession = await ExamSessionService.startExamSession(
        targetExamId,
        user.id,
        settings
      )

      setSession(newSession)
      return newSession

    } catch (err) {
      console.error('Error starting session:', err)
      const errorMessage = err instanceof Error ? err.message : 'Error al iniciar sesión'
      setError(errorMessage)
      throw new Error(errorMessage)
    } finally {
      setIsLoading(false)
    }
  }, [user])

  const loadSession = useCallback(async (sessionId: string) => {
    try {
      setIsLoading(true)
      setError(null)

      const loadedSession = await ExamSessionService.getExamSession(sessionId)
      setSession(loadedSession)
      return loadedSession

    } catch (err) {
      console.error('Error loading session:', err)
      const errorMessage = err instanceof Error ? err.message : 'Error al cargar sesión'
      setError(errorMessage)
      return null
    } finally {
      setIsLoading(false)
    }
  }, [])

  const updateProgress = useCallback(async (
    updates: Partial<Pick<ExamSession, 'currentQuestionIndex' | 'timeRemaining' | 'status'>>
  ) => {
    if (!session) return

    try {
      await ExamSessionService.updateSessionProgress(session.id, updates)
      setSession(prev => prev ? { ...prev, ...updates } : null)

    } catch (err) {
      console.error('Error updating progress:', err)
      setError('Error al actualizar progreso')
    }
  }, [session])

  const saveAnswer = useCallback(async (answer: UserAnswer) => {
    if (!session) return

    try {
      await ExamSessionService.saveAnswer(session.id, answer)
      
      setSession(prev => {
        if (!prev) return null
        
        const existingIndex = prev.answers.findIndex(a => a.questionId === answer.questionId)
        const updatedAnswers = [...prev.answers]
        
        if (existingIndex >= 0) {
          updatedAnswers[existingIndex] = answer
        } else {
          updatedAnswers.push(answer)
        }
        
        return { ...prev, answers: updatedAnswers }
      })

    } catch (err) {
      console.error('Error saving answer:', err)
      setError('Error al guardar respuesta')
    }
  }, [session])

  const finishSession = useCallback(async (exam: GeneratedExam): Promise<ExamResults | null> => {
    if (!session) throw new Error('No hay sesión activa')

    try {
      setIsLoading(true)
      const results = await ExamSessionService.finishExamSession(session.id, exam)
      setSession(prev => prev ? { ...prev, status: 'COMPLETED' } : null)
      return results

    } catch (err) {
      console.error('Error finishing session:', err)
      const errorMessage = err instanceof Error ? err.message : 'Error al finalizar examen'
      setError(errorMessage)
      return null
    } finally {
      setIsLoading(false)
    }
  }, [session])

  const clearSession = useCallback(() => {
    setSession(null)
    setError(null)
  }, [])

  return {
    session,
    isLoading,
    error,
    startSession,
    loadSession,
    updateProgress,
    saveAnswer,
    finishSession,
    clearSession
  }
}

// Hook para el timer del examen
export function useExamTimer(initialTime?: number, onTimeUp?: () => void) {
  const [timeRemaining, setTimeRemaining] = useState(initialTime || 0)
  const [isActive, setIsActive] = useState(false)
  const [isPaused, setIsPaused] = useState(false)

  useEffect(() => {
    let interval: NodeJS.Timeout | null = null

    if (isActive && !isPaused && timeRemaining > 0) {
      interval = setInterval(() => {
        setTimeRemaining(time => {
          if (time <= 1) {
            setIsActive(false)
            onTimeUp?.()
            return 0
          }
          return time - 1
        })
      }, 1000)
    } else if (timeRemaining === 0) {
      setIsActive(false)
    }

    return () => {
      if (interval) clearInterval(interval)
    }
  }, [isActive, isPaused, timeRemaining, onTimeUp])

  const startTimer = useCallback((time?: number) => {
    if (time !== undefined) {
      setTimeRemaining(time)
    }
    setIsActive(true)
    setIsPaused(false)
  }, [])

  const pauseTimer = useCallback(() => {
    setIsPaused(true)
  }, [])

  const resumeTimer = useCallback(() => {
    setIsPaused(false)
  }, [])

  const stopTimer = useCallback(() => {
    setIsActive(false)
    setIsPaused(false)
  }, [])

  const resetTimer = useCallback((time?: number) => {
    setTimeRemaining(time || initialTime || 0)
    setIsActive(false)
    setIsPaused(false)
  }, [initialTime])

  const addTime = useCallback((seconds: number) => {
    setTimeRemaining(prev => prev + seconds)
  }, [])

  // Formatear tiempo para mostrar
  const formatTime = useCallback((seconds: number): string => {
    const hours = Math.floor(seconds / 3600)
    const minutes = Math.floor((seconds % 3600) / 60)
    const secs = seconds % 60

    if (hours > 0) {
      return `${hours}:${minutes.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`
    }
    return `${minutes}:${secs.toString().padStart(2, '0')}`
  }, [])

  const formattedTime = formatTime(timeRemaining)
  const isExpired = timeRemaining === 0
  const isRunning = isActive && !isPaused

  return {
    timeRemaining,
    formattedTime,
    isActive,
    isPaused,
    isExpired,
    isRunning,
    startTimer,
    pauseTimer,
    resumeTimer,
    stopTimer,
    resetTimer,
    addTime,
    formatTime
  }
}

// Hook para navegación entre preguntas
export function useExamNavigation(totalQuestions: number) {
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0)
  const [visitedQuestions, setVisitedQuestions] = useState<Set<number>>(new Set([0]))
  const [markedForReview, setMarkedForReview] = useState<Set<number>>(new Set())

  const goToQuestion = useCallback((index: number) => {
    if (index >= 0 && index < totalQuestions) {
      setCurrentQuestionIndex(index)
      setVisitedQuestions(prev => new Set([...prev, index]))
    }
  }, [totalQuestions])

  const goToNext = useCallback(() => {
    if (currentQuestionIndex < totalQuestions - 1) {
      goToQuestion(currentQuestionIndex + 1)
    }
  }, [currentQuestionIndex, totalQuestions, goToQuestion])

  const goToPrevious = useCallback(() => {
    if (currentQuestionIndex > 0) {
      goToQuestion(currentQuestionIndex - 1)
    }
  }, [currentQuestionIndex, goToQuestion])

  const goToFirst = useCallback(() => {
    goToQuestion(0)
  }, [goToQuestion])

  const goToLast = useCallback(() => {
    goToQuestion(totalQuestions - 1)
  }, [totalQuestions, goToQuestion])

  const toggleMarkForReview = useCallback((index?: number) => {
    const questionIndex = index !== undefined ? index : currentQuestionIndex
    setMarkedForReview(prev => {
      const newSet = new Set(prev)
      if (newSet.has(questionIndex)) {
        newSet.delete(questionIndex)
      } else {
        newSet.add(questionIndex)
      }
      return newSet
    })
  }, [currentQuestionIndex])

  const getQuestionStatus = useCallback((index: number) => {
    return {
      isCurrent: index === currentQuestionIndex,
      isVisited: visitedQuestions.has(index),
      isMarkedForReview: markedForReview.has(index),
      isFirst: index === 0,
      isLast: index === totalQuestions - 1
    }
  }, [currentQuestionIndex, visitedQuestions, markedForReview, totalQuestions])

  const canGoNext = currentQuestionIndex < totalQuestions - 1
  const canGoPrevious = currentQuestionIndex > 0
  const progress = Math.round(((currentQuestionIndex + 1) / totalQuestions) * 100)

  return {
    currentQuestionIndex,
    visitedQuestions: Array.from(visitedQuestions),
    markedForReview: Array.from(markedForReview),
    canGoNext,
    canGoPrevious,
    progress,
    goToQuestion,
    goToNext,
    goToPrevious,
    goToFirst,
    goToLast,
    toggleMarkForReview,
    getQuestionStatus
  }
}

// Hook unificado para todo el sistema de exámenes
export function useExamSystem() {
  const examGenerator = useExamGenerator()
  const examSession = useExamSession()
  const [currentExam, setCurrentExam] = useState<GeneratedExam | null>(null)
  const [examResults, setExamResults] = useState<ExamResults | null>(null)

  const createExam = useCallback(async (config: ExamConfig) => {
    try {
      const exam = await examGenerator.generateExam(config)
      setCurrentExam(exam)
      return exam
    } catch (error) {
      console.error('Error creating exam:', error)
      throw error
    }
  }, [examGenerator])

  const startExam = useCallback(async (
    exam: GeneratedExam,
    settings?: Partial<ExamSession['settings']>
  ) => {
    try {
      const session = await examSession.startSession(exam.id, settings)
      setCurrentExam(exam)
      return session
    } catch (error) {
      console.error('Error starting exam:', error)
      throw error
    }
  }, [examSession])

  const finishExam = useCallback(async () => {
    if (!currentExam) throw new Error('No hay examen activo')

    try {
      const results = await examSession.finishSession(currentExam)
      setExamResults(results)
      return results
    } catch (error) {
      console.error('Error finishing exam:', error)
      throw error
    }
  }, [examSession, currentExam])

  const clearAll = useCallback(() => {
    examGenerator.clearExam()
    examSession.clearSession()
    setCurrentExam(null)
    setExamResults(null)
  }, [examGenerator, examSession])

  const isLoading = examGenerator.isGenerating || examSession.isLoading
  const hasError = !!(examGenerator.error || examSession.error)
  const error = examGenerator.error || examSession.error

  return {
    // Estado
    currentExam,
    examResults,
    session: examSession.session,
    isLoading,
    hasError,
    error,

    // Acciones principales
    createExam,
    startExam,
    finishExam,
    clearAll,

    // Acciones de sesión
    saveAnswer: examSession.saveAnswer,
    updateProgress: examSession.updateProgress,

    // Datos del generador
    generatedExam: examGenerator.generatedExam
  }
}

// Hook para estadísticas y análisis de exámenes
export function useExamAnalytics(userId?: string) {
  const { user } = useAuth()
  const [analytics, setAnalytics] = useState<any>(null)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const targetUserId = userId || user?.id

  const loadAnalytics = useCallback(async () => {
    if (!targetUserId) return

    try {
      setIsLoading(true)
      setError(null)

      // Obtener analytics reales desde Supabase
      const { data: sessions, error: sessionsError } = await supabase
        .from('practice_sessions')
        .select('*')
        .eq('user_id', targetUserId)
        .order('created_at', { ascending: false })

      if (sessionsError) {
        console.error('Error fetching sessions:', sessionsError)
        setError('Error al cargar sesiones')
        return
      }

      // Obtener evaluaciones diagnósticas
      const { data: diagnostics, error: diagnosticsError } = await supabase
        .from('diagnostic_assessments')
        .select('*')
        .eq('user_id', targetUserId)
        .order('completed_at', { ascending: false })

      if (diagnosticsError) {
        console.warn('Error fetching diagnostics:', diagnosticsError)
      }

      // Calcular estadísticas
      const examsTaken = sessions?.length || 0
      const averageScore = sessions?.length > 0 
        ? Math.round(sessions.reduce((sum, session) => sum + (session.total_score || 0), 0) / sessions.length)
        : 0
      
      const totalTimeSpent = sessions?.reduce((sum, session) => sum + (session.time_spent_minutes || 0), 0) || 0
      
      // Calcular mejora (comparar últimas 5 sesiones con las 5 anteriores)
      let improvementRate = 0
      if (sessions && sessions.length >= 10) {
        const recentScores = sessions.slice(0, 5).map(s => s.total_score || 0)
        const previousScores = sessions.slice(5, 10).map(s => s.total_score || 0)
        
        const recentAvg = recentScores.reduce((sum, score) => sum + score, 0) / recentScores.length
        const previousAvg = previousScores.reduce((sum, score) => sum + score, 0) / previousScores.length
        
        improvementRate = Math.round(((recentAvg - previousAvg) / previousAvg) * 100)
      }

      // Determinar materias más fuertes y débiles
      const subjectScores = new Map<string, number[]>()
      sessions?.forEach(session => {
        const subject = session.test_type || 'unknown'
        const scores = subjectScores.get(subject) || []
        scores.push(session.total_score || 0)
        subjectScores.set(subject, scores)
      })

      let strongestSubject = 'N/A'
      let weakestSubject = 'N/A'
      
      if (subjectScores.size > 0) {
        const subjectAverages = Array.from(subjectScores.entries()).map(([subject, scores]) => ({
          subject,
          average: scores.reduce((sum, score) => sum + score, 0) / scores.length
        }))
        
        subjectAverages.sort((a, b) => b.average - a.average)
        strongestSubject = subjectAverages[0]?.subject || 'N/A'
        weakestSubject = subjectAverages[subjectAverages.length - 1]?.subject || 'N/A'
      }

      // Obtener puntajes recientes (últimos 5)
      const recentScores = sessions?.slice(0, 5).map(s => s.total_score || 0) || []

      const realAnalytics = {
        examsTaken,
        averageScore,
        improvementRate,
        strongestSubject,
        weakestSubject,
        totalTimeSpent,
        recentScores
      }

      setAnalytics(realAnalytics)

    } catch (err) {
      console.error('Error loading analytics:', err)
      setError('Error al cargar estadísticas')
    } finally {
      setIsLoading(false)
    }
  }, [targetUserId])

  useEffect(() => {
    if (targetUserId) {
      loadAnalytics()
    }
  }, [targetUserId, loadAnalytics])

  return {
    analytics,
    isLoading,
    error,
    loadAnalytics
  }
}

// Utilidades para presets de configuración de exámenes
export const useExamPresets = () => {
  const diagnosticPreset: ExamConfig = {
    examType: 'DIAGNOSTIC',
    numberOfQuestions: 30,
    timeLimit: 45,
    difficultyDistribution: { basico: 40, intermedio: 40, avanzado: 20 },
    includeExplanations: true,
    allowReview: true,
    shuffleQuestions: true
  }

  const practicePreset: ExamConfig = {
    examType: 'PRACTICE',
    numberOfQuestions: 20,
    timeLimit: 30,
    difficultyDistribution: { basico: 30, intermedio: 50, avanzado: 20 },
    includeExplanations: true,
    allowReview: true,
    shuffleQuestions: true
  }

  const simulationPreset: ExamConfig = {
    examType: 'SIMULATION',
    numberOfQuestions: 65,
    timeLimit: 150,
    difficultyDistribution: { basico: 25, intermedio: 50, avanzado: 25 },
    includeExplanations: false,
    allowReview: false,
    shuffleQuestions: true
  }

  const quickReviewPreset: ExamConfig = {
    examType: 'QUICK_REVIEW',
    numberOfQuestions: 10,
    timeLimit: 15,
    difficultyDistribution: { basico: 50, intermedio: 40, avanzado: 10 },
    includeExplanations: true,
    allowReview: true,
    shuffleQuestions: true
  }

  const getPresetBySubject = (subject: TestSubject, type: 'practice' | 'diagnostic' | 'simulation' = 'practice'): ExamConfig => {
    const baseConfig = type === 'diagnostic' ? diagnosticPreset : 
                     type === 'simulation' ? simulationPreset : 
                     practicePreset

    return {
      ...baseConfig,
      subject
    }
  }

  return {
    diagnosticPreset,
    practicePreset,
    simulationPreset,
    quickReviewPreset,
    getPresetBySubject
  }
}
