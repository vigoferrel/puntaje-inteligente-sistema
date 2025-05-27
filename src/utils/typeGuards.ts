
import { Json } from '@/integrations/supabase/types';

// Type guards para datos de Supabase con compatibilidad Json
export interface SecurityMetrics {
  [key: string]: Json;
  data_integrity_score?: number;
  security_issues?: number;
  overall_status?: string;
  performance_score?: number;
}

export function isSecurityMetrics(data: Json): data is SecurityMetrics {
  return typeof data === 'object' && data !== null && !Array.isArray(data);
}

export function parseSecurityData(data: Json): SecurityMetrics {
  if (isSecurityMetrics(data)) {
    return {
      data_integrity_score: typeof data.data_integrity_score === 'number' ? data.data_integrity_score : 100,
      security_issues: typeof data.security_issues === 'number' ? data.security_issues : 0,
      overall_status: typeof data.overall_status === 'string' ? data.overall_status : 'healthy',
      performance_score: typeof data.performance_score === 'number' ? data.performance_score : 85
    };
  }
  
  return {
    data_integrity_score: 100,
    security_issues: 0,
    overall_status: 'healthy',
    performance_score: 85
  };
}

export function safeGetNumber(value: Json, fallback: number = 0): number {
  return typeof value === 'number' ? value : fallback;
}

export function safeGetString(value: Json, fallback: string = ''): string {
  return typeof value === 'string' ? value : fallback;
}
