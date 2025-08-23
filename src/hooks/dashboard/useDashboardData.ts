
// DEPRECATED: Use useRealDashboardData instead
// This file is kept for backward compatibility during migration

import { useRealDashboardData } from './useRealDashboardData';

export const useDashboardData = () => {
  // Redirect to real data hook
  return useRealDashboardData();
};
