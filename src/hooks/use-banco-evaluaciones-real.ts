
import { useState, useEffect, useCallback } from 'react';
import { supabase } from '@/integrations/supabase/client';
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

export const useBancoEvaluacionesReal = () => {
  const { user } = useAuth();
  const [stats, setStats] = useState<BancoStats>({
    totalPreguntas: 0,
    preguntasPorPrueba: {},
    evaluacionesGeneradas: 0,
    sistemaActivo: false
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const loadBancoStats = useCallback(async () => {
    if (!user?.id) return;

    try {
      setLoading(true);
      console.log('🏦 Cargando estadísticas reales del banco de evaluaciones');
      
      // Obtener total de preguntas desde banco_preguntas
      const { data: preguntasData, error: preguntasError } = await supabase
        .from('banco_preguntas')
        .select('prueba_paes')
        .eq('validada', true);

      if (preguntasError) throw preguntasError;

      // Calcular estadísticas reales
      const totalPreguntas = preguntasData?.length || 0;
      const preguntasPorPrueba = preguntasData?.reduce((acc, item) => {
        acc[item.prueba_paes] = (acc[item.prueba_paes] || 0) + 1;
        return acc;
      }, {} as Record<string, number>) || {};

      // Obtener evaluaciones generadas del usuario
      const { data: evaluacionesData, error: evaluacionesError } = await supabase
        .from('evaluaciones')
        .select('id')
        .eq('created_by', user.id);

      if (evaluacionesError) throw evaluacionesError;

      const realStats = {
        totalPreguntas,
        preguntasPorPrueba,
        evaluacionesGeneradas: evaluacionesData?.length || 0,
        sistemaActivo: totalPreguntas > 0
      };

      setStats(realStats);
      console.log('✅ Estadísticas reales cargadas:', realStats);
    } catch (err) {
      console.error('❌ Error cargando estadísticas reales:', err);
      setError('Error al cargar el banco de evaluaciones');
    } finally {
      setLoading(false);
    }
  }, [user?.id]);

  const generarEvaluacion = useCallback(async (config: EvaluacionConfig) => {
    if (!user?.id) return null;

    try {
      setLoading(true);
      setError(null);
      console.log('🎯 Generando evaluación real:', config);
      
      // Crear evaluación en la base de datos
      const { data: evaluacionData, error: evaluacionError } = await supabase
        .from('evaluaciones')
        .insert({
          codigo: `EVAL-${Date.now()}`,
          nombre: `Evaluación ${config.tipo_evaluacion} - ${config.prueba_paes}`,
          tipo_evaluacion: config.tipo_evaluacion,
          prueba_paes: config.prueba_paes,
          total_preguntas: config.total_preguntas,
          duracion_minutos: config.duracion_minutos,
          distribucion_dificultad: config.distribucion_dificultad,
          created_by: user.id
        })
        .select()
        .single();

      if (evaluacionError) throw evaluacionError;

      // Actualizar estadísticas
      setStats(prev => ({
        ...prev,
        evaluacionesGeneradas: prev.evaluacionesGeneradas + 1
      }));

      console.log('✅ Evaluación real generada exitosamente');
      return evaluacionData;
    } catch (err) {
      console.error('❌ Error generando evaluación real:', err);
      setError('Error al generar la evaluación');
      return null;
    } finally {
      setLoading(false);
    }
  }, [user?.id]);

  const getEvaluacionesDisponibles = useCallback(async (prueba: string) => {
    try {
      const { data, error } = await supabase
        .from('evaluaciones')
        .select('tipo_evaluacion')
        .eq('prueba_paes', prueba)
        .eq('esta_activo', true);

      if (error) throw error;

      const counts = data?.reduce((acc, item) => {
        acc[item.tipo_evaluacion as keyof typeof acc] = (acc[item.tipo_evaluacion as keyof typeof acc] || 0) + 1;
        return acc;
      }, { diagnosticas: 0, adaptativas: 0, formativas: 0 }) || { diagnosticas: 0, adaptativas: 0, formativas: 0 };

      return counts;
    } catch (err) {
      console.error('❌ Error obteniendo evaluaciones disponibles:', err);
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
