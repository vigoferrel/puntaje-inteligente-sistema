
import React, { useState, useEffect, useMemo, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { UnifiedHeader } from './UnifiedHeader';
import { CinematicDashboard } from './CinematicDashboard';
import { IntelligentNavigation } from './IntelligentNavigation';
import { CinematicSkeletonOptimized } from './CinematicSkeletonOptimized';
import { useSystemMetrics } from './SystemMetrics';
import { LectoGuiaIntersectional } from '@/components/lectoguia/LectoGuiaIntersectional';
import { StudyCalendarIntegration } from '@/components/calendar/StudyCalendarIntegration';
import { PAESFinancialCalculator } from '@/components/financial/PAESFinancialCalculator';
import { useUnifiedNavigation } from '@/hooks/useUnifiedNavigation';
import { useAuth } from '@/contexts/AuthContext';

interface UnifiedDashboardContainerOptimizedProps {
  initialTool?: string | null;
}

export const UnifiedDashboardContainerOptimized: React.FC<UnifiedDashboardContainerOptimizedProps> = ({ 
  initialTool = 'dashboard' 
}) => {
  const { user } = useAuth();
  const [isLoading, setIsLoading] = useState(true);
  
  const { 
    currentTool, 
    context, 
    navigationHistory, 
    navigateToTool, 
    goBack, 
    updateContext,
    canGoBack 
  } = useUnifiedNavigation();
  
  const systemMetrics = useSystemMetrics();

  // Initialize with provided tool
  useEffect(() => {
    if (initialTool && initialTool !== currentTool) {
      navigateToTool(initialTool);
    }
  }, [initialTool, currentTool, navigateToTool]);

  // Optimized loading
  useEffect(() => {
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 600);

    return () => clearTimeout(timer);
  }, []);

  // Tool change handler
  const handleToolChange = useCallback((tool: string, toolContext?: any) => {
    navigateToTool(tool, toolContext);
  }, [navigateToTool]);

  // Subject change handler
  const handleSubjectChange = useCallback((subject: string) => {
    updateContext({ subject });
  }, [updateContext]);

  // Optimized tool rendering
  const renderCurrentTool = useMemo(() => {
    const activeSubject = context.subject || 'COMPETENCIA_LECTORA';
    
    const toolProps = {
      activeSubject,
      onSubjectChange: handleSubjectChange,
      onNavigateToTool: handleToolChange
    };

    switch (currentTool) {
      case 'dashboard':
        return (
          <div className="space-y-8">
            <CinematicDashboard onNavigateToTool={handleToolChange} />
            <IntelligentNavigation
              currentTool={currentTool}
              onNavigate={handleToolChange}
              canGoBack={canGoBack}
              onGoBack={goBack}
            />
          </div>
        );
      
      case 'lectoguia':
        return (
          <LectoGuiaIntersectional
            initialSubject={activeSubject}
            onNavigateToTool={handleToolChange}
          />
        );
      
      case 'calendar':
        return <StudyCalendarIntegration />;
      
      case 'financial':
        return <PAESFinancialCalculator />;
        
      case 'exercises':
        return (
          <div className="p-6">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-center space-y-4"
            >
              <h2 className="text-2xl font-bold text-white cinematic-text-glow poppins-title">
                Ejercicios Adaptativos
              </h2>
              <p className="text-white/70 poppins-body">
                Sistema de ejercicios para {activeSubject}
              </p>
            </motion.div>
          </div>
        );
        
      case 'diagnostic':
        return (
          <div className="p-6">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-center space-y-4"
            >
              <h2 className="text-2xl font-bold text-white cinematic-text-glow poppins-title">
                Evaluación Diagnóstica
              </h2>
              <p className="text-white/70 poppins-body">
                Sistema de diagnóstico para {activeSubject}
              </p>
            </motion.div>
          </div>
        );
        
      case 'plan':
        return (
          <div className="p-6">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-center space-y-4"
            >
              <h2 className="text-2xl font-bold text-white cinematic-text-glow poppins-title">
                Plan de Estudio Personalizado
              </h2>
              <p className="text-white/70 poppins-body">
                Plan adaptado a {activeSubject}
              </p>
            </motion.div>
          </div>
        );
      
      default:
        return (
          <div className="space-y-8">
            <CinematicDashboard onNavigateToTool={handleToolChange} />
            <IntelligentNavigation
              currentTool={currentTool}
              onNavigate={handleToolChange}
              canGoBack={canGoBack}
              onGoBack={goBack}
            />
          </div>
        );
    }
  }, [currentTool, context.subject, handleSubjectChange, handleToolChange, canGoBack, goBack]);

  if (isLoading) {
    return (
      <CinematicSkeletonOptimized 
        message="Cargando Sistema Unificado" 
        progress={90} 
        variant="full"
      />
    );
  }

  return (
    <div className="min-h-screen font-poppins bg-gradient-to-br from-slate-900 via-blue-900 to-indigo-900">
      <UnifiedHeader
        currentTool={currentTool}
        totalProgress={systemMetrics.totalProgress}
        activeSubject={context.subject || 'COMPETENCIA_LECTORA'}
        onToolChange={handleToolChange}
        onSubjectChange={handleSubjectChange}
        systemMetrics={systemMetrics}
        navigationHistory={navigationHistory}
        onGoBack={canGoBack ? goBack : undefined}
      />
      
      <main className="relative overflow-hidden">
        <AnimatePresence mode="wait">
          <motion.div
            key={currentTool}
            initial={{ opacity: 0, scale: 0.98 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.98 }}
            transition={{ 
              duration: 0.3, 
              ease: [0.4, 0, 0.2, 1] 
            }}
            className="min-h-[calc(100vh-80px)]"
          >
            {renderCurrentTool}
          </motion.div>
        </AnimatePresence>
      </main>
    </div>
  );
};
