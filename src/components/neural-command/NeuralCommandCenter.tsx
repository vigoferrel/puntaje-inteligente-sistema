
import React from 'react';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { ArrowLeft } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { useSimplifiedIntersectional } from '@/hooks/useSimplifiedIntersectional';

// Configuración y tipos actualizados
import { NEURAL_DIMENSIONS, getDimensionsByPhase } from './config/neuralDimensions';
import { NeuralCommandCenterProps } from './config/neuralTypes';

// Hooks modulares
import { useNeuralNavigation } from './hooks/useNeuralNavigation';
import { useNeuralMetrics } from './hooks/useNeuralMetrics';

// Componentes modulares
import { NeuralLayout } from './layouts/NeuralLayout';
import { NeuralBreadcrumb } from './components/NeuralBreadcrumb';
import { NeuralHeader } from './components/NeuralHeader';
import { NeuralMetrics } from './components/NeuralMetrics';
import { NeuralPhases } from './components/NeuralPhases';
import { NeuralInsights } from './components/NeuralInsights';
import { DimensionContentRenderer } from './renderers/DimensionContentRenderer';

export const NeuralCommandCenter: React.FC<NeuralCommandCenterProps> = ({
  initialDimension = 'neural_command',
  onNavigateToTool
}) => {
  const { user } = useAuth();
  const { isIntersectionalReady, generateIntersectionalInsights } = useSimplifiedIntersectional();
  
  // Hooks modulares
  const { 
    activeDimension, 
    showDimensionContent, 
    handleDimensionActivation, 
    handleBackToCenter 
  } = useNeuralNavigation(initialDimension);
  
  const { metrics, getMetricForDimension } = useNeuralMetrics();

  // Configuración actualizada
  const activeDimensionData = NEURAL_DIMENSIONS.find(d => d.id === activeDimension);
  const dimensionsByPhase = getDimensionsByPhase();
  const insights = generateIntersectionalInsights();

  // Manejar navegación externa
  const handleExternalNavigation = (tool: string, context?: any) => {
    if (onNavigateToTool) {
      onNavigateToTool(tool, context);
    }
    
    // Mapear herramientas externas a dimensiones
    const toolToDimensionMap: Record<string, string> = {
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
      handleDimensionActivation(dimensionId as any);
    }
  };

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
          activeDimensionData={activeDimensionData}
        />
      </NeuralLayout>
    );
  }

  // Vista principal del centro neural reorganizado
  return (
    <NeuralLayout>
      <NeuralBreadcrumb 
        activeDimension={activeDimension}
        activeDimensionData={activeDimensionData}
        onBackToCenter={handleBackToCenter}
        showDimensionContent={showDimensionContent}
      />

      <NeuralHeader isIntersectionalReady={isIntersectionalReady} />

      <NeuralMetrics metrics={metrics} />

      <NeuralPhases
        dimensionsByPhase={dimensionsByPhase}
        activeDimension={activeDimension}
        onDimensionActivation={handleDimensionActivation}
        getMetricForDimension={getMetricForDimension}
      />

      <NeuralInsights insights={insights} />

      {/* Neural Command Footer Actualizado */}
      <motion.div 
        className="text-center mt-8"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.8, delay: 0.8 }}
      >
        <p className="text-blue-200 text-sm mb-4 font-poppins">
          Ecosistema Neural PAES Unificado • {NEURAL_DIMENSIONS.length} Dimensiones Activas • Universe 3D + SuperPAES + Gamificación Integrados
        </p>
        <div className="text-xs text-white/50 font-poppins">
          🧠 Arquitectura Neural Optimizada • 🌌 Universe 3D Inmersivo • ⚡ SuperPAES Coordinador • 🎮 Gamificación Real • 📊 Datos Reales Supabase
        </div>
        
        {/* Quick Access Buttons */}
        <div className="flex justify-center gap-4 mt-6">
          <Button
            onClick={() => handleExternalNavigation('universe')}
            className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-500 hover:to-pink-500"
          >
            🌌 Universe 3D
          </Button>
          <Button
            onClick={() => handleExternalNavigation('simulation')}
            className="bg-gradient-to-r from-red-600 to-orange-600 hover:from-red-500 hover:to-orange-500"
          >
            🎯 PAES Real
          </Button>
          <Button
            onClick={() => handleExternalNavigation('battle')}
            className="bg-gradient-to-r from-pink-600 to-purple-600 hover:from-pink-500 hover:to-purple-500"
          >
            ⚔️ Modo Batalla
          </Button>
        </div>
      </motion.div>
    </NeuralLayout>
  );
};
