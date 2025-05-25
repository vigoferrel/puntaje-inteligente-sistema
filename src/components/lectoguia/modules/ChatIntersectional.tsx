
import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { MessageCircle, Send, Bot, User, Sparkles } from 'lucide-react';
import { IntersectionalContext, CrossModuleAction } from '@/types/intersectional-types';
import { useLectoGuiaSimplified } from '@/hooks/lectoguia/useLectoGuiaSimplified';

interface ChatIntersectionalProps {
  context: IntersectionalContext & { moduleState: any };
  onNavigateToTool: (tool: string, context?: any) => void;
  onDispatchAction: (action: CrossModuleAction) => void;
}

export const ChatIntersectional: React.FC<ChatIntersectionalProps> = ({
  context,
  onNavigateToTool,
  onDispatchAction
}) => {
  const [inputMessage, setInputMessage] = useState('');
  const messagesEndRef = useRef<HTMLDivElement>(null);
  
  const {
    messages,
    isTyping,
    handleSendMessage,
    activeSubject,
    handleSubjectChange
  } = useLectoGuiaSimplified();

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  // Enviar mensaje con contexto interseccional
  const handleSendClick = async () => {
    if (!inputMessage.trim()) return;
    
    // Enriquecer mensaje con contexto interseccional
    const enrichedMessage = {
      content: inputMessage,
      context: {
        currentSubject: context.currentSubject,
        crossModuleMetrics: context.crossModuleMetrics,
        financialGoals: context.financialGoals,
        diagnosticResults: context.diagnosticResults
      }
    };
    
    try {
      await handleSendMessage(inputMessage);
      
      // Notificar a otros módulos sobre la nueva conversación
      onDispatchAction({
        type: 'UPDATE_CONTEXT',
        source: 'chat',
        target: 'all',
        payload: { lastChatMessage: inputMessage },
        priority: 'low'
      });
      
    } catch (error) {
      console.error('Error enviando mensaje interseccional:', error);
    }
    
    setInputMessage('');
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendClick();
    }
  };

  // Sugerencias inteligentes basadas en contexto
  const getContextualSuggestions = () => {
    const suggestions = [];
    
    if (context.financialGoals) {
      suggestions.push(`¿Cómo mejorar en ${context.currentSubject} para acceder a ${context.financialGoals.targetCareer}?`);
    }
    
    if (context.crossModuleMetrics.averagePerformance < 70) {
      suggestions.push(`Necesito estrategias para mejorar mi rendimiento general`);
    }
    
    if (context.diagnosticResults) {
      suggestions.push(`Explícame mis resultados del diagnóstico y cómo mejorar`);
    }
    
    suggestions.push(`Genérame un ejercicio de ${context.currentSubject}`);
    
    return suggestions;
  };

  return (
    <Card className="h-full">
      <CardHeader>
        <CardTitle className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <MessageCircle className="w-5 h-5 text-purple-600" />
            Chat IA Interseccional
          </div>
          <div className="flex gap-2">
            <Badge variant="outline" className="bg-purple-50 text-purple-700">
              {context.currentSubject}
            </Badge>
            {context.crossModuleMetrics.averagePerformance && (
              <Badge variant="outline" className="bg-blue-50 text-blue-700">
                Rendimiento: {context.crossModuleMetrics.averagePerformance}%
              </Badge>
            )}
          </div>
        </CardTitle>
      </CardHeader>
      
      <CardContent className="space-y-4">
        {/* Área de Mensajes */}
        <div className="h-96 overflow-y-auto p-4 border rounded-lg bg-gray-50 space-y-4">
          <AnimatePresence>
            {messages.map((message) => (
              <motion.div
                key={message.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className={`flex gap-3 ${message.type === 'user' ? 'justify-end' : 'justify-start'}`}
              >
                {message.type === 'ai' && (
                  <div className="w-8 h-8 bg-gradient-to-r from-purple-500 to-blue-500 rounded-full flex items-center justify-center flex-shrink-0">
                    <Bot className="w-4 h-4 text-white" />
                  </div>
                )}
                
                <div className={`max-w-[70%] rounded-xl p-4 ${
                  message.type === 'user' 
                    ? 'bg-gradient-to-r from-purple-500 to-blue-500 text-white' 
                    : 'bg-white border border-gray-200 text-gray-800'
                }`}>
                  <p className="text-sm whitespace-pre-wrap">{message.content}</p>
                  <span className="text-xs opacity-70 mt-2 block">
                    {message.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                  </span>
                </div>

                {message.type === 'user' && (
                  <div className="w-8 h-8 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full flex items-center justify-center flex-shrink-0">
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
              <div className="w-8 h-8 bg-gradient-to-r from-purple-500 to-blue-500 rounded-full flex items-center justify-center">
                <Bot className="w-4 h-4 text-white" />
              </div>
              <div className="bg-white rounded-xl p-4 border border-gray-200">
                <div className="flex space-x-1">
                  <div className="w-2 h-2 bg-purple-400 rounded-full animate-bounce"></div>
                  <div className="w-2 h-2 bg-blue-400 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
                  <div className="w-2 h-2 bg-purple-400 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                </div>
              </div>
            </motion.div>
          )}
          
          <div ref={messagesEndRef} />
        </div>

        {/* Sugerencias Contextuales */}
        <div className="space-y-2">
          <p className="text-sm font-medium text-gray-700 flex items-center gap-1">
            <Sparkles className="w-4 h-4" />
            Sugerencias inteligentes
          </p>
          <div className="flex flex-wrap gap-2">
            {getContextualSuggestions().slice(0, 3).map((suggestion, index) => (
              <Button
                key={index}
                variant="outline"
                size="sm"
                onClick={() => setInputMessage(suggestion)}
                className="text-xs bg-gradient-to-r from-purple-50 to-blue-50 border-purple-200 hover:from-purple-100 hover:to-blue-100"
              >
                {suggestion.length > 50 ? `${suggestion.substring(0, 50)}...` : suggestion}
              </Button>
            ))}
          </div>
        </div>

        {/* Input de Mensaje */}
        <div className="flex gap-2">
          <Input
            value={inputMessage}
            onChange={(e) => setInputMessage(e.target.value)}
            placeholder="Pregunta sobre tu aprendizaje integrado..."
            onKeyPress={handleKeyPress}
            disabled={isTyping}
            className="flex-1"
          />
          <Button 
            onClick={handleSendClick}
            disabled={!inputMessage.trim() || isTyping}
            size="icon"
            className="bg-gradient-to-r from-purple-500 to-blue-500 hover:from-purple-600 hover:to-blue-600"
          >
            <Send className="w-4 h-4" />
          </Button>
        </div>

        {/* Acciones Rápidas Interseccionales */}
        <div className="grid grid-cols-2 gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => onNavigateToTool('exercise')}
            className="justify-start gap-2"
          >
            🎯 Generar Ejercicio
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={() => onNavigateToTool('financial', { fromChat: true })}
            className="justify-start gap-2"
          >
            💰 Explorar Becas
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={() => onNavigateToTool('diagnostic', { fromChat: true })}
            className="justify-start gap-2"
          >
            📊 Evaluar Progreso
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={() => onNavigateToTool('planning', { fromChat: true })}
            className="justify-start gap-2"
          >
            📚 Crear Plan
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};
