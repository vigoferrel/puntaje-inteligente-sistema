
import React from 'react';
import { motion } from 'framer-motion';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Brain, Target, TrendingUp, BarChart3, Calendar, Play, CheckCircle, AlertCircle, Clock } from 'lucide-react';
import { useIntersectional } from '@/contexts/IntersectionalProvider';
import { useAuth } from '@/contexts/AuthContext';
import { useRealEvaluationData } from '@/hooks/useRealEvaluationData';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

export default function Evaluacion() {
  const { user } = useAuth();
  const {
    isIntersectionalReady,
    generateIntersectionalInsights,
    adaptToUser
  } = useIntersectional();

  // Hook para datos reales en lugar de mock data
  const { metrics: realMetrics, isLoading: metricsLoading } = useRealEvaluationData();

  const handleEvaluationAction = (actionType: string, context?: any) => {
    adaptToUser({
      evaluation_action: actionType,
      performance_level: realMetrics?.averagePerformance || 0,
      completed_evaluations: realMetrics?.completedEvaluations || 0,
      neural_context: 'evaluation_optimization'
    });
    console.log(`📊 Acción de evaluación neural: ${actionType}`, context);
  };

  const insights = generateIntersectionalInsights();

  if (!isIntersectionalReady || metricsLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-orange-900 to-red-900 flex items-center justify-center">
        <motion.div
          className="text-center text-white space-y-4"
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
        >
          <div className="w-16 h-16 border-4 border-orange-400 border-t-transparent rounded-full mx-auto animate-spin" />
          <div className="text-xl font-bold">Activando Sistema de Evaluación Neural</div>
          <div className="text-sm text-orange-200">Cargando datos reales de evaluación...</div>
        </motion.div>
      </div>
    );
  }

  if (!realMetrics) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-orange-900 to-red-900 flex items-center justify-center">
        <div className="text-center text-white space-y-4">
          <AlertCircle className="w-16 h-16 mx-auto text-red-400" />
          <div className="text-xl font-bold">Error al cargar datos de evaluación</div>
          <div className="text-sm text-orange-200">No se pudieron obtener los datos reales de evaluación</div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-orange-900 to-red-900 text-white">
      <div className="container mx-auto py-8 px-4">
        {/* Header Neural de Evaluación */}
        <motion.div 
          className="text-center mb-8"
          initial={{ opacity: 0, y: -30 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <div className="flex items-center justify-center space-x-3 mb-4">
            <BarChart3 className="w-10 h-10 text-orange-400" />
            <h1 className="text-3xl font-bold bg-gradient-to-r from-orange-400 to-red-400 bg-clip-text text-transparent">
              Sistema de Evaluación Neural
            </h1>
          </div>
          <p className="text-orange-200 text-lg">
            Análisis de Rendimiento Inteligente • {user?.email || 'Usuario'}
          </p>
          <Badge className="mt-2 bg-orange-600 text-white">
            Rendimiento Neural: {realMetrics.averagePerformance}% Activo
          </Badge>
        </motion.div>

        {/* Métricas de Evaluación - DATOS REALES */}
        <motion.div 
          className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
        >
          {[
            { label: 'Evaluaciones', value: realMetrics.totalEvaluations, icon: Target, color: 'text-orange-400' },
            { label: 'Completadas', value: realMetrics.completedEvaluations, icon: CheckCircle, color: 'text-green-400' },
            { label: 'Rendimiento', value: `${realMetrics.averagePerformance}%`, icon: TrendingUp, color: 'text-blue-400' },
            { label: 'Próxima', value: realMetrics.nextRecommendedEvaluation ? 'Programada' : 'Pendiente', icon: Calendar, color: 'text-purple-400' }
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

        {/* Panel Principal de Análisis */}
        <motion.div 
          className="grid lg:grid-cols-2 gap-6 mb-8"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
        >
          {/* Tendencias de Rendimiento - Datos Reales */}
          <Card className="bg-white/10 border-white/20 backdrop-blur-sm">
            <CardHeader>
              <CardTitle className="text-white flex items-center gap-2">
                <TrendingUp className="w-5 h-5 text-green-400" />
                Tendencias de Rendimiento Neural
              </CardTitle>
            </CardHeader>
            <CardContent>
              {realMetrics.evaluationTrends.length > 0 ? (
                <ResponsiveContainer width="100%" height={250}>
                  <LineChart data={realMetrics.evaluationTrends}>
                    <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.1)" />
                    <XAxis dataKey="date" stroke="rgba(255,255,255,0.6)" />
                    <YAxis stroke="rgba(255,255,255,0.6)" />
                    <Tooltip 
                      contentStyle={{ 
                        backgroundColor: 'rgba(0,0,0,0.8)', 
                        border: '1px solid rgba(255,255,255,0.2)',
                        borderRadius: '8px'
                      }} 
                    />
                    <Line type="monotone" dataKey="performance" stroke="#f97316" strokeWidth={2} name="Rendimiento" />
                  </LineChart>
                </ResponsiveContainer>
              ) : (
                <div className="text-center text-white/60 py-16">
                  <BarChart3 className="w-12 h-12 mx-auto mb-4 opacity-50" />
                  <p>No hay datos de tendencias aún</p>
                  <p className="text-sm">Completa más evaluaciones para ver el progreso</p>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Análisis por Materias - Datos Reales */}
          <Card className="bg-white/10 border-white/20 backdrop-blur-sm">
            <CardHeader>
              <CardTitle className="text-white flex items-center gap-2">
                <Brain className="w-5 h-5 text-purple-400" />
                Análisis Neural por Materias
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="mb-4">
                  <h4 className="text-sm font-medium text-green-400 mb-2">Materias Más Fuertes</h4>
                  {realMetrics.strongestSubjects.length > 0 ? realMetrics.strongestSubjects.map((subject, index) => (
                    <div key={index} className="flex justify-between items-center mb-2">
                      <span className="text-white/80 text-sm">{subject.subject}</span>
                      <div className="flex items-center gap-2">
                        <Progress value={subject.score} className="w-20 h-2" />
                        <span className="text-green-400 text-sm font-medium">{subject.score}%</span>
                      </div>
                    </div>
                  )) : (
                    <p className="text-white/60 text-sm">No hay datos suficientes</p>
                  )}
                </div>
                
                <div>
                  <h4 className="text-sm font-medium text-orange-400 mb-2">Áreas de Mejora</h4>
                  {realMetrics.weakestSubjects.length > 0 ? realMetrics.weakestSubjects.map((subject, index) => (
                    <div key={index} className="flex justify-between items-center mb-2">
                      <span className="text-white/80 text-sm">{subject.subject}</span>
                      <div className="flex items-center gap-2">
                        <Progress value={subject.score} className="w-20 h-2" />
                        <span className="text-orange-400 text-sm font-medium">{subject.score}%</span>
                      </div>
                    </div>
                  )) : (
                    <p className="text-white/60 text-sm">No hay datos suficientes</p>
                  )}
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Panel de Control y Evaluaciones Recientes */}
        <motion.div 
          className="grid lg:grid-cols-3 gap-6"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
        >
          {/* Control de Evaluaciones */}
          <Card className="bg-white/10 border-white/20 backdrop-blur-sm">
            <CardHeader>
              <CardTitle className="text-white flex items-center gap-2">
                <Play className="w-5 h-5 text-orange-400" />
                Control Neural de Evaluación
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <Button 
                  onClick={() => handleEvaluationAction('start_diagnostic')}
                  className="w-full bg-orange-600 hover:bg-orange-700 justify-start"
                >
                  <Target className="w-4 h-4 mr-2" />
                  Diagnóstico Neural
                </Button>
                
                <Button 
                  onClick={() => handleEvaluationAction('quick_assessment')}
                  className="w-full bg-blue-600 hover:bg-blue-700 justify-start"
                >
                  <Clock className="w-4 h-4 mr-2" />
                  Evaluación Rápida
                </Button>
                
                <Button 
                  onClick={() => handleEvaluationAction('comprehensive_test')}
                  className="w-full bg-purple-600 hover:bg-purple-700 justify-start"
                >
                  <BarChart3 className="w-4 h-4 mr-2" />
                  Test Comprensivo
                </Button>
                
                <div className="pt-3 border-t border-white/10">
                  <div className="text-xs text-white/60 mb-2">Próxima evaluación:</div>
                  <div className="text-sm text-white font-medium">
                    {realMetrics.nextRecommendedEvaluation || 'Por programar'}
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Evaluaciones Recientes - Datos Reales */}
          <Card className="bg-white/10 border-white/20 backdrop-blur-sm">
            <CardHeader>
              <CardTitle className="text-white flex items-center gap-2">
                <Calendar className="w-5 h-5 text-blue-400" />
                Evaluaciones Recientes
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {realMetrics.recentEvaluations.length > 0 ? realMetrics.recentEvaluations.map((evaluation, index) => (
                  <div key={index} className="bg-white/5 rounded-lg p-3">
                    <div className="flex justify-between items-center mb-2">
                      <span className="font-medium text-white text-sm">{evaluation.name}</span>
                      <Badge className={
                        evaluation.score >= 80 ? "bg-green-600" :
                        evaluation.score >= 60 ? "bg-blue-600" : "bg-orange-600"
                      }>
                        {evaluation.score}%
                      </Badge>
                    </div>
                    <div className="grid grid-cols-2 gap-2 text-xs">
                      <div>
                        <span className="text-white/60">Tipo:</span>
                        <div className="text-white">{evaluation.type}</div>
                      </div>
                      <div>
                        <span className="text-white/60">Fecha:</span>
                        <div className="text-white">{evaluation.date}</div>
                      </div>
                      <div>
                        <span className="text-white/60">Duración:</span>
                        <div className="text-white">{evaluation.duration}min</div>
                      </div>
                    </div>
                  </div>
                )) : (
                  <div className="text-center text-white/60 py-8">
                    <Calendar className="w-12 h-12 mx-auto mb-4 opacity-50" />
                    <p>No hay evaluaciones recientes</p>
                    <p className="text-sm">Inicia tu primera evaluación</p>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>

          {/* Insights Neural */}
          <Card className="bg-white/10 border-white/20 backdrop-blur-sm">
            <CardHeader>
              <CardTitle className="text-white flex items-center gap-2">
                <Brain className="w-5 h-5 text-purple-400" />
                Insights Neurales
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {insights.slice(0, 4).map((insight, index) => (
                  <div key={index} className="bg-white/5 rounded-lg p-3">
                    <div className="flex items-center justify-between mb-1">
                      <span className="text-orange-200 font-medium text-sm">{insight.title}</span>
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
        </motion.div>
      </div>
    </div>
  );
}
