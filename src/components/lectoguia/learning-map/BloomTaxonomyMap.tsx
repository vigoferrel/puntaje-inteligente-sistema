
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { TLearningNode, TPAESHabilidad, TPAESPrueba } from '@/types/system-types';
import { NodeProgress } from '@/types/node-progress';

interface BloomTaxonomyMapProps {
  nodes: TLearningNode[];
  nodeProgress: Record<string, NodeProgress>;
  skillLevels: Record<TPAESHabilidad, number>;
  selectedPrueba: TPAESPrueba;
  onNodeSelect: (nodeId: string) => void;
}

// Mapeo de niveles de Bloom
const BLOOM_LEVELS = [
  { name: 'Recordar', description: 'Recuperar información relevante', color: 'bg-red-100 text-red-800' },
  { name: 'Comprender', description: 'Construir significado a partir de la información', color: 'bg-orange-100 text-orange-800' },
  { name: 'Aplicar', description: 'Usar procedimientos para resolver problemas', color: 'bg-yellow-100 text-yellow-800' },
  { name: 'Analizar', description: 'Descomponer en partes y examinar relaciones', color: 'bg-green-100 text-green-800' },
  { name: 'Evaluar', description: 'Hacer juicios basados en criterios', color: 'bg-blue-100 text-blue-800' },
  { name: 'Crear', description: 'Producir un trabajo original', color: 'bg-purple-100 text-purple-800' }
];

export const BloomTaxonomyMap: React.FC<BloomTaxonomyMapProps> = ({
  nodes,
  nodeProgress,
  skillLevels,
  selectedPrueba,
  onNodeSelect
}) => {
  // Simular distribución de nodos por nivel de Bloom
  const getBloomDistribution = () => {
    const distribution = BLOOM_LEVELS.map(level => ({
      ...level,
      nodes: nodes.filter(() => Math.random() > 0.7), // Simulación temporal
      progress: Math.random() * 100
    }));
    return distribution;
  };

  const bloomData = getBloomDistribution();

  return (
    <div className="space-y-6">
      <div className="text-center space-y-2">
        <h3 className="text-2xl font-bold">Taxonomía de Bloom</h3>
        <p className="text-muted-foreground">
          Progresa a través de los niveles cognitivos de aprendizaje
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {bloomData.map((level, index) => (
          <Card key={level.name} className="overflow-hidden">
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <CardTitle className="text-lg">{level.name}</CardTitle>
                <Badge className={level.color}>
                  Nivel {index + 1}
                </Badge>
              </div>
              <p className="text-sm text-muted-foreground">{level.description}</p>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <div className="flex justify-between text-sm">
                  <span>Progreso</span>
                  <span>{Math.round(level.progress)}%</span>
                </div>
                <Progress value={level.progress} className="h-2" />
                <div className="text-sm text-muted-foreground">
                  {level.nodes.length} nodos disponibles
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
};
