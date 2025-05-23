import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Exercise } from "@/types/ai-types";
import { BookOpen, PenTool, Calculator, Atom, History, Loader2, BarChart3 } from "lucide-react";
import { ExerciseView, ExerciseProgressBar, ExerciseCompletionCard } from "./exercise";
import { ContextualActionButtons } from "./action-buttons/ContextualActionButtons";
import { useContextualActions } from '@/hooks/lectoguia/use-contextual-actions';
import { LectoGuiaBreadcrumb } from './navigation/LectoGuiaBreadcrumb';
import { useLectoGuia } from '@/contexts/LectoGuiaContext';
import { motion } from 'framer-motion';

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
  const { setActiveTab, handleNewExercise } = useLectoGuia();
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
  
  // Determinar el icono según el tipo de prueba o habilidad
  const getSkillIcon = () => {
    if (!exercise) return <BookOpen size={18} />;
    
    // Verificar primero por el tipo de prueba
    if (exercise.prueba) {
      if (exercise.prueba === 'COMPETENCIA_LECTORA') {
        return <BookOpen size={18} />;
      } else if (exercise.prueba === 'MATEMATICA_1') {
        return <Calculator size={18} />;
      } else if (exercise.prueba === 'MATEMATICA_2') {
        return <BarChart3 size={18} />;
      } else if (exercise.prueba === 'CIENCIAS') {
        return <Atom size={18} />;
      } else if (exercise.prueba === 'HISTORIA') {
        return <History size={18} />;
      }
    }
    
    // Fallback al método anterior por si no tiene prueba pero sí skill
    const skillType = exercise.skill?.toString().toUpperCase() || '';
    
    if (skillType.includes('TRACK_LOCATE') || 
        skillType.includes('INTERPRET_RELATE') || 
        skillType.includes('EVALUATE_REFLECT')) {
      return <BookOpen size={18} />;
    } else if (skillType.includes('SOLVE_PROBLEMS') || 
               skillType.includes('REPRESENT') || 
               skillType.includes('MODEL') ||
               skillType.includes('ARGUE_COMMUNICATE')) {
      return <Calculator size={18} />;
    } else if (skillType.includes('IDENTIFY_THEORIES') || 
               skillType.includes('PROCESS_ANALYZE') ||
               skillType.includes('APPLY_PRINCIPLES') ||
               skillType.includes('SCIENTIFIC_ARGUMENT')) {
      return <Atom size={18} />;
    } else if (skillType.includes('TEMPORAL_THINKING') || 
               skillType.includes('SOURCE_ANALYSIS') ||
               skillType.includes('MULTICAUSAL_ANALYSIS') ||
               skillType.includes('CRITICAL_THINKING') ||
               skillType.includes('REFLECTION')) {
      return <History size={18} />;
    } else {
      return <PenTool size={18} />;
    }
  };

  // Determinar el título según el tipo de prueba o habilidad
  const getSkillTitle = () => {
    if (!exercise) return "Ejercicio";
    
    // Verificar primero por el tipo de prueba
    if (exercise.prueba) {
      if (exercise.prueba === 'COMPETENCIA_LECTORA') {
        return "Ejercicio de comprensión lectora";
      } else if (exercise.prueba === 'MATEMATICA_1') {
        return "Ejercicio de matemáticas (7° a 2° medio)";
      } else if (exercise.prueba === 'MATEMATICA_2') {
        return "Ejercicio de matemáticas (3° y 4° medio)";
      } else if (exercise.prueba === 'CIENCIAS') {
        return "Ejercicio de ciencias";
      } else if (exercise.prueba === 'HISTORIA') {
        return "Ejercicio de historia";
      }
    }
    
    // Fallback al método anterior por si no tiene prueba pero sí skill
    const skillType = exercise.skill?.toString().toUpperCase() || '';
    
    if (skillType.includes('TRACK_LOCATE') || 
        skillType.includes('INTERPRET_RELATE') || 
        skillType.includes('EVALUATE_REFLECT')) {
      return "Ejercicio de comprensión lectora";
    } else if (skillType.includes('SOLVE_PROBLEMS') || 
               skillType.includes('REPRESENT') || 
               skillType.includes('MODEL') ||
               skillType.includes('ARGUE_COMMUNICATE')) {
      return "Ejercicio de matemáticas";
    } else if (skillType.includes('IDENTIFY_THEORIES') || 
               skillType.includes('PROCESS_ANALYZE') ||
               skillType.includes('APPLY_PRINCIPLES') ||
               skillType.includes('SCIENTIFIC_ARGUMENT')) {
      return "Ejercicio de ciencias";
    } else if (skillType.includes('TEMPORAL_THINKING') || 
               skillType.includes('SOURCE_ANALYSIS') ||
               skillType.includes('MULTICAUSAL_ANALYSIS') ||
               skillType.includes('CRITICAL_THINKING') ||
               skillType.includes('REFLECTION')) {
      return "Ejercicio de historia";
    } else {
      return "Ejercicio de aprendizaje";
    }
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
    const pruebaNames: Record<string, string> = {
      'COMPETENCIA_LECTORA': 'Comprensión Lectora',
      'MATEMATICA_1': 'Matemáticas Básica',
      'MATEMATICA_2': 'Matemáticas Avanzada',
      'CIENCIAS': 'Ciencias',
      'HISTORIA': 'Historia'
    };
    
    if (pruebaNames[exercise.prueba]) {
      breadcrumbItems.splice(1, 0, {
        label: pruebaNames[exercise.prueba],
        active: false,
        onClick: () => {
          setActiveTab('chat');
        }
      });
    }
  }

  return (
    <Card className="border-border bg-card/50 backdrop-blur-sm">
      {exercise?.nodeId && !showCompletionCard && (
        <CardHeader className="pb-0">
          <div className="flex items-center space-x-2 text-primary">
            {getSkillIcon()}
            <span className="text-sm font-medium">
              {exercise.nodeId ? `${getSkillTitle()} del nodo de aprendizaje` : getSkillTitle()}
            </span>
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
  );
};
