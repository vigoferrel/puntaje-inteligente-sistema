/* eslint-disable react-refresh/only-export-components */

import React, { useState, useEffect } from 'react';
import type { SafeString, SafeNumber, SafeBoolean, APIResponse, OperationResult } from '../../../types/core';
import { Exercise } from '../../../types/ai-types';
import { CinematicHeader } from './CinematicHeader';
import { HolographicOptions } from './HolographicOptions';
import { CircularTimer } from './CircularTimer';
import { ContextualBackground } from './ContextualBackground';
import { ContextualGraphics } from './ContextualGraphics';
import { motion, AnimatePresence } from 'framer-motion';
import { Sparkles, Brain, Target, Award } from 'lucide-react';
import { supabase } from '../../../integrations/supabase/leonardo-auth-client';

interface CinematicExerciseViewProps {
  exercise: Exercise | null;
  selectedOption: number | null;
  showFeedback: boolean;
  onOptionSelect: (index: number) => void;
  onContinue: () => void;
  exerciseSource?: 'PAES' | 'AI' | null;
  progress?: number;
}

export const CinematicExerciseView: React.FC<CinematicExerciseViewProps> = ({
  exercise,
  selectedOption,
  showFeedback,
  onOptionSelect,
  onContinue,
  exerciseSource = null,
  progress = 0
}) => {
  const [particles, setParticles] = useState<Array<{ id: number; x: number; y: number; opacity: number }>>([]);
  const [timeElapsed, setTimeElapsed] = useState(0);

  useEffect(() => {
    if (!exercise) return;

    // Generar partÃ­culas de fondo
    const newParticles = Array.from({ length: 20 }, (_, i) => ({
      id: i,
      x: Math.random() * 100,
      y: Math.random() * 100,
      opacity: Math.random() * 0.6 + 0.2
    }));
    setParticles(newParticles);

    // Timer para el ejercicio
    const timer = setInterval(() => {
      if (!showFeedback) {
        setTimeElapsed(prev => prev + 1);
      }
    }, 1000);

    return () => clearInterval(timer);
  }, [exercise, showFeedback]);

  if (!exercise) {
    return (
      <div className="min-h-[600px] flex items-center justify-center">
        <div className="text-center space-y-4">
          <Brain className="h-16 w-16 mx-auto text-primary/40 animate-pulse" />
          <p className="text-muted-foreground">Preparando experiencia cinematogrÃ¡fica...</p>
        </div>
      </div>
    );
  }

  const correctAnswerIndex = exercise.options.findIndex(
    option => option === exercise.correctAnswer
  );
  const isCorrect = selectedOption === correctAnswerIndex;

  return (
    <div className="relative min-h-[700px] overflow-hidden">
      {/* Fondo contextual */}
      <ContextualBackground prueba={exercise.prueba} />
      
      {/* PartÃ­culas flotantes */}
      <div className="absolute inset-0 pointer-events-none">
        {particles.map((particle) => (
          <motion.div
            key={particle.id}
            className="absolute w-1 h-1 bg-primary/30 rounded-full dynamic-particle"
            data-left={particle.x}
            data-top={particle.y}
            data-opacity={particle.opacity}
            animate={{
              y: [0, -20, 0],
              opacity: [particle.opacity, particle.opacity * 0.5, particle.opacity]
            }}
            transition={{
              duration: 3 + Math.random() * 2,
              repeat: Infinity,
              ease: "easeInOut"
            }}
          />
        ))}
      </div>

      {/* Contenedor principal con glassmorphism */}
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="relative z-10 p-8"
      >
        <div className="glass-morphism rounded-3xl p-8 space-y-8">
          {/* Header cinematogrÃ¡fico */}
          <CinematicHeader
            exercise={exercise}
            exerciseSource={exerciseSource}
            timeElapsed={timeElapsed}
            progress={progress}
          />

          {/* Grid principal asimÃ©trico */}
          <div className="grid grid-cols-12 gap-8">
            {/* Columna principal del contenido */}
            <div className="col-span-12 lg:col-span-8 space-y-6">
              {/* Contexto visual */}
              {(exercise.text || exercise.context) && (
                <motion.div
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  className="glass-morphism rounded-2xl p-6 border border-white/20"
                >
                  <div className="flex items-center gap-3 mb-4">
                    <div className="p-2 rounded-lg bg-primary/20">
                      <Target className="h-5 w-5 text-primary" />
                    </div>
                    <h4 className="font-semibold text-foreground">Contexto del Ejercicio</h4>
                  </div>
                  <p className="text-foreground/80 leading-relaxed">
                    {exercise.text || exercise.context}
                  </p>
                </motion.div>
              )}

              {/* Pregunta principal */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
                className="space-y-6"
              >
                <h2 className="text-2xl font-bold text-foreground leading-tight">
                  {exercise.question}
                </h2>

                {/* GrÃ¡ficos contextuales */}
                <ContextualGraphics exercise={exercise} />

                {/* Opciones hologrÃ¡ficas */}
                <HolographicOptions
                  options={exercise.options}
                  selectedOption={selectedOption}
                  correctAnswerIndex={correctAnswerIndex}
                  showFeedback={showFeedback}
                  onOptionSelect={onOptionSelect}
                />
              </motion.div>

              {/* Feedback cinematogrÃ¡fico */}
              <AnimatePresence>
                {showFeedback && (
                  <motion.div
                    initial={{ opacity: 0, scale: 0.8, y: 20 }}
                    animate={{ opacity: 1, scale: 1, y: 0 }}
                    exit={{ opacity: 0, scale: 0.8 }}
                    className={`glass-morphism rounded-2xl p-6 border-2 ${
                      isCorrect
                        ? 'border-green-400/50 bg-green-500/10'
                        : 'border-red-400/50 bg-red-500/10'
                    }`}
                  >
                    <div className="flex items-center gap-3 mb-4">
                      <div className={`p-3 rounded-full ${
                        isCorrect ? 'bg-green-500/20' : 'bg-red-500/20'
                      }`}>
                        {isCorrect ? (
                          <Award className="h-6 w-6 text-green-400" />
                        ) : (
                          <Target className="h-6 w-6 text-red-400" />
                        )}
                      </div>
                      <h3 className="text-xl font-bold">
                        {isCorrect ? 'Â¡Excelente!' : 'Casi lo logras'}
                      </h3>
                    </div>
                    
                    <p className="text-foreground/80 mb-6">
                      {isCorrect 
                        ? exercise.explanation || "Â¡Perfecto! Has demostrado un excelente dominio del tema."
                        : `La respuesta correcta era: "${exercise.correctAnswer}". ${exercise.explanation || ""}`
                      }
                    </p>

                    <motion.button
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      onClick={onContinue}
                      className="px-8 py-3 bg-primary hover:bg-primary/90 text-white rounded-xl font-semibold transition-all shadow-lg shadow-primary/25"
                    >
                      Continuar Aventura
                    </motion.button>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            {/* Sidebar con estadÃ­sticas */}
            <div className="col-span-12 lg:col-span-4 space-y-6">
              {/* Timer circular */}
              <CircularTimer
                timeElapsed={timeElapsed}
                estimatedTime={exercise.estimatedTime || 120}
                isActive={!showFeedback}
              />

              {/* EstadÃ­sticas del ejercicio */}
              <motion.div
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.4 }}
                className="glass-morphism rounded-2xl p-6 space-y-4"
              >
                <div className="flex items-center gap-2 mb-4">
                  <Sparkles className="h-5 w-5 text-primary" />
                  <h4 className="font-semibold">InformaciÃ³n del Ejercicio</h4>
                </div>
                
                <div className="space-y-3">
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-muted-foreground">Dificultad</span>
                    <span className="font-medium text-primary">
                      {exercise.difficulty || 'Intermedio'}
                    </span>
                  </div>
                  
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-muted-foreground">Habilidad</span>
                    <span className="font-medium">{exercise.skill}</span>
                  </div>
                  
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-muted-foreground">Progreso</span>
                    <span className="font-medium">{Math.round(progress)}%</span>
                  </div>
                </div>
              </motion.div>
            </div>
          </div>
        </div>
      </motion.div>
    </div>
  );
};


