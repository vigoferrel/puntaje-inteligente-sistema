
import React from "react";
import { motion } from "framer-motion";
import { LearningPlanNode } from "@/types/learning-plan";
import { Card, CardContent } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Sparkles, BookOpen, Star, BarChart2, ArrowRight } from "lucide-react";
import { useNavigate } from "react-router-dom";

interface PlanNodeItemProps {
  node: LearningPlanNode;
  index: number;
  status: 'not_started' | 'in_progress' | 'completed';
  statusLabel: string;
  progressValue: number;
  isRecommended: boolean;
}

export const PlanNodeItem = ({
  node,
  index,
  status,
  statusLabel,
  progressValue,
  isRecommended
}: PlanNodeItemProps) => {
  const navigate = useNavigate();
  
  // Determine status color
  const getStatusColor = () => {
    switch (status) {
      case 'completed':
        return "bg-green-100 text-green-800 border-green-200";
      case 'in_progress':
        return "bg-blue-100 text-blue-800 border-blue-200";
      default:
        return "bg-gray-100 text-gray-800 border-gray-200";
    }
  };
  
  // Determine difficulty color and icon
  const getDifficultyBadge = () => {
    switch (node.nodeDifficulty) {
      case 'advanced':
        return {
          color: "bg-red-100 text-red-800 border-red-200",
          label: "Avanzado"
        };
      case 'intermediate':
        return {
          color: "bg-orange-100 text-orange-800 border-orange-200",
          label: "Intermedio"
        };
      default:
        return {
          color: "bg-green-100 text-green-800 border-green-200",
          label: "Básico"
        };
    }
  };
  
  const difficultyBadge = getDifficultyBadge();
  
  // Get skill badge
  const getSkillBadge = () => {
    if (!node.nodeSkill) return null;
    
    return {
      label: node.nodeSkill,
      color: "bg-purple-100 text-purple-800 border-purple-200"
    };
  };
  
  const skillBadge = getSkillBadge();
  
  const item = {
    hidden: { y: 20, opacity: 0 },
    show: { y: 0, opacity: 1 }
  };
  
  // Handle node click to navigate to the node content
  const handleNodeClick = () => {
    // Navigate to node content (placeholder for now)
    navigate(`/node/${node.nodeId}`);
  };
  
  return (
    <motion.div
      variants={item}
      whileHover={{ scale: 1.01 }}
      transition={{ type: "spring", stiffness: 300 }}
    >
      <Card className={`overflow-hidden transition-all ${isRecommended ? 'border-primary border-2' : ''}`}>
        <CardContent className="p-0">
          <div className="grid grid-cols-1 md:grid-cols-8 gap-2">
            {/* Left section with position indicator */}
            <div className="md:col-span-1 flex md:flex-col items-center justify-center p-4 bg-muted">
              <div className="text-2xl font-bold">{node.position || index + 1}</div>
              {isRecommended && (
                <Sparkles className="h-5 w-5 text-primary mt-1" />
              )}
            </div>
            
            {/* Main content */}
            <div className="md:col-span-5 p-4">
              <div className="space-y-2">
                <div className="flex flex-wrap gap-2 mb-2">
                  <Badge variant="outline" className={getStatusColor()}>
                    {statusLabel}
                  </Badge>
                  
                  <Badge variant="outline" className={difficultyBadge.color}>
                    {difficultyBadge.label}
                  </Badge>
                  
                  {skillBadge && (
                    <Badge variant="outline" className={skillBadge.color}>
                      {skillBadge.label}
                    </Badge>
                  )}
                  
                  {isRecommended && (
                    <Badge variant="outline" className="bg-primary/20 text-primary border-primary/30">
                      Recomendado
                    </Badge>
                  )}
                </div>
                
                <h3 className="font-semibold text-lg">{node.nodeName || `Módulo ${index + 1}`}</h3>
                
                {node.nodeDescription && (
                  <p className="text-sm text-muted-foreground">{node.nodeDescription}</p>
                )}
                
                <div className="flex flex-col space-y-1 pt-2">
                  <div className="flex justify-between text-xs">
                    <span>Progreso</span>
                    <span>{Math.round(progressValue)}%</span>
                  </div>
                  <Progress value={progressValue} className="h-2" />
                </div>
              </div>
            </div>
            
            {/* Action buttons */}
            <div className="md:col-span-2 flex items-center justify-center p-4 bg-muted/50">
              <div className="flex flex-col gap-2 w-full">
                <Button 
                  onClick={handleNodeClick}
                  className="w-full"
                  variant={status === 'in_progress' ? "default" : "outline"}
                >
                  {status === 'completed' ? (
                    <>Repasar</>
                  ) : status === 'in_progress' ? (
                    <>Continuar</>
                  ) : (
                    <>Comenzar</>
                  )}
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
};
