
import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { 
  Brain, 
  Target, 
  TrendingUp, 
  Zap, 
  Globe, 
  ArrowLeft,
  Sparkles
} from 'lucide-react';

type UniverseMode = 'overview' | 'subject' | 'neural' | 'prediction' | 'progress';

interface Galaxy {
  id: string;
  name: string;
  color: string;
  nodes: number;
  completed: number;
  description: string;
}

interface UniverseNavigationProps {
  mode: UniverseMode;
  onModeChange: (mode: UniverseMode) => void;
  onReturnToOverview: () => void;
  galaxies: Galaxy[];
  selectedGalaxy: string | null;
  isTransitioning: boolean;
}

export const UniverseNavigation: React.FC<UniverseNavigationProps> = ({
  mode,
  onModeChange,
  onReturnToOverview,
  galaxies,
  selectedGalaxy,
  isTransitioning
}) => {
  const navigationModes = [
    {
      id: 'overview' as UniverseMode,
      name: 'Vista General',
      icon: Globe,
      color: 'from-blue-500 to-cyan-500',
      description: 'Explorar todo el universo'
    },
    {
      id: 'neural' as UniverseMode,
      name: 'Centro Neural',
      icon: Brain,
      color: 'from-purple-500 to-pink-500',
      description: 'SuperPAES Coordinador'
    },
    {
      id: 'prediction' as UniverseMode,
      name: 'Predicción IA',
      icon: Target,
      color: 'from-green-500 to-teal-500',
      description: 'Análisis vocacional'
    },
    {
      id: 'progress' as UniverseMode,
      name: 'Progreso Cósmico',
      icon: TrendingUp,
      color: 'from-orange-500 to-red-500',
      description: 'Evolución temporal'
    }
  ];

  const selectedGalaxyData = galaxies.find(g => g.id === selectedGalaxy);

  return (
    <motion.div 
      className="fixed left-4 top-1/2 transform -translate-y-1/2 z-40 space-y-4 pointer-events-auto"
      initial={{ opacity: 0, x: -100 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.8 }}
    >
      {/* Retorno a vista general */}
      <AnimatePresence>
        {mode !== 'overview' && (
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.8 }}
          >
            <Button
              onClick={onReturnToOverview}
              variant="outline"
              className="bg-black/40 backdrop-blur-lg border-white/30 text-white hover:bg-white/10 flex items-center space-x-2"
              disabled={isTransitioning}
            >
              <ArrowLeft className="w-4 h-4" />
              <span>Universo</span>
            </Button>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Información de galaxia seleccionada */}
      <AnimatePresence>
        {selectedGalaxyData && mode === 'subject' && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
          >
            <Card className="bg-black/40 backdrop-blur-lg border-white/20 min-w-64">
              <CardContent className="p-4">
                <div className="text-white text-center">
                  <div 
                    className="text-xl font-bold mb-2"
                    style={{ color: selectedGalaxyData.color }}
                  >
                    {selectedGalaxyData.name}
                  </div>
                  <div className="text-sm text-gray-300 mb-3">
                    {selectedGalaxyData.description}
                  </div>
                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <span>Nodos:</span>
                      <span>{selectedGalaxyData.completed}/{selectedGalaxyData.nodes}</span>
                    </div>
                    <div className="w-full bg-gray-700 rounded-full h-2">
                      <div 
                        className="h-2 rounded-full transition-all duration-500"
                        style={{ 
                          backgroundColor: selectedGalaxyData.color,
                          width: `${(selectedGalaxyData.completed / selectedGalaxyData.nodes) * 100}%`
                        }}
                      />
                    </div>
                    <Badge 
                      className="w-full justify-center"
                      style={{ backgroundColor: selectedGalaxyData.color }}
                    >
                      {Math.round((selectedGalaxyData.completed / selectedGalaxyData.nodes) * 100)}% Completado
                    </Badge>
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Modos de navegación */}
      <Card className="bg-black/40 backdrop-blur-lg border-white/20">
        <CardContent className="p-4">
          <div className="space-y-3">
            <div className="text-white font-bold text-center mb-4 flex items-center justify-center space-x-2">
              <Sparkles className="w-4 h-4" />
              <span>Modos Cósmicos</span>
            </div>
            
            {navigationModes.map((navMode) => (
              <motion.div key={navMode.id}>
                <Button
                  onClick={() => onModeChange(navMode.id)}
                  variant={mode === navMode.id ? "default" : "outline"}
                  className={`w-full justify-start space-x-3 ${
                    mode === navMode.id 
                      ? `bg-gradient-to-r ${navMode.color} text-white border-none shadow-lg` 
                      : 'bg-black/20 border-white/30 text-white hover:bg-white/10'
                  }`}
                  disabled={isTransitioning}
                >
                  <navMode.icon className="w-4 h-4" />
                  <div className="text-left flex-1">
                    <div className="font-medium">{navMode.name}</div>
                    <div className="text-xs opacity-80">{navMode.description}</div>
                  </div>
                  {mode === navMode.id && (
                    <motion.div
                      className="w-2 h-2 bg-white rounded-full"
                      animate={{ scale: [1, 1.3, 1] }}
                      transition={{ duration: 1, repeat: Infinity }}
                    />
                  )}
                </Button>
              </motion.div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Lista de galaxias (solo en modo overview) */}
      <AnimatePresence>
        {mode === 'overview' && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
          >
            <Card className="bg-black/40 backdrop-blur-lg border-white/20">
              <CardContent className="p-4">
                <div className="text-white font-bold text-center mb-3">
                  Galaxias Activas
                </div>
                <div className="space-y-2">
                  {galaxies.map((galaxy) => (
                    <motion.div
                      key={galaxy.id}
                      className="flex items-center space-x-3 p-2 rounded-lg hover:bg-white/10 cursor-pointer transition-colors"
                      whileHover={{ scale: 1.02 }}
                      onClick={() => onModeChange('subject')}
                    >
                      <div 
                        className="w-3 h-3 rounded-full"
                        style={{ backgroundColor: galaxy.color }}
                      />
                      <div className="flex-1">
                        <div className="text-sm font-medium">{galaxy.name}</div>
                        <div className="text-xs text-gray-400">
                          {galaxy.completed}/{galaxy.nodes} nodos
                        </div>
                      </div>
                      <div className="text-xs" style={{ color: galaxy.color }}>
                        {Math.round((galaxy.completed / galaxy.nodes) * 100)}%
                      </div>
                    </motion.div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
};
