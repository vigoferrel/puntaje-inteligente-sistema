/* eslint-disable react-refresh/only-export-components */

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../../components/ui/card";
import type { SafeString, SafeNumber, SafeBoolean, APIResponse, OperationResult } from '../types/core';
import { Brain } from "lucide-react";

export const AIFeatures = () => {
  return (
    <Card className="col-span-1 md:col-span-2">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Brain className="h-5 w-5 text-stp-primary" />
          PreparaciÃ³n Potenciada por IA
        </CardTitle>
        <CardDescription>
          Nuestro sistema utiliza modelos de lenguaje avanzados para crear una experiencia de preparaciÃ³n PAES personalizada y efectiva.
        </CardDescription>
      </CardHeader>
      <CardContent className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="flex flex-col items-center p-4 rounded-lg bg-blue-50 text-center">
          <div className="h-12 w-12 rounded-full bg-blue-100 flex items-center justify-center mb-3">
            <div className="h-6 w-6 text-blue-600">ðŸ§ </div>
          </div>
          <h3 className="font-medium text-gray-900">DiagnÃ³stico Inteligente</h3>
          <p className="text-sm text-gray-600 mt-2">AnÃ¡lisis personalizado de tus Ã¡reas de mejora basado en tu desempeÃ±o</p>
        </div>
        
        <div className="flex flex-col items-center p-4 rounded-lg bg-green-50 text-center">
          <div className="h-12 w-12 rounded-full bg-green-100 flex items-center justify-center mb-3">
            <div className="h-6 w-6 text-green-600">ðŸ“š</div>
          </div>
          <h3 className="font-medium text-gray-900">Contenido Adaptativo</h3>
          <p className="text-sm text-gray-600 mt-2">Preguntas y ejercicios que se ajustan automÃ¡ticamente a tu nivel de dominio</p>
        </div>
        
        <div className="flex flex-col items-center p-4 rounded-lg bg-purple-50 text-center">
          <div className="h-12 w-12 rounded-full bg-purple-100 flex items-center justify-center mb-3">
            <div className="h-6 w-6 text-purple-600">ðŸ’¡</div>
          </div>
          <h3 className="font-medium text-gray-900">RetroalimentaciÃ³n Avanzada</h3>
          <p className="text-sm text-gray-600 mt-2">Explicaciones detalladas sobre tus errores y consejos para mejorar</p>
        </div>
      </CardContent>
    </Card>
  );
};

