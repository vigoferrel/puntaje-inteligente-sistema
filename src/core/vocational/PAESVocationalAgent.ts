import { supabase } from '@/integrations/supabase/client';
import { universalHub } from '@/core/universal-hub/UniversalDataHub';

// Simple EventEmitter implementation for browser compatibility
class SimpleEventEmitter {
  private events: { [key: string]: Function[] } = {};

  on(event: string, listener: Function) {
    if (!this.events[event]) {
      this.events[event] = [];
    }
    this.events[event].push(listener);
  }

  emit(event: string, data?: any) {
    if (this.events[event]) {
      this.events[event].forEach(listener => listener(data));
    }
  }

  off(event: string, listener: Function) {
    if (this.events[event]) {
      this.events[event] = this.events[event].filter(l => l !== listener);
    }
  }
}

export interface PerfilEstudiante {
  id: string;
  nombre: string;
  edad?: number;
  region?: string;
  establecimiento?: string;
  
  resultadosPAES: {
    competenciaLectora: ResultadoPrueba;
    matematicaM1: ResultadoPrueba;
    matematicaM2?: ResultadoPrueba;
    historyCS: ResultadoPrueba;
    ciencias: ResultadoPrueba;
  };
  
  competenciasTransversales: CompetenciaTransversal[];
  interesesVocacionales: InteresVocacional[];
  fortalezasNodos: string[];
  debilidadesNodos: string[];
}

export interface ResultadoPrueba {
  puntaje: number;
  percentil: number;
  fortalezasPorDimension: { [dimension: string]: number };
  debilidadesPorDimension: { [dimension: string]: number };
  nodosEvaluados: NodoEvaluacion[];
}

export interface NodoEvaluacion {
  codigoNodo: string;
  nombreNodo: string;
  puntajeObtenido: number;
  puntajeEsperado: number;
  competenciaAsociada: string;
  nivelBloom: string;
  tiempoInvertido: number;
}

export interface CompetenciaTransversal {
  nombre: string;
  nivel: 'bajo' | 'medio' | 'alto' | 'sobresaliente';
  nodosSoporte: string[];
  colorVisualizacion: string;
  descripcion: string;
  puntaje: number;
}

export interface InteresVocacional {
  area: string;
  subarea: string;
  nivelInteres: number;
  fundamentado: boolean;
  evidencias: string[];
}

export interface CarreraRecomendada {
  nombre: string;
  universidad: string;
  codigoDemre: string;
  puntajeCorte: number;
  compatibilidadGlobal: number;
  compatibilidadPorArea: { [area: string]: number };
  fortalezasAlineadas: string[];
  areasDesarrollo: string[];
  recomendacionPersonalizada: string;
  descripcionCarrera: string;
  campoLaboral: string[];
  tipoInstitucion: 'universidad' | 'instituto' | 'cft';
  modalidad: 'presencial' | 'semipresencial' | 'online';
  duracion: string;
  gradoTitulo: string;
}

export interface AnalisisVocacional {
  perfilCognitivo: PerfilCognitivo;
  competenciasDestacadas: CompetenciaTransversal[];
  competenciasEnDesarrollo: CompetenciaTransversal[];
  fortalezasVocacionales: FortalezaVocacional[];
  areasInteres: AreaInteres[];
  recomendacionesGenerales: string[];
  siguientesPasos: PasoRecomendado[];
}

export interface PerfilCognitivo {
  nivelesBloom: { [nivel: string]: number };
  estilosRazonamiento: string[];
  preferenciasCognitivas: string[];
  recomendacionesMetodologicas: string[];
}

export interface FortalezaVocacional {
  competencia: string;
  nivel: string;
  descripcion: string;
  carrerasAlineadas: string[];
  evidenciasConcretas: string[];
}

export interface AreaInteres {
  nombre: string;
  nivelInteres: number;
  fundamentacion: string;
  carrerasRelacionadas: string[];
}

export interface PasoRecomendado {
  descripcion: string;
  prioridad: 'alta' | 'media' | 'baja';
  tiempoEstimado: string;
  recursos: string[];
}

