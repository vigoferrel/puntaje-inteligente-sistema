
import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { 
  Bot,
  MessageCircle,
  TrendingUp,
  X,
  Minimize2,
  Maximize2,
  Settings,
  HelpCircle,
  Sparkles,
  Target,
  BookOpen,
  Brain
} from 'lucide-react';

interface VirtualAssistantProps {
  currentRoute: string;
  isFirstVisit: boolean;
  onStartTour: (tourType: string) => void;
  onShowHelp: () => void;
}

export const VirtualAssistant: React.FC<VirtualAssistantProps> = ({
  currentRoute,
  isFirstVisit,
  onStartTour,
  onShowHelp
}) => {
  const [isMinimized, setIsMinimized] = useState(false);
  const [showQuickActions, setShowQuickActions] = useState(false);
  const [contextualTips, setContextualTips] = useState<string[]>([]);

  // Generar tips contextuales basados en la ruta
  useEffect(() => {
    const tips = getContextualTips(currentRoute);
    setContextualTips(tips);
  }, [currentRoute]);

  const getContextualTips = (route: string): string[] => {
    switch (route) {
      case '/':
        return [
          'Comienza con LectoGuía para evaluar tu comprensión lectora',
          'Realiza un diagnóstico para conocer tu nivel actual',
          'Explora el planificador para crear tu estrategia de estudio'
        ];
      case '/lectoguia':
        return [
          'Sube una imagen o texto para análisis instantáneo',
          'Usa el chat para hacer preguntas específicas',
          'Practica con ejercicios adaptativos'
        ];
      case '/diagnostico':
        return [
          'Selecciona las áreas PAES que quieres evaluar',
          'Los resultados se adaptan a tu rendimiento',
          'Obtén recomendaciones personalizadas'
        ];
      default:
        return ['Explora todas las funcionalidades disponibles'];
    }
  };

  const handleTourSelection = (tourType: string) => {
    onStartTour(tourType);
    setShowQuickActions(false);
  };

  if (isMinimized) {
    return (
      <motion.div
        initial={{ scale: 0.8, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        className="fixed bottom-6 right-6 z-50"
      >
        <Button
          onClick={() => setIsMinimized(false)}
          className="w-14 h-14 rounded-full bg-gradient-to-r from-cyan-500 to-blue-500 hover:from-cyan-600 hover:to-blue-600 shadow-2xl"
        >
          <Bot className="w-6 h-6 text-white" />
        </Button>
      </motion.div>
    );
  }

  return (
    <motion.div
      initial={{ x: 100, opacity: 0 }}
      animate={{ x: 0, opacity: 1 }}
      className="fixed bottom-6 right-6 z-50 virtual-assistant"
    >
      <Card className="w-80 bg-black/90 backdrop-blur-xl border-white/20 shadow-2xl">
        <CardContent className="p-4">
          {/* Header */}
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <div className="p-2 rounded-lg bg-gradient-to-r from-cyan-500 to-blue-500">
                <Bot className="w-5 h-5 text-white" />
              </div>
              <div>
                <h3 className="text-white font-bold text-sm">Asistente SuperPAES</h3>
                <p className="text-white/60 text-xs">Aquí para ayudarte</p>
              </div>
            </div>
            
            <div className="flex items-center gap-1">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setShowQuickActions(!showQuickActions)}
                className="h-6 w-6 p-0 text-white/60 hover:text-white"
              >
                <Settings className="w-3 h-3" />
              </Button>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setIsMinimized(true)}
                className="h-6 w-6 p-0 text-white/60 hover:text-white"
              >
                <Minimize2 className="w-3 h-3" />
              </Button>
            </div>
          </div>

          {/* Bienvenida para primera visita */}
          {isFirstVisit && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="mb-4 p-3 bg-gradient-to-r from-purple-500/20 to-pink-500/20 rounded-lg border border-purple-500/30"
            >
              <div className="flex items-center gap-2 mb-2">
                <Sparkles className="w-4 h-4 text-purple-400" />
                <span className="text-white font-medium text-sm">¡Bienvenido!</span>
              </div>
              <p className="text-white/80 text-xs mb-3">
                Te guiaré por SuperPAES. ¿Quieres hacer un tour completo?
              </p>
              <Button
                onClick={() => handleTourSelection('complete')}
                className="w-full bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white text-xs"
              >
                Iniciar Tour Completo
              </Button>
            </motion.div>
          )}

          {/* Tips contextuales */}
          <div className="mb-4">
            <h4 className="text-white font-medium text-sm mb-2 flex items-center gap-2">
              <Target className="w-4 h-4 text-cyan-400" />
              Sugerencias
            </h4>
            <div className="space-y-2">
              {contextualTips.slice(0, 2).map((tip, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.1 }}
                  className="p-2 bg-white/5 rounded-lg border border-white/10"
                >
                  <p className="text-white/80 text-xs">{tip}</p>
                </motion.div>
              ))}
            </div>
          </div>

          {/* Acciones rápidas */}
          <AnimatePresence>
            {showQuickActions && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                exit={{ opacity: 0, height: 0 }}
                className="mb-4 space-y-2"
              >
                <Button
                  onClick={() => handleTourSelection('lectoguia')}
                  className="w-full bg-white/10 hover:bg-white/20 text-white text-xs justify-start"
                >
                  <BookOpen className="w-3 h-3 mr-2" />
                  Tour LectoGuía
                </Button>
                <Button
                  onClick={() => handleTourSelection('diagnostic')}
                  className="w-full bg-white/10 hover:bg-white/20 text-white text-xs justify-start"
                >
                  <Brain className="w-3 h-3 mr-2" />
                  Tour Diagnóstico
                </Button>
                <Button
                  onClick={() => handleTourSelection('planning')}
                  className="w-full bg-white/10 hover:bg-white/20 text-white text-xs justify-start"
                >
                  <TrendingUp className="w-3 h-3 mr-2" />
                  Tour Planificador
                </Button>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Acciones principales */}
          <div className="space-y-2">
            <Button
              onClick={onShowHelp}
              className="w-full bg-gradient-to-r from-cyan-500 to-blue-500 hover:from-cyan-600 hover:to-blue-600 text-white text-sm"
            >
              <MessageCircle className="w-4 h-4 mr-2" />
              Chat de Ayuda
            </Button>
            
            <Button
              onClick={() => handleTourSelection('complete')}
              variant="outline"
              className="w-full border-white/20 text-white hover:bg-white/10 text-sm"
            >
              <HelpCircle className="w-4 h-4 mr-2" />
              Tour Completo
            </Button>
          </div>

          {/* Estado */}
          <div className="mt-4 pt-3 border-t border-white/10">
            <div className="flex items-center justify-between">
              <Badge className="bg-green-500/20 text-green-400 border-green-500/30 text-xs">
                <div className="w-2 h-2 bg-green-400 rounded-full mr-1 animate-pulse"></div>
                Activo
              </Badge>
              <span className="text-white/40 text-xs">
                {new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
              </span>
            </div>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
};
