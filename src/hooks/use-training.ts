
import { useState, useCallback, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { useLearningNodes } from '@/hooks/use-learning-nodes';
import { usePAESData } from '@/hooks/use-paes-data';
import { generateExercisesBatch } from '@/services/openrouter/exercise-generation';
import { Exercise } from '@/types/ai-types';

export interface TrainingSession {
  id: string;
  userId: string;
  exerciseType: 'personalizado' | 'simulacion' | 'dirigido';
  startTime: Date;
  endTime?: Date;
  exercisesCompleted: number;
  correctAnswers: number;
  totalExercises: number;
  averageTime: number;
  skillsFocused: string[];
}

export interface TrainingStats {
  totalSessions: number;
  totalExercises: number;
  correctAnswers: number;
  averageAccuracy: number;
  timeSpent: number; // en minutos
  streakDays: number;
  weeklyGoal: number;
  weeklyProgress: number;
}

export const useTraining = () => {
  const { profile } = useAuth();
  const { nodeProgress } = useLearningNodes();
  const { skills } = usePAESData();
  
  const [currentSession, setCurrentSession] = useState<TrainingSession | null>(null);
  const [exercises, setExercises] = useState<Exercise[]>([]);
  const [currentExerciseIndex, setCurrentExerciseIndex] = useState(0);
  const [sessionStats, setSessionStats] = useState<TrainingStats>({
    totalSessions: 12,
    totalExercises: 247,
    correctAnswers: 189,
    averageAccuracy: 76.5,
    timeSpent: 1240, // minutos
    streakDays: 5,
    weeklyGoal: 300,
    weeklyProgress: 187
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Generar ejercicios personalizados basados en debilidades
  const generatePersonalizedExercises = useCallback(async (count: number = 10) => {
    if (!profile?.id) return;
    
    setLoading(true);
    setError(null);
    
    try {
      // Identificar habilidades con menor rendimiento
      const weakSkills = skills
        .filter(skill => skill.performance < 70)
        .sort((a, b) => a.performance - b.performance)
        .slice(0, 3);

      if (weakSkills.length === 0) {
        // Si no hay debilidades claras, usar habilidades aleatorias
        const randomSkill = skills[Math.floor(Math.random() * skills.length)];
        const exercisesBatch = await generateExercisesBatch(
          `node-${randomSkill.id}`,
          randomSkill.name,
          randomSkill.testId,
          count,
          'INTERMEDIATE'
        );
        setExercises(exercisesBatch);
      } else {
        // Generar ejercicios para las habilidades más débiles
        const allExercises: Exercise[] = [];
        const exercisesPerSkill = Math.ceil(count / weakSkills.length);
        
        for (const skill of weakSkills) {
          const exercisesBatch = await generateExercisesBatch(
            `node-${skill.id}`,
            skill.name,
            skill.testId,
            exercisesPerSkill,
            'INTERMEDIATE'
          );
          allExercises.push(...exercisesBatch);
        }
        
        // Mezclar y limitar al número solicitado
        const shuffled = allExercises.sort(() => Math.random() - 0.5);
        setExercises(shuffled.slice(0, count));
      }
      
    } catch (err) {
      console.error('Error generating personalized exercises:', err);
      setError('Error al generar ejercicios personalizados');
    } finally {
      setLoading(false);
    }
  }, [profile?.id, skills]);

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
  }, [profile?.id, exercises.length]);

  // Finalizar sesión de entrenamiento
  const endTrainingSession = useCallback(() => {
    if (!currentSession) return;
    
    const endedSession = {
      ...currentSession,
      endTime: new Date()
    };
    
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

  // Responder ejercicio
  const answerExercise = useCallback((isCorrect: boolean) => {
    if (!currentSession) return;
    
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
  }, [currentSession, currentExerciseIndex, exercises.length, endTrainingSession]);

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
    startTrainingSession,
    endTrainingSession,
    answerExercise
  };
};
