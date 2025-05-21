
import React from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

export const StudyPlan = () => {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Plan de Estudio Recomendado</CardTitle>
        <CardDescription>
          Basado en tu diagnóstico y objetivos de aprendizaje
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Card className="bg-gradient-to-br from-blue-50 to-indigo-50 border-blue-200">
              <CardContent className="p-4">
                <div className="bg-blue-100 text-blue-600 h-10 w-10 rounded-full flex items-center justify-center mb-3">
                  1
                </div>
                <h3 className="font-medium text-gray-900">Resolución de Problemas</h3>
                <p className="text-sm text-gray-600 mt-1">Matemática 1 - Nivel Básico</p>
                <Button className="mt-3 w-full bg-blue-600 hover:bg-blue-700">Continuar</Button>
              </CardContent>
            </Card>

            <Card className="bg-gradient-to-br from-purple-50 to-pink-50 border-purple-200">
              <CardContent className="p-4">
                <div className="bg-purple-100 text-purple-600 h-10 w-10 rounded-full flex items-center justify-center mb-3">
                  2
                </div>
                <h3 className="font-medium text-gray-900">Rastrear y Localizar</h3>
                <p className="text-sm text-gray-600 mt-1">Competencia Lectora - Nivel Básico</p>
                <Button className="mt-3 w-full bg-purple-600 hover:bg-purple-700">Comenzar</Button>
              </CardContent>
            </Card>

            <Card className="bg-gradient-to-br from-green-50 to-emerald-50 border-green-200">
              <CardContent className="p-4">
                <div className="bg-green-100 text-green-600 h-10 w-10 rounded-full flex items-center justify-center mb-3">
                  3
                </div>
                <h3 className="font-medium text-gray-900">Modelar</h3>
                <p className="text-sm text-gray-600 mt-1">Matemática 2 - Nivel Intermedio</p>
                <Button className="mt-3 w-full bg-green-600 hover:bg-green-700">Comenzar</Button>
              </CardContent>
            </Card>
          </div>

          <div className="flex justify-center">
            <Button variant="outline">Ver Plan Completo</Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
