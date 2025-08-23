import React, { useState, useEffect } from 'react';
import {
  CheckCircle,
  XCircle,
  ArrowRight,
  BookOpen,
  Target,
  Brain,
  Clock,
  Award,
  RefreshCw,
  Play,
  BarChart3,
  Zap,
  TrendingUp
} from 'lucide-react';
import {
  PAESExercise,
  PAES_EXERCISES,
  BLOOM_LEVELS,
  calculateScore,
  getBloomLevelInfo
} from '../data/paes-exercises';
import { exerciseService } from '../services/ExerciseService';
import { integratedSystemService } from '../services/IntegratedSystemService';
import { NeuralPredictionService } from '../services/NeuralPredictionService';

interface ExerciseSystemProps {
  subject?: string;
  bloomLevel?: string;
  difficulty?: string;
  onComplete?: (score: number, totalQuestions: number) => void;
}

export const ExerciseSystem: React.FC<ExerciseSystemProps> = ({
  subject,
  bloomLevel,
  difficulty,
  onComplete
}) => {
  const [currentExercise, setCurrentExercise] = useState<PAESExercise | null>(null);
  const [selectedAnswer, setSelectedAnswer] = useState<'A' | 'B' | 'C' | 'D' | null>(null);
  const [isAnswered, setIsAnswered] = useState(false);
  const [isCorrect, setIsCorrect] = useState(false);
  const [showExplanation, setShowExplanation] = useState(false);
  const [score, setScore] = useState(0);
  const [totalQuestions, setTotalQuestions] = useState(0);
  const [timeLeft, setTimeLeft] = useState(60);
  const [isTimerRunning, setIsTimerRunning] = useState(false);
  const [exerciseHistory, setExerciseHistory] = useState<PAESExercise[]>([]);
  const [neuralMetrics, setNeuralMetrics] = useState<any>(null);
  const [quantumState, setQuantumState] = useState<any>(null);

  // Generar ejercicio inicial
  useEffect(() => {
    generateNewExercise();
  }, [subject, bloomLevel, difficulty]);

  // Obtener métricas neurales y estado cuántico
  useEffect(() => {
    const updateNeuralMetrics = () => {
      const currentQuantumState = integratedSystemService.getQuantumState();
      const neuralService = NeuralPredictionService.getInstance();
      
      setQuantumState(currentQuantumState);
      
      // Calcular métricas basadas en el historial de ejercicios
      if (exerciseHistory.length > 0) {
        const recentPerformance = exerciseHistory.slice(-5).map(ex => ({
          score: ex.points || 0,
          difficulty: ex.difficulty,
          bloomLevel: ex.bloomLevel
        }));
        
        const metrics = {
          averageScore: recentPerformance.reduce((sum, p) => sum + p.score, 0) / recentPerformance.length,
          totalExercises: exerciseHistory.length,
          quantumCoherence: currentQuantumState.coherence,
          neuralFrequency: (currentQuantumState.coherence * 100).toFixed(1)
        };
        
        setNeuralMetrics(metrics);
      }
    };

    updateNeuralMetrics();
    const interval = setInterval(updateNeuralMetrics, 10000); // Actualizar cada 10 segundos
    
    return () => clearInterval(interval);
  }, [exerciseHistory]);

  // Timer para cada ejercicio
  useEffect(() => {
    let interval: NodeJS.Timeout;
    
    if (isTimerRunning && timeLeft > 0) {
      interval = setInterval(() => {
        setTimeLeft(prev => {
          if (prev <= 1) {
            handleTimeUp();
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    }

    return () => clearInterval(interval);
  }, [isTimerRunning, timeLeft]);

  const generateNewExercise = async () => {
    const filters: any = {};
    if (subject) filters.subject = subject;
    if (bloomLevel) filters.bloomLevel = bloomLevel;
    if (difficulty) filters.difficulty = difficulty;

    try {
      const newExercise = await exerciseService.getRandomExercise(filters);
      if (newExercise) {
        // Convertir SupabaseExercise a PAESExercise
        const paesExercise: PAESExercise = {
          id: newExercise.id,
          subject: newExercise.subject as any,
          topic: newExercise.topic,
          difficulty: newExercise.difficulty as any,
          bloomLevel: newExercise.bloom_level as any,
          question: newExercise.question,
          contextText: newExercise.context_text,
          contextImage: newExercise.context_image,
          contextFormula: newExercise.context_formula,
          alternatives: newExercise.options,
          correctAnswer: newExercise.correct_answer as any,
          explanation: newExercise.explanation,
          explanationFormula: newExercise.explanation_formula,
          tags: newExercise.tags,
          points: newExercise.points
        };
        
        setCurrentExercise(paesExercise);
        setSelectedAnswer(null);
        setIsAnswered(false);
        setIsCorrect(false);
        setShowExplanation(false);
        setTimeLeft(60);
        setIsTimerRunning(true);
      }
    } catch (error) {
      console.error('Error generating new exercise:', error);
      // Fallback a ejercicios mock si hay error
      const mockExercise = PAES_EXERCISES[Math.floor(Math.random() * PAES_EXERCISES.length)];
      setCurrentExercise(mockExercise);
    }
  };

  const handleAnswerSelect = (answer: 'A' | 'B' | 'C' | 'D') => {
    if (isAnswered) return;
    
    setSelectedAnswer(answer);
    setIsAnswered(true);
    setIsTimerRunning(false);
    
    const correct = answer === currentExercise?.correctAnswer;
    setIsCorrect(correct);
    
    if (correct) {
      setScore(prev => prev + (currentExercise?.points || 0));
    }
    
    setTotalQuestions(prev => prev + 1);
    
    if (currentExercise) {
      setExerciseHistory(prev => [...prev, currentExercise]);
    }

    // Integrar con sistema neural
    if (currentExercise) {
      const neuralService = NeuralPredictionService.getInstance();
      const performance = {
        exerciseId: currentExercise.id,
        score: correct ? currentExercise.points : 0,
        difficulty: currentExercise.difficulty,
        bloomLevel: currentExercise.bloomLevel,
        subject: currentExercise.subject,
        timestamp: new Date().toISOString()
      };

      // Actualizar métricas neurales
      neuralService.updateNeuralModel('user-001', performance);
    }
  };

  const handleTimeUp = () => {
    if (!isAnswered) {
      setIsAnswered(true);
      setIsCorrect(false);
      setTotalQuestions(prev => prev + 1);
      setIsTimerRunning(false);
    }
  };

  const handleNextExercise = () => {
    generateNewExercise();
  };

  const handleFinishSession = () => {
    if (onComplete) {
      onComplete(score, totalQuestions);
    }
  };

  const getBloomLevelColor = (bloomLevel: string) => {
    const level = getBloomLevelInfo(bloomLevel);
    return level?.color || '#6b7280';
  };

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case 'Básico': return '#10b981';
      case 'Intermedio': return '#f59e0b';
      case 'Avanzado': return '#ef4444';
      case 'Excelencia': return '#8b5cf6';
      default: return '#6b7280';
    }
  };

  if (!currentExercise) {
    return (
      <div className="exercise-loading">
        <div className="loading-spinner"></div>
        <p>Cargando ejercicio...</p>
      </div>
    );
  }

  return (
    <div className="exercise-system">
      {/* Header del ejercicio */}
      <div className="exercise-header">
        <div className="exercise-info">
          <div className="exercise-subject">
            <BookOpen className="w-4 h-4" />
            <span>{currentExercise.subject}</span>
          </div>
          <div className="exercise-topic">
            <Target className="w-4 h-4" />
            <span>{currentExercise.topic}</span>
          </div>
        </div>
        
        <div className="exercise-meta">
          <div 
            className="bloom-level-badge"
            style={{ backgroundColor: getBloomLevelColor(currentExercise.bloomLevel) }}
          >
            <Brain className="w-3 h-3" />
            <span>{currentExercise.bloomLevel}</span>
          </div>
          <div 
            className="difficulty-badge"
            style={{ backgroundColor: getDifficultyColor(currentExercise.difficulty) }}
          >
            <span>{currentExercise.difficulty}</span>
          </div>
          <div className="points-badge">
            <Award className="w-3 h-3" />
            <span>{currentExercise.points} pts</span>
          </div>
        </div>
      </div>

      {/* Timer */}
      <div className="exercise-timer">
        <Clock className="w-4 h-4" />
        <span className={timeLeft <= 10 ? 'time-warning' : ''}>
          {Math.floor(timeLeft / 60)}:{(timeLeft % 60).toString().padStart(2, '0')}
        </span>
      </div>

             {/* Contexto Multimedia */}
       {(currentExercise.contextText || currentExercise.contextImage || currentExercise.contextFormula) && (
         <div className="exercise-context">
           <div className="context-header">
             <BookOpen className="w-4 h-4" />
             <span>Contexto</span>
           </div>
           
           {/* Texto de Contexto */}
           {currentExercise.contextText && (
             <div className="context-text">
               {currentExercise.contextText}
             </div>
           )}
           
           {/* Fórmula de Contexto */}
           {currentExercise.contextFormula && (
             <div className="context-formula">
               <div className="formula-header">
                 <Target className="w-4 h-4" />
                 <span>Fórmula</span>
               </div>
               <div className="formula-content">
                 {currentExercise.contextFormula}
               </div>
             </div>
           )}
           
           {/* Imagen de Contexto */}
           {currentExercise.contextImage && (
             <div className="context-image">
               <img 
                 src={currentExercise.contextImage} 
                 alt="Contexto visual" 
                 className="context-img"
               />
             </div>
           )}
         </div>
       )}

      {/* Pregunta */}
      <div className="exercise-question">
        <h3>{currentExercise.question}</h3>
      </div>

      {/* Alternativas */}
      <div className="exercise-alternatives">
        {(['A', 'B', 'C', 'D'] as const).map((option) => (
          <button
            key={option}
            className={`alternative-btn ${
              selectedAnswer === option ? 'selected' : ''
            } ${
              isAnswered && option === currentExercise.correctAnswer ? 'correct' : ''
            } ${
              isAnswered && selectedAnswer === option && option !== currentExercise.correctAnswer ? 'incorrect' : ''
            }`}
            onClick={() => handleAnswerSelect(option)}
            disabled={isAnswered}
          >
            <span className="alternative-letter">{option}</span>
            <span className="alternative-text">{currentExercise.alternatives[option]}</span>
            {isAnswered && option === currentExercise.correctAnswer && (
              <CheckCircle className="w-5 h-5 correct-icon" />
            )}
            {isAnswered && selectedAnswer === option && option !== currentExercise.correctAnswer && (
              <XCircle className="w-5 h-5 incorrect-icon" />
            )}
          </button>
        ))}
      </div>

             {/* Explicación */}
       {isAnswered && (
         <div className="exercise-explanation">
           <h4>Explicación:</h4>
           <p>{currentExercise.explanation}</p>
           
           {/* Fórmula en la Explicación */}
           {currentExercise.explanationFormula && (
             <div className="explanation-formula">
               <div className="formula-header">
                 <Target className="w-4 h-4" />
                 <span>Fórmula</span>
               </div>
               <div className="formula-content">
                 {currentExercise.explanationFormula}
               </div>
             </div>
           )}
           
           <div className="bloom-explanation">
             <h5>Taxonomía de Bloom - {currentExercise.bloomLevel}</h5>
             <p>{getBloomLevelInfo(currentExercise.bloomLevel)?.description}</p>
             <div className="bloom-verbs">
               <strong>Verbos clave:</strong> {getBloomLevelInfo(currentExercise.bloomLevel)?.verbs.join(', ')}
             </div>
           </div>
         </div>
       )}

      {/* Estadísticas */}
      <div className="exercise-stats">
        <div className="stat-item">
          <BarChart3 className="w-4 h-4" />
          <span>Puntuación: {score} pts</span>
        </div>
        <div className="stat-item">
          <Target className="w-4 h-4" />
          <span>Preguntas: {totalQuestions}</span>
        </div>
        <div className="stat-item">
          <Award className="w-4 h-4" />
          <span>Promedio: {totalQuestions > 0 ? Math.round(score / totalQuestions) : 0} pts</span>
        </div>
      </div>

      {/* Métricas Neurales */}
      {neuralMetrics && (
        <div className="exercise-neural-metrics">
          <div className="neural-metrics-header">
            <Brain className="w-5 h-5" />
            <h4>Métricas Neurales</h4>
          </div>
          <div className="neural-metrics-grid">
            <div className="neural-metric">
              <Zap className="w-4 h-4" />
              <span>Frecuencia Neural: {neuralMetrics.neuralFrequency}%</span>
            </div>
            <div className="neural-metric">
              <TrendingUp className="w-4 h-4" />
              <span>Promedio: {neuralMetrics.averageScore?.toFixed(1) || 0} pts</span>
            </div>
            <div className="neural-metric">
              <Target className="w-4 h-4" />
              <span>Total: {neuralMetrics.totalExercises} ejercicios</span>
            </div>
            {quantumState && (
              <div className="neural-metric">
                <Brain className="w-4 h-4" />
                <span>Coherencia: {(quantumState.coherence * 100).toFixed(1)}%</span>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Botones de acción */}
      <div className="exercise-actions">
        {isAnswered ? (
          <>
            <button className="btn-secondary" onClick={handleNextExercise}>
              <RefreshCw className="w-4 h-4" />
              Siguiente Ejercicio
            </button>
            <button className="btn-primary" onClick={handleFinishSession}>
              <Award className="w-4 h-4" />
              Finalizar Sesión
            </button>
          </>
        ) : (
          <button className="btn-primary" onClick={() => handleTimeUp()}>
            <Clock className="w-4 h-4" />
            Terminar Tiempo
          </button>
        )}
      </div>

      {/* Historial de ejercicios */}
      {exerciseHistory.length > 0 && (
        <div className="exercise-history">
          <h4>Ejercicios Completados:</h4>
          <div className="history-list">
            {exerciseHistory.slice(-5).map((exercise, index) => (
              <div key={index} className="history-item">
                <span className="history-subject">{exercise.subject}</span>
                <span className="history-bloom">{exercise.bloomLevel}</span>
                <span className="history-difficulty">{exercise.difficulty}</span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
