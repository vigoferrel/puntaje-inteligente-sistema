
import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { TrendingUp, Activity, Zap, Target, Brain, BookOpen } from 'lucide-react';

interface HolographicDataFlowProps {
  currentModule: string;
  userProgress: any;
  neuralActivity: number;
}

interface DataNode {
  id: string;
  type: 'metric' | 'progress' | 'achievement' | 'prediction';
  value: number | string;
  label: string;
  color: string;
  icon: React.ComponentType<any>;
  x: number;
  y: number;
  connections: string[];
}

export const HolographicDataFlow: React.FC<HolographicDataFlowProps> = ({
  currentModule,
  userProgress,
  neuralActivity
}) => {
  const [dataNodes, setDataNodes] = useState<DataNode[]>([]);
  const [flowActive, setFlowActive] = useState(true);

  useEffect(() => {
    const generateDataNodes = () => {
      const nodes: DataNode[] = [
        {
          id: 'neural-activity',
          type: 'metric',
          value: Math.round(neuralActivity),
          label: 'Actividad Neural',
          color: '#8b5cf6',
          icon: Brain,
          x: 20,
          y: 30,
          connections: ['learning-progress', 'focus-level']
        },
        {
          id: 'learning-progress',
          type: 'progress',
          value: `${Math.round(65 + Math.sin(Date.now() / 3000) * 10)}%`,
          label: 'Progreso de Aprendizaje',
          color: '#06b6d4',
          icon: TrendingUp,
          x: 50,
          y: 20,
          connections: ['paes-score', 'study-efficiency']
        },
        {
          id: 'focus-level',
          type: 'metric',
          value: Math.round(75 + Math.cos(Date.now() / 2000) * 15),
          label: 'Nivel de Enfoque',
          color: '#10b981',
          icon: Target,
          x: 30,
          y: 60,
          connections: ['study-efficiency']
        },
        {
          id: 'paes-score',
          type: 'achievement',
          value: 685,
          label: 'Puntaje PAES',
          color: '#f59e0b',
          icon: Activity,
          x: 70,
          y: 40,
          connections: ['prediction']
        },
        {
          id: 'study-efficiency',
          type: 'metric',
          value: `${Math.round(80 + Math.sin(Date.now() / 4000) * 12)}%`,
          label: 'Eficiencia de Estudio',
          color: '#ef4444',
          icon: Zap,
          x: 60,
          y: 70,
          connections: ['prediction']
        },
        {
          id: 'prediction',
          type: 'prediction',
          value: '+45pts',
          label: 'Proyección de Mejora',
          color: '#8b5cf6',
          icon: BookOpen,
          x: 80,
          y: 60,
          connections: []
        }
      ];

      setDataNodes(nodes);
    };

    generateDataNodes();
    const interval = setInterval(generateDataNodes, 2000);
    return () => clearInterval(interval);
  }, [neuralActivity]);

  const renderConnections = () => {
    return dataNodes.map(node => 
      node.connections.map(targetId => {
        const targetNode = dataNodes.find(n => n.id === targetId);
        if (!targetNode) return null;

        return (
          <motion.line
            key={`${node.id}-${targetId}`}
            x1={`${node.x}%`}
            y1={`${node.y}%`}
            x2={`${targetNode.x}%`}
            y2={`${targetNode.y}%`}
            stroke="url(#dataFlowGradient)"
            strokeWidth="2"
            strokeDasharray="5,5"
            initial={{ pathLength: 0, opacity: 0 }}
            animate={{ 
              pathLength: 1, 
              opacity: [0.3, 0.8, 0.3],
              strokeDashoffset: [0, -10]
            }}
            transition={{
              pathLength: { duration: 1.5, ease: "easeInOut" },
              opacity: { duration: 2, repeat: Infinity },
              strokeDashoffset: { duration: 1, repeat: Infinity, ease: "linear" }
            }}
          />
        );
      })
    ).flat().filter(Boolean);
  };

  return (
    <div className="holographic-data-flow fixed inset-0 pointer-events-none z-10">
      {/* Data Flow Visualization */}
      <svg className="absolute inset-0 w-full h-full">
        <defs>
          <linearGradient id="dataFlowGradient" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#8b5cf6" stopOpacity="0.8" />
            <stop offset="50%" stopColor="#06b6d4" stopOpacity="1" />
            <stop offset="100%" stopColor="#10b981" stopOpacity="0.8" />
          </linearGradient>
          
          <filter id="holographicGlow">
            <feGaussianBlur stdDeviation="3" result="coloredBlur"/>
            <feMerge> 
              <feMergeNode in="coloredBlur"/>
              <feMergeNode in="SourceGraphic"/>
            </feMerge>
          </filter>
        </defs>
        
        {/* Render Connections */}
        {renderConnections()}
      </svg>

      {/* Data Nodes */}
      <div className="absolute inset-0">
        {dataNodes.map((node, index) => (
          <motion.div
            key={node.id}
            className="absolute pointer-events-auto"
            style={{
              left: `${node.x}%`,
              top: `${node.y}%`,
              transform: 'translate(-50%, -50%)'
            }}
            initial={{ opacity: 0, scale: 0 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: index * 0.2, duration: 0.8 }}
            whileHover={{ scale: 1.2, z: 10 }}
          >
            <div className="data-node relative">
              {/* Node Background */}
              <motion.div
                className="absolute inset-0 rounded-full"
                style={{ backgroundColor: node.color }}
                animate={{
                  scale: [1, 1.2, 1],
                  opacity: [0.2, 0.4, 0.2]
                }}
                transition={{
                  duration: 3,
                  repeat: Infinity,
                  ease: "easeInOut"
                }}
              />
              
              {/* Node Content */}
              <div 
                className="relative bg-black/80 backdrop-blur-md rounded-xl border border-white/20 p-3 min-w-[120px]"
                style={{ 
                  boxShadow: `0 0 20px ${node.color}40`,
                  borderColor: `${node.color}40`
                }}
              >
                <div className="flex items-center gap-2 mb-2">
                  <div 
                    className="p-1.5 rounded-lg"
                    style={{ backgroundColor: `${node.color}20` }}
                  >
                    <node.icon 
                      className="w-4 h-4" 
                      style={{ color: node.color }}
                    />
                  </div>
                  <span className="text-white font-bold text-sm">{node.value}</span>
                </div>
                
                <div className="text-white/70 text-xs">{node.label}</div>
                
                {/* Holographic Effect */}
                <motion.div
                  className="absolute inset-0 rounded-xl"
                  style={{
                    background: `linear-gradient(45deg, transparent, ${node.color}20, transparent)`
                  }}
                  animate={{
                    x: [-20, 20, -20]
                  }}
                  transition={{
                    duration: 3,
                    repeat: Infinity,
                    ease: "easeInOut"
                  }}
                />
              </div>

              {/* Data Particles */}
              <div className="absolute inset-0">
                {Array.from({ length: 3 }).map((_, i) => (
                  <motion.div
                    key={i}
                    className="absolute w-1 h-1 rounded-full"
                    style={{ backgroundColor: node.color }}
                    animate={{
                      x: [0, Math.random() * 40 - 20],
                      y: [0, Math.random() * 40 - 20],
                      opacity: [0, 1, 0],
                      scale: [0.5, 1, 0.5]
                    }}
                    transition={{
                      duration: 2 + Math.random() * 2,
                      repeat: Infinity,
                      delay: i * 0.5
                    }}
                  />
                ))}
              </div>
            </div>
          </motion.div>
        ))}
      </div>

      {/* Ambient Data Streams */}
      <div className="absolute inset-0">
        {Array.from({ length: 20 }).map((_, i) => (
          <motion.div
            key={i}
            className="absolute w-0.5 h-8 bg-gradient-to-b from-cyan-400 to-transparent"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`
            }}
            animate={{
              y: [0, -100],
              opacity: [0, 0.8, 0]
            }}
            transition={{
              duration: 3 + Math.random() * 2,
              repeat: Infinity,
              delay: Math.random() * 3
            }}
          />
        ))}
      </div>
    </div>
  );
};
