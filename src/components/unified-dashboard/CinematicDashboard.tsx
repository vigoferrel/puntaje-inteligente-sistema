
import React, { useMemo, useCallback, useState } from 'react';
import { motion } from 'framer-motion';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { 
  Brain, 
  Target, 
  Calendar, 
  TrendingUp,
  Sparkles,
  Zap,
  BookOpen,
  Award,
  Clock,
  ChevronRight,
  Calculator,
  BarChart3,
  CheckCircle
} from 'lucide-react';
import { useLectoGuiaSimplified } from '@/hooks/lectoguia/useLectoGuiaSimplified';
import { useUnifiedState } from '@/hooks/useUnifiedState';

interface CinematicDashboardProps {
  onNavigateToTool: (tool: string, context?: any) => void;
}

export const CinematicDashboard: React.FC<CinematicDashboardProps> = ({ 
  onNavigateToTool 
}) => {
  const { systemMetrics, userProgress } = useUnifiedState();
  const { getStats } = useLectoGuiaSimplified();
  const [activeSection, setActiveSection] = useState<'overview' | 'tools' | 'progress'>('overview');
  
  const lectoguiaStats = getStats();

  // Métricas cinematográficas del sistema
  const cinematicMetrics = useMemo(() => [
    {
      title: 'LectoGuía IA',
      value: `${lectoguiaStats.totalMessages}`,
      icon: Brain,
      color: 'from-purple-400 to-blue-500',
      description: 'Consultas IA realizadas',
      trend: 'Sistema 100% operativo',
      status: 'active'
    },
    {
      title: 'Ejercicios IA',
      value: `${lectoguiaStats.exercisesCompleted}`,
      icon: Target,
      color: 'from-green-400 to-emerald-500',
      description: 'Generados con IA',
      trend: `+${Math.floor(lectoguiaStats.exercisesCompleted * 0.3)} esta semana`,
      status: 'active'
    },
    {
      title: 'Centro Financiero',
      value: 'FUAS 2024',
      icon: Calculator,
      color: 'from-orange-400 to-red-500',
      description: 'Calculadora activa',
      trend: 'Becas actualizadas',
      status: 'active'
    },
    {
      title: 'Tiempo de Estudio',
      value: `${systemMetrics.todayStudyTime}m`,
      icon: Clock,
      color: 'from-cyan-400 to-blue-500',
      description: 'Sesión actual',
      trend: 'Objetivo: 90min',
      status: userProgress.streak > 0 ? 'active' : 'pending'
    }
  ], [systemMetrics, lectoguiaStats, userProgress]);

  // Herramientas del ecosistema
  const ecosystemTools = useMemo(() => [
    {
      title: 'LectoGuía IA',
      description: 'Chat inteligente especializado en cada materia PAES',
      icon: Brain,
      color: 'from-purple-500 to-blue-600',
      action: () => onNavigateToTool('lectoguia'),
      badge: 'IA Activa',
      status: 'operational',
      features: ['Chat especializado', 'Ejercicios IA', 'Análisis textual']
    },
    {
      title: 'Centro Financiero',
      description: 'Calculadora FUAS, becas y simulación financiera',
      icon: Calculator,
      color: 'from-green-500 to-emerald-600',
      action: () => onNavigateToTool('financial'),
      badge: 'FUAS 2024',
      status: 'operational',
      features: ['Calculadora FUAS', 'Base becas', 'Simulación ROI']
    },
    {
      title: 'Diagnóstico Inteligente',
      description: 'Evaluación adaptativa con IA de competencias',
      icon: BarChart3,
      color: 'from-blue-500 to-cyan-600',
      action: () => onNavigateToTool('diagnostic'),
      badge: 'Próximamente',
      status: 'development',
      features: ['Evaluación adaptativa', 'Análisis IA', 'Reportes detallados']
    },
    {
      title: 'Planificación IA',
      description: 'Planes de estudio personalizados con IA',
      icon: Calendar,
      color: 'from-indigo-500 to-purple-600',
      action: () => onNavigateToTool('planning'),
      badge: 'Próximamente',
      status: 'development',
      features: ['Planes IA', 'Calendario adaptativo', 'Seguimiento automático']
    }
  ], [onNavigateToTool]);

  // Acciones rápidas
  const quickActions = useMemo(() => [
    {
      title: 'Consultar LectoGuía',
      description: 'Pregunta sobre cualquier materia PAES',
      icon: Brain,
      action: () => onNavigateToTool('lectoguia'),
      color: 'bg-purple-500'
    },
    {
      title: 'Calcular FUAS',
      description: 'Simula tu financiamiento universitario',
      icon: Calculator,
      action: () => onNavigateToTool('financial'),
      color: 'bg-green-500'
    },
    {
      title: 'Generar Ejercicio',
      description: 'Crea ejercicios IA personalizados',
      icon: Zap,
      action: () => onNavigateToTool('lectoguia', { tab: 'exercise' }),
      color: 'bg-blue-500'
    },
    {
      title: 'Ver Progreso',
      description: 'Analiza tu evolución académica',
      icon: TrendingUp,
      action: () => setActiveSection('progress'),
      color: 'bg-orange-500'
    }
  ], [onNavigateToTool]);

  const handleQuickAction = useCallback((action: () => void) => {
    action();
  }, []);

  return (
    <div className="space-y-8 p-6 font-poppins">
      {/* Header Cinematográfico */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center space-y-4"
      >
        <div className="relative">
          <h1 className="text-4xl font-bold cinematic-gradient-text poppins-heading">
            PAES Pro Ecosystem
          </h1>
          <motion.div
            animate={{ rotate: 360 }}
            transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
            className="absolute -top-2 -right-8 text-cyan-400"
          >
            <Sparkles className="w-6 h-6" />
          </motion.div>
        </div>
        <p className="text-lg text-white/80 poppins-body">
          Ecosistema educativo integral con IA, financiamiento y planificación inteligente
        </p>
      </motion.div>

      {/* Navegación de secciones */}
      <div className="flex justify-center gap-4 mb-8">
        {[
          { id: 'overview', label: 'Resumen', icon: Target },
          { id: 'tools', label: 'Herramientas', icon: Sparkles },
          { id: 'progress', label: 'Progreso', icon: TrendingUp }
        ].map(section => {
          const Icon = section.icon;
          return (
            <Button
              key={section.id}
              variant={activeSection === section.id ? "default" : "outline"}
              onClick={() => setActiveSection(section.id as any)}
              className="gap-2"
            >
              <Icon className="w-4 h-4" />
              {section.label}
            </Button>
          );
        })}
      </div>

      {activeSection === 'overview' && (
        <>
          {/* Métricas del Ecosistema */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {cinematicMetrics.map((metric, index) => {
              const Icon = metric.icon;
              return (
                <motion.div
                  key={metric.title}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                  whileHover={{ scale: 1.05 }}
                  className="group"
                >
                  <Card className="cinematic-card h-full hover:shadow-2xl transition-all duration-300">
                    <CardContent className="p-6">
                      <div className="flex items-center justify-between mb-4">
                        <div className={`p-3 rounded-full bg-gradient-to-r ${metric.color} relative`}>
                          <Icon className="w-6 h-6 text-white" />
                          {metric.status === 'active' && (
                            <div className="absolute -top-1 -right-1 w-3 h-3 bg-green-400 rounded-full animate-pulse" />
                          )}
                        </div>
                        <Badge className="bg-white/10 text-white border-white/20">
                          {metric.trend}
                        </Badge>
                      </div>
                      
                      <h3 className="text-white/80 text-sm font-medium poppins-body mb-2">
                        {metric.title}
                      </h3>
                      <p className="text-3xl font-bold text-white cinematic-text-glow poppins-title mb-1">
                        {metric.value}
                      </p>
                      <p className="text-white/60 text-xs poppins-caption">
                        {metric.description}
                      </p>
                    </CardContent>
                  </Card>
                </motion.div>
              );
            })}
          </div>

          {/* Acciones Rápidas */}
          <Card className="cinematic-card">
            <CardHeader>
              <CardTitle className="text-white flex items-center gap-3 poppins-title">
                <Zap className="w-6 h-6 text-yellow-400" />
                Acciones Rápidas del Ecosistema
              </CardTitle>
            </CardHeader>
            <CardContent className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              {quickActions.map((action, index) => {
                const Icon = action.icon;
                return (
                  <motion.div
                    key={action.title}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.2 + index * 0.1 }}
                    whileHover={{ scale: 1.02 }}
                    className="group cursor-pointer"
                    onClick={() => handleQuickAction(action.action)}
                  >
                    <div className="cinematic-glass rounded-xl p-4 space-y-3 hover:bg-white/10 transition-all duration-300">
                      <div className={`p-3 rounded-full ${action.color} mx-auto w-fit`}>
                        <Icon className="w-6 h-6 text-white" />
                      </div>
                      
                      <div className="text-center space-y-1">
                        <h4 className="font-semibold text-white text-sm poppins-subtitle">
                          {action.title}
                        </h4>
                        <p className="text-white/70 text-xs poppins-caption">
                          {action.description}
                        </p>
                      </div>
                    </div>
                  </motion.div>
                );
              })}
            </CardContent>
          </Card>
        </>
      )}

      {activeSection === 'tools' && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {ecosystemTools.map((tool, index) => {
            const Icon = tool.icon;
            return (
              <motion.div
                key={tool.title}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                whileHover={{ scale: 1.02 }}
                className="group cursor-pointer"
                onClick={() => handleQuickAction(tool.action)}
              >
                <Card className="cinematic-card h-full hover:shadow-2xl transition-all duration-300">
                  <CardContent className="p-6">
                    <div className="flex items-start justify-between mb-4">
                      <div className={`p-3 rounded-full bg-gradient-to-r ${tool.color} relative`}>
                        <Icon className="w-8 h-8 text-white" />
                        {tool.status === 'operational' && (
                          <div className="absolute -top-1 -right-1 w-3 h-3 bg-green-400 rounded-full animate-pulse" />
                        )}
                      </div>
                      <Badge className={
                        tool.status === 'operational' 
                          ? "bg-green-500/20 text-green-400 border-green-500/30"
                          : "bg-orange-500/20 text-orange-400 border-orange-500/30"
                      }>
                        {tool.badge}
                      </Badge>
                    </div>
                    
                    <div className="space-y-3">
                      <h3 className="font-semibold text-white text-xl poppins-subtitle">
                        {tool.title}
                      </h3>
                      <p className="text-white/70 text-sm poppins-body">
                        {tool.description}
                      </p>
                      
                      <div className="space-y-2">
                        <p className="text-xs text-white/50 font-medium">Características:</p>
                        {tool.features.map((feature, idx) => (
                          <div key={idx} className="flex items-center gap-2 text-xs text-white/60">
                            <CheckCircle className="w-3 h-3 text-green-400" />
                            {feature}
                          </div>
                        ))}
                      </div>
                      
                      <div className="flex items-center justify-between pt-3">
                        <span className="text-white/60 text-sm poppins-caption">
                          {tool.status === 'operational' ? 'Disponible ahora' : 'En desarrollo'}
                        </span>
                        <ChevronRight className="w-5 h-5 text-cyan-400 group-hover:translate-x-1 transition-transform" />
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            );
          })}
        </div>
      )}

      {activeSection === 'progress' && (
        <Card className="cinematic-card">
          <CardHeader>
            <CardTitle className="text-white flex items-center gap-3 poppins-title">
              <TrendingUp className="w-6 h-6 text-green-400" />
              Progreso del Ecosistema PAES
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            {[
              { subject: 'LectoGuía IA', progress: 85, color: 'bg-purple-500' },
              { subject: 'Centro Financiero', progress: 75, color: 'bg-green-500' },
              { subject: 'Sistema Diagnóstico', progress: 40, color: 'bg-blue-500' },
              { subject: 'Planificación IA', progress: 25, color: 'bg-orange-500' }
            ].map((item, index) => (
              <div key={item.subject} className="space-y-3">
                <div className="flex justify-between items-center">
                  <span className="text-white font-medium poppins-subtitle">{item.subject}</span>
                  <span className="text-cyan-400 font-bold">{item.progress}%</span>
                </div>
                <div className="relative">
                  <Progress 
                    value={item.progress} 
                    className="h-3 bg-white/10"
                  />
                  <div 
                    className={`absolute top-0 left-0 h-3 ${item.color} rounded-full transition-all duration-1000`}
                    style={{ width: `${item.progress}%` }}
                  />
                </div>
              </div>
            ))}
          </CardContent>
        </Card>
      )}

      {/* Recomendaciones IA */}
      <Card className="cinematic-card">
        <CardHeader>
          <CardTitle className="text-white flex items-center gap-3 poppins-title">
            <Brain className="w-6 h-6 text-purple-400" />
            Recomendaciones del Ecosistema IA
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {[
            {
              title: 'Usar LectoGuía IA',
              description: 'El sistema de chat IA está completamente operativo. Haz consultas específicas por materia.',
              action: 'Abrir LectoGuía',
              color: 'bg-purple-500/20 border-purple-500/30',
              tool: 'lectoguia'
            },
            {
              title: 'Calcular Financiamiento',
              description: 'Usa la calculadora FUAS 2024 actualizada con la base de becas real.',
              action: 'Calcular FUAS',
              color: 'bg-green-500/20 border-green-500/30',
              tool: 'financial'
            },
            {
              title: 'Generar Ejercicios IA',
              description: 'El generador de ejercicios con IA está activo para todas las materias PAES.',
              action: 'Generar Ejercicio',
              color: 'bg-blue-500/20 border-blue-500/30',
              tool: 'lectoguia'
            }
          ].map((recommendation, index) => (
            <motion.div
              key={recommendation.title}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 + index * 0.1 }}
              className={`p-4 rounded-xl border ${recommendation.color}`}
            >
              <div className="flex items-center justify-between">
                <div className="space-y-1">
                  <h4 className="font-medium text-white poppins-subtitle">
                    {recommendation.title}
                  </h4>
                  <p className="text-white/70 text-sm poppins-body">
                    {recommendation.description}
                  </p>
                </div>
                <Button 
                  className="cinematic-button" 
                  size="sm"
                  onClick={() => onNavigateToTool(recommendation.tool)}
                >
                  {recommendation.action}
                </Button>
              </div>
            </motion.div>
          ))}
        </CardContent>
      </Card>
    </div>
  );
};
