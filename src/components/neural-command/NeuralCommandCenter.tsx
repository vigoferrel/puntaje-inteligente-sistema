
import React from 'react';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';

// Providers y managers modulares
import { NeuralDataProvider, useNeuralData } from './providers/NeuralDataProvider';
import { NeuralNavigationManager } from './managers/NeuralNavigationManager';

// Componentes modulares
import { NeuralLayout } from './layouts/NeuralLayout';
import { NeuralHeader } from './components/NeuralHeader';
import { NeuralMetrics } from './components/NeuralMetrics';
import { NeuralPhases } from './components/NeuralPhases';
import { DimensionContentRenderer } from './renderers/DimensionContentRenderer';
import { CinematicSkeletonOptimized } from '@/components/unified-dashboard/CinematicSkeletonOptimized';

// Configuración
import { getDimensionsByPhase } from './config/neuralDimensions';
import { NeuralCommandCenterProps, NeuralDimensionConfig } from './config/neuralTypes';

// Core del componente principal
const NeuralCommandCenterCore: React.FC<NeuralCommandCenterProps> = ({
  initialDimension = 'neural_command',
  onNavigateToTool
}) => {
  const { metrics, isLoading, error, user, getMetricForDimension } = useNeuralData();

  // Convert to the expected format
  const convertToConfig = (dimension: any): NeuralDimensionConfig => ({
    ...dimension,
    name: dimension.title
  });

  const rawDimensionsByPhase = getDimensionsByPhase();
  const dimensionsByPhase: Record<string, NeuralDimensionConfig[]> = {
    foundation: rawDimensionsByPhase.foundation.map(convertToConfig),
    intelligence: rawDimensionsByPhase.intelligence.map(convertToConfig),
    evolution: rawDimensionsByPhase.evolution.map(convertToConfig)
  };

  // Loading state
  if (isLoading || !metrics) {
    return (
      <CinematicSkeletonOptimized 
        message="Cargando Métricas Neurales Reales"
        progress={85}
        variant="full"
      />
    );
  }

  // Error state
  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center p-6">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-red-400 mb-4">Error al Cargar Datos</h2>
          <p className="text-gray-300 mb-4">{error}</p>
          <Button onClick={() => window.location.reload()}>
            Reintentar
          </Button>
        </div>
      </div>
    );
  }

  return (
    <NeuralNavigationManager initialDimension={initialDimension}>
      {({ activeDimension, activeDimensionData, showDimensionContent, handleDimensionActivation }) => (
        <NeuralLayout>
          {showDimensionContent ? (
            <DimensionContentRenderer 
              activeDimension={activeDimension}
              activeDimensionData={convertToConfig(activeDimensionData)}
            />
          ) : (
            <>
              <NeuralHeader isIntersectionalReady={true} />
              <NeuralMetrics metrics={metrics} />
              <NeuralPhases
                dimensionsByPhase={dimensionsByPhase}
                activeDimension={activeDimension}
                onDimensionActivation={handleDimensionActivation}
                getMetricForDimension={getMetricForDimension}
              />

              {/* Real Data Insights */}
              <motion.div 
                className="mb-8"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 0.6 }}
              >
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="bg-white/10 rounded-lg p-4 border border-white/20">
                    <h3 className="text-sm font-semibold text-cyan-400 mb-2">Datos Conectados</h3>
                    <p className="text-xs text-white/70">
                      Métricas calculadas desde Supabase en tiempo real
                    </p>
                  </div>
                  <div className="bg-white/10 rounded-lg p-4 border border-white/20">
                    <h3 className="text-sm font-semibold text-green-400 mb-2">Usuario: {user?.email}</h3>
                    <p className="text-xs text-white/70">
                      Progreso personal actualizado automáticamente
                    </p>
                  </div>
                  <div className="bg-white/10 rounded-lg p-4 border border-white/20">
                    <h3 className="text-sm font-semibold text-purple-400 mb-2">Sistema Neural</h3>
                    <p className="text-xs text-white/70">
                      {metrics.neural_efficiency}% de eficiencia neural activa
                    </p>
                  </div>
                </div>
              </motion.div>

              {/* Quick Access Buttons */}
              <motion.div 
                className="text-center mt-8"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.8, delay: 0.8 }}
              >
                <div className="flex justify-center gap-4 mt-6">
                  <Button
                    onClick={() => handleDimensionActivation('educational_universe')}
                    className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-500 hover:to-pink-500"
                  >
                    🌌 Universe 3D ({metrics.universe_exploration_depth}%)
                  </Button>
                  <Button
                    onClick={() => handleDimensionActivation('paes_simulation')}
                    className="bg-gradient-to-r from-red-600 to-orange-600 hover:from-red-500 hover:to-orange-500"
                  >
                    🎯 PAES Real ({metrics.paes_simulation_accuracy}%)
                  </Button>
                  <Button
                    onClick={() => handleDimensionActivation('battle_mode')}
                    className="bg-gradient-to-r from-pink-600 to-purple-600 hover:from-pink-500 hover:to-purple-500"
                  >
                    ⚔️ Modo Batalla ({metrics.gamification_engagement}%)
                  </Button>
                </div>
              </motion.div>
            </>
          )}
        </NeuralLayout>
      )}
    </NeuralNavigationManager>
  );
};

// Componente principal con provider
export const NeuralCommandCenter: React.FC<NeuralCommandCenterProps> = (props) => {
  return (
    <NeuralDataProvider>
      <NeuralCommandCenterCore {...props} />
    </NeuralDataProvider>
  );
};
