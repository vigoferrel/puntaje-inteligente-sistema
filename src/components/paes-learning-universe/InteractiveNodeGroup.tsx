
import React, { useRef, useMemo } from 'react';
import { useFrame } from '@react-three/fiber';
import { Text, Html } from '@react-three/drei';
import * as THREE from 'three';

interface ConstellationData {
  test: any;
  position: [number, number, number];
  nodes: any[];
  color: string;
  completionRate: number;
}

interface InteractiveNodeGroupProps {
  constellation: ConstellationData;
  viewMode: { mode: string; focus?: string };
  onNodeClick: (nodeId: string) => void;
  onConstellationClick: () => void;
  selectedNode: string | null;
}

export const InteractiveNodeGroup: React.FC<InteractiveNodeGroupProps> = ({
  constellation,
  viewMode,
  onNodeClick,
  onConstellationClick,
  selectedNode
}) => {
  const groupRef = useRef<THREE.Group>(null);
  const [hovered, setHovered] = React.useState<string | null>(null);

  // Animación suave de rotación
  useFrame((state) => {
    if (groupRef.current) {
      groupRef.current.rotation.y += 0.001;
      
      // Efecto de flotación
      const time = state.clock.getElapsedTime();
      groupRef.current.position.y = Math.sin(time * 0.5) * 0.2;
    }
  });

  const getNodeColor = (node: any) => {
    if (node.status === 'completed') return '#10B981'; // Verde
    if (node.status === 'in_progress') return '#F59E0B'; // Amarillo
    if (node.id === selectedNode) return '#EF4444'; // Rojo para seleccionado
    if (hovered === node.id) return '#8B5CF6'; // Púrpura para hover
    
    // Color por tier
    if (node.difficulty === 'advanced') return '#DC2626';
    if (node.difficulty === 'intermediate') return '#EA580C';
    return '#3B82F6'; // Azul por defecto
  };

  const getNodeSize = (node: any) => {
    let baseSize = 0.3;
    
    // Tamaño por importancia
    if (node.difficulty === 'advanced') baseSize *= 1.5;
    if (node.status === 'completed') baseSize *= 1.2;
    if (node.id === selectedNode) baseSize *= 1.8;
    if (hovered === node.id) baseSize *= 1.3;
    
    return baseSize;
  };

  // Partículas alrededor de nodos completados
  const ParticleSystem = ({ position }: { position: [number, number, number] }) => {
    const particlesRef = useRef<THREE.Points>(null);
    
    const particles = useMemo(() => {
      const count = 20;
      const positions = new Float32Array(count * 3);
      
      for (let i = 0; i < count; i++) {
        positions[i * 3] = (Math.random() - 0.5) * 2;
        positions[i * 3 + 1] = (Math.random() - 0.5) * 2;
        positions[i * 3 + 2] = (Math.random() - 0.5) * 2;
      }
      
      return positions;
    }, []);

    useFrame((state) => {
      if (particlesRef.current) {
        particlesRef.current.rotation.y += 0.01;
        const time = state.clock.getElapsedTime();
        const material = particlesRef.current.material as THREE.PointsMaterial;
        material.opacity = 0.3 + Math.sin(time * 2) * 0.1;
      }
    });

    return (
      <points ref={particlesRef} position={position}>
        <bufferGeometry>
          <bufferAttribute
            attach="attributes-position"
            count={particles.length / 3}
            array={particles}
            itemSize={3}
          />
        </bufferGeometry>
        <pointsMaterial color="#10B981" size={0.05} transparent opacity={0.3} />
      </points>
    );
  };

  return (
    <group ref={groupRef}>
      {/* Título de la Constelación */}
      <Text
        position={[constellation.position[0], constellation.position[1] + 5, constellation.position[2]]}
        fontSize={1}
        color={constellation.color}
        anchorX="center"
        anchorY="middle"
        onClick={onConstellationClick}
      >
        {constellation.test.name}
      </Text>

      {/* Anillo de la Constelación */}
      <mesh position={constellation.position}>
        <ringGeometry args={[4, 4.2, 32]} />
        <meshBasicMaterial 
          color={constellation.color} 
          transparent 
          opacity={0.2}
          side={THREE.DoubleSide}
        />
      </mesh>

      {/* Indicador de Progreso de la Constelación */}
      <mesh position={[constellation.position[0], constellation.position[1] - 0.5, constellation.position[2]]}>
        <ringGeometry args={[3.5, 4, 32, 1, 0, Math.PI * 2 * constellation.completionRate]} />
        <meshBasicMaterial 
          color={constellation.color} 
          transparent 
          opacity={0.6}
          side={THREE.DoubleSide}
        />
      </mesh>

      {/* Nodos de Aprendizaje */}
      {constellation.nodes.map((node, index) => (
        <group key={node.id}>
          {/* Nodo Principal */}
          <mesh
            position={node.position}
            onClick={() => onNodeClick(node.id)}
            onPointerOver={() => setHovered(node.id)}
            onPointerOut={() => setHovered(null)}
            scale={[getNodeSize(node), getNodeSize(node), getNodeSize(node)]}
          >
            <sphereGeometry args={[1, 16, 16]} />
            <meshStandardMaterial 
              color={getNodeColor(node)}
              emissive={getNodeColor(node)}
              emissiveIntensity={node.id === selectedNode ? 0.3 : 0.1}
              transparent
              opacity={0.8}
            />
          </mesh>

          {/* Anillo de Progreso del Nodo */}
          {node.progress > 0 && (
            <mesh position={node.position} rotation={[Math.PI / 2, 0, 0]}>
              <ringGeometry args={[getNodeSize(node) * 1.2, getNodeSize(node) * 1.4, 16, 1, 0, Math.PI * 2 * (node.progress / 100)]} />
              <meshBasicMaterial color="#10B981" transparent opacity={0.8} />
            </mesh>
          )}

          {/* Partículas para nodos completados */}
          {node.status === 'completed' && (
            <ParticleSystem position={node.position} />
          )}

          {/* Conexiones entre nodos dependientes - CORREGIDAS */}
          {node.dependsOn && node.dependsOn.length > 0 && (
            node.dependsOn.map((depId: string) => {
              const depNode = constellation.nodes.find(n => n.id === depId);
              if (!depNode) return null;

              const geometry = new THREE.BufferGeometry();
              const positions = new Float32Array([
                ...node.position,
                ...depNode.position
              ]);
              geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));

              return (
                <primitive 
                  key={`${node.id}-${depId}`}
                  object={new THREE.Line(geometry, new THREE.LineBasicMaterial({ 
                    color: "#4B5563", 
                    transparent: true, 
                    opacity: 0.3 
                  }))}
                />
              );
            })
          )}

          {/* Tooltip del Nodo */}
          {hovered === node.id && (
            <Html position={[node.position[0], node.position[1] + 1, node.position[2]]}>
              <div className="bg-black/80 text-white p-3 rounded-lg border border-white/20 backdrop-blur-sm max-w-xs">
                <div className="font-bold text-sm mb-1">{node.title}</div>
                <div className="text-xs opacity-80 mb-2">{node.description?.slice(0, 100)}...</div>
                <div className="flex items-center justify-between text-xs">
                  <span className="bg-blue-600 px-2 py-1 rounded">{node.difficulty}</span>
                  <span>{node.progress || 0}% completado</span>
                </div>
              </div>
            </Html>
          )}
        </group>
      ))}
    </group>
  );
};
