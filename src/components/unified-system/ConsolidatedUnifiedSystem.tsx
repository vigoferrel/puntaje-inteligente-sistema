
import React, { useState, useEffect, useMemo } from 'react';
import { useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { LazyNeuralCommandCenter } from '@/components/lazy/LazyComponents';
import { SimplifiedDashboardContainer } from '@/components/unified-dashboard/SimplifiedDashboardContainer';
import { MinimizableSystemModeToggle } from './MinimizableSystemModeToggle';
import { useSimpleNavigation } from '@/hooks/useSimpleNavigation';
import { useLegacyRouteCleanup } from '@/hooks/useLegacyRouteCleanup';
import { useAuth } from '@/contexts/AuthContext';
import { CinematicAudioProvider } from '@/components/cinematic/UniversalCinematicSystem';

type SystemMode = 'neural' | 'unified' | 'auto';

export const ConsolidatedUnifiedSystem: React.FC = () => {
  const { user } = useAuth();
  const location = useLocation();
  const [systemMode, setSystemMode] = useState<SystemMode>('auto');
  const { currentTool, navigateToTool } = useSimpleNavigation();
  
  // Limpiar rutas legacy automáticamente
  useLegacyRouteCleanup();

  // Detección simple del modo
  const detectedMode = useMemo(() => {
    const params = new URLSearchParams(location.search);
    const urlMode = params.get('mode') as SystemMode;
    
    if (urlMode && ['neural', 'unified'].includes(urlMode)) return urlMode;
    
    // Por defecto unified para las rutas normales
    return 'unified';
  }, [location.search]);

  // Sincronización del modo
  useEffect(() => {
    if (systemMode === 'auto') {
      setSystemMode(detectedMode);
    }
  }, [detectedMode, systemMode]);

  // Manejo simple de navegación desde Neural Command Center
  const handleNeuralNavigation = (tool: string, toolContext?: any) => {
    setSystemMode('unified');
    navigateToTool(tool, toolContext);
  };

  // Cambio de modo
  const handleModeToggle = (newMode: 'neural' | 'unified') => {
    setSystemMode(newMode);
    
    const params = new URLSearchParams(location.search);
    params.set('mode', newMode);
    window.history.replaceState({}, '', `${location.pathname}?${params.toString()}`);
  };

  const activeMode = systemMode === 'auto' ? detectedMode : systemMode;
  const resolvedMode: 'neural' | 'unified' = activeMode === 'auto' ? 'unified' : activeMode as 'neural' | 'unified';

  return (
    <CinematicAudioProvider>
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 relative overflow-hidden">
        <MinimizableSystemModeToggle
          currentMode={resolvedMode}
          onModeChange={handleModeToggle}
        />

        <div className="relative z-10">
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
                  initialDimension="educational_universe"
                />
              ) : (
                <SimplifiedDashboardContainer />
              )}
            </motion.div>
          </AnimatePresence>
        </div>
      </div>
    </CinematicAudioProvider>
  );
};
