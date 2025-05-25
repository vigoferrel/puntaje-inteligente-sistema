import { supabase } from "@/integrations/supabase/client";
import { toast } from "@/components/ui/use-toast";

// Tipos para el sistema de banco de evaluaciones
export interface PreguntaBanco {
  id: string;
  codigo_pregunta: string;
  nodo_code: string;
  prueba_paes: string;
  enunciado: string;
  nivel_dificultad: 'basico' | 'intermedio' | 'avanzado';
  tipo_pregunta: 'multiple_choice' | 'multiple_select' | 'true_false' | 'ordenar_secuencia' | 'completar_texto' | 'drag_drop' | 'hotspot_imagen' | 'respuesta_numerica';
  
  // Campos específicos por tipo
  texto_base?: string;
  tipo_texto?: string;
  genero_textual?: string;
  autor_texto?: string;
  extension_palabras?: number;
  nivel_complejidad_lexica?: 'basico' | 'intermedio' | 'avanzado';
  
  // Matemáticas/Ciencias
  imagen_principal_url?: string;
  imagen_secundaria_url?: string;
  datos_tabla?: any;
  formulas_relevantes?: string[];
  unidades_trabajo?: string;
  tipo_grafico?: string;
  variables_involucradas?: string[];
  
  // Historia
  documento_fuente?: string;
  tipo_documento?: string;
  mapa_imagen_url?: string;
  cronologia?: any;
  contexto_historico?: string;
  personajes_involucrados?: string[];
  lugares_geograficos?: string[];
  periodo_historico?: string;
  
  // Configuración
  tiempo_estimado_segundos: number;
  competencias_evaluadas?: string[];
  tags_contenido?: string[];
  
  alternativas: AlternativaBanco[];
  explicacion?: ExplicacionBanco;
}

export interface AlternativaBanco {
  id: string;
  letra: string;
  contenido: string;
  es_correcta: boolean;
  tipo_distractor?: string;
  explicacion_por_que_incorrecta?: string;
}

export interface ExplicacionBanco {
  explicacion_respuesta_correcta: string;
  razonamiento_paso_a_paso?: string[];
  conceptos_clave_involucrados?: string[];
  consejos_resolucion?: string[];
  estrategias_mejora?: string[];
}

export interface EvaluacionConfig {
  tipo_evaluacion: 'diagnostica' | 'formativa' | 'sumativa' | 'adaptativa';
  prueba_paes: string;
  nodos_incluidos?: string[];
  total_preguntas: number;
  duracion_minutos: number;
  distribucion_dificultad: { basico: number; intermedio: number; avanzado: number };
  usa_gamificacion?: boolean;
  feedback_inmediato?: boolean;
}

/**
 * Servicio centralizado para gestión del banco de evaluaciones PAES Pro
 * Optimizado para reducir costos de API y mejorar calidad educativa
 */
export class BancoEvaluacionesService {
  private static cache = new Map<string, any>();
  private static readonly CACHE_DURATION = 1000 * 60 * 30; // 30 minutos

  /**
   * Precarga todo el contenido educativo para uso offline
   */
  static async precargarContenidoEducativo(userId: string): Promise<{
    preguntas: PreguntaBanco[];
    evaluaciones: any[];
    nodos: any[];
    totalElementos: number;
  }> {
    console.log('🚀 Iniciando precarga completa del contenido educativo...');
    
    try {
      const startTime = Date.now();
      
      // Cargar en paralelo todos los elementos esenciales
      const [preguntasResult, evaluacionesResult, nodosResult] = await Promise.all([
        this.cargarBancoPreguntas(),
        this.cargarEvaluacionesDisponibles(),
        this.cargarNodosAprendizaje()
      ]);

      const totalElementos = 
        preguntasResult.length + 
        evaluacionesResult.length + 
        nodosResult.length;

      const loadTime = Date.now() - startTime;
      
      console.log(`✅ Precarga completada en ${loadTime}ms:`);
      console.log(`📚 ${preguntasResult.length} preguntas cargadas`);
      console.log(`📋 ${evaluacionesResult.length} evaluaciones disponibles`);
      console.log(`🎯 ${nodosResult.length} nodos de aprendizaje`);

      // Cachear para uso inmediato
      this.cache.set('preguntas_completas', {
        data: preguntasResult,
        timestamp: Date.now()
      });

      toast({
        title: "Contenido Educativo Cargado",
        description: `${totalElementos} elementos listos para uso offline`,
      });

      return {
        preguntas: preguntasResult,
        evaluaciones: evaluacionesResult,
        nodos: nodosResult,
        totalElementos
      };

    } catch (error) {
      console.error('❌ Error en precarga de contenido:', error);
      toast({
        title: "Error en Precarga",
        description: "No se pudo cargar todo el contenido. Funcionará en modo reducido.",
        variant: "destructive"
      });
      
      return {
        preguntas: [],
        evaluaciones: [],
        nodos: [],
        totalElementos: 0
      };
    }
  }

