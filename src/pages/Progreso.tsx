
import React from 'react';
import { motion } from 'framer-motion';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Brain, TrendingUp, BarChart3, Activity, Zap, Target, Calendar, Award, AlertCircle } from 'lucide-react';
import { useIntersectional } from '@/contexts/IntersectionalProvider';
import { useAuth } from '@/contexts/AuthContext';
import { useRealProgressData } from '@/hooks/useRealProgressData';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, Radar } from 'recharts';

export default function Progreso() {
  const { user } = useAuth();
  const {
    isIntersectionalReady,
    generateIntersectionalInsights,
    adaptToUser
  } = useIntersectional();

  // Hook para datos reales en lugar de cálculos mock
  const { metrics: realMetrics, isLoading: metricsLoading } = useRealProgressData();

  // Datos simulados para gráficos basados en métricas reales
  const progressData = React.useMemo(() => {
    if (!realMetrics) return [];
    
    const baseProgress = realMetrics.overallProgress;
    return Array.from({ length: 7 }, (_, i) => ({
      day: ['Lun', 'Mar', 'Mié', 'Jue', 'Vie', 'Sáb', 'Dom'][i],
      progreso: Math.max(0, Math.min(100, baseProgress + (Math.random() - 0.5) * 10)),
      velocidad: Math.max(0, Math.min(100, realMetrics.learningVelocity + (Math.random() - 0.5) * 8)),
      retencion: Math.max(0, Math.min(100, realMetrics.retentionRate + (Math.random() - 0.5) * 5))
    }));
  }, [realMetrics]);

  const subjectRadarData = React.useMemo(() => {
    if (!realMetrics) return [];
    
    return [
      { subject: 'Lectura', actual: realMetrics.subjectProgress['COMPETENCIA_LECTORA'] || 0, objetivo: 85 },
      { subject: 'Matemática', actual: realMetrics.subjectProgress['MATEMATICA_1'] || 0, objetivo: 80 },
      { subject: 'Ciencias', actual: realMetrics.subjectProgress['CIENCIAS'] || 0, objetivo: 75 },
      { subject: 'Historia', actual: realMetrics.subjectProgress['HISTORIA_CIENCIAS_SOCIALES'] || 0, objetivo: 90 },
      { subject: 'Análisis', actual: realMetrics.subjectProgress['MATEMATICA_2'] || 0, objetivo: 85 }
    ];
  }, [realMetrics]);

  const handleAnalysisAction = (actionType: string) => {
    adaptToUser({
      analysis_action: actionType,
      current_metrics: realMetrics,
      neural_state: 'analysis_mode'
    });
    console.log(`📊 Acción de análisis: ${actionType}`);
  };

  const insights = generateIntersectionalInsights();

  if (!isIntersectionalReady || metricsLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-indigo-900 to-purple-900 flex items-center justify-center">
        <motion.div
          className="text-center text-white space-y-4"
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
        >
          <div className="w-16 h-16 border-4 border-indigo-400 border-t-transparent rounded-full mx-auto animate-spin" />
          <div className="text-xl font-bold">Activando Análisis Neural</div>
          <div className="text-sm text-indigo-200">Cargando datos reales del progreso...</div>
        </motion.div>
      </div>
    );
  }

  if (!realMetrics) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-indigo-900 to-purple-900 flex items-center justify-center">
        <div className="text-center text-white space-y-4">
          <AlertCircle className="w-16 h-16 mx-auto text-red-400" />
          <div className="text-xl font-bold">Error al cargar datos</div>
          <div className="text-sm text-indigo-200">No se pudieron obtener los datos reales del progreso</div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-indigo-900 to-purple-900 text-white">
      <div className="container mx-auto py-8 px-4">
        {/* Header Análisis Cognitivo */}
        <motion.div 
          className="text-center mb-8"
          initial={{ opacity: 0, y: -30 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <div className="flex items-center justify-center space-x-3 mb-4">
            <BarChart3 className="w-10 h-10 text-indigo-400" />
            <h1 className="text-3xl font-bold bg-gradient-to-r from-indigo-400 to-purple-400 bg-clip-text text-transparent">
              Análisis Cognitivo Neural
            </h1>
          </div>
          <p className="text-indigo-200 text-lg">
            Métricas de Rendimiento en Tiempo Real • {user?.email || 'Usuario'}
          </p>
          <Badge className="mt-2 bg-indigo-600 text-white">
            Progreso Neural: {realMetrics.overallProgress}% Activo
          </Badge>
        </motion.div>

        {/* Métricas Principales - DATOS REALES */}
        <motion.div 
          className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
        >
          {[
            { label: 'Progreso General', value: `${realMetrics.overallProgress}%`, icon: TrendingUp, color: 'text-green-400' },
            { label: 'Velocidad', value: `${realMetrics.learningVelocity}%`, icon: Zap, color: 'text-yellow-400' },
            { label: 'Retención', value: `${realMetrics.retentionRate}%`, icon: Target, color: 'text-blue-400' },
            { label: 'Carga Cognitiva', value: `${realMetrics.cognitiveLoad}%`, icon: Brain, color: 'text-purple-400' },
            { label: 'Crecimiento Semanal', value: `+${realMetrics.weeklyGrowth}%`, icon: Activity, color: 'text-pink-400' },
            { label: 'Sesiones Totales', value: realMetrics.totalSessions, icon: Calendar, color: 'text-orange-400' },
            { label: 'Racha de Días', value: realMetrics.streakDays, icon: Award, color: 'text-red-400' }
          ].map((metric, index) => (
            <Card key={metric.label} className="bg-white/10 border-white/20 backdrop-blur-sm">
              <CardContent className="p-4 text-center">
                <metric.icon className={`w-6 h-6 mx-auto mb-2 ${metric.color}`} />
                <div className="text-xl font-bold text-white">{metric.value}</div>
                <div className="text-xs text-white/70">{metric.label}</div>
              </CardContent>
            </Card>
          ))}
        </motion.div>

        {/* Gráficos de Progreso */}
        <motion.div 
          className="grid lg:grid-cols-2 gap-6 mb-8"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
        >
          {/* Tendencias Semanales */}
          <Card className="bg-white/10 border-white/20 backdrop-blur-sm">
            <CardHeader>
              <CardTitle className="text-white flex items-center gap-2">
                <TrendingUp className="w-5 h-5 text-green-400" />
                Tendencias Neurales Semanales
              </CardTitle>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={250}>
                <LineChart data={progressData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.1)" />
                  <XAxis dataKey="day" stroke="rgba(255,255,255,0.6)" />
                  <YAxis stroke="rgba(255,255,255,0.6)" />
                  <Tooltip 
                    contentStyle={{ 
                      backgroundColor: 'rgba(0,0,0,0.8)', 
                      border: '1px solid rgba(255,255,255,0.2)',
                      borderRadius: '8px'
                    }} 
                  />
                  <Line type="monotone" dataKey="progreso" stroke="#10b981" strokeWidth={2} name="Progreso" />
                  <Line type="monotone" dataKey="velocidad" stroke="#f59e0b" strokeWidth={2} name="Velocidad" />
                  <Line type="monotone" dataKey="retencion" stroke="#3b82f6" strokeWidth={2} name="Retención" />
                </LineChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>

          {/* Radar de Materias */}
          <Card className="bg-white/10 border-white/20 backdrop-blur-sm">
            <CardHeader>
              <CardTitle className="text-white flex items-center gap-2">
                <Target className="w-5 h-5 text-purple-400" />
                Rendimiento por Materia
              </CardTitle>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={250}>
                <RadarChart data={subjectRadarData}>
                  <PolarGrid stroke="rgba(255,255,255,0.2)" />
                  <PolarAngleAxis dataKey="subject" tick={{ fill: 'rgba(255,255,255,0.8)', fontSize: 12 }} />
                  <PolarRadiusAxis angle={90} domain={[0, 100]} tick={{ fill: 'rgba(255,255,255,0.6)', fontSize: 10 }} />
                  <Radar name="Actual" dataKey="actual" stroke="#8b5cf6" fill="#8b5cf6" fillOpacity={0.3} strokeWidth={2} />
                  <Radar name="Objetivo" dataKey="objetivo" stroke="#06b6d4" fill="transparent" strokeWidth={2} strokeDasharray="5 5" />
                  <Tooltip 
                    contentStyle={{ 
                      backgroundColor: 'rgba(0,0,0,0.8)', 
                      border: '1px solid rgba(255,255,255,0.2)',
                      borderRadius: '8px'
                    }} 
                  />
                </RadarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </motion.div>

        {/* Análisis Detallado e Insights */}
        <motion.div 
          className="grid lg:grid-cols-3 gap-6"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
        >
          {/* Progreso por Habilidades - DATOS REALES */}
          <Card className="bg-white/10 border-white/20 backdrop-blur-sm">
            <CardHeader>
              <CardTitle className="text-white flex items-center gap-2">
                <Brain className="w-5 h-5 text-blue-400" />
                Desarrollo Cognitivo Real
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span className="text-white/80">Nodos Completados</span>
                    <span className="text-white font-medium">{realMetrics.completedNodes}/{realMetrics.totalNodes}</span>
                  </div>
                  <Progress value={(realMetrics.completedNodes / realMetrics.totalNodes) * 100} className="h-2" />
                </div>
                
                {Object.entries(realMetrics.subjectProgress).map(([subject, progress]) => (
                  <div key={subject} className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span className="text-white/80">{subject.replace('_', ' ')}</span>
                      <span className="text-white font-medium">{progress}%</span>
                    </div>
                    <Progress value={progress} className="h-2" />
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Insights Neural */}
          <Card className="bg-white/10 border-white/20 backdrop-blur-sm">
            <CardHeader>
              <CardTitle className="text-white flex items-center gap-2">
                <Zap className="w-5 h-5 text-yellow-400" />
                Insights Neurales
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {insights.slice(0, 4).map((insight, index) => (
                  <div key={index} className="bg-white/5 rounded-lg p-3">
                    <div className="flex items-center justify-between mb-1">
                      <span className="text-yellow-200 font-medium text-sm">{insight.title}</span>
                      <Badge className={
                        insight.level === 'excellent' ? "bg-green-600" :
                        insight.level === 'good' ? "bg-blue-600" : "bg-orange-600"
                      }>
                        {insight.level === 'excellent' ? 'Excelente' :
                         insight.level === 'good' ? 'Bien' : 'Mejorando'}
                      </Badge>
                    </div>
                    <div className="text-xs text-white/70">
                      {insight.description}
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Acciones de Optimización */}
          <Card className="bg-white/10 border-white/20 backdrop-blur-sm">
            <CardHeader>
              <CardTitle className="text-white flex items-center gap-2">
                <Activity className="w-5 h-5 text-green-400" />
                Optimización Neural
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <Button 
                  onClick={() => handleAnalysisAction('deep_analysis')}
                  className="w-full bg-purple-600 hover:bg-purple-700 justify-start"
                >
                  <Brain className="w-4 h-4 mr-2" />
                  Análisis Profundo
                </Button>
                
                <Button 
                  onClick={() => handleAnalysisAction('generate_report')}
                  className="w-full bg-blue-600 hover:bg-blue-700 justify-start"
                >
                  <BarChart3 className="w-4 h-4 mr-2" />
                  Generar Reporte
                </Button>
                
                <Button 
                  onClick={() => handleAnalysisAction('optimize_plan')}
                  className="w-full bg-green-600 hover:bg-green-700 justify-start"
                >
                  <Target className="w-4 h-4 mr-2" />
                  Optimizar Plan
                </Button>
                
                <div className="pt-3 border-t border-white/10">
                  <div className="text-xs text-white/60 mb-2">Próxima evaluación recomendada:</div>
                  <div className="text-sm text-white font-medium">
                    {new Date(Date.now() + 3 * 24 * 60 * 60 * 1000).toLocaleDateString()}
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </div>
  );
}
