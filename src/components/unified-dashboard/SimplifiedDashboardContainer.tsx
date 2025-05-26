
import React, { Suspense, lazy } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { SimpleUnifiedHeader } from './SimpleUnifiedHeader';
import { useSimpleNavigation } from '@/hooks/useSimpleNavigation';
import { Loader2 } from 'lucide-react';

// Lazy loading simple con React.lazy
const LazyOptimizedDashboard = lazy(() => 
  import('@/components/dashboard/OptimizedDashboard').then(module => ({
    default: module.OptimizedDashboard
  }))
);

const LazyLectoGuiaUnified = lazy(() => 
  import('@/components/lectoguia/LectoGuiaUnified').then(module => ({
    default: module.LectoGuiaUnified
  }))
);

const LazyStudyCalendar = lazy(() => 
  import('@/components/calendar/CinematicCalendar').then(module => ({
    default: module.CinematicCalendar
  }))
);

// Fallback simple y elegante
const LoadingFallback: React.FC<{ componentName: string }> = ({ componentName }) => (
  <div className="min-h-[calc(100vh-80px)] bg-gradient-to-br from-slate-900 via-blue-900 to-indigo-900 flex items-center justify-center">
    <div className="text-center space-y-4">
      <motion.div
        animate={{ rotate: 360 }}
        transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
      >
        <Loader2 className="w-8 h-8 text-cyan-400 mx-auto" />
      </motion.div>
      <p className="text-white/70">Cargando {componentName}...</p>
    </div>
  </div>
);

export const SimplifiedDashboardContainer: React.FC = () => {
  const { currentTool, navigateToTool } = useSimpleNavigation();

  const renderCurrentTool = () => {
    switch (currentTool) {
      case 'dashboard':
        return (
          <Suspense fallback={<LoadingFallback componentName="Dashboard" />}>
            <LazyOptimizedDashboard onNavigateToTool={navigateToTool} />
          </Suspense>
        );
        
      case 'lectoguia':
        return (
          <Suspense fallback={<LoadingFallback componentName="LectoGuía" />}>
            <LazyLectoGuiaUnified onNavigateToTool={navigateToTool} />
          </Suspense>
        );
        
      case 'calendario':
        return (
          <Suspense fallback={<LoadingFallback componentName="Calendario" />}>
            <LazyStudyCalendar />
          </Suspense>
        );
        
      default:
        return (
          <div className="min-h-[calc(100vh-80px)] bg-gradient-to-br from-slate-900 via-blue-900 to-indigo-900 p-6">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="max-w-4xl mx-auto text-center space-y-6"
            >
              <h2 className="text-3xl font-bold text-white">
                {currentTool.charAt(0).toUpperCase() + currentTool.slice(1)}
              </h2>
              <p className="text-white/70">
                Esta sección está en desarrollo
              </p>
            </motion.div>
          </div>
        );
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-indigo-900">
      <SimpleUnifiedHeader
        currentTool={currentTool}
        onNavigateToTool={navigateToTool}
      />
      
      <main className="relative overflow-hidden">
        <AnimatePresence mode="wait">
          <motion.div
            key={currentTool}
            initial={{ opacity: 0, scale: 0.99 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.99 }}
            transition={{ duration: 0.2, ease: "easeInOut" }}
          >
            {renderCurrentTool()}
          </motion.div>
        </AnimatePresence>
      </main>
    </div>
  );
};