  /**
   * Carga optimizada del banco completo de preguntas
   */
  private static async cargarBancoPreguntas(): Promise<PreguntaBanco[]> {
    const { data: preguntas, error } = await supabase
      .from('banco_preguntas')
      .select(`
        id,
        codigo_pregunta,
        nodo_code,
        prueba_paes,
        enunciado,
        nivel_dificultad,
        tipo_pregunta,
        texto_base,
        tipo_texto,
        genero_textual,
        autor_texto,
        extension_palabras,
        nivel_complejidad_lexica,
        imagen_principal_url,
        imagen_secundaria_url,
        datos_tabla,
        formulas_relevantes,
        unidades_trabajo,
        tipo_grafico,
        variables_involucradas,
        documento_fuente,
        tipo_documento,
        mapa_imagen_url,
        cronologia,
        contexto_historico,
        personajes_involucrados,
        lugares_geograficos,
        periodo_historico,
        tiempo_estimado_segundos,
        competencias_evaluadas,
        tags_contenido,
        alternativas_respuesta (
          id,
          letra,
          contenido,
          es_correcta,
          tipo_distractor,
          explicacion_por_que_incorrecta
        ),
        explicaciones_pregunta (
          explicacion_respuesta_correcta,
          razonamiento_paso_a_paso,
          conceptos_clave_involucrados,
          consejos_resolucion,
          estrategias_mejora
        )
      `)
      .eq('validada', true)
      .order('created_at', { ascending: false });

    if (error) {
      console.error('Error cargando banco de preguntas:', error);
      return [];
    }

    return preguntas?.map(p => ({
      ...p,
      nivel_dificultad: p.nivel_dificultad as 'basico' | 'intermedio' | 'avanzado',
      tipo_pregunta: p.tipo_pregunta as 'multiple_choice' | 'multiple_select' | 'true_false' | 'ordenar_secuencia' | 'completar_texto' | 'drag_drop' | 'hotspot_imagen' | 'respuesta_numerica',
      nivel_complejidad_lexica: p.nivel_complejidad_lexica as 'basico' | 'intermedio' | 'avanzado' | undefined,
      alternativas: p.alternativas_respuesta || [],
      explicacion: p.explicaciones_pregunta?.[0]
    })) || [];
  }

  /**
   * Carga las evaluaciones disponibles
   */
  private static async cargarEvaluacionesDisponibles() {
    const { data, error } = await supabase
      .from('evaluaciones')
      .select('*')
      .eq('esta_activo', true)
      .order('created_at', { ascending: false });

    if (error) {
      console.error('Error cargando evaluaciones:', error);
      return [];
    }

    return data || [];
  }

  /**
   * Carga los nodos de aprendizaje con sus relaciones
   */
  private static async cargarNodosAprendizaje() {
    const { data, error } = await supabase
      .from('learning_nodes')
      .select('*')
      .order('position');

    if (error) {
      console.error('Error cargando nodos:', error);
      return [];
    }

    return data || [];
  }

