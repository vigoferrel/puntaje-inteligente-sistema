
import React from 'react';
import { motion } from 'framer-motion';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Button } from '@/components/ui/button';
import { 
  Zap, Network, TrendingUp, BarChart3, 
  RefreshCw, CheckCircle, AlertCircle 
} from 'lucide-react';
import { useCrossModuleDataSync } from '@/core/intersectional-sync/CrossModuleDataSync';
import { CinematicTransition } from '@/components/cinematic/CinematicTransitionSystem';

export const IntersectionalDashboard: React.FC = () => {
  const {
    isSyncing,
    lastSyncTime,
    syncErrors,
    crossModuleMetrics,
    unifiedUserProfile,
    syncAllModules,
    generateUnifiedRecommendations,
    clearSyncErrors
  } = useCrossModuleDataSync();

  const recommendations = generateUnifiedRecommendations();

  const getMetricColor = (value: number) => {
    if (value >= 90) return 'text-green-500';
    if (value >= 75) return 'text-blue-500';
    if (value >= 60) return 'text-yellow-500';
    return 'text-red-500';
  };

  const getMetricStatus = (value: number) => {
    if (value >= 90) return 'Excelente';
    if (value >= 75) return 'Bueno';
    if (value >= 60) return 'Regular';
    return 'Necesita atención';
  };

  return (
    <CinematicTransition scene="dashboard">
      <div className="space-y-6">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center space-y-4"
        >
          <div className="flex items-center justify-center gap-3">
            <Network className="w-8 h-8 text-purple-500" />
            <h1 className="text-3xl font-bold bg-gradient-to-r from-purple-400 to-blue-400 bg-clip-text text-transparent">
              Dashboard Interseccional
            </h1>
          </div>
          <p className="text-muted-foreground">
            Sincronización y coherencia entre todos los módulos PAES
          </p>
        </motion.div>

        {/* Estado de Sincronización */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
        >
          <Card className="border-2 border-purple-200 bg-gradient-to-r from-purple-50 to-blue-50">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <RefreshCw className={`w-5 h-5 ${isSyncing ? 'animate-spin' : ''}`} />
                Estado de Sincronización
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <span>Estado:</span>
                <div className="flex items-center gap-2">
                  {isSyncing ? (
                    <Badge variant="secondary">Sincronizando...</Badge>
                  ) : (
                    <Badge className="bg-green-500">
                      <CheckCircle className="w-3 h-3 mr-1" />
                      Sincronizado
                    </Badge>
                  )}
                </div>
              </div>
              
              {lastSyncTime && (
                <div className="flex items-center justify-between">
                  <span>Última sincronización:</span>
                  <span className="text-sm text-muted-foreground">
                    {lastSyncTime.toLocaleTimeString()}
                  </span>
                </div>
              )}
              
              {syncErrors.length > 0 && (
                <div className="space-y-2">
                  <div className="flex items-center gap-2">
                    <AlertCircle className="w-4 h-4 text-red-500" />
                    <span className="text-red-600">Errores de sincronización:</span>
                  </div>
                  {syncErrors.map((error, index) => (
                    <p key={index} className="text-sm text-red-600 bg-red-50 p-2 rounded">
                      {error}
                    </p>
                  ))}
                  <Button 
                    variant="outline" 
                    size="sm" 
                    onClick={clearSyncErrors}
                  >
                    Limpiar errores
                  </Button>
                </div>
              )}
              
              <Button 
                onClick={syncAllModules} 
                disabled={isSyncing}
                className="w-full"
              >
                {isSyncing ? 'Sincronizando...' : 'Sincronizar Ahora'}
              </Button>
            </CardContent>
          </Card>
        </motion.div>

        {/* Métricas Interseccionales */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
        >
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <BarChart3 className="w-5 h-5" />
                Métricas Interseccionales
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {Object.entries(crossModuleMetrics).map(([key, value]) => {
                  const displayName = {
                    superPaesUniverseAlignment: 'SuperPAES ↔ Universe',
                    diagnosticPlanConsistency: 'Diagnóstico → Planes',
                    globalUserEngagement: 'Engagement Global',
                    systemCoherence: 'Coherencia del Sistema'
                  }[key] || key;

                  return (
                    <div key={key} className="space-y-3">
                      <div className="flex items-center justify-between">
                        <span className="font-medium">{displayName}</span>
                        <div className="flex items-center gap-2">
                          <span className={`font-bold ${getMetricColor(value)}`}>
                            {Math.round(value)}%
                          </span>
                          <Badge variant="outline" className="text-xs">
                            {getMetricStatus(value)}
                          </Badge>
                        </div>
                      </div>
                      <Progress value={value} className="h-2" />
                    </div>
                  );
                })}
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Perfil Unificado */}
        {unifiedUserProfile && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
          >
            <Card className="border-green-200 bg-gradient-to-r from-green-50 to-emerald-50">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <TrendingUp className="w-5 h-5 text-green-600" />
                  Perfil Unificado del Usuario
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="text-center">
                    <div className="text-2xl font-bold text-green-600">
                      {unifiedUserProfile.level}
                    </div>
                    <div className="text-sm text-muted-foreground">Nivel Global</div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold text-blue-600">
                      {unifiedUserProfile.globalProgress}%
                    </div>
                    <div className="text-sm text-muted-foreground">Progreso</div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold text-purple-600">
                      {unifiedUserProfile.strengths.length}
                    </div>
                    <div className="text-sm text-muted-foreground">Fortalezas</div>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <h4 className="font-medium mb-2 text-green-700">Fortalezas:</h4>
                    <div className="space-y-1">
                      {unifiedUserProfile.strengths.map((strength, index) => (
                        <Badge key={index} className="bg-green-100 text-green-800 mr-1">
                          {strength}
                        </Badge>
                      ))}
                    </div>
                  </div>
                  <div>
                    <h4 className="font-medium mb-2 text-orange-700">Áreas de mejora:</h4>
                    <div className="space-y-1">
                      {unifiedUserProfile.weaknesses.map((weakness, index) => (
                        <Badge key={index} variant="destructive" className="mr-1">
                          {weakness}
                        </Badge>
                      ))}
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        )}

        {/* Recomendaciones Interseccionales */}
        {recommendations.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
          >
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Zap className="w-5 h-5 text-yellow-500" />
                  Recomendaciones Interseccionales
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {recommendations.map((rec, index) => (
                    <div key={rec.id} className="p-4 border rounded-lg">
                      <div className="flex items-start justify-between mb-2">
                        <h4 className="font-medium">{rec.title}</h4>
                        <Badge 
                          variant={rec.priority === 'Alta' ? 'destructive' : 'secondary'}
                        >
                          {rec.priority}
                        </Badge>
                      </div>
                      <p className="text-sm text-muted-foreground mb-2">
                        {rec.description}
                      </p>
                      <div className="flex items-center justify-between">
                        <div className="flex gap-1">
                          {rec.modules.map((module: string) => (
                            <Badge key={module} variant="outline" className="text-xs">
                              {module}
                            </Badge>
                          ))}
                        </div>
                        <span className="text-sm text-blue-600 font-medium">
                          Impacto: {rec.impact}%
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </motion.div>
        )}
      </div>
    </CinematicTransition>
  );
};
