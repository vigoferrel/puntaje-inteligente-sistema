
import React from 'react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { TPAESPrueba, getPruebaDisplayName } from '@/types/system-types';
import { BookOpen, Calculator, BarChart3, Atom, History, Sparkles } from 'lucide-react';
import { motion } from 'framer-motion';
import { cn } from '@/utils/lectoguia-utils';

interface TestTypeSelectorProps {
  selectedTest: TPAESPrueba;
  onTestSelect: (test: TPAESPrueba) => void;
  className?: string;
}

const TEST_CONFIGS = {
  'COMPETENCIA_LECTORA': {
    icon: BookOpen,
    color: 'bg-blue-500 hover:bg-blue-600',
    borderColor: 'border-blue-200 hover:border-blue-300',
    textColor: 'text-blue-700',
    bgLight: 'bg-blue-50',
    description: 'Comprensión y análisis de textos'
  },
  'MATEMATICA_1': {
    icon: Calculator,
    color: 'bg-green-500 hover:bg-green-600',
    borderColor: 'border-green-200 hover:border-green-300',
    textColor: 'text-green-700',
    bgLight: 'bg-green-50',
    description: 'Matemáticas 7° a 2° medio'
  },
  'MATEMATICA_2': {
    icon: BarChart3,
    color: 'bg-purple-500 hover:bg-purple-600',
    borderColor: 'border-purple-200 hover:border-purple-300',
    textColor: 'text-purple-700',
    bgLight: 'bg-purple-50',
    description: 'Matemáticas 3° y 4° medio'
  },
  'CIENCIAS': {
    icon: Atom,
    color: 'bg-orange-500 hover:bg-orange-600',
    borderColor: 'border-orange-200 hover:border-orange-300',
    textColor: 'text-orange-700',
    bgLight: 'bg-orange-50',
    description: 'Física, química y biología'
  },
  'HISTORIA': {
    icon: History,
    color: 'bg-red-500 hover:bg-red-600',
    borderColor: 'border-red-200 hover:border-red-300',
    textColor: 'text-red-700',
    bgLight: 'bg-red-50',
    description: 'Historia, geografía y cs. sociales'
  }
} as const;

export const TestTypeSelector: React.FC<TestTypeSelectorProps> = ({
  selectedTest,
  onTestSelect,
  className
}) => {
  const containerVariants = {
    hidden: { opacity: 0, y: -20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.5,
        staggerChildren: 0.1
      }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, scale: 0.9 },
    visible: { 
      opacity: 1, 
      scale: 1,
      transition: { duration: 0.3 }
    }
  };

  return (
    <motion.div 
      className={cn("space-y-4", className)}
      variants={containerVariants}
      initial="hidden"
      animate="visible"
    >
      <div className="flex items-center gap-2 mb-4">
        <Sparkles className="h-5 w-5 text-primary" />
        <h3 className="text-lg font-semibold">Selecciona tu prueba PAES</h3>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-3">
        {Object.entries(TEST_CONFIGS).map(([testType, config]) => {
          const isSelected = selectedTest === testType;
          const Icon = config.icon;
          
          return (
            <motion.div key={testType} variants={itemVariants}>
              <Button
                variant={isSelected ? "default" : "outline"}
                className={cn(
                  "h-auto p-4 flex flex-col items-center space-y-2 relative overflow-hidden transition-all duration-300",
                  isSelected 
                    ? `${config.color} text-white shadow-lg scale-105` 
                    : `${config.borderColor} hover:${config.bgLight} ${config.textColor}`,
                  "group"
                )}
                onClick={() => onTestSelect(testType as TPAESPrueba)}
              >
                {/* Efecto de brillo */}
                <div className={cn(
                  "absolute inset-0 opacity-0 group-hover:opacity-20 transition-opacity",
                  "bg-gradient-to-r from-transparent via-white to-transparent -skew-x-12 transform -translate-x-full group-hover:translate-x-full transition-transform duration-1000"
                )} />
                
                <div className={cn(
                  "p-2 rounded-full transition-colors",
                  isSelected ? "bg-white/20" : config.bgLight
                )}>
                  <Icon className={cn(
                    "h-6 w-6 transition-colors",
                    isSelected ? "text-white" : config.textColor
                  )} />
                </div>
                
                <div className="text-center">
                  <div className={cn(
                    "font-medium text-sm leading-tight",
                    isSelected ? "text-white" : config.textColor
                  )}>
                    {getPruebaDisplayName(testType as TPAESPrueba)}
                  </div>
                  <div className={cn(
                    "text-xs opacity-80 mt-1",
                    isSelected ? "text-white/80" : "text-muted-foreground"
                  )}>
                    {config.description}
                  </div>
                </div>
                
                {isSelected && (
                  <motion.div
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    className="absolute top-2 right-2"
                  >
                    <Badge variant="secondary" className="bg-white/20 text-white text-xs">
                      Activa
                    </Badge>
                  </motion.div>
                )}
              </Button>
            </motion.div>
          );
        })}
      </div>
    </motion.div>
  );
};
