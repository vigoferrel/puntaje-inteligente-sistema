
import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { BookOpen, Target, TrendingUp, Users, Star } from 'lucide-react';
import { IntersectionalContext, CrossModuleAction } from '@/types/intersectional-types';

interface SubjectIntersectionalProps {
  context: IntersectionalContext & { moduleState: any };
  onNavigateToTool: (tool: string, context?: any) => void;
  onDispatchAction: (action: CrossModuleAction) => void;
}

const SUBJECTS = [
  {
    id: 'COMPETENCIA_LECTORA',
    name: 'Comprensión Lectora',
    description: 'Análisis y comprensión de textos',
    color: 'blue',
    icon: BookOpen
  },
  {
    id: 'MATEMATICA_1',
    name: 'Matemática M1',
    description: 'Álgebra y geometría básica',
    color: 'green',
    icon: Target
  },
  {
    id: 'MATEMATICA_2',
    name: 'Matemática M2',
    description: 'Cálculo y estadística',
    color: 'purple',
    icon: TrendingUp
  },
  {
    id: 'CIENCIAS',
    name: 'Ciencias',
    description: 'Física, química y biología',
    color: 'orange',
    icon: Users
  },
  {
    id: 'HISTORIA',
    name: 'Historia y Geografía',
    description: 'Historia universal y de Chile',
    color: 'red',
    icon: Star
  }
];

