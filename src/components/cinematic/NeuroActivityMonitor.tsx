
import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Brain, Activity, Zap, Eye } from 'lucide-react';

interface NeuroActivityMonitorProps {
  activity: number;
  position?: 'top-right' | 'top-left' | 'bottom-right' | 'bottom-left';
}

export const NeuroActivityMonitor: React.FC<NeuroActivityMonitorProps> = ({
  activity,
  position = 'top-right'
}) => {
  const [neuralData, setNeuralData] = useState({
    synapses: 0,
    neurons: 0,
    efficiency: 0,
    connections: 0
  });

  const [isCollapsed, setIsCollapsed] = useState(false);

  useEffect(() => {
    const interval = setInterval(() => {
      setNeuralData(prev => ({
        synapses: Math.round(activity * 1000 + Math.sin(Date.now() / 1000) * 100),
        neurons: Math.round(activity * 50 + Math.cos(Date.now() / 800) * 10),
        efficiency: Math.round(Math.min(100, activity + Math.sin(Date.now() / 600) * 20)),
        connections: Math.round(activity * 200 + Math.sin(Date.now() / 1200) * 50)
      }));
    }, 100);

    return () => clearInterval(interval);
  }, [activity]);

  const getPositionClasses = () => {
    const positions = {
      'top-right': 'top-4 right-4',
      'top-left': 'top-4 left-4',
      'bottom-right': 'bottom-4 right-4',
      'bottom-left': 'bottom-4 left-4'
    };
    return positions[position];
  };

  const getActivityLevel = () => {
    if (activity > 80) return { level: 'Hiperactivo', color: 'from-red-500 to-orange-500' };
    if (activity > 60) return { level: 'Alto', color: 'from-orange-500 to-yellow-500' };
    if (activity > 40) return { level: 'Moderado', color: 'from-yellow-500 to-green-500' };
    if (activity > 20) return { level: 'Bajo', color: 'from-green-500 to-blue-500' };
    return { level: 'Reposo', color: 'from-blue-500 to-purple-500' };
  };

  const activityInfo = getActivityLevel();

  return (
    <motion.div
      className={`fixed ${getPositionClasses()} z-40 select-none`}
      initial={{ opacity: 0, scale: 0.8 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.5 }}
    >
      <Card className="bg-black/40 backdrop-blur-xl border-white/20 overflow-hidden">
        <CardContent className="p-4">
          <div className="flex items-center gap-3 mb-3">
            <motion.div
              animate={{ rotate: 360 }}
              transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
              className={`w-8 h-8 rounded-full bg-gradient-to-r ${activityInfo.color} flex items-center justify-center`}
            >
              <Brain className="w-4 h-4 text-white" />
            </motion.div>
            
            <div className="flex-1">
              <h3 className="text-white font-semibold text-sm">Neural Monitor</h3>
              <Badge className={`bg-gradient-to-r ${activityInfo.color} text-white text-xs`}>
                {activityInfo.level}
              </Badge>
            </div>

            <button
              onClick={() => setIsCollapsed(!isCollapsed)}
              className="text-white/60 hover:text-white transition-colors"
            >
              <Eye className="w-4 h-4" />
            </button>
          </div>

          <motion.div
            animate={{ height: isCollapsed ? 0 : 'auto', opacity: isCollapsed ? 0 : 1 }}
            transition={{ duration: 0.3 }}
            className="overflow-hidden"
          >
            <div className="space-y-3">
              {/* Actividad Principal */}
              <div className="flex items-center justify-between">
                <span className="text-white/80 text-xs">Actividad</span>
                <span className="text-cyan-400 font-mono text-sm">{activity}%</span>
              </div>

              {/* Métricas Neurales */}
              <div className="grid grid-cols-2 gap-2 text-xs">
                <div className="bg-white/5 rounded p-2">
                  <div className="flex items-center gap-1">
                    <Activity className="w-3 h-3 text-blue-400" />
                    <span className="text-white/60">Sinapsis</span>
                  </div>
                  <div className="text-blue-400 font-mono">{neuralData.synapses.toLocaleString()}</div>
                </div>

                <div className="bg-white/5 rounded p-2">
                  <div className="flex items-center gap-1">
                    <Zap className="w-3 h-3 text-yellow-400" />
                    <span className="text-white/60">Neuronas</span>
                  </div>
                  <div className="text-yellow-400 font-mono">{neuralData.neurons.toLocaleString()}</div>
                </div>

                <div className="bg-white/5 rounded p-2">
                  <div className="flex items-center gap-1">
                    <Brain className="w-3 h-3 text-green-400" />
                    <span className="text-white/60">Eficiencia</span>
                  </div>
                  <div className="text-green-400 font-mono">{neuralData.efficiency}%</div>
                </div>

                <div className="bg-white/5 rounded p-2">
                  <div className="flex items-center gap-1">
                    <Activity className="w-3 h-3 text-purple-400" />
                    <span className="text-white/60">Conexiones</span>
                  </div>
                  <div className="text-purple-400 font-mono">{neuralData.connections.toLocaleString()}</div>
                </div>
              </div>

              {/* Onda Neural Visualizada */}
              <div className="mt-3">
                <div className="text-white/60 text-xs mb-1">Onda Neural</div>
                <div className="h-8 bg-black/20 rounded overflow-hidden">
                  <svg className="w-full h-full">
                    <motion.path
                      d={`M0,16 Q20,${16 - activity/5} 40,16 T80,16 T120,16 T160,16 T200,16`}
                      stroke="url(#neuralGradient)"
                      strokeWidth="2"
                      fill="none"
                      animate={{ d: [
                        `M0,16 Q20,${16 - activity/5} 40,16 T80,16 T120,16 T160,16 T200,16`,
                        `M0,16 Q20,${16 + activity/5} 40,16 T80,16 T120,16 T160,16 T200,16`,
                        `M0,16 Q20,${16 - activity/5} 40,16 T80,16 T120,16 T160,16 T200,16`
                      ]}}
                      transition={{ duration: 2, repeat: Infinity }}
                    />
                    <defs>
                      <linearGradient id="neuralGradient" x1="0%" y1="0%" x2="100%" y2="0%">
                        <stop offset="0%" stopColor="#06b6d4" />
                        <stop offset="50%" stopColor="#8b5cf6" />
                        <stop offset="100%" stopColor="#06b6d4" />
                      </linearGradient>
                    </defs>
                  </svg>
                </div>
              </div>
            </div>
          </motion.div>
        </CardContent>
      </Card>
    </motion.div>
  );
};
