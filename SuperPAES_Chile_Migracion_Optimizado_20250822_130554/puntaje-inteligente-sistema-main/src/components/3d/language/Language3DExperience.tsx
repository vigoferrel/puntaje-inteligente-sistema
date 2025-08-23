import React from 'react';
import { Canvas } from '@react-three/fiber';

const Language3DExperience: React.FC = () => {
  return (
    <Canvas>
      {/* Aquí se agregarán modelos y ejercicios de lenguaje 3D */}
      <ambientLight intensity={0.5} />
      <pointLight position={[10, 10, 10]} />
    </Canvas>
  );
};

export default Language3DExperience;