export interface RecomendacionVocacional {
  perfilAnalizado: AnalisisVocacional;
  recomendacionPrincipal: CarreraRecomendada[];
  opcionesAlternativas: CarreraRecomendada[];
  carrerasExploratorias: CarreraRecomendada[];
  analisisDetallado: AnalisisDetallado;
  recomendacionesAccion: RecomendacionAccion[];
}

export interface AnalisisDetallado {
  fortalezasTransversales: string[];
  patronesVocacionales: PatronVocacional[];
  factoresDecision: FactorDecision[];
  riesgosConsideraciones: RiesgoConsideracion[];
  recomendacionesDesarrollo: RecomendacionDesarrollo[];
}

export interface PatronVocacional {
  tipo: string;
  descripcion: string;
  implicaciones: string[];
  recomendaciones: string[];
}

export interface FactorDecision {
  factor: string;
  importancia: number;
  estado: 'favorable' | 'neutro' | 'desfavorable';
  recomendaciones: string[];
}

export interface RiesgoConsideracion {
  tipo: 'academico' | 'vocacional' | 'personal' | 'contextual';
  descripcion: string;
  impacto: 'alto' | 'medio' | 'bajo';
  estrategiasMitigacion: string[];
}

export interface RecomendacionDesarrollo {
  area: string;
  objetivos: string[];
  actividades: string[];
  recursos: string[];
  cronograma: string;
}

export interface RecomendacionAccion {
  accion: string;
  justificacion: string;
  pasos: string[];
  recursos: string[];
  fechaLimite?: Date;
}

/**
 * AGENTE VOCACIONAL PAES MASTER
 * Sistema completo de orientación vocacional basado en resultados PAES
 */
export class PAESVocationalAgent extends SimpleEventEmitter {
  private analizador: AnalizadorVocacional;
  private motorRecomendaciones: MotorRecomendacionesVocacionales;
  
  constructor() {
    super();
    this.analizador = new AnalizadorVocacional();
    this.motorRecomendaciones = new MotorRecomendacionesVocacionales();
  }
  
  /**
   * Analiza perfil completo del estudiante
   */
  async analizarPerfilVocacional(userId: string): Promise<AnalisisVocacional> {
    const estudiante = await this.obtenerPerfilEstudiante(userId);
    return this.analizador.analizarPerfilVocacional(estudiante);
  }
  
  /**
   * Genera recomendaciones vocacionales personalizadas
   */
  async generarRecomendacionesVocacionales(userId: string): Promise<RecomendacionVocacional> {
    const estudiante = await this.obtenerPerfilEstudiante(userId);
    return this.motorRecomendaciones.generarRecomendaciones(estudiante);
  }
  
  /**
   * Obtiene mapa de competencias transversales
   */
  async obtenerMapaCompetencias(userId: string): Promise<CompetenciaTransversal[]> {
    const estudiante = await this.obtenerPerfilEstudiante(userId);
    return estudiante.competenciasTransversales;
  }
  
  private async obtenerPerfilEstudiante(userId: string): Promise<PerfilEstudiante> {
    return universalHub.getCentralizedData(
      `perfil_estudiante_${userId}`,
      async () => {
        // Cargar datos reales del estudiante
        const [profile, diagnostics, nodeProgress] = await Promise.all([
          supabase.from('profiles').select('*').eq('id', userId).single(),
          supabase.from('user_diagnostic_results').select('*').eq('user_id', userId),
          supabase.from('user_node_progress').select('*').eq('user_id', userId)
        ]);
        
        return this.construirPerfilEstudiante(profile.data, diagnostics.data, nodeProgress.data);
      },
      300000 // 5 minutos TTL
    );
  }
  
  private construirPerfilEstudiante(profile: any, diagnostics: any[], nodeProgress: any[]): PerfilEstudiante {
    // Construir perfil basado en datos reales
    const competenciasTransversales = this.analizarCompetenciasTransversales(diagnostics, nodeProgress);
    
    return {
      id: profile.id,
      nombre: profile.name || 'Estudiante',
      edad: profile.age,
      region: profile.region,
      establecimiento: profile.school,
      
      resultadosPAES: this.construirResultadosPAES(diagnostics),
      competenciasTransversales,
      interesesVocacionales: this.identificarIntereses(diagnostics, competenciasTransversales),
      fortalezasNodos: this.identificarFortalezasNodos(nodeProgress),
      debilidadesNodos: this.identificarDebilidadesNodos(nodeProgress)
    };
  }
  
