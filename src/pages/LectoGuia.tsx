
import React from 'react';
import { motion } from 'framer-motion';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Brain, BookOpen, Target, Zap, Eye, MessageSquare, TrendingUp, Clock, Award, AlertCircle } from 'lucide-react';
import { useIntersectional } from '@/contexts/IntersectionalProvider';
import { useAuth } from '@/contexts/AuthContext';
import { useRealLectoGuiaData } from '@/hooks/useRealLectoGuiaData';

export default function LectoGuia() {
  const { user } = useAuth();
  const {
    isIntersectionalReady,
    generateIntersectionalInsights,
    adaptToUser
  } = useIntersectional();

  // Hook para datos reales en lugar de mock data
  const { metrics: realMetrics, isLoading: metricsLoading } = useRealLectoGuiaData();

  const handleReadingAction = (actionType: string, context?: any) => {
    adaptToUser({
      reading_action: actionType,
      comprehension_level: realMetrics?.readingComprehension || 0,
      vocabulary_strength: realMetrics?.vocabularyLevel || 0,
      neural_context: 'lectoguia_optimization'
    });
    console.log(`📖 Acción de lectura neural: ${actionType}`, context);
  };

  const insights = generateIntersectionalInsights();

  if (!isIntersectionalReady || metricsLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-indigo-900 flex items-center justify-center">
        <motion.div
          className="text-center text-white space-y-4"
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
        >
          <div className="w-16 h-16 border-4 border-purple-400 border-t-transparent rounded-full mx-auto animate-spin" />
          <div className="text-xl font-bold">Activando LectoGuía Neural</div>
          <div className="text-sm text-purple-200">Cargando datos reales de comprensión lectora...</div>
        </motion.div>
      </div>
    );
  }

  if (!realMetrics) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-indigo-900 flex items-center justify-center">
        <div className="text-center text-white space-y-4">
          <AlertCircle className="w-16 h-16 mx-auto text-red-400" />
          <div className="text-xl font-bold">Error al cargar datos de LectoGuía</div>
          <div className="text-sm text-purple-200">No se pudieron obtener los datos reales de comprensión lectora</div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-indigo-900 text-white">
      <div className="container mx-auto py-8 px-4">
        {/* Header Neural de LectoGuía */}
        <motion.div 
          className="text-center mb-8"
          initial={{ opacity: 0, y: -30 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <div className="flex items-center justify-center space-x-3 mb-4">
            <BookOpen className="w-10 h-10 text-purple-400" />
            <h1 className="text-3xl font-bold bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">
              LectoGuía Neural Adaptativa
            </h1>
          </div>
          <p className="text-purple-200 text-lg">
            Sistema de Comprensión Lectora Inteligente • {user?.email || 'Usuario'}
          </p>
          <Badge className="mt-2 bg-purple-600 text-white">
            Comprensión Neural: {realMetrics.readingComprehension}% Activo
          </Badge>
        </motion.div>

        {/* Métricas de Comprensión - DATOS REALES */}
        <motion.div 
          className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
        >
          {[
            { label: 'Comprensión', value: `${realMetrics.readingComprehension}%`, icon: Brain, color: 'text-purple-400' },
            { label: 'Vocabulario', value: `${realMetrics.vocabularyLevel}%`, icon: BookOpen, color: 'text-blue-400' },
            { label: 'Análisis', value: `${realMetrics.textAnalysisSkill}%`, icon: Eye, color: 'text-green-400' },
            { label: 'Pensamiento Crítico', value: `${realMetrics.criticalThinking}%`, icon: Target, color: 'text-yellow-400' },
            { label: 'Textos Procesados', value: realMetrics.totalTextsProcessed, icon: MessageSquare, color: 'text-pink-400' },
            { label: 'Tiempo Promedio', value: `${realMetrics.averageReadingTime}min`, icon: Clock, color: 'text-orange-400' },
            { label: 'Precisión', value: `${realMetrics.comprehensionAccuracy}%`, icon: Award, color: 'text-red-400' },
            { label: 'Estrategias', value: realMetrics.strategiesLearned, icon: Zap, color: 'text-indigo-400' }
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

        {/* Panel Principal de Estrategias y Textos */}
        <motion.div 
          className="grid lg:grid-cols-2 gap-6 mb-8"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
        >
          {/* Estrategias Activas - Datos Reales */}
          <Card className="bg-white/10 border-white/20 backdrop-blur-sm">
            <CardHeader>
              <CardTitle className="text-white flex items-center gap-2">
                <Zap className="w-5 h-5 text-yellow-400" />
                Estrategias Neurales Activas
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {realMetrics.activeStrategies.map((strategy, index) => (
                  <div key={index} className="bg-white/5 rounded-lg p-4">
                    <div className="flex justify-between items-center mb-2">
                      <h3 className="font-medium text-white">{strategy.name}</h3>
                      <Badge className={
                        strategy.effectiveness >= 80 ? "bg-green-600" :
                        strategy.effectiveness >= 60 ? "bg-blue-600" : "bg-orange-600"
                      }>
                        {strategy.effectiveness}% Efectiva
                      </Badge>
                    </div>
                    <p className="text-sm text-white/70 mb-3">{strategy.description}</p>
                    <div className="flex justify-between text-sm">
                      <span className="text-white/60">Usos:</span>
                      <span className="text-white">{strategy.timesUsed}</span>
                    </div>
                    <Progress value={strategy.effectiveness} className="h-2 mt-2" />
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Textos Recientes - Datos Reales */}
          <Card className="bg-white/10 border-white/20 backdrop-blur-sm">
            <CardHeader>
              <CardTitle className="text-white flex items-center gap-2">
                <BookOpen className="w-5 h-5 text-purple-400" />
                Textos Procesados Recientemente
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {realMetrics.recentTexts.length > 0 ? realMetrics.recentTexts.map((text, index) => (
                  <div key={index} className="bg-white/5 rounded-lg p-3">
                    <div className="flex justify-between items-center mb-2">
                      <span className="font-medium text-white">{text.title}</span>
                      <Badge className={
                        text.difficulty === 'advanced' ? "bg-red-600" :
                        text.difficulty === 'intermediate' ? "bg-yellow-600" : "bg-green-600"
                      }>
                        {text.difficulty === 'advanced' ? 'Avanzado' :
                         text.difficulty === 'intermediate' ? 'Intermedio' : 'Básico'}
                      </Badge>
                    </div>
                    <div className="grid grid-cols-3 gap-2 text-sm">
                      <div>
                        <span className="text-white/60">Score:</span>
                        <div className="text-white font-medium">{text.comprehensionScore}%</div>
                      </div>
                      <div>
                        <span className="text-white/60">Tiempo:</span>
                        <div className="text-white font-medium">{Math.round(text.timeSpent / 60)}min</div>
                      </div>
                      <div>
                        <span className="text-white/60">Fecha:</span>
                        <div className="text-white font-medium">{text.date}</div>
                      </div>
                    </div>
                  </div>
                )) : (
                  <div className="text-center text-white/60 py-8">
                    <BookOpen className="w-12 h-12 mx-auto mb-4 opacity-50" />
                    <p>No hay textos procesados aún</p>
                    <p className="text-sm">Comienza tu práctica de lectura</p>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Panel de Control y Análisis Neural */}
        <motion.div 
          className="grid lg:grid-cols-3 gap-6"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
        >
          {/* Control Neural de Lectura */}
          <Card className="bg-white/10 border-white/20 backdrop-blur-sm">
            <CardHeader>
              <CardTitle className="text-white flex items-center gap-2">
                <Brain className="w-5 h-5 text-purple-400" />
                Control Neural de Lectura
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <Button 
                  onClick={() => handleReadingAction('start_adaptive_reading')}
                  className="w-full bg-purple-600 hover:bg-purple-700 justify-start"
                >
                  <BookOpen className="w-4 h-4 mr-2" />
                  Lectura Adaptativa
                </Button>
                
                <Button 
                  onClick={() => handleReadingAction('strategy_training')}
                  className="w-full bg-blue-600 hover:bg-blue-700 justify-start"
                >
                  <Target className="w-4 h-4 mr-2" />
                  Entrenamiento Estratégico
                </Button>
                
                <Button 
                  onClick={() => handleReadingAction('vocabulary_expansion')}
                  className="w-full bg-green-600 hover:bg-green-700 justify-start"
                >
                  <Zap className="w-4 h-4 mr-2" />
                  Expansión Vocabulario
                </Button>
                
                <Button 
                  onClick={() => handleReadingAction('critical_analysis')}
                  className="w-full bg-yellow-600 hover:bg-yellow-700 justify-start"
                >
                  <Eye className="w-4 h-4 mr-2" />
                  Análisis Crítico
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* Análisis Neural de Comprensión */}
          <Card className="bg-white/10 border-white/20 backdrop-blur-sm">
            <CardHeader>
              <CardTitle className="text-white flex items-center gap-2">
                <TrendingUp className="w-5 h-5 text-green-400" />
                Análisis Neural
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {insights.slice(0, 4).map((insight, index) => (
                  <div key={index} className="bg-white/5 rounded-lg p-3">
                    <div className="flex items-center justify-between mb-1">
                      <span className="text-purple-200 font-medium text-sm">{insight.title}</span>
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

          {/* Progreso Neurológico */}
          <Card className="bg-white/10 border-white/20 backdrop-blur-sm">
            <CardHeader>
              <CardTitle className="text-white flex items-center gap-2">
                <Award className="w-5 h-5 text-yellow-400" />
                Progreso Neurológico
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span className="text-white/80">Desarrollo Cognitivo</span>
                    <span className="text-white font-medium">{realMetrics.readingComprehension}%</span>
                  </div>
                  <Progress value={realMetrics.readingComprehension} className="h-2" />
                </div>
                
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span className="text-white/80">Dominio Vocabulario</span>
                    <span className="text-white font-medium">{realMetrics.vocabularyLevel}%</span>
                  </div>
                  <Progress value={realMetrics.vocabularyLevel} className="h-2" />
                </div>
                
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span className="text-white/80">Análisis Textual</span>
                    <span className="text-white font-medium">{realMetrics.textAnalysisSkill}%</span>
                  </div>
                  <Progress value={realMetrics.textAnalysisSkill} className="h-2" />
                </div>
                
                <div className="pt-3 border-t border-white/10">
                  <div className="text-xs text-white/60 mb-2">Próxima sesión recomendada:</div>
                  <div className="text-sm text-white font-medium">
                    {new Date(Date.now() + 2 * 24 * 60 * 60 * 1000).toLocaleDateString()}
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
