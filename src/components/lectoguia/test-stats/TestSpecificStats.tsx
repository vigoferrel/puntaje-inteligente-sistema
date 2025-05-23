
import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { TPAESPrueba, TPAESHabilidad, getPruebaDisplayName } from '@/types/system-types';
import { TLearningNode } from '@/types/system-types';
import { NodeProgress } from '@/types/node-progress';
import { Target, Trophy, Clock, Zap, BookOpen, Calculator, BarChart3, Atom, History } from 'lucide-react';
import { motion } from 'framer-motion';
import { cn } from '@/utils/lectoguia-utils';

interface TestSpecificStatsProps {
  selectedPrueba: TPAESPrueba;
  nodes: TLearningNode[];
  nodeProgress: Record<string, NodeProgress>;
  skillLevels: Record<TPAESHabilidad, number>;
  className?: string;
}

const TEST_ICONS = {
  'COMPETENCIA_LECTORA': BookOpen,
  'MATEMATICA_1': Calculator,
  'MATEMATICA_2': BarChart3,
  'CIENCIAS': Atom,
  'HISTORIA': History
};

const TEST_COLORS = {
  'COMPETENCIA_LECTORA': 'blue',
  'MATEMATICA_1': 'green',
  'MATEMATICA_2': 'purple',
  'CIENCIAS': 'orange',
  'HISTORIA': 'red'
};

