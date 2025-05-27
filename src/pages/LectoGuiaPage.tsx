
import React from 'react';
import { EducationalUniverse } from '@/components/universe/EducationalUniverse';
import { UnifiedLectoGuiaProvider } from '@/contexts/lectoguia/UnifiedLectoGuiaProvider';

const LectoGuiaPage: React.FC = () => {
  return (
    <UnifiedLectoGuiaProvider>
      <EducationalUniverse 
        initialMode="subject"
        activeSubject="competencia-lectora"
      />
    </UnifiedLectoGuiaProvider>
  );
};

export default LectoGuiaPage;
