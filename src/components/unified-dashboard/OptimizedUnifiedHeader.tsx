
import React, { memo, useMemo, useCallback } from 'react';
import { motion } from 'framer-motion';
import { ChevronLeft, Settings, User, TrendingUp } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';

interface SystemMetrics {
  completedNodes: number;
  totalNodes: number;
  todayStudyTime: number;
  streakDays: number;
}

interface OptimizedUnifiedHeaderProps {
  currentTool: string;
  totalProgress: number;
  activeSubject: string;
  systemMetrics: SystemMetrics;
  navigationHistory: string[];
  onToolChange: (tool: string, toolContext?: any) => void;
  onSubjectChange: (subject: string) => void;
  onGoBack?: () => void;
}

// Componente memoizado para las métricas del sistema
const SystemMetricsDisplay = memo<{ metrics: SystemMetrics }>(({ metrics }) => {
  const progressPercentage = useMemo(() => 
    (metrics.completedNodes / Math.max(metrics.totalNodes, 1)) * 100
  , [metrics.completedNodes, metrics.totalNodes]);

  return (
    <div className="flex items-center space-x-6">
      <div className="flex items-center space-x-2">
        <TrendingUp className="w-4 h-4 text-cyan-400" />
        <span className="text-sm text-white/80">
          {metrics.completedNodes}/{metrics.totalNodes} nodos
        </span>
        <Progress value={progressPercentage} className="w-20 h-2" />
      </div>
      
      <Badge variant="outline" className="text-cyan-400 border-cyan-400/30">
        {metrics.todayStudyTime}min hoy
      </Badge>
      
      <Badge variant="outline" className="text-orange-400 border-orange-400/30">
        {metrics.streakDays} días seguidos
      </Badge>
    </div>
  );
});

SystemMetricsDisplay.displayName = 'SystemMetricsDisplay';

// Componente memoizado para la navegación
const NavigationControls = memo<{
  currentTool: string;
  onGoBack?: () => void;
  onToolChange: (tool: string) => void;
}>(({ currentTool, onGoBack, onToolChange }) => {
  const toolDisplayName = useMemo(() => {
    const toolNames: Record<string, string> = {
      dashboard: 'Dashboard',
      lectoguia: 'LectoGuía IA',
      calendar: 'Calendario',
      financial: 'Centro Financiero',
      diagnostic: 'Diagnóstico',
      exercises: 'Ejercicios',
      plan: 'Plan de Estudio',
      evaluation: 'Evaluación'
    };
    return toolNames[currentTool] || currentTool;
  }, [currentTool]);

  const handleSettingsClick = useCallback(() => {
    onToolChange('settings');
  }, [onToolChange]);

  return (
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
      
      <div className="text-lg font-semibold text-white">
        {toolDisplayName}
      </div>
      
      <Button
        variant="ghost"
        size="sm"
        onClick={handleSettingsClick}
        className="text-white/70 hover:text-white hover:bg-white/10"
      >
        <Settings className="w-4 h-4" />
      </Button>
    </div>
  );
});

NavigationControls.displayName = 'NavigationControls';

// Header principal optimizado
export const OptimizedUnifiedHeader = memo<OptimizedUnifiedHeaderProps>(({
  currentTool,
  totalProgress,
  activeSubject,
  systemMetrics,
  navigationHistory,
  onToolChange,
  onSubjectChange,
  onGoBack
}) => {
  // Memoizar el estado de progreso total
  const progressColor = useMemo(() => {
    if (totalProgress >= 80) return 'from-green-500 to-emerald-600';
    if (totalProgress >= 60) return 'from-yellow-500 to-orange-600';
    return 'from-red-500 to-pink-600';
  }, [totalProgress]);

  // Memoizar el badge del sujeto activo
  const subjectBadge = useMemo(() => {
    const subjectNames: Record<string, string> = {
      'COMPETENCIA_LECTORA': 'Comprensión Lectora',
      'MATEMATICA_M1': 'Matemática M1',
      'MATEMATICA_M2': 'Matemática M2',
      'CIENCIAS': 'Ciencias',
      'HISTORIA': 'Historia y Cs. Sociales'
    };
    return subjectNames[activeSubject] || activeSubject;
  }, [activeSubject]);

  return (
    <motion.header
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      className="sticky top-0 z-40 bg-black/20 backdrop-blur-xl border-b border-white/10"
    >
      <div className="container mx-auto px-6 py-4">
        <div className="flex items-center justify-between">
          {/* Navegación izquierda */}
          <NavigationControls
            currentTool={currentTool}
            onGoBack={onGoBack}
            onToolChange={onToolChange}
          />
          
          {/* Centro - Progreso total */}
          <div className="flex items-center space-x-4">
            <div className="text-center">
              <div className="text-sm text-white/60 mb-1">Progreso Total</div>
              <div className="flex items-center space-x-2">
                <div className="w-24 bg-gray-700 rounded-full h-2">
                  <motion.div
                    className={`h-2 rounded-full bg-gradient-to-r ${progressColor}`}
                    initial={{ width: 0 }}
                    animate={{ width: `${totalProgress}%` }}
                    transition={{ duration: 0.8, ease: "easeOut" }}
                  />
                </div>
                <span className="text-sm font-semibold text-white">
                  {totalProgress}%
                </span>
              </div>
            </div>
            
            <Badge variant="secondary" className="bg-blue-500/20 text-blue-300 border-blue-400/30">
              {subjectBadge}
            </Badge>
          </div>
          
          {/* Derecha - Métricas del sistema */}
          <SystemMetricsDisplay metrics={systemMetrics} />
        </div>
      </div>
    </motion.header>
  );
});

OptimizedUnifiedHeader.displayName = 'OptimizedUnifiedHeader';
