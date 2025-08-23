import React, { useEffect, useState } from 'react';

interface Metric {
  name: string;
  value: number;
  unit: string;
}

export const RealTimeMetricsDashboard: React.FC = () => {
  const [metrics, setMetrics] = useState<Metric[]>([]);

  useEffect(() => {
    // Simulación de actualización de métricas en tiempo real
    const interval = setInterval(() => {
      setMetrics([
        { name: 'Ejercicios Completados', value: Math.floor(Math.random() * 100), unit: '' },
        { name: 'Puntaje Actual', value: Math.floor(Math.random() * 1000), unit: 'pts' },
        { name: 'Tiempo de Estudio', value: Math.floor(Math.random() * 120), unit: 'min' },
      ]);
    }, 3000);

    return () => clearInterval(interval);
  }, []);

  return (
    <div style={{ padding: '1rem', backgroundColor: '#222', color: '#eee', borderRadius: '8px' }}>
      <h3>Métricas en Tiempo Real</h3>
      <ul>
        {metrics.map((metric) => (
          <li key={metric.name}>
            {metric.name}: {metric.value} {metric.unit}
          </li>
        ))}
      </ul>
    </div>
  );
};
