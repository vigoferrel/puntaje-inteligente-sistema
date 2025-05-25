
import React, { useRef, useMemo } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { OrbitControls, Text, Sphere, Line } from '@react-three/drei';
import { motion } from 'framer-motion';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Network, Zap, Target, Eye } from 'lucide-react';
import * as THREE from 'three';

interface SuperPAESSkillMap3DProps {
  competencias: any[];
  analisis: any;
}

// Componente de nodo 3D para competencias
const CompetencyNode: React.FC<{
  position: [number, number, number];
  competencia: any;
  onClick: () => void;
}> = ({ position, competencia, onClick }) => {
  const meshRef = useRef<THREE.Mesh>(null);
  const [hovered, setHovered] = React.useState(false);

  useFrame((state) => {
    if (meshRef.current) {
      meshRef.current.rotation.x = Math.sin(state.clock.elapsedTime) * 0.1;
      meshRef.current.rotation.y += 0.005;
      
      if (hovered) {
        meshRef.current.scale.setScalar(1.2);
      } else {
        meshRef.current.scale.setScalar(1);
      }
    }
  });

  const color = useMemo(() => {
    const nivelColors = {
      'sobresaliente': '#10B981',
      'alto': '#3B82F6',
      'medio': '#F59E0B',
      'bajo': '#EF4444'
    };
    return nivelColors[competencia.nivel as keyof typeof nivelColors] || '#6B7280';
  }, [competencia.nivel]);

  const size = useMemo(() => {
    const nivelSizes = {
      'sobresaliente': 1.5,
      'alto': 1.2,
      'medio': 1.0,
      'bajo': 0.8
    };
    return nivelSizes[competencia.nivel as keyof typeof nivelSizes] || 1.0;
  }, [competencia.nivel]);

  return (
    <group position={position}>
      <Sphere
        ref={meshRef}
        args={[size, 32, 32]}
        onClick={onClick}
        onPointerOver={() => setHovered(true)}
        onPointerOut={() => setHovered(false)}
      >
        <meshStandardMaterial 
          color={color}
          emissive={color}
          emissiveIntensity={hovered ? 0.3 : 0.1}
          transparent
          opacity={0.8}
        />
      </Sphere>
      
      <Text
        position={[0, size + 0.5, 0]}
        fontSize={0.3}
        color="white"
        anchorX="center"
        anchorY="middle"
      >
        {competencia.nombre}
      </Text>
      
      <Text
        position={[0, size + 0.2, 0]}
        fontSize={0.2}
        color="#94A3B8"
        anchorX="center"
        anchorY="middle"
      >
        {competencia.puntaje}pts
      </Text>
    </group>
  );
};

// Conexiones entre competencias
const CompetencyConnections: React.FC<{ competencias: any[] }> = ({ competencias }) => {
  const connections = useMemo(() => {
    const lines = [];
    for (let i = 0; i < competencias.length; i++) {
      for (let j = i + 1; j < competencias.length; j++) {
        const comp1 = competencias[i];
        const comp2 = competencias[j];
        
        // Crear conexiones basadas en similaridad
        const similarity = calculateSimilarity(comp1, comp2);
        if (similarity > 0.3) {
          lines.push({
            start: getPosition(i, competencias.length),
            end: getPosition(j, competencias.length),
            strength: similarity
          });
        }
      }
    }
    return lines;
  }, [competencias]);

  return (
    <>
      {connections.map((connection, index) => (
        <Line
          key={index}
          points={[connection.start, connection.end]}
          color="#6366F1"
          opacity={connection.strength * 0.5}
          lineWidth={connection.strength * 3}
        />
      ))}
    </>
  );
};

// Funciones auxiliares
const getPosition = (index: number, total: number): [number, number, number] => {
  const radius = 5;
  const angle = (index / total) * Math.PI * 2;
  const height = (Math.sin(angle * 3) * 2);
  
  return [
    Math.cos(angle) * radius,
    height,
    Math.sin(angle) * radius
  ];
};

const calculateSimilarity = (comp1: any, comp2: any): number => {
  // Algoritmo simple de similaridad basado en nodos soporte
  const nodos1 = new Set(comp1.nodosSoporte || []);
  const nodos2 = new Set(comp2.nodosSoporte || []);
  
  const intersection = new Set([...nodos1].filter(x => nodos2.has(x)));
  const union = new Set([...nodos1, ...nodos2]);
  
  return union.size > 0 ? intersection.size / union.size : 0;
};

