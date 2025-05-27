
import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { useAuth } from '@/contexts/AuthContext';
import { UnifiedDashboardService } from '@/services/dashboard/UnifiedDashboardService';
import { 
  Brain, 
  Target, 
  Zap, 
  BookOpen, 
  Calendar,
  DollarSign,
  Award,
  Sparkles,
  TrendingUp,
  Clock,
  Star,
  Globe,
  BarChart3
} from 'lucide-react';

interface ModuleCard {
  id: string;
  name: string;
  description: string;
  icon: React.ComponentType<any>;
  route: string;
  color: string;
  status: 'active' | 'inactive' | 'new';
  progress?: number;
  metric?: string | number;
}

export const SuperPAESUnifiedHub: React.FC = () => {
  const navigate = useNavigate();
  const { profile } = useAuth();
  const [isLoading, setIsLoading] = useState(true);
  const [metrics, setMetrics] = useState<any>(null);
  const [moduleStatus, setModuleStatus] = useState<any>(null);

  const modules: ModuleCard[] = [
    {
      id: 'lectoguia',
      name: 'LectoGuía IA',
      description: 'Asistente personal de lectura y comprensión',
      icon: BookOpen,
      route: '/lectoguia',
      color: 'from-blue-600 to-cyan-600',
      status: 'active',
      progress: moduleStatus?.lectoguia?.sessionCount ? Math.min(100, moduleStatus.lectoguia.sessionCount * 10) : 0,
      metric: moduleStatus?.lectoguia?.sessionCount || 0
    },
    {
      id: 'diagnostic',
      name: 'Diagnóstico PAES',
      description: 'Evaluaciones adaptativas neurales',
      icon: Target,
      route: '/diagnostic',
      color: 'from-purple-600 to-pink-600',
      status: 'active',
      progress: moduleStatus?.diagnostic?.completedTests ? moduleStatus.diagnostic.completedTests * 25 : 0,
      metric: moduleStatus?.diagnostic?.completedTests || 0
    },
    {
      id: 'planning',
      name: 'Planificador',
      description: 'Planes de estudio personalizados',
      icon: Calendar,
      route: '/planning',
      color: 'from-green-600 to-emerald-600',
      status: 'active',
      progress: moduleStatus?.planning?.activePlans ? moduleStatus.planning.activePlans * 30 : 0,
      metric: moduleStatus?.planning?.activePlans || 0
    },
    {
      id: 'universe',
      name: 'Universo 3D',
      description: 'Exploración inmersiva del conocimiento',
      icon: Globe,
      route: '/universe',
      color: 'from-indigo-600 to-purple-600',
      status: 'active',
      progress: moduleStatus?.universe?.explorationLevel || 0,
      metric: `${moduleStatus?.universe?.unlockedAreas || 0}/8 áreas`
    },
    {
      id: 'financial',
      name: 'Centro Financiero',
      description: 'Simulaciones y becas universitarias',
      icon: DollarSign,
      route: '/financial',
      color: 'from-yellow-600 to-orange-600',
      status: 'active',
      progress: moduleStatus?.financial?.simulationsCount ? moduleStatus.financial.simulationsCount * 20 : 0,
      metric: `${moduleStatus?.financial?.scholarshipMatches || 0} becas`
    },
    {
      id: 'achievements',
      name: 'Sistema de Logros',
      description: 'Progreso y gamificación',
      icon: Award,
      route: '/achievements',
      color: 'from-amber-600 to-yellow-600',
      status: 'active',
      progress: moduleStatus?.achievements?.totalPoints ? Math.min(100, moduleStatus.achievements.totalPoints / 50) : 0,
      metric: `${moduleStatus?.achievements?.unlockedBadges || 0} insignias`
    }
  ];

  useEffect(() => {
    const loadData = async () => {
      if (!profile?.id) return;

      try {
        setIsLoading(true);
        const [metricsData, statusData] = await Promise.all([
          UnifiedDashboardService.getUserMetrics(profile.id),
          UnifiedDashboardService.getModuleStatus(profile.id)
        ]);
        
        setMetrics(metricsData);
        setModuleStatus(statusData);
      } catch (error) {
        console.error('Error loading hub data:', error);
      } finally {
        setIsLoading(false);
      }
    };

    loadData();
  }, [profile?.id]);

  const handleModuleNavigation = (route: string) => {
    navigate(route);
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-900 via-blue-900 to-indigo-900 flex items-center justify-center">
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          className="text-center text-white"
        >
          <div className="w-16 h-16 border-4 border-purple-400 border-t-transparent rounded-full mx-auto mb-4 animate-spin" />
          <div className="text-xl font-bold">SuperPAES Neural Activando</div>
          <div className="text-sm text-purple-200 mt-2">Conectando datos reales del sistema...</div>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-900 via-blue-900 to-indigo-900 p-6">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="max-w-7xl mx-auto"
      >
        {/* Header Neural */}
        <div className="mb-8 text-center">
          <h1 className="text-4xl font-bold text-white mb-2 flex items-center justify-center gap-3">
            <Brain className="w-8 h-8 text-purple-400" />
            SuperPAES Hub Neural
          </h1>
          <p className="text-white/70 text-lg">Centro de Comando Unificado - Datos en Tiempo Real</p>
        </div>

        {/* Métricas Principales */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <Card className="bg-black/40 backdrop-blur-xl border-white/10">
            <CardHeader className="pb-2">
              <CardTitle className="text-white flex items-center gap-2 text-sm">
                <TrendingUp className="w-4 h-4 text-green-400" />
                Progreso Neural
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-green-400 mb-1">
                {metrics?.overallProgress || 0}%
              </div>
              <Progress value={metrics?.overallProgress || 0} className="h-2" />
            </CardContent>
          </Card>

          <Card className="bg-black/40 backdrop-blur-xl border-white/10">
            <CardHeader className="pb-2">
              <CardTitle className="text-white flex items-center gap-2 text-sm">
                <Zap className="w-4 h-4 text-yellow-400" />
                Eficiencia
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-yellow-400 mb-1">
                {metrics?.neuralEfficiency || 0}%
              </div>
              <Progress value={metrics?.neuralEfficiency || 0} className="h-2" />
            </CardContent>
          </Card>

          <Card className="bg-black/40 backdrop-blur-xl border-white/10">
            <CardHeader className="pb-2">
              <CardTitle className="text-white flex items-center gap-2 text-sm">
                <Clock className="w-4 h-4 text-cyan-400" />
                Tiempo Activo
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-cyan-400 mb-1">
                {metrics?.totalStudyTime || 0}m
              </div>
              <div className="text-xs text-white/60">Total de estudio</div>
            </CardContent>
          </Card>

          <Card className="bg-black/40 backdrop-blur-xl border-white/10">
            <CardHeader className="pb-2">
              <CardTitle className="text-white flex items-center gap-2 text-sm">
                <Star className="w-4 h-4 text-purple-400" />
                Racha Actual
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-purple-400 mb-1">
                {metrics?.currentStreak || 0}
              </div>
              <div className="text-xs text-white/60">Días consecutivos</div>
            </CardContent>
          </Card>
        </div>

        {/* Módulos del Ecosistema */}
        <div className="mb-8">
          <h2 className="text-2xl font-bold text-white mb-6 flex items-center gap-2">
            <Sparkles className="w-6 h-6 text-cyan-400" />
            Módulos del Ecosistema
          </h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {modules.map((module) => {
              const Icon = module.icon;
              return (
                <motion.div
                  key={module.id}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
                  <Card 
                    className="bg-black/40 backdrop-blur-xl border-white/10 cursor-pointer hover:bg-black/50 transition-all duration-300"
                    onClick={() => handleModuleNavigation(module.route)}
                  >
                    <CardHeader>
                      <div className="flex items-start justify-between">
                        <div className="flex items-center gap-3">
                          <div className={`w-12 h-12 bg-gradient-to-r ${module.color} rounded-lg flex items-center justify-center`}>
                            <Icon className="w-6 h-6 text-white" />
                          </div>
                          <div>
                            <CardTitle className="text-white text-lg">{module.name}</CardTitle>
                            <p className="text-white/60 text-sm">{module.description}</p>
                          </div>
                        </div>
                        <Badge 
                          variant={module.status === 'active' ? 'default' : 'secondary'}
                          className={module.status === 'active' ? 'bg-green-600' : ''}
                        >
                          {module.status === 'active' ? 'Activo' : 'Nuevo'}
                        </Badge>
                      </div>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-3">
                        <div className="flex items-center justify-between">
                          <span className="text-white/70 text-sm">Progreso</span>
                          <span className="text-cyan-400 font-medium">{module.progress}%</span>
                        </div>
                        <Progress value={module.progress} className="h-2" />
                        <div className="flex items-center justify-between">
                          <span className="text-white/70 text-sm">Estado</span>
                          <span className="text-green-400 text-sm">{module.metric}</span>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>
              );
            })}
          </div>
        </div>

        {/* Actividad Reciente */}
        <Card className="bg-black/40 backdrop-blur-xl border-white/10">
          <CardHeader>
            <CardTitle className="text-white flex items-center gap-2">
              <BarChart3 className="w-5 h-5 text-cyan-400" />
              Actividad Reciente
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {metrics?.recentActivity?.slice(0, 5).map((activity: any, index: number) => (
                <div key={index} className="flex items-center justify-between p-2 bg-white/5 rounded-lg">
                  <div className="flex items-center gap-3">
                    <div className={`w-2 h-2 rounded-full ${
                      activity.type === 'exercise' ? 'bg-green-400' : 'bg-blue-400'
                    }`} />
                    <span className="text-white text-sm">
                      {activity.type === 'exercise' ? 'Ejercicio completado' : 'Conversación LectoGuía'}
                    </span>
                  </div>
                  <span className="text-white/60 text-xs">
                    {new Date(activity.timestamp).toLocaleTimeString()}
                  </span>
                </div>
              )) || (
                <div className="text-center text-white/60 py-8">
                  <Clock className="w-8 h-8 mx-auto mb-2 opacity-50" />
                  <p>No hay actividad reciente</p>
                  <p className="text-sm">¡Comienza explorando los módulos!</p>
                </div>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Sistema Neural Status */}
        <div className="mt-8 text-center">
          <div className="inline-flex items-center gap-2 bg-green-500/20 px-4 py-2 rounded-full">
            <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse" />
            <span className="text-green-400 text-sm font-medium">
              Sistema Neural 100% Operativo - {metrics?.systemHealth || 0}% Salud General
            </span>
          </div>
        </div>
      </motion.div>
    </div>
  );
};
