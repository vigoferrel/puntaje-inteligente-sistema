
import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { 
  Brain, 
  MessageCircle, 
  X, 
  Send, 
  Lightbulb,
  Target,
  TrendingUp,
  Zap
} from 'lucide-react';

interface IntelligentAssistantProps {
  onAskQuestion: (question: string) => void;
  systemMetrics: any;
  weakestArea: any;
  onClose: () => void;
}

export const IntelligentAssistant: React.FC<IntelligentAssistantProps> = ({
  onAskQuestion,
  systemMetrics,
  weakestArea,
  onClose
}) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const [message, setMessage] = useState('');
  const [chatHistory, setChatHistory] = useState<Array<{
    type: 'user' | 'assistant';
    content: string;
    timestamp: Date;
  }>>([]);
  const [isThinking, setIsThinking] = useState(false);

  // Mensajes de bienvenida e insights inteligentes
  useEffect(() => {
    const welcomeMessage = {
      type: 'assistant' as const,
      content: `¡Hola! Soy tu asistente de IA personalizado. He analizado tu rendimiento y veo que tienes un gran potencial. ${
        weakestArea ? `Noté que ${weakestArea.prueba} podría necesitar más atención. ¿Te gustaría que te ayude con eso?` : 'Estoy aquí para ayudarte a optimizar tu aprendizaje.'
      }`,
      timestamp: new Date()
    };
    
    setChatHistory([welcomeMessage]);
  }, [weakestArea]);

  const handleSendMessage = async () => {
    if (!message.trim()) return;

    const userMessage = {
      type: 'user' as const,
      content: message,
      timestamp: new Date()
    };

    setChatHistory(prev => [...prev, userMessage]);
    setIsThinking(true);
    
    try {
      await onAskQuestion(message);
      
      // Simular respuesta inteligente
      setTimeout(() => {
        const aiResponse = {
          type: 'assistant' as const,
          content: generateIntelligentResponse(message, systemMetrics),
          timestamp: new Date()
        };
        setChatHistory(prev => [...prev, aiResponse]);
        setIsThinking(false);
      }, 1500);
    } catch (error) {
      setIsThinking(false);
    }
    
    setMessage('');
  };

  const generateIntelligentResponse = (question: string, metrics: any): string => {
    const lowerQuestion = question.toLowerCase();
    
    if (lowerQuestion.includes('matemática') || lowerQuestion.includes('matematica')) {
      return `📐 Para matemáticas, te recomiendo enfocarte en la resolución de problemas paso a paso. Basándome en tu perfil, creo que te beneficiarías de ejercicios de álgebra básica primero.`;
    }
    
    if (lowerQuestion.includes('lectura') || lowerQuestion.includes('comprensión')) {
      return `📚 En comprensión lectora, veo que tienes potencial. Te sugiero practicar con textos de complejidad media y enfocarte en identificar ideas principales.`;
    }
    
    if (lowerQuestion.includes('tiempo') || lowerQuestion.includes('horario')) {
      return `⏰ Según tu progreso actual, te recomiendo estudiar 2-3 horas diarias, divididas en sesiones de 45 minutos con descansos de 15 minutos.`;
    }
    
    if (lowerQuestion.includes('ciencias')) {
      return `🔬 Para ciencias, es crucial entender los conceptos fundamentales antes de memorizar fórmulas. ¿Te gustaría que generemos ejercicios específicos de biología, física o química?`;
    }
    
    return `🤖 Entiendo tu pregunta. Basándome en tus datos de rendimiento actual (progreso: +${metrics?.overallProgress || 0}%), te sugiero enfocar tu estudio en áreas específicas. ¿Te gustaría que analicemos tu área más débil en detalle?`;
  };

  const quickActions = [
    {
      icon: Target,
      label: 'Análisis Personal',
      action: () => setMessage('¿Cuál es mi mayor área de oportunidad?')
    },
    {
      icon: TrendingUp,
      label: 'Plan de Mejora',
      action: () => setMessage('¿Cómo puedo mejorar mis puntajes?')
    },
    {
      icon: Zap,
      label: 'Ejercicios IA',
      action: () => setMessage('Genera ejercicios para mi área más débil')
    },
    {
      icon: Lightbulb,
      label: 'Estrategias',
      action: () => setMessage('Dame consejos de estudio personalizados')
    }
  ];

  return (
    <motion.div
      initial={{ scale: 0, x: 100, y: 100 }}
      animate={{ scale: 1, x: 0, y: 0 }}
      exit={{ scale: 0, x: 100, y: 100 }}
      className="fixed bottom-6 right-6 z-50"
    >
      <AnimatePresence>
        {!isExpanded ? (
          // Botón flotante compacto
          <motion.div
            key="compact"
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            exit={{ scale: 0 }}
            className="relative"
          >
            <Button
              onClick={() => setIsExpanded(true)}
              className="bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 rounded-full w-16 h-16 p-0 shadow-2xl border-2 border-purple-400 group"
            >
              <Brain className="w-8 h-8 animate-pulse group-hover:animate-spin" />
            </Button>
            
            {/* Indicador de nuevos insights */}
            <div className="absolute -top-2 -right-2 w-6 h-6 bg-red-500 rounded-full flex items-center justify-center">
              <span className="text-white text-xs font-bold">!</span>
            </div>
            
            {/* Pulso de actividad */}
            <div className="absolute inset-0 rounded-full bg-purple-400/20 animate-ping"></div>
          </motion.div>
        ) : (
          // Panel expandido
          <motion.div
            key="expanded"
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.8, opacity: 0 }}
            className="w-96 h-[500px]"
          >
            <Card className="h-full bg-gradient-to-br from-purple-900/90 to-blue-900/90 backdrop-blur-lg border-purple-400/50 shadow-2xl">
              <CardHeader className="pb-2">
                <div className="flex items-center justify-between">
                  <CardTitle className="text-white flex items-center">
                    <Brain className="w-5 h-5 mr-2 text-purple-400 animate-pulse" />
                    Asistente IA
                  </CardTitle>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={onClose}
                    className="text-white hover:bg-white/10"
                  >
                    <X className="w-4 h-4" />
                  </Button>
                </div>
                
                {/* Estado de actividad */}
                <div className="flex items-center space-x-2 text-xs">
                  <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
                  <span className="text-green-400">IA Activa • Analizando en tiempo real</span>
                </div>
              </CardHeader>

              <CardContent className="flex flex-col h-full p-4">
                
                {/* Acciones rápidas */}
                <div className="grid grid-cols-2 gap-2 mb-4">
                  {quickActions.map(({ icon: Icon, label, action }) => (
                    <Button
                      key={label}
                      variant="outline"
                      size="sm"
                      onClick={action}
                      className="border-purple-400/30 text-purple-200 hover:bg-purple-600/20 text-xs"
                    >
                      <Icon className="w-3 h-3 mr-1" />
                      {label}
                    </Button>
                  ))}
                </div>

                {/* Chat area */}
                <div className="flex-1 overflow-y-auto space-y-3 mb-4 scrollbar-none">
                  {chatHistory.map((msg, index) => (
                    <motion.div
                      key={index}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      className={`flex ${msg.type === 'user' ? 'justify-end' : 'justify-start'}`}
                    >
                      <div
                        className={`max-w-[80%] p-3 rounded-lg text-sm ${
                          msg.type === 'user'
                            ? 'bg-blue-600 text-white'
                            : 'bg-gray-800/80 text-gray-200 border border-purple-400/30'
                        }`}
                      >
                        {msg.content}
                      </div>
                    </motion.div>
                  ))}

                  {/* Indicador de escritura */}
                  {isThinking && (
                    <motion.div
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      className="flex justify-start"
                    >
                      <div className="bg-gray-800/80 border border-purple-400/30 p-3 rounded-lg">
                        <div className="flex space-x-1">
                          {[...Array(3)].map((_, i) => (
                            <motion.div
                              key={i}
                              className="w-2 h-2 bg-purple-400 rounded-full"
                              animate={{
                                scale: [1, 1.2, 1],
                                opacity: [0.5, 1, 0.5],
                              }}
                              transition={{
                                duration: 1,
                                repeat: Infinity,
                                delay: i * 0.2,
                              }}
                            />
                          ))}
                        </div>
                      </div>
                    </motion.div>
                  )}
                </div>

                {/* Input area */}
                <div className="flex space-x-2">
                  <Input
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
                    placeholder="Pregúntame sobre tu aprendizaje..."
                    className="bg-gray-800/50 border-purple-400/30 text-white placeholder-gray-400"
                    disabled={isThinking}
                  />
                  <Button
                    onClick={handleSendMessage}
                    disabled={!message.trim() || isThinking}
                    className="bg-purple-600 hover:bg-purple-700"
                  >
                    <Send className="w-4 h-4" />
                  </Button>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
};
