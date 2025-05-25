
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Exercise } from "@/types/ai-types";
import { BookOpen, PenTool, Calculator, Atom, History, Loader2, BarChart3, Sparkles } from "lucide-react";
import { CinematicExerciseView, ExerciseProgressBar, ExerciseCompletionCard } from "./exercise";
import { ContextualActionButtons } from "./action-buttons/ContextualActionButtons";
import { useContextualActions } from '@/hooks/lectoguia/use-contextual-actions';
import { LectoGuiaBreadcrumb } from './navigation/LectoGuiaBreadcrumb';
import { TestSpecificStats } from './test-stats';
import { PAESBadge } from './exercise/PAESBadge';
import { PAESStatsCard } from './exercise/PAESStatsCard';
import { useLectoGuia } from '@/contexts/LectoGuiaContext';
import { motion } from 'framer-motion';
import { Badge } from '@/components/ui/badge';
import { TPAESPrueba, getPruebaDisplayName } from '@/types/system-types';

interface ExerciseTabProps {
  exercise: Exercise | null;
  selectedOption: number | null;
  showFeedback: boolean;
  onOptionSelect: (index: number) => void;
  onContinue: () => void;
  isLoading?: boolean;
  exerciseSource?: 'PAES' | 'AI' | null;
}

export const ExerciseTab: React.FC<ExerciseTabProps> = ({
  exercise,
  selectedOption,
  showFeedback,
  onOptionSelect,
  onContinue,
  isLoading = false,
  exerciseSource = null
}) => {
  const { 
    setActiveTab, 
    handleNewExercise, 
    selectedPrueba, 
    nodes, 
    nodeProgress, 
    skillLevels,
    activeSubject
  } = useLectoGuia();
  const [exerciseProgress, setExerciseProgress] = useState(0);
  const [showCompletionCard, setShowCompletionCard] = useState(false);
  
  // Efectos para simular la barra de progreso
  useEffect(() => {
    if (!exercise || isLoading) {
      setExerciseProgress(0);
      return;
    }
    
    // Incrementar progreso gradualmente hasta que se seleccione una opción
    const interval = setInterval(() => {
      if (!selectedOption && !showFeedback) {
        setExerciseProgress(prev => Math.min(prev + 0.5, 50));
      }
    }, 1000);
    
    return () => clearInterval(interval);
  }, [exercise, selectedOption, showFeedback, isLoading]);
  
  // Cuando se selecciona una opción, aumentar el progreso
  useEffect(() => {
    if (selectedOption !== null && !showFeedback) {
      setExerciseProgress(75);
    }
  }, [selectedOption, showFeedback]);
  
  // Cuando se muestra feedback, completar el progreso
  useEffect(() => {
    if (showFeedback) {
      setExerciseProgress(100);
      
      // Mostrar tarjeta de completado después de un breve delay
      const timer = setTimeout(() => {
        setShowCompletionCard(true);
      }, 2000);
      
      return () => clearTimeout(timer);
    } else {
      setShowCompletionCard(false);
    }
  }, [showFeedback]);
  
  // Usar handleNewExercise del contexto
  const handleExerciseRequest = async (): Promise<boolean> => {
    try {
      await handleNewExercise();
      return true;
    } catch (error) {
      console.error("Error en solicitud de ejercicio:", error);
      return false;
    }
  };
  
  const { handleAction } = useContextualActions(setActiveTab, handleExerciseRequest);
  
  // Manejar continuación después de completar el ejercicio
  const handleExerciseContinue = () => {
    setShowCompletionCard(false);
    onContinue();
  };
  
  // Construir los elementos de migas de pan
  const breadcrumbItems = [
    { 
      label: 'LectoGuía', 
      active: false, 
      onClick: () => setActiveTab('chat') 
    },
    { 
      label: 'Ejercicios', 
      active: true,
      onClick: () => setActiveTab('exercise')
    }
  ];
  
  // Si hay un ejercicio, añadir su tipo como un elemento adicional
  if (exercise?.prueba) {
    breadcrumbItems.splice(1, 0, {
      label: getPruebaDisplayName(exercise.prueba as TPAESPrueba),
      active: false,
      onClick: () => setActiveTab('chat')
    });
  }

  return (
    <div className="space-y-4">
      {/* Estadísticas PAES si está disponible para la materia */}
      {!exercise && !isLoading && activeSubject && (
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <PAESStatsCard activeSubject={activeSubject} />
        </motion.div>
      )}
      
      {/* Estadísticas específicas del tipo de prueba - solo mostrar si no hay ejercicio cargado */}
      {!exercise && !isLoading && selectedPrueba && (
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <TestSpecificStats
            selectedPrueba={selectedPrueba}
            nodes={nodes}
            nodeProgress={nodeProgress}
            skillLevels={skillLevels}
          />
        </motion.div>
      )}
      
      {/* Contenedor principal cinematográfico */}
      <div className="relative">
        {/* Breadcrumbs para navegación contextual */}
        {!showCompletionCard && (
          <div className="mb-4 px-4 py-2 glass-morphism rounded-lg">
            <LectoGuiaBreadcrumb items={breadcrumbItems} />
          </div>
        )}
        
        {/* Vista cinematográfica del ejercicio */}
        <div className="relative overflow-hidden rounded-3xl">
          {isLoading ? (
            <motion.div 
              className="flex flex-col items-center justify-center h-[600px] glass-morphism"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.5 }}
            >
              <Loader2 className="h-12 w-12 animate-spin text-primary mb-6" />
              <div className="text-center space-y-3">
                <h3 className="text-xl font-semibold">Preparando experiencia cinematográfica</h3>
                <p className="text-muted-foreground">
                  Generando ejercicio interactivo...
                </p>
                {selectedPrueba && (
                  <p className="text-xs text-muted-foreground">
                    Configurando para {getPruebaDisplayName(selectedPrueba)}
                  </p>
                )}
              </div>
              
              {/* Efectos de carga cinematográficos */}
              <div className="mt-8 flex gap-2">
                {[...Array(5)].map((_, i) => (
                  <motion.div
                    key={i}
                    className="w-2 h-2 bg-primary rounded-full"
                    animate={{
                      scale: [1, 1.5, 1],
                      opacity: [0.5, 1, 0.5]
                    }}
                    transition={{
                      duration: 1.5,
                      repeat: Infinity,
                      delay: i * 0.2
                    }}
                  />
                ))}
              </div>
            </motion.div>
          ) : showCompletionCard ? (
            <ExerciseCompletionCard 
              score={selectedOption === exercise?.options.findIndex(o => o === exercise.correctAnswer) ? 100 : 0}
              skillName={exercise?.skill?.toString() || 'Comprensión'}
              skillImprovement={5}
              onContinue={handleExerciseContinue}
            />
          ) : (
            <CinematicExerciseView
              exercise={exercise}
              selectedOption={selectedOption}
              showFeedback={showFeedback}
              onOptionSelect={onOptionSelect}
              onContinue={onContinue}
              exerciseSource={exerciseSource}
              progress={exerciseProgress}
            />
          )}
        </div>
        
        {/* Botones de acción contextual */}
        {exercise && !isLoading && !showCompletionCard && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
            className="mt-6 p-4 glass-morphism rounded-2xl"
          >
            <ContextualActionButtons 
              context="exercise"
              skill={exercise.skill as any}
              prueba={exercise.prueba as any}
              onAction={handleAction}
              className="justify-center md:justify-start"
            />
          </motion.div>
        )}
      </div>
    </div>
  );
};

// Función para extraer número de pregunta PAES si existe
const getPAESQuestionNumber = (exercise: Exercise | null): number | undefined => {
  if (!exercise || typeof exercise.id !== 'string' || !exercise.id.startsWith('paes-')) return undefined;
  // El ID es "paes-{id}", donde id es el ID de la pregunta en la base de datos
  // Para mostrar el número real necesitaríamos consultarlo, por ahora retornamos undefined
  return undefined;
};
