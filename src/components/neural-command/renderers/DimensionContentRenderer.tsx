
import React, { Suspense } from 'react';
import { motion } from 'framer-motion';
import { NeuralDimension, NeuralDimensionConfig } from '../config/neuralTypes';
import { CinematicSkeletonOptimized } from '@/components/unified-dashboard/CinematicSkeletonOptimized';

// Lazy loading de componentes para optimización
const EducationalUniverse = React.lazy(() => import('@/components/universe/EducationalUniverse').then(module => ({
  default: module.EducationalUniverse
})));

const HolographicDashboard = React.lazy(() => import('@/components/intelligent-dashboard/HolographicDashboard').then(module => ({
  default: module.HolographicDashboard
})));

const LectoGuiaUnifiedCinematic = React.lazy(() => import('@/components/lectoguia/LectoGuiaUnifiedCinematic').then(module => ({
  default: module.LectoGuiaUnifiedCinematic
})));

const DiagnosticControllerCinematic = React.lazy(() => import('@/components/diagnostic/DiagnosticControllerCinematic').then(module => ({
  default: module.DiagnosticControllerCinematic
})));

const PAESFinancialCalculator = React.lazy(() => import('@/components/financial/PAESFinancialCalculator').then(module => ({
  default: module.PAESFinancialCalculator
})));

const StudyCalendarIntegration = React.lazy(() => import('@/components/calendar/StudyCalendarIntegration').then(module => ({
  default: module.StudyCalendarIntegration
})));

interface DimensionContentRendererProps {
  activeDimension: NeuralDimension;
  activeDimensionData?: NeuralDimensionConfig;
}

export const DimensionContentRenderer: React.FC<DimensionContentRendererProps> = ({
  activeDimension,
  activeDimensionData
}) => {
  const renderDimensionContent = () => {
    switch (activeDimension) {
      // Centro Neural
      case 'neural_command':
        return (
          <Suspense fallback={<CinematicSkeletonOptimized variant="dashboard" />}>
            <HolographicDashboard 
              metrics={{
                totalNodes: 277,
                completedNodes: 89,
                averagePerformance: 87,
                learningVelocity: 0.85,
                predictionAccuracy: 92,
                totalStudyTime: 3240,
                nodesCompleted: 89
              }} 
              patterns={{}} 
            />
          </Suspense>
        );

      // Universe 3D
      case 'educational_universe':
        return (
          <Suspense fallback={<CinematicSkeletonOptimized variant="universe" />}>
            <EducationalUniverse 
              initialMode="overview"
              activeSubject="COMPETENCIA_LECTORA"
            />
          </Suspense>
        );

      // Entrenamiento Neural
      case 'neural_training':
        return (
          <Suspense fallback={<CinematicSkeletonOptimized variant="training" />}>
            <LectoGuiaUnifiedCinematic
              initialSubject="COMPETENCIA_LECTORA"
              onSubjectChange={() => {}}
              onNavigateToTool={() => {}}
            />
          </Suspense>
        );

      // Análisis de Progreso
      case 'progress_analysis':
        return (
          <Suspense fallback={<CinematicSkeletonOptimized variant="diagnostic" />}>
            <DiagnosticControllerCinematic
              onNavigateToTool={() => {}}
            />
          </Suspense>
        );

      // Centro Financiero
      case 'financial_center':
        return (
          <Suspense fallback={<CinematicSkeletonOptimized variant="financial" />}>
            <PAESFinancialCalculator />
          </Suspense>
        );

      // Calendario
      case 'calendar_management':
        return (
          <Suspense fallback={<CinematicSkeletonOptimized variant="calendar" />}>
            <StudyCalendarIntegration />
          </Suspense>
        );

      // Otras dimensiones - placeholder temporal
      default:
        return (
          <div className="p-6">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-center space-y-4"
            >
              <h2 className="text-2xl font-bold text-white">
                Dimensión Neural: {activeDimensionData?.name || activeDimension}
              </h2>
              <p className="text-white/70">
                {activeDimensionData?.description || 'Configurando módulo...'}
              </p>
              <div className="bg-white/5 rounded-lg p-8">
                <p className="text-white/60">
                  Este módulo está siendo optimizado para la experiencia neural unificada.
                </p>
              </div>
            </motion.div>
          </div>
        );
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.95 }}
      transition={{ duration: 0.3 }}
      className="min-h-screen"
    >
      {renderDimensionContent()}
    </motion.div>
  );
};
