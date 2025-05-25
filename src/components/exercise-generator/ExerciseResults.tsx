
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Brain, Download, Trash2, Timer, Target, CheckCircle } from 'lucide-react';
import { motion } from 'framer-motion';

interface Exercise {
  id: number;
  node: string;
  subject: string;
  difficulty: string;
  question: string;
  alternatives: string[];
  correctAnswer: string;
  explanation: string;
  estimatedTime: number;
}

interface ExerciseResultsProps {
  exercises: Exercise[];
  isGenerating: boolean;
  selectedSubject: string;
  onClear: () => void;
}

export const ExerciseResults: React.FC<ExerciseResultsProps> = ({
  exercises,
  isGenerating,
  selectedSubject,
  onClear
}) => {
  const handleExport = () => {
    const content = exercises.map(ex => `
EJERCICIO ${ex.id}
Nodo: ${ex.node}
Dificultad: ${ex.difficulty}
Tiempo estimado: ${ex.estimatedTime} minutos

PREGUNTA:
${ex.question}

ALTERNATIVAS:
A) ${ex.alternatives[0]}
B) ${ex.alternatives[1]}
C) ${ex.alternatives[2]}
D) ${ex.alternatives[3]}

RESPUESTA CORRECTA: ${ex.correctAnswer}

EXPLICACIÓN:
${ex.explanation}

${'='.repeat(50)}
    `).join('\n');
    
    const blob = new Blob([content], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `ejercicios_paes_${selectedSubject}_${new Date().toISOString().split('T')[0]}.txt`;
    a.click();
    URL.revokeObjectURL(url);
  };

  if (isGenerating) {
    return (
      <Card>
        <CardContent className="p-12 text-center">
          <div className="space-y-4">
            <Brain className="w-12 h-12 mx-auto animate-pulse text-primary" />
            <h3 className="text-lg font-semibold">Generando ejercicios...</h3>
            <p className="text-muted-foreground">
              La IA está creando ejercicios personalizados basados en tu selección
            </p>
            <div className="flex justify-center">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
            </div>
          </div>
        </CardContent>
      </Card>
    );
  }

  if (exercises.length === 0) {
    return (
      <Card>
        <CardContent className="p-12 text-center">
          <Brain className="w-12 h-12 mx-auto mb-4 text-muted-foreground" />
          <h3 className="text-lg font-semibold mb-2">¡Listo para generar!</h3>
          <p className="text-muted-foreground mb-4">
            Configura los parámetros y selecciona los nodos para comenzar
          </p>
          <div className="text-sm text-muted-foreground space-y-1">
            <p>• Selecciona el tier de prioridad</p>
            <p>• Elige los nodos específicos</p>
            <p>• Configura dificultad y cantidad</p>
            <p>• Los ejercicios se generarán con IA</p>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-semibold">
          Ejercicios Generados ({exercises.length})
        </h2>
        <div className="flex gap-2">
          <Button variant="outline" size="sm" onClick={handleExport}>
            <Download className="w-4 h-4 mr-2" />
            Exportar
          </Button>
          <Button variant="outline" size="sm" onClick={onClear}>
            <Trash2 className="w-4 h-4 mr-2" />
            Limpiar
          </Button>
        </div>
      </div>

      {/* Exercise List */}
      <div className="space-y-4">
        {exercises.map((exercise, index) => (
          <motion.div
            key={exercise.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
          >
            <Card>
              <CardHeader className="pb-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Badge variant="default">Ejercicio {exercise.id}</Badge>
                    <Badge variant="outline" className="font-mono">
                      {exercise.node}
                    </Badge>
                    <Badge 
                      variant="secondary" 
                      className={
                        exercise.difficulty === 'avanzado' ? 'bg-red-100 text-red-800' :
                        exercise.difficulty === 'intermedio' ? 'bg-yellow-100 text-yellow-800' :
                        'bg-green-100 text-green-800'
                      }
                    >
                      {exercise.difficulty}
                    </Badge>
                  </div>
                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <Timer className="w-4 h-4" />
                    <span>{exercise.estimatedTime} min</span>
                  </div>
                </div>
              </CardHeader>
              
              <CardContent className="space-y-4">
                {/* Question */}
                <div>
                  <h4 className="font-semibold mb-2 text-foreground">Pregunta:</h4>
                  <p className="text-sm text-foreground leading-relaxed">{exercise.question}</p>
                </div>

                {/* Alternatives */}
                <div>
                  <h4 className="font-semibold mb-3 text-foreground">Alternativas:</h4>
                  <div className="space-y-2">
                    {exercise.alternatives.map((alternative, altIndex) => {
                      const letter = String.fromCharCode(65 + altIndex);
                      const isCorrect = letter === exercise.correctAnswer;
                      
                      return (
                        <div
                          key={altIndex}
                          className={`p-4 rounded-lg border-2 text-sm transition-all ${
                            isCorrect 
                              ? 'bg-green-100 dark:bg-green-900/30 border-green-400 dark:border-green-500' 
                              : 'bg-white dark:bg-slate-800 border-slate-300 dark:border-slate-600'
                          }`}
                        >
                          <div className="flex items-start gap-3">
                            <div className={`flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center font-bold text-sm border-2 ${
                              isCorrect 
                                ? 'bg-green-500 text-white border-green-500 shadow-lg' 
                                : 'bg-slate-100 dark:bg-slate-700 text-slate-700 dark:text-slate-200 border-slate-300 dark:border-slate-600'
                            }`}>
                              {isCorrect ? <CheckCircle className="w-4 h-4" /> : letter}
                            </div>
                            <span className={`leading-relaxed ${
                              isCorrect 
                                ? 'text-green-900 dark:text-green-100 font-medium' 
                                : 'text-slate-900 dark:text-slate-100'
                            }`}>
                              {alternative}
                            </span>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>

                {/* Explanation */}
                <div className="bg-blue-50 dark:bg-blue-900/30 border-l-4 border-blue-400 dark:border-blue-500 p-4 rounded-r-lg">
                  <div className="flex items-center gap-2 mb-2">
                    <Target className="w-4 h-4 text-blue-600 dark:text-blue-400" />
                    <span className="font-semibold text-blue-800 dark:text-blue-200">
                      Respuesta Correcta: {exercise.correctAnswer}
                    </span>
                  </div>
                  <p className="text-blue-700 dark:text-blue-300 text-sm leading-relaxed">{exercise.explanation}</p>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </div>
    </div>
  );
};
