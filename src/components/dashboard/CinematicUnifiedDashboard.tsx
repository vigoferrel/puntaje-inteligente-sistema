
import React from 'react';
import { motion } from 'framer-motion';
import { useCinematicDashboard } from '@/hooks/dashboard/useCinematicDashboard';
import { useCinematicTheme } from '@/contexts/CinematicThemeProvider';
import { useActions } from '@/store/globalStore';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { 
  Zap, 
  Target, 
  Brain, 
  TrendingUp, 
  Sparkles,
  Rocket,
  Shield,
  Trophy
} from 'lucide-react';

export const CinematicUnifiedDashboard: React.FC = () => {
  const dashboardData = useCinematicDashboard();
  const { enableCinematicMode } = useCinematicTheme();
  const actions = useActions();

  const stats = [
    {
      title: "Nodos Activos",
      value: dashboardData.stats.nodes,
      max: 277,
      icon: Brain,
      color: "from-blue-500 to-cyan-500",
      description: "Sistema de aprendizaje"
    },
    {
      title: "Plan Actual",
      value: dashboardData.stats.currentPlan,
      max: 1,
      icon: Target,
      color: "from-purple-500 to-pink-500",
      description: "Objetivo en progreso"
    },
    {
      title: "Diagnósticos",
      value: dashboardData.stats.diagnostics,
      max: 5,
      icon: Shield,
      color: "from-green-500 to-emerald-500",
      description: "Evaluaciones disponibles"
    },
    {
      title: "Planes Totales",
      value: dashboardData.stats.plans,
      max: 10,
      icon: Trophy,
      color: "from-yellow-500 to-orange-500",
      description: "Estrategias generadas"
    }
  ];

  if (!dashboardData.system.isInitialized) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-900 via-purple-900 to-gray-900 flex items-center justify-center">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="text-center space-y-6"
        >
          <div className="w-24 h-24 border-4 border-cyan-500 border-t-transparent rounded-full animate-spin mx-auto" />
          <div className="space-y-2">
            <h2 className="text-3xl font-bold text-white cinematic-glow-text">
              Inicializando Sistema Cinematográfico
            </h2>
            <p className="text-cyan-200">Cargando experiencia unificada...</p>
          </div>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen cinematic-particle-bg">
      {/* Header Cinematográfico */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="relative overflow-hidden"
      >
        <div className="absolute inset-0 bg-gradient-to-r from-cyan-500/10 via-purple-500/10 to-pink-500/10" />
        <div className="relative z-10 container mx-auto px-6 py-8">
          <div className="flex items-center justify-between">
            <div className="space-y-2">
              <h1 className="text-4xl font-bold text-white cinematic-glow-text">
                Centro de Comando PAES
              </h1>
              <p className="text-cyan-200">Sistema educativo cinematográfico unificado</p>
            </div>
            
            {!dashboardData.ui.cinematicMode && (
              <Button
                onClick={enableCinematicMode}
                className="cinematic-button"
              >
                <Sparkles className="w-4 h-4 mr-2" />
                Activar Experiencia Completa
              </Button>
            )}
          </div>
        </div>
      </motion.div>

      {/* Stats Grid Holográfico */}
      <div className="container mx-auto px-6 py-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {stats.map((stat, index) => (
            <motion.div
              key={stat.title}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
            >
              <Card className="cinematic-card cinematic-hologram">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between mb-4">
                    <div className={`p-3 rounded-lg bg-gradient-to-r ${stat.color} bg-opacity-20`}>
                      <stat.icon className="h-6 w-6 text-white" />
                    </div>
                    <Badge variant="outline" className="text-cyan-400 border-cyan-400/30">
                      {Math.round((stat.value / stat.max) * 100)}%
                    </Badge>
                  </div>
                  
                  <div className="space-y-2">
                    <h3 className="text-sm font-medium text-gray-300">{stat.title}</h3>
                    <div className="text-3xl font-bold text-white cinematic-glow-text">
                      {stat.value}
                      <span className="text-lg text-gray-400">/{stat.max}</span>
                    </div>
                    <p className="text-xs text-gray-400">{stat.description}</p>
                  </div>
                  
                  {/* Barra de progreso holográfica */}
                  <div className="mt-4 w-full bg-gray-800 rounded-full h-2">
                    <motion.div
                      className={`h-2 rounded-full bg-gradient-to-r ${stat.color}`}
                      initial={{ width: 0 }}
                      animate={{ width: `${(stat.value / stat.max) * 100}%` }}
                      transition={{ duration: 1, delay: index * 0.2 }}
                      style={{
                        boxShadow: '0 0 10px rgba(34, 211, 238, 0.5)'
                      }}
                    />
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>

        {/* Módulos de Acceso Rápido */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Centro Financiero */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.3 }}
          >
            <Card className="cinematic-card">
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <Zap className="h-5 w-5 text-yellow-400" />
                  <span className="text-white">Centro Financiero</span>
                  <Badge variant="destructive">PAES 2025</Badge>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-300 mb-4">
                  Gestión inteligente de becas y beneficios estudiantiles
                </p>
                <Button className="w-full cinematic-button">
                  <Rocket className="w-4 h-4 mr-2" />
                  Acceder
                </Button>
              </CardContent>
            </Card>
          </motion.div>

          {/* LectoGuía */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.4 }}
          >
            <Card className="cinematic-card">
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <Brain className="h-5 w-5 text-cyan-400" />
                  <span className="text-white">LectoGuía IA</span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-300 mb-4">
                  Asistente inteligente para aprendizaje personalizado
                </p>
                <Button className="w-full cinematic-button">
                  <Sparkles className="w-4 h-4 mr-2" />
                  Continuar Estudio
                </Button>
              </CardContent>
            </Card>
          </motion.div>

          {/* Diagnósticos */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.5 }}
          >
            <Card className="cinematic-card">
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <TrendingUp className="h-5 w-5 text-green-400" />
                  <span className="text-white">Análisis Predictivo</span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-300 mb-4">
                  Evaluación inteligente y predicción de resultados
                </p>
                <Button className="w-full cinematic-button">
                  <Shield className="w-4 h-4 mr-2" />
                  Evaluar Progreso
                </Button>
              </CardContent>
            </Card>
          </motion.div>
        </div>
      </div>
    </div>
  );
};
