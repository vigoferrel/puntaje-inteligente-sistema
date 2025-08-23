/* eslint-disable react-refresh/only-export-components */
import React, { useState, useEffect } from 'react';
import type { SafeString, SafeNumber, SafeBoolean, APIResponse, OperationResult } from '../types/core';
import { motion, AnimatePresence } from 'framer-motion';
import { Card, CardContent, CardHeader, CardTitle } from '../../../components/ui/card';
import { Button } from '../../../components/ui/button';
import { Badge } from '../../../components/ui/badge';
import { Progress } from '../../../components/ui/progress';
import { 
  MessageCircle, Brain, TrendingUp, Lightbulb, Target,
  Heart, Zap, Award, BookOpen, Clock, Star,
  CheckCircle, AlertTriangle, Info, Sparkles
} from 'lucide-react';

interface FeedbackMessage {
  id: string;
  type: 'encouragement' | 'strategy' | 'warning' | 'celebration' | 'insight';
  title: string;
  message: string;
  priority: 'low' | 'medium' | 'high' | 'urgent';
  timestamp: Date;
  actionable: boolean;
  actions?: string[];
  context: string;
  emotion: 'positive' | 'neutral' | 'motivational' | 'concerned';
}

interface LearningPattern {
  pattern: string;
  description: string;
  frequency: number;
  impact: 'positive' | 'negative' | 'neutral';
  suggestion: string;
}

interface PersonalizedFeedbackProps {
  userProgress: unknown;
  recentActivities: unknown[];
}

