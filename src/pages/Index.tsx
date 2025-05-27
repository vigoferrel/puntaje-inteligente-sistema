
import React from 'react';
import { SimplifiedCinematicProvider, CinematicTransition } from '@/contexts/SimplifiedCinematicContext';
import { SuperPAESUnifiedHub } from '@/components/super-paes/SuperPAESUnifiedHub';

const Index: React.FC = () => {
  return (
    <SimplifiedCinematicProvider>
      <CinematicTransition scene="unified-hub">
        <SuperPAESUnifiedHub />
      </CinematicTransition>
    </SimplifiedCinematicProvider>
  );
};

export default Index;
