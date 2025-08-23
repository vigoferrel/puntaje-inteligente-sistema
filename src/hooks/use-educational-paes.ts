import { useState, useEffect, useCallback } from 'react';
import { supabase } from '@/lib/supabase';
import { useAuth } from '@/contexts/AuthContext';
import { useSafeData, validators, transformers } from './use-safe-data';
import { useNetworkStatus } from './use-network-status';
import { useOfflineStorage } from './use-offline-storage';
import { useSupabaseFetch } from './use-resilient-fetch';

// Configuración educativa PAES oficial
const PAES_SUBJECTS = [
  'MATEMATICA_M1',
  'MATEMATICA_M2', 
  'COMPETENCIA_LECTORA',
  'CIENCIAS',
  'HISTORIA'
] as const;

const BLOOM_LEVELS = [
  'remember',
  'understand', 
  'apply',
  'analyze',
  'evaluate',
  'create'
] as const;

export interface PAESSubject {
  id: typeof PAES_SUBJECTS[number];
  name: string;
  description: string;
  bloomLevels: typeof BLOOM_LEVELS;
  progress: number;
  weakAreas: string[];
  strongAreas: string[];
}

export interface LearningSession {
  id: string;
  userId: string;
  subject: typeof PAES_SUBJECTS[number];
  bloomLevel: typeof BLOOM_LEVELS[number];
  startedAt: string;
  endedAt?: string;
  status: 'in_progress' | 'completed' | 'paused';
  exercisesCompleted: number;
  correctAnswers: number;
  totalTime: number;
}

export interface Exercise {
  id: string;
  sessionId: string;
  userId: string;
  subject: typeof PAES_SUBJECTS[number];
  bloomLevel: typeof BLOOM_LEVELS[number];
  question: string;
  options?: string[];
  userAnswer?: string;
  correctAnswer: string;
  isCorrect?: boolean;
  explanation: string;
  difficulty: 'easy' | 'medium' | 'hard';
  createdAt: string;
}

export interface UserProgress {
  userId: string;
  subject: typeof PAES_SUBJECTS[number];
  progress: number; // 0-100
  totalExercises: number;
  correctAnswers: number;
  averageScore: number;
  lastStudied: string;
  weakAreas: string[];
  strongAreas: string[];
}

export interface UserPreferences {
  userId: string;
  difficulty: 'easy' | 'medium' | 'hard' | 'auto';
  focusSkills: string[];
  studyTime: number; // minutos por sesión
  notifications: boolean;
  musicEnabled: boolean;
}

