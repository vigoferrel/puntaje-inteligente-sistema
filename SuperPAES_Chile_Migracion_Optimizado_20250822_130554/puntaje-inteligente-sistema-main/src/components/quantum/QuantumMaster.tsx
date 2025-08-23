/* eslint-disable react-refresh/only-export-components */
// ðŸ§  QuantumMaster.tsx - Componente Universal del Sistema CuÃ¡ntico
// Context7 + Pensamiento Secuencial + TrilogÃ­a CuÃ¡ntica (Rafael, Michelangelo, Leonardo)
// Un solo componente que renderiza todo el ecosistema educativo PAES

import React, { useState } from 'react';
import { useQuantum } from './useQuantum';
import type { BloomLevel, Exercise, ExerciseContext, SynergicOptions } from './useQuantum';
import styles from '../../styles/UnifiedLayout.module.css';
import { AnalyticsNeuralDemo } from '../../pages/AnalyticsNeuralDemo';
import LeonardoEducationalOrchestrator from './LeonardoEducationalOrchestrator';

type PruebaPAES = 'competencia_lectora' | 'matematica_m1' | 'matematica_m2' | 'historia' | 'ciencias_tp';
type ContentType = 'texto' | 'grafico' | 'tabla' | 'ocr' | 'ejercicio';

// Los tipos ya estÃ¡n importados desde useQuantum

interface AspiracionesEstudiante {
  carreraObjetivo: string;
  puntajeObjetivo: number;
  universidadPreferida: string;
  tiempoDisponible: number;
  fortalezas: string[];
  debilidades: string[];
}

interface QuantumMasterProps {
  userId: string;
  aspiracionesEstudiante: AspiracionesEstudiante;
  onSystemUpdate?: (data: unknown) => void;
}

