
import React from 'react';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { ArrowLeft } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';

// Import from the correct source
import { NEURAL_DIMENSIONS, getDimensionsByPhase } from './config/neuralDimensions';
import { NeuralCommandCenterProps, NeuralDimensionConfig } from './config/neuralTypes';

// Hooks modulares - AHORA CON DATOS REALES
import { useNeuralNavigation, NeuralDimensionId } from './hooks/useNeuralNavigation';
import { useRealNeuralMetrics } from '@/hooks/useRealNeuralMetrics';

// Componentes modulares
import { NeuralLayout } from './layouts/NeuralLayout';
import { NeuralBreadcrumb } from './components/NeuralBreadcrumb';
import { NeuralHeader } from './components/NeuralHeader';
import { NeuralMetrics } from './components/NeuralMetrics';
import { NeuralPhases } from './components/NeuralPhases';
import { DimensionContentRenderer } from './renderers/DimensionContentRenderer';
import { CinematicSkeletonOptimized } from '@/components/unified-dashboard/CinematicSkeletonOptimized';

export const NeuralCommandCenter: React.FC<NeuralCommandCenterProps> = ({
  initialDimension = 'neural_command',
  onNavigateToTool
}) => {
  const { user } = useAuth();
  
  // Hooks modulares CON DATOS REALES
  const { 
    activeDimension, 
    showDimensionContent, 
    handleDimensionActivation, 
    handleBackToCenter 
  } = useNeuralNavigation(initialDimension);
  
  const { 
    metrics, 
    isLoading, 
    error, 
    getMetricForDimension 
  } = useRealNeuralMetrics();

  // Convert NeuralDimension to NeuralDimensionConfig format
  const convertToConfig = (dimension: any): NeuralDimensionConfig => ({
    ...dimension,
    name: dimension.title // Map title to name for compatibility
  });

  // Configuración actualizada con conversión de tipos
  const activeDimensionData = NEURAL_DIMENSIONS.find(d => d.id === activeDimension);
  const rawDimensionsByPhase = getDimensionsByPhase();
  
  // Convert to the expected format
  const dimensionsByPhase: Record<string, NeuralDimensionConfig[]> = {
    foundation: rawDimensionsByPhase.foundation.map(convertToConfig),
    intelligence: rawDimensionsByPhase.intelligence.map(convertToConfig),
    evolution: rawDimensionsByPhase.evolution.map(convertToConfig)
  };

  // Manejar navegación externa
  const handleExternalNavigation = (tool: string, context?: any) => {
    if (onNavigateToTool) {
      onNavigateToTool(tool, context);
    }
    
    // Mapear herramientas externas a dimensiones
    const toolToDimensionMap: Record<string, NeuralDimensionId> = {
      'universe': 'educational_universe',
      'lectoguia': 'neural_training',
      'diagnostic': 'progress_analysis',
      'simulation': 'paes_simulation',
      'feedback': 'personalized_feedback',
      'battle': 'battle_mode',
      'achievements': 'achievement_system',
      'vocational': 'vocational_prediction',
      'financial': 'financial_center',
      'calendar': 'calendar_management',
      'settings': 'settings_control'
    };

    const dimensionId = toolToDimensionMap[tool];
    if (dimensionId) {
      handleDimensionActivation(dimensionId);
    }
  };

  // Loading state con datos reales
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

  // Vista de contenido de dimensión
  if (showDimensionContent) {
    return (
      <NeuralLayout>
        <NeuralBreadcrumb 
          activeDimension={activeDimension}
          activeDimensionData={activeDimensionData}
          onBackToCenter={handleBackToCenter}
          showDimensionContent={showDimensionContent}
        />
        
        <div className="mb-6">
          <Button
            onClick={handleBackToCenter}
            variant="ghost"
            className="text-cyan-400 hover:text-cyan-300 hover:bg-cyan-400/10 font-poppins"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Volver al Centro Neural
          </Button>
        </div>
        
        <DimensionContentRenderer 
          activeDimension={activeDimension}
          activeDimensionData={convertToConfig(activeDimensionData)}
        />
      </NeuralLayout>
    );
  }

  // Vista principal del centro neural con DATOS REALES
  return (
    <NeuralLayout>
      <NeuralBreadcrumb 
        activeDimension={activeDimension}
        activeDimensionData={activeDimensionData}
        onBackToCenter={handleBackToCenter}
        showDimensionContent={showDimensionContent}
      />

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

      {/* Neural Command Footer Actualizado con DATOS REALES */}
      <motion.div 
        className="text-center mt-8"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.8, delay: 0.8 }}
      >
        <p className="text-blue-200 text-sm mb-4 font-poppins">
          Ecosistema Neural PAES Conectado • {NEURAL_DIMENSIONS.length} Dimensiones con Datos Reales • Universe 3D + SuperPAES + Gamificación Integrados
        </p>
        <div className="text-xs text-white/50 font-poppins">
          🧠 Datos Reales de Supabase • 🌌 Métricas Personalizadas • ⚡ SuperPAES Conectado • 🎮 Progreso Real • 📊 {user?.email}
        </div>
        
        {/* Quick Access Buttons */}
        <div className="flex justify-center gap-4 mt-6">
          <Button
            onClick={() => handleExternalNavigation('universe')}
            className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-500 hover:to-pink-500"
          >
            🌌 Universe 3D ({metrics.universe_exploration_depth}%)
          </Button>
          <Button
            onClick={() => handleExternalNavigation('simulation')}
            className="bg-gradient-to-r from-red-600 to-orange-600 hover:from-red-500 hover:to-orange-500"
          >
            🎯 PAES Real ({metrics.paes_simulation_accuracy}%)
          </Button>
          <Button
            onClick={() => handleExternalNavigation('battle')}
            className="bg-gradient-to-r from-pink-600 to-purple-600 hover:from-pink-500 hover:to-purple-500"
          >
            ⚔️ Modo Batalla ({metrics.gamification_engagement}%)
          </Button>
        </div>
      </motion.div>
    </NeuralLayout>
  );
};
