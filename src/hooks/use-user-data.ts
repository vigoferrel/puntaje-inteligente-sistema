import { useState, useEffect } from "react";
import { TPAESHabilidad, TLearningCyclePhase } from "../types/system-types";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/integrations/supabase/client";
import { useAuthProfile } from "./use-auth-profile";
import { useLearningNodes } from "./use-learning-nodes";
import { toast } from "@/components/ui/use-toast";

export interface UserProfile {
  id: string;
  name: string;
  email: string;
  targetCareer?: string;
  skillLevels: Record<TPAESHabilidad, number>;
  progress: {
    completedNodes: string[];
    completedExercises: number;
    correctExercises: number;
    totalTimeMinutes: number;
  };
  learningCyclePhase?: TLearningCyclePhase;
}

// Mock data for demonstration
const MOCK_USER: UserProfile = {
  id: "user-1",
  name: "Estudiante",
  email: "estudiante@example.com",
  targetCareer: "Ingeniería Civil",
  skillLevels: {
    SOLVE_PROBLEMS: 0.65,
    REPRESENT: 0.45,
    MODEL: 0.70,
    INTERPRET_RELATE: 0.60,
    EVALUATE_REFLECT: 0.55,
    TRACK_LOCATE: 0.75,
    ARGUE_COMMUNICATE: 0.50,
    IDENTIFY_THEORIES: 0.40,
    PROCESS_ANALYZE: 0.60,
    APPLY_PRINCIPLES: 0.55,
    SCIENTIFIC_ARGUMENT: 0.35,
    TEMPORAL_THINKING: 0.60,
    SOURCE_ANALYSIS: 0.65,
    MULTICAUSAL_ANALYSIS: 0.50,
    CRITICAL_THINKING: 0.70,
    REFLECTION: 0.55
  },
  progress: {
    completedNodes: ["math1-solve-problems-basic-1"],
    completedExercises: 45,
    correctExercises: 32,
    totalTimeMinutes: 180
  },
  learningCyclePhase: "DIAGNOSIS"
};

