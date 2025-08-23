
import React from 'react';
import { UnifiedButton } from "@/components/ui/unified-button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { motion } from "framer-motion";
import { useProductionNavigation } from "@/hooks/useProductionNavigation";
import { 
  Calculator, 
  Target, 
  Stethoscope,
  Calendar,
  BookOpen,
  PlayCircle,
  FlaskConical,
  Scroll,
  Globe
} from "lucide-react";

export const QuickActions: React.FC = () => {
  const {
    goToLectoguia,
    goToMathematics,
    goToSciences,
    goToHistory,
    goToDiagnostic,
    goToFinancial,
    goToPAESUniverse
  } = useProductionNavigation();

  const quickActions = [
    {
      title: "Diagnóstico PAES",
      description: "Evaluación integral",
      icon: Stethoscope,
      action: goToDiagnostic,
      color: "bg-blue-500 hover:bg-blue-600"
    },
    {
      title: "Competencia Lectora",
      description: "Comprensión textual",
      icon: BookOpen,
      action: goToLectoguia,
      color: "bg-purple-500 hover:bg-purple-600"
    },
    {
      title: "Matemáticas",
      description: "M1 y M2",
      icon: Calculator,
      action: goToMathematics,
      color: "bg-green-500 hover:bg-green-600"
    },
    {
      title: "Ciencias",
      description: "Física, Química, Biología",
      icon: FlaskConical,
      action: goToSciences,
      color: "bg-violet-500 hover:bg-violet-600"
    },
    {
      title: "Historia",
      description: "Ciencias Sociales",
      icon: Scroll,
      action: goToHistory,
      color: "bg-orange-500 hover:bg-orange-600"
    },
    {
      title: "Centro Financiero",
      description: "Planificación financiera",
      icon: Calendar,
      action: goToFinancial,
      color: "bg-cyan-500 hover:bg-cyan-600"
    },
    {
      title: "Universo PAES 3D",
      description: "Experiencia inmersiva",
      icon: Globe,
      action: goToPAESUniverse,
      color: "bg-pink-500 hover:bg-pink-600"
    }
  ];

  return (
    <Card className="bg-black/40 border-white/10 backdrop-blur-sm">
      <CardHeader>
        <CardTitle className="text-white flex items-center gap-2">
          <PlayCircle className="w-5 h-5" />
          Pruebas PAES 2025
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
          {quickActions.map((action, index) => (
            <motion.div
              key={action.title}
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: index * 0.05 }}
            >
              <UnifiedButton
                onClick={action.action}
                className={`w-full h-20 ${action.color} text-white flex flex-col items-center justify-center gap-1`}
                cinematicEffect
              >
                <action.icon className="w-5 h-5" />
                <div className="text-sm font-medium">{action.title}</div>
                <div className="text-xs opacity-80">{action.description}</div>
              </UnifiedButton>
            </motion.div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};
