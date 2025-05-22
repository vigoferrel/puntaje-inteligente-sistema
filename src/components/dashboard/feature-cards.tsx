
import React from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { MessageCircleQuestion, BookOpen, BarChart3, Sparkles, ArrowRight } from "lucide-react";

export const FeatureCards = () => {
  return (
    <div className="grid gap-6 md:grid-cols-3 mb-8">
      <Card className="bg-gradient-to-br from-violet-500/10 to-purple-500/10 border-purple-200 shadow hover:shadow-md transition-all duration-300">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
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
          <Button asChild className="w-full bg-violet-500 hover:bg-violet-600">
            <Link to="/lectoguia" className="flex items-center justify-center gap-2">
              Practicar con IA <ArrowRight className="h-4 w-4" />
            </Link>
          </Button>
        </CardContent>
      </Card>
      
      <Card className="bg-gradient-to-br from-blue-500/10 to-cyan-500/10 border-blue-200 shadow hover:shadow-md transition-all duration-300">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
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
          <Button asChild className="w-full bg-blue-500 hover:bg-blue-600">
            <Link to="/diagnostico" className="flex items-center justify-center gap-2">
              Iniciar Diagnóstico <ArrowRight className="h-4 w-4" />
            </Link>
          </Button>
        </CardContent>
      </Card>
      
      <Card className="bg-gradient-to-br from-green-500/10 to-emerald-500/10 border-emerald-200 shadow hover:shadow-md transition-all duration-300">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <BookOpen className="h-5 w-5 text-emerald-500" />
            Biblioteca
          </CardTitle>
          <CardDescription>
            Recursos de estudio y material complementario
          </CardDescription>
        </CardHeader>
        <CardContent>
          <p className="text-sm mb-4">
            Accede a material de estudio, guías y contenido seleccionado específicamente para mejorar tu rendimiento en la PAES.
          </p>
          <Button asChild className="w-full bg-emerald-500 hover:bg-emerald-600">
            <Link to="/biblioteca" className="flex items-center justify-center gap-2">
              Explorar Biblioteca <ArrowRight className="h-4 w-4" />
            </Link>
          </Button>
        </CardContent>
      </Card>
    </div>
  );
};
