
import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { AppLayout } from '@/components/app-layout';
import { AppInitializer } from '@/components/AppInitializer';
import { ExerciseGeneratorCore } from '@/components/exercise-generator/ExerciseGeneratorCore';
import { ExerciseResults } from '@/components/exercise-generator/ExerciseResults';
import { SubjectSelector } from '@/components/exercise-generator/SubjectSelector';
import { useExerciseGeneration } from '@/hooks/exercise/use-exercise-generation';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { BookOpen, Calculator, History, FlaskConical, Brain, Settings, ArrowLeft } from 'lucide-react';
import { motion } from 'framer-motion';

const PAESExerciseGenerator = () => {
  const { subject: urlSubject } = useParams();
  const navigate = useNavigate();
  const [selectedSubject, setSelectedSubject] = useState(urlSubject || 'competencia-lectora');
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

  useEffect(() => {
    if (urlSubject && subjects[urlSubject]) {
      setSelectedSubject(urlSubject);
    }
  }, [urlSubject]);

  const handleSubjectChange = (newSubject: string) => {
    setSelectedSubject(newSubject);
    navigate(`/ejercicios/${newSubject}`, { replace: true });
    clearResults();
  };

  const SubjectIcon = subjects[selectedSubject]?.icon || Brain;

  return (
    <AppInitializer>
      <AppLayout>
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="space-y-6"
        >
          {/* Header */}
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => navigate('/')}
                className="flex items-center gap-2"
              >
                <ArrowLeft className="h-4 w-4" />
                Volver al Dashboard
              </Button>
              
              <div className="flex items-center space-x-3">
                <div className={`p-3 rounded-lg ${subjects[selectedSubject]?.color} text-white`}>
                  <SubjectIcon className="w-6 h-6" />
                </div>
                <div>
                  <h1 className="text-3xl font-bold">Generador de Ejercicios PAES</h1>
                  <p className="text-muted-foreground">
                    Sistema integrado basado en 277 nodos de aprendizaje
                  </p>
                </div>
              </div>
            </div>
            
            <Button
              variant="outline"
              size="sm"
              onClick={() => setShowSettings(!showSettings)}
            >
              <Settings className="w-4 h-4 mr-2" />
              Configuración
            </Button>
          </div>

          {/* Subject Selector */}
          <SubjectSelector
            subjects={subjects}
            selectedSubject={selectedSubject}
            onSubjectChange={handleSubjectChange}
          />

          {/* Main Content */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Exercise Generator */}
            <div className="lg:col-span-1">
              <ExerciseGeneratorCore
                selectedSubject={selectedSubject}
                subjects={subjects}
                showSettings={showSettings}
                onGenerate={generateExercises}
                isGenerating={isGenerating}
              />
            </div>

            {/* Results */}
            <div className="lg:col-span-2">
              <ExerciseResults
                exercises={exerciseResults}
                isGenerating={isGenerating}
                selectedSubject={selectedSubject}
                onClear={clearResults}
              />
            </div>
          </div>

          {/* Stats Panel */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Brain className="h-5 w-5" />
                Sistema PAES - 277 Nodos de Aprendizaje
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
                {Object.entries(subjects).map(([key, subject]) => {
                  const Icon = subject.icon;
                  return (
                    <div key={key} className="text-center p-4 rounded-lg bg-muted/50">
                      <div className={`inline-flex p-3 rounded-lg ${subject.color} text-white mb-2`}>
                        <Icon className="h-6 w-6" />
                      </div>
                      <h3 className="font-semibold text-sm">{subject.name}</h3>
                      <p className="text-2xl font-bold text-primary">{subject.totalNodes}</p>
                      <p className="text-xs text-muted-foreground">nodos</p>
                      <div className="flex justify-center gap-1 mt-2 text-xs">
                        <span className="bg-red-100 text-red-800 px-1 rounded">T1:{subject.tier1}</span>
                        <span className="bg-yellow-100 text-yellow-800 px-1 rounded">T2:{subject.tier2}</span>
                        <span className="bg-green-100 text-green-800 px-1 rounded">T3:{subject.tier3}</span>
                      </div>
                    </div>
                  );
                })}
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </AppLayout>
    </AppInitializer>
  );
};

export default PAESExerciseGenerator;
