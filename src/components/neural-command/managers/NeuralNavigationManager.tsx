
import React from 'react';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { ArrowLeft } from 'lucide-react';
import { useNeuralNavigation } from '../hooks/useNeuralNavigation';
import { NeuralBreadcrumb } from '../components/NeuralBreadcrumb';
import { NEURAL_DIMENSIONS } from '../config/neuralDimensions';

interface NeuralNavigationManagerProps {
  initialDimension?: string;
  children: (navigationState: any) => React.ReactNode;
}

export const NeuralNavigationManager: React.FC<NeuralNavigationManagerProps> = ({
  initialDimension = 'neural_command',
  children
}) => {
  const { 
    activeDimension, 
    showDimensionContent, 
    handleDimensionActivation, 
    handleBackToCenter 
  } = useNeuralNavigation(initialDimension as any);

  const activeDimensionData = NEURAL_DIMENSIONS.find(d => d.id === activeDimension);

  const navigationState = {
    activeDimension,
    activeDimensionData,
    showDimensionContent,
    handleDimensionActivation,
    handleBackToCenter
  };

  return (
    <>
      <NeuralBreadcrumb 
        activeDimension={activeDimension}
        activeDimensionData={activeDimensionData}
        onBackToCenter={handleBackToCenter}
        showDimensionContent={showDimensionContent}
      />
      
      {showDimensionContent && (
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
      )}
      
      {children(navigationState)}
    </>
  );
};
