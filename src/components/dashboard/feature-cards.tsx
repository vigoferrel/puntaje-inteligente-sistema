
import React from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { MessageCircleQuestion, BookOpen, BarChart3, Sparkles, ArrowRight, Calendar } from "lucide-react";
import { motion } from "framer-motion";

export const FeatureCards = () => {
  const container = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
        delayChildren: 0.3
      }
    }
  };
  
  const item = {
    hidden: { opacity: 0, y: 20 },
    show: { opacity: 1, y: 0 }
  };

  return (
    <motion.div 
      className="grid gap-6 md:grid-cols-3 mb-8"
      variants={container}
      initial="hidden"
      animate="show"
    >
      <motion.div variants={item} className="w-full">
        <Card className="bg-gradient-to-br from-violet-500/10 to-purple-500/10 border-purple-200 shadow transition-shadow duration-300 hover:shadow-md h-full">
          <CardHeader className="pb-2">
            <CardTitle className="flex items-center gap-2 text-lg">
              <Sparkles className="h-5 w-5 text-violet-500" />
              LectoGuía AI
            </CardTitle>
            <CardDescription>
              Asistente inteligente de comprensión lectora
            </CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-sm mb-4">
              Entrenamiento personalizado con IA para mejorar tus habilidades de comprensión lectora. Genera ejercicios adaptados a tu nivel.
            </p>
            <Button asChild className="w-full bg-violet-500 hover:bg-violet-600 group">
              <Link to="/lectoguia" className="flex items-center justify-center gap-2">
                Practicar con IA 
                <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
              </Link>
            </Button>
          </CardContent>
        </Card>
      </motion.div>
      
      <motion.div variants={item} className="w-full">
        <Card className="bg-gradient-to-br from-blue-500/10 to-cyan-500/10 border-blue-200 shadow transition-shadow duration-300 hover:shadow-md h-full">
          <CardHeader className="pb-2">
            <CardTitle className="flex items-center gap-2 text-lg">
              <BarChart3 className="h-5 w-5 text-blue-500" />
              Diagnóstico
            </CardTitle>
            <CardDescription>
              Evalúa tus conocimientos actuales
            </CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-sm mb-4">
              Realiza un test diagnóstico para identificar tus fortalezas y áreas de mejora en las diferentes pruebas de la PAES.
            </p>
            <Button asChild className="w-full bg-blue-500 hover:bg-blue-600 group">
              <Link to="/diagnostico" className="flex items-center justify-center gap-2">
                Iniciar Diagnóstico 
                <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
              </Link>
            </Button>
          </CardContent>
        </Card>
      </motion.div>
      
      <motion.div variants={item} className="w-full">
        <Card className="bg-gradient-to-br from-green-500/10 to-emerald-500/10 border-emerald-200 shadow transition-shadow duration-300 hover:shadow-md h-full">
          <CardHeader className="pb-2">
            <CardTitle className="flex items-center gap-2 text-lg">
              <Calendar className="h-5 w-5 text-emerald-500" />
              Calendario de Estudio
            </CardTitle>
            <CardDescription>
              Organiza tu preparación para la PAES
            </CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-sm mb-4">
              Visualiza y organiza tu plan de estudio con un calendario interactivo que te ayudará a optimizar tu tiempo de preparación.
            </p>
            <Button asChild className="w-full bg-emerald-500 hover:bg-emerald-600 group">
              <Link to="/calendario" className="flex items-center justify-center gap-2">
                Ver Calendario 
                <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
              </Link>
            </Button>
          </CardContent>
        </Card>
      </motion.div>
    </motion.div>
  );
};
