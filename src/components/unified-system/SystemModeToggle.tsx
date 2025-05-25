
import React from 'react';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Brain, Sparkles, Zap, ArrowUpDown } from 'lucide-react';

interface SystemModeToggleProps {
  currentMode: 'neural' | 'unified';
  onModeChange: (mode: 'neural' | 'unified') => void;
  className?: string;
}

export const SystemModeToggle: React.FC<SystemModeToggleProps> = ({
  currentMode,
  onModeChange,
  className = ''
}) => {
  const toggleMode = () => {
    onModeChange(currentMode === 'neural' ? 'unified' : 'neural');
  };

  return (
    <motion.div
      className={className}
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.5 }}
    >
      <Card className="bg-black/60 backdrop-blur-xl border-cyan-500/30 shadow-2xl">
        <CardContent className="p-3">
          <div className="flex items-center gap-3">
            <Badge 
              className={`${
                currentMode === 'neural' 
                  ? 'bg-cyan-600 text-white border-cyan-400' 
                  : 'bg-gray-600 text-gray-300 border-gray-500'
              } transition-all duration-300`}
            >
              <Brain className="w-3 h-3 mr-1" />
              Neural
            </Badge>
            
            <Button
              onClick={toggleMode}
              variant="ghost"
              size="sm"
              className="text-white hover:bg-white/10 p-2"
            >
              <ArrowUpDown className="w-4 h-4" />
            </Button>
            
            <Badge 
              className={`${
                currentMode === 'unified' 
                  ? 'bg-purple-600 text-white border-purple-400' 
                  : 'bg-gray-600 text-gray-300 border-gray-500'
              } transition-all duration-300`}
            >
              <Sparkles className="w-3 h-3 mr-1" />
              Unificado
            </Badge>
          </div>
          
          <div className="text-xs text-white/60 mt-2 text-center">
            <Zap className="w-3 h-3 inline mr-1" />
            {currentMode === 'neural' ? 'Modo Neural Activo' : 'Modo Unificado Activo'}
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
};