export const QuantumMaster: React.FC<QuantumMasterProps> = ({
  userId,
  aspiracionesEstudiante,
  onSystemUpdate
}) => {
  // ðŸŽ¯ Estado para ejercicios generados
  const [generatedExercise, setGeneratedExercise] = useState<Exercise | null>(null);
  const [showExercise, setShowExercise] = useState(false);

  const {
    quantumState,
    activeMaestro,
    isTransitioning,
    activateMaestro,
    loadContextualContent,
    arsenalEducativo,
    consciousnessLevel,
    quantumCoherence,
    systemHealth,
    contextualContent,
    currentPruebaPAES,
    rafaelActive,
    michelangeloActive,
    leonardoActive,
    benchmarkActive,
    // ðŸ”„ Nuevas funciones sinÃ©rgicas del ciclo educativo
    enrichExerciseContext,
    generateExerciseFromContext,
    // ðŸ”§ QUANTUM SERVICES ULTRAMINIMALISTAS - IntegraciÃ³n invisible
    trackExerciseProgress,
    handleUserInteraction,
    calendar,
    notifications,
    guidance,
    quantumServices
  } = useQuantum(userId, aspiracionesEstudiante);

  // ðŸŽ¯ Formatear nombres de pruebas PAES
  const formatPruebaName = (prueba: string): string => {
    const names: Record<string, string> = {
      competencia_lectora: 'Competencia Lectora',
      matematica_m1: 'MatemÃ¡tica M1',
      matematica_m2: 'MatemÃ¡tica M2',
      historia: 'Historia y CS',
      ciencias_tp: 'Ciencias TP'
    };
    return names[prueba] || prueba;
  };

  // ðŸŽ¨ Obtener emoji del maestro
  const getMaestroEmoji = (maestro: string): string => {
    const emojis: Record<string, string> = {
      rafael: 'ðŸŽ¨',
      michelangelo: 'ðŸ“Š',
      leonardo: 'ðŸ§ ',
      benchmark: 'ðŸŒŸ'
    };
    return emojis[maestro] || 'âš¡';
  };

  // ðŸ”„ Obtener nivel de consciencia como texto
  const getConsciousnessLevel = (level: number): string => {
    if (level >= 80) return 'High';
    if (level >= 50) return 'Medium';
    return 'Low';
  };

  // ðŸŽ¯ Manejar cambio de prueba PAES
  const handlePruebaChange = (prueba: string) => {
    loadContextualContent('ejercicio', prueba as PruebaPAES);
  };

  // ðŸ”„ Manejar carga contextual con opciones sinÃ©rgicas
  const handleSynergicLoad = (type: ContentType, options?: Partial<SynergicOptions>) => {
    const synergicOptions: SynergicOptions = {
      bloomLevel: (options?.bloomLevel as BloomLevel) || 'apply',
      agentInsight: options?.agentInsight || 'AnÃ¡lisis automÃ¡tico',
      ocrReady: type === 'ocr',
      autoGenerateExercise: true,
      visualEnhancement: true,
      ...options
    };
    loadContextualContent(type, currentPruebaPAES, synergicOptions);
  };

  // ðŸ§  Enriquecer contexto desde ejercicio actual
  const handleEnrichContext = async () => {
    if (contextualContent?.data) {
      // Crear un objeto Exercise bÃ¡sico compatible
      const exerciseData = {
        id: `context-${Date.now()}`,
        question: contextualContent.data.title || '',
        subject: currentPruebaPAES,
        difficulty: 'medium',
        skill: 'comprension',
        options: [],
        correctAnswer: '0',
        explanation: contextualContent.data.description || '',
        tags: [],
        metadata: {
          source: 'contextual_content',
          timestamp: contextualContent.data.timestamp
        }
      } as Exercise;
      
      const enrichedContext = await enrichExerciseContext(exerciseData);
      console.log('ðŸ”® Contexto enriquecido:', enrichedContext);
    }
  };

  // âš¡ Generar ejercicio desde contexto actual
  const handleGenerateFromContext = async () => {
    console.log('ðŸŽ¯ Iniciando generaciÃ³n de ejercicio...');
    const startTime = Date.now();
    
    try {
      // ðŸ¤– Tracking de interacciÃ³n para guÃ­a inteligente
      await handleUserInteraction({
        action: 'generate_exercise',
        page: '/quantum',
        timeSpent: 0,
        success: false // Se actualizarÃ¡ al final
      });

      // Si no hay contenido contextual, crear uno por defecto
      if (!contextualContent?.data) {
        console.log('ðŸ“ No hay contenido contextual, cargando ejercicio por defecto...');
        // Cargar contenido contextual primero
        loadContextualContent('ejercicio', currentPruebaPAES);
        // Esperar un momento para que se cargue
        await new Promise(resolve => setTimeout(resolve, 500));
      }
      
      // Usar la signatura correcta: (contextType, prueba, options)
      const contextType = contextualContent?.type || 'ejercicio';
      const options: SynergicOptions = {
        bloomLevel: 'apply',
        agentInsight: 'GeneraciÃ³n automÃ¡tica desde contexto actual',
        ocrReady: contextType === 'ocr',
        autoGenerateExercise: false,
        visualEnhancement: true
      };
      
      console.log('ðŸ”„ Generando ejercicio con opciones:', { contextType, currentPruebaPAES, options });
      const newExercise = await generateExerciseFromContext(contextType, currentPruebaPAES, options);
      
      if (newExercise) {
        console.log('âœ… Ejercicio generado exitosamente:', newExercise);
        
        // ðŸŽ¯ Almacenar ejercicio generado y mostrar en Ã¡rea central
        setGeneratedExercise(newExercise);
        setShowExercise(true);
        
        // ðŸ“Š TRACKING AUTOMÃTICO DE PROGRESO - Invisible pero potente
        const timeSpent = Date.now() - startTime;
        await trackExerciseProgress({
          exerciseId: String(newExercise.id || `generated-${Date.now()}`),
          prueba: currentPruebaPAES,
          timeSpent,
          score: 100, // GeneraciÃ³n exitosa
          isCorrect: true
        });

        // ðŸ¤– Actualizar interacciÃ³n como exitosa
        await handleUserInteraction({
          action: 'generate_exercise_success',
          page: '/quantum',
          timeSpent,
          success: true
        });

        alert('âœ… Ejercicio generado exitosamente! Ahora se muestra en el Ã¡rea central.');
      } else {
        console.error('âŒ No se pudo generar el ejercicio');
        
        // ðŸ¤– Tracking de error para guÃ­a inteligente
        await handleUserInteraction({
          action: 'generate_exercise_error',
          page: '/quantum',
          timeSpent: Date.now() - startTime,
          success: false
        });

        alert('âŒ Error: No se pudo generar el ejercicio. Verifica la API Key de OpenRouter.');
      }
    } catch (error) {
      console.error('âŒ Error generando ejercicio:', error);
      const errorMessage = error instanceof Error ? error.message : 'Error desconocido';
      
      // ðŸ¤– Tracking de error crÃ­tico
      await handleUserInteraction({
        action: 'generate_exercise_critical_error',
        page: '/quantum',
        timeSpent: Date.now() - startTime,
        success: false
      });

      alert(`âŒ Error generando ejercicio: ${errorMessage}`);
    }
  };

  return (
    <div className={`${styles.quantumMaster} ${styles[`consciousness${getConsciousnessLevel(consciousnessLevel)}`]} ${isTransitioning ? styles.transitioning : ''}`}>
      {/* ðŸ§  Header CuÃ¡ntico */}
      <div className={styles.quantumHeader}>
        <div className={styles.consciousnessDisplay}>
          <span title="Nivel de Consciencia">ðŸ§  {consciousnessLevel}%</span>
          <span title="Coherencia CuÃ¡ntica">âš¡ {quantumCoherence}%</span>
          <span title="Salud del Sistema">ðŸ’š {systemHealth}%</span>
          <span title="Maestro Activo">{getMaestroEmoji(activeMaestro)} {activeMaestro.toUpperCase()}</span>
          {/* ðŸ”§ INDICADORES ULTRAMINIMALISTAS - Invisibles pero informativos */}
          {calendar.streak > 0 && (
            <span title={`Racha de ${calendar.streak} dÃ­as`} className={styles.streakIndicator}>
              ðŸ”¥ {calendar.streak}
            </span>
          )}
          {notifications.unread > 0 && (
            <span title={`${notifications.unread} notificaciones`} className={styles.notificationIndicator}>
              ðŸ”” {notifications.unread}
            </span>
          )}
          {guidance.needsHelp && (
            <span
              title="Ayuda disponible - Haz clic para guÃ­a"
              className={`${styles.helpIndicator} ${styles.clickable}`}
              onClick={() => quantumServices.guide.startTour('quick-help')}
            >
              ðŸ¤–
            </span>
          )}
        </div>
        <div className={styles.aspirationsDisplay}>
          <h1 className={styles.textQuantumPrimary}>ðŸŒŒ SuperPAES Quantum System</h1>
          <div className={styles.aspirationsInfo}>
            <span>{aspiracionesEstudiante.carreraObjetivo}</span>
            <span>ðŸŽ¯ {aspiracionesEstudiante.puntajeObjetivo} pts</span>
            <span>ðŸ›ï¸ {aspiracionesEstudiante.universidadPreferida}</span>
            {/* ðŸ“… Indicador de progreso diario ultraminimalista */}
            {calendar.todayEvents > 0 && (
              <span title={`${calendar.todayEvents} ejercicios hoy`} className={styles.dailyProgress}>
                ðŸ“Š {calendar.todayEvents}
              </span>
            )}
          </div>
        </div>
      </div>

      {/* ðŸŽ¯ Sidebar Arsenal Educativo */}
      <div className={styles.quantumSidebar}>
        <h3>ðŸŽ¯ Arsenal Educativo PAES</h3>
        
        <h4>ðŸ“š 5 Pruebas PAES</h4>
        <ul className={styles.arsenalList}>
          {arsenalEducativo.pruebasPAES.map(prueba => (
            <li 
              key={prueba}
              className={`${styles.arsenalItem} ${currentPruebaPAES === prueba ? styles.arsenalItemActive : ''}`}
              onClick={() => handlePruebaChange(prueba)}
              title={`Cargar ejercicios de ${formatPruebaName(prueba)}`}
            >
              ðŸ“š {formatPruebaName(prueba)}
            </li>
          ))}
        </ul>
        
        <h4>ðŸ† Microcertificaciones</h4>
        <ul className={styles.arsenalList}>
          {arsenalEducativo.microcertificaciones.map((cert, index) => (
            <li 
              key={cert.id || index}
              className={styles.arsenalItem}
              title={`Progreso: ${cert.progreso}% - Relevancia: ${cert.relevancia}`}
            >
              ðŸ† {cert.nombre}
              <small className={styles.arsenalItemPercentage}>
                {cert.progreso}%
              </small>
            </li>
          ))}
        </ul>
        
        <h4>ðŸŽ“ Agente Vocacional</h4>
        <div 
          className={`${styles.arsenalItem} ${styles.arsenalItemActive}`}
          title={`Compatibilidad: ${arsenalEducativo.agenteVocacional.compatibilidad}%`}
        >
          ðŸŽ“ OrientaciÃ³n IA
          <small className={styles.arsenalItemPercentage}>
            {arsenalEducativo.agenteVocacional.compatibilidad}%
          </small>
        </div>
        
        <h4>ðŸ“… Calendario Inteligente</h4>
        {arsenalEducativo.calendario.map((evento, index) => (
          <div 
            key={index}
            className={styles.arsenalItem}
            title={`${evento.evento} - ${evento.tipo}`}
          >
            ðŸ“… {evento.evento.substring(0, 20)}...
          </div>
        ))}
      </div>

      {/* ðŸ“Š Contenido Principal Adaptativo */}
      <div className={styles.quantumContent}>
        {/* ðŸŽ¨ CENTRO LEONARDO DE EJERCICIOS - CORAZÃ“N DEL SISTEMA */}
        <LeonardoEducationalOrchestrator
          userId={userId}
          aspiracionesEstudiante={aspiracionesEstudiante}
          currentPruebaPAES={currentPruebaPAES}
          activeMaestro={activeMaestro}
          onExerciseComplete={async (result) => {
            console.log('ðŸŽ¯ Ejercicio completado en Centro Leonardo:', result);
            
            // ðŸ“Š TRACKING AUTOMÃTICO ULTRAMINIMALISTA
            await trackExerciseProgress({
              exerciseId: String(result.exercise.id || `leonardo-${Date.now()}`),
              prueba: currentPruebaPAES,
              timeSpent: 60000, // 1 minuto por defecto
              score: result.isCorrect ? 100 : 0,
              isCorrect: result.isCorrect
            });

            // ðŸ¤– Tracking de interacciÃ³n para guÃ­a inteligente
            await handleUserInteraction({
              action: result.isCorrect ? 'exercise_correct' : 'exercise_incorrect',
              page: '/quantum/leonardo',
              timeSpent: 60000,
              success: result.isCorrect
            });

            if (result.isCorrect) {
              alert(`ðŸŽ‰ Â¡Correcto! +${result.points} puntos`);
            }
          }}
        />

        {/* ðŸŽ¨ Contenido Rafael (Visual/3D) */}
        {rafaelActive && (
          <div className={`${styles.rafaelContent} ${styles.quantumFadeIn}`}>
            <h2>ðŸŽ¨ Arsenal Visual 3D Activado</h2>
            <p>Sistema de visualizaciÃ³n avanzada para ejercicios PAES</p>
            
            <div className={styles.visualGrid}>
              <div className={styles.visualCard}>
                <h3>ðŸŒŒ Universos Educativos 3D</h3>
                <p>âœ¨ Modelos interactivos para {formatPruebaName(currentPruebaPAES)}</p>
                <p>ðŸŽ¯ Banco de imÃ¡genes contextual</p>
                <p>ðŸ”® Ejercicios visuales de alta calidad</p>
              </div>
              <div className={styles.visualCard}>
                <h3>ðŸ“ GeometrÃ­a Interactiva</h3>
                <p>VisualizaciÃ³n 3D de problemas geomÃ©tricos</p>
                <p>Renderizado en tiempo real</p>
              </div>
              <div className={styles.visualCard}>
                <h3>ðŸ“Š GrÃ¡ficos DinÃ¡micos</h3>
                <p>RepresentaciÃ³n visual de datos y funciones</p>
                <p>InteracciÃ³n visual avanzada</p>
              </div>
              <div className={styles.visualCard}>
                <h3>ðŸ§¬ Modelos CientÃ­ficos</h3>
                <p>Simulaciones interactivas de conceptos cientÃ­ficos</p>
                <p>Universos educativos inmersivos</p>
              </div>
            </div>
          </div>
        )}

        {/* ðŸ“Š Contenido Michelangelo (MÃ©tricas) */}
        {michelangeloActive && (
          <div className={`${styles.michelangeloContent} ${styles.quantumFadeIn}`}>
            <div className={styles.metricCard}>
              <h2>ðŸ“Š Centro de MÃ©tricas Inteligentes</h2>
              <p>AnÃ¡lisis en tiempo real del progreso acadÃ©mico</p>
            </div>
            
            <div className={styles.metricCard}>
              <h3>ðŸ“Š Progreso Global</h3>
              <div className={styles.metricValue}>{arsenalEducativo.progreso.global}%</div>
              <p>Tendencia: {arsenalEducativo.progreso.tendencia}</p>
            </div>
            
            <div className={styles.metricCard}>
              <h3>ðŸŽ¯ Puntaje Proyectado</h3>
              <div className={styles.metricValue}>{arsenalEducativo.sistemasPuntajes.proyectado}</div>
              <p>Objetivo: {arsenalEducativo.sistemasPuntajes.objetivo}</p>
            </div>
            
            <div className={styles.metricCard}>
              <h3>âš¡ Coherencia CuÃ¡ntica</h3>
              <div className={styles.metricValue}>{quantumCoherence}%</div>
              <p>Sistema: Ã“ptimo</p>
            </div>
            
            <div className={styles.metricCard}>
              <h3>ðŸ† Certificaciones</h3>
              <div className={styles.metricValue}>{arsenalEducativo.microcertificaciones.length}</div>
              <p>Activas</p>
            </div>
            
            <div className={styles.metricCard}>
              <h3>ðŸŽ“ Compatibilidad</h3>
              <div className={styles.metricValue}>{arsenalEducativo.agenteVocacional.compatibilidad}%</div>
              <p>Vocacional</p>
            </div>
            
            <div className={styles.metricCard}>
              <h3>â±ï¸ Tiempo Disponible</h3>
              <div className={styles.metricValue}>{aspiracionesEstudiante.tiempoDisponible}h</div>
              <p>Semanal</p>
            </div>
          </div>
        )}

        {/* ðŸ§  Contenido Leonardo (Neural/IA) */}
        {leonardoActive && (
          <div className={`${styles.leonardoContent} ${styles.quantumFadeIn}`}>
            <h2>ðŸ§  Sistema Neural Leonardo Activo</h2>
            <p>Inteligencia Artificial adaptativa para optimizaciÃ³n del aprendizaje</p>
            
            <div className={styles.neuralGrid}>
              <div className={styles.neuralCard}>
                <h3>âš¡ 5 Agentes Neurales Orquestadores</h3>
                <p>ðŸŽ¯ <strong>PathFinder:</strong> Optimizando ruta de aprendizaje para {aspiracionesEstudiante.carreraObjetivo}</p>
                <p>ðŸŒ¸ <strong>BloomNavigator:</strong> Navegando taxonomÃ­a cognitiva adaptativa</p>
                <p>ðŸ“ <strong>ContentGenerator:</strong> Generando contenido personalizado</p>
                <p>ðŸŽ“ <strong>AdaptiveTutor:</strong> TutorizaciÃ³n inteligente en tiempo real</p>
                <p>ðŸ“Š <strong>ProgressAnalyzer:</strong> AnÃ¡lisis predictivo de progreso</p>
              </div>
              
              <div className={styles.neuralCard}>
                <h3>ðŸŽ¯ Recomendaciones IA Personalizadas</h3>
                {arsenalEducativo.agenteVocacional.recomendaciones.map((rec, index) => (
                  <p key={index}>â€¢ {rec}</p>
                ))}
              </div>
              
              <div className={styles.neuralCard}>
                <h3>ðŸ”® Predicciones Inteligentes</h3>
                <p>ðŸ“ˆ Probabilidad de ingreso: <strong>{arsenalEducativo.agenteVocacional.probabilidadIngreso}%</strong></p>
                <p>â±ï¸ Tiempo estimado para objetivo: <strong>{arsenalEducativo.sistemasPuntajes.tiempoEstimado} semanas</strong></p>
                <p>ðŸŽ¯ Puntaje proyectado: <strong>{arsenalEducativo.sistemasPuntajes.proyectado} pts</strong></p>
              </div>
            </div>
          </div>
        )}

        {/* ðŸŒŸ Contenido Universal Benchmark */}
        {benchmarkActive && (
          <div className={`${styles.benchmarkContent} ${styles.quantumFadeIn}`}>
            <h2>ðŸŒŸ Universal Benchmark Activo</h2>
            <p>Sistema de scoring inteligente independiente de aspiraciones</p>
            
            <div className={styles.benchmarkContainer}>
              <AnalyticsNeuralDemo />
            </div>
          </div>
        )}

        {/* ðŸŽ¯ Contenido de Ejercicio Generado */}
        {showExercise && generatedExercise && (
          <div className={`${styles.exerciseContent} ${styles.quantumFadeIn}`}>
            <div className={styles.exerciseHeader}>
              <h2>ðŸŽ¯ Ejercicio Generado - {formatPruebaName(currentPruebaPAES)}</h2>
              <button
                className={styles.btnQuantumSecondary}
                onClick={() => setShowExercise(false)}
                title="Cerrar ejercicio"
              >
                âœ• Cerrar
              </button>
            </div>
            
            <div className={styles.exerciseContainer}>
              <div className={styles.exerciseQuestion}>
                <h3>ðŸ“ Pregunta:</h3>
                <p>{generatedExercise.question}</p>
                
                {generatedExercise.text && (
                  <div className={styles.exerciseText}>
                    <h4>ðŸ“– Texto base:</h4>
                    <p>{generatedExercise.text}</p>
                  </div>
                )}
              </div>
              
              <div className={styles.exerciseOptions}>
                <h3>ðŸ“‹ Opciones:</h3>
                {generatedExercise.options && generatedExercise.options.map((option, index) => (
                  <div
                    key={index}
                    className={`${styles.exerciseOption} ${option === generatedExercise.correctAnswer ? styles.exerciseOptionCorrect : ''}`}
                  >
                    {option}
                  </div>
                ))}
              </div>
              
              <div className={styles.exerciseMetadata}>
                <div className={styles.exerciseInfo}>
                  <span><strong>ðŸŽ¯ Prueba:</strong> {generatedExercise.prueba}</span>
                  <span><strong>ðŸ§  Habilidad:</strong> {generatedExercise.skill}</span>
                  <span><strong>ðŸ“Š Dificultad:</strong> {generatedExercise.difficulty}</span>
                  {generatedExercise.estimatedTime && (
                    <span><strong>â±ï¸ Tiempo estimado:</strong> {generatedExercise.estimatedTime}s</span>
                  )}
                </div>
              </div>
              
              <div className={styles.exerciseExplanation}>
                <h3>ðŸ’¡ ExplicaciÃ³n:</h3>
                <p>{generatedExercise.explanation}</p>
                <div className={styles.exerciseCorrectAnswer}>
                  <strong>âœ… Respuesta correcta:</strong> {generatedExercise.correctAnswer}
                </div>
              </div>
              
              <div className={styles.exerciseActions}>
                <button
                  className={styles.btnQuantumPrimary}
                  onClick={handleGenerateFromContext}
                  title="Generar otro ejercicio"
                >
                  ðŸ”„ Generar Otro
                </button>
                <button
                  className={styles.btnQuantumSecondary}
                  onClick={() => console.log('Ejercicio completo:', generatedExercise)}
                  title="Ver detalles en consola"
                >
                  ðŸ” Ver Detalles
                </button>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* ðŸ–¼ï¸ Ventana Contextual Inteligente */}
      <div className={styles.quantumContextual}>
        <div className={styles.contextualHeader}>
          <h3>ðŸ–¼ï¸ Ventana Contextual - {formatPruebaName(currentPruebaPAES)}</h3>
          <div className={styles.contextualControls}>
            <button 
              className={styles.btnQuantum}
              onClick={() => loadContextualContent('texto', currentPruebaPAES)}
              title="Cargar texto"
            >
              ðŸ“
            </button>
            <button 
              className={styles.btnQuantum}
              onClick={() => loadContextualContent('grafico', currentPruebaPAES)}
              title="Cargar grÃ¡fico"
            >
              ðŸ“Š
            </button>
            <button 
              className={styles.btnQuantum}
              onClick={() => loadContextualContent('tabla', currentPruebaPAES)}
              title="Cargar tabla"
            >
              ðŸ“‹
            </button>
            <button 
              className={styles.btnQuantum}
              onClick={() => loadContextualContent('ocr', currentPruebaPAES)}
              title="Activar OCR"
            >
              ðŸ“·
            </button>
            <button
              className={styles.btnQuantumPrimary}
              onClick={() => loadContextualContent('ejercicio', currentPruebaPAES)}
              title="Cargar ejercicio"
            >
              ðŸŽ¯
            </button>
          </div>
          
          {/* ðŸ”„ Controles SinÃ©rgicos del Ciclo Educativo */}
          <div className={styles.synergicControls}>
            <button
              className={styles.btnQuantumSecondary}
              onClick={() => handleSynergicLoad('ejercicio', { bloomLevel: 'apply' })}
              title="ðŸŒ¸ Ejercicio con Bloom: Aplicar"
            >
              ðŸŒ¸ Bloom
            </button>
            <button
              className={styles.btnQuantumSecondary}
              onClick={() => handleSynergicLoad('ocr', { ocrReady: true })}
              title="ðŸ“· OCR CuÃ¡ntico Activado"
            >
              ðŸ“· OCR+
            </button>
            <button
              className={styles.btnQuantumSecondary}
              onClick={handleEnrichContext}
              title="ðŸ”® Enriquecer contexto actual"
            >
              ðŸ”® Enriquecer
            </button>
            <button
              className={styles.btnQuantumSecondary}
              onClick={handleGenerateFromContext}
              title="âš¡ Generar ejercicio desde contexto"
            >
              âš¡ Generar
            </button>
            <button
              className={styles.btnQuantumSecondary}
              onClick={() => activateMaestro('benchmark')}
              title="ðŸŒŸ Activar Universal Benchmark"
            >
              ðŸŒŸ Benchmark
            </button>
          </div>
        </div>
        
        <div className={styles.contextualContent}>
          {contextualContent ? (
            <div className={styles.quantumFadeIn}>
              <h4>{contextualContent.data.title}</h4>
              <p><strong>Tipo:</strong> {contextualContent.type.toUpperCase()}</p>
              <p><strong>Prueba:</strong> {contextualContent.pruebaName}</p>
              <p><strong>Mejorado por:</strong> {contextualContent.enhanced}</p>
              
              {contextualContent.enhanced === 'rafael-3d' && contextualContent.rafaelFeatures && (
                <div className={styles.rafaelFeaturesBox}>
                  <strong>ðŸŽ¨ CaracterÃ­sticas Rafael:</strong>
                  {contextualContent.rafaelFeatures.map((feature: string, index: number) => (
                    <p key={index}>â€¢ {feature}</p>
                  ))}
                </div>
              )}
              
              {contextualContent.enhanced === 'michelangelo-metrics' && contextualContent.metricsData && (
                <div className={styles.michelangeloMetricsBox}>
                  <strong>ðŸ“Š MÃ©tricas Michelangelo:</strong>
                  <p>â€¢ Progreso actual: {contextualContent.metricsData.progresoActual}%</p>
                  <p>â€¢ Puntaje proyectado: {contextualContent.metricsData.puntajeProyectado}</p>
                  <p>â€¢ Tiempo estimado: {contextualContent.metricsData.tiempoEstimado} min</p>
                  <p>â€¢ Dificultad: {contextualContent.metricsData.dificultadRelativa}/3</p>
                </div>
              )}
              
              {contextualContent.enhanced === 'leonardo-ai' && contextualContent.aiInsights && (
                <div className={styles.leonardoInsightsBox}>
                  <strong>ðŸ§  Insights Leonardo:</strong>
                  <p>â€¢ <strong>RecomendaciÃ³n:</strong> {contextualContent.aiInsights.recomendacion}</p>
                  <p>â€¢ <strong>AdaptaciÃ³n:</strong> {contextualContent.aiInsights.adaptacion}</p>
                  <p>â€¢ <strong>PredicciÃ³n:</strong> {contextualContent.aiInsights.prediccion}</p>
                  <p>â€¢ <strong>PersonalizaciÃ³n:</strong> {contextualContent.aiInsights.personalizacion}</p>
                </div>
              )}
            </div>
          ) : (
            <div className={styles.contextualPlaceholder}>
              <p>ðŸŽ¯ Selecciona contenido del Arsenal Educativo</p>
              <p>ðŸ“š Elige una prueba PAES para comenzar</p>
              <p>âš¡ El contenido se adaptarÃ¡ segÃºn el maestro activo</p>
            </div>
          )}
        </div>
      </div>

      {/* ðŸ”® Maestros Orbs - TrilogÃ­a CuÃ¡ntica */}
      <div className={styles.quantumMaestros}>
        <div 
          className={`${styles.maestroOrb} ${styles.maestroRafael} ${rafaelActive ? styles.maestroOrbActive : ''}`}
          onClick={() => activateMaestro('rafael')}
          title="Rafael - Arsenal Visual 3D"
        >
          ðŸŽ¨
        </div>
        <div 
          className={`${styles.maestroOrb} ${styles.maestroMichelangelo} ${michelangeloActive ? styles.maestroOrbActive : ''}`}
          onClick={() => activateMaestro('michelangelo')}
          title="Michelangelo - Dashboard HologrÃ¡fico"
        >
          ðŸ“Š
        </div>
        <div
          className={`${styles.maestroOrb} ${styles.maestroLeonardo} ${leonardoActive ? styles.maestroOrbActive : ''}`}
          onClick={() => activateMaestro('leonardo')}
          title="Leonardo - Sistema Neural IA"
        >
          ðŸ§ 
        </div>
        <div
          className={`${styles.maestroOrb} ${styles.maestroBenchmark} ${benchmarkActive ? styles.maestroOrbActive : ''}`}
          onClick={() => activateMaestro('benchmark')}
          title="Universal Benchmark - Scoring Inteligente"
        >
          ðŸŒŸ
        </div>
      </div>

      {/* ðŸ“Š MÃ©tricas CuÃ¡nticas Flotantes */}
      <div className={styles.quantumMetrics}>
        <div className={styles.metricCard}>
          <div className={styles.metricValue}>{consciousnessLevel}</div>
          <div className={styles.metricLabel}>Consciencia</div>
        </div>
        <div className={styles.metricCard}>
          <div className={styles.metricValue}>{quantumCoherence}</div>
          <div className={styles.metricLabel}>Coherencia</div>
        </div>
        <div className={styles.metricCard}>
          <div className={styles.metricValue}>{systemHealth}</div>
          <div className={styles.metricLabel}>Salud</div>
        </div>
        <div className={styles.metricCard}>
          <div className={styles.metricValue}>âš¡</div>
          <div className={styles.metricLabel}>EnergÃ­a</div>
        </div>
      </div>
    </div>
  );
};
export default QuantumMaster;
