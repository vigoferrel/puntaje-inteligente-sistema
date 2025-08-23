
import React from 'react';
import { Exercise } from '@/types/ai-types';
import { motion } from 'framer-motion';
import { BarChart3, PieChart, TrendingUp, Activity } from 'lucide-react';
import { ExerciseVisualContent } from './ExerciseVisualContent';

interface ContextualGraphicsProps {
  exercise: Exercise;
}

export const ContextualGraphics: React.FC<ContextualGraphicsProps> = ({ exercise }) => {
  // Si ya tiene contenido visual, mostrarlo
  if (exercise.imageUrl || exercise.hasVisualContent) {
    return <ExerciseVisualContent exercise={exercise} />;
  }

  // Generar visualización contextual basada en el tipo de ejercicio
  const generateContextualVisualization = () => {
    if (exercise.prueba === 'MATEMATICA_1' || exercise.prueba === 'MATEMATICA_2') {
      return (
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="glass-morphism rounded-xl p-6 mb-6"
        >
          <div className="flex items-center gap-3 mb-4">
            <BarChart3 className="h-5 w-5 text-primary" />
            <span className="font-medium">Visualización Matemática</span>
          </div>
          
          <div className="grid grid-cols-4 gap-2 mb-4">
            {[...Array(16)].map((_, i) => (
              <motion.div
                key={i}
                className={`h-8 rounded ${
                  i % 4 === 0 ? 'bg-primary/30' :
                  i % 3 === 0 ? 'bg-blue-500/30' :
                  i % 2 === 0 ? 'bg-green-500/30' : 'bg-gray-500/20'
                }`}
                initial={{ height: 0 }}
                animate={{ height: 32 }}
                transition={{ delay: i * 0.05 }}
              />
            ))}
          </div>
          
          <p className="text-xs text-muted-foreground">
            Representación visual de conceptos matemáticos
          </p>
        </motion.div>
      );
    }

    if (exercise.prueba === 'CIENCIAS') {
      return (
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="glass-morphism rounded-xl p-6 mb-6"
        >
          <div className="flex items-center gap-3 mb-4">
            <Activity className="h-5 w-5 text-orange-500" />
            <span className="font-medium">Diagrama Científico</span>
          </div>
          
          <div className="relative">
            <svg viewBox="0 0 200 120" className="w-full h-24">
              {/* Molécula simple */}
              <motion.circle
                cx="50"
                cy="60"
                r="15"
                fill="currentColor"
                className="text-blue-500"
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ delay: 0.2 }}
              />
              <motion.circle
                cx="100"
                cy="40"
                r="12"
                fill="currentColor"
                className="text-red-500"
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ delay: 0.4 }}
              />
              <motion.circle
                cx="100"
                cy="80"
                r="12"
                fill="currentColor"
                className="text-red-500"
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ delay: 0.6 }}
              />
              <motion.circle
                cx="150"
                cy="60"
                r="15"
                fill="currentColor"
                className="text-green-500"
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ delay: 0.8 }}
              />
              
              {/* Enlaces */}
              <motion.line
                x1="65"
                y1="60"
                x2="85"
                y2="45"
                stroke="currentColor"
                strokeWidth="2"
                className="text-primary"
                initial={{ pathLength: 0 }}
                animate={{ pathLength: 1 }}
                transition={{ delay: 1, duration: 0.5 }}
              />
              <motion.line
                x1="65"
                y1="60"
                x2="85"
                y2="75"
                stroke="currentColor"
                strokeWidth="2"
                className="text-primary"
                initial={{ pathLength: 0 }}
                animate={{ pathLength: 1 }}
                transition={{ delay: 1.2, duration: 0.5 }}
              />
              <motion.line
                x1="115"
                y1="50"
                x2="135"
                y2="60"
                stroke="currentColor"
                strokeWidth="2"
                className="text-primary"
                initial={{ pathLength: 0 }}
                animate={{ pathLength: 1 }}
                transition={{ delay: 1.4, duration: 0.5 }}
              />
            </svg>
          </div>
          
          <p className="text-xs text-muted-foreground mt-4">
            Representación molecular interactiva
          </p>
        </motion.div>
      );
    }

    if (exercise.prueba === 'COMPETENCIA_LECTORA') {
      return (
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="glass-morphism rounded-xl p-6 mb-6"
        >
          <div className="flex items-center gap-3 mb-4">
            <TrendingUp className="h-5 w-5 text-blue-500" />
            <span className="font-medium">Análisis Textual</span>
          </div>
          
          <div className="space-y-3">
            {['Comprensión', 'Análisis', 'Síntesis', 'Evaluación'].map((skill, i) => (
              <div key={skill} className="flex items-center gap-3">
                <span className="text-xs font-medium w-20">{skill}</span>
                <div className="flex-1 bg-white/10 rounded-full h-2 overflow-hidden">
                  <motion.div
                    className={`h-full rounded-full ${
                      i === 0 ? 'bg-blue-500' :
                      i === 1 ? 'bg-green-500' :
                      i === 2 ? 'bg-yellow-500' : 'bg-purple-500'
                    }`}
                    initial={{ width: 0 }}
                    animate={{ width: `${60 + i * 10}%` }}
                    transition={{ delay: i * 0.2, duration: 0.8 }}
                  />
                </div>
              </div>
            ))}
          </div>
          
          <p className="text-xs text-muted-foreground mt-4">
            Niveles de competencia lectora evaluados
          </p>
        </motion.div>
      );
    }

    return null;
  };

  return generateContextualVisualization();
};
