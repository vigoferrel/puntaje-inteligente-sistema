
import React from 'react';
import { motion } from 'framer-motion';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Brain, Zap, Target, TrendingUp, Clock, Award, PlayCircle, BarChart3, Activity } from 'lucide-react';
import { useIntersectional } from '@/contexts/IntersectionalProvider';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';

export default function Evaluacion() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const {
    isIntersectionalReady,
    neuralHealth,
    generateIntersectionalInsights,
    adaptToUser
  } = useIntersectional();

  // Métricas neurológicas de validación en tiempo real
  const validationMetrics = React.useMemo(() => ({
    currentLevel: Math.round(neuralHealth.neural_efficiency),
    targetScore: 700,
    readinessIndex: Math.round(neuralHealth.user_experience_harmony),
    cognitiveLoad: Math.round(neuralHealth.adaptive_learning_score),
    validationStreak: Math.floor(neuralHealth.cross_pollination_rate / 15),
    nextValidation: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toLocaleDateString()
  }), [neuralHealth]);

  const neuralInsights = generateIntersectionalInsights();

  const handleStartValidation = (type: string) => {
    adaptToUser({
      validation_type: type,
      readiness_level: validationMetrics.readinessIndex,
      neural_confidence: neuralHealth.neural_efficiency
    });
    navigate('/diagnostico');
  };

  const validationTypes = [
    {
      id: 'neural_diagnostic',
      title: 'Diagnóstico Neural',
      description: 'Evaluación adaptativa completa de habilidades cognitivas',
      icon: Brain,
      color: 'from-purple-500 to-blue-500',
      difficulty: 'Adaptativo',
      duration: '45-60 min',
      neuralActivity: neuralHealth.neural_efficiency
    },
    {
      id: 'cognitive_validation',
      title: 'Validación Cognitiva',
      description: 'Análisis específico de patrones de pensamiento',
      icon: Zap,
      color: 'from-yellow-500 to-orange-500',
      difficulty: 'Focalizado',
      duration: '30-45 min',
      neuralActivity: neuralHealth.adaptive_learning_score
    },
    {
      id: 'strategic_assessment',
      title: 'Evaluación Estratégica',
      description: 'Medición de eficiencia en resolución de problemas',
      icon: Target,
      color: 'from-green-500 to-teal-500',
      difficulty: 'Avanzado',
      duration: '60-90 min',
      neuralActivity: neuralHealth.cross_pollination_rate
    }
  ];

  if (!isIntersectionalReady) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-indigo-900 flex items-center justify-center">
        <motion.div
          className="text-center text-white space-y-4"
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
        >
          <div className="w-16 h-16 border-4 border-blue-400 border-t-transparent rounded-full mx-auto animate-spin" />
          <div className="text-xl font-bold">Activando Red Neural de Validación</div>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-indigo-900 text-white">
      <div className="container mx-auto py-8 px-4">
        {/* Header Neural de Validación */}
        <motion.div 
          className="text-center mb-8"
          initial={{ opacity: 0, y: -30 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <div className="flex items-center justify-center space-x-3 mb-4">
            <Activity className="w-10 h-10 text-blue-400" />
            <h1 className="text-3xl font-bold bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
              Centro Neural de Validación
            </h1>
          </div>
          <p className="text-blue-200 text-lg">
            Sistema Inteligente de Evaluación Cognitiva • {user?.email || 'Usuario'}
          </p>
          <Badge className="mt-2 bg-green-600 text-white">
            Red Neural: {validationMetrics.currentLevel}% Activa
          </Badge>
        </motion.div>

        {/* Métricas de Estado Neural */}
        <motion.div 
          className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
        >
          {[
            { label: 'Nivel Actual', value: validationMetrics.currentLevel, icon: Brain, color: 'text-blue-400' },
            { label: 'Meta PAES', value: validationMetrics.targetScore, icon: Target, color: 'text-green-400' },
            { label: 'Preparación', value: `${validationMetrics.readinessIndex}%`, icon: TrendingUp, color: 'text-purple-400' },
            { label: 'Racha Neural', value: validationMetrics.validationStreak, icon: Award, color: 'text-yellow-400' }
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

        {/* Tipos de Validación Neural */}
        <motion.div 
          className="grid md:grid-cols-3 gap-6 mb-8"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
        >
          {validationTypes.map((validation, index) => {
            const Icon = validation.icon;
            return (
              <Card key={validation.id} className="bg-white/10 border-white/20 backdrop-blur-sm hover:bg-white/15 transition-all cursor-pointer group">
                <CardContent className="p-6">
                  <div className="flex items-start justify-between mb-4">
                    <div className={`p-3 rounded-lg bg-gradient-to-r ${validation.color} group-hover:scale-110 transition-transform`}>
                      <Icon className="w-6 h-6 text-white" />
                    </div>
                    <div className="text-right">
                      <div className="text-sm text-white/60">Actividad Neural</div>
                      <div className="text-lg font-bold text-white">{Math.round(validation.neuralActivity)}%</div>
                    </div>
                  </div>
                  
                  <h3 className="text-xl font-bold text-white mb-2">{validation.title}</h3>
                  <p className="text-white/70 text-sm mb-4">{validation.description}</p>
                  
                  <div className="space-y-2 mb-4">
                    <div className="flex justify-between text-sm">
                      <span className="text-white/60">Dificultad:</span>
                      <span className="text-white">{validation.difficulty}</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-white/60">Duración:</span>
                      <span className="text-white">{validation.duration}</span>
                    </div>
                  </div>
                  
                  <Button 
                    onClick={() => handleStartValidation(validation.id)}
                    className="w-full bg-white/10 hover:bg-white/20 text-white border-white/20"
                  >
                    <PlayCircle className="w-4 h-4 mr-2" />
                    Iniciar Validación
                  </Button>
                </CardContent>
              </Card>
            );
          })}
        </motion.div>

        {/* Insights Neurológicos */}
        <motion.div 
          className="grid md:grid-cols-2 gap-6"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
        >
          <Card className="bg-white/10 border-white/20 backdrop-blur-sm">
            <CardHeader>
              <CardTitle className="text-white flex items-center gap-2">
                <Brain className="w-5 h-5 text-purple-400" />
                Análisis Neural en Tiempo Real
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {neuralInsights.slice(0, 3).map((insight, index) => (
                  <div key={index} className="bg-white/5 rounded-lg p-3">
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-purple-200 font-medium">{insight.title}</span>
                      <Badge className={
                        insight.level === 'excellent' ? "bg-green-600" :
                        insight.level === 'good' ? "bg-blue-600" : "bg-orange-600"
                      }>
                        {insight.level === 'excellent' ? 'Óptimo' :
                         insight.level === 'good' ? 'Bien' : 'Mejorando'}
                      </Badge>
                    </div>
                    <div className="text-sm text-white/70">
                      {insight.description}
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          <Card className="bg-white/10 border-white/20 backdrop-blur-sm">
            <CardHeader>
              <CardTitle className="text-white flex items-center gap-2">
                <BarChart3 className="w-5 h-5 text-blue-400" />
                Estado de Preparación
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div>
                  <div className="flex justify-between mb-2">
                    <span className="text-white/70">Preparación General</span>
                    <span className="text-white font-bold">{validationMetrics.readinessIndex}%</span>
                  </div>
                  <Progress value={validationMetrics.readinessIndex} className="h-2" />
                </div>
                
                <div>
                  <div className="flex justify-between mb-2">
                    <span className="text-white/70">Carga Cognitiva</span>
                    <span className="text-white font-bold">{validationMetrics.cognitiveLoad}%</span>
                  </div>
                  <Progress value={validationMetrics.cognitiveLoad} className="h-2" />
                </div>

                <div className="pt-4 border-t border-white/10">
                  <div className="flex items-center gap-2 mb-2">
                    <Clock className="w-4 h-4 text-yellow-400" />
                    <span className="text-white/70">Próxima Validación Recomendada</span>
                  </div>
                  <div className="text-white font-medium">{validationMetrics.nextValidation}</div>
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </div>
  );
}
