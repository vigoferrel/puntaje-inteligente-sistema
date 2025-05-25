
import React from 'react';
import { EducationalUniverse } from '@/components/universe/EducationalUniverse';
import { NeuralCommandCenter } from '@/components/neural-command/NeuralCommandCenter';
import { useAuth } from '@/contexts/AuthContext';

const Index: React.FC = () => {
  const { user } = useAuth();

  // Mostrar directamente el Centro de Comando Neural sin delays adicionales
  return <NeuralCommandCenter />;
};

export default Index;
