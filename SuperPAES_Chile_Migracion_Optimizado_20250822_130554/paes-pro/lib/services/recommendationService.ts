import { User } from '@/types/auth'
import { UserStats, SubjectProgress, LearningMetrics } from './userDataService'
import { quantumRandomSync } from '@/lib/utils/quantumRandom'

export interface Recommendation {
  id: string
  type: 'study' | 'practice' | 'review' | 'goal' | 'motivation'
  priority: 'low' | 'medium' | 'high' | 'critical'
  title: string
  description: string
  actionText: string
  actionUrl?: string
  estimatedTime?: number
  dueDate?: string
  tags: string[]
  icon: string
}

export interface StudyPlan {
  daily: {
    recommendedMinutes: number
    suggestedSessions: number
    optimalTimes: string[]
  }
  weekly: {
    goals: string[]
    focusAreas: string[]
    milestones: Array<{
      title: string
      deadline: string
      description: string
    }>
  }
  subjects: Array<{
    subject: string
    priority: number
    weeklyHours: number
    focusTopics: string[]
  }>
}

export class RecommendationService {
  /**
   * Genera recomendaciones personalizadas basadas en el perfil del usuario
   */
  static async generateRecommendations(
    user: User,
    stats: UserStats,
    metrics: LearningMetrics
  ): Promise<Recommendation[]> {
    const recommendations: Recommendation[] = []

    // Recomendaciones basadas en actividad reciente
    this.addActivityRecommendations(recommendations, stats)

    // Recomendaciones basadas en progreso por materia
    this.addSubjectRecommendations(recommendations, metrics.subjectBreakdown)

    // Recomendaciones basadas en habilidades
    this.addSkillRecommendations(recommendations, metrics.skillsProgress)

    // Recomendaciones basadas en objetivos
    this.addGoalRecommendations(recommendations, user, stats)

    // Recomendaciones motivacionales
    this.addMotivationalRecommendations(recommendations, stats)

    // Ordenar por prioridad
    return recommendations.sort((a, b) => {
      const priorityOrder = { critical: 4, high: 3, medium: 2, low: 1 }
      return priorityOrder[b.priority] - priorityOrder[a.priority]
    })
  }

  /**
   * Genera un plan de estudio personalizado
   */
  static generateStudyPlan(
    user: User,
    stats: UserStats,
    metrics: LearningMetrics
  ): StudyPlan {
    // Calcular minutos diarios recomendados basado en el progreso actual
    const baseMinutes = 60
    const progressFactor = stats.progressPercentage / 100
    const streakBonus = Math.min(stats.currentStreakDays * 5, 30)
    const recommendedMinutes = Math.round(baseMinutes + (baseMinutes * (1 - progressFactor)) + streakBonus)

    // Identificar materias que necesitan más atención
    const weakSubjects = metrics.subjectBreakdown
      .filter(subject => subject.strength === 'weak')
      .sort((a, b) => a.progress - b.progress)

    const focusAreas = weakSubjects.length > 0 
      ? weakSubjects.slice(0, 2).map(s => s.displayName)
      : ['Mantener el nivel actual', 'Preparación para exámenes']

    // Generar metas semanales
    const weeklyGoals = this.generateWeeklyGoals(stats, metrics)

    // Calcular distribución de tiempo por materia
    const subjectDistribution = this.calculateSubjectTimeDistribution(metrics.subjectBreakdown)

    return {
      daily: {
        recommendedMinutes,
        suggestedSessions: Math.ceil(recommendedMinutes / 45), // Sesiones de 45 min
        optimalTimes: this.getOptimalStudyTimes(user)
      },
      weekly: {
        goals: weeklyGoals,
        focusAreas,
        milestones: this.generateMilestones(user, stats)
      },
      subjects: subjectDistribution
    }
  }

  /**
   * Añade recomendaciones basadas en actividad reciente
   */
  private static addActivityRecommendations(recommendations: Recommendation[], stats: UserStats) {
    if (stats.currentStreakDays === 0) {
      recommendations.push({
        id: 'resume-studying',
        type: 'motivation',
        priority: 'high',
        title: 'Retoma tu rutina de estudio',
        description: 'Has perdido tu racha de estudio. ¡Es hora de volver a empezar!',
        actionText: 'Comenzar sesión de estudio',
        estimatedTime: 30,
        tags: ['motivación', 'rutina'],
        icon: 'play-circle'
      })
    } else if (stats.currentStreakDays >= 7) {
      recommendations.push({
        id: 'streak-celebration',
        type: 'motivation',
        priority: 'medium',
        title: `¡${stats.currentStreakDays} días seguidos!`,
        description: 'Felicitaciones por mantener tu racha de estudio. ¡Sigue así!',
        actionText: 'Continuar racha',
        tags: ['logro', 'motivación'],
        icon: 'trophy'
      })
    }

    if (stats.totalStudyMinutes < 60) {
      recommendations.push({
        id: 'increase-study-time',
        type: 'study',
        priority: 'medium',
        title: 'Aumenta tu tiempo de estudio',
        description: 'Considera dedicar más tiempo diario al estudio para mejores resultados.',
        actionText: 'Ver plan de estudio',
        estimatedTime: 60,
        tags: ['tiempo', 'plan'],
        icon: 'clock'
      })
    }
  }

