
import React from 'react';
import { AppLayout } from '@/components/app-layout';
import { ExerciseGeneratorCore } from '@/components/exercise-generator/ExerciseGeneratorCore';

const Ejercicios: React.FC = () => {
  return (
    <AppLayout>
      <div className="min-h-screen bg-gradient-to-br from-gray-900 via-blue-900 to-gray-900 p-6">
        <ExerciseGeneratorCore />
      </div>
    </AppLayout>
  );
};

export default Ejercicios;
