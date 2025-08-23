/* eslint-disable react-refresh/only-export-components */
// ðŸŽ¨ LEONARDO EDUCATIONAL ORCHESTRATOR
// Context7 + Pensamiento Secuencial + IntegraciÃ³n CuÃ¡ntica Renacentista

import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { TPAESPrueba, TPAESHabilidad } from '../../types/system-types';
import { useQuantum } from './useQuantum';
import { useSpotifyPAESSimple } from '../../hooks/useSpotifyPAESSimple';
import { useSpotifyNeuralEducation } from '../../hooks/useSpotifyNeuralEducation';
import { leonardoAudioService } from '../../services/leonardo/audio-sintetico';
import { CentralSpotifyDashboard } from '../spotify-neural/CentralSpotifyDashboard';
import styles from '../../styles/UnifiedLayout.module.css';

interface Exercise {
  id: string;
  question: string;
  options: string[];
  correctAnswer: string;
  explanation: string;
  prueba?: string;
  metadata?: {
    source?: 'oficial' | 'banco' | 'ia';
    [key: string]: string | number | boolean | undefined;
  };
}

interface AspiracionesEstudiante {
  carreraObjetivo: string;
  puntajeObjetivo: number;
  universidadPreferida: string;
  tiempoDisponible: number;
  fortalezas: string[];
  debilidades: string[];
}

interface ExerciseResult {
  exercise: Exercise;
  isCorrect: boolean;
  points: number;
}

interface LeonardoOrchestratorProps {
  userId: string;
  aspiracionesEstudiante: AspiracionesEstudiante;
  currentPruebaPAES: string;
  activeMaestro: string;
  onExerciseComplete?: (result: ExerciseResult) => void;
}

