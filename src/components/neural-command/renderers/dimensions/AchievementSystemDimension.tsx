
import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { useOptimizedRealNeuralMetrics } from '@/hooks/useOptimizedRealNeuralMetrics';

interface Achievement {
  id: string;
  achievement_id: string;
  title: string;
  description: string;
  category: string;
  rarity: string;
  points_awarded: number;
  unlocked_at: string;
  metadata: any;
}

export const AchievementSystemDimension: React.FC = () => {
  const { user } = useAuth();
  const { metrics } = useOptimizedRealNeuralMetrics();
  const [achievements, setAchievements] = useState<Achievement[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const achievementMomentum = metrics?.achievement_momentum || 85;
  const totalPoints = achievements.reduce((sum, achievement) => sum + achievement.points_awarded, 0);

  useEffect(() => {
    const fetchAchievements = async () => {
      if (!user?.id) return;

      try {
        const { data, error } = await supabase
          .from('user_achievements')
          .select('*')
          .eq('user_id', user.id)
          .order('unlocked_at', { ascending: false });

        if (error) throw error;
        setAchievements(data || []);
      } catch (error) {
        console.error('Error cargando logros:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchAchievements();
  }, [user?.id]);

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
      case 'legendary': return '👑';
      case 'epic': return '💎';
      case 'rare': return '🌟';
      default: return '🏅';
    }
  };

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case 'academic': return '🎓';
      case 'battle': return '⚔️';
      case 'streak': return '🔥';
      case 'milestone': return '🎯';
      case 'creative': return '🎨';
      case 'social': return '👥';
      default: return '🏆';
    }
  };

  if (isLoading) {
    return (
      <div className="p-6 min-h-screen bg-gradient-to-br from-yellow-900 via-amber-900 to-orange-900 flex items-center justify-center">
        <div className="text-white text-xl">Cargando logros...</div>
      </div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="p-6 min-h-screen bg-gradient-to-br from-yellow-900 via-amber-900 to-orange-900"
    >
      <div className="max-w-6xl mx-auto space-y-6">
        <motion.div
          animate={{ 
            rotateY: [0, 360],
            scale: [1, 1.1, 1]
          }}
          transition={{ duration: 4, repeat: Infinity }}
          className="text-center"
        >
          <div className="mx-auto w-32 h-32 bg-gradient-to-r from-yellow-500 to-amber-500 rounded-full flex items-center justify-center text-4xl mb-4">
            🏆
          </div>
          <h2 className="text-4xl font-bold text-white">Sistema de Logros</h2>
          <p className="text-white/70 text-lg max-w-2xl mx-auto mt-2">
            Celebra tus éxitos académicos y desbloquea recompensas épicas
          </p>
        </motion.div>

        {/* Métricas de Logros */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="bg-white/10 rounded-lg p-4 backdrop-blur-sm">
            <h3 className="text-yellow-400 font-bold text-xl mb-2">🎯 Momentum</h3>
            <div className="text-3xl font-bold text-white mb-2">{achievementMomentum}%</div>
            <div className="w-full bg-white/20 rounded-full h-2">
              <div 
                className="bg-yellow-500 h-2 rounded-full transition-all duration-1000"
                style={{ width: `${achievementMomentum}%` }}
              />
            </div>
          </div>
          
          <div className="bg-white/10 rounded-lg p-4 backdrop-blur-sm">
            <h3 className="text-amber-400 font-bold text-xl mb-2">🏅 Total Logros</h3>
            <div className="text-3xl font-bold text-white">{achievements.length}</div>
            <div className="text-white/70">Logros desbloqueados</div>
          </div>
          
          <div className="bg-white/10 rounded-lg p-4 backdrop-blur-sm">
            <h3 className="text-orange-400 font-bold text-xl mb-2">⭐ Puntos</h3>
            <div className="text-3xl font-bold text-white">{totalPoints.toLocaleString()}</div>
            <div className="text-white/70">Puntos totales</div>
          </div>
        </div>

        {/* Logros Recientes */}
        {achievements.length > 0 && (
          <div>
            <h3 className="text-white font-bold text-2xl mb-4">🎊 Logros Recientes</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {achievements.slice(0, 6).map((achievement, index) => (
                <motion.div
                  key={achievement.id}
                  initial={{ opacity: 0, y: 20, scale: 0.9 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  transition={{ delay: index * 0.1 }}
                  className={`rounded-lg p-4 backdrop-blur-sm bg-gradient-to-r ${getRarityColor(achievement.rarity)}/20 border border-white/20`}
                >
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex items-center space-x-2">
                      <span className="text-2xl">{getRarityIcon(achievement.rarity)}</span>
                      <span className="text-xl">{getCategoryIcon(achievement.category)}</span>
                    </div>
                    <div className="text-right">
                      <div className="text-yellow-400 font-bold">+{achievement.points_awarded}</div>
                      <div className="text-white/60 text-xs capitalize">{achievement.rarity}</div>
                    </div>
                  </div>
                  
                  <h4 className="text-white font-bold mb-2">{achievement.title}</h4>
                  <p className="text-white/70 text-sm mb-3">{achievement.description}</p>
                  
                  <div className="flex justify-between items-center text-xs">
                    <span className="text-white/60 capitalize">{achievement.category}</span>
                    <span className="text-white/60">
                      {new Date(achievement.unlocked_at).toLocaleDateString()}
                    </span>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        )}

        {/* Categorías de Logros */}
        <div>
          <h3 className="text-white font-bold text-2xl mb-4">📊 Progreso por Categoría</h3>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {['academic', 'battle', 'streak', 'milestone'].map((category) => {
              const categoryAchievements = achievements.filter(a => a.category === category);
              const categoryPoints = categoryAchievements.reduce((sum, a) => sum + a.points_awarded, 0);
              
              return (
                <div key={category} className="bg-white/10 rounded-lg p-4 backdrop-blur-sm text-center">
                  <div className="text-3xl mb-2">{getCategoryIcon(category)}</div>
                  <div className="text-white font-bold capitalize">{category}</div>
                  <div className="text-2xl font-bold text-yellow-400">{categoryAchievements.length}</div>
                  <div className="text-white/60 text-sm">{categoryPoints} pts</div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Estado Sin Logros */}
        {achievements.length === 0 && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-center py-12"
          >
            <div className="text-6xl mb-4">🎯</div>
            <h3 className="text-white font-bold text-2xl mb-2">¡Comienza tu Aventura!</h3>
            <p className="text-white/70 mb-6">
              Completa ejercicios, participa en batallas y alcanza metas para desbloquear logros épicos
            </p>
            <Button className="bg-yellow-600 hover:bg-yellow-500 text-black font-bold">
              Explorar Actividades
            </Button>
          </motion.div>
        )}
      </div>
    </motion.div>
  );
};
