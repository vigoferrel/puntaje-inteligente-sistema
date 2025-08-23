/* eslint-disable react-refresh/only-export-components */
import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { MessageCircle, Brain, Sparkles, X } from 'lucide-react';

interface ContextualAIAssistantProps {
  currentModule: string;
  emotionalState: string;
  onEmotionalStateChange: (state: string) => void;
}

export const ContextualAIAssistant: React.FC<ContextualAIAssistantProps> = ({
  currentModule,
  emotionalState,
  onEmotionalStateChange
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState([
    {
      id: 1,
      text: `Ã‚Â¡Hola! Estoy aquÃƒÂ­ para ayudarte en el mÃƒÂ³dulo ${currentModule}. Ã‚Â¿En quÃƒÂ© puedo asistirte?`,
      isAI: true,
      timestamp: new Date()
    }
  ]);

  const getContextualSuggestions = () => {
    switch (currentModule) {
      case 'neural':
        return [
          'Ã‚Â¿CÃƒÂ³mo interpretar las mÃƒÂ©tricas neurales?',
          'Optimizar mi rendimiento cognitivo',
          'Entender las conexiones neurales'
        ];
      case 'universe':
        return [
          'Ã‚Â¿CÃƒÂ³mo navegar el universo 3D?',
          'Explicar los nodos de aprendizaje',
          'Mejorar mi progreso espacial'
        ];
      case 'cinematic':
        return [
          'Ã‚Â¿QuÃƒÂ© hace el modo cinematogrÃƒÂ¡fico?',
          'Personalizar la experiencia visual',
          'Activar efectos especiales'
        ];
      default:
        return [
          'Ã‚Â¿CÃƒÂ³mo funciona el sistema?',
          'Mejorar mi experiencia',
          'Obtener recomendaciones'
        ];
    }
  };

  const handleSuggestionClick = (suggestion: string) => {
    const newMessage = {
      id: messages.length + 1,
      text: suggestion,
      isAI: false,
      timestamp: new Date()
    };

    const aiResponse = {
      id: messages.length + 2,
      text: `Excelente pregunta sobre "${suggestion}". En el contexto del mÃƒÂ³dulo ${currentModule}, te recomiendo explorar las opciones avanzadas y experimentar con diferentes configuraciones. Tu estado emocional actual (${emotionalState}) es ideal para este tipo de aprendizaje.`,
      isAI: true,
      timestamp: new Date()
    };

    setMessages(prev => [...prev, newMessage, aiResponse]);
  };

  return (
    <>
      {/* BotÃƒÂ³n flotante del asistente */}
      <motion.button
        onClick={() => setIsOpen(!isOpen)}
        className="fixed bottom-8 right-8 z-50 bg-gradient-to-r from-purple-600 to-cyan-600 rounded-full p-4 text-white shadow-2xl"
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.95 }}
        animate={{
          boxShadow: [
            '0 0 20px rgba(139, 92, 246, 0.5)',
            '0 0 40px rgba(6, 182, 212, 0.5)',
            '0 0 20px rgba(139, 92, 246, 0.5)'
          ]
        }}
        transition={{ duration: 2, repeat: Infinity }}
      >
        <motion.div
          animate={{ rotate: isOpen ? 180 : 0 }}
          transition={{ duration: 0.3 }}
        >
          {isOpen ? <X className="w-6 h-6" /> : <MessageCircle className="w-6 h-6" />}
        </motion.div>
      </motion.button>

      {/* Panel del asistente */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, scale: 0.8, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.8, y: 20 }}
            className="fixed bottom-24 right-8 z-40 w-96 h-96 bg-black/80 backdrop-blur-xl rounded-2xl border border-white/20 overflow-hidden"
          >
            {/* Header */}
            <div className="bg-gradient-to-r from-purple-600/20 to-cyan-600/20 p-4 border-b border-white/10">
              <div className="flex items-center gap-3">
                <motion.div
                  animate={{ rotate: 360 }}
                  transition={{ duration: 3, repeat: Infinity, ease: "linear" }}
                >
                  <Sparkles className="w-6 h-6 text-cyan-400" />
                </motion.div>
                <div>
                  <h3 className="text-white font-bold">Asistente Neural IA</h3>
                  <p className="text-cyan-300 text-sm">MÃƒÂ³dulo: {currentModule}</p>
                </div>
              </div>
            </div>

            {/* Mensajes */}
            <div className="flex-1 p-4 h-64 overflow-y-auto space-y-3">
              {messages.map((message) => (
                <motion.div
                  key={message.id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className={`flex ${message.isAI ? 'justify-start' : 'justify-end'}`}
                >
                  <div
                    className={`max-w-xs p-3 rounded-2xl text-sm ${
                      message.isAI
                        ? 'bg-gradient-to-r from-purple-600/20 to-cyan-600/20 text-white border border-cyan-500/30'
                        : 'bg-white/10 text-white border border-white/20'
                    }`}
                  >
                    {message.text}
                  </div>
                </motion.div>
              ))}
            </div>

            {/* Sugerencias contextuales */}
            <div className="p-4 border-t border-white/10">
              <div className="text-white text-xs mb-2 opacity-70">Sugerencias:</div>
              <div className="space-y-2">
                {getContextualSuggestions().map((suggestion, index) => (
                  <motion.button
                    key={index}
                    onClick={() => handleSuggestionClick(suggestion)}
                    className="w-full text-left p-2 text-xs text-cyan-300 bg-white/5 rounded-lg hover:bg-white/10 transition-colors border border-cyan-500/20"
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                  >
                    {suggestion}
                  </motion.button>
                ))}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};

