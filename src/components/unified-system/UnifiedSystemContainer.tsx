
import React, { useState, useEffect, useMemo } from 'react';
import { useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { NeuralCommandCenter } from '@/components/neural-command/NeuralCommandCenter';
import { UnifiedDashboardContainerOptimized } from '@/components/unified-dashboard/UnifiedDashboardContainerOptimized';
import { SystemModeToggle } from './SystemModeToggle';
import { CinematicSkeletonOptimized } from '@/components/unified-dashboard/CinematicSkeletonOptimized';
import { useUnifiedRouting } from '@/hooks/useUnifiedRouting';
import { useAuth } from '@/contexts/AuthContext';

type SystemMode = 'neural' | 'unified' | 'auto';

export const UnifiedSystemContainer: React.FC = () => {
  const { user } = useAuth();
  const location = useLocation();
  const [systemMode, setSystemMode] = useState<SystemMode>('auto');
  const [isLoading, setIsLoading] = useState(true);
  
  const { currentTool, currentRoute, navigateToTool } = useUnifiedRouting();

  // Intelligent system mode detection
  const detectedMode = useMemo(() => {
    const params = new URLSearchParams(location.search);
    const urlMode = params.get('mode') as SystemMode;
    const savedMode = localStorage.getItem('preferred-system-mode') as SystemMode;
    
    // URL takes precedence, then saved preference, then auto-detection
    if (urlMode && ['neural', 'unified'].includes(urlMode)) return urlMode;
    if (savedMode && ['neural', 'unified'].includes(savedMode)) return savedMode;
    
    // Auto-detection based on current route
    const neuralRoutes = ['/neural', '/universe', '/simulation', '/battle'];
    const unifiedRoutes = ['/dashboard', '/lectoguia', '/calendar', '/financial'];
    
    if (neuralRoutes.some(route => location.pathname.includes(route))) return 'neural';
    if (unifiedRoutes.some(route => location.pathname.includes(route))) return 'unified';
    
    return 'neural'; // Default to neural
  }, [location.pathname, location.search]);

  // Sync system mode
  useEffect(() => {
    if (systemMode === 'auto') {
      setSystemMode(detectedMode);
    }
  }, [detectedMode, systemMode]);

  // Initialize system
  useEffect(() => {
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 800);

    return () => clearTimeout(timer);
  }, []);

  // Handle tool navigation from Neural Command Center
  const handleNeuralNavigation = (tool: string, toolContext?: any) => {
    console.log('🔗 Neural navigation:', tool, toolContext);
    
    // Map neural tools to unified tools and switch modes accordingly
    const toolMapping: Record<string, { tool: string; mode: 'neural' | 'unified' }> = {
      'universe': { tool: 'dashboard', mode: 'unified' },
      'lectoguia': { tool: 'lectoguia', mode: 'unified' },
      'diagnostic': { tool: 'diagnostic', mode: 'unified' },
      'plan': { tool: 'plan', mode: 'unified' },
      'calendar': { tool: 'calendar', mode: 'unified' },
      'financial': { tool: 'financial', mode: 'unified' },
      'exercises': { tool: 'exercises', mode: 'unified' },
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

  // Handle mode toggle
  const handleModeToggle = (newMode: 'neural' | 'unified') => {
    setSystemMode(newMode);
    localStorage.setItem('preferred-system-mode', newMode);
    
    // Update URL with mode parameter
    const params = new URLSearchParams(location.search);
    params.set('mode', newMode);
    window.history.replaceState({}, '', `${location.pathname}?${params.toString()}`);
  };

  // Loading state
  if (isLoading) {
    return (
      <CinematicSkeletonOptimized 
        message="Inicializando Sistema Unificado"
        progress={75}
        variant="full"
      />
    );
  }

  // Resolve active mode to ensure it's never 'auto'
  const activeMode = systemMode === 'auto' ? detectedMode : systemMode;
  const resolvedMode: 'neural' | 'unified' = activeMode === 'auto' ? 'neural' : activeMode as 'neural' | 'unified';

  return (
    <div className="min-h-screen relative">
      {/* System Mode Toggle */}
      <SystemModeToggle
        currentMode={resolvedMode}
        onModeChange={handleModeToggle}
        className="fixed top-4 right-4 z-50"
      />

      {/* Main System Render */}
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

// Helper function to map tools to neural dimensions
const getNeuralDimensionFromTool = (tool: string) => {
  const mappings: Record<string, any> = {
    'dashboard': 'universe_exploration',
    'lectoguia': 'neural_training',
    'diagnostic': 'progress_analysis',
    'exercises': 'neural_training',
    'evaluation': 'battle_mode',
    'plan': 'vocational_prediction',
    'calendar': 'calendar_management',
    'financial': 'financial_center'
  };
  
  return mappings[tool] || 'universe_exploration';
};
