
import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Brain, Layers, Minimize2, Maximize2, X } from 'lucide-react';

type SystemMode = 'neural' | 'unified';

interface MinimizableSystemModeToggleProps {
  currentMode: SystemMode;
  onModeChange: (mode: SystemMode) => void;
  className?: string;
}

export const MinimizableSystemModeToggle: React.FC<MinimizableSystemModeToggleProps> = ({
  currentMode,
  onModeChange,
  className = ''
}) => {
  const [isMinimized, setIsMinimized] = useState(true);
  const [isVisible, setIsVisible] = useState(true);

  // Auto-minimizar después de 8 segundos
  useEffect(() => {
    if (!isMinimized) {
      const timer = setTimeout(() => {
        setIsMinimized(true);
      }, 8000);

      return () => clearTimeout(timer);
    }
  }, [isMinimized]);

  if (!isVisible) return null;

  return (
    <motion.div
      className={`fixed top-4 right-4 z-20 ${className}`}
      initial={{ opacity: 0, x: 50 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.5 }}
    >
      {isMinimized ? (
        // Versión minimizada
        <motion.div
          className="bg-black/60 backdrop-blur-sm rounded-full p-2 cursor-pointer border border-white/10"
          onClick={() => setIsMinimized(false)}
          whileHover={{ scale: 1.1, backgroundColor: 'rgba(0,0,0,0.8)' }}
          whileTap={{ scale: 0.95 }}
        >
          <div className="flex items-center gap-1">
            {currentMode === 'neural' ? (
              <Brain className="w-4 h-4 text-blue-400" />
            ) : (
              <Layers className="w-4 h-4 text-green-400" />
            )}
            <Badge 
              variant="outline" 
              className={`text-xs px-1 py-0 h-4 ${
                currentMode === 'neural' 
                  ? 'border-blue-400 text-blue-400' 
                  : 'border-green-400 text-green-400'
              }`}
            >
              {currentMode === 'neural' ? 'N' : 'U'}
            </Badge>
          </div>
        </motion.div>
      ) : (
        // Versión expandida
        <AnimatePresence>
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.8 }}
            className="bg-black/80 backdrop-blur-xl rounded-lg border border-white/20 p-3"
          >
            <div className="flex items-center justify-between mb-3">
              <h3 className="text-white font-semibold text-sm">Modo Sistema</h3>
              <div className="flex gap-1">
                <Button
                  onClick={() => setIsMinimized(true)}
                  variant="ghost"
                  size="sm"
                  className="text-gray-400 hover:text-white h-6 w-6 p-0"
                >
                  <Minimize2 className="w-3 h-3" />
                </Button>
                <Button
                  onClick={() => setIsVisible(false)}
                  variant="ghost"
                  size="sm"
                  className="text-gray-400 hover:text-white h-6 w-6 p-0"
                >
                  <X className="w-3 h-3" />
                </Button>
              </div>
            </div>

            <div className="flex gap-2">
              <Button
                onClick={() => onModeChange('neural')}
                variant={currentMode === 'neural' ? 'default' : 'outline'}
                size="sm"
                className={`${
                  currentMode === 'neural'
                    ? 'bg-blue-600 hover:bg-blue-700 text-white'
                    : 'text-blue-400 border-blue-400 hover:bg-blue-400/10'
                }`}
              >
                <Brain className="w-4 h-4 mr-1" />
                Neural
              </Button>
              
              <Button
                onClick={() => onModeChange('unified')}
                variant={currentMode === 'unified' ? 'default' : 'outline'}
                size="sm"
                className={`${
                  currentMode === 'unified'
                    ? 'bg-green-600 hover:bg-green-700 text-white'
                    : 'text-green-400 border-green-400 hover:bg-green-400/10'
                }`}
              >
                <Layers className="w-4 h-4 mr-1" />
                Unified
              </Button>
            </div>

            <div className="mt-2 text-xs text-gray-400">
              Modo actual: <span className={currentMode === 'neural' ? 'text-blue-400' : 'text-green-400'}>
                {currentMode === 'neural' ? 'Neural Command' : 'Dashboard Unificado'}
              </span>
            </div>
          </motion.div>
        </AnimatePresence>
      )}
    </motion.div>
  );
};