export const useEducationalPAES = () => {
  const { user } = useAuth();
  const [subjects, setSubjects] = useState<PAESSubject[]>([]);
  const [currentSession, setCurrentSession] = useState<LearningSession | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  // Network and offline capabilities
  const networkStatus = useNetworkStatus();
  const offlineStorage = useOfflineStorage();
  const supabaseFetch = useSupabaseFetch<any>();

  // Hook seguro para progreso del usuario con modo offline simplificado
  const {
    data: userProgress,
    isLoading: progressLoading,
    error: progressError,
    retry: retryProgress
  } = useSafeData<UserProgress[]>(
    async () => {
      // Always use offline data first to avoid loops
      const offlineData = offlineStorage.offlineData?.userProgress;
      if (offlineData) {
        console.log('🔌 Using offline data for user progress');
        return offlineData;
      }

      // If no offline data, use mock data
      return generateMockProgress();
    },
    {
      defaultValue: generateMockProgress(),
      validator: validators.isArray,
      transformer: transformers.ensureArray,
      retryAttempts: 0 // No retries to avoid loops
    }
  );

  // Hook seguro para preferencias del usuario con modo offline simplificado
  const {
    data: userPreferences,
    isLoading: preferencesLoading,
    error: preferencesError,
    retry: retryPreferences
  } = useSafeData<UserPreferences>(
    async () => {
      // Always use offline data first to avoid loops
      const offlineData = offlineStorage.offlineData?.userPreferences;
      if (offlineData) {
        console.log('🔌 Using offline data for user preferences');
        return offlineData;
      }

      // If no offline data, use default preferences
      return generateDefaultPreferences();
    },
    {
      defaultValue: generateDefaultPreferences(),
      validator: validators.isObject,
      transformer: transformers.ensureObject,
      retryAttempts: 0 // No retries to avoid loops
    }
  );

  // Inicializar asignaturas PAES
  const initializeSubjects = useCallback(() => {
    const paesSubjects: PAESSubject[] = PAES_SUBJECTS.map(subject => ({
      id: subject,
      name: getSubjectName(subject),
      description: getSubjectDescription(subject),
      bloomLevels: [...BLOOM_LEVELS],
      progress: 0,
      weakAreas: [],
      strongAreas: []
    }));
    setSubjects(paesSubjects);
  }, []);

  // Iniciar sesión de estudio
  const startStudySession = useCallback(async (
    subject: typeof PAES_SUBJECTS[number],
    bloomLevel: typeof BLOOM_LEVELS[number] = 'remember'
  ) => {
    try {
      const sessionId = `session_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
      
      const newSession: LearningSession = {
        id: sessionId,
        userId: user?.id || 'mock-user',
        subject,
        bloomLevel,
        startedAt: new Date().toISOString(),
        status: 'in_progress',
        exercisesCompleted: 0,
        correctAnswers: 0,
        totalTime: 0
      };

      setCurrentSession(newSession);
      return newSession;
    } catch (err) {
      console.error('Error starting study session:', err);
      setError('Error al iniciar sesión de estudio');
      return null;
    }
  }, [user?.id]);

  // Finalizar sesión de estudio
  const endStudySession = useCallback(async () => {
    if (!currentSession || !userProgress) return;

    try {
      const endTime = new Date().toISOString();
      const totalTime = Math.floor((new Date(endTime).getTime() - new Date(currentSession.startedAt).getTime()) / 1000);

      // Actualizar progreso del usuario localmente
      const currentProgress = userProgress.find(p => p.subject === currentSession.subject);
      if (currentProgress) {
        const newTotalExercises = currentProgress.totalExercises + currentSession.exercisesCompleted;
        const newCorrectAnswers = currentProgress.correctAnswers + currentSession.correctAnswers;
        const newProgress = Math.min(100, (newCorrectAnswers / Math.max(newTotalExercises, 1)) * 100);

        const updatedProgress: UserProgress = {
          ...currentProgress,
          progress: newProgress,
          totalExercises: newTotalExercises,
          correctAnswers: newCorrectAnswers,
          averageScore: newCorrectAnswers / Math.max(newTotalExercises, 1) * 100,
          lastStudied: new Date().toISOString()
        };

        // Log del progreso actualizado para debugging
        console.log('Progress updated:', updatedProgress);
      }
      
      setCurrentSession(null);
      
    } catch (err) {
      console.error('Error ending study session:', err);
      setError('Error al finalizar sesión de estudio');
    }
  }, [currentSession, userProgress]);

  // Registrar ejercicio completado
  const recordExercise = useCallback(async (
    question: string,
    userAnswer: string,
    correctAnswer: string,
    isCorrect: boolean,
    explanation: string,
    difficulty: 'easy' | 'medium' | 'hard' = 'medium'
  ) => {
    if (!currentSession) return;

    try {
      const exerciseId = `exercise_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;

      // Solo actualizar en estado local
      console.log('Ejercicio completado:', {
        id: exerciseId,
        subject: currentSession.subject,
        isCorrect,
        userAnswer,
        correctAnswer
      });

      // Actualizar sesión actual
      setCurrentSession(prev => prev ? {
        ...prev,
        exercisesCompleted: prev.exercisesCompleted + 1,
        correctAnswers: prev.correctAnswers + (isCorrect ? 1 : 0)
      } : null);

    } catch (err) {
      console.error('Error recording exercise:', err);
      setError('Error al registrar ejercicio');
    }
  }, [currentSession]);

  // Obtener ejercicios recomendados
  const getRecommendedExercises = useCallback(async (
    subject: typeof PAES_SUBJECTS[number],
    bloomLevel: typeof BLOOM_LEVELS[number] = 'remember',
    count: number = 5
  ) => {
    // Generar ejercicios mock basados en la asignatura y nivel Bloom
    const exercises = generateMockExercises(subject, bloomLevel, count);
    return exercises;
  }, []);

  // Efecto inicial - simplificado para evitar re-renders
  useEffect(() => {
    setIsLoading(true);
    
    // Inicializar asignaturas directamente
    const paesSubjects: PAESSubject[] = PAES_SUBJECTS.map(subject => ({
      id: subject,
      name: getSubjectName(subject),
      description: getSubjectDescription(subject),
      bloomLevels: [...BLOOM_LEVELS],
      progress: 0,
      weakAreas: [],
      strongAreas: []
    }));
    
    setSubjects(paesSubjects);
    setIsLoading(false);
  }, []); // Sin dependencias para ejecutar solo una vez

  // Combinar estados de carga
  const combinedLoading = isLoading || progressLoading || preferencesLoading;
  const combinedError = error || progressError || preferencesError;

  return {
    subjects,
    currentSession,
    userProgress: userProgress || [],
    userPreferences: userPreferences || generateDefaultPreferences(),
    isLoading: combinedLoading,
    error: combinedError,
    startStudySession,
    endStudySession,
    recordExercise,
    getRecommendedExercises,
    retryProgress,
    retryPreferences,
    PAES_SUBJECTS,
    BLOOM_LEVELS,
    // Network and offline status
    networkStatus,
    isOffline: !networkStatus.isOnline || !networkStatus.isSupabaseAvailable,
    offlineData: offlineStorage.offlineData,
    connectionQuality: networkStatus.connectionQuality,
    lastSync: offlineStorage.lastSync,
    isDataStale: offlineStorage.isDataStale
  };
};

