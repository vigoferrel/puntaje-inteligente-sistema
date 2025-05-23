
import { useLectoGuia } from '@/contexts/LectoGuiaContext';
import { toast } from '@/components/ui/use-toast';

export function usePAESCienciasGenerator() {
  const {
    isLoading,
    nodes,
    nodeProgress,
    selectedPrueba,
    setSelectedTestId,
    handleNodeSelect,
    setActiveTab
  } = useLectoGuia();

  /**
   * Genera un diagnóstico redirigiendo al sistema de nodos
   */
  const generarDiagnostico = async (
    cantidadPreguntas: number = 15,
    areas: string[] = ['Biología', 'Física', 'Química']
  ) => {
    try {
      // Cambiar a la prueba de ciencias
      setSelectedTestId(4); // ID para CIENCIAS
      
      // Redirigir a la pestaña de progreso
      setActiveTab('progress');
      
      toast({
        title: "Sistema de Ciencias Activado",
        description: "Ahora puedes ver todos los nodos de ciencias disponibles"
      });
      
      return {
        diagnosticoId: 'ciencias-system',
        preguntas: [],
        metadatos: {
          titulo: 'Sistema de Ciencias PAES',
          areas: areas
        }
      };
    } catch (error) {
      console.error('Error activando sistema de ciencias:', error);
      toast({
        title: "Error",
        description: "No se pudo activar el sistema de ciencias",
        variant: "destructive"
      });
      return null;
    }
  };

  /**
   * Genera ejercicios por ciclo usando el sistema existente
   */
  const generarEjerciciosCiclo = async (
    area: string = 'Biología',
    fase: 'explorar' | 'explicar' | 'aplicar' | 'evaluar' = 'explorar'
  ) => {
    try {
      // Filtrar nodos por área
      const nodosCiencias = nodes.filter(node => 
        node.prueba === 'CIENCIAS' && 
        (node.title.toLowerCase().includes(area.toLowerCase()) ||
         node.description.toLowerCase().includes(area.toLowerCase()))
      );

      if (nodosCiencias.length > 0) {
        // Seleccionar el primer nodo apropiado
        const nodoSeleccionado = nodosCiencias[0];
        await handleNodeSelect(nodoSeleccionado.id);
        
        toast({
          title: `Ejercicio de ${area}`,
          description: `Generando ejercicio basado en: ${nodoSeleccionado.title}`
        });
        
        return {
          fase,
          area,
          ejercicios: [],
          nodoUtilizado: nodoSeleccionado
        };
      } else {
        // Si no hay nodos específicos, ir a ejercicios generales
        setActiveTab('exercise');
        
        toast({
          title: "Ejercicios Generales",
          description: "No se encontraron nodos específicos, usando sistema general"
        });
        
        return null;
      }
    } catch (error) {
      console.error('Error generando ejercicios por ciclo:', error);
      return null;
    }
  };

  /**
   * Avanza a la siguiente fase (redirige al sistema general)
   */
  const avanzarFase = async (area: string) => {
    setActiveTab('exercise');
    return await generarEjerciciosCiclo(area, 'explicar');
  };

  /**
   * Exporta resultados (redirige al progreso)
   */
  const exportarResultados = async (diagnosticoId: string) => {
    setActiveTab('progress');
    
    toast({
      title: "Ver Progreso",
      description: "Revisa tu progreso en la pestaña de progreso"
    });
    
    return {
      mensaje: "Ver progreso en la pestaña correspondiente"
    };
  };

  /**
   * Obtiene estadísticas basadas en el sistema actual
   */
  const obtenerEstadisticas = () => {
    const nodosCiencias = nodes.filter(node => node.prueba === 'CIENCIAS');
    const nodosCompletados = nodosCiencias.filter(node => 
      nodeProgress[node.id]?.status === 'completed'
    ).length;

    return {
      diagnosticoActual: selectedPrueba === 'CIENCIAS' ? { id: 'ciencias-system' } : null,
      ejerciciosActuales: [],
      faseActual: 'explorar' as const,
      totalNodos: nodosCiencias.length,
      nodosCompletados,
      progresoCiclo: {
        explorar: nodosCompletados > 0 ? 'completado' : 'pendiente',
        explicar: nodosCompletados > 1 ? 'completado' : 'pendiente',
        aplicar: nodosCompletados > 2 ? 'completado' : 'pendiente',
        evaluar: nodosCompletados > 3 ? 'completado' : 'pendiente'
      }
    };
  };

  /**
   * Reinicia estado (vuelve al sistema general)
   */
  const reiniciarEstado = () => {
    setActiveTab('chat');
    toast({
      title: "Estado Reiniciado",
      description: "Volviendo al sistema general de LectoGuía"
    });
  };

  return {
    // Estado basado en el sistema existente
    loading: isLoading,
    diagnosticoActual: selectedPrueba === 'CIENCIAS' ? { id: 'ciencias-system' } : null,
    ejerciciosActuales: [],
    faseActual: 'explorar' as const,
    
    // Funciones que conectan con el sistema existente
    generarDiagnostico,
    generarEjerciciosCiclo,
    avanzarFase,
    exportarResultados,
    obtenerEstadisticas,
    reiniciarEstado
  };
}
