/* eslint-disable react-refresh/only-export-components */

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Card, CardContent } from '../../components/ui/card';
import { Button } from '../../components/ui/button';
import { Progress } from '../../components/ui/progress';
import { 
  ArrowRight, 
  ArrowLeft, 
  X, 
  Target,
  CheckCircle,
  Info
} from 'lucide-react';

interface TourStep {
  id: string;
  title: string;
  description: string;
  target: string;
  position: 'top' | 'bottom' | 'left' | 'right';
  action?: string;
  highlight?: boolean;
}

interface TourGuideProps {
  tourType: 'complete' | 'lectoguia' | 'diagnostic' | 'planning';
  isActive: boolean;
  onComplete: () => void;
  onSkip: () => void;
}

const tourSteps = {
  complete: [
    {
      id: 'welcome',
      title: 'Â¡Bienvenido a SuperPAES!',
      description: 'Tu plataforma integral de preparaciÃ³n para PAES con IA avanzada.',
      target: 'body',
      position: 'top' as const,
      highlight: true
    },
    {
      id: 'dashboard',
      title: 'Dashboard Principal',
      description: 'AquÃ­ puedes ver tu progreso, mÃ©tricas y acceder a todas las funcionalidades.',
      target: '.dashboard-main',
      position: 'right' as const
    },
    {
      id: 'lectoguia',
      title: 'LectoGuÃ­a IA',
      description: 'Asistente inteligente para comprensiÃ³n lectora y anÃ¡lisis de textos.',
      target: '[data-tour="lectoguia"]',
      position: 'bottom' as const,
      action: 'highlight'
    },
    {
      id: 'diagnostic',
      title: 'Sistema de DiagnÃ³stico',
      description: 'EvaluaciÃ³n inteligente que se adapta a tu nivel de conocimiento.',
      target: '[data-tour="diagnostic"]',
      position: 'bottom' as const,
      action: 'highlight'
    },
    {
      id: 'planning',
      title: 'Planificador Adaptativo',
      description: 'Crea planes de estudio personalizados basados en tus resultados.',
      target: '[data-tour="planning"]',
      position: 'bottom' as const,
      action: 'highlight'
    },
    {
      id: 'assistant',
      title: 'Asistente Virtual',
      description: 'Siempre disponible para guiarte y responder tus preguntas.',
      target: '.virtual-assistant',
      position: 'right' as const
    }
  ],
  lectoguia: [
    {
      id: 'lectoguia-intro',
      title: 'LectoGuÃ­a IA',
      description: 'Tu asistente personal de comprensiÃ³n lectora.',
      target: '.lectoguia-main',
      position: 'top' as const
    },
    {
      id: 'upload-text',
      title: 'Subir Contenido',
      description: 'Puedes subir textos o imÃ¡genes para anÃ¡lisis instantÃ¡neo.',
      target: '[data-tour="upload"]',
      position: 'bottom' as const
    },
    {
      id: 'chat-interface',
      title: 'Chat Inteligente',
      description: 'Conversa con la IA sobre cualquier texto o concepto.',
      target: '[data-tour="chat"]',
      position: 'left' as const
    }
  ],
  diagnostic: [
    {
      id: 'diagnostic-intro',
      title: 'Sistema de DiagnÃ³stico',
      description: 'EvaluaciÃ³n adaptativa que se ajusta a tu rendimiento.',
      target: '.diagnostic-main',
      position: 'top' as const
    },
    {
      id: 'test-selection',
      title: 'SelecciÃ³n de Pruebas',
      description: 'Elige quÃ© Ã¡reas PAES quieres evaluar.',
      target: '[data-tour="test-selection"]',
      position: 'right' as const
    },
    {
      id: 'results-analysis',
      title: 'AnÃ¡lisis de Resultados',
      description: 'ObtÃ©n insights detallados sobre tu rendimiento.',
      target: '[data-tour="results"]',
      position: 'left' as const
    }
  ],
  planning: [
    {
      id: 'planning-intro',
      title: 'Planificador Inteligente',
      description: 'Crea tu plan de estudio personalizado.',
      target: '.planning-main',
      position: 'top' as const
    },
    {
      id: 'goal-setting',
      title: 'Configurar Objetivos',
      description: 'Define tus metas PAES y fechas objetivo.',
      target: '[data-tour="goals"]',
      position: 'bottom' as const
    },
    {
      id: 'schedule-generation',
      title: 'GeneraciÃ³n de Horarios',
      description: 'El sistema crea horarios optimizados para tu aprendizaje.',
      target: '[data-tour="schedule"]',
      position: 'left' as const
    }
  ]
};

