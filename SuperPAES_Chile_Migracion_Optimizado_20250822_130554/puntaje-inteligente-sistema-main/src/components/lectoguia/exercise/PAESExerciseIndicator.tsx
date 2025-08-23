/* eslint-disable react-refresh/only-export-components */
import { FC } from 'react';
import type { SafeString, SafeNumber, SafeBoolean, APIResponse, OperationResult } from '../types/core';

import { Badge } from '../../../components/ui/badge';
import { Card, CardContent } from '../../../components/ui/card';
import { Award, Sparkles, Target, Clock } from 'lucide-react';
import { motion } from 'framer-motion';

interface PAESExerciseIndicatorProps {
  source: 'PAES' | 'AI' | null;
  questionNumber?: number;
  skill?: string;
  difficulty?: string;
  estimatedTime?: number;
}

export const PAESExerciseIndicator: FC<PAESExerciseIndicatorProps> = ({
  source,
  questionNumber,
  skill,
  difficulty,
  estimatedTime
}) => {
  if (!source) return null;

  const isPAES = source === 'PAES';

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.3 }}
    >
      <Card className={`border-2 ${isPAES ? 'border-green-200 bg-gradient-to-r from-green-50 to-emerald-50' : 'border-blue-200 bg-gradient-to-r from-blue-50 to-sky-50'}`}>
        <CardContent className="p-4">
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-2">
              {isPAES ? (
                <>
                  <Award className="h-5 w-5 text-green-600" />
                  <Badge variant="secondary" className="bg-green-100 text-green-800 border-green-300">
                    Pregunta Oficial PAES
                  </Badge>
                </>
              ) : (
                <>
                  <Sparkles className="h-5 w-5 text-blue-600" />
                  <Badge variant="outline" className="bg-blue-50 text-blue-700 border-blue-300">
                    Ejercicio Generado por IA
                  </Badge>
                </>
              )}
            </div>
            
            {questionNumber && isPAES && (
              <Badge variant="outline" className="text-xs">
                #{questionNumber}
              </Badge>
            )}
          </div>

          <div className="grid grid-cols-2 md:grid-cols-3 gap-3 text-sm">
            {skill && (
              <div className="flex items-center gap-1">
                <Target className="h-3 w-3 text-muted-foreground" />
                <span className="text-muted-foreground truncate">{skill}</span>
              </div>
            )}
            
            {difficulty && (
              <div className="flex items-center gap-1">
                <div className={`h-2 w-2 rounded-full ${
                  difficulty === 'BASICO' ? 'bg-green-500' :
                  difficulty === 'INTERMEDIO' ? 'bg-yellow-500' : 'bg-red-500'
                }`} />
                <span className="text-muted-foreground">{difficulty}</span>
              </div>
            )}
            
            {estimatedTime && (
              <div className="flex items-center gap-1">
                <Clock className="h-3 w-3 text-muted-foreground" />
                <span className="text-muted-foreground">{estimatedTime}min</span>
              </div>
            )}
          </div>

          {isPAES && (
            <div className="mt-3 p-2 bg-green-100 rounded-md">
              <p className="text-xs text-green-700 flex items-center gap-1">
                <Award className="h-3 w-3" />
                Esta pregunta forma parte del examen oficial PAES y contribuye al anÃ¡lisis predictivo de tu puntaje.
              </p>
            </div>
          )}
        </CardContent>
      </Card>
    </motion.div>
  );
};

