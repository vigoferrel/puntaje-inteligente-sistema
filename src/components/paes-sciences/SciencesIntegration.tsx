
import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { Flask, Zap, Activity, Globe, Eye } from 'lucide-react';

export const SciencesIntegration: React.FC = () => {
  const [activeArea, setActiveArea] = useState<'physics' | 'chemistry' | 'biology'>('physics');
  
  const scienceAreas = {
    physics: {
      name: 'Física',
      icon: Atom,
      progress: 72,
      topics: ['Mecánica', 'Ondas', 'Electricidad'],
      color: 'from-green-500 to-green-600'
    },
    chemistry: {
      name: 'Química',
      icon: FlaskConical,
      progress: 68,
      topics: ['Estructura Atómica', 'Reacciones', 'Estequiometría'],
      color: 'from-emerald-500 to-emerald-600'
    },
    biology: {
      name: 'Biología',
      icon: Activity,
      progress: 75,
      topics: ['Células', 'Genética', 'Evolución'],
      color: 'from-teal-500 to-teal-600'
    }
  };

  return (
    <div className="space-y-6">
      {/* Selector de Área */}
      <div className="flex gap-2 justify-center">
        {Object.entries(scienceAreas).map(([key, area]) => {
          const Icon = area.icon;
          return (
            <Button
              key={key}
              onClick={() => setActiveArea(key as any)}
              className={`${
                activeArea === key 
                  ? `bg-gradient-to-r ${area.color} text-white` 
                  : 'bg-white/10 text-white/70 hover:bg-white/20'
              }`}
            >
              <Icon className="w-4 h-4 mr-2" />
              {area.name}
            </Button>
          );
        })}
      </div>

      {/* Panel Principal */}
      <Card className="bg-black/40 backdrop-blur-xl border-white/10">
        <CardHeader>
          <CardTitle className="text-white flex items-center gap-2">
            <div className={`p-2 rounded-lg bg-gradient-to-r ${scienceAreas[activeArea].color}`}>
              {React.createElement(scienceAreas[activeArea].icon, { className: "w-5 h-5 text-white" })}
            </div>
            Ciencias - {scienceAreas[activeArea].name}
          </CardTitle>
          <p className="text-white/70">Área de {scienceAreas[activeArea].name} PAES</p>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Progreso */}
            <div className="space-y-4">
              <div>
                <div className="flex justify-between text-sm mb-2">
                  <span className="text-white">Progreso en {scienceAreas[activeArea].name}</span>
                  <span className="text-white font-semibold">{scienceAreas[activeArea].progress}%</span>
                </div>
                <Progress value={scienceAreas[activeArea].progress} className="h-3" />
              </div>
              
              <div className="space-y-2">
                {scienceAreas[activeArea].topics.map((topic, index) => (
                  <div key={topic} className="flex items-center justify-between p-3 bg-white/5 rounded-lg">
                    <span className="text-white text-sm">{topic}</span>
                    <Badge className="bg-green-600/20 text-green-400">
                      {80 - index * 8}%
                    </Badge>
                  </div>
                ))}
              </div>
            </div>

            {/* Laboratorios Virtuales */}
            <div className="space-y-4">
              <Button className="w-full bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700">
                <Eye className="w-4 h-4 mr-2" />
                Laboratorio Virtual
              </Button>
              
              <Button className="w-full bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700">
                <FlaskConical className="w-4 h-4 mr-2" />
                Experimentos 3D
              </Button>
              
              <Button className="w-full bg-gradient-to-r from-purple-500 to-purple-600 hover:from-purple-600 hover:to-purple-700">
                <Globe className="w-4 h-4 mr-2" />
                Simulaciones PAES
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
