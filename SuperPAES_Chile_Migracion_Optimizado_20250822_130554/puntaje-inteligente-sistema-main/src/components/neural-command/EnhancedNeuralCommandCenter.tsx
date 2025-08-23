/* eslint-disable react-refresh/only-export-components */

import React, { useState } from 'react';
import type { SafeString, SafeNumber, SafeBoolean, APIResponse, OperationResult } from '../types/core';
import { motion } from 'framer-motion';
import { Card, CardContent, CardHeader, CardTitle } from '../../components/ui/card';
import { Button } from '../../components/ui/button';
import { Badge } from '../../components/ui/badge';
import { Brain, Activity, Zap, Network } from 'lucide-react';
import { EnhancedNeuralDataProvider, useEnhancedNeuralData } from './providers/EnhancedNeuralDataProvider';
import { NeuralDimensionCard } from './components/NeuralDimensionCard';
import { NeuralConnectionMap } from './components/NeuralConnectionMap';

const EnhancedNeuralCore: React.FC = () => {
  const { dimensions, connections, activeModules, systemHealth, refreshData } = useEnhancedNeuralData();
  const [selectedDimension, setSelectedDimension] = useState<string | null>(null);
  const [viewMode, setViewMode] = useState<'dimensions' | 'connections'>('dimensions');

  const selectedDimensionData = selectedDimension 
    ? dimensions.find(d => d.id === selectedDimension)
    : null;

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-indigo-900 p-6">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="max-w-7xl mx-auto space-y-8"
      >
        {/* Enhanced Header */}
        <Card className="bg-gradient-to-r from-black/60 to-slate-900/60 backdrop-blur-xl border-cyan-500/30">
          <CardHeader>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="relative">
                  <Brain className="w-10 h-10 text-cyan-400" />
                  <motion.div
                    className="absolute inset-0 w-10 h-10 bg-cyan-400 rounded-full"
                    animate={{ scale: [1, 1.2, 1], opacity: [0.3, 0.6, 0.3] }}
                    transition={{ duration: 2, repeat: Infinity }}
                  />
                </div>
                <div>
                  <CardTitle className="text-white text-3xl">
                    Sistema Neural Mejorado
                  </CardTitle>
                  <p className="text-cyan-300 text-lg">
                    Red neuronal con {dimensions.length} dimensiones activas
                  </p>
                </div>
              </div>
              
              <div className="flex items-center gap-4">
                <div className="text-center">
                  <div className="text-2xl font-bold text-green-400">{systemHealth}%</div>
                  <div className="text-sm text-gray-300">Salud del Sistema</div>
                </div>
                <Button
                  onClick={refreshData}
                  className="bg-gradient-to-r from-cyan-600 to-blue-600"
                >
                  <Activity className="w-4 h-4 mr-2" />
                  Actualizar
                </Button>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <div className="flex gap-3 mb-4">
              <Button
                onClick={() => setViewMode('dimensions')}
                className={viewMode === 'dimensions' 
                  ? 'bg-gradient-to-r from-purple-600 to-indigo-600' 
                  : 'bg-gray-700 hover:bg-gray-600'
                }
              >
                <Brain className="w-4 h-4 mr-2" />
                Dimensiones Neurales
              </Button>
              <Button
                onClick={() => setViewMode('connections')}
                className={viewMode === 'connections' 
                  ? 'bg-gradient-to-r from-cyan-600 to-blue-600' 
                  : 'bg-gray-700 hover:bg-gray-600'
                }
              >
                <Network className="w-4 h-4 mr-2" />
                Mapa de Conexiones
              </Button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <div className="text-center">
                <div className="text-2xl font-bold text-cyan-400">{dimensions.length}</div>
                <div className="text-sm text-gray-300">Dimensiones</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-green-400">{activeModules.length}</div>
                <div className="text-sm text-gray-300">MÃ³dulos Activos</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-purple-400">
                  {Math.round(dimensions.reduce((sum, d) => sum + d.value, 0) / dimensions.length)}%
                </div>
                <div className="text-sm text-gray-300">Rendimiento Promedio</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-yellow-400">
                  {connections.filter(c => c.active).length}/{connections.length}
                </div>
                <div className="text-sm text-gray-300">Conexiones Activas</div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Main Content Area */}
        {viewMode === 'dimensions' ? (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Dimensions Grid */}
            <div className="lg:col-span-2">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {dimensions.map((dimension, index) => (
                  <motion.div
                    key={dimension.id}
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: index * 0.1 }}
                  >
                    <NeuralDimensionCard
                      dimension={dimension}
                      onClick={setSelectedDimension}
                      isActive={selectedDimension === dimension.id}
                    />
                  </motion.div>
                ))}
              </div>
            </div>

            {/* Dimension Details */}
            <div className="lg:col-span-1">
              {selectedDimensionData ? (
                <Card className="bg-black/40 backdrop-blur-xl border-white/20">
                  <CardHeader>
                    <CardTitle className="text-white flex items-center gap-2">
                      {selectedDimensionData.iconElement}
                      {selectedDimensionData.title}
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <p className="text-gray-300 text-sm">
                      {selectedDimensionData.description}
                    </p>
                    
                    <div className="flex items-center justify-between">
                      <span className="text-gray-400 text-sm">Valor Actual:</span>
                      <span className="text-white font-bold text-lg">
                        {selectedDimensionData.value}%
                      </span>
                    </div>
                    
                    <div className="flex items-center justify-between">
                      <span className="text-gray-400 text-sm">Tendencia:</span>
                      <Badge className={
                        selectedDimensionData.trend === 'up' ? 'bg-green-600' :
                        selectedDimensionData.trend === 'down' ? 'bg-red-600' : 'bg-gray-600'
                      }>
                        {selectedDimensionData.trend === 'up' ? 'â†—ï¸ Mejorando' :
                         selectedDimensionData.trend === 'down' ? 'â†˜ï¸ Declinando' : 'âž¡ï¸ Estable'}
                      </Badge>
                    </div>
                    
                    <div className="pt-4 border-t border-white/10">
                      <h4 className="text-white font-medium mb-2">Conexiones:</h4>
                      <div className="space-y-1">
                        {selectedDimensionData.connections.map(connectionId => {
                          const connected = dimensions.find(d => d.id === connectionId);
                          return connected ? (
                            <div key={connectionId} className="text-sm text-gray-300 flex items-center gap-2">
                              <Zap className="w-3 h-3 text-yellow-400" />
                              {connected.title}
                            </div>
                          ) : null;
                        })}
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ) : (
                <Card className="bg-black/40 backdrop-blur-xl border-white/20">
                  <CardContent className="p-8 text-center">
                    <Brain className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                    <p className="text-gray-300">
                      Selecciona una dimensiÃ³n neural para ver sus detalles
                    </p>
                  </CardContent>
                </Card>
              )}
            </div>
          </div>
        ) : (
          /* Connections View */
          <NeuralConnectionMap 
            connections={connections} 
            activeModules={activeModules} 
          />
        )}
      </motion.div>
    </div>
  );
};

export const EnhancedNeuralCommandCenter: React.FC = () => {
  return (
    <EnhancedNeuralDataProvider>
      <EnhancedNeuralCore />
    </EnhancedNeuralDataProvider>
  );
};

