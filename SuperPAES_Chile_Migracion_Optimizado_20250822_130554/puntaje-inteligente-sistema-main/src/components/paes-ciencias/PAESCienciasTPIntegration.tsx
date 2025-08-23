/* eslint-disable react-refresh/only-export-components */

import React, { useState } from 'react';
import type { SafeString, SafeNumber, SafeBoolean, APIResponse, OperationResult } from '../types/core';
import { Card, CardContent, CardHeader, CardTitle } from '../../components/ui/card';
import { Button } from '../../components/ui/button';
import { Badge } from '../../components/ui/badge';
import { Progress } from '../../components/ui/progress';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../../components/ui/tabs';
import { 
  Microscope, 
  Beaker, 
  Atom, 
  FlaskConical,
  TrendingUp,
  BookOpen,
  Target,
  BarChart3,
  Zap,
  TestTube
} from 'lucide-react';
import { motion } from 'framer-motion';
import { usePAESCienciasTPIntegration } from '../../hooks/paes-ciencias-tp/use-paes-ciencias-tp-integration';

interface PAESCienciasTPIntegrationProps {
  className?: string;
}

export const PAESCienciasTPIntegration = ({ className }: PAESCienciasTPIntegrationProps) => {
  const {
    isLoading,
    examData,
    examStats,
    loadExam,
    validateExam,
    generateAreaSimulation,
    generateFullSimulation,
    biologiaCount,
    fisicaCount,
    quimicaCount,
    pilotQuestions,
    validQuestions
  } = usePAESCienciasTPIntegration();

  const [activeTab, setActiveTab] = useState('overview');

  const getAreaIcon = (area: string) => {
    switch (area) {
      case 'BIOLOGIA': return Microscope;
      case 'FISICA': return Zap;
      case 'QUIMICA': return TestTube;
      default: return FlaskConical;
    }
  };

  const getAreaColor = (area: string) => {
    switch (area) {
      case 'BIOLOGIA': return 'text-green-400 bg-green-600/10 border-green-600/30';
      case 'FISICA': return 'text-blue-400 bg-blue-600/10 border-blue-600/30';
      case 'QUIMICA': return 'text-purple-400 bg-purple-600/10 border-purple-600/30';
      default: return 'text-gray-400 bg-gray-600/10 border-gray-600/30';
    }
  };

  if (isLoading && !examData) {
    return (
      <Card className="bg-gray-800 border-gray-700">
        <CardContent className="p-8 text-center">
          <FlaskConical className="h-12 w-12 text-purple-400 mx-auto mb-4 animate-pulse" />
          <p className="text-gray-300">Cargando integraciÃ³n PAES Ciencias TP...</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className={`space-y-6 ${className}`}>
      {/* Header con estadÃ­sticas */}
      <Card className="bg-gradient-to-r from-purple-900/50 to-green-900/50 border-purple-700/50">
        <CardHeader>
          <CardTitle className="text-white flex items-center gap-2">
            <FlaskConical className="h-5 w-5 text-purple-400" />
            PAES Ciencias TÃ©cnico Profesional 2024 - Forma 183
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="bg-gray-800/50 rounded-lg p-4 text-center">
              <BookOpen className="h-8 w-8 text-purple-400 mx-auto mb-2" />
              <div className="text-2xl font-bold text-white">{examData?.preguntas.length || 80}</div>
              <div className="text-sm text-gray-400">Total Preguntas</div>
            </div>
            
            <div className="bg-gray-800/50 rounded-lg p-4 text-center">
              <Target className="h-8 w-8 text-green-400 mx-auto mb-2" />
              <div className="text-2xl font-bold text-white">{validQuestions}</div>
              <div className="text-sm text-gray-400">Preguntas VÃ¡lidas</div>
            </div>
            
            <div className="bg-gray-800/50 rounded-lg p-4 text-center">
              <TrendingUp className="h-8 w-8 text-blue-400 mx-auto mb-2" />
              <div className="text-2xl font-bold text-white">3</div>
              <div className="text-sm text-gray-400">Ãreas CientÃ­ficas</div>
            </div>
            
            <div className="bg-gray-800/50 rounded-lg p-4 text-center">
              <BarChart3 className="h-8 w-8 text-yellow-400 mx-auto mb-2" />
              <div className="text-2xl font-bold text-white">160</div>
              <div className="text-sm text-gray-400">Minutos</div>
            </div>
          </div>

          <div className="flex gap-2 mt-4">
            <Button 
              onClick={loadExam} 
              disabled={isLoading}
              className="bg-purple-600 hover:bg-purple-700"
            >
              {isLoading ? 'Cargando...' : 'Cargar Examen'}
            </Button>
            <Button 
              onClick={validateExam} 
              disabled={isLoading || !examData}
              variant="outline"
            >
              Validar Integridad
            </Button>
          </div>
        </CardContent>
      </Card>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid w-full grid-cols-4 bg-gray-800 border-gray-700">
          <TabsTrigger 
            value="overview" 
            className="data-[state=active]:bg-purple-600 data-[state=active]:text-white"
          >
            Resumen
          </TabsTrigger>
          <TabsTrigger 
            value="areas"
            className="data-[state=active]:bg-purple-600 data-[state=active]:text-white"
          >
            Ãreas
          </TabsTrigger>
          <TabsTrigger 
            value="modules"
            className="data-[state=active]:bg-purple-600 data-[state=active]:text-white"
          >
            MÃ³dulos
          </TabsTrigger>
          <TabsTrigger 
            value="simulations"
            className="data-[state=active]:bg-purple-600 data-[state=active]:text-white"
          >
            Simulaciones
          </TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-6">
          {/* DistribuciÃ³n por Ã¡reas cientÃ­ficas */}
          <Card className="bg-gray-800 border-gray-700">
            <CardHeader>
              <CardTitle className="text-white">DistribuciÃ³n por Ãreas CientÃ­ficas</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {[
                  { area: 'BIOLOGIA', name: 'BiologÃ­a', count: biologiaCount, range: '1-28' },
                  { area: 'FISICA', name: 'FÃ­sica', count: fisicaCount, range: '29-54' },
                  { area: 'QUIMICA', name: 'QuÃ­mica', count: quimicaCount, range: '55-80' }
                ].map((item, index) => {
                  const Icon = getAreaIcon(item.area);
                  
                  return (
                    <motion.div
                      key={item.area}
                      initial={{ opacity: 0, scale: 0.95 }}
                      animate={{ opacity: 1, scale: 1 }}
                      transition={{ delay: index * 0.1 }}
                      className={`p-4 rounded-lg border ${getAreaColor(item.area)}`}
                    >
                      <div className="flex items-center gap-2 mb-3">
                        <Icon className="h-5 w-5" />
                        <span className="font-medium text-white">{item.name}</span>
                      </div>
                      
                      <div className="space-y-2">
                        <div className="text-2xl font-bold text-white">{item.count}</div>
                        <div className="text-sm text-gray-400">preguntas ({item.range})</div>
                        <div className="text-xs text-gray-500">
                          {((item.count / 80) * 100).toFixed(1)}% del examen
                        </div>
                      </div>
                    </motion.div>
                  );
                })}
              </div>
            </CardContent>
          </Card>

          {/* Estructura del examen */}
          <Card className="bg-gray-800 border-gray-700">
            <CardHeader>
              <CardTitle className="text-white">Estructura del Examen</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <h4 className="text-lg font-semibold text-white">MÃ³dulo ComÃºn (54 preguntas)</h4>
                  <div className="space-y-2">
                    <div className="flex justify-between items-center p-3 bg-green-600/10 rounded-lg">
                      <span className="text-green-400">BiologÃ­a</span>
                      <span className="text-white font-bold">28 preguntas</span>
                    </div>
                    <div className="flex justify-between items-center p-3 bg-blue-600/10 rounded-lg">
                      <span className="text-blue-400">FÃ­sica</span>
                      <span className="text-white font-bold">26 preguntas</span>
                    </div>
                  </div>
                </div>
                
                <div className="space-y-4">
                  <h4 className="text-lg font-semibold text-white">MÃ³dulo TÃ©cnico Profesional (26 preguntas)</h4>
                  <div className="space-y-2">
                    <div className="flex justify-between items-center p-3 bg-purple-600/10 rounded-lg">
                      <span className="text-purple-400">QuÃ­mica</span>
                      <span className="text-white font-bold">26 preguntas</span>
                    </div>
                    <div className="text-sm text-gray-400 mt-2">
                      EspecÃ­fico para estudiantes de colegios TÃ©cnico Profesionales
                    </div>
                  </div>
                </div>
              </div>
              
              <div className="mt-6 p-4 bg-yellow-600/10 border border-yellow-600/30 rounded-lg">
                <div className="flex items-center gap-2 mb-2">
                  <Target className="h-4 w-4 text-yellow-400" />
                  <span className="text-yellow-400 font-medium">Preguntas Piloto</span>
                </div>
                <p className="text-gray-300 text-sm">
                  {pilotQuestions} preguntas piloto estÃ¡n excluidas del puntaje (preguntas 11, 16, 35, 52, 80)
                </p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="areas" className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {['BIOLOGIA', 'FISICA', 'QUIMICA'].map((area) => {
              const Icon = getAreaIcon(area);
              const areaName = area === 'BIOLOGIA' ? 'BiologÃ­a' : 
                             area === 'FISICA' ? 'FÃ­sica' : 'QuÃ­mica';
              const count = area === 'BIOLOGIA' ? biologiaCount :
                           area === 'FISICA' ? fisicaCount : quimicaCount;
              
              return (
                <Card key={area} className="bg-gray-800 border-gray-700">
                  <CardHeader>
                    <CardTitle className="text-white flex items-center gap-2">
                      <Icon className="h-5 w-5" />
                      {areaName}
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      <div className="text-center">
                        <div className="text-3xl font-bold text-white">{count}</div>
                        <div className="text-sm text-gray-400">preguntas</div>
                      </div>
                      
                      <Button 
                        onClick={() => generateAreaSimulation(area as unknown, 10)}
                        disabled={isLoading}
                        className="w-full"
                        variant="outline"
                      >
                        Simular {areaName}
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </TabsContent>

        <TabsContent value="modules" className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card className="bg-gray-800 border-gray-700">
              <CardHeader>
                <CardTitle className="text-white">MÃ³dulo ComÃºn</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="text-center">
                    <div className="text-3xl font-bold text-white">54</div>
                    <div className="text-sm text-gray-400">preguntas (1-54)</div>
                  </div>
                  
                  <div className="space-y-2">
                    <div className="text-sm text-gray-300">Ãreas incluidas:</div>
                    <Badge variant="outline" className="mr-2">BiologÃ­a (28)</Badge>
                    <Badge variant="outline">FÃ­sica (26)</Badge>
                  </div>
                  
                  <div className="text-xs text-gray-500">
                    ComÃºn para todos los estudiantes
                  </div>
                </div>
              </CardContent>
            </Card>
            
            <Card className="bg-gray-800 border-gray-700">
              <CardHeader>
                <CardTitle className="text-white">MÃ³dulo TÃ©cnico Profesional</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="text-center">
                    <div className="text-3xl font-bold text-white">26</div>
                    <div className="text-sm text-gray-400">preguntas (55-80)</div>
                  </div>
                  
                  <div className="space-y-2">
                    <div className="text-sm text-gray-300">Ãrea incluida:</div>
                    <Badge variant="outline">QuÃ­mica (26)</Badge>
                  </div>
                  
                  <div className="text-xs text-gray-500">
                    Solo para estudiantes de colegios TÃ©cnico Profesionales
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="simulations" className="space-y-6">
          <Card className="bg-gray-800 border-gray-700">
            <CardHeader>
              <CardTitle className="text-white">Generar Simulaciones</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Button 
                  onClick={() => generateFullSimulation(40)}
                  disabled={isLoading}
                  className="bg-purple-600 hover:bg-purple-700"
                >
                  SimulaciÃ³n Completa (40 preguntas)
                </Button>
                
                <Button 
                  onClick={() => generateAreaSimulation('BIOLOGIA', 15)}
                  disabled={isLoading}
                  className="bg-green-600 hover:bg-green-700"
                >
                  Solo BiologÃ­a (15 preguntas)
                </Button>
                
                <Button 
                  onClick={() => generateAreaSimulation('FISICA', 13)}
                  disabled={isLoading}
                  className="bg-blue-600 hover:bg-blue-700"
                >
                  Solo FÃ­sica (13 preguntas)
                </Button>
                
                <Button 
                  onClick={() => generateAreaSimulation('QUIMICA', 13)}
                  disabled={isLoading}
                  className="bg-purple-600 hover:bg-purple-700"
                >
                  Solo QuÃ­mica (13 preguntas)
                </Button>
              </div>
              
              <div className="mt-6 p-4 bg-blue-600/10 border border-blue-600/30 rounded-lg">
                <div className="text-sm text-gray-300">
                  <strong>Nota:</strong> Las simulaciones utilizan preguntas reales del examen PAES Ciencias TP 2024, 
                  excluyendo las preguntas piloto para una experiencia mÃ¡s realista.
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

