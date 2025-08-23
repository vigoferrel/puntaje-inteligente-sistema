/* eslint-disable react-refresh/only-export-components */
import React from 'react';
import { ArsenalEducativoCompleto as ArsenalOriginal } from '../arsenal-educativo/ArsenalEducativoCompleto';

// Re-exportar el componente desde la ubicaciÃ³n correcta
export const ArsenalEducativoCompleto: React.FC = () => {
  return <ArsenalOriginal />;
};

export default ArsenalEducativoCompleto;
