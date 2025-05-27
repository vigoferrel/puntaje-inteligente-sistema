
import React from 'react';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';

export const BattleModeDimension: React.FC = () => {
  const handleEnterBattle = (arenaId: string) => {
    console.log('🔥 Entrando a batalla:', arenaId);
  };

  const handleSpectate = (arenaId: string) => {
    console.log('👁️ Observando batalla:', arenaId);
  };

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      className="p-6 min-h-screen bg-gradient-to-br from-red-900 via-orange-900 to-yellow-900"
    >
      <div className="text-center space-y-6">
        <motion.div
          animate={{ 
            scale: [1, 1.1, 1],
            rotate: [0, 5, -5, 0]
          }}
          transition={{ duration: 2, repeat: Infinity }}
          className="mx-auto w-32 h-32 bg-gradient-to-r from-red-500 to-orange-500 rounded-full flex items-center justify-center text-4xl"
        >
          ⚔️
        </motion.div>
        
        <h2 className="text-4xl font-bold text-white">Modo Batalla</h2>
        <p className="text-white/70 text-lg max-w-2xl mx-auto">
          ¡Compite contra otros estudiantes en batallas épicas de conocimiento! 
          Demuestra tus habilidades en tiempo real.
        </p>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-8">
          <motion.div
            whileHover={{ scale: 1.05 }}
            className="bg-white/10 rounded-lg p-6 backdrop-blur-sm cursor-pointer"
            onClick={() => handleEnterBattle('arena-1')}
          >
            <h3 className="text-white font-bold text-xl mb-3">🏟️ Arena Principal</h3>
            <p className="text-white/70 mb-4">Batalla 1v1 en conocimientos PAES</p>
            <Button className="w-full bg-red-600 hover:bg-red-500">
              Entrar a Batalla
            </Button>
          </motion.div>
          
          <motion.div
            whileHover={{ scale: 1.05 }}
            className="bg-white/10 rounded-lg p-6 backdrop-blur-sm cursor-pointer"
            onClick={() => handleSpectate('arena-2')}
          >
            <h3 className="text-white font-bold text-xl mb-3">👁️ Modo Espectador</h3>
            <p className="text-white/70 mb-4">Observa batallas en curso</p>
            <Button className="w-full bg-orange-600 hover:bg-orange-500">
              Observar Batalla
            </Button>
          </motion.div>
        </div>
      </div>
    </motion.div>
  );
};
