
import React from 'react';
import { motion } from 'framer-motion';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { useRealDashboardData } from '@/hooks/dashboard/useRealDashboardData';
import { useRealUserMetrics } from '@/hooks/useRealUserMetrics';
import { useNeuralIntegration } from '@/hooks/use-neural-integration';
import { SmartRecommendations } from '@/components/home/SmartRecommendations';
import { useNavigate } from 'react-router-dom';
import { 
  Brain, 
  Target, 
  TrendingUp, 
  Award, 
  Database,
  Zap,
  Trophy,
  DollarSign,
  ArrowRight,
  Activity,
  Users,
  Clock
} from 'lucide-react';

interface RealDataDashboardProps {
  userId: string;
}

export const RealDataDashboard: React.FC<RealDataDashboardProps> = ({ userId }) => {
  const { metrics, systemStatus, isLoading, getSmartRecommendations, refreshData } = useRealDashboardData();
  const { metrics: userMetrics, isLoading: metricsLoading } = useRealUserMetrics();
  const navigate = useNavigate();

  // Integración neural para telemetría avanzada
  const neural = useNeuralIntegration('dashboard', ['metrics_display', 'user_navigation'], {
    current_metrics: metrics,
    user_activity: userMetrics
  });

  const quickActions = [
    {
      title: "Banco de Evaluaciones",
      description: "722 evaluaciones disponibles",
      icon: Database,
      color: "from-blue-500 to-cyan-500",
      route: "/evaluations",
      onClick: () => neural.notifyEngagement({ action: 'navigate_evaluations', section: 'quick_actions' })
    },
    {
      title: "Generador de Ejercicios",
      description: "Crea ejercicios personalizados",
      icon: Zap,
      color: "from-yellow-500 to-orange-500",
      route: "/exercise-generator",
      onClick: () => neural.notifyEngagement({ action: 'navigate_exercises', section: 'quick_actions' })
    },
    {
      title: "Sistema de Logros",
      description: `${userMetrics.level} logros desbloqueados`,
      icon: Trophy,
      color: "from-purple-500 to-pink-500",
      route: "/gamification",
      onClick: () => neural.notifyEngagement({ action: 'navigate_achievements', section: 'quick_actions' })
    },
    {
      title: "Centro Financiero",
      description: "Becas y financiamiento",
      icon: DollarSign,
      color: "from-green-500 to-emerald-500",
      route: "/financial",
      onClick: () => neural.notifyEngagement({ action: 'navigate_financial', section: 'quick_actions' })
    }
  ];

  const handleQuickAction = (action: typeof quickActions[0]) => {
    action.onClick();
    navigate(action.route);
  };

  const handleRecommendationInteraction = (recommendationId: string) => {
    neural.notifyEngagement({ 
      action: 'recommendation_click', 
      recommendation_id: recommendationId,
      section: 'smart_recommendations' 
    });
  };

  if (isLoading || metricsLoading) {
    return (
      <div className="grid grid-cols-1 gap-6 p-6">
        <div className="animate-pulse space-y-6">
          <div className="h-48 bg-gray-200 rounded-lg"></div>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="h-32 bg-gray-200 rounded-lg"></div>
            <div className="h-32 bg-gray-200 rounded-lg"></div>
            <div className="h-32 bg-gray-200 rounded-lg"></div>
            <div className="h-32 bg-gray-200 rounded-lg"></div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-indigo-900 text-white overflow-auto">
      <div className="container mx-auto p-6 space-y-8">
        
        {/* Header con métricas principales */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center space-y-4"
          data-section="header"
        >
          <h1 className="text-4xl font-bold bg-gradient-to-r from-cyan-400 to-blue-400 bg-clip-text text-transparent">
            Dashboard Educativo Neural
          </h1>
          <p className="text-xl text-white/70">
            Progreso real basado en datos de Supabase
          </p>
          
          {/* Indicador de salud del sistema neural */}
          <div className="flex items-center justify-center gap-4">
            <Badge variant="outline" className="border-green-400 text-green-400">
              Sistema Neural: {neural.systemHealth.neural_efficiency}% eficiencia
            </Badge>
            <Badge variant="outline" className="border-blue-400 text-blue-400">
              Base de Datos: Conectada
            </Badge>
            <Badge variant="outline" className="border-purple-400 text-purple-400">
              Integración: {neural.integrationLevel}%
            </Badge>
          </div>
        </motion.div>

        {/* Stats principales con datos reales */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6"
          data-section="main-stats"
        >
          <Card className="bg-white/10 backdrop-blur-xl border-white/20 hover:bg-white/15 transition-all">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-white">Nodos Completados</CardTitle>
              <Brain className="h-4 w-4 text-cyan-400" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-white">{metrics.completedNodes}</div>
              <p className="text-xs text-white/60">
                De base de datos real
              </p>
            </CardContent>
          </Card>

          <Card className="bg-white/10 backdrop-blur-xl border-white/20 hover:bg-white/15 transition-all">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-white">Progreso Semanal</CardTitle>
              <Target className="h-4 w-4 text-green-400" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-white">{metrics.weeklyProgress}%</div>
              <Progress value={metrics.weeklyProgress} className="mt-2 bg-white/20" />
            </CardContent>
          </Card>

          <Card className="bg-white/10 backdrop-blur-xl border-white/20 hover:bg-white/15 transition-all">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-white">Racha Actual</CardTitle>
              <TrendingUp className="h-4 w-4 text-orange-400" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-white">{metrics.currentStreak}</div>
              <p className="text-xs text-white/60">
                Días consecutivos de estudio
              </p>
            </CardContent>
          </Card>

          <Card className="bg-white/10 backdrop-blur-xl border-white/20 hover:bg-white/15 transition-all">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-white">Tiempo Total</CardTitle>
              <Clock className="h-4 w-4 text-purple-400" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-white">{metrics.totalStudyTime}h</div>
              <p className="text-xs text-white/60">
                Registrado en sistema
              </p>
            </CardContent>
          </Card>
        </motion.div>

        {/* Arsenal de Herramientas */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          data-section="tools"
        >
          <Card className="bg-white/5 backdrop-blur-xl border-white/10">
            <CardHeader>
              <CardTitle className="text-white flex items-center gap-2">
                <Activity className="h-6 w-6 text-cyan-400" />
                Arsenal de Herramientas PAES
              </CardTitle>
              <p className="text-white/70">Accede a todas las funcionalidades del sistema neural</p>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                {quickActions.map((action, index) => {
                  const Icon = action.icon;
                  return (
                    <motion.div
                      key={action.route}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: index * 0.1 }}
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                    >
                      <Button
                        onClick={() => handleQuickAction(action)}
                        className={`
                          h-auto p-4 w-full flex flex-col items-center gap-3
                          bg-gradient-to-r ${action.color} hover:opacity-90
                          border border-white/20 transition-all duration-300
                        `}
                      >
                        <Icon className="w-8 h-8 text-white" />
                        <div className="text-center">
                          <div className="text-white font-bold text-sm mb-1">
                            {action.title}
                          </div>
                          <div className="text-white/80 text-xs">
                            {action.description}
                          </div>
                        </div>
                        <ArrowRight className="w-4 h-4 text-white mt-2" />
                      </Button>
                    </motion.div>
                  );
                })}
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Recomendaciones Inteligentes */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          data-section="recommendations"
          onClick={() => handleRecommendationInteraction('smart_recommendations_section')}
        >
          <SmartRecommendations recommendations={getSmartRecommendations()} />
        </motion.div>

        {/* Estado del Sistema */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          data-section="system-status"
        >
          <Card className="bg-white/5 backdrop-blur-xl border-white/10">
            <CardHeader>
              <CardTitle className="text-white flex items-center gap-2">
                <Users className="h-6 w-6 text-green-400" />
                Estado del Sistema Neural
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                {Object.entries(systemStatus).map(([system, status]) => (
                  <div key={system} className="flex items-center gap-3 p-3 bg-white/5 rounded-lg">
                    <div className={`w-3 h-3 rounded-full ${
                      status.status === 'active' ? 'bg-green-400' :
                      status.status === 'ready' ? 'bg-blue-400' :
                      status.status === 'error' ? 'bg-red-400' :
                      'bg-yellow-400'
                    }`} />
                    <div>
                      <div className="text-white font-medium capitalize">{system}</div>
                      <div className="text-white/60 text-xs">{status.data}</div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Métricas del Usuario */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          data-section="user-metrics"
        >
          <Card className="bg-white/5 backdrop-blur-xl border-white/10">
            <CardHeader>
              <CardTitle className="text-white">Métricas Detalladas del Usuario</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="space-y-2">
                  <p className="text-white/70 text-sm">Ejercicios Completados</p>
                  <p className="text-2xl font-bold text-white">{userMetrics.exercisesCompleted}</p>
                </div>
                <div className="space-y-2">
                  <p className="text-white/70 text-sm">Puntuación Promedio</p>
                  <p className="text-2xl font-bold text-white">{userMetrics.averageScore}%</p>
                </div>
                <div className="space-y-2">
                  <p className="text-white/70 text-sm">Nivel Actual</p>
                  <p className="text-2xl font-bold text-white">Nivel {userMetrics.level}</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>

      </div>
    </div>
  );
};