export const useUserData = () => {
  const { profile, isLoading: authLoading } = useAuth();
  const { fetchProfile } = useAuthProfile();
  const [loading, setLoading] = useState(authLoading);
  const [user, setUser] = useState<UserProfile | null>(null);
  const [skillLevels, setSkillLevels] = useState<Record<string, number>>({});
  const { getLearningCyclePhase } = useLearningNodes();

  // Fetch user skill levels from the database
  useEffect(() => {
    const fetchUserSkills = async (userId: string) => {
      try {
        const { data, error } = await supabase
          .from('user_skill_levels')
          .select('skill_id, level')
          .eq('user_id', userId);
        
        if (error) throw error;
        
        // Map skill levels to our format if available
        if (data && data.length > 0) {
          const skillMap: Record<string, number> = {};
          data.forEach(item => {
            // We'll need to map database skill IDs to our frontend skill codes
            // This is a simplification, in a real app we'd have a mapping function
            skillMap[`SKILL_${item.skill_id}`] = item.level;
          });
          setSkillLevels(skillMap);
        }
      } catch (error) {
        console.error('Error fetching skill levels:', error);
      }
    };

    const fetchUserProgress = async (userId: string) => {
      try {
        // Get completed nodes
        const { data: nodeData, error: nodeError } = await supabase
          .from('user_node_progress')
          .select('node_id')
          .eq('user_id', userId)
          .eq('status', 'completed');
        
        if (nodeError) throw nodeError;
        
        // Get exercise attempts
        const { data: exerciseData, error: exerciseError } = await supabase
          .from('user_exercise_attempts')
          .select('*')
          .eq('user_id', userId);
          
        if (exerciseError) throw exerciseError;
        
        // Calculate progress metrics
        const completedNodes = nodeData ? nodeData.map(item => item.node_id) : [];
        const completedExercises = exerciseData ? exerciseData.length : 0;
        const correctExercises = exerciseData ? exerciseData.filter(item => item.is_correct).length : 0;
        
        // Calculate total time spent
        const { data: timeData, error: timeError } = await supabase
          .from('user_node_progress')
          .select('time_spent_minutes')
          .eq('user_id', userId);
          
        if (timeError) throw timeError;
        
        const totalTimeMinutes = timeData ? 
          timeData.reduce((sum, item) => sum + (item.time_spent_minutes || 0), 0) : 0;
          
        return {
          completedNodes,
          completedExercises,
          correctExercises,
          totalTimeMinutes
        };
      } catch (error) {
        console.error('Error fetching user progress:', error);
        return {
          completedNodes: [],
          completedExercises: 0,
          correctExercises: 0,
          totalTimeMinutes: 0
        };
      }
    };

    const loadUserData = async () => {
      if (!authLoading) {
        if (profile) {
          try {
            // Fetch profile data
            const userProfile = await fetchProfile(profile.id);
            
            // Fetch user progress
            const progressData = await fetchUserProgress(profile.id);
            
            // Determine learning cycle phase
            const learningPhase = await getLearningCyclePhase(profile.id);
            
            if (userProfile) {
              setUser({
                ...userProfile,
                progress: progressData,
                learningCyclePhase: learningPhase
              });
            }
            
            // Fetch additional skill data from the database
            fetchUserSkills(profile.id);
          } catch (error) {
            console.error("Error loading user data:", error);
            toast({
              title: "Error",
              description: "No se pudo cargar los datos del usuario",
              variant: "destructive"
            });
          } finally {
            setLoading(false);
          }
        } else {
          // Fallback to mock data if no profile is available (for demonstration purposes)
          setUser(MOCK_USER);
          setLoading(false);
        }
      }
    };
    
    loadUserData();
  }, [profile, authLoading, fetchProfile, getLearningCyclePhase]);

  const updateSkillLevel = async (skill: TPAESHabilidad, level: number) => {
    if (!user) return;
    
    const normalizedLevel = Math.max(0, Math.min(1, level));
    
    // Update local state
    setUser(prev => {
      if (!prev) return prev;
      
      return {
        ...prev,
        skillLevels: {
          ...prev.skillLevels,
          [skill]: normalizedLevel
        }
      };
    });
    
    // Update in database if we have a real user
    if (profile) {
      try {
        // Get the skill ID from the database based on the skill code
        const { data: skillData, error: skillError } = await supabase
          .from('paes_skills')
          .select('id')
          .eq('code', skill)
          .single();
          
        if (skillError) throw skillError;
        
        if (!skillData) {
          console.error(`Skill ${skill} not found in database`);
          return;
        }
        
        // Update or insert the skill level
        const { error } = await supabase
          .from('user_skill_levels')
          .upsert({
            user_id: profile.id,
            skill_id: skillData.id,
            level: normalizedLevel
          });
        
        if (error) throw error;
        
        toast({
          title: "Nivel actualizado",
          description: "Tu nivel de habilidad ha sido actualizado",
        });
      } catch (error) {
        console.error('Error updating skill level:', error);
        toast({
          title: "Error", 
          description: "No se pudo actualizar el nivel de habilidad",
          variant: "destructive"
        });
      }
    }
  };

  const updateLearningPhase = async (phase: TLearningCyclePhase) => {
    if (!user || !profile) return;
    
    try {
      // Update user profile with new learning phase
      const { error } = await supabase
        .from('profiles')
        .update({ learning_phase: phase })
        .eq('id', profile.id);
      
      if (error) throw error;
      
      // Update local state
      setUser(prev => {
        if (!prev) return prev;
        return {
          ...prev,
          learningCyclePhase: phase
        };
      });
      
      toast({
        title: "Fase actualizada",
        description: `Ahora estás en la fase ${phase}`,
      });
    } catch (error) {
      console.error('Error updating learning phase:', error);
      toast({
        title: "Error",
        description: "No se pudo actualizar la fase de aprendizaje",
        variant: "destructive"
      });
    }
  };

  return {
    user,
    loading,
    updateSkillLevel,
    updateLearningPhase
  };
};