  private analizarCompetenciasTransversales(diagnostics: any[], nodeProgress: any[]): CompetenciaTransversal[] {
    const competenciasBase = [
      {
        nombre: 'Resolver Problemas',
        nodosSoporte: ['MAT-M1-02', 'MAT-M1-05', 'CIE-FIS-03'],
        colorVisualizacion: '#4F46E5',
        descripcion: 'Capacidad para abordar y solucionar problemas complejos'
      },
      {
        nombre: 'Interpretar-Relacionar',
        nodosSoporte: ['CL-IR-01', 'CL-IR-05', 'HST-12'],
        colorVisualizacion: '#3B82F6',
        descripcion: 'Habilidad para establecer conexiones entre ideas y conceptos'
      },
      {
        nombre: 'Pensamiento Temporal',
        nodosSoporte: ['HST-15', 'HST-20', 'HST-25'],
        colorVisualizacion: '#F97316',
        descripcion: 'Capacidad para analizar procesos históricos en el tiempo'
      },
      {
        nombre: 'Análisis de Fuentes',
        nodosSoporte: ['HST-02', 'HST-10', 'CL-ER-01'],
        colorVisualizacion: '#06B6D4',
        descripcion: 'Habilidad para interpretar y evaluar fuentes'
      },
      {
        nombre: 'Representar',
        nodosSoporte: ['MAT-M1-01', 'MAT-M2-03', 'CIE-QUI-02'],
        colorVisualizacion: '#10B981',
        descripcion: 'Capacidad para representar conceptos de forma visual o simbólica'
      },
      {
        nombre: 'Modelar',
        nodosSoporte: ['MAT-M2-01', 'CIE-FIS-05', 'MAT-M1-08'],
        colorVisualizacion: '#8B5CF6',
        descripcion: 'Habilidad para crear modelos que representen la realidad'
      }
    ];
    
    return competenciasBase.map(comp => {
      const puntaje = this.calcularPuntajeCompetencia(comp.nodosSoporte, nodeProgress);
      return {
        ...comp,
        nivel: this.determinarNivel(puntaje),
        puntaje
      };
    });
  }
  
  private calcularPuntajeCompetencia(nodosSoporte: string[], nodeProgress: any[]): number {
    const nodosRelevantes = nodeProgress.filter(np => 
      nodosSoporte.some(ns => np.node_id?.includes(ns) || np.node_code === ns)
    );
    
    if (nodosRelevantes.length === 0) return 50; // Valor por defecto
    
    const progresoPromedio = nodosRelevantes.reduce((acc, node) => 
      acc + (node.progress || 0), 0) / nodosRelevantes.length;
    
    return Math.round(progresoPromedio);
  }
  
  private determinarNivel(puntaje: number): 'bajo' | 'medio' | 'alto' | 'sobresaliente' {
    if (puntaje >= 85) return 'sobresaliente';
    if (puntaje >= 70) return 'alto';
    if (puntaje >= 50) return 'medio';
    return 'bajo';
  }
  
  private construirResultadosPAES(diagnostics: any[]): any {
    // Construir resultados PAES basado en diagnósticos
    const latestDiagnostic = diagnostics[0];
    
    return {
      competenciaLectora: {
        puntaje: latestDiagnostic?.results?.competencia_lectora || 500,
        percentil: 50,
        fortalezasPorDimension: {},
        debilidadesPorDimension: {},
        nodosEvaluados: []
      },
      matematicaM1: {
        puntaje: latestDiagnostic?.results?.matematica_m1 || 500,
        percentil: 50,
        fortalezasPorDimension: {},
        debilidadesPorDimension: {},
        nodosEvaluados: []
      },
      historyCS: {
        puntaje: latestDiagnostic?.results?.historia || 500,
        percentil: 50,
        fortalezasPorDimension: {},
        debilidadesPorDimension: {},
        nodosEvaluados: []
      },
      ciencias: {
        puntaje: latestDiagnostic?.results?.ciencias || 500,
        percentil: 50,
        fortalezasPorDimension: {},
        debilidadesPorDimension: {},
        nodosEvaluados: []
      }
    };
  }
  
