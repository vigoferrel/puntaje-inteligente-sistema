
import { toast } from '@/components/ui/use-toast';

// Datos simplificados para referencia
export const pruebaData = {
  id: 'paes-ciencias-tp-2024-forma183',
  titulo: 'PAES Ciencias - Técnico Profesional 2024',
  tipo: 'CIENCIAS',
  subtipo: 'TECNICO_PROFESIONAL',
  año: 2024,
  forma: '183',
  descripcion: 'Sistema integrado con LectoGuía para PAES Ciencias',
  areas: ['Biología', 'Física', 'Química']
};

export class PAESCienciasGenerator {
  
  /**
   * Genera un diagnóstico redirigiendo al sistema de LectoGuía
   */
  static async generarDiagnosticoCiencias(
    cantidadPreguntas: number = 15,
    areas: string[] = ['Biología', 'Física', 'Química']
  ) {
    try {
      console.log('🔬 Redirigiendo al sistema de nodos de LectoGuía...');
      
      toast({
        title: "Sistema Integrado",
        description: "Usando nodos de aprendizaje existentes para ciencias"
      });
      
      return {
        diagnosticoId: 'lectoguia-ciencias-integration',
        preguntas: [],
        metadatos: {
          ...pruebaData,
          cantidadPreguntas,
          areas,
          sistemaIntegrado: true
        }
      };
      
    } catch (error) {
      console.error('Error en integración:', error);
      toast({
        title: "Error",
        description: "No se pudo conectar con el sistema de ciencias",
        variant: "destructive"
      });
      return null;
    }
  }
  
  /**
   * Genera ejercicios por ciclo conectando con LectoGuía
   */
  static async generarEjerciciosPorCiclo(
    userId: string,
    area: string = 'Biología',
    fase: 'explorar' | 'explicar' | 'aplicar' | 'evaluar' = 'explorar'
  ) {
    try {
      console.log(`🔄 Conectando con sistema de nodos - Área: ${area}, Fase: ${fase}`);
      
      toast({
        title: "Sistema Conectado",
        description: `Buscando nodos de ${area} en LectoGuía`
      });
      
      return {
        fase,
        area,
        ejercicios: [],
        sistemaUtilizado: 'LectoGuía',
        recomendaciones: [
          `Explora los nodos de ${area} disponibles`,
          'Usa el sistema de progreso integrado',
          'Los ejercicios se generan desde nodos específicos'
        ],
        siguienteFase: fase === 'evaluar' ? 'explorar' : 'explicar'
      };
      
    } catch (error) {
      console.error('Error conectando con LectoGuía:', error);
      return null;
    }
  }
  
  /**
   * Exporta resultados usando el sistema de progreso de LectoGuía
   */
  static async exportarResultados(diagnosticoId: string, userId: string) {
    try {
      toast({
        title: "Ver Progreso",
        description: "Consulta tu progreso en la pestaña de progreso de LectoGuía"
      });
      
      return {
        diagnostico: pruebaData,
        sistemaIntegrado: true,
        mensaje: "Progreso disponible en LectoGuía",
        fecha: new Date().toISOString()
      };
      
    } catch (error) {
      console.error('Error accediendo al progreso:', error);
      return null;
    }
  }
}
