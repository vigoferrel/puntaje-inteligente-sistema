
import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { 
  Target, 
  Brain, 
  TrendingUp, 
  Clock, 
  Award,
  BookOpen,
  BarChart3,
  Zap
} from "lucide-react";
import { universalHub } from '@/core/universal-hub/UniversalDataHub';
import { useCinematicFlow } from '@/hooks/use-cinematic-flow';
import { useAuth } from '@/contexts/AuthContext';

export const UnifiedDashboardCinematic: React.FC = () => {
  const { user } = useAuth();
  const [dashboardData, setDashboardData] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);
  
  const {
    startEvaluation,
    navigateToLectoGuia,
    openStudyPlan,
    startDiagnostic,
    isTransitioning
  } = useCinematicFlow(user?.id);

  // Cargar datos unificados
  useEffect(() => {
    if (!user?.id) return;

    const loadDashboardData = async () => {
      try {
        setIsLoading(true);
        const data = await universalHub.getDashboardData(user.id);
        setDashboardData(data);
      } catch (error) {
        console.error('Error cargando dashboard:', error);
      } finally {
        setIsLoading(false);
      }
    };

    loadDashboardData();

    // Suscribirse a actualizaciones en tiempo real
    const unsubscribe = universalHub.subscribe(`dashboard_${user.id}`, (updatedData) => {
      setDashboardData(updatedData);
    });

    return unsubscribe;
  }, [user?.id]);

  if (isLoading || !dashboardData) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-900 via-blue-900 to-indigo-900 flex items-center justify-center">
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
          className="w-12 h-12 border-4 border-white border-t-transparent rounded-full"
        />
      </div>
    );
  }

  const { profile, metrics, recommendations } = dashboardData;

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-900 via-blue-900 to-indigo-900 p-6">
      <div className="max-w-7xl mx-auto space-y-6">
        
        {/* Header Cinematográfico */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center space-y-4 mb-8"
        >
          <h1 className="text-4xl font-bold text-white">
            ¡Hola, {profile?.name || 'Estudiante'}! 👋
          </h1>
          <p className="text-white/80 text-xl">
            Tu progreso PAES está en{' '}
            <span className="text-yellow-400 font-semibold">
              {metrics?.overallProgress || 0}%
            </span>
          </p>
        </motion.div>

        {/* Métricas Principales */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          {[
            {
              title: 'Progreso General',
              value: `${metrics?.overallProgress || 0}%`,
              icon: TrendingUp,
              color: 'from-green-400 to-emerald-600'
            },
            {
              title: 'Áreas Fuertes',
              value: metrics?.strongAreas?.length || 0,
              icon: Award,
              color: 'from-yellow-400 to-orange-600'
            },
            {
              title: 'Eficiencia Estudio',
              value: `${metrics?.studyEfficiency || 0}%`,
              icon: Zap,
              color: 'from-blue-400 to-indigo-600'
            },
            {
              title: 'Preparación PAES',
              value: `${metrics?.paesReadiness?.score || 0}%`,
              icon: Target,
              color: 'from-purple-400 to-pink-600'
            }
          ].map((metric, index) => (
            <motion.div
              key={metric.title}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
            >
              <Card className="bg-white/10 backdrop-blur-md border-white/20 text-white">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-white/80 text-sm">{metric.title}</p>
                      <p className="text-2xl font-bold">{metric.value}</p>
                    </div>
                    <div className={`p-3 rounded-full bg-gradient-to-r ${metric.color}`}>
                      <metric.icon className="w-6 h-6 text-white" />
                    </div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>

        {/* Acciones Rápidas Cinematográficas */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
        >
          <Card className="bg-white/10 backdrop-blur-md border-white/20">
            <CardHeader>
              <CardTitle className="text-white flex items-center gap-2">
                <Zap className="w-5 h-5" />
                Acciones Recomendadas
              </CardTitle>
            </CardHeader>
            <CardContent className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              {[
                {
                  title: 'Evaluación Adaptativa',
                  description: 'Mide tu nivel actual',
                  icon: Target,
                  action: () => startEvaluation('COMPETENCIA_LECTORA'),
                  color: 'from-red-500 to-pink-600',
                  disabled: isTransitioning
                },
                {
                  title: 'LectoGuía IA',
                  description: 'Practica con IA personalizada',
                  icon: Brain,
                  action: () => navigateToLectoGuia(),
                  color: 'from-blue-500 to-indigo-600',
                  disabled: isTransitioning
                },
                {
                  title: 'Plan de Estudio',
                  description: 'Organiza tu aprendizaje',
                  icon: BookOpen,
                  action: () => openStudyPlan(),
                  color: 'from-green-500 to-emerald-600',
                  disabled: isTransitioning
                },
                {
                  title: 'Diagnóstico Completo',
                  description: 'Análisis profundo de habilidades',
                  icon: BarChart3,
                  action: () => startDiagnostic(),
                  color: 'from-purple-500 to-violet-600',
                  disabled: isTransitioning
                }
              ].map((action, index) => (
                <motion.div
                  key={action.title}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
                  <Button
                    onClick={action.action}
                    disabled={action.disabled}
                    className={`h-auto p-6 bg-gradient-to-r ${action.color} hover:opacity-90 transition-all duration-200 w-full`}
                  >
                    <div className="text-center space-y-2">
                      <action.icon className="w-8 h-8 mx-auto" />
                      <div>
                        <h3 className="font-semibold text-sm">{action.title}</h3>
                        <p className="text-xs opacity-90">{action.description}</p>
                      </div>
                    </div>
                  </Button>
                </motion.div>
              ))}
            </CardContent>
          </Card>
        </motion.div>

        {/* Recomendaciones Inteligentes */}
        {recommendations && recommendations.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6 }}
          >
            <Card className="bg-white/10 backdrop-blur-md border-white/20">
              <CardHeader>
                <CardTitle className="text-white flex items-center gap-2">
                  <Brain className="w-5 h-5" />
                  Recomendaciones Personalizadas
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                {recommendations.map((rec: string, index: number) => (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.1 * index }}
                    className="flex items-center gap-3 p-3 bg-white/5 rounded-lg"
                  >
                    <div className="w-2 h-2 bg-yellow-400 rounded-full" />
                    <p className="text-white/90 text-sm">{rec}</p>
                  </motion.div>
                ))}
              </CardContent>
            </Card>
          </motion.div>
        )}

        {/* Áreas de Mejora */}
        {metrics?.weakAreas && metrics.weakAreas.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.8 }}
          >
            <Card className="bg-white/10 backdrop-blur-md border-white/20">
              <CardHeader>
                <CardTitle className="text-white flex items-center gap-2">
                  <Target className="w-5 h-5" />
                  Áreas de Oportunidad
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  {metrics.weakAreas.map((area: string, index: number) => (
                    <motion.div
                      key={area}
                      initial={{ opacity: 0, scale: 0.9 }}
                      animate={{ opacity: 1, scale: 1 }}
                      transition={{ delay: 0.1 * index }}
                      className="p-4 bg-orange-500/20 border border-orange-500/30 rounded-lg"
                    >
                      <h4 className="text-white font-semibold mb-2">{area}</h4>
                      <Button
                        size="sm"
                        onClick={() => navigateToLectoGuia(area.toLowerCase())}
                        className="bg-orange-500 hover:bg-orange-600 text-white"
                      >
                        Practicar
                      </Button>
                    </motion.div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </motion.div>
        )}

      </div>
    </div>
  );
};
