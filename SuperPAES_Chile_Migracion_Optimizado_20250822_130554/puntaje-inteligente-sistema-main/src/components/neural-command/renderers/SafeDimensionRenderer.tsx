/* eslint-disable react-refresh/only-export-components */

import React, { Suspense } from 'react';
import type { SafeString, SafeNumber, SafeBoolean, APIResponse, OperationResult } from '../types/core';
import { motion } from 'framer-motion';
import { NeuralDimension, NeuralDimensionConfig } from '../config/neuralTypes';
import { CinematicSkeletonOptimized } from '../../../components/unified-dashboard/CinematicSkeletonOptimized';

// Import safe, existing components only
const HolographicDashboard = React.lazy(() =>
  import('@/components/intelligent-dashboard/HolographicDashboard').then(module => ({
    default: module.HolographicDashboard
  })).catch(() => ({
    default: () => <div className="p-6 text-white">Dashboard no disponible</div>
  }))
);

const PAESFinancialCalculator = React.lazy(() => 
  import('@/components/financial/PAESFinancialCalculator').then(module => ({
    default: module.PAESFinancialCalculator
  })).catch(() => ({
    default: () => <div className="p-6 text-white">Calculadora no disponible</div>
  }))
);

// Safe dimension components
import { NeuralCommandDimension } from './dimensions/NeuralCommandDimension';
import { UniverseDimension } from './dimensions/UniverseDimension';
import { TrainingDimension } from './dimensions/TrainingDimension';
import { ProgressAnalysisDimension } from './dimensions/ProgressAnalysisDimension';
import { BattleModeDimension } from './dimensions/BattleModeDimension';
import { AchievementSystemDimension } from './dimensions/AchievementSystemDimension';
import { VocationalPredictionDimension } from './dimensions/VocationalPredictionDimension';
import { PersonalizedFeedbackDimension } from './dimensions/PersonalizedFeedbackDimension';
import { PAESSimulationDimension } from './dimensions/PAESSimulationDimension';
import { SettingsControlDimension } from './dimensions/SettingsControlDimension';
import { DefaultDimension } from './dimensions/DefaultDimension';

interface SafeDimensionRendererProps {
  activeDimension: NeuralDimension;
  activeDimensionData?: NeuralDimensionConfig;
}

export const SafeDimensionRenderer: React.FC<SafeDimensionRendererProps> = ({
  activeDimension,
  activeDimensionData
}) => {
  const renderDimensionContent = () => {
    try {
      switch (activeDimension) {
        case 'neural_command':
          return (
            <Suspense fallback={<CinematicSkeletonOptimized variant="dashboard" />}>
              <NeuralCommandDimension />
            </Suspense>
          );

        case 'educational_universe':
          return (
            <Suspense fallback={<CinematicSkeletonOptimized variant="universe" />}>
              <UniverseDimension />
            </Suspense>
          );

        case 'neural_training':
          return (
            <Suspense fallback={<CinematicSkeletonOptimized variant="training" />}>
              <TrainingDimension />
            </Suspense>
          );

        case 'progress_analysis':
          return (
            <Suspense fallback={<CinematicSkeletonOptimized variant="diagnostic" />}>
              <ProgressAnalysisDimension />
            </Suspense>
          );

        case 'battle_mode':
          return (
            <Suspense fallback={<CinematicSkeletonOptimized variant="battle" message="Cargando Arena de Batalla..." />}>
              <BattleModeDimension />
            </Suspense>
          );

        case 'achievement_system':
          return (
            <Suspense fallback={<CinematicSkeletonOptimized variant="achievements" message="Cargando Sistema de Logros..." />}>
              <AchievementSystemDimension />
            </Suspense>
          );

        case 'vocational_prediction':
          return (
            <Suspense fallback={<CinematicSkeletonOptimized variant="ai" message="Cargando Predictor Vocacional IA..." />}>
              <VocationalPredictionDimension />
            </Suspense>
          );

        case 'personalized_feedback':
          return (
            <Suspense fallback={<CinematicSkeletonOptimized variant="feedback" message="Cargando Coach IA Personal..." />}>
              <PersonalizedFeedbackDimension />
            </Suspense>
          );

        case 'financial_center':
          return (
            <Suspense fallback={<CinematicSkeletonOptimized variant="financial" />}>
              <PAESFinancialCalculator />
            </Suspense>
          );

        case 'calendar_management':
          return (
            <Suspense fallback={<CinematicSkeletonOptimized variant="calendar" />}>
              <div className="p-6">
                <h2 className="text-2xl font-bold text-white mb-4">ðŸ“… GestiÃ³n de Calendario</h2>
                <p className="text-white/70">Sistema de calendario en desarrollo</p>
              </div>
            </Suspense>
          );

        case 'paes_simulation':
          return (
            <Suspense fallback={<CinematicSkeletonOptimized variant="ai" />}>
              <PAESSimulationDimension />
            </Suspense>
          );

        case 'settings_control':
          return (
            <Suspense fallback={<CinematicSkeletonOptimized variant="ai" />}>
              <SettingsControlDimension />
            </Suspense>
          );

        default:
          return (
            <DefaultDimension 
              activeDimension={activeDimension}
              activeDimensionData={activeDimensionData}
            />
          );
      }
    } catch (error) {
      console.error(`Error rendering dimension ${activeDimension}:`, error);
      return (
        <DefaultDimension 
          activeDimension={activeDimension}
          activeDimensionData={activeDimensionData}
        />
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



