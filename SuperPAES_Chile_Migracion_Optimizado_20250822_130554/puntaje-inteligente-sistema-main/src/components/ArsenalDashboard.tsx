/* eslint-disable react-refresh/only-export-components */
import React from 'react';
import { useArsenal } from '../hooks/useArsenalOptimized';
export const ArsenalDashboard = () => {
  const { metrics } = useArsenal();
  return (
    <div style={{padding: '20px'}}>
      <h2>Arsenal Educativo Activo</h2>
      <div>Velocidad Aprendizaje: {metrics.learningVelocity}%</div>
      <div>Eficiencia Neural: {metrics.neuralEfficiency}%</div>
      <div>Preparacion PAES: {metrics.paesReadiness}%</div>
      <div>Engagement: {metrics.engagement}%</div>
    </div>
  );
};

