
import { useState, useCallback, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/integrations/supabase/client';
import { TrainingSession, TrainingStats } from '@/hooks/use-training';

export interface PAESExercise {
  id: string;
  type: 'official-paes';
  question: string;
  options: string[];
  correctAnswer: string;
  source: string;
  difficulty: 'BASIC' | 'INTERMEDIATE' | 'ADVANCED';
  explanation?: string;
}

export const useTrainingEnhanced = () => {
  const { user } = useAuth();
  
  const [currentSession, setCurrentSession] = useState<TrainingSession | null>(null);
  const [exercises, setExercises] = useState<PAESExercise[]>([]);
  const [currentExerciseIndex, setCurrentExerciseIndex] = useState(0);
  const [sessionStats, setSessionStats] = useState<TrainingStats>({
    totalSessions: 0,
    totalExercises: 0,
    correctAnswers: 0,
    averageAccuracy: 0,
    timeSpent: 0,
    streakDays: 0,
    weeklyGoal: 300,
    weeklyProgress: 0
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Cargar estadísticas reales del usuario
  useEffect(() => {
    if (user?.id) {
      loadRealStats();
    }
  }, [user?.id]);

  const loadRealStats = async () => {
    if (!user?.id) return;
    
    try {
      // Obtener intentos de ejercicios del usuario
      const { data: attempts, error } = await supabase
        .from('user_exercise_attempts')
        .select('created_at, is_correct, metadata')
        .eq('user_id', user.id);

      if (error) throw error;

      const totalExercises = attempts?.length || 0;
      const correctAnswers = attempts?.filter(a => a.is_correct).length || 0;
      const averageAccuracy = totalExercises > 0 ? (correctAnswers / totalExercises) * 100 : 0;

      // Calcular sesiones únicas (agrupa por día)
      const sessionDays = [...new Set(
        attempts?.map(a => new Date(a.created_at).toDateString()) || []
      )];
      const totalSessions = sessionDays.length;

      // Calcular tiempo de estudio (estimación: 2-3 min por ejercicio)
      const timeSpent = totalExercises * 2.5;

      // Calcular racha actual
      const today = new Date().toDateString();
      const yesterday = new Date(Date.now() - 24 * 60 * 60 * 1000).toDateString();
      const hasActivityToday = sessionDays.includes(today);
      const hasActivityYesterday = sessionDays.includes(yesterday);
      
      let streakDays = 0;
      if (hasActivityToday || hasActivityYesterday) {
        streakDays = 1;
        // Calcular racha completa
        const sortedDays = sessionDays.sort();
        for (let i = sortedDays.length - 2; i >= 0; i--) {
          const currDate = new Date(sortedDays[i + 1]);
          const prevDate = new Date(sortedDays[i]);
          const diffDays = Math.floor((currDate.getTime() - prevDate.getTime()) / (24 * 60 * 60 * 1000));
          
          if (diffDays === 1) {
            streakDays++;
          } else {
            break;
          }
        }
      }

      // Progreso semanal (últimos 7 días)
      const weekAgo = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000);
      const weeklyExercises = attempts?.filter(a => new Date(a.created_at) > weekAgo).length || 0;

      setSessionStats({
        totalSessions,
        totalExercises,
        correctAnswers,
        averageAccuracy: Math.round(averageAccuracy * 100) / 100,
        timeSpent: Math.round(timeSpent),
        streakDays,
        weeklyGoal: 300,
        weeklyProgress: Math.min(weeklyExercises * 5, 300) // 5 puntos por ejercicio
      });

      console.log('✅ Estadísticas reales cargadas:', {
        totalSessions,
        totalExercises,
        correctAnswers,
        averageAccuracy: Math.round(averageAccuracy),
        streakDays
      });

    } catch (err) {
      console.error('❌ Error loading real stats:', err);
    }
  };

  const generatePersonalizedExercises = useCallback(async (count: number = 10) => {
    if (!user?.id) return;
    
    setLoading(true);
    setError(null);
    
    try {
      console.log('🎯 Generating personalized exercises from real database...');
      
      // Obtener ejercicios reales del banco de preguntas
      const { data: preguntasData, error: preguntasError } = await supabase
        .from('banco_preguntas')
        .select(`
          id,
          codigo_pregunta,
          enunciado,
          nivel_dificultad,
          prueba_paes,
          competencia_especifica
        `)
        .eq('validada', true)
        .order('created_at', { ascending: false })
        .limit(count);

      if (preguntasError) throw preguntasError;

      // Obtener alternativas para cada pregunta
      const exercisesWithOptions = await Promise.all(
        (preguntasData || []).map(async (pregunta) => {
          const { data: alternativasData, error: alternativasError } = await supabase
            .from('alternativas_respuesta')
            .select('letra, contenido, es_correcta')
            .eq('pregunta_id', pregunta.id)
            .order('orden');

          if (alternativasError) {
            console.warn('⚠️ Error getting alternatives for question:', pregunta.id);
            return null;
          }

          const correctAnswer = alternativasData?.find(alt => alt.es_correcta)?.contenido || '';
          const options = alternativasData?.map(alt => alt.contenido) || [];

          return {
            id: pregunta.codigo_pregunta,
            type: 'official-paes' as const,
            question: pregunta.enunciado,
            options,
            correctAnswer,
            source: `Banco Oficial - ${pregunta.prueba_paes}`,
            difficulty: mapDifficultyLevel(pregunta.nivel_dificultad),
            explanation: `Ejercicio oficial de ${pregunta.competencia_especifica}`
          };
        })
      );

      const validExercises = exercisesWithOptions.filter(Boolean) as PAESExercise[];
      setExercises(validExercises);
      console.log(`✅ Generated ${validExercises.length} personalized exercises from real database`);
      
    } catch (err) {
      console.error('❌ Error generating personalized exercises:', err);
      setError('Error al generar ejercicios personalizados');
    } finally {
      setLoading(false);
    }
  }, [user?.id]);

  const generateSimulationExercises = useCallback(async () => {
    if (!user?.id) return;
    
    setLoading(true);
    setError(null);
    
    try {
      console.log('🎮 Generating simulation exercises from complete database...');
      
      // Obtener un conjunto balanceado de preguntas para simulación
      const { data: simulationData, error: simulationError } = await supabase
        .from('banco_preguntas')
        .select(`
          id,
          codigo_pregunta,
          enunciado,
          nivel_dificultad,
          prueba_paes,
          competencia_especifica
        `)
        .eq('validada', true)
        .limit(80); // Cantidad típica de un examen PAES

      if (simulationError) throw simulationError;

      // Obtener alternativas para cada pregunta
      const simulationExercises = await Promise.all(
        (simulationData || []).map(async (pregunta) => {
          const { data: alternativasData, error: alternativasError } = await supabase
            .from('alternativas_respuesta')
            .select('letra, contenido, es_correcta')
            .eq('pregunta_id', pregunta.id)
            .order('orden');

          if (alternativasError) return null;

          const correctAnswer = alternativasData?.find(alt => alt.es_correcta)?.contenido || '';
          const options = alternativasData?.map(alt => alt.contenido) || [];

          return {
            id: `simulation-${pregunta.codigo_pregunta}`,
            type: 'official-paes' as const,
            question: pregunta.enunciado,
            options,
            correctAnswer,
            source: `Simulación PAES - ${pregunta.prueba_paes}`,
            difficulty: mapDifficultyLevel(pregunta.nivel_dificultad),
            explanation: `Pregunta oficial de simulación - ${pregunta.competencia_especifica}`
          };
        })
      );

      const validSimulationExercises = simulationExercises.filter(Boolean) as PAESExercise[];
      setExercises(validSimulationExercises);
      console.log(`✅ Generated simulation with ${validSimulationExercises.length} official questions`);
      
    } catch (err) {
      console.error('❌ Error generating simulation exercises:', err);
      setError('Error al generar simulación');
    } finally {
      setLoading(false);
    }
  }, [user?.id]);

  const startTrainingSession = useCallback((type: 'personalizado' | 'simulacion' | 'dirigido') => {
    if (!user?.id) return;
    
    const session: TrainingSession = {
      id: `session-${Date.now()}`,
      userId: user.id,
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
    console.log(`🚀 Started ${type} training session with ${exercises.length} real exercises`);
  }, [user?.id, exercises.length]);

  const answerExercise = useCallback(async (selectedOption: string) => {
    if (!currentSession || currentExerciseIndex >= exercises.length || !user?.id) return;
    
    const currentExercise = exercises[currentExerciseIndex];
    const isCorrect = selectedOption === currentExercise.correctAnswer;
    
    console.log(`📝 Answer: ${selectedOption}, Correct: ${currentExercise.correctAnswer}, Result: ${isCorrect ? '✅' : '❌'}`);
    
    // Guardar el intento en la base de datos
    try {
      await supabase.from('user_exercise_attempts').insert({
        user_id: user.id,
        exercise_id: currentExercise.id,
        answer: selectedOption,
        is_correct: isCorrect,
        skill_type: 'TRAINING',
        metadata: JSON.stringify({
          session_id: currentSession.id,
          exercise_type: currentSession.exerciseType,
          source: currentExercise.source,
          difficulty: currentExercise.difficulty
        })
      });
      console.log('✅ Exercise attempt saved to database');
    } catch (err) {
      console.error('❌ Error saving exercise attempt:', err);
    }
    
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
    
    return { isCorrect, correctAnswer: currentExercise.correctAnswer };
  }, [currentSession, currentExerciseIndex, exercises, user?.id]);

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
    
    // Actualizar estadísticas y recargar datos reales
    loadRealStats();
    
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
    answerExercise,
    refreshStats: loadRealStats
  };
};

function mapDifficultyLevel(nivel: string): 'BASIC' | 'INTERMEDIATE' | 'ADVANCED' {
  switch (nivel?.toLowerCase()) {
    case 'basico':
    case 'basic':
      return 'BASIC';
    case 'avanzado':
    case 'advanced':
      return 'ADVANCED';
    default:
      return 'INTERMEDIATE';
  }
}
