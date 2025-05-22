import { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/integrations/supabase/client';

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
      
      // Then fetch from the database for accuracy
      const { data, error } = await supabase
        .from('user_statistics')
        .select('current_streak_days, longest_streak_days, last_activity_date, total_study_time_minutes')
        .eq('user_id', profile.id)
        .single();
      
      if (error) {
        console.error('Error fetching streak data:', error);
        return;
      }
      
      if (data) {
        const updatedData = {
          currentStreak: data.current_streak_days || 0,
          longestStreak: data.longest_streak_days || 0,
          lastStudyDate: data.last_activity_date,
          totalStudyDays: Math.ceil((data.total_study_time_minutes || 0) / 30) // Rough estimate
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
      
      // Update in database
      const { error } = await supabase
        .from('user_statistics')
        .upsert({
          user_id: profile.id,
          current_streak_days: newStreak,
          longest_streak_days: longestStreak,
          last_activity_date: today,
          // We would also update total_study_time_minutes here
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
