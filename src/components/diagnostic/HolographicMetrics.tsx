
import React, { useState, useEffect, useMemo } from 'react';
import { motion } from 'framer-motion';
import { Canvas } from '@react-three/fiber';
import { OrbitControls, Text, Sphere, Ring, Box } from '@react-three/drei';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { 
  Eye, 
  Cpu, 
  Activity, 
  Zap, 
  Brain,
  Target,
  TrendingUp,
  Shield
} from 'lucide-react';
import * as THREE from 'three';

interface HolographicMetricsProps {
  data: any;
  systemMetrics: any;
  onExitMatrix: () => void;
}

// Fixed 3D Data Visualization component with proper Vector3 types
const DataVisualization3D: React.FC<{ metrics: any }> = ({ metrics }) => {
  const dataPoints = useMemo(() => {
    if (!metrics) return [];
    
    return [
      { position: [0, 2, 0] as const, value: metrics.overallProgress, color: '#3B82F6', label: 'Progreso' },
      { position: [2, 0, 2] as const, value: metrics.completedNodes, color: '#10B981', label: 'Nodos' },
      { position: [-2, 0, 2] as const, value: metrics.aiPrediction, color: '#8B5CF6', label: 'IA' },
      { position: [0, -2, 0] as const, value: metrics.totalNodes, color: '#F59E0B', label: 'Total' },
      { position: [2, 0, -2] as const, value: 75, color: '#EF4444', label: 'Eficiencia' },
      { position: [-2, 0, -2] as const, value: 88, color: '#06B6D4', label: 'Velocidad' }
    ];
  }, [metrics]);

  return (
    <group>
      {/* Central sphere */}
      <Sphere args={[0.5]} position={[0, 0, 0]}>
        <meshStandardMaterial color="#3B82F6" emissive="#1E40AF" emissiveIntensity={0.3} />
      </Sphere>

      {/* Orbital rings */}
      {[1, 2, 3].map((radius) => (
        <group key={radius} rotation={[0, 0, Math.PI / 4]}>
          <Ring args={[radius, radius + 0.1, 32]} rotation={[Math.PI / 2, 0, 0]}>
            <meshBasicMaterial color="#8B5CF6" transparent opacity={0.3} />
          </Ring>
        </group>
      ))}

      {/* Data points */}
      {dataPoints.map((point, index) => (
        <group key={index} position={point.position}>
          <Sphere args={[0.2]}>
            <meshStandardMaterial 
              color={point.color} 
              emissive={point.color} 
              emissiveIntensity={0.5}
            />
          </Sphere>
          
          <Text
            position={[0, 0.5, 0]}
            fontSize={0.3}
            color="white"
            anchorX="center"
            anchorY="middle"
          >
            {point.label}
          </Text>
          
          <Text
            position={[0, -0.5, 0]}
            fontSize={0.4}
            color={point.color}
            anchorX="center"
            anchorY="middle"
          >
            {point.value}
          </Text>
        </group>
      ))}

      {/* Connections between points with proper Vector3 handling */}
      {dataPoints.map((point, index) => {
        const nextPoint = dataPoints[(index + 1) % dataPoints.length];
        const start = new THREE.Vector3(...point.position);
        const end = new THREE.Vector3(...nextPoint.position);
        const mid = new THREE.Vector3().addVectors(start, end).multiplyScalar(0.5);
        
        const curve = new THREE.QuadraticBezierCurve3(start, mid, end);
        const points = curve.getPoints(20);
        const geometry = new THREE.BufferGeometry().setFromPoints(points);
        
        return (
          <primitive 
            key={`line-${index}`}
            object={new THREE.Line(geometry, new THREE.LineBasicMaterial({ 
              color: '#3B82F6', 
              transparent: true, 
              opacity: 0.4 
            }))} 
          />
        );
      })}
    </group>
  );
};

