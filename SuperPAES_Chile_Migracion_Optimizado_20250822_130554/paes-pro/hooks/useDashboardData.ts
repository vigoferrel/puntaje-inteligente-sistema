import { useState, useEffect } from 'react'
import { supabase } from '@/lib/supabase'
import { useAuth } from '@/contexts/AuthContext'
import { 
  UserStats, 
  DashboardMetrics, 
  StudyPlan,
  SkillProgress,
  DailyActivity,
  WeeklyProgress,
  Recommendation
} from '@/types/dashboard'

interface RawMetricsData {
  skills_progress: Array<{
    name: string
    level: number
    mastery_percentage: number
  }>
  daily_activity: Array<{
    date: string
    minutes: number
    sessions: number
    score: number
  }>
  weekly_progress: Array<{
    week: string
    total_time: number
    average_score: number
    improvement: number
  }>
}

export function useDashboardData() {
  const { user } = useAuth()
  const [stats, setStats] = useState<UserStats | null>(null)
  const [subjectProgress, setSubjectProgress] = useState<any[]>([])
  const [metrics, setMetrics] = useState<DashboardMetrics | null>(null)
  const [recommendations, setRecommendations] = useState<Recommendation[]>([])
  const [studyPlan, setStudyPlan] = useState<StudyPlan | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [hasError, setHasError] = useState(false)

  const fetchDashboardData = async () => {
    if (!user) return

    try {
      setIsLoading(true)
      setHasError(false)

      // Obtener estadísticas del usuario
      const { data: statsData, error: statsError } = await supabase
        .from('user_stats')
        .select('*')
        .eq('user_id', user.id)
        .single()

      if (statsError) throw statsError

      // Mapear datos a la interfaz UserStats
      const userStats: UserStats = {
        totalStudyMinutes: statsData.total_study_minutes || 0,
        currentStreakDays: statsData.current_streak_days || 0,
        maxStreakDays: statsData.max_streak_days || 0,
        sessionsCompleted: statsData.sessions_completed || 0,
        averageScore: statsData.average_score || 0,
        progressPercentage: statsData.progress_percentage || 0,
        completedNodes: statsData.completed_nodes || 0,
        totalNodes: statsData.total_nodes || 0,
        lastActivityDate: statsData.last_activity_date || new Date().toISOString()
      }

      setStats(userStats)

      // Obtener progreso por materias
      const { data: progressData, error: progressError } = await supabase
        .from('subject_progress')
        .select('*')
        .eq('user_id', user.id)

      if (progressError) throw progressError
      setSubjectProgress(progressData)

      // Obtener métricas detalladas
      const { data: rawMetrics, error: metricsError } = await supabase
        .from('user_metrics')
        .select('*')
        .eq('user_id', user.id)
        .single()

      if (metricsError) throw metricsError

      const metricsData = rawMetrics as RawMetricsData

      // Mapear datos a la interfaz DashboardMetrics
      const dashboardMetrics: DashboardMetrics = {
        skillsProgress: metricsData.skills_progress.map((skill): SkillProgress => ({
          skill: skill.name,
          level: skill.level,
          masteryPercentage: skill.mastery_percentage
        })),
        dailyActivity: metricsData.daily_activity.map((activity): DailyActivity => ({
          date: activity.date,
          studyMinutes: activity.minutes,
          sessionsCompleted: activity.sessions,
          averageScore: activity.score
        })),
        weeklyProgress: metricsData.weekly_progress.map((week): WeeklyProgress => ({
          week: week.week,
          totalTime: week.total_time,
          avgScore: week.average_score,
          improvement: week.improvement
        }))
      }

      setMetrics(dashboardMetrics)

      // Obtener recomendaciones
      const { data: recsData, error: recsError } = await supabase
        .from('recommendations')
        .select('*')
        .eq('user_id', user.id)

      if (recsError) throw recsError
      setRecommendations(recsData)

      // Obtener plan de estudio
      const { data: planData, error: planError } = await supabase
        .from('study_plans')
        .select('*')
        .eq('user_id', user.id)
        .single()

      if (planError && planError.code !== 'PGRST116') throw planError // Ignorar error si no hay plan
      setStudyPlan(planData)

    } catch (error) {
      console.error('Error fetching dashboard data:', error)
      setHasError(true)
    } finally {
      setIsLoading(false)
    }
  }

  const updateActivity = async (activity: { studyMinutes: number; score: number }) => {
    if (!user || !stats) return

    try {
      const { error } = await supabase
        .from('user_stats')
        .update({
          total_study_minutes: stats.totalStudyMinutes + activity.studyMinutes,
          sessions_completed: stats.sessionsCompleted + 1,
          average_score: Math.round((stats.averageScore + activity.score) / 2),
          last_activity_date: new Date().toISOString()
        })
        .eq('user_id', user.id)

      if (error) throw error
      await fetchDashboardData()
    } catch (error) {
      console.error('Error updating activity:', error)
      throw error
    }
  }

  useEffect(() => {
    fetchDashboardData()
  }, [user])

  return {
    stats,
    subjectProgress,
    metrics,
    recommendations,
    studyPlan,
    isLoading,
    hasError,
    refreshAll: fetchDashboardData,
    updateActivity
  }
}
