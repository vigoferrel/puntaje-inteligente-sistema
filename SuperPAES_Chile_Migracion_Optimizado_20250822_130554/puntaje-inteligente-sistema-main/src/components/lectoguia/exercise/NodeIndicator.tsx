/* eslint-disable react-refresh/only-export-components */
import { FC } from 'react';
import type { SafeString, SafeNumber, SafeBoolean, APIResponse, OperationResult } from '../types/core';


interface NodeIndicatorProps {
  nodeName?: string;
}

export const NodeIndicator: FC<NodeIndicatorProps> = ({ nodeName }) => {
  return (
    <div className="bg-blue-50 p-3 rounded-md border border-blue-100 mb-4 text-sm">
      <p className="text-blue-600 font-medium">
        <span className="mr-2">ðŸ“š</span> 
        {nodeName 
          ? `Ejercicio relacionado con el nodo: ${nodeName}`
          : 'Este ejercicio estÃ¡ relacionado con un nodo de aprendizaje.'
        }
      </p>
    </div>
  );
};

