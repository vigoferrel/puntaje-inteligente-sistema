
import React from 'react';
import { Exercise } from '@/types/ai-types';
import { ArrowRight, Award } from 'lucide-react';

interface ExerciseQuestionProps {
  exercise: Exercise;
  selectedOption: number | null;
  showFeedback: boolean;
  onOptionSelect: (index: number) => void;
}

export const ExerciseQuestion: React.FC<ExerciseQuestionProps> = ({
  exercise,
  selectedOption,
  showFeedback,
  onOptionSelect
}) => {
  // Determine the correct answer as index
  const correctAnswerIndex = exercise.options.findIndex(
    option => option === exercise.correctAnswer
  );
  
  // If the correct answer is not found, use 0 as default
  const correctIndex = correctAnswerIndex >= 0 ? correctAnswerIndex : 0;

  return (
    <div>
      <h3 className="text-lg font-semibold text-foreground mb-4">{exercise.question}</h3>
      
      <div className="space-y-3 mb-6">
        {exercise.options.map((option, index) => (
          <button
            key={index}
            className={`w-full text-left p-3 rounded-lg transition-all duration-300 ${
              selectedOption === index 
                ? showFeedback
                  ? index === correctIndex 
                    ? 'bg-green-500/20 border border-green-500/50'
                    : 'bg-red-500/20 border border-red-500/50'
                  : 'bg-primary/20 border border-primary/50' 
                : 'bg-secondary/30 border border-border hover:bg-secondary'
            }`}
            onClick={() => !showFeedback && onOptionSelect(index)}
            disabled={showFeedback}
          >
            <div className="flex items-start">
              <div className={`w-5 h-5 rounded-full flex items-center justify-center flex-shrink-0 mr-3 mt-0.5 ${
                selectedOption === index 
                  ? showFeedback
                    ? index === correctIndex
                      ? 'bg-green-500 text-white'
                      : 'bg-red-500 text-white'
                    : 'bg-primary text-white' 
                  : correctIndex === index && showFeedback
                    ? 'bg-green-500 text-white'
                    : 'border border-muted-foreground'
              }`}>
                {showFeedback 
                  ? (index === correctIndex 
                      ? <Award size={12} /> 
                      : selectedOption === index ? '✗' : '')
                  : selectedOption === index && <ArrowRight size={12} />
                }
              </div>
              <span>{option}</span>
            </div>
          </button>
        ))}
      </div>
    </div>
  );
};
