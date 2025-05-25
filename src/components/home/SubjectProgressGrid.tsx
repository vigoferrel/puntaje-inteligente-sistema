
import React from 'react';
import { motion } from 'framer-motion';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { 
  BookOpen, 
  Calculator, 
  FlaskConical, 
  Scroll, 
  ChevronRight,
  TrendingUp,
  AlertTriangle
} from 'lucide-react';
import { Link } from 'react-router-dom';

interface SubjectProgress {
  code: string;
  name: string;
  totalNodes: number;
  completedNodes: number;
  progress: number;
  projectedScore: number;
  criticalAreas: number;
  strengths: number;
  priority: 'high' | 'medium' | 'low';
}

interface SubjectProgressGridProps {
  subjects: SubjectProgress[];
}

export const SubjectProgressGrid: React.FC<SubjectProgressGridProps> = ({ subjects }) => {
  const getSubjectIcon = (code: string) => {
    switch (code) {
      case 'COMPETENCIA_LECTORA': return BookOpen;
      case 'MATEMATICA_1':
      case 'MATEMATICA_2': return Calculator;
      case 'CIENCIAS': return FlaskConical;
      case 'HISTORIA': return Scroll;
      default: return BookOpen;
    }
  };

  const getSubjectColor = (code: string) => {
    switch (code) {
      case 'COMPETENCIA_LECTORA': return 'from-blue-500 to-blue-600';
      case 'MATEMATICA_1': return 'from-purple-500 to-purple-600';
      case 'MATEMATICA_2': return 'from-indigo-500 to-indigo-600';
      case 'CIENCIAS': return 'from-green-500 to-green-600';
      case 'HISTORIA': return 'from-amber-500 to-amber-600';
      default: return 'from-gray-500 to-gray-600';
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high': return 'bg-red-100 text-red-800 border-red-200';
      case 'medium': return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'low': return 'bg-green-100 text-green-800 border-green-200';
      default: return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const container = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  };

  const item = {
    hidden: { opacity: 0, y: 20 },
    show: { opacity: 1, y: 0 }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold">Progreso por Materia</h2>
        <Badge variant="outline" className="text-sm">
          Sistema de 277 nodos
        </Badge>
      </div>

      <motion.div
        variants={container}
        initial="hidden"
        animate="show"
        className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
      >
        {subjects.map((subject) => {
          const Icon = getSubjectIcon(subject.code);
          
          return (
            <motion.div key={subject.code} variants={item}>
              <Card className="group hover:shadow-lg transition-all duration-300 border-2 hover:border-primary/20">
                <CardHeader className="pb-3">
                  <div className="flex items-start justify-between">
                    <div className="flex items-center gap-3">
                      <div className={`p-3 rounded-xl bg-gradient-to-br ${getSubjectColor(subject.code)} text-white`}>
                        <Icon className="h-6 w-6" />
                      </div>
                      <div>
                        <CardTitle className="text-lg">{subject.name}</CardTitle>
                        <p className="text-sm text-muted-foreground">
                          {subject.totalNodes} nodos disponibles
                        </p>
                      </div>
                    </div>
                    <Badge className={getPriorityColor(subject.priority)}>
                      {subject.priority === 'high' ? 'Alta' : 
                       subject.priority === 'medium' ? 'Media' : 'Baja'} prioridad
                    </Badge>
                  </div>
                </CardHeader>

                <CardContent className="space-y-4">
                  {/* Progress */}
                  <div>
                    <div className="flex justify-between text-sm mb-2">
                      <span>Progreso</span>
                      <span className="font-semibold">{Math.round(subject.progress)}%</span>
                    </div>
                    <Progress value={subject.progress} className="h-2" />
                    <p className="text-xs text-muted-foreground mt-1">
                      {subject.completedNodes} de {subject.totalNodes} nodos completados
                    </p>
                  </div>

                  {/* Stats */}
                  <div className="grid grid-cols-3 gap-3 text-center">
                    <div>
                      <div className="text-lg font-bold text-primary">{subject.projectedScore}</div>
                      <div className="text-xs text-muted-foreground">Puntaje</div>
                    </div>
                    <div>
                      <div className="flex items-center justify-center gap-1">
                        <TrendingUp className="h-3 w-3 text-green-500" />
                        <span className="text-lg font-bold text-green-600">{subject.strengths}</span>
                      </div>
                      <div className="text-xs text-muted-foreground">Fortalezas</div>
                    </div>
                    <div>
                      <div className="flex items-center justify-center gap-1">
                        <AlertTriangle className="h-3 w-3 text-red-500" />
                        <span className="text-lg font-bold text-red-600">{subject.criticalAreas}</span>
                      </div>
                      <div className="text-xs text-muted-foreground">Críticas</div>
                    </div>
                  </div>

                  {/* Action Button */}
                  <Button 
                    asChild
                    className="w-full group-hover:bg-primary/90 transition-colors"
                    variant={subject.priority === 'high' ? 'default' : 'outline'}
                  >
                    <Link to={`/materia/${subject.code.toLowerCase()}`} className="flex items-center gap-2">
                      Continuar estudio
                      <ChevronRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
                    </Link>
                  </Button>
                </CardContent>
              </Card>
            </motion.div>
          );
        })}
      </motion.div>
    </div>
  );
};
