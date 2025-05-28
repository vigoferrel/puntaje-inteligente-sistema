
export interface SecurityMetrics {
  data_integrity_score: number;
  security_issues: number;
  overall_status: 'healthy' | 'warning' | 'critical';
  performance_score?: number;
}

export const parseSecurityData = (data: any): SecurityMetrics => {
  if (!data || typeof data !== 'object') {
    return {
      data_integrity_score: 100,
      security_issues: 0,
      overall_status: 'healthy',
      performance_score: 95
    };
  }

  return {
    data_integrity_score: data.data_integrity_score || 100,
    security_issues: data.security_issues || 0,
    overall_status: data.overall_status || 'healthy',
    performance_score: data.performance_score || 95
  };
};

export const isValidSecurityMetrics = (data: any): data is SecurityMetrics => {
  return (
    typeof data === 'object' &&
    typeof data.data_integrity_score === 'number' &&
    typeof data.security_issues === 'number' &&
    typeof data.overall_status === 'string' &&
    ['healthy', 'warning', 'critical'].includes(data.overall_status)
  );
};
