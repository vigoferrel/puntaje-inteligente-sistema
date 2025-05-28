
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { motion } from 'framer-motion';
import { 
  Command, 
  Brain, 
  Target, 
  Settings,
  Activity,
  Zap
} from 'lucide-react';

export const SuperPAESCommandCenter: React.FC = () => {
  return (
    <div className="space-y-6">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center space-y-4"
      >
        <div className="flex items-center justify-center gap-3">
          <div className="p-3 rounded-xl bg-gradient-to-r from-purple-500 to-pink-500">
            <Command className="w-8 h-8 text-white" />
          </div>
          <div>
            <h2 className="text-3xl font-bold text-white">Centro de Comando Neural</h2>
            <p className="text-white/70">Control avanzado del sistema PAES</p>
          </div>
        </div>
      </motion.div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <Card className="bg-white/5 border-white/10 backdrop-blur-xl">
          <CardHeader>
            <CardTitle className="text-white flex items-center gap-2">
              <Brain className="w-5 h-5" />
              Sistema Neural
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              <div className="flex justify-between text-sm">
                <span className="text-white/70">Estado</span>
                <Badge className="bg-green-500/20 text-green-400">Activo</Badge>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-white/70">Conexiones</span>
                <span className="text-white">127 nodos</span>
              </div>
              <Button className="w-full" variant="outline">
                Configurar
              </Button>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-white/5 border-white/10 backdrop-blur-xl">
          <CardHeader>
            <CardTitle className="text-white flex items-center gap-2">
              <Target className="w-5 h-5" />
              Objetivos PAES
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              <div className="flex justify-between text-sm">
                <span className="text-white/70">Progreso</span>
                <span className="text-white">67%</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-white/70">Meta</span>
                <span className="text-white">750 pts</span>
              </div>
              <Button className="w-full" variant="outline">
                Ajustar Meta
              </Button>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-white/5 border-white/10 backdrop-blur-xl">
          <CardHeader>
            <CardTitle className="text-white flex items-center gap-2">
              <Activity className="w-5 h-5" />
              Monitoreo
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              <div className="flex justify-between text-sm">
                <span className="text-white/70">Rendimiento</span>
                <Badge className="bg-blue-500/20 text-blue-400">Óptimo</Badge>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-white/70">Alertas</span>
                <span className="text-white">0</span>
              </div>
              <Button className="w-full" variant="outline">
                Ver Detalles
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};
