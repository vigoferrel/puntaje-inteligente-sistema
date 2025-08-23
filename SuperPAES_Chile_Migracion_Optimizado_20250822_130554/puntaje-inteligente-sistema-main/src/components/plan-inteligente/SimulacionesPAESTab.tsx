/* eslint-disable react-refresh/only-export-components */

import React, { useState, useEffect } from 'react';
import type { SafeString, SafeNumber, SafeBoolean, APIResponse, OperationResult } from '../types/core';
import { motion } from 'framer-motion';
import { Card, CardContent, CardHeader, CardTitle } from '../../components/ui/card';
import { Button } from '../../components/ui/button';
import { Badge } from '../../components/ui/badge';
import { Progress } from '../../components/ui/progress';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../../components/ui/tabs';
import {
  Clock,
  Target,
  Calendar,
  Play,
  Trophy,
  TrendingUp,
  BookOpen,
  Timer,
  Award,
  BarChart3
} from 'lucide-react';
import { paesSimulationService } from '../../services/simulations/PAESSimulationService';
import { PAESSimulation, PAESSimulationResult } from '../../types/diagnostic';
import { useAuth } from '../../hooks/useAuth';
import { toast } from '../../hooks/use-toast';

interface SimulacionesPAESTabProps {
  onStartSimulation?: (simulation: PAESSimulation) => void;
}

