/* eslint-disable react-refresh/only-export-components */

import React, { useState } from 'react';
import type { SafeString, SafeNumber, SafeBoolean, APIResponse, OperationResult } from '../types/core';
import { motion } from 'framer-motion';
import { AppLayout } from '../../components/app-layout';
import { Card, CardContent, CardHeader, CardTitle } from '../../components/ui/card';
import { Button } from '../../components/ui/button';
import { Badge } from '../../components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../../components/ui/select';
import { Slider } from '../../components/ui/slider';
import { Brain, Zap, Target, BookOpen, Calculator, History, FlaskConical } from 'lucide-react';
import { ExerciseViewer } from './ExerciseViewer';
import { ExerciseBatch } from './ExerciseBatch';
import { supabase } from '../../integrations/supabase/leonardo-auth-client';

const subjects = [
  { id: 'competencia-lectora', name: 'Competencia Lectora', icon: BookOpen, color: 'from-blue-600 to-cyan-600', nodes: 30 },
  { id: 'matematica-m1', name: 'MatemÃ¡tica M1', icon: Calculator, color: 'from-green-600 to-emerald-600', nodes: 25 },
  { id: 'matematica-m2', name: 'MatemÃ¡tica M2', icon: Calculator, color: 'from-purple-600 to-pink-600', nodes: 22 },
  { id: 'historia', name: 'Historia y CS', icon: History, color: 'from-orange-600 to-red-600', nodes: 65 },
  { id: 'ciencias', name: 'Ciencias', icon: FlaskConical, color: 'from-red-600 to-pink-600', nodes: 135 }
];

