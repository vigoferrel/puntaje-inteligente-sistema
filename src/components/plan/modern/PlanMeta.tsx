
import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Slider } from "@/components/ui/slider";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Target, TrendingUp, Calendar, Award, Settings } from "lucide-react";
import { PlanProgress } from "@/types/learning-plan";

interface PlanMetaProps {
  profile: any;
  currentPlan: any;
  currentPlanProgress: PlanProgress | null;
}

export const PlanMeta = ({ profile, currentPlan, currentPlanProgress }: PlanMetaProps) => {
  const [targetScore, setTargetScore] = useState([profile?.target_score || 650]);
  const [showSettings, setShowSettings] = useState(false);
  
  const getScoreColor = (score: number) => {
    if (score >= 700) return "text-green-400";
    if (score >= 600) return "text-yellow-400";
    return "text-red-400";
  };
  
  const getScoreLabel = (score: number) => {
    if (score >= 750) return "Excelente";
    if (score >= 700) return "Muy Bueno";
    if (score >= 650) return "Bueno";
    if (score >= 600) return "Regular";
    return "Necesita Mejorar";
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
      {/* Goal Setting Card */}
      <Card className="bg-gray-800 border-gray-700">
        <CardHeader className="pb-3">
          <CardTitle className="text-white flex items-center gap-2">
            <Target className="h-5 w-5 text-blue-400" />
            Meta PAES
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="text-center">
            <div className={`text-3xl font-bold ${getScoreColor(targetScore[0])}`}>
              {targetScore[0]}
            </div>
            <div className="text-sm text-gray-400 mb-3">
              {getScoreLabel(targetScore[0])}
            </div>
          </div>
          
          <div className="space-y-2">
            <label className="text-sm text-gray-300">Puntaje Objetivo</label>
            <Slider
              value={targetScore}
              onValueChange={setTargetScore}
              max={850}
              min={400}
              step={10}
              className="w-full"
            />
            <div className="flex justify-between text-xs text-gray-500">
              <span>400</span>
              <span>850</span>
            </div>
          </div>
          
          <Button 
            variant="outline" 
            size="sm" 
            className="w-full border-gray-600 text-gray-300 hover:bg-gray-700"
            onClick={() => setShowSettings(!showSettings)}
          >
            <Settings className="h-4 w-4 mr-2" />
            Configurar Meta
          </Button>
        </CardContent>
      </Card>
      
      {/* Progress Overview */}
      <Card className="bg-gray-800 border-gray-700">
        <CardHeader className="pb-3">
          <CardTitle className="text-white flex items-center gap-2">
            <TrendingUp className="h-5 w-5 text-green-400" />
            Progreso Actual
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-3">
            <div className="flex justify-between items-center">
              <span className="text-gray-300">Plan Actual</span>
              <Badge variant="secondary" className="bg-blue-600/20 text-blue-400">
                {currentPlan ? "Activo" : "Sin Plan"}
              </Badge>
            </div>
            
            <div>
              <div className="flex justify-between text-sm mb-2">
                <span className="text-gray-400">Completado</span>
                <span className="text-white">
                  {currentPlanProgress ? Math.round(currentPlanProgress.overallProgress) : 0}%
                </span>
              </div>
              <Progress 
                value={currentPlanProgress ? currentPlanProgress.overallProgress : 0} 
                className="h-2"
              />
            </div>
            
            <div className="grid grid-cols-2 gap-3 text-center">
              <div className="bg-gray-700/50 rounded-lg p-2">
                <div className="text-lg font-bold text-green-400">
                  {currentPlanProgress ? currentPlanProgress.completedNodes : 0}
                </div>
                <div className="text-xs text-gray-400">Completados</div>
              </div>
              <div className="bg-gray-700/50 rounded-lg p-2">
                <div className="text-lg font-bold text-blue-400">
                  {currentPlanProgress ? currentPlanProgress.inProgressNodes : 0}
                </div>
                <div className="text-xs text-gray-400">En Progreso</div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
      
      {/* Timeline */}
      <Card className="bg-gray-800 border-gray-700">
        <CardHeader className="pb-3">
          <CardTitle className="text-white flex items-center gap-2">
            <Calendar className="h-5 w-5 text-purple-400" />
            Cronograma
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-3">
            <div className="flex justify-between items-center">
              <span className="text-gray-300">Fecha Objetivo</span>
              <span className="text-blue-400 text-sm">
                {currentPlan?.targetDate ? 
                  new Date(currentPlan.targetDate).toLocaleDateString() : 
                  "Sin definir"}
              </span>
            </div>
            
            <div className="space-y-2">
              <div className="flex justify-between items-center text-sm">
                <span className="text-gray-400">Racha Actual</span>
                <div className="flex items-center gap-1">
                  <Award className="h-4 w-4 text-yellow-400" />
                  <span className="text-white">7 días</span>
                </div>
              </div>
              
              <div className="flex justify-between items-center text-sm">
                <span className="text-gray-400">Tiempo Semanal</span>
                <span className="text-white">12h 30m</span>
              </div>
              
              <div className="flex justify-between items-center text-sm">
                <span className="text-gray-400">Próxima Sesión</span>
                <span className="text-green-400">Hoy 19:00</span>
              </div>
            </div>
            
            <Button 
              variant="outline" 
              size="sm" 
              className="w-full border-gray-600 text-gray-300 hover:bg-gray-700"
            >
              <Calendar className="h-4 w-4 mr-2" />
              Ajustar Horarios
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
