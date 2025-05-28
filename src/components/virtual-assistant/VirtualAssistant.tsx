
import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { 
  Bot, 
  Lightbulb, 
  X, 
  MessageCircle, 
  Play, 
  Pause,
  Settings,
  Help,
  ArrowRight,
  Sparkles
} from 'lucide-react';

interface VirtualAssistantProps {
  currentRoute: string;
  isFirstVisit?: boolean;
  onStartTour?: (tourType: string) => void;
  onShowHelp?: () => void;
}

interface AssistantState {
  isVisible: boolean;
  isExpanded: boolean;
  currentMode: 'contextual' | 'tour' | 'chat' | 'help';
  tourProgress: number;
  isInteracting: boolean;
}

const contextualSuggestions = {
  '/': [
    'Bienvenido a SuperPAES. ¿Te gustaría hacer un tour completo del sistema?',
    'Puedo ayudarte a configurar tus objetivos PAES desde el inicio.',
    'Te recomiendo comenzar con el diagnóstico para personalizar tu experiencia.',
  ],
  '/lectoguia': [
    'Esta es LectoGuía IA, tu asistente de comprensión lectora personalizado.',
    '¿Quieres que te muestre cómo generar ejercicios adaptativos?',
    'Puedes subir textos o imágenes para análisis instantáneo.',
  ],
  '/diagnostic': [
    'El sistema de diagnóstico evaluará tu nivel actual en todas las áreas PAES.',
    '¿Te ayudo a entender cómo interpretar los resultados?',
    'Cada pregunta se adapta según tu rendimiento previo.',
  ],
  '/planning': [
    'Aquí puedes crear tu plan de estudio personalizado basado en tus resultados.',
    '¿Quieres que te muestre cómo optimizar tu horario de estudio?',
    'El planificador se adapta automáticamente a tu progreso.',
  ],
};

