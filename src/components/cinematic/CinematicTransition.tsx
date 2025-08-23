
import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Loader2, ArrowRight, Target, Calculator, BookOpen, BarChart3, FlaskConical, Scroll } from 'lucide-react';

interface CinematicTransitionProps {
  isActive: boolean;
  currentFlow: string;
  targetFlow?: string;
  progress?: number;
  context?: string;
}

export const CinematicTransition: React.FC<CinematicTransitionProps> = ({
  isActive,
  currentFlow,
  targetFlow,
  progress = 0,
  context
}) => {
  const flowIcons = {
    evaluation: Target,
    competencia: BookOpen,
    mathematics: Calculator,
    sciences: FlaskConical,
    history: Scroll,
    dashboard: BarChart3,
    plan: BarChart3,
    diagnostic: Target
  };

  const CurrentIcon = flowIcons[currentFlow as keyof typeof flowIcons] || BarChart3;
  const TargetIcon = targetFlow ? flowIcons[targetFlow as keyof typeof flowIcons] : CurrentIcon;

  if (!isActive) return null;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 z-50 bg-gradient-to-br from-purple-900/95 via-blue-900/95 to-indigo-900/95 backdrop-blur-sm flex items-center justify-center"
      >
        <div className="text-center space-y-8">
          {/* Iconos de transición */}
          <div className="flex items-center justify-center space-x-8">
            <motion.div
              initial={{ scale: 1, opacity: 1 }}
              animate={{ scale: 0.8, opacity: 0.6 }}
              className="p-4 bg-white/10 rounded-full"
            >
              <CurrentIcon className="w-8 h-8 text-white" />
            </motion.div>
            
            <motion.div
              animate={{ x: [0, 10, 0], opacity: [0.5, 1, 0.5] }}
              transition={{ duration: 1.5, repeat: Infinity }}
            >
              <ArrowRight className="w-6 h-6 text-white" />
            </motion.div>
            
            {targetFlow && (
              <motion.div
                initial={{ scale: 0.8, opacity: 0.6 }}
                animate={{ scale: 1, opacity: 1 }}
                className="p-4 bg-white/20 rounded-full"
              >
                <TargetIcon className="w-8 h-8 text-white" />
              </motion.div>
            )}
          </div>

          {/* Mensaje de transición */}
          <div className="space-y-2">
            <motion.h3
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              className="text-2xl font-bold text-white"
            >
              {targetFlow ? `Navegando a ${getFlowDisplayName(targetFlow)}` : 'Cargando PAES...'}
            </motion.h3>
            
            {context && (
              <motion.p
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.2 }}
                className="text-white/80"
              >
                {getContextDisplayName(context)}
              </motion.p>
            )}
          </div>

          {/* Indicador de progreso cinematográfico */}
          <div className="w-64 mx-auto">
            <div className="relative h-2 bg-white/20 rounded-full overflow-hidden">
              <motion.div
                initial={{ width: 0 }}
                animate={{ width: `${Math.min(100, Math.max(0, progress))}%` }}
                transition={{ duration: 0.5, ease: "easeOut" }}
                className="absolute top-0 left-0 h-full bg-gradient-to-r from-purple-400 to-blue-400 rounded-full"
              />
              
              {/* Efecto de brillo */}
              <motion.div
                animate={{ x: [-20, 284] }}
                transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
                className="absolute top-0 left-0 h-full w-5 bg-white/30 rounded-full blur-sm"
              />
            </div>
          </div>

          {/* Spinner mejorado */}
          <motion.div
            animate={{ rotate: 360 }}
            transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
          >
            <Loader2 className="w-8 h-8 text-white/60 mx-auto" />
          </motion.div>
        </div>
      </motion.div>
    </AnimatePresence>
  );
};

function getFlowDisplayName(flow: string): string {
  const names = {
    evaluation: 'Evaluación',
    competencia: 'Competencia Lectora',
    mathematics: 'Matemáticas',
    sciences: 'Ciencias',
    history: 'Historia',
    dashboard: 'Panel Principal',
    plan: 'Plan de Estudio',
    diagnostic: 'Diagnóstico'
  };
  
  return names[flow as keyof typeof names] || flow;
}

function getContextDisplayName(context: string): string {
  if (context.includes(':')) {
    const [type, detail] = context.split(':');
    const contextNames = {
      evaluation: `Preparando evaluación de ${detail}`,
      competencia: `Cargando contenido de ${detail}`,
      mathematics: `Preparando ejercicios de ${detail}`,
      sciences: `Iniciando laboratorio de ${detail}`,
      history: `Cargando análisis de ${detail}`,
      dashboard: `Actualizando métricas de ${detail}`,
      diagnostic: `Configurando diagnóstico ${detail}`
    };
    
    return contextNames[type as keyof typeof contextNames] || context;
  }
  
  return context;
}
