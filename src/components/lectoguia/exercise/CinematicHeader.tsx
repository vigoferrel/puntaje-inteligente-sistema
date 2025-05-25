
import React from 'react';
import { Exercise } from '@/types/ai-types';
import { motion } from 'framer-motion';
import { Clock, Zap, BookOpen, Calculator, History, Atom, Badge as LucideBadge } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { PAESBadge } from './PAESBadge';
import { getPruebaDisplayName } from '@/types/system-types';

interface CinematicHeaderProps {
  exercise: Exercise;
  exerciseSource?: 'PAES' | 'AI' | null;
  timeElapsed: number;
  progress: number;
}

export const CinematicHeader: React.FC<CinematicHeaderProps> = ({
  exercise,
  exerciseSource,
  timeElapsed,
  progress
}) => {
  const getSubjectIcon = (prueba?: string) => {
    switch (prueba) {
      case 'COMPETENCIA_LECTORA': return BookOpen;
      case 'MATEMATICA_1': return Calculator;
      case 'MATEMATICA_2': return Calculator;
      case 'CIENCIAS': return Atom;
      case 'HISTORIA': return History;
      default: return Zap;
    }
  };

  const getSubjectColor = (prueba?: string) => {
    switch (prueba) {
      case 'COMPETENCIA_LECTORA': return 'from-blue-500 to-indigo-600';
      case 'MATEMATICA_1': return 'from-green-500 to-emerald-600';
      case 'MATEMATICA_2': return 'from-purple-500 to-violet-600';
      case 'CIENCIAS': return 'from-orange-500 to-red-600';
      case 'HISTORIA': return 'from-amber-500 to-orange-600';
      default: return 'from-primary to-primary/80';
    }
  };

  const SubjectIcon = getSubjectIcon(exercise.prueba);
  const subjectColor = getSubjectColor(exercise.prueba);

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  return (
    <div className="relative">
      {/* Timeline de progreso */}
      <div className="absolute top-0 left-0 right-0 h-1 bg-white/10 rounded-full overflow-hidden">
        <motion.div
          className="h-full bg-gradient-to-r from-primary to-primary/80"
          initial={{ width: 0 }}
          animate={{ width: `${progress}%` }}
          transition={{ duration: 0.5, ease: "easeOut" }}
        />
      </div>

      <div className="pt-6">
        {/* Header principal */}
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-4">
            {/* Icono de materia con efecto glow */}
            <div className={`relative p-4 rounded-2xl bg-gradient-to-br ${subjectColor} shadow-2xl`}>
              <SubjectIcon className="h-8 w-8 text-white" />
              <div className={`absolute inset-0 rounded-2xl bg-gradient-to-br ${subjectColor} opacity-50 blur-xl`} />
            </div>

            <div className="space-y-2">
              <h1 className="text-2xl font-bold text-foreground">
                {exercise.prueba ? getPruebaDisplayName(exercise.prueba as any) : 'Ejercicio Educativo'}
              </h1>
              
              <div className="flex items-center gap-3">
                <Badge variant="outline" className="text-xs font-medium">
                  {exercise.nodeId ? 'Nodo Específico' : 'Ejercicio General'}
                </Badge>
                
                <PAESBadge 
                  source={exerciseSource} 
                  className="text-xs"
                />
                
                {exercise.difficulty && (
                  <Badge 
                    variant="secondary" 
                    className={`text-xs font-medium ${
                      exercise.difficulty === 'ADVANCED' ? 'bg-red-500/20 text-red-400' :
                      exercise.difficulty === 'INTERMEDIATE' ? 'bg-yellow-500/20 text-yellow-400' :
                      'bg-green-500/20 text-green-400'
                    }`}
                  >
                    {exercise.difficulty}
                  </Badge>
                )}
              </div>
            </div>
          </div>

          {/* Indicadores de tiempo y rendimiento */}
          <div className="flex items-center gap-6">
            {/* Timer con efecto pulso */}
            <motion.div
              animate={{ scale: [1, 1.05, 1] }}
              transition={{ duration: 2, repeat: Infinity }}
              className="flex items-center gap-2 glass-morphism rounded-full px-4 py-2"
            >
              <Clock className="h-4 w-4 text-primary" />
              <span className="font-mono text-sm font-medium">
                {formatTime(timeElapsed)}
              </span>
            </motion.div>

            {/* Indicador de energía */}
            <div className="flex items-center gap-2 glass-morphism rounded-full px-4 py-2">
              <Zap className="h-4 w-4 text-amber-400" />
              <div className="flex gap-1">
                {[...Array(3)].map((_, i) => (
                  <motion.div
                    key={i}
                    className={`w-2 h-4 rounded-full ${
                      i < Math.floor(progress / 33) + 1 ? 'bg-amber-400' : 'bg-white/20'
                    }`}
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ delay: i * 0.1 }}
                  />
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Indicador de nodo si aplica */}
        {exercise.nodeId && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="glass-morphism rounded-xl p-4 mb-4"
          >
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-lg bg-primary/20">
                <LucideBadge className="h-4 w-4 text-primary" />
              </div>
              <div>
                <p className="text-sm font-medium text-foreground">
                  Nodo de Aprendizaje
                </p>
                <p className="text-xs text-muted-foreground">
                  {exercise.nodeName || exercise.nodeId}
                </p>
              </div>
            </div>
          </motion.div>
        )}
      </div>
    </div>
  );
};
