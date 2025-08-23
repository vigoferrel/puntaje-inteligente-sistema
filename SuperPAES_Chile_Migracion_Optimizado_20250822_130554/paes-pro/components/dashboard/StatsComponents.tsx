import React from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card'
import { motion } from 'framer-motion'
import { 
  Target, 
  TrendingUp, 
  Clock, 
  Award, 
  BookOpen, 
  Calendar,
  Zap,
  CheckCircle
} from 'lucide-react'
import { UserStats, Activity } from '@/types/dashboard'

interface StatsCardsProps {
  stats: UserStats | null
  isLoading?: boolean
}

export const StatsCards: React.FC<StatsCardsProps> = ({ stats, isLoading }) => {
  const defaultStats: UserStats = {
    totalStudyMinutes: 0,
    currentStreakDays: 0,
    maxStreakDays: 0,
    sessionsCompleted: 0,
    averageScore: 0,
    progressPercentage: 0,
    completedNodes: 0,
    totalNodes: 0,
    lastActivityDate: new Date().toISOString()
  }

  const currentStats = stats || defaultStats

  if (isLoading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {Array.from({ length: 4 }).map((_, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: i * 0.1 }}
          >
            <Card className="bg-card border-border/40 backdrop-blur-sm animate-pulse">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <div className="h-4 bg-muted rounded w-20"></div>
                <div className="h-4 w-4 bg-muted rounded"></div>
              </CardHeader>
              <CardContent>
                <div className="h-8 bg-muted rounded w-16 mb-2"></div>
                <div className="h-3 bg-muted rounded w-24"></div>
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </div>
    )
  }

  const statCards = [
    {
      title: 'Tiempo de Estudio',
      value: `${Math.floor(currentStats.totalStudyMinutes / 60)}h ${currentStats.totalStudyMinutes % 60}m`,
      subtitle: 'Total acumulado',
      icon: Clock,
      color: 'text-primary',
      bgColor: 'from-primary/20 to-primary/30',
      borderColor: 'border-primary/30'
    },
    {
      title: 'Racha Actual',
      value: `${currentStats.currentStreakDays}`,
      subtitle: currentStats.currentStreakDays === 1 ? 'día' : 'días',
      icon: TrendingUp,
      color: 'text-green-400',
      bgColor: 'from-green-600/20 to-green-700/20',
      borderColor: 'border-green-500/30'
    },
    {
      title: 'Progreso General',
      value: `${currentStats.progressPercentage}%`,
      subtitle: `${currentStats.completedNodes}/${currentStats.totalNodes} nodos`,
      icon: Target,
      color: 'text-primary',
      bgColor: 'from-primary/20 to-primary/30',
      borderColor: 'border-primary/30'
    },
    {
      title: 'Promedio',
      value: `${currentStats.averageScore}%`,
      subtitle: `${currentStats.sessionsCompleted} sesiones`,
      icon: Award,
      color: 'text-primary',
      bgColor: 'from-primary/20 to-primary/30',
      borderColor: 'border-primary/30'
    }
  ]

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      {statCards.map((stat, index) => {
        const IconComponent = stat.icon
        return (
          <motion.div
            key={index}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: index * 0.1 }}
          >
            <Card 
              className={`bg-gradient-to-br ${stat.bgColor} ${stat.borderColor} backdrop-blur-sm border-border/40 transition-all hover:scale-105`}
            >
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium text-foreground">
                  {stat.title}
                </CardTitle>
                <IconComponent className={`h-4 w-4 ${stat.color}`} />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-foreground mb-1">
                  {stat.value}
                </div>
                <p className="text-xs text-muted-foreground">
                  {stat.subtitle}
                </p>
              </CardContent>
            </Card>
          </motion.div>
        )
      })}
    </div>
  )
}

interface ProgressRingProps {
  progress: number
  size?: number
  strokeWidth?: number
  color?: string
  children?: React.ReactNode
}

