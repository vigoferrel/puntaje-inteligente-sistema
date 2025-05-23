
import { createContext, useContext } from 'react';
import { LectoGuiaContextType } from './types';

export const LectoGuiaContext = createContext<LectoGuiaContextType | undefined>(undefined);

export const useLectoGuia = () => {
  const context = useContext(LectoGuiaContext);
  if (!context) {
    throw new Error('useLectoGuia must be used within a LectoGuiaProvider');
  }
  return context;
};
