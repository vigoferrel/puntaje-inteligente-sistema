/* eslint-disable react-refresh/only-export-components */

import React, { useState, useEffect } from 'react';
import type { SafeString, SafeNumber, SafeBoolean, APIResponse, OperationResult } from '../types/core';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../../components/ui/card';
import { Button } from '../../components/ui/button';
import { Badge } from '../../components/ui/badge';
import { Alert, AlertDescription, AlertTitle } from '../../components/ui/alert';
import { Progress } from '../../components/ui/progress';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../../components/ui/tabs';
import { nodeValidationService, NodeValidationResult } from '../../services/learning/node-validation-service';
import { Database, CheckCircle, AlertTriangle, RefreshCw, Eye, Filter } from 'lucide-react';
import { useToast } from '../../hooks/use-toast';

export const NodeManagementPanel: React.FC = () => {
  const [validationResult, setValidationResult] = useState<NodeValidationResult | null>(null);
  const [isValidating, setIsValidating] = useState(false);
  const [selectedSubject, setSelectedSubject] = useState<string>('all');
  const [selectedTier, setSelectedTier] = useState<string>('all');
  const { toast } = useToast();

  const subjects = [
    { key: 'all', label: 'Todas las materias' },
    { key: 'COMPETENCIA_LECTORA', label: 'Competencia Lectora' },
    { key: 'MATEMATICA_1', label: 'MatemÃ¡tica M1' },
    { key: 'MATEMATICA_2', label: 'MatemÃ¡tica M2' },
    { key: 'HISTORIA', label: 'Historia y CC.SS' },
    { key: 'CIENCIAS', label: 'Ciencias' }
  ];

  const tiers = [
    { key: 'all', label: 'Todos los tiers' },
    { key: 'tier1_critico', label: 'Tier 1 - CrÃ­ticos' },
    { key: 'tier2_importante', label: 'Tier 2 - Importantes' },
    { key: 'tier3_complementario', label: 'Tier 3 - Complementarios' }
  ];

  // eslint-disable-next-line react-hooks/exhaustive-depsuseEffect(() => {
    validateNodes();
  }, []);useEffect(() => {
    validateNodes();
  }, []);

  const validateNodes = async () => {
    setIsValidating(true);
    try {
      const result = await nodeValidationService.validateAllNodes();
      setValidationResult(result);
      
      if (result.isValid) {
        toast({
          title: "âœ… ValidaciÃ³n exitosa",
          description: `${result.stats.totalNodes} nodos validados correctamente`
        });
      } else {
        toast({
          title: "âš ï¸ Problemas encontrados",
          description: `${result.issues.length} problemas detectados en la validaciÃ³n`,
          variant: "destructive"
        });
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "No se pudo completar la validaciÃ³n",
        variant: "destructive"
      });
    } finally {
      setIsValidating(false);
    }
  };

  const getStatusIcon = (isValid: boolean) => {
    return isValid ? (
      <CheckCircle className="h-5 w-5 text-green-500" />
    ) : (
      <AlertTriangle className="h-5 w-5 text-red-500" />
    );
  };

  const getTierBadgeVariant = (tier: string) => {
    switch (tier) {
      case 'tier1_critico': return 'destructive';
      case 'tier2_importante': return 'default';
      case 'tier3_complementario': return 'secondary';
      default: return 'outline';
    }
  };

  const getCoherenceColor = (score: number) => {
    if (score >= 90) return 'text-green-600';
    if (score >= 70) return 'text-yellow-600';
    return 'text-red-600';
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Database className="h-5 w-5" />
            Panel de GestiÃ³n de Nodos - Sistema PAES Pro
          </CardTitle>
          <CardDescription>
            GestiÃ³n y validaciÃ³n de los 277 nodos de aprendizaje estructurados
          </CardDescription>
        </CardHeader>
        
        <CardContent className="space-y-4">
          <div className="flex gap-4">
            <Button 
              onClick={validateNodes} 
              disabled={isValidating}
              className="flex items-center gap-2"
            >
              {isValidating ? (
                <>
                  <RefreshCw className="h-4 w-4 animate-spin" />
                  Validando...
                </>
              ) : (
                <>
                  <CheckCircle className="h-4 w-4" />
                  Validar Nodos
                </>
              )}
            </Button>
          </div>

          {validationResult && (
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <Card>
                <CardContent className="p-4">
                  <div className="flex items-center gap-2">
                    {getStatusIcon(validationResult.isValid)}
                    <div>
                      <p className="text-sm font-medium">Estado General</p>
                      <p className="text-2xl font-bold">
                        {validationResult.isValid ? 'VÃ¡lido' : 'Con Errores'}
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="p-4">
                  <div className="flex items-center gap-2">
                    <Database className="h-5 w-5 text-blue-500" />
                    <div>
                      <p className="text-sm font-medium">Total Nodos</p>
                      <p className="text-2xl font-bold">{validationResult.stats.totalNodes}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="p-4">
                  <div className="flex items-center gap-2">
                    <AlertTriangle className="h-5 w-5 text-yellow-500" />
                    <div>
                      <p className="text-sm font-medium">Problemas</p>
                      <p className="text-2xl font-bold">{validationResult.issues.length}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="p-4">
                  <div className="flex items-center gap-2">
                    <Eye className="h-5 w-5 text-purple-500" />
                    <div>
                      <p className="text-sm font-medium">Coherencia</p>
                      <p className={`text-2xl font-bold ${getCoherenceColor(validationResult.stats.coherenceScore)}`}>
                        {validationResult.stats.coherenceScore}%
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          )}
        </CardContent>
      </Card>

      {validationResult && (
        <Tabs defaultValue="overview" className="space-y-4">
          <TabsList>
            <TabsTrigger value="overview">Resumen</TabsTrigger>
            <TabsTrigger value="distribution">DistribuciÃ³n</TabsTrigger>
            <TabsTrigger value="issues">Problemas</TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Card>
                <CardHeader>
                  <CardTitle>DistribuciÃ³n por Tier</CardTitle>
                </CardHeader>
                <CardContent className="space-y-2">
                  {Object.entries(validationResult.stats.byTier).map(([tier, count]) => (
                    <div key={tier} className="flex justify-between items-center">
                      <Badge variant={getTierBadgeVariant(tier)}>
                        {tier.replace('_', ' ').toUpperCase()}
                      </Badge>
                      <span className="font-semibold">{count} nodos</span>
                    </div>
                  ))}
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>DistribuciÃ³n por Materia</CardTitle>
                </CardHeader>
                <CardContent className="space-y-2">
                  {Object.entries(validationResult.stats.bySubject).map(([subject, count]) => (
                    <div key={subject} className="flex justify-between items-center">
                      <span className="text-sm font-medium">{subject}</span>
                      <span className="font-semibold">{count} nodos</span>
                    </div>
                  ))}
                </CardContent>
              </Card>
            </div>

            <Card>
              <CardHeader>
                <CardTitle>Score de Coherencia</CardTitle>
                <CardDescription>
                  Medida de la integridad y consistencia del sistema de nodos
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  <Progress 
                    value={validationResult.stats.coherenceScore} 
                    className="w-full h-3"
                  />
                  <p className={`text-sm ${getCoherenceColor(validationResult.stats.coherenceScore)}`}>
                    {validationResult.stats.coherenceScore}% de coherencia
                    {validationResult.stats.coherenceScore >= 90 && " - Excelente"}
                    {validationResult.stats.coherenceScore >= 70 && validationResult.stats.coherenceScore < 90 && " - Buena"}
                    {validationResult.stats.coherenceScore < 70 && " - Necesita atenciÃ³n"}
                  </p>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="distribution" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Filter className="h-5 w-5" />
                  Filtros de VisualizaciÃ³n
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="text-sm font-medium">Materia</label>
                    <select 
                      value={selectedSubject}
                      onChange={(e) => setSelectedSubject(e.target.value)}
                      className="w-full mt-1 p-2 border rounded"
                    >
                      {subjects.map(subject => (
                        <option key={subject.key} value={subject.key}>
                          {subject.label}
                        </option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label className="text-sm font-medium">Tier</label>
                    <select 
                      value={selectedTier}
                      onChange={(e) => setSelectedTier(e.target.value)}
                      className="w-full mt-1 p-2 border rounded"
                    >
                      {tiers.map(tier => (
                        <option key={tier.key} value={tier.key}>
                          {tier.label}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="issues" className="space-y-4">
            {validationResult.issues.length > 0 ? (
              <div className="space-y-2">
                {validationResult.issues.map((issue, index) => (
                  <Alert key={index} variant="destructive">
                    <AlertTriangle className="h-4 w-4" />
                    <AlertTitle>Problema #{index + 1}</AlertTitle>
                    <AlertDescription>{issue}</AlertDescription>
                  </Alert>
                ))}
              </div>
            ) : (
              <Alert>
                <CheckCircle className="h-4 w-4" />
                <AlertTitle>Â¡Sin problemas!</AlertTitle>
                <AlertDescription>
                  Todos los nodos estÃ¡n correctamente configurados y validados.
                </AlertDescription>
              </Alert>
            )}
          </TabsContent>
        </Tabs>
      )}
    </div>
  );
};


