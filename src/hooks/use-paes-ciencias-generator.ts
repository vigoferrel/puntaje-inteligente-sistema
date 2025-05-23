
import { useState } from 'react';
import { PAESCienciasGenerator } from '@/scripts/paes-ciencias-generator';
import { toast } from '@/components/ui/use-toast';
import { useAuth } from '@/contexts/AuthContext';

export function usePAESCienciasGenerator() {
  const { user } = useAuth();
  const [loading, setLoading] = useState(false);
  const [diagnosticoActual, setDiagnosticoActual] = useState<any>(null);
  const [ejerciciosActuales, setEjerciciosActuales] = useState<any[]>([]);
  const [faseActual, setFaseActual] = useState<'explorar' | 'explicar' | 'aplicar' | 'evaluar'>('explorar');

  /**
   * Genera un diagnóstico completo de ciencias
   */
  const generarDiagnostico = async (
    cantidadPreguntas: number = 15,
    areas: string[] = ['Biología', 'Física', 'Química']
  ) => {
    if (!user) {
      toast({
        title: "Error",
        description: "Debes estar autenticado para generar diagnósticos",
        variant: "destructive"
      });
      return null;
    }

    setLoading(true);
    try {
      const resultado = await PAESCienciasGenerator.generarDiagnosticoCiencias(
        cantidadPreguntas,
        areas
      );
      
      if (resultado) {
        setDiagnosticoActual(resultado);
        toast({
          title: "Diagnóstico Generado",
          description: `Se ha creado un diagnóstico con ${resultado.preguntas.length} preguntas`
        });
      }
      
      return resultado;
    } catch (error) {
      console.error('Error generando diagnóstico:', error);
      toast({
        title: "Error",
        description: "No se pudo generar el diagnóstico",
        variant: "destructive"
      });
      return null;
    } finally {
      setLoading(false);
    }
  };

  /**
   * Genera ejercicios adaptativos para un nodo
   */
  const generarEjerciciosAdaptativos = async (
    nodeId: string,
    area: string,
    nivel: 'basic' | 'intermediate' | 'advanced' = 'intermediate'
  ) => {
    setLoading(true);
    try {
      const ejercicios = await PAESCienciasGenerator.generarEjerciciosAdaptativos(
        nodeId,
        area,
        nivel
      );
      
      setEjerciciosActuales(ejercicios);
      return ejercicios;
    } catch (error) {
      console.error('Error generando ejercicios adaptativos:', error);
      return [];
    } finally {
      setLoading(false);
    }
  };

  /**
   * Genera ejercicios por ciclo de aprendizaje
   */
  const generarEjerciciosCiclo = async (
    area: string = 'Biología',
    fase: 'explorar' | 'explicar' | 'aplicar' | 'evaluar' = 'explorar'
  ) => {
    if (!user) {
      toast({
        title: "Error",
        description: "Debes estar autenticado para acceder al ciclo de aprendizaje",
        variant: "destructive"
      });
      return null;
    }

    setLoading(true);
    try {
      const resultado = await PAESCienciasGenerator.generarEjerciciosPorCiclo(
        user.id,
        area,
        fase
      );
      
      if (resultado) {
        setEjerciciosActuales(resultado.ejercicios);
        setFaseActual(fase);
        toast({
          title: `Fase ${fase}`,
          description: `Se han generado ${resultado.ejercicios.length} ejercicios para la fase de ${fase}`
        });
      }
      
      return resultado;
    } catch (error) {
      console.error('Error generando ejercicios por ciclo:', error);
      return null;
    } finally {
      setLoading(false);
    }
  };

  /**
   * Avanza a la siguiente fase del ciclo
   */
  const avanzarFase = async (area: string) => {
    const secuenciaFases: ('explorar' | 'explicar' | 'aplicar' | 'evaluar')[] = 
      ['explorar', 'explicar', 'aplicar', 'evaluar'];
    const indiceActual = secuenciaFases.indexOf(faseActual);
    const siguienteFase = secuenciaFases[(indiceActual + 1) % secuenciaFases.length];
    
    return await generarEjerciciosCiclo(area, siguienteFase);
  };

  /**
   * Exporta resultados del diagnóstico
   */
  const exportarResultados = async (diagnosticoId: string) => {
    if (!user) return null;

    setLoading(true);
    try {
      const reporte = await PAESCienciasGenerator.exportarResultados(
        diagnosticoId,
        user.id
      );
      
      if (reporte) {
        toast({
          title: "Reporte Generado",
          description: "Se ha generado el reporte de resultados"
        });
      }
      
      return reporte;
    } catch (error) {
      console.error('Error exportando resultados:', error);
      return null;
    } finally {
      setLoading(false);
    }
  };

  /**
   * Obtiene estadísticas del progreso
   */
  const obtenerEstadisticas = () => {
    return {
      diagnosticoActual,
      ejerciciosActuales,
      faseActual,
      totalEjercicios: ejerciciosActuales.length,
      progresoCiclo: {
        explorar: faseActual === 'explorar' ? 'actual' : 
                 ['explicar', 'aplicar', 'evaluar'].includes(faseActual) ? 'completado' : 'pendiente',
        explicar: faseActual === 'explicar' ? 'actual' : 
                 ['aplicar', 'evaluar'].includes(faseActual) ? 'completado' : 'pendiente',
        aplicar: faseActual === 'aplicar' ? 'actual' : 
                faseActual === 'evaluar' ? 'completado' : 'pendiente',
        evaluar: faseActual === 'evaluar' ? 'actual' : 'pendiente'
      }
    };
  };

  return {
    // Estado
    loading,
    diagnosticoActual,
    ejerciciosActuales,
    faseActual,
    
    // Funciones
    generarDiagnostico,
    generarEjerciciosAdaptativos,
    generarEjerciciosCiclo,
    avanzarFase,
    exportarResultados,
    obtenerEstadisticas,
    
    // Utilidades
    reiniciarEstado: () => {
      setDiagnosticoActual(null);
      setEjerciciosActuales([]);
      setFaseActual('explorar');
    }
  };
}