export const PersonalizedFeedback: React.FC<PersonalizedFeedbackProps> = ({
  userProgress,
  recentActivities
}) => {
  const [activeTab, setActiveTab] = useState<'feed' | 'patterns' | 'coaching'>('feed');
  const [feedbackMessages, setFeedbackMessages] = useState<FeedbackMessage[]>([]);
  const [isGeneratingFeedback, setIsGeneratingFeedback] = useState(false);

  const [learningPatterns] = useState<LearningPattern[]>([
    {
      pattern: 'MÃ¡ximo rendimiento matutino',
      description: 'Tu mejor rendimiento ocurre entre 8:00-11:00 AM',
      frequency: 0.87,
      impact: 'positive',
      suggestion: 'Programa ejercicios complejos en este horario'
    },
    {
      pattern: 'Mejora progresiva en matemÃ¡ticas',
      description: 'Aumento constante del 15% semanal en habilidades matemÃ¡ticas',
      frequency: 0.92,
      impact: 'positive',
      suggestion: 'MantÃ©n la estrategia actual, considera aumentar dificultad'
    },
    {
      pattern: 'Fatiga despuÃ©s de 45 minutos',
      description: 'DisminuciÃ³n de concentraciÃ³n despuÃ©s de sesiones largas',
      frequency: 0.73,
      impact: 'negative',
      suggestion: 'Implementa descansos cada 45 minutos con tÃ©cnica Pomodoro'
    },
    {
      pattern: 'Alta retenciÃ³n en comprensiÃ³n lectora',
      description: 'Excelente memoria a largo plazo para textos complejos',
      frequency: 0.89,
      impact: 'positive',
      suggestion: 'Aprovecha esta fortaleza para materias narrativas'
    }
  ]);

  const generateIntelligentFeedback = () => {
    setIsGeneratingFeedback(true);
    
    setTimeout(() => {
      const newFeedbacks: FeedbackMessage[] = [
        {
          id: '1',
          type: 'celebration',
          title: 'Â¡Racha increÃ­ble! ðŸŽ‰',
          message: 'Has mantenido una racha de estudio de 12 dÃ­as consecutivos. Tu constancia estÃ¡ dando frutos con una mejora del 23% en tu rendimiento general.',
          priority: 'high',
          timestamp: new Date(),
          actionable: true,
          actions: ['Compartir logro', 'Ver anÃ¡lisis detallado'],
          context: 'PatrÃ³n de constancia',
          emotion: 'positive'
        },
        {
          id: '2',
          type: 'strategy',
          title: 'OptimizaciÃ³n detectada ðŸ§ ',
          message: 'La IA ha identificado que tu rendimiento en matemÃ¡ticas mejora 34% cuando practicas despuÃ©s de ejercicios de comprensiÃ³n lectora. Te sugerimos esta secuencia.',
          priority: 'medium',
          timestamp: new Date(Date.now() - 1000 * 60 * 30),
          actionable: true,
          actions: ['Aplicar sugerencia', 'Ver detalles del patrÃ³n'],
          context: 'AnÃ¡lisis de secuencias de estudio',
          emotion: 'motivational'
        },
        {
          id: '3',
          type: 'insight',
          title: 'PatrÃ³n emocional identificado ðŸ’¡',
          message: 'Hemos notado que tu motivaciÃ³n aumenta significativamente cuando completas nodos de dificultad creciente. Tu cerebro responde mejor a desafÃ­os progresivos.',
          priority: 'medium',
          timestamp: new Date(Date.now() - 1000 * 60 * 60),
          actionable: true,
          actions: ['Ajustar plan de estudio', 'Ver investigaciÃ³n'],
          context: 'AnÃ¡lisis psicolÃ³gico',
          emotion: 'neutral'
        },
        {
          id: '4',
          type: 'warning',
          title: 'AtenciÃ³n: Sobrecarga detectada âš ï¸',
          message: 'Tus Ãºltimas 3 sesiones han mostrado signos de fatiga mental. Considera tomar un descanso de 15 minutos o cambiar a actividades mÃ¡s ligeras.',
          priority: 'high',
          timestamp: new Date(Date.now() - 1000 * 60 * 90),
          actionable: true,
          actions: ['Tomar descanso', 'Actividad relajante', 'Ajustar intensidad'],
          context: 'Monitoreo de bienestar',
          emotion: 'concerned'
        },
        {
          id: '5',
          type: 'encouragement',
          title: 'Progreso excepcional â­',
          message: 'Tu mejora en ciencias durante la Ãºltima semana (18% de aumento) te coloca en el top 5% de estudiantes con tu perfil. Â¡Sigue asÃ­!',
          priority: 'medium',
          timestamp: new Date(Date.now() - 1000 * 60 * 60 * 2),
          actionable: false,
          context: 'ComparaciÃ³n con pares',
          emotion: 'positive'
        }
      ];
      
      setFeedbackMessages(newFeedbacks);
      setIsGeneratingFeedback(false);
    }, 2000);
  };

  // eslint-disable-next-line react-hooks/exhaustive-depsuseEffect(() => {
    generateIntelligentFeedback();
  }, []);useEffect(() => {
    generateIntelligentFeedback();
  }, []);

  const getFeedbackIcon = (type: string) => {
    switch (type) {
      case 'celebration': return Award;
      case 'strategy': return Lightbulb;
      case 'warning': return AlertTriangle;
      case 'insight': return Brain;
      case 'encouragement': return Heart;
      default: return Info;
    }
  };

  const getFeedbackColor = (type: string, emotion: string) => {
    if (type === 'celebration') return 'from-yellow-500 to-orange-500';
    if (type === 'warning') return 'from-red-500 to-red-600';
    if (emotion === 'positive') return 'from-green-500 to-green-600';
    if (emotion === 'motivational') return 'from-blue-500 to-purple-500';
    if (emotion === 'concerned') return 'from-orange-500 to-red-500';
    return 'from-gray-500 to-gray-600';
  };

  const renderFeedbackFeed = () => (
    <div className="space-y-6">
      {/* AI Status */}
      <Card className="bg-gradient-to-r from-blue-900/60 to-purple-900/60 backdrop-blur-xl border-blue-500/30">
        <CardContent className="p-6">
          <div className="flex items-center gap-4">
            <motion.div
              className="w-12 h-12 rounded-full bg-gradient-to-r from-blue-400 to-purple-400 flex items-center justify-center"
              animate={{ scale: [1, 1.1, 1] }}
              transition={{ duration: 2, repeat: Infinity }}
            >
              <Brain className="w-6 h-6 text-white" />
            </motion.div>
            <div className="flex-1">
              <h3 className="text-xl font-bold text-white">Coach Neural Inteligente</h3>
              <p className="text-blue-200">
                {isGeneratingFeedback ? 'Analizando patrones de aprendizaje...' : 'Sistema activo â€¢ 5 insights nuevos generados'}
              </p>
            </div>
            <Button
              onClick={generateIntelligentFeedback}
              disabled={isGeneratingFeedback}
              className="bg-gradient-to-r from-blue-600 to-purple-600"
            >
              {isGeneratingFeedback ? 'Analizando...' : 'Actualizar Feedback'}
            </Button>
          </div>
          
          {isGeneratingFeedback && (
            <div className="mt-4">
              <Progress value={75} className="h-2" />
              <div className="text-sm text-blue-200 mt-2">
                Procesando: Patrones de comportamiento, rendimiento acadÃ©mico, estado emocional...
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Feedback Messages */}
      <div className="space-y-4">
        <AnimatePresence>
          {feedbackMessages.map((feedback, index) => {
            const IconComponent = getFeedbackIcon(feedback.type);
            return (
              <motion.div
                key={feedback.id}
                initial={{ opacity: 0, y: 20, scale: 0.95 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: -20, scale: 0.95 }}
                transition={{ delay: index * 0.1 }}
              >
                <Card className={`bg-gradient-to-r ${getFeedbackColor(feedback.type, feedback.emotion)} border-none relative overflow-hidden`}>
                  <CardContent className="p-6">
                    <div className="flex items-start gap-4">
                      <div className="p-3 bg-white/20 rounded-xl">
                        <IconComponent className="w-6 h-6 text-white" />
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center gap-3 mb-2">
                          <h3 className="font-bold text-white text-lg">{feedback.title}</h3>
                          <Badge className={`${
                            feedback.priority === 'urgent' ? 'bg-red-600' :
                            feedback.priority === 'high' ? 'bg-orange-600' :
                            feedback.priority === 'medium' ? 'bg-yellow-600' :
                            'bg-green-600'
                          } text-white text-xs`}>
                            {feedback.priority}
                          </Badge>
                        </div>
                        <p className="text-white/90 mb-4">{feedback.message}</p>
                        
                        <div className="flex items-center justify-between">
                          <div className="text-xs text-white/70">
                            {feedback.context} â€¢ {feedback.timestamp.toLocaleTimeString('es-CL', { 
                              hour: '2-digit', 
                              minute: '2-digit' 
                            })}
                          </div>
                          
                          {feedback.actionable && feedback.actions && (
                            <div className="flex gap-2">
                              {feedback.actions.map((action, idx) => (
                                <Button
                                  key={idx}
                                  size="sm"
                                  className="bg-white/20 hover:bg-white/30 text-white text-xs"
                                >
                                  {action}
                                </Button>
                              ))}
                            </div>
                          )}
                        </div>
                      </div>
                    </div>

                    {/* Animated background effect */}
                    <motion.div
                      className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full"
                      animate={{ 
                        scale: [1, 1.2, 1],
                        opacity: [0.3, 0.6, 0.3]
                      }}
                      transition={{ 
                        duration: 3, 
                        repeat: Infinity,
                        delay: index * 0.5
                      }}
                    />
                  </CardContent>
                </Card>
              </motion.div>
            );
          })}
        </AnimatePresence>
      </div>
    </div>
  );

  const renderPatterns = () => (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {learningPatterns.map((pattern, index) => (
          <motion.div
            key={pattern.pattern}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
          >
            <Card className={`bg-gradient-to-r ${
              pattern.impact === 'positive' ? 'from-green-900/60 to-emerald-900/60' :
              pattern.impact === 'negative' ? 'from-red-900/60 to-orange-900/60' :
              'from-gray-800/60 to-gray-900/60'
            } backdrop-blur-xl border-white/10`}>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle className="text-white text-lg">{pattern.pattern}</CardTitle>
                  <Badge className={`${
                    pattern.impact === 'positive' ? 'bg-green-600' :
                    pattern.impact === 'negative' ? 'bg-red-600' :
                    'bg-gray-600'
                  } text-white`}>
                    {Math.round(pattern.frequency * 100)}% frecuencia
                  </Badge>
                </div>
              </CardHeader>
              <CardContent>
                <p className="text-white/80 mb-4">{pattern.description}</p>
                
                <div className="mb-4">
                  <div className="flex justify-between text-sm mb-2">
                    <span className="text-white/70">Confianza del patrÃ³n</span>
                    <span className="text-white">{Math.round(pattern.frequency * 100)}%</span>
                  </div>
                  <Progress value={pattern.frequency * 100} className="h-2" />
                </div>

                <div className="bg-white/10 rounded-lg p-4">
                  <div className="flex items-start gap-3">
                    <Lightbulb className="w-5 h-5 text-yellow-400 mt-0.5" />
                    <div>
                      <h4 className="font-semibold text-white mb-1">Sugerencia IA:</h4>
                      <p className="text-white/80 text-sm">{pattern.suggestion}</p>
                    </div>
                  </div>
                </div>

                <Button className="w-full mt-4 bg-white/20 hover:bg-white/30 text-white">
                  Aplicar Sugerencia
                </Button>
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-900 via-purple-900 to-pink-900 p-6">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="mb-8"
      >
        <Card className="bg-gradient-to-r from-black/60 to-slate-900/60 backdrop-blur-xl border-blue-500/30">
          <CardHeader>
            <CardTitle className="text-white flex items-center gap-3">
              <motion.div
                animate={{ rotate: [0, 360] }}
                transition={{ duration: 5, repeat: Infinity, ease: "linear" }}
              >
                <MessageCircle className="w-8 h-8 text-blue-400" />
              </motion.div>
              FEEDBACK PERSONALIZADO IA
              <Badge className="bg-gradient-to-r from-blue-600 to-purple-600">
                Coach Inteligente
              </Badge>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex gap-3">
              <Button
                onClick={() => setActiveTab('feed')}
                className={activeTab === 'feed' 
                  ? 'bg-gradient-to-r from-blue-600 to-purple-600' 
                  : 'bg-gray-700 hover:bg-gray-600'
                }
              >
                <MessageCircle className="w-4 h-4 mr-2" />
                Feed Inteligente
              </Button>
              <Button
                onClick={() => setActiveTab('patterns')}
                className={activeTab === 'patterns' 
                  ? 'bg-gradient-to-r from-purple-600 to-pink-600' 
                  : 'bg-gray-700 hover:bg-gray-600'
                }
              >
                <TrendingUp className="w-4 h-4 mr-2" />
                Patrones
              </Button>
              <Button
                onClick={() => setActiveTab('coaching')}
                className={activeTab === 'coaching' 
                  ? 'bg-gradient-to-r from-green-600 to-emerald-600' 
                  : 'bg-gray-700 hover:bg-gray-600'
                }
              >
                <Brain className="w-4 h-4 mr-2" />
                Coach IA
              </Button>
            </div>
          </CardContent>
        </Card>
      </motion.div>

      {/* Content */}
      <motion.div
        key={activeTab}
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -20 }}
        transition={{ duration: 0.3 }}
      >
        {activeTab === 'feed' && renderFeedbackFeed()}
        {activeTab === 'patterns' && renderPatterns()}
        {activeTab === 'coaching' && (
          <Card className="bg-black/40 border-green-500/30 backdrop-blur-xl">
            <CardContent className="p-8 text-center">
              <Brain className="w-16 h-16 mx-auto text-green-400 mb-4" />
              <h3 className="text-2xl font-bold text-white mb-2">Coach IA Avanzado</h3>
              <p className="text-white/70 mb-4">PrÃ³ximamente: Sesiones de coaching personalizadas con IA</p>
              <Button className="bg-gradient-to-r from-green-600 to-emerald-600">
                Notificarme cuando estÃ© listo
              </Button>
            </CardContent>
          </Card>
        )}
      </motion.div>
    </div>
  );
};


