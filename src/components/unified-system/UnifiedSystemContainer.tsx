
import React, { useState, useEffect, useMemo } from 'react';
import { useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { NeuralCommandCenter } from '@/components/neural-command/NeuralCommandCenter';
import { UnifiedDashboardContainerOptimized } from '@/components/unified-dashboard/UnifiedDashboardContainerOptimized';
import { SystemModeToggle } from './SystemModeToggle';
import { CinematicSkeletonOptimized } from '@/components/unified-dashboard/CinematicSkeletonOptimized';
import { useUnifiedNavigation } from '@/hooks/useUnifiedNavigation';
import { useAuth } from '@/contexts/AuthContext';

type SystemMode = 'neural' | 'unified' | 'auto';

export const UnifiedSystemContainer: React.FC = () => {
  const { user } = useAuth();
  const location = useLocation();
  const [systemMode, setSystemMode] = useState<SystemMode>('auto');
  const [isLoading, setIsLoading] = useState(true);
  
  const { currentTool, navigateToTool } = useUnifiedNavigation();

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
    
    return 'unified'; // Default mejorado
  }, [location.pathname, location.search]);

  // Sincronización del modo
  useEffect(() => {
    if (systemMode === 'auto') {
      setSystemMode(detectedMode);
    }
  }, [detectedMode, systemMode]);

  // Inicialización optimizada
  useEffect(() => {
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 600);

    return () => clearTimeout(timer);
  }, []);

  // Manejo de navegación desde Neural Command Center
  const handleNeuralNavigation = (tool: string, toolContext?: any) => {
    console.log('🔗 Neural navigation:', tool, toolContext);
    
    // Mapeo de herramientas neurales a herramientas unificadas
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
        message="Inicializando Sistema Unificado"
        progress={85}
        variant="full"
      />
    );
  }

  const activeMode = systemMode === 'auto' ? detectedMode : systemMode;
  const resolvedMode: 'neural' | 'unified' = activeMode === 'auto' ? 'unified' : activeMode as 'neural' | 'unified';

  return (
    <div className="min-h-screen relative">
      {/* Toggle de modo del sistema */}
      <SystemModeToggle
        currentMode={resolvedMode}
        onModeChange={handleModeToggle}
        className="fixed top-4 right-4 z-50"
      />

      {/* Renderizado principal del sistema */}
      <AnimatePresence mode="wait">
        <motion.div
          key={resolvedMode}
          initial={{ opacity: 0, scale: 0.98 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.98 }}
          transition={{ duration: 0.3, ease: "easeInOut" }}
          className="w-full h-full"
        >
          {resolvedMode === 'neural' ? (
            <NeuralCommandCenter 
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
