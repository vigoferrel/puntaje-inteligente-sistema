
import React, { useState } from "react";
import { motion } from "framer-motion";
import { LearningPlanNode, PlanProgress } from "@/types/learning-plan";
import { PlanNodeItem } from "./PlanNodeItem";
import { getNodeStatus } from "./node-status-utils";
import { Badge } from "@/components/ui/badge";
import { Filter, BookOpen, CheckCircle, Clock } from "lucide-react";
import { Button } from "@/components/ui/button";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";

interface PlanNodesListContainerProps {
  nodes: LearningPlanNode[];
  recommendedNodeId: string | null;
  progress: PlanProgress | null;
}

export const PlanNodesListContainer = ({ 
  nodes, 
  recommendedNodeId, 
  progress 
}: PlanNodesListContainerProps) => {
  const [filter, setFilter] = useState<string | null>(null);
  const [sortBy, setSortBy] = useState<'position' | 'difficulty' | 'progress'>('position');
  
  if (!nodes || nodes.length === 0) {
    return (
      <div className="text-center py-8 text-muted-foreground">
        <p>No hay módulos disponibles en este plan.</p>
      </div>
    );
  }
  
  // Filter nodes based on selected filter
  const filteredNodes = filter 
    ? nodes.filter(node => {
        if (filter === 'completed' && progress?.nodeProgress) {
          return progress.nodeProgress[node.nodeId] === 100;
        }
        if (filter === 'in-progress' && progress?.nodeProgress) {
          return progress.nodeProgress[node.nodeId] > 0 && progress.nodeProgress[node.nodeId] < 100;
        }
        if (filter === 'not-started' && progress?.nodeProgress) {
          return !progress.nodeProgress[node.nodeId];
        }
        if (filter === 'recommended') {
          return node.nodeId === recommendedNodeId;
        }
        if (filter === 'basic' || filter === 'intermediate' || filter === 'advanced') {
          return node.nodeDifficulty === filter;
        }
        return true;
      })
    : nodes;
    
  // Sort nodes based on selected criterion
  const sortedNodes = [...filteredNodes].sort((a, b) => {
    if (sortBy === 'position') {
      return a.position - b.position;
    }
    if (sortBy === 'difficulty') {
      const difficultyOrder = { basic: 1, intermediate: 2, advanced: 3 };
      return (difficultyOrder[a.nodeDifficulty as keyof typeof difficultyOrder] || 0) - 
             (difficultyOrder[b.nodeDifficulty as keyof typeof difficultyOrder] || 0);
    }
    if (sortBy === 'progress' && progress?.nodeProgress) {
      return (progress.nodeProgress[b.nodeId] || 0) - (progress.nodeProgress[a.nodeId] || 0);
    }
    return 0;
  });
  
  // Calculate study stats
  const totalTimeSpent = progress ? 
    Object.values(sortedNodes).reduce((sum, node) => {
      const nodeProgress = progress.nodeProgress?.[node.nodeId] || 0;
      return sum + (nodeProgress > 0 ? 30 : 0); // Assuming 30 min per started node
    }, 0) : 0;
  
  // Completed nodes count
  const completedNodesCount = progress?.nodeProgress ? 
    Object.entries(progress.nodeProgress).filter(([, value]) => value === 100).length : 0;
  
  // Animation for the list
  const container = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  };
  
  return (
    <div className="space-y-4">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-3">
        <h3 className="font-medium text-lg">Módulos de estudio</h3>
        
        <div className="flex flex-wrap gap-2 items-center">
          {/* Study statistics badges */}
          <Badge variant="outline" className="flex items-center gap-1">
            <BookOpen className="h-3 w-3" />
            <span>{nodes.length} módulos</span>
          </Badge>
          
          <Badge variant="outline" className="flex items-center gap-1">
            <CheckCircle className="h-3 w-3" />
            <span>{completedNodesCount} completados</span>
          </Badge>
          
          <Badge variant="outline" className="flex items-center gap-1">
            <Clock className="h-3 w-3" />
            <span>{totalTimeSpent} min. estudiados</span>
          </Badge>
          
          {/* Filters dropdown */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" size="sm" className="flex items-center gap-1">
                <Filter className="h-3 w-3" />
                {filter ? `Filtro: ${filter}` : "Filtrar"}
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem onClick={() => setFilter(null)}>
                Todos los módulos
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => setFilter('recommended')}>
                Recomendados
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => setFilter('not-started')}>
                No iniciados
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => setFilter('in-progress')}>
                En progreso
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => setFilter('completed')}>
                Completados
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => setFilter('basic')}>
                Dificultad: Básico
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => setFilter('intermediate')}>
                Dificultad: Intermedio
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => setFilter('advanced')}>
                Dificultad: Avanzado
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
          
          {/* Sort dropdown */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" size="sm">
                Ordenar
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem onClick={() => setSortBy('position')}>
                Por posición
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => setSortBy('difficulty')}>
                Por dificultad
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => setSortBy('progress')}>
                Por progreso
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
      
      {filteredNodes.length === 0 ? (
        <div className="text-center py-8 text-muted-foreground border rounded-md p-4">
          <p>No hay módulos que coincidan con el filtro seleccionado.</p>
          <Button 
            variant="link" 
            onClick={() => setFilter(null)}
            className="mt-2"
          >
            Ver todos los módulos
          </Button>
        </div>
      ) : (
        <motion.div 
          className="space-y-3"
          variants={container}
          initial="hidden"
          animate="show"
        >
          {sortedNodes.map((node, index) => {
            const nodeStatus = getNodeStatus(node.nodeId, index, progress, recommendedNodeId);
            
            return (
              <PlanNodeItem 
                key={node.id || index} 
                node={node} 
                index={index}
                status={nodeStatus.status}
                statusLabel={nodeStatus.label}
                progressValue={nodeStatus.progress}
                isRecommended={node.nodeId === recommendedNodeId}
              />
            );
          })}
        </motion.div>
      )}
    </div>
  );
};
