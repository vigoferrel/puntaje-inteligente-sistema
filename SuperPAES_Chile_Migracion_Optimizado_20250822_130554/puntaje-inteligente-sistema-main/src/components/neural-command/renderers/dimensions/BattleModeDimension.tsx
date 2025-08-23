/* eslint-disable react-refresh/only-export-components */
import { FC } from 'react';
import type { SafeString, SafeNumber, SafeBoolean, APIResponse, OperationResult } from '../types/core';

import { motion } from 'framer-motion';
import { Button } from '../../../../components/ui/button';
import { useBattleSystem } from '../../../../hooks/useBattleSystem';
import { useOptimizedRealNeuralMetrics } from '../../../../hooks/useOptimizedRealNeuralMetrics';

export const BattleModeDimension: FC = () => {
  const { availableBattles, userBattles, activeBattle, createBattle, joinBattle } = useBattleSystem();
  const { metrics } = useOptimizedRealNeuralMetrics();

  const battleReadiness = metrics?.battle_readiness || 66;
  const gamificationEngagement = metrics?.gamification_engagement || 80;

  const handleCreateBattle = async () => {
    try {
      await createBattle({
        battle_type: 'paes_duel',
        difficulty_level: 'intermediate',
        subject_focus: 'competencia_lectora',
        max_questions: 10,
        time_limit_minutes: 15
      });
    } catch (error) {
      console.error('Error creando batalla:', error);
    }
  };

  const handleJoinBattle = async (battleId: string) => {
    try {
      await joinBattle(battleId);
    } catch (error) {
      console.error('Error uniÃ©ndose a batalla:', error);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      className="p-6 min-h-screen bg-gradient-to-br from-red-900 via-orange-900 to-yellow-900"
    >
      <div className="max-w-6xl mx-auto space-y-6">
        <motion.div
          animate={{ 
            scale: [1, 1.1, 1],
            rotate: [0, 5, -5, 0]
          }}
          transition={{ duration: 2, repeat: Infinity }}
          className="text-center"
        >
          <div className="mx-auto w-32 h-32 bg-gradient-to-r from-red-500 to-orange-500 rounded-full flex items-center justify-center text-4xl mb-4">
            âš”ï¸
          </div>
          <h2 className="text-4xl font-bold text-white">Modo Batalla Neural</h2>
          <p className="text-white/70 text-lg max-w-2xl mx-auto mt-2">
            Compite en batallas Ã©picas de conocimiento PAES en tiempo real
          </p>
        </motion.div>

        {/* MÃ©tricas de Battle Readiness */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="bg-white/10 rounded-lg p-4 backdrop-blur-sm">
            <h3 className="text-red-400 font-bold text-xl mb-2">ðŸ”¥ PreparaciÃ³n de Batalla</h3>
            <div className="text-3xl font-bold text-white mb-2">{battleReadiness}%</div>
            <div className="w-full bg-white/20 rounded-full h-2">
              <div 
                className="bg-red-500 h-2 rounded-full transition-all duration-1000"
                className="dynamic-progress-fill" data-progress={battleReadiness}
              />
            </div>
          </div>
          
          <div className="bg-white/10 rounded-lg p-4 backdrop-blur-sm">
            <h3 className="text-orange-400 font-bold text-xl mb-2">ðŸŽ® Engagement</h3>
            <div className="text-3xl font-bold text-white mb-2">{gamificationEngagement}%</div>
            <div className="w-full bg-white/20 rounded-full h-2">
              <div 
                className="bg-orange-500 h-2 rounded-full transition-all duration-1000"
                className="dynamic-progress-fill" data-progress={gamificationEngagement}
              />
            </div>
          </div>
        </div>

        {/* Batalla Activa */}
        {activeBattle && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-gradient-to-r from-red-900/80 to-orange-900/80 rounded-lg p-6 backdrop-blur-xl border border-red-500/30"
          >
            <h3 className="text-white font-bold text-xl mb-4">ðŸŸï¸ Batalla Activa</h3>
            <div className="grid grid-cols-2 gap-4">
              <div className="text-center">
                <div className="text-2xl font-bold text-red-400">{activeBattle.creator_score}</div>
                <div className="text-white/70">Tu Puntaje</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-orange-400">{activeBattle.opponent_score}</div>
                <div className="text-white/70">Oponente</div>
              </div>
            </div>
            <div className="mt-4 text-center">
              <Button className="bg-red-600 hover:bg-red-500">
                Continuar Batalla
              </Button>
            </div>
          </motion.div>
        )}

        {/* Batallas Disponibles */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-4">
            <h3 className="text-white font-bold text-xl">ðŸŽ¯ Crear Nueva Batalla</h3>
            <motion.div
              whileHover={{ scale: 1.02 }}
              className="bg-white/10 rounded-lg p-6 backdrop-blur-sm"
            >
              <h4 className="text-white font-bold mb-3">Arena PAES</h4>
              <p className="text-white/70 mb-4">Duelo 1v1 en conocimientos PAES</p>
              <Button 
                onClick={handleCreateBattle}
                className="w-full bg-red-600 hover:bg-red-500"
              >
                Crear Batalla
              </Button>
            </motion.div>
          </div>

          <div className="space-y-4">
            <h3 className="text-white font-bold text-xl">âš¡ Batallas Disponibles</h3>
            <div className="space-y-2 max-h-64 overflow-y-auto">
              {availableBattles.length > 0 ? (
                availableBattles.map((battle) => (
                  <motion.div
                    key={battle.id}
                    whileHover={{ scale: 1.02 }}
                    className="bg-white/10 rounded-lg p-4 backdrop-blur-sm"
                  >
                    <div className="flex justify-between items-center">
                      <div>
                        <div className="text-white font-medium">{battle.battle_type}</div>
                        <div className="text-white/60 text-sm">{battle.difficulty_level}</div>
                      </div>
                      <Button
                        onClick={() => handleJoinBattle(battle.id)}
                        size="sm"
                        className="bg-orange-600 hover:bg-orange-500"
                      >
                        Unirse
                      </Button>
                    </div>
                  </motion.div>
                ))
              ) : (
                <div className="bg-white/10 rounded-lg p-4 backdrop-blur-sm text-center">
                  <div className="text-white/60">No hay batallas disponibles</div>
                  <div className="text-white/40 text-sm">Â¡Crea una nueva batalla!</div>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Historial de Batallas */}
        {userBattles.length > 0 && (
          <div>
            <h3 className="text-white font-bold text-xl mb-4">ðŸ“Š Historial de Batallas</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {userBattles.slice(0, 3).map((battle) => (
                <div key={battle.id} className="bg-white/10 rounded-lg p-4 backdrop-blur-sm">
                  <div className="text-white font-medium mb-2">{battle.battle_type}</div>
                  <div className="text-white/70 text-sm">
                    {battle.status === 'completed' ? 'âœ… Completada' : 'â³ En progreso'}
                  </div>
                  {battle.winner_id && (
                    <div className="text-green-400 text-sm mt-1">
                      {battle.winner_id === battle.creator_id ? 'ðŸ† Victoria' : 'ðŸ’ª Derrota'}
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </motion.div>
  );
};


