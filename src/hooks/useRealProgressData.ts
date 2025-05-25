
import { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/integrations/supabase/client';

interface RealProgressMetrics {
  overallProgress: number;
  learningVelocity: number;
  retentionRate: number;
  cognitiveLoad: number;
  weeklyGrowth: number;
  totalSessions: number;
  streakDays: number;
  subjectProgress: Record<string, number>;
  completedNodes: number;
  totalNodes: number;
}

export const useRealProgressData = () => {
  const { user } = useAuth();
  const [metrics, setMetrics] = useState<RealProgressMetrics | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchRealProgressData = async () => {
      if (!user?.id) return;

      try {
        setIsLoading(true);

        // Fetch user node progress
        const { data: nodeProgress, error: nodeError } = await supabase
          .from('user_node_progress')
          .select(`
            *,
            learning_nodes(subject_area, test_id)
          `)
          .eq('user_id', user.id);

        if (nodeError) throw nodeError;

        // Fetch total nodes available
        const { data: allNodes, error: allNodesError } = await supabase
          .from('learning_nodes')
          .select('id, subject_area, test_id');

        if (allNodesError) throw allNodesError;

        // Fetch user exercise attempts for velocity calculation
        const { data: attempts, error: attemptsError } = await supabase
          .from('user_exercise_attempts')
          .select('created_at, is_correct, time_taken_seconds')
          .eq('user_id', user.id)
          .order('created_at', { ascending: false })
          .limit(50);

        if (attemptsError) throw attemptsError;

        // Calculate real metrics
        const completedNodes = nodeProgress?.filter(np => np.status === 'completed').length || 0;
        const totalNodes = allNodes?.length || 1;
        const overallProgress = Math.round((completedNodes / totalNodes) * 100);

        // Calculate subject-specific progress
        const subjectProgress: Record<string, number> = {};
        const subjectGroups = {
          'COMPETENCIA_LECTORA': 1,
          'MATEMATICA_1': 2,
          'MATEMATICA_2': 3,
          'HISTORIA_CIENCIAS_SOCIALES': 4,
          'CIENCIAS': 5
        };

        Object.entries(subjectGroups).forEach(([subject, testId]) => {
          const subjectNodes = allNodes?.filter(n => n.test_id === testId) || [];
          const completedSubjectNodes = nodeProgress?.filter(np => 
            np.status === 'completed' && 
            subjectNodes.some(sn => sn.id === np.node_id)
          ) || [];
          
          subjectProgress[subject] = subjectNodes.length > 0 
            ? Math.round((completedSubjectNodes.length / subjectNodes.length) * 100)
            : 0;
        });

        // Calculate learning velocity from real attempts
        const recentAttempts = attempts?.filter(a => {
          const daysDiff = (Date.now() - new Date(a.created_at).getTime()) / (1000 * 60 * 60 * 24);
          return daysDiff <= 7;
        }) || [];

        const learningVelocity = recentAttempts.length > 0 
          ? Math.round(recentAttempts.length * 10) // Scale for display
          : 0;

        // Calculate retention rate from correct answers
        const correctAttempts = attempts?.filter(a => a.is_correct).length || 0;
        const retentionRate = attempts && attempts.length > 0 
          ? Math.round((correctAttempts / attempts.length) * 100)
          : 0;

        // Calculate cognitive load based on time taken
        const avgTimePerQuestion = attempts && attempts.length > 0
          ? attempts.reduce((sum, a) => sum + (a.time_taken_seconds || 60), 0) / attempts.length
          : 60;
        const cognitiveLoad = Math.min(100, Math.round((avgTimePerQuestion / 120) * 100));

        // Calculate streak from daily activity
        const dailyActivity = nodeProgress?.reduce((acc, np) => {
          if (np.last_activity_at) {
            const date = new Date(np.last_activity_at).toDateString();
            acc[date] = true;
          }
          return acc;
        }, {} as Record<string, boolean>) || {};

        const streakDays = Object.keys(dailyActivity).length;

        // Weekly growth calculation
        const weekOldProgress = nodeProgress?.filter(np => {
          if (!np.last_activity_at) return false;
          const weekAgo = Date.now() - (7 * 24 * 60 * 60 * 1000);
          return new Date(np.last_activity_at).getTime() >= weekAgo;
        }).length || 0;

        const weeklyGrowth = Math.round((weekOldProgress / Math.max(totalNodes, 1)) * 100);

        const realMetrics: RealProgressMetrics = {
          overallProgress,
          learningVelocity,
          retentionRate,
          cognitiveLoad,
          weeklyGrowth,
          totalSessions: attempts?.length || 0,
          streakDays,
          subjectProgress,
          completedNodes,
          totalNodes
        };

        setMetrics(realMetrics);
      } catch (error) {
        console.error('Error fetching real progress data:', error);
        // Fallback to minimal real data structure
        setMetrics({
          overallProgress: 0,
          learningVelocity: 0,
          retentionRate: 0,
          cognitiveLoad: 0,
          weeklyGrowth: 0,
          totalSessions: 0,
          streakDays: 0,
          subjectProgress: {},
          completedNodes: 0,
          totalNodes: 0
        });
      } finally {
        setIsLoading(false);
      }
    };

    fetchRealProgressData();
  }, [user?.id]);

  return { metrics, isLoading };
};