export const VirtualAssistant: React.FC<VirtualAssistantProps> = ({
  currentRoute = '/',
  isFirstVisit = false,
  onStartTour,
  onShowHelp
}) => {
  const [state, setState] = useState<AssistantState>({
    isVisible: false,
    isExpanded: false,
    currentMode: 'contextual',
    tourProgress: 0,
    isInteracting: false
  });

  const [currentSuggestion, setCurrentSuggestion] = useState('');
  const [suggestionIndex, setSuggestionIndex] = useState(0);

  useEffect(() => {
    // Mostrar asistente automáticamente en primera visita
    if (isFirstVisit) {
      setState(prev => ({ ...prev, isVisible: true, isExpanded: true, currentMode: 'tour' }));
    } else {
      // Mostrar contextualmente después de 3 segundos
      setTimeout(() => {
        setState(prev => ({ ...prev, isVisible: true }));
      }, 3000);
    }
  }, [isFirstVisit]);

  useEffect(() => {
    // Actualizar sugerencias según la ruta actual
    const suggestions = contextualSuggestions[currentRoute as keyof typeof contextualSuggestions] || contextualSuggestions['/'];
    setCurrentSuggestion(suggestions[suggestionIndex % suggestions.length]);
  }, [currentRoute, suggestionIndex]);

  useEffect(() => {
    // Rotar sugerencias cada 8 segundos
    const interval = setInterval(() => {
      setSuggestionIndex(prev => prev + 1);
    }, 8000);

    return () => clearInterval(interval);
  }, []);

  const handleQuickAction = (action: string) => {
    setState(prev => ({ ...prev, isInteracting: true }));
    
    switch (action) {
      case 'start_tour':
        setState(prev => ({ ...prev, currentMode: 'tour', isExpanded: true }));
        onStartTour?.('complete');
        break;
      case 'show_help':
        setState(prev => ({ ...prev, currentMode: 'help', isExpanded: true }));
        onShowHelp?.();
        break;
      case 'start_chat':
        setState(prev => ({ ...prev, currentMode: 'chat', isExpanded: true }));
        break;
      case 'minimize':
        setState(prev => ({ ...prev, isExpanded: false }));
        break;
      default:
        break;
    }

    setTimeout(() => {
      setState(prev => ({ ...prev, isInteracting: false }));
    }, 500);
  };

  const renderContextualMode = () => (
    <div className="space-y-4">
      <motion.div
        key={currentSuggestion}
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-white/90 text-sm leading-relaxed"
      >
        {currentSuggestion}
      </motion.div>

      <div className="flex flex-wrap gap-2">
        <Button
          size="sm"
          onClick={() => handleQuickAction('start_tour')}
          className="bg-cyan-500/20 hover:bg-cyan-500/30 text-cyan-400 border-cyan-500/30"
        >
          <Play className="w-3 h-3 mr-1" />
          Tour Guiado
        </Button>
        <Button
          size="sm"
          onClick={() => handleQuickAction('start_chat')}
          className="bg-purple-500/20 hover:bg-purple-500/30 text-purple-400 border-purple-500/30"
        >
          <MessageCircle className="w-3 h-3 mr-1" />
          Preguntar
        </Button>
        <Button
          size="sm"
          onClick={() => handleQuickAction('show_help')}
          className="bg-green-500/20 hover:bg-green-500/30 text-green-400 border-green-500/30"
        >
          <Help className="w-3 h-3 mr-1" />
          Ayuda
        </Button>
      </div>
    </div>
  );

  const renderTourMode = () => (
    <div className="space-y-4">
      <div className="text-white/90 text-sm">
        {isFirstVisit ? '¡Bienvenido a SuperPAES!' : 'Tour del Sistema'}
      </div>
      
      <Progress value={state.tourProgress} className="h-2" />
      
      <div className="text-white/70 text-xs">
        Progreso del tour: {Math.round(state.tourProgress)}%
      </div>

      <div className="flex gap-2">
        <Button
          size="sm"
          onClick={() => handleQuickAction('start_tour')}
          className="bg-blue-500/20 hover:bg-blue-500/30 text-blue-400"
        >
          {state.tourProgress > 0 ? 'Continuar' : 'Comenzar'} Tour
          <ArrowRight className="w-3 h-3 ml-1" />
        </Button>
        <Button
          size="sm"
          variant="ghost"
          onClick={() => setState(prev => ({ ...prev, currentMode: 'contextual' }))}
          className="text-white/60 hover:text-white"
        >
          Omitir
        </Button>
      </div>
    </div>
  );

  const renderChatMode = () => (
    <div className="space-y-4">
      <div className="text-white/90 text-sm">
        ¿En qué puedo ayudarte hoy?
      </div>
      
      <div className="bg-black/20 rounded-lg p-3 text-white/80 text-xs">
        Puedes preguntarme sobre cualquier funcionalidad del sistema, cómo estudiar para PAES, o solicitar explicaciones detalladas.
      </div>

      <Button
        size="sm"
        className="w-full bg-purple-500/20 hover:bg-purple-500/30 text-purple-400"
      >
        <MessageCircle className="w-3 h-3 mr-2" />
        Abrir Chat Completo
      </Button>
    </div>
  );

  const renderHelpMode = () => (
    <div className="space-y-4">
      <div className="text-white/90 text-sm">
        Centro de Ayuda
      </div>
      
      <div className="space-y-2">
        <Button
          size="sm"
          variant="ghost"
          className="w-full justify-start text-white/70 hover:text-white"
        >
          📚 Guías de uso
        </Button>
        <Button
          size="sm"
          variant="ghost"
          className="w-full justify-start text-white/70 hover:text-white"
        >
          🎯 Configurar objetivos PAES
        </Button>
        <Button
          size="sm"
          variant="ghost"
          className="w-full justify-start text-white/70 hover:text-white"
        >
          💡 Tips de estudio
        </Button>
        <Button
          size="sm"
          variant="ghost"
          className="w-full justify-start text-white/70 hover:text-white"
        >
          ⚙️ Configuración
        </Button>
      </div>
    </div>
  );

  const renderContent = () => {
    switch (state.currentMode) {
      case 'tour':
        return renderTourMode();
      case 'chat':
        return renderChatMode();
      case 'help':
        return renderHelpMode();
      default:
        return renderContextualMode();
    }
  };

  if (!state.isVisible) return null;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0, x: -100, scale: 0.8 }}
        animate={{ opacity: 1, x: 0, scale: 1 }}
        exit={{ opacity: 0, x: -100, scale: 0.8 }}
        className="fixed bottom-6 left-6 z-50 max-w-sm"
      >
        <Card className="bg-black/80 backdrop-blur-xl border-white/20 shadow-2xl">
          <CardHeader className="pb-2">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <motion.div
                  className="p-2 rounded-xl bg-gradient-to-r from-cyan-500 to-purple-500"
                  animate={{ 
                    rotate: state.isInteracting ? [0, 5, -5, 0] : 0,
                    scale: state.isInteracting ? [1, 1.1, 1] : 1
                  }}
                  transition={{ duration: 0.5 }}
                >
                  <Bot className="w-4 h-4 text-white" />
                </motion.div>
                <div>
                  <CardTitle className="text-white text-sm">Asistente Virtual</CardTitle>
                  <div className="flex items-center gap-2">
                    <Badge className="bg-green-500/20 text-green-400 border-green-500/30 text-xs">
                      <span className="w-1.5 h-1.5 bg-green-400 rounded-full mr-1 animate-pulse" />
                      Activo
                    </Badge>
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-1">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setState(prev => ({ ...prev, isExpanded: !prev.isExpanded }))}
                  className="h-6 w-6 p-0 text-white/60 hover:text-white"
                >
                  {state.isExpanded ? <Pause className="w-3 h-3" /> : <Play className="w-3 h-3" />}
                </Button>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setState(prev => ({ ...prev, isVisible: false }))}
                  className="h-6 w-6 p-0 text-white/40 hover:text-white/60"
                >
                  <X className="w-3 h-3" />
                </Button>
              </div>
            </div>
          </CardHeader>

          <AnimatePresence>
            {state.isExpanded && (
              <motion.div
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: 'auto', opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
                transition={{ duration: 0.3 }}
              >
                <CardContent className="pt-0">
                  {renderContent()}
                </CardContent>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Indicador de actividad neural */}
          <div className="absolute -bottom-2 left-4">
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
        </Card>

        {/* Floating action button when minimized */}
        {!state.isExpanded && (
          <motion.div
            className="absolute -top-2 -right-2"
            animate={{ rotate: 360 }}
            transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
          >
            <Button
              size="sm"
              onClick={() => setState(prev => ({ ...prev, isExpanded: true }))}
              className="h-8 w-8 rounded-full bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600"
            >
              <Sparkles className="w-4 h-4" />
            </Button>
          </motion.div>
        )}
      </motion.div>
    </AnimatePresence>
  );
};
