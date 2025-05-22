
import { useContext } from 'react';
import { LectoGuiaContextType } from './types';
import { createContext } from 'react';

// Crear el contexto
export const LectoGuiaContext = createContext<LectoGuiaContextType | undefined>(undefined);

// Hook para consumir el contexto
export function useLectoGuia() {
  const context = useContext(LectoGuiaContext);
  
  if (!context) {
    throw new Error("useLectoGuia debe ser usado dentro de un LectoGuiaProvider");
  }
  
  return context;
};
