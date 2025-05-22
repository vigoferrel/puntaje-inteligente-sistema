
import React from 'react';

interface NodeIndicatorProps {
  nodeName?: string;
}

export const NodeIndicator: React.FC<NodeIndicatorProps> = ({ nodeName }) => {
  return (
    <div className="bg-blue-50 p-3 rounded-md border border-blue-100 mb-4 text-sm">
      <p className="text-blue-600 font-medium">
        <span className="mr-2">📚</span> 
        {nodeName 
          ? `Ejercicio relacionado con el nodo: ${nodeName}`
          : 'Este ejercicio está relacionado con un nodo de aprendizaje.'
        }
      </p>
    </div>
  );
};
