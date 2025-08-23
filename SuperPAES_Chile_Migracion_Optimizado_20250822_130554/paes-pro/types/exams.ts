import { Database } from './database'

// Tipos base para el sistema de exámenes
export type ExamType = 'DIAGNOSTIC' | 'PRACTICE' | 'SIMULATION' | 'ADAPTIVE' | 'QUICK_REVIEW'

export type QuestionType = 'MULTIPLE_CHOICE' | 'TRUE_FALSE' | 'MATCHING' | 'ORDERING'

export type DifficultyLevel = 'BASICO' | 'INTERMEDIO' | 'AVANZADO'

export type TestSubject = 'COMPETENCIA_LECTORA' | 'MATEMATICA_M1' | 'MATEMATICA_M2' | 'HISTORIA' | 'CIENCIAS'

export type PAESSkill = 
  | 'TRACK_LOCATE'           // Rastrear y Localizar
  | 'INTERPRET_RELATE'       // Interpretar y Relacionar  
  | 'EVALUATE_REFLECT'       // Evaluar y Reflexionar
  | 'SOLVE_PROBLEMS'         // Resolver Problemas
  | 'REPRESENT'              // Representar
  | 'MODEL'                  // Modelar
  | 'ARGUE_COMMUNICATE'      // Argumentar y Comunicar

// Interfaz para una pregunta individual
export interface ExamQuestion {
  id: string
  questionText: string
  questionType: QuestionType
  options: string[]
  correctAnswer: number | number[] // Índice(s) de respuesta(s) correcta(s)
  explanation?: string
  subject: TestSubject
  skill: PAESSkill
  difficultyLevel: DifficultyLevel
  bloomLevel: string
  estimatedTime: number // segundos
  tags: string[]
  context?: string // Texto adicional para preguntas de comprensión
  imageUrl?: string
  metadata?: {
    source?: string
    chapter?: string
    topic?: string
    year?: number
  }
}

// Respuesta del usuario a una pregunta
export interface UserAnswer {
  questionId: string
  selectedAnswer: number | number[] | null
  timeSpent: number // segundos
  confidence?: number // 1-5 escala
  markedForReview?: boolean
  timestamp: string
}

// Configuración para generar un examen
export interface ExamConfig {
  examType: ExamType
  subject?: TestSubject | TestSubject[] // null para examen completo PAES
  numberOfQuestions: number
  timeLimit?: number // minutos
  difficultyDistribution?: {
    basico: number     // porcentaje
    intermedio: number // porcentaje  
    avanzado: number   // porcentaje
  }
  skillDistribution?: Partial<Record<PAESSkill, number>> // porcentajes
  isAdaptive?: boolean
  includeExplanations?: boolean
  allowReview?: boolean
  shuffleQuestions?: boolean
  shuffleOptions?: boolean
  passingScore?: number
  topics?: string[] // Temas específicos a incluir
}

// Examen completo generado
export interface GeneratedExam {
  id: string
  title: string
  description: string
  config: ExamConfig
  questions: ExamQuestion[]
  createdAt: string
  estimatedDuration: number // minutos
  metadata: {
    totalQuestions: number
    subjectDistribution: Record<TestSubject, number>
    skillDistribution: Record<PAESSkill, number>
    difficultyDistribution: Record<DifficultyLevel, number>
  }
}

// Sesión de examen en progreso
export interface ExamSession {
  id: string
  examId: string
  userId: string
  startedAt: string
  finishedAt?: string
  status: 'NOT_STARTED' | 'IN_PROGRESS' | 'COMPLETED' | 'ABANDONED' | 'EXPIRED'
  currentQuestionIndex: number
  answers: UserAnswer[]
  timeRemaining?: number // segundos
  allowedTimeExtensions: number
  breaks: Array<{
    startTime: string
    endTime?: string
    reason?: string
  }>
  settings: {
    allowReview: boolean
    allowBacktrack: boolean
    showTimer: boolean
    enableBreaks: boolean
  }
}

// Resultados detallados del examen
export interface ExamResults {
  id: string
  sessionId: string
  userId: string
  examId: string
  completedAt: string
  timeSpent: number // segundos
  
  // Puntajes generales
  totalScore: number
  correctAnswers: number
  totalQuestions: number
  percentage: number
  
  // Puntajes por materia
  subjectScores: Record<TestSubject, {
    score: number
    total: number
    percentage: number
    timeSpent: number
  }>
  
  // Puntajes por habilidad
  skillScores: Record<PAESSkill, {
    score: number
    total: number
    percentage: number
    averageTime: number
  }>
  
  // Análisis por dificultad
  difficultyAnalysis: Record<DifficultyLevel, {
    score: number
    total: number
    percentage: number
    averageTime: number
  }>
  
  // Preguntas incorrectas
  incorrectQuestions: Array<{
    questionId: string
    userAnswer: number | number[] | null
    correctAnswer: number | number[]
    explanation?: string
    subject: TestSubject
    skill: PAESSkill
    difficultyLevel: DifficultyLevel
  }>
  
