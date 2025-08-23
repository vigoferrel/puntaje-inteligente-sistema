
import { useState, useEffect, useCallback } from 'react';
import { NeuralBackendService } from '@/services/neural/neural-backend-service';
import { useAuth } from '@/contexts/AuthContext';

export const useNeuralBackend = () => {
  const { user } = useAuth();
  const [analytics, setAnalytics] = useState<any>(null);
  const [achievements, setAchievements] = useState<any[]>([]);
  const [recommendations, setRecommendations] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  // Cargar datos iniciales
  useEffect(() => {
    if (!user) return;

    const loadInitialData = async () => {
      setIsLoading(true);
      try {
        const [analyticsData, achievementsData, recommendationsData] = await Promise.all([
          NeuralBackendService.getNeuralAnalytics(7),
          NeuralBackendService.getUserAchievements(user.id),
          NeuralBackendService.getUserRecommendations(user.id)
        ]);

        setAnalytics(analyticsData);
        setAchievements(achievementsData);
        setRecommendations(recommendationsData);
      } catch (error) {
        console.error('Error loading neural backend data:', error);
      } finally {
        setIsLoading(false);
      }
    };

    loadInitialData();
  }, [user]);

  // Suscripciones en tiempo real
  useEffect(() => {
    if (!user) return;

    const achievementsSubscription = NeuralBackendService.subscribeToUserAchievements(
      user.id,
      (newAchievement) => {
        setAchievements(prev => [newAchievement, ...prev]);
        console.log('🏆 New achievement unlocked!', newAchievement);
      }
    );

    const recommendationsSubscription = NeuralBackendService.subscribeToRecommendations(
      user.id,
      (newRecommendation) => {
        setRecommendations(prev => [newRecommendation, ...prev]);
        console.log('💡 New recommendation:', newRecommendation);
      }
    );

    return () => {
      achievementsSubscription.unsubscribe();
      recommendationsSubscription.unsubscribe();
    };
  }, [user]);

  // Funciones de utilidad
  const trackEvent = useCallback(async (eventType: string, eventData: any, neuralMetrics: any) => {
    if (!user) return;

    try {
      const sessionId = await NeuralBackendService.trackNeuralEvent({
        event_type: eventType,
        event_data: eventData,
        neural_metrics: neuralMetrics,
        component_source: 'neural-backend-hook'
      });

      return sessionId;
    } catch (error) {
      console.error('Error tracking neural event:', error);
    }
  }, [user]);

  const triggerAchievement = useCallback(async (actionType: string, actionData: any) => {
    if (!user) return;

    try {
      const result = await NeuralBackendService.triggerAchievementCheck({
        user_id: user.id,
        action_type: actionType,
        action_data: actionData
      });

      if (result.achievements_unlocked > 0) {
        console.log(`🎉 ${result.achievements_unlocked} achievements unlocked!`);
      }

      return result;
    } catch (error) {
      console.error('Error triggering achievement check:', error);
    }
  }, [user]);

  const refreshAnalytics = useCallback(async () => {
    if (!user) return;

    setIsLoading(true);
    try {
      const data = await NeuralBackendService.getNeuralAnalytics(7);
      setAnalytics(data);
    } catch (error) {
      console.error('Error refreshing analytics:', error);
    } finally {
      setIsLoading(false);
    }
  }, [user]);

  const generateRecommendations = useCallback(async () => {
    if (!user) return;

    try {
      await NeuralBackendService.generateRecommendations();
      // Las recomendaciones se actualizarán automáticamente via suscripción
    } catch (error) {
      console.error('Error generating recommendations:', error);
    }
  }, [user]);

  return {
    // Estado
    analytics,
    achievements,
    recommendations,
    isLoading,

    // Acciones
    trackEvent,
    triggerAchievement,
    refreshAnalytics,
    generateRecommendations,

    // Métricas de conveniencia
    totalAchievements: achievements.length,
    totalPoints: achievements.reduce((sum, a) => sum + (a.intelligent_achievements?.points_reward || 0), 0),
    activeRecommendations: recommendations.filter(r => r.is_active).length,
    engagementTrend: analytics?.metrics?.trend_analysis?.recent_avg > analytics?.metrics?.trend_analysis?.overall_avg ? 'up' : 'down'
  };
};
