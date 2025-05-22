
import React from "react";
import { LearningPlan } from "@/types/learning-plan";
import { Card, CardContent } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import { CalendarDays, CheckCircle, Clock } from "lucide-react";
import { motion } from "framer-motion";

interface PlanSelectorProps {
  plans: LearningPlan[];
  currentPlanId?: string;
  onSelectPlan: (plan: LearningPlan) => void;
}

export const PlanSelector = ({ plans, currentPlanId, onSelectPlan }: PlanSelectorProps) => {
  // Ensure we have valid plans array
  const validPlans = Array.isArray(plans) ? plans : [];
  
  if (validPlans.length <= 1) {
    return null; // No need for selector if there's only one plan
  }
  
  const formatDate = (dateString: string) => {
    try {
      const date = new Date(dateString);
      return new Intl.DateTimeFormat("es-ES", {
        day: "numeric",
        month: "short",
        year: "numeric"
      }).format(date);
    } catch (e) {
      console.error("Error formatting date:", e);
      return "Fecha inválida";
    }
  };
  
  return (
    <div>
      <h2 className="text-xl font-semibold mb-4">Mis planes de estudio</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {validPlans.map((plan, index) => (
          <motion.div
            key={plan.id || index}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, delay: index * 0.1 }}
            whileHover={{ scale: 1.02 }}
          >
            <Card
              className={cn(
                "cursor-pointer transition-all duration-200 h-full border-2",
                plan.id === currentPlanId
                  ? "border-primary/40 bg-primary/5"
                  : "hover:border-primary/20"
              )}
              onClick={() => onSelectPlan(plan)}
            >
              <CardContent className="p-4">
                <div className="flex flex-col h-full">
                  <div className="mb-2 flex justify-between items-start">
                    <h3 className="font-semibold line-clamp-2">{plan.title || "Plan sin título"}</h3>
                    {plan.id === currentPlanId && (
                      <span className="flex items-center text-xs text-primary bg-primary/10 px-2 py-1 rounded-full">
                        <CheckCircle className="h-3 w-3 mr-1" />
                        Activo
                      </span>
                    )}
                  </div>
                  
                  <p className="text-sm text-muted-foreground line-clamp-2 mb-3">
                    {plan.description || "Plan de estudio personalizado"}
                  </p>
                  
                  <div className="mt-auto space-y-2 text-xs text-muted-foreground">
                    {plan.createdAt && (
                      <div className="flex items-center">
                        <CalendarDays className="h-3.5 w-3.5 mr-1.5" />
                        <span>Creado: {formatDate(plan.createdAt)}</span>
                      </div>
                    )}
                    
                    <div className="flex items-center">
                      <Clock className="h-3.5 w-3.5 mr-1.5" />
                      <span>
                        {Array.isArray(plan.nodes) ? plan.nodes.length : 0} 
                        {plan.nodes && plan.nodes.length === 1 ? " módulo" : " módulos"}
                      </span>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </div>
    </div>
  );
};
