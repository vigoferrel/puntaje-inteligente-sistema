
import React from 'react';
import { motion } from 'framer-motion';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Network, Zap, Brain, Target } from 'lucide-react';

interface ConnectionNode {
  id: string;
  name: string;
  type: 'input' | 'processing' | 'output';
  strength: number;
  active: boolean;
}

interface NeuralConnectionMapProps {
  connections: ConnectionNode[];
  activeModules: string[];
}

export const NeuralConnectionMap: React.FC<NeuralConnectionMapProps> = ({
  connections,
  activeModules
}) => {
  const getNodeIcon = (type: string) => {
    switch (type) {
      case 'input': return Target;
      case 'processing': return Brain;
      case 'output': return Zap;
      default: return Network;
    }
  };

  const getNodeColor = (type: string, active: boolean) => {
    if (!active) return 'from-gray-600 to-gray-700';
    
    switch (type) {
      case 'input': return 'from-green-600 to-emerald-600';
      case 'processing': return 'from-purple-600 to-indigo-600';
      case 'output': return 'from-orange-600 to-red-600';
      default: return 'from-blue-600 to-cyan-600';
    }
  };

  return (
    <Card className="bg-black/40 backdrop-blur-xl border-white/20">
      <CardHeader>
        <CardTitle className="text-white flex items-center gap-2 text-lg">
          <Network className="w-5 h-5 text-cyan-400" />
          Mapa de Conexiones Neurales
          <Badge className="bg-cyan-600 text-white text-xs">
            {activeModules.length} activos
          </Badge>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-3 gap-4 mb-6">
          {['input', 'processing', 'output'].map((type) => {
            const typeNodes = connections.filter(node => node.type === type);
            const activeCount = typeNodes.filter(node => node.active).length;
            
            return (
              <div key={type} className="text-center">
                <div className="text-sm font-medium text-gray-300 mb-2 capitalize">
                  {type === 'input' ? 'Entrada' : type === 'processing' ? 'Procesamiento' : 'Salida'}
                </div>
                <div className="text-2xl font-bold text-white mb-1">
                  {activeCount}/{typeNodes.length}
                </div>
                <div className="text-xs text-gray-400">Nodos Activos</div>
              </div>
            );
          })}
        </div>

        <div className="space-y-3">
          {connections.map((node, index) => {
            const Icon = getNodeIcon(node.type);
            
            return (
              <motion.div
                key={node.id}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.1 }}
                className={`flex items-center gap-3 p-3 rounded-lg ${
                  node.active ? 'bg-white/10' : 'bg-gray-800/50'
                } border border-white/10`}
              >
                <div className={`p-2 rounded-full bg-gradient-to-r ${getNodeColor(node.type, node.active)}`}>
                  <Icon className="w-4 h-4 text-white" />
                </div>
                
                <div className="flex-1">
                  <div className="flex items-center justify-between">
                    <span className={`font-medium ${node.active ? 'text-white' : 'text-gray-400'}`}>
                      {node.name}
                    </span>
                    <span className={`text-sm ${node.active ? 'text-cyan-400' : 'text-gray-500'}`}>
                      {node.strength}% fuerza
                    </span>
                  </div>
                  
                  <div className="flex items-center gap-2 mt-1">
                    <div className={`w-2 h-2 rounded-full ${
                      node.active ? 'bg-green-400 animate-pulse' : 'bg-gray-600'
                    }`} />
                    <span className="text-xs text-gray-400 capitalize">{node.type}</span>
                    {activeModules.includes(node.id) && (
                      <Badge className="bg-green-600 text-white text-xs">Sincronizado</Badge>
                    )}
                  </div>
                </div>
              </motion.div>
            );
          })}
        </div>

        <div className="mt-6 p-4 bg-gradient-to-r from-purple-900/20 to-blue-900/20 rounded-lg border border-purple-500/20">
          <div className="flex items-center gap-2 mb-2">
            <Brain className="w-4 h-4 text-purple-400" />
            <span className="text-sm font-medium text-purple-300">Estado de la Red Neural</span>
          </div>
          <div className="text-xs text-gray-300">
            Sistema funcionando con {connections.filter(n => n.active).length} nodos activos 
            de {connections.length} totales. Conectividad neuronal óptima.
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
