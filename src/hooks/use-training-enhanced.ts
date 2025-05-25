
import { useState, useCallback, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { useLearningNodes } from '@/hooks/use-learning-nodes';
import { usePAESData } from '@/hooks/use-paes-data';
import { TrainingSession, TrainingStats } from '@/hooks/use-training';
import { fetchPAESExam, getRandomQuestionsFromPool, PAESQuestion } from '@/services/paes/paes-exam-service';

export interface PAESExercise {
  id: string;
  type: 'official-paes';
  question: PAESQuestion;
  source: string;
  difficulty: 'BASIC' | 'INTERMEDIATE' | 'ADVANCED';
}

export const useTrainingEnhanced = () => {
  const { profile } = useAuth();
  const { nodeProgress } = useLearningNodes();
  const { skills } = usePAESData();
  
  const [currentSession, setCurrentSession] = useState<TrainingSession | null>(null);
  const [exercises, setExercises] = useState<PAESExercise[]>([]);
  const [currentExerciseIndex, setCurrentExerciseIndex] = useState(0);
  const [sessionStats, setSessionStats] = useState<TrainingStats>({
    totalSessions: 12,
    totalExercises: 247,
    correctAnswers: 189,
    averageAccuracy: 76.5,
    timeSpent: 1240,
    streakDays: 5,
    weeklyGoal: 300,
    weeklyProgress: 187
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Generar ejercicios personalizados usando contenido oficial PAES
  const generatePersonalizedExercises = useCallback(async (count: number = 10) => {
    if (!profile?.id) return;
    
    setLoading(true);
    setError(null);
    
    try {
      console.log('🎯 Generating personalized exercises from official PAES content...');
      
      // Usar el examen oficial PAES 2024
      const examCode = 'PAES-2024-FORM-103';
      const randomQuestions = await getRandomQuestionsFromPool(examCode, count);
      
      // Convertir preguntas PAES a ejercicios
      const paesExercises: PAESExercise[] = randomQuestions.map((question, index) => ({
        id: `paes-${examCode}-${question.numero}-${Date.now()}-${index}`,
        type: 'official-paes',
        question,
        source: examCode,
        difficulty: 'INTERMEDIATE' // Podríamos inferir esto del contexto
      }));
      
      setExercises(paesExercises);
      console.log(`✅ Generated ${paesExercises.length} exercises from official PAES content`);
      
    } catch (err) {
      console.error('Error generating personalized exercises:', err);
      setError('Error al generar ejercicios personalizados');
    } finally {
      setLoading(false);
    }
  }, [profile?.id]);

  // Generar ejercicios de simulación usando examen completo
  const generateSimulationExercises = useCallback(async () => {
    if (!profile?.id) return;
    
    setLoading(true);
    setError(null);
    
    try {
      console.log('🎮 Generating simulation exercises from complete PAES exam...');
      
      const examCode = 'PAES-2024-FORM-103';
      const examData = await fetchPAESExam(examCode);
      
      if (!examData) {
        throw new Error('No se pudo cargar el examen oficial');
      }
      
      // Usar todas las preguntas para simulación completa
      const simulationExercises: PAESExercise[] = examData.preguntas.map((question, index) => ({
        id: `simulation-${examCode}-${question.numero}-${Date.now()}`,
        type: 'official-paes',
        question,
        source: examCode,
        difficulty: 'INTERMEDIATE'
      }));
      
      setExercises(simulationExercises);
      console.log(`✅ Generated simulation with ${simulationExercises.length} official questions`);
      
    } catch (err) {
      console.error('Error generating simulation exercises:', err);
      setError('Error al generar simulación');
    } finally {
      setLoading(false);
    }
  }, [profile?.id]);

  // Iniciar sesión de entrenamiento
  const startTrainingSession = useCallback((type: 'personalizado' | 'simulacion' | 'dirigido') => {
    if (!profile?.id) return;
    
    const session: TrainingSession = {
      id: `session-${Date.now()}`,
      userId: profile.id,
      exerciseType: type,
      startTime: new Date(),
      exercisesCompleted: 0,
      correctAnswers: 0,
      totalExercises: exercises.length,
      averageTime: 0,
      skillsFocused: []
    };
    
    setCurrentSession(session);
    setCurrentExerciseIndex(0);
    console.log(`🚀 Started ${type} training session with ${exercises.length} exercises`);
  }, [profile?.id, exercises.length]);

  // Responder ejercicio oficial PAES
  const answerExercise = useCallback((selectedOption: string) => {
    if (!currentSession || currentExerciseIndex >= exercises.length) return;
    
    const currentExercise = exercises[currentExerciseIndex];
    const correctOption = currentExercise.question.opciones.find(opt => opt.es_correcta);
    const isCorrect = selectedOption === correctOption?.letra;
    
    console.log(`📝 Answer: ${selectedOption}, Correct: ${correctOption?.letra}, Result: ${isCorrect ? '✅' : '❌'}`);
    
    setCurrentSession(prev => prev ? {
      ...prev,
      exercisesCompleted: prev.exercisesCompleted + 1,
      correctAnswers: prev.correctAnswers + (isCorrect ? 1 : 0)
    } : null);
    
    // Avanzar al siguiente ejercicio
    if (currentExerciseIndex < exercises.length - 1) {
      setCurrentExerciseIndex(prev => prev + 1);
    } else {
      // Sesión completada
      endTrainingSession();
    }
    
    return { isCorrect, correctAnswer: correctOption?.letra };
  }, [currentSession, currentExerciseIndex, exercises]);

  // Finalizar sesión de entrenamiento
  const endTrainingSession = useCallback(() => {
    if (!currentSession) return;
    
    const endedSession = {
      ...currentSession,
      endTime: new Date()
    };
    
    console.log('🏁 Training session completed:', {
      completed: endedSession.exercisesCompleted,
      correct: endedSession.correctAnswers,
      accuracy: (endedSession.correctAnswers / endedSession.exercisesCompleted) * 100
    });
    
    // Actualizar estadísticas
    setSessionStats(prev => ({
      ...prev,
      totalSessions: prev.totalSessions + 1,
      totalExercises: prev.totalExercises + endedSession.exercisesCompleted,
      correctAnswers: prev.correctAnswers + endedSession.correctAnswers,
      averageAccuracy: ((prev.correctAnswers + endedSession.correctAnswers) / (prev.totalExercises + endedSession.exercisesCompleted)) * 100,
      timeSpent: prev.timeSpent + Math.ceil((endedSession.endTime!.getTime() - endedSession.startTime.getTime()) / 60000)
    }));
    
    setCurrentSession(null);
    setExercises([]);
    setCurrentExerciseIndex(0);
  }, [currentSession]);

  return {
    // Estados
    currentSession,
    exercises,
    currentExercise: exercises[currentExerciseIndex] || null,
    currentExerciseIndex,
    sessionStats,
    loading,
    error,
    
    // Acciones
    generatePersonalizedExercises,
    generateSimulationExercises,
    startTrainingSession,
    endTrainingSession,
    answerExercise
  };
};
