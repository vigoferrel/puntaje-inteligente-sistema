/* eslint-disable react-refresh/only-export-components */

import React, { useState } from 'react';
import type { SafeString, SafeNumber, SafeBoolean, APIResponse, OperationResult } from '../types/core';
import { motion } from 'framer-motion';
import { Card, CardContent, CardHeader, CardTitle } from '../../components/ui/card';
import { Button } from '../../components/ui/button';
import { Progress } from '../../components/ui/progress';
import { Badge } from '../../components/ui/badge';
import { Calculator, Target, TrendingUp, BookOpen, Zap } from 'lucide-react';

export const MathematicsIntegration: React.FC = () => {
  const [activeModule, setActiveModule] = useState<'m1' | 'm2'>('m1');
  
  const mathModules = {
    m1: {
      name: 'MatemÃ¡tica M1',
      description: '7Â° bÃ¡sico a 2Â° medio',
      progress: 67,
      topics: ['Ãlgebra', 'GeometrÃ­a', 'EstadÃ­stica'],
      color: 'from-purple-500 to-purple-600'
    },
    m2: {
      name: 'MatemÃ¡tica M2', 
      description: '3Â° y 4Â° medio',
      progress: 54,
      topics: ['CÃ¡lculo', 'Funciones', 'Probabilidades'],
      color: 'from-indigo-500 to-indigo-600'
    }
  };

  return (
    <div className="space-y-6">
      {/* Selector de MÃ³dulo */}
      <div className="flex gap-2 justify-center">
        {Object.entries(mathModules).map(([key, module]) => (
          <Button
            key={key}
            onClick={() => setActiveModule(key as 'm1' | 'm2')}
            className={`${
              activeModule === key 
                ? `bg-gradient-to-r ${module.color} text-white` 
                : 'bg-white/10 text-white/70 hover:bg-white/20'
            }`}
          >
            <Calculator className="w-4 h-4 mr-2" />
            {module.name}
          </Button>
        ))}
      </div>

      {/* Panel Principal */}
      <Card className="bg-black/40 backdrop-blur-xl border-white/10">
        <CardHeader>
          <CardTitle className="text-white flex items-center gap-2">
            <div className={`p-2 rounded-lg bg-gradient-to-r ${mathModules[activeModule].color}`}>
              <Calculator className="w-5 h-5 text-white" />
            </div>
            {mathModules[activeModule].name}
          </CardTitle>
          <p className="text-white/70">{mathModules[activeModule].description}</p>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Progreso */}
            <div className="space-y-4">
              <div>
                <div className="flex justify-between text-sm mb-2">
                  <span className="text-white">Progreso General</span>
                  <span className="text-white font-semibold">{mathModules[activeModule].progress}%</span>
                </div>
                <Progress value={mathModules[activeModule].progress} className="h-3" />
              </div>
              
              <div className="space-y-2">
                {mathModules[activeModule].topics.map((topic, index) => (
                  <div key={topic} className="flex items-center justify-between p-3 bg-white/5 rounded-lg">
                    <span className="text-white text-sm">{topic}</span>
                    <Badge className="bg-green-600/20 text-green-400">
                      {85 - index * 10}%
                    </Badge>
                  </div>
                ))}
              </div>
            </div>

            {/* Herramientas */}
            <div className="space-y-4">
              <Button className="w-full bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700">
                <Calculator className="w-4 h-4 mr-2" />
                Calculadora CientÃ­fica
              </Button>
              
              <Button className="w-full bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700">
                <Target className="w-4 h-4 mr-2" />
                Ejercicios Interactivos
              </Button>
              
              <Button className="w-full bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700">
                <TrendingUp className="w-4 h-4 mr-2" />
                Simulacros PAES
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