  /**
   * Genera evaluación optimizada sin APIs externas
   */
  static async generarEvaluacionOptimizada(config: EvaluacionConfig): Promise<{
    evaluacion: any;
    preguntas: PreguntaBanco[];
    estimaciones: any;
  }> {
    console.log('🎯 Generando evaluación optimizada:', config);
    
    try {
      // Usar cache si está disponible
      const preguntasCache = this.obtenerDelCache('preguntas_completas');
      let preguntasDisponibles = preguntasCache?.data || [];

      if (!preguntasDisponibles.length) {
        // Fallback: cargar preguntas específicas
        preguntasDisponibles = await this.cargarPreguntasPorCriteria(config);
      }

      // Filtrar preguntas según configuración
      const preguntasFiltradas = this.filtrarPreguntasPorConfig(preguntasDisponibles, config);
      
      // Seleccionar preguntas balanceadas
      const preguntasSeleccionadas = this.seleccionarPreguntasBalanceadas(
        preguntasFiltradas, 
        config
      );

      // Crear evaluación en base de datos
      const { data: evaluacion, error } = await supabase
        .from('evaluaciones')
        .insert({
          codigo: `EVAL-${Date.now()}`,
          nombre: `Evaluación ${config.tipo_evaluacion} - ${config.prueba_paes}`,
          tipo_evaluacion: config.tipo_evaluacion,
          prueba_paes: config.prueba_paes,
          total_preguntas: config.total_preguntas,
          duracion_minutos: config.duracion_minutos,
          distribucion_dificultad: config.distribucion_dificultad,
          usa_gamificacion: config.usa_gamificacion || false,
          feedback_inmediato: config.feedback_inmediato || false,
          nodos_incluidos: config.nodos_incluidos || []
        })
        .select()
        .single();

      if (error) throw error;

      const estimaciones = this.calcularEstimacionesEvaluacion(preguntasSeleccionadas);

      console.log('✅ Evaluación generada exitosamente');
      console.log(`📊 ${preguntasSeleccionadas.length} preguntas seleccionadas`);
      console.log(`⏱️ Tiempo estimado: ${estimaciones.tiempoEstimadoMinutos} minutos`);

      return {
        evaluacion,
        preguntas: preguntasSeleccionadas,
        estimaciones
      };

    } catch (error) {
      console.error('❌ Error generando evaluación:', error);
      throw error;
    }
  }

  /**
   * Filtra preguntas según criterios de configuración
   */
  private static filtrarPreguntasPorConfig(
    preguntas: PreguntaBanco[], 
    config: EvaluacionConfig
  ): PreguntaBanco[] {
    return preguntas.filter(pregunta => {
      // Filtro por prueba PAES
      if (pregunta.prueba_paes !== config.prueba_paes) return false;
      
      // Filtro por nodos incluidos
      if (config.nodos_incluidos?.length && 
          !config.nodos_incluidos.includes(pregunta.nodo_code)) {
        return false;
      }

      return true;
    });
  }

  /**
   * Selecciona preguntas balanceadas según distribución de dificultad
   */
  private static seleccionarPreguntasBalanceadas(
    preguntas: PreguntaBanco[],
    config: EvaluacionConfig
  ): PreguntaBanco[] {
    const { total_preguntas, distribucion_dificultad } = config;
    const seleccionadas: PreguntaBanco[] = [];

    // Agrupar por dificultad
    const porDificultad = {
      basico: preguntas.filter(p => p.nivel_dificultad === 'basico'),
      intermedio: preguntas.filter(p => p.nivel_dificultad === 'intermedio'),
      avanzado: preguntas.filter(p => p.nivel_dificultad === 'avanzado')
    };

    // Calcular cantidad por nivel
    const cantidades = {
      basico: Math.floor(total_preguntas * distribucion_dificultad.basico / 100),
      intermedio: Math.floor(total_preguntas * distribucion_dificultad.intermedio / 100),
      avanzado: Math.floor(total_preguntas * distribucion_dificultad.avanzado / 100)
    };

    // Seleccionar aleatoriamente de cada nivel
    Object.entries(cantidades).forEach(([nivel, cantidad]) => {
      const preguntasNivel = porDificultad[nivel as keyof typeof porDificultad];
      const seleccionadasNivel = this.seleccionarAleatoriamente(preguntasNivel, cantidad);
      seleccionadas.push(...seleccionadasNivel);
    });

    // Completar hasta el total si es necesario
    while (seleccionadas.length < total_preguntas) {
      const restantes = preguntas.filter(p => !seleccionadas.find(s => s.id === p.id));
      if (restantes.length === 0) break;
      
      const adicional = this.seleccionarAleatoriamente(restantes, 1);
      seleccionadas.push(...adicional);
    }

    return seleccionadas.slice(0, total_preguntas);
  }

