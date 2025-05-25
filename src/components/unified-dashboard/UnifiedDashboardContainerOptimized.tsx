
import React, { useState, useEffect, useMemo, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { UnifiedHeader } from './UnifiedHeader';
import { OptimizedDashboard } from '@/components/dashboard/OptimizedDashboard';
import { LectoGuiaUnified } from '@/components/lectoguia/LectoGuiaUnified';
import { UnifiedNavigationCore } from '@/components/navigation/UnifiedNavigationCore';
import { CinematicSkeletonOptimized } from './CinematicSkeletonOptimized';
import { OptimizedCacheProvider, CachePerformanceMonitor } from '@/core/performance/OptimizedCacheSystem';
import { useSystemMetrics } from './SystemMetrics';
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
    canGoBack,
    getNavigationAnalytics 
  } = useUnifiedNavigation();
  
  const systemMetrics = useSystemMetrics();

  // Inicialización optimizada
  useEffect(() => {
    if (initialTool && initialTool !== currentTool) {
      navigateToTool(initialTool);
    }
  }, [initialTool, currentTool, navigateToTool]);

  // Carga optimizada
  useEffect(() => {
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 400); // Reducido para mejor UX

    return () => clearTimeout(timer);
  }, []);

  // Manejo unificado de herramientas
  const handleToolChange = useCallback((tool: string, toolContext?: any) => {
    navigateToTool(tool, toolContext);
  }, [navigateToTool]);

  // Manejo de cambio de materia
  const handleSubjectChange = useCallback((subject: string) => {
    updateContext({ subject });
  }, [updateContext]);

  // Renderizado optimizado de herramientas
  const renderCurrentTool = useMemo(() => {
    const activeSubject = context.subject || 'COMPETENCIA_LECTORA';
    
    switch (currentTool) {
      case 'dashboard':
        return (
          <OptimizedDashboard onNavigateToTool={handleToolChange} />
        );
      
      case 'lectoguia':
        return (
          <LectoGuiaUnified
            initialSubject={activeSubject}
            onNavigateToTool={handleToolChange}
          />
        );
      
      case 'navigation':
        return (
          <UnifiedNavigationCore
            onNavigate={handleToolChange}
            currentTool={currentTool}
          />
        );
      
      case 'calendar':
        return <StudyCalendarIntegration />;
      
      case 'financial':
        return <PAESFinancialCalculator />;
        
      case 'exercises':
      case 'diagnostic':
      case 'plan':
        return (
          <div className="p-6">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-center space-y-4"
            >
              <h2 className="text-2xl font-bold text-white cinematic-text-glow poppins-title">
                {currentTool === 'exercises' && 'Ejercicios Adaptativos'}
                {currentTool === 'diagnostic' && 'Evaluación Diagnóstica'}
                {currentTool === 'plan' && 'Plan de Estudio Personalizado'}
              </h2>
              <p className="text-white/70 poppins-body">
                Sistema optimizado para {activeSubject}
              </p>
              <UnifiedNavigationCore
                onNavigate={handleToolChange}
                currentTool={currentTool}
              />
            </motion.div>
          </div>
        );
      
      default:
        return (
          <OptimizedDashboard onNavigateToTool={handleToolChange} />
        );
    }
  }, [currentTool, context.subject, handleToolChange]);

  if (isLoading) {
    return (
      <CinematicSkeletonOptimized 
        message="Inicializando Sistema Optimizado" 
        progress={95} 
        variant="full"
      />
    );
  }

  return (
    <OptimizedCacheProvider>
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
                duration: 0.2, 
                ease: [0.4, 0, 0.2, 1] 
              }}
              className="min-h-[calc(100vh-80px)]"
            >
              {renderCurrentTool}
            </motion.div>
          </AnimatePresence>
        </main>
        
        {/* Monitor de performance en desarrollo */}
        {process.env.NODE_ENV === 'development' && (
          <CachePerformanceMonitor />
        )}
      </div>
    </OptimizedCacheProvider>
  );
};
