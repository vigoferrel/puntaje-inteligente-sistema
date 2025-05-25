
import React from 'react';
import { CheckCircle, Target } from 'lucide-react';

interface Exercise {
  question: string;
  alternatives: string[];
  correctAnswer: string;
  explanation: string;
}

interface ExerciseContentProps {
  exercise: Exercise;
}

export const ExerciseContent: React.FC<ExerciseContentProps> = ({ exercise }) => {
  return (
    <div className="space-y-4">
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
    </div>
  );
};
