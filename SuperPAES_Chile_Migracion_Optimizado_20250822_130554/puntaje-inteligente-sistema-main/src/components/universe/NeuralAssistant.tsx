/* eslint-disable react-refresh/only-export-components */

import React, { useState } from 'react';
import type { SafeString, SafeNumber, SafeBoolean, APIResponse, OperationResult } from '../types/core';
import { motion, AnimatePresence } from 'framer-motion';
import { Card, CardContent } from '../../components/ui/card';
import { Button } from '../../components/ui/button';
import { Badge } from '../../components/ui/badge';
import { MessageCircle, Brain, Zap, X } from 'lucide-react';

type UniverseMode = 'overview' | 'subject' | 'neural' | 'prediction' | 'progress';

interface UserMetrics {
  totalNodes: number;
  totalCompleted: number;
  overallProgress: number;
  projectedScore: number;
  neuralPower: number;
}

interface NeuralAssistantProps {
  mode: UniverseMode;
  selectedGalaxy: string | null;
  userMetrics: UserMetrics;
}

export const NeuralAssistant: React.FC<NeuralAssistantProps> = ({
  mode,
  selectedGalaxy,
  userMetrics
}) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const [messages, setMessages] = useState<Array<{id: string, text: string, type: 'ai' | 'user'}>>([
    {
      id: '1',
      text: `Â¡Bienvenido al Universo Neural PAES! Tu progreso actual es del ${userMetrics.overallProgress}%. Â¿En quÃ© galaxia te gustarÃ­a enfocar tu aprendizaje?`,
      type: 'ai'
    }
  ]);

  const getContextualMessage = () => {
    switch (mode) {
      case 'neural':
        return "El Centro Neural SuperPAES estÃ¡ analizando tu perfil vocacional. BasÃ¡ndome en tu progreso, puedo recomendarte carreras alineadas con tus fortalezas.";
      case 'subject':
        return selectedGalaxy 
          ? `Explorando la ${selectedGalaxy}. Veo que has completado ${userMetrics.totalCompleted} nodos. Â¿Te gustarÃ­a que genere ejercicios especÃ­ficos?`
          : "Selecciona una galaxia para comenzar tu viaje de aprendizaje personalizado.";
      case 'prediction':
        return `Con tu proyecciÃ³n actual de ${userMetrics.projectedScore} puntos PAES, tienes acceso a mÃºltiples carreras. Â¿Quieres explorar opciones especÃ­ficas?`;
      case 'progress':
        return "Tu evoluciÃ³n temporal muestra un crecimiento consistente. Las Ã¡reas de mayor potencial estÃ¡n iluminÃ¡ndose en la nebulosa.";
      default:
        return "El universo de conocimiento se despliega ante ti. Cada galaxia representa un dominio del saber esperando ser explorado.";
    }
  };

  return (
    <motion.div 
      className="fixed bottom-4 right-4 z-50 pointer-events-auto"
      initial={{ opacity: 0, scale: 0.8, y: 50 }}
      animate={{ opacity: 1, scale: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 1 }}
    >
      <AnimatePresence>
        {!isExpanded ? (
          <motion.div
            key="collapsed"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <Button
              onClick={() => setIsExpanded(true)}
              size="lg"
              className="bg-gradient-to-r from-cyan-600 to-purple-600 hover:from-cyan-700 hover:to-purple-700 text-white rounded-full w-16 h-16 shadow-2xl"
            >
              <div className="relative">
                <Brain className="w-8 h-8" />
                <motion.div
                  className="absolute -top-1 -right-1 w-3 h-3 bg-green-400 rounded-full"
                  animate={{ scale: [1, 1.3, 1] }}
                  transition={{ duration: 2, repeat: Infinity }}
                />
              </div>
            </Button>
          </motion.div>
        ) : (
          <motion.div
            key="expanded"
            initial={{ opacity: 0, scale: 0.9, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 20 }}
            className="w-96"
          >
            <Card className="bg-black/40 backdrop-blur-xl border-cyan-500/30 shadow-2xl">
              <CardContent className="p-0">
                {/* Header */}
                <div className="p-4 border-b border-cyan-500/30">
                  <div className="flex items-center justify-between text-white">
                    <div className="flex items-center space-x-2">
                      <div className="w-8 h-8 bg-gradient-to-r from-cyan-500 to-purple-500 rounded-full flex items-center justify-center">
                        <Brain className="w-4 h-4" />
                      </div>
                      <div>
                        <div className="font-bold">IA Neural</div>
                        <div className="text-xs text-cyan-300">Asistente CÃ³smico</div>
                      </div>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Badge className="bg-green-600">
                        <Zap className="w-3 h-3 mr-1" />
                        Activo
                      </Badge>
                      <Button
                        onClick={() => setIsExpanded(false)}
                        variant="ghost"
                        size="sm"
                        className="text-white hover:bg-white/10"
                      >
                        <X className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>
                </div>

                {/* Mensaje Contextual */}
                <div className="p-4">
                  <motion.div
                    className="bg-gradient-to-r from-cyan-500/20 to-purple-500/20 rounded-lg p-3 text-white text-sm"
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.2 }}
                  >
                    <div className="flex items-start space-x-2">
                      <MessageCircle className="w-4 h-4 mt-0.5 text-cyan-400 flex-shrink-0" />
                      <div>{getContextualMessage()}</div>
                    </div>
                  </motion.div>
                </div>

                {/* MÃ©tricas RÃ¡pidas */}
                <div className="px-4 pb-4">
                  <div className="grid grid-cols-2 gap-2 text-white text-xs">
                    <div className="bg-white/10 rounded p-2 text-center">
                      <div className="font-bold text-cyan-400">{userMetrics.projectedScore}</div>
                      <div>ProyecciÃ³n PAES</div>
                    </div>
                    <div className="bg-white/10 rounded p-2 text-center">
                      <div className="font-bold text-purple-400">{userMetrics.neuralPower}%</div>
                      <div>Poder Neural</div>
                    </div>
                  </div>
                </div>

                {/* Acciones RÃ¡pidas */}
                <div className="p-4 border-t border-cyan-500/30 space-y-2">
                  <Button 
                    variant="outline" 
                    size="sm" 
                    className="w-full border-cyan-500/50 text-cyan-300 hover:bg-cyan-500/10"
                  >
                    Generar Ejercicio IA
                  </Button>
                  <Button 
                    variant="outline" 
                    size="sm" 
                    className="w-full border-purple-500/50 text-purple-300 hover:bg-purple-500/10"
                  >
                    AnÃ¡lisis Vocacional
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

