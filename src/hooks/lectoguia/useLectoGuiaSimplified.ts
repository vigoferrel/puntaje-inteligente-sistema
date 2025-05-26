
import { useState, useCallback, useEffect } from 'react';
import { Exercise } from '@/types/ai-types';
import { TPAESPrueba, TPAESHabilidad } from '@/types/system-types';
import { usePAESExerciseSystem } from '@/hooks/exercise/use-paes-exercise-system';
import { useLectoGuiaChat } from '@/hooks/lectoguia-chat/use-lectoguia-chat';
import { useAuth } from '@/contexts/AuthContext';

type LectoGuiaTab = 'chat' | 'exercise' | 'simulation' | 'progress';

interface LectoGuiaStats {
  exercisesCompleted: number;
  averageScore: number;
  timeSpent: number;
  currentStreak: number;
  totalSessions: number;
  totalMessages: number;
}

export const useLectoGuiaSimplified = () => {
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState<LectoGuiaTab>('chat');
  const [activeSubject, setActiveSubject] = useState('competencia-lectora');
  const [selectedOption, setSelectedOption] = useState<number | null>(null);
  const [showFeedback, setShowFeedback] = useState(false);

  // Integrar sistema PAES de ejercicios
  const {
    currentExercise,
    isLoading: exerciseLoading,
    generateOptimizedExercise,
    stats: exerciseStats
  } = usePAESExerciseSystem();

  // Integrar chat
  const {
    messages,
    isTyping,
    sendMessage: handleSendMessage
  } = useLectoGuiaChat();

  /**
   * Maneja el cambio de materia con limpieza de estado
   */
  const handleSubjectChange = useCallback((newSubject: string) => {
    setActiveSubject(newSubject);
    setSelectedOption(null);
    setShowFeedback(false);
    // El ejercicio actual se mantiene para referencia
  }, []);

  /**
   * Genera nuevo ejercicio usando el sistema PAES inteligente
   */
  const handleNewExercise = useCallback(async (
    skill?: TPAESHabilidad,
    difficulty: 'BASICO' | 'INTERMEDIO' | 'AVANZADO' = 'INTERMEDIO'
  ) => {
    setSelectedOption(null);
    setShowFeedback(false);

    // Mapear materia activa a prueba PAES
    const subjectToPrueba: Record<string, TPAESPrueba> = {
      'competencia-lectora': 'COMPETENCIA_LECTORA',
      'matematica-m1': 'MATEMATICA_1',
      'matematica-m2': 'MATEMATICA_2',
      'ciencias': 'CIENCIAS',
      'historia': 'HISTORIA'
    };

    const prueba = subjectToPrueba[activeSubject];
    if (!prueba) return;

    // Skill por defecto según materia
    const defaultSkill = skill || getDefaultSkillForSubject(activeSubject);

    await generateOptimizedExercise(prueba, defaultSkill, difficulty);
  }, [activeSubject, generateOptimizedExercise]);

  /**
   * Maneja selección de opción en ejercicio
   */
  const handleOptionSelect = useCallback((optionIndex: number) => {
    if (showFeedback) return; // Ya respondido

    setSelectedOption(optionIndex);
    setShowFeedback(true);

    // Registrar intento si hay usuario
    if (user && currentExercise) {
      const isCorrect = currentExercise.options[optionIndex] === currentExercise.correctAnswer;
      // Aquí se podría registrar en base de datos
      console.log('Respuesta registrada:', { isCorrect, optionIndex, exerciseId: currentExercise.id });
    }
  }, [showFeedback, user, currentExercise]);

  /**
   * Obtiene estadísticas del usuario
   */
  const getStats = useCallback((): LectoGuiaStats => {
    // Combinar estadísticas de diferentes fuentes
    return {
      exercisesCompleted: exerciseStats?.totalExercises || 0,
      averageScore: exerciseStats?.averageQuality || 0,
      timeSpent: 0, // Calcular desde sesiones
      currentStreak: 0, // Obtener de progreso de usuario
      totalSessions: messages.length || 0,
      totalMessages: messages.length || 0
    };
  }, [exerciseStats, messages.length]);

  /**
   * Resetea el estado de ejercicio actual
   */
  const resetExercise = useCallback(() => {
    setSelectedOption(null);
    setShowFeedback(false);
  }, []);

  return {
    // Estado de tabs
    activeTab,
    setActiveTab,
    
    // Estado de materia
    activeSubject,
    handleSubjectChange,
    
    // Estado de chat
    messages,
    isTyping,
    handleSendMessage,
    
    // Estado de ejercicios
    currentExercise,
    selectedOption,
    showFeedback,
    isLoading: exerciseLoading,
    
    // Acciones de ejercicios
    handleOptionSelect,
    handleNewExercise,
    resetExercise,
    
    // Utilidades
    getStats
  };
};

/**
 * Obtiene habilidad por defecto según la materia
 */
function getDefaultSkillForSubject(subject: string): TPAESHabilidad {
  const skillMapping: Record<string, TPAESHabilidad> = {
    'competencia-lectora': 'INTERPRET_RELATE',
    'matematica-m1': 'SOLVE_PROBLEMS',
    'matematica-m2': 'MODEL',
    'ciencias': 'PROCESS_ANALYZE',
    'historia': 'SOURCE_ANALYSIS'
  };
  
  return skillMapping[subject] || 'INTERPRET_RELATE';
}
