
import React, { useState, useEffect, useMemo, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { UnifiedHeader } from './UnifiedHeader';
import { CinematicDashboard } from './CinematicDashboard';
import { IntelligentNavigation } from './IntelligentNavigation';
import { CinematicSkeleton } from './CinematicSkeleton';
import { useSystemMetrics } from './SystemMetrics';
import { LectoGuiaIntersectional } from '@/components/lectoguia/LectoGuiaIntersectional';
import { StudyCalendarIntegration } from '@/components/calendar/StudyCalendarIntegration';
import { PAESFinancialCalculator } from '@/components/financial/PAESFinancialCalculator';
import { CinematicThemeProvider } from '@/contexts/CinematicThemeProvider';
import { useAuth } from '@/contexts/AuthContext';

interface UnifiedDashboardContainerProps {
  initialTool?: string | null;
}

export const UnifiedDashboardContainer: React.FC<UnifiedDashboardContainerProps> = ({ 
  initialTool = 'dashboard' 
}) => {
  const { user } = useAuth();
  const [currentTool, setCurrentTool] = useState(initialTool || 'dashboard');
  const [activeSubject, setActiveSubject] = useState('COMPETENCIA_LECTORA');
  const [navigationHistory, setNavigationHistory] = useState<string[]>(['dashboard']);
  const [isLoading, setIsLoading] = useState(true);
  
  const systemMetrics = useSystemMetrics();

  // Simulación de carga inicial optimizada
  useEffect(() => {
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 1200); // Reducido de 2000ms a 1200ms

    return () => clearTimeout(timer);
  }, []);

  const handleToolChange = useCallback((tool: string, context?: any) => {
    if (tool !== currentTool) {
      setNavigationHistory(prev => [...prev.slice(-9), tool]); // Mantener últimos 10
      setCurrentTool(tool);
      
      if (context?.subject) {
        setActiveSubject(context.subject);
      }
      
      console.log(`🎯 Navegación: ${currentTool} → ${tool}`, context);
    }
  }, [currentTool]);

  const handleSubjectChange = useCallback((subject: string) => {
    setActiveSubject(subject);
  }, []);

  const handleGoBack = useCallback(() => {
    if (navigationHistory.length > 1) {
      const newHistory = [...navigationHistory];
      newHistory.pop();
      const previousTool = newHistory[newHistory.length - 1];
      
      setNavigationHistory(newHistory);
      setCurrentTool(previousTool);
    }
  }, [navigationHistory]);

  // Renderizado optimizado de herramientas
  const renderCurrentTool = useMemo(() => {
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
              canGoBack={navigationHistory.length > 1}
              onGoBack={handleGoBack}
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
                Sistema de ejercicios en desarrollo para {activeSubject}
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
                Sistema de diagnóstico inteligente para {activeSubject}
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
                Plan inteligente adaptado a tu progreso en {activeSubject}
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
        <CinematicSkeleton message="Inicializando PAES Pro" progress={85} />
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
    </CinematicThemeProvider>
  );
};