export const SuperPAESSkillMap3D: React.FC<SuperPAESSkillMap3DProps> = ({
  competencias,
  analisis
}) => {
  const [selectedCompetencia, setSelectedCompetencia] = React.useState<any>(null);
  const [viewMode, setViewMode] = React.useState<'network' | 'hierarchy' | 'clusters'>('network');

  const competenciasConPosicion = useMemo(() => {
    return competencias.map((comp, index) => ({
      ...comp,
      position: getPosition(index, competencias.length)
    }));
  }, [competencias]);

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 h-screen">
      {/* Mapa 3D Principal */}
      <div className="lg:col-span-2">
        <motion.div
          className="h-full bg-gradient-to-br from-slate-900 to-slate-800 rounded-2xl overflow-hidden border border-slate-700"
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.8 }}
        >
          <div className="h-full relative">
            {/* Controles de Vista */}
            <div className="absolute top-4 left-4 z-10 flex space-x-2">
              {[
                { mode: 'network', icon: Network, label: 'Red' },
                { mode: 'hierarchy', icon: Target, label: 'Jerarquía' },
                { mode: 'clusters', icon: Eye, label: 'Clusters' }
              ].map(({ mode, icon: Icon, label }) => (
                <Button
                  key={mode}
                  variant={viewMode === mode ? "default" : "outline"}
                  size="sm"
                  onClick={() => setViewMode(mode as any)}
                  className="backdrop-blur-xl bg-black/20 border-white/20 text-white"
                >
                  <Icon className="w-4 h-4 mr-1" />
                  {label}
                </Button>
              ))}
            </div>

            {/* Información del Nodo Seleccionado */}
            {selectedCompetencia && (
              <motion.div
                className="absolute top-4 right-4 z-10 bg-black/80 backdrop-blur-xl rounded-lg p-4 max-w-xs"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
              >
                <h3 className="text-white font-bold">{selectedCompetencia.nombre}</h3>
                <p className="text-gray-300 text-sm mt-1">{selectedCompetencia.descripcion}</p>
                <div className="mt-2">
                  <Badge 
                    className="mr-2"
                    style={{ backgroundColor: selectedCompetencia.colorVisualizacion }}
                  >
                    {selectedCompetencia.nivel}
                  </Badge>
                  <Badge variant="outline" className="text-white border-white/30">
                    {selectedCompetencia.puntaje} pts
                  </Badge>
                </div>
                <Button 
                  size="sm" 
                  className="w-full mt-3"
                  onClick={() => setSelectedCompetencia(null)}
                >
                  Cerrar
                </Button>
              </motion.div>
            )}

            {/* Canvas 3D */}
            <Canvas
              camera={{ position: [0, 5, 15], fov: 60 }}
              style={{ background: 'linear-gradient(135deg, #1e293b 0%, #334155 100%)' }}
            >
              <ambientLight intensity={0.4} />
              <pointLight position={[10, 10, 10]} intensity={1} />
              <pointLight position={[-10, -10, -10]} intensity={0.5} color="#6366F1" />
              
              {/* Estrellas de fondo */}
              <mesh>
                <sphereGeometry args={[100, 32, 32]} />
                <meshBasicMaterial 
                  color="#000011" 
                  side={THREE.BackSide}
                  transparent
                  opacity={0.3}
                />
              </mesh>

              {/* Nodos de Competencias */}
              {competenciasConPosicion.map((competencia, index) => (
                <CompetencyNode
                  key={competencia.nombre}
                  position={competencia.position}
                  competencia={competencia}
                  onClick={() => setSelectedCompetencia(competencia)}
                />
              ))}

              {/* Conexiones entre competencias */}
              {viewMode === 'network' && (
                <CompetencyConnections competencias={competenciasConPosicion} />
              )}

              <OrbitControls 
                enablePan={true}
                enableZoom={true}
                enableRotate={true}
                minDistance={5}
                maxDistance={25}
                autoRotate={true}
                autoRotateSpeed={0.5}
              />
            </Canvas>
          </div>
        </motion.div>
      </div>

      {/* Panel de Información */}
      <div className="space-y-6">
        {/* Resumen de Competencias */}
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.2 }}
        >
          <Card className="bg-gradient-to-br from-purple-600/20 to-blue-600/20 backdrop-blur-xl border-purple-300/30">
            <CardHeader>
              <CardTitle className="text-white flex items-center gap-2">
                <Zap className="w-5 h-5 text-purple-400" />
                Mapa de Competencias
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {competencias.map((comp, index) => (
                  <motion.div
                    key={comp.nombre}
                    className="flex items-center justify-between p-2 rounded-lg bg-white/10 cursor-pointer hover:bg-white/20 transition-colors"
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.1 * index }}
                    onClick={() => setSelectedCompetencia(comp)}
                  >
                    <div className="flex items-center gap-3">
                      <div 
                        className="w-3 h-3 rounded-full"
                        style={{ backgroundColor: comp.colorVisualizacion }}
                      />
                      <div>
                        <div className="text-white text-sm font-medium">{comp.nombre}</div>
                        <div className="text-purple-200 text-xs">{comp.nivel}</div>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="text-yellow-400 font-bold text-sm">{comp.puntaje}</div>
                      <div className="text-purple-200 text-xs">pts</div>
                    </div>
                  </motion.div>
                ))}
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Leyenda del Mapa */}
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.3 }}
        >
          <Card className="bg-gradient-to-br from-blue-600/20 to-indigo-600/20 backdrop-blur-xl border-blue-300/30">
            <CardHeader>
              <CardTitle className="text-white text-lg">Leyenda</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                {[
                  { nivel: 'Sobresaliente', color: '#10B981', descripcion: 'Dominio excepcional' },
                  { nivel: 'Alto', color: '#3B82F6', descripcion: 'Buen desarrollo' },
                  { nivel: 'Medio', color: '#F59E0B', descripcion: 'En progreso' },
                  { nivel: 'Bajo', color: '#EF4444', descripcion: 'Requiere atención' }
                ].map(({ nivel, color, descripcion }) => (
                  <div key={nivel} className="flex items-center gap-3">
                    <div className="w-4 h-4 rounded-full" style={{ backgroundColor: color }} />
                    <div>
                      <div className="text-white text-sm font-medium">{nivel}</div>
                      <div className="text-blue-200 text-xs">{descripcion}</div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Instrucciones */}
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.4 }}
        >
          <Card className="bg-gradient-to-br from-indigo-600/20 to-purple-600/20 backdrop-blur-xl border-indigo-300/30">
            <CardHeader>
              <CardTitle className="text-white text-lg">Controles</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-indigo-200 text-sm space-y-1">
                <p>• <strong>Click:</strong> Seleccionar competencia</p>
                <p>• <strong>Arrastrar:</strong> Rotar vista</p>
                <p>• <strong>Scroll:</strong> Zoom in/out</p>
                <p>• <strong>Auto-rotación:</strong> Habilitada</p>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </div>
  );
};
