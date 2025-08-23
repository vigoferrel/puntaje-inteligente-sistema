
import { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/integrations/supabase/client';

interface RealProgressMetrics {
  overallProgress: number;
  weeklyGoalProgress: number;
  completedNodes: number;
  totalNodes: number;
  currentStreak: number;
  studyTimeToday: number;
  averageSessionTime: number;
  subjectProgress: Record<string, number>;
  recentAchievements: string[];
  nextMilestone: {
    name: string;
    progress: number;
    target: number;
  };
  // Propiedades adicionales requeridas por los componentes
  learningVelocity: number;
  retentionRate: number;
  cognitiveLoad: number;
  weeklyGrowth: number;
  totalSessions: number;
  totalStudyTime: number;
  streakDays: number;
}

export const useRealProgressData = () => {
  const { user } = useAuth();
  const [metrics, setMetrics] = useState<RealProgressMetrics | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  const fetchRealProgressData = async () => {
    if (!user?.id) {
      setIsLoading(false);
      return;
    }

    try {
      setIsLoading(true);

      // Fetch real user node progress
      const { data: nodeProgress, error: nodeError } = await supabase
        .from('user_node_progress')
        .select(`
          *,
          learning_nodes!inner(subject_area, title)
        `)
        .eq('user_id', user.id);

      if (nodeError) throw nodeError;

      // Fetch recent exercise attempts for activity analysis
      const { data: exerciseAttempts, error: exerciseError } = await supabase
        .from('user_exercise_attempts')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false });

      if (exerciseError) throw exerciseError;

      // Fetch total learning nodes for progress calculation
      const { data: totalNodes, error: totalNodesError } = await supabase
        .from('learning_nodes')
        .select('id, subject_area')
        .limit(1000);

      if (totalNodesError) throw totalNodesError;

      const progress = nodeProgress || [];
      const attempts = exerciseAttempts || [];
      const allNodes = totalNodes || [];

      // Calculate real metrics
      const completedNodes = progress.filter(p => p.status === 'completed').length;
      const totalNodesCount = allNodes.length;
      const overallProgress = totalNodesCount > 0 ? 
        Math.round((completedNodes / totalNodesCount) * 100) : 0;

      // Calculate current streak from exercise attempts
      let currentStreak = 0;
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      
      let checkDate = new Date(today);
      while (checkDate >= new Date(today.getTime() - 30 * 24 * 60 * 60 * 1000)) {
        const dayAttempts = attempts.filter(attempt => {
          const attemptDate = new Date(attempt.created_at);
          attemptDate.setHours(0, 0, 0, 0);
          return attemptDate.getTime() === checkDate.getTime();
        });
        
        if (dayAttempts.length > 0) {
          currentStreak++;
          checkDate.setDate(checkDate.getDate() - 1);
        } else {
          break;
        }
      }

      // Calculate today's study time (approximate from attempts)
      const todayAttempts = attempts.filter(attempt => {
        const attemptDate = new Date(attempt.created_at);
        attemptDate.setHours(0, 0, 0, 0);
        return attemptDate.getTime() === today.getTime();
      });
      const studyTimeToday = todayAttempts.length * 2; // Approximate 2 minutes per attempt

      // Calculate average session time
      const averageSessionTime = attempts.length > 0 ? 
        Math.round((attempts.length * 2) / Math.max(1, attempts.length / 10)) : 0;

      // Calculate subject progress
      const subjectProgress: Record<string, number> = {};
      const subjectStats: Record<string, { completed: number; total: number }> = {};

      // Group by subject area
      allNodes.forEach(node => {
        const subject = node.subject_area || 'general';
        if (!subjectStats[subject]) {
          subjectStats[subject] = { completed: 0, total: 0 };
        }
        subjectStats[subject].total++;
      });

      progress.forEach(np => {
        const subject = np.learning_nodes?.subject_area || 'general';
        if (subjectStats[subject] && np.status === 'completed') {
          subjectStats[subject].completed++;
        }
      });

      Object.entries(subjectStats).forEach(([subject, stats]) => {
        subjectProgress[subject] = stats.total > 0 ? 
          Math.round((stats.completed / stats.total) * 100) : 0;
      });

      // Weekly goal progress (based on recent activity)
      const weekAgo = new Date();
      weekAgo.setDate(weekAgo.getDate() - 7);
      const weeklyAttempts = attempts.filter(attempt => 
        new Date(attempt.created_at) >= weekAgo
      ).length;
      const weeklyGoalProgress = Math.min(100, (weeklyAttempts / 20) * 100); // Target: 20 attempts per week

      // Recent achievements (based on completed nodes)
      const recentAchievements = progress
        .filter(p => p.status === 'completed')
        .slice(0, 3)
        .map(p => p.learning_nodes?.title || 'Nodo completado');

      // Next milestone
      const nextMilestone = {
        name: 'Próximo nodo por completar',
        progress: progress.filter(p => p.status === 'in_progress').length,
        target: 5
      };

      // Calculate additional metrics required by components
      const totalSessions = Math.ceil(attempts.length / 5); // Estimate sessions from attempts
      const totalStudyTime = Math.round(attempts.length * 2 / 60); // Convert to hours
      const streakDays = currentStreak;
      
      // Learning velocity based on recent completion rate
      const recentCompletions = progress.filter(p => {
        if (!p.completed_at || p.status !== 'completed') return false;
        const completionDate = new Date(p.completed_at);
        return completionDate >= weekAgo;
      }).length;
      const learningVelocity = Math.min(100, recentCompletions * 20);
      
      // Retention rate based on mastery levels
      const masterySum = progress.reduce((sum, p) => sum + (p.mastery_level || 0), 0);
      const retentionRate = progress.length > 0 ? Math.round((masterySum / progress.length) * 100) : 0;
      
      // Cognitive load (inverse of average session performance)
      const avgCorrectRate = attempts.length > 0 ? 
        attempts.filter(a => a.is_correct).length / attempts.length : 0.5;
      const cognitiveLoad = Math.round((1 - avgCorrectRate) * 100);
      
      // Weekly growth rate
      const twoWeeksAgo = new Date();
      twoWeeksAgo.setDate(twoWeeksAgo.getDate() - 14);
      const lastWeekAttempts = attempts.filter(attempt => {
        const attemptDate = new Date(attempt.created_at);
        return attemptDate >= twoWeeksAgo && attemptDate < weekAgo;
      }).length;
      const weeklyGrowth = lastWeekAttempts > 0 ? 
        Math.round(((weeklyAttempts - lastWeekAttempts) / lastWeekAttempts) * 100) : 0;

      const realMetrics: RealProgressMetrics = {
        overallProgress,
        weeklyGoalProgress: Math.round(weeklyGoalProgress),
        completedNodes,
        totalNodes: totalNodesCount,
        currentStreak,
        studyTimeToday,
        averageSessionTime,
        subjectProgress,
        recentAchievements,
        nextMilestone,
        learningVelocity,
        retentionRate,
        cognitiveLoad,
        weeklyGrowth,
        totalSessions,
        totalStudyTime,
        streakDays
      };

      setMetrics(realMetrics);
    } catch (error) {
      console.error('Error fetching real progress data:', error);
      setMetrics({
        overallProgress: 0,
        weeklyGoalProgress: 0,
        completedNodes: 0,
        totalNodes: 0,
        currentStreak: 0,
        studyTimeToday: 0,
        averageSessionTime: 0,
        subjectProgress: {},
        recentAchievements: [],
        nextMilestone: { name: 'Sin datos', progress: 0, target: 1 },
        learningVelocity: 0,
        retentionRate: 0,
        cognitiveLoad: 0,
        weeklyGrowth: 0,
        totalSessions: 0,
        totalStudyTime: 0,
        streakDays: 0
      });
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchRealProgressData();
  }, [user?.id]);

  return { 
    metrics, 
    isLoading,
    refetch: fetchRealProgressData 
  };
};
