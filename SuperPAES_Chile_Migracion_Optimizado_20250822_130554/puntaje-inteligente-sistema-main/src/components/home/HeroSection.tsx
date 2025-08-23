/* eslint-disable react-refresh/only-export-components */
import { FC } from 'react';
import type { SafeString, SafeNumber, SafeBoolean, APIResponse, OperationResult } from '../types/core';

import { motion } from 'framer-motion';
import { Card, CardContent } from '../../components/ui/card';
import { Progress } from '../../components/ui/progress';
import { Badge } from '../../components/ui/badge';
import { Trophy, Target, Clock, Brain } from 'lucide-react';

interface HeroSectionProps {
  userName: string;
  globalProgress: number;
  currentPhase: string;
  totalNodes: number;
  completedNodes: number;
  projectedScore: number;
}

export const HeroSection: FC<HeroSectionProps> = ({
  userName,
  globalProgress,
  currentPhase,
  totalNodes,
  completedNodes,
  projectedScore
}) => {
  const getPhaseColor = (phase: string) => {
    switch (phase) {
      case 'DIAGNOSIS': return 'bg-blue-500';
      case 'FOUNDATION': return 'bg-green-500';
      case 'DEVELOPMENT': return 'bg-yellow-500';
      case 'MASTERY': return 'bg-purple-500';
      default: return 'bg-gray-500';
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-primary via-primary/90 to-primary/80 p-8 text-white"
    >
      {/* Background Pattern */}
      <div className="absolute inset-0 opacity-10">
        <div className="absolute top-10 right-10 h-32 w-32 rounded-full border-2 border-white/20" />
        <div className="absolute bottom-10 left-10 h-24 w-24 rounded-full border-2 border-white/20" />
        <div className="absolute top-1/2 left-1/2 h-40 w-40 rounded-full border border-white/10 transform -translate-x-1/2 -translate-y-1/2" />
      </div>

      <div className="relative z-10">
        <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-6">
          {/* Main Content */}
          <div className="flex-1">
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.2 }}
            >
              <h1 className="text-4xl lg:text-5xl font-bold mb-2">
                Â¡Hola, {userName}! ðŸ‘‹
              </h1>
              <p className="text-xl opacity-90 mb-4">
                Tu preparaciÃ³n PAES estÃ¡ en marcha
              </p>
              <div className="flex items-center gap-3 mb-6">
                <Badge 
                  className={`${getPhaseColor(currentPhase)} text-white border-0 px-3 py-1`}
                >
                  Fase: {currentPhase}
                </Badge>
                <span className="text-sm opacity-75">
                  {completedNodes} de {totalNodes} nodos completados
                </span>
              </div>
            </motion.div>

            {/* Progress Bar */}
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.4 }}
              className="mb-6"
            >
              <div className="flex justify-between text-sm mb-2">
                <span>Progreso General</span>
                <span className="font-semibold">{Math.round(globalProgress)}%</span>
              </div>
              <Progress 
                value={globalProgress} 
                className="h-3 bg-white/20" 
              />
            </motion.div>
          </div>

          {/* Stats Cards */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.6 }}
            className="flex flex-col sm:flex-row lg:flex-col gap-4"
          >
            <Card className="bg-white/10 backdrop-blur border-white/20 text-white">
              <CardContent className="p-4 text-center">
                <Trophy className="h-8 w-8 mx-auto mb-2 text-yellow-300" />
                <div className="text-2xl font-bold">{projectedScore}</div>
                <div className="text-xs opacity-75">Puntaje Proyectado</div>
              </CardContent>
            </Card>

            <Card className="bg-white/10 backdrop-blur border-white/20 text-white">
              <CardContent className="p-4 text-center">
                <Target className="h-8 w-8 mx-auto mb-2 text-green-300" />
                <div className="text-2xl font-bold">{Math.round(globalProgress)}%</div>
                <div className="text-xs opacity-75">Completado</div>
              </CardContent>
            </Card>
          </motion.div>
        </div>
      </div>
    </motion.div>
  );
};

