export interface UserStats {
  totalStudyMinutes: number
  currentStreakDays: number
  maxStreakDays: number
  sessionsCompleted: number
  averageScore: number
  progressPercentage: number
  completedNodes: number
  totalNodes: number
  lastActivityDate: string
}

export interface DailyActivity {
  date: string
  studyMinutes: number
  sessionsCompleted: number
  averageScore: number
}

export interface SkillProgress {
  skill: string
  level: number
  masteryPercentage: number
}

export interface WeeklyProgress {
  week: string
  totalTime: number
  avgScore: number
  improvement: number
}

export interface DashboardMetrics {
  skillsProgress: SkillProgress[]
  dailyActivity: DailyActivity[]
  weeklyProgress: WeeklyProgress[]
}

export interface StudyPlanDaily {
  recommendedMinutes: number
  suggestedSessions: number
  optimalTimes: string[]
}

export interface StudyPlanWeekly {
  goals: string[]
  focusAreas: string[]
  milestones: Array<{
    title: string
    deadline: string
    description: string
  }>
}

export interface StudyPlanSubject {
  subject: string
  priority: number
  weeklyHours: number
  focusTopics: string[]
}

export interface StudyPlan {
  daily: StudyPlanDaily
  weekly: StudyPlanWeekly
  subjects: StudyPlanSubject[]
  currentModule: string
  nextSession: {
    topic: string
    duration: number
    type: string
  }
  weeklyGoals: {
    completed: number
    total: number
  }
  recommendations: string[]
}

export interface Activity {
  id: string
  type: 'study' | 'practice' | 'achievement'
  title: string
  subtitle: string
  time: string
  icon: string
}

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