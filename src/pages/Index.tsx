
import React from 'react';
import { GlobalCinematicProvider } from '@/contexts/GlobalCinematicContext';
import { UnifiedCinematicProvider } from '@/components/cinematic/UnifiedCinematicProvider';
import { SuperPAESMain } from '@/components/super-paes/SuperPAESMain';

const Index: React.FC = () => {
  return (
    <GlobalCinematicProvider>
      <UnifiedCinematicProvider>
        <SuperPAESMain />
      </UnifiedCinematicProvider>
    </GlobalCinematicProvider>
  );
};

export default Index;
