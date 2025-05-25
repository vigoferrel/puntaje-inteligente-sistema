
import React, { useMemo } from 'react';
import * as THREE from 'three';

interface LearningPathwayProps {
  constellations: any[];
  viewMode: { mode: string; focus?: string };
}

export const LearningPathway: React.FC<LearningPathwayProps> = ({
  constellations,
  viewMode
}) => {
  // Generar rutas de aprendizaje inteligentes
  const pathways = useMemo(() => {
    const routes = [];
    
    // Ruta de Competencia Lectora a Historia (comprensión de textos)
    const clConstellation = constellations.find(c => c.test.code === 'COMPETENCIA_LECTORA');
    const histConstellation = constellations.find(c => c.test.code === 'HISTORIA');
    
    if (clConstellation && histConstellation) {
      routes.push({
        id: 'cl-historia',
        from: clConstellation.position,
        to: histConstellation.position,
        color: '#8B5CF6',
        strength: 0.8,
        label: 'Comprensión → Análisis Histórico'
      });
    }

    // Ruta de Matemática M1 a M2 (progresión natural)
    const m1Constellation = constellations.find(c => c.test.code === 'MATEMATICA_1');
    const m2Constellation = constellations.find(c => c.test.code === 'MATEMATICA_2');
    
    if (m1Constellation && m2Constellation) {
      routes.push({
        id: 'm1-m2',
        from: m1Constellation.position,
        to: m2Constellation.position,
        color: '#10B981',
        strength: 0.9,
        label: 'Matemática Básica → Avanzada'
      });
    }

    // Ruta de Matemática M2 a Ciencias (modelamiento científico)
    if (m2Constellation) {
      const cienciasConstellation = constellations.find(c => c.test.code === 'CIENCIAS');
      if (cienciasConstellation) {
        routes.push({
          id: 'm2-ciencias',
          from: m2Constellation.position,
          to: cienciasConstellation.position,
          color: '#F59E0B',
          strength: 0.7,
          label: 'Modelamiento → Método Científico'
        });
      }
    }

    return routes;
  }, [constellations]);

  // Crear curvas suaves para las rutas
  const createCurve = (from: number[], to: number[]) => {
    const start = new THREE.Vector3(...from);
    const end = new THREE.Vector3(...to);
    const mid = new THREE.Vector3()
      .addVectors(start, end)
      .multiplyScalar(0.5)
      .add(new THREE.Vector3(0, 5, 0)); // Elevar el punto medio

    return new THREE.QuadraticBezierCurve3(start, mid, end);
  };

  return (
    <group>
      {pathways.map((pathway) => {
        const curve = createCurve(pathway.from, pathway.to);
        const points = curve.getPoints(50);
        const geometry = new THREE.BufferGeometry().setFromPoints(points);

        return (
          <group key={pathway.id}>
            {/* Línea de la ruta */}
            <line geometry={geometry}>
              <lineBasicMaterial 
                color={pathway.color} 
                transparent 
                opacity={0.6}
                linewidth={3}
              />
            </line>

            {/* Partículas que se mueven por la ruta */}
            <MovingParticles 
              curve={curve} 
              color={pathway.color}
              count={5}
            />

            {/* Etiqueta de la ruta */}
            <mesh position={[
              (pathway.from[0] + pathway.to[0]) / 2,
              (pathway.from[1] + pathway.to[1]) / 2 + 3,
              (pathway.from[2] + pathway.to[2]) / 2
            ]}>
              <planeGeometry args={[6, 1]} />
              <meshBasicMaterial 
                color={pathway.color} 
                transparent 
                opacity={0.8}
              />
            </mesh>
          </group>
        );
      })}
    </group>
  );
};

// Componente para partículas que se mueven por la curva
const MovingParticles: React.FC<{
  curve: THREE.QuadraticBezierCurve3;
  color: string;
  count: number;
}> = ({ curve, color, count }) => {
  const particlesRef = React.useRef<THREE.Group>(null);

  React.useEffect(() => {
    const interval = setInterval(() => {
      if (particlesRef.current) {
        particlesRef.current.children.forEach((particle, index) => {
          const t = ((Date.now() * 0.001 + index * 0.2) % 1);
          const position = curve.getPoint(t);
          particle.position.copy(position);
        });
      }
    }, 16);

    return () => clearInterval(interval);
  }, [curve]);

  return (
    <group ref={particlesRef}>
      {Array.from({ length: count }, (_, i) => (
        <mesh key={i}>
          <sphereGeometry args={[0.1, 8, 8]} />
          <meshBasicMaterial color={color} transparent opacity={0.8} />
        </mesh>
      ))}
    </group>
  );
};
