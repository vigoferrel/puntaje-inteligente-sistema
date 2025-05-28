
import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { UnifiedButton } from '@/components/ui/unified-button';
import { Badge } from '@/components/ui/badge';
import { useProductionNavigation } from '@/hooks/useProductionNavigation';
import { 
  Brain, 
  Rocket, 
  Home,
  BookOpen, 
  Calculator,
  Volume2,
  VolumeX,
  Settings,
  Globe,
  FlaskConical,
  Scroll,
  Target
} from 'lucide-react';

export const CinematicNavigationHub: React.FC = () => {
  const [isExpanded, setIsExpanded] = useState(false);
  const [audioEnabled, setAudioEnabled] = useState(true);
  
  const {
    navigateToRoute,
    goToLectoguia,
    goToMathematics,
    goToSciences,
    goToHistory,
    goToDiagnostic,
    goToPAESUniverse
  } = useProductionNavigation();

  const navigationItems = [
    { 
      icon: Home, 
      label: 'Hub PAES', 
      action: () => navigateToRoute('/'), 
      color: 'from-purple-500 to-cyan-500' 
    },
    { 
      icon: BookOpen, 
      label: 'Competencia Lectora', 
      action: goToLectoguia, 
      color: 'from-blue-500 to-indigo-500' 
    },
    { 
      icon: Calculator, 
      label: 'Matemáticas', 
      action: goToMathematics, 
      color: 'from-green-500 to-emerald-500' 
    },
    { 
      icon: FlaskConical, 
      label: 'Ciencias', 
      action: goToSciences, 
      color: 'from-purple-500 to-violet-500' 
    },
    { 
      icon: Scroll, 
      label: 'Historia', 
      action: goToHistory, 
      color: 'from-orange-500 to-yellow-500' 
    },
    { 
      icon: Target, 
      label: 'Diagnóstico', 
      action: goToDiagnostic, 
      color: 'from-red-500 to-pink-500' 
    },
    { 
      icon: Globe, 
      label: 'Universo 3D', 
      action: goToPAESUniverse, 
      color: 'from-pink-500 to-purple-500' 
    }
  ];

  const handleNavigation = (action: () => void) => {
    console.log('🎬 Navegación cinematográfica ejecutada');
    action();
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
                  key={item.label}
                  initial={{ opacity: 0, x: 50 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.05 }}
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <UnifiedButton
                    onClick={() => handleNavigation(item.action)}
                    className={`bg-gradient-to-r ${item.color} hover:opacity-90 transition-all backdrop-blur-xl border border-white/20 flex items-center gap-3 px-4 py-3`}
                  >
                    <Icon className="w-5 h-5" />
                    <span className="text-sm font-medium">{item.label}</span>
                  </UnifiedButton>
                </motion.div>
              );
            })}

            <motion.div
              initial={{ opacity: 0, x: 50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: navigationItems.length * 0.05 }}
              className="flex gap-2"
            >
              <UnifiedButton
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
              </UnifiedButton>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      <motion.div
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.9 }}
      >
        <UnifiedButton
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
        </UnifiedButton>
      </motion.div>

      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="absolute -top-2 -left-2"
      >
        <Badge className="bg-gradient-to-r from-green-400 to-emerald-400 text-black text-xs">
          PAES 2025
        </Badge>
      </motion.div>

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
