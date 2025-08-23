/* eslint-disable react-refresh/only-export-components */
import { useContext } from 'react';
import { AdaptivePerformanceContext } from '../../contexts/AdaptivePerformanceContext';

export const useAdaptivePerformance = () => {
  const context = useContext(AdaptivePerformanceContext);
  if (!context) {
    throw new Error('useAdaptivePerformance debe usarse dentro de AdaptivePerformanceProvider');
  }
  return context;
};

