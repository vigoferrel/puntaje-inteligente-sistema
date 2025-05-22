
import React, { useEffect, useState } from "react";
import { Card, CardHeader, CardContent, CardFooter, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { CheckCircle } from "lucide-react";
import { LearningPlan } from "@/types/learning-plan";
import { PlanMetrics } from "./PlanMetrics";
import { PlanNodesList } from "./PlanNodesList";
import { getNextRecommendedNode, getPlanSkillDistribution } from "@/services/plan-service";
import { TPAESHabilidad, getHabilidadDisplayName } from "@/types/system-types";

interface CurrentPlanProps {
  plan: LearningPlan;
  planProgress: {
    totalNodes: number;
    completedNodes: number;
    inProgressNodes: number;
    overallProgress: number;
  } | null;
  hasMultiplePlans: boolean;
  onNavigateToTraining: () => void;
  onNavigateHome: () => void;
}

export const CurrentPlan = ({
  plan,
  planProgress,
  hasMultiplePlans,
  onNavigateToTraining,
  onNavigateHome,
}: CurrentPlanProps) => {
  const [skillDistribution, setSkillDistribution] = useState<Record<TPAESHabilidad, number>>({});
  const [loading, setLoading] = useState(false);
  const [recommendedNodeId, setRecommendedNodeId] = useState<string | null>(null);
  
  useEffect(() => {
    const loadPlanDetails = async () => {
      if (plan) {
        setLoading(true);
        try {
          // Obtener distribución de habilidades en el plan
          const distribution = await getPlanSkillDistribution(plan.id);
          setSkillDistribution(distribution);
          
          // Obtener próximo nodo recomendado
          const nextNodeId = await getNextRecommendedNode(plan.userId, plan.id);
          setRecommendedNodeId(nextNodeId);
        } catch (error) {
          console.error("Error loading plan details:", error);
        } finally {
          setLoading(false);
        }
      }
    };
    
    loadPlanDetails();
  }, [plan]);
  
  // Encontrar el nodo recomendado en la lista de nodos
  const recommendedNode = plan.nodes.find(node => node.nodeId === recommendedNodeId);
  
  return (
    <Card className="border-primary/20">
      <CardHeader>
        <div className="flex justify-between items-start">
          <div>
            <CardTitle>{plan.title}</CardTitle>
            <CardDescription>{plan.description}</CardDescription>
          </div>
          {hasMultiplePlans && (
            <Button variant="outline" size="sm">
              Cambiar Plan
            </Button>
          )}
        </div>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Plan Overview */}
        <PlanMetrics 
          targetDate={plan.targetDate}
          nodesCount={plan.nodes.length}
          progress={planProgress?.overallProgress || 0}
        />
        
        {/* Habilidades en este plan */}
        {Object.keys(skillDistribution).length > 0 && (
          <div className="mt-4">
            <h3 className="text-sm font-medium mb-2">Habilidades en este plan</h3>
            <div className="flex flex-wrap gap-2">
              {Object.entries(skillDistribution).map(([skill, count]) => (
                <div 
                  key={skill} 
                  className="bg-secondary text-secondary-foreground text-xs px-2 py-1 rounded-full"
                >
                  {getHabilidadDisplayName(skill as TPAESHabilidad)} ({count})
                </div>
              ))}
            </div>
          </div>
        )}
        
        {/* Próximo módulo recomendado */}
        {recommendedNode && (
          <div className="bg-primary/5 p-3 rounded-lg">
            <h3 className="text-sm font-medium mb-1">Próximo módulo recomendado</h3>
            <p className="text-sm font-bold">{recommendedNode.nodeName}</p>
            {recommendedNode.nodeSkill && (
              <p className="text-xs text-muted-foreground">
                Habilidad: {getHabilidadDisplayName(recommendedNode.nodeSkill as TPAESHabilidad)}
              </p>
            )}
          </div>
        )}
        
        <Separator />
        
        {/* Plan Nodes */}
        <PlanNodesList 
          nodes={plan.nodes} 
          recommendedNodeId={recommendedNodeId}
          progress={planProgress}
        />
      </CardContent>
      <CardFooter className="flex justify-between">
        <Button variant="outline" onClick={onNavigateHome}>
          Volver al Dashboard
        </Button>
        <Button onClick={onNavigateToTraining}>
          <CheckCircle className="h-4 w-4 mr-2" />
          Iniciar Estudio
        </Button>
      </CardFooter>
    </Card>
  );
};
