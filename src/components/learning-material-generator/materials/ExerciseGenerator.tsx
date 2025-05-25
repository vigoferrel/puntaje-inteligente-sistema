
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Checkbox } from '@/components/ui/checkbox';
import { Play, RefreshCw, Target } from 'lucide-react';
import { TLearningCyclePhase } from '@/types/system-types';
import { NodeDescriptor } from '../../exercise-generator/components/NodeDescriptor';

interface ExerciseGeneratorProps {
  selectedSubject: string;
  currentPhase: TLearningCyclePhase;
  onGenerate: (config: any) => void;
  isGenerating: boolean;
}

export const ExerciseGenerator: React.FC<ExerciseGeneratorProps> = ({
  selectedSubject,
  currentPhase,
  onGenerate,
  isGenerating
}) => {
  const [selectedTier, setSelectedTier] = useState('tier1');
  const [difficulty, setDifficulty] = useState('intermedio');
  const [exerciseCount, setExerciseCount] = useState(5);
  const [selectedNodes, setSelectedNodes] = useState<string[]>([]);

  // Nodos simplificados por tier
  const getNodesForTier = (subject: string, tier: string) => {
    const nodeMaps = {
      'competencia-lectora': {
        tier1: ['CL-RL-01', 'CL-RL-02', 'CL-IR-01'],
        tier2: ['CL-RL-03', 'CL-IR-03', 'CL-ER-02'],
        tier3: ['CL-RL-05', 'CL-IR-05']
      },
      'matematica-m1': {
        tier1: ['M1-NUM-01', 'M1-ALG-01', 'M1-GEO-01'],
        tier2: ['M1-NUM-02', 'M1-ALG-03', 'M1-GEO-02'],
        tier3: ['M1-NUM-03', 'M1-ALG-04']
      },
      'matematica-m2': {
        tier1: ['M2-ALG-01', 'M2-GEO-01', 'M2-CALC-01'],
        tier2: ['M2-ALG-03', 'M2-GEO-02'],
        tier3: ['M2-ALG-04', 'M2-CALC-02']
      },
      'historia': {
        tier1: ['HST-37', 'HST-20', 'FC-01'],
        tier2: ['HST-01', 'HST-02', 'FC-03'],
        tier3: ['HST-10', 'HST-11']
      },
      'ciencias': {
        tier1: ['CC-BIO-01', 'CC-FIS-01', 'CC-QUIM-01'],
        tier2: ['CC-BIO-13', 'CC-FIS-09', 'CC-QUIM-09'],
        tier3: ['CC-BIO-28', 'CC-FIS-19']
      }
    };
    
    return nodeMaps[subject]?.[tier] || [];
  };

  const availableNodes = getNodesForTier(selectedSubject, selectedTier);

  const handleNodeToggle = (nodeId: string) => {
    setSelectedNodes(prev => 
      prev.includes(nodeId) 
        ? prev.filter(id => id !== nodeId)
        : [...prev, nodeId]
    );
  };

  const handleGenerate = () => {
    if (selectedNodes.length === 0) {
      alert('Selecciona al menos un nodo para generar ejercicios');
      return;
    }

    const config = {
      materialType: 'exercises',
      subject: selectedSubject,
      phase: currentPhase,
      tier: selectedTier,
      nodes: selectedNodes,
      difficulty,
      count: exerciseCount
    };

    onGenerate(config);
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Target className="h-5 w-5" />
          Generador de Ejercicios Inteligente
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Configuración Básica */}
        <div className="grid grid-cols-3 gap-4">
          <div>
            <Label>Nivel de Prioridad</Label>
            <Select value={selectedTier} onValueChange={(value) => {
              setSelectedTier(value);
              setSelectedNodes([]);
            }}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="tier1">Tier 1 - Críticos</SelectItem>
                <SelectItem value="tier2">Tier 2 - Importantes</SelectItem>
                <SelectItem value="tier3">Tier 3 - Complementarios</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div>
            <Label>Dificultad</Label>
            <Select value={difficulty} onValueChange={setDifficulty}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="basico">Básico</SelectItem>
                <SelectItem value="intermedio">Intermedio</SelectItem>
                <SelectItem value="avanzado">Avanzado</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div>
            <Label>Cantidad</Label>
            <Input
              type="number"
              min="1"
              max="20"
              value={exerciseCount}
              onChange={(e) => setExerciseCount(parseInt(e.target.value) || 1)}
            />
          </div>
        </div>

        {/* Selector de Nodos */}
        <div>
          <Label>Nodos de Aprendizaje ({availableNodes.length} disponibles)</Label>
          <div className="max-h-48 overflow-y-auto border rounded-lg p-3 space-y-2">
            {availableNodes.map(nodeId => (
              <div key={nodeId} className="flex items-start space-x-3 p-2 rounded hover:bg-muted/50">
                <Checkbox
                  id={nodeId}
                  checked={selectedNodes.includes(nodeId)}
                  onCheckedChange={() => handleNodeToggle(nodeId)}
                  className="mt-1"
                />
                <div className="flex-1">
                  <NodeDescriptor nodeCode={nodeId} showFullInfo={false} />
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Botón de Generación */}
        <Button
          onClick={handleGenerate}
          disabled={isGenerating || selectedNodes.length === 0}
          className="w-full h-12"
          size="lg"
        >
          {isGenerating ? (
            <>
              <RefreshCw className="w-5 h-5 mr-2 animate-spin" />
              Generando {exerciseCount} Ejercicios...
            </>
          ) : (
            <>
              <Play className="w-5 h-5 mr-2" />
              Generar {exerciseCount} Ejercicios para {currentPhase}
            </>
          )}
        </Button>

        {selectedNodes.length > 0 && (
          <div className="p-3 bg-muted/50 rounded-lg">
            <p className="text-sm text-muted-foreground">
              ✨ Se generarán <strong>{exerciseCount} ejercicios</strong> para{' '}
              <strong>{selectedNodes.length} nodos</strong> en dificultad{' '}
              <strong>{difficulty}</strong>
            </p>
          </div>
        )}
      </CardContent>
    </Card>
  );
};