export const TestSpecificStats: React.FC<TestSpecificStatsProps> = ({
  selectedPrueba,
  nodes,
  nodeProgress,
  skillLevels,
  className
}) => {
  // Filtrar nodos por tipo de prueba
  const testIdMap = {
    'COMPETENCIA_LECTORA': 1,
    'MATEMATICA_1': 2,
    'MATEMATICA_2': 3,
    'CIENCIAS': 4,
    'HISTORIA': 5
  };
  
  const testNodes = nodes.filter(node => node.testId === testIdMap[selectedPrueba]);
  
  // Calcular estadísticas
  const completedNodes = Object.entries(nodeProgress)
    .filter(([nodeId, progress]) => 
      testNodes.some(node => node.id === nodeId) && progress.status === 'completed'
    ).length;
  
  const inProgressNodes = Object.entries(nodeProgress)
    .filter(([nodeId, progress]) => 
      testNodes.some(node => node.id === nodeId) && progress.status === 'in_progress'
    ).length;
  
  const totalNodes = testNodes.length;
  const progressPercentage = totalNodes > 0 ? (completedNodes / totalNodes) * 100 : 0;
  
  // Obtener habilidades relevantes para esta prueba
  const relevantSkills = {
    'COMPETENCIA_LECTORA': ['TRACK_LOCATE', 'INTERPRET_RELATE', 'EVALUATE_REFLECT'],
    'MATEMATICA_1': ['SOLVE_PROBLEMS', 'REPRESENT'],
    'MATEMATICA_2': ['MODEL', 'SOLVE_PROBLEMS'],
    'CIENCIAS': ['INTERPRET_RELATE', 'EVALUATE_REFLECT', 'MODEL'],
    'HISTORIA': ['TRACK_LOCATE', 'INTERPRET_RELATE', 'EVALUATE_REFLECT']
  }[selectedPrueba] as TPAESHabilidad[];
  
  const testSkillLevels = relevantSkills.map(skill => skillLevels[skill] || 0);
  const avgSkillLevel = testSkillLevels.length > 0 
    ? testSkillLevels.reduce((sum, level) => sum + level, 0) / testSkillLevels.length 
    : 0;
  
  // Tiempo estimado restante
  const remainingNodes = testNodes.filter(node => 
    !nodeProgress[node.id] || nodeProgress[node.id].status !== 'completed'
  );
  const estimatedTimeRemaining = remainingNodes.reduce((total, node) => 
    total + (node.estimatedTimeMinutes || 30), 0
  );
  
  const Icon = TEST_ICONS[selectedPrueba];
  const colorClass = TEST_COLORS[selectedPrueba];
  
  const containerVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.5,
        staggerChildren: 0.1
      }
    }
  };
  
  const itemVariants = {
    hidden: { opacity: 0, scale: 0.9 },
    visible: { 
      opacity: 1, 
      scale: 1,
      transition: { duration: 0.3 }
    }
  };

  return (
    <motion.div 
      className={cn("space-y-4", className)}
      variants={containerVariants}
      initial="hidden"
      animate="visible"
    >
      {/* Header con información de la prueba */}
      <motion.div variants={itemVariants}>
        <Card className={`border-${colorClass}-200 bg-gradient-to-r from-${colorClass}-50 to-${colorClass}-100/50`}>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className={`p-2 rounded-full bg-${colorClass}-500/10`}>
                  <Icon className={`h-6 w-6 text-${colorClass}-600`} />
                </div>
                <div>
                  <h3 className={`font-semibold text-${colorClass}-800`}>
                    {getPruebaDisplayName(selectedPrueba)}
                  </h3>
                  <p className={`text-sm text-${colorClass}-600`}>
                    {relevantSkills.length} habilidades principales
                  </p>
                </div>
              </div>
              <Badge variant="secondary" className={`bg-${colorClass}-500/10 text-${colorClass}-700`}>
                {Math.round(progressPercentage)}% completado
              </Badge>
            </div>
          </CardContent>
        </Card>
      </motion.div>
      
      {/* Estadísticas en grid */}
      <motion.div 
        className="grid grid-cols-2 md:grid-cols-4 gap-3"
        variants={containerVariants}
      >
        <motion.div variants={itemVariants}>
          <Card className="p-3 bg-gradient-to-br from-green-50 to-green-100 border-green-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs font-medium text-green-700">Completados</p>
                <p className="text-xl font-bold text-green-800">{completedNodes}</p>
              </div>
              <Trophy className="h-5 w-5 text-green-600" />
            </div>
          </Card>
        </motion.div>
        
        <motion.div variants={itemVariants}>
          <Card className="p-3 bg-gradient-to-br from-yellow-50 to-yellow-100 border-yellow-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs font-medium text-yellow-700">En progreso</p>
                <p className="text-xl font-bold text-yellow-800">{inProgressNodes}</p>
              </div>
              <Zap className="h-5 w-5 text-yellow-600" />
            </div>
          </Card>
        </motion.div>
        
        <motion.div variants={itemVariants}>
          <Card className="p-3 bg-gradient-to-br from-blue-50 to-blue-100 border-blue-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs font-medium text-blue-700">Nivel promedio</p>
                <p className="text-xl font-bold text-blue-800">{Math.round(avgSkillLevel * 100)}%</p>
              </div>
              <Target className="h-5 w-5 text-blue-600" />
            </div>
          </Card>
        </motion.div>
        
        <motion.div variants={itemVariants}>
          <Card className="p-3 bg-gradient-to-br from-purple-50 to-purple-100 border-purple-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs font-medium text-purple-700">Tiempo rest.</p>
                <p className="text-xl font-bold text-purple-800">{Math.round(estimatedTimeRemaining / 60)}h</p>
              </div>
              <Clock className="h-5 w-5 text-purple-600" />
            </div>
          </Card>
        </motion.div>
      </motion.div>
      
      {/* Progreso detallado */}
      <motion.div variants={itemVariants}>
        <Card>
          <CardContent className="p-4">
            <div className="space-y-3">
              <div className="flex justify-between items-center">
                <span className="text-sm font-medium">Progreso en {getPruebaDisplayName(selectedPrueba)}</span>
                <span className="text-sm text-muted-foreground">{completedNodes} de {totalNodes} nodos</span>
              </div>
              <Progress value={progressPercentage} className="h-3" />
              <div className="flex justify-between text-xs text-muted-foreground">
                <span>Iniciado</span>
                <span>Intermedio</span>
                <span>Avanzado</span>
              </div>
            </div>
          </CardContent>
        </Card>
      </motion.div>
    </motion.div>
  );
};
