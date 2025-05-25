
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Gamepad2, Clock, Trophy, Zap } from 'lucide-react';

export const SimulationTraining: React.FC = () => {
  return (
    <div className="space-y-6">
      {/* Descripción principal */}
      <Card className="bg-gradient-to-r from-green-600/20 to-blue-600/20 border-green-500/30">
        <CardHeader>
          <CardTitle className="text-white flex items-center gap-3">
            <Gamepad2 className="h-6 w-6 text-green-400" />
            Simulación de Examen
          </CardTitle>
          <CardDescription className="text-gray-300">
            Practica con condiciones reales de la PAES para familiarizarte con el formato
          </CardDescription>
        </CardHeader>
      </Card>

      {/* Opciones de simulación */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card className="bg-gray-800 border-gray-700 hover:border-green-500/50 transition-colors">
          <CardHeader>
            <CardTitle className="text-white flex items-center gap-2">
              <Clock className="h-5 w-5 text-green-400" />
              Simulación Completa
            </CardTitle>
            <CardDescription className="text-gray-400">
              Examen completo con tiempo real de la PAES
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <div className="flex justify-between">
                <span className="text-sm text-gray-400">Duración:</span>
                <span className="text-sm text-white">2h 30min</span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm text-gray-400">Preguntas:</span>
                <span className="text-sm text-white">65 preguntas</span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm text-gray-400">Modalidad:</span>
                <span className="text-sm text-white">Cronometrada</span>
              </div>
            </div>
            
            <div className="flex flex-wrap gap-2">
              <Badge variant="outline" className="bg-blue-600/20 text-blue-300 border-blue-500 text-xs">
                Comprensión Lectora
              </Badge>
              <Badge variant="outline" className="bg-red-600/20 text-red-300 border-red-500 text-xs">
                Matemática
              </Badge>
            </div>
            
            <Button className="w-full bg-green-600 hover:bg-green-700 text-white">
              <Trophy className="h-4 w-4 mr-2" />
              Iniciar Simulación Completa
            </Button>
          </CardContent>
        </Card>

        <Card className="bg-gray-800 border-gray-700 hover:border-blue-500/50 transition-colors">
          <CardHeader>
            <CardTitle className="text-white flex items-center gap-2">
              <Zap className="h-5 w-5 text-blue-400" />
              Simulación Rápida
            </CardTitle>
            <CardDescription className="text-gray-400">
              Versión abreviada para práctica diaria
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <div className="flex justify-between">
                <span className="text-sm text-gray-400">Duración:</span>
                <span className="text-sm text-white">30-45min</span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm text-gray-400">Preguntas:</span>
                <span className="text-sm text-white">20 preguntas</span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm text-gray-400">Modalidad:</span>
                <span className="text-sm text-white">Flexible</span>
              </div>
            </div>
            
            <div className="flex flex-wrap gap-2">
              <Badge variant="outline" className="bg-purple-600/20 text-purple-300 border-purple-500 text-xs">
                Ciencias
              </Badge>
              <Badge variant="outline" className="bg-orange-600/20 text-orange-300 border-orange-500 text-xs">
                Historia
              </Badge>
            </div>
            
            <Button className="w-full bg-blue-600 hover:bg-blue-700 text-white">
              <Zap className="h-4 w-4 mr-2" />
              Simulación Rápida
            </Button>
          </CardContent>
        </Card>
      </div>

      {/* Características */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card className="bg-gray-800 border-gray-700">
          <CardContent className="p-4 text-center">
            <Clock className="h-8 w-8 text-green-400 mx-auto mb-2" />
            <div className="font-medium text-white mb-1">Tiempo Real</div>
            <div className="text-sm text-gray-400">
              Misma presión temporal que el examen oficial
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gray-800 border-gray-700">
          <CardContent className="p-4 text-center">
            <Trophy className="h-8 w-8 text-yellow-400 mx-auto mb-2" />
            <div className="font-medium text-white mb-1">Puntaje Predicativo</div>
            <div className="text-sm text-gray-400">
              Estimación de tu puntaje real PAES
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gray-800 border-gray-700">
          <CardContent className="p-4 text-center">
            <Gamepad2 className="h-8 w-8 text-blue-400 mx-auto mb-2" />
            <div className="font-medium text-white mb-1">Interfaz Real</div>
            <div className="text-sm text-gray-400">
              Replica exacta del sistema oficial
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Consejos */}
      <Card className="bg-gray-800 border-gray-700">
        <CardHeader>
          <CardTitle className="text-white">💡 Consejos para la Simulación</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          <div className="flex items-start gap-3">
            <div className="w-2 h-2 rounded-full bg-green-400 mt-2 flex-shrink-0" />
            <div className="text-sm text-gray-300">
              <strong>Ambiente:</strong> Busca un lugar silencioso sin distracciones
            </div>
          </div>
          <div className="flex items-start gap-3">
            <div className="w-2 h-2 rounded-full bg-green-400 mt-2 flex-shrink-0" />
            <div className="text-sm text-gray-300">
              <strong>Materiales:</strong> Solo lápiz y papel como en el examen real
            </div>
          </div>
          <div className="flex items-start gap-3">
            <div className="w-2 h-2 rounded-full bg-green-400 mt-2 flex-shrink-0" />
            <div className="text-sm text-gray-300">
              <strong>Tiempo:</strong> Respeta estrictamente los límites de tiempo
            </div>
          </div>
          <div className="flex items-start gap-3">
            <div className="w-2 h-2 rounded-full bg-green-400 mt-2 flex-shrink-0" />
            <div className="text-sm text-gray-300">
              <strong>Revisión:</strong> Analiza tus errores después de cada simulación
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
