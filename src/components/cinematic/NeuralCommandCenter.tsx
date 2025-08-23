
import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Brain, Target, BookOpen, BarChart3, Zap, Eye, Heart } from 'lucide-react';

interface NeuralCommandCenterProps {
  neuralActivity: number;
  emotionalState: string;
  currentModule: string;
  onModuleChange: (module: string) => void;
}

export const NeuralCommandCenter: React.FC<NeuralCommandCenterProps> = ({
  neuralActivity,
  emotionalState,
  currentModule,
  onModuleChange
}) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const [connectionStrength, setConnectionStrength] = useState(85);

  const modules = [
    {
      id: 'dashboard',
      name: 'Centro Neural',
      icon: Brain,
      color: 'from-purple-500 to-pink-500',
      description: 'Dashboard principal'
    },
    {
      id: 'paes',
      name: 'PAES Universe',
      icon: Target,
      color: 'from-blue-500 to-cyan-500',
      description: 'Evaluaciones PAES'
    },
    {
      id: 'unified',
      name: 'Sistema Unificado',
      icon: BookOpen,
      color: 'from-green-500 to-emerald-500',
      description: 'Plataforma completa'
    },
    {
      id: 'analytics',
      name: 'Neural Analytics',
      icon: BarChart3,
      color: 'from-yellow-500 to-orange-500',
      description: 'Análisis avanzado'
    }
  ];

  useEffect(() => {
    const interval = setInterval(() => {
      setConnectionStrength(prev => {
        const base = 80 + Math.sin(Date.now() / 2000) * 15;
        return Math.round(base + (Math.random() - 0.5) * 5);
      });
    }, 500);

    return () => clearInterval(interval);
  }, []);

  const getEmotionalColor = () => {
    switch (emotionalState) {
      case 'focused': return 'text-blue-400';
      case 'excited': return 'text-yellow-400';
      case 'calm': return 'text-green-400';
      case 'stressed': return 'text-red-400';
      default: return 'text-cyan-400';
    }
  };

  return (
    <motion.div
      className="neural-command-center fixed top-6 left-6 z-40"
      initial={{ opacity: 0, scale: 0.8 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 1, ease: "easeOut" }}
    >
      {/* Main Neural Hub */}
      <motion.div
        className="neural-hub relative"
        animate={{
          boxShadow: [
            '0 0 20px rgba(139, 92, 246, 0.3)',
            '0 0 30px rgba(6, 182, 212, 0.4)',
            '0 0 20px rgba(139, 92, 246, 0.3)'
          ]
        }}
        transition={{ duration: 3, repeat: Infinity }}
      >
        <div className="bg-black/60 backdrop-blur-xl rounded-2xl border border-white/20 p-4 min-w-[280px]">
          {/* Neural Activity Header */}
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-3">
              <motion.div
                className="p-2 rounded-xl bg-gradient-to-r from-purple-600 to-cyan-600"
                animate={{ rotate: [0, 360] }}
                transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
              >
                <Brain className="w-5 h-5 text-white" />
              </motion.div>
              <div>
                <h3 className="text-white font-bold text-sm">Centro Neural</h3>
                <p className="text-white/60 text-xs">Sistema Activo</p>
              </div>
            </div>
            
            <motion.button
              onClick={() => setIsExpanded(!isExpanded)}
              className="text-white/60 hover:text-white transition-colors"
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.95 }}
            >
              <Eye className="w-4 h-4" />
            </motion.button>
          </div>

          {/* Neural Metrics */}
          <div className="space-y-3">
            {/* Activity Level */}
            <div className="flex items-center justify-between">
              <span className="text-white/70 text-xs">Actividad Neural:</span>
              <div className="flex items-center gap-2">
                <div className="w-16 h-2 bg-white/20 rounded-full overflow-hidden">
                  <motion.div
                    className="h-full bg-gradient-to-r from-purple-400 to-cyan-400"
                    animate={{ width: `${neuralActivity}%` }}
                    transition={{ duration: 0.3 }}
                  />
                </div>
                <span className="text-cyan-400 font-bold text-xs">{Math.round(neuralActivity)}%</span>
              </div>
            </div>

            {/* Connection Strength */}
            <div className="flex items-center justify-between">
              <span className="text-white/70 text-xs">Conexión Neural:</span>
              <div className="flex items-center gap-2">
                <Zap className="w-3 h-3 text-yellow-400" />
                <span className="text-yellow-400 font-bold text-xs">{connectionStrength}%</span>
              </div>
            </div>

            {/* Emotional State */}
            <div className="flex items-center justify-between">
              <span className="text-white/70 text-xs">Estado Emocional:</span>
              <div className="flex items-center gap-2">
                <Heart className="w-3 h-3 text-pink-400" />
                <span className={`font-bold text-xs ${getEmotionalColor()}`}>
                  {emotionalState.charAt(0).toUpperCase() + emotionalState.slice(1)}
                </span>
              </div>
            </div>
          </div>

          {/* Module Navigation */}
          <AnimatePresence>
            {isExpanded && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                exit={{ opacity: 0, height: 0 }}
                transition={{ duration: 0.3 }}
                className="mt-4 pt-4 border-t border-white/10"
              >
                <h4 className="text-white font-semibold text-xs mb-3">Módulos Neurales</h4>
                <div className="space-y-2">
                  {modules.map((module, index) => (
                    <motion.button
                      key={module.id}
                      onClick={() => onModuleChange(module.id)}
                      className={`w-full p-2 rounded-lg flex items-center gap-3 transition-all duration-300 ${
                        currentModule === module.id
                          ? `bg-gradient-to-r ${module.color} text-white`
                          : 'bg-white/5 hover:bg-white/10 text-white/80 hover:text-white'
                      }`}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: index * 0.1 }}
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                    >
                      <div className={`p-1.5 rounded-md ${
                        currentModule === module.id 
                          ? 'bg-white/20' 
                          : 'bg-white/10'
                      }`}>
                        <module.icon className="w-3 h-3" />
                      </div>
                      <div className="flex-1 text-left">
                        <div className="font-medium text-xs">{module.name}</div>
                        <div className="text-xs opacity-70">{module.description}</div>
                      </div>
                    </motion.button>
                  ))}
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Neural Pulse Effect */}
        <motion.div
          className="absolute inset-0 rounded-2xl border-2 border-purple-500/30"
          animate={{
            scale: [1, 1.05, 1],
            opacity: [0.3, 0.6, 0.3]
          }}
          transition={{
            duration: 2,
            repeat: Infinity,
            ease: "easeInOut"
          }}
        />
      </motion.div>

      {/* Neural Connections */}
      <div className="neural-connections absolute -top-2 -left-2 w-8 h-8 pointer-events-none">
        {Array.from({ length: 8 }).map((_, i) => (
          <motion.div
            key={i}
            className="absolute w-1 h-1 bg-cyan-400 rounded-full"
            style={{
              left: `${20 + Math.cos(i * 45 * Math.PI / 180) * 15}px`,
              top: `${20 + Math.sin(i * 45 * Math.PI / 180) * 15}px`
            }}
            animate={{
              opacity: [0.3, 1, 0.3],
              scale: [0.5, 1.5, 0.5]
            }}
            transition={{
              duration: 2,
              repeat: Infinity,
              delay: i * 0.25
            }}
          />
        ))}
      </div>
    </motion.div>
  );
};
