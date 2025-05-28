
import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { 
  MessageCircle, 
  Send, 
  Sparkles, 
  X, 
  Bot,
  User,
  Lightbulb
} from 'lucide-react';

interface ChatMessage {
  id: string;
  type: 'user' | 'assistant';
  content: string;
  timestamp: Date;
  suggestions?: string[];
}

interface AIChatProps {
  isOpen: boolean;
  onClose: () => void;
  currentRoute: string;
}

const quickSuggestions = {
  '/': [
    '¿Cómo empiezo a usar SuperPAES?',
    'Explícame el sistema de diagnóstico',
    '¿Qué es LectoGuía IA?',
    'Ayúdame a configurar mis objetivos PAES'
  ],
  '/lectoguia': [
    '¿Cómo subo un texto para análisis?',
    'Explícame las funciones de comprensión lectora',
    '¿Puede analizar imágenes de texto?',
    'Genera un ejercicio de comprensión'
  ],
  '/diagnostic': [
    '¿Cómo funciona el diagnóstico adaptativo?',
    'Explícame los resultados del test',
    '¿Cuánto tiempo toma completar un diagnóstico?',
    '¿Cómo interpretar mi puntaje?'
  ],
  '/planning': [
    '¿Cómo crear un plan de estudio efectivo?',
    'Ayúdame a optimizar mi horario',
    '¿Cómo se adapta el plan a mi progreso?',
    'Recomiéndame estrategias de estudio'
  ]
};

