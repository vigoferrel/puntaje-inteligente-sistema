
import React, { Suspense } from 'react';
import { motion } from 'framer-motion';
import { CinematicSkeletonOptimized } from '@/components/unified-dashboard/CinematicSkeletonOptimized';
import { loadValidator } from '@/core/performance/LoadValidationSystem';

interface OptimizedSuspenseWrapperProps {
  children: React.ReactNode;
  fallbackMessage?: string;
  componentName?: string;
}

export const OptimizedSuspenseWrapper: React.FC<OptimizedSuspenseWrapperProps> = ({
  children,
  fallbackMessage = "Cargando componente optimizado",
  componentName = "Unknown"
}) => {
  const fallback = (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="min-h-96"
    >
      <CinematicSkeletonOptimized 
        message={fallbackMessage}
        progress={75}
        variant="component"
      />
    </motion.div>
  );

  return (
    <Suspense fallback={fallback}>
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
        onAnimationComplete={() => {
          loadValidator.markComponentLoad(componentName);
        }}
      >
        {children}
      </motion.div>
    </Suspense>
  );
};
