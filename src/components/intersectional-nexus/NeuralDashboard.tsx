
import React from 'react';
import { motion } from 'framer-motion';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Button } from '@/components/ui/button';
import { 
  Brain, Zap, Network, TrendingUp, Shield, 
  Cpu, Activity, Eye, Target
} from 'lucide-react';
import { useIntersectionalNexus, useNeuralImmunity } from '@/core/intersectional-nexus/IntersectionalNexus';

export const NeuralDashboard: React.FC = () => {
  const nexus = useIntersectionalNexus();
  const immuneHealth = useNeuralImmunity();

  const getHealthColor = (value: number) => {
    if (value >= 90) return 'text-green-500';
    if (value >= 75) return 'text-blue-500';
    if (value >= 60) return 'text-yellow-500';
    return 'text-red-500';
  };

  const getHealthStatus = (value: number) => {
    if (value >= 90) return 'Óptimo';
    if (value >= 75) return 'Bueno';
    if (value >= 60) return 'Regular';
    return 'Crítico';
  };

  return (
    <div className="space-y-6">
      {/* Header Neurológico */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center space-y-4"
      >
        <div className="flex items-center justify-center gap-3">
          <Brain className="w-8 h-8 text-purple-500" />
          <h1 className="text-3xl font-bold bg-gradient-to-r from-purple-400 to-blue-400 bg-clip-text text-transparent">
            Nexus Interseccional Neural
          </h1>
        </div>
        <p className="text-muted-foreground">
          Sistema nervioso digital unificado - Coherencia: {nexus.global_coherence}%
        </p>
      </motion.div>

      {/* Métricas del Sistema Nervioso */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4"
      >
        <Card className="border-purple-200 bg-gradient-to-br from-purple-50 to-blue-50">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-purple-700">Eficiencia Neural</p>
                <p className={`text-2xl font-bold ${getHealthColor(immuneHealth.neural_efficiency)}`}>
                  {Math.round(immuneHealth.neural_efficiency)}%
                </p>
              </div>
              <Cpu className="h-8 w-8 text-purple-500" />
            </div>
            <Progress value={immuneHealth.neural_efficiency} className="mt-2 h-2" />
          </CardContent>
        </Card>

        <Card className="border-green-200 bg-gradient-to-br from-green-50 to-emerald-50">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-green-700">Cross-Pollination</p>
                <p className={`text-2xl font-bold ${getHealthColor(immuneHealth.cross_pollination_rate)}`}>
                  {Math.round(immuneHealth.cross_pollination_rate)}%
                </p>
              </div>
              <Network className="h-8 w-8 text-green-500" />
            </div>
            <Progress value={immuneHealth.cross_pollination_rate} className="mt-2 h-2" />
          </CardContent>
        </Card>

        <Card className="border-blue-200 bg-gradient-to-br from-blue-50 to-cyan-50">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-blue-700">Aprendizaje Adaptativo</p>
                <p className={`text-2xl font-bold ${getHealthColor(immuneHealth.adaptive_learning_score)}`}>
                  {Math.round(immuneHealth.adaptive_learning_score)}%
                </p>
              </div>
              <TrendingUp className="h-8 w-8 text-blue-500" />
            </div>
            <Progress value={immuneHealth.adaptive_learning_score} className="mt-2 h-2" />
          </CardContent>
        </Card>

        <Card className="border-orange-200 bg-gradient-to-br from-orange-50 to-red-50">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-orange-700">Armonía UX</p>
                <p className={`text-2xl font-bold ${getHealthColor(immuneHealth.user_experience_harmony)}`}>
                  {Math.round(immuneHealth.user_experience_harmony)}%
                </p>
              </div>
              <Activity className="h-8 w-8 text-orange-500" />
            </div>
            <Progress value={immuneHealth.user_experience_harmony} className="mt-2 h-2" />
          </CardContent>
        </Card>
      </motion.div>

      {/* Módulos Neurológicos Activos */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
      >
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Network className="w-5 h-5" />
              Red Neurológica Activa
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {Array.from(nexus.active_modules.values()).map((module) => (
                <div 
                  key={module.id}
                  className="p-4 border rounded-lg bg-gradient-to-br from-gray-50 to-gray-100"
                >
                  <div className="flex items-center justify-between mb-2">
                    <h4 className="font-medium capitalize">{module.type.replace('_', ' ')}</h4>
                    <Badge variant="outline" className="text-xs">
                      {module.id.slice(0, 8)}
                    </Badge>
                  </div>
                  <p className="text-sm text-muted-foreground mb-2">
                    {module.capabilities.length} capacidades activas
                  </p>
                  <div className="flex flex-wrap gap-1">
                    {module.capabilities.slice(0, 3).map((cap, idx) => (
                      <Badge key={idx} variant="secondary" className="text-xs">
                        {cap}
                      </Badge>
                    ))}
                    {module.capabilities.length > 3 && (
                      <Badge variant="outline" className="text-xs">
                        +{module.capabilities.length - 3}
                      </Badge>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </motion.div>

      {/* Insights Colectivos */}
      {nexus.collective_insights.length > 0 && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
        >
          <Card className="border-blue-200 bg-gradient-to-r from-blue-50 to-indigo-50">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Eye className="w-5 h-5 text-blue-600" />
                Inteligencia Colectiva
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {nexus.collective_insights.map((insight, index) => (
                  <div 
                    key={index}
                    className="p-3 bg-white/50 rounded-lg border border-blue-200/50"
                  >
                    <div className="flex items-center justify-between mb-1">
                      <span className="font-medium text-blue-800">
                        {insight.module_type.replace('_', ' ').toUpperCase()}
                      </span>
                      <Badge className="bg-blue-100 text-blue-800">
                        {Math.round(insight.capabilities_utilization * 100)}% utilizadas
                      </Badge>
                    </div>
                    <p className="text-sm text-blue-600">
                      Complejidad: {insight.state_complexity} | Conexiones: {insight.neural_connections}
                    </p>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </motion.div>
      )}

      {/* Patrones de Cross-Pollination */}
      {nexus.cross_module_patterns.length > 0 && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
        >
          <Card className="border-green-200 bg-gradient-to-r from-green-50 to-emerald-50">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Target className="w-5 h-5 text-green-600" />
                Oportunidades de Sinergia
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {nexus.cross_module_patterns.map((pattern, index) => (
                  <div 
                    key={index}
                    className="p-4 bg-white/50 rounded-lg border border-green-200/50"
                  >
                    <div className="flex items-center justify-between mb-2">
                      <h4 className="font-medium text-green-800">
                        {pattern.recommended_integration}
                      </h4>
                      <Badge className="bg-green-100 text-green-800">
                        {pattern.synergy_potential}% potencial
                      </Badge>
                    </div>
                    <div className="flex flex-wrap gap-1">
                      {pattern.shared_capabilities.map((cap: string, idx: number) => (
                        <Badge key={idx} variant="outline" className="text-xs text-green-700">
                          {cap}
                        </Badge>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </motion.div>
      )}

      {/* Controles del Sistema */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5 }}
      >
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Shield className="w-5 h-5" />
              Control Neurológico
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex flex-wrap gap-4">
              <Button 
                onClick={nexus.synthesizeInsights}
                className="bg-blue-600 hover:bg-blue-700"
              >
                <Brain className="w-4 h-4 mr-2" />
                Sintetizar Insights
              </Button>
              
              <Button 
                onClick={nexus.harmonizeExperience}
                variant="outline"
                className="border-purple-300 text-purple-700 hover:bg-purple-50"
              >
                <Activity className="w-4 h-4 mr-2" />
                Armonizar UX
              </Button>
              
              <Button 
                onClick={nexus.healSystem}
                variant="outline"
                className="border-green-300 text-green-700 hover:bg-green-50"
              >
                <Shield className="w-4 h-4 mr-2" />
                Auto-Sanación
              </Button>
              
              <Button 
                onClick={nexus.optimizePathways}
                variant="outline"
                className="border-orange-300 text-orange-700 hover:bg-orange-50"
              >
                <Zap className="w-4 h-4 mr-2" />
                Optimizar Red
              </Button>
            </div>
          </CardContent>
        </Card>
      </motion.div>
    </div>
  );
};