  private identificarIntereses(diagnostics: any[], competencias: CompetenciaTransversal[]): InteresVocacional[] {
    const intereses: InteresVocacional[] = [];
    
    // Mapear competencias destacadas a áreas de interés
    competencias.filter(c => c.nivel === 'alto' || c.nivel === 'sobresaliente')
      .forEach(competencia => {
        const areasRelacionadas = this.mapearCompetenciaAArea(competencia.nombre);
        areasRelacionadas.forEach(area => {
          intereses.push({
            area: area.area,
            subarea: area.subarea,
            nivelInteres: Math.min(10, Math.round(competencia.puntaje / 10)),
            fundamentado: competencia.nivel === 'sobresaliente',
            evidencias: [`Competencia ${competencia.nombre} nivel ${competencia.nivel}`]
          });
        });
      });
    
    return intereses;
  }
  
  private mapearCompetenciaAArea(competencia: string): { area: string; subarea: string }[] {
    const mapeo: Record<string, { area: string; subarea: string }[]> = {
      'Resolver Problemas': [
        { area: 'Ingeniería', subarea: 'Ingeniería Civil' },
        { area: 'Ciencias', subarea: 'Matemáticas' },
        { area: 'Tecnología', subarea: 'Sistemas' }
      ],
      'Interpretar-Relacionar': [
        { area: 'Humanidades', subarea: 'Literatura' },
        { area: 'Ciencias Sociales', subarea: 'Psicología' },
        { area: 'Comunicación', subarea: 'Periodismo' }
      ],
      'Pensamiento Temporal': [
        { area: 'Humanidades', subarea: 'Historia' },
        { area: 'Ciencias Sociales', subarea: 'Ciencias Políticas' },
        { area: 'Planificación', subarea: 'Urbanismo' }
      ],
      'Análisis de Fuentes': [
        { area: 'Derecho', subarea: 'Derecho Civil' },
        { area: 'Investigación', subarea: 'Metodología' },
        { area: 'Comunicación', subarea: 'Periodismo' }
      ]
    };
    
    return mapeo[competencia] || [];
  }
  
  private identificarFortalezasNodos(nodeProgress: any[]): string[] {
    return nodeProgress
      .filter(np => (np.progress || 0) > 80)
      .map(np => np.node_id || np.node_code)
      .slice(0, 10);
  }
  
  private identificarDebilidadesNodos(nodeProgress: any[]): string[] {
    return nodeProgress
      .filter(np => (np.progress || 0) < 40)
      .map(np => np.node_id || np.node_code)
      .slice(0, 5);
  }
}

/**
 * ANALIZADOR VOCACIONAL
 */
class AnalizadorVocacional {
  analizarPerfilVocacional(estudiante: PerfilEstudiante): AnalisisVocacional {
    const competenciasDestacadas = estudiante.competenciasTransversales
      .filter(c => c.nivel === 'alto' || c.nivel === 'sobresaliente')
      .sort((a, b) => b.puntaje - a.puntaje);
    
    const competenciasEnDesarrollo = estudiante.competenciasTransversales
      .filter(c => c.nivel === 'bajo' || c.nivel === 'medio')
      .sort((a, b) => a.puntaje - b.puntaje);
    
    return {
      perfilCognitivo: this.generarPerfilCognitivo(estudiante),
      competenciasDestacadas,
      competenciasEnDesarrollo,
      fortalezasVocacionales: this.identificarFortalezasVocacionales(estudiante),
      areasInteres: this.mapearAreasInteres(estudiante),
      recomendacionesGenerales: this.generarRecomendacionesGenerales(estudiante),
      siguientesPasos: this.definirSiguientesPasos(estudiante)
    };
  }
  
