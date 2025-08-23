/* eslint-disable react-refresh/only-export-components */
import { FC } from 'react';
import type { SafeString, SafeNumber, SafeBoolean, APIResponse, OperationResult } from '../types/core';

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../../components/ui/card';
import { Button } from '../../components/ui/button';
import { Badge } from '../../components/ui/badge';
import { useTraining } from '../../hooks/use-training';
import { Brain, Play, BarChart3, Target } from 'lucide-react';

export const PersonalizedTraining: FC = () => {
  const { 
    generatePersonalizedExercises, 
    startTrainingSession, 
    loading,
    currentSession,
    exercises 
  } = useTraining();

  const handleStartPersonalized = async () => {
    if (exercises.length === 0) {
      await generatePersonalizedExercises(15);
    }
    startTrainingSession('personalizado');
  };

  return (
    <div className="space-y-6">
      {/* DescripciÃ³n principal */}
      <Card className="bg-gradient-to-r from-blue-600/20 to-purple-600/20 border-blue-500/30">
        <CardHeader>
          <CardTitle className="text-white flex items-center gap-3">
            <Brain className="h-6 w-6 text-blue-400" />
            Entrenamiento Personalizado
          </CardTitle>
          <CardDescription className="text-gray-300">
            Ejercicios adaptados a tus debilidades detectadas para maximizar tu mejora
          </CardDescription>
        </CardHeader>
      </Card>

      {/* Grid de caracterÃ­sticas */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card className="bg-gray-800 border-gray-700">
          <CardContent className="p-4">
            <div className="flex items-center gap-3 mb-2">
              <Target className="h-5 w-5 text-green-400" />
              <span className="font-medium text-white">Enfoque Dirigido</span>
            </div>
            <p className="text-sm text-gray-400">
              Se centra en las habilidades donde mÃ¡s necesitas mejorar
            </p>
          </CardContent>
        </Card>

        <Card className="bg-gray-800 border-gray-700">
          <CardContent className="p-4">
            <div className="flex items-center gap-3 mb-2">
              <BarChart3 className="h-5 w-5 text-blue-400" />
              <span className="font-medium text-white">Adaptativo</span>
            </div>
            <p className="text-sm text-gray-400">
              La dificultad se ajusta segÃºn tu progreso en tiempo real
            </p>
          </CardContent>
        </Card>

        <Card className="bg-gray-800 border-gray-700">
          <CardContent className="p-4">
            <div className="flex items-center gap-3 mb-2">
              <Brain className="h-5 w-5 text-purple-400" />
              <span className="font-medium text-white">IA Avanzada</span>
            </div>
            <p className="text-sm text-gray-400">
              Ejercicios generados por IA basados en tu historial PAES
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Ãrea de acciÃ³n */}
      <Card className="bg-gray-800 border-gray-700">
        <CardHeader>
          <CardTitle className="text-white">Â¿Listo para entrenar?</CardTitle>
          <CardDescription className="text-gray-400">
            Tu prÃ³xima sesiÃ³n incluirÃ¡ ejercicios de las Ã¡reas donde mÃ¡s necesitas mejorar
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex flex-wrap gap-2">
            <Badge variant="outline" className="bg-red-600/20 text-red-300 border-red-500">
              ComprensiÃ³n Lectora
            </Badge>
            <Badge variant="outline" className="bg-orange-600/20 text-orange-300 border-orange-500">
              MatemÃ¡tica M1
            </Badge>
            <Badge variant="outline" className="bg-yellow-600/20 text-yellow-300 border-yellow-500">
              Ciencias
            </Badge>
          </div>
          
          <div className="flex items-center gap-4">
            <Button 
              onClick={handleStartPersonalized}
              disabled={loading}
              className="bg-blue-600 hover:bg-blue-700 text-white"
            >
              {loading ? (
                <>Generando ejercicios...</>
              ) : (
                <>
                  <Play className="h-4 w-4 mr-2" />
                  Comenzar Entrenamiento
                </>
              )}
            </Button>
            
            {exercises.length > 0 && (
              <div className="text-sm text-gray-400">
                {exercises.length} ejercicios listos
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      {/* InformaciÃ³n adicional */}
      <Card className="bg-gray-800 border-gray-700">
        <CardHeader>
          <CardTitle className="text-white text-lg">Â¿CÃ³mo funciona?</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          <div className="flex items-start gap-3">
            <div className="w-6 h-6 rounded-full bg-blue-600 flex items-center justify-center text-white text-sm font-bold">
              1
            </div>
            <div>
              <div className="font-medium text-white">AnÃ¡lisis de Debilidades</div>
              <div className="text-sm text-gray-400">
                Identificamos automÃ¡ticamente las Ã¡reas donde tu rendimiento es menor
              </div>
            </div>
          </div>
          
          <div className="flex items-start gap-3">
            <div className="w-6 h-6 rounded-full bg-blue-600 flex items-center justify-center text-white text-sm font-bold">
              2
            </div>
            <div>
              <div className="font-medium text-white">GeneraciÃ³n Inteligente</div>
              <div className="text-sm text-gray-400">
                Creamos ejercicios especÃ­ficos para reforzar esas habilidades
              </div>
            </div>
          </div>
          
          <div className="flex items-start gap-3">
            <div className="w-6 h-6 rounded-full bg-blue-600 flex items-center justify-center text-white text-sm font-bold">
              3
            </div>
            <div>
              <div className="font-medium text-white">Seguimiento de Progreso</div>
              <div className="text-sm text-gray-400">
                Monitoreamos tu mejora y ajustamos la dificultad automÃ¡ticamente
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

