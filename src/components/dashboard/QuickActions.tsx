
import React from 'react';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { 
  Brain, 
  Target, 
  TrendingUp, 
  Stethoscope,
  Calendar,
  BookOpen,
  PlayCircle,
  BarChart3
} from "lucide-react";

export const QuickActions: React.FC = () => {
  const navigate = useNavigate();

  const quickActions = [
    {
      title: "Iniciar Diagnóstico",
      description: "Evaluación IA personalizada",
      icon: Stethoscope,
      action: () => navigate('/diagnostico'),
      color: "bg-blue-500 hover:bg-blue-600"
    },
    {
      title: "Plan Inteligente",
      description: "Generar plan de estudio",
      icon: Target,
      action: () => navigate('/plan'),
      color: "bg-green-500 hover:bg-green-600"
    },
    {
      title: "LectoGuía IA",
      description: "Asistente de estudio",
      icon: Brain,
      action: () => navigate('/lectoguia'),
      color: "bg-purple-500 hover:bg-purple-600"
    },
    {
      title: "Evaluación PAES",
      description: "Dashboard y análisis",
      icon: TrendingUp,
      action: () => navigate('/paes-dashboard'),
      color: "bg-orange-500 hover:bg-orange-600"
    }
  ];

  return (
    <Card className="bg-black/40 border-white/10 backdrop-blur-sm">
      <CardHeader>
        <CardTitle className="text-white flex items-center gap-2">
          <PlayCircle className="w-5 h-5" />
          Acciones Rápidas
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          {quickActions.map((action, index) => (
            <motion.div
              key={action.title}
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: index * 0.1 }}
            >
              <Button
                onClick={action.action}
                className={`w-full h-16 ${action.color} text-white flex flex-col items-center justify-center gap-1 hover:scale-105 transition-all duration-300`}
              >
                <action.icon className="w-5 h-5" />
                <div className="text-sm font-medium">{action.title}</div>
                <div className="text-xs opacity-80">{action.description}</div>
              </Button>
            </motion.div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};
