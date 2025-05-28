
import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
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
  FlaskConical,
  Scroll
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export const CinematicNavigationHub: React.FC = () => {
  const [isExpanded, setIsExpanded] = useState(false);
  const [audioEnabled, setAudioEnabled] = useState(true);
  const navigate = useNavigate();

  const navigationItems = [
    { 
      icon: Home, 
      label: 'Hub PAES', 
      route: '/', 
      color: 'from-purple-500 to-cyan-500' 
    },
    { 
      icon: BookOpen, 
      label: 'Competencia Lectora', 
      route: '/lectoguia', 
      color: 'from-blue-500 to-indigo-500' 
    },
    { 
      icon: Calculator, 
      label: 'Matemáticas', 
      route: '/mathematics', 
      color: 'from-green-500 to-emerald-500' 
    },
    { 
      icon: FlaskConical, 
      label: 'Ciencias', 
      route: '/sciences', 
      color: 'from-purple-500 to-violet-500' 
    },
    { 
      icon: Scroll, 
      label: 'Historia', 
      route: '/history', 
      color: 'from-orange-500 to-yellow-500' 
    },
    { 
      icon: Target, 
      label: 'Diagnóstico', 
      route: '/diagnostic', 
      color: 'from-red-500 to-pink-500' 
    },
    { 
      icon: Globe, 
      label: 'Universo 3D', 
      route: '/universe', 
      color: 'from-pink-500 to-purple-500' 
    }
  ];

  const handleNavigation = (route: string) => {
    console.log(`🎬 Navegación cinematográfica: ${route}`);
    navigate(route);
    setIsExpanded(false);
  };

  return (
    <div className="fixed bottom-6 right-6 z-50">
      <AnimatePresence>
        {isExpanded && (
          <motion.div
            initial={{ opacity: 0, scale: 0.8, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.8, y: 20 }}
            className="absolute bottom-16 right-0 space-y-3"
          >
            {navigationItems.map((item, index) => {
              const Icon = item.icon;
              return (
                <motion.div
                  key={item.route}
                  initial={{ opacity: 0, x: 50 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.05 }}
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <Button
                    onClick={() => handleNavigation(item.route)}
                    className={`bg-gradient-to-r ${item.color} hover:opacity-90 transition-all backdrop-blur-xl border border-white/20 flex items-center gap-3 px-4 py-3`}
                  >
                    <Icon className="w-5 h-5" />
                    <span className="text-sm font-medium">{item.label}</span>
                  </Button>
                </motion.div>
              );
            })}

            {/* Controles de Audio */}
            <motion.div
              initial={{ opacity: 0, x: 50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: navigationItems.length * 0.05 }}
              className="flex gap-2"
            >
              <Button
                onClick={() => setAudioEnabled(!audioEnabled)}
                className={`${
                  audioEnabled 
                    ? 'bg-gradient-to-r from-green-500 to-blue-500' 
                    : 'bg-gradient-to-r from-gray-500 to-gray-600'
                } hover:opacity-90 transition-all backdrop-blur-xl border border-white/20 p-3`}
              >
                {audioEnabled ? (
                  <Volume2 className="w-5 h-5" />
                ) : (
                  <VolumeX className="w-5 h-5" />
                )}
              </Button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Botón Principal */}
      <motion.div
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.9 }}
      >
        <Button
          onClick={() => setIsExpanded(!isExpanded)}
          className="w-16 h-16 rounded-full bg-gradient-to-r from-purple-600 via-cyan-600 to-pink-600 hover:from-purple-700 hover:via-cyan-700 hover:to-pink-700 transition-all shadow-2xl backdrop-blur-xl border-2 border-white/30"
        >
          <motion.div
            animate={{ rotate: isExpanded ? 45 : 0 }}
            transition={{ duration: 0.3 }}
          >
            {isExpanded ? (
              <Settings className="w-8 h-8 text-white" />
            ) : (
              <Rocket className="w-8 h-8 text-white" />
            )}
          </motion.div>
        </Button>
      </motion.div>

      {/* Badge de Estado */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="absolute -top-2 -left-2"
      >
        <Badge className="bg-gradient-to-r from-green-400 to-emerald-400 text-black text-xs">
          PAES 2025
        </Badge>
      </motion.div>

      {/* Efecto de Pulso */}
      <motion.div
        className="absolute inset-0 rounded-full bg-gradient-to-r from-purple-600 via-cyan-600 to-pink-600"
        animate={{ 
          scale: [1, 1.2, 1],
          opacity: [0.3, 0.6, 0.3]
        }}
        transition={{ 
          duration: 2, 
          repeat: Infinity,
          ease: "easeInOut"
        }}
      />
    </div>
  );
};
