
import React from 'react';
import { motion } from 'framer-motion';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Brain, BookOpen, Zap, Target, TrendingUp, MessageSquare, Play } from 'lucide-react';
import { useIntersectional } from '@/contexts/IntersectionalProvider';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';

const LectoGuia: React.FC = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const {
    isIntersectionalReady,
    neuralHealth,
    generateIntersectionalInsights,
    adaptToUser
  } = useIntersectional();

  // Métricas neurológicas de comprensión lectora
  const readingMetrics = React.useMemo(() => ({
    comprehensionLevel: Math.round(neuralHealth.adaptive_learning_score),
    readingSpeed: Math.round(neuralHealth.neural_efficiency),
    criticalThinking: Math.round(neuralHealth.cross_pollination_rate),
    textualAnalysis: Math.round(neuralHealth.user_experience_harmony),
    activeTexts: Math.floor(neuralHealth.adaptive_learning_score / 20),
    completedAnalyses: Math.floor(neuralHealth.neural_efficiency / 15)
  }), [neuralHealth]);

  const handleStartReading = (type: string) => {
    adaptToUser({
      reading_session_type: type,
      comprehension_level: readingMetrics.comprehensionLevel,
      neural_readiness: neuralHealth.neural_efficiency
    });
    
    // Navegar al módulo específico según el tipo
    if (type === 'interactive_chat') {
      // Por ahora mantener en la misma página, más adelante implementar chat
      console.log('🤖 Iniciando chat interactivo de lectura');
    }
  };

  const readingModules = [
    {
      id: 'critical_analysis',
      title: 'Análisis Crítico Neural',
      description: 'Comprensión profunda de textos complejos con IA',
      icon: Brain,
      color: 'from-purple-500 to-blue-500',
      difficulty: 'Avanzado',
      neuralActivity: readingMetrics.criticalThinking
    },
    {
      id: 'speed_comprehension',
      title: 'Comprensión Acelerada',
      description: 'Técnicas neurológicas para lectura eficiente',
      icon: Zap,
      color: 'from-yellow-500 to-orange-500',
      difficulty: 'Intermedio',
      neuralActivity: readingMetrics.readingSpeed
    },
    {
      id: 'textual_synthesis',
      title: 'Síntesis Textual IA',
      description: 'Extracción inteligente de ideas principales',
      icon: Target,
      color: 'from-green-500 to-teal-500',
      difficulty: 'Básico',
      neuralActivity: readingMetrics.textualAnalysis
    },
    {
      id: 'interactive_chat',
      title: 'Chat Interactivo',
      description: 'Conversación inteligente sobre textos',
      icon: MessageSquare,
      color: 'from-pink-500 to-red-500',
      difficulty: 'Adaptativo',
      neuralActivity: readingMetrics.comprehensionLevel
    }
  ];

  const insights = generateIntersectionalInsights();

  if (!isIntersectionalReady) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-blue-900 flex items-center justify-center">
        <motion.div
          className="text-center text-white space-y-4"
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
        >
          <div className="w-16 h-16 border-4 border-purple-400 border-t-transparent rounded-full mx-auto animate-spin" />
          <div className="text-xl font-bold">Activando LectoGuía Neural</div>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-blue-900 text-white">
      <div className="container mx-auto py-8 px-4">
        {/* Header LectoGuía Neural */}
        <motion.div 
          className="text-center mb-8"
          initial={{ opacity: 0, y: -30 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <div className="flex items-center justify-center space-x-3 mb-4">
            <BookOpen className="w-10 h-10 text-purple-400" />
            <h1 className="text-3xl font-bold bg-gradient-to-r from-purple-400 to-blue-400 bg-clip-text text-transparent">
              LectoGuía Neural IA
            </h1>
          </div>
          <p className="text-purple-200 text-lg">
            Sistema Inteligente de Comprensión Lectora • {user?.email || 'Usuario'}
          </p>
          <Badge className="mt-2 bg-purple-600 text-white">
            Comprensión Neural: {readingMetrics.comprehensionLevel}% Activa
          </Badge>
        </motion.div>

        {/* Métricas de Lectura Neural */}
        <motion.div 
          className="grid grid-cols-2 md:grid-cols-3 gap-4 mb-8"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
        >
          {[
            { label: 'Comprensión', value: `${readingMetrics.comprehensionLevel}%`, icon: Brain, color: 'text-purple-400' },
            { label: 'Velocidad', value: `${readingMetrics.readingSpeed}%`, icon: Zap, color: 'text-yellow-400' },
            { label: 'Análisis Crítico', value: `${readingMetrics.criticalThinking}%`, icon: Target, color: 'text-green-400' },
            { label: 'Textos Activos', value: readingMetrics.activeTexts, icon: BookOpen, color: 'text-blue-400' },
            { label: 'Análisis Completados', value: readingMetrics.completedAnalyses, icon: TrendingUp, color: 'text-pink-400' }
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

        {/* Módulos de Lectura Neural */}
        <motion.div 
          className="grid md:grid-cols-2 gap-6 mb-8"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
        >
          {readingModules.map((module, index) => {
            const Icon = module.icon;
            return (
              <Card key={module.id} className="bg-white/10 border-white/20 backdrop-blur-sm hover:bg-white/15 transition-all cursor-pointer group">
                <CardContent className="p-6">
                  <div className="flex items-start justify-between mb-4">
                    <div className={`p-3 rounded-lg bg-gradient-to-r ${module.color} group-hover:scale-110 transition-transform`}>
                      <Icon className="w-6 h-6 text-white" />
                    </div>
                    <div className="text-right">
                      <div className="text-sm text-white/60">Actividad Neural</div>
                      <div className="text-lg font-bold text-white">{Math.round(module.neuralActivity)}%</div>
                    </div>
                  </div>
                  
                  <h3 className="text-xl font-bold text-white mb-2">{module.title}</h3>
                  <p className="text-white/70 text-sm mb-4">{module.description}</p>
                  
                  <div className="flex justify-between items-center mb-4">
                    <Badge variant="outline" className="text-white border-white/30">
                      {module.difficulty}
                    </Badge>
                    <span className="text-sm text-white/60">
                      Neural: {Math.round(module.neuralActivity)}%
                    </span>
                  </div>
                  
                  <Button 
                    onClick={() => handleStartReading(module.id)}
                    className="w-full bg-white/10 hover:bg-white/20 text-white border-white/20"
                  >
                    <Play className="w-4 h-4 mr-2" />
                    Iniciar Módulo
                  </Button>
                </CardContent>
              </Card>
            );
          })}
        </motion.div>

        {/* Insights de Comprensión Neural */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
        >
          <Card className="bg-white/10 border-white/20 backdrop-blur-sm">
            <CardHeader>
              <CardTitle className="text-white flex items-center gap-2">
                <Brain className="w-5 h-5 text-purple-400" />
                Análisis Neural de Lectura
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid md:grid-cols-3 gap-4">
                {insights.slice(0, 3).map((insight, index) => (
                  <div key={index} className="bg-white/5 rounded-lg p-4">
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-purple-200 font-medium text-sm">{insight.title}</span>
                      <Badge className={
                        insight.level === 'excellent' ? "bg-green-600" :
                        insight.level === 'good' ? "bg-blue-600" : "bg-orange-600"
                      } size="sm">
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
};

export default LectoGuia;
