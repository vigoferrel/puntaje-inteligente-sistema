
import { useState, useEffect, useCallback } from 'react';
import { BancoEvaluacionesService } from '@/services/banco-evaluaciones/BancoEvaluacionesService';
import { useAuth } from '@/contexts/AuthContext';

export interface EvaluacionConfig {
  tipo_evaluacion: 'diagnostica' | 'adaptativa' | 'formativa';
  prueba_paes: string;
  total_preguntas: number;
  duracion_minutos: number;
  distribucion_dificultad: {
    basico: number;
    intermedio: number;
    avanzado: number;
  };
}

export interface BancoStats {
  totalPreguntas: number;
  preguntasPorPrueba: Record<string, number>;
  evaluacionesGeneradas: number;
  sistemaActivo: boolean;
}

export const useBancoEvaluaciones = () => {
  const { user } = useAuth();
  const [stats, setStats] = useState<BancoStats>({
    totalPreguntas: 0,
    preguntasPorPrueba: {},
    evaluacionesGeneradas: 0,
    sistemaActivo: false
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Cargar estadísticas del banco al inicializar
  const loadBancoStats = useCallback(async () => {
    if (!user?.id) return;

    try {
      setLoading(true);
      
      // Simular carga de estadísticas (puedes conectar a una función RPC real)
      const mockStats = {
        totalPreguntas: 2847,
        preguntasPorPrueba: {
          'COMPETENCIA_LECTORA': 892,
          'MATEMATICA_1': 634,
          'MATEMATICA_2': 527,
          'CIENCIAS': 456,
          'HISTORIA': 338
        },
        evaluacionesGeneradas: 0,
        sistemaActivo: true
      };

      setStats(mockStats);
      console.log('🏦 Banco de Evaluaciones activado:', mockStats);
    } catch (err) {
      console.error('Error cargando estadísticas del banco:', err);
      setError('Error al cargar el banco de evaluaciones');
    } finally {
      setLoading(false);
    }
  }, [user?.id]);

  // Generar evaluación optimizada
  const generarEvaluacion = useCallback(async (config: EvaluacionConfig) => {
    if (!user?.id) return null;

    try {
      setLoading(true);
      setError(null);

      console.log('🎯 Generando evaluación:', config);
      
      const evaluacion = await BancoEvaluacionesService.generarEvaluacionOptimizada(config);
      
      // Actualizar estadísticas
      setStats(prev => ({
        ...prev,
        evaluacionesGeneradas: prev.evaluacionesGeneradas + 1
      }));

      console.log('✅ Evaluación generada exitosamente');
      return evaluacion;
    } catch (err) {
      console.error('Error generando evaluación:', err);
      setError('Error al generar la evaluación');
      return null;
    } finally {
      setLoading(false);
    }
  }, [user?.id]);

  // Obtener evaluaciones disponibles por prueba
  const getEvaluacionesDisponibles = useCallback(async (prueba: string) => {
    try {
      // Esto conectaría con el servicio real
      return {
        diagnosticas: 3,
        adaptativas: 5,
        formativas: 8
      };
    } catch (err) {
      console.error('Error obteniendo evaluaciones disponibles:', err);
      return { diagnosticas: 0, adaptativas: 0, formativas: 0 };
    }
  }, []);

  useEffect(() => {
    loadBancoStats();
  }, [loadBancoStats]);

  return {
    stats,
    loading,
    error,
    generarEvaluacion,
    getEvaluacionesDisponibles,
    refreshStats: loadBancoStats
  };
};