export const HolographicMetrics: React.FC<HolographicMetricsProps> = ({
  data,
  systemMetrics,
  onExitMatrix
}) => {
  const [matrixIntensity, setMatrixIntensity] = useState(100);
  const [scanMode, setScanMode] = useState<'overview' | 'deep' | 'prediction'>('overview');
  const [digitalRain, setDigitalRain] = useState<string[]>([]);

  // Generate digital rain
  useEffect(() => {
    const generateRain = () => {
      const chars = '01アカサタナハマヤラワガザダバパ数学科学歴史読解';
      const rain = Array.from({ length: 100 }, () => 
        chars[Math.floor(Math.random() * chars.length)]
      );
      setDigitalRain(rain);
    };

    const interval = setInterval(generateRain, 150);
    return () => clearInterval(interval);
  }, []);

  const matrixData = useMemo(() => {
    if (!data || !systemMetrics) return [];
    
    return [
      {
        category: 'SISTEMA_NEURAL',
        metrics: [
          { label: 'CPU_COGNITIVO', value: systemMetrics.overallProgress, unit: '%', status: 'ÓPTIMO' },
          { label: 'MEMORIA_ADAPTATIVA', value: systemMetrics.completedNodes, unit: 'NODOS', status: 'ACTIVO' },
          { label: 'PREDICCIÓN_IA', value: systemMetrics.aiPrediction, unit: 'SCORE', status: 'CALCULANDO' },
        ]
      },
      {
        category: 'RENDIMIENTO_PAES',
        metrics: [
          { label: 'ÁREA_FUERTE', value: systemMetrics.strongestArea?.prueba || 'N/A', unit: '', status: 'DOMINADA' },
          { label: 'ÁREA_DÉBIL', value: systemMetrics.weakestArea?.prueba || 'N/A', unit: '', status: 'ENFOQUE' },
          { label: 'PROGRESO_TOTAL', value: systemMetrics.totalNodes, unit: 'UNIDADES', status: 'CRECIENDO' },
        ]
      },
      {
        category: 'INTELIGENCIA_IA',
        metrics: [
          { label: 'LECTOGUÍA_STATUS', value: 'ONLINE', unit: '', status: 'CONECTADO' },
          { label: 'EJERCICIOS_GEN', value: '∞', unit: 'DISPONIBLES', status: 'ILIMITADO' },
          { label: 'ADAPTACIÓN', value: 98, unit: '%', status: 'SUPREMA' },
        ]
      }
    ];
  }, [data, systemMetrics]);

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="relative min-h-screen bg-black overflow-hidden"
    >
      {/* Matrix digital rain background */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        {digitalRain.map((char, i) => (
          <motion.div
            key={i}
            className="absolute text-green-400 font-mono text-sm"
            style={{
              left: `${(i % 20) * 5}%`,
              top: '-10px',
            }}
            animate={{
              y: typeof window !== 'undefined' ? window.innerHeight + 100 : 800,
              opacity: [0, 1, 1, 0],
            }}
            transition={{
              duration: 3 + Math.random() * 2,
              repeat: Infinity,
              delay: Math.random() * 5,
              ease: "linear"
            }}
          >
            {char}
          </motion.div>
        ))}
      </div>

      {/* Matrix Header */}
      <motion.div
        initial={{ y: -100 }}
        animate={{ y: 0 }}
        className="relative z-10 p-6"
      >
        <Card className="bg-black/80 backdrop-blur-sm border-green-400/50 shadow-[0_0_30px_rgba(34,197,94,0.3)]">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-4">
                <Eye className="w-8 h-8 text-green-400 animate-pulse" />
                <div>
                  <h1 className="text-2xl font-bold text-green-400 font-mono tracking-wider">
                    MODO MATRIX ACTIVADO
                  </h1>
                  <p className="text-green-300/80 font-mono text-sm">
                    &gt; Visualización holográfica de datos neurales
                  </p>
                </div>
              </div>
              
              <div className="flex items-center space-x-4">
                <Badge className="bg-green-600/20 text-green-400 border-green-400/50 font-mono">
                  INTENSIDAD: {matrixIntensity}%
                </Badge>
                <Button
                  variant="outline"
                  onClick={onExitMatrix}
                  className="border-green-400/50 text-green-400 hover:bg-green-400/10 font-mono"
                >
                  <Shield className="w-4 h-4 mr-2" />
                  SALIR_MATRIX
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      </motion.div>

      {/* Scan mode controls */}
      <div className="relative z-10 px-6 mb-6">
        <div className="flex justify-center space-x-4">
          {[
            { mode: 'overview', label: 'VISTA_GENERAL', icon: Activity },
            { mode: 'deep', label: 'ESCANEO_PROFUNDO', icon: Brain },
            { mode: 'prediction', label: 'PREDICCIÓN_IA', icon: Target }
          ].map(({ mode, label, icon: Icon }) => (
            <Button
              key={mode}
              variant={scanMode === mode ? "default" : "outline"}
              onClick={() => setScanMode(mode as any)}
              className={`font-mono ${
                scanMode === mode 
                  ? 'bg-green-600/30 border-green-400 text-green-300' 
                  : 'border-green-400/30 hover:bg-green-600/10 text-green-400'
              }`}
            >
              <Icon className="w-4 h-4 mr-2" />
              {label}
            </Button>
          ))}
        </div>
      </div>

      <div className="relative z-10 px-6">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          
          {/* 3D Visualization */}
          <Card className="bg-black/90 backdrop-blur-sm border-green-400/50 min-h-[500px]">
            <CardHeader>
              <CardTitle className="text-green-400 font-mono flex items-center">
                <Cpu className="w-5 h-5 mr-2" />
                HOLOGRAMA_DATOS_3D
              </CardTitle>
            </CardHeader>
            <CardContent className="h-[400px] p-0">
              <Canvas camera={{ position: [5, 5, 5], fov: 60 }}>
                <ambientLight intensity={0.3} />
                <pointLight position={[10, 10, 10]} intensity={1} color="#10B981" />
                <pointLight position={[-10, -10, -10]} intensity={0.5} color="#3B82F6" />
                
                <OrbitControls
                  enableZoom={true}
                  enablePan={true}
                  enableRotate={true}
                  autoRotate={true}
                  autoRotateSpeed={2}
                />
                
                <DataVisualization3D metrics={systemMetrics} />
              </Canvas>
            </CardContent>
          </Card>

          {/* Data matrix */}
          <Card className="bg-black/90 backdrop-blur-sm border-green-400/50">
            <CardHeader>
              <CardTitle className="text-green-400 font-mono flex items-center">
                <Activity className="w-5 h-5 mr-2" />
                MATRIZ_SISTEMA_NEURAL
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6 max-h-[400px] overflow-y-auto scrollbar-none">
              {matrixData.map((category, categoryIndex) => (
                <motion.div
                  key={category.category}
                  initial={{ opacity: 0, x: -50 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: categoryIndex * 0.2 }}
                  className="space-y-3"
                >
                  <h3 className="text-green-400 font-mono text-sm border-b border-green-400/30 pb-2">
                    &gt; {category.category}
                  </h3>
                  
                  {category.metrics.map((metric, metricIndex) => (
                    <motion.div
                      key={metric.label}
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{ delay: (categoryIndex * 0.2) + (metricIndex * 0.1) }}
                      className="flex items-center justify-between p-3 bg-gray-900/50 rounded border border-green-400/20"
                    >
                      <div className="flex items-center space-x-3">
                        <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
                        <span className="text-green-300 font-mono text-sm">
                          {metric.label}
                        </span>
                      </div>
                      
                      <div className="text-right">
                        <div className="text-green-400 font-mono font-bold">
                          {metric.value} {metric.unit}
                        </div>
                        <div className="text-green-500 font-mono text-xs">
                          {metric.status}
                        </div>
                      </div>
                    </motion.div>
                  ))}
                </motion.div>
              ))}
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Bottom controls */}
      <motion.div
        initial={{ y: 100 }}
        animate={{ y: 0 }}
        className="fixed bottom-6 left-6 right-6 z-20"
      >
        <Card className="bg-black/80 backdrop-blur-sm border-green-400/50">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-6 font-mono text-sm">
                <div className="flex items-center space-x-2">
                  <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
                  <span className="text-green-400">SISTEMA_ACTIVO</span>
                </div>
                <div className="text-green-300">
                  CPU: {systemMetrics?.overallProgress || 0}%
                </div>
                <div className="text-green-300">
                  MEMORIA: {systemMetrics?.completedNodes || 0}/{systemMetrics?.totalNodes || 0}
                </div>
                <div className="text-green-300">
                  IA_STATUS: SUPREMA
                </div>
              </div>
              
              <div className="flex items-center space-x-3">
                <Button
                  variant="outline"
                  size="sm"
                  className="border-green-400/50 text-green-400 hover:bg-green-400/10 font-mono"
                >
                  <TrendingUp className="w-4 h-4 mr-2" />
                  EXPORTAR_DATOS
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  className="border-green-400/50 text-green-400 hover:bg-green-400/10 font-mono"
                >
                  <Zap className="w-4 h-4 mr-2" />
                  DEEP_SCAN
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      </motion.div>
    </motion.div>
  );
};
