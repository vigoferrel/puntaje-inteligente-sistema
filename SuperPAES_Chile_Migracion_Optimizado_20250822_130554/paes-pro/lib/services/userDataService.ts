import { supabase } from '@/lib/supabase'
import { User } from '@/types/auth'
import { quantumRandomInt } from '@/lib/utils/quantumRandom'

export interface UserStats {
  totalStudyMinutes: number
  currentStreakDays: number
  maxStreakDays: number
  sessionsCompleted: number
  averageScore: number
  lastActivityDate: string | null
  completedNodes: number
  totalNodes: number
  progressPercentage: number
}

export interface SubjectProgress {
  subject: string
  displayName: string
  score: number | null
  progress: number
  completedNodes: number
  totalNodes: number
  averageTime: number
  lastActivity: string | null
  strength: 'weak' | 'moderate' | 'strong'
  recommendations: string[]
}

export interface LearningMetrics {
  dailyActivity: Array<{
    date: string
    studyMinutes: number
    sessionsCompleted: number
    averageScore: number
  }>
  subjectBreakdown: SubjectProgress[]
  skillsProgress: Array<{
    skill: string
    level: number
    totalNodes: number
    completedNodes: number
    masteryPercentage: number
  }>
  weeklyProgress: Array<{
    week: string
    totalTime: number
    avgScore: number
    improvement: number
  }>
}

export class UserDataService {
  /**
   * Obtiene estadísticas generales del usuario
   */
  static async getUserStats(userId: string): Promise<UserStats> {
    try {
      // Obtener datos del usuario
      const { data: userData, error: userError } = await supabase
        .from('users')
        .select('total_study_minutes, current_streak_days, max_streak_days, last_login')
        .eq('id', userId)
        .single()

      if (userError) throw userError

      // Obtener progreso de nodos
      const { data: progressData, error: progressError } = await supabase
        .from('user_progress')
        .select('*')
        .eq('user_id', userId)

      if (progressError) throw progressError

      // Obtener sesiones de práctica
      const { data: sessionsData, error: sessionsError } = await supabase
        .from('practice_sessions')
        .select('*')
        .eq('user_id', userId)

      if (sessionsError) {
        // Si no existe la tabla, usar datos mock
        console.warn('Practice sessions table not found, using mock data')
      }

      // Obtener total de nodos disponibles
      const { data: nodesData, error: nodesError } = await supabase
        .from('learning_nodes')
        .select('id')
        .eq('is_active', true)

      if (nodesError) throw nodesError

      const completedNodes = progressData?.filter(p => p.status === 'completed').length || 0
      const totalNodes = nodesData?.length || 0
      const sessionsCompleted = sessionsData?.length || 0
      const averageScore = progressData?.length > 0 
        ? progressData.reduce((sum, p) => sum + (p.score || 0), 0) / progressData.length 
        : 0

      return {
        totalStudyMinutes: userData?.total_study_minutes || 0,
        currentStreakDays: userData?.current_streak_days || 0,
        maxStreakDays: userData?.max_streak_days || 0,
        sessionsCompleted,
        averageScore: Math.round(averageScore),
        lastActivityDate: userData?.last_login || null,
        completedNodes,
        totalNodes,
        progressPercentage: totalNodes > 0 ? Math.round((completedNodes / totalNodes) * 100) : 0
      }
    } catch (error) {
      console.error('Error fetching user stats:', error)
      // Retornar datos mock en caso de error
      return {
        totalStudyMinutes: 0,
        currentStreakDays: 0,
        maxStreakDays: 0,
        sessionsCompleted: 0,
        averageScore: 0,
        lastActivityDate: null,
        completedNodes: 0,
        totalNodes: 0,
        progressPercentage: 0
      }
    }
  }

