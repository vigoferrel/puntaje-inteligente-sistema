/* eslint-disable react-refresh/only-export-components */
import { FC, useState } from 'react';
import '@/styles/CinematicAnimations.css';

import { Badge } from '../../components/ui/badge';
import { Button } from '../../components/ui/button';
import { Card, CardContent, CardHeader } from '../../components/ui/card';
import { Progress } from '../../components/ui/progress';
import { ScrollArea } from '../../components/ui/scroll-area';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '../../components/ui/collapsible';
import { 
  Target, 
  ChevronDown, 
  ChevronRight,
  Clock,
  Brain,
  Zap,
  CheckCircle,
  Circle,
  Play
} from 'lucide-react';

interface Node {
  id: string;
  title: string;
  status: 'completed' | 'in_progress' | 'pending';
  difficulty: string;
  tier: string;
  progress: number;
  estimatedTimeMinutes: number;
  dependsOn?: string[];
}

interface Test {
  id: string;
  code: string;
  name: string;
}

interface Constellation {
  test: Test;
  nodes: Node[];
  completionRate: number;
  color: string;
}

interface OptimalPathSidebarProps {
  constellations: Constellation[];
  selectedNode: string | null;
  viewMode: { mode: string; focus?: string };
  onNodeClick: (nodeId: string) => void;
  onConstellationFocus: (testCode: string) => void;
  onViewModeChange: (mode: unknown) => void;
}

