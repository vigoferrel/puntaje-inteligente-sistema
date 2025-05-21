
import { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/integrations/supabase/client';
import { toast } from '@/components/ui/use-toast';
import { Exercise } from '@/types/ai-types';
import { v4 as uuidv4 } from 'uuid';

interface ExerciseAttempt {
  id: string;
  exerciseId: string;
  userId: string;
  selectedOption: number;
  isCorrect: boolean;
  skillType: string;
  completedAt: string;
}

interface UserPreference {
  key: string;
  value: string;
}

export interface LectoGuiaSession {
  userId: string | null;
  exerciseHistory: ExerciseAttempt[];
  preferences: Record<string, string>;
  skillLevels: Record<string, number>;
  loading: boolean;
}

export function useLectoGuiaSession() {
  const { user } = useAuth();
  const [session, setSession] = useState<LectoGuiaSession>({
    userId: null,
    exerciseHistory: [],
    preferences: {},
    skillLevels: {
      'TRACK_LOCATE': 0,
      'INTERPRET_RELATE': 0,
      'EVALUATE_REFLECT': 0
    },
    loading: true
  });

  // Cargar datos del usuario cuando está autenticado
  useEffect(() => {
    if (user?.id) {
      loadUserData(user.id);
    } else {
      // Reiniciar sesión cuando no está autenticado
      setSession({
        userId: null,
        exerciseHistory: [],
        preferences: {},
        skillLevels: {
          'TRACK_LOCATE': 0,
          'INTERPRET_RELATE': 0,
          'EVALUATE_REFLECT': 0
        },
        loading: false
      });
    }
  }, [user?.id]);

  const loadUserData = async (userId: string) => {
    try {
      setSession(prev => ({ ...prev, loading: true }));
      
      // Consultar el historial de ejercicios - usando tablas personalizadas
      const { data: exerciseData, error: exerciseError } = await supabase
        .from('lectoguia_exercise_attempts')
        .select('*')
        .eq('user_id', userId)
        .order('completed_at', { ascending: false });
      
      if (exerciseError) throw exerciseError;
      
      // Consultar las preferencias del usuario - usando tablas personalizadas
      const { data: prefData, error: prefError } = await supabase
        .from('lectoguia_user_preferences')
        .select('key, value')
        .eq('user_id', userId);
        
      if (prefError) throw prefError;
      
      // Consultar los niveles de habilidad
      const { data: skillData, error: skillError } = await supabase
        .from('user_skill_levels')
        .select('skill_id, level')
        .eq('user_id', userId);
        
      if (skillError) throw skillError;
      
      // Procesar los niveles de habilidad
      const skillLevels: Record<string, number> = {
        'TRACK_LOCATE': 0,
        'INTERPRET_RELATE': 0, 
        'EVALUATE_REFLECT': 0
      };
      
      if (skillData) {
        skillData.forEach(skill => {
          // Mapear IDs de habilidad a códigos de habilidad
          if (skill.skill_id === 1) skillLevels['TRACK_LOCATE'] = skill.level;
          if (skill.skill_id === 2) skillLevels['INTERPRET_RELATE'] = skill.level;
          if (skill.skill_id === 3) skillLevels['EVALUATE_REFLECT'] = skill.level;
        });
      }
      
      // Procesar las preferencias
      const preferences: Record<string, string> = {};
      if (prefData) {
        prefData.forEach((pref: UserPreference) => {
          preferences[pref.key] = pref.value;
        });
      }

      // Mapear los intentos de ejercicios a nuestro formato interno
      const exerciseAttempts: ExerciseAttempt[] = exerciseData ? exerciseData.map((attempt: any) => ({
        id: attempt.id,
        exerciseId: attempt.exercise_id,
        userId: attempt.user_id,
        selectedOption: attempt.selected_option,
        isCorrect: attempt.is_correct,
        skillType: attempt.skill_type,
        completedAt: attempt.completed_at
      })) : [];
      
      setSession({
        userId,
        exerciseHistory: exerciseAttempts,
        preferences,
        skillLevels,
        loading: false
      });
      
    } catch (error) {
      console.error('Error al cargar datos de LectoGuia:', error);
      toast({
        title: "Error",
        description: "No se pudo cargar los datos del usuario",
        variant: "destructive"
      });
      
      setSession(prev => ({ 
        ...prev, 
        loading: false,
        userId
      }));
    }
  };

  const saveExerciseAttempt = async (
    exercise: Exercise, 
    selectedOption: number, 
    isCorrect: boolean,
    skill: string = 'INTERPRET_RELATE'
  ) => {
    if (!session.userId) {
      // Si no ha iniciado sesión, solo registrar y no guardar
      console.log('Usuario no ha iniciado sesión, intento de ejercicio no guardado');
      return;
    }
    
    try {
      const attemptId = uuidv4();
      const exerciseId = exercise.id || uuidv4(); // Usar el ID del ejercicio o generar uno
      
      // Preparar los datos para guardar
      const attemptData = {
        id: attemptId,
        user_id: session.userId,
        exercise_id: exerciseId,
        selected_option: selectedOption,
        is_correct: isCorrect,
        skill_type: skill,
        completed_at: new Date().toISOString()
      };
      
      // Guardar en Supabase
      const { error } = await supabase
        .from('lectoguia_exercise_attempts')
        .insert(attemptData);
      
      if (error) throw error;
      
      // Actualizar el estado local
      const newAttempt: ExerciseAttempt = {
        id: attemptId,
        exerciseId: exerciseId,
        userId: session.userId,
        selectedOption,
        isCorrect,
        skillType: skill,
        completedAt: new Date().toISOString()
      };
      
      setSession(prev => ({
        ...prev,
        exerciseHistory: [newAttempt, ...prev.exerciseHistory]
      }));
      
      // Actualizar nivel de habilidad basado en resultados
      await updateSkillLevel(skill, isCorrect);
      
      return newAttempt;
    } catch (error) {
      console.error('Error al guardar intento de ejercicio:', error);
      toast({
        title: "Error",
        description: "No se pudo guardar los resultados del ejercicio",
        variant: "destructive"
      });
      return null;
    }
  };

  const updateSkillLevel = async (skillCode: string, isCorrect: boolean) => {
    if (!session.userId) return;
    
    const skillId = getSkillId(skillCode);
    if (!skillId) return;
    
    try {
      // Obtener nivel actual de habilidad
      const currentLevel = session.skillLevels[skillCode] || 0;
      
      // Algoritmo simple para ajustar el nivel de habilidad:
      // Respuestas correctas aumentan el nivel en 0.05 hasta 1.0
      // Respuestas incorrectas disminuyen el nivel en 0.03, pero no bajan de 0
      let newLevel = currentLevel;
      
      if (isCorrect) {
        newLevel = Math.min(1, currentLevel + 0.05);
      } else {
        newLevel = Math.max(0, currentLevel - 0.03);
      }
      
      // Actualizar en la base de datos
      const { error } = await supabase
        .from('user_skill_levels')
        .upsert({
          user_id: session.userId,
          skill_id: skillId,
          level: newLevel
        });
      
      if (error) throw error;
      
      // Actualizar el estado local
      setSession(prev => ({
        ...prev,
        skillLevels: {
          ...prev.skillLevels,
          [skillCode]: newLevel
        }
      }));
      
    } catch (error) {
      console.error('Error al actualizar nivel de habilidad:', error);
    }
  };
  
  const setPreference = async (key: string, value: string) => {
    if (!session.userId) return;
    
    try {
      // Datos para upsert
      const preferenceData = {
        user_id: session.userId,
        key,
        value
      };
      
      // Actualizar en la base de datos
      const { error } = await supabase
        .from('lectoguia_user_preferences')
        .upsert(preferenceData);
      
      if (error) throw error;
      
      // Actualizar el estado local
      setSession(prev => ({
        ...prev,
        preferences: {
          ...prev.preferences,
          [key]: value
        }
      }));
      
    } catch (error) {
      console.error('Error al guardar preferencia:', error);
      toast({
        title: "Error",
        description: "No se pudo guardar la preferencia",
        variant: "destructive"
      });
    }
  };
  
  // Función auxiliar para mapear códigos de habilidad a IDs
  const getSkillId = (skillCode: string): number | null => {
    switch (skillCode) {
      case 'TRACK_LOCATE': return 1;
      case 'INTERPRET_RELATE': return 2;
      case 'EVALUATE_REFLECT': return 3;
      default: return null;
    }
  };

  return {
    session,
    saveExerciseAttempt,
    setPreference,
    updateSkillLevel
  };
}
