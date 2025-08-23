import React from 'react';
import { useAuth } from '@/contexts/AuthContext';
import AIRecommendationDashboard from '@/components/ai/AIRecommendationDashboard';

const AIRecommendationsPage: React.FC = () => {
  const { user } = useAuth();

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-purple-900 to-blue-900 p-4">
      <div className="max-w-7xl mx-auto">
        <div className="mb-6">
          <h1 className="text-3xl font-bold text-white mb-2">
            Recomendaciones de IA
          </h1>
          <p className="text-gray-300">
            Actividades y estudios personalizados generados por inteligencia artificial
          </p>
        </div>
        
        <AIRecommendationDashboard 
          userId={user?.id || 'demo-user'}
          isExpanded={true}
          isMinified={false}
        />
      </div>
    </div>
  );
};

export default AIRecommendationsPage;