  /**
   * Obtiene progreso por materia/prueba PAES
   */
  static async getSubjectProgress(userId: string): Promise<SubjectProgress[]> {
    try {
      const subjects = [
        { key: 'COMPETENCIA_LECTORA', name: 'Competencia Lectora' },
        { key: 'MATEMATICA_M1', name: 'Matemática M1' },
        { key: 'MATEMATICA_M2', name: 'Matemática M2' },
        { key: 'HISTORIA', name: 'Historia y Ciencias Sociales' },
        { key: 'CIENCIAS', name: 'Ciencias' }
      ]

      const subjectProgress: SubjectProgress[] = []

      for (const subject of subjects) {
        // Obtener nodos de esta materia
        const { data: subjectNodes, error: nodesError } = await supabase
          .from('learning_nodes')
          .select('id')
          .eq('test_type', subject.key)
          .eq('is_active', true)

        if (nodesError) {
          console.warn(`Error fetching nodes for ${subject.key}:`, nodesError)
          continue
        }

        const nodeIds = subjectNodes?.map(n => n.id) || []

        // Obtener progreso del usuario en estos nodos
        const { data: userProgress, error: progressError } = await supabase
          .from('user_progress')
          .select('*')
          .eq('user_id', userId)
          .in('node_id', nodeIds)

        if (progressError) {
          console.warn(`Error fetching progress for ${subject.key}:`, progressError)
        }

        // Obtener puntaje de diagnóstico más reciente
        const { data: diagnosticData, error: diagnosticError } = await supabase
          .from('diagnostic_assessments')
          .select(`${subject.key.toLowerCase()}_score`)
          .eq('user_id', userId)
          .order('completed_at', { ascending: false })
          .limit(1)

        if (diagnosticError) {
          console.warn(`Error fetching diagnostic for ${subject.key}:`, diagnosticError)
        }

        const completedNodes = userProgress?.filter(p => p.status === 'completed').length || 0
        const totalNodes = nodeIds.length || 1
        const progress = Math.round((completedNodes / totalNodes) * 100)
        const averageTime = userProgress?.length > 0 
          ? userProgress.reduce((sum, p) => sum + (p.time_spent_minutes || 0), 0) / userProgress.length 
          : 0

        const score = diagnosticData?.[0]?.[`${subject.key.toLowerCase()}_score`] || null
        
        // Determinar fortaleza
        let strength: 'weak' | 'moderate' | 'strong' = 'moderate'
        if (progress < 30) strength = 'weak'
        else if (progress > 70) strength = 'strong'

        // Generar recomendaciones básicas
        const recommendations = this.generateRecommendations(subject.key, progress, score)

        subjectProgress.push({
          subject: subject.key,
          displayName: subject.name,
          score,
          progress,
          completedNodes,
          totalNodes,
          averageTime: Math.round(averageTime),
          lastActivity: userProgress?.[0]?.last_attempt_at || null,
          strength,
          recommendations
        })
      }

      return subjectProgress
    } catch (error) {
      console.error('Error fetching subject progress:', error)
      return []
    }
  }

  /**
   * Obtiene métricas de aprendizaje detalladas
   */
  static async getLearningMetrics(userId: string): Promise<LearningMetrics> {
    try {
      // Obtener actividad diaria real de los últimos 7 días
      const dailyActivity = await this.getDailyActivity(userId)
      
      // Obtener progreso de habilidades real
      const skillsProgress = await this.getSkillsProgress(userId)
      
      // Obtener progreso semanal real
      const weeklyProgress = await this.getWeeklyProgress(userId)
      
      // Obtener desglose por materias
      const subjectBreakdown = await this.getSubjectProgress(userId)

      return {
        dailyActivity,
        subjectBreakdown,
        skillsProgress,
        weeklyProgress
      }
    } catch (error) {
      console.error('Error fetching learning metrics:', error)
      return {
        dailyActivity: [],
        subjectBreakdown: [],
        skillsProgress: [],
        weeklyProgress: []
      }
    }
  }

