import { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/integrations/supabase/client';
import { toast } from '@/components/ui/use-toast';

interface StudyStreakData {
  currentStreak: number;
  longestStreak: number;
  lastStudyDate: string | null;
  totalStudyDays: number;
}

export const useStudyStreak = () => {
  const { profile } = useAuth();
  const [streakData, setStreakData] = useState<StudyStreakData>({
    currentStreak: 0,
    longestStreak: 0,
    lastStudyDate: null,
    totalStudyDays: 0
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Fetch streak data
  const fetchStreakData = async () => {
    if (!profile?.id) return;
    
    try {
      setLoading(true);
      setError(null);
      
      // Try to get streak data from localStorage first for quick loading
      const cachedData = localStorage.getItem(`study_streak_${profile.id}`);
      if (cachedData) {
        setStreakData(JSON.parse(cachedData));
      }
      
      // Then fetch from user_node_progress to calculate streak data
      const { data: progressData, error: progressError } = await supabase
        .from('user_node_progress')
        .select('completed_at, last_activity_at')
        .eq('user_id', profile.id)
        .order('last_activity_at', { ascending: false });
      
      if (progressError) {
        console.error('Error fetching streak data:', progressError);
        return;
      }
      
      if (progressData && progressData.length > 0) {
        // Get unique study days from last_activity_at
        const studyDays = new Set<string>();
        let lastActivityDate: string | null = null;
        
        progressData.forEach(record => {
          if (record.last_activity_at) {
            const date = new Date(record.last_activity_at).toISOString().split('T')[0];
            studyDays.add(date);
            
            // Track the most recent activity date
            if (!lastActivityDate || date > lastActivityDate) {
              lastActivityDate = date;
            }
          }
        });
        
        // Calculate streak
        let currentStreak = 0;
        let longestStreak = 0;
        const today = new Date().toISOString().split('T')[0];
        const yesterday = new Date(Date.now() - 86400000).toISOString().split('T')[0];
        
        // Check if user studied today or yesterday to maintain streak
        const hasStudiedRecently = lastActivityDate === today || lastActivityDate === yesterday;
        
        if (hasStudiedRecently) {
          // Calculate current streak by checking consecutive days backwards
          currentStreak = 1; // Count today/yesterday
          
          // Count consecutive days before today/yesterday
          let checkDate = lastActivityDate === today ? yesterday : 
                         new Date(Date.now() - 2 * 86400000).toISOString().split('T')[0];
          
          while (studyDays.has(checkDate)) {
            currentStreak++;
            const prevDate = new Date(new Date(checkDate).getTime() - 86400000);
            checkDate = prevDate.toISOString().split('T')[0];
          }
          
          // Update longest streak if needed
          longestStreak = Math.max(currentStreak, longestStreak);
        } else {
          // Streak broken, but calculate longest streak from historical data
          // This would require more complex logic to find consecutive days in the past
          // For simplicity, we'll just use the total study days as an approximation
          longestStreak = studyDays.size > 0 ? studyDays.size : 0;
        }
        
        const updatedData = {
          currentStreak: currentStreak,
          longestStreak: longestStreak,
          lastStudyDate: lastActivityDate,
          totalStudyDays: studyDays.size
        };
        
        setStreakData(updatedData);
        
        // Cache in localStorage
        localStorage.setItem(`study_streak_${profile.id}`, JSON.stringify(updatedData));
      }
    } catch (err) {
      console.error('Error in fetchStreakData:', err);
      setError('No se pudo cargar los datos de racha de estudio');
    } finally {
      setLoading(false);
    }
  };

  // Update streak when user studies
  const updateStreak = async () => {
    if (!profile?.id) return;
    
    try {
      setLoading(true);
      
      const today = new Date().toISOString().split('T')[0];
      let newStreak = streakData.currentStreak;
      let longestStreak = streakData.longestStreak;
      
      // If last study date is yesterday, increment streak
      // If last study date is today, keep streak
      // Otherwise, reset streak to 1
      if (streakData.lastStudyDate) {
        const lastDate = new Date(streakData.lastStudyDate);
        const todayDate = new Date(today);
        const diffTime = todayDate.getTime() - lastDate.getTime();
        const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
        
        if (diffDays === 1) {
          // Yesterday - increment streak
          newStreak += 1;
        } else if (diffDays !== 0) {
          // Not yesterday or today - reset streak
          newStreak = 1;
        }
      } else {
        // First time studying
        newStreak = 1;
      }
      
      // Update longest streak if needed
      if (newStreak > longestStreak) {
        longestStreak = newStreak;
      }
      
      // Record study activity in user_node_progress
      // This is just a placeholder - in a real app, this would be
      // done when user completes a specific node
      const { error } = await supabase
        .from('user_node_progress')
        .insert({
          user_id: profile.id,
          node_id: '00000000-0000-0000-0000-000000000000', // Placeholder node ID
          status: 'in_progress',
          progress: 50,
          last_activity_at: new Date().toISOString()
        });
      
      if (error) {
        console.error('Error updating streak:', error);
        return;
      }
      
      // Update local state
      const updatedData = {
        ...streakData,
        currentStreak: newStreak,
        longestStreak,
        lastStudyDate: today,
        totalStudyDays: streakData.totalStudyDays + 1
      };
      
      setStreakData(updatedData);
      
      // Update cache
      localStorage.setItem(`study_streak_${profile.id}`, JSON.stringify(updatedData));
      
    } catch (err) {
      console.error('Error in updateStreak:', err);
      setError('No se pudo actualizar la racha de estudio');
    } finally {
      setLoading(false);
    }
  };

  // Load streak data when profile changes
  useEffect(() => {
    if (profile?.id) {
      fetchStreakData();
    }
  }, [profile?.id]);

  return {
    streakData,
    loading,
    error,
    updateStreak,
    refreshStreakData: fetchStreakData
  };
};
