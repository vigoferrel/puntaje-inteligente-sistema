
import React from 'react';
import { Button } from '@/components/ui/button';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Label } from '@/components/ui/label';
import { TPAESPrueba, getPruebaDisplayName } from '@/types/system-types';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
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
    title: 'Simulación de Competencia Lectora',
    description: 'Simulación completa de la prueba de Competencia Lectora con tiempo real.',
    prueba: 'COMPETENCIA_LECTORA',
    questionCount: 65,
    timeMinutes: 150,
    difficulty: 'INTERMEDIATE'
  },
  {
    id: 'matematica-1',
    title: 'Simulación de Matemática 1',
    description: 'Simulación completa de la prueba de Matemática con ejercicios del nivel 7° a 2° medio.',
    prueba: 'MATEMATICA_1',
    questionCount: 65,
    timeMinutes: 150, 
    difficulty: 'INTERMEDIATE'
  },
  {
    id: 'matematica-2',
    title: 'Simulación de Matemática 2',
    description: 'Simulación completa de la prueba de Matemática avanzada con ejercicios del nivel 3° y 4° medio.',
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

export const SimulationSelector: React.FC<SimulationSelectorProps> = ({
  onSelectSimulation,
  onStartSimulation,
  selectedSimulation,
  isLoading
}) => {
  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-semibold mb-2">Selecciona una simulación PAES</h2>
        <p className="text-muted-foreground">
          Elige el tipo de simulación que deseas realizar. Las simulaciones emulan las condiciones reales del examen PAES.
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
          Comenzar simulación
        </Button>
      </div>
    </div>
  );
};
