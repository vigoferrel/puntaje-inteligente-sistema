/* eslint-disable react-refresh/only-export-components */

import React, { useMemo } from 'react';
import type { SafeString, SafeNumber, SafeBoolean, APIResponse, OperationResult } from '../types/core';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import { supabase } from '../../integrations/supabase/leonardo-auth-client';

interface LearningPathwayProps {
  constellations: unknown[];
  viewMode: { mode: string; focus?: string };
}

export const LearningPathway: React.FC<LearningPathwayProps> = ({
  constellations,
  viewMode
}) => {
  // Generar rutas de aprendizaje inteligentes
  const pathways = useMemo(() => {
    const routes = [];
    
    // Ruta de Competencia Lectora a Historia (comprensiÃ³n de textos)
    const clConstellation = constellations.find(c => c.test.code === 'COMPETENCIA_LECTORA');
    const histConstellation = constellations.find(c => c.test.code === 'HISTORIA');
    
    if (clConstellation && histConstellation) {
      routes.push({
        id: 'cl-historia',
        from: clConstellation.position,
        to: histConstellation.position,
        color: '#8B5CF6',
        strength: 0.8,
        label: 'ComprensiÃ³n â†’ AnÃ¡lisis HistÃ³rico'
      });
    }

    // Ruta de MatemÃ¡tica M1 a M2 (progresiÃ³n natural)
    const m1Constellation = constellations.find(c => c.test.code === 'MATEMATICA_1');
    const m2Constellation = constellations.find(c => c.test.code === 'MATEMATICA_2');
    
    if (m1Constellation && m2Constellation) {
      routes.push({
        id: 'm1-m2',
        from: m1Constellation.position,
        to: m2Constellation.position,
        color: '#10B981',
        strength: 0.9,
        label: 'MatemÃ¡tica BÃ¡sica â†’ Avanzada'
      });
    }

    // Ruta de MatemÃ¡tica M2 a Ciencias (modelamiento cientÃ­fico)
    if (m2Constellation) {
      const cienciasConstellation = constellations.find(c => c.test.code === 'CIENCIAS');
      if (cienciasConstellation) {
        routes.push({
          id: 'm2-ciencias',
          from: m2Constellation.position,
          to: cienciasConstellation.position,
          color: '#F59E0B',
          strength: 0.7,
          label: 'Modelamiento â†’ MÃ©todo CientÃ­fico'
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
            {/* LÃ­nea de la ruta - CORREGIDA */}
            <primitive object={new THREE.Line(geometry, new THREE.LineBasicMaterial({ 
              color: pathway.color, 
              transparent: true, 
              opacity: 0.6 
            }))} />

            {/* PartÃ­culas que se mueven por la ruta */}
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

// Componente para partÃ­culas que se mueven por la curva
const MovingParticles: React.FC<{
  curve: THREE.QuadraticBezierCurve3;
  color: string;
  count: number;
}> = ({ curve, color, count }) => {
  const particlesRef = React.useRef<THREE.Group>(null);

  useFrame(() => {
    if (particlesRef.current) {
      particlesRef.current.children.forEach((particle, index) => {
        const t = ((Date.now() * 0.001 + index * 0.2) % 1);
        const position = curve.getPoint(t);
        particle.position.copy(position);
      });
    }
  });

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


