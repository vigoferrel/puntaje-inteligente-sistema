
import { useState, useEffect } from 'react';
import { NeuralBackendService, BattleSession } from '@/services/neural/neural-backend-service';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/integrations/supabase/client';

export const useBattleSystem = () => {
  const { user } = useAuth();
  const [availableBattles, setAvailableBattles] = useState<BattleSession[]>([]);
  const [userBattles, setUserBattles] = useState<BattleSession[]>([]);
  const [activeBattle, setActiveBattle] = useState<BattleSession | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  const loadBattles = async () => {
    if (!user) return;

    try {
      setIsLoading(true);
      const [available, userBattlesList] = await Promise.all([
        NeuralBackendService.getAvailableBattles(user.id),
        NeuralBackendService.getUserBattles(user.id)
      ]);

      setAvailableBattles(available);
      setUserBattles(userBattlesList);

      // Encontrar batalla activa
      const active = userBattlesList.find(b => b.status === 'in_progress');
      setActiveBattle(active || null);
    } catch (error) {
      console.error('Error loading battles:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const createBattle = async (battleData: {
    battle_type: string;
    difficulty_level: string;
    subject_focus: string;
    max_questions?: number;
    time_limit_minutes?: number;
  }) => {
    if (!user) throw new Error('User not authenticated');

    try {
      const newBattle = await NeuralBackendService.createBattleSession({
        ...battleData,
        creator_id: user.id,
        status: 'waiting'
      });

      setAvailableBattles(prev => [newBattle, ...prev]);
      return newBattle;
    } catch (error) {
      console.error('Error creating battle:', error);
      throw error;
    }
  };

  const joinBattle = async (battleId: string) => {
    if (!user) throw new Error('User not authenticated');

    try {
      const updatedBattle = await NeuralBackendService.joinBattle(battleId, user.id);
      
      setAvailableBattles(prev => prev.filter(b => b.id !== battleId));
      setUserBattles(prev => [updatedBattle, ...prev]);
      setActiveBattle(updatedBattle);

      return updatedBattle;
    } catch (error) {
      console.error('Error joining battle:', error);
      throw error;
    }
  };

  const updateBattleScore = async (battleId: string, score: number) => {
    if (!user) throw new Error('User not authenticated');

    try {
      await NeuralBackendService.updateBattleScore(battleId, user.id, score);
      
      // Actualizar batalla local
      setUserBattles(prev => prev.map(b => 
        b.id === battleId 
          ? { 
              ...b, 
              [b.creator_id === user.id ? 'creator_score' : 'opponent_score']: score 
            }
          : b
      ));

      if (activeBattle && activeBattle.id === battleId) {
        setActiveBattle(prev => prev ? {
          ...prev,
          [prev.creator_id === user.id ? 'creator_score' : 'opponent_score']: score
        } : null);
      }
    } catch (error) {
      console.error('Error updating battle score:', error);
      throw error;
    }
  };

  const completeBattle = async (battleId: string, winnerId?: string) => {
    try {
      await NeuralBackendService.completeBattle(battleId, winnerId);
      
      setUserBattles(prev => prev.map(b => 
        b.id === battleId 
          ? { ...b, status: 'completed' as const, winner_id: winnerId, ended_at: new Date().toISOString() }
          : b
      ));

      if (activeBattle && activeBattle.id === battleId) {
        setActiveBattle(null);
      }

      // Actualizar rankings si hay ganador
      if (winnerId && user) {
        await NeuralBackendService.updateUserRanking(
          winnerId,
          'battle_ranking',
          1, // Incrementar score
          {
            victories: 1,
            total_battles: 1,
            last_battle_at: new Date().toISOString()
          }
        );

        // Verificar logros
        await supabase.functions.invoke('achievement-engine', {
          body: {
            user_id: winnerId,
            action_type: 'battle_won',
            action_data: { battle_id: battleId, opponent_id: winnerId === user.id ? 'opponent' : user.id }
          }
        });
      }
    } catch (error) {
      console.error('Error completing battle:', error);
      throw error;
    }
  };

  const subscribeToBattle = (battleId: string) => {
    if (!battleId) return null;

    return NeuralBackendService.subscribeToBattleUpdates(
      battleId,
      (updatedBattle) => {
        setUserBattles(prev => prev.map(b => 
          b.id === battleId ? updatedBattle : b
        ));

        if (activeBattle && activeBattle.id === battleId) {
          setActiveBattle(updatedBattle);
        }
      }
    );
  };

  useEffect(() => {
    if (user) {
      loadBattles();
    }
  }, [user]);

  return {
    availableBattles,
    userBattles,
    activeBattle,
    isLoading,
    loadBattles,
    createBattle,
    joinBattle,
    updateBattleScore,
    completeBattle,
    subscribeToBattle
  };
};
