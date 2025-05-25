
import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { 
  Brain, 
  MessageCircle, 
  Lightbulb, 
  Target,
  X,
  Send,
  Mic,
  TrendingUp
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
  const [isMinimized, setIsMinimized] = useState(false);
  const [currentMessage, setCurrentMessage] = useState('');
  const [conversation, setConversation] = useState<Array<{
    type: 'user' | 'assistant';
    message: string;
    timestamp: string;
  }>>([]);

  // Initialize with welcome message
  useEffect(() => {
    const welcomeMessage = {
      type: 'assistant' as const,
      message: `¡Hola! Soy tu asistente de IA personal. He analizado tu rendimiento y noto que ${
        weakestArea?.prueba ? `puedes mejorar en ${weakestArea.prueba}` : 'tienes un gran potencial'
      }. ¿En qué puedo ayudarte hoy?`,
      timestamp: new Date().toLocaleTimeString()
    };
    setConversation([welcomeMessage]);
  }, [weakestArea]);

  const quickSuggestions = [
    {
      icon: Target,
      text: "¿Cómo puedo mejorar mi área más débil?",
      query: `¿Cómo puedo mejorar en ${weakestArea?.prueba || 'mis áreas de oportunidad'}?`
    },
    {
      icon: TrendingUp,
      text: "Explícame mi progreso actual",
      query: "¿Cuál es mi progreso actual y qué significan mis puntajes?"
    },
    {
      icon: Lightbulb,
      text: "Dame una estrategia de estudio",
      query: "¿Puedes sugerirme una estrategia de estudio personalizada?"
    }
  ];

  const handleSendMessage = () => {
    if (!currentMessage.trim()) return;

    // Add user message
    const userMessage = {
      type: 'user' as const,
      message: currentMessage,
      timestamp: new Date().toLocaleTimeString()
    };

    setConversation(prev => [...prev, userMessage]);
    onAskQuestion(currentMessage);
    setCurrentMessage('');

    // Simulate assistant response
    setTimeout(() => {
      const assistantMessage = {
        type: 'assistant' as const,
        message: generateResponse(currentMessage),
        timestamp: new Date().toLocaleTimeString()
      };
      setConversation(prev => [...prev, assistantMessage]);
    }, 1000);
  };

  const generateResponse = (question: string) => {
    if (question.toLowerCase().includes('mejorar')) {
      return `Para mejorar en ${weakestArea?.prueba || 'tus áreas de oportunidad'}, te recomiendo: 1) Practicar ejercicios específicos diariamente, 2) Revisar conceptos fundamentales, 3) Usar la técnica de espaciado para retención. ¿Te gustaría que genere ejercicios específicos?`;
    }
    if (question.toLowerCase().includes('progreso')) {
      return `Tu progreso actual muestra ${systemMetrics?.overallProgress || 0} puntos de mejora. Has completado ${systemMetrics?.completedNodes || 0} de ${systemMetrics?.totalNodes || 0} nodos de aprendizaje. Esto indica un buen avance en tu preparación.`;
    }
    if (question.toLowerCase().includes('estrategia')) {
      return `Basado en tu perfil, sugiero: 1) Dedica 30 min diarios a tu área más débil, 2) Alterna entre teoría y práctica, 3) Revisa tus errores semanalmente, 4) Simula exámenes cada 15 días. ¿Quieres que personalice esto más?`;
    }
    return `Entiendo tu pregunta. Basándome en tu perfil de aprendizaje y rendimiento actual, puedo ayudarte a optimizar tu preparación PAES. ¿Podrías ser más específico sobre qué aspecto te interesa más?`;
  };

  const handleQuickSuggestion = (suggestion: any) => {
    setCurrentMessage(suggestion.query);
    handleSendMessage();
  };

  if (isMinimized) {
    return (
      <motion.div
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        className="fixed bottom-6 right-6 z-50"
      >
        <Button
          onClick={() => setIsMinimized(false)}
          className="bg-purple-600 hover:bg-purple-700 rounded-full w-16 h-16 p-0 shadow-2xl border-2 border-purple-400 relative"
        >
          <Brain className="w-8 h-8 animate-pulse" />
          <div className="absolute -top-2 -right-2 w-4 h-4 bg-red-500 rounded-full animate-bounce"></div>
        </Button>
      </motion.div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.8, x: 50 }}
      animate={{ opacity: 1, scale: 1, x: 0 }}
      exit={{ opacity: 0, scale: 0.8, x: 50 }}
      className="fixed bottom-6 right-6 w-96 z-50"
    >
      <Card className="bg-black/90 backdrop-blur-lg border-purple-500/50 shadow-2xl">
        <div className="flex items-center justify-between p-4 border-b border-purple-500/30">
          <div className="flex items-center space-x-2">
            <Brain className="w-6 h-6 text-purple-400 animate-pulse" />
            <div>
              <h3 className="text-purple-400 font-semibold">Asistente IA</h3>
              <div className="text-xs text-green-400">● Online</div>
            </div>
          </div>
          
          <div className="flex items-center space-x-2">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setIsMinimized(true)}
              className="text-purple-400 hover:bg-purple-400/10"
            >
              <MessageCircle className="w-4 h-4" />
            </Button>
            <Button
              variant="ghost"
              size="sm"
              onClick={onClose}
              className="text-purple-400 hover:bg-purple-400/10"
            >
              <X className="w-4 h-4" />
            </Button>
          </div>
        </div>

        <CardContent className="p-0">
          {/* Conversation */}
          <div className="h-64 overflow-y-auto p-4 space-y-3 scrollbar-thin scrollbar-thumb-purple-500/50">
            <AnimatePresence>
              {conversation.map((msg, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className={`flex ${msg.type === 'user' ? 'justify-end' : 'justify-start'}`}
                >
                  <div className={`max-w-[80%] p-3 rounded-lg ${
                    msg.type === 'user' 
                      ? 'bg-purple-600 text-white' 
                      : 'bg-gray-800 text-gray-300 border border-purple-500/30'
                  }`}>
                    <div className="text-sm">{msg.message}</div>
                    <div className="text-xs opacity-60 mt-1">{msg.timestamp}</div>
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>
          </div>

          {/* Quick Suggestions */}
          <div className="p-4 border-t border-purple-500/30">
            <div className="text-xs text-purple-400 mb-2">Sugerencias rápidas:</div>
            <div className="grid grid-cols-1 gap-2">
              {quickSuggestions.map((suggestion, index) => (
                <Button
                  key={index}
                  variant="ghost"
                  size="sm"
                  onClick={() => handleQuickSuggestion(suggestion)}
                  className="text-left text-xs text-gray-400 hover:bg-purple-400/10 hover:text-purple-300 justify-start h-auto py-2"
                >
                  <suggestion.icon className="w-3 h-3 mr-2 flex-shrink-0" />
                  <span className="truncate">{suggestion.text}</span>
                </Button>
              ))}
            </div>
          </div>

          {/* Message Input */}
          <div className="p-4 border-t border-purple-500/30">
            <div className="flex items-center space-x-2">
              <Input
                value={currentMessage}
                onChange={(e) => setCurrentMessage(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
                placeholder="Pregúntame algo..."
                className="bg-gray-800 border-purple-500/30 text-white placeholder-gray-400 text-sm"
              />
              <Button
                onClick={handleSendMessage}
                disabled={!currentMessage.trim()}
                className="bg-purple-600 hover:bg-purple-700 p-2"
              >
                <Send className="w-4 h-4" />
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
};
