import { useState, useEffect } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/integrations/supabase/client";
import { UserProfile } from "@/hooks/use-user-data";

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

  useEffect(() => {
    const fetchDashboardStats = async () => {
      if (!profile?.id) {
        setLoading(false);
        return;
      }

      setLoading(true);
      try {
        // Fetch total number of learning plans
        const { data: plansData, error: plansError } = await supabase
          .from('learning_plans')
          .select('*', { count: 'exact' })
          .eq('user_id', profile.id);

        if (plansError) {
          throw plansError;
        }

        const totalPlans = plansData ? plansData.length : 0;

        // Fetch total number of learning nodes
        const { data: nodesData, error: nodesError } = await supabase
          .from('learning_plan_nodes')
          .select('id', { count: 'exact' })

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
  }, [profile?.id]);

  return {
    stats,
    loading,
    error,
  };
};
