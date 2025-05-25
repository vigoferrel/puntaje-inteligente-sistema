
import React, { useState, useEffect, useMemo, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { UnifiedHeader } from './UnifiedHeader';
import { OptimizedDashboard } from '@/components/dashboard/OptimizedDashboard';
import { LectoGuiaUnified } from '@/components/lectoguia/LectoGuiaUnified';
import { UnifiedNavigationCore } from '@/components/navigation/UnifiedNavigationCore';
import { CinematicSkeletonOptimized } from './CinematicSkeletonOptimized';
import { OptimizedCacheProvider, CachePerformanceMonitor } from '@/core/performance/OptimizedCacheSystem';
import { OptimizedSuspenseWrapper } from '@/components/optimization/OptimizedSuspenseWrapper';
import { PerformanceMonitor } from '@/components/optimization/PerformanceMonitor';
import { useSystemMetrics } from './SystemMetrics';
import { StudyCalendarIntegration } from '@/components/calendar/StudyCalendarIntegration';
import { PAESFinancialCalculator } from '@/components/financial/PAESFinancialCalculator';
import { useUnifiedNavigation } from '@/hooks/useUnifiedNavigation';
import { usePerformanceOptimization } from '@/hooks/usePerformanceOptimization';
import { useAuth } from '@/contexts/AuthContext';
import { loadValidator } from '@/core/performance/LoadValidationSystem';

interface UnifiedDashboardContainerOptimizedProps {
  initialTool?: string | null;
}

export const UnifiedDashboardContainerOptimized: React.FC<UnifiedDashboardContainerOptimizedProps> = ({ 
  initialTool = 'dashboard' 
}) => {
  const { user } = useAuth();
  const [isLoading, setIsLoading] = useState(true);
  const { markLoadComplete, optimizedCallback, optimizedMemo } = usePerformanceOptimization('UnifiedDashboardContainer');
  
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

  // Inicialización optimizada con validación
  useEffect(() => {
    loadValidator.markNavigationStart();
    
    if (initialTool && initialTool !== currentTool) {
      navigateToTool(initialTool);
    }
    
    loadValidator.markNavigationEnd();
  }, [initialTool, currentTool, navigateToTool]);

  // Carga optimizada con métricas
  useEffect(() => {
    const timer = setTimeout(() => {
      setIsLoading(false);
      markLoadComplete();
    }, 300); // Reducido para mejor UX

    return () => clearTimeout(timer);
  }, [markLoadComplete]);

  // Manejo unificado de herramientas optimizado
  const handleToolChange = optimizedCallback((tool: string, toolContext?: any) => {
    loadValidator.markNavigationStart();
    navigateToTool(tool, toolContext);
    loadValidator.markNavigationEnd();
  });

  // Manejo de cambio de materia optimizado
  const handleSubjectChange = optimizedCallback((subject: string) => {
    updateContext({ subject });
  });

  // Renderizado optimizado de herramientas con lazy loading
  const renderCurrentTool = optimizedMemo(() => {
    const activeSubject = context.subject || 'COMPETENCIA_LECTORA';
    
    const toolComponents = {
      dashboard: () => (
        <OptimizedSuspenseWrapper fallbackMessage="Cargando Dashboard Neural" componentName="OptimizedDashboard">
          <OptimizedDashboard onNavigateToTool={handleToolChange} />
        </OptimizedSuspenseWrapper>
      ),
      
      lectoguia: () => (
        <OptimizedSuspenseWrapper fallbackMessage="Inicializando LectoGuía IA" componentName="LectoGuiaUnified">
          <LectoGuiaUnified
            initialSubject={activeSubject}
            onNavigateToTool={handleToolChange}
          />
        </OptimizedSuspenseWrapper>
      ),
      
      navigation: () => (
        <OptimizedSuspenseWrapper fallbackMessage="Cargando Navegación Neural" componentName="UnifiedNavigationCore">
          <UnifiedNavigationCore
            onNavigate={handleToolChange}
            currentTool={currentTool}
          />
        </OptimizedSuspenseWrapper>
      ),
      
      calendar: () => (
        <OptimizedSuspenseWrapper fallbackMessage="Inicializando Calendario" componentName="StudyCalendarIntegration">
          <StudyCalendarIntegration />
        </OptimizedSuspenseWrapper>
      ),
      
      financial: () => (
        <OptimizedSuspenseWrapper fallbackMessage="Cargando Calculadora PAES" componentName="PAESFinancialCalculator">
          <PAESFinancialCalculator />
        </OptimizedSuspenseWrapper>
      ),
        
      default: () => (
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
      )
    };

    const ToolComponent = toolComponents[currentTool as keyof typeof toolComponents] || toolComponents.default;
    return <ToolComponent />;
  }, [currentTool, context.subject, handleToolChange]);

  if (isLoading) {
    return (
      <CinematicSkeletonOptimized 
        message="Inicializando Sistema Neural Optimizado" 
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
                duration: 0.15, // Reducido para mejor performance
                ease: [0.4, 0, 0.2, 1] 
              }}
              className="min-h-[calc(100vh-80px)]"
            >
              {renderCurrentTool}
            </motion.div>
          </AnimatePresence>
        </main>
        
        {/* Monitor de performance en desarrollo y producción */}
        <PerformanceMonitor />
        
        {/* Monitor de cache solo en desarrollo */}
        {process.env.NODE_ENV === 'development' && (
          <CachePerformanceMonitor />
        )}
      </div>
    </OptimizedCacheProvider>
  );
};
