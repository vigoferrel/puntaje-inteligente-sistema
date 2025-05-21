
import React from "react";
import { Card, CardHeader, CardFooter, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { LearningPlan } from "@/types/learning-plan";

interface PlanSelectorProps {
  plans: LearningPlan[];
  currentPlanId?: string;
  onSelectPlan: (plan: LearningPlan) => void;
}

export const PlanSelector = ({ plans, currentPlanId, onSelectPlan }: PlanSelectorProps) => {
  if (plans.length <= 1) return null;
  
  const otherPlans = plans.filter(plan => plan.id !== currentPlanId);
  
  if (otherPlans.length === 0) return null;
  
  return (
    <div className="space-y-4">
      <h2 className="text-xl font-semibold">Otros planes disponibles</h2>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {otherPlans.map(plan => (
          <Card 
            key={plan.id} 
            className="cursor-pointer hover:border-primary/50 transition-colors"
            onClick={() => onSelectPlan(plan)}
          >
            <CardHeader>
              <CardTitle className="text-lg">{plan.title}</CardTitle>
              <CardDescription className="line-clamp-2">{plan.description}</CardDescription>
            </CardHeader>
            <CardFooter>
              <Button variant="outline" className="w-full" onClick={() => onSelectPlan(plan)}>
                Seleccionar Plan
              </Button>
            </CardFooter>
          </Card>
        ))}
      </div>
    </div>
  );
};
