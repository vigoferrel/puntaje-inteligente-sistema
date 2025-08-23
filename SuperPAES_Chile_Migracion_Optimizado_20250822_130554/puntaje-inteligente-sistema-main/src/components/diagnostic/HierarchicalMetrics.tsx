/* eslint-disable react-refresh/only-export-components */

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../../components/ui/card";
import type { SafeString, SafeNumber, SafeBoolean, APIResponse, OperationResult } from '../types/core';
import { Progress } from "../../components/ui/progress";
import { Badge } from "../../components/ui/badge";
import { TrendingUp, Target, BookOpen, Brain } from "lucide-react";
import { useHierarchicalDiagnostic } from "../../hooks/diagnostic/use-hierarchical-diagnostic";

export const HierarchicalMetrics = () => {
  const { systemMetrics, tier1Nodes, recommendedPath, loading } = useHierarchicalDiagnostic();

  if (loading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        {[...Array(4)].map((_, i) => (
          <Card key={i} className="animate-pulse">
            <CardHeader className="pb-2">
              <div className="h-4 bg-gray-200 rounded w-3/4"></div>
            </CardHeader>
            <CardContent>
              <div className="h-8 bg-gray-200 rounded w-1/2"></div>
            </CardContent>
          </Card>
        ))}
      </div>
    );
  }

  const tier1Coverage = systemMetrics.totalNodes > 0 
    ? (systemMetrics.tier1Count / systemMetrics.totalNodes) * 100 
    : 0;

  return (
    <div className="space-y-6 mb-6">
      {/* System Overview */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total de Nodos</CardTitle>
            <BookOpen className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{systemMetrics.totalNodes}</div>
            <p className="text-xs text-muted-foreground">
              Sistema jerÃ¡rquico completo
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Nodos CrÃ­ticos</CardTitle>
            <Target className="h-4 w-4 text-red-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-red-600">{systemMetrics.tier1Count}</div>
            <p className="text-xs text-muted-foreground">
              Tier 1 - Alta prioridad
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Complejidad Bloom</CardTitle>
            <Brain className="h-4 w-4 text-blue-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-blue-600">
              {systemMetrics.avgBloomLevel.toFixed(1)}
            </div>
            <p className="text-xs text-muted-foreground">
              Nivel cognitivo promedio
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Cobertura CrÃ­tica</CardTitle>
            <TrendingUp className="h-4 w-4 text-green-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">
              {tier1Coverage.toFixed(1)}%
            </div>
            <p className="text-xs text-muted-foreground">
              Nodos Tier 1 implementados
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Distribution by Test */}
      <Card>
        <CardHeader>
          <CardTitle>DistribuciÃ³n por Prueba PAES</CardTitle>
          <CardDescription>
            Cantidad de nodos por cada prueba del sistema
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {Object.entries(systemMetrics.distributionByTest).map(([testCode, count]) => (
            <div key={testCode} className="space-y-2">
              <div className="flex justify-between items-center">
                <div className="flex items-center gap-2">
                  <Badge variant="outline">{testCode}</Badge>
                  <span className="text-sm font-medium">{count} nodos</span>
                </div>
                <span className="text-xs text-muted-foreground">
                  {((count / systemMetrics.totalNodes) * 100).toFixed(1)}%
                </span>
              </div>
              <Progress 
                value={(count / systemMetrics.totalNodes) * 100} 
                className="h-2"
              />
            </div>
          ))}
        </CardContent>
      </Card>

      {/* Tier Distribution */}
      <Card>
        <CardHeader>
          <CardTitle>DistribuciÃ³n por Prioridad</CardTitle>
          <CardDescription>
            OrganizaciÃ³n jerÃ¡rquica segÃºn el sistema PAES Pro
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <div className="flex justify-between items-center">
              <div className="flex items-center gap-2">
                <Badge variant="destructive">Tier 1 - CrÃ­tico</Badge>
                <span className="text-sm font-medium">{systemMetrics.tier1Count} nodos</span>
              </div>
              <span className="text-xs text-muted-foreground">32.1%</span>
            </div>
            <Progress value={tier1Coverage} className="h-2" />
          </div>

          <div className="space-y-2">
            <div className="flex justify-between items-center">
              <div className="flex items-center gap-2">
                <Badge variant="default">Tier 2 - Importante</Badge>
                <span className="text-sm font-medium">{systemMetrics.tier2Count} nodos</span>
              </div>
              <span className="text-xs text-muted-foreground">39.0%</span>
            </div>
            <Progress 
              value={systemMetrics.totalNodes > 0 ? (systemMetrics.tier2Count / systemMetrics.totalNodes) * 100 : 0} 
              className="h-2" 
            />
          </div>

          <div className="space-y-2">
            <div className="flex justify-between items-center">
              <div className="flex items-center gap-2">
                <Badge variant="secondary">Tier 3 - Complementario</Badge>
                <span className="text-sm font-medium">{systemMetrics.tier3Count} nodos</span>
              </div>
              <span className="text-xs text-muted-foreground">28.9%</span>
            </div>
            <Progress 
              value={systemMetrics.totalNodes > 0 ? (systemMetrics.tier3Count / systemMetrics.totalNodes) * 100 : 0} 
              className="h-2" 
            />
          </div>
        </CardContent>
      </Card>

      {/* Recommended Path Preview */}
      {recommendedPath.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle>Ruta de Aprendizaje Recomendada</CardTitle>
            <CardDescription>
              Nodos priorizados segÃºn el algoritmo adaptativo
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              {recommendedPath.slice(0, 5).map((node, index) => (
                <div key={node.id} className="flex items-center justify-between p-2 rounded bg-gray-50">
                  <div className="flex items-center gap-3">
                    <Badge variant="outline">{index + 1}</Badge>
                    <div>
                      <div className="font-medium text-sm">{node.title}</div>
                      <div className="text-xs text-muted-foreground">{node.domainCategory}</div>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <Badge 
                      variant={node.tierPriority === 'tier1_critico' ? 'destructive' : 'default'}
                      className="text-xs"
                    >
                      {node.tierPriority.replace('_', ' ').toUpperCase()}
                    </Badge>
                    <span className="text-xs text-muted-foreground">
                      Peso: {node.baseWeight}
                    </span>
                  </div>
                </div>
              ))}
              {recommendedPath.length > 5 && (
                <div className="text-center text-sm text-muted-foreground pt-2">
                  +{recommendedPath.length - 5} nodos mÃ¡s en tu ruta personalizada
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

