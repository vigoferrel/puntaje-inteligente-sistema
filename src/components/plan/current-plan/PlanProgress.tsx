
import React from "react";
import { Progress } from "@/components/ui/progress";
import { CardContent } from "@/components/ui/card";
import { LearningPlan, PlanProgress as PlanProgressType } from "@/types/learning-plan";
import { PieChart, Pie, Cell, ResponsiveContainer, Label } from "recharts";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { CalendarIcon, BookOpenIcon, AwardIcon, ClockIcon } from "lucide-react";

interface PlanProgressProps {
  progress: PlanProgressType | null;
  plan: LearningPlan;
}

export function PlanProgress({ progress, plan }: PlanProgressProps) {
  const formatDate = (dateString: string | null) => {
    if (!dateString) return "No establecida";
    try {
      const date = new Date(dateString);
      return new Intl.DateTimeFormat("es-ES", {
        day: "numeric",
        month: "long",
        year: "numeric",
      }).format(date);
    } catch (e) {
      console.error("Error formatting date:", e);
      return "Fecha inválida";
    }
  };

  // Calculate days left
  const getDaysLeft = () => {
    if (!plan.targetDate) return null;
    
    try {
      const targetDate = new Date(plan.targetDate);
      const today = new Date();
      const diffTime = targetDate.getTime() - today.getTime();
      const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
      return diffDays > 0 ? diffDays : 0;
    } catch (e) {
      return null;
    }
  };

  const daysLeft = getDaysLeft();
  
  // Prepare data for pie chart
  const chartData = progress ? [
    { name: 'Completado', value: progress.completedNodes },
    { name: 'En progreso', value: progress.inProgressNodes },
    { name: 'No iniciado', value: progress.totalNodes - (progress.completedNodes + progress.inProgressNodes) }
  ] : [
    { name: 'No hay datos', value: 1 }
  ];
  
  const COLORS = ['#4ade80', '#93c5fd', '#e5e7eb'];

  return (
    <CardContent className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="col-span-1 md:col-span-1">
          <ResponsiveContainer width="100%" height={150}>
            <PieChart>
              <Pie
                data={chartData}
                cx="50%"
                cy="50%"
                innerRadius={40}
                outerRadius={60}
                paddingAngle={2}
                dataKey="value"
              >
                {chartData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
                <Label
                  value={`${Math.round(progress?.overallProgress || 0)}%`}
                  position="center"
                  fill="#374151"
                  style={{ fontSize: '20px', fontWeight: 'bold' }}
                />
              </Pie>
            </PieChart>
          </ResponsiveContainer>
        </div>
        
        <div className="col-span-1 md:col-span-3 flex flex-col justify-center">
          <div className="space-y-2">
            <div className="flex justify-between text-sm">
              <span className="text-muted-foreground">Progreso general</span>
              <span className="font-medium">
                {progress ? 
                  `${Math.round(progress.overallProgress)}%` : 
                  "0%"
                }
              </span>
            </div>
            <Progress
              value={progress ? progress.overallProgress : 0}
              className="h-2"
            />
            
            <div className="grid grid-cols-2 md:grid-cols-4 gap-2 pt-2">
              <div className="flex items-center text-xs">
                <BookOpenIcon className="h-3 w-3 mr-1 text-green-500" />
                <span className="text-muted-foreground">
                  {progress ?
                    `${progress.completedNodes}/${progress.totalNodes} completados` :
                    "0/0 completados"
                  }
                </span>
              </div>
              
              <div className="flex items-center text-xs">
                <AwardIcon className="h-3 w-3 mr-1 text-blue-500" />
                <span className="text-muted-foreground">
                  {progress ?
                    `${progress.inProgressNodes} en progreso` :
                    "0 en progreso"
                  }
                </span>
              </div>
              
              <div className="flex items-center text-xs">
                <CalendarIcon className="h-3 w-3 mr-1 text-orange-500" />
                <span className="text-muted-foreground">
                  Meta: {formatDate(plan.targetDate)}
                </span>
              </div>
              
              <div className="flex items-center text-xs">
                <ClockIcon className="h-3 w-3 mr-1 text-purple-500" />
                <span className="text-muted-foreground">
                  {daysLeft !== null ? `${daysLeft} días restantes` : "Sin fecha límite"}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
      
      {daysLeft !== null && daysLeft < 7 && daysLeft > 0 && (
        <Alert variant="destructive" className="mt-4">
          <AlertDescription>
            ¡Quedan solo {daysLeft} días para alcanzar tu meta! Incrementa tu ritmo de estudio.
          </AlertDescription>
        </Alert>
      )}
    </CardContent>
  );
}
