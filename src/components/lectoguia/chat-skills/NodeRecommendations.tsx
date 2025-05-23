
import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Brain, BookOpen, ArrowRight } from 'lucide-react';
import { TPAESHabilidad } from '@/types/system-types';
import { cn } from '@/lib/utils';

interface NodeRecommendationsProps {
  activeSkill?: TPAESHabilidad | null;
  recommendedNodes: any[];
  onNodeSelect: (nodeId: string) => void;
  className?: string;
}

const getSkillColor = (skill: string): string => {
  const skillColors: Record<string, string> = {
    'TRACK_LOCATE': 'bg-blue-100 text-blue-800 border-blue-300',
    'INTERPRET_RELATE': 'bg-indigo-100 text-indigo-800 border-indigo-300',
    'EVALUATE_REFLECT': 'bg-purple-100 text-purple-800 border-purple-300',
    'SOLVE_PROBLEMS': 'bg-emerald-100 text-emerald-800 border-emerald-300',
    'REPRESENT': 'bg-green-100 text-green-800 border-green-300',
    'MODEL': 'bg-teal-100 text-teal-800 border-teal-300',
    'ARGUE_COMMUNICATE': 'bg-cyan-100 text-cyan-800 border-cyan-300',
    'IDENTIFY_THEORIES': 'bg-amber-100 text-amber-800 border-amber-300',
    'PROCESS_ANALYZE': 'bg-yellow-100 text-yellow-800 border-yellow-300',
    'APPLY_PRINCIPLES': 'bg-orange-100 text-orange-800 border-orange-300',
    'SCIENTIFIC_ARGUMENT': 'bg-red-100 text-red-800 border-red-300',
    'TEMPORAL_THINKING': 'bg-pink-100 text-pink-800 border-pink-300',
    'SOURCE_ANALYSIS': 'bg-rose-100 text-rose-800 border-rose-300',
    'MULTICAUSAL_ANALYSIS': 'bg-fuchsia-100 text-fuchsia-800 border-fuchsia-300',
    'CRITICAL_THINKING': 'bg-violet-100 text-violet-800 border-violet-300',
    'REFLECTION': 'bg-slate-100 text-slate-800 border-slate-300',
  };
  
  return skillColors[skill] || 'bg-gray-100 text-gray-800 border-gray-300';
};

const getDifficultyColor = (difficulty: string): string => {
  const difficultyColors: Record<string, string> = {
    'basic': 'bg-green-100 text-green-800',
    'intermediate': 'bg-yellow-100 text-yellow-800',
    'advanced': 'bg-red-100 text-red-800',
  };
  
  return difficultyColors[difficulty.toLowerCase()] || 'bg-blue-100 text-blue-800';
};

export const NodeRecommendations: React.FC<NodeRecommendationsProps> = ({
  activeSkill,
  recommendedNodes,
  onNodeSelect,
  className
}) => {
  // Filtrar nodos por habilidad activa si existe
  const filteredNodes = activeSkill 
    ? recommendedNodes.filter(node => node.skill?.code === activeSkill)
    : recommendedNodes;
  
  // Si no hay habilidad activa o nodos que mostrar, no renderizar
  if (!activeSkill && filteredNodes.length === 0) return null;
  if (filteredNodes.length === 0 && recommendedNodes.length === 0) return null;
  
  // Mostrar los nodos filtrados o todos si hay habilidad pero no hay nodos filtrados
  const nodesToShow = filteredNodes.length > 0 ? filteredNodes : recommendedNodes.slice(0, 3);
  
  return (
    <div className={cn("my-3 space-y-3", className)}>
      {activeSkill && (
        <div className="flex items-center gap-2 mb-2">
          <Brain className="h-4 w-4 text-primary" />
          <span className="text-sm font-medium">Trabajando en habilidad:</span>
          <Badge variant="outline" className={cn("font-mono", getSkillColor(activeSkill))}>
            {activeSkill}
          </Badge>
        </div>
      )}
      
      <div className="space-y-2">
        <h3 className="text-sm font-medium flex items-center gap-1.5">
          <BookOpen className="h-4 w-4" />
          {activeSkill 
            ? "Nodos de aprendizaje recomendados para esta habilidad:"
            : "Nodos de aprendizaje recomendados:"}
        </h3>
        
        <div className="grid grid-cols-1 gap-2">
          {nodesToShow.map((node) => (
            <Card key={node.id} className="overflow-hidden border border-border bg-card/50">
              <CardContent className="p-3">
                <div className="flex justify-between items-start gap-2">
                  <div className="space-y-1.5">
                    <h4 className="font-medium text-sm leading-tight">{node.title}</h4>
                    <div className="flex flex-wrap gap-1.5 text-xs">
                      {node.skill?.code && (
                        <Badge variant="outline" className={cn("font-mono text-[10px]", getSkillColor(node.skill.code))}>
                          {node.skill.code}
                        </Badge>
                      )}
                      {node.difficulty && (
                        <Badge className={getDifficultyColor(node.difficulty)}>
                          {node.difficulty}
                        </Badge>
                      )}
                    </div>
                    {node.description && (
                      <p className="text-xs text-muted-foreground line-clamp-2">{node.description}</p>
                    )}
                  </div>
                  <Button 
                    size="sm" 
                    variant="secondary"
                    className="h-8 shrink-0"
                    onClick={() => onNodeSelect(node.id)}
                  >
                    Practicar
                    <ArrowRight className="ml-1 h-3.5 w-3.5" />
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
};
