
import React from 'react';
import { UnifiedDashboardContainer } from '@/components/unified-dashboard/UnifiedDashboardContainer';

interface UnifiedIndexProps {
  initialTool?: string | null;
}

const UnifiedIndex: React.FC<UnifiedIndexProps> = ({ initialTool }) => {
  return <UnifiedDashboardContainer initialTool={initialTool} />;
};

export default UnifiedIndex;
