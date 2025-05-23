import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Exercise } from "@/types/ai-types";
import { BookOpen, PenTool, Calculator, Atom, History, Loader2, BarChart3, Sparkles } from "lucide-react";
import { ExerciseView, ExerciseProgressBar, ExerciseCompletionCard } from "./exercise";
import { ContextualActionButtons } from "./action-buttons/ContextualActionButtons";
import { useContextualActions } from '@/hooks/lectoguia/use-contextual-actions';
import { LectoGuiaBreadcrumb } from './navigation/LectoGuiaBreadcrumb';
import { TestSpecificStats } from './test-stats';
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
}

export const ExerciseTab: React.FC<ExerciseTabProps> = ({
  exercise,
  selectedOption,
  showFeedback,
  onOptionSelect,
  onContinue,
  isLoading = false
}) => {
  const { 
    setActiveTab, 
    handleNewExercise, 
    selectedPrueba, 
    nodes, 
    nodeProgress, 
    skillLevels 
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
  
  // Determinar el icono según el tipo de prueba
  const getTestIcon = (prueba?: string) => {
    if (!prueba) return <BookOpen size={18} />;
    
    switch (prueba) {
      case 'COMPETENCIA_LECTORA':
        return <BookOpen size={18} className="text-blue-600" />;
      case 'MATEMATICA_1':
        return <Calculator size={18} className="text-green-600" />;
      case 'MATEMATICA_2':
        return <BarChart3 size={18} className="text-purple-600" />;
      case 'CIENCIAS':
        return <Atom size={18} className="text-orange-600" />;
      case 'HISTORIA':
        return <History size={18} className="text-red-600" />;
      default:
        return <PenTool size={18} />;
    }
  };

  // Determinar el título según el tipo de prueba
  const getTestTitle = (prueba?: string) => {
    if (!prueba) return "Ejercicio de aprendizaje";
    return `Ejercicio de ${getPruebaDisplayName(prueba as TPAESPrueba)}`;
  };
  
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
      
      <Card className="border-border bg-card/50 backdrop-blur-sm">
        {exercise?.nodeId && !showCompletionCard && (
          <CardHeader className="pb-0">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                {getTestIcon(exercise.prueba)}
                <span className="text-sm font-medium">
                  {getTestTitle(exercise.prueba)}
                </span>
                {exercise.nodeId && (
                  <Badge variant="outline" className="text-xs">
                    Nodo específico
                  </Badge>
                )}
              </div>
              <div className="flex items-center gap-2">
                <Sparkles className="h-4 w-4 text-primary" />
                <span className="text-xs text-muted-foreground">
                  {selectedPrueba ? getPruebaDisplayName(selectedPrueba) : 'Ejercicio personalizado'}
                </span>
              </div>
            </div>
          </CardHeader>
        )}
        
        {/* Breadcrumbs para navegación contextual */}
        <div className="px-4 py-2 bg-muted/20">
          <LectoGuiaBreadcrumb items={breadcrumbItems} />
        </div>
        
        <CardContent className={`p-6 ${exercise?.nodeId ? 'pt-4' : 'pt-6'}`}>
          {/* Barra de progreso */}
          {exercise && !isLoading && !showCompletionCard && (
            <ExerciseProgressBar 
              progress={exerciseProgress} 
              difficulty={exercise.difficulty || 'INTERMEDIO'} 
            />
          )}
          
          <div className="h-[calc(100vh-350px)] min-h-[450px] overflow-auto custom-scrollbar">
            {isLoading ? (
              <motion.div 
                className="flex flex-col items-center justify-center h-full"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.5 }}
              >
                <Loader2 className="h-8 w-8 animate-spin text-primary mb-4" />
                <p className="text-muted-foreground">Generando ejercicio...</p>
                {selectedPrueba && (
                  <p className="text-xs text-muted-foreground mt-2">
                    Preparando contenido para {getPruebaDisplayName(selectedPrueba)}
                  </p>
                )}
              </motion.div>
            ) : showCompletionCard ? (
              <ExerciseCompletionCard 
                score={selectedOption === exercise?.options.findIndex(o => o === exercise.correctAnswer) ? 100 : 0}
                skillName={exercise?.skill?.toString() || 'Comprensión'}
                skillImprovement={5}
                onContinue={handleExerciseContinue}
              />
            ) : (
              <ExerciseView
                exercise={exercise}
                selectedOption={selectedOption}
                showFeedback={showFeedback}
                onOptionSelect={onOptionSelect}
                onContinue={onContinue}
              />
            )}
          </div>
          
          {/* Botones de acción contextual */}
          {exercise && !isLoading && !showCompletionCard && (
            <div className="border-t border-border mt-4 pt-4">
              <ContextualActionButtons 
                context="exercise"
                skill={exercise.skill as any}
                prueba={exercise.prueba as any}
                onAction={handleAction}
                className="justify-center md:justify-start"
              />
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};
