
import React, { useState, useEffect, useMemo } from 'react';
import { useSearchParams, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { NeuralCommandCenter } from '@/components/neural-command/NeuralCommandCenter';
import { UnifiedDashboardContainerOptimized } from '@/components/unified-dashboard/UnifiedDashboardContainerOptimized';
import { SystemModeToggle } from './SystemModeToggle';
import { CinematicSkeletonOptimized } from '@/components/unified-dashboard/CinematicSkeletonOptimized';
import { useUnifiedNavigation } from '@/hooks/useUnifiedNavigation';
import { useAuth } from '@/contexts/AuthContext';

interface UnifiedSystemContainerProps {
  initialTool?: string;
}

type SystemMode = 'neural' | 'unified' | 'auto';

export const UnifiedSystemContainer: React.FC<UnifiedSystemContainerProps> = ({ 
  initialTool = 'dashboard' 
}) => {
  const { user } = useAuth();
  const location = useLocation();
  const [searchParams, setSearchParams] = useSearchParams();
  const [systemMode, setSystemMode] = useState<SystemMode>('auto');
  const [isLoading, setIsLoading] = useState(true);
  
  const { currentTool, navigateToTool, context } = useUnifiedNavigation();

  // Intelligent system mode detection
  const detectedMode = useMemo(() => {
    const urlMode = searchParams.get('mode') as SystemMode;
    const savedMode = localStorage.getItem('preferred-system-mode') as SystemMode;
    
    // URL takes precedence, then saved preference, then auto-detection
    if (urlMode && ['neural', 'unified'].includes(urlMode)) return urlMode;
    if (savedMode && ['neural', 'unified'].includes(savedMode)) return savedMode;
    
    // Auto-detection based on tool and user context
    const neuralTools = ['universe', 'simulation', 'battle', 'training', 'analysis'];
    const unifiedTools = ['dashboard', 'lectoguia', 'calendar', 'financial', 'exercises'];
    
    if (neuralTools.some(tool => location.pathname.includes(tool))) return 'neural';
    if (unifiedTools.some(tool => location.pathname.includes(tool))) return 'unified';
    
    return 'neural'; // Default to neural for new users
  }, [searchParams, location.pathname]);

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
    
    // Map neural tools to unified tools
    const toolMapping: Record<string, string> = {
      'universe': 'dashboard',
      'lectoguia': 'lectoguia',
      'diagnostic': 'diagnostic',
      'plan': 'plan',
      'calendar': 'calendar',
      'financial': 'financial',
      'exercises': 'exercises',
      'evaluation': 'evaluation'
    };

    const mappedTool = toolMapping[tool] || tool;
    
    // Switch to unified mode for certain tools
    if (['lectoguia', 'dashboard', 'calendar', 'financial'].includes(mappedTool)) {
      setSystemMode('unified');
      updateURL('unified', mappedTool);
    }
    
    navigateToTool(mappedTool, toolContext);
  };

  // Handle mode toggle
  const handleModeToggle = (newMode: SystemMode) => {
    setSystemMode(newMode);
    updateURL(newMode, currentTool);
    
    // Save preference
    if (newMode !== 'auto') {
      localStorage.setItem('preferred-system-mode', newMode);
    }
  };

  // Update URL with mode and tool
  const updateURL = (mode: SystemMode, tool: string) => {
    const newParams = new URLSearchParams(searchParams);
    newParams.set('mode', mode);
    newParams.set('tool', tool);
    setSearchParams(newParams);
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

  const activeMode = systemMode === 'auto' ? detectedMode : systemMode;

  return (
    <div className="min-h-screen relative">
      {/* System Mode Toggle */}
      <SystemModeToggle
        currentMode={activeMode}
        onModeChange={handleModeToggle}
        className="fixed top-4 right-4 z-50"
      />

      {/* Main System Render */}
      <AnimatePresence mode="wait">
        <motion.div
          key={activeMode}
          initial={{ opacity: 0, scale: 0.98 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.98 }}
          transition={{ duration: 0.3, ease: "easeInOut" }}
          className="w-full h-full"
        >
          {activeMode === 'neural' ? (
            <NeuralCommandCenter 
              onNavigateToTool={handleNeuralNavigation}
              initialDimension={getNeuralDimensionFromTool(currentTool)}
            />
          ) : (
            <UnifiedDashboardContainerOptimized 
              initialTool={initialTool || currentTool}
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
