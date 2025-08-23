/* eslint-disable react-refresh/only-export-components */
// ðŸŒŒ LEARNING EXPERIENCE RENDERER
// Componente central del Educational Multiverse
// Renderiza ejercicios segÃºn los 5 Learning Modes: Classic, Spotify, Immersive, Diagnostic, Gamified

import React, { useEffect, useState } from 'react';
import { LearningExperience, LearningMode, AdaptiveLearningCompanion } from './useQuantum';
import { Exercise } from '../../types/ai-types';
import styles from './LearningExperienceRenderer.module.css';

interface LearningExperienceRendererProps {
  experience: LearningExperience;
  onModeSwitch: (mode: LearningMode) => void;
  onMetricsUpdate: (metrics: Partial<LearningExperience['adaptiveMetrics']>) => void;
}

export const LearningExperienceRenderer: React.FC<LearningExperienceRendererProps> = ({
  experience,
  onModeSwitch,
  onMetricsUpdate
}) => {
  const [isInteracting, setIsInteracting] = useState(false);
  const [startTime] = useState(Date.now());

  // Monitorear engagement del usuario
  useEffect(() => {
    const handleInteraction = () => {
      setIsInteracting(true);
      const timeSpent = (Date.now() - startTime) / 1000;
      
      // Calcular mÃ©tricas adaptativas
      const engagement = Math.min(100, (timeSpent / 60) * 100); // Basado en tiempo
      onMetricsUpdate({ engagement });
    };

    document.addEventListener('click', handleInteraction);
    document.addEventListener('keydown', handleInteraction);

    return () => {
      document.removeEventListener('click', handleInteraction);
      document.removeEventListener('keydown', handleInteraction);
    };
  }, [startTime, onMetricsUpdate]);

  const renderModeSelector = () => (
    <div className={styles.learningModeSelector}>
      <h3>ðŸŒŒ Educational Multiverse</h3>
      <div className={styles.modeButtons}>
        {(['classic', 'spotify', 'immersive', 'diagnostic', 'gamified'] as LearningMode[]).map(mode => (
          <button
            key={mode}
            className={`${styles.modeBtn} ${experience.mode === mode ? styles.active : ''}`}
            onClick={() => onModeSwitch(mode)}
          >
            {getModeIcon(mode)} {getModeLabel(mode)}
          </button>
        ))}
      </div>
    </div>
  );

  const renderCompanions = () => (
    <div className={styles.adaptiveCompanions}>
      {experience.companions.map(companion => (
        <div key={companion.id} className={`${styles.companion} ${styles[`priority${companion.priority.charAt(0).toUpperCase() + companion.priority.slice(1)}`]}`}>
          <div className={styles.companionIcon}>{getCompanionIcon(companion.type)}</div>
          <div className={styles.companionMessage}>{companion.message}</div>
          {companion.action && (
            <button className={styles.companionAction}>{companion.action}</button>
          )}
        </div>
      ))}
    </div>
  );

  const renderExerciseByMode = () => {
    switch (experience.mode) {
      case 'classic':
        return renderClassicMode();
      case 'spotify':
        return renderSpotifyMode();
      case 'immersive':
        return renderImmersiveMode();
      case 'diagnostic':
        return renderDiagnosticMode();
      case 'gamified':
        return renderGamifiedMode();
      default:
        return renderClassicMode();
    }
  };

  const renderClassicMode = () => (
    <div className={`${styles.learningMode} ${styles.classicMode}`}>
      <div className={styles.exerciseHeader}>
        <h2>ðŸ“š Modo ClÃ¡sico</h2>
        <div className={styles.bloomLevel}>Nivel Bloom: {experience.context.bloomLevel}</div>
      </div>
      <div className={styles.exerciseContent}>
        <div className={styles.question}>
          {experience.exercise.question || experience.exercise.text}
        </div>
        {experience.exercise.options && (
          <div className={styles.options}>
            {experience.exercise.options.map((option, index) => (
              <div key={index} className={styles.option}>
                <input type="radio" name="answer" id={`option-${index}`} />
                <label htmlFor={`option-${index}`}>{option}</label>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );

  const renderSpotifyMode = () => (
    <div className={`${styles.learningMode} ${styles.spotifyMode}`}>
      <div className={styles.spotifyHeader}>
        <h2>ðŸŽµ Modo Spotify Neural</h2>
        <div className={styles.audioControls}>
          {experience.audioEnabled && (
            <button className={styles.playAudio}>â–¶ï¸ Reproducir Audio</button>
          )}
        </div>
      </div>
      <div className={styles.spotifyContent}>
        <div className={styles.audioVisualization}>
          <div className={styles.soundWaves}>
            <div className={styles.wave}></div>
            <div className={styles.wave}></div>
            <div className={styles.wave}></div>
          </div>
        </div>
        <div className={styles.exerciseWithRhythm}>
          <div className={styles.questionSpotify}>
            {experience.exercise.question || experience.exercise.text}
          </div>
          {experience.exercise.options && (
            <div className={styles.optionsSpotify}>
              {experience.exercise.options.map((option, index) => (
                <div key={index} className={styles.optionSpotify}>
                  <div className={styles.optionBeat}></div>
                  <label>{option}</label>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );

  const renderImmersiveMode = () => (
    <div className={`${styles.learningMode} ${styles.immersiveMode}`}>
      <div className={styles.immersiveHeader}>
        <h2>ðŸŒ Modo Inmersivo 3D</h2>
        <div className={styles.immersionLevel}>Nivel: Ultra</div>
      </div>
      <div className={styles.immersiveContent}>
        <div className={styles.threeDSpace}>
          <div className={styles.floatingQuestion}>
            {experience.exercise.question || experience.exercise.text}
          </div>
          {experience.visualEnhanced && (
            <div className={styles.visualEnhancements}>
              <div className="particle-system"></div>
              <div className="holographic-ui"></div>
            </div>
          )}
        </div>
        {experience.exercise.options && (
          <div className={styles.options3d}>
            {experience.exercise.options.map((option, index) => (
              <div key={index} className={styles.option3d} data-rotation={index}>
                {option}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );

  const renderDiagnosticMode = () => (
    <div className={`${styles.learningMode} ${styles.diagnosticMode}`}>
      <div className={styles.diagnosticHeader}>
        <h2>ðŸ”¬ Modo DiagnÃ³stico</h2>
        <div className={styles.realTimeMetrics}>
          <div className={styles.metric}>
            <span>Engagement:</span>
            <div className={styles.metricBar}>
              <div
                className={styles.metricFill}
                data-width={experience.adaptiveMetrics.engagement}
              ></div>
            </div>
          </div>
          <div className={styles.metric}>
            <span>ComprensiÃ³n:</span>
            <div className={styles.metricBar}>
              <div
                className={styles.metricFill}
                data-width={experience.adaptiveMetrics.comprehension}
              ></div>
            </div>
          </div>
        </div>
      </div>
      <div className={styles.diagnosticContent}>
        <div className={styles.exerciseAnalysis}>
          <div className={styles.questionDiagnostic}>
            {experience.exercise.question || experience.exercise.text}
          </div>
          <div className={styles.cognitiveAnalysis}>
            <div className={styles.bloomIndicator}>
              Nivel Cognitivo: <span className={styles.bloomLevel}>{experience.context.bloomLevel}</span>
            </div>
            <div className={styles.difficultyIndicator}>
              Dificultad: <span className={styles.difficulty}>{experience.context.difficulty}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );

  const renderGamifiedMode = () => (
    <div className={`${styles.learningMode} ${styles.gamifiedMode}`}>
      <div className={styles.gamifiedHeader}>
        <h2>ðŸŽ® Modo Gamificado</h2>
        <div className={styles.gameStats}>
          <div>Puntos: 0</div>
          <div>Racha: 0</div>
          <div>Nivel: 1</div>
        </div>
      </div>
      <div className={styles.gamifiedContent}>
        <div className={styles.gameArena}>
          <div className={styles.questQuestion}>
            ðŸŽ¯ <strong>MisiÃ³n:</strong> {experience.exercise.question || experience.exercise.text}
          </div>
          {experience.exercise.options && (
            <div className={styles.optionsGame}>
              {experience.exercise.options.map((option, index) => (
                <div key={index} className={styles.optionGame}>
                  <div className={styles.optionCard}>
                    <div className={styles.cardFront}>{option}</div>
                    <div className={styles.cardBack}>?</div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
        <div className={styles.powerUps}>
          <button className={styles.powerUp}>ðŸ’¡ Pista</button>
          <button className={styles.powerUp}>â° Tiempo Extra</button>
          <button className={styles.powerUp}>ðŸ” AnÃ¡lisis</button>
        </div>
      </div>
    </div>
  );

  return (
    <div className={styles.learningExperienceRenderer}>
      {renderModeSelector()}
      {renderCompanions()}
      {renderExerciseByMode()}
    </div>
  );
};

// Funciones auxiliares
const getModeIcon = (mode: LearningMode): string => {
  const icons = {
    classic: 'ðŸ“š',
    spotify: 'ðŸŽµ',
    immersive: 'ðŸŒ',
    diagnostic: 'ðŸ”¬',
    gamified: 'ðŸŽ®'
  };
  return icons[mode];
};

const getModeLabel = (mode: LearningMode): string => {
  const labels = {
    classic: 'ClÃ¡sico',
    spotify: 'Spotify Neural',
    immersive: 'Inmersivo 3D',
    diagnostic: 'DiagnÃ³stico',
    gamified: 'Gamificado'
  };
  return labels[mode];
};

const getCompanionIcon = (type: AdaptiveLearningCompanion['type']): string => {
  const icons = {
    bloom: 'ðŸ§ ',
    audio: 'ðŸ”Š',
    visual: 'ðŸ‘ï¸',
    progress: 'ðŸ“Š',
    motivation: 'ðŸ’ª',
    spotify: 'ðŸŽµ',
    ocr: 'ðŸ“·'
  };
  return icons[type];
};

export default LearningExperienceRenderer;
