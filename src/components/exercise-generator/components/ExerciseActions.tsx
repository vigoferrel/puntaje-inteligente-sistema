
import React from 'react';
import { Button } from '@/components/ui/button';
import { Download, Trash2 } from 'lucide-react';

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

interface ExerciseActionsProps {
  exercises: Exercise[];
  selectedSubject: string;
  onClear: () => void;
}

export const ExerciseActions: React.FC<ExerciseActionsProps> = ({
  exercises,
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

  return (
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
  );
};