  /**
   * Obtiene actividad diaria real del usuario
   */
  private static async getDailyActivity(userId: string) {
    try {
      const sevenDaysAgo = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString()
      
      // Obtener sesiones de práctica de los últimos 7 días
      const { data: sessions, error: sessionsError } = await supabase
        .from('practice_sessions')
        .select('*')
        .eq('user_id', userId)
        .gte('created_at', sevenDaysAgo)
        .order('created_at', { ascending: true })

      if (sessionsError) {
        console.warn('Error fetching practice sessions:', sessionsError)
        return []
      }

      // Agrupar por día
      const dailyData = new Map<string, { studyMinutes: number; sessionsCompleted: number; averageScore: number }>()
      
      sessions?.forEach(session => {
        const date = new Date(session.created_at).toISOString().split('T')[0]
        const existing = dailyData.get(date) || { studyMinutes: 0, sessionsCompleted: 0, averageScore: 0 }
        
        existing.studyMinutes += session.time_spent_minutes || 0
        existing.sessionsCompleted += 1
        existing.averageScore = session.total_score || 0
        
        dailyData.set(date, existing)
      })

      // Generar array para los últimos 7 días
      const result = []
      for (let i = 6; i >= 0; i--) {
        const date = new Date(Date.now() - i * 24 * 60 * 60 * 1000).toISOString().split('T')[0]
        const dayData = dailyData.get(date) || { studyMinutes: 0, sessionsCompleted: 0, averageScore: 0 }
        result.push({
          date,
          ...dayData
        })
      }

      return result
    } catch (error) {
      console.error('Error getting daily activity:', error)
      return []
    }
  }

  /**
   * Obtiene progreso de habilidades real
   */
  private static async getSkillsProgress(userId: string) {
    try {
      // Obtener nodos de aprendizaje con sus habilidades
      const { data: nodes, error: nodesError } = await supabase
        .from('learning_nodes')
        .select('id, skill, test_type')
        .eq('is_active', true)

      if (nodesError) {
        console.warn('Error fetching learning nodes:', nodesError)
        return []
      }

      // Obtener progreso del usuario
      const { data: progress, error: progressError } = await supabase
        .from('user_progress')
        .select('*')
        .eq('user_id', userId)

      if (progressError) {
        console.warn('Error fetching user progress:', progressError)
        return []
      }

      // Agrupar por habilidad
      const skillGroups = new Map<string, { totalNodes: number; completedNodes: number }>()
      
      nodes?.forEach(node => {
        const skill = node.skill || 'Sin categorizar'
        const existing = skillGroups.get(skill) || { totalNodes: 0, completedNodes: 0 }
        existing.totalNodes += 1
        skillGroups.set(skill, existing)
      })

      progress?.forEach(prog => {
        const node = nodes?.find(n => n.id === prog.node_id)
        if (node) {
          const skill = node.skill || 'Sin categorizar'
          const existing = skillGroups.get(skill)
          if (existing && prog.status === 'completed') {
            existing.completedNodes += 1
          }
        }
      })

      // Convertir a array con porcentajes
      return Array.from(skillGroups.entries()).map(([skill, data]) => ({
        skill,
        level: Math.floor((data.completedNodes / data.totalNodes) * 5) + 1, // Nivel 1-5
        totalNodes: data.totalNodes,
        completedNodes: data.completedNodes,
        masteryPercentage: Math.round((data.completedNodes / data.totalNodes) * 100)
      }))
    } catch (error) {
      console.error('Error getting skills progress:', error)
      return []
    }
  }

