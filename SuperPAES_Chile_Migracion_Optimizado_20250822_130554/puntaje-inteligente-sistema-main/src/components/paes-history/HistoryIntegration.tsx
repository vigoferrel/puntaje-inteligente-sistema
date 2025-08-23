/* eslint-disable react-refresh/only-export-components */

import React, { useState } from 'react';
import type { SafeString, SafeNumber, SafeBoolean, APIResponse, OperationResult } from '../types/core';
import { motion } from 'framer-motion';
import { Card, CardContent, CardHeader, CardTitle } from '../../components/ui/card';
import { Button } from '../../components/ui/button';
import { Progress } from '../../components/ui/progress';
import { Badge } from '../../components/ui/badge';
import { Scroll, Clock, Map, Users, BookOpen } from 'lucide-react';

export const HistoryIntegration: React.FC = () => {
  const [activePeriod, setActivePeriod] = useState<'chile' | 'america' | 'world'>('chile');
  
  const historyPeriods = {
    chile: {
      name: 'Historia de Chile',
      progress: 63,
      topics: ['Independencia', 'RepÃºblica', 'Siglo XX'],
      color: 'from-amber-500 to-amber-600'
    },
    america: {
      name: 'Historia de AmÃ©rica',
      progress: 58,
      topics: ['Conquista', 'Colonia', 'Independencias'],
      color: 'from-orange-500 to-orange-600'
    },
    world: {
      name: 'Historia Universal',
      progress: 61,
      topics: ['Antiguedad', 'Edad Media', 'Mundo Moderno'],
      color: 'from-red-500 to-red-600'
    }
  };

  return (
    <div className="space-y-6">
      {/* Selector de PerÃ­odo */}
      <div className="flex gap-2 justify-center">
        {Object.entries(historyPeriods).map(([key, period]) => (
          <Button
            key={key}
            onClick={() => setActivePeriod(key as unknown)}
            className={`${
              activePeriod === key 
                ? `bg-gradient-to-r ${period.color} text-white` 
                : 'bg-white/10 text-white/70 hover:bg-white/20'
            }`}
          >
            <Scroll className="w-4 h-4 mr-2" />
            {period.name}
          </Button>
        ))}
      </div>

      {/* Panel Principal */}
      <Card className="bg-black/40 backdrop-blur-xl border-white/10">
        <CardHeader>
          <CardTitle className="text-white flex items-center gap-2">
            <div className={`p-2 rounded-lg bg-gradient-to-r ${historyPeriods[activePeriod].color}`}>
              <Scroll className="w-5 h-5 text-white" />
            </div>
            {historyPeriods[activePeriod].name}
          </CardTitle>
          <p className="text-white/70">AnÃ¡lisis histÃ³rico y pensamiento crÃ­tico</p>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Progreso */}
            <div className="space-y-4">
              <div>
                <div className="flex justify-between text-sm mb-2">
                  <span className="text-white">Progreso en {historyPeriods[activePeriod].name}</span>
                  <span className="text-white font-semibold">{historyPeriods[activePeriod].progress}%</span>
                </div>
                <Progress value={historyPeriods[activePeriod].progress} className="h-3" />
              </div>
              
              <div className="space-y-2">
                {historyPeriods[activePeriod].topics.map((topic, index) => (
                  <div key={topic} className="flex items-center justify-between p-3 bg-white/5 rounded-lg">
                    <span className="text-white text-sm">{topic}</span>
                    <Badge className="bg-green-600/20 text-green-400">
                      {75 - index * 5}%
                    </Badge>
                  </div>
                ))}
              </div>
            </div>

            {/* Herramientas HistÃ³ricas */}
            <div className="space-y-4">
              <Button className="w-full bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700">
                <Clock className="w-4 h-4 mr-2" />
                LÃ­nea de Tiempo
              </Button>
              
              <Button className="w-full bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700">
                <Map className="w-4 h-4 mr-2" />
                Mapas Interactivos
              </Button>
              
              <Button className="w-full bg-gradient-to-r from-purple-500 to-purple-600 hover:from-purple-600 hover:to-purple-700">
                <Users className="w-4 h-4 mr-2" />
                AnÃ¡lisis de Fuentes
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

