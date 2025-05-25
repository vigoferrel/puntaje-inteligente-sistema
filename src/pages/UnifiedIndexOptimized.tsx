
import React from 'react';
import { UnifiedDashboardContainerOptimized } from '@/components/unified-dashboard/UnifiedDashboardContainerOptimized';

interface UnifiedIndexOptimizedProps {
  initialTool?: string | null;
}

const UnifiedIndexOptimized: React.FC<UnifiedIndexOptimizedProps> = ({ initialTool }) => {
  return <UnifiedDashboardContainerOptimized initialTool={initialTool} />;
};

export default UnifiedIndexOptimized;
