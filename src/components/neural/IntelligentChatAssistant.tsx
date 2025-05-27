
import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { NeuralBackendService } from '@/services/neural/neural-backend-service';
import { useAdvancedNeuralSystem } from '@/hooks/useAdvancedNeuralSystem';
import { MessageCircle, Send, Bot, User, Sparkles, X } from 'lucide-react';

interface Message {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: Date;
  neural_context?: any;
  suggestions?: string[];
}

interface ChatAssistantProps {
  sessionType: 'study_assistant' | 'lecture_guide' | 'paes_coach' | 'career_counselor';
  isMinimized?: boolean;
  onToggleMinimize?: () => void;
  context?: any;
}

export const IntelligentChatAssistant: React.FC<ChatAssistantProps> = ({
  sessionType,
  isMinimized = false,
  onToggleMinimize,
  context = {}
}) => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputMessage, setInputMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [sessionId, setSessionId] = useState<string | null>(null);
  const [suggestions, setSuggestions] = useState<string[]>([]);
  
  const { realTimeMetrics, actions } = useAdvancedNeuralSystem('chat-assistant');
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Inicializar conversación
  useEffect(() => {
    const initializeConversation = async () => {
      try {
        const response = await NeuralBackendService.startAIConversation({
          session_type: sessionType,
          context: { ...context, neural_metrics: realTimeMetrics }
        });

        setSessionId(response.session_id);
        setMessages([{
          id: 'welcome',
          role: 'assistant',
          content: response.welcome_message,
          timestamp: new Date()
        }]);

        // Capturar evento de inicio de chat
        actions.captureEvent('interaction', {
          type: 'chat_started',
          session_type: sessionType,
          context
        });

      } catch (error) {
        console.error('Error initializing chat:', error);
      }
    };

    if (!sessionId) {
      initializeConversation();
    }
  }, [sessionType, context, sessionId, actions, realTimeMetrics]);

  // Auto-scroll a último mensaje
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const sendMessage = async () => {
    if (!inputMessage.trim() || !sessionId || isLoading) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      role: 'user',
      content: inputMessage,
      timestamp: new Date(),
      neural_context: realTimeMetrics
    };

    setMessages(prev => [...prev, userMessage]);
    setInputMessage('');
    setIsLoading(true);

    try {
      const response = await NeuralBackendService.sendMessage(
        sessionId,
        inputMessage,
        realTimeMetrics
      );

      const assistantMessage: Message = {
        id: (Date.now() + 1).toString(),
        role: 'assistant',
        content: response.response,
        timestamp: new Date(),
        suggestions: response.suggestions
      };

      setMessages(prev => [...prev, assistantMessage]);
      setSuggestions(response.suggestions || []);

      // Capturar evento de mensaje enviado
      actions.captureEvent('interaction', {
        type: 'chat_message_sent',
        message_length: inputMessage.length,
        neural_insights: response.neural_insights
      });

    } catch (error) {
      console.error('Error sending message:', error);
      const errorMessage: Message = {
        id: (Date.now() + 1).toString(),
        role: 'assistant',
        content: 'Lo siento, hubo un error procesando tu mensaje. Por favor intenta de nuevo.',
        timestamp: new Date()
      };
      setMessages(prev => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
    }
  };

  const useSuggestion = (suggestion: string) => {
    setInputMessage(suggestion);
    setSuggestions([]);
  };

  const getSessionTypeIcon = () => {
    switch (sessionType) {
      case 'study_assistant': return '📚';
      case 'lecture_guide': return '🔍';
      case 'paes_coach': return '🎯';
      case 'career_counselor': return '🎓';
      default: return '🤖';
    }
  };

  const getSessionTypeName = () => {
    switch (sessionType) {
      case 'study_assistant': return 'Asistente de Estudio';
      case 'lecture_guide': return 'LectoGuía IA';
      case 'paes_coach': return 'Coach PAES';
      case 'career_counselor': return 'Consejero de Carrera';
      default: return 'Asistente IA';
    }
  };

  if (isMinimized) {
    return (
      <motion.div
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        className="fixed bottom-4 right-4 z-50"
      >
        <Button
          onClick={onToggleMinimize}
          className="rounded-full w-14 h-14 bg-gradient-to-r from-blue-600 to-purple-600 shadow-lg"
        >
          <MessageCircle className="w-6 h-6" />
        </Button>
      </motion.div>
    );
  }

  return (
    <motion.div
      initial={{ scale: 0.9, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      className="fixed bottom-4 right-4 z-50 w-96 h-[500px]"
    >
      <Card className="h-full bg-black/90 backdrop-blur-xl border-gray-700 shadow-2xl">
        <CardHeader className="pb-3">
          <div className="flex items-center justify-between">
            <CardTitle className="text-white flex items-center gap-2 text-sm">
              <span className="text-lg">{getSessionTypeIcon()}</span>
              {getSessionTypeName()}
              <div className="flex items-center gap-1">
                <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
                <Sparkles className="w-3 h-3 text-yellow-400" />
              </div>
            </CardTitle>
            {onToggleMinimize && (
              <Button
                variant="ghost"
                size="sm"
                onClick={onToggleMinimize}
                className="text-gray-400 hover:text-white"
              >
                <X className="w-4 h-4" />
              </Button>
            )}
          </div>
          
          {/* Métricas neurales en tiempo real */}
          <div className="flex gap-2">
            <Badge variant="outline" className="text-xs">
              Engagement: {Math.round(realTimeMetrics.real_time_engagement)}%
            </Badge>
            <Badge variant="outline" className="text-xs">
              Coherencia: {Math.round(realTimeMetrics.neural_coherence)}%
            </Badge>
          </div>
        </CardHeader>

        <CardContent className="p-0 h-full flex flex-col">
          {/* Área de mensajes */}
          <div className="flex-1 overflow-y-auto p-4 space-y-3">
            <AnimatePresence>
              {messages.map((message) => (
                <motion.div
                  key={message.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  className={`flex ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}
                >
                  <div className={`max-w-[80%] p-3 rounded-lg ${
                    message.role === 'user'
                      ? 'bg-blue-600 text-white'
                      : 'bg-gray-700 text-gray-100'
                  }`}>
                    <div className="flex items-start gap-2">
                      {message.role === 'assistant' && <Bot className="w-4 h-4 mt-0.5 text-blue-400" />}
                      {message.role === 'user' && <User className="w-4 h-4 mt-0.5 text-white" />}
                      <div className="flex-1">
                        <p className="text-sm">{message.content}</p>
                        <p className="text-xs opacity-70 mt-1">
                          {message.timestamp.toLocaleTimeString()}
                        </p>
                      </div>
                    </div>
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>
            
            {isLoading && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="flex justify-start"
              >
                <div className="bg-gray-700 p-3 rounded-lg">
                  <div className="flex items-center gap-2">
                    <Bot className="w-4 h-4 text-blue-400" />
                    <div className="flex space-x-1">
                      <div className="w-2 h-2 bg-blue-400 rounded-full animate-bounce"></div>
                      <div className="w-2 h-2 bg-blue-400 rounded-full animate-bounce delay-100"></div>
                      <div className="w-2 h-2 bg-blue-400 rounded-full animate-bounce delay-200"></div>
                    </div>
                  </div>
                </div>
              </motion.div>
            )}
            
            <div ref={messagesEndRef} />
          </div>

          {/* Sugerencias */}
          {suggestions.length > 0 && (
            <div className="px-4 py-2 border-t border-gray-700">
              <p className="text-xs text-gray-400 mb-2">Sugerencias:</p>
              <div className="flex flex-wrap gap-1">
                {suggestions.slice(0, 3).map((suggestion, index) => (
                  <Button
                    key={index}
                    variant="outline"
                    size="sm"
                    onClick={() => useSuggestion(suggestion)}
                    className="text-xs h-6 px-2"
                  >
                    {suggestion}
                  </Button>
                ))}
              </div>
            </div>
          )}

          {/* Input de mensaje */}
          <div className="p-4 border-t border-gray-700">
            <div className="flex gap-2">
              <Input
                value={inputMessage}
                onChange={(e) => setInputMessage(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && sendMessage()}
                placeholder="Escribe tu mensaje..."
                className="flex-1 bg-gray-800 border-gray-600 text-white placeholder-gray-400"
                disabled={isLoading}
              />
              <Button 
                onClick={sendMessage}
                disabled={!inputMessage.trim() || isLoading}
                size="sm"
                className="bg-blue-600 hover:bg-blue-700"
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
