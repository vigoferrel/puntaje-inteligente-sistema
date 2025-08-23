import React from 'react';
import { useAuth } from '@/contexts/AuthContext';
import SpotifyPAESDashboard from '@/components/spotify/SpotifyPAESDashboard';

const SpotifyIntegrationPage: React.FC = () => {
  const { user } = useAuth();

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-green-900 to-blue-900 p-4">
      <div className="max-w-7xl mx-auto">
        <div className="mb-6">
          <h1 className="text-3xl font-bold text-white mb-2">
            Spotify PAES Integration
          </h1>
          <p className="text-gray-300">
            Música adaptativa para optimizar tu experiencia de estudio
          </p>
        </div>
        
        <SpotifyPAESDashboard 
          userId={user?.id || 'demo-user'}
          isExpanded={true}
          isMinified={false}
        />
      </div>
    </div>
  );
};

export default SpotifyIntegrationPage;
