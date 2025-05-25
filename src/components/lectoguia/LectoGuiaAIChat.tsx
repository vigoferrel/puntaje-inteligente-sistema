
import React, { useState, useRef, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { motion, AnimatePresence } from "framer-motion";
import { 
  Brain, 
  Send, 
  BookOpen, 
  Target, 
  TrendingUp,
  MessageCircle,
  Lightbulb,
  ChevronDown,
  User,
  Bot
} from "lucide-react";

interface ChatMessage {
  id: string;
  type: 'user' | 'ai';
  content: string;
  timestamp: Date;
  context?: {
    nodeId?: string;
    exerciseId?: string;
    subject?: string;
  };
}

interface LectoGuiaAIChatProps {
  onNavigateToExercise?: (nodeId: string) => void;
  onNavigateToDiagnostic?: () => void;
  onNavigateToPlan?: () => void;
}

export const LectoGuiaAIChat: React.FC<LectoGuiaAIChatProps> = ({
  onNavigateToExercise,
  onNavigateToDiagnostic,
  onNavigateToPlan
}) => {
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: '1',
      type: 'ai',
      content: '¡Hola! Soy tu asistente de estudio PAES. Puedo ayudarte con ejercicios, explicaciones, estrategias de estudio y recomendaciones personalizadas. ¿En qué te puedo ayudar hoy?',
      timestamp: new Date()
    }
  ]);
  const [inputMessage, setInputMessage] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const suggestedActions = [
    {
      icon: BookOpen,
      text: 'Explicar un concepto',
      action: 'explain-concept'
    },
    {
      icon: Target,
      text: 'Generar ejercicio',
      action: 'generate-exercise'
    },
    {
      icon: TrendingUp,
      text: 'Analizar mi progreso',
      action: 'analyze-progress'
    },
    {
      icon: Lightbulb,
      text: 'Estrategias de estudio',
      action: 'study-strategies'
    }
  ];

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSendMessage = async () => {
    if (!inputMessage.trim()) return;

    const newUserMessage: ChatMessage = {
      id: Date.now().toString(),
      type: 'user',
      content: inputMessage,
      timestamp: new Date()
    };

    setMessages(prev => [...prev, newUserMessage]);
    setInputMessage('');
    setIsTyping(true);

    // Simular respuesta de IA
    setTimeout(() => {
      const aiResponse = generateAIResponse(inputMessage);
      const newAIMessage: ChatMessage = {
        id: (Date.now() + 1).toString(),
        type: 'ai',
        content: aiResponse,
        timestamp: new Date()
      };
      setMessages(prev => [...prev, newAIMessage]);
      setIsTyping(false);
    }, 1500);
  };

  const generateAIResponse = (userInput: string): string => {
    const input = userInput.toLowerCase();
    
    if (input.includes('ejercicio') || input.includes('practica')) {
      return 'Te recomiendo practicar ejercicios de comprensión lectora nivel básico. He encontrado 3 ejercicios perfectos para tu nivel actual. ¿Te gustaría que te genere uno ahora?';
    }
    
    if (input.includes('matematica') || input.includes('algebra')) {
      return 'En matemática, veo que necesitas reforzar funciones lineales. Te sugiero empezar con los conceptos básicos de pendiente e intercepto. ¿Quieres que creemos un plan específico para esta área?';
    }
    
    if (input.includes('diagnostico') || input.includes('evaluacion')) {
      return 'Basado en tu último diagnóstico, tienes fortalezas en Historia y oportunidades de mejora en Ciencias. Te recomiendo 2-3 sesiones semanales enfocadas en Biología celular.';
    }
    
    return 'Entiendo tu consulta. Puedo ayudarte con explicaciones detalladas, ejercicios personalizados, y estrategias de estudio. ¿Podrías ser más específico sobre qué área te interesa trabajar?';
  };

  const handleSuggestedAction = (action: string) => {
    const actionMessages = {
      'explain-concept': '¿Podrías explicarme el concepto de función cuadrática?',
      'generate-exercise': 'Genera un ejercicio de comprensión lectora para mí',
      'analyze-progress': 'Analiza mi progreso en las últimas semanas',
      'study-strategies': 'Dame estrategias para mejorar en ciencias'
    };
    
    setInputMessage(actionMessages[action as keyof typeof actionMessages] || '');
  };

  return (
    <div className="h-full flex flex-col">
      {/* Header */}
      <CardHeader className="pb-4 border-b">
        <CardTitle className="flex items-center gap-3">
          <div className="p-2 bg-purple-500/20 rounded-lg">
            <Brain className="w-5 h-5 text-purple-600" />
          </div>
          LectoGuía IA
          <Badge variant="default" className="bg-green-600 text-xs">
            En línea
          </Badge>
        </CardTitle>
      </CardHeader>

      {/* Messages Area */}
      <CardContent className="flex-1 overflow-hidden p-0">
        <div className="h-96 overflow-y-auto p-4 space-y-4">
          <AnimatePresence>
            {messages.map((message) => (
              <motion.div
                key={message.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                className={`flex gap-3 ${message.type === 'user' ? 'justify-end' : 'justify-start'}`}
              >
                {message.type === 'ai' && (
                  <div className="w-8 h-8 bg-purple-500 rounded-full flex items-center justify-center flex-shrink-0">
                    <Bot className="w-4 h-4 text-white" />
                  </div>
                )}
                
                <div 
                  className={`max-w-[70%] rounded-lg p-3 ${
                    message.type === 'user' 
                      ? 'bg-blue-500 text-white' 
                      : 'bg-gray-100 text-gray-800'
                  }`}
                >
                  <p className="text-sm">{message.content}</p>
                  <span className="text-xs opacity-70 mt-1 block">
                    {message.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                  </span>
                </div>

                {message.type === 'user' && (
                  <div className="w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center flex-shrink-0">
                    <User className="w-4 h-4 text-white" />
                  </div>
                )}
              </motion.div>
            ))}
          </AnimatePresence>

          {isTyping && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="flex gap-3 justify-start"
            >
              <div className="w-8 h-8 bg-purple-500 rounded-full flex items-center justify-center">
                <Bot className="w-4 h-4 text-white" />
              </div>
              <div className="bg-gray-100 rounded-lg p-3">
                <div className="flex space-x-1">
                  <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></div>
                  <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
                  <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                </div>
              </div>
            </motion.div>
          )}
          
          <div ref={messagesEndRef} />
        </div>

        {/* Suggested Actions */}
        <div className="p-4 border-t bg-gray-50">
          <p className="text-sm font-medium mb-3 text-gray-600">Acciones sugeridas:</p>
          <div className="grid grid-cols-2 gap-2">
            {suggestedActions.map((action, index) => (
              <Button
                key={action.action}
                variant="outline"
                size="sm"
                className="justify-start gap-2 text-xs"
                onClick={() => handleSuggestedAction(action.action)}
              >
                <action.icon className="w-3 h-3" />
                {action.text}
              </Button>
            ))}
          </div>
        </div>

        {/* Input Area */}
        <div className="p-4 border-t">
          <div className="flex gap-2">
            <Input
              value={inputMessage}
              onChange={(e) => setInputMessage(e.target.value)}
              placeholder="Escribe tu pregunta sobre PAES..."
              onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
              className="flex-1"
            />
            <Button 
              onClick={handleSendMessage}
              disabled={!inputMessage.trim() || isTyping}
              size="icon"
            >
              <Send className="w-4 h-4" />
            </Button>
          </div>
        </div>
      </CardContent>
    </div>
  );
};
