
import React, { useState, useEffect, useMemo } from 'react';
import { useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { LazyNeuralCommandCenter } from '@/components/lazy/LazyComponents';
import { UnifiedDashboardContainerOptimized } from '@/components/unified-dashboard/UnifiedDashboardContainerOptimized';
import { MinimizableSystemModeToggle } from './MinimizableSystemModeToggle';
import { CinematicSkeletonOptimized } from '@/components/unified-dashboard/CinematicSkeletonOptimized';
import { useUnifiedNavigation } from '@/hooks/useUnifiedNavigation';
import { useAuth } from '@/contexts/AuthContext';
import { preloadCriticalComponents } from '@/components/lazy/LazyComponents';
import { MinimizablePerformanceOrchestrator } from '@/core/performance/MinimizablePerformanceOrchestrator';
import { MinimizablePerformanceMonitor } from '@/components/optimization/MinimizablePerformanceMonitor';

type SystemMode = 'neural' | 'unified' | 'auto';

export const UnifiedSystemContainer: React.FC = () => {
  const { user } = useAuth();
  const location = useLocation();
  const [systemMode, setSystemMode] = useState<SystemMode>('auto');
  const [isLoading, setIsLoading] = useState(true);
  
  const { currentTool, navigateToTool } = useUnifiedNavigation();

  // Inicializar preloading crítico
  useEffect(() => {
    preloadCriticalComponents();
  }, []);

  // Detección inteligente del modo
  const detectedMode = useMemo(() => {
    const params = new URLSearchParams(location.search);
    const urlMode = params.get('mode') as SystemMode;
    const savedMode = localStorage.getItem('preferred-system-mode') as SystemMode;
    
    if (urlMode && ['neural', 'unified'].includes(urlMode)) return urlMode;
    if (savedMode && ['neural', 'unified'].includes(savedMode)) return savedMode;
    
    // Auto-detección basada en la ruta actual
    const neuralRoutes = ['/neural', '/command'];
    const unifiedRoutes = ['/dashboard', '/lectoguia', '/calendar', '/financial'];
    
    if (neuralRoutes.some(route => location.pathname.includes(route))) return 'neural';
    if (unifiedRoutes.some(route => location.pathname.includes(route))) return 'unified';
    
    return 'unified';
  }, [location.pathname, location.search]);

  // Sincronización del modo
  useEffect(() => {
    if (systemMode === 'auto') {
      setSystemMode(detectedMode);
    }
  }, [detectedMode, systemMode]);

  // Inicialización ultra-optimizada
  useEffect(() => {
    preloadCriticalComponents();
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 50);

    return () => clearTimeout(timer);
  }, []);

  // Manejo de navegación desde Neural Command Center
  const handleNeuralNavigation = (tool: string, toolContext?: any) => {
    console.log('🔗 Neural navigation:', tool, toolContext);
    
    const toolMapping: Record<string, { tool: string; mode: 'neural' | 'unified' }> = {
      'dashboard': { tool: 'dashboard', mode: 'unified' },
      'lectoguia': { tool: 'lectoguia', mode: 'unified' },
      'diagnostic': { tool: 'diagnostic', mode: 'unified' },
      'exercises': { tool: 'exercises', mode: 'unified' },
      'plan': { tool: 'plan', mode: 'unified' },
      'calendar': { tool: 'calendar', mode: 'unified' },
      'financial': { tool: 'financial', mode: 'unified' },
      'evaluation': { tool: 'evaluation', mode: 'unified' }
    };

    const mapping = toolMapping[tool];
    if (mapping) {
      setSystemMode(mapping.mode);
      navigateToTool(mapping.tool, toolContext);
    } else {
      navigateToTool(tool, toolContext);
    }
  };

  // Cambio de modo
  const handleModeToggle = (newMode: 'neural' | 'unified') => {
    setSystemMode(newMode);
    localStorage.setItem('preferred-system-mode', newMode);
    
    const params = new URLSearchParams(location.search);
    params.set('mode', newMode);
    window.history.replaceState({}, '', `${location.pathname}?${params.toString()}`);
  };

  if (isLoading) {
    return (
      <CinematicSkeletonOptimized 
        message="Sistema Optimizado Listo"
        progress={100}
        variant="full"
      />
    );
  }

  const activeMode = systemMode === 'auto' ? detectedMode : systemMode;
  const resolvedMode: 'neural' | 'unified' = activeMode === 'auto' ? 'unified' : activeMode as 'neural' | 'unified';

  return (
    <div className="min-h-screen relative">
      {/* Componentes minimizables con z-index reorganizado */}
      <MinimizablePerformanceOrchestrator 
        enableAutoOptimization={true}
        enablePredictiveAnalytics={true}
        enableIntelligentAlerts={true}
        enableRealTimeDashboard={true}
      />

      <MinimizablePerformanceMonitor />

      <MinimizableSystemModeToggle
        currentMode={resolvedMode}
        onModeChange={handleModeToggle}
      />

      <AnimatePresence mode="wait">
        <motion.div
          key={resolvedMode}
          initial={{ opacity: 0, scale: 0.99 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.99 }}
          transition={{ duration: 0.15, ease: "easeInOut" }}
          className="w-full h-full"
        >
          {resolvedMode === 'neural' ? (
            <LazyNeuralCommandCenter 
              onNavigateToTool={handleNeuralNavigation}
              initialDimension={getNeuralDimensionFromTool(currentTool)}
            />
          ) : (
            <UnifiedDashboardContainerOptimized 
              initialTool={currentTool}
            />
          )}
        </motion.div>
      </AnimatePresence>
    </div>
  );
};

// Mapeo de herramientas a dimensiones neurales
const getNeuralDimensionFromTool = (tool: string) => {
  const mappings: Record<string, any> = {
    'dashboard': 'educational_universe',
    'lectoguia': 'neural_training',
    'diagnostic': 'progress_analysis',
    'exercises': 'neural_training',
    'evaluation': 'battle_mode',
    'plan': 'vocational_prediction',
    'calendar': 'calendar_management',
    'financial': 'financial_center'
  };
  
  return mappings[tool] || 'educational_universe';
};
