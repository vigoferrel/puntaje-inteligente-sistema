import { useState, useEffect, useCallback } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "@/components/ui/use-toast";
import { createLearningPlan } from "@/services/plan-service";
import { TPAESHabilidad } from "@/types/system-types";

// Add the missing UserProfile type export to fix the build errors
export interface UserProfile {
  id: string;
  name?: string;
  email?: string;
  avatar_url?: string;
  preferences?: Record<string, any>;
  targetCareer?: string;
  learningCyclePhase?: string;
}

export const useUserData = () => {
  const { profile: authProfile } = useAuth();
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // Función para crear un plan de estudio
  const createLearningPlanForUser = async (
    userId: string,
    title: string,
    description?: string,
    targetDate?: string,
    skillPriorities?: Record<TPAESHabilidad, number>
  ) => {
    try {
      return await createLearningPlan(userId, title, description, targetDate, skillPriorities);
    } catch (error) {
      console.error('Error creating learning plan:', error);
      toast({
        title: "Error",
        description: "No se pudo crear el plan de aprendizaje",
        variant: "destructive"
      });
      return null;
    }
  };

  const fetchUserData = useCallback(async () => {
    if (!authProfile?.id) return;

    setLoading(true);
    try {
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', authProfile.id)
        .single();

      if (error) {
        console.error("Error fetching user data:", error);
        setError(error);
        toast({
          title: "Error",
          description: "No se pudieron cargar los datos del usuario",
          variant: "destructive"
        });
      }

      setUser(data);
    } catch (error) {
      console.error("Unexpected error fetching user data:", error);
      setError(error);
      toast({
        title: "Error",
        description: "Error inesperado al cargar los datos del usuario",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  }, [authProfile?.id]);

  const updateUserData = useCallback(async (updates) => {
    if (!authProfile?.id) return;

    setLoading(true);
    try {
      const { error } = await supabase
        .from('profiles')
        .update(updates)
        .eq('id', authProfile.id);

      if (error) {
        console.error("Error updating user data:", error);
        setError(error);
        toast({
          title: "Error",
          description: "No se pudieron actualizar los datos del usuario",
          variant: "destructive"
        });
      } else {
        // Optimistically update the local state
        setUser(prevUser => ({ ...prevUser, ...updates }));
        toast({
          title: "Éxito",
          description: "Datos del usuario actualizados correctamente",
        });
      }
    } catch (error) {
      console.error("Unexpected error updating user data:", error);
      setError(error);
      toast({
        title: "Error",
        description: "Error inesperado al actualizar los datos del usuario",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  }, [authProfile?.id]);

  useEffect(() => {
    fetchUserData();
  }, [authProfile?.id, fetchUserData]);

  return {
    user,
    loading,
    error,
    createLearningPlan: createLearningPlanForUser,
    fetchUserData,
    updateUserData,
  };
};
