
import React from "react";
import { AppLayout } from "@/components/app-layout";
import { StudyPlan } from "@/components/dashboard/study-plan";
import { LearningWorkflow } from "@/components/dashboard/learning-workflow";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { useAuth } from "@/contexts/AuthContext";
import { usePlanInitialization } from "@/hooks/use-plan-initialization";
import { Button } from "@/components/ui/button";
import { Plus, Sparkles } from "lucide-react";
import { useState } from "react";
import { PlanGeneratorModal } from "@/components/plan-generator";

const Dashboard = () => {
  const { profile } = useAuth();
  const { 
    plans, 
    currentPlan, 
    loading, 
    initializing,
    handlePlanSelect,
    getPlanProgress 
  } = usePlanInitialization();
  
  const [showPlanGenerator, setShowPlanGenerator] = useState(false);

  const handleCreatePlan = () => {
    setShowPlanGenerator(true);
  };

  const handlePlanCreated = (newPlan: any) => {
    // In a real implementation, this would refresh the plans
    console.log('Plan created:', newPlan);
    setShowPlanGenerator(false);
  };

  const currentPlanProgress = currentPlan ? getPlanProgress(currentPlan.id) : null;

  if (initializing) {
    return (
      <AppLayout>
        <div className="container mx-auto py-6 px-4">
          <div className="animate-pulse space-y-6">
            <div className="h-8 bg-gray-200 rounded w-1/3"></div>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <div className="h-64 bg-gray-200 rounded"></div>
              <div className="h-64 bg-gray-200 rounded"></div>
            </div>
          </div>
        </div>
      </AppLayout>
    );
  }

  return (
    <AppLayout>
      <div className="container mx-auto py-6 px-4 space-y-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">
              Hola, {profile?.name || 'Estudiante'} 👋
            </h1>
            <p className="text-muted-foreground">
              Aquí tienes un resumen de tu progreso de aprendizaje
            </p>
          </div>
          
          <Button onClick={handleCreatePlan} className="flex items-center gap-2">
            <Sparkles className="h-4 w-4" />
            Generar Plan
          </Button>
        </div>

        {/* Quick Stats */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center space-x-2">
                <div className="h-2 w-2 bg-green-500 rounded-full"></div>
                <span className="text-sm font-medium">Planes Activos</span>
              </div>
              <p className="text-2xl font-bold mt-1">{plans.length}</p>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center space-x-2">
                <div className="h-2 w-2 bg-blue-500 rounded-full"></div>
                <span className="text-sm font-medium">Progreso General</span>
              </div>
              <p className="text-2xl font-bold mt-1">
                {currentPlanProgress ? Math.round(currentPlanProgress.overallProgress) : 0}%
              </p>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center space-x-2">
                <div className="h-2 w-2 bg-purple-500 rounded-full"></div>
                <span className="text-sm font-medium">Nodos Completados</span>
              </div>
              <p className="text-2xl font-bold mt-1">
                {currentPlanProgress ? currentPlanProgress.completedNodes : 0}
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Main Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Study Plan Section */}
          <StudyPlan />
          
          {/* Learning Workflow Section */}
          <LearningWorkflow />
        </div>

        {/* Plan Generator Modal */}
        <PlanGeneratorModal
          open={showPlanGenerator}
          onOpenChange={setShowPlanGenerator}
          onPlanCreated={handlePlanCreated}
        />
      </div>
    </AppLayout>
  );
};

export default Dashboard;
