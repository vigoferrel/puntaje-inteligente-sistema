
import React from "react";
import { LearningPlanNode } from "@/types/learning-plan";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { 
  BookOpenCheck, 
  BookOpen, 
  ChevronRight, 
  Star, 
  Clock, 
  BarChart,
  GraduationCap,
  Brain
} from "lucide-react";

interface PlanNodeItemProps {
  node: LearningPlanNode;
  index: number;
  status: 'not_started' | 'in_progress' | 'completed';
  statusLabel: string;
  progressValue: number;
  isRecommended?: boolean;
  timeSpent?: number; // tiempo en minutos
}

export const PlanNodeItem = ({
  node,
  index,
  status,
  statusLabel,
  progressValue,
  isRecommended = false,
  timeSpent = 0
}: PlanNodeItemProps) => {
  const navigate = useNavigate();
  
  const getStatusColor = () => {
    switch(status) {
      case 'completed': return "bg-green-100 text-green-700 border-green-200";
      case 'in_progress': return "bg-blue-100 text-blue-700 border-blue-200";
      default: return "bg-gray-100 text-gray-700 border-gray-200";
    }
  };
  
  const getDifficultyColor = () => {
    switch(node.nodeDifficulty) {
      case 'basic': return "bg-green-50 text-green-700";
      case 'intermediate': return "bg-yellow-50 text-yellow-700";
      case 'advanced': return "bg-red-50 text-red-700";
      default: return "bg-gray-50 text-gray-700";
    }
  };
  
  const getDifficultyLabel = () => {
    switch(node.nodeDifficulty) {
      case 'basic': return "Básico";
      case 'intermediate': return "Intermedio";
      case 'advanced': return "Avanzado";
      default: return "No definido";
    }
  };
  
  const getNodeIcon = () => {
    switch(status) {
      case 'completed': return <BookOpenCheck className="h-5 w-5 text-green-600" />;
      case 'in_progress': return <BookOpen className="h-5 w-5 text-blue-600" />;
      default: return <BookOpen className="h-5 w-5 text-gray-600" />;
    }
  };

  const getStatusBadge = () => {
    switch(status) {
      case 'completed': 
        return (
          <Badge className="bg-green-100 text-green-700 border-green-200 ml-2">
            Completado
          </Badge>
        );
      case 'in_progress': 
        return (
          <Badge className="bg-blue-100 text-blue-700 border-blue-200 ml-2">
            En progreso
          </Badge>
        );
      default: 
        return null;
    }
  };

  const getProgressIndicatorColor = () => {
    if (progressValue === 100) return "bg-green-600";
    if (progressValue > 50) return "bg-blue-600";
    if (progressValue > 0) return "bg-blue-500";
    return "bg-gray-400";
  };

  const formatTimeSpent = (minutes: number) => {
    if (minutes < 60) return `${minutes} min`;
    const hours = Math.floor(minutes / 60);
    const remainingMinutes = minutes % 60;
    return `${hours}h ${remainingMinutes > 0 ? `${remainingMinutes}m` : ''}`;
  };
  
  const handleNodeClick = () => {
    navigate(`/node/${node.nodeId}`);
  };
  
  const item = {
    hidden: { opacity: 0, y: 10 },
    show: { opacity: 1, y: 0 }
  };
  
  const recommendedStyles = isRecommended ? {
    boxShadow: '0 0 0 2px rgba(99, 102, 241, 0.7)',
    borderColor: 'rgb(99, 102, 241)',
  } : {};
  
  return (
    <motion.div
      variants={item}
      className={`rounded-lg border bg-card p-4 hover:shadow-md transition-all cursor-pointer relative ${isRecommended ? 'border-2 border-primary' : ''}`}
      style={recommendedStyles}
      onClick={handleNodeClick}
      whileHover={{ scale: 1.01 }}
    >
      {isRecommended && (
        <div className="absolute -top-2 -right-2 bg-primary text-white rounded-full px-2 py-1 text-xs flex items-center">
          <Star className="h-3 w-3 mr-1" />
          Recomendado
        </div>
      )}
      
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-3">
          <div className={`flex h-10 w-10 rounded-full ${status === 'completed' ? 'bg-green-100' : 'bg-primary/10'} items-center justify-center`}>
            {getNodeIcon()}
          </div>
          
          <div>
            <h4 className="font-medium flex items-center">
              {node.nodeName || `Módulo ${index + 1}`}
              {getStatusBadge()}
            </h4>
            <div className="flex items-center text-muted-foreground text-sm">
              <span>{node.nodeSkill || "Habilidad"}</span>
              <Badge variant="outline" className={`ml-2 text-xs ${getDifficultyColor()}`}>
                {getDifficultyLabel()}
              </Badge>
            </div>
          </div>
        </div>
        
        <Button variant="ghost" size="icon" asChild className="ml-auto">
          <div>
            <ChevronRight className="h-5 w-5" />
          </div>
        </Button>
      </div>
      
      <div className="mt-3 grid grid-cols-1 md:grid-cols-2 gap-2">
        <div>
          <div className="flex justify-between items-center text-xs mb-1">
            <span className={`font-medium ${isRecommended ? 'text-primary' : ''}`}>
              {statusLabel}
            </span>
            <span className="font-medium">
              {progressValue}%
            </span>
          </div>
          <Progress 
            value={progressValue} 
            className={`h-2 ${isRecommended ? 'bg-primary/20' : ''}`}
            indicatorClassName={getProgressIndicatorColor()}
          />
        </div>
        
        {status !== 'not_started' && (
          <div className="flex items-center justify-end gap-3 text-xs text-muted-foreground">
            {timeSpent > 0 && (
              <div className="flex items-center">
                <Clock className="h-3 w-3 mr-1" />
                <span>{formatTimeSpent(timeSpent)}</span>
              </div>
            )}
            
            {status === 'completed' && (
              <div className="flex items-center">
                <GraduationCap className="h-3 w-3 mr-1 text-green-600" />
                <span className="text-green-600">Dominado</span>
              </div>
            )}
          </div>
        )}
      </div>
      
      {isRecommended && (
        <div className="mt-3 bg-primary/5 rounded p-2 text-xs text-primary border border-primary/20">
          <div className="flex items-center">
            <Brain className="h-3 w-3 mr-1" />
            <span className="font-medium">Sugerido para ti</span>
          </div>
          <p className="mt-1">
            Este módulo es ideal para continuar tu progreso basado en tu rendimiento actual.
          </p>
        </div>
      )}
    </motion.div>
  );
};
