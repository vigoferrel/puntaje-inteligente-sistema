
import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { useNavigate } from 'react-router-dom';
import { 
  Brain, 
  Rocket, 
  Target, 
  BookOpen, 
  Calculator,
  Award,
  Volume2,
  VolumeX,
  Settings,
  Home,
  Globe,
  Zap,
  Eye,
  Activity,
  Star
} from 'lucide-react';

export const AdvancedFloatingNavigation: React.FC = () => {
  const [isExpanded, setIsExpanded] = useState(false);
  const [audioEnabled, setAudioEnabled] = useState(true);
  const [currentMode, setCurrentMode] = useState<'normal' | 'neural' | 'cosmic'>('normal');
  const [showMetrics, setShowMetrics] = useState(false);
  const navigate = useNavigate();

  const navigationItems = [
    { 
      icon: Home, 
      label: 'Centro Neural', 
      route: '/', 
      color: 'from-purple-500 to-cyan-500',
      priority: 'high'
    },
    { 
      icon: Brain, 
      label: 'LectoGuía IA', 
      route: '/lectoguia', 
      color: 'from-blue-500 to-indigo-500',
      priority: 'high'
    },
    { 
      icon: Target, 
      label: 'Diagnóstico Neural', 
      route: '/diagnostic', 
      color: 'from-red-500 to-pink-500',
      priority: 'high'
    },
    { 
      icon: Calculator, 
      label: 'Centro Financiero', 
      route: '/financial', 
      color: 'from-green-500 to-emerald-500',
      priority: 'medium'
    },
    { 
      icon: BookOpen, 
      label: 'Planificador IA', 
      route: '/planning', 
      color: 'from-orange-500 to-yellow-500',
      priority: 'medium'
    },
    { 
      icon: Globe, 
      label: 'Universo 3D', 
      route: '/universe', 
      color: 'from-pink-500 to-purple-500',
      priority: 'high'
    },
    { 
      icon: Award, 
      label: 'Logros & Métricas', 
      route: '/achievements', 
      color: 'from-yellow-500 to-orange-500',
      priority: 'low'
    }
  ];

  const handleNavigation = (route: string) => {
    console.log(`🎬 Navegación cinematográfica avanzada: ${route}`);
    navigate(route);
    setIsExpanded(false);
    
    // Efecto de sonido si está habilitado
    if (audioEnabled) {
      playNavigationSound();
    }
  };

  const playNavigationSound = () => {
    try {
      const context = new AudioContext();
      const oscillator = context.createOscillator();
      const gainNode = context.createGain();
      
      oscillator.connect(gainNode);
      gainNode.connect(context.destination);
      
      oscillator.frequency.setValueAtTime(523, context.currentTime);
      oscillator.frequency.exponentialRampToValueAtTime(659, context.currentTime + 0.1);
      gainNode.gain.setValueAtTime(0.1, context.currentTime);
      gainNode.gain.exponentialRampToValueAtTime(0.01, context.currentTime + 0.2);
      
      oscillator.start(context.currentTime);
      oscillator.stop(context.currentTime + 0.2);
    } catch (error) {
      console.log('Audio no disponible');
    }
  };

  const getModeColor = () => {
    switch (currentMode) {
      case 'neural': return 'from-blue-600 via-purple-600 to-cyan-600';
      case 'cosmic': return 'from-purple-600 via-pink-600 to-red-600';
      default: return 'from-purple-600 via-cyan-600 to-pink-600';
    }
  };

  return (
    <div className="fixed bottom-6 right-6 z-50">
      <AnimatePresence>
        {isExpanded && (
          <motion.div
            initial={{ opacity: 0, scale: 0.8, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.8, y: 20 }}
            className="absolute bottom-20 right-0 space-y-3 max-h-96 overflow-y-auto"
          >
            {/* Métricas del Sistema */}
            {showMetrics && (
              <motion.div
                initial={{ opacity: 0, x: 50 }}
                animate={{ opacity: 1, x: 0 }}
                className="bg-black/90 backdrop-blur-xl rounded-2xl p-4 border border-cyan-500/30 mb-4"
              >
                <div className="text-cyan-400 text-sm font-bold mb-2">Neural Metrics</div>
                <div className="space-y-2 text-xs">
                  <div className="flex justify-between">
                    <span className="text-white/70">Actividad Neural:</span>
                    <span className="text-green-400">96%</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-white/70">Rendimiento:</span>
                    <span className="text-blue-400">Óptimo</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-white/70">Conexiones:</span>
                    <span className="text-purple-400">847</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-white/70">Eficiencia:</span>
                    <span className="text-yellow-400">98.5%</span>
                  </div>
                </div>
              </motion.div>
            )}

            {/* Elementos de Navegación */}
            {navigationItems.map((item, index) => {
              const Icon = item.icon;
              return (
                <motion.div
                  key={item.route}
                  initial={{ opacity: 0, x: 50 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.05 }}
                  whileHover={{ scale: 1.05, x: -5 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <Button
                    onClick={() => handleNavigation(item.route)}
                    className={`bg-gradient-to-r ${item.color} hover:opacity-90 transition-all backdrop-blur-xl border border-white/20 flex items-center gap-3 px-4 py-3 w-full justify-start relative overflow-hidden`}
                  >
                    {/* Efecto de ondas neurales en botones prioritarios */}
                    {item.priority === 'high' && (
                      <motion.div
                        className="absolute inset-0 bg-white/10"
                        animate={{
                          x: ['-100%', '100%'],
                          opacity: [0, 0.5, 0]
                        }}
                        transition={{
                          duration: 2,
                          repeat: Infinity,
                          repeatDelay: 3
                        }}
                      />
                    )}
                    
                    <div className="relative">
                      <Icon className="w-5 h-5" />
                      {item.priority === 'high' && (
                        <motion.div
                          className="absolute -top-1 -right-1 w-2 h-2 bg-yellow-400 rounded-full"
                          animate={{ scale: [1, 1.2, 1], opacity: [0.7, 1, 0.7] }}
                          transition={{ duration: 1, repeat: Infinity }}
                        />
                      )}
                    </div>
                    
                    <div className="flex-1 text-left">
                      <span className="text-sm font-medium">{item.label}</span>
                      {item.priority === 'high' && (
                        <div className="text-xs opacity-75">Neural Ready</div>
                      )}
                    </div>
                  </Button>
                </motion.div>
              );
            })}

            {/* Controles Avanzados */}
            <motion.div
              initial={{ opacity: 0, x: 50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: navigationItems.length * 0.05 }}
              className="space-y-2"
            >
              {/* Audio y Métricas */}
              <div className="flex gap-2">
                <Button
                  onClick={() => setAudioEnabled(!audioEnabled)}
                  className={`${
                    audioEnabled 
                      ? 'bg-gradient-to-r from-green-500 to-blue-500' 
                      : 'bg-gradient-to-r from-gray-500 to-gray-600'
                  } hover:opacity-90 transition-all backdrop-blur-xl border border-white/20 p-3 flex-1`}
                >
                  {audioEnabled ? <Volume2 className="w-4 h-4" /> : <VolumeX className="w-4 h-4" />}
                </Button>
                
                <Button
                  onClick={() => setShowMetrics(!showMetrics)}
                  className={`${
                    showMetrics 
                      ? 'bg-gradient-to-r from-cyan-500 to-blue-500' 
                      : 'bg-gradient-to-r from-gray-500 to-gray-600'
                  } hover:opacity-90 transition-all backdrop-blur-xl border border-white/20 p-3 flex-1`}
                >
                  <Activity className="w-4 h-4" />
                </Button>
              </div>

              {/* Selector de Modo Cinematográfico */}
              <div className="flex gap-1">
                {(['normal', 'neural', 'cosmic'] as const).map((mode) => (
                  <Button
                    key={mode}
                    onClick={() => setCurrentMode(mode)}
                    className={`${
                      currentMode === mode
                        ? 'bg-gradient-to-r from-purple-600 to-pink-600'
                        : 'bg-black/40'
                    } hover:opacity-90 transition-all backdrop-blur-xl border border-white/20 p-2 flex-1 text-xs`}
                  >
                    {mode === 'neural' && <Brain className="w-3 h-3" />}
                    {mode === 'cosmic' && <Star className="w-3 h-3" />}
                    {mode === 'normal' && <Zap className="w-3 h-3" />}
                  </Button>
                ))}
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Botón Principal Mejorado */}
      <motion.div
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.9 }}
        className="relative"
      >
        <Button
          onClick={() => setIsExpanded(!isExpanded)}
          className={`w-16 h-16 rounded-full bg-gradient-to-r ${getModeColor()} hover:shadow-2xl transition-all shadow-2xl backdrop-blur-xl border-2 border-white/30 relative overflow-hidden`}
        >
          {/* Efecto de pulso neural */}
          <motion.div
            className="absolute inset-0 bg-white/20 rounded-full"
            animate={{ 
              scale: [1, 1.2, 1],
              opacity: [0, 0.5, 0]
            }}
            transition={{ 
              duration: 2, 
              repeat: Infinity,
              ease: "easeInOut"
            }}
          />
          
          <motion.div
            animate={{ rotate: isExpanded ? 180 : 0 }}
            transition={{ duration: 0.3 }}
            className="relative z-10"
          >
            {isExpanded ? (
              <Settings className="w-8 h-8 text-white" />
            ) : (
              <Rocket className="w-8 h-8 text-white" />
            )}
          </motion.div>
        </Button>
      </motion.div>

      {/* Badge de Estado Mejorado */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="absolute -top-3 -left-3"
      >
        <Badge className={`bg-gradient-to-r ${
          currentMode === 'neural' ? 'from-blue-400 to-cyan-400' :
          currentMode === 'cosmic' ? 'from-purple-400 to-pink-400' :
          'from-green-400 to-emerald-400'
        } text-black text-xs font-bold`}>
          {currentMode === 'neural' ? 'Neural' : 
           currentMode === 'cosmic' ? 'Cosmic' : 'AI'}
        </Badge>
      </motion.div>

      {/* Ondas de Energia */}
      {Array.from({ length: 3 }).map((_, i) => (
        <motion.div
          key={i}
          className={`absolute inset-0 rounded-full border-2 border-gradient-to-r ${getModeColor()}`}
          style={{ borderColor: currentMode === 'neural' ? '#06b6d4' : currentMode === 'cosmic' ? '#e11d48' : '#8b5cf6' }}
          animate={{ 
            scale: [1, 1.5 + i * 0.3, 1],
            opacity: [0.6, 0, 0.6]
          }}
          transition={{ 
            duration: 3 + i,
            repeat: Infinity,
            delay: i * 0.5,
            ease: "easeInOut"
          }}
        />
      ))}
    </div>
  );
};
