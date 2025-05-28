
import { useState, useCallback, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { useLectoGuiaChat } from '@/hooks/lectoguia-chat';
import { useLectoGuiaSession } from '@/hooks/use-lectoguia-session';
import { supabase } from '@/integrations/supabase/client';
import { toast } from '@/components/ui/use-toast';

export type LectoGuiaTab = 'chat' | 'exercise' | 'analysis' | 'simulation';

interface RealStats {
  totalExercises: number;
  correctAnswers: number;
  averageTime: number;
  currentStreak: number;
  skillLevels: Record<string, number>;
}

export function useLectoGuiaReal() {
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState<LectoGuiaTab>('chat');
  const [isLoading, setIsLoading] = useState(false);
  const [stats, setStats] = useState<RealStats | null>(null);
  
  // Use real chat hook
  const {
    messages,
    isTyping,
    processUserMessage,
    activeSkill,
    setActiveSkill,
    connectionStatus,
    serviceStatus,
    generateExerciseForSkill
  } = useLectoGuiaChat();

  // Use real session hook
  const { session, saveExerciseAttempt } = useLectoGuiaSession();

  // Real subject management
  const [activeSubject, setActiveSubject] = useState('COMPETENCIA_LECTORA');

  // Real exercise state
  const [currentExercise, setCurrentExercise] = useState<any>(null);
  const [selectedOption, setSelectedOption] = useState<number | null>(null);
  const [showFeedback, setShowFeedback] = useState(false);

  // Load real user stats from database
  const loadRealStats = useCallback(async () => {
    if (!user?.id) return;

    try {
      // Fetch real exercise attempts
      const { data: attempts, error: attemptsError } = await supabase
        .from('user_exercise_attempts')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false });

      if (attemptsError) throw attemptsError;

      // Fetch real node progress with learning_nodes join
      const { data: nodeProgress, error: nodeError } = await supabase
        .from('user_node_progress')
        .select(`
          *,
          learning_nodes!inner(
            subject_area,
            test_id,
            skill_id
          )
        `)
        .eq('user_id', user.id);

      if (nodeError) throw nodeError;

      // Calculate real statistics
      const totalExercises = attempts?.length || 0;
      const correctAnswers = attempts?.filter(a => a.is_correct).length || 0;
      const averageTime = totalExercises > 0 
        ? Math.round((attempts?.reduce((sum, a) => sum + (a.time_taken_seconds || 0), 0) || 0) / totalExercises)
        : 0;

      // Calculate current streak
      let currentStreak = 0;
      if (attempts && attempts.length > 0) {
        for (const attempt of attempts) {
          if (attempt.is_correct) {
            currentStreak++;
          } else {
            break;
          }
        }
      }

      // Calculate skill levels from real progress
      const skillLevels: Record<string, number> = {};
      nodeProgress?.forEach(np => {
        const skillKey = np.learning_nodes?.subject_area || 'general';
        skillLevels[skillKey] = Math.round((np.mastery_level || 0) * 100);
      });

      setStats({
        totalExercises,
        correctAnswers,
        averageTime,
        currentStreak,
        skillLevels
      });

    } catch (error) {
      console.error('Error loading real stats:', error);
      toast({
        title: "Error",
        description: "No se pudieron cargar las estadísticas reales",
        variant: "destructive"
      });
    }
  }, [user?.id]);

  // Load stats on mount and user change
  useEffect(() => {
    loadRealStats();
  }, [loadRealStats]);

  // Real message handling
  const handleSendMessage = useCallback(async (message: string, imageData?: string) => {
    try {
      setIsLoading(true);
      await processUserMessage(message, imageData);
    } catch (error) {
      console.error('Error sending message:', error);
      toast({
        title: "Error",
        description: "Error enviando mensaje",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  }, [processUserMessage]);

  // Real subject change
  const handleSubjectChange = useCallback((newSubject: string) => {
    setActiveSubject(newSubject);
    // Clear current exercise when changing subjects
    setCurrentExercise(null);
    setSelectedOption(null);
    setShowFeedback(false);
  }, []);

  // Real option selection with database persistence
  const handleOptionSelect = useCallback(async (option: number) => {
    if (!currentExercise || !user?.id) return;

    setSelectedOption(option);
    setShowFeedback(true);

    const isCorrect = currentExercise.options[option] === currentExercise.correctAnswer;

    try {
      // Save real attempt to database using correct function signature
      await saveExerciseAttempt(
        currentExercise.id || 'generated',
        option,
        isCorrect,
        Date.now() - (currentExercise.startTime || Date.now()),
        {
          skillType: activeSkill || 'INTERPRET_RELATE',
          prueba: activeSubject
        }
      );

      // Reload stats after saving attempt
      setTimeout(() => {
        loadRealStats();
      }, 1000);

    } catch (error) {
      console.error('Error saving exercise attempt:', error);
    }
  }, [currentExercise, user?.id, activeSkill, activeSubject, saveExerciseAttempt, loadRealStats]);

  // Real exercise generation
  const handleNewExercise = useCallback(async () => {
    try {
      setIsLoading(true);
      const exercise = await generateExerciseForSkill(activeSkill || 'INTERPRET_RELATE');
      
      if (exercise) {
        setCurrentExercise({
          ...exercise,
          startTime: Date.now()
        });
        setSelectedOption(null);
        setShowFeedback(false);
      }
    } catch (error) {
      console.error('Error generating exercise:', error);
      toast({
        title: "Error",
        description: "Error generando ejercicio",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  }, [activeSkill, generateExerciseForSkill]);

  // Real stats getter
  const getStats = useCallback(() => {
    if (!stats) {
      return {
        totalExercises: 0,
        correctAnswers: 0,
        successRate: 0,
        averageTime: 0,
        currentStreak: 0,
        skillLevels: session.skillLevels
      };
    }

    return {
      ...stats,
      successRate: stats.totalExercises > 0 ? Math.round((stats.correctAnswers / stats.totalExercises) * 100) : 0
    };
  }, [stats, session.skillLevels]);

  return {
    // Tab management
    activeTab,
    setActiveTab,
    
    // Real chat
    messages,
    isTyping,
    handleSendMessage,
    connectionStatus,
    serviceStatus,
    
    // Real subject management
    activeSubject,
    handleSubjectChange,
    
    // Real exercise management
    currentExercise,
    selectedOption,
    showFeedback,
    handleOptionSelect,
    handleNewExercise,
    
    // Real loading states
    isLoading,
    
    // Real statistics
    getStats,
    
    // Session data
    skillLevels: session.skillLevels,
    
    // Real skill management
    activeSkill,
    setActiveSkill
  };
}
