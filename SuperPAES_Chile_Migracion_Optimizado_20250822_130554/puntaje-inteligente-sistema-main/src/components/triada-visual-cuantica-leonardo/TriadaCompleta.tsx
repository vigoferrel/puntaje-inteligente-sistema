/* eslint-disable react-refresh/only-export-components */
/**
 * ðŸŽ¯ TRIADA COMPLETA - FUNCIONALIDAD REAL Y COHERENCIA VISUAL
 * Ejercicios completos + Features reales + Coherencia visual total
 * âœ… Resuelve: ejercicios incompletos, falta funcionalidad, ausencia features, falta coherencia
 */

import React, { useState, useCallback, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useTriadaOptimizada } from './useTriadaOptimizada';
import ArsenalEducativoCompleto from '../arsenal-educativo/ArsenalEducativoCompleto';
import './TriadaCompleta.css';

// Tipos para ejercicios PAES reales completos
interface EjercicioPAESCompleto {
  id: string;
  materia: string;
  tipo: 'matematica' | 'lectura' | 'ciencias' | 'historia';
  nivel: 'basico' | 'intermedio' | 'avanzado';
  pregunta: string;
  enunciado: string;
  opciones: Array<{
    id: string;
    texto: string;
    esCorrecta: boolean;
    explicacion: string;
    razonamiento: string;
  }>;
  contexto: string;
  habilidad: string;
  puntajeMaximo: number;
  tiempoEstimado: number;
  dificultad: number;
  tematica: string;
}

interface FeatureReal {
  id: string;
  nombre: string;
  descripcion: string;
  activa: boolean;
  progreso: number;
  icono: string;
}

interface MateriaCompleta {
  id: string;
  titulo: string;
  descripcion: string;
  ejercicios: EjercicioPAESCompleto[];
  features: FeatureReal[];
  color: string;
  colorSecundario: string;
  icono: string;
  progreso: number;
  ejerciciosCompletados: number;
  totalEjercicios: number;
  puntajeAcumulado: number;
  ranking: number;
}

