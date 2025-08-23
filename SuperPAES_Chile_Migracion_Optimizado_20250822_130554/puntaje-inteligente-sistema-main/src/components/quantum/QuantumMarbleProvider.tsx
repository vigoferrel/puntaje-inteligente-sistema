/* eslint-disable react-refresh/only-export-components */
/**
 * ðŸŒŒ QUANTUM MARBLE PROVIDER
 * Proveedor Global del MÃ¡rmol CuÃ¡ntico
 * Context7 + OrquestaciÃ³n Global
 */

import React, { useEffect, ReactNode } from 'react';
import { QuantumMarbleContext, QuantumMarble } from '../../core/QuantumMarbleOrchestrator';

interface QuantumMarbleProviderProps {
  children: ReactNode;
}

export const QuantumMarbleProvider: React.FC<QuantumMarbleProviderProps> = ({ children }) => {
  useEffect(() => {
    // ðŸŒŒ INICIALIZACIÃ“N AUTOMÃTICA DEL MÃRMOL
    console.log('ðŸŒŒ QUANTUM MARBLE PROVIDER: Inicializando...');
    QuantumMarble.initialize();
    
    // ðŸ”” SUSCRIPCIÃ“N A CAMBIOS GLOBALES
    const unsubscribe = QuantumMarble.subscribe((state) => {
      console.log('ðŸ”„ MARBLE STATE UPDATE:', state);
    });

    return () => {
      console.log('ðŸŒŒ QUANTUM MARBLE PROVIDER: Cleanup');
      unsubscribe();
    };
  }, []);

  return (
    <QuantumMarbleContext.Provider value={QuantumMarble}>
      {children}
    </QuantumMarbleContext.Provider>
  );
};

export default QuantumMarbleProvider;
