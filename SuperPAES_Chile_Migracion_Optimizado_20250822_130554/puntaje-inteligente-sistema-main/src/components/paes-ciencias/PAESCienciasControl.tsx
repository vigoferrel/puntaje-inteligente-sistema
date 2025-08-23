/* eslint-disable react-refresh/only-export-components */
import { FC, useState } from 'react';
import type { SafeString, SafeNumber, SafeBoolean, APIResponse, OperationResult } from '../types/core';

import { Button } from '../../components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../../components/ui/card';
import { Badge } from '../../components/ui/badge';
import { Progress } from '../../components/ui/progress';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../../components/ui/tabs';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../../components/ui/select';
import { Microscope, Beaker, Atom, Brain, BookOpen, Target, TrendingUp } from 'lucide-react';
import { useState } from 'react';
import { useLectoGuia } from '../../contexts/LectoGuiaContext';
import { TPAESPrueba } from '../../types/system-types';

export const PAESCienciasControl: FC = () => {
  const {
    setActiveTab,
    handleNodeSelect,
    nodes,
    nodeProgress,
    selectedPrueba,
    setSelectedTestId
  } = useLectoGuia();

  const [areaSeleccionada, setAreaSeleccionada] = useState<string>('BiologÃ­a');
  const [cantidadPreguntas, setCantidadPreguntas] = useState<number>(15);

  const iconosArea = {
    'BiologÃ­a': Microscope,
    'FÃ­sica': Atom,
    'QuÃ­mica': Beaker
  };

  // Filtrar nodos por Ã¡rea seleccionada
  const nodosCiencias = nodes.filter(node => 
    node.prueba === 'CIENCIAS' && 
    (node.title.toLowerCase().includes(areaSeleccionada.toLowerCase()) ||
     node.description.toLowerCase().includes(areaSeleccionada.toLowerCase()))
  );

  const handleGenerarDiagnostico = async () => {
    // Cambiar a la prueba de ciencias
    setSelectedTestId(4); // ID para CIENCIAS
    
    // Cambiar a la pestaÃ±a de progreso para mostrar nodos
    setActiveTab('progress');
  };

  const handleGenerarEjerciciosCiclo = async () => {
    // Buscar un nodo apropiado para el Ã¡rea seleccionada
    const nodoApropiado = nodosCiencias.find(node => 
      node.title.toLowerCase().includes(areaSeleccionada.toLowerCase()) ||
      node.description.toLowerCase().includes(areaSeleccionada.toLowerCase())
    );

    if (nodoApropiado) {
      // Usar el sistema existente de LectoGuÃ­a para generar ejercicios
      await handleNodeSelect(nodoApropiado.id);
    } else {
      // Si no hay nodo especÃ­fico, cambiar a ejercicios generales
      setActiveTab('exercise');
    }
  };

  const getProgresoPorcentaje = () => {
    if (nodosCiencias.length === 0) return 0;
    
    const nodosCompletados = nodosCiencias.filter(node => 
      nodeProgress[node.id]?.status === 'completed'
    ).length;
    
    return (nodosCompletados / nodosCiencias.length) * 100;
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Brain className="h-5 w-5" />
            PAES Ciencias - Generador de DiagnÃ³sticos y Ejercicios
          </CardTitle>
          <CardDescription>
            Sistema integrado con LectoGuÃ­a - Conectado a nodos de aprendizaje de ciencias
          </CardDescription>
        </CardHeader>
      </Card>

      <Tabs defaultValue="diagnostico" className="w-full">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="diagnostico">DiagnÃ³stico</TabsTrigger>
          <TabsTrigger value="ejercicios">Ejercicios por Ãrea</TabsTrigger>
          <TabsTrigger value="estadisticas">EstadÃ­sticas</TabsTrigger>
        </TabsList>

        {/* PestaÃ±a de DiagnÃ³stico */}
        <TabsContent value="diagnostico" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Acceder a Nodos de Ciencias</CardTitle>
              <CardDescription>
                Explora los nodos de aprendizaje de ciencias disponibles en el sistema
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label className="text-sm font-medium">Nodos Disponibles</label>
                  <div className="text-sm text-muted-foreground">
                    {nodosCiencias.length} nodos de ciencias encontrados
                  </div>
                </div>
                
                <div className="space-y-2">
                  <label className="text-sm font-medium">Ãreas Cubiertas</label>
                  <div className="flex gap-2">
                    {['BiologÃ­a', 'FÃ­sica', 'QuÃ­mica'].map(area => {
                      const Icon = iconosArea[area as keyof typeof iconosArea];
                      return (
                        <Badge key={area} variant="secondary" className="flex items-center gap-1">
                          <Icon className="h-3 w-3" />
                          {area}
                        </Badge>
                      );
                    })}
                  </div>
                </div>
              </div>

              <Button 
                onClick={handleGenerarDiagnostico}
                className="w-full"
              >
                Ver Nodos de Ciencias Disponibles
              </Button>

              {selectedPrueba === 'CIENCIAS' && (
                <Card className="mt-4">
                  <CardContent className="pt-4">
                    <div className="flex justify-between items-center">
                      <div>
                        <h4 className="font-medium">Sistema de Ciencias Activo</h4>
                        <p className="text-sm text-muted-foreground">
                          Conectado a {nodosCiencias.length} nodos de aprendizaje
                        </p>
                      </div>
                      <Button 
                        variant="outline" 
                        onClick={() => setActiveTab('progress')}
                      >
                        Ver Progreso
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        {/* PestaÃ±a de Ejercicios por Ãrea */}
        <TabsContent value="ejercicios" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Ejercicios por Ãrea de Ciencias</CardTitle>
              <CardDescription>
                Genera ejercicios especÃ­ficos conectados a nodos de aprendizaje
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {/* Progreso del Ãrea */}
              <div className="space-y-2">
                <div className="flex justify-between items-center">
                  <span className="text-sm font-medium">Progreso en Ciencias</span>
                  <span className="text-sm text-muted-foreground">
                    {Math.round(getProgresoPorcentaje())}% completado
                  </span>
                </div>
                <Progress value={getProgresoPorcentaje()} className="h-2" />
              </div>

              {/* SelecciÃ³n de Ãrea */}
              <div className="space-y-2">
                <label className="text-sm font-medium">Ãrea de Ciencias</label>
                <Select value={areaSeleccionada} onValueChange={setAreaSeleccionada}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="BiologÃ­a">
                      <div className="flex items-center gap-2">
                        <Microscope className="h-4 w-4" />
                        BiologÃ­a
                      </div>
                    </SelectItem>
                    <SelectItem value="FÃ­sica">
                      <div className="flex items-center gap-2">
                        <Atom className="h-4 w-4" />
                        FÃ­sica
                      </div>
                    </SelectItem>
                    <SelectItem value="QuÃ­mica">
                      <div className="flex items-center gap-2">
                        <Beaker className="h-4 w-4" />
                        QuÃ­mica
                      </div>
                    </SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {/* Mostrar nodos del Ã¡rea seleccionada */}
              {nodosCiencias.length > 0 && (
                <div className="space-y-2">
                  <label className="text-sm font-medium">
                    Nodos de {areaSeleccionada} Disponibles
                  </label>
                  <div className="grid gap-2 max-h-40 overflow-y-auto">
                    {nodosCiencias.slice(0, 5).map((nodo) => (
                      <div key={nodo.id} className="p-3 bg-gray-50 rounded-lg flex justify-between items-center">
                        <div>
                          <p className="text-sm font-medium">{nodo.title}</p>
                          <p className="text-xs text-muted-foreground">
                            {nodo.description?.substring(0, 80)}...
                          </p>
                        </div>
                        <Button 
                          size="sm" 
                          onClick={() => handleNodeSelect(nodo.id)}
                        >
                          Practicar
                        </Button>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* BotÃ³n principal */}
              <Button 
                onClick={handleGenerarEjerciciosCiclo}
                className="w-full"
              >
                <BookOpen className="h-4 w-4 mr-2" />
                Generar Ejercicio de {areaSeleccionada}
              </Button>
            </CardContent>
          </Card>
        </TabsContent>

        {/* PestaÃ±a de EstadÃ­sticas */}
        <TabsContent value="estadisticas" className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Card>
              <CardContent className="pt-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">
                      Nodos de Ciencias
                    </p>
                    <p className="text-2xl font-bold">
                      {nodosCiencias.length}
                    </p>
                  </div>
                  <Brain className="h-8 w-8 text-muted-foreground" />
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="pt-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">
                      Progreso General
                    </p>
                    <p className="text-2xl font-bold">
                      {Math.round(getProgresoPorcentaje())}%
                    </p>
                  </div>
                  <TrendingUp className="h-8 w-8 text-muted-foreground" />
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="pt-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">
                      Sistema Activo
                    </p>
                    <p className="text-2xl font-bold">
                      {selectedPrueba === 'CIENCIAS' ? 'SÃ' : 'NO'}
                    </p>
                  </div>
                  <Target className="h-8 w-8 text-muted-foreground" />
                </div>
              </CardContent>
            </Card>
          </div>

          <Card>
            <CardHeader>
              <CardTitle>Acciones RÃ¡pidas</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Button 
                  variant="outline" 
                  onClick={() => setActiveTab('progress')}
                  className="w-full"
                >
                  Ver Todos los Nodos
                </Button>
                <Button 
                  variant="outline" 
                  onClick={() => setActiveTab('exercise')}
                  className="w-full"
                >
                  Ir a Ejercicios
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

