
import { useState, useEffect } from 'react';
import { UnifiedAnalyticsService, SimplifiedInstitutionalMetrics, CareerRecommendation } from '@/services/paes/analytics/UnifiedAnalyticsService';
import { logger } from '@/core/logging/SystemLogger';

interface UseUnifiedAnalyticsReturn {
  metrics: SimplifiedInstitutionalMetrics | null;
  careerRecommendations: CareerRecommendation[];
  isLoading: boolean;
  error: string | null;
  generateReport: () => Promise<void>;
  searchCareers: (filters: SearchFilters) => Promise<void>;
  exportReport: (format: 'pdf' | 'excel' | 'csv') => Promise<Blob | null>;
  clearCache: () => void;
}

interface SearchFilters {
  texto?: string;
  region?: string;
  puntajeMin?: number;
  puntajeMax?: number;
  area?: string;
}

export const useUnifiedAnalytics = (institutionId?: string): UseUnifiedAnalyticsReturn => {
  const [metrics, setMetrics] = useState<SimplifiedInstitutionalMetrics | null>(null);
  const [careerRecommendations, setCareerRecommendations] = useState<CareerRecommendation[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const generateReport = async () => {
    if (!institutionId) return;
    
    setIsLoading(true);
    setError(null);
    
    try {
      const report = await UnifiedAnalyticsService.generateInstitutionalMetrics(institutionId);
      setMetrics(report);
      logger.info('useUnifiedAnalytics', 'Reporte generado exitosamente');
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Error desconocido';
      setError(errorMessage);
      logger.error('useUnifiedAnalytics', 'Error generando reporte', err);
    } finally {
      setIsLoading(false);
    }
  };

  const searchCareers = async (filters: SearchFilters) => {
    setIsLoading(true);
    try {
      const results = await UnifiedAnalyticsService.searchCareers(
        filters.texto,
        filters.region,
        filters.puntajeMin,
        filters.puntajeMax,
        filters.area
      );
      // Fix: Properly check if results is an array before using slice
      if (Array.isArray(results)) {
        setCareerRecommendations(results.slice(0, 10));
      } else {
        setCareerRecommendations([]);
        logger.warn('useUnifiedAnalytics', 'Resultados de búsqueda no son un array');
      }
    } catch (err) {
      logger.error('useUnifiedAnalytics', 'Error buscando carreras', err);
      setError('Error buscando carreras');
      setCareerRecommendations([]);
    } finally {
      setIsLoading(false);
    }
  };

  const exportReport = async (format: 'pdf' | 'excel' | 'csv'): Promise<Blob | null> => {
    if (!institutionId) return null;
    
    try {
      const blob = await UnifiedAnalyticsService.exportReport(institutionId, format);
      logger.info('useUnifiedAnalytics', `Reporte exportado en formato ${format}`);
      return blob;
    } catch (err) {
      logger.error('useUnifiedAnalytics', 'Error exportando reporte', err);
      return null;
    }
  };

  const clearCache = () => {
    UnifiedAnalyticsService.clearCache();
    logger.info('useUnifiedAnalytics', 'Cache limpiado');
  };

  // Cargar datos inicialmente
  useEffect(() => {
    if (institutionId) {
      generateReport();
    }
  }, [institutionId]);

  return {
    metrics,
    careerRecommendations,
    isLoading,
    error,
    generateReport,
    searchCareers,
    exportReport,
    clearCache
  };
};
