
import React from 'react';
import { motion } from 'framer-motion';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';

interface PAESSubject {
  id: string;
  name: string;
  description: string;
  icon: React.ComponentType<any>;
  progress: number;
  color: string;
  projectedScore: number;
  criticalAreas: number;
  strengths: number;
  route: string;
}

interface PAESSubjectCardProps {
  subject: PAESSubject;
  index: number;
  onSelect: (subject: PAESSubject) => void;
}

export const PAESSubjectCard: React.FC<PAESSubjectCardProps> = ({
  subject,
  index,
  onSelect
}) => {
  const Icon = subject.icon;
  
  const getPriorityBadge = (progress: number) => {
    if (progress >= 70) return { text: 'Baja', color: 'bg-green-600/20 text-green-400' };
    if (progress >= 50) return { text: 'Media', color: 'bg-yellow-600/20 text-yellow-400' };
    return { text: 'Alta', color: 'bg-red-600/20 text-red-400' };
  };

  const priority = getPriorityBadge(subject.progress);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.1 }}
      whileHover={{ scale: 1.02 }}
      className="cursor-pointer"
      onClick={() => onSelect(subject)}
    >
      <Card className="bg-white/5 border-white/10 hover:bg-white/10 transition-all duration-300 h-full">
        <CardHeader className="pb-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className={`p-3 rounded-xl bg-gradient-to-br ${subject.color} text-white`}>
                <Icon className="h-6 w-6" />
              </div>
              <div>
                <CardTitle className="text-white text-lg">{subject.name}</CardTitle>
                <p className="text-white/70 text-sm">{subject.description}</p>
              </div>
            </div>
            <Badge className={priority.color}>
              {priority.text}
            </Badge>
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <div className="flex justify-between text-sm mb-2">
              <span className="text-white">Progreso</span>
              <span className="text-white font-semibold">{subject.progress}%</span>
            </div>
            <Progress value={subject.progress} className="h-2" />
          </div>

          <div className="grid grid-cols-3 gap-3 text-center">
            <div>
              <div className="text-lg font-bold text-cyan-400">{subject.projectedScore}</div>
              <div className="text-xs text-white/60">Puntaje</div>
            </div>
            <div>
              <div className="text-lg font-bold text-green-400">{subject.strengths}</div>
              <div className="text-xs text-white/60">Fortalezas</div>
            </div>
            <div>
              <div className="text-lg font-bold text-red-400">{subject.criticalAreas}</div>
              <div className="text-xs text-white/60">Críticas</div>
            </div>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
};
