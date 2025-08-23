
import React from 'react';
import { AppLayout } from '@/components/app-layout';
import PAESUnifiedDashboard from '@/components/paes-unified/PAESUnifiedDashboard';

const PAES: React.FC = () => {
  return (
    <AppLayout>
      <div className="min-h-screen bg-gradient-to-br from-gray-900 via-purple-900 to-gray-900 p-6">
        <PAESUnifiedDashboard />
      </div>
    </AppLayout>
  );
};

export default PAES;
