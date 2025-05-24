
import React, { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Brain, Target, TrendingUp, Zap, BookOpen, Award, BarChart3 } from "lucide-react";
import { motion } from "framer-motion";
import { usePAESPlanIntegration } from "@/hooks/lectoguia/use-paes-plan-integration";

interface PlanInteligenteProps {
  profile: any;
  nodeProgress: any;
  onCreatePlan: () => void;
}

export const PlanInteligente = ({ 
  profile, 
  nodeProgress, 
  onCreatePlan 
}: PlanInteligenteProps) => {
  const [selectedArea, setSelectedArea] = useState<string | null>(null);
  const {
    loading,
    paesBasedNodes,
    planMetrics,
    generateAdaptivePlan
  } = usePAESPlanIntegration();

  const areas = [
    {
      id: "competencia_lectora",
      name: "Competencia Lectora",
      description: "Comprensión y análisis de textos",
      icon: BookOpen,
      color: "from-blue-600 to-cyan-600",
      bgColor: "bg-blue-600/10",
      borderColor: "border-blue-600/30",
      textColor: "text-blue-400"
    },
    {
      id: "matematicas",
      name: "Matemáticas",
      description: "Resolución de problemas matemáticos",
      icon: Target,
      color: "from-green-600 to-emerald-600",
      bgColor: "bg-green-600/10",
      borderColor: "border-green-600/30",
      textColor: "text-green-400"
    },
    {
      id: "ciencias",
      name: "Ciencias",
      description: "Biología, Física y Química",
      icon: Brain,
      color: "from-purple-600 to-violet-600",
      bgColor: "bg-purple-600/10",
      borderColor: "border-purple-600/30",
      textColor: "text-purple-400"
    },
    {
      id: "historia",
      name: "Historia y CS",
      description: "Historia y Ciencias Sociales",
      icon: Award,
      color: "from-orange-600 to-red-600",
      bgColor: "bg-orange-600/10",
      borderColor: "border-orange-600/30",
      textColor: "text-orange-400"
    }
  ];

  const recommendations = [
    {
      type: "weakness",
      title: "Área de Mejora Detectada",
      description: "Comprensión lectora necesita refuerzo",
      action: "Enfocar 60% del tiempo",
      priority: "Alta",
      color: "text-red-400",
      bgColor: "bg-red-600/10"
    },
    {
      type: "strength",
      title: "Fortaleza Identificada",
      description: "Excelente en resolución matemática",
      action: "Mantener práctica regular",
      priority: "Media",
      color: "text-green-400",
      bgColor: "bg-green-600/10"
    },
    {
      type: "opportunity",
      title: "Oportunidad de Crecimiento",
      description: "Ciencias con potencial de mejora",
      action: "Incrementar práctica gradual",
      priority: "Media",
      color: "text-blue-400",
      bgColor: "bg-blue-600/10"
    }
  ];

  const handleGenerateIntelligentPlan = async () => {
    const adaptivePlan = await generateAdaptivePlan();
    if (adaptivePlan) {
      onCreatePlan();
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="space-y-6"
    >
      {/* Intelligence Overview */}
      <Card className="bg-gradient-to-r from-purple-900/50 to-pink-900/50 border-purple-700/50">
        <CardHeader>
          <CardTitle className="text-white flex items-center gap-2">
            <Brain className="h-5 w-5 text-purple-400" />
            Plan Inteligente Basado en IA
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="bg-gray-800/50 rounded-lg p-4 text-center">
              <BarChart3 className="h-8 w-8 text-purple-400 mx-auto mb-2" />
              <div className="text-2xl font-bold text-white">
                {planMetrics.totalPAESQuestions}
              </div>
              <div className="text-sm text-gray-400">Ejercicios Analizados</div>
            </div>
            
            <div className="bg-gray-800/50 rounded-lg p-4 text-center">
              <TrendingUp className="h-8 w-8 text-green-400 mx-auto mb-2" />
              <div className="text-2xl font-bold text-white">
                {Math.round(planMetrics.paesAccuracy)}%
              </div>
              <div className="text-sm text-gray-400">Precisión PAES</div>
            </div>
            
            <div className="bg-gray-800/50 rounded-lg p-4 text-center">
              <Zap className="h-8 w-8 text-yellow-400 mx-auto mb-2" />
              <div className="text-2xl font-bold text-white">
                {planMetrics.estimatedReadiness}%
              </div>
              <div className="text-sm text-gray-400">Preparación Est.</div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Area Selection */}
      <Card className="bg-gray-800 border-gray-700">
        <CardHeader>
          <CardTitle className="text-white">Selecciona tu Área de Enfoque</CardTitle>
          <p className="text-gray-400">La IA priorizará nodos según tu selección</p>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {areas.map((area) => (
              <motion.div
                key={area.id}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                <Card 
                  className={`
                    cursor-pointer transition-all border-2
                    ${selectedArea === area.id 
                      ? `${area.borderColor} ${area.bgColor}` 
                      : 'border-gray-600 bg-gray-700/50 hover:border-gray-500'
                    }
                  `}
                  onClick={() => setSelectedArea(area.id)}
                >
                  <CardContent className="p-4 text-center">
                    <area.icon className={`h-8 w-8 mx-auto mb-3 ${
                      selectedArea === area.id ? area.textColor : 'text-gray-400'
                    }`} />
                    <h4 className={`font-semibold mb-1 ${
                      selectedArea === area.id ? 'text-white' : 'text-gray-300'
                    }`}>
                      {area.name}
                    </h4>
                    <p className="text-xs text-gray-400">{area.description}</p>
                    {selectedArea === area.id && (
                      <Badge className={`mt-2 ${area.bgColor} ${area.textColor} border-0`}>
                        Seleccionado
                      </Badge>
                    )}
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* AI Recommendations */}
      <Card className="bg-gray-800 border-gray-700">
        <CardHeader>
          <CardTitle className="text-white flex items-center gap-2">
            <Brain className="h-5 w-5 text-blue-400" />
            Recomendaciones Inteligentes
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {recommendations.map((rec, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.1 }}
                className={`p-4 rounded-lg border ${rec.bgColor} border-gray-600`}
              >
                <div className="flex justify-between items-start mb-2">
                  <h4 className={`font-semibold ${rec.color}`}>{rec.title}</h4>
                  <Badge 
                    variant="outline" 
                    className={`text-xs ${
                      rec.priority === 'Alta' ? 'border-red-600/50 text-red-400' :
                      rec.priority === 'Media' ? 'border-yellow-600/50 text-yellow-400' :
                      'border-green-600/50 text-green-400'
                    }`}
                  >
                    {rec.priority}
                  </Badge>
                </div>
                <p className="text-gray-300 text-sm mb-2">{rec.description}</p>
                <p className="text-gray-400 text-xs">
                  <strong>Acción sugerida:</strong> {rec.action}
                </p>
              </motion.div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Generate Plan Button */}
      <div className="text-center">
        <Button 
          onClick={handleGenerateIntelligentPlan}
          disabled={!selectedArea || loading}
          className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white px-8 py-3"
          size="lg"
        >
          {loading ? (
            <>
              <Brain className="h-5 w-5 mr-2 animate-spin" />
              Generando Plan Inteligente...
            </>
          ) : (
            <>
              <Zap className="h-5 w-5 mr-2" />
              Generar Plan Inteligente
            </>
          )}
        </Button>
        <p className="text-gray-400 text-sm mt-2">
          La IA analizará tu progreso y creará un plan optimizado para ti
        </p>
      </div>
    </motion.div>
  );
};
