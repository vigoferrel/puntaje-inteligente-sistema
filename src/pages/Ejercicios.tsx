
import React, { useState } from 'react';
import { AppLayout } from '@/components/app-layout';
import { ExerciseGeneratorCore } from '@/components/exercise-generator/ExerciseGeneratorCore';
import { useExerciseGeneration } from '@/hooks/exercise/use-exercise-generation';
import { BookOpen, Calculator, History, FlaskConical, Brain } from 'lucide-react';

const Ejercicios: React.FC = () => {
  const [selectedSubject, setSelectedSubject] = useState('competencia-lectora');
  const [showSettings, setShowSettings] = useState(false);
  
  const {
    exerciseResults,
    isGenerating,
    generateExercises,
    clearResults
  } = useExerciseGeneration();

  // Estructura de materias basada en el sistema de 277 nodos
  const subjects = {
    'competencia-lectora': {
      name: 'Competencia Lectora',
      icon: BookOpen,
      color: 'bg-blue-500',
      totalNodes: 30,
      tier1: 14, tier2: 13, tier3: 3
    },
    'matematica-m1': {
      name: 'Matemática M1',
      icon: Calculator,
      color: 'bg-green-500',
      totalNodes: 25,
      tier1: 10, tier2: 10, tier3: 5
    },
    'matematica-m2': {
      name: 'Matemática M2',
      icon: Calculator,
      color: 'bg-purple-500',
      totalNodes: 22,
      tier1: 13, tier2: 6, tier3: 3
    },
    'historia': {
      name: 'Historia y Ciencias Sociales',
      icon: History,
      color: 'bg-orange-500',
      totalNodes: 65,
      tier1: 19, tier2: 26, tier3: 20
    },
    'ciencias': {
      name: 'Ciencias',
      icon: FlaskConical,
      color: 'bg-red-500',
      totalNodes: 135,
      tier1: 33, tier2: 53, tier3: 49
    }
  };

  return (
    <AppLayout>
      <div className="min-h-screen bg-gradient-to-br from-gray-900 via-blue-900 to-gray-900 p-6">
        <ExerciseGeneratorCore
          selectedSubject={selectedSubject}
          subjects={subjects}
          showSettings={showSettings}
          onGenerate={generateExercises}
          isGenerating={isGenerating}
        />
      </div>
    </AppLayout>
  );
};

export default Ejercicios;
