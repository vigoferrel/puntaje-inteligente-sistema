/* eslint-disable react-refresh/only-export-components */

import React, { useState } from 'react';
import type { SafeString, SafeNumber, SafeBoolean, APIResponse, OperationResult } from '../types/core';
import { motion } from 'framer-motion';
import { Card, CardContent, CardHeader, CardTitle } from '../../components/ui/card';
import { Button } from '../../components/ui/button';
import { Badge } from '../../components/ui/badge';
import { BookOpen, Clock, Brain, BarChart3, Download, RefreshCw } from 'lucide-react';

interface ExerciseBatchProps {
  exercises: unknown[];
  onRegenerateAll: () => void;
}

export const ExerciseBatch: React.FC<ExerciseBatchProps> = ({ exercises, onRegenerateAll }) => {
  const [expandedExercise, setExpandedExercise] = useState<number | null>(null);

  const exportExercises = () => {
    const exportData = {
      timestamp: new Date().toISOString(),
      total: exercises.length,
      subject: exercises[0]?.subject,
      exercises: exercises.map(ex => ({
        question: ex.question,
        options: ex.options,
        correctAnswer: String.fromCharCode(65 + ex.correctAnswer),
        explanation: ex.explanation,
        difficulty: ex.difficulty,
        node: ex.node
      }))
    };
    
    const blob = new Blob([JSON.stringify(exportData, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `ejercicios_${exercises[0]?.subject}_${Date.now()}.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="space-y-6">
      {/* Batch Summary */}
      <Card className="bg-black/40 backdrop-blur-xl border-white/20">
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="text-white flex items-center gap-2">
              <BookOpen className="w-5 h-5" />
              Lote de Ejercicios Generados
            </CardTitle>
            <div className="flex gap-2">
              <Button
                onClick={exportExercises}
                variant="outline"
                className="border-white/30 text-white hover:bg-white/10"
              >
                <Download className="w-4 h-4 mr-2" />
                Exportar
              </Button>
              <Button
                onClick={onRegenerateAll}
                className="bg-gradient-to-r from-purple-600 to-pink-600 hover:opacity-90"
              >
                <RefreshCw className="w-4 h-4 mr-2" />
                Regenerar Todo
              </Button>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="text-center">
              <BookOpen className="w-8 h-8 text-blue-400 mx-auto mb-2" />
              <div className="text-2xl font-bold text-blue-400">{exercises.length}</div>
              <div className="text-white/60 text-sm">Ejercicios</div>
            </div>
            <div className="text-center">
              <Clock className="w-8 h-8 text-green-400 mx-auto mb-2" />
              <div className="text-2xl font-bold text-green-400">
                {exercises.reduce((acc, ex) => acc + ex.timeEstimate, 0)} min
              </div>
              <div className="text-white/60 text-sm">Tiempo Total</div>
            </div>
            <div className="text-center">
              <Brain className="w-8 h-8 text-purple-400 mx-auto mb-2" />
              <div className="text-2xl font-bold text-purple-400">
                {Math.round(exercises.reduce((acc, ex) => acc + ex.aiConfidence, 0) / exercises.length)}%
              </div>
              <div className="text-white/60 text-sm">Confianza IA</div>
            </div>
            <div className="text-center">
              <BarChart3 className="w-8 h-8 text-yellow-400 mx-auto mb-2" />
              <div className="text-2xl font-bold text-yellow-400">{exercises[0]?.difficulty}</div>
              <div className="text-white/60 text-sm">Nivel</div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Exercise List */}
      <div className="space-y-4">
        {exercises.map((exercise, index) => (
          <motion.div
            key={exercise.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
          >
            <Card className="bg-black/20 backdrop-blur-xl border-white/10 overflow-hidden">
              <CardContent className="p-0">
                <div 
                  className="p-6 cursor-pointer hover:bg-white/5 transition-colors"
                  onClick={() => setExpandedExercise(expandedExercise === index ? null : index)}
                >
                  <div className="flex items-center justify-between">
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-2">
                        <Badge className="bg-purple-600 text-white">
                          Ejercicio {index + 1}
                        </Badge>
                        <Badge variant="outline" className="text-blue-400 border-blue-400">
                          {exercise.node}
                        </Badge>
                        <Badge variant="outline" className="text-green-400 border-green-400">
                          {exercise.timeEstimate} min
                        </Badge>
                      </div>
                      <h4 className="text-white font-medium line-clamp-2">
                        {exercise.question}
                      </h4>
                    </div>
                    <div className="text-right ml-4">
                      <div className="text-purple-400 font-bold">{exercise.aiConfidence}%</div>
                      <div className="text-white/60 text-sm">IA</div>
                    </div>
                  </div>
                </div>

                {expandedExercise === index && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: 'auto' }}
                    exit={{ opacity: 0, height: 0 }}
                    className="border-t border-white/10 p-6 bg-white/5"
                  >
                    <div className="space-y-4">
                      <div>
                        <h5 className="text-white font-medium mb-3">Alternativas:</h5>
                        <div className="space-y-2">
                          {exercise.options.map((option: string, optIndex: number) => (
                            <div 
                              key={optIndex}
                              className={`p-3 rounded-lg ${
                                optIndex === exercise.correctAnswer 
                                  ? 'bg-green-600/20 border border-green-500/50' 
                                  : 'bg-white/5'
                              }`}
                            >
                              <span className="text-white/70 font-medium mr-3">
                                {String.fromCharCode(65 + optIndex)}.
                              </span>
                              <span className="text-white">{option}</span>
                              {optIndex === exercise.correctAnswer && (
                                <Badge className="ml-2 bg-green-600 text-white text-xs">
                                  Correcta
                                </Badge>
                              )}
                            </div>
                          ))}
                        </div>
                      </div>
                      
                      <div>
                        <h5 className="text-white font-medium mb-2">ExplicaciÃ³n:</h5>
                        <p className="text-white/80 bg-blue-600/10 p-4 rounded-lg border border-blue-500/20">
                          {exercise.explanation}
                        </p>
                      </div>
                    </div>
                  </motion.div>
                )}
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </div>
    </div>
  );
};

