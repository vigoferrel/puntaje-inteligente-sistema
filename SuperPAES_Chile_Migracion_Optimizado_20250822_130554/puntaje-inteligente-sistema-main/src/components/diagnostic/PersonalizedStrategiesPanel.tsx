/* eslint-disable react-refresh/only-export-components */
import { FC } from 'react';
import type { SafeString, SafeNumber, SafeBoolean, APIResponse, OperationResult } from '../types/core';

import { Card, CardContent, CardHeader, CardTitle } from '../../components/ui/card';
import { Button } from '../../components/ui/button';
import { Badge } from '../../components/ui/badge';
import { AlertTriangle, Target, Zap, BookOpen } from 'lucide-react';
import { TPAESPrueba, TPAESHabilidad, getPruebaDisplayName } from '../../types/system-types';

interface PersonalizedStrategiesPanelProps {
  strategies: Array<{
    area: TPAESPrueba | TPAESHabilidad;
    priority: 'high' | 'medium' | 'low';
    strategy: string;
    exercises: Array<{
      type: 'official_paes' | 'ai_generated' | 'lectoguia';
      difficulty: 'basic' | 'intermediate' | 'advanced';
      estimated_time: number;
      skills_targeted: TPAESHabilidad[];
    }>;
    estimated_improvement: number;
  }>;
  weakestArea: { prueba: TPAESPrueba; score: number } | null;
  skillAnalysis: unknown;
  onGenerateExercises: (prueba: TPAESPrueba) => void;
}

export const PersonalizedStrategiesPanel: FC<PersonalizedStrategiesPanelProps> = ({
  strategies,
  weakestArea,
  skillAnalysis,
  onGenerateExercises
}) => {
  const getPriorityIcon = (priority: string) => {
    switch (priority) {
      case 'high':
        return <AlertTriangle className="w-4 h-4 text-red-500" />;
      case 'medium':
        return <Target className="w-4 h-4 text-yellow-500" />;
      default:
        return <Zap className="w-4 h-4 text-blue-500" />;
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high':
        return 'destructive';
      case 'medium':
        return 'default';
      default:
        return 'secondary';
    }
  };

  return (
    <div className="space-y-6">
      {/* Ãrea mÃ¡s dÃ©bil */}
      {weakestArea && (
        <Card className="border-orange-200 bg-orange-50">
          <CardHeader>
            <CardTitle className="flex items-center space-x-2 text-orange-800">
              <AlertTriangle className="w-5 h-5" />
              <span>Ãrea Prioritaria</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex justify-between items-center">
              <div>
                <h3 className="font-bold text-orange-900">
                  {getPruebaDisplayName(weakestArea.prueba)}
                </h3>
                <p className="text-orange-700">
                  Puntaje actual: {weakestArea.score} - Requiere atenciÃ³n inmediata
                </p>
              </div>
              <Button 
                onClick={() => onGenerateExercises(weakestArea.prueba)}
                className="bg-orange-600 hover:bg-orange-700"
              >
                <BookOpen className="w-4 h-4 mr-2" />
                Generar Ejercicios
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Estrategias personalizadas */}
      <Card>
        <CardHeader>
          <CardTitle>Estrategias Personalizadas</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {strategies.length === 0 ? (
            <div className="text-center py-8 text-gray-500">
              <Target className="w-12 h-12 mx-auto mb-4 text-gray-300" />
              <p>No hay estrategias disponibles. Completa una evaluaciÃ³n inicial.</p>
            </div>
          ) : (
            strategies.map((strategy, index) => (
              <Card key={index} className="p-4">
                <div className="flex justify-between items-start mb-3">
                  <div className="flex items-center space-x-2">
                    {getPriorityIcon(strategy.priority)}
                    <h4 className="font-medium">
                      {typeof strategy.area === 'string' && strategy.area.includes('_') 
                        ? getPruebaDisplayName(strategy.area as TPAESPrueba)
                        : strategy.area
                      }
                    </h4>
                    <Badge variant={getPriorityColor(strategy.priority) as unknown}>
                      {strategy.priority === 'high' ? 'Alta' : 
                       strategy.priority === 'medium' ? 'Media' : 'Baja'} prioridad
                    </Badge>
                  </div>
                  <Badge variant="outline" className="text-green-600">
                    +{strategy.estimated_improvement} pts esperados
                  </Badge>
                </div>
                
                <p className="text-gray-700 mb-4">{strategy.strategy}</p>
                
                <div className="space-y-2">
                  <h5 className="text-sm font-medium">Plan de ejercicios:</h5>
                  {strategy.exercises.map((exercise, exerciseIndex) => (
                    <div key={exerciseIndex} className="flex justify-between items-center bg-gray-50 p-2 rounded">
                      <div className="flex items-center space-x-2">
                        <Badge variant="outline" className="text-xs">
                          {exercise.type === 'official_paes' ? 'PAES Oficial' :
                           exercise.type === 'ai_generated' ? 'IA Generado' : 'LectoGuÃ­a'}
                        </Badge>
                        <span className="text-sm capitalize">{exercise.difficulty}</span>
                      </div>
                      <span className="text-xs text-gray-500">{exercise.estimated_time}min</span>
                    </div>
                  ))}
                </div>
                
                <Button 
                  variant="outline" 
                  size="sm" 
                  className="mt-3 w-full"
                  onClick={() => {
                    if (typeof strategy.area === 'string' && strategy.area.includes('_')) {
                      onGenerateExercises(strategy.area as TPAESPrueba);
                    }
                  }}
                >
                  <Zap className="w-4 h-4 mr-2" />
                  Comenzar Plan
                </Button>
              </Card>
            ))
          )}
        </CardContent>
      </Card>
    </div>
  );
};