  /**
   * Obtiene progreso semanal real
   */
  private static async getWeeklyProgress(userId: string) {
    try {
      const fourWeeksAgo = new Date(Date.now() - 4 * 7 * 24 * 60 * 60 * 1000).toISOString()
      
      // Obtener sesiones de las últimas 4 semanas
      const { data: sessions, error: sessionsError } = await supabase
        .from('practice_sessions')
        .select('*')
        .eq('user_id', userId)
        .gte('created_at', fourWeeksAgo)
        .order('created_at', { ascending: true })

      if (sessionsError) {
        console.warn('Error fetching weekly sessions:', sessionsError)
        return []
      }

      // Agrupar por semana
      const weeklyData = new Map<string, { totalTime: number; scores: number[] }>()
      
      sessions?.forEach(session => {
        const weekStart = new Date(session.created_at)
        weekStart.setDate(weekStart.getDate() - weekStart.getDay()) // Inicio de semana (domingo)
        const weekKey = weekStart.toISOString().split('T')[0]
        
        const existing = weeklyData.get(weekKey) || { totalTime: 0, scores: [] }
        existing.totalTime += session.time_spent_minutes || 0
        existing.scores.push(session.total_score || 0)
        weeklyData.set(weekKey, existing)
      })

      // Convertir a array
      const result = []
      for (let i = 3; i >= 0; i--) {
        const weekStart = new Date(Date.now() - i * 7 * 24 * 60 * 60 * 1000)
        weekStart.setDate(weekStart.getDate() - weekStart.getDay())
        const weekKey = weekStart.toISOString().split('T')[0]
        const weekData = weeklyData.get(weekKey) || { totalTime: 0, scores: [] }
        
        const avgScore = weekData.scores.length > 0 
          ? Math.round(weekData.scores.reduce((sum, score) => sum + score, 0) / weekData.scores.length)
          : 0

        result.push({
          week: `Semana ${4 - i}`,
          totalTime: weekData.totalTime,
          avgScore,
          improvement: 0 // TODO: Calcular mejora real comparando con semana anterior
        })
      }

      return result
    } catch (error) {
      console.error('Error getting weekly progress:', error)
      return []
    }
  }

  /**
   * Genera recomendaciones personalizadas
   */
  private static generateRecommendations(subject: string, progress: number, score: number | null): string[] {
    const recommendations: string[] = []

    if (progress < 30) {
      recommendations.push(`Dedica más tiempo a estudiar ${this.getSubjectDisplayName(subject)}`)
      recommendations.push('Comienza con los conceptos básicos')
    } else if (progress < 70) {
      recommendations.push('Continúa practicando regularmente')
      recommendations.push('Enfócate en tus áreas más débiles')
    } else {
      recommendations.push('¡Excelente progreso! Mantén el ritmo')
      recommendations.push('Considera tomar exámenes de práctica más avanzados')
    }

    if (score && score < 500) {
      recommendations.push('Realiza más ejercicios de práctica')
    } else if (score && score > 650) {
      recommendations.push('Enfócate en perfeccionar tus técnicas')
    }

    return recommendations
  }

  /**
   * Obtiene nombre legible de la materia
   */
  private static getSubjectDisplayName(subject: string): string {
    const names: Record<string, string> = {
      'COMPETENCIA_LECTORA': 'Competencia Lectora',
      'MATEMATICA_M1': 'Matemática M1',
      'MATEMATICA_M2': 'Matemática M2',
      'HISTORIA': 'Historia y Ciencias Sociales',
      'CIENCIAS': 'Ciencias'
    }
    return names[subject] || subject
  }

  /**
   * Actualiza las estadísticas del usuario después de una actividad
   */
  static async updateUserActivity(userId: string, activityData: {
    studyMinutes: number
    score?: number
    nodeId?: string
    status?: string
  }): Promise<void> {
    try {
      // Actualizar tiempo total de estudio
      const { error: updateError } = await supabase
        .from('users')
        .update({
          total_study_minutes: supabase.sql`total_study_minutes + ${activityData.studyMinutes}`,
          last_login: new Date().toISOString(),
          updated_at: new Date().toISOString()
        })
        .eq('id', userId)

      if (updateError) throw updateError

      // Si hay progreso en un nodo específico, actualizarlo
      if (activityData.nodeId) {
        const { error: progressError } = await supabase
          .from('user_progress')
          .upsert({
            user_id: userId,
            node_id: activityData.nodeId,
            status: activityData.status || 'in-progress',
            score: activityData.score || null,
            time_spent_minutes: activityData.studyMinutes,
            last_attempt_at: new Date().toISOString(),
            updated_at: new Date().toISOString()
          })

        if (progressError) throw progressError
      }

    } catch (error) {
      console.error('Error updating user activity:', error)
      throw error
    }
  }
}
