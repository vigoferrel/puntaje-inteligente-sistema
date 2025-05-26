
import React, { useState, useEffect, useMemo, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { OptimizedUnifiedHeader } from './OptimizedUnifiedHeader';
import { CinematicSkeletonOptimized } from './CinematicSkeletonOptimized';
import { useUnifiedNavigation } from '@/hooks/useUnifiedNavigation';
import { useOptimizedNeuralMetrics } from '@/hooks/useOptimizedNeuralMetrics';
import { useAuth } from '@/contexts/AuthContext';
import { useNavigationPredictor } from '@/core/performance/NavigationPredictor';
import { 
  LazyOptimizedDashboard,
  LazyLectoGuiaUnified,
  LazyStudyCalendar,
  LazyFinancialCalculator,
  useIntelligentPreloading
} from '@/components/lazy/LazyComponents';

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

  const { predictions, recordNavigation } = useNavigationPredictor();
  
  // Preloading inteligente basado en la ruta actual
  useIntelligentPreloading(currentTool);

  // Usar las métricas neurales optimizadas
  const { metrics: neuralMetrics } = useOptimizedNeuralMetrics({
    enableCache: true,
    updateInterval: 45000,
    debounceTime: 2000
  });

  // Inicialización con la herramienta inicial
  useEffect(() => {
    if (initialTool && initialTool !== currentTool) {
      navigateToTool(initialTool);
    }
  }, [initialTool, currentTool, navigateToTool]);

  // Carga ultra-optimizada
  useEffect(() => {
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 100); // Reducido a 100ms para carga instantánea

    return () => clearTimeout(timer);
  }, []);

  // Manejo de cambio de herramienta con predicción
  const handleToolChange = useCallback((tool: string, toolContext?: any) => {
    recordNavigation(tool);
    navigateToTool(tool, toolContext);
  }, [navigateToTool, recordNavigation]);

  // Manejo de cambio de materia memoizado
  const handleSubjectChange = useCallback((subject: string) => {
    updateContext({ subject });
  }, [updateContext]);

  // Métricas del sistema optimizadas
  const systemMetrics = useMemo(() => ({
    completedNodes: Math.round((neuralMetrics.universe_exploration_depth * 50) / 100) || 15,
    totalNodes: 50,
    todayStudyTime: Math.round((neuralMetrics.gamification_engagement * 60) / 100) || 45,
    streakDays: Math.round((neuralMetrics.achievement_momentum * 10) / 100) || 7
  }), [neuralMetrics]);

  // Progress total calculado desde métricas reales
  const totalProgress = useMemo(() => {
    const avgMetrics = (
      neuralMetrics.neural_efficiency +
      neuralMetrics.universe_exploration_depth +
      neuralMetrics.paes_simulation_accuracy +
      neuralMetrics.gamification_engagement
    ) / 4;
    return Math.round(avgMetrics);
  }, [neuralMetrics]);

  // Renderizado optimizado con lazy loading
  const renderCurrentTool = useMemo(() => {
    const activeSubject = context.subject || 'COMPETENCIA_LECTORA';
    
    const toolComponents = {
      dashboard: () => (
        <LazyOptimizedDashboard onNavigateToTool={handleToolChange} />
      ),
      
      lectoguia: () => (
        <LazyLectoGuiaUnified
          initialSubject={activeSubject}
          onNavigateToTool={handleToolChange}
        />
      ),
      
      calendar: () => (
        <LazyStudyCalendar />
      ),
      
      financial: () => (
        <LazyFinancialCalculator />
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
              {currentTool === 'evaluation' && 'Evaluación PAES'}
            </h2>
            <p className="text-white/70 poppins-body">
              Sistema optimizado para {activeSubject}
            </p>
            
            {/* Mostrar predicciones de navegación */}
            {predictions.length > 0 && (
              <div className="mt-6 p-4 bg-white/5 rounded-lg">
                <p className="text-sm text-cyan-400 mb-2">Sugerencias inteligentes:</p>
                <div className="flex gap-2 justify-center">
                  {predictions.map((tool) => (
                    <button
                      key={tool}
                      onClick={() => handleToolChange(tool)}
                      className="px-3 py-1 bg-cyan-600/20 text-cyan-300 rounded-md text-sm hover:bg-cyan-600/30 transition-colors"
                    >
                      {tool.replace('/', '')}
                    </button>
                  ))}
                </div>
              </div>
            )}
          </motion.div>
        </div>
      )
    };

    const ToolComponent = toolComponents[currentTool as keyof typeof toolComponents] || toolComponents.default;
    return <ToolComponent />;
  }, [currentTool, context.subject, handleToolChange, predictions]);

  if (isLoading) {
    return (
      <CinematicSkeletonOptimized 
        message="Sistema Neural Cargado" 
        progress={100} 
        variant="full"
      />
    );
  }

  return (
    <div className="min-h-screen font-poppins bg-gradient-to-br from-slate-900 via-blue-900 to-indigo-900">
      <OptimizedUnifiedHeader
        currentTool={currentTool}
        totalProgress={totalProgress}
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
            initial={{ opacity: 0, scale: 0.99 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.99 }}
            transition={{ 
              duration: 0.08, // Ultra rápido
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
