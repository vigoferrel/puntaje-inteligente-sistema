
import React, { memo } from 'react';
import { motion } from 'framer-motion';
import { ChevronLeft, Settings } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { useAuth } from '@/contexts/AuthContext';

interface SimpleUnifiedHeaderProps {
  currentTool: string;
  onNavigateToTool: (tool: string) => void;
  onGoBack?: () => void;
}

export const SimpleUnifiedHeader = memo<SimpleUnifiedHeaderProps>(({
  currentTool,
  onNavigateToTool,
  onGoBack
}) => {
  const { user } = useAuth();

  const toolDisplayName = {
    dashboard: 'Dashboard',
    lectoguia: 'LectoGuía IA',
    calendar: 'Calendario',
    'centro-financiero': 'Centro Financiero',
    diagnostico: 'Diagnóstico',
    ejercicios: 'Ejercicios',
    plan: 'Plan de Estudio',
    'paes-dashboard': 'Evaluación PAES'
  }[currentTool] || currentTool;

  return (
    <motion.header
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      className="sticky top-0 z-40 bg-black/20 backdrop-blur-xl border-b border-white/10"
    >
      <div className="container mx-auto px-6 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            {onGoBack && (
              <Button
                variant="ghost"
                size="sm"
                onClick={onGoBack}
                className="text-white/70 hover:text-white hover:bg-white/10"
              >
                <ChevronLeft className="w-4 h-4 mr-1" />
                Atrás
              </Button>
            )}
            
            <h1 className="text-lg font-semibold text-white">
              {toolDisplayName}
            </h1>
          </div>
          
          <div className="flex items-center space-x-4">
            <Badge variant="outline" className="text-cyan-400 border-cyan-400/30">
              {user?.email}
            </Badge>
            
            <Button
              variant="ghost"
              size="sm"
              onClick={() => onNavigateToTool('settings')}
              className="text-white/70 hover:text-white hover:bg-white/10"
            >
              <Settings className="w-4 h-4" />
            </Button>
          </div>
        </div>
      </div>
    </motion.header>
  );
});

SimpleUnifiedHeader.displayName = 'SimpleUnifiedHeader';
