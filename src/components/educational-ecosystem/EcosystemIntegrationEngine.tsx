
import React from 'react';
import { motion } from 'framer-motion';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Network, Zap, Brain, Target } from 'lucide-react';
import { useGlobalCinematic } from '@/contexts/GlobalCinematicContext';

export const EcosystemIntegrationEngine: React.FC = () => {
  const { state } = useGlobalCinematic();

  const integrationMetrics = [
    {
      name: 'Sincronización Neural',
      value: 95,
      icon: Brain,
      color: 'from-purple-500 to-pink-500'
    },
    {
      name: 'Conectividad de Datos',
      value: 88,
      icon: Network,
      color: 'from-blue-500 to-cyan-500'
    },
    {
      name: 'Optimización Activa',
      value: 92,
      icon: Zap,
      color: 'from-yellow-500 to-orange-500'
    },
    {
      name: 'Precisión de Objetivos',
      value: 87,
      icon: Target,
      color: 'from-green-500 to-emerald-500'
    }
  ];

  return (
    <Card className="bg-black/40 backdrop-blur-xl border-white/10">
      <CardHeader>
        <CardTitle className="text-white flex items-center gap-2">
          <Network className="w-5 h-5 text-cyan-400" />
          Motor de Integración del Ecosistema
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {integrationMetrics.map((metric, index) => {
          const Icon = metric.icon;
          return (
            <motion.div
              key={metric.name}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: index * 0.1 }}
              className="space-y-2"
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className={`w-6 h-6 bg-gradient-to-r ${metric.color} rounded flex items-center justify-center`}>
                    <Icon className="w-3 h-3 text-white" />
                  </div>
                  <span className="text-white text-sm">{metric.name}</span>
                </div>
                <span className="text-cyan-400 text-sm font-bold">{metric.value}%</span>
              </div>
              <Progress value={metric.value} className="h-2" />
            </motion.div>
          );
        })}

        <div className="mt-6 p-4 bg-white/5 rounded-lg">
          <div className="text-white text-sm font-medium mb-2">Estado del Sistema</div>
          <div className="text-green-400 text-xs">
            ✅ Todos los módulos integrados correctamente
          </div>
          <div className="text-cyan-400 text-xs mt-1">
            🔄 Sincronización en tiempo real activa
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
