
import React from 'react';
import { AppLayout } from '@/components/app-layout';
import { CinematicCalendar } from '@/components/calendar/CinematicCalendar';

const Calendario: React.FC = () => {
  return (
    <AppLayout>
      <CinematicCalendar />
    </AppLayout>
  );
};

export default Calendario;
