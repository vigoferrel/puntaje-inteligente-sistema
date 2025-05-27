
import React from 'react';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';

export const AchievementSystemDimension: React.FC = () => {
  const handleClaimReward = (achievementId: string) => {
    console.log('🏆 Reclamando recompensa:', achievementId);
  };

  const achievements = [
    { id: 'first-100', title: 'Primer Centenar', description: '100 ejercicios completados', claimed: true },
    { id: 'streak-7', title: 'Semana Perfecta', description: '7 días consecutivos', claimed: false },
    { id: 'master-math', title: 'Maestro Matemático', description: '90% en matemáticas', claimed: false }
  ];

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="p-6 min-h-screen bg-gradient-to-br from-yellow-900 via-amber-900 to-orange-900"
    >
      <div className="text-center space-y-6">
        <motion.div
          animate={{ 
            rotateY: [0, 360],
            scale: [1, 1.1, 1]
          }}
          transition={{ duration: 4, repeat: Infinity }}
          className="mx-auto w-32 h-32 bg-gradient-to-r from-yellow-500 to-amber-500 rounded-full flex items-center justify-center text-4xl"
        >
          🏆
        </motion.div>
        
        <h2 className="text-4xl font-bold text-white">Sistema de Logros</h2>
        <p className="text-white/70 text-lg max-w-2xl mx-auto">
          Desbloquea logros, gana recompensas y celebra tus éxitos académicos. 
          Cada meta alcanzada te acerca más a la excelencia.
        </p>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-8">
          {achievements.map((achievement, index) => (
            <motion.div
              key={achievement.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.2 }}
              className={`rounded-lg p-4 backdrop-blur-sm ${
                achievement.claimed ? 'bg-green-500/20' : 'bg-white/10'
              }`}
            >
              <h3 className="text-white font-bold mb-2">{achievement.title}</h3>
              <p className="text-white/70 text-sm mb-3">{achievement.description}</p>
              <Button
                onClick={() => handleClaimReward(achievement.id)}
                disabled={achievement.claimed}
                className={achievement.claimed ? 'bg-green-600' : 'bg-yellow-600 hover:bg-yellow-500'}
              >
                {achievement.claimed ? 'Reclamado ✓' : 'Reclamar'}
              </Button>
            </motion.div>
          ))}
        </div>
      </div>
    </motion.div>
  );
};