  /**
   * Selección aleatoria de elementos de un array
   */
  private static seleccionarAleatoriamente<T>(array: T[], cantidad: number): T[] {
    const shuffled = [...array].sort(() => 0.5 - Math.random());
    return shuffled.slice(0, Math.min(cantidad, array.length));
  }

  /**
   * Calcula estimaciones para la evaluación
   */
  private static calcularEstimacionesEvaluacion(preguntas: PreguntaBanco[]) {
    const tiempoEstimadoSegundos = preguntas.reduce(
      (total, p) => total + p.tiempo_estimado_segundos, 0
    );

    const distribucionTipos = preguntas.reduce((acc, p) => {
      acc[p.tipo_pregunta] = (acc[p.tipo_pregunta] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);

    const competenciasEvaluadas = [...new Set(
      preguntas.flatMap(p => p.competencias_evaluadas || [])
    )];

    return {
      tiempoEstimadoMinutos: Math.ceil(tiempoEstimadoSegundos / 60),
      distribucionTipos,
      competenciasEvaluadas,
      dificultadPromedio: this.calcularDificultadPromedio(preguntas)
    };
  }

  private static calcularDificultadPromedio(preguntas: PreguntaBanco[]): number {
    const pesos = { basico: 1, intermedio: 2, avanzado: 3 };
    const suma = preguntas.reduce((total, p) => total + pesos[p.nivel_dificultad], 0);
    return suma / preguntas.length;
  }

  /**
   * Obtener datos del cache
   */
  private static obtenerDelCache(key: string) {
    const cached = this.cache.get(key);
    if (!cached) return null;
    
    const esValido = Date.now() - cached.timestamp < this.CACHE_DURATION;
    return esValido ? cached : null;
  }

  /**
   * Carga preguntas por criterios específicos (fallback)
   */
  private static async cargarPreguntasPorCriteria(config: EvaluacionConfig) {
    let query = supabase
      .from('banco_preguntas')
      .select(`
        id, codigo_pregunta, nodo_code, prueba_paes, enunciado,
        nivel_dificultad, tipo_pregunta, tiempo_estimado_segundos,
        competencias_evaluadas, tags_contenido,
        alternativas_respuesta (id, letra, contenido, es_correcta)
      `)
      .eq('validada', true)
      .eq('prueba_paes', config.prueba_paes);

    if (config.nodos_incluidos?.length) {
      query = query.in('nodo_code', config.nodos_incluidos);
    }

    const { data, error } = await query.limit(100);

    if (error) {
      console.error('Error cargando preguntas por criterios:', error);
      return [];
    }

    return data?.map(p => ({
      ...p,
      nivel_dificultad: p.nivel_dificultad as 'basico' | 'intermedio' | 'avanzado',
      tipo_pregunta: p.tipo_pregunta as 'multiple_choice' | 'multiple_select' | 'true_false' | 'ordenar_secuencia' | 'completar_texto' | 'drag_drop' | 'hotspot_imagen' | 'respuesta_numerica',
      alternativas: p.alternativas_respuesta || []
    })) || [];
  }

  /**
   * NUEVO: Obtener pregunta específica por ID
   */
  static async obtenerPreguntaPorId(preguntaId: string): Promise<PreguntaBanco | null> {
    const cacheKey = `pregunta_${preguntaId}`;
    const cached = this.obtenerDelCache(cacheKey);
    
    if (cached?.data) {
      return cached.data;
    }

    try {
      const { data: pregunta, error } = await supabase
        .from('banco_preguntas')
        .select(`
          id,
          codigo_pregunta,
          nodo_code,
          prueba_paes,
          enunciado,
          nivel_dificultad,
          tipo_pregunta,
          tiempo_estimado_segundos,
          parametro_discriminacion,
          parametro_dificultad,
          alternativas_respuesta (
            id,
            letra,
            contenido,
            es_correcta,
            tipo_distractor,
            explicacion_por_que_incorrecta
          ),
          explicaciones_pregunta (
            explicacion_respuesta_correcta,
            razonamiento_paso_a_paso,
            conceptos_clave_involucrados,
            consejos_resolucion,
            estrategias_mejora
          )
        `)
        .eq('id', preguntaId)
        .single();

      if (error) {
        console.error('Error obteniendo pregunta por ID:', error);
        return null;
      }

      const preguntaFormatted: PreguntaBanco = {
        ...pregunta,
        nivel_dificultad: pregunta.nivel_dificultad as 'basico' | 'intermedio' | 'avanzado',
        tipo_pregunta: pregunta.tipo_pregunta as 'multiple_choice' | 'multiple_select' | 'true_false' | 'ordenar_secuencia' | 'completar_texto' | 'drag_drop' | 'hotspot_imagen' | 'respuesta_numerica',
        alternativas: pregunta.alternativas_respuesta || [],
        explicacion: pregunta.explicaciones_pregunta?.[0],
        parametro_discriminacion: pregunta.parametro_discriminacion || 1.0,
        parametro_dificultad: pregunta.parametro_dificultad || 0.0
      };

      // Cachear resultado
      this.cache.set(cacheKey, {
        data: preguntaFormatted,
        timestamp: Date.now()
      });

      return preguntaFormatted;

    } catch (error) {
      console.error('Error en obtenerPreguntaPorId:', error);
      return null;
    }
  }

  /**
   * NUEVO: Selección adaptativa de preguntas basada en IRT
   */
  static async seleccionarPreguntaAdaptativa(config: {
    targetDifficulty: number;
    usedQuestions: string[];
    maxInformation?: boolean;
    pruebaPaes?: string;
  }): Promise<PreguntaBanco | null> {
    const { targetDifficulty, usedQuestions, maxInformation = true, pruebaPaes = 'COMPETENCIA_LECTORA' } = config;

    try {
      // Construir query excluyendo preguntas ya utilizadas
      let query = supabase
        .from('banco_preguntas')
        .select(`
          id,
          codigo_pregunta,
          nodo_code,
          prueba_paes,
          enunciado,
          nivel_dificultad,
          tipo_pregunta,
          tiempo_estimado_segundos,
          parametro_discriminacion,
          parametro_dificultad,
          alternativas_respuesta (
            id,
            letra,
            contenido,
            es_correcta,
            tipo_distractor,
            explicacion_por_que_incorrecta
          )
        `)
        .eq('validada', true)
        .eq('prueba_paes', pruebaPaes);

      // Excluir preguntas ya utilizadas
      if (usedQuestions.length > 0) {
        query = query.not('id', 'in', `(${usedQuestions.join(',')})`);
      }

      const { data: preguntas, error } = await query.limit(50);

      if (error || !preguntas?.length) {
        console.error('Error en selección adaptativa:', error);
        return null;
      }

      // Algoritmo IRT simplificado para seleccionar la mejor pregunta
      let bestPregunta: any = null;
      let bestInformation = 0;

      preguntas.forEach(pregunta => {
        const discrimination = pregunta.parametro_discriminacion || 1.0;
        const difficulty = pregunta.parametro_dificultad || 0.0;
        
        // Calcular información de Fisher simplificada
        const diffFromTarget = Math.abs(difficulty - targetDifficulty);
        const information = discrimination * Math.exp(-Math.pow(diffFromTarget, 2));
        
        if (information > bestInformation || !bestPregunta) {
          bestInformation = information;
          bestPregunta = pregunta;
        }
      });

      if (!bestPregunta) return null;

      // Formatear resultado
      const preguntaFormatted: PreguntaBanco = {
        ...bestPregunta,
        nivel_dificultad: bestPregunta.nivel_dificultad as 'basico' | 'intermedio' | 'avanzado',
        tipo_pregunta: bestPregunta.tipo_pregunta as 'multiple_choice' | 'multiple_select' | 'true_false' | 'ordenar_secuencia' | 'completar_texto' | 'drag_drop' | 'hotspot_imagen' | 'respuesta_numerica',
        alternativas: bestPregunta.alternativas_respuesta || [],
        parametro_discriminacion: bestPregunta.parametro_discriminacion || 1.0,
        parametro_dificultad: bestPregunta.parametro_dificultad || 0.0
      };

      console.log(`🎯 Pregunta adaptativa seleccionada: dificultad=${difficulty}, información=${bestInformation}`);
      
      return preguntaFormatted;

    } catch (error) {
      console.error('Error en seleccionarPreguntaAdaptativa:', error);
      return null;
    }
  }

  /**
   * Análisis en tiempo real del progreso
   */
  static async analizarProgresoTiempoReal(
    userId: string,
    respuestas: any[]
  ): Promise<any> {
    console.log('📊 Analizando progreso en tiempo real...');
    
    const analisis = {
      puntajeActual: this.calcularPuntajeActual(respuestas),
      tiempoPromedio: this.calcularTiempoPromedio(respuestas),
      patronesDetectados: this.detectarPatrones(respuestas),
      recomendacionesInmediatas: this.generarRecomendacionesInmediatas(respuestas),
      prediccionRendimiento: this.predecirRendimientoFinal(respuestas)
    };

    return analisis;
  }

  private static calcularPuntajeActual(respuestas: any[]): number {
    const correctas = respuestas.filter(r => r.es_correcta).length;
    return respuestas.length > 0 ? (correctas / respuestas.length) * 100 : 0;
  }

  private static calcularTiempoPromedio(respuestas: any[]): number {
    if (!respuestas.length) return 0;
    const tiempoTotal = respuestas.reduce((sum, r) => sum + (r.tiempo_respuesta_segundos || 0), 0);
    return tiempoTotal / respuestas.length;
  }

  private static detectarPatrones(respuestas: any[]): string[] {
    const patrones: string[] = [];
    
    // Detectar respuestas muy rápidas
    const respuestasRapidas = respuestas.filter(r => r.tiempo_respuesta_segundos < 10).length;
    if (respuestasRapidas > respuestas.length * 0.3) {
      patrones.push('respuestas_muy_rapidas');
    }
    
    // Detectar muchos cambios de respuesta
    const muchosCambios = respuestas.filter(r => r.numero_cambios_respuesta > 2).length;
    if (muchosCambios > respuestas.length * 0.5) {
      patrones.push('indecision_alta');
    }

    return patrones;
  }

  private static generarRecomendacionesInmediatas(respuestas: any[]): string[] {
    const recomendaciones: string[] = [];
    
    const puntaje = this.calcularPuntajeActual(respuestas);
    const tiempoPromedio = this.calcularTiempoPromedio(respuestas);
    
    if (puntaje < 50) {
      recomendaciones.push('Tómate más tiempo para leer cada pregunta cuidadosamente');
    }
    
    if (tiempoPromedio < 30) {
      recomendaciones.push('Considera dedicar más tiempo a cada pregunta');
    }
    
    if (tiempoPromedio > 120) {
      recomendaciones.push('Intenta ser más eficiente con el tiempo');
    }

    return recomendaciones;
  }

  private static predecirRendimientoFinal(respuestas: any[]): any {
    const puntajeActual = this.calcularPuntajeActual(respuestas);
    const tendencia = this.calcularTendencia(respuestas);
    
    return {
      puntajePredictedoPAES: Math.round(150 + (puntajeActual / 100) * 700),
      confianzaPrediccion: Math.min(respuestas.length * 10, 90),
      tendencia: tendencia > 0 ? 'mejorando' : tendencia < 0 ? 'empeorando' : 'estable'
    };
  }

  private static calcularTendencia(respuestas: any[]): number {
    if (respuestas.length < 5) return 0;
    
    const mitad = Math.floor(respuestas.length / 2);
    const primeraMitad = respuestas.slice(0, mitad);
    const segundaMitad = respuestas.slice(mitad);
    
    const puntajePrimero = this.calcularPuntajeActual(primeraMitad);
    const puntajeSegundo = this.calcularPuntajeActual(segundaMitad);
    
    return puntajeSegundo - puntajePrimero;
  }
}
