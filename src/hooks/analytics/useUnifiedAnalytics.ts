
import { useState, useEffect } from 'react';
import { UnifiedAnalyticsService, SimplifiedInstitutionalMetrics, CareerRecommendation } from '@/services/paes/analytics/UnifiedAnalyticsService';
import { logger } from '@/core/logging/SystemLogger';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';

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
  const { user } = useAuth();
  const [metrics, setMetrics] = useState<SimplifiedInstitutionalMetrics | null>(null);
  const [careerRecommendations, setCareerRecommendations] = useState<CareerRecommendation[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Auto-detectar institutionId si el usuario pertenece a una institución
  const [detectedInstitutionId, setDetectedInstitutionId] = useState<string | null>(null);

  useEffect(() => {
    const detectInstitution = async () => {
      if (!user?.id || institutionId) return;

      try {
        const { data } = await supabase
          .from('institution_students')
          .select('institution_id')
          .eq('student_id', user.id)
          .single();

        if (data?.institution_id) {
          setDetectedInstitutionId(data.institution_id);
        }
      } catch (err) {
        // Usuario no pertenece a ninguna institución, usar ID por defecto
        setDetectedInstitutionId('default-institution');
      }
    };

    detectInstitution();
  }, [user?.id, institutionId]);

  const finalInstitutionId = institutionId || detectedInstitutionId;

  const generateReport = async () => {
    if (!finalInstitutionId) {
      setError('No se pudo determinar la institución');
      return;
    }
    
    setIsLoading(true);
    setError(null);
    
    try {
      const report = await UnifiedAnalyticsService.generateInstitutionalMetrics(finalInstitutionId);
      setMetrics(report);
      logger.info('useUnifiedAnalytics', 'Reporte generado exitosamente con datos reales');
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
      
      if (Array.isArray(results)) {
        setCareerRecommendations(results.slice(0, 10));
        logger.info('useUnifiedAnalytics', 'Carreras encontradas desde datos reales');
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
    if (!finalInstitutionId) return null;
    
    try {
      const blob = await UnifiedAnalyticsService.exportReport(finalInstitutionId, format);
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
    if (finalInstitutionId) {
      generateReport();
    }
  }, [finalInstitutionId]);

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