  private generarPerfilCognitivo(estudiante: PerfilEstudiante): PerfilCognitivo {
    return {
      nivelesBloom: {
        'Recordar': 70,
        'Comprender': 75,
        'Aplicar': 65,
        'Analizar': 80,
        'Evaluar': 60,
        'Crear': 55
      },
      estilosRazonamiento: ['Analítico', 'Crítico', 'Sistemático'],
      preferenciasCognitivas: ['Visual', 'Secuencial', 'Reflexivo'],
      recomendacionesMetodologicas: [
        'Utilizar mapas conceptuales',
        'Trabajar con casos prácticos',
        'Análisis de ejemplos concretos'
      ]
    };
  }
  
  private identificarFortalezasVocacionales(estudiante: PerfilEstudiante): FortalezaVocacional[] {
    return estudiante.competenciasTransversales
      .filter(c => c.nivel === 'alto' || c.nivel === 'sobresaliente')
      .map(competencia => ({
        competencia: competencia.nombre,
        nivel: competencia.nivel,
        descripcion: competencia.descripcion,
        carrerasAlineadas: this.mapearCompetenciaACarreras(competencia.nombre),
        evidenciasConcretas: [`Puntaje: ${competencia.puntaje}`, `Nodos de soporte: ${competencia.nodosSoporte.length}`]
      }));
  }
  
  private mapearCompetenciaACarreras(competencia: string): string[] {
    const mapeo: Record<string, string[]> = {
      'Resolver Problemas': ['Ingeniería Civil', 'Medicina', 'Psicología', 'Arquitectura'],
      'Interpretar-Relacionar': ['Literatura', 'Historia', 'Psicología', 'Sociología'],
      'Pensamiento Temporal': ['Historia', 'Ciencias Políticas', 'Arqueología'],
      'Análisis de Fuentes': ['Derecho', 'Periodismo', 'Historia', 'Investigación'],
      'Representar': ['Arquitectura', 'Diseño', 'Matemáticas', 'Física'],
      'Modelar': ['Ingeniería', 'Economía', 'Física', 'Estadística']
    };
    
    return mapeo[competencia] || [];
  }
  
  private mapearAreasInteres(estudiante: PerfilEstudiante): AreaInteres[] {
    return estudiante.interesesVocacionales.map(interes => ({
      nombre: interes.area,
      nivelInteres: interes.nivelInteres,
      fundamentacion: interes.fundamentado ? 'Bien fundamentado' : 'Requiere exploración',
      carrerasRelacionadas: interes.evidencias
    }));
  }
  
  private generarRecomendacionesGenerales(estudiante: PerfilEstudiante): string[] {
    const recomendaciones = [];
    
    const competenciasAltas = estudiante.competenciasTransversales.filter(c => c.nivel === 'alto' || c.nivel === 'sobresaliente');
    if (competenciasAltas.length > 0) {
      recomendaciones.push(`Aprovecha tus fortalezas en ${competenciasAltas[0].nombre}`);
    }
    
    const competenciasBajas = estudiante.competenciasTransversales.filter(c => c.nivel === 'bajo');
    if (competenciasBajas.length > 0) {
      recomendaciones.push(`Considera desarrollar ${competenciasBajas[0].nombre}`);
    }
    
    recomendaciones.push('Explora carreras que combinen tus múltiples fortalezas');
    recomendaciones.push('Realiza entrevistas vocacionales con profesionales');
    
    return recomendaciones;
  }
  
  private definirSiguientesPasos(estudiante: PerfilEstudiante): PasoRecomendado[] {
    return [
      {
        descripcion: 'Explorar carreras recomendadas en detalle',
        prioridad: 'alta',
        tiempoEstimado: '2 semanas',
        recursos: ['Sitios web universitarios', 'Videos vocacionales', 'Testimonios de estudiantes']
      },
      {
        descripcion: 'Realizar entrevistas informativas',
        prioridad: 'media',
        tiempoEstimado: '1 mes',
        recursos: ['Contactos profesionales', 'LinkedIn', 'Centros de estudiantes']
      },
      {
        descripcion: 'Visitar universidades y ferias vocacionales',
        prioridad: 'media',
        tiempoEstimado: '3 meses',
        recursos: ['Calendario de ferias', 'Tours universitarios', 'Jornadas de puertas abiertas']
      }
    ];
  }
}