export const AIExerciseGenerator: React.FC = () => {
  const [selectedSubject, setSelectedSubject] = useState('');
  const [difficulty, setDifficulty] = useState(50);
  const [exerciseCount, setExerciseCount] = useState(5);
  const [mode, setMode] = useState<'single' | 'batch'>('single');
  const [currentExercise, setCurrentExercise] = useState(null);
  const [exerciseBatch, setExerciseBatch] = useState([]);
  const [isGenerating, setIsGenerating] = useState(false);

  const generateExercise = async () => {
    if (!selectedSubject) return;
    
    setIsGenerating(true);
    
    // Simular generaciÃ³n con IA
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    const subject = subjects.find(s => s.id === selectedSubject);
    const difficultyLevel = difficulty < 30 ? 'BÃ¡sico' : difficulty < 70 ? 'Intermedio' : 'Avanzado';
    
    const mockExercise = {
      id: `ex_${Date.now()}`,
      subject: subject?.name,
      difficulty: difficultyLevel,
      question: `Â¿CuÃ¡l de las siguientes alternativas mejor representa el concepto evaluado en ${subject?.name} a nivel ${difficultyLevel}?`,
      options: [
        'Primera alternativa que presenta un enfoque conceptual sÃ³lido',
        'Segunda alternativa con perspectiva metodolÃ³gica diferente',
        'Tercera alternativa que incluye elementos complementarios',
        'Cuarta alternativa como distractor bien construido'
      ],
      correctAnswer: 0,
      explanation: `La respuesta correcta es A porque evalÃºa directamente los objetivos de aprendizaje de ${subject?.name} en nivel ${difficultyLevel}. Esta opciÃ³n demuestra comprensiÃ³n profunda del concepto y aplicaciÃ³n prÃ¡ctica del conocimiento.`,
      timeEstimate: Math.floor(Math.random() * 3) + 2,
      bloomLevel: difficulty < 30 ? 'Recordar' : difficulty < 70 ? 'Comprender' : 'Analizar',
      node: `Nodo ${Math.floor(Math.random() * subject?.nodes) + 1}`,
      aiConfidence: Math.floor(Math.random() * 20) + 80
    };
    
    if (mode === 'single') {
      setCurrentExercise(mockExercise);
    } else {
      const batch = Array.from({ length: exerciseCount }, (_, i) => ({
        ...mockExercise,
        id: `ex_${Date.now()}_${i}`,
        question: `Pregunta ${i + 1}: ${mockExercise.question}`,
        node: `Nodo ${Math.floor(Math.random() * subject?.nodes) + 1}`
      }));
      setExerciseBatch(batch);
    }
    
    setIsGenerating(false);
  };

  return (
    <AppLayout>
      <div className="min-h-screen bg-gradient-to-br from-gray-900 via-purple-900 to-gray-900 p-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="max-w-7xl mx-auto space-y-8"
        >
          {/* Header */}
          <Card className="bg-black/40 backdrop-blur-xl border-white/20">
            <CardHeader>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <div className="w-16 h-16 rounded-2xl bg-gradient-to-r from-purple-600 to-pink-600 flex items-center justify-center">
                    <Brain className="w-8 h-8 text-white" />
                  </div>
                  <div>
                    <CardTitle className="text-white text-3xl">Generador de Ejercicios IA</CardTitle>
                    <p className="text-purple-200 text-lg">
                      Ejercicios adaptativos generados con inteligencia artificial
                    </p>
                  </div>
                </div>
                
                <div className="text-right">
                  <div className="text-sm text-purple-300">Ejercicios Disponibles</div>
                  <div className="text-3xl font-bold text-white">277</div>
                  <Badge className="mt-2 bg-purple-600 text-white">
                    IA Neural Activa
                  </Badge>
                </div>
              </div>
            </CardHeader>
          </Card>

          {/* Configuration Panel */}
          <Card className="bg-black/40 backdrop-blur-xl border-white/20">
            <CardHeader>
              <CardTitle className="text-white flex items-center gap-2">
                <Target className="w-5 h-5" />
                ConfiguraciÃ³n de GeneraciÃ³n
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                <div>
                  <label className="text-white text-sm font-medium mb-2 block">
                    Materia PAES
                  </label>
                  <Select value={selectedSubject} onValueChange={setSelectedSubject}>
                    <SelectTrigger className="bg-white/10 border-white/20 text-white">
                      <SelectValue placeholder="Selecciona materia" />
                    </SelectTrigger>
                    <SelectContent>
                      {subjects.map(subject => {
                        const Icon = subject.icon;
                        return (
                          <SelectItem key={subject.id} value={subject.id}>
                            <div className="flex items-center gap-2">
                              <Icon className="w-4 h-4" />
                              {subject.name} ({subject.nodes} nodos)
                            </div>
                          </SelectItem>
                        );
                      })}
                    </SelectContent>
                  </Select>
                </div>
                
                <div>
                  <label className="text-white text-sm font-medium mb-2 block">
                    Modo de GeneraciÃ³n
                  </label>
                  <Select value={mode} onValueChange={(value: 'single' | 'batch') => setMode(value)}>
                    <SelectTrigger className="bg-white/10 border-white/20 text-white">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="single">Ejercicio Individual</SelectItem>
                      <SelectItem value="batch">Lote de Ejercicios</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                
                {mode === 'batch' && (
                  <div>
                    <label className="text-white text-sm font-medium mb-2 block">
                      Cantidad: {exerciseCount}
                    </label>
                    <Slider
                      value={[exerciseCount]}
                      onValueChange={(value) => setExerciseCount(value[0])}
                      max={20}
                      min={3}
                      step={1}
                      className="w-full"
                    />
                  </div>
                )}
                
                <div>
                  <label className="text-white text-sm font-medium mb-2 block">
                    Dificultad: {difficulty < 30 ? 'BÃ¡sico' : difficulty < 70 ? 'Intermedio' : 'Avanzado'}
                  </label>
                  <Slider
                    value={[difficulty]}
                    onValueChange={(value) => setDifficulty(value[0])}
                    max={100}
                    min={0}
                    step={5}
                    className="w-full"
                  />
                </div>
              </div>
              
              <Button 
                onClick={generateExercise}
                disabled={!selectedSubject || isGenerating}
                className="w-full bg-gradient-to-r from-purple-600 to-pink-600 hover:opacity-90"
              >
                {isGenerating ? (
                  <>
                    <Brain className="w-4 h-4 mr-2 animate-pulse" />
                    Generando con IA...
                  </>
                ) : (
                  <>
                    <Zap className="w-4 h-4 mr-2" />
                    Generar {mode === 'single' ? 'Ejercicio' : `${exerciseCount} Ejercicios`}
                  </>
                )}
              </Button>
            </CardContent>
          </Card>

          {/* Results */}
          {currentExercise && mode === 'single' && (
            <ExerciseViewer exercise={currentExercise} onNext={generateExercise} />
          )}
          
          {exerciseBatch.length > 0 && mode === 'batch' && (
            <ExerciseBatch exercises={exerciseBatch} onRegenerateAll={generateExercise} />
          )}

          {/* Subject Overview */}
          {selectedSubject && (
            <Card className="bg-black/20 backdrop-blur-xl border-white/10">
              <CardContent className="p-6">
                <div className="grid grid-cols-1 md:grid-cols-4 gap-6 text-center">
                  {subjects.filter(s => s.id === selectedSubject).map(subject => {
                    const Icon = subject.icon;
                    return (
                      <React.Fragment key={subject.id}>
                        <div>
                          <Icon className="w-8 h-8 text-blue-400 mx-auto mb-2" />
                          <div className="text-2xl font-bold text-blue-400">{subject.nodes}</div>
                          <div className="text-white/60 text-sm">Nodos Totales</div>
                        </div>
                        <div>
                          <Target className="w-8 h-8 text-green-400 mx-auto mb-2" />
                          <div className="text-2xl font-bold text-green-400">
                            {difficulty < 30 ? 'BÃ¡sico' : difficulty < 70 ? 'Intermedio' : 'Avanzado'}
                          </div>
                          <div className="text-white/60 text-sm">Nivel Actual</div>
                        </div>
                        <div>
                          <Brain className="w-8 h-8 text-purple-400 mx-auto mb-2" />
                          <div className="text-2xl font-bold text-purple-400">95%</div>
                          <div className="text-white/60 text-sm">PrecisiÃ³n IA</div>
                        </div>
                        <div>
                          <Zap className="w-8 h-8 text-yellow-400 mx-auto mb-2" />
                          <div className="text-2xl font-bold text-yellow-400">âˆž</div>
                          <div className="text-white/60 text-sm">Ejercicios IA</div>
                        </div>
                      </React.Fragment>
                    );
                  })}
                </div>
              </CardContent>
            </Card>
          )}
        </motion.div>
      </div>
    </AppLayout>
  );
};


