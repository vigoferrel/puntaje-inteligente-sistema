import React from 'react';
import { usePaesOptimization, OptimizationNode } from '../../hooks/paes-optimization/usePaesOptimization';

const PaesOptimizationMobile: React.FC = () => {
  const { nodes, completedCount, totalCount, markNodeCompleted } = usePaesOptimization();

  return (
    <div style={{ padding: 20, fontFamily: 'Arial, sans-serif' }}>
      <h2>Optimización PAES - Móvil</h2>
      <p>Progreso: {completedCount} de {totalCount} nodos completados</p>
      <ul style={{ listStyle: 'none', padding: 0 }}>
        {nodes.map((node: OptimizationNode) => (
          <li key={node.id} style={{ marginBottom: 10, backgroundColor: node.isCompleted ? '#d4edda' : '#f8d7da', padding: 10, borderRadius: 5 }}>
            <div><strong>Materia:</strong> {node.subject}</div>
            <div><strong>Descripción:</strong> {node.description}</div>
            <button
              disabled={node.isCompleted}
              onClick={() => markNodeCompleted(node.id)}
              style={{
                marginTop: 5,
                padding: '5px 10px',
                backgroundColor: node.isCompleted ? '#6c757d' : '#28a745',
                color: 'white',
                border: 'none',
                borderRadius: 3,
                cursor: node.isCompleted ? 'default' : 'pointer'
              }}
            >
              {node.isCompleted ? 'Completado' : 'Marcar como completado'}
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default PaesOptimizationMobile;