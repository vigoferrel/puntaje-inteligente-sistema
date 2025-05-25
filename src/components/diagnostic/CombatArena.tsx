
import React from 'react';
import { motion } from 'framer-motion';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Zap, Target, Trophy } from 'lucide-react';

interface CombatArenaProps {
  tests: any[];
  currentScores: any;
  onStartCombat: (prueba: string) => void;
  onViewProgress: () => void;
}

export const CombatArena: React.FC<CombatArenaProps> = ({
  tests,
  currentScores,
  onStartCombat,
  onViewProgress
}) => {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="relative z-10 p-6"
    >
      <Card className="bg-black/60 backdrop-blur-sm border-red-500/30">
        <CardHeader>
          <CardTitle className="text-red-400 flex items-center">
            <Zap className="w-5 h-5 mr-2" />
            Arena de Combate Académico
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {tests.slice(0, 4).map((test, index) => (
              <Card key={test.id} className="bg-red-900/20 border-red-500/30">
                <CardContent className="p-4">
                  <div className="flex items-center justify-between mb-3">
                    <h3 className="text-white font-semibold">{test.title}</h3>
                    <Target className="w-5 h-5 text-red-400" />
                  </div>
                  
                  <div className="text-sm text-gray-300 mb-4">
                    {test.description}
                  </div>
                  
                  <Button
                    onClick={() => onStartCombat(test.title)}
                    className="w-full bg-red-600 hover:bg-red-700"
                  >
                    <Zap className="w-4 h-4 mr-2" />
                    Iniciar Combate
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>

          <div className="text-center">
            <Button onClick={onViewProgress} variant="outline" className="border-yellow-400 text-yellow-400">
              <Trophy className="w-4 h-4 mr-2" />
              Ver Progreso General
            </Button>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
};
