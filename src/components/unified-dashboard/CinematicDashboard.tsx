
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { useLectoGuiaSimplified } from '@/hooks/lectoguia/useLectoGuiaSimplified';
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
  const { getStats } = useLectoGuiaSimplified();
  const stats = getStats();
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

  return (
    <div className="grid grid-cols-1 gap-6 p-6">
      {/* Stats principales */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card className="bg-gradient-to-br from-blue-50 to-blue-100 dark:from-blue-950 dark:to-blue-900">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Ejercicios Totales</CardTitle>
            <Brain className="h-4 w-4 text-blue-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.totalExercises}</div>
            <p className="text-xs text-muted-foreground">
              Ejercicios completados
            </p>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-green-50 to-green-100 dark:from-green-950 dark:to-green-900">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Tasa de Éxito</CardTitle>
            <Target className="h-4 w-4 text-green-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.successRate.toFixed(1)}%</div>
            <Progress value={stats.successRate} className="mt-2" />
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-orange-50 to-orange-100 dark:from-orange-950 dark:to-orange-900">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Racha Actual</CardTitle>
            <TrendingUp className="h-4 w-4 text-orange-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.currentStreak}</div>
            <p className="text-xs text-muted-foreground">
              Días consecutivos
            </p>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-purple-50 to-purple-100 dark:from-purple-950 dark:to-purple-900">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Tiempo Promedio</CardTitle>
            <Award className="h-4 w-4 text-purple-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.averageTime.toFixed(1)}min</div>
            <p className="text-xs text-muted-foreground">
              Por sesión
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
            {Object.entries(stats.skillLevels).map(([skill, level]) => (
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
    </div>
  );
};