  // Análisis temporal
  timeAnalysis: {
    averageTimePerQuestion: number
    timeDistribution: number[] // tiempo por pregunta
    rushPeriods: Array<{ start: number, end: number }> // períodos de prisa
    slowPeriods: Array<{ start: number, end: number }> // períodos lentos
  }
  
  // Recomendaciones basadas en resultados
  recommendations: Array<{
    type: 'STUDY_MORE' | 'PRACTICE_SKILL' | 'REVIEW_TOPIC' | 'TIME_MANAGEMENT'
    priority: 'HIGH' | 'MEDIUM' | 'LOW'
    description: string
    actionItems: string[]
  }>
  
  // Comparación con otros usuarios
  benchmarks?: {
    averageScore: number
    percentileRank: number
    userRank?: number
    totalParticipants?: number
  }
}

// Configuración para generación adaptativa
export interface AdaptiveConfig {
  startingDifficulty: DifficultyLevel
  difficultyAdjustmentThreshold: number // 0.0 - 1.0
  maxDifficultyJump: number // niveles
  convergenceTarget: number // puntaje objetivo
  minimumQuestions: number
  maximumQuestions: number
  confidenceInterval: number
  timeWeighting: number // importancia del tiempo en adaptación
}

// Estado del algoritmo adaptativo
export interface AdaptiveState {
  currentDifficulty: DifficultyLevel
  estimatedAbility: number
  confidence: number
  questionsAnswered: number
  recentPerformance: number[] // últimas 5 respuestas
  convergenceReached: boolean
  recommendedNextDifficulty: DifficultyLevel
}

// Tipos para la API de OpenRouter (generación de preguntas)
export interface QuestionGenerationPrompt {
  subject: TestSubject
  skill: PAESSkill
  difficultyLevel: DifficultyLevel
  topic?: string
  context?: string
  bloomLevel?: string
  questionType?: QuestionType
  includeDistractors?: boolean
  language?: 'es' | 'en'
}

export interface GeneratedQuestionResponse {
  question: Omit<ExamQuestion, 'id' | 'estimatedTime'>
  quality: {
    score: number // 0-100
    issues: string[]
    suggestions: string[]
  }
  generatedAt: string
  model: string
  tokensUsed: number
}

// Configuración para el generador de exámenes con IA
export interface AIExamGeneratorConfig {
  openRouterApiKey: string
  model: string // ej: 'anthropic/claude-3-sonnet'
  temperature: number
  maxTokens: number
  systemPrompt: string
  enableQualityCheck: boolean
  enableDuplicateDetection: boolean
  retryAttempts: number
}

// Analytics y estadísticas del sistema
export interface ExamAnalytics {
  userId: string
  period: 'DAILY' | 'WEEKLY' | 'MONTHLY' | 'ALL_TIME'
  
  examsTaken: number
  totalTimeSpent: number
  averageScore: number
  improvementRate: number
  
  subjectPerformance: Record<TestSubject, {
    examsTaken: number
    averageScore: number
    bestScore: number
    worstScore: number
    improvement: number
    timeSpent: number
  }>
  
  skillDevelopment: Record<PAESSkill, {
    currentLevel: number
    startingLevel: number
    improvement: number
    questionsAnswered: number
    accuracy: number
  }>
  
  studyPatterns: {
    preferredTimes: string[] // horas del día
    averageSessionDuration: number
    breakFrequency: number
    consistencyScore: number // 0-100
  }
  
  predictions: {
    paesScorePrediction: number
    confidenceInterval: [number, number]
    readinessLevel: 'LOW' | 'MEDIUM' | 'HIGH'
    estimatedStudyHoursNeeded: number
  }
}

// Configuración para simulacros PAES completos
export interface PAESSimulationConfig {
  includeAllSubjects: boolean
  subjects: TestSubject[]
  officialTiming: boolean // usar tiempos oficiales PAES
  officialQuestionCounts: boolean
  breaks: {
    enabled: boolean
    duration: number // minutos
    between: TestSubject[] // materias entre las que hay break
  }
  realTimeReporting: boolean
  proctoring: {
    enabled: boolean
    webcamRequired: boolean
    screenRecording: boolean
    preventTabSwitching: boolean
  }
}

// Tipos para el banco de preguntas
export interface QuestionBank {
  id: string
  name: string
  description: string
  subject: TestSubject
  totalQuestions: number
  difficultyDistribution: Record<DifficultyLevel, number>
  skillCoverage: Record<PAESSkill, number>
  lastUpdated: string
  isActive: boolean
  metadata: {
    source: string
    year: number
    validated: boolean
    qualityScore: number
  }
}

// Métricas de calidad de preguntas
export interface QuestionQuality {
  questionId: string
  discriminationIndex: number // -1 a 1
  difficultyIndex: number // 0 a 1
  responseDistribution: number[] // distribución de respuestas por opción
  averageTime: number
  studentFeedback: {
    clarity: number // 1-5
    relevance: number // 1-5
    difficulty: number // 1-5
    comments: string[]
  }
  expertReview: {
    score: number // 0-100
    reviewer: string
    comments: string
    lastReviewed: string
  }
}