/**
 * MOTOR DE RECOMENDACIONES VOCACIONALES
 */
class MotorRecomendacionesVocacionales {
  private baseDatosCarreras: CarreraRecomendada[] = [];
  
  constructor() {
    this.inicializarBaseDatos();
  }
  
  generarRecomendaciones(estudiante: PerfilEstudiante): RecomendacionVocacional {
    const perfilAnalizado = new AnalizadorVocacional().analizarPerfilVocacional(estudiante);
    
    // Calcular compatibilidad para cada carrera
    const carrerasConCompatibilidad = this.baseDatosCarreras.map(carrera => {
      const compatibilidad = this.calcularCompatibilidad(estudiante, carrera);
      return { ...carrera, ...compatibilidad };
    });
    
    // Ordenar por compatibilidad
    carrerasConCompatibilidad.sort((a, b) => b.compatibilidadGlobal - a.compatibilidadGlobal);
    
    return {
      perfilAnalizado,
      recomendacionPrincipal: carrerasConCompatibilidad.slice(0, 5),
      opcionesAlternativas: carrerasConCompatibilidad.slice(5, 10),
      carrerasExploratorias: carrerasConCompatibilidad.slice(10, 15),
      analisisDetallado: this.generarAnalisisDetallado(estudiante),
      recomendacionesAccion: this.generarRecomendacionesAccion(estudiante)
    };
  }
  
  private calcularCompatibilidad(estudiante: PerfilEstudiante, carrera: CarreraRecomendada): any {
    // Algoritmo simplificado de compatibilidad
    const competenciasRequeridas = this.obtenerCompetenciasRequeridas(carrera.nombre);
    let compatibilidad = 60; // Base
    
    estudiante.competenciasTransversales.forEach(comp => {
      if (competenciasRequeridas.includes(comp.nombre)) {
        compatibilidad += comp.puntaje * 0.4;
      }
    });
    
    // Factores adicionales
    const puntajePromedio = this.calcularPuntajePromedio(estudiante);
    if (puntajePromedio >= carrera.puntajeCorte) {
      compatibilidad += 15;
    }
    
    return {
      compatibilidadGlobal: Math.min(100, Math.round(compatibilidad)),
      compatibilidadPorArea: {
        academica: Math.min(100, puntajePromedio / carrera.puntajeCorte * 100),
        competencias: 75,
        intereses: 80
      },
      fortalezasAlineadas: estudiante.competenciasTransversales
        .filter(c => competenciasRequeridas.includes(c.nombre))
        .map(c => c.nombre),
      areasDesarrollo: ['Preparación PSU', 'Exploración vocacional'],
      recomendacionPersonalizada: `Basado en tu perfil, esta carrera tiene ${Math.round(compatibilidad)}% de compatibilidad.`
    };
  }
  
  private obtenerCompetenciasRequeridas(carrera: string): string[] {
    const mapeo: Record<string, string[]> = {
      'Ingeniería Civil': ['Resolver Problemas', 'Modelar', 'Representar'],
      'Psicología': ['Interpretar-Relacionar', 'Análisis de Fuentes', 'Resolver Problemas'],
      'Historia': ['Pensamiento Temporal', 'Análisis de Fuentes', 'Interpretar-Relacionar'],
      'Medicina': ['Resolver Problemas', 'Análisis de Fuentes', 'Representar'],
      'Derecho': ['Análisis de Fuentes', 'Interpretar-Relacionar', 'Pensamiento Temporal']
    };
    
    return mapeo[carrera] || ['Resolver Problemas'];
  }
  
  private calcularPuntajePromedio(estudiante: PerfilEstudiante): number {
    const resultados = estudiante.resultadosPAES;
    return (
      resultados.competenciaLectora.puntaje +
      resultados.matematicaM1.puntaje +
      resultados.historyCS.puntaje +
      resultados.ciencias.puntaje
    ) / 4;
  }
  
