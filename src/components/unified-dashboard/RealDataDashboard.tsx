
import React from 'react';
import { motion } from 'framer-motion';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { useRealDashboardData } from '@/hooks/dashboard/useRealDashboardData';
import { useRealUserMetrics } from '@/hooks/useRealUserMetrics';
import { useNeuralIntegration } from '@/hooks/use-neural-integration';
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
  Calendar,
  BookOpen,
  BarChart3
} from 'lucide-react';

interface RealDataDashboardProps {
  userId: string;
}

export const RealDataDashboard: React.FC<RealDataDashboardProps> = ({ userId }) => {
  const navigate = useNavigate();
  const { metrics, systemStatus, isLoading, navigateToSection } = useRealDashboardData();
  const { metrics: userMetrics, isLoading: metricsLoading } = useRealUserMetrics();
  
  // Integración neural completa
  const {
    broadcastUserAction,
    systemHealth,
    integrationLevel,
    notifyProgress,
    notifyEngagement
  } = useNeuralIntegration('dashboard', ['data_visualization', 'user_metrics', 'navigation'], {
    userId,
    metrics,
    userMetrics
  });

  // Acciones de navegación con broadcast neural
  const handleNavigation = (route: string, context?: any) => {
    broadcastUserAction('NAVIGATE_TO_TOOL', { route, context, timestamp: Date.now() });
    navigate(route);
    notifyEngagement({ action: 'navigation', target: route });
  };

  const handleSectionScroll = (section: string) => {
    navigateToSection(section);
    broadcastUserAction('SCROLL_TO_SECTION', { section, timestamp: Date.now() });
  };

  const quickActions = [
    {
      title: "Diagnóstico Inteligente",
      description: `${userMetrics.exercisesCompleted} evaluaciones realizadas`,
      icon: Brain,
      color: "from-blue-500 to-cyan-500",
      route: "/diagnostic",
      section: "diagnostic"
    },
    {
      title: "LectoGuía IA",
      description: "Chat inteligente personalizado",
      icon: Zap,
      color: "from-yellow-500 to-orange-500",
      route: "/lectoguia",
      section: "lectoguia"
    },
    {
      title: "Planificación Adaptativa",
      description: `${metrics.completedNodes} nodos completados`,
      icon: Target,
      color: "from-purple-500 to-pink-500",
      route: "/plans",
      section: "planning"
    },
    {
      title: "Centro Financiero",
      description: "Becas y oportunidades",
      icon: DollarSign,
      color: "from-green-500 to-emerald-500",
      route: "/financial",
      section: "financial"
    }
  ];

  if (isLoading || metricsLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-indigo-900 flex items-center justify-center">
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
          className="w-16 h-16 border-4 border-cyan-400 border-t-transparent rounded-full"
        />
      </div>
    );
  }

  return (
    <div className="dashboard-container min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-indigo-900 p-6">
      <div className="max-w-7xl mx-auto space-y-8">
        
        {/* Header con métricas reales */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center space-y-4"
          data-section="header"
        >
          <h1 className="text-4xl font-bold text-white flex items-center justify-center gap-3">
            <Brain className="w-10 h-10 text-cyan-400" />
            Hub Educativo Neural
          </h1>
          <p className="text-white/80 text-xl">
            Sistema integrado con datos reales - Neural Level: {integrationLevel}%
          </p>
          <div className="flex justify-center gap-4">
            <Badge variant="outline" className="text-cyan-400 border-cyan-400">
              Usuario: {metrics.userId ? 'Conectado' : 'Invitado'}
            </Badge>
            <Badge variant="outline" className="text-green-400 border-green-400">
              Sistema Neural: {systemHealth.neural_efficiency}%
            </Badge>
          </div>
        </motion.div>

        {/* Métricas principales REALES */}
        <div className="card-grid grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6" data-section="metrics">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="metrics-card"
          >
            <Card className="bg-white/10 backdrop-blur-md border-white/20">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-white/80 text-sm">Nodos Completados</p>
                    <p className="text-3xl font-bold text-white">{metrics.completedNodes}</p>
                    <p className="text-xs text-cyan-300">
                      Progreso real del usuario
                    </p>
                  </div>
                  <Brain className="w-8 h-8 text-cyan-400" />
                </div>
              </CardContent>
            </Card>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="metrics-card"
          >
            <Card className="bg-white/10 backdrop-blur-md border-white/20">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-white/80 text-sm">Progreso Semanal</p>
                    <p className="text-3xl font-bold text-white">{metrics.weeklyProgress}%</p>
                    <Progress value={metrics.weeklyProgress} className="mt-2 bg-white/10" />
                  </div>
                  <TrendingUp className="w-8 h-8 text-green-400" />
                </div>
              </CardContent>
            </Card>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="metrics-card"
          >
            <Card className="bg-white/10 backdrop-blur-md border-white/20">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-white/80 text-sm">Racha Actual</p>
                    <p className="text-3xl font-bold text-white">{metrics.currentStreak}</p>
                    <p className="text-xs text-orange-300">
                      Días consecutivos reales
                    </p>
                  </div>
                  <Award className="w-8 h-8 text-orange-400" />
                </div>
              </CardContent>
            </Card>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="metrics-card"
          >
            <Card className="bg-white/10 backdrop-blur-md border-white/20">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-white/80 text-sm">Puntaje Predictivo</p>
                    <p className="text-3xl font-bold text-white">{metrics.predictedScore}</p>
                    <p className="text-xs text-purple-300">
                      Basado en análisis real
                    </p>
                  </div>
                  <BarChart3 className="w-8 h-8 text-purple-400" />
                </div>
              </CardContent>
            </Card>
          </motion.div>
        </div>

        {/* Arsenal de herramientas con datos reales */}
        <Card className="bg-white/5 backdrop-blur-xl border-white/10" data-section="tools">
          <CardHeader>
            <CardTitle className="text-white flex items-center gap-2">
              <Database className="w-5 h-5" />
              Arsenal de Herramientas PAES - Datos Reales
            </CardTitle>
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
                      onClick={() => handleNavigation(action.route, { from: 'dashboard' })}
                      data-smooth-scroll={`[data-section="${action.section}"]`}
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

        {/* Estado del sistema con datos reales */}
        <Card className="bg-white/5 backdrop-blur-xl border-white/10" data-section="system-status">
          <CardHeader>
            <CardTitle className="text-white flex items-center gap-2">
              <Brain className="w-5 h-5" />
              Estado del Sistema Neural - Datos Reales
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              {Object.entries(systemStatus).map(([system, status]) => (
                <motion.div
                  key={system}
                  whileHover={{ scale: 1.02 }}
                  className="flex items-center gap-3 p-4 bg-white/5 rounded-lg border border-white/10"
                >
                  <div className={`w-3 h-3 rounded-full ${
                    status.status === 'active' ? 'bg-green-400 animate-pulse' :
                    status.status === 'ready' ? 'bg-blue-400' :
                    status.status === 'error' ? 'bg-red-400' :
                    'bg-yellow-400'
                  }`} />
                  <div>
                    <div className="text-white font-medium capitalize">{system}</div>
                    <div className="text-white/60 text-xs">{status.data}</div>
                  </div>
                </motion.div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Métricas de usuario detalladas */}
        <Card className="bg-white/5 backdrop-blur-xl border-white/10" data-section="user-metrics">
          <CardHeader>
            <CardTitle className="text-white flex items-center gap-2">
              <Trophy className="w-5 h-5" />
              Métricas Detalladas del Usuario
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="text-center p-4 bg-white/5 rounded-lg">
                <BookOpen className="w-8 h-8 text-blue-400 mx-auto mb-2" />
                <p className="text-white font-medium">Tiempo Total</p>
                <p className="text-2xl font-bold text-blue-400">{userMetrics.totalStudyTime}h</p>
              </div>
              <div className="text-center p-4 bg-white/5 rounded-lg">
                <Target className="w-8 h-8 text-green-400 mx-auto mb-2" />
                <p className="text-white font-medium">Precisión</p>
                <p className="text-2xl font-bold text-green-400">{userMetrics.averageScore}%</p>
              </div>
              <div className="text-center p-4 bg-white/5 rounded-lg">
                <Award className="w-8 h-8 text-purple-400 mx-auto mb-2" />
                <p className="text-white font-medium">Nivel</p>
                <p className="text-2xl font-bold text-purple-400">{userMetrics.level}</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};