// Funciones auxiliares
function getSubjectName(subject: typeof PAES_SUBJECTS[number]): string {
  const names = {
    'MATEMATICA_M1': 'Matemática M1',
    'MATEMATICA_M2': 'Matemática M2',
    'COMPETENCIA_LECTORA': 'Competencia Lectora',
    'CIENCIAS': 'Ciencias',
    'HISTORIA': 'Historia'
  };
  return names[subject];
}

function getSubjectDescription(subject: typeof PAES_SUBJECTS[number]): string {
  const descriptions = {
    'MATEMATICA_M1': 'Matemática obligatoria para todas las carreras',
    'MATEMATICA_M2': 'Matemática específica para carreras científicas',
    'COMPETENCIA_LECTORA': 'Comprensión y análisis de textos',
    'CIENCIAS': 'Biología, Física y Química',
    'HISTORIA': 'Historia de Chile y el mundo'
  };
  return descriptions[subject];
}

function generateMockProgress(): UserProgress[] {
  return PAES_SUBJECTS.map(subject => ({
    userId: 'mock-user',
    subject,
    progress: Math.floor(Math.random() * 100),
    totalExercises: Math.floor(Math.random() * 50),
    correctAnswers: Math.floor(Math.random() * 40),
    averageScore: Math.floor(Math.random() * 100),
    lastStudied: new Date().toISOString(),
    weakAreas: [],
    strongAreas: []
  }));
}

function generateDefaultPreferences(): UserPreferences {
  return {
    userId: 'mock-user',
    difficulty: 'auto',
    focusSkills: [],
    studyTime: 30,
    notifications: true,
    musicEnabled: true
  };
}

function transformProgressData(data: any[]): UserProgress[] {
  return PAES_SUBJECTS.map(subject => {
    const subjectProgress = data.find(p => p.subject_id === subject);
    return {
      userId: subjectProgress?.user_id || 'mock-user',
      subject,
      progress: transformers.ensureNumber(subjectProgress?.progress),
      totalExercises: transformers.ensureNumber(subjectProgress?.total_exercises),
      correctAnswers: transformers.ensureNumber(subjectProgress?.correct_answers),
      averageScore: transformers.ensureNumber(subjectProgress?.average_score),
      lastStudied: transformers.ensureString(subjectProgress?.last_studied),
      weakAreas: transformers.ensureArray(subjectProgress?.weak_areas),
      strongAreas: transformers.ensureArray(subjectProgress?.strong_areas)
    };
  });
}

function transformPreferencesData(data: any): UserPreferences {
  if (!data) return generateDefaultPreferences();
  
  return {
    userId: transformers.ensureString(data.user_id),
    difficulty: data.difficulty || 'auto',
    focusSkills: transformers.ensureArray(JSON.parse(data.focus_skills || '[]')),
    studyTime: transformers.ensureNumber(data.study_time_minutes),
    notifications: transformers.ensureBoolean(data.notifications_enabled),
    musicEnabled: transformers.ensureBoolean(data.music_enabled)
  };
}

