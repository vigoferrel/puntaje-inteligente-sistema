
import React from 'react';
import { motion } from 'framer-motion';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Trophy, Star, Target } from 'lucide-react';
import { useGlobalCinematic } from '@/contexts/GlobalCinematicContext';

export const AchievementTracker: React.FC = () => {
  const { state } = useGlobalCinematic();

  const achievementDefinitions = {
    weekly_streak: {
      name: 'Racha Semanal',
      description: 'Estudió 7 días consecutivos',
      icon: Trophy,
      color: 'from-yellow-500 to-orange-500'
    },
    hundred_exercises: {
      name: 'Centenario',
      description: 'Completó 100 ejercicios',
      icon: Star,
      color: 'from-purple-500 to-pink-500'
    },
    high_performer: {
      name: 'Alto Rendimiento',
      description: 'Promedio superior al 85%',
      icon: Target,
      color: 'from-green-500 to-emerald-500'
    }
  };

  return (
    <Card className="bg-black/40 backdrop-blur-xl border-white/10">
      <CardContent className="p-6">
        <h3 className="text-lg font-bold text-white mb-4 flex items-center">
          <Trophy className="w-5 h-5 mr-2 text-yellow-400" />
          Logros Desbloqueados
        </h3>
        
        <div className="space-y-3">
          {state.achievements.length > 0 ? (
            state.achievements.map((achievementId, index) => {
              const achievement = achievementDefinitions[achievementId as keyof typeof achievementDefinitions];
              if (!achievement) return null;
              
              const Icon = achievement.icon;
              
              return (
                <motion.div
                  key={achievementId}
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: index * 0.1 }}
                  className="flex items-center gap-3 p-3 bg-white/5 rounded-lg"
                >
                  <div className={`w-10 h-10 bg-gradient-to-r ${achievement.color} rounded-full flex items-center justify-center`}>
                    <Icon className="w-5 h-5 text-white" />
                  </div>
                  <div className="flex-1">
                    <div className="text-white font-medium">{achievement.name}</div>
                    <div className="text-gray-400 text-sm">{achievement.description}</div>
                  </div>
                  <Badge className="bg-yellow-600">
                    Nuevo
                  </Badge>
                </motion.div>
              );
            })
          ) : (
            <div className="text-center text-gray-400 py-4">
              <Trophy className="w-8 h-8 mx-auto mb-2 opacity-50" />
              <p className="text-sm">Completa actividades para desbloquear logros</p>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
};
