import { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/integrations/supabase/client';

interface DashboardStats {
  totalModules: number;
  completedModules: number;
  totalTimeSpent: number;
  progressPercentage: number;
  lastActivity: string | null;
}

export const useDashboardStats = () => {
  const { user } = useAuth();
  const [stats, setStats] = useState<DashboardStats>({
    totalModules: 0,
    completedModules: 0,
    totalTimeSpent: 0,
    progressPercentage: 0,
    lastActivity: null,
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchDashboardStats = async () => {
      if (!user?.id) {
        return;
      }

      setLoading(true);
      setError(null);

      try {
        // Fetch total modules from learning_plan_nodes
        const { data: planNodes, error: planNodesError } = await supabase
          .from('learning_plan_nodes')
          .select('id')
          .in('plan_id',
            supabase
              .from('learning_plans')
              .select('id')
              .eq('user_id', user.id)
          );

        if (planNodesError) {
          console.error('Error fetching learning plan nodes:', planNodesError);
          setError('Failed to fetch learning plan nodes.');
          return;
        }

        const totalModules = planNodes ? planNodes.length : 0;

        // Fetch completed modules from user_node_progress
        const { data: completedNodes, error: completedNodesError } = await supabase
          .from('user_node_progress')
          .select('id')
          .eq('user_id', user.id)
          .eq('status', 'completed');

        if (completedNodesError) {
          console.error('Error fetching completed nodes:', completedNodesError);
          setError('Failed to fetch completed nodes.');
          return;
        }

        const completedModules = completedNodes ? completedNodes.length : 0;

        // Calculate progress percentage
        const progressPercentage = totalModules > 0 ? (completedModules / totalModules) * 100 : 0;

        // Fetch total time spent from user_node_progress
        const { data: timeSpentData, error: timeSpentError } = await supabase
          .from('user_node_progress')
          .select('time_spent_minutes')
          .eq('user_id', user.id);

        if (timeSpentError) {
          console.error('Error fetching time spent data:', timeSpentError);
          setError('Failed to fetch time spent data.');
          return;
        }

        const totalTimeSpent = timeSpentData?.reduce((acc, curr) => acc + (curr.time_spent_minutes || 0), 0) || 0;

        // Fetch last activity from user_node_progress
        const { data: lastActivityData, error: lastActivityError } = await supabase
          .from('user_node_progress')
          .select('created_at')
          .eq('user_id', user.id)
          .order('created_at', { ascending: false })
          .limit(1);

        if (lastActivityError) {
          console.error('Error fetching last activity:', lastActivityError);
          setError('Failed to fetch last activity.');
          return;
        }

        const lastActivity = lastActivityData && lastActivityData.length > 0 ? lastActivityData[0].created_at : null;

        setStats({
          totalModules,
          completedModules,
          totalTimeSpent,
          progressPercentage,
          lastActivity,
        });
      } catch (err) {
        console.error('Error fetching dashboard stats:', err);
        setError('Failed to fetch dashboard stats.');
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardStats();
  }, [user?.id]);

  return { stats, loading, error };
};
