
import React from 'react';
import { AppLayout } from '@/components/app-layout';
import { LectoGuiaUnified } from '@/components/lectoguia/LectoGuiaUnified';

const LectoGuia: React.FC = () => {
  return (
    <AppLayout>
      <LectoGuiaUnified />
    </AppLayout>
  );
};

export default LectoGuia;
