
import { useState, useCallback, useEffect } from 'react';

export type NeuralDimensionId = 
  | 'neural_command'
  | 'educational_universe'
  | 'neural_training'
  | 'progress_analysis'
  | 'paes_simulation'
  | 'personalized_feedback'
  | 'battle_mode'
  | 'achievement_system'
  | 'vocational_prediction'
  | 'financial_center'
  | 'calendar_management'
  | 'settings_control';

interface NavigationState {
  activeDimension: NeuralDimensionId;
  showDimensionContent: boolean;
  navigationHistory: NeuralDimensionId[];
}

// Helper function to validate dimension ID
const isValidDimensionId = (id: string): id is NeuralDimensionId => {
  const validIds: NeuralDimensionId[] = [
    'neural_command',
    'educational_universe', 
    'neural_training',
    'progress_analysis',
    'paes_simulation',
    'personalized_feedback',
    'battle_mode',
    'achievement_system',
    'vocational_prediction',
    'financial_center',
    'calendar_management',
    'settings_control'
  ];
  return validIds.includes(id as NeuralDimensionId);
};

export const useNeuralNavigation = (initialDimension: string = 'neural_command') => {
  // Safely convert string to NeuralDimensionId
  const safeDimensionId: NeuralDimensionId = isValidDimensionId(initialDimension) 
    ? initialDimension 
    : 'neural_command';

  const [state, setState] = useState<NavigationState>({
    activeDimension: safeDimensionId,
    showDimensionContent: false,
    navigationHistory: []
  });

  // Activar una dimensión específica
  const handleDimensionActivation = useCallback((dimensionId: NeuralDimensionId) => {
    console.log(`🌌 Activando dimensión neural: ${dimensionId}`);
    
    setState(prevState => ({
      activeDimension: dimensionId,
      showDimensionContent: true,
      navigationHistory: [...prevState.navigationHistory, prevState.activeDimension]
    }));
  }, []);

  // Volver al centro neural
  const handleBackToCenter = useCallback(() => {
    console.log('🏠 Regresando al centro neural');
    
    setState(prevState => ({
      activeDimension: 'neural_command',
      showDimensionContent: false,
      navigationHistory: []
    }));
  }, []);

  // Navegar hacia atrás en el historial
  const navigateBack = useCallback(() => {
    setState(prevState => {
      const newHistory = [...prevState.navigationHistory];
      const previousDimension = newHistory.pop();
      
      if (previousDimension) {
        return {
          activeDimension: previousDimension,
          showDimensionContent: true,
          navigationHistory: newHistory
        };
      }
      
      return {
        activeDimension: 'neural_command',
        showDimensionContent: false,
        navigationHistory: []
      };
    });
  }, []);

  // Detectar cambios de dimensión basados en URL o props
  useEffect(() => {
    const safeDimension = isValidDimensionId(initialDimension) ? initialDimension : 'neural_command';
    if (safeDimension !== state.activeDimension && !state.showDimensionContent) {
      setState(prevState => ({
        ...prevState,
        activeDimension: safeDimension
      }));
    }
  }, [initialDimension, state.activeDimension, state.showDimensionContent]);

  return {
    activeDimension: state.activeDimension,
    showDimensionContent: state.showDimensionContent,
    navigationHistory: state.navigationHistory,
    handleDimensionActivation,
    handleBackToCenter,
    navigateBack,
    canNavigateBack: state.navigationHistory.length > 0
  };
};
