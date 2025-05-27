
import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { useNeuralBackend } from '@/hooks/useNeuralBackend';
import { Award, Star, Trophy, Zap } from 'lucide-react';

interface AchievementNotificationProps {
  achievement: any;
  onDismiss: () => void;
}

const AchievementNotification: React.FC<AchievementNotificationProps> = ({ 
  achievement, 
  onDismiss 
}) => {
  const getRarityColor = (rarity: string) => {
    switch (rarity) {
      case 'legendary': return 'from-yellow-500 to-orange-500';
      case 'epic': return 'from-purple-500 to-pink-500';
      case 'rare': return 'from-blue-500 to-cyan-500';
      default: return 'from-gray-500 to-gray-600';
    }
  };

  const getRarityIcon = (rarity: string) => {
    switch (rarity) {
      case 'legendary': return Trophy;
      case 'epic': return Star;
      case 'rare': return Award;
      default: return Zap;
    }
  };

  const Icon = getRarityIcon(achievement.rarity);

  return (
    <motion.div
      initial={{ scale: 0, opacity: 0, y: 50 }}
      animate={{ scale: 1, opacity: 1, y: 0 }}
      exit={{ scale: 0, opacity: 0, y: -50 }}
      transition={{ 
        type: "spring", 
        stiffness: 300, 
        damping: 20,
        duration: 0.6 
      }}
      className="fixed bottom-4 right-4 z-50"
      onClick={onDismiss}
    >
      <Card className={`bg-gradient-to-r ${getRarityColor(achievement.rarity)} border-none shadow-2xl cursor-pointer max-w-sm`}>
        <CardContent className="p-4">
          <div className="flex items-center space-x-3">
            <motion.div
              animate={{ 
                rotate: [0, 10, -10, 0],
                scale: [1, 1.1, 1]
              }}
              transition={{ 
                duration: 2,
                repeat: Infinity,
                repeatType: "reverse"
              }}
              className="bg-white/20 p-2 rounded-full"
            >
              <Icon className="w-6 h-6 text-white" />
            </motion.div>
            <div className="flex-1">
              <h3 className="font-bold text-white text-sm">¡Logro Desbloqueado!</h3>
              <p className="text-white/90 font-semibold">{achievement.title}</p>
              <p className="text-white/80 text-xs">{achievement.description}</p>
              <div className="flex items-center gap-2 mt-1">
                <Badge variant="secondary" className="bg-white/20 text-white text-xs">
                  +{achievement.points_reward} pts
                </Badge>
                <Badge variant="outline" className="border-white/40 text-white text-xs capitalize">
                  {achievement.rarity}
                </Badge>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
};

export const IntelligentAchievementSystem: React.FC = () => {
  const { achievements } = useNeuralBackend();
  const [visibleNotifications, setVisibleNotifications] = useState<any[]>([]);
  const [lastAchievementCount, setLastAchievementCount] = useState(0);

  // Detectar nuevos logros y mostrar notificaciones
  React.useEffect(() => {
    if (achievements.length > lastAchievementCount && lastAchievementCount > 0) {
      const newAchievements = achievements.slice(0, achievements.length - lastAchievementCount);
      
      newAchievements.forEach((achievement, index) => {
        setTimeout(() => {
          setVisibleNotifications(prev => [...prev, {
            ...achievement.intelligent_achievements,
            id: achievement.id,
            unlocked_at: achievement.unlocked_at
          }]);
        }, index * 1000); // Mostrar con delay entre cada una
      });
    }
    setLastAchievementCount(achievements.length);
  }, [achievements, lastAchievementCount]);

  const dismissNotification = (achievementId: string) => {
    setVisibleNotifications(prev => 
      prev.filter(notif => notif.id !== achievementId)
    );
  };

  // Auto-dismiss después de 5 segundos
  React.useEffect(() => {
    visibleNotifications.forEach(notification => {
      setTimeout(() => {
        dismissNotification(notification.id);
      }, 5000);
    });
  }, [visibleNotifications]);

  return (
    <div>
      <AnimatePresence>
        {visibleNotifications.map((achievement, index) => (
          <motion.div
            key={achievement.id}
            style={{ 
              bottom: `${4 + (index * 120)}px` // Stack notifications
            }}
            className="fixed right-4 z-50"
          >
            <AchievementNotification
              achievement={achievement}
              onDismiss={() => dismissNotification(achievement.id)}
            />
          </motion.div>
        ))}
      </AnimatePresence>
    </div>
  );
};

// Hook para trigger manual de logros
export const useAchievementTrigger = () => {
  const { triggerAchievement } = useNeuralBackend();

  const triggerEngagementMilestone = (engagement: number, duration: number) => {
    return triggerAchievement('engagement_milestone', {
      engagement,
      duration_minutes: duration,
      neural_metrics: { engagement }
    });
  };

  const triggerCoherenceAchievement = (coherence: number) => {
    return triggerAchievement('coherence_achievement', {
      coherence,
      neural_metrics: { coherence }
    });
  };

  const triggerInteractionCount = (totalInteractions: number) => {
    return triggerAchievement('interaction_count', {
      total_interactions: totalInteractions
    });
  };

  const triggerTransitionCount = (totalTransitions: number) => {
    return triggerAchievement('transition_count', {
      total_transitions: totalTransitions
    });
  };

  const triggerNeuralSessionStart = () => {
    return triggerAchievement('neural_session_start', {
      timestamp: Date.now()
    });
  };

  return {
    triggerEngagementMilestone,
    triggerCoherenceAchievement,
    triggerInteractionCount,
    triggerTransitionCount,
    triggerNeuralSessionStart
  };
};
