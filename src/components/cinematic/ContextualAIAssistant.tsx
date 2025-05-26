
import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { MessageCircle, Bot, Lightbulb, Zap, X } from 'lucide-react';

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
  const [isVisible, setIsVisible] = useState(false);
  const [isExpanded, setIsExpanded] = useState(false);
  const [currentSuggestion, setCurrentSuggestion] = useState('');
  const [assistantMode, setAssistantMode] = useState('contextual');

  const contextualSuggestions = {
    dashboard: [
      'Tu progreso neural muestra gran potencial. ¿Revisamos las métricas de enfoque?',
      'Detecté patrones de mejora en tu aprendizaje. ¿Exploramos nuevas estrategias?',
      'El sistema sugiere optimizar tu horario de estudio basado en tu actividad neural.'
    ],
    paes: [
      'Tu puntaje PAES está en tendencia ascendente. ¿Practicamos las áreas de menor puntuación?',
      'Identifiqué patrones en tus errores más comunes. ¿Te ayudo a crear un plan específico?',
      'Tus tiempos de respuesta mejoraron 15%. ¿Aumentamos la dificultad de los ejercicios?'
    ],
    unified: [
      'El módulo de lectoguía complementaría perfectamente tu sesión actual.',
      'Detecté que tu comprensión mejora con contenido visual. ¿Activamos modo inmersivo?',
      'Tu patrón de aprendizaje sugiere que es el momento ideal para material avanzado.'
    ]
  };

  useEffect(() => {
    // Mostrar asistente contextualmente
    const timer = setTimeout(() => {
      setIsVisible(true);
      updateSuggestion();
    }, 3000);

    return () => clearTimeout(timer);
  }, [currentModule]);

  useEffect(() => {
    // Actualizar sugerencias periódicamente
    const interval = setInterval(updateSuggestion, 8000);
    return () => clearInterval(interval);
  }, [currentModule]);

  const updateSuggestion = () => {
    const suggestions = contextualSuggestions[currentModule as keyof typeof contextualSuggestions] || contextualSuggestions.dashboard;
    const randomSuggestion = suggestions[Math.floor(Math.random() * suggestions.length)];
    setCurrentSuggestion(randomSuggestion);
  };

  const handleAssistantAction = (action: string) => {
    switch (action) {
      case 'focus':
        onEmotionalStateChange('focused');
        break;
      case 'relax':
        onEmotionalStateChange('calm');
        break;
      case 'energize':
        onEmotionalStateChange('excited');
        break;
    }
    setIsExpanded(false);
  };

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          className="contextual-ai-assistant fixed bottom-6 left-6 z-40"
          initial={{ opacity: 0, x: -100, scale: 0.8 }}
          animate={{ opacity: 1, x: 0, scale: 1 }}
          exit={{ opacity: 0, x: -100, scale: 0.8 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
        >
          {/* Assistant Container */}
          <div className="relative">
            {/* Main Assistant Bubble */}
            <motion.div
              className="assistant-bubble bg-black/80 backdrop-blur-xl rounded-2xl border border-white/20 p-4 max-w-[320px]"
              animate={{
                boxShadow: [
                  '0 0 20px rgba(6, 182, 212, 0.3)',
                  '0 0 30px rgba(139, 92, 246, 0.4)',
                  '0 0 20px rgba(6, 182, 212, 0.3)'
                ]
              }}
              transition={{ duration: 3, repeat: Infinity }}
            >
              {/* Assistant Header */}
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-3">
                  <motion.div
                    className="p-2 rounded-xl bg-gradient-to-r from-cyan-500 to-purple-500"
                    animate={{ rotate: [0, 5, -5, 0] }}
                    transition={{ duration: 2, repeat: Infinity }}
                  >
                    <Bot className="w-4 h-4 text-white" />
                  </motion.div>
                  <div>
                    <h4 className="text-white font-semibold text-sm">IA Contextual</h4>
                    <p className="text-white/60 text-xs">Asistente Neural</p>
                  </div>
                </div>
                
                <div className="flex items-center gap-2">
                  <motion.button
                    onClick={() => setIsExpanded(!isExpanded)}
                    className="text-white/60 hover:text-white transition-colors"
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    <Lightbulb className="w-4 h-4" />
                  </motion.button>
                  <motion.button
                    onClick={() => setIsVisible(false)}
                    className="text-white/40 hover:text-white/60 transition-colors"
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    <X className="w-4 h-4" />
                  </motion.button>
                </div>
              </div>

              {/* Suggestion Content */}
              <motion.div
                key={currentSuggestion}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
                className="suggestion-content"
              >
                <p className="text-white/90 text-sm leading-relaxed mb-3">
                  {currentSuggestion}
                </p>

                {/* Quick Actions */}
                <div className="flex items-center gap-2">
                  <motion.button
                    onClick={() => handleAssistantAction('focus')}
                    className="px-3 py-1.5 bg-cyan-500/20 hover:bg-cyan-500/30 text-cyan-400 rounded-lg text-xs font-medium transition-colors"
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    Enfocar
                  </motion.button>
                  <motion.button
                    onClick={() => setIsExpanded(true)}
                    className="px-3 py-1.5 bg-purple-500/20 hover:bg-purple-500/30 text-purple-400 rounded-lg text-xs font-medium transition-colors"
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    Más opciones
                  </motion.button>
                </div>
              </motion.div>

              {/* Expanded Options */}
              <AnimatePresence>
                {isExpanded && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: 'auto' }}
                    exit={{ opacity: 0, height: 0 }}
                    transition={{ duration: 0.3 }}
                    className="expanded-options mt-4 pt-3 border-t border-white/10"
                  >
                    <h5 className="text-white font-medium text-xs mb-2">Acciones Rápidas:</h5>
                    <div className="grid grid-cols-2 gap-2">
                      <motion.button
                        onClick={() => handleAssistantAction('focus')}
                        className="p-2 bg-blue-500/20 hover:bg-blue-500/30 text-blue-400 rounded-lg text-xs flex items-center gap-2 transition-colors"
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                      >
                        <Zap className="w-3 h-3" />
                        Modo Enfoque
                      </motion.button>
                      <motion.button
                        onClick={() => handleAssistantAction('relax')}
                        className="p-2 bg-green-500/20 hover:bg-green-500/30 text-green-400 rounded-lg text-xs flex items-center gap-2 transition-colors"
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                      >
                        <MessageCircle className="w-3 h-3" />
                        Modo Calma
                      </motion.button>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>

              {/* Thinking Indicator */}
              <div className="thinking-indicator absolute -bottom-2 left-4">
                <div className="flex items-center gap-1">
                  {[0, 1, 2].map((i) => (
                    <motion.div
                      key={i}
                      className="w-1.5 h-1.5 bg-cyan-400 rounded-full"
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
            </motion.div>

            {/* Neural Connection Effect */}
            <motion.div
              className="neural-connection absolute -top-1 -left-1 w-6 h-6 border-2 border-cyan-400/50 rounded-full"
              animate={{
                scale: [1, 1.5, 1],
                opacity: [0.5, 0.8, 0.5]
              }}
              transition={{
                duration: 2,
                repeat: Infinity
              }}
            />
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};