export const ProgressRing: React.FC<ProgressRingProps> = ({ 
  progress, 
  size = 120, 
  strokeWidth = 8, 
  color = 'hsl(var(--primary))',
  children 
}) => {
  const radius = (size - strokeWidth) / 2
  const circumference = radius * 2 * Math.PI
  const strokeDasharray = `${circumference} ${circumference}`
  const strokeDashoffset = circumference - (progress / 100) * circumference

  return (
    <div className="relative" style={{ width: size, height: size }}>
      <svg
        className="transform -rotate-90"
        width={size}
        height={size}
      >
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          stroke="hsl(var(--muted))"
          strokeWidth={strokeWidth}
          fill="none"
        />
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          stroke={color}
          strokeWidth={strokeWidth}
          fill="none"
          strokeLinecap="round"
          strokeDasharray={strokeDasharray}
          strokeDashoffset={strokeDashoffset}
          className="transition-all duration-1000 ease-in-out"
        />
      </svg>
      <div className="absolute inset-0 flex items-center justify-center">
        {children}
      </div>
    </div>
  )
}

interface QuickActionsProps {
  onAction: (action: string) => void
}

export const QuickActions: React.FC<QuickActionsProps> = ({ onAction }) => {
  const actions = [
    {
      id: 'study-session',
      title: 'Iniciar Sesión de Estudio',
      description: 'Comienza una nueva sesión de preparación',
      icon: BookOpen,
      color: 'from-primary to-primary/80',
      hoverColor: 'hover:from-primary/90 hover:to-primary/70'
    },
    {
      id: 'practice-test',
      title: 'Examen de Práctica',
      description: 'Evalúa tu progreso con un simulacro',
      icon: CheckCircle,
      color: 'from-primary to-primary/80',
      hoverColor: 'hover:from-primary/90 hover:to-primary/70'
    },
    {
      id: 'review-weak-areas',
      title: 'Reforzar Áreas Débiles',
      description: 'Enfócate en tus puntos de mejora',
      icon: Target,
      color: 'from-primary to-primary/80',
      hoverColor: 'hover:from-primary/90 hover:to-primary/70'
    },
    {
      id: 'daily-challenge',
      title: 'Desafío Diario',
      description: 'Mantén tu racha con ejercicios rápidos',
      icon: Zap,
      color: 'from-primary to-primary/80',
      hoverColor: 'hover:from-primary/90 hover:to-primary/70'
    }
  ]

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      {actions.map((action) => {
        const IconComponent = action.icon
        return (
          <motion.div
            key={action.id}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
          >
            <Card
              className={`bg-gradient-to-r ${action.color} border-0 cursor-pointer transition-all duration-300 ${action.hoverColor}`}
              onClick={() => onAction(action.id)}
            >
              <CardContent className="p-6">
                <div className="flex items-start space-x-4">
                  <div className="bg-white/20 p-3 rounded-lg">
                    <IconComponent className="w-6 h-6 text-white" />
                  </div>
                  <div className="flex-1">
                    <h3 className="font-semibold text-white mb-2">
                      {action.title}
                    </h3>
                    <p className="text-sm text-white/80">
                      {action.description}
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        )
      })}
    </div>
  )
}

interface ActivityTimelineProps {
  activities: Activity[]
}

export const ActivityTimeline: React.FC<ActivityTimelineProps> = ({ activities }) => {
  const getIcon = (iconName: string) => {
    switch (iconName) {
      case 'book': return BookOpen
      case 'target': return Target
      case 'award': return Award
      case 'calendar': return Calendar
      default: return BookOpen
    }
  }

  const getColorClasses = (type: string) => {
    switch (type) {
      case 'study': return 'bg-primary text-primary-foreground'
      case 'practice': return 'bg-primary text-primary-foreground'
      case 'achievement': return 'bg-primary text-primary-foreground'
      default: return 'bg-muted text-muted-foreground'
    }
  }

  return (
    <div className="space-y-4">
      {activities.map((activity) => {
        const IconComponent = getIcon(activity.icon)
        return (
          <motion.div
            key={activity.id}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.3 }}
          >
            <div className="flex items-start space-x-4">
              <div className={`p-2 rounded-full ${getColorClasses(activity.type)}`}>
                <IconComponent className="w-4 h-4" />
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between">
                  <p className="text-sm font-medium text-foreground">
                    {activity.title}
                  </p>
                  <p className="text-xs text-muted-foreground">
                    {activity.time}
                  </p>
                </div>
                <p className="text-sm text-muted-foreground">
                  {activity.subtitle}
                </p>
              </div>
            </div>
          </motion.div>
        )
      })}
    </div>
  )
}
