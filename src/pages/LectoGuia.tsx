
import React from 'react';
import { EducationalUniverse } from '@/components/universe/EducationalUniverse';
import { LectoGuiaProvider } from '@/contexts/lectoguia/LectoGuiaProvider';

const LectoGuia: React.FC = () => {
  return (
    <LectoGuiaProvider>
      <EducationalUniverse 
        initialMode="subject"
        activeSubject="competencia-lectora"
      />
    </LectoGuiaProvider>
  );
};

export default LectoGuia;
