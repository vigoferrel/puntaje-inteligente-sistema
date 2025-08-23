import React from 'react';
import { Canvas } from '@react-three/fiber';

const Science3DExperience: React.FC = () => {
  return (
    <Canvas>
      {/* Aquí se agregarán simulaciones científicas 3D */}
      <ambientLight intensity={0.5} />
      <pointLight position={[10, 10, 10]} />
    </Canvas>
  );
};

export default Science3DExperience;