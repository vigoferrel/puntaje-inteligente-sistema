
import React from 'react';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { ArrowLeft } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { useSimplifiedIntersectional } from '@/hooks/useSimplifiedIntersectional';

// Configuración y tipos
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
  initialDimension = 'universe_exploration'
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

  // Configuración
  const activeDimensionData = NEURAL_DIMENSIONS.find(d => d.id === activeDimension);
  const dimensionsByPhase = getDimensionsByPhase();
  const insights = generateIntersectionalInsights();

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

  // Vista principal del centro neural
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

      {/* Neural Command Footer */}
      <motion.div 
        className="text-center mt-8"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.8, delay: 0.8 }}
      >
        <p className="text-blue-200 text-sm mb-4 font-poppins">
          Ecosistema Neural PAES Unificado • {NEURAL_DIMENSIONS.length} Dimensiones Activas • Sincronización Neural: Tiempo Real
        </p>
        <div className="text-xs text-white/50 font-poppins">
          🧠 Arquitectura Neural Optimizada • 🚀 Flujo Educativo Integrado • ⚡ Cero Duplicación de Trabajo
        </div>
      </motion.div>
    </NeuralLayout>
  );
};
