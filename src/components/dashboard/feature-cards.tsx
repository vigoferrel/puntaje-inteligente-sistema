
import React from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { Calculator, BookOpen, BarChart3, Flask, ArrowRight, Calendar, FileText } from "lucide-react";
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
        <Card className="bg-gradient-to-br from-blue-500/10 to-indigo-500/10 border-blue-200 shadow transition-shadow duration-300 hover:shadow-md h-full">
          <CardHeader className="pb-2">
            <CardTitle className="flex items-center gap-2 text-lg">
              <BookOpen className="h-5 w-5 text-blue-500" />
              Competencia Lectora
            </CardTitle>
            <CardDescription>
              Comprensión y análisis textual avanzado
            </CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-sm mb-4">
              Desarrolla habilidades de comprensión lectora con ejercicios adaptativos y análisis de textos complejos.
            </p>
            <Button asChild className="w-full bg-blue-500 hover:bg-blue-600 group">
              <Link to="/lectoguia" className="flex items-center justify-center gap-2">
                Practicar Lectura
                <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
              </Link>
            </Button>
          </CardContent>
        </Card>
      </motion.div>
      
      <motion.div variants={item} className="w-full">
        <Card className="bg-gradient-to-br from-green-500/10 to-emerald-500/10 border-green-200 shadow transition-shadow duration-300 hover:shadow-md h-full">
          <CardHeader className="pb-2">
            <CardTitle className="flex items-center gap-2 text-lg">
              <Calculator className="h-5 w-5 text-green-500" />
              Matemáticas
            </CardTitle>
            <CardDescription>
              M1 (7° básico - 2° medio) y M2 (3° - 4° medio)
            </CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-sm mb-4">
              Domina álgebra, geometría, cálculo y funciones con ejercicios progresivos y simulacros PAES.
            </p>
            <Button asChild className="w-full bg-green-500 hover:bg-green-600 group">
              <Link to="/mathematics" className="flex items-center justify-center gap-2">
                Estudiar Matemáticas
                <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
              </Link>
            </Button>
          </CardContent>
        </Card>
      </motion.div>
      
      <motion.div variants={item} className="w-full">
        <Card className="bg-gradient-to-br from-purple-500/10 to-violet-500/10 border-purple-200 shadow transition-shadow duration-300 hover:shadow-md h-full">
          <CardHeader className="pb-2">
            <CardTitle className="flex items-center gap-2 text-lg">
                              <Flask className="h-5 w-5 text-purple-500" />
              Ciencias
            </CardTitle>
            <CardDescription>
              Física, Química y Biología integradas
            </CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-sm mb-4">
              Explora laboratorios virtuales, experimentos 3D y simulaciones para dominar las ciencias.
            </p>
            <Button asChild className="w-full bg-purple-500 hover:bg-purple-600 group">
              <Link to="/sciences" className="flex items-center justify-center gap-2">
                Explorar Ciencias
                <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
              </Link>
            </Button>
          </CardContent>
        </Card>
      </motion.div>

      <motion.div variants={item} className="w-full">
        <Card className="bg-gradient-to-br from-orange-500/10 to-yellow-500/10 border-orange-200 shadow transition-shadow duration-300 hover:shadow-md h-full">
          <CardHeader className="pb-2">
            <CardTitle className="flex items-center gap-2 text-lg">
              <FileText className="h-5 w-5 text-orange-500" />
              Historia
            </CardTitle>
            <CardDescription>
              Historia y Ciencias Sociales
            </CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-sm mb-4">
              Analiza fuentes históricas, líneas de tiempo interactivas y desarrolla pensamiento crítico.
            </p>
            <Button asChild className="w-full bg-orange-500 hover:bg-orange-600 group">
              <Link to="/history" className="flex items-center justify-center gap-2">
                Estudiar Historia
                <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
              </Link>
            </Button>
          </CardContent>
        </Card>
      </motion.div>

      <motion.div variants={item} className="w-full">
        <Card className="bg-gradient-to-br from-cyan-500/10 to-blue-500/10 border-cyan-200 shadow transition-shadow duration-300 hover:shadow-md h-full">
          <CardHeader className="pb-2">
            <CardTitle className="flex items-center gap-2 text-lg">
              <BarChart3 className="h-5 w-5 text-cyan-500" />
              Diagnóstico
            </CardTitle>
            <CardDescription>
              Evaluación integral de conocimientos
            </CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-sm mb-4">
              Realiza diagnósticos adaptativos para identificar fortalezas y áreas de mejora en todas las pruebas.
            </p>
            <Button asChild className="w-full bg-cyan-500 hover:bg-cyan-600 group">
              <Link to="/diagnostic" className="flex items-center justify-center gap-2">
                Hacer Diagnóstico
                <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
              </Link>
            </Button>
          </CardContent>
        </Card>
      </motion.div>
      
      <motion.div variants={item} className="w-full">
        <Card className="bg-gradient-to-br from-pink-500/10 to-rose-500/10 border-pink-200 shadow transition-shadow duration-300 hover:shadow-md h-full">
          <CardHeader className="pb-2">
            <CardTitle className="flex items-center gap-2 text-lg">
              <Calendar className="h-5 w-5 text-pink-500" />
              Planificación
            </CardTitle>
            <CardDescription>
              Plan de estudio personalizado
            </CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-sm mb-4">
              Organiza tu tiempo de estudio con calendarios inteligentes y seguimiento de progreso automático.
            </p>
            <Button asChild className="w-full bg-pink-500 hover:bg-pink-600 group">
              <Link to="/planning" className="flex items-center justify-center gap-2">
                Crear Plan
                <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
              </Link>
            </Button>
          </CardContent>
        </Card>
      </motion.div>
    </motion.div>
  );
};