export const SimulacionesPAESTab: React.FC<SimulacionesPAESTabProps> = ({ onStartSimulation }) => {
  const { user } = useAuth();
  const [simulaciones, setSimulaciones] = useState<PAESSimulation[]>([]);
  const [resultados, setResultados] = useState<PAESSimulationResult[]>([]);
  const [loading, setLoading] = useState(true);
  const [generatingSimulation, setGeneratingSimulation] = useState(false);

  useEffect(() => {
    loadSimulacionesData();
  }, [user]);

  const loadSimulacionesData = async () => {
    if (!user?.id) return;

    try {
      setLoading(true);
      
      // Cargar simulaciones programadas
      const simulacionesProgramadas = await paesSimulationService.scheduleWeeklySimulations(user.id);
      setSimulaciones(simulacionesProgramadas);

      // Cargar resultados histÃ³ricos
      const resultadosHistoricos = await paesSimulationService.getUserSimulationResults(user.id);
      setResultados(resultadosHistoricos);

    } catch (error) {
      console.error('Error cargando simulaciones:', error);
      toast({
        title: "Error",
        description: "No se pudieron cargar las simulaciones",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  const handleGenerateSimulation = async (prueba: string, type: 'official' | 'practice' = 'practice') => {
    setGeneratingSimulation(true);
    
    try {
      const nuevaSimulacion = await paesSimulationService.generateOfficialSimulation(prueba, type);
      setSimulaciones(prev => [...prev, nuevaSimulacion]);
      
      toast({
        title: "SimulaciÃ³n generada",
        description: `${nuevaSimulacion.name} lista para realizar`
      });

      if (onStartSimulation) {
        onStartSimulation(nuevaSimulacion);
      }

    } catch (error) {
      console.error('Error generando simulaciÃ³n:', error);
      toast({
        title: "Error",
        description: "No se pudo generar la simulaciÃ³n",
        variant: "destructive"
      });
    } finally {
      setGeneratingSimulation(false);
    }
  };

  const getPromedioGeneral = () => {
    if (resultados.length === 0) return 0;
    const suma = resultados.reduce((acc, resultado) => acc + resultado.score, 0);
    return suma / resultados.length;
  };

  const getPuntajePAESPromedio = () => {
    const puntajes = resultados.map(r => r.predictedPAESScore).filter(Boolean);
    if (puntajes.length === 0) return 0;
    return puntajes.reduce((sum, score) => sum + score!, 0) / puntajes.length;
  };

  const getSimulacionesPendientes = () => {
    return simulaciones.filter(sim => !sim.isCompleted).length;
  };

  const materiasDisponibles = [
    { codigo: 'COMPETENCIA_LECTORA', nombre: 'ComprensiÃ³n Lectora', icono: BookOpen, color: 'blue' },
    { codigo: 'MATEMATICA_1', nombre: 'MatemÃ¡tica M1', icono: Target, color: 'green' },
    { codigo: 'MATEMATICA_2', nombre: 'MatemÃ¡tica M2', icono: TrendingUp, color: 'purple' },
    { codigo: 'CIENCIAS', nombre: 'Ciencias', icono: Award, color: 'orange' },
    { codigo: 'HISTORIA', nombre: 'Historia y GeografÃ­a', icono: Trophy, color: 'red' }
  ];

  if (loading) {
    return (
      <div className="p-6 text-center">
        <div className="w-8 h-8 border-4 border-purple-400 border-t-transparent rounded-full animate-spin mx-auto mb-4" />
        <p className="text-slate-400">Cargando simulaciones PAES...</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header con mÃ©tricas */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card className="bg-gradient-to-r from-blue-600/20 to-blue-800/20 border-blue-500/30">
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <BarChart3 className="w-8 h-8 text-blue-400" />
              <div>
                <p className="text-blue-200 text-sm">Promedio General</p>
                <p className="text-2xl font-bold text-white">{getPromedioGeneral().toFixed(1)}%</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-r from-green-600/20 to-green-800/20 border-green-500/30">
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <Target className="w-8 h-8 text-green-400" />
              <div>
                <p className="text-green-200 text-sm">Puntaje PAES Proyectado</p>
                <p className="text-2xl font-bold text-white">{getPuntajePAESPromedio().toFixed(0)}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-r from-purple-600/20 to-purple-800/20 border-purple-500/30">
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <Calendar className="w-8 h-8 text-purple-400" />
              <div>
                <p className="text-purple-200 text-sm">Simulaciones Pendientes</p>
                <p className="text-2xl font-bold text-white">{getSimulacionesPendientes()}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-r from-orange-600/20 to-orange-800/20 border-orange-500/30">
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <Trophy className="w-8 h-8 text-orange-400" />
              <div>
                <p className="text-orange-200 text-sm">Simulaciones Completadas</p>
                <p className="text-2xl font-bold text-white">{resultados.length}</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="disponibles" className="space-y-4">
        <TabsList className="grid w-full grid-cols-3 bg-slate-800">
          <TabsTrigger value="disponibles">Simulaciones Disponibles</TabsTrigger>
          <TabsTrigger value="programadas">Programadas</TabsTrigger>
          <TabsTrigger value="resultados">Mis Resultados</TabsTrigger>
        </TabsList>

        <TabsContent value="disponibles" className="space-y-4">
          <Card className="bg-slate-800/50 border-slate-700">
            <CardHeader>
              <CardTitle className="text-white flex items-center gap-2">
                <Play className="w-5 h-5 text-green-400" />
                Generar Nueva SimulaciÃ³n
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {materiasDisponibles.map((materia) => {
                  const Icono = materia.icono;
                  return (
                    <motion.div
                      key={materia.codigo}
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                    >
                      <Card className="bg-slate-700/50 border-slate-600 hover:border-purple-500/50 transition-colors cursor-pointer">
                        <CardContent className="p-4">
                          <div className="flex items-center gap-3 mb-3">
                            <Icono className={`w-8 h-8 text-${materia.color}-400`} />
                            <div>
                              <h3 className="text-white font-medium">{materia.nombre}</h3>
                              <p className="text-slate-400 text-sm">SimulaciÃ³n oficial PAES</p>
                            </div>
                          </div>
                          
                          <div className="space-y-2">
                            <Button
                              onClick={() => handleGenerateSimulation(materia.codigo, 'practice')}
                              disabled={generatingSimulation}
                              className="w-full bg-blue-600 hover:bg-blue-700"
                              size="sm"
                            >
                              <Play className="w-4 h-4 mr-2" />
                              PrÃ¡ctica
                            </Button>
                            <Button
                              onClick={() => handleGenerateSimulation(materia.codigo, 'official')}
                              disabled={generatingSimulation}
                              className="w-full bg-green-600 hover:bg-green-700"
                              size="sm"
                            >
                              <Timer className="w-4 h-4 mr-2" />
                              Oficial (Cronometrada)
                            </Button>
                          </div>
                        </CardContent>
                      </Card>
                    </motion.div>
                  );
                })}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="programadas" className="space-y-4">
          <div className="grid gap-4">
            {simulaciones.filter(sim => sim.scheduledDate && !sim.isCompleted).map((simulacion) => (
              <Card key={simulacion.id} className="bg-slate-800/50 border-slate-700">
                <CardContent className="p-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <Calendar className="w-6 h-6 text-purple-400" />
                      <div>
                        <h3 className="text-white font-medium">{simulacion.name}</h3>
                        <p className="text-slate-400 text-sm">
                          {simulacion.scheduledDate?.toLocaleDateString('es-CL')} a las{' '}
                          {simulacion.scheduledDate?.toLocaleTimeString('es-CL', { 
                            hour: '2-digit', 
                            minute: '2-digit' 
                          })}
                        </p>
                      </div>
                    </div>
                    
                    <div className="flex items-center gap-3">
                      <Badge variant="outline" className="text-purple-300 border-purple-500">
                        <Clock className="w-3 h-3 mr-1" />
                        {simulacion.duration} min
                      </Badge>
                      <Button
                        onClick={() => onStartSimulation?.(simulacion)}
                        className="bg-purple-600 hover:bg-purple-700"
                        size="sm"
                      >
                        Comenzar
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="resultados" className="space-y-4">
          <div className="grid gap-4">
            {resultados.map((resultado) => (
              <Card key={resultado.id} className="bg-slate-800/50 border-slate-700">
                <CardContent className="p-4">
                  <div className="flex items-center justify-between mb-4">
                    <div>
                      <h3 className="text-white font-medium">
                        SimulaciÃ³n {resultado.simulationId.split('-')[1]?.toUpperCase()}
                      </h3>
                      <p className="text-slate-400 text-sm">
                        {new Date(resultado.completedAt).toLocaleDateString('es-CL')}
                      </p>
                    </div>
                    
                    <div className="text-right">
                      <div className="text-2xl font-bold text-green-400">
                        {resultado.score.toFixed(1)}%
                      </div>
                      <div className="text-sm text-slate-400">
                        {resultado.correctAnswers}/{resultado.totalQuestions} correctas
                      </div>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span className="text-slate-400">Progreso</span>
                      <span className="text-white">{resultado.score.toFixed(1)}%</span>
                    </div>
                    <Progress value={resultado.score} className="h-2" />
                  </div>

                  {resultado.predictedPAESScore && (
                    <div className="mt-3 flex items-center gap-2">
                      <Target className="w-4 h-4 text-purple-400" />
                      <span className="text-slate-400 text-sm">
                        Puntaje PAES proyectado: 
                        <span className="text-purple-400 font-medium ml-1">
                          {resultado.predictedPAESScore}
                        </span>
                      </span>
                    </div>
                  )}
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
};

