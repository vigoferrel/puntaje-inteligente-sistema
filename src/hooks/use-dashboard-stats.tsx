
import { useState, useEffect } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/integrations/supabase/client";
import { UserProfile } from "@/hooks/use-user-data";
import { TPAESHabilidad } from "@/types/system-types";
import { fetchUserSkillLevels, getTopSkills } from "@/services/skills/skill-level-service";

interface DashboardStats {
  totalNodes: number;
  completedNodes: number;
  totalPlans: number;
}

export const useDashboardStats = () => {
  const { profile } = useAuth();
  const [stats, setStats] = useState<DashboardStats>({
    totalNodes: 0,
    completedNodes: 0,
    totalPlans: 0,
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [user, setUser] = useState<UserProfile | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [skillLevels, setSkillLevels] = useState<Record<TPAESHabilidad, number>>({} as Record<TPAESHabilidad, number>);
  const [topSkills, setTopSkills] = useState<TPAESHabilidad[]>([]);
  const [completedExercises, setCompletedExercises] = useState(0);
  const [accuracyPercentage, setAccuracyPercentage] = useState(0);
  const [totalTimeMinutes, setTotalTimeMinutes] = useState(0);

  useEffect(() => {
    const fetchDashboardStats = async () => {
      if (!profile?.id) {
        setLoading(false);
        return;
      }

      setLoading(true);
      try {
        // Set user profile data
        setUser(profile);
        
        // Fetch skill levels and top skills
        const userSkillLevels = await fetchUserSkillLevels(profile.id);
        setSkillLevels(userSkillLevels);
        
        const userTopSkills = await getTopSkills(profile.id, 3);
        setTopSkills(userTopSkills);

        // Use a simulated total plans count since learning_plans table doesn't exist
        const totalPlans = 1; // Virtual plan count

        // Fetch total number of learning nodes from available data
        const { data: nodesData, error: nodesError } = await supabase
          .from('learning_nodes')
          .select('id', { count: 'exact' });

        if (nodesError) {
          throw nodesError;
        }

        const totalNodes = nodesData ? nodesData.length : 0;

        // Fetch completed learning nodes
        const { data: completedNodesData, error: completedNodesError } = await supabase
          .from('user_node_progress')
          .select('id', { count: 'exact' })
          .eq('user_id', profile.id)
          .eq('status', 'completed');

        if (completedNodesError) {
          throw completedNodesError;
        }

        const completedNodes = completedNodesData ? completedNodesData.length : 0;
        
        // Fetch user exercise attempts
        const { data: exerciseData, error: exerciseError } = await supabase
          .from('user_exercise_attempts')
          .select('*')
          .eq('user_id', profile.id);
          
        if (exerciseError) {
          throw exerciseError;
        }
        
        // Calculate exercise stats
        const totalExercises = exerciseData ? exerciseData.length : 0;
        setCompletedExercises(totalExercises);
        
        const correctExercises = exerciseData 
          ? exerciseData.filter(ex => ex.is_correct).length 
          : 0;
          
        setAccuracyPercentage(
          totalExercises > 0 
            ? Math.round((correctExercises / totalExercises) * 100) 
            : 0
        );
        
        // Calculate total study time
        const studyTime = exerciseData
          ? exerciseData.reduce((total, ex) => total + (ex.time_taken_seconds || 0), 0)
          : 0;
          
        setTotalTimeMinutes(Math.round(studyTime / 60));

        setStats({
          totalNodes,
          completedNodes,
          totalPlans,
        });
      } catch (err: any) {
        setError(err.message || "Failed to fetch dashboard stats");
        console.error("Error fetching dashboard stats:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardStats();
  }, [profile]);

  return {
    stats,
    loading,
    error,
    user,
    searchQuery,
    setSearchQuery,
    skillLevels,
    topSkills,
    completedExercises,
    accuracyPercentage,
    totalTimeMinutes
  };
};
