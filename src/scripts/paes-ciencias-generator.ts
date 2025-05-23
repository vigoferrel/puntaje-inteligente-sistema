
import { supabase } from '@/integrations/supabase/client';
import { TPAESPrueba, TPAESHabilidad } from '@/types/system-types';
import { toast } from '@/components/ui/use-toast';

// Datos oficiales PAES Ciencias 2024
export const pruebaData = {
  id: 'paes-ciencias-tp-2024-forma183',
  titulo: 'PAES Ciencias - Técnico Profesional 2024',
  tipo: 'CIENCIAS' as TPAESPrueba,
  subtipo: 'TECNICO_PROFESIONAL',
  año: 2024,
  forma: '183',
  duracion_minutos: 160,
  total_preguntas: 80,
  preguntas_evaluadas: 75,
  fecha_aplicacion: '2024-11-01',
  descripcion: 'Prueba de Acceso a la Educación Superior (PAES) - Ciencias Técnico Profesional, Forma 183, Proceso de Admisión 2024',
  instrucciones: 'Esta prueba consta de 80 preguntas de los tres ejes de Ciencias, 75 de las cuales serán consideradas para el cálculo del puntaje final.',
  estructura: {
    modulo_comun: 54,
    modulo_tecnico_profesional: 26,
    areas: ['Biología', 'Física', 'Química'],
    habilidades: ['Analizar', 'Procesar', 'Evaluar', 'Planificar']
  }
};

// Mapeo de habilidades PAES a habilidades del sistema
const habilidadMapping: Record<string, TPAESHabilidad> = {
  'Analizar': 'PROCESS_ANALYZE',
  'Procesar': 'PROCESS_ANALYZE', 
  'Evaluar': 'EVALUATE_REFLECT',
  'Planificar': 'APPLY_PRINCIPLES'
};

// Mapeo de dificultades
const dificultadMapping: Record<string, 'basic' | 'intermediate' | 'advanced'> = {
  'Básico': 'basic',
  'Intermedio': 'intermediate', 
  'Avanzado': 'advanced'
};

// Preguntas oficiales procesadas
export const preguntasPAES = [
  {
    numero: 1,
    enunciado: '¿Cuál de las siguientes opciones corresponde a una característica común entre las mitocondrias, los cloroplastos y el núcleo de una célula vegetal?',
    area: 'Biología',
    eje: 'Módulo Común',
    habilidad: 'Analizar',
    dificultad: 'Intermedio',
    alternativas: [
      'Los tres organelos presentan compartimientos membranosos en su interior.',
      'Los tres organelos presentan estructuras con una monocapa de fosfolípidos.',
      'Los tres organelos presentan material genético.',
      'Los tres organelos presentan cadena de transporte de electrones.'
    ],
    respuesta_correcta: 'Los tres organelos presentan material genético.',
    explicacion: 'Las mitocondrias, cloroplastos y núcleo contienen material genético (ADN), siendo esta una característica común entre estos organelos.'
  },
  {
    numero: 2,
    enunciado: 'La difusión simple y la difusión mediada por transportadores corresponden a dos tipos de transporte pasivo a través de la membrana celular. ¿Cuál de las siguientes aseveraciones es coherente con los datos representados en el gráfico?',
    area: 'Biología',
    eje: 'Módulo Común',
    habilidad: 'Analizar',
    dificultad: 'Intermedio',
    contexto: 'Gráfico que muestra la velocidad de difusión vs gradiente de concentración para difusión simple y mediada por transportador',
    alternativas: [
      'La velocidad de la difusión simple disminuye a medida que la concentración de soluto se incrementa.',
      'La velocidad de la difusión simple exhibe un comportamiento inversamente proporcional a la concentración del soluto.',
      'La velocidad de la difusión mediada por un transportador alcanza un máximo, sugiriendo que el transportador es saturable.',
      'La velocidad de la difusión mediada por un transportador es directamente proporcional al gradiente de concentración del soluto en todo el rango medido.'
    ],
    respuesta_correcta: 'La velocidad de la difusión mediada por un transportador alcanza un máximo, sugiriendo que el transportador es saturable.',
    explicacion: 'El transportador presenta saturación, lo que se evidencia cuando la velocidad alcanza un máximo y se mantiene constante a pesar del aumento en el gradiente de concentración.'
  },
  {
    numero: 29,
    enunciado: 'Un actor debe maquillarse para representar su personaje. Para esto necesita ver su imagen derecha y de mayor tamaño. ¿Qué tipo de espejo debe usar y dónde debe ubicarse?',
    area: 'Física',
    eje: 'Módulo Común',
    habilidad: 'Aplicar',
    dificultad: 'Intermedio',
    alternativas: [
      'Espejo convexo, ubicándose a una distancia del espejo igual al doble de su distancia focal.',
      'Espejo cóncavo o convexo, ubicándose a una distancia del espejo igual a su distancia focal.',
      'Espejo cóncavo, ubicándose a una distancia del espejo igual a su distancia focal.',
      'Espejo cóncavo, ubicándose entre el espejo y el foco del espejo.'
    ],
    respuesta_correcta: 'Espejo cóncavo, ubicándose entre el espejo y el foco del espejo.',
    explicacion: 'Para obtener una imagen derecha y aumentada se requiere un espejo cóncavo, ubicándose entre el espejo y su foco.'
  }
];

