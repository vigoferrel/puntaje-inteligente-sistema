
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Checkbox } from '@/components/ui/checkbox';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Play, RefreshCw, Settings, AlertCircle } from 'lucide-react';
import { NodeDescriptor } from './components/NodeDescriptor';

interface ExerciseGeneratorCoreProps {
  selectedSubject: string;
  subjects: any;
  showSettings: boolean;
  onGenerate: (config: any) => void;
  isGenerating: boolean;
}

export const ExerciseGeneratorCore: React.FC<ExerciseGeneratorCoreProps> = ({
  selectedSubject,
  subjects,
  showSettings,
  onGenerate,
  isGenerating
}) => {
  const [selectedTier, setSelectedTier] = useState('tier1');
  const [difficulty, setDifficulty] = useState('intermedio');
  const [exerciseCount, setExerciseCount] = useState(5);
  const [selectedNodes, setSelectedNodes] = useState<string[]>([]);
  const [apiKey, setApiKey] = useState('');

  // Nodos mock por tier y materia con nomenclatura mejorada
  const getNodesForTier = (subject: string, tier: string) => {
    const nodeMaps = {
      'competencia-lectora': {
        tier1: ['CL-RL-01', 'CL-RL-02', 'CL-IR-01', 'CL-IR-02', 'CL-ER-01'],
        tier2: ['CL-RL-03', 'CL-RL-04', 'CL-IR-03', 'CL-IR-04', 'CL-ER-02'],
        tier3: ['CL-RL-05', 'CL-IR-05', 'CL-ER-03']
      },
      'matematica-m1': {
        tier1: ['M1-NUM-01', 'M1-ALG-01', 'M1-GEO-01', 'M1-ALG-02'],
        tier2: ['M1-NUM-02', 'M1-ALG-03', 'M1-GEO-02', 'M1-PROB-01'],
        tier3: ['M1-NUM-03', 'M1-ALG-04', 'M1-GEO-03']
      },
      'matematica-m2': {
        tier1: ['M2-ALG-01', 'M2-ALG-02', 'M2-GEO-01', 'M2-CALC-01'],
        tier2: ['M2-ALG-03', 'M2-GEO-02', 'M2-PROB-01'],
        tier3: ['M2-ALG-04', 'M2-GEO-03', 'M2-CALC-02']
      },
      'historia': {
        tier1: ['HST-37', 'HST-20', 'FC-01', 'HST-41', 'HST-42'],
        tier2: ['HST-01', 'HST-02', 'FC-03', 'HST-15', 'ECO-01'],
        tier3: ['HST-10', 'HST-11', 'FC-08', 'ECO-04']
      },
      'ciencias': {
        tier1: ['CC-BIO-01', 'CC-FIS-01', 'CC-QUIM-01', 'CC-BIO-02'],
        tier2: ['CC-BIO-13', 'CC-FIS-09', 'CC-QUIM-09', 'CC-BIO-14'],
        tier3: ['CC-BIO-28', 'CC-FIS-19', 'CC-QUIM-19', 'CC-BIO-29']
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
      subject: selectedSubject,
      tier: selectedTier,
      nodes: selectedNodes,
      difficulty,
      count: exerciseCount,
      apiKey
    };

    onGenerate(config);
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Settings className="h-5 w-5" />
          Configuración de Ejercicios
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* API Key Settings */}
        {showSettings && (
          <Alert>
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>
              <div className="space-y-2">
                <Label htmlFor="apiKey">API Key de OpenRouter</Label>
                <Input
                  id="apiKey"
                  type="password"
                  placeholder="Ingresa tu API Key"
                  value={apiKey}
                  onChange={(e) => setApiKey(e.target.value)}
                />
                <p className="text-xs text-muted-foreground">
                  Obtén tu clave en{' '}
                  <a href="https://openrouter.ai" target="_blank" rel="noopener noreferrer" className="underline">
                    openrouter.ai
                  </a>
                </p>
              </div>
            </AlertDescription>
          </Alert>
        )}

        {/* Tier Selection */}
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

        {/* Difficulty */}
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

        {/* Exercise Count */}
        <div>
          <Label>Cantidad de Ejercicios</Label>
          <Input
            type="number"
            min="1"
            max="20"
            value={exerciseCount}
            onChange={(e) => setExerciseCount(parseInt(e.target.value) || 1)}
          />
        </div>

        {/* Node Selection with improved UI */}
        <div>
          <Label>Nodos Disponibles ({availableNodes.length})</Label>
          <div className="max-h-60 overflow-y-auto border rounded-lg p-3 space-y-3">
            {availableNodes.map(nodeId => (
              <div key={nodeId} className="flex items-start space-x-3 p-2 rounded-lg hover:bg-muted/50">
                <Checkbox
                  id={nodeId}
                  checked={selectedNodes.includes(nodeId)}
                  onCheckedChange={() => handleNodeToggle(nodeId)}
                  className="mt-1"
                />
                <div className="flex-1">
                  <NodeDescriptor nodeCode={nodeId} showFullInfo={true} />
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Generate Button */}
        <Button
          onClick={handleGenerate}
          disabled={isGenerating || selectedNodes.length === 0}
          className="w-full"
        >
          {isGenerating ? (
            <>
              <RefreshCw className="w-4 h-4 mr-2 animate-spin" />
              Generando...
            </>
          ) : (
            <>
              <Play className="w-4 h-4 mr-2" />
              Generar Ejercicios
            </>
          )}
        </Button>
      </CardContent>
    </Card>
  );
};
