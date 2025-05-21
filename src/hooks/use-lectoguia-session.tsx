
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

  // Load user data when authenticated
  useEffect(() => {
    if (user?.id) {
      loadUserData(user.id);
    } else {
      // Reset session when not authenticated
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
      
      // Fetch exercise history
      const { data: exerciseData, error: exerciseError } = await supabase
        .from('lectoguia_exercise_attempts')
        .select('*')
        .eq('user_id', userId)
        .order('completed_at', { ascending: false });
      
      if (exerciseError) throw exerciseError;
      
      // Fetch user preferences
      const { data: prefData, error: prefError } = await supabase
        .from('lectoguia_user_preferences')
        .select('key, value')
        .eq('user_id', userId);
        
      if (prefError) throw prefError;
      
      // Fetch skill levels
      const { data: skillData, error: skillError } = await supabase
        .from('user_skill_levels')
        .select('skill_id, level')
        .eq('user_id', userId);
        
      if (skillError) throw skillError;
      
      // Process skill levels
      const skillLevels: Record<string, number> = {
        'TRACK_LOCATE': 0,
        'INTERPRET_RELATE': 0, 
        'EVALUATE_REFLECT': 0
      };
      
      if (skillData) {
        skillData.forEach(skill => {
          // Map skill IDs to skill codes (simplified mapping for now)
          // In a real app, you'd have a proper mapping function
          if (skill.skill_id === 1) skillLevels['TRACK_LOCATE'] = skill.level;
          if (skill.skill_id === 2) skillLevels['INTERPRET_RELATE'] = skill.level;
          if (skill.skill_id === 3) skillLevels['EVALUATE_REFLECT'] = skill.level;
        });
      }
      
      // Process preferences
      const preferences: Record<string, string> = {};
      if (prefData) {
        prefData.forEach(pref => {
          preferences[pref.key] = pref.value;
        });
      }
      
      setSession({
        userId,
        exerciseHistory: exerciseData || [],
        preferences,
        skillLevels,
        loading: false
      });
      
    } catch (error) {
      console.error('Error loading LectoGuia user data:', error);
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
      // If not logged in, just return and don't save
      console.log('User not logged in, exercise attempt not saved');
      return;
    }
    
    try {
      const attemptId = uuidv4();
      const exerciseId = uuidv4(); // In a real app, exercise would have its own ID
      
      const attempt: ExerciseAttempt = {
        id: attemptId,
        exerciseId,
        userId: session.userId,
        selectedOption,
        isCorrect,
        skillType: skill,
        completedAt: new Date().toISOString()
      };
      
      const { error } = await supabase
        .from('lectoguia_exercise_attempts')
        .insert({
          id: attemptId,
          user_id: session.userId,
          exercise_id: exerciseId,
          selected_option: selectedOption,
          is_correct: isCorrect,
          skill_type: skill,
          completed_at: new Date().toISOString()
        });
      
      if (error) throw error;
      
      // Update local state with the new attempt
      setSession(prev => ({
        ...prev,
        exerciseHistory: [attempt, ...prev.exerciseHistory]
      }));
      
      // Update skill level based on results
      await updateSkillLevel(skill, isCorrect);
      
      return attempt;
    } catch (error) {
      console.error('Error saving exercise attempt:', error);
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
      // Get current skill level
      const currentLevel = session.skillLevels[skillCode] || 0;
      
      // Simple algorithm to adjust skill level:
      // Correct answers increase level by 0.05 up to 1.0
      // Incorrect answers decrease level by 0.03, but not below 0
      let newLevel = currentLevel;
      
      if (isCorrect) {
        newLevel = Math.min(1, currentLevel + 0.05);
      } else {
        newLevel = Math.max(0, currentLevel - 0.03);
      }
      
      // Update in database
      const { error } = await supabase
        .from('user_skill_levels')
        .upsert({
          user_id: session.userId,
          skill_id: skillId,
          level: newLevel
        });
      
      if (error) throw error;
      
      // Update local state
      setSession(prev => ({
        ...prev,
        skillLevels: {
          ...prev.skillLevels,
          [skillCode]: newLevel
        }
      }));
      
    } catch (error) {
      console.error('Error updating skill level:', error);
    }
  };
  
  const setPreference = async (key: string, value: string) => {
    if (!session.userId) return;
    
    try {
      // Update in database
      const { error } = await supabase
        .from('lectoguia_user_preferences')
        .upsert({
          user_id: session.userId,
          key,
          value
        });
      
      if (error) throw error;
      
      // Update local state
      setSession(prev => ({
        ...prev,
        preferences: {
          ...prev.preferences,
          [key]: value
        }
      }));
      
    } catch (error) {
      console.error('Error setting preference:', error);
      toast({
        title: "Error",
        description: "No se pudo guardar la preferencia",
        variant: "destructive"
      });
    }
  };
  
  // Helper to map skill codes to IDs
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
