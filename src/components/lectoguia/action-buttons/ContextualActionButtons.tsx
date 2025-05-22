
import React from 'react';
import { Button } from "@/components/ui/button";
import { BookOpen, Calculator, BookCheck, BrainCircuit, BarChart3, History, Atom } from "lucide-react";
import { TPAESPrueba, TPAESHabilidad } from "@/types/system-types";
import { Badge } from "@/components/ui/badge";
import { motion } from "framer-motion";

// Tipos de acciones disponibles
export type ActionType = 'practice' | 'explain' | 'progress' | 'example' | 'related';

interface ContextualActionButtonsProps {
  context: 'chat' | 'exercise' | 'progress';
  subject?: string;
  skill?: TPAESHabilidad;
  prueba?: TPAESPrueba;
  onAction: (action: ActionType, params?: Record<string, any>) => void;
  className?: string;
}

// Variantes de animación
const containerVariants = {
  hidden: { opacity: 0 },
  visible: { 
    opacity: 1,
    transition: { 
      staggerChildren: 0.1
    }
  }
};

const itemVariants = {
  hidden: { y: 10, opacity: 0 },
  visible: { y: 0, opacity: 1 }
};

export const ContextualActionButtons: React.FC<ContextualActionButtonsProps> = ({
  context,
  subject,
  skill,
  prueba,
  onAction,
  className
}) => {
  
  // Función para obtener el icono según la materia o prueba
  const getSubjectIcon = () => {
    if (subject === 'matematicas-basica' || subject === 'matematicas-avanzada') {
      return Calculator;
    } else if (subject === 'ciencias') {
      return Atom;
    } else if (subject === 'historia') {
      return History;
    } else {
      return BookOpen; // Para lectura y general
    }
  };

  const SubjectIcon = getSubjectIcon();

  // Renderiza botones específicos según el contexto
  const renderContextButtons = () => {
    switch (context) {
      case 'chat':
        return (
          <>
            <motion.div variants={itemVariants}>
              <Button 
                size="sm" 
                variant="outline" 
                className="flex gap-2"
                onClick={() => onAction('practice')}
              >
                <BookCheck size={16} />
                <span>Practicar {subject && getSubjectName(subject)}</span>
              </Button>
            </motion.div>
            <motion.div variants={itemVariants}>
              <Button 
                size="sm" 
                variant="outline" 
                className="flex gap-2"
                onClick={() => onAction('example')}
              >
                <SubjectIcon size={16} />
                <span>Ver ejemplo</span>
              </Button>
            </motion.div>
            <motion.div variants={itemVariants}>
              <Button 
                size="sm" 
                variant="outline" 
                className="flex gap-2"
                onClick={() => onAction('progress')}
              >
                <BrainCircuit size={16} />
                <span>Ver mi progreso</span>
              </Button>
            </motion.div>
          </>
        );
        
      case 'exercise':
        return (
          <>
            <motion.div variants={itemVariants}>
              <Button 
                size="sm" 
                variant="outline" 
                className="flex gap-2"
                onClick={() => onAction('explain')}
              >
                <BookOpen size={16} />
                <span>Explicar concepto</span>
              </Button>
            </motion.div>
            <motion.div variants={itemVariants}>
              <Button 
                size="sm" 
                variant="outline" 
                className="flex gap-2"
                onClick={() => onAction('related')}
              >
                <BarChart3 size={16} />
                <span>Ejercicios relacionados</span>
              </Button>
            </motion.div>
          </>
        );
        
      case 'progress':
        return (
          <>
            <motion.div variants={itemVariants}>
              <Button 
                size="sm" 
                variant="outline" 
                className="flex gap-2"
                onClick={() => onAction('practice')}
              >
                <BookCheck size={16} />
                <span>Practicar habilidad</span>
              </Button>
            </motion.div>
            <motion.div variants={itemVariants}>
              <Button 
                size="sm" 
                variant="outline" 
                className="flex gap-2"
                onClick={() => onAction('explain')}
              >
                <BookOpen size={16} />
                <span>Ver teoría</span>
              </Button>
            </motion.div>
          </>
        );
        
      default:
        return null;
    }
  };
  
  // Si no hay suficiente contexto, no mostramos nada
  if (!context) return null;
  
  return (
    <motion.div 
      className={`flex flex-wrap gap-2 ${className || ''}`}
      variants={containerVariants}
      initial="hidden"
      animate="visible"
    >
      {renderContextButtons()}
      
      {skill && (
        <motion.div variants={itemVariants}>
          <Badge variant="outline" className="bg-secondary/20">
            {getSkillName(skill)}
          </Badge>
        </motion.div>
      )}
    </motion.div>
  );
};

// Funciones de utilidad para mostrar nombres amigables
const getSubjectName = (subject: string): string => {
  const subjects: Record<string, string> = {
    'general': 'general',
    'lectura': 'comprensión lectora',
    'matematicas-basica': 'matemáticas básica',
    'matematicas-avanzada': 'matemáticas avanzada',
    'ciencias': 'ciencias',
    'historia': 'historia'
  };
  
  return subjects[subject] || 'esta materia';
};

const getSkillName = (skill: TPAESHabilidad): string => {
  const skills: Record<string, string> = {
    'TRACK_LOCATE': 'Localización textual',
    'INTERPRET_RELATE': 'Interpretación',
    'EVALUATE_REFLECT': 'Evaluación',
    'SOLVE_PROBLEMS': 'Resolución de problemas',
    'REPRESENT': 'Representación',
    'MODEL': 'Modelamiento',
    'ARGUE_COMMUNICATE': 'Argumentación',
    'IDENTIFY_THEORIES': 'Identificación científica',
    'PROCESS_ANALYZE': 'Análisis científico',
    'APPLY_PRINCIPLES': 'Aplicación científica',
    'SCIENTIFIC_ARGUMENT': 'Argumentación científica',
    'TEMPORAL_THINKING': 'Pensamiento temporal',
    'SOURCE_ANALYSIS': 'Análisis de fuentes',
    'MULTICAUSAL_ANALYSIS': 'Análisis multicausal',
    'CRITICAL_THINKING': 'Pensamiento crítico',
    'REFLECTION': 'Reflexión'
  };
  
  return skills[skill] || skill;
};
