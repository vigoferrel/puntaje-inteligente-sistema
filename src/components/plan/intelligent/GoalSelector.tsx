
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { 
  Target, 
  Brain, 
  Zap, 
  Trophy, 
  BookOpen, 
  TrendingUp,
  Clock,
  Star
} from 'lucide-react';
import { motion } from 'framer-motion';

interface Goal {
  id: string;
  title: string;
  description: string;
  icon: any;
  color: string;
  bgColor: string;
  borderColor: string;
  textColor: string;
  estimatedWeeks: number;
  difficulty: 'Básico' | 'Intermedio' | 'Avanzado';
  focus: string[];
  recommended?: boolean;
}

interface GoalSelectorProps {
  selectedGoal: string | null;
  onGoalSelect: (goalId: string) => void;
  weakestSkills: any[];
  loading?: boolean;
}

export const GoalSelector: React.FC<GoalSelectorProps> = ({
  selectedGoal,
  onGoalSelect,
  weakestSkills,
  loading = false
}) => {
  
  const goals: Goal[] = [
    {
      id: 'comprehensive',
      title: 'Preparación Integral PAES',
      description: 'Plan completo que abarca todas las pruebas PAES con enfoque balanceado',
      icon: Trophy,
      color: 'from-purple-600 to-pink-600',
      bgColor: 'bg-purple-600/10',
      borderColor: 'border-purple-600/30',
      textColor: 'text-purple-400',
      estimatedWeeks: 16,
      difficulty: 'Avanzado',
      focus: ['Todas las pruebas', 'Integración', 'Simulacros'],
      recommended: weakestSkills.length >= 3
    },
    {
      id: 'reading_focus',
      title: 'Fortalecimiento Competencia Lectora',
      description: 'Especialización en comprensión lectora, análisis textual y evaluación crítica',
      icon: BookOpen,
      color: 'from-blue-600 to-cyan-600',
      bgColor: 'bg-blue-600/10',
      borderColor: 'border-blue-600/30',
      textColor: 'text-blue-400',
      estimatedWeeks: 10,
      difficulty: 'Intermedio',
      focus: ['Localizar información', 'Interpretar', 'Evaluar'],
      recommended: weakestSkills.some(skill => 
        ['TRACK_LOCATE', 'INTERPRET_RELATE', 'EVALUATE_REFLECT'].includes(skill)
      )
    },
    {
      id: 'math_mastery',
      title: 'Dominio Matemático',
      description: 'Fortalecimiento en matemáticas M1 y M2, resolución de problemas y modelamiento',
      icon: Brain,
      color: 'from-green-600 to-emerald-600',
      bgColor: 'bg-green-600/10',
      borderColor: 'border-green-600/30',
      textColor: 'text-green-400',
      estimatedWeeks: 12,
      difficulty: 'Avanzado',
      focus: ['Resolución problemas', 'Modelamiento', 'Representación'],
      recommended: weakestSkills.some(skill => 
        ['SOLVE_PROBLEMS', 'REPRESENT', 'MODEL', 'ARGUE_COMMUNICATE'].includes(skill)
      )
    },
    {
      id: 'sciences_boost',
      title: 'Impulso en Ciencias',
      description: 'Mejora en biología, física y química con énfasis en argumentación científica',
      icon: Zap,
      color: 'from-orange-600 to-red-600',
      bgColor: 'bg-orange-600/10',
      borderColor: 'border-orange-600/30',
      textColor: 'text-orange-400',
      estimatedWeeks: 10,
      difficulty: 'Intermedio',
      focus: ['Teorías científicas', 'Análisis', 'Argumentación'],
      recommended: weakestSkills.some(skill => 
        ['IDENTIFY_THEORIES', 'PROCESS_ANALYZE', 'APPLY_PRINCIPLES', 'SCIENTIFIC_ARGUMENT'].includes(skill)
      )
    },
    {
      id: 'history_social',
      title: 'Historia y Ciencias Sociales',
      description: 'Desarrollo en pensamiento temporal, análisis de fuentes y pensamiento crítico',
      icon: Target,
      color: 'from-yellow-600 to-orange-600',
      bgColor: 'bg-yellow-600/10',
      borderColor: 'border-yellow-600/30',
      textColor: 'text-yellow-400',
      estimatedWeeks: 8,
      difficulty: 'Básico',
      focus: ['Pensamiento temporal', 'Análisis fuentes', 'Crítico'],
      recommended: weakestSkills.some(skill => 
        ['TEMPORAL_THINKING', 'SOURCE_ANALYSIS', 'MULTICAUSAL_ANALYSIS', 'CRITICAL_THINKING'].includes(skill)
      )
    },
    {
      id: 'weakness_targeted',
      title: 'Plan Dirigido a Debilidades',
      description: 'Enfoque específico en las áreas más débiles según tu diagnóstico',
      icon: TrendingUp,
      color: 'from-red-600 to-pink-600',
      bgColor: 'bg-red-600/10',
      borderColor: 'border-red-600/30',
      textColor: 'text-red-400',
      estimatedWeeks: 8,
      difficulty: 'Intermedio',
      focus: ['Áreas críticas', 'Reforzamiento', 'Práctica intensiva'],
      recommended: weakestSkills.length >= 1 && weakestSkills.length <= 2
    }
  ];

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case 'Básico':
        return 'bg-green-600/20 text-green-400';
      case 'Intermedio':
        return 'bg-yellow-600/20 text-yellow-400';
      case 'Avanzado':
        return 'bg-red-600/20 text-red-400';
      default:
        return 'bg-gray-600/20 text-gray-400';
    }
  };

  if (loading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {Array.from({ length: 6 }).map((_, i) => (
          <Card key={i} className="bg-gray-800 border-gray-700">
            <CardContent className="p-4">
              <div className="animate-pulse space-y-3">
                <div className="h-5 bg-gray-200 rounded w-3/4"></div>
                <div className="h-4 bg-gray-200 rounded w-full"></div>
                <div className="h-3 bg-gray-200 rounded w-2/3"></div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="text-center mb-6">
        <h3 className="text-xl font-semibold text-white mb-2">
          Define tu Meta de Estudio
        </h3>
        <p className="text-gray-400 text-sm">
          Selecciona el objetivo que mejor se adapte a tus necesidades y tiempo disponible
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {goals.map((goal, index) => {
          const GoalIcon = goal.icon;
          const isSelected = selectedGoal === goal.id;
          
          return (
            <motion.div
              key={goal.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
            >
              <Card 
                className={`
                  cursor-pointer transition-all duration-200 border-2 relative
                  ${isSelected 
                    ? `${goal.borderColor} ${goal.bgColor} shadow-lg scale-105` 
                    : 'border-gray-600 bg-gray-800 hover:border-gray-500 hover:bg-gray-700/50'
                  }
                `}
                onClick={() => onGoalSelect(goal.id)}
              >
                {/* Badge de recomendado */}
                {goal.recommended && (
                  <div className="absolute -top-2 -right-2">
                    <Badge className="bg-yellow-600/20 text-yellow-400 border-yellow-600/50">
                      <Star className="h-3 w-3 mr-1" />
                      Recomendado
                    </Badge>
                  </div>
                )}

                <CardHeader className="pb-3">
                  <div className="flex items-start gap-3">
                    <div className={`
                      p-2 rounded-lg bg-gradient-to-r ${goal.color}
                    `}>
                      <GoalIcon className="h-5 w-5 text-white" />
                    </div>
                    <div className="flex-1">
                      <CardTitle className={`text-base font-medium ${
                        isSelected ? 'text-white' : 'text-gray-300'
                      }`}>
                        {goal.title}
                      </CardTitle>
                    </div>
                  </div>
                </CardHeader>
                
                <CardContent className="pt-0 space-y-3">
                  <p className="text-sm text-gray-400 leading-relaxed">
                    {goal.description}
                  </p>
                  
                  {/* Métricas del plan */}
                  <div className="flex items-center gap-4 text-xs">
                    <div className="flex items-center gap-1">
                      <Clock className="h-3 w-3 text-gray-500" />
                      <span className="text-gray-400">{goal.estimatedWeeks} semanas</span>
                    </div>
                    <Badge className={`text-xs ${getDifficultyColor(goal.difficulty)}`}>
                      {goal.difficulty}
                    </Badge>
                  </div>
                  
                  {/* Áreas de enfoque */}
                  <div className="space-y-2">
                    <span className="text-xs text-gray-500 font-medium">Enfoque:</span>
                    <div className="flex flex-wrap gap-1">
                      {goal.focus.map((area, idx) => (
                        <Badge 
                          key={idx}
                          variant="outline" 
                          className="text-xs border-gray-600 text-gray-400"
                        >
                          {area}
                        </Badge>
                      ))}
                    </div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          );
        })}
      </div>
      
      {/* Información adicional para la meta seleccionada */}
      {selectedGoal && (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="mt-6 p-4 bg-blue-600/10 border border-blue-600/30 rounded-lg"
        >
          <div className="flex items-center gap-2 mb-2">
            <Target className="h-5 w-5 text-blue-400" />
            <span className="text-sm font-medium text-blue-400">
              Meta Seleccionada
            </span>
          </div>
          {(() => {
            const selected = goals.find(g => g.id === selectedGoal);
            return selected && (
              <p className="text-sm text-gray-300">
                {selected.title} - {selected.estimatedWeeks} semanas de duración. 
                Este plan se adaptará automáticamente a tus fortalezas y debilidades identificadas.
              </p>
            );
          })()}
        </motion.div>
      )}
    </div>
  );
};
