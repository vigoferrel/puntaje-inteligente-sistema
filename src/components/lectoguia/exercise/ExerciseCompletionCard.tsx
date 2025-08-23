
import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Check, ArrowRight, Star, Award, BookOpen } from 'lucide-react';
import { motion } from 'framer-motion';

interface ExerciseCompletionCardProps {
  score: number;
  skillName: string;
  skillImprovement: number;
  onContinue: () => void;
  onViewSummary?: () => void;
}

export const ExerciseCompletionCard: React.FC<ExerciseCompletionCardProps> = ({
  score = 100,
  skillName = 'Interpretación',
  skillImprovement = 5,
  onContinue,
  onViewSummary
}) => {
  // Animaciones
  const containerVariants = {
    hidden: { opacity: 0, scale: 0.8 },
    visible: {
      opacity: 1,
      scale: 1,
      transition: {
        duration: 0.5,
        delayChildren: 0.3,
        staggerChildren: 0.1
      }
    }
  };
  
  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1
    }
  };
  
  // Determinar mensaje según puntaje
  const getMessage = () => {
    if (score >= 90) return '¡Excelente trabajo!';
    if (score >= 70) return '¡Muy bien hecho!';
    if (score >= 50) return 'Buen intento';
    return 'Sigue practicando';
  };

  return (
    <motion.div
      variants={containerVariants}
      initial="hidden"
      animate="visible"
      className="my-8"
    >
      <Card className="border-border bg-gradient-to-b from-primary/5 to-background overflow-hidden">
        <CardContent className="p-6 text-center">
          <motion.div variants={itemVariants} className="mb-4">
            <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-4">
              <Award className="h-8 w-8 text-primary" />
            </div>
          </motion.div>
          
          <motion.h3 variants={itemVariants} className="text-2xl font-bold mb-2">
            {getMessage()}
          </motion.h3>
          
          <motion.div variants={itemVariants} className="text-xl mb-6">
            Puntaje: <span className="font-bold text-primary">{score}%</span>
          </motion.div>
          
          <motion.div variants={itemVariants} className="flex items-center justify-center mb-6 space-x-1">
            <Star className="h-4 w-4 text-amber-500 fill-amber-500" />
            <Star className="h-4 w-4 text-amber-500 fill-amber-500" />
            <Star className="h-4 w-4 text-amber-500 fill-amber-500" />
            {score >= 70 && <Star className="h-4 w-4 text-amber-500 fill-amber-500" />}
            {score >= 90 && <Star className="h-4 w-4 text-amber-500 fill-amber-500" />}
          </motion.div>
          
          <motion.div variants={itemVariants} className="bg-card/50 rounded-lg p-4 mb-6 inline-block">
            <p className="text-sm text-muted-foreground mb-1">Habilidad mejorada</p>
            <div className="flex items-center gap-1">
              <BookOpen className="h-4 w-4 text-primary" />
              <span className="font-medium">{skillName}</span>
              <span className="text-xs bg-primary/10 text-primary px-1.5 rounded">
                +{skillImprovement}%
              </span>
            </div>
          </motion.div>
          
          <motion.div variants={itemVariants} className="flex justify-center gap-3">
            {onViewSummary && (
              <Button variant="outline" onClick={onViewSummary}>
                <Check className="mr-2 h-4 w-4" />
                Ver resumen
              </Button>
            )}
            <Button onClick={onContinue}>
              Continuar
              <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
          </motion.div>
        </CardContent>
      </Card>
    </motion.div>
  );
};
