
import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { TrendingUp, Activity, Zap, Target, Brain, BookOpen } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';

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
  const { user } = useAuth();
  const [dataNodes, setDataNodes] = useState<DataNode[]>([]);

  // Cargar métricas neurales reales
  const { data: realMetrics } = useQuery({
    queryKey: ['neural-metrics-flow', user?.id],
    queryFn: async () => {
      if (!user?.id) return null;
      
      const { data, error } = await supabase
        .from('neural_metrics')
        .select('*')
        .eq('user_id', user.id)
        .order('last_calculated_at', { ascending: false })
        .limit(10);

      if (error) return null;
      return data;
    },
    enabled: !!user?.id,
    refetchInterval: 30000 // Actualizar cada 30 segundos
  });

  // Cargar progreso real de nodos
  const { data: nodeProgress } = useQuery({
    queryKey: ['node-progress-flow', user?.id],
    queryFn: async () => {
      if (!user?.id) return [];
      
      const { data, error } = await supabase
        .from('user_node_progress')
        .select('*')
        .eq('user_id', user.id)
        .order('last_activity_at', { ascending: false })
        .limit(20);

      if (error) return [];
      return data || [];
    },
    enabled: !!user?.id
  });

  useEffect(() => {
    const generateRealDataNodes = () => {
      if (!realMetrics || !nodeProgress) return;

      // Calcular métricas reales
      const completedNodes = nodeProgress.filter(np => np.status === 'completed').length;
      const totalNodes = nodeProgress.length;
      const averageProgress = totalNodes > 0 ? Math.round((completedNodes / totalNodes) * 100) : 0;
      
      const averageScore = nodeProgress.length > 0 
        ? nodeProgress.reduce((sum, np) => sum + (np.last_performance_score || 0), 0) / nodeProgress.length
        : 0;

      const studyEfficiency = nodeProgress.length > 0
        ? nodeProgress.reduce((sum, np) => sum + (np.success_rate || 0), 0) / nodeProgress.length * 100
        : 0;

      // Obtener métricas neurales específicas
      const neuralEfficiency = realMetrics.find(m => m.dimension_id === 'neural_efficiency')?.current_value || neuralActivity;
      const focusLevel = realMetrics.find(m => m.dimension_id === 'focus_level')?.current_value || 75;
      
      // Predicción basada en tendencia real
      const recentPerformance = nodeProgress.slice(0, 5);
      const performanceTrend = recentPerformance.length > 1 
        ? recentPerformance[0]?.last_performance_score - recentPerformance[recentPerformance.length - 1]?.last_performance_score
        : 0;
      
      const prediction = performanceTrend > 0 ? `+${Math.round(performanceTrend * 100)}pts` : 'Estable';

      const nodes: DataNode[] = [
        {
          id: 'neural-activity',
          type: 'metric',
          value: Math.round(neuralEfficiency),
          label: 'Eficiencia Neural',
          color: '#8b5cf6',
          icon: Brain,
          x: 20,
          y: 30,
          connections: ['learning-progress', 'focus-level']
        },
        {
          id: 'learning-progress',
          type: 'progress',
          value: `${averageProgress}%`,
          label: 'Progreso Real',
          color: '#06b6d4',
          icon: TrendingUp,
          x: 50,
          y: 20,
          connections: ['paes-score', 'study-efficiency']
        },
        {
          id: 'focus-level',
          type: 'metric',
          value: Math.round(focusLevel),
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
          value: Math.round(150 + (averageScore * 700)),
          label: 'Puntaje Estimado',
          color: '#f59e0b',
          icon: Activity,
          x: 70,
          y: 40,
          connections: ['prediction']
        },
        {
          id: 'study-efficiency',
          type: 'metric',
          value: `${Math.round(studyEfficiency)}%`,
          label: 'Eficiencia Real',
          color: '#ef4444',
          icon: Zap,
          x: 60,
          y: 70,
          connections: ['prediction']
        },
        {
          id: 'prediction',
          type: 'prediction',
          value: prediction,
          label: 'Proyección Real',
          color: '#8b5cf6',
          icon: BookOpen,
          x: 80,
          y: 60,
          connections: []
        }
      ];

      setDataNodes(nodes);
    };

    generateRealDataNodes();
  }, [realMetrics, nodeProgress, neuralActivity]);

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

  // Si no hay datos reales disponibles, mostrar estado de carga
  if (!realMetrics || !nodeProgress) {
    return (
      <div className="holographic-data-flow fixed inset-0 pointer-events-none z-10 flex items-center justify-center">
        <div className="text-white/60 text-sm">Cargando datos reales...</div>
      </div>
    );
  }

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
        
        {renderConnections()}
      </svg>

      {/* Data Nodes con datos reales */}
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

              {/* Indicador de datos reales */}
              <div className="absolute -top-1 -right-1">
                <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse" title="Datos reales" />
              </div>
            </div>
          </motion.div>
        ))}
      </div>

      {/* Información de conexión a datos reales */}
      <div className="absolute bottom-4 left-4 text-xs text-white/50">
        <div className="flex items-center gap-2">
          <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse" />
          <span>Datos en tiempo real desde Supabase</span>
        </div>
      </div>
    </div>
  );
};