export const TourGuide: React.FC<TourGuideProps> = ({
  tourType,
  isActive,
  onComplete,
  onSkip
}) => {
  const [currentStepIndex, setCurrentStepIndex] = useState(0);
  const [highlightedElement, setHighlightedElement] = useState<string | null>(null);

  const steps = tourSteps[tourType] || [];
  const currentStep = steps[currentStepIndex];
  const progress = ((currentStepIndex + 1) / steps.length) * 100;

  useEffect(() => {
    if (!isActive) return;

    // ðŸ”¬ SABUESO CONTEXT7: Prevenir overlay automÃ¡tico que causa pantalla gris
    console.log('ðŸ”¬ TourGuide: Overlay desactivado para prevenir pantalla gris');
    
    // NO crear overlay automÃ¡ticamente - causa pantalla gris
    // Solo crear overlay si es explÃ­citamente solicitado por el usuario
    const userRequested = sessionStorage.getItem('tour-user-requested') === 'true';
    
    if (!userRequested) {
      console.log('ðŸ›¡ï¸ TourGuide: Overlay bloqueado - no solicitado por usuario');
      return;
    }

    // Solo si el usuario lo solicitÃ³ explÃ­citamente
    document.body.style.overflow = 'hidden';
    const overlay = document.createElement('div');
    overlay.id = 'tour-overlay';
    overlay.className = 'fixed inset-0 bg-black/50 z-40';
    document.body.appendChild(overlay);

    return () => {
      document.body.style.overflow = '';
      const existingOverlay = document.getElementById('tour-overlay');
      if (existingOverlay) {
        existingOverlay.remove();
      }
      sessionStorage.removeItem('tour-user-requested');
    };
  }, [isActive]);

  useEffect(() => {
    if (!currentStep) return;

    // Highlight element
    const targetElement = document.querySelector(currentStep.target);
    if (targetElement) {
      targetElement.scrollIntoView({ behavior: 'smooth', block: 'center' });
      setHighlightedElement(currentStep.target);
      
      // Add highlight class
      targetElement.classList.add('tour-highlight');
      
      return () => {
        targetElement.classList.remove('tour-highlight');
      };
    }
  }, [currentStep]);

  const handleNext = () => {
    if (currentStepIndex < steps.length - 1) {
      setCurrentStepIndex(prev => prev + 1);
    } else {
      handleComplete();
    }
  };

  const handlePrevious = () => {
    if (currentStepIndex > 0) {
      setCurrentStepIndex(prev => prev - 1);
    }
  };

  const handleComplete = () => {
    setHighlightedElement(null);
    onComplete();
  };

  if (!isActive || !currentStep) return null;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.8 }}
        className="fixed top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 z-50 w-full max-w-md px-4"
      >
        <Card className="bg-black/90 backdrop-blur-xl border-white/20 shadow-2xl">
          <CardContent className="p-6">
            {/* Header */}
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                <Target className="w-5 h-5 text-cyan-400" />
                <span className="text-white font-medium text-sm">
                  Paso {currentStepIndex + 1} de {steps.length}
                </span>
              </div>
              <Button
                variant="ghost"
                size="sm"
                onClick={onSkip}
                className="h-6 w-6 p-0 text-white/60 hover:text-white"
              >
                <X className="w-4 h-4" />
              </Button>
            </div>

            {/* Progress */}
            <Progress value={progress} className="mb-4 h-2" />

            {/* Content */}
            <div className="space-y-4">
              <div>
                <h3 className="text-white font-bold text-lg mb-2">
                  {currentStep.title}
                </h3>
                <p className="text-white/80 text-sm leading-relaxed">
                  {currentStep.description}
                </p>
              </div>

              {/* Navigation */}
              <div className="flex items-center justify-between pt-2">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={handlePrevious}
                  disabled={currentStepIndex === 0}
                  className="text-white/60 hover:text-white disabled:opacity-30"
                >
                  <ArrowLeft className="w-4 h-4 mr-1" />
                  Anterior
                </Button>

                <Button
                  onClick={handleNext}
                  className="bg-gradient-to-r from-cyan-500 to-blue-500 hover:from-cyan-600 hover:to-blue-600"
                >
                  {currentStepIndex === steps.length - 1 ? (
                    <>
                      Finalizar
                      <CheckCircle className="w-4 h-4 ml-1" />
                    </>
                  ) : (
                    <>
                      Siguiente
                      <ArrowRight className="w-4 h-4 ml-1" />
                    </>
                  )}
                </Button>
              </div>

              {/* Additional info */}
              <div className="flex items-center gap-2 text-white/60 text-xs pt-2 border-t border-white/10">
                <Info className="w-3 h-3" />
                <span>Puedes saltar este tour en cualquier momento</span>
              </div>
            </div>
          </CardContent>
        </Card>
      </motion.div>

      {/* Custom CSS for highlighting */}
      <style>{`
        .tour-highlight {
          position: relative;
          z-index: 45;
          box-shadow: 0 0 0 4px rgba(6, 182, 212, 0.5), 0 0 20px rgba(6, 182, 212, 0.3);
          border-radius: 8px;
          animation: tour-pulse 2s infinite;
        }

        @keyframes tour-pulse {
          0%, 100% { 
            box-shadow: 0 0 0 4px rgba(6, 182, 212, 0.5), 0 0 20px rgba(6, 182, 212, 0.3);
          }
          50% { 
            box-shadow: 0 0 0 8px rgba(6, 182, 212, 0.3), 0 0 30px rgba(6, 182, 212, 0.5);
          }
        }
      `}</style>
    </AnimatePresence>
  );
};

