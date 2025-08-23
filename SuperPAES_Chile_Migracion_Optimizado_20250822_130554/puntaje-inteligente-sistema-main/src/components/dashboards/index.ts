import type { SafeString, SafeNumber, SafeBoolean, APIResponse, OperationResult } from '../../types/core';


/**
 * DASHBOARDS CONSOLIDADOS v2.0
 * Sistema unificado de dashboards adaptativos
 */

// Dashboards principales - importar desde dashboard (no dashboards)
export { UnifiedDashboard } from '../dashboard/UnifiedDashboard';
export { PAESSpecializedDashboard } from '../dashboard/PAESSpecializedDashboard';
export { AdminConsolidatedDashboard } from '../dashboard/AdminConsolidatedDashboard';

// Core del dashboard
export { NeuralDashboardCore } from '../dashboard/NeuralDashboardCore';
export { RealMetricsDashboard } from '../dashboard/RealMetricsDashboard';

// Dashboard cinematográfico unificado
export { CinematicDashboard } from '@/components/unified-dashboard/CinematicDashboard';

// Componentes optimizados
export { CinematicSkeletonOptimized } from '@/components/unified-dashboard/CinematicSkeletonOptimized';

