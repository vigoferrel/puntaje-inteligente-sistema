
import { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/integrations/supabase/client';
import { toast } from '@/components/ui/use-toast';
import { ultraSilentLogger } from '@/core/logging/UltraSilentLogger';

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
        ultraSilentLogger.emergency('Error fetching streak data:', progressError);
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
        
        const hasStudiedRecently = lastActivityDate === today || lastActivityDate === yesterday;
        
        if (hasStudiedRecently) {
          currentStreak = 1;
          let checkDate = lastActivityDate === today ? yesterday : 
                         new Date(Date.now() - 2 * 86400000).toISOString().split('T')[0];
          
          while (studyDays.has(checkDate)) {
            currentStreak++;
            const prevDate = new Date(new Date(checkDate).getTime() - 86400000);
            checkDate = prevDate.toISOString().split('T')[0];
          }
          
          longestStreak = Math.max(currentStreak, longestStreak);
        } else {
          longestStreak = studyDays.size > 0 ? studyDays.size : 0;
        }
        
        const updatedData = {
          currentStreak: currentStreak,
          longestStreak: longestStreak,
          lastStudyDate: lastActivityDate,
          totalStudyDays: studyDays.size
        };
        
        setStreakData(updatedData);
        localStorage.setItem(`study_streak_${profile.id}`, JSON.stringify(updatedData));
      }
    } catch (err) {
      ultraSilentLogger.emergency('Error in fetchStreakData:', err);
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
      
      if (streakData.lastStudyDate) {
        const lastDate = new Date(streakData.lastStudyDate);
        const todayDate = new Date(today);
        const diffTime = todayDate.getTime() - lastDate.getTime();
        const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
        
        if (diffDays === 1) {
          newStreak += 1;
        } else if (diffDays !== 0) {
          newStreak = 1;
        }
      } else {
        newStreak = 1;
      }
      
      if (newStreak > longestStreak) {
        longestStreak = newStreak;
      }
      
      const { error } = await supabase
        .from('user_node_progress')
        .insert({
          user_id: profile.id,
          node_id: '00000000-0000-0000-0000-000000000000',
          status: 'in_progress',
          progress: 50,
          last_activity_at: new Date().toISOString()
        });
      
      if (error) {
        ultraSilentLogger.emergency('Error updating streak:', error);
        return;
      }
      
      const updatedData = {
        ...streakData,
        currentStreak: newStreak,
        longestStreak,
        lastStudyDate: today,
        totalStudyDays: streakData.totalStudyDays + 1
      };
      
      setStreakData(updatedData);
      localStorage.setItem(`study_streak_${profile.id}`, JSON.stringify(updatedData));
      
    } catch (err) {
      ultraSilentLogger.emergency('Error in updateStreak:', err);
      setError('No se pudo actualizar la racha de estudio');
    } finally {
      setLoading(false);
    }
  };

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
