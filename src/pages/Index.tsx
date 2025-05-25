
import React from 'react';
import { AppLayout } from '@/components/app-layout';
import { CinematicUnifiedDashboard } from '@/components/dashboard/CinematicUnifiedDashboard';

const Index: React.FC = () => {
  return (
    <AppLayout>
      <CinematicUnifiedDashboard />
    </AppLayout>
  );
};

export default Index;
