
import React from 'react';
import { motion } from 'framer-motion';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { NeuralDimensionConfig, NeuralDimension } from '../config/neuralTypes';

interface NeuralPhasesProps {
  dimensionsByPhase: Record<string, NeuralDimensionConfig[]>;
  activeDimension: NeuralDimension;
  onDimensionActivation: (dimensionId: NeuralDimension) => void;
  getMetricForDimension: (dimensionId: NeuralDimension) => number;
}

export const NeuralPhases: React.FC<NeuralPhasesProps> = ({
  dimensionsByPhase,
  activeDimension,
  onDimensionActivation,
  getMetricForDimension
}) => {
  const phaseInfo = {
    core: { 
      title: 'Centro Neural', 
      description: 'Hub principal del ecosistema',
      color: 'from-cyan-600 to-blue-600'
    },
    navigation: { 
      title: 'Navegación 3D', 
      description: 'Universe educativo inmersivo',
      color: 'from-purple-600 to-pink-600'
    },
    coordination: { 
      title: 'Coordinación IA', 
      description: 'SuperPAES inteligente',
      color: 'from-yellow-600 to-orange-600'
    },
    learning: { 
      title: 'Flujo de Aprendizaje', 
      description: 'Gamificación con datos reales',
      color: 'from-green-600 to-emerald-600'
    },
    gamification: { 
      title: 'Sistema Gamificado', 
      description: 'Competencia y logros',
      color: 'from-pink-600 to-rose-600'
    },
    intelligence: { 
      title: 'Inteligencia Cross-Module', 
      description: 'Herramientas conectadas',
      color: 'from-indigo-600 to-purple-600'
    }
  };

  const renderPhase = (phaseKey: string, dimensions: NeuralDimensionConfig[]) => {
    const phase = phaseInfo[phaseKey as keyof typeof phaseInfo];
    if (!phase || dimensions.length === 0) return null;

    const avgProgress = dimensions.reduce((acc, dim) => 
      acc + getMetricForDimension(dim.id), 0) / dimensions.length;

    return (
      <motion.div
        key={phaseKey}
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: Object.keys(phaseInfo).indexOf(phaseKey) * 0.1 }}
        className="mb-8"
      >
        <Card className="bg-gradient-to-r from-black/40 to-slate-900/40 backdrop-blur-xl border-white/10">
          <CardHeader className="pb-4">
            <div className="flex items-center justify-between">
              <div>
                <CardTitle className={`text-lg font-bold bg-gradient-to-r ${phase.color} bg-clip-text text-transparent`}>
                  {phase.title}
                </CardTitle>
                <p className="text-sm text-white/70 mt-1">{phase.description}</p>
              </div>
              <div className="text-right">
                <div className="text-2xl font-bold text-white">{Math.round(avgProgress)}%</div>
                <div className="text-xs text-white/60">Progreso Fase</div>
              </div>
            </div>
            <Progress value={avgProgress} className="h-2 bg-white/10" />
          </CardHeader>
          
          <CardContent className="pt-0">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
              {dimensions.map((dimension) => {
                const Icon = dimension.icon;
                const isActive = activeDimension === dimension.id;
                const progress = getMetricForDimension(dimension.id);
                
                return (
                  <motion.div
                    key={dimension.id}
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                  >
                    <Button
                      onClick={() => onDimensionActivation(dimension.id)}
                      className={`
                        h-auto p-4 w-full relative overflow-hidden
                        ${isActive 
                          ? `bg-gradient-to-r ${phase.color} text-white shadow-lg shadow-cyan-500/25` 
                          : 'bg-white/5 hover:bg-white/10 text-white border border-white/10'
                        }
                      `}
                      variant="ghost"
                    >
                      {/* Progress overlay */}
                      <div 
                        className="absolute bottom-0 left-0 h-1 bg-gradient-to-r from-cyan-400 to-purple-400 transition-all duration-500"
                        style={{ width: `${progress}%` }}
                      />
                      
                      <div className="flex flex-col items-center space-y-3 relative z-10">
                        <div className="relative">
                          <Icon 
                            className="w-8 h-8 transition-colors duration-300" 
                            style={{ color: isActive ? '#FFFFFF' : dimension.color }} 
                          />
                          {isActive && (
                            <motion.div
                              className="absolute inset-0 w-8 h-8 rounded-full border-2 border-white"
                              animate={{ rotate: 360 }}
                              transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
                            />
                          )}
                        </div>
                        
                        <div className="text-center">
                          <div className="font-medium text-sm leading-tight">
                            {dimension.name}
                          </div>
                          <div className="text-xs opacity-70 mt-1 line-clamp-2">
                            {dimension.description}
                          </div>
                        </div>

                        <div className="flex items-center space-x-2">
                          <Badge 
                            className={`text-xs ${
                              isActive ? 'bg-white/20' : 'bg-white/10'
                            }`}
                          >
                            {Math.round(progress)}%
                          </Badge>
                          {progress >= 80 && (
                            <Badge className="bg-green-600 text-white text-xs">
                              ✓ Dominado
                            </Badge>
                          )}
                        </div>
                      </div>

                      {/* Active indicator */}
                      {isActive && (
                        <motion.div
                          className="absolute top-2 right-2 w-3 h-3 bg-white rounded-full"
                          animate={{ scale: [1, 1.2, 1] }}
                          transition={{ duration: 1, repeat: Infinity }}
                        />
                      )}
                    </Button>
                  </motion.div>
                );
              })}
            </div>
          </CardContent>
        </Card>
      </motion.div>
    );
  };

  return (
    <div className="space-y-6">
      {Object.entries(dimensionsByPhase).map(([phaseKey, dimensions]) => 
        renderPhase(phaseKey, dimensions)
      )}
    </div>
  );
};
