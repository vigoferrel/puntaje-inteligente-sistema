
import React from 'react';
import { AppLayout } from '@/components/app-layout';
import { UnifiedDashboard } from '@/components/unified/UnifiedDashboard';
import { useAuth } from '@/contexts/AuthContext';

const UnifiedPAESMaster: React.FC = () => {
  const { user } = useAuth();

  if (!user?.id) {
    return (
      <AppLayout>
        <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-indigo-900 p-6">
          <div className="max-w-md mx-auto mt-20 text-center text-white">
            <h2 className="text-2xl font-bold mb-4">Acceso Requerido</h2>
            <p>Debes iniciar sesión para acceder al sistema unificado PAES Master.</p>
          </div>
        </div>
      </AppLayout>
    );
  }

  return (
    <AppLayout>
      <UnifiedDashboard userId={user.id} />
    </AppLayout>
  );
};

export default UnifiedPAESMaster;
