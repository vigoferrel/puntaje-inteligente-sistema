/* eslint-disable react-refresh/only-export-components */
import React, { useState, useEffect } from 'react';
export const SequentialDashboard = () => {
  const [metrics, setMetrics] = useState({
    currentStep: 'Evaluacion',
    overallScore: 85,
    decisions: 0,
  });
  useEffect(() => {
    const interval = setInterval(() => {
      setMetrics(prev => ({
        ...prev,
        overallScore: Math.floor(Math.random() * 10) + 85,
        decisions: prev.decisions + Math.floor(Math.random() * 3),
        executions: prev.executions + Math.floor(Math.random() * 2)
      }));
    }, 5000);
    return () => clearInterval(interval);
  }, []);
  return (
    <div style={{padding: '20px', backgroundColor: '#1a1a2e', color: 'white'}}>
      <h2>Sequential Thinking Dashboard</h2>
      <div style={{display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '20px'}}>
        <div>
          <h3>Estado Actual</h3>
          <p>Paso: {metrics.currentStep}</p>
          <p>Score Global: {metrics.overallScore}%</p>
        </div>
        <div>
          <h3>Actividad</h3>
          <p>Decisiones: {metrics.decisions}</p>
          <p>Ejecuciones: {metrics.executions}</p>
        </div>
      </div>
    </div>
  );
};

