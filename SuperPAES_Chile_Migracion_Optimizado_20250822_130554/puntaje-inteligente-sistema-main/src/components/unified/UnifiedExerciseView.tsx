/**
 * 🎯 UNIFIED EXERCISE VIEW
 * Componente unificado que reemplaza todos los sistemas fragmentados de visualización
 * Resuelve el problema de textos faltantes y unifica la presentación
 */

import React, { useState, useEffect } from 'react';
import { useUnifiedExerciseSystem, useCompetenciaLectoraExercises } from '../../hooks/useUnifiedExerciseSystem';
import { UnifiedExercise } from '../../core/UnifiedExerciseOrchestrator';
import { QuantumMarble } from '../../core/QuantumMarbleOrchestrator';

// 🎯 PROPS DEL COMPONENTE
interface UnifiedExerciseViewProps {
  prueba?: UnifiedExercise['prueba'];
  skill?: string;
  difficulty?: UnifiedExercise['difficulty'];
  autoGenerate?: boolean;
  showControls?: boolean;
  className?: string;
}

// 🎯 COMPONENTE PRINCIPAL
export const UnifiedExerciseView: React.FC<UnifiedExerciseViewProps> = ({
  prueba = 'COMPETENCIA_LECTORA',
  skill = 'INTERPRET_RELATE',
  difficulty = 'INTERMEDIATE',
  autoGenerate = true,
  showControls = true,
  className = ''
}) => {
  const [selectedAnswer, setSelectedAnswer] = useState<string | null>(null);
  const [showExplanation, setShowExplanation] = useState(false);
  const [isCorrect, setIsCorrect] = useState<boolean | null>(null);

  // 🎯 USAR SISTEMA UNIFICADO
  const exerciseSystem = useUnifiedExerciseSystem();
  const competenciaLectoraSystem = useCompetenciaLectoraExercises();

  // 🎯 GENERAR EJERCICIO AUTOMÁTICAMENTE
  useEffect(() => {
    if (autoGenerate && !exerciseSystem.currentExercise) {
      if (prueba === 'COMPETENCIA_LECTORA') {
        competenciaLectoraSystem.generateCompetenciaLectoraExercise(skill, difficulty);
      } else {
        exerciseSystem.generateExercise(prueba, skill, difficulty);
      }
    }
  }, [autoGenerate, prueba, skill, difficulty, exerciseSystem, competenciaLectoraSystem]);

  // 🎯 MANEJAR SELECCIÓN DE RESPUESTA
  const handleAnswerSelect = (answer: string) => {
    setSelectedAnswer(answer);
    setIsCorrect(answer === exerciseSystem.currentExercise?.correctAnswer);
    setShowExplanation(true);

    // 🎯 SINCRONIZAR CON QUANTUM MARBLE
    QuantumMarble.setState('exercise_answer_selected', {
      exerciseId: exerciseSystem.currentExercise?.id,
      selectedAnswer: answer,
      isCorrect: answer === exerciseSystem.currentExercise?.correctAnswer,
      timestamp: Date.now()
    });
  };

  // 🎯 GENERAR NUEVO EJERCICIO
  const handleGenerateNew = () => {
    setSelectedAnswer(null);
    setShowExplanation(false);
    setIsCorrect(null);

    if (prueba === 'COMPETENCIA_LECTORA') {
      competenciaLectoraSystem.generateCompetenciaLectoraExercise(skill, difficulty);
    } else {
      exerciseSystem.generateExercise(prueba, skill, difficulty);
    }
  };

  // 🎯 RENDERIZAR ESTADO DE CARGA
  if (exerciseSystem.isLoading) {
    return (
      <div className={`unified-exercise-view loading ${className}`}>
        <div className="loading-spinner">
          <div className="spinner"></div>
          <p>🎯 Generando ejercicio unificado...</p>
        </div>
      </div>
    );
  }

  // 🎯 RENDERIZAR ERROR
  if (exerciseSystem.error) {
    return (
      <div className={`unified-exercise-view error ${className}`}>
        <div className="error-message">
          <h3>❌ Error en el Sistema Unificado</h3>
          <p>{exerciseSystem.error}</p>
          <button onClick={handleGenerateNew} className="retry-button">
            🔄 Reintentar
          </button>
        </div>
      </div>
    );
  }

  // 🎯 RENDERIZAR EJERCICIO
  const exercise = exerciseSystem.currentExercise;
  if (!exercise) {
    return (
      <div className={`unified-exercise-view empty ${className}`}>
        <div className="empty-state">
          <h3>🎯 Sistema Unificado de Ejercicios</h3>
          <p>No hay ejercicio cargado. Genera uno nuevo para comenzar.</p>
          <button onClick={handleGenerateNew} className="generate-button">
            🚀 Generar Ejercicio
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className={`unified-exercise-view ${className}`}>
      {/* 🎯 HEADER DEL EJERCICIO */}
      <div className="exercise-header">
        <div className="exercise-meta">
          <span className="prueba-badge">{exercise.prueba}</span>
          <span className="skill-badge">{exercise.skill}</span>
          <span className="difficulty-badge">{exercise.difficulty}</span>
        </div>
        <div className="exercise-id">
          ID: {exercise.id}
        </div>
      </div>

      {/* 🎯 TEXTO DE LECTURA (OBLIGATORIO) */}
      {exercise.text && (
        <div className="exercise-text">
          <h4>📖 Texto de Lectura</h4>
          <div className="text-content">
            {exercise.text}
          </div>
        </div>
      )}

      {/* 🎯 CONTEXTO ADICIONAL (OPCIONAL) */}
      {exercise.context && (
        <div className="exercise-context">
          <h4>📋 Contexto Adicional</h4>
          <div className="context-content">
            {exercise.context}
          </div>
        </div>
      )}

      {/* 🎯 PREGUNTA */}
      <div className="exercise-question">
        <h4>❓ Pregunta</h4>
        <div className="question-content">
          {exercise.question}
        </div>
      </div>

      {/* 🎯 OPCIONES DE RESPUESTA */}
      <div className="exercise-options">
        <h4>🔤 Opciones de Respuesta</h4>
        <div className="options-grid">
          {exercise.options.map((option, index) => {
            const optionLetter = String.fromCharCode(65 + index); // A, B, C, D...
            const isSelected = selectedAnswer === option;
            const isCorrectAnswer = option === exercise.correctAnswer;
            
            let optionClass = 'option';
            if (isSelected) {
              optionClass += isCorrect ? ' selected correct' : ' selected incorrect';
            }
            if (showExplanation && isCorrectAnswer) {
              optionClass += ' correct-answer';
            }

            return (
              <button
                key={index}
                className={optionClass}
                onClick={() => handleAnswerSelect(option)}
                disabled={showExplanation}
              >
                <span className="option-letter">{optionLetter}</span>
                <span className="option-text">{option}</span>
                {showExplanation && isCorrectAnswer && (
                  <span className="correct-indicator">✅</span>
                )}
                {showExplanation && isSelected && !isCorrect && (
                  <span className="incorrect-indicator">❌</span>
                )}
              </button>
            );
          })}
        </div>
      </div>

      {/* 🎯 EXPLICACIÓN */}
      {showExplanation && (
        <div className="exercise-explanation">
          <h4>💡 Explicación</h4>
          <div className="explanation-content">
            <div className={`result-badge ${isCorrect ? 'correct' : 'incorrect'}`}>
              {isCorrect ? '✅ Correcto' : '❌ Incorrecto'}
            </div>
            <p>{exercise.explanation}</p>
          </div>
        </div>
      )}

      {/* 🎯 CONTROLES */}
      {showControls && (
        <div className="exercise-controls">
          <button 
            onClick={handleGenerateNew}
            className="new-exercise-button"
          >
            🚀 Nuevo Ejercicio
          </button>
          
          <button 
            onClick={() => exerciseSystem.clearHistory()}
            className="clear-history-button"
          >
            🗑️ Limpiar Historial
          </button>
        </div>
      )}

      {/* 🎯 METADATOS */}
      <div className="exercise-metadata">
        <div className="metadata-item">
          <span className="label">Tiempo estimado:</span>
          <span className="value">{exercise.metadata?.estimatedTime || 90}s</span>
        </div>
        <div className="metadata-item">
          <span className="label">Nivel Bloom:</span>
          <span className="value">{exercise.metadata?.bloomLevel || 'COMPRENDER'}</span>
        </div>
        <div className="metadata-item">
          <span className="label">Fuente:</span>
          <span className="value">{exercise.source}</span>
        </div>
      </div>

      {/* 🎯 ESTADO DEL SISTEMA */}
      <div className="system-status">
        <div className="status-item">
          <span className="label">Cache:</span>
          <span className="value">{exerciseSystem.orchestratorState.cacheSize} ejercicios</span>
        </div>
        <div className="status-item">
          <span className="label">Plantillas:</span>
          <span className="value">{exerciseSystem.orchestratorState.textTemplatesCount} disponibles</span>
        </div>
      </div>
    </div>
  );
};

// 🎯 COMPONENTE ESPECÍFICO PARA COMPETENCIA LECTORA
export const CompetenciaLectoraView: React.FC<Omit<UnifiedExerciseViewProps, 'prueba'>> = (props) => {
  return <UnifiedExerciseView {...props} prueba="COMPETENCIA_LECTORA" />;
};

// 🎯 COMPONENTE ESPECÍFICO PARA MATEMÁTICA
export const MatematicaView: React.FC<Omit<UnifiedExerciseViewProps, 'prueba'>> = (props) => {
  return <UnifiedExerciseView {...props} prueba="MATEMATICA_1" />;
};

// 🎯 COMPONENTE ESPECÍFICO PARA CIENCIAS
export const CienciasView: React.FC<Omit<UnifiedExerciseViewProps, 'prueba'>> = (props) => {
  return <UnifiedExerciseView {...props} prueba="CIENCIAS" />;
};

export default UnifiedExerciseView;
