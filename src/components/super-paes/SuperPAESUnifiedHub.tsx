
import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { useGlobalCinematic } from '@/contexts/GlobalCinematicContext';
import { useUnifiedNavigation } from '@/hooks/useUnifiedNavigation';
import { useAuth } from '@/contexts/AuthContext';
import { 
  Brain, 
  Target, 
  BookOpen, 
  TrendingUp,
  Zap,
  Clock,
  Award,
  Star,
  ArrowRight,
  Activity,
  Trophy
} from 'lucide-react';

export const SuperPAESUnifiedHub: React.FC = () => {
  const { user } = useAuth();
  const { state: cinematicState, addAchievement } = useGlobalCinematic();
  const navigation = useUnifiedNavigation();
  const [isLoading, setIsLoading] = useState(true);
  const [activeModule, setActiveModule] = useState<string>('overview');

  useEffect(() => {
    const timer = setTimeout(() => setIsLoading(false), 800);
    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    if (!isLoading) {
      addAchievement('superpaes_hub_activated');
    }
  }, [isLoading, addAchievement]);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-900 via-blue-900 to-indigo-900 flex items-center justify-center">
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          className="text-center text-white"
        >
          <div className="relative mb-6">
            <Brain className="w-16 h-16 mx-auto text-purple-400 animate-pulse" />
            <div className="absolute inset-0 bg-purple-400 rounded-full blur-xl opacity-30 animate-ping" />
          </div>
          <h2 className="text-2xl font-bold mb-2">SuperPAES Neural Activado</h2>
          <p className="text-purple-200">Inicializando sistema unificado...</p>
        </motion.div>
      </div>
    );
  }

  const systemModules = [
    {
      id: 'lectoguia',
      name: 'LectoGuía IA',
      icon: BookOpen,
      description: 'Asistente inteligente de lectura',
      status: 'active',
      action: () => navigation.goToLectoGuia()
    },
    {
      id: 'diagnostic',
      name: 'Diagnóstico Neural',
      icon: Target,
      description: 'Evaluación adaptativa completa',
      status: 'ready',
      action: () => navigation.goToDiagnostic()
    },
    {
      id: 'planning',
      name: 'Planificador',
      icon: TrendingUp,
      description: 'Planes de estudio personalizados',
      status: 'active',
      action: () => navigation.goToPlanning()
    },
    {
      id: 'universe',
      name: 'Universo 3D',
      icon: Star,
      description: 'Exploración visual inmersiva',
      status: 'ready',
      action: () => navigation.goToUniverse()
    },
    {
      id: 'financial',
      name: 'Centro Financiero',
      icon: Award,
      description: 'Simulación y becas',
      status: 'active',
      action: () => navigation.goToFinancial()
    },
    {
      id: 'achievements',
      name: 'Logros',
      icon: Trophy,
      description: 'Sistema de reconocimientos',
      status: 'ready',
      action: () => navigation.goToAchievements()
    }
  ];

  const systemMetrics = {
    neuralEfficiency: 89,
    adaptiveLearning: 76,
    systemHealth: 94,
    activeModules: 6,
    totalSessions: 127,
    streakDays: 12
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-900 via-blue-900 to-indigo-900">
      {/* Header Neural */}
      <div className="border-b border-white/10 bg-black/20 backdrop-blur-sm">
        <div className="container mx-auto px-6 py-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="relative">
                <Brain className="w-8 h-8 text-purple-400" />
                <div className="absolute -top-1 -right-1 w-3 h-3 bg-green-400 rounded-full animate-pulse" />
              </div>
              <div>
                <h1 className="text-2xl font-bold text-white">SuperPAES Neural Hub</h1>
                <p className="text-purple-200 text-sm">Sistema Unificado de Preparación PAES</p>
              </div>
            </div>
            
            <div className="flex items-center gap-6">
              <div className="text-center">
                <div className="text-sm text-white/60">Eficiencia Neural</div>
                <div className="text-xl font-bold text-green-400">{systemMetrics.neuralEfficiency}%</div>
              </div>
              <div className="text-center">
                <div className="text-sm text-white/60">Salud del Sistema</div>
                <div className="text-xl font-bold text-cyan-400">{systemMetrics.systemHealth}%</div>
              </div>
              <Badge className="bg-green-600 text-white">
                <Activity className="w-3 h-3 mr-1" />
                En Línea
              </Badge>
            </div>
          </div>
        </div>
      </div>

      {/* Contenido Principal */}
      <div className="container mx-auto px-6 py-8">
        {/* Métricas del Sistema */}
        <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-6 gap-4 mb-8">
          <Card className="bg-black/40 backdrop-blur-xl border-white/10">
            <CardContent className="p-4 text-center">
              <Zap className="w-6 h-6 mx-auto mb-2 text-yellow-400" />
              <div className="text-yellow-400 text-lg font-bold">{systemMetrics.neuralEfficiency}%</div>
              <div className="text-white/70 text-xs">Neural</div>
            </CardContent>
          </Card>

          <Card className="bg-black/40 backdrop-blur-xl border-white/10">
            <CardContent className="p-4 text-center">
              <Target className="w-6 h-6 mx-auto mb-2 text-green-400" />
              <div className="text-green-400 text-lg font-bold">{systemMetrics.adaptiveLearning}%</div>
              <div className="text-white/70 text-xs">Adaptivo</div>
            </CardContent>
          </Card>

          <Card className="bg-black/40 backdrop-blur-xl border-white/10">
            <CardContent className="p-4 text-center">
              <Activity className="w-6 h-6 mx-auto mb-2 text-cyan-400" />
              <div className="text-cyan-400 text-lg font-bold">{systemMetrics.systemHealth}%</div>
              <div className="text-white/70 text-xs">Salud</div>
            </CardContent>
          </Card>

          <Card className="bg-black/40 backdrop-blur-xl border-white/10">
            <CardContent className="p-4 text-center">
              <Star className="w-6 h-6 mx-auto mb-2 text-purple-400" />
              <div className="text-purple-400 text-lg font-bold">{systemMetrics.activeModules}</div>
              <div className="text-white/70 text-xs">Módulos</div>
            </CardContent>
          </Card>

          <Card className="bg-black/40 backdrop-blur-xl border-white/10">
            <CardContent className="p-4 text-center">
              <Clock className="w-6 h-6 mx-auto mb-2 text-blue-400" />
              <div className="text-blue-400 text-lg font-bold">{systemMetrics.totalSessions}</div>
              <div className="text-white/70 text-xs">Sesiones</div>
            </CardContent>
          </Card>

          <Card className="bg-black/40 backdrop-blur-xl border-white/10">
            <CardContent className="p-4 text-center">
              <Award className="w-6 h-6 mx-auto mb-2 text-orange-400" />
              <div className="text-orange-400 text-lg font-bold">{systemMetrics.streakDays}</div>
              <div className="text-white/70 text-xs">Racha</div>
            </CardContent>
          </Card>
        </div>

        {/* Grid de Módulos */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {systemModules.map((module) => {
            const Icon = module.icon;
            return (
              <motion.div
                key={module.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 }}
              >
                <Card className="bg-black/40 backdrop-blur-xl border-white/10 hover:border-purple-400/30 transition-all cursor-pointer group">
                  <CardHeader>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <Icon className="w-6 h-6 text-purple-400 group-hover:text-purple-300 transition-colors" />
                        <CardTitle className="text-white text-lg">{module.name}</CardTitle>
                      </div>
                      <Badge 
                        className={`${
                          module.status === 'active' 
                            ? 'bg-green-600' 
                            : 'bg-blue-600'
                        }`}
                      >
                        {module.status === 'active' ? 'Activo' : 'Listo'}
                      </Badge>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <p className="text-white/70 text-sm mb-4">{module.description}</p>
                    <Button 
                      onClick={module.action}
                      className="w-full bg-purple-600 hover:bg-purple-700 group"
                    >
                      Acceder
                      <ArrowRight className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" />
                    </Button>
                  </CardContent>
                </Card>
              </motion.div>
            );
          })}
        </div>

        {/* Estado del Sistema */}
        <div className="mt-8">
          <Card className="bg-black/40 backdrop-blur-xl border-white/10">
            <CardHeader>
              <CardTitle className="text-white flex items-center gap-2">
                <Brain className="w-5 h-5 text-purple-400" />
                Estado Neural del Sistema
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div>
                  <div className="flex justify-between text-sm mb-2">
                    <span className="text-white/70">Coordinación Neural</span>
                    <span className="text-purple-400">{systemMetrics.neuralEfficiency}%</span>
                  </div>
                  <Progress value={systemMetrics.neuralEfficiency} className="h-2" />
                </div>
                
                <div>
                  <div className="flex justify-between text-sm mb-2">
                    <span className="text-white/70">Aprendizaje Adaptativo</span>
                    <span className="text-green-400">{systemMetrics.adaptiveLearning}%</span>
                  </div>
                  <Progress value={systemMetrics.adaptiveLearning} className="h-2" />
                </div>
                
                <div>
                  <div className="flex justify-between text-sm mb-2">
                    <span className="text-white/70">Salud Integral</span>
                    <span className="text-cyan-400">{systemMetrics.systemHealth}%</span>
                  </div>
                  <Progress value={systemMetrics.systemHealth} className="h-2" />
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};