export class PAESCienciasGenerator {
  
  /**
   * Genera un diagnóstico completo de ciencias basado en las preguntas PAES 2024
   */
  static async generarDiagnosticoCiencias(
    cantidadPreguntas: number = 15,
    areas: string[] = ['Biología', 'Física', 'Química']
  ) {
    try {
      console.log('🔬 Generando diagnóstico de ciencias PAES 2024...');
      
      // Filtrar preguntas por áreas seleccionadas
      const preguntasFiltradas = preguntasPAES.filter(p => areas.includes(p.area));
      
      // Seleccionar preguntas balanceadas por área y habilidad
      const preguntasSeleccionadas = this.seleccionarPreguntasBalanceadas(
        preguntasFiltradas, 
        cantidadPreguntas
      );
      
      // Crear el diagnóstico en la base de datos
      const diagnosticoId = await this.crearDiagnosticoEnBD(preguntasSeleccionadas);
      
      if (diagnosticoId) {
        toast({
          title: "Diagnóstico Generado",
          description: `Se ha creado un diagnóstico de ciencias con ${preguntasSeleccionadas.length} preguntas`
        });
        
        return {
          diagnosticoId,
          preguntas: preguntasSeleccionadas,
          metadatos: pruebaData
        };
      }
      
      throw new Error('No se pudo crear el diagnóstico');
      
    } catch (error) {
      console.error('Error al generar diagnóstico:', error);
      toast({
        title: "Error",
        description: "No se pudo generar el diagnóstico de ciencias",
        variant: "destructive"
      });
      return null;
    }
  }
  
  /**
   * Selecciona preguntas balanceadas por área y habilidad
   */
  private static seleccionarPreguntasBalanceadas(
    preguntas: any[], 
    cantidad: number
  ): any[] {
    const areas = [...new Set(preguntas.map(p => p.area))];
    const habilidades = [...new Set(preguntas.map(p => p.habilidad))];
    
    const preguntasPorArea = Math.ceil(cantidad / areas.length);
    const seleccionadas: any[] = [];
    
    for (const area of areas) {
      const preguntasArea = preguntas.filter(p => p.area === area);
      const preguntasAreaSeleccionadas = preguntasArea
        .sort(() => 0.5 - Math.random())
        .slice(0, preguntasPorArea);
      
      seleccionadas.push(...preguntasAreaSeleccionadas);
    }
    
    return seleccionadas.slice(0, cantidad);
  }
  
  /**
   * Crea el diagnóstico en la base de datos
   */
  private static async crearDiagnosticoEnBD(preguntas: any[]): Promise<string | null> {
    try {
      // Crear el diagnóstico principal
      const { data: diagnostico, error: diagnosticoError } = await supabase
        .from('diagnostic_tests')
        .insert({
          title: pruebaData.titulo,
          description: pruebaData.descripcion,
          test_id: 4 // ID para CIENCIAS
        })
        .select()
        .single();
      
      if (diagnosticoError) throw diagnosticoError;
      
      // Crear los ejercicios asociados
      const ejercicios = preguntas.map(pregunta => ({
        diagnostic_id: diagnostico.id,
        node_id: '00000000-0000-0000-0000-000000000000', // Default node_id required by schema
        question: pregunta.enunciado,
        options: pregunta.alternativas,
        correct_answer: pregunta.respuesta_correcta,
        explanation: pregunta.explicacion,
        test_id: 4,
        skill_id: this.mapearHabilidadAId(pregunta.habilidad),
        difficulty: dificultadMapping[pregunta.dificultad] || 'intermediate'
      }));
      
      const { error: ejerciciosError } = await supabase
        .from('exercises')
        .insert(ejercicios);
      
      if (ejerciciosError) throw ejerciciosError;
      
      return diagnostico.id;
      
    } catch (error) {
      console.error('Error creando diagnóstico en BD:', error);
      return null;
    }
  }
  
  /**
   * Mapea habilidades PAES a IDs del sistema
   */
  private static mapearHabilidadAId(habilidad: string): number {
    const mapping: Record<string, number> = {
      'Analizar': 9, // PROCESS_ANALYZE
      'Procesar': 9, // PROCESS_ANALYZE
      'Evaluar': 3, // EVALUATE_REFLECT
      'Planificar': 10, // APPLY_PRINCIPLES
      'Aplicar': 10 // APPLY_PRINCIPLES
    };
    return mapping[habilidad] || 9;
  }
  