  private generarAnalisisDetallado(estudiante: PerfilEstudiante): AnalisisDetallado {
    return {
      fortalezasTransversales: estudiante.competenciasTransversales
        .filter(c => c.nivel === 'alto' || c.nivel === 'sobresaliente')
        .map(c => c.nombre),
      patronesVocacionales: [{
        tipo: 'Perfil analítico',
        descripcion: 'Demuestra capacidades analíticas destacadas',
        implicaciones: ['Afinidad por carreras técnicas'],
        recomendaciones: ['Explorar ingeniería y ciencias']
      }],
      factoresDecision: [{
        factor: 'Competencias académicas',
        importancia: 9,
        estado: 'favorable',
        recomendaciones: ['Mantener rendimiento académico']
      }],
      riesgosConsideraciones: [{
        tipo: 'academico',
        descripcion: 'Requiere mantener nivel académico',
        impacto: 'medio',
        estrategiasMitigacion: ['Plan de estudio estructurado']
      }],
      recomendacionesDesarrollo: [{
        area: 'Exploración vocacional',
        objetivos: ['Conocer más carreras', 'Validar intereses'],
        actividades: ['Entrevistas', 'Visitas universitarias'],
        recursos: ['Orientador vocacional', 'Material informativo'],
        cronograma: '3 meses'
      }]
    };
  }
  
  private generarRecomendacionesAccion(estudiante: PerfilEstudiante): RecomendacionAccion[] {
    return [
      {
        accion: 'Profundizar conocimiento de carreras top 3',
        justificacion: 'Alta compatibilidad detectada',
        pasos: ['Investigar mallas curriculares', 'Hablar con estudiantes', 'Visitar facultades'],
        recursos: ['Sitios web universitarios', 'Redes sociales de estudiantes'],
        fechaLimite: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000) // 30 días
      }
    ];
  }
  
  private inicializarBaseDatos(): void {
    this.baseDatosCarreras = [
      {
        nombre: 'Ingeniería Civil',
        universidad: 'Universidad de Chile',
        codigoDemre: '15306',
        puntajeCorte: 720,
        compatibilidadGlobal: 0,
        compatibilidadPorArea: {},
        fortalezasAlineadas: [],
        areasDesarrollo: [],
        recomendacionPersonalizada: '',
        descripcionCarrera: 'Profesional que diseña y construye infraestructura',
        campoLaboral: ['Construcción', 'Consultoría', 'Sector público'],
        tipoInstitucion: 'universidad',
        modalidad: 'presencial',
        duracion: '6 años',
        gradoTitulo: 'Ingeniero Civil'
      },
      {
        nombre: 'Psicología',
        universidad: 'Pontificia Universidad Católica',
        codigoDemre: '14301',
        puntajeCorte: 680,
        compatibilidadGlobal: 0,
        compatibilidadPorArea: {},
        fortalezasAlineadas: [],
        areasDesarrollo: [],
        recomendacionPersonalizada: '',
        descripcionCarrera: 'Estudio del comportamiento y procesos mentales',
        campoLaboral: ['Clínica', 'Organizacional', 'Educacional'],
        tipoInstitucion: 'universidad',
        modalidad: 'presencial',
        duracion: '5 años',
        gradoTitulo: 'Psicólogo'
      },
      {
        nombre: 'Historia',
        universidad: 'Universidad de Chile',
        codigoDemre: '15403',
        puntajeCorte: 600,
        compatibilidadGlobal: 0,
        compatibilidadPorArea: {},
        fortalezasAlineadas: [],
        areasDesarrollo: [],
        recomendacionPersonalizada: '',
        descripcionCarrera: 'Estudio de los procesos históricos y sociales',
        campoLaboral: ['Educación', 'Investigación', 'Museos'],
        tipoInstitucion: 'universidad',
        modalidad: 'presencial',
        duracion: '5 años',
        gradoTitulo: 'Licenciado en Historia'
      }
    ];
  }
}

// Instancia singleton del agente
export const paesVocationalAgent = new PAESVocationalAgent();
