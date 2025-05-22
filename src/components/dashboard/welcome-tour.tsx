
import React, { useState, useEffect } from 'react';
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import {
  ArrowRight,
  BookOpen,
  Brain,
  CheckCircle,
  HelpCircle,
  X
} from "lucide-react";
import { toast } from "@/hooks/use-toast";
import { motion, AnimatePresence } from "framer-motion";

interface WelcomeTourProps {
  userName?: string;
  onComplete: () => void;
}

export const WelcomeTour = ({ userName, onComplete }: WelcomeTourProps) => {
  const [currentStep, setCurrentStep] = useState(0);
  const [visible, setVisible] = useState(true);

  const tourSteps = [
    {
      title: `¡Bienvenido a PAES PRO${userName ? ', ' + userName : ''}!`,
      description: "Te guiaremos a través de las principales características de la plataforma.",
      icon: <HelpCircle className="h-8 w-8 text-primary" />
    },
    {
      title: "Dashboard Personalizado",
      description: "Aquí podrás ver tu progreso, estadísticas y acceder rápidamente a todas las funcionalidades.",
      icon: <CheckCircle className="h-8 w-8 text-stp-success" />
    },
    {
      title: "Diagnóstico",
      description: "Realiza un diagnóstico para evaluar tus conocimientos y recibir un plan personalizado.",
      icon: <BookOpen className="h-8 w-8 text-stp-info" />
    },
    {
      title: "LectoGuía AI",
      description: "Utiliza nuestra IA para practicar comprensión lectora con ejercicios personalizados.",
      icon: <Brain className="h-8 w-8 text-violet-500" />
    }
  ];

  useEffect(() => {
    // Check if user has completed tour before
    const tourCompleted = localStorage.getItem('welcomeTourCompleted');
    if (tourCompleted === 'true') {
      setVisible(false);
    }
  }, []);

  const handleNext = () => {
    if (currentStep < tourSteps.length - 1) {
      setCurrentStep(currentStep + 1);
    } else {
      handleComplete();
    }
  };

  const handleComplete = () => {
    localStorage.setItem('welcomeTourCompleted', 'true');
    setVisible(false);
    onComplete();
    toast({
      title: "¡Tour completado!",
      description: "Ya puedes comenzar a utilizar todas las funcionalidades de PAES PRO.",
    });
  };

  const handleSkip = () => {
    localStorage.setItem('welcomeTourCompleted', 'true');
    setVisible(false);
    onComplete();
  };

  if (!visible) return null;

  return (
    <AnimatePresence>
      {visible && (
        <motion.div 
          className="fixed bottom-6 right-6 z-50 max-w-md"
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 50 }}
        >
          <Card className="shadow-lg border-2 border-primary/20">
            <CardContent className="p-6">
              <div className="flex justify-between items-center mb-4">
                <div className="flex items-center gap-3">
                  {tourSteps[currentStep].icon}
                  <h3 className="text-lg font-semibold">{tourSteps[currentStep].title}</h3>
                </div>
                <Button variant="ghost" size="icon" onClick={handleSkip} className="h-7 w-7">
                  <X className="h-4 w-4" />
                </Button>
              </div>
              
              <p className="text-muted-foreground mb-6">{tourSteps[currentStep].description}</p>
              
              <div className="flex items-center justify-between">
                <div className="flex gap-1">
                  {tourSteps.map((_, index) => (
                    <span 
                      key={index} 
                      className={`block w-2 h-2 rounded-full ${
                        index === currentStep ? 'bg-primary' : 'bg-gray-300 dark:bg-gray-600'
                      }`} 
                    />
                  ))}
                </div>
                
                <div className="flex gap-2">
                  <Button variant="outline" size="sm" onClick={handleSkip}>
                    Omitir
                  </Button>
                  <Button 
                    className="flex items-center gap-1" 
                    size="sm" 
                    onClick={handleNext}
                  >
                    {currentStep < tourSteps.length - 1 ? 'Siguiente' : 'Finalizar'}
                    <ArrowRight className="h-3 w-3" />
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      )}
    </AnimatePresence>
  );
};
