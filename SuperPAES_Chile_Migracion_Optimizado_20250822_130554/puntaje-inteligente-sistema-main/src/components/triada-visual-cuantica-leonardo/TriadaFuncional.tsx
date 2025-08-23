/* eslint-disable react-refresh/only-export-components */
/**
 * ðŸŽ¯ TRIADA FUNCIONAL - CARAS SEPARADAS Y ACCESO DIRECTO
 * Cada cara independiente + Sin animaciÃ³n compleja + Acceso fÃ¡cil a features
 * âœ… Sin estilos inline - Todo en CSS externo
 * âœ… Enfoque en funcionalidad real
 */

import React, { useState, useCallback, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useTriadaOptimizada } from './useTriadaOptimizada';
import './TriadaFuncional.css';

// Tipos para ejercicios contextuales reales
interface EjercicioContextual {
  id: string;
  materia: string;
  tipo: 'matematica' | 'lectura' | 'ciencias' | 'historia';
  nivel: 'basico' | 'intermedio' | 'avanzado';
  pregunta: string;
  opciones: Array<{
    id: string;
    texto: string;
    esCorrecta: boolean;
    explicacion: string;
  }>;
  contexto: string;
  puntajeMaximo: number;
  tiempoEstimado: number;
}

interface CaraIndependiente {
  id: string;
  titulo: string;
  descripcion: string;
  ejercicios: EjercicioContextual[];
  color: string;
  icono: string;
  features: string[];
}

