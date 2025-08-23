import React from 'react';

interface MetricsDisplayProps {
  metrics: {
    conciencia: number;
    coherencia: number;
    decisiones: number;
  };
}

const MetricsDisplay: React.FC<MetricsDisplayProps> = ({ metrics }) => {
  return (
    <div className="metrics-display">
      <div className="metrics-display__item">
        <span className="metrics-display__label">Conciencia:</span>
        <span className="metrics-display__value">{metrics.conciencia.toFixed(3)}</span>
      </div>
      <div className="metrics-display__item">
        <span className="metrics-display__label">Coherencia:</span>
        <span className="metrics-display__value">{metrics.coherencia.toFixed(3)}</span>
      </div>
      <div className="metrics-display__item">
        <span className="metrics-display__label">Decisiones:</span>
        <span className="metrics-display__value">{metrics.decisiones}</span>
      </div>
    </div>
  );
};

export default MetricsDisplay;
