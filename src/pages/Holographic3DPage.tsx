import React from 'react';
import { useAuth } from '@/contexts/AuthContext';
import Holographic3DDashboard from '@/components/3d/Holographic3DDashboard';

const Holographic3DPage: React.FC = () => {
  const { user } = useAuth();

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-purple-900 to-blue-900 p-4">
      <div className="max-w-7xl mx-auto">
        <div className="mb-6">
          <h1 className="text-3xl font-bold text-white mb-2">
            Dashboard Holográfico 3D
          </h1>
          <p className="text-gray-300">
            Visualizaciones inmersivas de tu progreso de aprendizaje
          </p>
        </div>
        
        <Holographic3DDashboard 
          userId={user?.id || 'demo-user'}
          isExpanded={true}
          isMinified={false}
        />
      </div>
    </div>
  );
};

export default Holographic3DPage;
