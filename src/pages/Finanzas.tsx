
import React from 'react';
import { AppLayout } from '@/components/app-layout';
import { CinematicFinancialCenter } from '@/components/financial-center/CinematicFinancialCenter';

const Finanzas: React.FC = () => {
  return (
    <AppLayout>
      <div className="min-h-screen bg-gradient-to-br from-gray-900 via-green-900 to-gray-900 p-6">
        <CinematicFinancialCenter />
      </div>
    </AppLayout>
  );
};

export default Finanzas;
