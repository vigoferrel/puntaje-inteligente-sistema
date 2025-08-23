/* eslint-disable react-refresh/only-export-components */

import React, { useState } from 'react';
import type { SafeString, SafeNumber, SafeBoolean, APIResponse, OperationResult } from '../types/core';
import { motion } from 'framer-motion';
import { Card, CardContent, CardHeader, CardTitle } from '../../components/ui/card';
import { Button } from '../../components/ui/button';
import { Badge } from '../../components/ui/badge';
import { Brain, Clock, Target, CheckCircle, XCircle, Lightbulb } from 'lucide-react';

interface ExerciseViewerProps {
  exercise: unknown;
  onNext: () => void;
}

export const ExerciseViewer: React.FC<ExerciseViewerProps> = ({ exercise, onNext }) => {
  const [selectedOption, setSelectedOption] = useState<number | null>(null);
  const [showFeedback, setShowFeedback] = useState(false);

  const handleOptionSelect = (index: number) => {
    setSelectedOption(index);
    setShowFeedback(true);
  };

  const isCorrect = selectedOption === exercise.correctAnswer;

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      className="space-y-6"
    >
      {/* Exercise Header */}
      <Card className="bg-gradient-to-r from-purple-600/20 to-pink-600/20 border-white/20">
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="text-white flex items-center gap-2">
              <Brain className="w-5 h-5" />
              Ejercicio Generado por IA
            </CardTitle>
            <div className="flex gap-2">
              <Badge className="bg-purple-600 text-white">
                {exercise.subject}
              </Badge>
              <Badge className="bg-blue-600 text-white">
                {exercise.difficulty}
              </Badge>
              <Badge className="bg-green-600 text-white">
                IA: {exercise.aiConfidence}%
              </Badge>
            </div>
          </div>
        </CardHeader>
      </Card>

      {/* Exercise Content */}
      <Card className="bg-black/40 backdrop-blur-xl border-white/20">
        <CardContent className="p-8">
          {/* Question */}
          <div className="mb-8">
            <div className="flex items-center gap-3 mb-4">
              <Target className="w-5 h-5 text-purple-400" />
              <span className="text-purple-400 font-medium">{exercise.node}</span>
              <span className="text-white/60">â€¢</span>
              <span className="text-blue-400">{exercise.bloomLevel}</span>
              <span className="text-white/60">â€¢</span>
              <div className="flex items-center gap-1 text-green-400">
                <Clock className="w-4 h-4" />
                {exercise.timeEstimate} min
              </div>
            </div>
            
            <h3 className="text-white text-xl font-medium leading-relaxed">
              {exercise.question}
            </h3>
          </div>

          {/* Options */}
          <div className="space-y-3 mb-8">
            {exercise.options.map((option: string, index: number) => (
              <motion.button
                key={index}
                whileHover={{ scale: 1.01 }}
                whileTap={{ scale: 0.99 }}
                onClick={() => handleOptionSelect(index)}
                disabled={showFeedback}
                className={`w-full p-4 rounded-xl text-left transition-all duration-300 ${
                  selectedOption === index
                    ? showFeedback
                      ? index === exercise.correctAnswer
                        ? 'bg-green-600/30 border-green-500 text-white'
                        : 'bg-red-600/30 border-red-500 text-white'
                      : 'bg-purple-600/30 border-purple-500 text-white'
                    : showFeedback && index === exercise.correctAnswer
                    ? 'bg-green-600/20 border-green-500/50 text-green-200'
                    : 'bg-white/5 border-white/20 text-white hover:bg-white/10'
                } border`}
              >
                <div className="flex items-center gap-3">
                  <div className={`w-6 h-6 rounded-full flex items-center justify-center text-sm font-bold ${
                    selectedOption === index
                      ? showFeedback
                        ? index === exercise.correctAnswer
                          ? 'bg-green-500 text-white'
                          : 'bg-red-500 text-white'
                        : 'bg-purple-500 text-white'
                      : showFeedback && index === exercise.correctAnswer
                      ? 'bg-green-500 text-white'
                      : 'bg-white/20 text-white'
                  }`}>
                    {String.fromCharCode(65 + index)}
                  </div>
                  <span>{option}</span>
                  {showFeedback && selectedOption === index && (
                    <div className="ml-auto">
                      {index === exercise.correctAnswer ? (
                        <CheckCircle className="w-5 h-5 text-green-400" />
                      ) : (
                        <XCircle className="w-5 h-5 text-red-400" />
                      )}
                    </div>
                  )}
                  {showFeedback && index === exercise.correctAnswer && selectedOption !== index && (
                    <CheckCircle className="w-5 h-5 text-green-400 ml-auto" />
                  )}
                </div>
              </motion.button>
            ))}
          </div>

          {/* Feedback */}
          {showFeedback && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="space-y-4"
            >
              <Card className={`border-2 ${isCorrect ? 'border-green-500 bg-green-600/10' : 'border-red-500 bg-red-600/10'}`}>
                <CardContent className="p-4">
                  <div className="flex items-center gap-2 mb-3">
                    {isCorrect ? (
                      <CheckCircle className="w-5 h-5 text-green-400" />
                    ) : (
                      <XCircle className="w-5 h-5 text-red-400" />
                    )}
                    <span className={`font-bold ${isCorrect ? 'text-green-400' : 'text-red-400'}`}>
                      {isCorrect ? 'Â¡Correcto!' : 'Incorrecto'}
                    </span>
                  </div>
                  
                  <div className="flex items-start gap-3">
                    <Lightbulb className="w-5 h-5 text-yellow-400 mt-1 flex-shrink-0" />
                    <p className="text-white/90 leading-relaxed">
                      {exercise.explanation}
                    </p>
                  </div>
                </CardContent>
              </Card>

              <div className="flex justify-center">
                <Button 
                  onClick={onNext}
                  className="bg-gradient-to-r from-purple-600 to-pink-600 hover:opacity-90"
                >
                  Generar Siguiente Ejercicio
                </Button>
              </div>
            </motion.div>
          )}
        </CardContent>
      </Card>
    </motion.div>
  );
};

