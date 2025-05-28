
import React, { useState } from 'react';
import { ExerciseGeneratorCore } from '@/components/exercise-generator/ExerciseGeneratorCore';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { motion } from 'framer-motion';
import { Zap, Target, BookOpen, Calculator, FlaskConical, History } from 'lucide-react';
import { useExerciseGeneration } from '@/hooks/exercise/use-exercise-generation';

const ExerciseGeneratorPage: React.FC = () => {
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

  const handleGenerate = (config: any) => {
    console.log('🔥 Generando ejercicios con configuración:', config);
    generateExercises(config);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-900 via-purple-900 to-pink-900 p-6">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="max-w-7xl mx-auto space-y-6"
      >
        {/* Header */}
        <Card className="bg-black/40 backdrop-blur-xl border-white/20">
          <CardHeader className="text-center">
            <div className="flex items-center justify-center gap-4 mb-4">
              <Zap className="w-12 h-12 text-yellow-400" />
              <div>
                <CardTitle className="text-white text-4xl">Generador de Ejercicios</CardTitle>
                <p className="text-cyan-300 text-lg">Creación Inteligente de Contenido PAES</p>
              </div>
            </div>
          </CardHeader>
        </Card>

        {/* Generator Component */}
        <ExerciseGeneratorCore
          selectedSubject={selectedSubject}
          subjects={subjects}
          showSettings={showSettings}
          onGenerate={handleGenerate}
          isGenerating={isGenerating}
        />

        {/* Features Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-8">
          <Card className="bg-black/40 backdrop-blur-xl border-white/20">
            <CardContent className="p-6 text-center">
              <Target className="w-8 h-8 text-cyan-400 mx-auto mb-4" />
              <h3 className="text-white font-bold text-lg mb-2">Adaptativo</h3>
              <p className="text-white/70 text-sm">
                Ejercicios que se adaptan al nivel del estudiante
              </p>
            </CardContent>
          </Card>

          <Card className="bg-black/40 backdrop-blur-xl border-white/20">
            <CardContent className="p-6 text-center">
              <BookOpen className="w-8 h-8 text-green-400 mx-auto mb-4" />
              <h3 className="text-white font-bold text-lg mb-2">Temático</h3>
              <p className="text-white/70 text-sm">
                Contenido alineado con el currículum PAES
              </p>
            </CardContent>
          </Card>

          <Card className="bg-black/40 backdrop-blur-xl border-white/20">
            <CardContent className="p-6 text-center">
              <Zap className="w-8 h-8 text-yellow-400 mx-auto mb-4" />
              <h3 className="text-white font-bold text-lg mb-2">Inteligente</h3>
              <p className="text-white/70 text-sm">
                Generación automática con IA avanzada
              </p>
            </CardContent>
          </Card>
        </div>
      </motion.div>
    </div>
  );
};

export default ExerciseGeneratorPage;
