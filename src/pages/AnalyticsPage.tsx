import React from 'react';
import { useAuth } from '@/contexts/AuthContext';
import RealTimeAnalyticsDashboard from '@/components/analytics/RealTimeAnalyticsDashboard';

const AnalyticsPage: React.FC = () => {
  const { user } = useAuth();

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-purple-900 to-blue-900 p-4">
      <div className="max-w-7xl mx-auto">
        <div className="mb-6">
          <h1 className="text-3xl font-bold text-white mb-2">
            Analytics Predictivos
          </h1>
          <p className="text-gray-300">
            Análisis en tiempo real con predicciones de rendimiento basadas en IA
          </p>
        </div>
        
        <RealTimeAnalyticsDashboard 
          userId={user?.id || 'demo-user'}
          isExpanded={true}
          isMinified={false}
        />
      </div>
    </div>
  );
};

export default AnalyticsPage;