  /**
   * Genera ejercicios adaptativos basados en un nodo de aprendizaje
   */
  static async generarEjerciciosAdaptativos(
    nodeId: string, 
    area: string,
    nivel: 'basic' | 'intermediate' | 'advanced' = 'intermediate',
    cantidad: number = 3
  ) {
    try {
      console.log(`🧪 Generando ejercicios adaptativos para nodo ${nodeId} en ${area}`);
      
      // Filtrar preguntas por área y nivel
      const preguntasBase = preguntasPAES.filter(p => 
        p.area === area && 
        dificultadMapping[p.dificultad] === nivel
      );
      
      if (preguntasBase.length === 0) {
        // Si no hay preguntas del nivel exacto, usar nivel intermedio
        const preguntasFallback = preguntasPAES.filter(p => p.area === area);
        return this.adaptarPreguntasParaNodo(preguntasFallback.slice(0, cantidad), nodeId);
      }
      
      const preguntasSeleccionadas = preguntasBase
        .sort(() => 0.5 - Math.random())
        .slice(0, cantidad);
      
      return this.adaptarPreguntasParaNodo(preguntasSeleccionadas, nodeId);
      
    } catch (error) {
      console.error('Error generando ejercicios adaptativos:', error);
      return [];
    }
  }
  
  /**
   * Adapta preguntas PAES para un nodo específico
   */
  private static adaptarPreguntasParaNodo(preguntas: any[], nodeId: string) {
    return preguntas.map(pregunta => ({
      id: `${nodeId}-${pregunta.numero}`,
      question: pregunta.enunciado,
      options: pregunta.alternativas,
      correctAnswer: pregunta.respuesta_correcta,
      explanation: pregunta.explicacion,
      skill: habilidadMapping[pregunta.habilidad] || 'PROCESS_ANALYZE',
      prueba: 'CIENCIAS' as TPAESPrueba,
      difficulty: dificultadMapping[pregunta.dificultad] || 'intermediate',
      area: pregunta.area,
      nodeId: nodeId,
      metadata: {
        origen: 'PAES_2024',
        numero_original: pregunta.numero,
        contexto: pregunta.contexto
      }
    }));
  }
  
  /**
   * Genera ejercicios por ciclo de aprendizaje
   */
  static async generarEjerciciosPorCiclo(
    userId: string,
    area: string = 'Biología',
    fase: 'explorar' | 'explicar' | 'aplicar' | 'evaluar' = 'explorar'
  ) {
    try {
      console.log(`🔄 Generando ejercicios para ciclo de aprendizaje - Fase: ${fase}, Área: ${area}`);
      
      // Definir configuración por fase del ciclo
      const configuracionFase = {
        explorar: { nivel: 'basic' as const, cantidad: 2, enfoque: 'conceptual' },
        explicar: { nivel: 'intermediate' as const, cantidad: 3, enfoque: 'comprension' },
        aplicar: { nivel: 'intermediate' as const, cantidad: 4, enfoque: 'aplicacion' },
        evaluar: { nivel: 'advanced' as const, cantidad: 3, enfoque: 'evaluacion' }
      };
      
      const config = configuracionFase[fase];
      
      // Obtener progreso del usuario para personalizar
      const { data: progreso } = await supabase
        .from('user_skill_levels')
        .select('skill_id, level')
        .eq('user_id', userId);
      
      // Seleccionar preguntas apropiadas para la fase
      const preguntasFase = this.seleccionarPreguntasPorFase(area, fase, config);
      
      // Adaptar según el progreso del usuario
      const ejerciciosAdaptados = this.adaptarSegunProgreso(preguntasFase, progreso || []);
      
      return {
        fase,
        area,
        ejercicios: ejerciciosAdaptados,
        recomendaciones: this.generarRecomendaciones(fase, area),
        siguienteFase: this.determinarSiguienteFase(fase)
      };
      
    } catch (error) {
      console.error('Error generando ejercicios por ciclo:', error);
      return null;
    }
  }
  
  /**
   * Selecciona preguntas apropiadas para cada fase del ciclo
   */
  private static seleccionarPreguntasPorFase(
    area: string, 
    fase: string, 
    config: any
  ) {
    const todasLasPreguntas = preguntasPAES.filter(p => p.area === area);
    
    // Filtrar por tipo de habilidad según la fase
    const habilidadesPorFase: Record<string, string[]> = {
      explorar: ['Analizar'],
      explicar: ['Analizar', 'Procesar'],
      aplicar: ['Aplicar', 'Planificar'],
      evaluar: ['Evaluar']
    };
    
    const habilidadesRelevantes = habilidadesPorFase[fase] || ['Analizar'];
    
    return todasLasPreguntas
      .filter(p => habilidadesRelevantes.includes(p.habilidad))
      .filter(p => dificultadMapping[p.dificultad] === config.nivel)
      .slice(0, config.cantidad);
  }
  
