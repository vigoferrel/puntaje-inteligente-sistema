/* eslint-disable react-refresh/only-export-components */
import { FC } from 'react';
import type { SafeString, SafeNumber, SafeBoolean, APIResponse, OperationResult } from '../types/core';

import { Exercise } from '../../../types/ai-types';
import { ArrowRight, Award } from 'lucide-react';

interface ExerciseQuestionProps {
  exercise: Exercise;
  selectedOption: number | null;
  showFeedback: boolean;
  onOptionSelect: (index: number) => void;
}

export const ExerciseQuestion: FC<ExerciseQuestionProps> = ({
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
            className={`w-full text-left p-4 rounded-lg transition-all duration-300 border-2 ${
              selectedOption === index 
                ? showFeedback
                  ? index === correctIndex 
                    ? 'bg-green-500/30 border-green-500/70 shadow-lg backdrop-blur-md'
                    : 'bg-red-500/30 border-red-500/70 shadow-lg backdrop-blur-md'
                  : 'bg-primary/30 border-primary/70 shadow-lg backdrop-blur-md' 
                : 'bg-slate-800/90 dark:bg-slate-700/90 border-white/30 hover:bg-primary/20 hover:border-primary/50 backdrop-blur-md'
            }`}
            onClick={() => !showFeedback && onOptionSelect(index)}
            disabled={showFeedback}
          >
            <div className="flex items-start">
              <div className={`w-6 h-6 rounded-full flex items-center justify-center flex-shrink-0 mr-3 mt-0.5 font-bold text-sm ${
                selectedOption === index 
                  ? showFeedback
                    ? index === correctIndex
                      ? 'bg-green-500 text-white shadow-lg'
                      : 'bg-red-500 text-white shadow-lg'
                    : 'bg-primary text-white shadow-lg' 
                  : correctIndex === index && showFeedback
                    ? 'bg-green-500 text-white shadow-lg'
                    : 'bg-slate-700 dark:bg-slate-600 text-white border-2 border-white/40'
              }`}>
                {showFeedback 
                  ? (index === correctIndex 
                      ? <Award size={14} /> 
                      : selectedOption === index ? 'âœ—' : String.fromCharCode(65 + index))
                  : selectedOption === index 
                    ? <ArrowRight size={14} />
                    : String.fromCharCode(65 + index)
                }
              </div>
              <span className={`font-medium ${
                selectedOption === index || (showFeedback && index === correctIndex)
                  ? 'text-white'
                  : 'text-white'
              }`}>
                {option}
              </span>
            </div>
          </button>
        ))}
      </div>
    </div>
  );
};