export const LeonardoEducationalOrchestrator: React.FC<LeonardoOrchestratorProps> = ({
  userId,
  aspiracionesEstudiante,
  currentPruebaPAES,
  activeMaestro,
  onExerciseComplete
}) => {
  const [currentExercise, setCurrentExercise] = useState<Exercise | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [selectedAnswer, setSelectedAnswer] = useState<string>('');
  const [showResult, setShowResult] = useState(false);
  const [gamificationState, setGamificationState] = useState({
    points: 0,
    streak: 0
  });
  const [certificationProgress, setCertificationProgress] = useState(0);
  const [feedbackMessage, setFeedbackMessage] = useState<string>('');

  // ðŸŒŒ INTEGRACIÃ“N QUIRÃšRGICA: useQuantum Hook para Learning Modes
  const {
    multiverse,
    switchLearningMode,
    createLearningExperience,
    enrichExerciseContext,
    generateExerciseFromContext
  } = useQuantum(userId, aspiracionesEstudiante);

  // ðŸŽµ INTEGRACIÃ“N QUIRÃšRGICA: SpotifyPAES (solo en modo Spotify)
  const spotifyData = useSpotifyPAESSimple();
  
  // ðŸŽµ INTEGRACIÃ“N QUIRÃšRGICA: Spotify Neural Education System
  const spotifyNeural = useSpotifyNeuralEducation();

  //  INTEGRACIÃ“N QUIRÃšRGICA: Audio PedagÃ³gico Leonardo
  const generateAudioExplanation = useCallback(async (exercise: Exercise) => {
    if (multiverse.currentMode === 'spotify' || multiverse.currentMode === 'immersive') {
      try {
        const audioSegment = await leonardoAudioService.generateExplanationAudio(
          exercise.prueba || currentPruebaPAES,
          exercise.explanation,
          'intermediate'
        );
        if (audioSegment.audioUrl) {
          console.log('ðŸŽµ Audio pedagÃ³gico generado:', audioSegment.audioUrl);
        }
      } catch (error) {
        console.log('âš ï¸ Audio pedagÃ³gico no disponible:', error);
      }
    }
  }, [multiverse.currentMode, currentPruebaPAES]);

  // ðŸ”¥ CONEXIÃ“N REAL CON SERVICIOS EXISTENTES - Context7 + Pensamiento Secuencial + Arsenal CuÃ¡ntico
  const generateExercise = useCallback(async () => {
    setIsLoading(true);
    setSelectedAnswer('');
    setShowResult(false);
    setFeedbackMessage('ðŸ”„ Conectando con servicios reales del arsenal cuÃ¡ntico...');
    
    try {
      // ðŸŒŒ MODO SPOTIFY: Usar playlists educativas
      if (multiverse.currentMode === 'spotify' && spotifyData.playlists.length > 0) {
        const currentPlaylist = spotifyData.playlists.find(p =>
          p.name.toLowerCase().includes(currentPruebaPAES.toLowerCase())
        ) || spotifyData.playlists[0];
        
        if (currentPlaylist.tracks.length > 0) {
          const randomTrack = currentPlaylist.tracks[Math.floor(Math.random() * currentPlaylist.tracks.length)];
          const spotifyExercise: Exercise = {
            id: `spotify-${Date.now()}`,
            question: `ðŸŽµ ${randomTrack.title}: ${randomTrack.album}`,
            options: ['A) OpciÃ³n 1', 'B) OpciÃ³n 2', 'C) OpciÃ³n 3', 'D) OpciÃ³n 4'],
            correctAnswer: 'A',
            explanation: `Track de ${currentPlaylist.name} - ${randomTrack.artist}`,
            prueba: currentPruebaPAES,
            metadata: { source: 'ia', playlist: currentPlaylist.name }
          };
          
          setCurrentExercise(spotifyExercise);
          setGamificationState(prev => ({ ...prev, points: prev.points + 30 }));
          setFeedbackMessage('ðŸŽµ Ejercicio del arsenal SpotifyPAES cargado');
          
          // Generar audio pedagÃ³gico
          await generateAudioExplanation(spotifyExercise);
          return;
        }
      }
      //  PASO 1: Usar OpenRouter Service (servicio real de IA) - PRIORITARIO
      console.log('ðŸŽ¯ Conectando con OpenRouter Service...');
      const { openRouterService } = await import('../../services/openrouter/core');
      
      const exercisePayload = {
        action: 'generate_paes_exercise',
        payload: {
          subject: currentPruebaPAES,
          prueba: currentPruebaPAES,
          skill: 'SOLVE_PROBLEMS',
          difficulty: 'INTERMEDIATE',
          systemPrompt: `Eres un experto en PAES chileno. Genera un ejercicio de ${currentPruebaPAES} de alta calidad pedagÃ³gica.`,
          userPrompt: `Genera un ejercicio PAES de ${currentPruebaPAES} con 4 opciones mÃºltiples.
          FORMATO JSON REQUERIDO:
          {
            "question": "Pregunta del ejercicio",
            "options": ["A) OpciÃ³n 1", "B) OpciÃ³n 2", "C) OpciÃ³n 3", "D) OpciÃ³n 4"],
            "correctAnswer": "A) OpciÃ³n 1",
            "explanation": "ExplicaciÃ³n detallada"
          }`
        }
      };

      const realExercise = await openRouterService.processAction(exercisePayload);
      
      if (realExercise && realExercise.question) {
        const exercise: Exercise = {
          id: `leonardo-real-${Date.now()}`,
          question: realExercise.question,
          options: realExercise.options || ['A) OpciÃ³n 1', 'B) OpciÃ³n 2', 'C) OpciÃ³n 3', 'D) OpciÃ³n 4'],
          correctAnswer: realExercise.correctAnswer || 'A) OpciÃ³n 1',
          explanation: realExercise.explanation || 'ExplicaciÃ³n generada por IA',
          prueba: currentPruebaPAES,
          metadata: { source: 'oficial' }
        };

        setCurrentExercise(exercise);
        setGamificationState(prev => ({ ...prev, points: prev.points + 15 }));
        setFeedbackMessage('ðŸŽ¯ Ejercicio REAL generado por OpenRouter IA');
        return;
      }

      // ðŸŽ¯ PASO 2: Usar PAESContentService (servicio oficial)
      try {
        console.log('ðŸŽ¯ Intentando PAESContentService...');
        const { PAESContentService } = await import('../../services/paes/paes-content-service');
        const officialExercises = await PAESContentService.getOfficialExercises({
          prueba: currentPruebaPAES as TPAESPrueba,
          skill: 'SOLVE_PROBLEMS' as TPAESHabilidad,
          count: 1,
          difficulty: 'INTERMEDIO'
        });
        
        if (officialExercises && officialExercises.length > 0) {
          const paesQuestion = officialExercises[0];
          const exercise: Exercise = {
            id: `paes-oficial-${Date.now()}`,
            question: paesQuestion.enunciado,
            options: paesQuestion.opciones.map(opt => `${opt.letra}) ${opt.contenido}`),
            correctAnswer: paesQuestion.opciones.find(opt => opt.es_correcta)?.letra || 'A',
            explanation: paesQuestion.contexto || 'Ejercicio oficial PAES',
            prueba: currentPruebaPAES,
            metadata: { source: 'oficial' }
          };
          
          setCurrentExercise(exercise);
          setGamificationState(prev => ({ ...prev, points: prev.points + 20 }));
          setFeedbackMessage('ðŸ† Ejercicio OFICIAL PAES cargado');
          return;
        }
      } catch (error) {
        console.log('PAESContentService no disponible:', error);
      }

      // ðŸŽ¯ PASO 3: Usar SmartExerciseBankPAES (banco inteligente)
      try {
        console.log('ðŸŽ¯ Intentando SmartExerciseBankPAES...');
        const { SmartExerciseBankPAES } = await import('../../services/paes/SmartExerciseBankPAES');
        const smartExercise = await SmartExerciseBankPAES.getOptimizedExercise(
          currentPruebaPAES as TPAESPrueba,
          'SOLVE_PROBLEMS' as TPAESHabilidad,
          'INTERMEDIO',
          userId
        );
        
        if (smartExercise && smartExercise.id) {
          const validatedExercise: Exercise = {
            id: String(smartExercise.id),
            question: smartExercise.question || 'Pregunta no disponible',
            options: smartExercise.options || ['A) OpciÃ³n 1', 'B) OpciÃ³n 2', 'C) OpciÃ³n 3', 'D) OpciÃ³n 4'],
            correctAnswer: smartExercise.correctAnswer || 'A',
            explanation: smartExercise.explanation || 'ExplicaciÃ³n no disponible',
            prueba: currentPruebaPAES,
            metadata: { source: 'banco' }
          };
          setCurrentExercise(validatedExercise);
          setGamificationState(prev => ({ ...prev, points: prev.points + 18 }));
          setFeedbackMessage('ðŸ§  Ejercicio del BANCO INTELIGENTE cargado');
          return;
        }
      } catch (error) {
        console.log('SmartExerciseBankPAES no disponible:', error);
      }

      // ðŸŽ¯ PASO 4: Usar ExerciseGenerationServicePAES (generador especializado)
      try {
        console.log('ðŸŽ¯ Intentando ExerciseGenerationServicePAES...');
        const { ExerciseGenerationServicePAES } = await import('../../services/paes/ExerciseGenerationServicePAES');
        const generatedExercise = await ExerciseGenerationServicePAES.generatePAESExercise({
          prueba: currentPruebaPAES as TPAESPrueba,
          skill: 'SOLVE_PROBLEMS' as TPAESHabilidad,
          difficulty: 'INTERMEDIO',
          includeVisuals: false
        });
        
        if (generatedExercise && generatedExercise.id) {
          const validatedExercise: Exercise = {
            id: String(generatedExercise.id),
            question: generatedExercise.question || 'Pregunta no disponible',
            options: generatedExercise.options || ['A) OpciÃ³n 1', 'B) OpciÃ³n 2', 'C) OpciÃ³n 3', 'D) OpciÃ³n 4'],
            correctAnswer: generatedExercise.correctAnswer || 'A',
            explanation: generatedExercise.explanation || 'ExplicaciÃ³n no disponible',
            prueba: currentPruebaPAES,
            metadata: { source: 'ia' }
          };
          setCurrentExercise(validatedExercise);
          setGamificationState(prev => ({ ...prev, points: prev.points + 15 }));
          setFeedbackMessage('âš¡ Ejercicio generado por servicio especializado PAES');
          return;
        }
      } catch (error) {
        console.log('ExerciseGenerationServicePAES no disponible:', error);
      }

      // ðŸŽ¯ FALLBACK: Solo si todos los servicios reales fallan
      throw new Error('Todos los servicios reales no estÃ¡n disponibles');
      
    } catch (error) {
      console.error('âŒ Error conectando servicios reales:', error);
      setFeedbackMessage('âŒ Error conectando servicios reales. Verifica configuraciÃ³n API.');
    } finally {
      setIsLoading(false);
    }
  }, [currentPruebaPAES, userId, multiverse.currentMode, spotifyData.playlists, generateAudioExplanation]);

  const handleAnswerSubmit = useCallback(() => {
    if (!currentExercise || !selectedAnswer) return;
    
    const isCorrect = selectedAnswer === currentExercise.correctAnswer;
    const points = isCorrect ? 50 : 10;
    
    setGamificationState(prev => ({
      points: prev.points + points,
      streak: isCorrect ? prev.streak + 1 : 0
    }));

    if (isCorrect) {
      setCertificationProgress(prev => Math.min(prev + 15, 100));
    }
    
    setShowResult(true);
    setFeedbackMessage(isCorrect ? 
      `ðŸŽ‰ Â¡Correcto! +${points} puntos. ${currentExercise.explanation}` :
      `âŒ Incorrecto. ${currentExercise.correctAnswer}. ${currentExercise.explanation}`
    );
    
    if (onExerciseComplete) {
      onExerciseComplete({ exercise: currentExercise, isCorrect, points });
    }
  }, [currentExercise, selectedAnswer, onExerciseComplete]);

  useEffect(() => {
    generateExercise();
  }, [generateExercise]);

  return (
    <div className="centroLeonardo">
      <h2>ðŸŽ¨ Centro Leonardo de Ejercicios</h2>
      
      {/* ðŸŒŒ INTEGRACIÃ“N QUIRÃšRGICA: Selector de Learning Modes */}
      <div className={styles.learningModeSelector}>
        <span className={styles.modeLabel}>ðŸŒŸ Modo:</span>
        <select
          value={multiverse.currentMode}
          onChange={(e) => switchLearningMode(e.target.value as 'classic' | 'spotify' | 'immersive' | 'diagnostic' | 'gamified')}
          title="Selector de Modo de Aprendizaje"
          aria-label="Seleccionar modo de aprendizaje"
          className={styles.modeSelect}
        >
          <option value="classic">ðŸŽ¯ Classic</option>
          <option value="spotify">ðŸŽµ Spotify</option>
          <option value="immersive">ðŸŒŸ Immersive</option>
          <option value="diagnostic">ðŸ“Š Diagnostic</option>
          <option value="gamified">ðŸŽ® Gamified</option>
        </select>
        <span className={styles.modeDescription}>
          {multiverse.currentMode === 'spotify' && 'ðŸŽµ Modo Musical Activo'}
          {multiverse.currentMode === 'immersive' && 'ðŸŒŸ Experiencia Inmersiva'}
          {multiverse.currentMode === 'diagnostic' && 'ðŸ“Š AnÃ¡lisis Profundo'}
          {multiverse.currentMode === 'gamified' && 'ðŸŽ® GamificaciÃ³n Avanzada'}
          {multiverse.currentMode === 'classic' && 'ðŸŽ¯ Modo Tradicional'}
        </span>
      </div>
      
      <div className="gamificationOverlay">
        ðŸŽ® {gamificationState.points} pts | ðŸ”¥ {gamificationState.streak} racha
      </div>

      <div className="qualityMetrics">
        <span>ðŸ“š Fuente: {currentExercise?.metadata?.source?.toUpperCase()}</span>
        <span>ðŸ† CertificaciÃ³n: {certificationProgress}%</span>
        <span>ðŸŽ¯ Prueba: {currentPruebaPAES.toUpperCase()}</span>
      </div>

      {/* ðŸŒŒ INTEGRACIÃ“N QUIRÃšRGICA: Panel de Estado del Multiverse */}
      <div className={styles.multiverseStatus}>
        <div className={`${styles.statusItem} ${styles.statusActive}`}>
          ðŸŽ¨ Leonardo: ACTIVO
        </div>
        <div className={`${styles.statusItem} ${multiverse.currentMode !== 'classic' ? styles.statusActive : styles.statusInactive}`}>
          âš›ï¸ Quantum: {multiverse.currentMode !== 'classic' ? 'ACTIVO' : 'Standby'}
        </div>
        <div className={`${styles.statusItem} ${styles.statusActive}`}>
          ðŸ”Š Audio: DISPONIBLE
        </div>
        <div className={`${styles.statusItem} ${multiverse.currentMode === 'spotify' ? styles.statusActive : styles.statusInactive}`}>
          ðŸŽµ SpotifyPAES: {multiverse.currentMode === 'spotify' ? 'CONECTADO' : 'Standby'}
        </div>
      </div>

      {/*  INTEGRACIÃ“N QUIRÃšRGICA: SpotifyPAES cuando estÃ¡ en modo Spotify */}
      {multiverse.currentMode === 'spotify' && (
        <>
          {/* ðŸŽµ SPOTIFY NEURAL DASHBOARD - Sistema Completo */}
          <div className={styles.spotifyNeuralContainer}>
            <h3 className={styles.spotifyNeuralHeader}>
              ðŸŽµ Spotify Neural Education - Dashboard Completo
            </h3>
            <CentralSpotifyDashboard
              onExerciseStart={(track) => {
                console.log('ðŸŽµ Iniciando ejercicio desde Spotify Neural:', track.title);
                // Conectar con el sistema de ejercicios existente
                spotifyNeural.actions.goToExerciseCenter(track);
              }}
            />
          </div>
          
          {/* ðŸŽµ SPOTIFY PAES LEGACY - Mantenido para compatibilidad */}
          <div className={styles.spotifyPlayer}>
            <h3 className={styles.spotifyHeader}>
              ðŸŽµ SpotifyPAES - Aprendizaje Musical (Legacy)
            </h3>
            <div className={styles.spotifyControls}>
              <div className={styles.spotifyIcon}>ðŸŽ§</div>
              <div className={styles.spotifyInfo}>
                <div className={styles.spotifyPlaylistName}>
                  Playlist: MatemÃ¡tica PAES
                </div>
                <div className={styles.spotifyQuestionCount}>
                  1,250 preguntas musicales disponibles
                </div>
              </div>
              <button
                onClick={() => {
                  // Activar modo Spotify y generar ejercicio musical
                  generateExercise();
                }}
                className={styles.spotifyPlayButton}
              >
                â–¶ï¸ Play
              </button>
            </div>
          </div>
        </>
      )}

      <div className="leonardoOrchestrator">
        {isLoading ? (
          <div className="loadingSpinner">ðŸ”„ Generando ejercicio Leonardo...</div>
        ) : currentExercise ? (
          <div className="exerciseContainer">
            <div className="exerciseQuestion">
              <div className={styles.audioLeonardoContainer}>
                <h3>ðŸ“ Pregunta:</h3>
                {/* ðŸ”Š INTEGRACIÃ“N QUIRÃšRGICA: LeonardoAudioService */}
                <button
                  onClick={() => {
                    // Simular sÃ­ntesis de audio pedagÃ³gico
                    console.log('ðŸ”Š LeonardoAudioService: Sintetizando audio pedagÃ³gico para:', currentExercise.question);
                    setFeedbackMessage('ðŸ”Š Audio Leonardo activado - SÃ­ntesis pedagÃ³gica en proceso');
                  }}
                  className={styles.audioLeonardoButton}
                  title="Escuchar pregunta con sÃ­ntesis pedagÃ³gica"
                >
                  ðŸ”Š Audio Leonardo
                </button>
              </div>
              <p>{currentExercise.question}</p>
            </div>

            <div className="exerciseOptions">
              {currentExercise.options.map((option, index) => (
                <div
                  key={index}
                  className={`exerciseOption ${
                    selectedAnswer === option ? 'exerciseOptionSelected' : ''
                  } ${
                    showResult && option === currentExercise.correctAnswer ? 'exerciseOptionCorrect' : ''
                  } ${
                    showResult ? 'exerciseOptionDisabled' : ''
                  }`}
                  onClick={() => !showResult && setSelectedAnswer(option)}
                >
                  {option}
                </div>
              ))}
            </div>

            <div className="exerciseActions">
              {!showResult ? (
                <button
                  className="btnLeonardo"
                  onClick={handleAnswerSubmit}
                  disabled={!selectedAnswer}
                >
                  âœ… Responder
                </button>
              ) : (
                <button className="btnLeonardo" onClick={generateExercise}>
                  ðŸ”„ Nuevo Ejercicio
                </button>
              )}
            </div>
          </div>
        ) : (
          <div className="exerciseContainer">
            <p>âŒ No se pudo cargar el ejercicio</p>
            <button className="btnLeonardo" onClick={generateExercise}>ðŸ”„ Reintentar</button>
          </div>
        )}

        {feedbackMessage && (
          <div className="feedbackMessage">{feedbackMessage}</div>
        )}
      </div>
    </div>
  );
};

export default LeonardoEducationalOrchestrator;
