
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { useRealDashboardData } from '@/hooks/dashboard/useRealDashboardData';
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
  ArrowRight
} from 'lucide-react';
import { motion } from 'framer-motion';

export const CinematicDashboard: React.FC = () => {
  const { metrics, systemStatus, isLoading, navigateToSection } = useRealDashboardData();
  const navigate = useNavigate();

  const quickActions = [
    {
      title: "Banco de Evaluaciones",
      description: "722 evaluaciones disponibles",
      icon: Database,
      color: "from-blue-500 to-cyan-500",
      route: "/evaluations"
    },
    {
      title: "Generador de Ejercicios",
      description: "Crea ejercicios personalizados",
      icon: Zap,
      color: "from-yellow-500 to-orange-500",
      route: "/exercise-generator"
    },
    {
      title: "Sistema de Logros",
      description: "12 logros desbloqueados",
      icon: Trophy,
      color: "from-purple-500 to-pink-500",
      route: "/gamification"
    },
    {
      title: "Centro Financiero",
      description: "Becas y financiamiento",
      icon: DollarSign,
      color: "from-green-500 to-emerald-500",
      route: "/financial"
    }
  ];

  // Calcular skillLevels basado en métricas reales
  const skillLevels = {
    'Interpretación': Math.round((metrics.completedNodes / 50) * 100),
    'Análisis': Math.round((metrics.weeklyProgress / 100) * 85),
    'Síntesis': Math.round((metrics.currentStreak * 5) + 45),
    'Evaluación': Math.round((metrics.totalStudyTime * 2) + 35),
    'Aplicación': Math.round((metrics.predictedScore / 850) * 100)
  };

  if (isLoading) {
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
    <div className="grid grid-cols-1 gap-6 p-6">
      {/* Stats principales */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card className="bg-gradient-to-br from-blue-50 to-blue-100 dark:from-blue-950 dark:to-blue-900">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Nodos Completados</CardTitle>
            <Brain className="h-4 w-4 text-blue-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{metrics.completedNodes}</div>
            <p className="text-xs text-muted-foreground">
              Nodos completados
            </p>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-green-50 to-green-100 dark:from-green-950 dark:to-green-900">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Progreso Semanal</CardTitle>
            <Target className="h-4 w-4 text-green-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{metrics.weeklyProgress}%</div>
            <Progress value={metrics.weeklyProgress} className="mt-2" />
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-orange-50 to-orange-100 dark:from-orange-950 dark:to-orange-900">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Racha Actual</CardTitle>
            <TrendingUp className="h-4 w-4 text-orange-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{metrics.currentStreak}</div>
            <p className="text-xs text-muted-foreground">
              Días consecutivos
            </p>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-purple-50 to-purple-100 dark:from-purple-950 dark:to-purple-900">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Tiempo Total</CardTitle>
            <Award className="h-4 w-4 text-purple-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{metrics.totalStudyTime}h</div>
            <p className="text-xs text-muted-foreground">
              Tiempo de estudio
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Arsenal de Herramientas */}
      <Card className="bg-white/5 backdrop-blur-xl border-white/10">
        <CardHeader>
          <CardTitle className="text-white">Arsenal de Herramientas PAES</CardTitle>
          <p className="text-white/70">Accede a todas las funcionalidades avanzadas del sistema</p>
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
                    onClick={() => navigate(action.route)}
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

      {/* Progreso por Habilidades */}
      <Card className="bg-white/5 backdrop-blur-xl border-white/10">
        <CardHeader>
          <CardTitle className="text-white">Progreso por Habilidades</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {Object.entries(skillLevels).map(([skill, level]) => (
              <div key={skill} className="flex items-center justify-between">
                <span className="text-sm font-medium text-white">{skill}</span>
                <div className="flex items-center gap-2">
                  <Progress value={level} className="w-32" />
                  <Badge variant="outline" className="text-white border-white/30">{level}%</Badge>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Estado del Sistema */}
      <Card className="bg-white/5 backdrop-blur-xl border-white/10">
        <CardHeader>
          <CardTitle className="text-white">Estado del Sistema Neural</CardTitle>
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
    </div>
  );
};