  /**
   * Adapta ejercicios según el progreso del usuario
   */
  private static adaptarSegunProgreso(preguntas: any[], progreso: any[]) {
    // Calcular nivel promedio del usuario
    const nivelPromedio = progreso.length > 0 
      ? progreso.reduce((sum, p) => sum + p.level, 0) / progreso.length
      : 0.5;
    
    // Ajustar dificultad según el nivel
    return preguntas.map(pregunta => ({
      ...pregunta,
      dificultadAjustada: this.ajustarDificultad(pregunta.dificultad, nivelPromedio),
      sugerenciasPersonalizadas: this.generarSugerenciasPersonalizadas(pregunta, nivelPromedio)
    }));
  }
  
  /**
   * Ajusta la dificultad según el nivel del usuario
   */
  private static ajustarDificultad(dificultadBase: string, nivelUsuario: number): string {
    if (nivelUsuario < 0.3) return 'Básico';
    if (nivelUsuario < 0.7) return 'Intermedio';
    return 'Avanzado';
  }
  
  /**
   * Genera sugerencias personalizadas
   */
  private static generarSugerenciasPersonalizadas(pregunta: any, nivelUsuario: number): string[] {
    const sugerencias = [];
    
    if (nivelUsuario < 0.3) {
      sugerencias.push("Revisa los conceptos básicos antes de responder");
      sugerencias.push("Analiza cada opción cuidadosamente");
    } else if (nivelUsuario < 0.7) {
      sugerencias.push("Considera el contexto del problema");
      sugerencias.push("Relaciona con conocimientos previos");
    } else {
      sugerencias.push("Analiza las implicaciones de cada opción");
      sugerencias.push("Considera casos especiales o excepciones");
    }
    
    return sugerencias;
  }
  
  /**
   * Genera recomendaciones para cada fase
   */
  private static generarRecomendaciones(fase: string, area: string): string[] {
    const recomendacionesPorFase: Record<string, string[]> = {
      explorar: [
        "Observa y describe los fenómenos presentados",
        "Identifica patrones y regularidades",
        "Formula preguntas sobre lo que observas"
      ],
      explicar: [
        "Conecta los conceptos con la teoría",
        "Utiliza vocabulario científico apropiado",
        "Explica las relaciones causa-efecto"
      ],
      aplicar: [
        "Transfiere los conceptos a nuevas situaciones",
        "Resuelve problemas paso a paso",
        "Verifica tus resultados"
      ],
      evaluar: [
        "Analiza críticamente las opciones",
        "Evalúa la validez de los argumentos",
        "Sintetiza la información para llegar a conclusiones"
      ]
    };
    
    return recomendacionesPorFase[fase] || [];
  }
  
  /**
   * Determina la siguiente fase del ciclo
   */
  private static determinarSiguienteFase(faseActual: string): string {
    const secuenciaFases = ['explorar', 'explicar', 'aplicar', 'evaluar'];
    const indiceActual = secuenciaFases.indexOf(faseActual);
    return secuenciaFases[(indiceActual + 1) % secuenciaFases.length];
  }
  
  /**
   * Exporta resultados de diagnóstico
   */
  static async exportarResultados(diagnosticoId: string, userId: string) {
    try {
      const { data: resultados } = await supabase
        .from('user_diagnostic_results')
        .select('*')
        .eq('diagnostic_id', diagnosticoId)
        .eq('user_id', userId)
        .single();
      
      if (resultados) {
        const reporte = {
          diagnostico: pruebaData,
          resultados: resultados.results,
          fecha: resultados.completed_at,
          recomendaciones: this.generarRecomendacionesFinales(resultados.results)
        };
        
        return reporte;
      }
      
      return null;
    } catch (error) {
      console.error('Error exportando resultados:', error);
      return null;
    }
  }
  
  /**
   * Genera recomendaciones finales basadas en resultados
   */
  private static generarRecomendacionesFinales(resultados: any): string[] {
    const recomendaciones = [];
    
    // Analizar fortalezas y debilidades por área
    const areas = Object.keys(resultados);
    for (const area of areas) {
      const puntaje = resultados[area];
      if (puntaje < 0.6) {
        recomendaciones.push(`Reforzar conceptos de ${area}`);
      } else if (puntaje > 0.8) {
        recomendaciones.push(`Excelente dominio en ${area}, considera ejercicios más avanzados`);
      }
    }
    
    return recomendaciones;
  }
}
