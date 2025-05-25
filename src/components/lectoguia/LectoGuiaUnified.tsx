
import React from 'react';
import { LectoGuiaIntersectional } from './LectoGuiaIntersectional';

interface LectoGuiaUnifiedProps {
  initialSubject?: string;
  onSubjectChange?: (subject: string) => void;
  onNavigateToTool?: (tool: string, context?: any) => void;
}

/**
 * Componente de compatibilidad hacia atrás
 * Redirige a la nueva arquitectura interseccional
 */
export const LectoGuiaUnified: React.FC<LectoGuiaUnifiedProps> = (props) => {
  return <LectoGuiaIntersectional {...props} />;
};