  /**
   * Añade recomendaciones basadas en progreso por materia
   */
  private static addSubjectRecommendations(recommendations: Recommendation[], subjects: SubjectProgress[]) {
    // Identificar materia más débil
    const weakestSubject = subjects.reduce((weakest, current) => 
      current.progress < weakest.progress ? current : weakest
    )

    if (weakestSubject.progress < 50) {
      recommendations.push({
        id: `focus-${weakestSubject.subject.toLowerCase()}`,
        type: 'study',
        priority: 'high',
        title: `Refuerza ${weakestSubject.displayName}`,
        description: `Tu progreso en ${weakestSubject.displayName} es del ${weakestSubject.progress}%. Necesita más atención.`,
        actionText: 'Estudiar ahora',
        actionUrl: `/subjects/${weakestSubject.subject.toLowerCase()}`,
        estimatedTime: 45,
        tags: [weakestSubject.displayName.toLowerCase(), 'mejora'],
        icon: 'book-open'
      })
    }

    // Identificar materias con buen progreso para mantener
    const strongSubjects = subjects.filter(s => s.strength === 'strong')
    if (strongSubjects.length > 0) {
      const randomIndex = Math.floor(quantumRandomSync() * strongSubjects.length)
      const randomStrong = strongSubjects[randomIndex]
      recommendations.push({
        id: `maintain-${randomStrong.subject.toLowerCase()}`,
        type: 'review',
        priority: 'low',
        title: `Mantén tu nivel en ${randomStrong.displayName}`,
        description: `Tienes un excelente progreso del ${randomStrong.progress}%. Haz una revisión rápida.`,
        actionText: 'Revisar contenido',
        estimatedTime: 20,
        tags: [randomStrong.displayName.toLowerCase(), 'repaso'],
        icon: 'check-circle'
      })
    }
  }

  /**
   * Añade recomendaciones basadas en habilidades PAES
   */
  private static addSkillRecommendations(recommendations: Recommendation[], skills: any[]) {
    // Encontrar habilidad más débil
    const weakestSkill = skills.reduce((weakest, current) => 
      current.masteryPercentage < weakest.masteryPercentage ? current : weakest
    )

    if (weakestSkill.masteryPercentage < 50) {
      recommendations.push({
        id: `improve-${weakestSkill.skill.toLowerCase().replace(/\s+/g, '-')}`,
        type: 'practice',
        priority: 'medium',
        title: `Practica ${weakestSkill.skill}`,
        description: `Tu dominio en ${weakestSkill.skill} es del ${weakestSkill.masteryPercentage}%. Practica más ejercicios.`,
        actionText: 'Practicar habilidad',
        estimatedTime: 30,
        tags: ['habilidades', weakestSkill.skill.toLowerCase()],
        icon: 'target'
      })
    }
  }

  /**
   * Añade recomendaciones basadas en objetivos del usuario
   */
  private static addGoalRecommendations(recommendations: Recommendation[], user: User, stats: UserStats) {
    if (user.paes_target_date) {
      const targetDate = new Date(user.paes_target_date)
      const now = new Date()
      const daysUntilExam = Math.ceil((targetDate.getTime() - now.getTime()) / (1000 * 60 * 60 * 24))

      if (daysUntilExam > 0 && daysUntilExam <= 30) {
        recommendations.push({
          id: 'exam-preparation-intensive',
          type: 'goal',
          priority: 'critical',
          title: `¡Solo faltan ${daysUntilExam} días para la PAES!`,
          description: 'Es momento de intensificar tu preparación. Enfócate en simulacros y repaso.',
          actionText: 'Plan intensivo',
          tags: ['examen', 'urgente'],
          icon: 'calendar'
        })
      } else if (daysUntilExam > 30 && daysUntilExam <= 90) {
        recommendations.push({
          id: 'exam-preparation-regular',
          type: 'goal',
          priority: 'high',
          title: `${daysUntilExam} días para la PAES`,
          description: 'Mantén tu ritmo de estudio constante y realiza evaluaciones periódicas.',
          actionText: 'Ver cronograma',
          tags: ['examen', 'planificación'],
          icon: 'calendar'
        })
      }
    }

    if (user.target_career && user.target_university) {
      recommendations.push({
        id: 'career-focus',
        type: 'goal',
        priority: 'medium',
        title: `Enfócate en tu objetivo: ${user.target_career}`,
        description: `Revisa los puntajes requeridos para ${user.target_career} en ${user.target_university}.`,
        actionText: 'Ver requisitos',
        tags: ['carrera', 'universidad'],
        icon: 'graduation-cap'
      })
    }
  }

