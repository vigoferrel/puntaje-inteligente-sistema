
import React from 'react';
import { motion } from 'framer-motion';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { Brain, Zap } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

interface PAESSubjectNeural {
  id: string;
  name: string;
  description: string;
  icon: React.ComponentType<any>;
  progress: number;
  color: string;
  projectedScore: number;
  neuralMetrics: {
    engagement: number;
    coherence: number;
    efficiency: number;
    adaptability: number;
  };
  route: string;
}

interface NeuralPAESCardProps {
  subject: PAESSubjectNeural;
  index: number;
  onSelect: (subject: PAESSubjectNeural) => void;
  neuralState: any;
}

export const NeuralPAESCard: React.FC<NeuralPAESCardProps> = ({
  subject,
  index,
  onSelect,
  neuralState
}) => {
  const Icon = subject.icon;
  const navigate = useNavigate();
  
  const getNeuralAverage = () => {
    const { engagement, coherence, efficiency, adaptability } = subject.neuralMetrics;
    return Math.round((engagement + coherence + efficiency + adaptability) / 4);
  };

  const getPriorityLevel = () => {
    const neuralAvg = getNeuralAverage();
    if (neuralAvg >= 80) return { text: 'Óptimo', color: 'bg-green-600/20 text-green-400' };
    if (neuralAvg >= 65) return { text: 'Bueno', color: 'bg-yellow-600/20 text-yellow-400' };
    return { text: 'Crítico', color: 'bg-red-600/20 text-red-400' };
  };

  const handleCardClick = () => {
    // Capturar evento neural
    onSelect(subject);
    
    // Navegar a la ruta correspondiente
    navigate(subject.route);
  };

  const priority = getPriorityLevel();

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.1 }}
      whileHover={{ scale: 1.02 }}
      className="cursor-pointer"
      onClick={handleCardClick}
    >
      <Card className="bg-white/5 border-white/10 hover:bg-white/10 transition-all duration-300 h-full relative overflow-hidden">
        {/* Neural Pulse Effect */}
        <motion.div
          className="absolute inset-0 bg-gradient-to-r from-cyan-500/10 to-purple-500/10"
          animate={{
            opacity: [0.1, 0.3, 0.1]
          }}
          transition={{
            duration: 2,
            repeat: Infinity,
            ease: "easeInOut"
          }}
        />

        <CardHeader className="pb-3 relative z-10">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className={`p-3 rounded-xl bg-gradient-to-br ${subject.color} text-white relative`}>
                <Icon className="h-6 w-6" />
                <motion.div
                  className="absolute -top-1 -right-1 w-3 h-3 bg-cyan-400 rounded-full"
                  animate={{ scale: [1, 1.2, 1], opacity: [0.7, 1, 0.7] }}
                  transition={{ duration: 1.5, repeat: Infinity }}
                />
              </div>
              <div>
                <CardTitle className="text-white text-lg">{subject.name}</CardTitle>
                <p className="text-white/70 text-sm">{subject.description}</p>
              </div>
            </div>
            <div className="flex flex-col gap-1">
              <Badge className={priority.color}>
                {priority.text}
              </Badge>
              <div className="flex items-center gap-1">
                <Brain className="w-3 h-3 text-cyan-400" />
                <span className="text-cyan-400 text-xs font-bold">{getNeuralAverage()}%</span>
              </div>
            </div>
          </div>
        </CardHeader>

        <CardContent className="space-y-4 relative z-10">
          {/* Progress Section */}
          <div>
            <div className="flex justify-between text-sm mb-2">
              <span className="text-white">Progreso</span>
              <span className="text-white font-semibold">{subject.progress}%</span>
            </div>
            <Progress value={subject.progress} className="h-2" />
          </div>

          {/* Neural Metrics Grid */}
          <div className="grid grid-cols-2 gap-2 text-center">
            <div className="bg-white/5 rounded-lg p-2">
              <div className="text-sm font-bold text-cyan-400">{subject.neuralMetrics.engagement}%</div>
              <div className="text-xs text-white/60">Engagement</div>
            </div>
            <div className="bg-white/5 rounded-lg p-2">
              <div className="text-sm font-bold text-green-400">{subject.neuralMetrics.efficiency}%</div>
              <div className="text-xs text-white/60">Eficiencia</div>
            </div>
            <div className="bg-white/5 rounded-lg p-2">
              <div className="text-sm font-bold text-purple-400">{subject.neuralMetrics.coherence}%</div>
              <div className="text-xs text-white/60">Coherencia</div>
            </div>
            <div className="bg-white/5 rounded-lg p-2">
              <div className="text-sm font-bold text-yellow-400">{subject.neuralMetrics.adaptability}%</div>
              <div className="text-xs text-white/60">Adaptación</div>
            </div>
          </div>

          {/* Projected Score */}
          <div className="text-center pt-2 border-t border-white/10">
            <div className="flex items-center justify-center gap-2">
              <Zap className="w-4 h-4 text-yellow-400" />
              <span className="text-lg font-bold text-yellow-400">{subject.projectedScore}</span>
              <span className="text-white/60 text-sm">pts proyectados</span>
            </div>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
};