export const SubjectIntersectional: React.FC<SubjectIntersectionalProps> = ({
  context,
  onNavigateToTool,
  onDispatchAction
}) => {
  const [selectedSubject, setSelectedSubject] = useState(context.currentSubject);

  const handleSubjectChange = (subjectId: string) => {
    setSelectedSubject(subjectId);
    
    // Actualizar contexto interseccional
    onDispatchAction({
      type: 'UPDATE_CONTEXT',
      source: 'subject',
      target: 'all',
      payload: { currentSubject: subjectId },
      priority: 'high'
    });
  };

  const getSubjectProgress = (subjectId: string) => {
    if (subjectId === context.currentSubject) {
      return context.crossModuleMetrics.averagePerformance;
    }
    // Simular progreso para otras materias
    return Math.max(0, context.crossModuleMetrics.averagePerformance - Math.random() * 20);
  };

  const getSubjectLevel = (progress: number) => {
    if (progress >= 90) return { level: 'Avanzado', color: 'text-green-600' };
    if (progress >= 70) return { level: 'Intermedio', color: 'text-blue-600' };
    if (progress >= 50) return { level: 'Básico', color: 'text-yellow-600' };
    return { level: 'Inicial', color: 'text-gray-600' };
  };

  const currentSubjectData = SUBJECTS.find(s => s.id === selectedSubject);

  return (
    <Card className="h-full">
      <CardHeader>
        <CardTitle className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <BookOpen className="w-5 h-5 text-orange-600" />
            Gestión de Materias
          </div>
          <Badge variant="outline" className="bg-orange-50 text-orange-700">
            {SUBJECTS.length} materias
          </Badge>
        </CardTitle>
      </CardHeader>

      <CardContent className="space-y-6">
        {/* Materia actual destacada */}
        {currentSubjectData && (
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-gradient-to-r from-blue-50 to-purple-50 p-4 rounded-lg border border-blue-200"
          >
            <div className="flex items-center gap-3 mb-3">
              <div className={`p-2 rounded-lg bg-${currentSubjectData.color}-100`}>
                <currentSubjectData.icon className={`w-5 h-5 text-${currentSubjectData.color}-600`} />
              </div>
              <div>
                <h3 className="font-medium text-gray-900">{currentSubjectData.name}</h3>
                <p className="text-sm text-gray-600">{currentSubjectData.description}</p>
              </div>
            </div>
            
            <div className="grid grid-cols-3 gap-4 mb-3">
              <div className="text-center">
                <div className="text-lg font-bold text-blue-600">
                  {Math.round(getSubjectProgress(currentSubjectData.id))}%
                </div>
                <div className="text-xs text-gray-600">Progreso</div>
              </div>
              <div className="text-center">
                <div className="text-lg font-bold text-green-600">
                  {context.crossModuleMetrics.exercisesCompleted}
                </div>
                <div className="text-xs text-gray-600">Ejercicios</div>
              </div>
              <div className="text-center">
                <div className="text-lg font-bold text-purple-600">
                  {Math.round(context.crossModuleMetrics.totalStudyTime / 60)}h
                </div>
                <div className="text-xs text-gray-600">Tiempo</div>
              </div>
            </div>

            <Progress 
              value={getSubjectProgress(currentSubjectData.id)} 
              className="mb-3"
            />

            <div className="flex gap-2">
              <Button 
                size="sm"
                onClick={() => onDispatchAction({
                  type: 'TRIGGER_INTEGRATION',
                  source: 'subject',
                  target: 'exercise',
                  payload: { action: 'generate_exercise', subject: selectedSubject },
                  priority: 'high'
                })}
                className="bg-gradient-to-r from-blue-500 to-blue-600"
              >
                Practicar
              </Button>
              <Button 
                size="sm" 
                variant="outline"
                onClick={() => onNavigateToTool('diagnostic', { subject: selectedSubject })}
              >
                Evaluar
              </Button>
            </div>
          </motion.div>
        )}

        {/* Lista de todas las materias */}
        <div className="space-y-3">
          <h3 className="font-medium text-gray-900">Todas las Materias</h3>
          
          {SUBJECTS.map((subject, index) => {
            const progress = getSubjectProgress(subject.id);
            const level = getSubjectLevel(progress);
            const isActive = subject.id === selectedSubject;
            
            return (
              <motion.div
                key={subject.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                onClick={() => handleSubjectChange(subject.id)}
                className={`p-3 rounded-lg border cursor-pointer transition-all ${
                  isActive 
                    ? 'border-blue-300 bg-blue-50' 
                    : 'border-gray-200 hover:border-gray-300 hover:bg-gray-50'
                }`}
              >
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-3">
                    <div className={`p-1.5 rounded bg-${subject.color}-100`}>
                      <subject.icon className={`w-4 h-4 text-${subject.color}-600`} />
                    </div>
                    <div>
                      <div className="font-medium text-sm">{subject.name}</div>
                      <div className="text-xs text-gray-600">{subject.description}</div>
                    </div>
                  </div>
                  
                  <div className="text-right">
                    <div className={`text-sm font-medium ${level.color}`}>
                      {level.level}
                    </div>
                    <div className="text-xs text-gray-600">
                      {Math.round(progress)}%
                    </div>
                  </div>
                </div>
                
                <Progress value={progress} className="h-1.5" />
              </motion.div>
            );
          })}
        </div>

        {/* Recomendaciones interseccionales por materia */}
        <div className="space-y-3">
          <h3 className="font-medium text-gray-900">Recomendaciones por Materia</h3>
          
          {context.financialGoals && (
            <div className="bg-purple-50 p-3 rounded-lg border border-purple-200">
              <div className="flex items-center gap-2 text-purple-800 mb-2">
                <Target className="w-4 h-4" />
                <span className="font-medium">Enfoque para tu carrera</span>
              </div>
              <p className="text-purple-700 text-sm mb-2">
                Para acceder a {context.financialGoals.targetCareer}, te recomendamos priorizar:
              </p>
              <div className="flex gap-1 flex-wrap">
                {['COMPETENCIA_LECTORA', 'MATEMATICA_1'].map(subjectId => {
                  const subject = SUBJECTS.find(s => s.id === subjectId);
                  return subject ? (
                    <Badge 
                      key={subjectId}
                      variant="outline" 
                      className="text-xs bg-white border-purple-300 text-purple-700"
                    >
                      {subject.name}
                    </Badge>
                  ) : null;
                })}
              </div>
            </div>
          )}
          
          {context.diagnosticResults && (
            <div className="bg-blue-50 p-3 rounded-lg border border-blue-200">
              <div className="flex items-center gap-2 text-blue-800 mb-2">
                <TrendingUp className="w-4 h-4" />
                <span className="font-medium">Basado en tu diagnóstico</span>
              </div>
              <p className="text-blue-700 text-sm">
                Tu nivel general es {context.diagnosticResults.overallLevel}/100. 
                Te sugerimos enfocarte en las materias con menor puntaje.
              </p>
            </div>
          )}
        </div>

        {/* Acciones rápidas */}
        <div className="grid grid-cols-2 gap-2">
          <Button
            variant="outline"
            onClick={() => onNavigateToTool('plan', { focusSubject: selectedSubject })}
            className="justify-start gap-2"
          >
            📚 Crear Plan
          </Button>
          <Button
            variant="outline"
            onClick={() => onNavigateToTool('financial', { fromSubject: selectedSubject })}
            className="justify-start gap-2"
          >
            💰 Ver Impacto
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};