  /**
   * Añade recomendaciones motivacionales
   */
  private static addMotivationalRecommendations(recommendations: Recommendation[], stats: UserStats) {
    if (stats.progressPercentage >= 75) {
      recommendations.push({
        id: 'excellent-progress',
        type: 'motivation',
        priority: 'low',
        title: '¡Excelente progreso!',
        description: `Has completado el ${stats.progressPercentage}% de tu preparación. ¡Vas muy bien!`,
        actionText: 'Continuar',
        tags: ['logro', 'motivación'],
        icon: 'star'
      })
    } else if (stats.progressPercentage < 25) {
      recommendations.push({
        id: 'motivation-boost',
        type: 'motivation',
        priority: 'medium',
        title: 'Todo gran viaje comienza con un paso',
        description: 'Has comenzado tu preparación. Cada minuto de estudio te acerca a tu meta.',
        actionText: 'Siguiente paso',
        tags: ['motivación', 'inicio'],
        icon: 'heart'
      })
    }
  }

  /**
   * Genera metas semanales basadas en el progreso actual
   */
  private static generateWeeklyGoals(stats: UserStats, metrics: LearningMetrics): string[] {
    const goals: string[] = []

    if (stats.currentStreakDays < 7) {
      goals.push('Mantener una racha de estudio de 7 días')
    }

    if (stats.averageScore < 70) {
      goals.push('Mejorar el promedio de calificaciones a 70%')
    }

    goals.push('Completar al menos 5 sesiones de estudio')
    goals.push('Revisar contenido de las materias más débiles')

    return goals
  }

  /**
   * Genera hitos basados en el perfil del usuario
   */
  private static generateMilestones(user: User, stats: UserStats): Array<{title: string, deadline: string, description: string}> {
    const milestones = []
    const now = new Date()

    // Hito de progreso general
    const nextProgressTarget = Math.ceil(stats.progressPercentage / 25) * 25
    if (nextProgressTarget <= 100) {
      const progressDeadline = new Date(now.getTime() + 14 * 24 * 60 * 60 * 1000)
      milestones.push({
        title: `Alcanzar ${nextProgressTarget}% de progreso`,
        deadline: progressDeadline.toISOString().split('T')[0],
        description: `Completar más nodos de aprendizaje para llegar al ${nextProgressTarget}%`
      })
    }

    // Hito de racha de estudio
    const nextStreakTarget = Math.max(7, Math.ceil(stats.currentStreakDays / 7) * 7)
    const streakDeadline = new Date(now.getTime() + nextStreakTarget * 24 * 60 * 60 * 1000)
    milestones.push({
      title: `Racha de ${nextStreakTarget} días`,
      deadline: streakDeadline.toISOString().split('T')[0],
      description: `Mantener el estudio diario por ${nextStreakTarget} días consecutivos`
    })

    return milestones
  }

  /**
   * Obtiene horarios óptimos de estudio basados en el perfil del usuario
   */
  private static getOptimalStudyTimes(user: User): string[] {
    // Por ahora retornamos horarios generales, pero se puede personalizar
    // basado en las preferencias del usuario cuando estén disponibles
    return ['09:00', '15:00', '19:00']
  }

  /**
   * Calcula la distribución de tiempo por materia
   */
  private static calculateSubjectTimeDistribution(subjects: SubjectProgress[]): Array<{
    subject: string
    priority: number
    weeklyHours: number
    focusTopics: string[]
  }> {
    const totalWeeklyHours = 10 // Base de 10 horas semanales
    
    return subjects.map(subject => {
      // Dar más prioridad a materias más débiles
      const priority = subject.strength === 'weak' ? 3 : 
                      subject.strength === 'moderate' ? 2 : 1
      
      // Distribuir horas basado en debilidad
      const weaknessWeight = (100 - subject.progress) / 100
      const baseHours = totalWeeklyHours / subjects.length
      const weeklyHours = Math.round(baseHours * (1 + weaknessWeight))

      return {
        subject: subject.displayName,
        priority,
        weeklyHours,
        focusTopics: subject.recommendations.slice(0, 2)
      }
    })
  }
}
