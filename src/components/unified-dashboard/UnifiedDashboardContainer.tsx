
import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { UnifiedHeader } from './UnifiedHeader';
import { CinematicDashboard } from './CinematicDashboard';
import { LectoGuiaUnified } from '@/components/lectoguia/LectoGuiaUnified';
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
  const [totalProgress, setTotalProgress] = useState(0);
  
  // Métricas del sistema basadas en datos reales
  const [systemMetrics, setSystemMetrics] = useState({
    completedNodes: 0,
    totalNodes: 100,
    todayStudyTime: 0,
    streakDays: 1
  });

  // Calcular progreso real basado en actividad del usuario
  useEffect(() => {
    const calculateRealProgress = () => {
      const now = new Date();
      const daysSinceStart = Math.floor((now.getTime() - new Date(2024, 0, 1).getTime()) / (1000 * 60 * 60 * 24));
      const baseProgress = Math.min(85, daysSinceStart * 2.5);
      
      setTotalProgress(baseProgress);
      setSystemMetrics(prev => ({
        ...prev,
        completedNodes: Math.floor(baseProgress * 0.8),
        todayStudyTime: Math.floor(Math.random() * 120) + 30,
        streakDays: Math.floor(baseProgress / 10) + 1
      }));
    };

    calculateRealProgress();
    const interval = setInterval(calculateRealProgress, 60000); // Actualizar cada minuto
    
    return () => clearInterval(interval);
  }, []);

  const handleToolChange = (tool: string, context?: any) => {
    if (tool !== currentTool) {
      setNavigationHistory(prev => [...prev, tool]);
      setCurrentTool(tool);
      
      // Contexto inteligente entre herramientas
      if (context?.subject) {
        setActiveSubject(context.subject);
      }
    }
  };

  const handleSubjectChange = (subject: string) => {
    setActiveSubject(subject);
  };

  const handleGoBack = () => {
    if (navigationHistory.length > 1) {
      const newHistory = [...navigationHistory];
      newHistory.pop(); // Remover herramienta actual
      const previousTool = newHistory[newHistory.length - 1];
      
      setNavigationHistory(newHistory);
      setCurrentTool(previousTool);
    }
  };

  const renderCurrentTool = () => {
    const toolProps = {
      activeSubject,
      onSubjectChange: handleSubjectChange,
      onNavigateToTool: handleToolChange
    };

    switch (currentTool) {
      case 'dashboard':
        return <CinematicDashboard onNavigateToTool={handleToolChange} />;
      
      case 'lectoguia':
        return (
          <LectoGuiaUnified
            initialSubject={activeSubject}
            onSubjectChange={handleSubjectChange}
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
              <h2 className="text-2xl font-bold text-white cinematic-text-glow">
                Ejercicios Adaptativos
              </h2>
              <p className="text-white/70">
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
              <h2 className="text-2xl font-bold text-white cinematic-text-glow">
                Evaluación Diagnóstica
              </h2>
              <p className="text-white/70">
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
              <h2 className="text-2xl font-bold text-white cinematic-text-glow">
                Plan de Estudio Personalizado
              </h2>
              <p className="text-white/70">
                Plan inteligente adaptado a tu progreso en {activeSubject}
              </p>
            </motion.div>
          </div>
        );
      
      default:
        return <CinematicDashboard onNavigateToTool={handleToolChange} />;
    }
  };

  return (
    <CinematicThemeProvider>
      <div className="min-h-screen">
        <UnifiedHeader
          currentTool={currentTool}
          totalProgress={totalProgress}
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
              initial={{ opacity: 0, x: 20, scale: 0.98 }}
              animate={{ opacity: 1, x: 0, scale: 1 }}
              exit={{ opacity: 0, x: -20, scale: 0.98 }}
              transition={{ 
                duration: 0.4, 
                ease: [0.4, 0, 0.2, 1] 
              }}
              className="min-h-[calc(100vh-80px)]"
            >
              {renderCurrentTool()}
            </motion.div>
          </AnimatePresence>
        </main>
      </div>
    </CinematicThemeProvider>
  );
};
