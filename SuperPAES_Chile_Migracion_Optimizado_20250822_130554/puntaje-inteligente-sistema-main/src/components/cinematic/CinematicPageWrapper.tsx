/* eslint-disable react-refresh/only-export-components */
import { ReactNode, FC } from 'react';

interface CinematicPageWrapperProps {
  children: ReactNode;
  pageName: string;
  variant?: 'neural' | 'cosmic' | 'energy' | 'universe';
}

export const CinematicPageWrapper: FC<CinematicPageWrapperProps> = ({
  children
}) => {
  // Componente simplificado - sin animaciones problemÃ¡ticas
  return (
    <div className="min-h-screen bg-transparent">
      {children}
    </div>
  );
};

