
export interface SecurityMetrics {
  data_integrity_score: number;
  security_issues: number;
  overall_status: 'healthy' | 'warning' | 'critical';
  performance_score?: number;
}

export const parseSecurityData = (data: any): SecurityMetrics => {
  // Manejar la estructura anidada real de Supabase
  let actualData = data;
  
  // Si viene como array de Supabase, tomar el primer elemento
  if (Array.isArray(data) && data.length > 0) {
    actualData = data[0];
  }
  
  // Si viene envuelto en otra estructura, intentar extraer
  if (actualData && typeof actualData === 'object' && actualData.data) {
    actualData = actualData.data;
  }
  
  // Valores por defecto seguros
  if (!actualData || typeof actualData !== 'object') {
    return {
      data_integrity_score: 100,
      security_issues: 0,
      overall_status: 'healthy',
      performance_score: 95
    };
  }

  return {
    data_integrity_score: Number(actualData.data_integrity_score) || 100,
    security_issues: Number(actualData.security_issues) || 0,
    overall_status: actualData.overall_status || 'healthy',
    performance_score: Number(actualData.performance_score) || 95
  };
};

export const isValidSecurityMetrics = (data: any): data is SecurityMetrics => {
  if (!data || typeof data !== 'object') return false;
  
  return (
    typeof data.data_integrity_score === 'number' &&
    typeof data.security_issues === 'number' &&
    typeof data.overall_status === 'string' &&
    ['healthy', 'warning', 'critical'].includes(data.overall_status)
  );
};
