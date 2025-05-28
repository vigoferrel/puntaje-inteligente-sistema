
import React from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { UnifiedEducationalHub } from '@/components/unified-dashboard/UnifiedEducationalHub';
import { SimpleLoadingScreen } from '@/components/SimpleLoadingScreen';

const Dashboard: React.FC = () => {
  const { user, isLoading } = useAuth();

  if (isLoading) {
    return <SimpleLoadingScreen />;
  }

  return <UnifiedEducationalHub userId={user?.id || 'demo-user'} />;
};

export default Dashboard;
