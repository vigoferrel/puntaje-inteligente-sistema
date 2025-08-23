import React from 'react';
import { Canvas } from '@react-three/fiber';

const Math3DExperience: React.FC = () => {
  return (
    <Canvas>
      {/* Aquí se agregarán modelos y ejercicios matemáticos 3D */}
      <ambientLight intensity={0.5} />
      <pointLight position={[10, 10, 10]} />
    </Canvas>
  );
};

export default Math3DExperience;