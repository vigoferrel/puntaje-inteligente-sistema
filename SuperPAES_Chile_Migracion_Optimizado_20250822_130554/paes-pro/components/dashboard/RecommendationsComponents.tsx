import React from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { 
  BookOpen, 
  Target, 
  TrendingUp, 
  Calendar, 
  Star, 
  AlertCircle,
  CheckCircle,
  Clock,
  Trophy,
  Heart,
  PlayCircle,
  Zap
} from 'lucide-react'
import { Recommendation, StudyPlan } from '@/lib/services/recommendationService'

interface RecommendationsListProps {
  recommendations: Recommendation[]
  isLoading?: boolean
  onActionClick?: (recommendation: Recommendation) => void
}

export const RecommendationsList: React.FC<RecommendationsListProps> = ({ 
  recommendations, 
  isLoading,
  onActionClick 
}) => {
  if (isLoading) {
    return (
      <Card className="bg-white/10 border-white/20 backdrop-blur-sm">
        <CardHeader>
          <CardTitle className="text-white">Recomendaciones Personalizadas</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {Array.from({ length: 3 }).map((_, i) => (
              <div key={i} className="animate-pulse">
                <div className="h-4 bg-gray-300 rounded w-3/4 mb-2"></div>
                <div className="h-3 bg-gray-300 rounded w-1/2"></div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    )
  }

  const getIcon = (iconName: string) => {
    const icons: Record<string, React.ComponentType<any>> = {
      'book-open': BookOpen,
      'target': Target,
      'trending-up': TrendingUp,
      'calendar': Calendar,
      'star': Star,
      'alert-circle': AlertCircle,
      'check-circle': CheckCircle,
      'clock': Clock,
      'trophy': Trophy,
      'heart': Heart,
      'play-circle': PlayCircle,
      'puzzle-piece': Target,
      'chart-bar': TrendingUp,
      'cube': BookOpen,
      'link': Target,
      'search': Target,
      'graduation-cap': Trophy
    }
    return icons[iconName] || BookOpen
  }

  const getPriorityColors = (priority: string) => {
    switch (priority) {
      case 'critical':
        return {
          border: 'border-red-500/50',
          bg: 'from-red-600/20 to-red-700/20',
          text: 'text-red-400',
          button: 'bg-red-600 hover:bg-red-700'
        }
      case 'high':
        return {
          border: 'border-orange-500/50',
          bg: 'from-orange-600/20 to-orange-700/20',
          text: 'text-orange-400',
          button: 'bg-orange-600 hover:bg-orange-700'
        }
      case 'medium':
        return {
          border: 'border-blue-500/50',
          bg: 'from-blue-600/20 to-blue-700/20',
          text: 'text-blue-400',
          button: 'bg-blue-600 hover:bg-blue-700'
        }
      case 'low':
        return {
          border: 'border-green-500/50',
          bg: 'from-green-600/20 to-green-700/20',
          text: 'text-green-400',
          button: 'bg-green-600 hover:bg-green-700'
        }
      default:
        return {
          border: 'border-gray-500/50',
          bg: 'from-gray-600/20 to-gray-700/20',
          text: 'text-gray-400',
          button: 'bg-gray-600 hover:bg-gray-700'
        }
    }
  }

  const topRecommendations = recommendations.slice(0, 5)

  return (
    <Card className="bg-white/10 border-white/20 backdrop-blur-sm">
      <CardHeader>
        <CardTitle className="text-white flex items-center gap-2">
          <Star className="w-5 h-5 text-yellow-400" />
          Recomendaciones Personalizadas
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {topRecommendations.map((rec) => {
            const IconComponent = getIcon(rec.icon)
            const colors = getPriorityColors(rec.priority)
            
            return (
              <div
                key={rec.id}
                className={`p-4 rounded-lg border bg-gradient-to-r ${colors.bg} ${colors.border} transition-all hover:scale-[1.02]`}
              >
                <div className="flex items-start space-x-3">
                  <div className={`p-2 rounded-lg bg-white/10`}>
                    <IconComponent className={`w-5 h-5 ${colors.text}`} />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between mb-2">
                      <h4 className="font-medium text-white">
                        {rec.title}
                      </h4>
                      <span className={`text-xs px-2 py-1 rounded-full bg-white/20 ${colors.text}`}>
                        {rec.priority}
                      </span>
                    </div>
                    <p className="text-sm text-gray-300 mb-3">
                      {rec.description}
                    </p>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-4 text-xs text-gray-400">
                        {rec.estimatedTime && (
                          <span className="flex items-center gap-1">
                            <Clock className="w-3 h-3" />
                            {rec.estimatedTime} min
                          </span>
                        )}
                        <span className="flex items-center gap-1">
                          {rec.tags.slice(0, 2).map(tag => (
                            <span key={tag} className="bg-white/10 px-2 py-1 rounded">
                              {tag}
                            </span>
                          ))}
                        </span>
                      </div>
                      <Button
                        size="sm"
                        className={`${colors.button} text-white`}
                        onClick={() => onActionClick?.(rec)}
                      >
                        {rec.actionText}
                      </Button>
                    </div>
                  </div>
                </div>
              </div>
            )
          })}
        </div>
        
        {recommendations.length > 5 && (
          <div className="mt-4 text-center">
            <Button variant="outline" className="text-white border-white/20">
              Ver todas las recomendaciones ({recommendations.length})
            </Button>
          </div>
        )}
      </CardContent>
    </Card>
  )
}

interface StudyPlanCardProps {
  studyPlan: StudyPlan
  isLoading?: boolean
}

export const StudyPlanCard: React.FC<StudyPlanCardProps> = ({ 
  studyPlan, 
  isLoading 
}) => {
  if (isLoading) {
    return (
      <Card className="bg-white/10 border-white/20 backdrop-blur-sm">
        <CardHeader>
          <CardTitle className="text-white">Tu Plan de Estudio</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="animate-pulse space-y-4">
            <div className="h-4 bg-gray-300 rounded w-3/4"></div>
            <div className="h-4 bg-gray-300 rounded w-1/2"></div>
            <div className="h-4 bg-gray-300 rounded w-2/3"></div>
          </div>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card className="bg-white/10 border-white/20 backdrop-blur-sm">
      <CardHeader>
        <CardTitle className="text-white flex items-center gap-2">
          <Calendar className="w-5 h-5 text-blue-400" />
          Tu Plan de Estudio Personalizado
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Plan Diario */}
        <div>
          <h4 className="font-medium text-white mb-3 flex items-center gap-2">
            <Clock className="w-4 h-4 text-green-400" />
            Plan Diario
          </h4>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="bg-white/5 p-3 rounded-lg">
              <div className="text-2xl font-bold text-blue-400">
                {studyPlan.daily.recommendedMinutes}
              </div>
              <div className="text-xs text-gray-400">minutos recomendados</div>
            </div>
            <div className="bg-white/5 p-3 rounded-lg">
              <div className="text-2xl font-bold text-green-400">
                {studyPlan.daily.suggestedSessions}
              </div>
              <div className="text-xs text-gray-400">sesiones sugeridas</div>
            </div>
            <div className="bg-white/5 p-3 rounded-lg">
              <div className="text-sm text-purple-400 font-medium">
                {studyPlan.daily.optimalTimes.join(', ')}
              </div>
              <div className="text-xs text-gray-400">horarios óptimos</div>
            </div>
          </div>
        </div>

        {/* Metas Semanales */}
        <div>
          <h4 className="font-medium text-white mb-3 flex items-center gap-2">
            <Target className="w-4 h-4 text-yellow-400" />
            Metas de Esta Semana
          </h4>
          <div className="space-y-2">
            {studyPlan.weekly.goals.map((goal, index) => (
              <div key={index} className="flex items-center gap-2 text-sm">
                <CheckCircle className="w-4 h-4 text-green-400" />
                <span className="text-gray-300">{goal}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Áreas de Enfoque */}
        <div>
          <h4 className="font-medium text-white mb-3 flex items-center gap-2">
            <Zap className="w-4 h-4 text-red-400" />
            Áreas de Enfoque
          </h4>
          <div className="flex flex-wrap gap-2">
            {studyPlan.weekly.focusAreas.map((area, index) => (
              <span 
                key={index}
                className="px-3 py-1 bg-red-600/20 text-red-300 rounded-full text-sm"
              >
                {area}
              </span>
            ))}
          </div>
        </div>

        {/* Distribución por Materia */}
        <div>
          <h4 className="font-medium text-white mb-3 flex items-center gap-2">
            <BookOpen className="w-4 h-4 text-purple-400" />
            Distribución Semanal
          </h4>
          <div className="space-y-3">
            {studyPlan.subjects.map((subject, index) => (
              <div key={index} className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className={`w-3 h-3 rounded-full ${
                    subject.priority === 3 ? 'bg-red-400' :
                    subject.priority === 2 ? 'bg-yellow-400' : 'bg-green-400'
                  }`}></div>
                  <span className="text-sm text-white">{subject.subject}</span>
                </div>
                <div className="text-sm text-gray-400">
                  {subject.weeklyHours}h/semana
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Próximos Hitos */}
        {studyPlan.weekly.milestones.length > 0 && (
          <div>
            <h4 className="font-medium text-white mb-3 flex items-center gap-2">
              <Trophy className="w-4 h-4 text-yellow-400" />
              Próximos Hitos
            </h4>
            <div className="space-y-3">
              {studyPlan.weekly.milestones.map((milestone, index) => (
                <div key={index} className="bg-white/5 p-3 rounded-lg">
                  <div className="flex items-center justify-between mb-2">
                    <h5 className="font-medium text-white text-sm">
                      {milestone.title}
                    </h5>
                    <span className="text-xs text-gray-400">
                      {new Date(milestone.deadline).toLocaleDateString('es-ES')}
                    </span>
                  </div>
                  <p className="text-xs text-gray-400">
                    {milestone.description}
                  </p>
                </div>
              ))}
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  )
}

interface QuickTipsProps {
  tips: string[]
}

export const QuickTips: React.FC<QuickTipsProps> = ({ tips }) => {
  const defaultTips = [
    "Estudia en sesiones de 25-30 minutos con descansos de 5 minutos",
    "Revisa tus notas al final de cada día para reforzar el aprendizaje",
    "Practica con ejercicios similares a los de la PAES regularmente",
    "Mantén un ambiente de estudio libre de distracciones",
    "Duerme al menos 7-8 horas para consolidar el aprendizaje"
  ]

  const displayTips = tips.length > 0 ? tips : defaultTips

  return (
    <Card className="bg-white/10 border-white/20 backdrop-blur-sm">
      <CardHeader>
        <CardTitle className="text-white flex items-center gap-2">
          <Star className="w-5 h-5 text-yellow-400" />
          Consejos de Estudio
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-3">
          {displayTips.slice(0, 3).map((tip, index) => (
            <div key={index} className="flex items-start gap-3">
              <div className="w-6 h-6 bg-yellow-400/20 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                <span className="text-yellow-400 text-xs font-bold">{index + 1}</span>
              </div>
              <p className="text-sm text-gray-300">{tip}</p>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  )
}