export const AIChat: React.FC<AIChatProps> = ({
  isOpen,
  onClose,
  currentRoute
}) => {
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: '1',
      type: 'assistant',
      content: '¡Hola! Soy tu asistente virtual de SuperPAES. ¿En qué puedo ayudarte hoy?',
      timestamp: new Date(),
      suggestions: quickSuggestions[currentRoute as keyof typeof quickSuggestions] || quickSuggestions['/']
    }
  ]);
  const [inputValue, setInputValue] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleSendMessage = async (message: string) => {
    if (!message.trim()) return;

    // Add user message
    const userMessage: ChatMessage = {
      id: Date.now().toString(),
      type: 'user',
      content: message,
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMessage]);
    setInputValue('');
    setIsTyping(true);

    // Simulate AI response
    setTimeout(() => {
      const assistantMessage: ChatMessage = {
        id: (Date.now() + 1).toString(),
        type: 'assistant',
        content: generateResponse(message, currentRoute),
        timestamp: new Date(),
        suggestions: getContextualSuggestions(message, currentRoute)
      };

      setMessages(prev => [...prev, assistantMessage]);
      setIsTyping(false);
    }, 1500);
  };

  const generateResponse = (message: string, route: string): string => {
    const lowerMessage = message.toLowerCase();

    // Respuestas contextuales basadas en la ruta
    if (route === '/lectoguia' && lowerMessage.includes('texto')) {
      return 'Para subir un texto en LectoGuía, puedes usar el botón "Subir Archivo" o directamente pegar el texto en el área de chat. La IA analizará automáticamente el contenido y te ayudará con comprensión lectora, resumen, y generación de preguntas.';
    }

    if (route === '/diagnostic' && lowerMessage.includes('diagnóstico')) {
      return 'El sistema de diagnóstico de SuperPAES utiliza algoritmos adaptativos que ajustan la dificultad según tu rendimiento. Cada pregunta se selecciona inteligentemente para maximizar la información sobre tu nivel real en cada área PAES.';
    }

    if (lowerMessage.includes('objetivos') || lowerMessage.includes('metas')) {
      return 'Para configurar tus objetivos PAES, ve al planificador y define: 1) Tu puntaje objetivo, 2) Fecha del examen, 3) Tiempo de estudio disponible. El sistema creará automáticamente un plan personalizado basado en tu diagnóstico inicial.';
    }

    // Respuestas generales
    if (lowerMessage.includes('empezar') || lowerMessage.includes('comenzar')) {
      return 'Te recomiendo empezar con estos pasos: 1) Completa el diagnóstico inicial, 2) Configura tus objetivos PAES, 3) Explora LectoGuía con algunos textos de práctica, 4) Revisa tu plan de estudio personalizado. ¿Por cuál te gustaría comenzar?';
    }

    return 'Entiendo tu consulta. SuperPAES está diseñado para adaptarse a tu ritmo de aprendizaje. ¿Podrías ser más específico sobre qué aspecto te interesa? Puedo ayudarte con diagnósticos, planificación, comprensión lectora, o cualquier funcionalidad del sistema.';
  };

  const getContextualSuggestions = (message: string, route: string): string[] => {
    return quickSuggestions[route as keyof typeof quickSuggestions]?.slice(0, 3) || [];
  };

  const handleSuggestionClick = (suggestion: string) => {
    handleSendMessage(suggestion);
  };

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.8 }}
        className="fixed inset-4 z-50 md:top-1/2 md:left-1/2 md:transform md:-translate-x-1/2 md:-translate-y-1/2 md:w-full md:max-w-2xl md:h-auto md:max-h-[80vh]"
      >
        <Card className="h-full bg-black/90 backdrop-blur-xl border-white/20 shadow-2xl flex flex-col">
          <CardHeader className="border-b border-white/10">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="p-2 rounded-xl bg-gradient-to-r from-purple-500 to-pink-500">
                  <MessageCircle className="w-5 h-5 text-white" />
                </div>
                <div>
                  <CardTitle className="text-white">Chat con IA</CardTitle>
                  <div className="flex items-center gap-2">
                    <Badge className="bg-green-500/20 text-green-400 border-green-500/30 text-xs">
                      <span className="w-1.5 h-1.5 bg-green-400 rounded-full mr-1 animate-pulse" />
                      En línea
                    </Badge>
                    <span className="text-white/60 text-xs">Asistente SuperPAES</span>
                  </div>
                </div>
              </div>
              <Button
                variant="ghost"
                size="sm"
                onClick={onClose}
                className="text-white/60 hover:text-white"
              >
                <X className="w-5 h-5" />
              </Button>
            </div>
          </CardHeader>

          <CardContent className="flex-1 p-0 flex flex-col">
            {/* Messages */}
            <div className="flex-1 overflow-y-auto p-4 space-y-4">
              {messages.map((message) => (
                <motion.div
                  key={message.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  className={`flex ${message.type === 'user' ? 'justify-end' : 'justify-start'}`}
                >
                  <div className={`max-w-[80%] ${message.type === 'user' ? 'order-2' : 'order-1'}`}>
                    <div className={`flex items-start gap-2 ${message.type === 'user' ? 'flex-row-reverse' : 'flex-row'}`}>
                      <div className={`p-2 rounded-lg ${
                        message.type === 'user' 
                          ? 'bg-cyan-500' 
                          : 'bg-purple-500/20'
                      }`}>
                        {message.type === 'user' ? (
                          <User className="w-4 h-4 text-white" />
                        ) : (
                          <Bot className="w-4 h-4 text-purple-400" />
                        )}
                      </div>
                      <div className={`rounded-lg p-3 ${
                        message.type === 'user'
                          ? 'bg-cyan-500 text-white'
                          : 'bg-white/5 text-white border border-white/10'
                      }`}>
                        <p className="text-sm leading-relaxed">{message.content}</p>
                      </div>
                    </div>
                    
                    {/* Suggestions */}
                    {message.type === 'assistant' && message.suggestions && (
                      <div className="mt-3 flex flex-wrap gap-2">
                        {message.suggestions.map((suggestion, index) => (
                          <Button
                            key={index}
                            variant="ghost"
                            size="sm"
                            onClick={() => handleSuggestionClick(suggestion)}
                            className="bg-white/5 hover:bg-white/10 text-white/80 hover:text-white text-xs border border-white/10"
                          >
                            <Lightbulb className="w-3 h-3 mr-1" />
                            {suggestion}
                          </Button>
                        ))}
                      </div>
                    )}
                  </div>
                </motion.div>
              ))}

              {/* Typing indicator */}
              {isTyping && (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="flex justify-start"
                >
                  <div className="flex items-center gap-2">
                    <div className="p-2 rounded-lg bg-purple-500/20">
                      <Bot className="w-4 h-4 text-purple-400" />
                    </div>
                    <div className="bg-white/5 rounded-lg p-3 border border-white/10">
                      <div className="flex space-x-1">
                        {[0, 1, 2].map((i) => (
                          <motion.div
                            key={i}
                            className="w-2 h-2 bg-purple-400 rounded-full"
                            animate={{
                              opacity: [0.3, 1, 0.3],
                              scale: [0.8, 1.2, 0.8]
                            }}
                            transition={{
                              duration: 1.5,
                              repeat: Infinity,
                              delay: i * 0.2
                            }}
                          />
                        ))}
                      </div>
                    </div>
                  </div>
                </motion.div>
              )}
              <div ref={messagesEndRef} />
            </div>

            {/* Input */}
            <div className="border-t border-white/10 p-4">
              <div className="flex gap-2">
                <Input
                  value={inputValue}
                  onChange={(e) => setInputValue(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && handleSendMessage(inputValue)}
                  placeholder="Escribe tu pregunta aquí..."
                  className="bg-white/5 border-white/10 text-white placeholder:text-white/60"
                />
                <Button
                  onClick={() => handleSendMessage(inputValue)}
                  disabled={!inputValue.trim() || isTyping}
                  className="bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600"
                >
                  <Send className="w-4 h-4" />
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      </motion.div>
    </AnimatePresence>
  );
};
