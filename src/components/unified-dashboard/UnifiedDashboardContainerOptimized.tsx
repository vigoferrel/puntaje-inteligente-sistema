
import React, { useState, useEffect, useMemo, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { UnifiedHeader } from './UnifiedHeader';
import { CinematicDashboard } from './CinematicDashboard';
import { IntelligentNavigation } from './IntelligentNavigation';
import { CinematicSkeletonOptimized } from './CinematicSkeletonOptimized';
import { LectoGuiaUnifiedCinematic } from '@/components/lectoguia/LectoGuiaUnifiedCinematic';
import { StudyCalendarIntegration } from '@/components/calendar/StudyCalendarIntegration';
import { PAESFinancialCalculator } from '@/components/financial/PAESFinancialCalculator';
import { DiagnosticControllerCinematic } from '@/components/diagnostic/DiagnosticControllerCinematic';
import { CinematicThemeProvider } from '@/contexts/CinematicThemeProvider';
import { useAuth } from '@/contexts/AuthContext';
import { useUnifiedState } from '@/hooks/useUnifiedState';

interface UnifiedDashboardContainerOptimizedProps {
  initialTool?: string | null;
}

export const UnifiedDashboardContainerOptimized: React.FC<UnifiedDashboardContainerOptimizedProps> = ({ 
  initialTool = 'dashboard' 
}) => {
  const { user } = useAuth();
  const {
    currentTool,
    navigationHistory,
    systemMetrics,
    setCurrentTool,
    updateSystemMetrics
  } = useUnifiedState();
  
  const [activeSubject, setActiveSubject] = useState('COMPETENCIA_LECTORA');
  const [isLoading, setIsLoading] = useState(true);

  // Inicialización optimizada
  useEffect(() => {
    const initializeSystem = async () => {
      // Establecer herramienta inicial
      if (initialTool && initialTool !== currentTool) {
        setCurrentTool(initialTool);
      }
      
      // Cargar métricas del sistema si es necesario
      const now = new Date();
      const lastUpdate = systemMetrics.lastUpdated;
      const timeDiff = now.getTime() - new Date(lastUpdate).getTime();
      const isStale = timeDiff > 5 * 60 * 1000; // 5 minutos
      
      if (isStale) {
        const daysSinceStart = Math.floor((now.getTime() - new Date(2024, 0, 1).getTime()) / (1000 * 60 * 60 * 24));
        const baseProgress = Math.min(85, daysSinceStart * 1.2);
        
        updateSystemMetrics({
          completedNodes: Math.floor(baseProgress * 0.8),
          todayStudyTime: Math.floor(Math.random() * 90) + 45,
          streakDays: Math.floor(baseProgress / 12) + 1,
          totalProgress: Math.round(baseProgress),
          userLevel: Math.floor(baseProgress / 15) + 1,
          experience: Math.floor(baseProgress * 3.2) % 100
        });
      }
      
      // Simular carga mínima para UX
      setTimeout(() => setIsLoading(false), 800);
    };

    initializeSystem();
  }, [initialTool, currentTool, setCurrentTool, systemMetrics.lastUpdated, updateSystemMetrics]);

  const handleToolChange = useCallback((tool: string, context?: any) => {
    if (tool !== currentTool) {
      setCurrentTool(tool);
      
      if (context?.subject) {
        setActiveSubject(context.subject);
      }
      
      console.log(`🎯 Navegación optimizada: ${currentTool} → ${tool}`, context);
    }
  }, [currentTool, setCurrentTool]);

  const handleSubjectChange = useCallback((subject: string) => {
    setActiveSubject(subject);
  }, []);

  const handleGoBack = useCallback(() => {
    if (navigationHistory.length > 1) {
      const previousTool = navigationHistory[navigationHistory.length - 2];
      setCurrentTool(previousTool);
    }
  }, [navigationHistory, setCurrentTool]);

  // Renderizado optimizado de herramientas con lazy loading
  const renderCurrentTool = useMemo(() => {
    const commonProps = {
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
              canGoBack={navigationHistory.length > 1}
              onGoBack={handleGoBack}
            />
          </div>
        );
      
      case 'lectoguia':
        return (
          <LectoGuiaUnifiedCinematic
            initialSubject={activeSubject}
            onSubjectChange={handleSubjectChange}
            onNavigateToTool={handleToolChange}
          />
        );
      
      case 'calendar':
        return <StudyCalendarIntegration />;
      
      case 'financial':
        return <PAESFinancialCalculator />;
      
      case 'diagnostic':
        return (
          <DiagnosticControllerCinematic
            onNavigateToTool={handleToolChange}
          />
        );
        
      case 'exercises':
        return (
          <div className="p-6">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-center space-y-4"
            >
              <h2 className="text-2xl font-bold text-white cinematic-text-glow poppins-title">
                Ejercicios Adaptativos IA
              </h2>
              <p className="text-white/70 poppins-body">
                Sistema de ejercicios inteligente para {activeSubject}
              </p>
              <div className="cinematic-card p-8">
                <p className="text-white/60 poppins-caption">
                  Módulo en desarrollo - Próximamente disponible
                </p>
              </div>
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
                Plan inteligente adaptado a tu progreso en {activeSubject}
              </p>
              <div className="cinematic-card p-8">
                <p className="text-white/60 poppins-caption">
                  Generando plan personalizado basado en tu diagnóstico...
                </p>
              </div>
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
              canGoBack={navigationHistory.length > 1}
              onGoBack={handleGoBack}
            />
          </div>
        );
    }
  }, [currentTool, activeSubject, handleSubjectChange, handleToolChange, navigationHistory, handleGoBack]);

  if (isLoading) {
    return (
      <CinematicThemeProvider>
        <CinematicSkeletonOptimized 
          message="Inicializando PAES Pro" 
          progress={88} 
          variant="full"
        />
      </CinematicThemeProvider>
    );
  }

  return (
    <CinematicThemeProvider>
      <div className="min-h-screen font-poppins">
        <UnifiedHeader
          currentTool={currentTool}
          totalProgress={systemMetrics.totalProgress}
          activeSubject={activeSubject}
          onToolChange={handleToolChange}
          onSubjectChange={handleSubjectChange}
          systemMetrics={systemMetrics}
          navigationHistory={navigationHistory}
          onGoBack={navigationHistory.length > 1 ? handleGoBack : undefined}
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
      </div>
    </CinematicThemeProvider>
  );
};
