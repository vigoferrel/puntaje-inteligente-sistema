
import React from 'react';
import { LectoGuiaOrchestrator } from './core/LectoGuiaOrchestrator';

interface LectoGuiaIntersectionalProps {
  userId?: string;
  initialSubject?: string;
  onNavigateToTool?: (tool: string, context?: any) => void;
}

/**
 * Componente principal de LectoGuía Interseccional
 * Interface simplificada para la nueva arquitectura unificada
 */
export const LectoGuiaIntersectional: React.FC<LectoGuiaIntersectionalProps> = (props) => {
  return <LectoGuiaOrchestrator {...props} />;
};
