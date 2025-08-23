
import { useState, useEffect, useCallback } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { paesVocationalAgent, AnalisisVocacional, RecomendacionVocacional, CompetenciaTransversal } from '@/core/vocational/PAESVocationalAgent';
import { toast } from '@/components/ui/use-toast';

export interface SuperPAESState {
  analisisVocacional: AnalisisVocacional | null;
  recomendacionesVocacionales: RecomendacionVocacional | null;
  mapaCompetencias: CompetenciaTransversal[];
  loading: boolean;
  error: string | null;
  activeView: 'overview' | 'competencias' | 'recomendaciones' | 'mapa3d' | 'analisis';
}

export const useSuperPAES = () => {
  const { user } = useAuth();
  const [state, setState] = useState<SuperPAESState>({
    analisisVocacional: null,
    recomendacionesVocacionales: null,
    mapaCompetencias: [],
    loading: false,
    error: null,
    activeView: 'overview'
  });

  // Cargar datos del perfil vocacional
  const cargarDatosVocacionales = useCallback(async () => {
    if (!user?.id) return;

    setState(prev => ({ ...prev, loading: true, error: null }));

    try {
      console.log('🎯 Cargando análisis vocacional SuperPAES...');
      
      const [analisis, recomendaciones, competencias] = await Promise.all([
        paesVocationalAgent.analizarPerfilVocacional(user.id),
        paesVocationalAgent.generarRecomendacionesVocacionales(user.id),
        paesVocationalAgent.obtenerMapaCompetencias(user.id)
      ]);

      setState(prev => ({
        ...prev,
        analisisVocacional: analisis,
        recomendacionesVocacionales: recomendaciones,
        mapaCompetencias: competencias,
        loading: false
      }));

      toast({
        title: "🚀 SuperPAES Activado",
        description: `Análisis vocacional completo con ${recomendaciones.recomendacionPrincipal.length} recomendaciones`,
      });

    } catch (error) {
      console.error('Error cargando datos SuperPAES:', error);
      setState(prev => ({
        ...prev,
        error: 'Error al cargar análisis vocacional',
        loading: false
      }));
      
      toast({
        title: "Error SuperPAES",
        description: "No se pudo cargar el análisis vocacional",
        variant: "destructive"
      });
    }
  }, [user?.id]);

  // Cambiar vista activa
  const cambiarVista = useCallback((view: SuperPAESState['activeView']) => {
    setState(prev => ({ ...prev, activeView: view }));
  }, []);

  // Actualizar análisis vocacional
  const actualizarAnalisis = useCallback(async () => {
    if (!user?.id) return;
    
    setState(prev => ({ ...prev, loading: true }));
    
    try {
      const analisis = await paesVocationalAgent.analizarPerfilVocacional(user.id);
      setState(prev => ({
        ...prev,
        analisisVocacional: analisis,
        loading: false
      }));
      
      toast({
        title: "Análisis Actualizado",
        description: "Tu perfil vocacional ha sido actualizado"
      });
    } catch (error) {
      setState(prev => ({ ...prev, loading: false }));
      toast({
        title: "Error",
        description: "No se pudo actualizar el análisis",
        variant: "destructive"
      });
    }
  }, [user?.id]);

  // Generar nuevas recomendaciones
  const generarNuevasRecomendaciones = useCallback(async () => {
    if (!user?.id) return;
    
    setState(prev => ({ ...prev, loading: true }));
    
    try {
      const recomendaciones = await paesVocationalAgent.generarRecomendacionesVocacionales(user.id);
      setState(prev => ({
        ...prev,
        recomendacionesVocacionales: recomendaciones,
        loading: false
      }));
      
      toast({
        title: "Recomendaciones Actualizadas",
        description: `${recomendaciones.recomendacionPrincipal.length} nuevas carreras recomendadas`
      });
    } catch (error) {
      setState(prev => ({ ...prev, loading: false }));
      toast({
        title: "Error",
        description: "No se pudieron generar nuevas recomendaciones",
        variant: "destructive"
      });
    }
  }, [user?.id]);

  // Obtener estadísticas del perfil
  const obtenerEstadisticas = useCallback(() => {
    if (!state.analisisVocacional || !state.recomendacionesVocacionales) {
      return null;
    }

    const competenciasDestacadas = state.analisisVocacional.competenciasDestacadas.length;
    const competenciasEnDesarrollo = state.analisisVocacional.competenciasEnDesarrollo.length;
    const carrerasRecomendadas = state.recomendacionesVocacionales.recomendacionPrincipal.length;
    const promedioCompatibilidad = state.recomendacionesVocacionales.recomendacionPrincipal
      .reduce((acc, carrera) => acc + carrera.compatibilidadGlobal, 0) / carrerasRecomendadas;

    return {
      competenciasDestacadas,
      competenciasEnDesarrollo,
      carrerasRecomendadas,
      promedioCompatibilidad: Math.round(promedioCompatibilidad),
      nivelVocacional: promedioCompatibilidad > 80 ? 'Excelente' : 
                      promedioCompatibilidad > 60 ? 'Bueno' : 'En desarrollo'
    };
  }, [state.analisisVocacional, state.recomendacionesVocacionales]);

  // Auto-cargar datos al inicializar
  useEffect(() => {
    if (user?.id && !state.analisisVocacional && !state.loading) {
      cargarDatosVocacionales();
    }
  }, [user?.id, cargarDatosVocacionales, state.analisisVocacional, state.loading]);

  return {
    ...state,
    cargarDatosVocacionales,
    cambiarVista,
    actualizarAnalisis,
    generarNuevasRecomendaciones,
    obtenerEstadisticas
  };
};
