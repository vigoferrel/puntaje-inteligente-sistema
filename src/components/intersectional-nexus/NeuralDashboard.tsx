
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
import { useIntersectionalNexus } from '@/core/intersectional-nexus/IntersectionalNexus';

export const NeuralDashboard: React.FC = () => {
  const nexus = useIntersectionalNexus();

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

  // Convertir active_modules Set a array para mostrar
  const activeModulesArray = Array.from(nexus.active_modules);

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
            Nexus Interseccional Neural v9.0
          </h1>
        </div>
        <p className="text-muted-foreground">
          Sistema nervioso digital silencioso - Coherencia: {nexus.global_coherence}%
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
                <p className={`text-2xl font-bold ${getHealthColor(nexus.system_health.neural_efficiency)}`}>
                  {Math.round(nexus.system_health.neural_efficiency)}%
                </p>
              </div>
              <Cpu className="h-8 w-8 text-purple-500" />
            </div>
            <Progress value={nexus.system_health.neural_efficiency} className="mt-2 h-2" />
          </CardContent>
        </Card>

        <Card className="border-green-200 bg-gradient-to-br from-green-50 to-emerald-50">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-green-700">Cross-Pollination</p>
                <p className={`text-2xl font-bold ${getHealthColor(nexus.system_health.cross_pollination_rate)}`}>
                  {Math.round(nexus.system_health.cross_pollination_rate)}%
                </p>
              </div>
              <Network className="h-8 w-8 text-green-500" />
            </div>
            <Progress value={nexus.system_health.cross_pollination_rate} className="mt-2 h-2" />
          </CardContent>
        </Card>

        <Card className="border-blue-200 bg-gradient-to-br from-blue-50 to-cyan-50">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-blue-700">Aprendizaje Adaptativo</p>
                <p className={`text-2xl font-bold ${getHealthColor(nexus.system_health.adaptive_learning_score)}`}>
                  {Math.round(nexus.system_health.adaptive_learning_score)}%
                </p>
              </div>
              <TrendingUp className="h-8 w-8 text-blue-500" />
            </div>
            <Progress value={nexus.system_health.adaptive_learning_score} className="mt-2 h-2" />
          </CardContent>
        </Card>

        <Card className="border-orange-200 bg-gradient-to-br from-orange-50 to-red-50">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-orange-700">Armonía UX</p>
                <p className={`text-2xl font-bold ${getHealthColor(nexus.system_health.user_experience_harmony)}`}>
                  {Math.round(nexus.system_health.user_experience_harmony)}%
                </p>
              </div>
              <Activity className="h-8 w-8 text-orange-500" />
            </div>
            <Progress value={nexus.system_health.user_experience_harmony} className="mt-2 h-2" />
          </CardContent>
        </Card>
      </motion.div>

      {/* Módulos Neurológicos Activos - Adaptado a strings */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
      >
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Network className="w-5 h-5" />
              Red Neurológica Activa ({activeModulesArray.length} módulos)
            </CardTitle>
          </CardHeader>
          <CardContent>
            {activeModulesArray.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {activeModulesArray.map((moduleId, index) => (
                  <div 
                    key={moduleId}
                    className="p-4 border rounded-lg bg-gradient-to-br from-gray-50 to-gray-100"
                  >
                    <div className="flex items-center justify-between mb-2">
                      <h4 className="font-medium">Módulo Neural</h4>
                      <Badge variant="outline" className="text-xs">
                        {moduleId.slice(0, 8)}...
                      </Badge>
                    </div>
                    <p className="text-sm text-muted-foreground mb-2">
                      Estado: Activo y funcionando
                    </p>
                    <div className="flex flex-wrap gap-1">
                      <Badge variant="secondary" className="text-xs">
                        cardiovascular_v9
                      </Badge>
                      <Badge variant="secondary" className="text-xs">
                        silencioso
                      </Badge>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-8 text-muted-foreground">
                <Brain className="w-12 h-12 mx-auto mb-4 opacity-50" />
                <p>No hay módulos neurales activos</p>
              </div>
            )}
          </CardContent>
        </Card>
      </motion.div>

      {/* Estado del Sistema Cardiovascular */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
      >
        <Card className="border-red-200 bg-gradient-to-r from-red-50 to-pink-50">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Activity className="w-5 h-5 text-red-600" />
              Sistema Cardiovascular v9.0
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="text-center">
                <div className="text-2xl font-bold text-red-600">
                  {nexus.global_coherence}%
                </div>
                <div className="text-sm text-muted-foreground">Coherencia Global</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-blue-600">
                  {activeModulesArray.length}
                </div>
                <div className="text-sm text-muted-foreground">Módulos Conectados</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-green-600">
                  Silencioso
                </div>
                <div className="text-sm text-muted-foreground">Modo Operativo</div>
              </div>
            </div>
          </CardContent>
        </Card>
      </motion.div>

      {/* Controles del Sistema - Solo funciones disponibles */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4 }}
      >
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Shield className="w-5 h-5" />
              Control Neurológico v9.0
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex flex-wrap gap-4">
              <Button 
                onClick={() => nexus.synthesizeInsights()}
                className="bg-blue-600 hover:bg-blue-700"
              >
                <Brain className="w-4 h-4 mr-2" />
                Sintetizar Insights
              </Button>
              
              <Button 
                onClick={() => nexus.harmonizeExperience()}
                variant="outline"
                className="border-purple-300 text-purple-700 hover:bg-purple-50"
              >
                <Activity className="w-4 h-4 mr-2" />
                Armonizar UX
              </Button>
              
              <Button 
                onClick={() => nexus.emergencyReset()}
                variant="outline"
                className="border-red-300 text-red-700 hover:bg-red-50"
              >
                <Shield className="w-4 h-4 mr-2" />
                Reset de Emergencia
              </Button>
            </div>
            
            <div className="mt-4 p-3 bg-gray-50 rounded-lg">
              <p className="text-sm text-muted-foreground">
                <strong>Modo Silencioso v9.0:</strong> Sistema optimizado para funcionamiento 
                discreto sin interferir con el navegador. Delegación completa de privacidad 
                al navegador del usuario.
              </p>
            </div>
          </CardContent>
        </Card>
      </motion.div>
    </div>
  );
};