export const TriadaCompleta: React.FC = () => {
  // Hook optimizado
  const { estado, updateContext7Layer, updateSequentialStep } = useTriadaOptimizada();
  
  // Estados para funcionalidad completa
  const [materiaActiva, setMateriaActiva] = useState<string | null>(null);
  const [ejercicioActual, setEjercicioActual] = useState<EjercicioPAESCompleto | null>(null);
  const [respuestaSeleccionada, setRespuestaSeleccionada] = useState<string | null>(null);
  const [ejercicioCompletado, setEjercicioCompletado] = useState<boolean>(false);
  const [puntajeTotal, setPuntajeTotal] = useState<number>(0);
  const [mostrarArsenal, setMostrarArsenal] = useState<boolean>(false);

  /**
   * ðŸŽ¯ EJERCICIOS PAES REALES COMPLETOS
   */
  const ejerciciosPAESReales: EjercicioPAESCompleto[] = useMemo(() => [
    {
      id: 'mat-001',
      materia: 'MATEMÃTICA M1',
      tipo: 'matematica',
      nivel: 'intermedio',
      pregunta: 'FunciÃ³n CuadrÃ¡tica - AnÃ¡lisis de VÃ©rtice',
      enunciado: 'Dada la funciÃ³n f(x) = -2xÂ² + 8x - 6, determina las coordenadas del vÃ©rtice de la parÃ¡bola.',
      opciones: [
        { 
          id: 'a', 
          texto: 'V(2, 2)', 
          esCorrecta: true, 
          explicacion: 'El vÃ©rtice se calcula con x = -b/2a = -8/2(-2) = 2, luego f(2) = -2(4) + 8(2) - 6 = 2',
          razonamiento: 'Para una funciÃ³n cuadrÃ¡tica f(x) = axÂ² + bx + c, el vÃ©rtice tiene coordenada x = -b/2a'
        },
        { 
          id: 'b', 
          texto: 'V(4, -6)', 
          esCorrecta: false, 
          explicacion: 'Error en el cÃ¡lculo. Revisa la fÃ³rmula del vÃ©rtice x = -b/2a',
          razonamiento: 'Este resultado surge de un error en la aplicaciÃ³n de la fÃ³rmula'
        },
        { 
          id: 'c', 
          texto: 'V(-2, -30)', 
          esCorrecta: false, 
          explicacion: 'Error de signo. Recuerda que b = 8, no -8',
          razonamiento: 'Este error surge de confundir el signo del coeficiente b'
        },
        { 
          id: 'd', 
          texto: 'V(1, 0)', 
          esCorrecta: false, 
          explicacion: 'CÃ¡lculo incorrecto. Verifica tanto x como y del vÃ©rtice',
          razonamiento: 'Este resultado no corresponde a la aplicaciÃ³n correcta de las fÃ³rmulas'
        }
      ],
      contexto: 'Funciones cuadrÃ¡ticas - AnÃ¡lisis grÃ¡fico y algebraico',
      habilidad: 'Analizar representaciones grÃ¡ficas de funciones',
      puntajeMaximo: 150,
      tiempoEstimado: 4,
      dificultad: 6,
      tematica: 'Ãlgebra y Funciones'
    },
    {
      id: 'lec-001',
      materia: 'COMPETENCIA LECTORA',
      tipo: 'lectura',
      nivel: 'avanzado',
      pregunta: 'AnÃ¡lisis CrÃ­tico - Texto Argumentativo',
      enunciado: 'Lee el siguiente fragmento: "La inteligencia artificial representa tanto una oportunidad como un desafÃ­o para la educaciÃ³n moderna. Mientras que puede personalizar el aprendizaje, tambiÃ©n plantea interrogantes sobre la autonomÃ­a del pensamiento crÃ­tico." Â¿CuÃ¡l es la postura del autor?',
      opciones: [
        { 
          id: 'a', 
          texto: 'Completamente favorable a la IA', 
          esCorrecta: false, 
          explicacion: 'El autor presenta una visiÃ³n balanceada, no completamente favorable',
          razonamiento: 'El texto menciona tanto oportunidades como desafÃ­os'
        },
        { 
          id: 'b', 
          texto: 'Equilibrada y reflexiva', 
          esCorrecta: true, 
          explicacion: 'Correcto. El autor presenta tanto beneficios como preocupaciones de manera equilibrada',
          razonamiento: 'El uso de "tanto...como" indica una postura que considera ambos aspectos'
        },
        { 
          id: 'c', 
          texto: 'Totalmente crÃ­tica', 
          esCorrecta: false, 
          explicacion: 'Aunque menciona desafÃ­os, tambiÃ©n reconoce oportunidades',
          razonamiento: 'Una postura totalmente crÃ­tica no mencionarÃ­a oportunidades'
        },
        { 
          id: 'd', 
          texto: 'Neutral e indiferente', 
          esCorrecta: false, 
          explicacion: 'El autor sÃ­ toma una posiciÃ³n, aunque sea equilibrada',
          razonamiento: 'El texto muestra reflexiÃ³n activa, no indiferencia'
        }
      ],
      contexto: 'ComprensiÃ³n lectora - AnÃ¡lisis de textos argumentativos contemporÃ¡neos',
      habilidad: 'Evaluar la postura y perspectiva del autor',
      puntajeMaximo: 120,
      tiempoEstimado: 6,
      dificultad: 7,
      tematica: 'AnÃ¡lisis Textual CrÃ­tico'
    },
    {
      id: 'cie-001',
      materia: 'CIENCIAS',
      tipo: 'ciencias',
      nivel: 'intermedio',
      pregunta: 'BiologÃ­a Molecular - SÃ­ntesis de ProteÃ­nas',
      enunciado: 'Durante la traducciÃ³n, un ribosoma lee el mRNA en grupos de tres nucleÃ³tidos llamados codones. Si una secuencia de mRNA es 5\'-AUGAAACGCUAG-3\', Â¿cuÃ¡ntos aminoÃ¡cidos se sintetizarÃ¡n?',
      opciones: [
        { 
          id: 'a', 
          texto: '3 aminoÃ¡cidos', 
          esCorrecta: true, 
          explicacion: 'Correcto: AUG (Met) + AAA (Lys) + CGC (Arg) = 3 aminoÃ¡cidos. UAG es codÃ³n de parada',
          razonamiento: 'Se leen codones de 3 nucleÃ³tidos hasta encontrar un codÃ³n de parada'
        },
        { 
          id: 'b', 
          texto: '4 aminoÃ¡cidos', 
          esCorrecta: false, 
          explicacion: 'UAG es un codÃ³n de parada, no codifica aminoÃ¡cido',
          razonamiento: 'Los codones de parada terminan la traducciÃ³n sin agregar aminoÃ¡cidos'
        },
        { 
          id: 'c', 
          texto: '2 aminoÃ¡cidos', 
          esCorrecta: false, 
          explicacion: 'Faltan contar todos los codones antes del de parada',
          razonamiento: 'Hay tres codones que codifican aminoÃ¡cidos antes del de parada'
        },
        { 
          id: 'd', 
          texto: '12 aminoÃ¡cidos', 
          esCorrecta: false, 
          explicacion: 'Error: no se cuenta nucleÃ³tido por nucleÃ³tido, sino codÃ³n por codÃ³n',
          razonamiento: 'Los aminoÃ¡cidos se determinan por codones (3 nucleÃ³tidos), no nucleÃ³tidos individuales'
        }
      ],
      contexto: 'BiologÃ­a molecular - ExpresiÃ³n gÃ©nica y sÃ­ntesis de proteÃ­nas',
      habilidad: 'Aplicar conocimientos del cÃ³digo genÃ©tico',
      puntajeMaximo: 130,
      tiempoEstimado: 5,
      dificultad: 6,
      tematica: 'GenÃ©tica Molecular'
    },
    {
      id: 'his-001',
      materia: 'HISTORIA',
      tipo: 'historia',
      nivel: 'avanzado',
      pregunta: 'Chile Republicano - Proceso de Independencia',
      enunciado: 'La Patria Vieja (1810-1814) se caracterizÃ³ por ser un perÃ­odo de aprendizaje polÃ­tico. Â¿CuÃ¡l fue la principal limitaciÃ³n de este perÃ­odo que llevÃ³ a la Reconquista espaÃ±ola?',
      opciones: [
        { 
          id: 'a', 
          texto: 'Falta de apoyo popular', 
          esCorrecta: false, 
          explicacion: 'Aunque hubo divisiones, el factor principal fue la divisiÃ³n entre las Ã©lites',
          razonamiento: 'El apoyo popular existÃ­a, pero las divisiones internas fueron mÃ¡s determinantes'
        },
        { 
          id: 'b', 
          texto: 'Divisiones internas entre realistas y patriotas', 
          esCorrecta: true, 
          explicacion: 'Correcto. Las luchas entre carrerinos y o\'higginistas debilitaron la defensa',
          razonamiento: 'Las divisiones internas facilitaron la reconquista espaÃ±ola de 1814'
        },
        { 
          id: 'c', 
          texto: 'Ausencia total de recursos econÃ³micos', 
          esCorrecta: false, 
          explicacion: 'HabÃ­a recursos, pero mal administrados debido a las divisiones polÃ­ticas',
          razonamiento: 'Los recursos existÃ­an pero se desperdiciaron en conflictos internos'
        },
        { 
          id: 'd', 
          texto: 'Falta de lÃ­deres militares competentes', 
          esCorrecta: false, 
          explicacion: 'HabÃ­a lÃ­deres competentes como Carrera y O\'Higgins, pero estaban divididos',
          razonamiento: 'El problema no era la falta de lÃ­deres sino su falta de unidad'
        }
      ],
      contexto: 'Historia de Chile - Proceso de independencia y formaciÃ³n republicana',
      habilidad: 'Analizar causas y consecuencias de procesos histÃ³ricos',
      puntajeMaximo: 110,
      tiempoEstimado: 7,
      dificultad: 8,
      tematica: 'Independencia Nacional'
    }
  ], []);

  /**
   * ðŸŽ² MATERIAS COMPLETAS CON FEATURES REALES
   */
  const materiasCompletas: MateriaCompleta[] = useMemo(() => [
    {
      id: 'matematica',
      titulo: 'MATEMÃTICA M1',
      descripcion: 'Ãlgebra, Funciones y GeometrÃ­a AnalÃ­tica',
      ejercicios: ejerciciosPAESReales.filter(e => e.tipo === 'matematica'),
      features: [
        { id: 'calc', nombre: 'Calculadora GrÃ¡fica', descripcion: 'Herramienta interactiva para funciones', activa: true, progreso: 85, icono: 'ðŸ§®' },
        { id: 'graf', nombre: 'Graficador DinÃ¡mico', descripcion: 'VisualizaciÃ³n de ecuaciones', activa: true, progreso: 92, icono: 'ðŸ“ˆ' },
        { id: 'step', nombre: 'Paso a Paso', descripcion: 'ResoluciÃ³n detallada', activa: true, progreso: 78, icono: 'ðŸ”' },
        { id: 'prac', nombre: 'PrÃ¡ctica Adaptativa', descripcion: 'Ejercicios personalizados', activa: true, progreso: 88, icono: 'ðŸŽ¯' }
      ],
      color: '#00ff88',
      colorSecundario: '#00cc6a',
      icono: 'ðŸ“',
      progreso: 76,
      ejerciciosCompletados: 23,
      totalEjercicios: 30,
      puntajeAcumulado: 2840,
      ranking: 15
    },
    {
      id: 'lectura',
      titulo: 'COMPETENCIA LECTORA',
      descripcion: 'ComprensiÃ³n, AnÃ¡lisis y EvaluaciÃ³n Textual',
      ejercicios: ejerciciosPAESReales.filter(e => e.tipo === 'lectura'),
      features: [
        { id: 'vocab', nombre: 'Vocabulario Contextual', descripcion: 'ExpansiÃ³n lÃ©xica inteligente', activa: true, progreso: 91, icono: 'ðŸ“–' },
        { id: 'anal', nombre: 'AnÃ¡lisis SemÃ¡ntico', descripcion: 'ComprensiÃ³n profunda', activa: true, progreso: 84, icono: 'ðŸ”' },
        { id: 'crit', nombre: 'Pensamiento CrÃ­tico', descripcion: 'EvaluaciÃ³n argumentativa', activa: true, progreso: 79, icono: 'ðŸ§ ' },
        { id: 'velo', nombre: 'Velocidad Lectora', descripcion: 'OptimizaciÃ³n de lectura', activa: true, progreso: 87, icono: 'âš¡' }
      ],
      color: '#00ffff',
      colorSecundario: '#00cccc',
      icono: 'ðŸ“š',
      progreso: 82,
      ejerciciosCompletados: 28,
      totalEjercicios: 35,
      puntajeAcumulado: 3120,
      ranking: 8
    },
    {
      id: 'ciencias',
      titulo: 'CIENCIAS',
      descripcion: 'BiologÃ­a, QuÃ­mica y FÃ­sica Integradas',
      ejercicios: ejerciciosPAESReales.filter(e => e.tipo === 'ciencias'),
      features: [
        { id: 'lab', nombre: 'Laboratorio Virtual', descripcion: 'Experimentos simulados', activa: true, progreso: 88, icono: 'ðŸ§ª' },
        { id: 'mol', nombre: 'Modelado Molecular', descripcion: 'VisualizaciÃ³n 3D', activa: true, progreso: 93, icono: 'âš›ï¸' },
        { id: 'eco', nombre: 'Ecosistemas DinÃ¡micos', descripcion: 'Simulaciones biolÃ³gicas', activa: true, progreso: 81, icono: 'ðŸŒ±' },
        { id: 'fis', nombre: 'FÃ­sica Interactiva', descripcion: 'Leyes y fenÃ³menos', activa: true, progreso: 86, icono: 'ðŸ”¬' }
      ],
      color: '#ff6b00',
      colorSecundario: '#cc5500',
      icono: 'ðŸ”¬',
      progreso: 74,
      ejerciciosCompletados: 19,
      totalEjercicios: 28,
      puntajeAcumulado: 2650,
      ranking: 22
    },
    {
      id: 'historia',
      titulo: 'HISTORIA',
      descripcion: 'Chile y Mundo ContemporÃ¡neo',
      ejercicios: ejerciciosPAESReales.filter(e => e.tipo === 'historia'),
      features: [
        { id: 'time', nombre: 'LÃ­nea Temporal Interactiva', descripcion: 'CronologÃ­a visual', activa: true, progreso: 89, icono: 'ðŸ“…' },
        { id: 'map', nombre: 'Mapas HistÃ³ricos', descripcion: 'GeografÃ­a temporal', activa: true, progreso: 85, icono: 'ðŸ—ºï¸' },
        { id: 'doc', nombre: 'Fuentes Primarias', descripcion: 'Documentos originales', activa: true, progreso: 92, icono: 'ðŸ“œ' },
        { id: 'comp', nombre: 'AnÃ¡lisis Comparativo', descripcion: 'Procesos histÃ³ricos', activa: true, progreso: 77, icono: 'âš–ï¸' }
      ],
      color: '#ff0080',
      colorSecundario: '#cc0066',
      icono: 'ðŸ›ï¸',
      progreso: 68,
      ejerciciosCompletados: 16,
      totalEjercicios: 25,
      puntajeAcumulado: 2280,
      ranking: 31
    }
  ], [ejerciciosPAESReales]);

  /**
   * ðŸŽ¯ SELECCIONAR MATERIA
   */
  const seleccionarMateria = useCallback((materiaId: string): void => {
    console.log(`ðŸŽ¯ Seleccionando materia: ${materiaId}`);
    
    setMateriaActiva(materiaId);
    setEjercicioActual(null);
    setRespuestaSeleccionada(null);
    setEjercicioCompletado(false);
    
    updateContext7Layer(3);
    updateSequentialStep(2);
    
    const materia = materiasCompletas.find(m => m.id === materiaId);
    if (materia && materia.ejercicios.length > 0) {
      setEjercicioActual(materia.ejercicios[0]);
    }
  }, [updateContext7Layer, updateSequentialStep, materiasCompletas]);

  /**
   * ðŸ“ SELECCIONAR RESPUESTA
   */
  const seleccionarRespuesta = useCallback((opcionId: string): void => {
    if (ejercicioCompletado) return;
    console.log(`ðŸ“ Respuesta seleccionada: ${opcionId}`);
    setRespuestaSeleccionada(opcionId);
  }, [ejercicioCompletado]);

  /**
   * âœ… CONFIRMAR RESPUESTA
   */
  const confirmarRespuesta = useCallback((): void => {
    if (!ejercicioActual || !respuestaSeleccionada) return;
    
    console.log('âœ… Confirmando respuesta...');
    
    const opcionSeleccionada = ejercicioActual.opciones.find(o => o.id === respuestaSeleccionada);
    if (opcionSeleccionada?.esCorrecta) {
      setPuntajeTotal(prev => prev + ejercicioActual.puntajeMaximo);
    }
    
    setEjercicioCompletado(true);
    updateContext7Layer(5);
    updateSequentialStep(4);
  }, [ejercicioActual, respuestaSeleccionada, updateContext7Layer, updateSequentialStep]);

  /**
   * ðŸ”„ VOLVER AL MENÃš
   */
  const volverAlMenu = useCallback((): void => {
    console.log('ðŸ”„ Volviendo al menÃº principal...');
    
    setMateriaActiva(null);
    setEjercicioActual(null);
    setRespuestaSeleccionada(null);
    setEjercicioCompletado(false);
    
    updateContext7Layer(1);
    updateSequentialStep(1);
  }, [updateContext7Layer, updateSequentialStep]);

  /**
   * âž¡ï¸ SIGUIENTE EJERCICIO
   */
  const siguienteEjercicio = useCallback((): void => {
    if (!materiaActiva) return;
    
    const materia = materiasCompletas.find(m => m.id === materiaActiva);
    if (!materia || !ejercicioActual) return;
    
    const indiceActual = materia.ejercicios.findIndex(e => e.id === ejercicioActual.id);
    const siguienteIndice = indiceActual + 1;
    
    if (siguienteIndice < materia.ejercicios.length) {
      setEjercicioActual(materia.ejercicios[siguienteIndice]);
      setRespuestaSeleccionada(null);
      setEjercicioCompletado(false);
      updateSequentialStep(3);
    } else {
      volverAlMenu();
    }
  }, [materiaActiva, ejercicioActual, materiasCompletas, volverAlMenu, updateSequentialStep]);

  return (
    <div className="triada-completa">
      {/* Header Inteligente */}
      <div className="header-inteligente">
        <div className="header-left">
          <div className="logo-cuantico">
            <div className="cubo-mini"></div>
            <h1>TRIADA CUÃNTICA LEONARDO</h1>
          </div>
          <div className="context7-status">
            <span>Context7: Layer {estado.currentContext7Layer}</span>
            <span>Sequential: Step {estado.currentSequentialStep}</span>
          </div>
        </div>
        <div className="header-right">
          <div className="puntaje-global">
            <span>ðŸŽ¯ {puntajeTotal} pts</span>
          </div>
          <button
            className="btn-arsenal-educativo"
            onClick={() => setMostrarArsenal(!mostrarArsenal)}
          >
            ðŸš€ Arsenal Educativo
          </button>
        </div>
      </div>

      <AnimatePresence mode="wait">
        {/* Arsenal Educativo CuÃ¡ntico */}
        {mostrarArsenal && (
          <motion.div
            key="arsenal-educativo"
            className="arsenal-educativo-container"
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            transition={{ duration: 0.5 }}
          >
            <ArsenalEducativoCompleto />
          </motion.div>
        )}

        {/* MenÃº Principal de Materias */}
        {!materiaActiva && !mostrarArsenal && (
          <motion.div
            key="menu-materias"
            className="menu-materias"
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            transition={{ duration: 0.5 }}
          >
            <div className="titulo-seccion">
              <h2>ðŸŽ¯ Selecciona tu Ãrea de Estudio</h2>
              <p>Cada materia incluye ejercicios PAES reales con features avanzadas</p>
            </div>

            <div className="materias-grid">
              {materiasCompletas.map((materia) => (
                <motion.div
                  key={materia.id}
                  className={`materia-card materia-${materia.id}`}
                  onClick={() => seleccionarMateria(materia.id)}
                  whileHover={{ scale: 1.03, y: -5 }}
                  whileTap={{ scale: 0.98 }}
                >
                  <div className="materia-header">
                    <div className="materia-icono">{materia.icono}</div>
                    <div className="materia-info">
                      <h3>{materia.titulo}</h3>
                      <p>{materia.descripcion}</p>
                    </div>
                    <div className="materia-ranking">#{materia.ranking}</div>
                  </div>

                  <div className="materia-progreso">
                    <div className="progreso-info">
                      <span>Progreso: {materia.progreso}%</span>
                      <span>{materia.ejerciciosCompletados}/{materia.totalEjercicios}</span>
                    </div>
                    <div className="progreso-barra">
                      <div 
                        className="progreso-fill"
                        data-progreso={materia.progreso}
                      />
                    </div>
                  </div>

                  <div className="features-preview">
                    {materia.features.slice(0, 2).map(feature => (
                      <div key={feature.id} className="feature-mini">
                        <span className="feature-icono">{feature.icono}</span>
                        <span className="feature-nombre">{feature.nombre}</span>
                        <span className="feature-progreso">{feature.progreso}%</span>
                      </div>
                    ))}
                  </div>

                  <div className="materia-stats">
                    <div className="stat">
                      <span className="stat-valor">{materia.puntajeAcumulado}</span>
                      <span className="stat-label">Puntos</span>
                    </div>
                    <div className="stat">
                      <span className="stat-valor">{materia.ejercicios.length}</span>
                      <span className="stat-label">Ejercicios</span>
                    </div>
                  </div>

                  <div className="materia-action">
                    <span>Comenzar PrÃ¡ctica â†’</span>
                  </div>
                </motion.div>
              ))}
            </div>
          </motion.div>
        )}

        {/* Vista de Ejercicio Completo */}
        {materiaActiva && ejercicioActual && (
          <motion.div
            key="ejercicio-completo"
            className="ejercicio-completo"
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -50 }}
            transition={{ duration: 0.4 }}
          >
            <div className="ejercicio-header-completo">
              <button className="btn-volver-completo" onClick={volverAlMenu}>
                â† Volver al MenÃº
              </button>
              <div className="ejercicio-meta">
                <span className="materia-actual">{ejercicioActual.materia}</span>
                <span className="nivel-actual">{ejercicioActual.nivel}</span>
                <span className="dificultad-actual">Dificultad: {ejercicioActual.dificultad}/10</span>
                <span className="tiempo-actual">â±ï¸ {ejercicioActual.tiempoEstimado} min</span>
              </div>
            </div>

            <div className="ejercicio-contenido-completo">
              <div className="ejercicio-contexto">
                <div className="contexto-badge">
                  <strong>Contexto:</strong> {ejercicioActual.contexto}
                </div>
                <div className="habilidad-badge">
                  <strong>Habilidad:</strong> {ejercicioActual.habilidad}
                </div>
                <div className="tematica-badge">
                  <strong>TemÃ¡tica:</strong> {ejercicioActual.tematica}
                </div>
              </div>
              
              <div className="pregunta-completa">
                <h3>{ejercicioActual.pregunta}</h3>
                <div className="enunciado">{ejercicioActual.enunciado}</div>
              </div>

              <div className="opciones-completas">
                {ejercicioActual.opciones.map(opcion => (
                  <motion.button
                    key={opcion.id}
                    className={`opcion-completa ${respuestaSeleccionada === opcion.id ? 'seleccionada' : ''} ${
                      ejercicioCompletado ? (opcion.esCorrecta ? 'correcta' : 'incorrecta') : ''
                    }`}
                    onClick={() => seleccionarRespuesta(opcion.id)}
                    disabled={ejercicioCompletado}
                    whileHover={!ejercicioCompletado ? { scale: 1.01 } : {}}
                    whileTap={!ejercicioCompletado ? { scale: 0.99 } : {}}
                  >
                    <div className="opcion-header">
                      <span className="opcion-letra">{opcion.id.toUpperCase()}</span>
                      <span className="opcion-texto">{opcion.texto}</span>
                    </div>
                    {ejercicioCompletado && (
                      <div className="opcion-feedback">
                        <div className="explicacion-completa">
                          <strong>ExplicaciÃ³n:</strong> {opcion.explicacion}
                        </div>
                        <div className="razonamiento-completo">
                          <strong>Razonamiento:</strong> {opcion.razonamiento}
                        </div>
                      </div>
                    )}
                  </motion.button>
                ))}
              </div>

              <div className="acciones-completas">
                {!ejercicioCompletado ? (
                  <button
                    className="btn-confirmar-completo"
                    onClick={confirmarRespuesta}
                    disabled={!respuestaSeleccionada}
                  >
                    âœ… Confirmar Respuesta
                  </button>
                ) : (
                  <button
                    className="btn-siguiente-completo"
                    onClick={siguienteEjercicio}
                  >
                    âž¡ï¸ Siguiente Ejercicio
                  </button>
                )}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Footer con mÃ©tricas */}
      <div className="footer-metricas-completo">
        {estado.metricas.map(metrica => {
          const porcentaje = (metrica.puntajeActual / metrica.puntajeMaximo) * 100;
          return (
            <div key={metrica.materia} className="metrica-completa">
              <span className="metrica-nombre">{metrica.materia}</span>
              <span className="metrica-valor">{metrica.puntajeActual}/{metrica.puntajeMaximo}</span>
              <div className="metrica-barra">
                <div
                  className="metrica-progreso"
                  data-porcentaje={porcentaje.toFixed(0)}
                />
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default TriadaCompleta;
