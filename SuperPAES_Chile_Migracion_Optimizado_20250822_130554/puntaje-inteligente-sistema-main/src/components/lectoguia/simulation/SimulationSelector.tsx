/* eslint-disable react-refresh/only-export-components */
import { FC } from 'react';
import type { SafeString, SafeNumber, SafeBoolean, APIResponse, OperationResult } from '../types/core';

import { Button } from '../../../components/ui/button';
import { RadioGroup, RadioGroupItem } from '../../../components/ui/radio-group';
import { Label } from '../../../components/ui/label';
import { TPAESPrueba, getPruebaDisplayName } from '../../../types/system-types';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../../../components/ui/card';
import { Clock, BookOpen, Check } from 'lucide-react';

export interface SimulationOption {
  id: string;
  title: string;
  description: string;
  prueba: TPAESPrueba;
  questionCount: number;
  timeMinutes: number;
  difficulty: string;
}

const DEFAULT_SIMULATIONS: SimulationOption[] = [
  {
    id: 'comp-lectora',
    title: 'SimulaciÃ³n de Competencia Lectora',
    description: 'SimulaciÃ³n completa de la prueba de Competencia Lectora con tiempo real.',
    prueba: 'COMPETENCIA_LECTORA',
    questionCount: 65,
    timeMinutes: 150,
    difficulty: 'INTERMEDIATE'
  },
  {
    id: 'matematica-1',
    title: 'SimulaciÃ³n de MatemÃ¡tica 1',
    description: 'SimulaciÃ³n completa de la prueba de MatemÃ¡tica con ejercicios del nivel 7Â° a 2Â° medio.',
    prueba: 'MATEMATICA_1',
    questionCount: 65,
    timeMinutes: 150, 
    difficulty: 'INTERMEDIATE'
  },
  {
    id: 'matematica-2',
    title: 'SimulaciÃ³n de MatemÃ¡tica 2',
    description: 'SimulaciÃ³n completa de la prueba de MatemÃ¡tica avanzada con ejercicios del nivel 3Â° y 4Â° medio.',
    prueba: 'MATEMATICA_2',
    questionCount: 55,
    timeMinutes: 130,
    difficulty: 'INTERMEDIATE'
  }
];

interface SimulationSelectorProps {
  onSelectSimulation: (simulation: SimulationOption) => void;
  onStartSimulation: () => void;
  selectedSimulation: SimulationOption | null;
  isLoading: boolean;
}

export const SimulationSelector: FC<SimulationSelectorProps> = ({
  onSelectSimulation,
  onStartSimulation,
  selectedSimulation,
  isLoading
}) => {
  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-semibold mb-2">Selecciona una simulaciÃ³n PAES</h2>
        <p className="text-muted-foreground">
          Elige el tipo de simulaciÃ³n que deseas realizar. Las simulaciones emulan las condiciones reales del examen PAES.
        </p>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {DEFAULT_SIMULATIONS.map((simulation) => (
          <Card 
            key={simulation.id}
            className={`cursor-pointer transition-colors hover:border-primary ${selectedSimulation?.id === simulation.id ? 'border-primary bg-primary/5' : ''}`}
            onClick={() => onSelectSimulation(simulation)}
          >
            <CardHeader className="pb-2">
              <div className="flex justify-between items-start">
                <CardTitle className="text-lg">{simulation.title}</CardTitle>
                {selectedSimulation?.id === simulation.id && (
                  <Check className="h-5 w-5 text-primary" />
                )}
              </div>
              <CardDescription>
                {getPruebaDisplayName(simulation.prueba)}
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                <div className="flex items-center gap-2 text-sm">
                  <BookOpen className="h-4 w-4 text-muted-foreground" />
                  <span>{simulation.questionCount} preguntas</span>
                </div>
                <div className="flex items-center gap-2 text-sm">
                  <Clock className="h-4 w-4 text-muted-foreground" />
                  <span>{simulation.timeMinutes} minutos</span>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
      
      <div className="flex justify-end pt-4">
        <Button 
          disabled={!selectedSimulation || isLoading} 
          onClick={onStartSimulation} 
          size="lg"
        >
          Comenzar simulaciÃ³n
        </Button>
      </div>
    </div>
  );
};