export const OptimalPathSidebar: FC<OptimalPathSidebarProps> = ({
  constellations,
  selectedNode,
  viewMode,
  onNodeClick,
  onConstellationFocus,
  onViewModeChange
}) => {
  const [expandedTests, setExpandedTests] = useState<string[]>(['COMPETENCIA_LECTORA']);

  const toggleTest = (testCode: string) => {
    setExpandedTests(prev => 
      prev.includes(testCode) 
        ? prev.filter(t => t !== testCode)
        : [...prev, testCode]
    );
  };

  const getOptimalPath = (nodes: Node[]) => {
    // Ordenar nodos por tier crÃ­tico y dependencias
    return nodes
      .filter(node => node.difficulty === 'advanced' || node.tier === 'tier1_critico')
      .sort((a, b) => {
        if (a.tier === 'tier1_critico' && b.tier !== 'tier1_critico') return -1;
        if (b.tier === 'tier1_critico' && a.tier !== 'tier1_critico') return 1;
        return (a.dependsOn?.length || 0) - (b.dependsOn?.length || 0);
      })
      .slice(0, 5); // Top 5 nodos crÃ­ticos
  };

  const getTestIcon = (testCode: string) => {
    const icons = {
      'COMPETENCIA_LECTORA': 'ðŸ“–',
      'MATEMATICA_1': 'ðŸ“Š',
      'MATEMATICA_2': 'ðŸ”¢',
      'CIENCIAS': 'ðŸ”¬',
      'HISTORIA': 'ðŸ“œ'
    };
    return icons[testCode as keyof typeof icons] || 'ðŸ“š';
  };

  const getTotalEstimatedTime = (nodes: Node[]) => {
    return nodes.reduce((total, node) => total + (node.estimatedTimeMinutes || 0), 0);
  };

  return (
    <div className="w-80 h-full bg-slate-900 border-r border-slate-700 overflow-hidden flex flex-col">
      {/* Header */}
      <div className="p-4 border-b border-slate-700">
        <div className="flex items-center space-x-2 mb-3">
          <Target className="w-5 h-5 text-blue-400" />
          <h2 className="text-lg font-bold text-white">Planes Ã“ptimos PAES</h2>
        </div>
        <div className="text-sm text-slate-400">
          Rutas de aprendizaje inteligentes por prueba
        </div>
      </div>

      {/* Controls RÃ¡pidos */}
      <div className="p-4 border-b border-slate-700">
        <div className="grid grid-cols-3 gap-2">
          <Button
            variant={viewMode.mode === 'galaxy' ? 'default' : 'outline'}
            size="sm"
            className="text-xs"
            onClick={() => onViewModeChange({ mode: 'galaxy' })}
          >
            ðŸŒŒ Galaxia
          </Button>
          <Button
            variant={viewMode.mode === 'constellation' ? 'default' : 'outline'}
            size="sm"
            className="text-xs"
            onClick={() => onViewModeChange({ mode: 'constellation' })}
          >
            â­ ConstelaciÃ³n
          </Button>
          <Button
            variant={viewMode.mode === 'pathway' ? 'default' : 'outline'}
            size="sm"
            className="text-xs"
            onClick={() => onViewModeChange({ mode: 'pathway' })}
          >
            ðŸ›¤ï¸ Rutas
          </Button>
        </div>
      </div>

      {/* Lista de Pruebas con Planes Ã“ptimos */}
      <ScrollArea className="flex-1">
        <div className="p-4 space-y-3">
          {constellations.map((constellation) => {
            const isExpanded = expandedTests.includes(constellation.test.code);
            const optimalPath = getOptimalPath(constellation.nodes);
            const totalTime = getTotalEstimatedTime(optimalPath);
            
            return (
              <Card key={constellation.test.id} className="bg-slate-800 border-slate-700">
                <Collapsible open={isExpanded} onOpenChange={() => toggleTest(constellation.test.code)}>
                  <CollapsibleTrigger asChild>
                    <CardHeader className="p-3 cursor-pointer hover:bg-slate-700/50 transition-colors">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-2">
                          <span className="text-lg">{getTestIcon(constellation.test.code)}</span>
                          <div>
                            <div className="text-sm font-medium text-white">
                              {constellation.test.name}
                            </div>
                            <div className="text-xs text-slate-400">
                              {constellation.nodes.length} nodos â€¢ {Math.round(constellation.completionRate * 100)}% completado
                            </div>
                          </div>
                        </div>
                        <div className="flex items-center space-x-2">
                          <Badge
                            className="text-xs dynamic-bg"
                            data-dynamic-bg={constellation.color}
                          >
                            {optimalPath.length} crÃ­ticos
                          </Badge>
                          {isExpanded ? <ChevronDown className="w-4 h-4 w-4 h-4" />}
                        </div>
                      </div>
                      
                      <Progress
                        value={constellation.completionRate * 100}
                        className="h-2 dynamic-progress-color"
                        data-progress-color={constellation.color}
                      />
                    </CardHeader>
                  </CollapsibleTrigger>
                  
                  <CollapsibleContent>
                    <CardContent className="p-3 pt-0">
                      <div className="mb-3 flex items-center justify-between">
                        <div className="text-xs text-slate-400 flex items-center space-x-4">
                          <span className="flex items-center space-x-1">
                            <Clock className="w-3 h-3" />
                            <span>{totalTime}min</span>
                          </span>
                          <span className="flex items-center space-x-1">
                            <Brain className="w-3 h-3" />
                            <span>Plan Ã“ptimo</span>
                          </span>
                        </div>
                        <Button
                          size="sm"
                          variant="outline"
                          className="text-xs border-slate-600 text-slate-300 hover:bg-slate-700"
                          onClick={() => onConstellationFocus(constellation.test.code)}
                        >
                          <Target className="w-3 h-3 mr-1" />
                          Enfocar
                        </Button>
                      </div>
                      
                      <div className="space-y-2">
                        {optimalPath.map((node, index) => (
                          <div
                            key={node.id}
                            className={`p-2 rounded border cursor-pointer transition-all ${
                              selectedNode === node.id
                                ? 'border-blue-500 bg-blue-500/10'
                                : 'border-slate-600 hover:border-slate-500 hover:bg-slate-700/50'
                            }`}
                            onClick={() => onNodeClick(node.id)}
                          >
                            <div className="flex items-center justify-between">
                              <div className="flex items-center space-x-2">
                                <div className="flex items-center space-x-1">
                                  <span className="text-xs font-medium text-slate-400">
                                    {index + 1}.
                                  </span>
                                  {node.status === 'completed' ? (
                                    <CheckCircle className="w-3 h-3 text-green-400" />
                                  ) : node.status === 'in_progress' ? (
                                    <Play className="w-3 h-3 text-yellow-400" />
                                  ) : (
                                    <Circle className="w-3 h-3 text-slate-500" />
                                  )}
                                </div>
                                <div>
                                  <div className="text-xs font-medium text-white truncate">
                                    {node.title}
                                  </div>
                                  <div className="text-xs text-slate-400">
                                    {node.estimatedTimeMinutes}min â€¢ {node.difficulty}
                                  </div>
                                </div>
                              </div>
                              
                              <div className="flex items-center space-x-1">
                                {node.tier === 'tier1_critico' && (
                                  <Badge variant="destructive" className="text-xs px-1 py-0">
                                    T1
                                  </Badge>
                                )}
                                <div className="text-xs text-slate-400">
                                  {node.progress || 0}%
                                </div>
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                      
                      {constellation.nodes.length > optimalPath.length && (
                        <Button
                          variant="ghost"
                          size="sm"
                          className="w-full mt-2 text-xs text-slate-400 hover:text-white"
                          onClick={() => onConstellationFocus(constellation.test.code)}
                        >
                          Ver todos los {constellation.nodes.length} nodos
                        </Button>
                      )}
                    </CardContent>
                  </CollapsibleContent>
                </Collapsible>
              </Card>
            );
          })}
        </div>
      </ScrollArea>
      
      {/* Footer con EstadÃ­sticas */}
      <div className="p-4 border-t border-slate-700">
        <div className="text-xs text-slate-400 space-y-1">
          <div className="flex justify-between">
            <span>Total Constelaciones:</span>
            <span className="text-white">{constellations.length}</span>
          </div>
          <div className="flex justify-between">
            <span>Nodos CrÃ­ticos:</span>
            <span className="text-red-400">
              {constellations.reduce((total, c) =>
                total + c.nodes.filter((n: Node) => n.tier === 'tier1_critico').length, 0
              )}
            </span>
          </div>
          <div className="flex justify-between">
            <span>Modo Actual:</span>
            <span className="text-blue-400 capitalize">{viewMode.mode}</span>
          </div>
        </div>
      </div>
    </div>
  );
};