function generateMockExercises(
  subject: typeof PAES_SUBJECTS[number],
  bloomLevel: typeof BLOOM_LEVELS[number],
  count: number
): Exercise[] {
  const exercises: Exercise[] = [];
  
  for (let i = 0; i < count; i++) {
    const exercise = generateMockExercise(subject, bloomLevel, i);
    exercises.push(exercise);
  }
  
  return exercises;
}

function generateMockExercise(
  subject: typeof PAES_SUBJECTS[number],
  bloomLevel: typeof BLOOM_LEVELS[number],
  index: number
): Exercise {
  const exerciseId = `mock_exercise_${Date.now()}_${index}`;
  
  // Generar contenido específico por asignatura y nivel Bloom
  const { question, correctAnswer, explanation } = generateSubjectSpecificContent(subject, bloomLevel, index);
  
  return {
    id: exerciseId,
    sessionId: 'mock_session',
    userId: 'mock_user',
    subject,
    bloomLevel,
    question,
    correctAnswer,
    explanation,
    difficulty: 'medium',
    createdAt: new Date().toISOString()
  };
}

function generateSubjectSpecificContent(
  subject: typeof PAES_SUBJECTS[number],
  bloomLevel: typeof BLOOM_LEVELS[number],
  index: number
): { question: string; correctAnswer: string; explanation: string } {
  const contentMap = {
    'MATEMATICA_M1': {
      'remember': {
        question: `¿Cuál es la fórmula del área de un círculo?`,
        correctAnswer: 'A = πr²',
        explanation: 'El área de un círculo se calcula multiplicando π por el radio al cuadrado.'
      },
      'understand': {
        question: `Si el radio de un círculo es 5 cm, ¿cuál es su área?`,
        correctAnswer: '78.54 cm²',
        explanation: 'A = π(5)² = π(25) = 78.54 cm²'
      }
    },
    'MATEMATICA_M2': {
      'remember': {
        question: `¿Cuál es la fórmula de la derivada de x²?`,
        correctAnswer: '2x',
        explanation: 'La derivada de x² es 2x, aplicando la regla de potencias.'
      },
      'apply': {
        question: `Calcula la derivada de f(x) = 3x² + 2x + 1`,
        correctAnswer: '6x + 2',
        explanation: 'f\'(x) = 6x + 2, derivando término por término.'
      }
    },
    'COMPETENCIA_LECTORA': {
      'remember': {
        question: `¿Qué es una metáfora?`,
        correctAnswer: 'Una comparación implícita entre dos elementos',
        explanation: 'La metáfora es una figura literaria que establece una comparación sin usar "como" o "semejante".'
      },
      'analyze': {
        question: `En el texto "El sol sonreía en el cielo", ¿qué figura literaria se utiliza?`,
        correctAnswer: 'Personificación',
        explanation: 'Se atribuye una cualidad humana (sonreír) a un objeto inanimado (el sol).'
      }
    },
    'CIENCIAS': {
      'remember': {
        question: `¿Cuál es el símbolo químico del oxígeno?`,
        correctAnswer: 'O',
        explanation: 'El oxígeno se representa con la letra O en la tabla periódica.'
      },
      'apply': {
        question: `¿Qué tipo de reacción es la combustión?`,
        correctAnswer: 'Reacción de oxidación',
        explanation: 'La combustión es una reacción de oxidación rápida que libera energía en forma de calor y luz.'
      }
    },
    'HISTORIA': {
      'remember': {
        question: `¿En qué año se independizó Chile?`,
        correctAnswer: '1810',
        explanation: 'Chile declaró su independencia el 18 de septiembre de 1810.'
      },
      'analyze': {
        question: `¿Qué consecuencias tuvo la Guerra del Pacífico para Chile?`,
        correctAnswer: 'Expansión territorial y control del salitre',
        explanation: 'Chile ganó territorios ricos en salitre y consolidó su posición en el Pacífico.'
      }
    }
  };

  const subjectContent = contentMap[subject as keyof typeof contentMap];
  if (subjectContent && (subjectContent as any)[bloomLevel]) {
    return (subjectContent as any)[bloomLevel];
  }

  // Contenido por defecto
  return {
    question: `Ejercicio ${index + 1} de ${subject} - Nivel ${bloomLevel}`,
    correctAnswer: 'Respuesta correcta',
    explanation: 'Explicación del ejercicio'
  };
}