export const TriadaFuncional: React.FC = () => {
  // Hook optimizado
  const { estado, updateContext7Layer, updateSequentialStep } = useTriadaOptimizada();
  
  // Estados simplificados para caras separadas
  const [caraActiva, setCaraActiva] = useState<string | null>(null);
  const [ejercicioActual, setEjercicioActual] = useState<EjercicioContextual | null>(null);
  const [respuestaSeleccionada, setRespuestaSeleccionada] = useState<string | null>(null);
  const [ejercicioCompletado, setEjercicioCompletado] = useState<boolean>(false);
  const [puntajeAcumulado, setPuntajeAcumulado] = useState<number>(0);

  /**
   * ðŸŽ¯ EJERCICIOS CONTEXTUALES REALES - OPTIMIZADO CON useMemo
   */
  const ejerciciosReales: EjercicioContextual[] = useMemo(() => [
    {
      id: 'mat1-001',
      materia: 'MATEMÃTICA 1',
      tipo: 'matematica',
      nivel: 'intermedio',
      pregunta: 'Si f(x) = 2x + 3, Â¿cuÃ¡l es el valor de f(5)?',
      opciones: [
        { id: 'a', texto: '13', esCorrecta: true, explicacion: 'f(5) = 2(5) + 3 = 10 + 3 = 13' },
        { id: 'b', texto: '11', esCorrecta: false, explicacion: 'Revisa la operaciÃ³n: 2Ã—5 = 10, no 8' },
        { id: 'c', texto: '8', esCorrecta: false, explicacion: 'No olvides sumar 3 al resultado' },
        { id: 'd', texto: '15', esCorrecta: false, explicacion: 'Revisa el cÃ¡lculo: 2Ã—5 + 3 â‰  15' }
      ],
      contexto: 'Funciones lineales - Base para cÃ¡lculo diferencial',
      puntajeMaximo: 120,
      tiempoEstimado: 3
    },
    {
      id: 'lec-001',
      materia: 'COMPETENCIA LECTORA',
      tipo: 'lectura',
      nivel: 'avanzado',
      pregunta: 'En el texto "La revoluciÃ³n digital ha transformado...", Â¿cuÃ¡l es la idea principal?',
      opciones: [
        { id: 'a', texto: 'La tecnologÃ­a es peligrosa', esCorrecta: false, explicacion: 'Esta no es la idea central del texto' },
        { id: 'b', texto: 'Los cambios sociales por la tecnologÃ­a', esCorrecta: true, explicacion: 'Correcto: el texto analiza transformaciones sociales' },
        { id: 'c', texto: 'La historia de internet', esCorrecta: false, explicacion: 'El texto no se enfoca en historia especÃ­fica' },
        { id: 'd', texto: 'Problemas econÃ³micos actuales', esCorrecta: false, explicacion: 'No es el tema principal abordado' }
      ],
      contexto: 'ComprensiÃ³n lectora - AnÃ¡lisis de textos argumentativos',
      puntajeMaximo: 100,
      tiempoEstimado: 5
    },
    {
      id: 'cie-001',
      materia: 'CIENCIAS',
      tipo: 'ciencias',
      nivel: 'intermedio',
      pregunta: 'Â¿QuÃ© proceso permite a las plantas convertir COâ‚‚ en glucosa?',
      opciones: [
        { id: 'a', texto: 'RespiraciÃ³n celular', esCorrecta: false, explicacion: 'La respiraciÃ³n consume glucosa, no la produce' },
        { id: 'b', texto: 'FotosÃ­ntesis', esCorrecta: true, explicacion: 'Correcto: 6COâ‚‚ + 6Hâ‚‚O + luz â†’ Câ‚†Hâ‚â‚‚Oâ‚† + 6Oâ‚‚' },
        { id: 'c', texto: 'FermentaciÃ³n', esCorrecta: false, explicacion: 'La fermentaciÃ³n no involucra COâ‚‚ como reactivo principal' },
        { id: 'd', texto: 'DigestiÃ³n', esCorrecta: false, explicacion: 'Las plantas no digieren, realizan fotosÃ­ntesis' }
      ],
      contexto: 'BiologÃ­a - Procesos metabÃ³licos fundamentales',
      puntajeMaximo: 90,
      tiempoEstimado: 4
    },
    {
      id: 'his-001',
      materia: 'HISTORIA',
      tipo: 'historia',
      nivel: 'avanzado',
      pregunta: 'Â¿QuÃ© factor fue determinante en la independencia de Chile?',
      opciones: [
        { id: 'a', texto: 'Solo la influencia francesa', esCorrecta: false, explicacion: 'Fue un factor, pero no el Ãºnico determinante' },
        { id: 'b', texto: 'La crisis de la monarquÃ­a espaÃ±ola', esCorrecta: true, explicacion: 'La invasiÃ³n napoleÃ³nica creÃ³ el vacÃ­o de poder necesario' },
        { id: 'c', texto: 'Ãšnicamente el liderazgo criollo', esCorrecta: false, explicacion: 'El liderazgo fue importante pero no suficiente por sÃ­ solo' },
        { id: 'd', texto: 'La ayuda militar extranjera', esCorrecta: false, explicacion: 'Fue relevante pero no el factor inicial determinante' }
      ],
      contexto: 'Historia de Chile - Procesos de independencia americana',
      puntajeMaximo: 80,
      tiempoEstimado: 6
    }
  ], []);

  /**
   * ðŸŽ² CARAS INDEPENDIENTES - SEPARADAS Y ACCESIBLES
   */
  const carasIndependientes: CaraIndependiente[] = useMemo(() => [
    {
      id: 'matematica',
      titulo: 'MATEMÃTICA',
      descripcion: 'Ãlgebra, Funciones y CÃ¡lculo',
      ejercicios: ejerciciosReales.filter(e => e.tipo === 'matematica'),
      color: '#00ff88',
      icono: 'ðŸ“',
      features: ['Funciones Lineales', 'Ecuaciones', 'GeometrÃ­a', 'EstadÃ­stica']
    },
    {
      id: 'lectura',
      titulo: 'LECTURA',
      descripcion: 'ComprensiÃ³n y AnÃ¡lisis Textual',
      ejercicios: ejerciciosReales.filter(e => e.tipo === 'lectura'),
      color: '#00ffff',
      icono: 'ðŸ“š',
      features: ['ComprensiÃ³n Lectora', 'AnÃ¡lisis Textual', 'Vocabulario', 'ArgumentaciÃ³n']
    },
    {
      id: 'ciencias',
      titulo: 'CIENCIAS',
      descripcion: 'BiologÃ­a, QuÃ­mica y FÃ­sica',
      ejercicios: ejerciciosReales.filter(e => e.tipo === 'ciencias'),
      color: '#ff6b00',
      icono: 'ðŸ”¬',
      features: ['BiologÃ­a', 'QuÃ­mica', 'FÃ­sica', 'MÃ©todo CientÃ­fico']
    },
    {
      id: 'historia',
      titulo: 'HISTORIA',
      descripcion: 'Chile y Mundo ContemporÃ¡neo',
      ejercicios: ejerciciosReales.filter(e => e.tipo === 'historia'),
      color: '#ff0080',
      icono: 'ðŸ›ï¸',
      features: ['Historia de Chile', 'Mundo ContemporÃ¡neo', 'Procesos Sociales', 'AnÃ¡lisis HistÃ³rico']
    },
    {
      id: 'simulacro',
      titulo: 'SIMULACRO',
      descripcion: 'Examen Completo PAES',
      ejercicios: ejerciciosReales,
      color: '#8000ff',
      icono: 'ðŸŽ¯',
      features: ['Examen Completo', 'Tiempo Real', 'Ranking', 'AnÃ¡lisis Detallado']
    },
    {
      id: 'resultados',
      titulo: 'RESULTADOS',
      descripcion: 'AnÃ¡lisis y Progreso',
      ejercicios: [],
      color: '#ffd700',
      icono: 'ðŸ“Š',
      features: ['Progreso Personal', 'EstadÃ­sticas', 'Recomendaciones', 'Metas']
    }
  ], [ejerciciosReales]);

  /**
   * ðŸŽ¯ SELECCIONAR CARA INDEPENDIENTE
   */
  const seleccionarCara = useCallback((caraId: string): void => {
    console.log(`ðŸŽ¯ Seleccionando cara: ${caraId}`);
    
    setCaraActiva(caraId);
    setEjercicioActual(null);
    setRespuestaSeleccionada(null);
    setEjercicioCompletado(false);
    
    // Actualizar Context7 y Sequential
    updateContext7Layer(3); // GeometrÃ­a
    updateSequentialStep(2); // Activa
    
    // Si la cara tiene ejercicios, seleccionar el primero
    const cara = carasIndependientes.find(c => c.id === caraId);
    if (cara && cara.ejercicios.length > 0) {
      setEjercicioActual(cara.ejercicios[0]);
    }
  }, [updateContext7Layer, updateSequentialStep, carasIndependientes]);

  /**
   * ðŸ“ SELECCIONAR RESPUESTA
   */
  const seleccionarRespuesta = useCallback((opcionId: string): void => {
    console.log(`ðŸ“ Respuesta seleccionada: ${opcionId}`);
    setRespuestaSeleccionada(opcionId);
  }, []);

  /**
   * âœ… CONFIRMAR RESPUESTA
   */
  const confirmarRespuesta = useCallback((): void => {
    if (!ejercicioActual || !respuestaSeleccionada) return;
    
    console.log('âœ… Confirmando respuesta...');
    
    const opcionSeleccionada = ejercicioActual.opciones.find(o => o.id === respuestaSeleccionada);
    if (opcionSeleccionada?.esCorrecta) {
      setPuntajeAcumulado(prev => prev + ejercicioActual.puntajeMaximo);
    }
    
    setEjercicioCompletado(true);
    updateContext7Layer(5); // Flujo
    updateSequentialStep(4); // Evoluciona
  }, [ejercicioActual, respuestaSeleccionada, updateContext7Layer, updateSequentialStep]);

  /**
   * ðŸ”„ VOLVER AL MENÃš PRINCIPAL
   */
  const volverAlMenu = useCallback((): void => {
    console.log('ðŸ”„ Volviendo al menÃº principal...');
    
    setCaraActiva(null);
    setEjercicioActual(null);
    setRespuestaSeleccionada(null);
    setEjercicioCompletado(false);
    
    updateContext7Layer(1); // Superficie
    updateSequentialStep(1); // Emerge
  }, [updateContext7Layer, updateSequentialStep]);

  /**
   * âž¡ï¸ SIGUIENTE EJERCICIO
   */
  const siguienteEjercicio = useCallback((): void => {
    if (!caraActiva) return;
    
    const cara = carasIndependientes.find(c => c.id === caraActiva);
    if (!cara || !ejercicioActual) return;
    
    const indiceActual = cara.ejercicios.findIndex(e => e.id === ejercicioActual.id);
    const siguienteIndice = indiceActual + 1;
    
    if (siguienteIndice < cara.ejercicios.length) {
      setEjercicioActual(cara.ejercicios[siguienteIndice]);
      setRespuestaSeleccionada(null);
      setEjercicioCompletado(false);
      updateSequentialStep(3); // Ejecuta
    } else {
      // No hay mÃ¡s ejercicios, volver al menÃº
      volverAlMenu();
    }
  }, [caraActiva, ejercicioActual, carasIndependientes, volverAlMenu, updateSequentialStep]);

  return (
    <div className="triada-funcional">
      {/* Header con informaciÃ³n contextual */}
      <div className="header-contextual">
        <div className="context7-info">
          <span>Context7: Layer {estado.currentContext7Layer}</span>
          <span>Sequential: Step {estado.currentSequentialStep}</span>
        </div>
        <div className="puntaje-acumulado">
          <span>ðŸŽ¯ Puntaje: {puntajeAcumulado}</span>
        </div>
      </div>

      <AnimatePresence mode="wait">
        {/* Vista del MenÃº Principal - Caras Separadas */}
        {!caraActiva && (
          <motion.div
            key="menu-principal"
            className="menu-principal"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.9 }}
            transition={{ duration: 0.4 }}
          >
            <div className="titulo-principal">
              <h1>ðŸŽ¯ TRIADA CUÃNTICA LEONARDO</h1>
              <p>Selecciona una materia para comenzar tu entrenamiento PAES</p>
            </div>

            <div className="caras-grid">
              {carasIndependientes.map((cara) => (
                <motion.div
                  key={cara.id}
                  className={`cara-independiente cara-${cara.id}`}
                  onClick={() => seleccionarCara(cara.id)}
                  whileHover={{ scale: 1.05, y: -5 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <div className="cara-header">
                    <div className="cara-icono">{cara.icono}</div>
                    <h3 className="cara-titulo">{cara.titulo}</h3>
                  </div>
                  
                  <p className="cara-descripcion">{cara.descripcion}</p>
                  
                  <div className="cara-stats">
                    <span className="ejercicios-count">
                      {cara.ejercicios.length} ejercicios
                    </span>
                  </div>

                  <div className="features-list">
                    {cara.features.map((feature, index) => (
                      <span key={index} className="feature-tag">
                        {feature}
                      </span>
                    ))}
                  </div>

                  <div className="cara-action">
                    <span>Comenzar â†’</span>
                  </div>
                </motion.div>
              ))}
            </div>
          </motion.div>
        )}

        {/* Vista de Ejercicio Activo */}
        {caraActiva && ejercicioActual && (
          <motion.div
            key="ejercicio"
            className="ejercicio-activo"
            initial={{ opacity: 0, x: 100 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -100 }}
            transition={{ duration: 0.4 }}
          >
            <div className="ejercicio-header">
              <button className="btn-volver" onClick={volverAlMenu}>
                â† Volver al MenÃº
              </button>
              <div className="ejercicio-info">
                <span className="materia">{ejercicioActual.materia}</span>
                <span className="nivel">{ejercicioActual.nivel}</span>
                <span className="tiempo">â±ï¸ {ejercicioActual.tiempoEstimado} min</span>
              </div>
            </div>

            <div className="ejercicio-contenido">
              <div className="contexto">
                <strong>Contexto:</strong> {ejercicioActual.contexto}
              </div>
              
              <div className="pregunta">
                <h3>ðŸ“ {ejercicioActual.pregunta}</h3>
              </div>

              <div className="opciones">
                {ejercicioActual.opciones.map(opcion => (
                  <motion.button
                    key={opcion.id}
                    className={`opcion ${respuestaSeleccionada === opcion.id ? 'seleccionada' : ''} ${
                      ejercicioCompletado ? (opcion.esCorrecta ? 'correcta' : 'incorrecta') : ''
                    }`}
                    onClick={() => !ejercicioCompletado && seleccionarRespuesta(opcion.id)}
                    disabled={ejercicioCompletado}
                    whileHover={!ejercicioCompletado ? { scale: 1.02 } : {}}
                    whileTap={!ejercicioCompletado ? { scale: 0.98 } : {}}
                  >
                    <span className="opcion-letra">{opcion.id.toUpperCase()}</span>
                    <span className="opcion-texto">{opcion.texto}</span>
                    {ejercicioCompletado && (
                      <div className="explicacion">
                        ðŸ’¡ {opcion.explicacion}
                      </div>
                    )}
                  </motion.button>
                ))}
              </div>

              <div className="acciones-ejercicio">
                {!ejercicioCompletado ? (
                  <button
                    className="btn-confirmar"
                    onClick={confirmarRespuesta}
                    disabled={!respuestaSeleccionada}
                  >
                    âœ… Confirmar Respuesta
                  </button>
                ) : (
                  <button
                    className="btn-siguiente"
                    onClick={siguienteEjercicio}
                  >
                    âž¡ï¸ Siguiente Ejercicio
                  </button>
                )}
              </div>
            </div>
          </motion.div>
        )}

        {/* Vista de Cara sin Ejercicios (Resultados) */}
        {caraActiva && !ejercicioActual && (
          <motion.div
            key="cara-especial"
            className="cara-especial"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.9 }}
            transition={{ duration: 0.4 }}
          >
            <div className="cara-especial-header">
              <button className="btn-volver" onClick={volverAlMenu}>
                â† Volver al MenÃº
              </button>
            </div>

            <div className="cara-especial-content">
              {caraActiva === 'resultados' && (
                <div className="resultados-dashboard">
                  <h2>ðŸ“Š ANÃLISIS DE RESULTADOS</h2>
                  <div className="metricas-detalladas">
                    {estado.metricas.map(metrica => {
                      const porcentaje = (metrica.puntajeActual / metrica.puntajeMaximo) * 100;
                      return (
                        <div key={metrica.materia} className="metrica-detallada">
                          <h3>{metrica.materia}</h3>
                          <div className="metrica-valores">
                            <span>{metrica.puntajeActual}/{metrica.puntajeMaximo}</span>
                            <span>{porcentaje.toFixed(1)}%</span>
                          </div>
                          <div className="metrica-barra-grande">
                            <div 
                              className="metrica-progreso-grande"
                              data-porcentaje={porcentaje.toFixed(0)}
                            />
                          </div>
                        </div>
                      );
                    })}
                  </div>
                  <div className="puntaje-total">
                    <h3>ðŸŽ¯ Puntaje Total Acumulado: {puntajeAcumulado}</h3>
                  </div>
                </div>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Footer con mÃ©tricas en tiempo real */}
      <div className="footer-metricas">
        {estado.metricas.map(metrica => {
          const porcentaje = (metrica.puntajeActual / metrica.puntajeMaximo) * 100;
          return (
            <div key={metrica.materia} className="metrica-mini">
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

export default TriadaFuncional;
