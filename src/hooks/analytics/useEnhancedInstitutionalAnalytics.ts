
import { useState, useEffect } from 'react';
import { EnhancedInstitutionalAnalyticsService } from '@/services/paes/analytics/EnhancedInstitutionalAnalyticsService';
import { InstitutionalMetrics } from '@/services/paes/analytics/types';
import { logger } from '@/core/logging/SystemLogger';

interface UseEnhancedInstitutionalAnalyticsReturn {
  metrics: InstitutionalMetrics | null;
  isLoading: boolean;
  error: string | null;
  generateReport: () => Promise<void>;
  generateParentReports: () => Promise<void>;
  exportReport: (format: 'pdf' | 'excel' | 'csv') => Promise<Blob | null>;
  clearCache: () => void;
}

export const useEnhancedInstitutionalAnalytics = (
  institutionId: string
): UseEnhancedInstitutionalAnalyticsReturn => {
  const [metrics, setMetrics] = useState<InstitutionalMetrics | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const generateReport = async () => {
    if (!institutionId) return;
    
    setIsLoading(true);
    setError(null);
    
    try {
      const report = await EnhancedInstitutionalAnalyticsService.generateInstitutionalReport(institutionId);
      setMetrics(report);
      logger.info('useEnhancedInstitutionalAnalytics', 'Reporte generado exitosamente');
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Error desconocido';
      setError(errorMessage);
      logger.error('useEnhancedInstitutionalAnalytics', 'Error generando reporte', err);
    } finally {
      setIsLoading(false);
    }
  };

  const generateParentReports = async () => {
    if (!institutionId) return;
    
    try {
      await EnhancedInstitutionalAnalyticsService.generateParentReports(institutionId);
      logger.info('useEnhancedInstitutionalAnalytics', 'Reportes para padres generados');
    } catch (err) {
      logger.error('useEnhancedInstitutionalAnalytics', 'Error generando reportes para padres', err);
      throw err;
    }
  };

  const exportReport = async (format: 'pdf' | 'excel' | 'csv'): Promise<Blob | null> => {
    if (!institutionId) return null;
    
    try {
      const blob = await EnhancedInstitutionalAnalyticsService.exportReport(institutionId, format);
      logger.info('useEnhancedInstitutionalAnalytics', `Reporte exportado en formato ${format}`);
      return blob;
    } catch (err) {
      logger.error('useEnhancedInstitutionalAnalytics', 'Error exportando reporte', err);
      return null;
    }
  };

  const clearCache = () => {
    EnhancedInstitutionalAnalyticsService.clearCache();
    logger.info('useEnhancedInstitutionalAnalytics', 'Cache limpiado');
  };

  // Cargar datos inicialmente
  useEffect(() => {
    if (institutionId) {
      generateReport();
    }
  }, [institutionId]);

  return {
    metrics,
    isLoading,
    error,
    generateReport,
    generateParentReports,
    exportReport,
    clearCache
  };
};
